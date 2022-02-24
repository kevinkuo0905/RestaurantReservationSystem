import React from "react"
import Reservations from "../reservations/Reservations"
import Tables from "../tables/Tables"
import { today } from "../utils/date-time"

export default function Dashboard() {
  return (
    <main>
      <Reservations date={today()} />
      <Tables />
    </main>
  )
}
