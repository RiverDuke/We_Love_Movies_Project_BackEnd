const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

const movie = "/:movieId";

router.route("/").get(controller.list).all(methodNotAllowed);
router.route(movie).get(controller.read).all(methodNotAllowed);
router
  .route(`${movie}/theaters`)
  .get(controller.theaterList)
  .all(methodNotAllowed);
router
  .route(`${movie}/reviews`)
  .get(controller.reviewsList)
  .all(methodNotAllowed);

module.exports = router;
