const { JWT_SECRET } = require("../secrets");
const jwt = require("jsonwebtoken");
const userModel = require("../users/users-model");
const bcrypt = require("bcryptjs");

const sinirli = (req, res, next) => {
  const tokenHeader = req.headers["authorization"];
  if (!tokenHeader) {
    return next({ status: 401, message: "Token gereklidir" });
  }
  jwt.verify(tokenHeader, JWT_SECRET, (err, decodeToken) => {
    if (err) {
      return next({ status: 401, message: "Token gecersizdir" });
    }
    req.decodeToken = decodeToken;
    next();
  });
};

const sadece = (role_name) => (req, res, next) => {
  try {
    if (role_name !== req.decodeToken.role_name) {
      return next({ status: 403, message: "Bu, senin için değil" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

const usernameVarmi = async (req, res, next) => {
  try {
    const userNameIsExist = await userModel.goreBul({
      username: req.body.username,
    });
    if (!userNameIsExist || userNameIsExist.length === 0) {
      return next({ status: 401, message: "Geçersiz kriter" });
    }
    const user = userNameIsExist.find((x) =>
      bcrypt.compareSync(req.body.password, x.password)
    );
    if (!user) {
      return next({ status: 401, message: "Geçersiz kriter" });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const rolAdiGecerlimi = async (req, res, next) => {
  let { role_name } = req.body;
  if (!role_name || role_name.trim() === "") {
    role_name = "student";
  } else if (role_name.trim() === "admin") {
    return next({ status: 422, message: "Rol adı admin olamaz" });
  } else if (role_name.trim().length > 32) {
    return next({
      status: 422,
      message: "rol adı 32 karakterden fazla olamaz",
    });
  } else {
    role_name = role_name.trim();
  }
  req.body.role_name = role_name;
  req.body.password = await bcrypt.hash(req.body.password, 10);
  next();
};

module.exports = {
  sinirli,
  sadece,
  usernameVarmi,
  rolAdiGecerlimi,
};
