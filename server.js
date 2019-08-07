const net = require("net");
const files = require("./bodytext.js");

const PORT = 8080;

const server = net.createServer(socket => {
  socket.on("data", chunk => {
    let arr = chunk.toString().split("\r\n");

    let requestObj = {};

    requestObj.URI = arr[0].split(" ");
    requestObj.host = arr[1].slice(arr[1].indexOf(":") + 2);
    requestObj.userAgent = arr[2].slice(arr[2].indexOf(" ") + 1);
    requestObj.accept = arr[3].slice(arr[3].indexOf(" ") + 1);
    requestObj.message = arr[arr.length - 1];

    let date = new Date();

    let requestedDoc = requestObj.URI[1];
    let message = "";

    let responseObj = {
      "Status Line": null,
      Server: "localhost:8080",
      Date: date.toUTCString(),
      "Content-type": "text/html",
      "Content-length": message.length,
      Connection: "keep-alive"
    };

    if (requestedDoc === "/" || requestedDoc === "/index.html") {
      message = files.index;
      responseObj["Status Line"] = ["HTTP/1.1", "200", "OK"];
    } else if (requestedDoc === "/helium.html") {
      message = files.helium;

      responseObj["Status Line"] = ["HTTP/1.1", "200", "OK"];
    } else if (requestedDoc === "/hydrogen.html") {
      message = files.hydrogen;

      responseObj["Status Line"] = ["HTTP/1.1", "200", "OK"];
    } else if (requestedDoc === "style.css") {
      message = files.style;

      responseObj["Status Line"] = ["HTTP/1.1", "200", "OK"];
      responseObj["Content-type"] = "text/css";
    } else {
      message = files.erro404;

      responseObj["Status Line"] = ["HTTP/1.0", "404", "Not Found"];
      responseObj["Content-type"] = "text/plain; charset=UTF-8";
    }

    responseObj["Content-length"] = message.length;

    let returnMsg =
      Object.entries(responseObj).reduce(function(accumulator, current) {
        return (accumulator += `${current[0]}: ${current[1]}\r\n`);
      }, `${responseObj["Status Line"].join(" ")}\r\n`) + `\r\n\r\n${message}`;

    socket.write(returnMsg);
    socket.end();
  });

  socket.on("end", () => {
    var msg = "connection ended";
    socket.write(msg);
  });

  socket.on("error", err => {
    // handle error in connection
  });
});

server.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
