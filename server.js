require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn.js')
const fileUpload = require('express-fileupload')
const cors = require('cors');


app.use(cors({
  origin: '*', // or '*' for all, or use an array for multiple origins
}));




const PORT = process.env.PORT || 3000;

const emailRouter = require("./routes/email");

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));


app.use("/email", emailRouter);
app.use('/', require('./routes/root.js'))
app.use('/listing', require('./routes/api/listing.js'))

connectDB();

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})





