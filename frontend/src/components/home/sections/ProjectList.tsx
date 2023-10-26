import apiClient from "@/apiClient/apiClient";
import IconsButton from "@/components/helper/IconsButton";
import Loading from "@/components/helper/Loading";
import DataState, { DataStateType } from "@/recoil/data/dataAtom";
import { Edit, Trash } from "lucide-react";
import React, { useState } from "react";
import { useRecoilState } from "recoil";

type Props = {};

function ProjectList({}: Props) {
  const [data, setData] = useRecoilState(DataState);
  const [deletingAPi, setDeletingAPi] = useState<number | null>(null);

  const deleteProjectHandler = async (id: number) => {
    setDeletingAPi(id);
    try {
      await apiClient.delete(`/api/project/${id}`);
      setData((currentValue) => {
        const updatedValue: DataStateType = JSON.parse(
          JSON.stringify(currentValue)
        );

        updatedValue.projects = updatedValue.projects.filter(
          (api) => api.id != id
        );
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
      {data.projects.map((project, index) => {
        return (
          <div
            onClick={() => {
              setData((prev) => {
                const updatedState = JSON.parse(JSON.stringify(prev));
                updatedState.activeProject = project;
                return updatedState;
              });
            }}
            className="flex justify-between items-center cursor-pointer py-2 px-4 rounded-md  hover:bg-primary-light-2"
            key={`${project.id}-${index}`}
          >
            <div>{project.title}</div>
            <div>
              <IconsButton
                onClick={() => {
                  deleteProjectHandler(project.id);
                }}
              >
                {deletingAPi === project.id ? (
                  <Loading />
                ) : (
                  <Trash size={18} className="text-red-500" />
                )}
              </IconsButton>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProjectList;
