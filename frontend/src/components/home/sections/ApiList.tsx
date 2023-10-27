import apiClient from "@/apiClient/apiClient";
import IconsButton from "@/components/helper/IconsButton";
import Loading from "@/components/helper/Loading";
import DataState, { DataStateType } from "@/recoil/data/dataAtom";
import { Edit, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

type Props = {
  setLoading: (state: boolean) => void;
};

function ApiList({ setLoading }: Props) {
  const [data, setData] = useRecoilState(DataState);
  const [deletingAPi, setDeletingAPi] = useState<number | null>(null);

  useEffect(() => {
    if (data.activeProject && !data.apis[data.activeProject.id]) {
      setLoading(true);
      (async () => {
        try {
          const { data: response } = await apiClient.get(
            `/api/api-generator/${data.activeProject?.id}`
          );
          setData((prev) => {
            const updatedData: DataStateType = JSON.parse(JSON.stringify(prev));
            updatedData.apis[data.activeProject?.id ?? 0] = response.data;
            return updatedData;
          });
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      })();
    }
  }, [data.activeApi]);

  const deleteApiHandler = async (id: number) => {
    if (!data.activeProject) {
      return;
    }
    setDeletingAPi(id);
    try {
      await apiClient.delete(
        `/api/api-generator/${data.activeProject?.id}/${id}`
      );
      setData((currentValue) => {
        const updatedValue: DataStateType = JSON.parse(
          JSON.stringify(currentValue)
        );

        updatedValue.apis = {
          ...updatedValue.activeApi,
          [data.activeProject?.id ?? 0]: (
            updatedValue.apis[data.activeProject?.id ?? 0] ?? []
          ).filter((api) => api.id != id),
        };
        return updatedValue;
      });
    } catch (error) {
      console.log(error);
    }
    setDeletingAPi(null);
  };

  return (
    <div className="my-4">
      <div className="flex mb-2 justify-between items-center py-2 px-4 rounded-md  bg-primary-light-3">
        <div>Title</div>
        <div>Actions</div>
      </div>
      {(data.apis[data.activeProject?.id ?? 0] ?? []).length == 0 ? (
        <div className="text-center pt-5 opacity-60">No Apis, add one</div>
      ) : (
        (data.apis[data.activeProject?.id ?? 0] ?? []).map((api, index) => {
          return (
            <div
              onClick={() => {
                setData((prev) => {
                  const updatedState = JSON.parse(JSON.stringify(prev));
                  // updatedState. = api;
                  updatedState.activeApi = api;
                  return updatedState;
                });
              }}
              className="flex justify-between items-center cursor-pointer py-2 px-4 rounded-md  hover:bg-primary-light-2"
              key={`${api.id}-${index}`}
            >
              <div>{api.title}</div>
              <div>
                <IconsButton
                  onClick={() => {
                    deleteApiHandler(api.id);
                  }}
                >
                  {deletingAPi === api.id ? (
                    <Loading />
                  ) : (
                    <Trash size={18} className="text-red-500" />
                  )}
                </IconsButton>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ApiList;
