const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("node:path");

const app = express();

app.use(helmet({
    contentSecurityPolicy: "default-src 'self'"
}))
app.use(cors({
    origin: "*"
}))

app.use(express.static(path.join(path.dirname(__dirname), "client", "dist")))

app.listen(process.env.PORT || 3000)