import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RecoilRoot } from "recoil";
import RecoilContextProvider from "@/components/helper/RecoilContextProvider";
import LayoutComponent from "@/components/layout/LayoutComponent";
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "API Generator",
  description: "Platform to create api's for your project.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let hasCookie = true;
  let error = true;
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get("token");
    if (cookie?.value) {
      await axios.get(`${process.env.API_URL}/api/authentication/verify`, {
        headers: {
          Authorization: `Bearer ${cookie.value}`,
        },
      });
      error = false;
      redirect("/");
    } else {
      hasCookie = false;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilContextProvider>
          <LayoutComponent error={error} hasCookie={hasCookie}>
            {children}
          </LayoutComponent>
        </RecoilContextProvider>
      </body>
    </html>
  );
}
