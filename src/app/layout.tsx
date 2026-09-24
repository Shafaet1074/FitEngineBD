import type { Metadata } from "next";
import "./globals.css"; // Ensure you have your global CSS imported

export const metadata: Metadata = {
  title: "FitEngine",
  description: "Enterprise Gym Management OS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        {children}
      </body>
    </html>
  );
}