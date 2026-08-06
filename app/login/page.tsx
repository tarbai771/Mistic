"use client";

import { LoginComponent } from "@/components/login";

export default function Login() {
  return (
    <div className="flex h-screen w-screen justify-center items-center overflow-hidden bg-[#0B0B0C] text-foreground select-none relative">
      <LoginComponent />
    </div>
  );
}
