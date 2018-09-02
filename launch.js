const express = require("express")
const http = require("http")

const app = express()
app.use(express.static("./build"))
const server = http.createServer(app)

server.listen(3001, "localhost", () => console.log("Listening!"))
