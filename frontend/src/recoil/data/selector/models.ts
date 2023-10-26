import { selector } from "recoil";
import DataState from "../dataAtom";

const ModelSelector = selector({
  key: "MODEL_SELECTOR",
  get: ({ get }) => {
    const dataState = get(DataState);
    return dataState.apiModels;
  },
});

export default ModelSelector;
