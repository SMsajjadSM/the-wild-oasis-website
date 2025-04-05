import DateSelector from "@/app/_components/DateSelector";
import ReservationForm from "@/app/_components/ReservationForm";
import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import LoginMessage from "./LoginMessage";
import { auth } from "../_lib/auth";
async function Reservation({ cabin }) {
  
  const [setting, bookedDate] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);
  const session = await auth();
  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px] ">
      <DateSelector setting={setting} bookedDate={bookedDate} cabin={cabin} />
     {session?.user ? <ReservationForm user={session.user} cabin={cabin} /> : <LoginMessage />}
    </div>
  );
}

export default Reservation;
