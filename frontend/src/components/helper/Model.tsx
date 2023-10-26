import React, { EventHandler, PropsWithChildren, ReactNode } from "react";
import IconsButton from "./IconsButton";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onCancel: () => void;
  title: string;
  footer: ReactNode;
};

function Model({
  children,
  open,
  onCancel,
  title,
  footer,
}: PropsWithChildren<Props>) {
  return open ? (
    <div
      onClick={onCancel}
      className="fixed top-0 left-0 right-0 bottom-0 bg-primary-light-1 flex justify-center items-center"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-background-secondary rounded-md p-4 w-4/5 md:w-1/2 lg:w-1/3"
      >
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-bold">{title}</h5>
          <IconsButton onClick={onCancel}>
            <X />
          </IconsButton>
        </div>
        {children}
        <div className="flex justify-end items-center gap-4">{footer}</div>
      </div>
    </div>
  ) : null;
}

export default Model;
