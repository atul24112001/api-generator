import { atom } from "recoil";

export type Apis = {
  id: number;
  title: string;
};

export type Project = {
  id: number;
  title: string;
};

export type AccountDetails = {
  requestsRemaining: number;
  secret: string;
  subscriptionType: "free" | "standard" | "premium";
  totalProjects: number;
};

export type DataStateType = {
  apis: { [key: number]: Apis[] };
  projects: Project[];
  apiModels: { [key: number]: any };
  activeApi: Apis | null;
  activeProject: Project | null;
  currentPlane: AccountDetails | null;
};

const DataState = atom<DataStateType>({
  key: "DATA_STATE",
  default: {
    apis: {},
    projects: [],
    apiModels: {},
    activeApi: null,
    activeProject: null,
    currentPlane: null,
  },
});

export default DataState;
