import React, { useState } from "react"
import { useHistory } from "react-router"
import { finishReservation } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"

export default function Table({ table }) {
  const history = useHistory()
  const { table_id, table_name, capacity, reservation_id } = table
  const [tableError, setTableError] = useState(null)

  const handleClick = () => {
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
      finishReservation(table_id)
        .then(() => history.go(0))
        .catch(setTableError)
    }
  }

  const occupiedContent = (
    <span>
      <span>Occupied</span>
      <button onClick={handleClick} className="btn btn-danger ms-2">
        Finish
      </button>
    </span>
  )

  return (
    <div className="card m-2" id="table-card">
      <div className="card-body">
        <p>
          <b>Table ID: {table_id}</b>
        </p>
        <p>
          <b>Table Name: </b>
          {table_name}
        </p>
        <p>
          <b>Capacity: </b>
          {capacity}
        </p>
        <p>
          <b>Status: </b>
          {reservation_id ? occupiedContent : <span>Free</span>}
        </p>
      </div>
      <ErrorAlert error={tableError} />
    </div>
  )
}
