import React, { ReactNode } from "react";
import Loading from "./Loading";

type Props = {
  onClick?: () => void;
  type?: "button" | "reset" | "submit";
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
};

function Button({
  onClick,
  type = "button",
  children,
  loading = false,
  fullWidth = false,
}: Props) {
  return (
    <button
      style={
        fullWidth
          ? {
              width: "100%",
            }
          : {}
      }
      className="bg-primary-light py-1 px-4 rounded-md flex gap-1 justify-center items-center"
      type={type}
      onClick={onClick}
    >
      {loading ? <Loading /> : children}
    </button>
  );
}

export default Button;
