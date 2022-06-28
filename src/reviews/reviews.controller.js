const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);

  if (review) {
    res.locals.Id = reviewId;
    return next();
  }
  next({
    status: 404,
    message: `error: Review cannot be found.`,
  });
}

async function destroy(req, res, next) {
  await service.destroy(res.locals.Id);
  res.sendStatus(204);
}

async function update(req, res, next) {
  res.json({
    data: await service.update(res.locals.Id, req.body.data),
  });
}

module.exports = {
  destroy: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
};
