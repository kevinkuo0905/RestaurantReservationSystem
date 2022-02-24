import React, { useState } from "react"
import { useHistory } from "react-router"
import { createTable } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"

export default function CreateTable() {
  const history = useHistory()
  const [tableError, setTableError] = useState(null)
  const initialFormState = {
    table_name: "",
    capacity: "",
  }
  const [formData, setFormData] = useState(initialFormState)

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    formData.capacity = Number(formData.capacity)
    createTable(formData)
      .then(() => history.push(`/dashboard`))
      .catch(setTableError)
  }

  return (
    <main className="d-flex justify-content-center justify-content-xl-start">
      <div className="card my-3 flex-fill" id="create-table-card">
        <h3 className="card-title text-center mt-3">Create New Table</h3>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column flex-md-row m-3 justify-content-between">
              <div className="form-group mx-3">
                <label htmlFor="table-name">Table Name</label>
                <input
                  onChange={handleChange}
                  className="form-control"
                  type="text"
                  id="table-name"
                  name="table_name"
                  placeholder=""
                  value={formData.table_name}
                  required
                />
              </div>
              <div className="form-group mx-3">
                <label htmlFor="capacity">Capacity</label>
                <input
                  onChange={handleChange}
                  className="form-control"
                  type="number"
                  id="capacity"
                  name="capacity"
                  placeholder=""
                  value={formData.capacity}
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
        </div>
        <ErrorAlert error={tableError} />
      </div>
    </main>
  )
}
