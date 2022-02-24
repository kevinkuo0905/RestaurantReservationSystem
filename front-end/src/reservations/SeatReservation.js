import React, { useState, useEffect } from "react"
import { useParams, useHistory } from "react-router"
import { readReservation, listTables, seatReservation } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"

export default function SeatReservation() {
  const history = useHistory()
  const { reservation_id } = useParams()
  const [loadingReservation, setLoadingReservation] = useState(true)
  const [loadingTables, setLoadingTables] = useState(true)
  const [reservation, setReservation] = useState({})
  const [reservationError, setReservationError] = useState(null)
  const [tables, setTables] = useState([])
  const [selectedTableId, setSelectedTableId] = useState({})
  const [tablesError, setTablesError] = useState(null)

  const handleChange = ({ target }) => setSelectedTableId(target.value)

  const handleSubmit = (event) => {
    event.preventDefault()
    seatReservation(reservation_id, selectedTableId)
      .then(() => history.push(`/dashboard`))
      .catch(setTablesError)
  }

  const loadReservation = () => {
    setReservationError(null)
    setLoadingReservation(true)
    readReservation(reservation_id)
      .then(setReservation)
      .catch(setReservationError)
      .finally(() => setLoadingReservation(false))
  }

  const loadTables = () => {
    setTablesError(null)
    setLoadingTables(true)
    listTables()
      .then(setTables)
      .catch(setTablesError)
      .finally(() => setLoadingTables(false))
  }

  useEffect(loadTables, [])

  useEffect(loadReservation, [reservation_id])

  return (
    <main className="d-flex justify-content-center justify-content-xl-start">
      <div style={{ minWidth: "360px", maxWidth: "540px" }} className="card my-3 flex-fill">
        <h3 className="card-title text-center mt-3">Seat Reservation ID: {reservation_id}</h3>
        <div className="card-body placeholder-glow">
          <p>
            <b>Reservation Info</b>
          </p>
          <p>
            <b>Name: </b>
            <span className={loadingReservation ? " placeholder col-3" : ""}>
              {reservation.first_name} {reservation.last_name}
            </span>
          </p>
          <p>
            <b>Phone Number: </b>
            <span className={loadingReservation ? " placeholder col-3" : ""}>{reservation.mobile_number}</span>
          </p>
          <p>
            <b>Date/Time: </b>
            <span className={loadingReservation ? " placeholder col-5" : ""}>
              {reservation.reservation_date} at {reservation.reservation_time}
            </span>
          </p>
          <p>
            <b>Number of People: </b>
            <span className={loadingReservation ? " placeholder col-1" : ""}>{reservation.people}</span>
          </p>
          <form onSubmit={handleSubmit} className="d-flex flex-row justify-content-between">
            <div className="d-flex align-items-center">
              <label htmlFor="table">Table:</label>
              <select
                onChange={handleChange}
                className={"ms-2" + (loadingTables ? " placeholder" : "")}
                name="table_id"
                id="table"
                required
              >
                <option value="">Select a Table</option>
                {tables.map((table) => (
                  <option key={table.table_id} value={table.table_id}>
                    {table.table_name} - {table.capacity}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex">
              <button type="submit" className="btn btn-primary m-2">
                Seat
              </button>
              <button onClick={history.goBack} className="btn btn-secondary m-2">
                Cancel
              </button>
            </div>
          </form>
        </div>
        <ErrorAlert error={reservationError} />
        <ErrorAlert error={tablesError} />
      </div>
    </main>
  )
}
