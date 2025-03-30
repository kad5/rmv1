// remember to make email lower case in validation const email = req.body.email.toLowerCase();
const login = (req, res, next) => {
  next();
};
const signup = (req, res, next) => {
  next();
};

module.exports = { login, signup };
