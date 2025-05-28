require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn.js')
const fileUpload = require('express-fileupload')
const cors = require('cors');
const cloudinary = require('cloudinary')




app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }))

app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file limit
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use(cors({
  origin: '*', // or '*' for all, or use an array for multiple origins
}));
app.use(express.static(path.join(__dirname, "public")));



app.use('/listing', require('./routes/api/listing.js'))






const PORT = process.env.PORT || 3000;

const emailRouter = require("./routes/email");






app.use("/email", emailRouter);
app.use('/', require('./routes/root.js'))


connectDB();

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})





