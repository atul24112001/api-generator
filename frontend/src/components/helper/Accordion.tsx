import { ChevronDown, ChevronRight } from "lucide-react";
import React, { PropsWithChildren, ReactNode, useState } from "react";

type Props = {
  header: string;
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
        <div className="font-semibold  flex justify-between items-center rounded-md py-2 px-4 bg-primary-light-4 text-xl mt-4">
          <div> {header}</div>
          {open ? <ChevronDown /> : <ChevronRight />}
        </div>
      </div>
      {open && children}
    </div>
  );
}

export default Accordion;
