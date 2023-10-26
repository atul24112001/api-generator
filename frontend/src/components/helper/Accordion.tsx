import React, { PropsWithChildren, ReactNode, useState } from "react";

type Props = {
  header: ReactNode;
};

function Accordion({ children, header }: PropsWithChildren<Props>) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        className="cursor-pointer"
      >
        {header}
      </div>
      {open && children}
    </div>
  );
}

export default Accordion;
