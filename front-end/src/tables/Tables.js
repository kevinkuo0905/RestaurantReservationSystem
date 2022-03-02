import React, { useEffect, useState } from "react"
import { listTables } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert"
import Table from "./Table"

export default function Tables() {
  const [loading, setLoading] = useState(true)
  const [tables, setTables] = useState([])
  const [tablesError, setTablesError] = useState(null)

  const loadDashboard = () => {
    const abortController = new AbortController()
    setTablesError(null)
    setLoading(true)
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError)
      .finally(() => setLoading(false))
    return () => abortController.abort()
  }

  useEffect(loadDashboard, [])

  const loadingSpinner = (
    <div className="text-center flex-fill">
      <div className="spinner-border" role="status" />
    </div>
  )

  const errorAlert = <ErrorAlert error={tablesError} />

  const tableCards = tables.map((table) => <Table key={table.table_id} table={table} />)

  return (
    <div className="card my-3 p-3" id="dashboard-card">
      <h3 className="card-title fs-3 text-center">Tables</h3>
      <div className="card-body d-flex flex-wrap">
        {loading ? loadingSpinner : tablesError ? errorAlert : tableCards}
      </div>
    </div>
  )
}
