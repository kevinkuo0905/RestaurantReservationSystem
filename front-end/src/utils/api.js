/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date"
import formatReservationTime from "./format-reservation-time"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers()
headers.append("Content-Type", "application/json")

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 */
async function fetchJson(url, options) {
  try {
    const response = await fetch(url, options)
    if (response.status === 204) {
      return null
    }
    const payload = await response.json()
    if (payload.error) {
      return Promise.reject({ message: payload.error })
    }
    return payload.data
  } catch (error) {
    if (error.name !== "AbortError") console.error(error.stack)
    throw error
  }
}

/**
 * Retrieves all existing reservations satisfying each query.
 * @returns {Promise<[reservations]>}
 *  a promise that resolves to an array of reservations saved in the database.
 */
export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`)
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value.toString()))
  return await fetchJson(url, { headers, signal })
    .then(formatReservationDate)
    .then(formatReservationTime)
}

/**
 * Retrieves an existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a reservation saved in the database.
 */
export async function readReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`)
  return await fetchJson(url, { headers, signal })
    .then(formatReservationDate)
    .then(formatReservationTime)
}

/**
 * Makes a new reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to the newly created reservation.
 */
export async function createReservation(reservation, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`)
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  }
  return await fetchJson(url, options)
}

/**
 * Edits an existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to the updated reservation.
 */
export async function editReservation(reservation, reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`)
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  }
  return await fetchJson(url, options)
}

/**
 * Cancel a reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to the updated reservation.
 */
export async function cancelReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`)
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status: "cancelled" } }),
    signal,
  }
  return await fetchJson(url, options)
}

/**
 * Seat a reservation to a table.
 * @returns {Promise<[table]>}
 *  a promise that resolves to the updated table.
 */
export async function seatReservation(reservation_id, table_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`)
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id } }),
    signal,
  }
  return await fetchJson(url, options)
}

/**
 * Finish the reservation at a table.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to the updated reservation.
 */
export async function finishReservation(table_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`)
  const options = {
    method: "DELETE",
    headers,
    signal,
  }
  return await fetchJson(url, options)
}

/**
 * Retrieves all existing tables.
 * @returns {Promise<[tables]>}
 *  a promise that resolves to an array of tables saved in the database.
 */
export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`)
  return await fetchJson(url, { headers, signal })
}

/**
 * Makes a new table.
 * @returns {Promise<[table]>}
 *  a promise that resolves to the newly created table.
 */
export async function createTable(table, signal) {
  const url = new URL(`${API_BASE_URL}/tables`)
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  }
  return await fetchJson(url, options)
}
