const net = require("net");
const files = require("./bodytext.js");

const PORT = 8080;

const server = net.createServer(socket => {
  socket.on("data", chunk => {
    let arr = chunk.toString().split("\r\n");

    let requestObj = {};

    arr
      .filter(function(element) {
        return element.length !== 0;
      })
      .forEach(function(element) {
        if (element.indexOf(":") !== -1) {
          let splitElement = element.split(":");
          requestObj[splitElement[0]] = splitElement[1];
        } else {
          let splitElement = element.split(" ");
          requestObj.URI = splitElement;
        }
      });

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
      message = files.error404;

      responseObj["Status Line"] = ["HTTP/1.0", "404", "Not Found"];
      responseObj["Content-type"] = "text/plain; charset=UTF-8";
    }

    responseObj["Content-length"] = message.length;

    let returnMsg = Object.entries(responseObj).reduce(function(
      accumulator,
      current
    ) {
      return (accumulator += `${current[0]}: ${current[1]}\r\n`);
    },
    `${responseObj["Status Line"].join(" ")}\r\n`);

    returnMsg += `\r\n\r\n${message}`;

    socket.write(returnMsg, "utf8");
    socket.end();
  });

  socket.on("end", () => {
    var msg = "connection ended";
    console.log("------------------------");
    console.log("Message: " + "", msg);
    console.log("------------------------");
    // socket.write(msg, "utf8");
  });

  socket.on("error", err => {
    console.log("------------------------");
    console.log("ERROR" + "", err);
    console.log("------------------------");
  });
});

server.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
