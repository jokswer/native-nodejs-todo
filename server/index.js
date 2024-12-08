import http from "node:http";

import { router } from "./route.js";
import { Cookie } from "./cookie.js";
import { REQUEST_PARSED, RequestData } from "./requestData.js";

const PORT = 8080;
const HOST = "127.0.0.1";

const server = http.createServer((req, res) => {
  const cookie = new Cookie(req);
  const requestData = new RequestData(cookie, req);

  if (cookie.preparedCookie.length && !res.headersSent) {
    res.setHeader("Set-Cookie", cookie.preparedCookie);
  }

  requestData.once(REQUEST_PARSED, (data) => {
    res.setHeader("Content-Type", "application/json");
    const response = router(data);
    res.end(response);
  });
});

server.listen(PORT, HOST, () =>
  console.log(`Server running at http://${HOST}:${PORT}`)
);

server.on("error", (err) => console.error(err));

server.on("clientError", (err, socket) => {
  console.error(err.message);
  socket.end(err.message);
});
