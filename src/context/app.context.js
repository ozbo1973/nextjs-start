import { createContext, useReducer, useEffect } from "react";
import { useRouter } from "next/router";
import appReducer from "../reducers/app.reducer";

export const AppContext = createContext();
export const AppDispatch = createContext();

export function AppContextProvider(props) {
  const router = useRouter();

  const [appState, appDispatch] = useReducer(appReducer, {
    ...props.defaultValue,
    currentPath: router.pathname
  });

  useEffect(() => {
    console.log("render App context");
  }, []);

  return (
    <AppContext.Provider value={appState}>
      <AppDispatch.Provider value={appDispatch}>
        {props.children}
      </AppDispatch.Provider>
    </AppContext.Provider>
  );
}
