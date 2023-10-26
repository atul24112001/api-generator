import React from "react";
import IconsButton from "../IconsButton";
import { ChevronDown, ChevronRight, Edit, Edit2, Trash2 } from "lucide-react";

type Props = {
  title: string;
  type: string;
  deleteFieldHandler: (path: string) => void;
  path: string;
  currentPath: string;
  setCurrentPath: (path: string) => void;
  toggleView: () => void;
  view: boolean;
  optional: boolean;
  setEdit: (path: string, title: string, type: string, opt: boolean) => void;
  setEditing: (editing: boolean) => void;
};

function KeyValue({
  title,
  type,
  deleteFieldHandler,
  path,
  currentPath,
  setCurrentPath,
  toggleView,
  view,
  setEdit,
  setEditing,
  optional,
}: Props) {
  return (
    <div
      onClick={() => {
        if (type == "object") {
          setCurrentPath(`${path}.properties`);
        } else if (type == "array") {
          setCurrentPath(`${path}.items.properties`);
        } else {
          const newPath = path.split(".");
          newPath.pop();
          setCurrentPath(newPath.join("."));
        }
        setEditing(false);
      }}
      className={`flex justify-between items-center gap-4  mb-1 py-1 px-3 border-[1px] border-transparent hover:border-white cursor-pointer rounded-md 
      ${currentPath == path ? "bg-background-primary" : ""} `}
    >
      {type == "object" || type == "array" ? (
        view ? (
          <ChevronDown
            onClick={(e) => {
              e.stopPropagation();
              toggleView();
            }}
          />
        ) : (
          <ChevronRight
            onClick={(e) => {
              e.stopPropagation();
              toggleView();
            }}
          />
        )
      ) : (
        <IconsButton
          onClick={() => {
            setEdit(path, title, type, optional);
          }}
        >
          <Edit2 size={18} />
        </IconsButton>
      )}
      <div
        style={{ width: path ? (path.trim().split(".").length - 1) * 15 : 0 }}
        className="bg-white h-[2px]"
      ></div>

      <div className="flex-1 flex mb-[2px] justify-between items-center ">
        <div>{title}</div>
        <div>{type}</div>
      </div>
      {/* {type !== "object" && (
        <IconsButton
          onClick={() => {
            setEdit(path, title, type);
          }}
        >
          <Edit2 size={18} />
        </IconsButton>
      )} */}
      <IconsButton
        onClick={() => {
          deleteFieldHandler(path);
        }}
      >
        <Trash2 size={18} className="text-red-500" />
      </IconsButton>
    </div>
  );
}

export default KeyValue;
