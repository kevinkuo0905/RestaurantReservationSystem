import React from "react"
import Menu from "./Menu"
import Routes from "./Routes"
import "./Layout.css"

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div className="d-xl-flex flex-row bg-info bg-opacity-10">
      <div className="d-flex">
        <Menu />
      </div>
      <div className="container-fluid">
        <Routes />
      </div>
    </div>
  )
}

export default Layout
