const net = require("net");
const files = require("./bodytext.js");

const PORT = 8080;

const server = net.createServer(socket => {
  socket.on("data", chunk => {
    // read incoming data
    console.log("data");
    console.log(chunk.toString());

    // parse the string
    let arr = chunk.toString().split("\r\n");

    let requestObj = {};

    requestObj.URI = arr[0].split(" ");
    requestObj.host = arr[1].slice(arr[1].indexOf(":") + 2);
    requestObj.userAgent = arr[2].slice(arr[2].indexOf(" ") + 1);
    requestObj.accept = arr[3].slice(arr[3].indexOf(" ") + 1);
    requestObj.message = arr[arr.length - 1];

    console.log(requestObj);

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

    // grab the right file
    if (requestedDoc === "/" || requestdDoc === "/index.html") {
      message = files.index;
      responseObj["Status Line"] = ["HTTP/1.1", "200", "OK"];
    } else if (requestedDoc === "/helium") {
      message = files.helium;

      responseObj["Status Line"] = ["HTTP/1.1", "200", "OK"];
    } else if (requestedDoc === "/hydrogen") {
      message = files.hydrogen;

      responseObj["Status Line"] = ["HTTP/1.1", "200", "OK"];
    } else if (requestedDoc === "style") {
      message = files.style;

      responseObj["Status Line"] = ["HTTP/1.1", "200", "OK"];
      responseObj["Content-type"] = "text/css";
    } else {
      message = files.erro404;

      responseObj["Status Line"] = ["HTTP/1.0", "404", "Not Found"];
      responseObj["Content-type"] = "text/plain; charset=UTF-8";
    }

    console.log(responseObj);

    let returnMsg =
      responseObj.entries().reduce(function(accumulator, current) {
        return (accumulator += `${current[0]}: ${current[1]}\r\n`);
      }, `${responseObj[0].join(" ")}\r\n`) + `\r\n\r\n${message.toString()}`;

    // write outgoing data
    socket.write();
    socket.end();
  });

  socket.on("end", () => {
    // handle client disconnect
  });

  socket.on("error", err => {
    // handle error in connection
  });
});

server.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
