import {
  MDBBtn,
  MDBInputGroup,
  MDBIcon,
  MDBTypography,
  MDBContainer,
  MDBSpinner,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { textRequired, equalToRequired } from "~/utils/validators";
import { errorParser } from "~/utils/formatters.js";
import { useDataStore } from "~/components/DataStoreProvider.jsx";
import { useApi } from "~/components/ApiProvider.jsx";

const defaultData = {
  new_password: "",
  confirm_password: "",
};

export const meta = () => {
  return [{ title: "Administrator Portal" }];
};

export default function Page() {
  const [passwordToggle1, setPasswordToggle1] = useState(true);
  const [passwordToggle2, setPasswordToggle2] = useState(true);
  const [formData, setFormData] = useState({ ...defaultData });
  const [formState, setFormState] = useState("typing");
  const [validationErrors, setValidationErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState({});

  const [pageLoading, setPageLoading] = useState(true);

  const { passwordReset, passwordResetVerify } = useApi();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    passwordResetVerify(`?token=${searchParams.get("token")}`)
      .then(() => {
        setFormState("verified");
      })
      .catch((error) => {
        setErrorMessage({ message: error.response.data, category: "danger" });
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, []);

  function formDataUpdated(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const Errors = {
      new_password: textRequired(formData.new_password),
      confirm_password: equalToRequired(
        formData.new_password,
        formData.confirm_password,
        "Passwords do not match."
      ),
    };

    setValidationErrors({});
    if (Object.values(Errors).some(Boolean)) {
      setValidationErrors(Errors);
      return;
    }

    setFormState("submitting");

    let data = { password: formData.new_password };

    toast
      .promise(
        passwordReset(`?token=${searchParams.get("token")}`, data),
        {
          pending: "Submitting ...",
          success: {
            render({ data }) {
              setFormData({ ...defaultData });
              setErrorMessage({ message: data, category: "success" });
              return data.data;
            },
          },
          error: {
            render({ data }) {
              setErrorMessage({
                message: errorParser(data),
                category: "danger",
              });
              return errorParser(data);
            },
          },
        },
        { position: toast.POSITION.TOP_CENTER }
      )
      .finally(() => {
        setFormState("typing");
      });
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      {pageLoading === true ? (
        <div className="d-flex flex-row flex-nowrap align-items-center">
          <div>
            <MDBSpinner className="my-3">
              <span className="visually-hidden">Loading ...</span>
            </MDBSpinner>
          </div>
          <div>Please wait...</div>
        </div>
      ) : (
        <MDBContainer className="border col-md-3 p-4">
          {formState === "verified" ? (
            <form method="post" onSubmit={handleFormSubmit}>
              <MDBRow className="gy-4">
                <MDBCol size="12" className="text-center py-2">
                  {errorMessage.message && errorMessage.message.length > 0 && (
                    <MDBCard
                      className={
                        errorMessage.category === "success"
                          ? "success"
                          : "danger"
                      }
                    >
                      <MDBCardBody>{errorMessage.message}</MDBCardBody>
                    </MDBCard>
                  )}
                </MDBCol>
                <MDBCol size="12">
                  <MDBInputGroup noBorder style={{ width: "100% !important" }}>
                    <input
                      disabled={formState === "submitting"}
                      label="New Password"
                      type={passwordToggle1 ? "text" : "password"}
                      name="new_password"
                      placeholder="Enter New Password"
                      value={formData.new_password}
                      onChange={formDataUpdated}
                      className={
                        validationErrors?.new_password ? " is-invalid" : ""
                      }
                    />
                    <span
                      className="input-group-text"
                      onClick={() => setPasswordToggle1(!passwordToggle1)}
                    >
                      {passwordToggle1 === true ? (
                        <MDBIcon key="hidePassword" fas icon="eye-slash" />
                      ) : (
                        <MDBIcon key="showPassword" fas icon="eye" />
                      )}
                    </span>
                    {validationErrors?.new_password && (
                      <div className="invalid-feedback d-block">
                        {validationErrors?.new_password}
                      </div>
                    )}
                  </MDBInputGroup>
                  <MDBInputGroup noBorder style={{ width: "100% !important" }}>
                    <input
                      disabled={formState === "submitting"}
                      label="Confirm Password"
                      type={passwordToggle2 ? "text" : "password"}
                      name="confirm_password"
                      placeholder="Reenter Password"
                      value={formData.confirm_password}
                      onChange={formDataUpdated}
                      className={
                        validationErrors?.confirm_password ? "is-invalid" : ""
                      }
                    />
                    <span
                      className="input-group-text"
                      onClick={() => setPasswordToggle2(!passwordToggle2)}
                    >
                      {passwordToggle2 === true ? (
                        <MDBIcon key="hidePassword" fas icon="eye-slash" />
                      ) : (
                        <MDBIcon key="showPassword" fas icon="eye" />
                      )}
                    </span>
                    {validationErrors?.confirm_password && (
                      <div className="invalid-feedback d-block">
                        {validationErrors?.confirm_password}
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
              </MDBRow>
            </form>
          ) : (
            <>
              {errorMessage.message && errorMessage.message.length > 0 && (
                <MDBCard
                  className={
                    errorMessage.category === "success" ? "success" : "danger"
                  }
                >
                  <MDBCardBody>{errorMessage.message}</MDBCardBody>
                </MDBCard>
              )}{" "}
            </>
          )}
        </MDBContainer>
      )}
    </div>
  );
}
