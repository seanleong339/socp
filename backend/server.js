const express = require("express")
const cors = require("cors")
const sample = require("./api/sample.route")
const user = require("./api/user.route")
const comment = require("./api/comment.route")
const auth = require("./api/auth.route")
const session = require("express-session")
const passport = require("passport")
const authDAO = require("./dao/authDAO")
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')

const app = express();

const corsOption = {
    origin: ['http://localhost:3000', 'https://socplanner.herokuapp.com/'],
    credentials: true
}

app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

const initializePassport = require("./api/passport-config");
initializePassport(passport, authDAO.findUserbyEmail, authDAO.findUserbyId);

app.use("/sample", sample);

app.use("/", user);

app.use("/comment", comment);

app.use("/auth", auth);

app.use("*", (req, res) => {
    res.status(404).json({ error: "not found" })
});

module.exports = app;