const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCategory = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

function read(Id) {
  return knex("reviews as r")
    .select("*")
    .where({ review_id: Id })
    .then((res) => res[0]);
}

function destroy(Id) {
  return knex("reviews").select("*").where({ review_id: Id }).del();
}

function update(Id, content) {
  return knex("reviews")
    .where({ review_id: Id })
    .update(content)
    .then(() => {
      return knex("reviews as r")
        .join("critics as c", "c.critic_id", "r.critic_id")
        .select("r.*", "c.*")
        .where({ review_id: Id })
        .then((res) => res[0])
        .then((review) => {
          return addCategory(review);
        });
    });
}

module.exports = {
  read,
  destroy,
  update,
};
