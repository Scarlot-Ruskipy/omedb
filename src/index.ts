require("./data/environment");
require("./transport");

import server from "./web";

server.listen(process.env.PORT, () => {
  console.log(`OmeDB interface has started on port ${process.env.PORT}`);
});