import Providers from "@/components/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI-RIDDLE-CONTEST ON ARBITRUM",
  description:
    "Contest AI-Riddle-Quest from an AI model, participate and win Big on Arbitrum Chain",
  icons: ["/logo/logo-dark.png"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark:bg-black`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
