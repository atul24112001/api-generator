import React, { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { startCase } from "lodash";

type Props = {
  name: string;
  border?: boolean;
  suffix?: ReactNode;
  title?: string;
  message?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const TextField = forwardRef<HTMLInputElement, Props>(
  ({ name, border = false, title, suffix, message, ...rest }, ref) => {
    return (
      <div className="mb-4">
        {title && <div>{title}</div>}
        <div
          style={{
            borderWidth: border ? "2px" : 0,
          }}
          className={`bg-background-secondary flex gap-2 mt-1 py-2 px-3 rounded-md  border-primary-light`}
        >
          <input
            className="bg-background-secondary active:bg-background-secondary w-full border-none active:outline-none focus:outline-none"
            id={name}
            ref={ref}
            placeholder={`Enter ${name}`}
            {...rest}
          />
          {suffix}
        </div>
        {message && (
          <div className="text-right text-red-500 opacity-80 text-sm">
            {message}
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
