import React, { useState, useEffect } from "react"
import useQuery from "../utils/useQuery"
import { listReservations } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"
import ReservationsTable from "../reservations/ReservationsTable"

export default function SearchReservations() {
  const queries = useQuery()
  const [loading, setLoading] = useState(true)
  const [reservations, setReservations] = useState([])
  const [reservationsError, setReservationsError] = useState(null)
  const [selectedNumber, setSelectedNumber] = useState("#")

  const loadDashboard = () => {
    const abortController = new AbortController()
    setReservationsError(null)
    setLoading(true)
    listReservations({ mobile_number: selectedNumber }, abortController.signal)
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

  const changeQuery = () => (queries.get("mobile_number") ? setSelectedNumber(queries.get("mobile_number")) : null)

  useEffect(changeQuery, [queries])

  useEffect(loadDashboard, [selectedNumber])

  return (
    <main>
      <div className="card my-3 p-3" id="dashboard-card">
        <h3 className="card-title fs-3 text-center">Search Reservations</h3>
        <nav className="nav justify-content-center flex-nowrap">
          <form>
            <label htmlFor="mobile_number">
              <b>Search Phone Number:</b>&nbsp;
            </label>
            <input type="tel" id="mobile_number" name="mobile_number" required />
            <button type="submit" className="btn btn-primary m-2">
              Search
            </button>
          </form>
        </nav>
        <div className="card-body px-2">
          {loading ? (
            <div className="text-center flex-fill">
              <div className="spinner-border" role="status" />
            </div>
          ) : reservationsError ? (
            <ErrorAlert error={reservationsError} />
          ) : (
            <ReservationsTable reservations={reservations} />
          )}
        </div>
      </div>
    </main>
  )
}
