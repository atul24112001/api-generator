import React, { useRef, useState } from "react";
import KeyValue from "./KeyValue";
import TextField from "../TextField";
import Button from "../Button";
import Select from "../Select";
import dotPropImmutable, { set } from "dot-prop-immutable";
import Board from "./Board";
import { startCase } from "lodash";

type Props = {
  data: any;
  onChange: (data: any) => void;
  path?: string;
};

const DataTypeOptions = [
  { label: "String", value: "string" },
  { label: "Number", value: "number" },
  { label: "Object", value: "object" },
  { label: "Array", value: "array" },
  { label: "Boolean", value: "boolean" },
];

const getTypos = (type: string = "string", childType?: string): any => {
  switch (type) {
    case "string":
      return { type: "string", optional: false };
    case "number":
      return { type: "number", optional: false };
    case "boolean":
      return { type: "boolean", optional: false };
    case "object":
      return { type: "object", properties: {}, optional: false };
    case "array":
      return { type: "array", items: getTypos(childType), optional: false };
    default:
      return null;
  }
};

function JsonEditor({ data, onChange }: Props) {
  const keyRef = useRef<HTMLInputElement>(null);

  const [currentPath, setCurrentPath] = useState("");
  const [editing, setEditing] = useState(false);
  const [optional, setOptional] = useState(false);
  const [selectedType, setSelectedType] = useState({
    label: "String",
    value: "string",
  });
  const [childType, setChildType] = useState<
    | {
        label: string;
        value: string;
      }
    | undefined
  >();

  const addFieldHandler = () => {
    if (keyRef.current?.value.trim()) {
      let value = getTypos(selectedType.value, childType?.value);
      const updatedData = set(
        data,
        editing
          ? currentPath
          : currentPath.trim()
          ? `${currentPath}.${keyRef.current.value}`
          : keyRef.current.value,
        { ...value, optional: optional }
      );
      onChange(updatedData);
      keyRef.current.value = "";
    }
  };

  const setEdit = (path: string, title: string, type: string, opt: boolean) => {
    if (keyRef.current) {
      if (editing && currentPath == path) {
        setEditing(false);
        keyRef.current.value = "";
        setCurrentPath("");
      } else {
        console.log({ path });
        keyRef.current.value = title;
        setCurrentPath(path);
        setEditing(true);
        setOptional(opt);
        setSelectedType({ label: startCase(type), value: type });
      }
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <TextField name="key" ref={keyRef} />
        </div>
        {selectedType.value == "array" && (
          <Select
            name="childType"
            onChange={(name, value) => {
              setChildType(value);
            }}
            options={DataTypeOptions}
            value={childType}
            placeholder="Child Type"
          />
        )}
        <Select
          name="type"
          onChange={(name, value) => {
            setSelectedType(value);
          }}
          options={DataTypeOptions}
          value={selectedType}
        />

        <div className="mb-3">
          <Button onClick={() => setOptional((prev) => !prev)}>
            {optional ? "Optional" : "Required"}
          </Button>
        </div>
        <div className="mb-3">
          <Button onClick={addFieldHandler}>
            {editing ? "Update" : "Add"}
          </Button>
        </div>
      </div>

      {Object.keys(data).length == 0 ? (
        <div className="text-center opacity-70">
          Empty model please add something.
        </div>
      ) : (
        <Board
          data={data}
          allData={data}
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

export default JsonEditor;
