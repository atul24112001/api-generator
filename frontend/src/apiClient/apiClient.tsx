import AuthenticationState from "@/recoil/authentication/authAtom";
import axios, { Axios } from "axios";
import { PropsWithChildren, createContext, useContext, useMemo } from "react";

export const AxiosContext = createContext<{ apiClient: Axios }>({
  apiClient: axios,
});

import React from "react";
import { useRecoilValue } from "recoil";

type Props = {};

const AxiosContextProvider = ({
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const auth = useRecoilValue(AuthenticationState);

  const apiClient = useMemo(() => {
    let client = axios.create({
      withCredentials: true,
    });

    if (auth.isAuthenticated) {
      client = axios.create({
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
    }

    return client;
  }, [auth.isAuthenticated]);
  return (
    <div>
      <AxiosContext.Provider
        value={{
          apiClient,
        }}
      >
        {children}
      </AxiosContext.Provider>
    </div>
  );
};

export const useAxios = () => {
  return useContext(AxiosContext);
};

export default AxiosContextProvider;
