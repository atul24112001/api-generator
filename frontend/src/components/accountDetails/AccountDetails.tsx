"use client";

import React, { useEffect, useState } from "react";
import TextField from "../helper/TextField";
import IconsButton from "../helper/IconsButton";
import { Check, Copy } from "lucide-react";
import { useClipboard } from "@mantine/hooks";
import DataState from "@/recoil/data/dataAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import apiClient from "@/apiClient/apiClient";
import Loading from "../helper/Loading";

type Props = {};

function AccountDetails({}: Props) {
  const clipboard = useClipboard();
  const [copied, setCopied] = useState(false);
  const [data, setData] = useRecoilState(DataState);
  const [loading, setLoading] = useState(!data.currentPlane);

  useEffect(() => {
    (async () => {
      if (!data.currentPlane) {
        try {
          const { data: response } = await apiClient.get(
            `/api/account-details`
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
        } catch (error) {
          if (error instanceof Error) {
            console.log(error.message);
          }
        }
      }
    })();
  }, []);

  return loading ? (
    <div className="flex justify-center items-center mt-4">
      <Loading size="large" />
    </div>
  ) : (
    <div className="mt-8  rounded-md">
      <div className=" mb-6 py-2 px-4 bg-primary-light-2 rounded-md">
        {data.currentPlane?.subscriptionType == "free" && (
          <>
            <div className="font-bold text-xl">
              <span className="text-primary-light">
                Requests Remaining in free trial
              </span>{" "}
              - {data.currentPlane?.requestsRemaining}
            </div>
            <div className="font-bold text-xl">
              <span className="text-primary-light">
                Max no. of Projects that can be created
              </span>{" "}
              - 1
            </div>
          </>
        )}
        {data.currentPlane?.subscriptionType != "free" && (
          <>
            <div className="font-bold text-xl">
              <span className="text-primary-light">Subscription type</span> -{" "}
              {data.currentPlane?.subscriptionType}
            </div>
            <div className="font-bold text-xl">
              <span className="text-primary-light">Requests Remaining</span> -{" "}
              {data.currentPlane?.requestsRemaining}
            </div>
            {data.currentPlane?.subscriptionType == "premium" ? (
              <div className="font-bold text-xl">
                <span className="text-primary-light">
                  Max no. of Projects that can be created
                </span>{" "}
                - Unlimited
              </div>
            ) : (
              <div className="font-bold text-xl">
                <span className="text-primary-light">
                  Max no. of Projects that can be created
                </span>{" "}
                - Unlimited
              </div>
            )}
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
