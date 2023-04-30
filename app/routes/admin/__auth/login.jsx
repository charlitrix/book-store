import {
  MDBBtn,
  MDBInputGroup,
  MDBIcon,
  MDBTypography,
  MDBContainer,
  MDBSpinner,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import { useState } from "react";
import { toast } from "react-toastify";
import { Navigate, useSearchParams } from "react-router-dom";
import { Link } from "@remix-run/react";
import { textRequired } from "~/utils/validators";
import { errorParser } from "~/utils/formatters.js";
import { useDataStore } from "~/components/DataStoreProvider.jsx";
import { useApi } from "~/components/ApiProvider.jsx";

const defaultData = {
  username: "",
  password: "",
};

export const meta = () => {
  return [{ title: "Administrator Portal" }];
};

export default function Page() {
  const { dataStore, dispatch } = useDataStore();

  const [passwordToggle, setPasswordToggle] = useState(true);
  const [formData, setFormData] = useState({ ...defaultData });
  const [formState, setFormState] = useState("typing");
  const [validationErrors, setValidationErrors] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();

  const { adminLogin } = useApi();

  if (
    dataStore.isLoggedIn &&
    dataStore.user &&
    dataStore.user.account &&
    dataStore.user.account === "administrator"
  ) {
    return (
      <Navigate
        to={searchParams.get("redirectTo") || "/admin/dashboard"}
        replace={true}
      />
    );
  }

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
      adminLogin(data),
      {
        pending: "Submitting ...",
        success: {
          render({ data }) {
            setFormData({ ...defaultData });
            dispatch({
              type: "LOG_IN",
              payload: {
                user: data.data.user,
                token: data.data.token,
                isLoggedIn: true,
              },
            });
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
    <div className="d-flex justify-content-center align-items-center vh-100">
      <MDBContainer className="border col-md-3 p-4">
        <form method="post" onSubmit={handleFormSubmit}>
          <MDBRow className="gy-4">
            <MDBCol size="12" className="text-center">
              <MDBTypography tag="h4">Administrator Portal</MDBTypography>
            </MDBCol>
            <MDBCol size="12" className="pb-2">
              <MDBInputGroup textBefore="@">
                <input
                  type="text"
                  name="username"
                  placeholder="User name"
                  className={
                    validationErrors.username
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  value={formData.username}
                  onChange={formDataUpdated}
                />
                {validationErrors.username && (
                  <div className="invalid-feedback">
                    {validationErrors.username}
                  </div>
                )}
              </MDBInputGroup>
            </MDBCol>
            <MDBCol size="12" className="pb-3">
              <MDBInputGroup textBefore={<MDBIcon fas icon="lock" />}>
                <input
                  type={passwordToggle ? "password" : "text"}
                  name="password"
                  className={
                    validationErrors.password
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  placeholder="Password"
                  value={formData.password}
                  onChange={formDataUpdated}
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
                {validationErrors.password && (
                  <div className="invalid-feedback">
                    {validationErrors.password}
                  </div>
                )}
              </MDBInputGroup>
            </MDBCol>
            <MDBCol size="12">
              {formState === "submitting" ? (
                <MDBBtn disabled block rounded>
                  <MDBSpinner size="sm" role="status" tag="span" />
                  <span className="visually-hidden">...Loading</span>
                </MDBBtn>
              ) : (
                <MDBBtn block rounded type="submit">
                  Submit
                </MDBBtn>
              )}
            </MDBCol>
            <div className="text-center pt-3">
              <Link to="/forgot-password">Forgot Password</Link>
            </div>
          </MDBRow>
        </form>
      </MDBContainer>
    </div>
  );
}
