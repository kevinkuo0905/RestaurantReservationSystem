import React, { useState, useEffect } from "react"
import { useHistory, useParams } from "react-router"
import { readReservation, editReservation } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"
import ReservationForm from "./ReservationForm"

export default function EditReservation() {
  const history = useHistory()
  const { reservation_id } = useParams()
  const [reservationError, setReservationError] = useState(null)
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  }
  const [formData, setFormData] = useState(initialFormState)

  const handleSubmit = (event) => {
    event.preventDefault()
    formData.people = Number(formData.people)
    editReservation(formData, reservation_id)
      .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
      .catch(setReservationError)
  }

  const loadReservation = () => {
    const abortController = new AbortController()
    setReservationError(null)
    readReservation(reservation_id, abortController.signal)
      .then(setFormData)
      .catch(setReservationError)
    return () => abortController.abort()
  }

  useEffect(loadReservation, [reservation_id])

  return (
    <main className="d-flex justify-content-center justify-content-xl-start">
      <div className="card my-3 flex-fill" id="create-reservation-card">
        <h3 className="card-title text-center mt-3">Edit Reservation ID: {reservation_id}</h3>
        <div className="card-body">
          <ReservationForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
          />
        </div>
        <ErrorAlert error={reservationError} />
      </div>
    </main>
  )
}
