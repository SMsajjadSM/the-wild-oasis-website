"use client";
import { createContext, useContext, useState } from "react";

const ResevationContext = createContext();
const initialState = { from: undefined, to: undefined };
function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);
  const resetRange = () => setRange(initialState);
  return (
    <ResevationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ResevationContext.Provider>
  );
}
function useReservation() {
  const context = useContext(ResevationContext);
  if (context === undefined)
    throw new Error("Context was used outside provider");
  return context;
}
export { useReservation, ReservationProvider };
