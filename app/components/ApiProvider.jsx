/**
 * ApiProvider component provides the axios api instance and request methods to
 * the rest of the application.
 */
import axios from "axios";
import { createContext, useContext } from "react";
import { toast } from "react-toastify";

import { useDataStore } from "~/components/DataStoreProvider.jsx";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const ApiContext = createContext();

export function useApi() {
  return useContext(ApiContext);
}

export default function ApiProvider({ children }) {
  const { dataStore, dispatch } = useDataStore();

  api.interceptors.request.use(
    (config) => {
      if (dataStore.token) {
        config.headers["Authorization"] = `Token ${dataStore.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      var auth = response.headers["authorization"];
      if (auth) {
        var newToken = auth.split("Token ")[1];
        if (newToken != dataStore.token) {
          dispatch({
            type: "SAVE_TOKEN",
            payload: newToken,
          });
        }
      }
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        dispatch({
          type: "LOG_OUT",
        });
      } else if (error.response && error.response.status === 504) {
        toast.error(
          "Sorry failed to access the server. Contact System administrator",
          { autoClose: false }
        );

        return Promise.reject({ response: { data: null } });
      }
      return Promise.reject(error);
    }
  );

  return (
    <ApiContext.Provider
      value={{
        api,
        getBooks,
        getCustomerBooks,
        createBooks,
        updateBooks,
        getSummary,
        getOrders,
        createOrders,
        updateOrders,
        getSales,
        customerLogin,
        adminLogin,
        getStaffUser,
        updateStaffUser,
        userPasswordUpdate,
        registerCustomer,
        getCustomerData,
        updateCustomer,
        updateCustomerPassword,
        passwordReset,
        passwordResetRequest,
        passwordResetVerify,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}

const BASEURL1 = "/books/";
const BASEURL2 = "/staff/";
const BASEURL3 = "/customers/";

/** Books */
function getBooks(args = "") {
  return api.get(BASEURL1 + args);
}
function getCustomerBooks(args = "") {
  return api.get(BASEURL1 + "all" + args);
}
function createBooks(data) {
  return api.post(BASEURL1, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
function updateBooks(id, data) {
  return api.put(BASEURL1 + id, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

function getSummary() {
  return api.get(BASEURL1 + "summary");
}

/** end of Books */

/** Orders */
function getOrders(args = "") {
  return api.get(BASEURL1 + "orders" + args);
}
function createOrders(data) {
  return api.post(BASEURL1 + "orders", data);
}
function updateOrders(id, data) {
  return api.put(BASEURL1 + "orders/" + id, data);
}
function getSales() {
  return api.get(BASEURL1 + "sales");
}
/**end of Orders */

/** Staff User */
function adminLogin(data) {
  return api.post("/staff/login", data);
}

function getStaffUser() {
  return api.get(BASEURL2 + "user");
}

function updateStaffUser(data) {
  return api.put(BASEURL2 + "user", data);
}

function userPasswordUpdate(data) {
  return api.put(BASEURL2 + "user/password/update", data);
}
/** end of Staff User*/

/** Customer User */
function customerLogin(data) {
  return api.post(BASEURL3 + "login", data);
}

function registerCustomer(data) {
  return api.post(BASEURL3 + "register", data);
}

function getCustomerData() {
  return api.get(BASEURL3 + "user");
}

function updateCustomer(data) {
  return api.put(BASEURL3 + "user", data);
}
function updateCustomerPassword(data) {
  return api.put(BASEURL3 + "user/password/update", data);
}
/** end of Customer User */

function passwordResetRequest(data) {
  return api.post("/password/reset/request", data);
}

function passwordResetVerify(args = "") {
  return api.get("/password/reset" + args);
}

function passwordReset(args = "", data) {
  return api.post("/password/reset" + args, data);
}
