require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn.js");
const fileUpload = require("express-fileupload");
const cookieParser = require('cookie-parser')


const cloudinary = require("cloudinary");

const webhookRoute = require('./routes/stripeWebhooks.js');
app.use('/stripe', webhookRoute);

app.use(cookieParser())

app.use(express.json());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(express.static(path.join(__dirname, "public")));

app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file limit
  })
);

const corsOptions = {
  origin: ["http://localhost:3000", "https://upstatekosherrentals.com", "https://www.upstatekosherrentals.com"   ],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions)); 


app.use(express.urlencoded({ limit: "10mb", extended: true }));




app.use('/api/admin', require('./routes/api/admin.js'))
app.use('/register', require('./routes/register.js'))
app.use('/refresh', require('./routes/refresh.js'))
app.use('/auth', require('./routes/auth.js'))
app.use("/listing", require("./routes/api/listing.js"));
app.use("/checkout", require("./routes/stripe.js"));

app.use("/search", require("./routes/api/search.js"));

const PORT = process.env.PORT || 3000;

const emailRouter = require("./routes/email");

app.use("/email", emailRouter);
app.use("/", require("./routes/root.js"));

connectDB();

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
