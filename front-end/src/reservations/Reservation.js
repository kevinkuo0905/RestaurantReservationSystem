import React from "react"
import { useHistory } from "react-router"
import { cancelReservation } from "../utils/api"
import { Link } from "react-router-dom"

export default function Reservation({ reservation, setReservationsError }) {
  const history = useHistory()
  const { reservation_id, first_name, last_name, mobile_number, reservation_time, people, status } =
    reservation

  const handleClick = () => {
    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
      cancelReservation(reservation_id)
        .then(() => history.go(0))
        .catch(setReservationsError)
    }
  }
  
  const seatButton = (
    <Link className="ms-3 btn btn-primary" to={`/reservations/${reservation_id}/seat`}>
      Seat
    </Link>
  )

  return (
    <tr>
      <td className="text-nowrap">
        <Link className="btn btn-primary" to={`/reservations/${reservation_id}/edit`}>
          Edit
        </Link>
        <button
          data-reservation-id-cancel={reservation_id}
          onClick={handleClick}
          className="btn btn-danger ms-1"
        >
          Cancel
        </button>
      </td>
      <td data-reservation-id-status={reservation_id}>{status}</td>
      <td className="d-none d-md-table-cell">{reservation_id}</td>
      <td className="d-none d-md-table-cell">{first_name}</td>
      <td className="d-none d-md-table-cell">{last_name}</td>
      <td className="d-md-none">
        {first_name} {last_name}
      </td>
      <td>{mobile_number}</td>
      <td>{reservation_time}</td>
      <td>
        <span>{people}</span>
        {status === "booked" ? seatButton : null}
      </td>
    </tr>
  )
}
