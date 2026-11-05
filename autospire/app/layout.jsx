import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
const font = Plus_Jakarta_Sans({ subsets: ["latin"] });
export const metadata = {
  title: "Autospire — Your Complete Automotive Services Marketplace in the UAE",
  description: "Compare garages, get competitive quotes and book car services with confidence across the UAE.",
};
export default function RootLayout({ children }) {
  return (<html lang="en" translate="no"><body className={font.className}>{children}</body></html>);
}
