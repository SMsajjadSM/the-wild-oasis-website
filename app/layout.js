import "@/app/_styles/globals.css";
import Header from "./_components/Header";
import { Josefin_Sans } from "next/font/google";
import { ReservationProvider } from "./_components/ReservationContext";
export const metadata = {
  // title: "The Wild Oasis",
  title: {
    template: "%s / The Wild Oasis",
    default: " Welcome / The Wild Oasis ",
  },
  description:
    "Luxurious cabin Hotel, located in the heart of the Italian Dolomites, surrounded by beautiful mountain and dark forest",
};
const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} relative bg-primary-950 text-gray-50 min-h-screen flex flex-col`}
      >
        <Header />
        <div className="flex-1 px-8 py-12 grid">
          <main className="max-w-7xl w-full mx-auto">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
