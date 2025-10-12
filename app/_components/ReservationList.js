"use client";
import { useOptimistic } from "react";
import { deleteReservation } from "../_lib/actions";
import ReservationCard from "./ReservationCard";

function ReservationList({ bookings }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curbookings, bookingId) =>
      curbookings.filter((booking) => booking.id !== bookingId)
  );
  async function handleDellete(bookingId) {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  }
  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          handleDellete={handleDellete}
          key={booking.id}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
