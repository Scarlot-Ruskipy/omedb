import { config } from "dotenv";
config();

import server from "./web";
let debug = false;
let port = process.env.WWW_PORT || 4048;
(global as any).DEBUG = (message: any) => {};

const CommandArgs = process.argv.slice(2);

if (CommandArgs.includes("interface")) {
  server.listen(port, () => {
    console.log(`OmeDB interface has started on port ${port}`);
  });
} else if (CommandArgs.includes("debug")) {
  debug = true;

  (global as any).DEBUG = (message: any) => {
    if (debug) {
      console.log(message);
    }
  };
}

require("./transport");
