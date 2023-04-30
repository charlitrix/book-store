import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarLink,
  MDBNavbarNav,
  MDBContainer,
  MDBNavbarItem,
  MDBInputGroup,
  MDBBtn,
  MDBIcon,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBBadge,
} from "mdb-react-ui-kit";
import { useLocation, useNavigate, useSearchParams } from "@remix-run/react";
import { useDataStore } from "~/components/DataStoreProvider.jsx";
import { textRequired } from "~/utils/validators.js";
import { useEffect, useState } from "react";

export default function Component() {
  const { dataStore, dispatch } = useDataStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (location.pathname.startsWith("/search") && searchParams.get("query")) {
      setSearchQuery(searchParams.get("query"));
    }
  }, []);

  function handleLogOut() {
    dispatch({
      type: "LOG_OUT",
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const Errors = {
      search: textRequired(searchQuery, "Enter search word"),
    };
    setValidationErrors({});
    if (Object.values(Errors).some(Boolean)) {
      setValidationErrors(Errors);
      return;
    }
    navigate("/search?query=" + searchQuery);
  }

  function cartContainer() {
    return (
      <MDBNavbarItem>
        <MDBNavbarLink href="/cart" className="d-flex flex-nowrap me-3 ms-4">
          <MDBBadge pill>{dataStore.cart ? dataStore.cart.length : 0}</MDBBadge>
          <MDBIcon fas icon="shopping-cart" />
        </MDBNavbarLink>
      </MDBNavbarItem>
    );
  }

  function navContainer() {
    if (
      dataStore.isLoggedIn &&
      dataStore.user &&
      dataStore.user.account &&
      dataStore.user.account === "customer"
    ) {
      return (
        <>
          {cartContainer()}
          <MDBNavbarItem>
            <MDBNavbarLink href="/orders" className="me-3">
              Orders
            </MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBDropdown>
              <MDBDropdownToggle tag="a" className="nav-link" role="button">
                <MDBIcon fas icon="user"></MDBIcon> Profile
              </MDBDropdownToggle>
              <MDBDropdownMenu dark className="text-white">
                <MDBDropdownItem link href="/user-profile">
                  Account Settings
                </MDBDropdownItem>
                <MDBDropdownItem link onClick={handleLogOut}>
                  <MDBIcon fas size="xl" icon="power-off" className="me-2" />
                  Logout
                </MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavbarItem>
        </>
      );
    }
    return (
      <>
        <MDBNavbarItem className="d-flex flex-row flex-nowrap">
          <MDBNavbarLink href="/auth">Login</MDBNavbarLink>
          <div className="border border-dark ms-2 me-3"></div>
          <MDBNavbarLink
            className="btn-outline-primary rounded-8 px-3"
            href="/auth"
          >
            Register
          </MDBNavbarLink>
        </MDBNavbarItem>
        {cartContainer()}
      </>
    );
  }

  return (
    <MDBNavbar light bgColor="light" expand="lg">
      <MDBContainer>
        <MDBNavbarBrand href="/">
          <strong>Book Store</strong>
        </MDBNavbarBrand>

        <MDBNavbarNav className="justify-content-evenly">
          <MDBNavbarItem>
            <form onSubmit={handleSubmit}>
              <MDBInputGroup
                noBorder
                textAfter={
                  <MDBBtn floating type="submit">
                    <MDBIcon fas icon="search" />
                  </MDBBtn>
                }
              >
                <input
                  type="search"
                  placeholder="Search here ..."
                  aria-label="search"
                  value={searchQuery}
                  onChange={(e) => {
                    setValidationErrors({});
                    setSearchQuery(e.target.value);
                  }}
                  className={
                    validationErrors?.search
                      ? "form-control is-invalid rounded-7"
                      : "form-control rounded-7"
                  }
                />
              </MDBInputGroup>

              {validationErrors?.search && (
                <div className="invalid-feedback d-block top-100 bg-white py-1 px-3">
                  {validationErrors?.search}
                </div>
              )}
            </form>
          </MDBNavbarItem>
        </MDBNavbarNav>
        <MDBNavbarNav left fullWidth={false}>
          {navContainer()}
        </MDBNavbarNav>
      </MDBContainer>
    </MDBNavbar>
  );
}
