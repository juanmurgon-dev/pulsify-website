import "./globals.css";
import type { Metadata } from "next";
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

const SITIO = "https://platify-website.vercel.app";
const DESCRIPCION =
  "Platify es la app de análisis financiero para restaurantes: conoce tu margen real por platillo, tu punto de equilibrio y qué decisión tomar. No solo te dice tus números, te dice qué hacer. Beta $100 MXN/mes.";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: {
    default: "Platify — Del plato a la boca se cae el margen",
    template: "%s · Platify",
  },
  description: DESCRIPCION,
  keywords: [
    "análisis para restaurantes",
    "margen por platillo",
    "food cost",
    "punto de equilibrio restaurante",
    "costos de restaurante",
    "rentabilidad restaurante",
    "software para restaurantes México",
    "Platify",
  ],
  applicationName: "Platify",
  authors: [{ name: "Platify" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: SITIO,
    siteName: "Platify",
    title: "Platify — Del plato a la boca se cae el margen",
    description: DESCRIPCION,
    images: [{ url: "/brand/platify-logo.png", width: 2000, height: 2000, alt: "Platify" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Platify — Del plato a la boca se cae el margen",
    description: DESCRIPCION,
    images: ["/brand/platify-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Platify",
      url: SITIO,
      logo: `${SITIO}/brand/platify-logo.png`,
      description: DESCRIPCION,
      areaServed: "MX",
    },
    {
      "@type": "WebSite",
      name: "Platify",
      url: SITIO,
      inLanguage: "es-MX",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
