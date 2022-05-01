const User = require('../models/user');

//checking the role of the user, if admin then can progress to next route
const checkAdmin = (req, res, next) => {
  if (req.decoded.admin == true) {
    next();
  } else {
    return res.status(403).send("Not authorized")
  }
}

//checking for a valid email address before sending password reset link
const checkEmail = async (req, res, next) => {
  const {email} = req.body;
  const user = await User.findOne({
    email: email
  })
  if (!user) {
    res.status(403).send('Unable to find an account with this email')
  } else {
    req.user = user;
    next();
  }
}

module.exports = {checkAdmin, checkEmail}