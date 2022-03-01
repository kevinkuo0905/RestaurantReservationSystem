const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const hasProperties = require("../errors/hasProperties")

const validKeys = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]

async function list(req, res) {
  const date = req.query.date || new Date().toJSON().slice(0, 10)
  const phoneNumber = req.query.mobile_number
  const reservations = await service.list()
  const data = phoneNumber
    ? reservations.filter(({ mobile_number }) =>
        mobile_number.replace(/[- \(\)]/g, "").includes(phoneNumber.replace(/[- \(\)]/g, ""))
      )
    : reservations.filter(
        ({ status, reservation_date }) =>
          status != "cancelled" &&
          status != "finished" &&
          reservation_date.toJSON().slice(0, 10) == date
      )
  res.status(200).json({ data })
}

async function reservationExists(req, res, next) {
  const reservation_id = req.params.reservation_id
  const reservation = await service.read(reservation_id)
  if (reservation) {
    res.locals.reservation = reservation
    return next()
  }
  next({ status: 404, message: `reservation_id ${reservation_id} cannot be found` })
}

function read(req, res) {
  const data = res.locals.reservation
  res.status(200).json({ data })
}

const hasRequiredProperties = hasProperties(...validKeys)

function validProperties(req, res, next) {
  const { reservation_date, reservation_time, people, status = "booked" } = req.body.data
  const dateRegex = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/
  const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/

  if (!dateRegex.test(reservation_date)) {
    return next({ status: 400, message: `"${reservation_date}" is an invalid reservation_date` })
  }

  if (new Date(reservation_date).getDay() == 2) {
    return next({ status: 400, message: `restaurant is closed on Tuesdays` })
  }

  if (reservation_date < new Date().toJSON().slice(0, 10)) {
    return next({ status: 400, message: `restaurant reservation date must be in the future` })
  }

  if (!timeRegex.test(reservation_time)) {
    return next({ status: 400, message: `"${reservation_time}" is an invalid reservation_time` })
  }

  const time = reservation_time.split(":")[0] * 60 + Number(reservation_time.split(":")[1])

  if (time < 630 || time > 1290) {
    return next({ status: 400, message: `reservation time must be between 10:30 and 21:30` })
  }

  if (!Number.isInteger(people) || people < 1) {
    return next({ status: 400, message: `${people} is a string or an invalid number of people` })
  }

  if (status == "seated" || status == "finished") {
    return next({ status: 400, message: `"${status}" not allowed` })
  }
  next()
}

async function create(req, res) {
  const data = await service.create(req.body.data)
  res.status(201).json({ data })
}

async function updateStatus(req, res, next) {
  const reservation = req.body.data
  const validStatus = ["booked", "seated", "finished", "cancelled"]

  if (!validStatus.includes(reservation.status)) {
    return next({ status: 400, message: `"${reservation.status}" is an invalid status` })
  }

  if (res.locals.reservation.status == "finished") {
    return next({ status: 400, message: `a finished reservation cannot be updated` })
  }

  reservation.reservation_id = req.params.reservation_id
  const data = await service.update(reservation)
  res.status(200).json({ data })
}

async function updateReservation(req, res) {
  const reservation = req.body.data
  reservation.reservation_id = req.params.reservation_id
  const data = await service.update(reservation)
  res.status(200).json({ data })
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  create: [hasRequiredProperties, validProperties, asyncErrorBoundary(create)],
  updateStatus: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(updateStatus)],
  updateReservation: [
    asyncErrorBoundary(reservationExists),
    hasRequiredProperties,
    validProperties,
    asyncErrorBoundary(updateReservation),
  ],
}
