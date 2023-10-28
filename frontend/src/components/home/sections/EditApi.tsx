import apiClient from "@/apiClient/apiClient";
import Accordion from "@/components/helper/Accordion";
import Button from "@/components/helper/Button";
import IconsButton from "@/components/helper/IconsButton";
import Loading from "@/components/helper/Loading";
import JsonEditor from "@/components/helper/jsonEditor/JsonEditor";
import DataState from "@/recoil/data/dataAtom";
import NotificationState from "@/recoil/notification/notificationAtom";
import { useClipboard } from "@mantine/hooks";
import { ArrowLeft, Check, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import Endpoint from "./Endpoint";

type Props = {
  model: any;
  setModel: (model: any) => void;
};

const apiURL = process.env.BASE_API_URL;

function EditApi({ model, setModel }: Props) {
  const [data, setData] = useRecoilState(DataState);
  const [loading, setLoading] = useState(true);
  const clipboard = useClipboard();
  const setNotifications = useSetRecoilState(NotificationState);

  const endpoints = useMemo(() => {
    return [
      {
        mode: "GET",
        endpoint: `${apiURL}/api/data/${data.activeProject?.id}/${data.activeApi?.title}`,
      },
      {
        mode: "POST",
        endpoint: `${apiURL}/api/data/${data.activeProject?.id}/${data.activeApi?.title}`,
      },
      {
        mode: "PATCH",
        endpoint: `${apiURL}/api/data/${data.activeProject?.id}/${data.activeApi?.title}/:id`,
      },
      {
        mode: "DELETE",
        endpoint: `${apiURL}/api/data/${data.activeProject?.id}/${data.activeApi?.title}/:id`,
      },
    ];
  }, []);

  useEffect(() => {
    if (data.activeApi?.id) {
      if (data.apiModels[data.activeApi.id]) {
        setModel(data.apiModels[data.activeApi.id].model);
        setLoading(false);
      } else {
        (async () => {
          try {
            const { data: modelData } = await apiClient.get(
              `/api/api-generator/${data.activeProject?.id}/${data.activeApi?.id}`
            );
            setModel(modelData.data[0].model);
            setData((prev) => {
              const updatedData = JSON.parse(JSON.stringify(prev));
              updatedData.apiModels[data.activeApi?.id ?? 0] =
                modelData.data[0];
              return updatedData;
            });
          } catch (error: any) {
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
            console.log(error);
          }
          setLoading(false);
        })();
      }
    }
  }, [data.activeApi]);

  return (
    <div>
      <Accordion
        header={
          <div className="font-semibold text-center rounded-md py-2 bg-primary-light-4 text-xl mt-4">
            Endpoints
          </div>
        }
      >
        <div className="mt-2">
          {endpoints.map((endpoint) => {
            return <Endpoint endpoint={endpoint} key={endpoint.mode} />;
          })}
        </div>
      </Accordion>
      <Accordion
        header={
          <div className="font-semibold  text-center rounded-md py-2 bg-primary-light-4 text-xl mt-4">
            Model
          </div>
        }
      >
        {loading ? (
          <div className="flex justify-center">
            <Loading size="medium" />
          </div>
        ) : (
          <JsonEditor data={model} onChange={setModel} />
        )}
        <div className="mt-2 opacity-70">
          Note: Please don&apos;t add{" "}
          <span className="font-bold">&lsquo;id&rsquo;</span>,{" "}
          <span className="font-bold">&lsquo;updatedAt&rsquo;</span> and{" "}
          <span className="font-bold">&lsquo;createdAt&rsquo;</span> fields this
          will be automatically added with schema.
        </div>
      </Accordion>
    </div>
  );
}

export default EditApi;
