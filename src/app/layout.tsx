import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Jost } from "next/font/google";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),

  title: "Ravelle | Premium Lifestyle & Beauty",
  description:
    "Explore the finest collection of cosmetics, jewelry, watches, and perfumes at Ravelle.",
  keywords: [
    "cosmetics",
    "jewelry",
    "watches",
    "perfumes",
    "luxury lifestyle",
    "Ravelle BD",
  ],

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  openGraph: {
    title: "Ravelle",
    description: "Premium Lifestyle Brand",
    siteName: "Ravelle",
    images: [
      {
        url: "/ravelle_logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const jost = Jost({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jost",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${jost.className} antialiased`}
      >
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              color: "#1a1410",
              border: "1px solid rgba(0,0,0,0.08)",
              padding: "14px 18px",
              fontSize: "12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderRadius: "0px",
            },
          }}
        />
      </body>
    </html>
  );
}
