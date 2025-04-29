"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}
export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
export async function updateGuest(formData) {
  const session = await auth();
  if (!session.user) throw new Error("You must be Login");
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  const nationalIDRegex = /^[a-zA-Z0-9]{6,12}$/;
  if (!nationalIDRegex.test(nationalID)) {
    throw new Error(
      "National ID must be an alphanumeric string between 6 and 12 characters."
    );
  }
  const updateData = { nationality, countryFlag, nationalID };
  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) {
    throw new Error("Guest could not be updated");
  }
  revalidatePath("/account/profile");
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const guestBooking = await getBookings(session.user.guestId);
  const getBookingsId = guestBooking.map((item) => item.id);
  if (!getBookingsId.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);
  if (error) throw new Error("Booking Could not be Deleted");
  revalidatePath("/account/reservations");
}
export async function updateReservation(formData) {
  console.log("Starting update reservation...");
  const bookingId = Number(formData.get("bookingId"));
  console.log("BookingId to update:", bookingId);

  // 1) Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2) Authorization
  const guestBookings = await getBookings(session.user.guestId);
  // Make sure all IDs are numbers for comparison
  const guestBookingIds = guestBookings.map((booking) => Number(booking.id));

  console.log("Available booking IDs:", guestBookingIds);
  console.log("Checking if", bookingId, "exists in", guestBookingIds);

  const hasAccess = guestBookingIds.includes(bookingId);
  console.log("Has access:", hasAccess);

  if (!hasAccess) {
    console.log("Access denied for booking:", bookingId);
    console.log("User bookings:", guestBookings);
    throw new Error("You are not allowed to update this booking");
  }

  // 3) Building update data
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations")?.slice(0, 1000) || "",
  };

  // 4) Mutation
  const { data, error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    console.error("Update error:", error);
    throw new Error(`Booking could not be updated: ${error.message}`);
  }

  // 6) Revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  // 7) Redirecting
  redirect("/account/reservations");
}
// export async function updateReservation(formData) {
//   // console.log(formData);
//   const bookingId = formData.get("bookingId");
//   // console.log(bookingId);

//   const session = await auth();
//   if (!session) throw new Error("You must be logged in");
//   const guestBooking = await getBookings(session.user.guestId);
//   // console.log(guestBooking);

//   const getBookingsId = guestBooking.map((booking) => booking.id);
//   console.log(getBookingsId);

//   if (!getBookingsId.includes(bookingId))
//     throw new Error("You are not allowed to update this booking");
//   const updateData = {
//     numGuests: Number(formData.get("numGuests")),
//     observations: formData.get("observations").slice(0, 1000),
//   };
//   const { error } = await supabase
//     .from("bookings")
//     .update(updateData)
//     .eq("id", bookingId)
//     .select()
//     .single();
//   if (error) throw new Error("Booking Could not be Updated");
//   revalidatePath(`/account/reservations/edit/${bookingId}`);
//   revalidatePath("/account/reservations");
//   redirect("/account/reservations");
// }
