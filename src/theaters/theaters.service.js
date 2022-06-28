const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");
const reduceProperties = require("../utils/reduce-properties");

const reduceTheaterAndMovies = reduceProperties("theater_id", {
  theater_id: ["movies", null, "theater_id"],
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  rating: ["movies", null, "rating"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
  created_at: ["movies", null, "created_at"],
  updated_at: ["movies", null, "updated_at"],
  is_showing: ["movies", null, "is_showing"],
});

function list() {
  return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .join("movies as m", "mt.movie_id", "m.movie_id")
    .select("t.*", "m.*")
    .then((res) => {
      return reduceTheaterAndMovies(res);
    });
}
module.exports = {
  list,
};
