import * as net from "net";
import connect from "../data/database";

let Databases: any = [];

const TCPServer = net.createServer();
let port = process.env.TCP_PORT || 4047;

function startServer(port: number | string): void {
  TCPServer.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  }).on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} is in use!`);
    } else {
      console.error(err);
    }
  });
}

TCPServer.on("error", (err: Error) => {
  console.error(err);
});

TCPServer.on("connection", (socket: net.Socket) => {
  const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;

  console.log(`New client connection from ${remoteAddress}`);

  socket.on("data", (data: Buffer) => {
    console.log(data.toString());
    try {
      const message = JSON.parse(data.toString());
      if (message.auth) {
        const { password, database } = message.auth;
        if (
          password === process.env.DB_PASSWORD
        ) {
          socket.write(
            JSON.stringify({
              connection: "success",
              auth: "complete",
            })
          );

          if (!database) {
            socket.write(
              JSON.stringify({
                connection: "error",
                message: "No database provided",
                auth: true,
              })
            );
            socket.end();
            return;
          }

          let db = connect(database);

          Databases.push({
            db: db,
            name: database,
          });
        } else {
          socket.write(
            JSON.stringify({
              connection: "failed",
              auth: false,
            })
          );
          socket.end();
        }
      }

      if (message.query) {
        let db = Databases.find((db: any) => db.name === message.database).db;

        if (!db) {
          socket.write(
            JSON.stringify({
              connection: "error",
              message: "Database not found",
            })
          );
          socket.end();
          return;
        }

        try {
          db.query(message.query, (err: Error | any, result: any) => {
            if (err) {
              console.error("Error executing query:", err);
              socket.write(
                JSON.stringify({
                  connection: "error",
                  message: "Error executing query",
                  error: err.toString(),
                })
              );
            } else {
              socket.write(
                JSON.stringify({
                  connection: "success",
                  query: message.query,
                  data: result,
                  auth: true,
                })
              );
            }
          });
        } catch (err: any) {
          console.error("Error executing query:", err);
          socket.write(
            JSON.stringify({
              connection: "error",
              message: "Error executing query",
              error: err.toString(),
            })
          );
        }
      }
    } catch (err) {
      console.error("Error parsing data:", err);
      socket.write(
        JSON.stringify({
          connection: "error",
          message: "Invalid data format",
          auth: true,
        })
      );
      socket.end();
    }
  });

  socket.on("error", (err: any) => {
    if (err.code === "ECONNRESET") {
      console.log(`Connection from ${remoteAddress} reset by peer`);
    } else {
      console.error("Socket error:", err);
    }
  });

  socket.on("close", () => {
    console.log(`Connection from ${remoteAddress} closed`);
  });

  socket.write(
    JSON.stringify({
      connection: "success",
      auth: "required",
    })
  );
});

startServer(port);
