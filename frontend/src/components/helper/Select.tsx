import React, { useState } from "react";
import { useClickOutside } from "@mantine/hooks";

type Value = {
  label: string;
  value: string;
};

type Props = {
  value?: Value;
  options: Value[];
  name: string;
  placeholder?: string;
  onChange: (name: string, value: Value) => void;
};

function Select({ value, options, onChange, name, placeholder }: Props) {
  const [showOptions, setShowOptions] = useState(false);
  const ref = useClickOutside(() => setShowOptions(false));

  return (
    <div
      ref={ref}
      onClick={() => {
        console.log("click");
        setShowOptions(true);
      }}
      className="bg-background-secondary mt-1 py-2 px-3 rounded-md relative min-w-[100px] mb-4"
    >
      {value ? (
        <div>{value.label} </div>
      ) : (
        <div className="opacity-60">{placeholder ?? "Select Type"}</div>
      )}
      {showOptions && (
        <div className="absolute mt-1 top-full left-0 bg-background-secondary rounded-md right-0 max-h-96 overflow-auto">
          {options.map((option) => {
            return (
              <div
                className="py-2  px-4 cursor-pointer hover:bg-primary-light-3"
                key={option.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(name, option);
                  setShowOptions(false);
                }}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Select;
