"use client";

import React, { useEffect, useState } from "react";
import Button from "../helper/Button";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import DataState from "@/recoil/data/dataAtom";
import useRazorpay from "react-razorpay";
import AuthenticationState from "@/recoil/authentication/authAtom";
import { useAxios } from "@/apiClient/apiClient";
import Loading from "../helper/Loading";
import { CheckCircle, XCircle } from "lucide-react";
import NotificationState from "@/recoil/notification/notificationAtom";

type Props = {};

function Plans({}: Props) {
  const [Razorpay] = useRazorpay();
  const [data, setData] = useRecoilState(DataState);
  const [authData] = useRecoilState(AuthenticationState);
  const { apiClient } = useAxios();

  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const auth = useRecoilValue(AuthenticationState);

  const setNotifications = useSetRecoilState(NotificationState);

  useEffect(() => {
    (async () => {
      if (!data.currentPlane && auth.isAuthenticated) {
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

  const handlePayment = async (plan: {
    price: number;
    title: string;
    type: string;
    benefits: any;
  }) => {
    setProcessingPayment(true);
    try {
      const { data: key } = await apiClient.get("/api/payment/key");
      const { data: order } = await apiClient.post("/api/payment/create", {
        amount: plan.price,
        subscriptionType: plan.type,
        secret: process.env.SECRET,
      });

      const rzp1 = new Razorpay({
        key: key.data[0],
        amount: `${plan.price * 100}`,
        currency: "INR",
        name: "API Generator",
        description: `Payment for ${plan.type} subscription.`,
        order_id: order.data[0].id,
        prefill: {
          name: authData.user?.name,
          email: authData.user?.email,
          contact: "9999999999",
        },
        theme: {
          color: "green",
        },
        //   callback_url: ""
        handler: async function (response: any) {
          try {
            const { data } = await apiClient.post("/api/payment/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            setData((prev) => {
              const updated = JSON.parse(JSON.stringify(prev));
              updated.currentPlane = data[0];

              return updated;
            });
            setProcessingPayment(false);
            setPaymentSuccess(true);
            setTimeout(() => {
              setPaymentSuccess(false);
            }, 5000);
          } catch (error) {
            console.log(error);
          }
        },
      });

      rzp1.on("payment.failed", async function (response: any) {
        try {
          const { data } = await apiClient.post(
            "/api/payment/payment-details",
            {
              order_id: response.error.metadata.order_id,
              payment_id: response.error.metadata.payment_id,
              reason: response.error.reason,
              step: response.error.step,
              description: response.error.description,
              status: "failure",
              amount: plan.price * 100,
            }
          );

          setProcessingPayment(false);
          setPaymentError(true);
          setTimeout(() => {
            setPaymentError(false);
          }, 5000);
        } catch (error) {
          console.log(error);
        }
      });
      rzp1.open();
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
      console.log(error);
    }
  };

  return processingPayment || paymentSuccess || paymentError ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-background-primary pt-10">
      {paymentError ? (
        <>
          <div className="text-center text-3xl text-white mb-4">
            Sorry, Payment Unsuccessful
          </div>
          <div className="flex justify-center">
            <XCircle size={48} color="#fa1b2e" />
          </div>
        </>
      ) : paymentSuccess ? (
        <>
          <div className="text-center text-3xl text-white mb-4">
            Payment Successful
          </div>
          <div className="flex justify-center">
            <CheckCircle size={48} color="#06ab03" />
          </div>
        </>
      ) : (
        <>
          <div className="text-center text-3xl text-white mb-4">
            Processing Payment
          </div>
          <div className="flex justify-center">
            <Loading size="large" />
          </div>
        </>
      )}
    </div>
  ) : (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      {Data.map((subs, index) => {
        return (
          <div
            className={` ${
              index == 1
                ? "scale-105  bg-background-secondary"
                : "bg-primary-light-5"
            } flex-1  rounded-md p-4`}
            key={`${index + 1}`}
          >
            <div className="font-bold text-center text-2xl mb-2">
              {subs.title}
            </div>
            {subs.benefits.map((benefit, jndex) => {
              return (
                <div
                  key={`${index + 1}-${jndex + 1}`}
                  className="font-semibold  text-md"
                >
                  {jndex + 1}. {benefit}
                </div>
              );
            })}
            <div className="flex justify-center mt-4">
              {data.currentPlane?.subscriptionType != "premium" && (
                <Button
                  fullWidth
                  onClick={() => {
                    if (
                      subs.type != data.currentPlane?.subscriptionType &&
                      subs.type != "free"
                    ) {
                      handlePayment(subs);
                    }
                  }}
                >
                  {subs.type == data.currentPlane?.subscriptionType
                    ? "Current Plane"
                    : `₹ ${subs.price || "Free"}`}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Plans;

const Data = [
  {
    price: 0,
    title: "Basic",
    type: "free",
    benefits: ["Total 50 CURD operations", "1 Project Maximum"],
  },
  {
    price: 5000,
    title: "Premium",
    type: "premium",
    benefits: ["Total 1 million CURD operations", "Unlimited Projects."],
  },
  {
    price: 1000,
    title: "Standard",
    type: "standard",
    benefits: ["Total 100k CURD operations", "10 Projects Maximum."],
  },
];
