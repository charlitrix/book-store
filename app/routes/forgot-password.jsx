import {
  MDBBtn,
  MDBContainer,
  MDBSpinner,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import { useState } from "react";
import { toast } from "react-toastify";
import { textRequired } from "~/utils/validators";
import { errorParser } from "~/utils/formatters.js";
import { useDataStore } from "~/components/DataStoreProvider.jsx";
import { useApi } from "~/components/ApiProvider.jsx";

const defaultData = {
  email: "",
};

export const meta = () => {
  return [{ title: "Administrator Portal" }];
};

export default function Page() {
  const [formData, setFormData] = useState({ ...defaultData });
  const [formState, setFormState] = useState("typing");
  const [validationErrors, setValidationErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState({});

  const { passwordResetRequest } = useApi();

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
    };

    setValidationErrors({});
    if (Object.values(Errors).some(Boolean)) {
      setValidationErrors(Errors);
      return;
    }

    setFormState("submitting");

    let data = { ...formData };

    toast
      .promise(
        passwordResetRequest(data),
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
      <MDBContainer className="border col-md-3 p-4">
        <form method="post" onSubmit={handleFormSubmit}>
          <MDBRow className="gy-4">
            <MDBCol size="12" className="text-center py-2">
              {errorMessage.message && errorMessage.message.length > 0 && (
                <MDBCard
                  className={
                    errorMessage.category === "success" ? "success" : "danger"
                  }
                >
                  <MDBCardBody>{errorMessage.message}</MDBCardBody>
                </MDBCard>
              )}
            </MDBCol>
            <MDBCol size="12">Enter your email below to reset password</MDBCol>
            <MDBCol size="12" className="pb-2">
              <MDBInput
                disabled={formState === "submitting"}
                label="Email"
                name="email"
                placeholder="Enter Email"
                className={validationErrors.email ? "is-invalid" : ""}
                value={formData.email}
                onChange={formDataUpdated}
              />
              {validationErrors.email && (
                <div className="invalid-feedback d-block">
                  {validationErrors.email}
                </div>
              )}
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
      </MDBContainer>
    </div>
  );
}
