const express = require("express")
const cors = require("cors")
const sample = require("./api/sample.route")
const user = require("./api/user.route")
const comment = require("./api/comment.route")
const auth = require("./api/auth.route")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const passport = require("passport")
const authDAO = require("./dao/authDAO")
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express();

const corsOption = {
    origin: ['http://localhost:3000', 'https://socplanner.herokuapp.com'],
    credentials: true
}

app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: false}));
app.use(session({
  //  store: MongoStore.create({
  //      mongoUrl: 'mongodb+srv://sean:Orbital2021@cluster0.kacq5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  //      ttl: 24 * 60 * 60
  //  }),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'none'
        //domain: 'herokuapp.com' //process.env.COOKIE_DOMAIN
    }
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