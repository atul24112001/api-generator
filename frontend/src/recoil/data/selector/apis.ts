import { selector } from "recoil";
import DataState from "../dataAtom";

const ApisSelector = selector({
  key: "API_SELECTOR",
  get: ({ get }) => {
    const dataState = get(DataState);
    return dataState.apis;
  },
  //   set: ({set, get}, newValue)  => {
  //     const dataState = get(DataState);
  //     if(dataState.activeApi != null){
  //         const updatedModels = JSON.parse(JSON.stringify(dataState.apiModels));
  //         updatedModels[dataState.activeApi.id] = newValue;
  //         dataState.apiModels = updatedModels;
  //         // set();
  //     }
  //   },
});

export default ApisSelector;
