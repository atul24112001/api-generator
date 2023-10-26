import React, { PropsWithChildren } from "react";

type Props = {
  onClick: () => void;
};

function IconsButton({ children, onClick }: PropsWithChildren<Props>) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="p-1 hover:shadow-sm rounded-full hover:bg-slate-600"
    >
      {children}
    </button>
  );
}

export default IconsButton;
