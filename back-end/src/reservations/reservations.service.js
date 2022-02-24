const knex = require("../db/connection")

function list() {
  return knex("reservations").orderBy("reservation_time")
}

function read(reservation_id) {
  return knex("reservations").where({ reservation_id }).first()
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation, "*")
    .then((reservation) => reservation[0])
}

function update(reservation) {
  return knex("reservations")
    .where({ reservation_id: reservation.reservation_id })
    .update(reservation, "*")
    .then((reservation) => reservation[0])
}

module.exports = {
  list,
  read,
  create,
  update,
}
