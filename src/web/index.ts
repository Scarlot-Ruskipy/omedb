import HTTP from "http";
import fs from "fs";
import path from "path";
import PublicEndPoint from "./endpoints/public";
import HomeEndPoint from "./endpoints/home";

const server = HTTP.createServer((req, res) => {
  const { url, method } = req;

  if (url?.startsWith("/public") && method === "GET") {
    PublicEndPoint(req, res);

    return;
  }

  if (url === "/" && method === "GET") {
    HomeEndPoint(req, res);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 Not Found\n");
});

export default server;
