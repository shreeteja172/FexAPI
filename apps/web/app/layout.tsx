import type { Metadata } from "next";
import { Slabo_27px } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var stored=localStorage.getItem("theme");var theme=stored==="dark"||stored==="light"?stored:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",theme);}catch(e){}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
