import fs from "fs";
import HTTP from "http";
import path from "path";

export default function HomeEndPoint(
  req: HTTP.IncomingMessage,
  res: HTTP.ServerResponse<HTTP.IncomingMessage> & {
    req: HTTP.IncomingMessage;
  }
) {
  const FilePath = path.join(__dirname, "..", "html", "index.html");

  fs.access(FilePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found\n " + FilePath);
    } else {
      res.writeHead(200, {
        "Content-Type": "html",
        "Cache-Control": "no-cache, no-store, must-revalidate", // Disable caching
        Pragma: "no-cache",
        Expires: "0",
      });
      fs.createReadStream(FilePath).pipe(res);
    }
  });
}
