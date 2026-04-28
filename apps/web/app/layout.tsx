import type { Metadata } from "next";
import { Slabo_27px } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});
const slabo = Slabo_27px({
  weight: "400",
  variable: "--font-slabo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FexAPI",
  description: "High-performance API mocking infrastructure for product teams.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${slabo.variable} bg-[var(--background)] text-[var(--foreground)] antialiased`}
      >
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var stored=localStorage.getItem("theme");var theme=stored==="dark"||stored==="light"?stored:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",theme);}catch(e){}})();`,
          }}
        />
        <Script
          src="https://cloud.umami.is/script.js"
          strategy="afterInteractive"
          data-website-id="7657ae83-0855-488f-864d-f7e168ff0612"
        />
        {children}
      </body>
    </html>
  );
}
