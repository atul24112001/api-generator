import React, { useMemo } from "react";

type Props = {
  size?: "small" | "medium" | "large";
};

const Loading = ({ size = "small" }: Props) => {
  const classes = useMemo(() => {
    if (size == "medium") {
      return "w-8 h-8 border-t-4 border-l-4 border-white border-solid rounded-full animate-spin";
    }
    if (size == "large") {
      return "w-10 h-10 border-t-4 border-l-4 border-white border-solid rounded-full animate-spin";
    }
    return "w-5 h-5 border-t-4 border-l-4 border-white border-solid rounded-full animate-spin";
  }, [size]);
  return <div className={classes}></div>;
};

export default Loading;
