const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session"); 
const KnexSessionStore = require("connect-session-knex")(session); 

const usersRouter = require("./getusers/users-router");
const authRouter = require("./login/login-router");
const requiresAuth = require("./login/requires-auth");
const dbConnection = require("./connection");

const server = express();

const sessionConfig = {
  name: "monster",
  secret: process.env.SESSION_SECRET || "keep it secret, keep it safe!",
  cookie: {
    maxAge: 1000 * 60 * 10, 
    secure: process.env.COOKIE_SECURE || false, 
    httpOnly: true, 
  },
  resave: false,
  saveUninitialized: true, 
  store: new KnexSessionStore({
    knex: dbConnection,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 6000, 
  }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig)); 

server.use("/api/users", requiresAuth, usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;