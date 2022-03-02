import React from "react"
import Reservation from "./Reservation"

export default function ReservationsTable({ reservations, setReservationsError }) {
  const table = (
    <table className="table">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Status</th>
          <th scope="col" className="d-none d-md-table-cell">
            Reservation ID
          </th>
          <th scope="col" className="d-none d-md-table-cell">
            First Name
          </th>
          <th scope="col" className="d-none d-md-table-cell">
            Last Name
          </th>
          <th scope="col" className="d-md-none">
            Name
          </th>
          <th scope="col">Phone Number</th>
          <th scope="col">Time</th>
          <th scope="col"># of People</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((reservation) => (
          <Reservation
            key={reservation.reservation_id}
            reservation={reservation}
            setReservationsError={setReservationsError}
          />
        ))}
      </tbody>
    </table>
  )

  const emptyTableText = (
    <>
      <hr />
      <h3 className="text-center">No reservations found</h3>
    </>
  )

  return reservations.length ? table : emptyTableText
}
