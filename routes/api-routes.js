var db = require("../models");
const passport = require("passport");

module.exports = function (app) {
  // Get all examples
  app.get("/trails", function (req, res) {
    db.Trail.findAll({}).then(function (data) {
      console.log(data);
      res.render("user_trail", {trail: data});
    });
  });

  // Create a new example
  app.post("/api/trail", function (req, res) {
    console.log(req.session.passport.user);
    db.Trail.destroy({
      where: {AccountUuid: req.session.passport.user},
      truncate: true
    });
    console.log("========REQ BODY Trail.create========");
    for (let i = 0; i < req.body.trail.length; i++) {
      db.Trail.create({
        trailId: req.body.trail[i].trailId,
        name: req.body.trail[i].name,
        type: req.body.trail[i].type,
        summary: req.body.trail[i].summary,
        difficulty: req.body.trail[i].difficulty,
        stars: req.body.trail[i].stars,
        AccountUuid: req.session.passport.user
      }).then(function (data) {
        if (i === req.body.trail.length - 1) {
          res.json(data);
        }
      });
    }
  });

  // Delete an example by id
  // app.delete("/api/examples/:id", function(req, res) {
  //   db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });
};
