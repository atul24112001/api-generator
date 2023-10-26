import Logo from "@/components/helper/Logo";
import React from "react";
import Authentication from "@/components/authentication/Authentication";

export default function Login() {
  return (
    <main className="flex  flex-col items-center h-screen">
      <div className="mt-16 mb-12">
        <Logo />
      </div>
      <div className="bg-background-secondary  p-4 rounded-md w-11/12 md:w-1/2 lg:w-1/3">
        <h2 className="text-center  text-3xl font-semibold mb-4">Login</h2>
        <Authentication target="login" />
      </div>
    </main>
  );
}
