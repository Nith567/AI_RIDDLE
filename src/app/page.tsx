"use client";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { Body } from "@/components/Body";

export default function Home() {
  useEffect(() => {}, []);

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <Body />
      <Footer />
    </div>
  );
}
