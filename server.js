const express = require("express");
const app = express();
const path = require("path");

require("dotenv").config(); 

const emailRouter = require("./routes/email");

app.use(express.static(path.join(__dirname, "public")));

app.use("/email", emailRouter);
app.use('/', require('./routes/root.js'))




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


