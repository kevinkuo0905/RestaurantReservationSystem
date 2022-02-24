import React, { useState } from "react"
import { useHistory } from "react-router"
import { createReservation } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"
import ReservationForm from "./ReservationForm"

export default function CreateReservation() {
  const history = useHistory()
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
    createReservation(formData)
      .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
      .catch(setReservationError)
  }

  return (
    <main className="d-flex justify-content-center justify-content-xl-start">
      <div className="card my-3 flex-fill" id="create-reservation-card">
        <h3 className="card-title text-center mt-3">Create New Reservation</h3>
        <div className="card-body">
          <ReservationForm formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />
        </div>
        <ErrorAlert error={reservationError} />
      </div>
    </main>
  )
}
