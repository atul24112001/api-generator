import dotPropImmutable from "dot-prop-immutable";
import KeyValue from "./KeyValue";
import { useState } from "react";

type Props = {
  data: any;
  allData: any;
  onChange: (data: any) => void;
  path?: string;
  currentPath: string;
  setCurrentPath: (path: string) => void;
  setEdit: (path: string, title: string, type: string, opt: boolean) => void;
  editing: boolean;
  setEditing: (editing: boolean) => void;
};

function Board({
  data,
  onChange,
  path = "",
  currentPath,
  setCurrentPath,
  allData,
  setEdit,
  editing,
  setEditing,
}: Props) {
  const [open, setOpen] = useState(false);
  const deleteFieldHandler = (path: string) => {
    let updatedData = JSON.parse(JSON.stringify(allData));
    updatedData = dotPropImmutable.delete(updatedData, path);
    onChange(updatedData);
    setCurrentPath("");
  };

  const toggleView = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div
      className={`py-2 rounded-md ${
        path == "" && path == currentPath ? "bg-primary-light-3" : ""
      } ${path ? "pr-0" : "pr-4"}`}
    >
      {Object.keys(data || {}).map((key, index) => {
        if (!data[key]) {
          return null;
        }
        if (
          data[key].type === "string" ||
          data[key].type === "number" ||
          data[key].type === "boolean"
        ) {
          return (
            <KeyValue
              path={path ? `${path}.${key}` : key}
              deleteFieldHandler={deleteFieldHandler}
              type={data[key].type}
              title={key}
              key={key}
              setCurrentPath={setCurrentPath}
              currentPath={currentPath}
              view={false}
              toggleView={() => {}}
              setEdit={setEdit}
              setEditing={setEditing}
              optional={data[key].optional}
            />
          );
        }
        if (data[key].type === "object") {
          return (
            <div
              key={key}
              className={`${
                `${path ? `${path}.${key}` : key}.properties` == currentPath
                  ? "bg-primary-light-3"
                  : ""
              } rounded-md`}
            >
              <KeyValue
                path={path ? `${path}.${key}` : key}
                deleteFieldHandler={deleteFieldHandler}
                type="object"
                title={key}
                setCurrentPath={setCurrentPath}
                currentPath={currentPath}
                toggleView={toggleView}
                view={open}
                setEdit={setEdit}
                optional={data[key].optional}
                setEditing={setEditing}
              />
              {open && Object.keys(data[key].properties ?? {}).length > 0 && (
                <Board
                  allData={allData}
                  data={data[key].properties}
                  path={`${path ? `${path}.` : ""}${key}.properties`}
                  onChange={onChange}
                  setCurrentPath={setCurrentPath}
                  currentPath={currentPath}
                  setEdit={setEdit}
                  editing={editing}
                  setEditing={setEditing}
                />
              )}
            </div>
          );
        }
        if (data[key].type === "array") {
          return (
            <div
              key={key}
              className={`${
                `${path ? `${path}.${key}` : key}.items.properties` ==
                currentPath
                  ? "bg-primary-light-3"
                  : ""
              } rounded-md`}
            >
              <KeyValue
                path={path ? `${path}.${key}` : key}
                deleteFieldHandler={deleteFieldHandler}
                type="array"
                title={key}
                setCurrentPath={setCurrentPath}
                currentPath={currentPath}
                toggleView={toggleView}
                view={open}
                setEdit={setEdit}
                setEditing={setEditing}
                optional={data[key].optional}
              />
              {open &&
                Object.keys(data[key].items.properties ?? {}).length > 0 && (
                  <Board
                    allData={allData}
                    data={data[key].items.properties}
                    path={`${path ? `${path}.` : ""}${key}.items.properties`}
                    onChange={onChange}
                    setCurrentPath={setCurrentPath}
                    currentPath={currentPath}
                    setEdit={setEdit}
                    editing={editing}
                    setEditing={setEditing}
                  />
                )}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default Board;
