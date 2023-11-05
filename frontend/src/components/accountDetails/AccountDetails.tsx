"use client";

import React, { useEffect, useState } from "react";
import TextField from "../helper/TextField";
import IconsButton from "../helper/IconsButton";
import { Check, Copy } from "lucide-react";
import { useClipboard } from "@mantine/hooks";
import DataState from "@/recoil/data/dataAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Loading from "../helper/Loading";
import NotificationState from "@/recoil/notification/notificationAtom";
import AuthenticationState from "@/recoil/authentication/authAtom";
import Endpoint from "../home/sections/Endpoint";
import { useAxios } from "@/apiClient/apiClient";

type Props = {};

function AccountDetails({}: Props) {
  const clipboard = useClipboard();
  const [copied, setCopied] = useState(false);
  const [data, setData] = useRecoilState(DataState);
  const [loading, setLoading] = useState(!data.currentPlane);
  const setNotifications = useSetRecoilState(NotificationState);
  const auth = useRecoilValue(AuthenticationState);

  const { apiClient } = useAxios();

  useEffect(() => {
    (async () => {
      if (!data.currentPlane && auth.isAuthenticated) {
        try {
          const { data: response } = await apiClient.get(
            `${process.env.API_URL}/api/account-details`
          );

          const accountDetails = response.data[0];
          if (accountDetails) {
            setData((prev) => {
              return {
                ...prev,
                currentPlane: accountDetails,
              };
            });
          }

          setLoading(false);
        } catch (error: any) {
          if (error instanceof Error) {
            setNotifications((prev) => {
              return {
                notifications: [
                  ...prev.notifications,
                  {
                    text:
                      error?.response?.data?.message ?? error?.message ?? "",
                    type: "error",
                  },
                ],
              };
            });
          }
        }
      }
    })();
  }, [auth.isAuthenticated]);

  return loading ? (
    <div className="flex justify-center items-center mt-4">
      <Loading size="large" />
    </div>
  ) : (
    <div className="mt-8  rounded-md">
      <div>
        {data.currentPlane?.subscriptionType == "free" && (
          <>
            <Endpoint
              endpoint={{
                mode: "Requests Remaining in free trial",
                endpoint: data.currentPlane?.requestsRemaining.toString() ?? "",
              }}
            />
            <Endpoint
              endpoint={{
                mode: " Max no. of Projects that can be created",
                endpoint: "1",
              }}
            />
          </>
        )}
        {data.currentPlane?.subscriptionType != "free" && (
          <>
            <Endpoint
              endpoint={{
                mode: "Subscription type",
                endpoint: data.currentPlane?.subscriptionType ?? "",
              }}
            />
            <Endpoint
              endpoint={{
                mode: "Requests Remaining",
                endpoint:
                  data.currentPlane?.requestsRemaining?.toString() ?? "",
              }}
            />
            <Endpoint
              endpoint={{
                mode: "Max no. of Projects that can be created",
                endpoint:
                  data.currentPlane?.subscriptionType == "premium"
                    ? "Unlimited"
                    : "10",
              }}
            />
          </>
        )}
      </div>

      <TextField
        name="secret"
        message="*Use this secret as Bearer token with you api, please don't share."
        title="Api Secret"
        value={data.currentPlane?.secret}
        suffix={
          <IconsButton
            onClick={() => {
              if (data.currentPlane?.secret) {
                clipboard.copy(data.currentPlane?.secret);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }
            }}
          >
            {copied ? <Check size={18} color="green" /> : <Copy size={18} />}
          </IconsButton>
        }
      />
    </div>
  );
}

export default AccountDetails;
