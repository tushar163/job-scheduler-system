const express = require("express");
const cors = require("cors");

// Import routes
const jobRoutes = require("./src/routes/JobRoute");

const app = express();
const PORT = process.env.PORT || 4000;
const bodyParser = require("body-parser");
const http = require("http");
const server = http.createServer(app);
app.use(cors());
app.use(bodyParser.json());

// Use job routes
app.use("/api/v1/jobs", jobRoutes);



server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


