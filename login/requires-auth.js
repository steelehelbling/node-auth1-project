module.exports = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ you: "you are not logged in" });
  }
};
