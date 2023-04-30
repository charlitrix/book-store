import {
  MDBCol,
  MDBInput,
  MDBInputGroup,
  MDBRow,
  MDBSpinner,
  MDBBtn,
  MDBIcon,
  MDBTabs,
  MDBTabsContent,
  MDBTabsLink,
  MDBTabsItem,
  MDBTabsPane,
  MDBContainer,
  MDBTextArea,
} from "mdb-react-ui-kit";

import { useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { Link } from "@remix-run/react";
import { toast } from "react-toastify";
import {
  textRequired,
  equalToRequired,
  lengthRequired,
} from "~/utils/validators.js";
import { errorParser } from "~/utils/formatters.js";
import { useApi } from "~/components/ApiProvider.jsx";
import { useDataStore } from "~/components/DataStoreProvider.jsx";

const loginDefaultData = {
  username: "",
  password: "",
};

export default function Page() {
  const [activeTab, setActiveTab] = useState("tab1");

  const { customerLogin, customerRegister } = useApi();

  const [searchParams, setSearchParams] = useSearchParams();

  const { dataStore } = useDataStore();

  if (
    dataStore.isLoggedIn &&
    dataStore.user &&
    dataStore.user.account &&
    dataStore.user.account === "customer"
  ) {
    return (
      <Navigate to={searchParams.get("redirectTo") || "/"} replace={true} />
    );
  }

  return (
    <div className="pt-5 mt-4" style={{ minHeight: "80vh" }}>
      <div className="text-center">
        <Link to="/">Book Store</Link>
      </div>
      <MDBRow>
        <MDBCol offsetMd="4" md="4">
          <MDBTabs pills justify className="mb-5">
            <MDBTabsItem>
              <MDBTabsLink
                active={activeTab === "tab1"}
                onClick={() => setActiveTab("tab1")}
              >
                <MDBIcon fas icon="user" className="me-2" />
                Login
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                active={activeTab === "tab2"}
                onClick={() => setActiveTab("tab2")}
              >
                <MDBIcon fas icon="lock" className="me-2" />
                Register
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>
          <MDBTabsContent>
            <MDBTabsPane show={activeTab === "tab1"}>
              <MDBContainer className="px-5 pb-5">
                <LoginTab setActiveTab={(tab) => setActiveTab(tab)} />
              </MDBContainer>
            </MDBTabsPane>
            <MDBTabsPane show={activeTab === "tab2"}>
              <MDBContainer className="px-5 pb-5">
                <RegisterTab />
              </MDBContainer>
            </MDBTabsPane>
          </MDBTabsContent>
        </MDBCol>
      </MDBRow>
    </div>
  );
}

function LoginTab({ setActiveTab }) {
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [formData, setFormData] = useState({ ...loginDefaultData });
  const [formState, setFormState] = useState("typing");
  const [validationErrors, setValidationErrors] = useState({});

  const { customerLogin } = useApi();

  const { dataStore, dispatch } = useDataStore();

  function formDataUpdated(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
  function handleFormSubmit(e) {
    e.preventDefault();

    const Errors = {
      username: textRequired(formData.username),
      password: textRequired(formData.password),
    };

    setValidationErrors({});
    if (Object.values(Errors).some(Boolean)) {
      setValidationErrors(Errors);
      return;
    }

    setFormState("submitting");

    let data = { ...formData };

    toast.promise(
      customerLogin(data),
      {
        pending: "Logging in ...",
        success: {
          render({ data }) {
            setFormData({ ...loginDefaultData });
            dispatch({
              type: "LOG_IN",
              payload: {
                user: data.data.user,
                token: data.data.token,
                isLoggedIn: true,
              },
            });
            setFormState("success");
            return "You are welcome to shop with us.";
          },
        },
        error: {
          render({ data }) {
            setFormState("typing");
            return errorParser(data);
          },
        },
      },
      { position: toast.POSITION.TOP_CENTER }
    );
  }
  return (
    <form method="post" onSubmit={handleFormSubmit}>
      <MDBRow className="gy-4">
        <MDBCol size="12">
          <MDBInput
            disabled={formState === "submitting"}
            label="Email"
            name="username"
            value={formData.username}
            onChange={formDataUpdated}
            className={
              validationErrors?.username
                ? "form-control is-invalid"
                : "form-control"
            }
          />
          {validationErrors?.username && (
            <div className="invalid-feedback d-block">
              {validationErrors?.username}
            </div>
          )}
        </MDBCol>
        <MDBCol size="12">
          <MDBInputGroup noBorder style={{ width: "100% !important" }}>
            <input
              disabled={formState === "submitting"}
              label="Password"
              type={passwordToggle ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={formDataUpdated}
              className={
                validationErrors?.password
                  ? "form-control is-invalid"
                  : "form-control"
              }
            />
            <span
              className="input-group-text"
              onClick={() => setPasswordToggle(!passwordToggle)}
            >
              {passwordToggle === true ? (
                <MDBIcon key="hidePassword" fas icon="eye-slash" />
              ) : (
                <MDBIcon key="showPassword" fas icon="eye" />
              )}
            </span>
            {validationErrors?.password && (
              <div className="invalid-feedback d-block">
                {validationErrors?.password}
              </div>
            )}
          </MDBInputGroup>
        </MDBCol>
        <MDBCol className="pt-3">
          {formState === "submitting" ? (
            <MDBBtn disabled block rounded>
              <MDBSpinner size="sm" role="status" tag="span" />
              <span className="visually-hidden">...Sending</span>
            </MDBBtn>
          ) : (
            <MDBBtn block rounded type="submit">
              Submit
            </MDBBtn>
          )}
          <div className="text-center pt-3">
            <Link to="/forgot-password">Forgot Password</Link>
          </div>
          <div className="d-flex flex-nowrap align-items-center mt-2 justify-content-center">
            <div className="pe-3">Not a member? </div>
            <div>
              <MDBBtn
                color="tertiary"
                size="lg"
                onClick={() => setActiveTab("tab2")}
              >
                Register
              </MDBBtn>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </form>
  );
}

const registerDefaultData = {
  email: "",
  first_name: "",
  last_name: "",
  contact: "",
  address: "",
  password: "",
  confirm_password: "",
};

function RegisterTab({ setActiveTab }) {
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [formData, setFormData] = useState({ ...registerDefaultData });
  const [formState, setFormState] = useState("typing");
  const [validationErrors, setValidationErrors] = useState({});

  const { registerCustomer } = useApi();

  const { dataStore, dispatch } = useDataStore();

  function formDataUpdated(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
  function handleFormSubmit(e) {
    e.preventDefault();

    const Errors = {
      email: textRequired(formData.email),
      first_name: textRequired(formData.first_name),
      last_name: textRequired(formData.last_name),
      contact: lengthRequired(
        formData.contact,
        10,
        "Enter a valid contact start with 07xxxxxx"
      ),
      password: textRequired(formData.password),
      confirm_password: equalToRequired(
        formData.password,
        formData.confirm_password,
        "Passwords do not match"
      ),
    };
    setValidationErrors({});
    if (Object.values(Errors).some(Boolean)) {
      setValidationErrors(Errors);
      return;
    }

    setFormState("submitting");

    let data = { ...formData };

    toast.promise(
      registerCustomer(data),
      {
        pending: "Submitting ...",
        success: {
          render({ data }) {
            setFormData({ ...registerDefaultData });
            dispatch({
              type: "LOG_IN",
              payload: {
                user: data.data.user,
                token: data.data.token,
                isLoggedIn: true,
              },
            });
            setFormState("success");
            return "You are welcome to shop with us.";
          },
        },
        error: {
          render({ data }) {
            setFormState("typing");
            return errorParser(data);
          },
        },
      },
      { position: toast.POSITION.TOP_CENTER }
    );
  }
  return (
    <form method="post" onSubmit={handleFormSubmit}>
      <MDBRow className="gy-4">
        <MDBCol md="6">
          <MDBInput
            disabled={formState === "submitting"}
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={formDataUpdated}
            className={
              validationErrors?.first_name
                ? "form-control is-invalid"
                : "form-control"
            }
          />
          {validationErrors?.first_name && (
            <div className="invalid-feedback d-block">
              {validationErrors?.first_name}
            </div>
          )}
        </MDBCol>
        <MDBCol md="6">
          <MDBInput
            disabled={formState === "submitting"}
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={formDataUpdated}
            className={
              validationErrors?.last_name
                ? "form-control is-invalid"
                : "form-control"
            }
          />
          {validationErrors?.last_name && (
            <div className="invalid-feedback d-block">
              {validationErrors?.last_name}
            </div>
          )}
        </MDBCol>
        <MDBCol md="12">
          <MDBInput
            disabled={formState === "submitting"}
            label="Email"
            name="email"
            value={formData.email}
            onChange={formDataUpdated}
            className={
              validationErrors?.email
                ? "form-control is-invalid"
                : "form-control"
            }
          />
          {validationErrors?.email && (
            <div className="invalid-feedback d-block">
              {validationErrors?.email}
            </div>
          )}
        </MDBCol>
        <MDBCol md="12">
          <MDBInput
            disabled={formState === "submitting"}
            label="Contact"
            name="contact"
            placeholder="For example 07xxxxxxxx"
            value={formData.contact}
            onChange={formDataUpdated}
            className={
              validationErrors?.contact
                ? "form-control is-invalid"
                : "form-control"
            }
          />
          {validationErrors?.contact && (
            <div className="invalid-feedback d-block">
              {validationErrors?.contact}
            </div>
          )}
        </MDBCol>
        <MDBCol md="12">
          <MDBTextArea
            rows="2"
            disabled={formState === "submitting"}
            label="Address"
            name="address"
            value={formData.address}
            onChange={formDataUpdated}
            className={
              validationErrors?.address
                ? "form-control is-invalid"
                : "form-control"
            }
          />
          {validationErrors?.address && (
            <div className="invalid-feedback d-block">
              {validationErrors?.address}
            </div>
          )}
        </MDBCol>

        <MDBCol size="12">
          <MDBInputGroup noBorder className="mb-3">
            <input
              disabled={formState === "submitting"}
              label="New Password"
              type={passwordToggle ? "text" : "password"}
              name="password"
              placeholder="New Password"
              id="loginFormPassword"
              value={formData.password}
              onChange={formDataUpdated}
              className={
                validationErrors?.password
                  ? "form-control is-invalid"
                  : "form-control"
              }
            />
            <span
              className="input-group-text"
              onClick={() => setPasswordToggle(!passwordToggle)}
            >
              {passwordToggle === true ? (
                <MDBIcon key="hidePassword" fas icon="eye-slash" />
              ) : (
                <MDBIcon key="showPassword" fas icon="eye" />
              )}
            </span>
          </MDBInputGroup>
          {validationErrors?.password && (
            <div className="invalid-feedback d-block">
              {validationErrors?.password}
            </div>
          )}
        </MDBCol>
        <MDBCol size="12">
          <MDBInput
            disabled={formState === "submitting"}
            label="Confirm Password"
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={formDataUpdated}
            className={
              validationErrors?.confirm_password
                ? "form-control is-invalid"
                : "form-control"
            }
          />
          {validationErrors?.confirm_password && (
            <div className="invalid-feedback d-block">
              {validationErrors?.confirm_password}
            </div>
          )}
        </MDBCol>
        <MDBCol size="12" className="pt-3">
          {formState === "submitting" ? (
            <MDBBtn disabled block rounded>
              <MDBSpinner size="sm" role="status" tag="span" />
              <span className="visually-hidden">...Sending</span>
            </MDBBtn>
          ) : (
            <MDBBtn block rounded type="submit">
              Submit
            </MDBBtn>
          )}
        </MDBCol>
      </MDBRow>
    </form>
  );
}
