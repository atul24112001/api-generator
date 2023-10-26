"use client";

import React, { useEffect, useState } from "react";
import TextField from "../helper/TextField";
import IconsButton from "../helper/IconsButton";
import { Check, Copy } from "lucide-react";
import { useClipboard } from "@mantine/hooks";
import DataState, { AccountDetails } from "@/recoil/data/dataAtom";
import { useRecoilState, useSetRecoilState } from "recoil";

type Props = {
  accountDetails: AccountDetails | null;
};

function AccountDetails({ accountDetails }: Props) {
  const clipboard = useClipboard();
  const [copied, setCopied] = useState(false);
  const setData = useSetRecoilState(DataState);

  console.log({ accountDetails });

  useEffect(() => {
    if (accountDetails) {
      setData((prev) => {
        return {
          ...prev,
          currentPlane: accountDetails,
        };
      });
    }
  }, [accountDetails]);

  return (
    <div className="mt-8  rounded-md">
      <div className=" mb-6 py-2 px-4 bg-primary-light-2 rounded-md">
        {accountDetails?.subscriptionType == "free" && (
          <>
            <div className="font-bold text-xl">
              <span className="text-primary-light">
                Requests Remaining in free trial
              </span>{" "}
              - {accountDetails?.requestsRemaining}
            </div>
            <div className="font-bold text-xl">
              <span className="text-primary-light">
                Max no. of Projects that can be created
              </span>{" "}
              - 1
            </div>
          </>
        )}
        {accountDetails?.subscriptionType != "free" && (
          <>
            <div className="font-bold text-xl">
              <span className="text-primary-light">Subscription type</span> -{" "}
              {accountDetails?.subscriptionType}
            </div>
            <div className="font-bold text-xl">
              <span className="text-primary-light">Requests Remaining</span> -{" "}
              {accountDetails?.requestsRemaining}
            </div>
            {accountDetails?.subscriptionType == "premium" ? (
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
        value={accountDetails?.secret}
        suffix={
          <IconsButton
            onClick={() => {
              if (accountDetails?.secret) {
                clipboard.copy(accountDetails.secret);
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
