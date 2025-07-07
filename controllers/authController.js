const User = require('../model/User')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const handleLogIn = async (req, res) => {
  const { email , password } = req.body;

  const foundUser = await User.findOne({email : email}).exec();

  if (!foundUser) return res.sendStatus(401);

  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const accessToken = jwt.sign(
      { email: foundUser.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save()
    console.log(result)

    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    res.json({ accessToken });
  } else {
    res.status(401).json({'message': 'Your password does not match our records'});
  }
};

module.exports = { handleLogIn };
