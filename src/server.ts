const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);

  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Home Page");
  }

  else if (req.url === "/user" && req.method === "POST") {
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User Created" }));
  }

  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, () => console.log("Server running"));
