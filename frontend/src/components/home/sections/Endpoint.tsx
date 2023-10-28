import IconsButton from "@/components/helper/IconsButton";
import { useClipboard } from "@mantine/hooks";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";

type Props = {
  endpoint: { mode: String; endpoint: string };
};

function Endpoint({ endpoint }: Props) {
  const clipboard = useClipboard();
  const [copied, setCopied] = useState(false);

  return (
    <div className="mt-2 mb-4">
      <div className="text-md font-semibold">{endpoint.mode}</div>
      <div className="bg-background-secondary flex items-center justify-between rounded-md mt-1 py-2 px-4">
        <div>{endpoint.endpoint}</div>
        <IconsButton
          onClick={() => {
            clipboard.copy(endpoint.endpoint);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          }}
        >
          {copied ? <Check size={18} color="green" /> : <Copy size={18} />}
        </IconsButton>
      </div>
    </div>
  );
}

export default Endpoint;
