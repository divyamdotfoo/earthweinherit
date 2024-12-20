import { Navbar } from "@/components/navbar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" w-full">
      <Navbar />
      {children}
    </div>
  );
}
