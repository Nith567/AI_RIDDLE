"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { useEffect } from "react";

export function Header() {
  const account = useAccount();

  useEffect(() => {}, []);

  return (
    <header className="px-4 lg:px-6 h-20 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <Image
            src="/chainQuests.png"
            alt="App Logo"
            width={50}
            height={50}
            priority
            className="rounded-lg"
          />
          <span className="ml-2 text-2xl font-bold text-white bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">
            AI-Riddle
          </span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {!account?.address ? (
          <ConnectButton />
        ) : (
          <>
            <ConnectButton />
          </>
        )}
      </div>
    </header>
  );
}
