const router = require("express").Router();
const { usernameVarmi, rolAdiGecerlimi } = require("./auth-middleware");
const { JWT_SECRET } = require("../secrets");
const userModel = require("../users/users-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", rolAdiGecerlimi, async (req, res, next) => {
  try {
    const model = {
      username: req.body.username,
      password: req.body.password,
      role_name: req.body.role_name,
    };
    const insertedUser = await userModel.ekle(model);
    res.status(201).json(insertedUser);
  } catch (error) {
    next(error);
  }
});

router.post("/login", usernameVarmi, async (req, res, next) => {
  try {
    const { password } = req.body;
    const isValidPassword = await bcrypt.compare(password, req.user.password);
    if (!isValidPassword) {
      return next({ status: 401, message: "Yanlış şifre" });
    }
    const token = jwt.sign(
      {
        subject: req.user.user_id,
        username: req.user.username,
        role_name: req.user.role_name,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      message: `${req.user.username} geri geldi!`,
      token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
