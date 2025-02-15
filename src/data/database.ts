import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import * as zlib from "zlib";

const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");

export default function Connect(database: string) {
  const databases: { [key: string]: any } = {};
  const databaseDir = path.resolve(__dirname, database);
  const schemasDir = path.join(databaseDir, "schemas");

  if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir);
    console.log(`Database directory created at: ${databaseDir}`);
  }

  if (!fs.existsSync(schemasDir)) {
    fs.mkdirSync(schemasDir);
    console.log(`Schemas directory created at: ${schemasDir}`);
  }

  fs.readdirSync(schemasDir).forEach((file) => {
    const tableName = path.basename(file, ".omedb");
    const encryptedData = fs.readFileSync(path.join(schemasDir, file));
    const tableData = decryptData(encryptedData);
    databases[tableName] = tableData;
  });

  const Query = (
    query: string,
    callback: (err: Error | any, result: any) => void
  ) => {
    const queryType = query.trim().split(" ")[0].toUpperCase();

    let result: any;

    try {
      switch (queryType) {
        case "NEW":
          result = handleCreateTable(query);
          callback(null, { message: "Table created successfully" });
          break;
        case "INSERT":
          result = handleInsertInto(query);
          callback(null, { message: "Data inserted successfully" });
          break;
        case "SELECT":
          result = handleSelect(query);
          callback(null, {
            message: "Data selected successfully",
            data: result,
          });
          break;
        case "DROP":
          handleDelete(query);
          callback(null, { message: "Data dropped successfully" });
          break;
        case "UPDATE":
          callback(new Error("UPDATE query not supported yet"), null);
          break;
        default:
          callback(new Error("Unknown query type"), null);
      }
    } catch (err) {
      callback(err, null);
    }
  };

  function handleCreateTable(query: string) {
    let match = query.match(/NEW TABLE (\w+) \((.+)\);?/s);
    if (!match) {
      match = query.match(/new table (\w+) \((.+)\);?/s);

      if (!match) throw new Error("Invalid CREATE TABLE syntax");
    }

    const [, tableName, columns] = match;
    if (databases[tableName]) {
      console.log(`Table ${tableName} already exists, skipping creation.`);
      return { tableName, columnsArray: databases[tableName].columns };
    }

    const columnsArray = columns.split(",").map((col) => {
      const [name, type, ...rest] = col.trim().split(/\s+/);
      const defaultValue = rest.join(" ").match(/DEFAULT (.+)/)?.[1];
      return { name, type, defaultValue };
    });

    databases[tableName] = { columns: columnsArray, rows: [] };

    const tableFile = path.join(schemasDir, `${tableName}.omedb`);
    const encryptedData = encryptData(databases[tableName]);
    fs.writeFileSync(tableFile, encryptedData);

    return { tableName, columnsArray };
  }

  function handleInsertInto(query: string) {
    let match = query.match(/INSERT INTO (\w+) \((.+)\) VALUES \((.+)\)/);
    if (!match) {
      match = query.match(/insert into (\w+) \((.+)\) values \((.+)\)/);
      if (!match) throw new Error("Invalid INSERT INTO syntax");
    }

    const [, tableName, columns, values] = match;
    const columnsArray = columns.split(",").map((col) => col.trim());
    const valuesArray = values
      .split(",")
      .map((val) => val.trim().replace(/['"]/g, ""));

    if (!databases[tableName])
      throw new Error(`Table ${tableName} does not exist`);

    const tableColumns = databases[tableName].columns.map(
      (col: any) => col.name
    );
    columnsArray.forEach((col) => {
      if (!tableColumns.includes(col)) {
        throw new Error(`Column ${col} does not exist in table ${tableName}`);
      }
    });

    const row: any = {};
    columnsArray.forEach((col, index) => {
      row[col] = valuesArray[index];
    });

    databases[tableName].columns.forEach((col: any) => {
      if (col.defaultValue && !row[col.name]) {
        switch (col.defaultValue) {
          case "CURRENT_TIMESTAMP":
            row[col.name] = new Date().toISOString();
            break;
          case "NULL":
            row[col.name] = null;
            break;
          case "UPDATE_TIMESTAMP":
            row[col.name] = new Date().toISOString();
            break;
          default:
            row[col.name] = col.defaultValue;
        }
      }
    });

    databases[tableName].rows.push(row);

    const tableFile = path.join(schemasDir, `${tableName}.omedb`);
    const encryptedData = encryptData(databases[tableName]);
    fs.writeFileSync(tableFile, encryptedData);

    return { tableName, row };
  }

  function handleSelect(query: string) {
    let match = query.match(/SELECT (.+) FROM (\w+)/);
    if (!match) {
      match = query.match(/select (.+) from (\w+)/);
      if (!match) throw new Error("Invalid SELECT syntax");
    }

    const [, columns, tableName] = match;
    const columnsArray = columns.split(",").map((col) => col.trim());
    if (!databases[tableName])
      throw new Error(`Table ${tableName} does not exist`);

    return databases[tableName].rows.map((row: any) => {
      let resultRow: any = {};
      columnsArray.forEach((col) => {
        if (col === "*") return (resultRow = row);

        resultRow[col] = row[col];
      });
      return resultRow;
    });
  }

  function handleDelete(query: string) {
    let match = query.match(/DROP (.+) FROM (\w+)/);
    if (!match) {
      match = query.match(/DROP (.+) from (\w+)/);
      if (!match) throw new Error("Invalid DELETE syntax");
    }

    const [, condition, tableName] = match;

    if (condition == "*") {
      databases[tableName].rows = [];
      const tableFile = path.join(schemasDir, `${tableName}.omedb`);
      const encryptedData = encryptData(databases[tableName]);
      fs.writeFileSync(tableFile, encryptedData);
      return;
    }

    const [column, value] = condition
      .split("=")
      .map((str) => str.trim().replace(/['"]/g, ""));

    if (!databases[tableName])
      throw new Error(`Table ${tableName} does not exist`);

    databases[tableName].rows = databases[tableName].rows.filter(
      (row: any) => row[column] !== value
    );

    const tableFile = path.join(schemasDir, `${tableName}.omedb`);
    const encryptedData = encryptData(databases[tableName]);
    fs.writeFileSync(tableFile, encryptedData);
  }

  function encryptData(data: any): Buffer {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);

    let encrypted = cipher.update(
      zlib.gzipSync(JSON.stringify(data)).toString("hex"),
      "hex",
      "hex"
    );
    encrypted += cipher.final("hex");

    const result = Buffer.concat([iv, Buffer.from(encrypted, "hex")]);
    return result;
  }

  function decryptData(data: Buffer): any {
    const iv = data.slice(0, 16);
    const encryptedData = data.slice(16);

    const decipher = crypto.createDecipheriv("aes-256-cbc", encryptionKey, iv);

    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return JSON.parse(zlib.gunzipSync(decrypted).toString("utf8"));
  }

  return { query: Query };
}
