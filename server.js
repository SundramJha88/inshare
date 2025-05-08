require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const jwt = require('jsonwebtoken');

// Cors
const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
  // ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3300']
};

// app.use(cors(corsOptions));
app.use(cors())
app.use(express.static(path.join(__dirname,"public")));

const connectDB = require("./config/db");
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie : { secure : false, maxAge : 1000*60*60*24}
  })
);
app.use(flash());

// app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Routes
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      res.clearCookie('token');
    }
  }
  next();
});

// Routes को इससे पहले रखें
app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));
app.use('/', require('./routes/signup'));
app.use('/', require('./routes/login'));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/share", (req, res) => {
  res.render("index");
});

app.listen(PORT, console.log(`Listening on port ${PORT}.`));
