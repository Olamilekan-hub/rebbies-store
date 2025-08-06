import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rebbie's Store - Nigeria's Premier Fashion & Beauty Destination",
  description: "Discover luxury fashion bags, stunning jewelry, and premium fragrances. Shop thrift and new designer bags, African jewelry, and men's & women's fragrances.",
  keywords: "fashion bags, jewelry, fragrances, Nigeria, thrift bags, designer bags, African jewelry, men's cologne, women's perfume",
  authors: [{ name: "Rebbie's Store" }],
  openGraph: {
    title: "Rebbie's Store - Nigeria's Premier Fashion & Beauty Destination",
    description: "Discover luxury fashion bags, stunning jewelry, and premium fragrances.",
    type: "website",
    locale: "en_NG",
    siteName: "Rebbie's Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rebbie's Store",
    description: "Nigeria's Premier Fashion & Beauty Destination",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#7C3AED" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} antialiased bg-white text-gray-900 overflow-x-hidden`}>
        <div id="root" className="min-h-screen flex flex-col">
          {children}
        </div>
        
        {/* WhatsApp Business Chat Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href="https://wa.me/2348065776378?text=Hello%20Rebbie's%20Store!%20I'm%20interested%20in%20your%20products."
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-green rounded-full p-4 shadow-lg hover:scale-110 transition-transform duration-300 animate-bounce-subtle"
            aria-label="Chat on WhatsApp"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </a>
        </div>
      </body>
    </html>
  );
}