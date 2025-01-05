import server from "./web";
(global as any).DEBUG = false; // Preparing for the future debug update
let port = process.env.PORT || 4048;

const CommandArgs = process.argv.slice(2);
if (CommandArgs.includes("port")) {
  port = parseInt(CommandArgs[CommandArgs.indexOf("port") + 1]);
}

if (CommandArgs.includes("interface")) {
  server.listen(port, () => {
    console.log(`OmeDB interface has started on port ${port}`);
  });
} else if (CommandArgs.includes("debug")) {
  (global as any).DEBUG = true;
}

require("./data/environment");
require("./transport");
