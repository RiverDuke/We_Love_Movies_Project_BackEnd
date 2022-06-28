const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);

  if (movie) {
    res.locals.Id = movieId;
    return next();
  }
  next({
    status: 404,
    message: `Movie id: ${movieId} does not exist`,
  });
}

async function list(req, res, next) {
  if (req.query.is_showing === "true") {
    return res.json({ data: await service.showingList() });
  }

  res.json({ data: await service.list() });
}

async function read(req, res, next) {
  res.json({ data: await service.read(res.locals.Id) });
}

async function theaters(req, res, next) {
  const id = Number(res.locals.Id);
  res.json({ data: await service.theaterList(id) });
}

async function reviews(req, res, next) {
  const data = await service.reviewsList(res.locals.Id);
  res.json({ data: data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  theaterList: [asyncErrorBoundary(movieExists), asyncErrorBoundary(theaters)],
  reviewsList: [asyncErrorBoundary(movieExists), asyncErrorBoundary(reviews)],
};
