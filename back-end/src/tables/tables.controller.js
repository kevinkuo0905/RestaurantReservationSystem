const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const hasProperties = require("../errors/hasProperties")

const validKeys = ["table_name", "capacity"]

async function list(req, res) {
  const data = await service.list()
  res.status(200).json({ data })
}

async function tableExists(req, res, next) {
  const table_id = req.params.table_id
  const table = await service.read(table_id)
  if (table) {
    res.locals.table = table
    return next()
  }
  next({ status: 404, message: `table_id ${table_id} cannot be found` })
}

function read(req, res) {
  const data = res.locals.table
  res.status(200).json({ data })
}

const hasRequiredProperties = hasProperties(...validKeys)
const hasRequiredId = hasProperties("reservation_id")

function validProperties(req, res, next) {
  const { table_name, capacity } = req.body.data

  if (table_name.length < 2) {
    return next({ status: 400, message: `table_name "${table_name}" must be >1 character` })
  }

  if (!Number.isInteger(capacity)) {
    return next({ status: 400, message: `capacity must be a number` })
  }
  next()
}

async function create(req, res) {
  const data = await service.create(req.body.data)
  res.status(201).json({ data })
}

async function update(req, res, next) {
  const table = res.locals.table
  const reservation_id = req.body.data.reservation_id
  const reservation = await service.readReservation(reservation_id)

  if (!reservation) {
    return next({ status: 404, message: `reservation_id ${reservation_id} cannot be found` })
  }

  if (reservation.status != "booked") {
    return next({ status: 400, message: `status: "${reservation.status}" must be "booked"` })
  }

  if (table.reservation_id) {
    return next({ status: 400, message: `table ${table.table_id} is occupied` })
  }

  if (table.capacity < reservation.people) {
    return next({ status: 400, message: `number of people greater than capacity` })
  }

  reservation.status = "seated"
  await service.updateReservation(reservation)

  table.reservation_id = reservation_id
  const data = await service.update(table)
  res.status(200).json({ data })
}

async function destroy(req, res, next) {
  const table = res.locals.table
  if (!table.reservation_id) {
    return next({ status: 400, message: `table ${table.table_id} is not occupied` })
  }

  const reservation = {
    reservation_id: res.locals.table.reservation_id,
    status: "finished",
  }
  const data = await service.updateReservation(reservation)
  await service.destroy(table.table_id)
  res.status(200).json({ data })
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(tableExists), read],
  create: [hasRequiredProperties, validProperties, asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(tableExists), hasRequiredId, asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)],
}
