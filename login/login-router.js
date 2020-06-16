const bcryptjs = require("bcryptjs");

const router = require("express").Router();

const Users = require("../getusers/users-model");

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  const rounds = process.env.HASH_ROUNDS || 8;
  const hash = bcryptjs.hashSync(password, rounds);

  Users.add({ username, password: hash })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => res.send(err));
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })

    .then(([user]) => {
      if (user && bcryptjs.compareSync(password, user.password)) {
        req.session.user = { id: user.id, username: user.username };

        res
          .status(200)
          .json({ welcome: "working login try to get", session: req.session });
      } else {
        res.status(401).json({ you: "wrong login info" });
      }
    })
    .catch((err) => {
      console.log("login not working", err);
      res.status(500).send(err);
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        res.status(500).json({ message: "logout not working" });
      } else {
        res.status(204).end();
      }
    });
  } else {
    res.status(204).end();
  }
});

module.exports = router;
