import { Outlet, useLocation } from "@remix-run/react";

import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarItem,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBNavbarNav,
  MDBBtn,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
} from "mdb-react-ui-kit";
import { Navigate } from "react-router-dom";
import { useDataStore } from "~/components/DataStoreProvider.jsx";

export default function Page() {
  const { dataStore, dispatch } = useDataStore();

  const location = useLocation();

  if (
    !dataStore.isLoggedIn ||
    (dataStore.user &&
      dataStore.user.account &&
      dataStore.user.account !== "administrator")
  ) {
    return (
      <Navigate
        to={"/admin/login?redirectTo=" + location.pathname}
        replace={true}
      />
    );
  }

  function handleLogOut() {
    dispatch({
      type: "LOG_OUT",
    });
  }

  return (
    <>
      <MDBNavbar dark bgColor="primary" expand="lg">
        <MDBContainer fluid>
          <MDBNavbarBrand>Admin Portal</MDBNavbarBrand>

          <MDBNavbarNav className="justify-content-end me-4">
            <MDBNavbarItem>
              <MDBBtn outline color="light" onClick={() => handleLogOut()}>
                Logout
                <MDBIcon fas size="xl" icon="power-off" className="ms-1" />
              </MDBBtn>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBContainer>
      </MDBNavbar>
      <MDBContainer fluid>
        <MDBRow>
          <MDBCol size="2" className="border-end border-2 vh-100 pt-2">
            <MDBTabs pills className="flex-column text-center">
              <MDBTabsItem>
                <MDBTabsLink
                  href="/admin/dashboard"
                  active={location.pathname.startsWith("/admin/dashboard")}
                >
                  Dashboard
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink
                  href="/admin/books"
                  active={location.pathname.startsWith("/admin/books")}
                >
                  Books
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink
                  href="/admin/orders"
                  active={location.pathname.startsWith("/admin/orders")}
                >
                  Orders
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink
                  href="/admin/sales"
                  active={location.pathname.startsWith("/admin/sales")}
                >
                  Sales
                </MDBTabsLink>
              </MDBTabsItem>
              <hr />
              <MDBTabsItem>
                <MDBTabsLink
                  href="/admin/account"
                  active={location.pathname.startsWith("/admin/account")}
                >
                  Account
                </MDBTabsLink>
              </MDBTabsItem>
            </MDBTabs>
          </MDBCol>
          <MDBCol size="10">
            <main>
              <MDBContainer fluid className="py-5">
                <Outlet />
              </MDBContainer>
            </main>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
}
