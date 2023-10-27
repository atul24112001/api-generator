"use client";
import React, { useEffect, useRef, useState } from "react";
import Button from "../helper/Button";
import { ArrowLeft, Delete, Edit, Plus, Trash } from "lucide-react";
import Model from "../helper/Model";
import TextField from "../helper/TextField";
import apiClient from "@/apiClient/apiClient";
import { useRecoilState, useSetRecoilState } from "recoil";
import DataState, { DataStateType } from "@/recoil/data/dataAtom";
import IconsButton from "../helper/IconsButton";
import Loading from "../helper/Loading";
import ApiList from "./sections/ApiList";
import EditApi from "./sections/EditApi";
import ProjectList from "./sections/ProjectList";
import NotificationState from "@/recoil/notification/notificationAtom";

type Props = {
  finalData: any;
};

function HomeComponent({ finalData }: Props) {
  const titleRef = useRef<HTMLInputElement>(null);

  const [openCreateModel, setOpenCreateModel] = useState(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [updatingModel, setUpdatingModel] = useState(false);
  const [data, setData] = useRecoilState(DataState);
  const [model, setModel] = useState({});
  const [loading, setLoading] = useState(true);

  const setNotifications = useSetRecoilState(NotificationState);

  const toggleCreateModel = () => {
    setOpenCreateModel((prev) => !prev);
  };

  useEffect(() => {
    let projectData = finalData;
    (async () => {
      try {
        if (!projectData) {
          const { data } = await apiClient.get(
            `${process.env.API_URL}/api/project`
          );
          projectData = data.data;
        }
        if (projectData) {
          setData((currentValue) => {
            const updatedValue: DataStateType = JSON.parse(
              JSON.stringify(currentValue)
            );

            updatedValue.projects = projectData;
            return updatedValue;
          });
          setLoading(false);
        }
      } catch (error: any) {
        setNotifications((prev) => {
          return {
            notifications: [
              ...prev.notifications,
              {
                text: error?.response?.data?.message ?? error?.message ?? "",
                type: "error",
              },
            ],
          };
        });
      }
    })();
  }, [finalData]);

  const createHandler = async () => {
    if (titleRef.current) {
      setCreating(true);

      try {
        const { data: response } = await apiClient.post(
          data.activeProject
            ? `/api/api-generator/${data.activeProject.id}`
            : "/api/project",
          {
            title: titleRef.current.value,
          }
        );
        setData((currentValue) => {
          const updatedValue: DataStateType = JSON.parse(
            JSON.stringify(currentValue)
          );
          if (data.activeProject) {
            updatedValue.apis = {
              ...data.apis,
              [data.activeProject.id]: [
                response.data[0],
                ...(updatedValue.apis[data.activeProject.id] ?? []),
              ],
            };
          } else {
            updatedValue.projects = [
              ...updatedValue.projects,
              ...response.data,
            ];
          }
          return updatedValue;
        });
        toggleCreateModel();
      } catch (error: any) {
        setNotifications((prev) => {
          return {
            notifications: [
              ...prev.notifications,
              {
                text: error?.response?.data?.message ?? error?.message ?? "",
                type: "error",
              },
            ],
          };
        });
        console.log(error);
      }

      setCreating(false);
      titleRef.current.value = "";
    }
  };

  const updateHandler = async (model: any, id: number) => {
    setUpdatingModel(true);
    delete model["id"];
    delete model["createdAt"];
    delete model["updatedAt"];
    try {
      const { data: response } = await apiClient.patch(
        `/api/api-generator/${data.activeProject?.id}/${id}`,
        {
          model,
        }
      );
      setData((prev) => {
        const updatedData = JSON.parse(JSON.stringify(prev));
        updatedData.apiModels[id] = response.data[0];
        return updatedData;
      });
    } catch (error: any) {
      setNotifications((prev) => {
        return {
          notifications: [
            ...prev.notifications,
            {
              text: error?.response?.data?.message ?? error?.message ?? "",
              type: "error",
            },
          ],
        };
      });
      console.log(error);
    }
    setUpdatingModel(false);
  };

  const backHandler = () => {
    setData((prev) => {
      const updatedData = JSON.parse(JSON.stringify(prev));
      if (prev.activeApi) {
        updatedData.activeApi = null;
      } else if (prev.activeProject) {
        updatedData.activeProject = null;
      }
      return updatedData;
    });
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between">
        <div className="flex gap-4 items-center">
          {(data.activeProject || data.activeApi) && (
            <IconsButton onClick={backHandler}>
              <ArrowLeft />
            </IconsButton>
          )}
          <h4 className="text-xl">
            {data.activeProject
              ? data.activeApi
                ? `${data.activeProject.title} - ${data.activeApi.title}`
                : `${data.activeProject.title} api's`
              : "Your projects"}
          </h4>
        </div>
        {data.activeApi ? (
          <Button
            onClick={() => {
              if (data.activeApi) {
                updateHandler(model, data.activeApi.id);
              }
            }}
            loading={updatingModel}
          >
            Update
          </Button>
        ) : (
          <Button onClick={toggleCreateModel}>
            {data.activeProject ? "Api" : "Project"} <Plus size={20} />
          </Button>
        )}
      </div>
      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <Loading size="large" />
        </div>
      ) : data.activeProject ? (
        data.activeApi ? (
          <EditApi model={model} setModel={setModel} />
        ) : (
          <ApiList setLoading={setLoading} />
        )
      ) : (
        <ProjectList />
      )}

      <Model
        title={data.activeProject ? "Create Api" : "Create Project"}
        onCancel={toggleCreateModel}
        open={openCreateModel}
        footer={
          <>
            <Button loading={creating} onClick={createHandler}>
              Create
            </Button>
          </>
        }
      >
        <TextField name="title" ref={titleRef} />
      </Model>
    </div>
  );
}

export default HomeComponent;
