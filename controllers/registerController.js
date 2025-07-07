const User = require('../model/User');
const bcrypt = require("bcryptjs");

const handleNewUser = async (req, res) => {

  const { fname, lname, email, password, phone } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Username and password are Required!" });

      const duplicate = await User.findOne({email: email}).exec();
      if(duplicate) return res.sendStatus(409)
  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    const result = await User.create({
      "fname" : fname,
      "lname" : lname,
        "email" : email,
        "password" : hashedPwd,
        "phone" : phone

    });
    console.log(result)
 
    res.status(201).json({'success' : `${result} was created!`})

    // need to write to DB
  } catch (error) {
    console.error(error);
  }
};


module.exports = {handleNewUser}
