import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "CLICK.COM del Caribe",
  description: "Sistema de reparaciÃ³n, seguimiento y administraciÃ³n de servicios tÃ©cnicos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${inter.variable}`}>{children}</body>
    </html>
  );
}
