import React from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import Dashboard from "../dashboard/Dashboard"
import SearchReservations from "../reservations/SearchReservations"
import CreateReservation from "../reservations/CreateReservation"
import CreateTable from "../tables/CreateTable"
import NotFound from "./NotFound"
import SeatReservation from "../reservations/SeatReservation"
import EditReservation from "../reservations/EditReservation"

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/search">
        <SearchReservations />
      </Route>
      <Route exact path="/reservations/new">
        <CreateReservation />
      </Route>
      <Route exact path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route exact path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route exact path="/tables/new">
        <CreateTable />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  )
}

export default Routes
