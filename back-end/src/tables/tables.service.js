const knex = require("../db/connection")

function list() {
  return knex("tables").orderBy("table_name")
}

function read(table_id) {
  return knex("tables").where({ table_id }).first()
}

function create(table) {
  return knex("tables")
    .insert(table, "*")
    .then((table) => table[0])
}

function readReservation(reservation_id) {
  return knex("reservations").where({ reservation_id }).first()
}

function updateReservation(reservation) {
  return knex("reservations")
    .where({ reservation_id: reservation.reservation_id })
    .update({ status: reservation.status })
}

function update(table) {
  return knex("tables")
    .where({ table_id: table.table_id })
    .update({ reservation_id: table.reservation_id }, "*")
    .then((table) => table[0])
}

function destroy(table_id) {
  return knex("tables").where({ table_id }).update({ reservation_id: null })
}

module.exports = {
  list,
  read,
  create,
  readReservation,
  updateReservation,
  update,
  destroy,
}
