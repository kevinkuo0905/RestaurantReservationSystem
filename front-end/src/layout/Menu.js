import React from "react"
import { Link, useLocation } from "react-router-dom"

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  const pathName = useLocation().pathname
  const path = (tab) => (pathName.includes(tab) ? " active bg-secondary bg-opacity-50" : "")

  return (
    <nav
      className="d-flex flex-xl-column flex-fill justify-content-between justify-content-xl-start bg-dark p-3"
      id="nav-menu"
    >
      <h3 className="text-light">Periodic Tables</h3>
      <div className="d-flex flex-row flex-xl-column nav-pills fs-5">
        <Link className={"nav-link text-light py-1 px-2" + path("dashboard")} to="/dashboard">
          <span className="oi oi-dashboard" />
          <span className="d-none d-md-inline">&nbsp;Dashboard</span>
        </Link>
        <Link className={"nav-link text-light py-1 px-2" + path("search")} to="/search">
          <span className="oi oi-magnifying-glass" />
          <span className="d-none d-md-inline">&nbsp;Search</span>
        </Link>
        <Link className={"nav-link text-light py-1 px-2" + path("reservations/new")} to="/reservations/new">
          <span className="oi oi-plus" />
          <span className="d-none d-md-inline">&nbsp;New Reservation</span>
        </Link>
        <Link className={"nav-link text-light py-1 px-2" + path("tables/new")} to="/tables/new">
          <span className="oi oi-layers" />
          <span className="d-none d-md-inline">&nbsp;New Table</span>
        </Link>
      </div>
    </nav>
  )
}

export default Menu
