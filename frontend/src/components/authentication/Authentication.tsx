"use client";

import React, { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import apiClient from "@/apiClient/apiClient";
import { useRecoilState, useSetRecoilState } from "recoil";
import AuthenticationState from "@/recoil/authentication/authAtom";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import NotificationState from "@/recoil/notification/notificationAtom";

export enum AuthType {
  login,
  signup,
}

export type AuthData = {
  name?: string;
  email: string;
  password: string;
};

type Props = {
  target: "login" | "signup";
};

function Authentication({ target }: Props) {
  const [auth, setAuth] = useRecoilState(AuthenticationState);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const setNotifications = useSetRecoilState(NotificationState);

  const onSubmit = async (credentials: AuthData) => {
    setLoading(true);

    try {
      const { data, statusText } = await apiClient.post(
        `/api/authentication/${target}`,
        credentials
      );

      if (statusText === "OK") {
        localStorage.setItem("user", JSON.stringify(data.data[0]));
        setLoading(false);

        setAuth({
          isAuthenticated: true,
          user: {
            name: data.data[0].name,
            email: data.data[0].email,
            id: data.data[0].id,
          },
        });
        router.push("/");
      }
    } catch (error: any) {
      setNotifications((prev) => {
        return {
          notifications: [
            ...prev.notifications,
            {
              text: error?.response?.data?.message ?? error?.message ?? "",
              type: "error",
            },
          ],
        };
      });
    }
    setLoading(false);
  };

  return target == "login" ? (
    <LoginForm onSubmit={onSubmit} loading={loading} />
  ) : (
    <SignupForm onSubmit={onSubmit} loading={loading} />
  );
}

export default Authentication;
