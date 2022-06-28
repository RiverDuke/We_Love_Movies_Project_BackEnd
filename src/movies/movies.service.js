const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCategory = mapProperties({
  "c:critic_id": "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  "c:created_at": "critic.created_at",
  "c:updated_at": "critic.updated_at",
});

function list() {
  return knex("movies").select("*");
}

function showingList() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .groupBy("mt.movie_id")
    .where({ is_showing: true });
}

function read(Id) {
  return knex("movies as m")
    .select("*")
    .where({ movie_id: Id })
    .then((res) => res[0]);
}

function theaterList(Id) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .select("t.*", "mt.is_showing", "mt.movie_id")
    .where({ "mt.movie_id": Id })
    .groupBy("mt.theater_id");
}

function reviewsList(Id) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "r.*",
      "c.critic_id as c:critic_id",
      "c.preferred_name",
      "c.surname",
      "c.organization_name",
      "c.created_at as c:created_at",
      "c.updated_at as c:updated_at"
    )
    .where({ "r.movie_id": Id })
    .then((review) => {
      return review.map((critic) => {
        return addCategory(critic);
      });
    });
}

module.exports = {
  list,
  showingList,
  read,
  theaterList,
  reviewsList,
};
