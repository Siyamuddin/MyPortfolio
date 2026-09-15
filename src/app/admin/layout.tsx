import { Poppins } from "next/font/google";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`${poppins.variable} font-sans`}>{children}</div>;
}
