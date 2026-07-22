import "./globals.css";
import { Sora, Inter } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "PLATIFY — Del Plato a la Boca se Cae el Margen",
  description: "Análisis inteligente para restaurantes. Conoce tu margen real por platillo, en tiempo real. Datos reales, márgenes visibles, ganancias inteligentes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
