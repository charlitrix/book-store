/**
 * DataStoreProvider component provides user data and authentication data to the
 * rest of the application components.
 */

import { createContext, useContext, useEffect, useReducer } from "react";

import { dataStoreReducer } from "~/utils/reducers";

const DataStoreContext = createContext();

export function useDataStore() {
  return useContext(DataStoreContext);
}

export default function DataStoreProvider({ children }) {
  const [dataStore, dispatch] = useReducer(dataStoreReducer, {});

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("book_store_data") || "{}");

    let expiry_date = new Date(data.expiry_date);

    if (expiry_date < new Date()) {
      dispatch({ type: "LOG_OUT" });
    } else {
      dispatch({ type: "LOG_IN", payload: data });
    }
  }, []);

  useEffect(() => {
    let expiry_date = new Date();
    expiry_date.setDate(new Date().getDate() + 1);
    let data = { expiry_date, ...dataStore };

    localStorage.setItem("book_store_data", JSON.stringify(data));
  }, [dataStore]);

  return (
    <DataStoreContext.Provider value={{ dataStore, dispatch }}>
      {children}
    </DataStoreContext.Provider>
  );
}
