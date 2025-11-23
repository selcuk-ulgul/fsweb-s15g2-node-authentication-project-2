const router = require("express").Router();
const Users = require("./users-model.js");
const { sinirli, sadece } = require("../auth/auth-middleware.js");

router.get("/", sinirli, (req, res, next) => {
  Users.bul()
    .then((users) => {
      res.json(users);
    })
    .catch(next);
});

router.get("/:user_id", sinirli, sadece("admin"), (req, res, next) => {
  Users.idyeGoreBul(req.params.user_id)
    .then((user) => {
      res.json(user);
    })
    .catch(next);
});

module.exports = router;
