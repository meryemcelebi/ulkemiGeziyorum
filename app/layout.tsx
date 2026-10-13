import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ülkemi Geziyorum | Türkiye Keşif Platformu",
  description: "Türkiye belediye açık veri portallarından derlenen tarihi yapılar, müzeler, 81 il rehberi ve rotalar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 font-sans-main antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
