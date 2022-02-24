import React, { useState, useEffect } from "react"
import { useHistory } from "react-router"
import useQuery from "../utils/useQuery"
import { listReservations } from "../utils/api"
import { previous, next } from "../utils/date-time"
import ErrorAlert from "../layout/ErrorAlert"
import ReservationsTable from "../reservations/ReservationsTable"

export default function Reservations({ date }) {
  const queries = useQuery()
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const [reservations, setReservations] = useState([])
  const [reservationsError, setReservationsError] = useState(null)
  const [selectedDate, setSelectedDate] = useState(date)

  const loadDashboard = () => {
    const abortController = new AbortController()
    setReservationsError(null)
    setLoading(true)
    listReservations({ date: selectedDate }, abortController.signal)
      .then(setReservations)
      .then(() => setLoading(false))
      .catch((error) => {
        if (error.name === "AbortError") setLoading(true)
        else {
          setReservationsError(error)
          setLoading(false)
        }
      })
    return () => abortController.abort()
  }

  const changeQuery = () => (queries.get("date") ? setSelectedDate(queries.get("date")) : null)

  const previousDate = () => history.push(`/dashboard?date=${previous(selectedDate)}`)

  const pickDate = ({ target }) => history.push(`/dashboard?date=${target.value}`)

  const nextDate = () => history.push(`/dashboard?date=${next(selectedDate)}`)

  useEffect(changeQuery, [queries])

  useEffect(loadDashboard, [selectedDate])

  return (
    <div className="card my-3 p-3" id="dashboard-card">
      <h3 className="card-title fs-3 text-center">Reservations</h3>
      <nav className="nav justify-content-between flex-nowrap">
        <div onClick={previousDate} className="btn nav-link">
          <span className="oi oi-arrow-left mx-1" />
          <span className="d-none d-md-inline">{previous(selectedDate)}</span>
        </div>
        <div className="d-flex flex-wrap justify-content-center align-content-center">
          <label htmlFor="date">
            <b>Selected Date:</b>&nbsp;
          </label>
          <input
            onChange={pickDate}
            type="date"
            id="date"
            name="reservation_date"
            value={selectedDate}
            min="2010-01-01"
            max="2050-12-31"
          />
        </div>
        <div onClick={nextDate} className="btn nav-link">
          <span className="d-none d-md-inline">{next(selectedDate)}</span>
          <span className="oi oi-arrow-right mx-1" />
        </div>
      </nav>
      <div className="card-body px-2">
        {loading ? (
          <div className="text-center flex-fill">
            <div className="spinner-border" role="status" />
          </div>
        ) : reservationsError ? (
          <ErrorAlert error={reservationsError} />
        ) : (
          <ReservationsTable reservations={reservations} setReservationsError={setReservationsError} />
        )}
      </div>
    </div>
  )
}
