import React from "react"
import { useHistory } from "react-router"

export default function ReservationForm({ formData, setFormData, handleSubmit }) {
  const history = useHistory()
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="d-flex flex-column flex-md-row m-3 justify-content-between">
        <div className="form-group mx-3">
          <label htmlFor="first-name">First Name</label>
          <input
            onChange={handleChange}
            className="form-control"
            type="text"
            id="first-name"
            name="first_name"
            value={formData.first_name}
            required
          />
        </div>
        <div className="form-group mx-3">
          <label htmlFor="last-name">Last Name</label>
          <input
            onChange={handleChange}
            className="form-control"
            type="text"
            id="last-name"
            name="last_name"
            value={formData.last_name}
            required
          />
        </div>
        <div className="form-group mx-3">
          <label htmlFor="mobile-number">Phone Number</label>
          <input
            onChange={handleChange}
            className="form-control"
            type="tel"
            id="mobile-number"
            name="mobile_number"
            value={formData.mobile_number}
            required
          />
        </div>
      </div>
      <div className="d-flex flex-column flex-md-row m-3 justify-content-between">
        <div className="form-group mx-3">
          <label htmlFor="reservation-date">Reservation Date</label>
          <input
            onChange={handleChange}
            className="form-control"
            type="date"
            id="reservation-date"
            name="reservation_date"
            value={formData.reservation_date}
            required
          />
        </div>
        <div className="form-group mx-3">
          <label htmlFor="reservation-time">Reservation Time</label>
          <input
            onChange={handleChange}
            className="form-control"
            type="time"
            id="reservation-time"
            name="reservation_time"
            value={formData.reservation_time}
            required
          />
        </div>
        <div className="form-group mx-3">
          <label htmlFor="people">Number of People</label>
          <input
            onChange={handleChange}
            className="form-control"
            type="number"
            id="people"
            name="people"
            value={formData.people}
            required
          />
        </div>
      </div>
      <div className="d-flex flex-row justify-content-end">
        <button type="submit" className="btn btn-primary m-2">
          Submit
        </button>
        <button onClick={history.goBack} className="btn btn-secondary m-2">
          Cancel
        </button>
      </div>
    </form>
  )
}
