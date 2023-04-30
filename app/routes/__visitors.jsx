import { Outlet, useLocation } from "@remix-run/react";

import PageLayout from "~/components/PageLayoutComponent.jsx";
import { useDataStore } from "~/components/DataStoreProvider.jsx";
import { Navigate } from "react-router-dom";

export const meta = () => {
  return [{ title: "Book Store" }, { description: "Shop your books with us." }];
};

export default function Page() {
  const { dataStore } = useDataStore();

  const location = useLocation();

  const authExceptionUrls = ["/book"];

  if (
    (!dataStore.isLoggedIn ||
      (dataStore.user &&
        dataStore.user.account &&
        dataStore.user.account !== "customer")) &&
    authExceptionUrls.findIndex((url) => location.pathname.startsWith(url)) ===
      -1
  ) {
    return (
      <Navigate to={"/auth?redirectTo=" + location.pathname} replace={true} />
    );
  }
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
