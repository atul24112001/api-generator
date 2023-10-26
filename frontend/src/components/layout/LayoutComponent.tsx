"use client";

import AuthenticationState from "@/recoil/authentication/authAtom";
import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import Button from "../helper/Button";
import { redirect, useRouter } from "next/navigation";
import { cookies } from "next/headers";
import {
  BadgeDollarSign,
  Home,
  LogOut,
  Menu,
  Settings2,
  User,
  X,
} from "lucide-react";
import Logo from "../helper/Logo";
import IconsButton from "../helper/IconsButton";
import Link from "next/link";
import ActiveLink from "../helper/ActiveLink";
import Loading from "../helper/Loading";
import Model from "../helper/Model";

const Routes = [
  {
    title: "Home",
    link: "/",
    icon: <Home />,
  },
  {
    title: "Account details",
    link: "/account-details",
    icon: <Settings2 />,
  },
  {
    title: "Pricing",
    link: "/pricing",
    icon: <BadgeDollarSign />,
  },
];

type Props = {
  hasCookie: boolean;
  error: boolean;
};

function LayoutComponent({
  children,
  hasCookie,
  error,
}: PropsWithChildren<Props>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const [auth, setAuth] = useRecoilState(AuthenticationState);

  useEffect(() => {
    const cache = localStorage.getItem("user");
    if (cache && hasCookie && !error) {
      const user = JSON.parse(cache);
      setAuth({
        isAuthenticated: true,
        user: {
          email: user.email,
          name: user.name,
          id: user.id,
        },
      });
    } else {
      setAuth({
        isAuthenticated: false,
        user: null,
      });
      router.push("/authentication/login");
    }
    setLoading(false);
  }, [error, hasCookie]);

  const logoutHandler = () => {
    localStorage.clear();
    setAuth({
      isAuthenticated: false,
      user: null,
    });
    router.push("/authentication/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const navigation = useMemo(() => {
    return (
      <div className="flex flex-col flex-1">
        <div className="flex-1 mt-8">
          {Routes.map((route, index) => {
            return (
              <ActiveLink
                key={`${index + 1}`}
                href={route.link}
                activeClassName="text-white  bg-opacity-20 hover:bg-opacity-30"
                className="flex mb-3 cursor-pointer text-primary-light bg-slate-400 justify-between bg-opacity-10 hover:bg-opacity-20   transition-all duration-200 py-2 px-4 rounded-md"
              >
                <span>{route.title}</span>
                {route.icon}
              </ActiveLink>
            );
          })}
        </div>
        <div
          onClick={logoutHandler}
          className="flex cursor-pointer  justify-between bg-red-500 bg-opacity-10 hover:bg-opacity-20 transition-all duration-200 py-2 px-4 rounded-md text-red-500"
        >
          <span> Logout</span>
          <LogOut size={22} />
        </div>
      </div>
    );
  }, []);

  return auth.isAuthenticated ? (
    <div className="lg:flex p-4 gap-4 items-center h-screen">
      {sidebarOpen ? (
        <nav className="lg:hidden p-4 flex flex-col bg-background-secondary fixed top-0 left-0 right-0 md:right-1/2 bottom-0">
          <div className=" flex justify-between items-center">
            <Logo />
            <IconsButton onClick={toggleSidebar}>
              <X />
            </IconsButton>
          </div>
          {navigation}
        </nav>
      ) : (
        <nav className="lg:hidden p-4 flex justify-between items-center">
          <div className="flex items-center gap-4 ">
            <button onClick={toggleSidebar}>
              <Menu />
            </button>
            <Logo />
          </div>
          <IconsButton onClick={() => {}}>
            <User size={24} />
          </IconsButton>
        </nav>
      )}

      <nav className=" p-4 hidden lg:flex flex-col bg-background-secondary h-full rounded-md w-1/5">
        <div className="flex justify-center">
          <Logo />
        </div>
        {navigation}
      </nav>

      <main className="h-full flex-1 flex flex-col">
        <div className="hidden bg-background-secondary rounded-md px-4 py-2 lg:flex justify-between items-center">
          <h3 className="text-xl font-semibold">Home</h3>
          <div className=" flex gap-2 items-center">
            <div className="">
              <div className="text-right text-md">{auth.user?.name}</div>
              <div className="text-right text-sm text-text-secondary">
                {auth.user?.email}
              </div>
            </div>
            <IconsButton onClick={() => {}}>
              <User size={32} />
            </IconsButton>
          </div>
        </div>
        <div className="overflow-auto px-4 py-2 flex-1">{children}</div>
      </main>
      {/* <Model
        open={!hasCookie}
        footer={
          <>
            <Button onClick={logoutHandler}>Logout</Button>
          </>
        }
        title="Session Expired!"
        onCancel={() => {}}
      ></Model> */}
    </div>
  ) : loading ? (
    <div className="w-screen h-screen flex justify-center items-center">
      <Loading />
    </div>
  ) : (
    <div>{children}</div>
  );
}

export default LayoutComponent;
