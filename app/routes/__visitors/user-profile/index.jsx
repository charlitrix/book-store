import {
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBInputGroup,
  MDBTabs,
  MDBTabsContent,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsPane,
  MDBSpinner,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";

import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  textRequired,
  equalToRequired,
  lengthRequired,
} from "~/utils/validators.js";
import { errorParser } from "~/utils/formatters.js";
import { useApi } from "~/components/ApiProvider.jsx";
import { useDataStore } from "~/components/DataStoreProvider.jsx";

export default function Page() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <MDBContainer fluid className="py-5">
      <MDBRow className="rounded-5 mx-3 px-5 pb-5 bg-super-light">
        <MDBTabs pills className="mb-5">
          <MDBTabsItem>
            <MDBTabsLink
              active={activeTab === "tab1"}
              onClick={() => setActiveTab("tab1")}
            >
              <MDBIcon fas icon="user" className="me-2" />
              Profile
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              active={activeTab === "tab2"}
              onClick={() => setActiveTab("tab2")}
            >
              <MDBIcon fas icon="lock" className="me-2" />
              Password
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>
        <MDBTabsContent>
          <MDBTabsPane show={activeTab === "tab1"}>
            <MDBContainer className="px-5 pb-5">
              <UserProfileForm />
            </MDBContainer>
          </MDBTabsPane>
          <MDBTabsPane show={activeTab === "tab2"}>
            <MDBContainer className="px-5 pb-5">
              <PasswordUpdateForm />
            </MDBContainer>
          </MDBTabsPane>
        </MDBTabsContent>
      </MDBRow>
    </MDBContainer>
  );
}

const profileDefaultData = {
  email: "",
  first_name: "",
  last_name: "",
  contact: "",
  address: "",
  username: "",
};

function UserProfileForm() {
  const [formData, setFormData] = useState({ ...profileDefaultData });
  const [formState, setFormState] = useState("typing");
  const [validationErrors, setValidationErrors] = useState({});

  const { dataStore, dispatch } = useDataStore();

  const { getCustomerData, updateCustomer } = useApi();

  useEffect(() => {
    let data = dataStore.user;
    if (data) {
      setFormData({
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        contact: data.contact,
        address: data.address,
      });
    }
  }, [dataStore.user]);

  if (formState === "success") {
    getCustomerData()
      .then((response) => {
        dispatch({
          type: "SAVE_USER_DATA",
          payload: response.data,
        });
      })
      .finally(() => {
        setFormState("typing");
      });
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
      first_name: textRequired(formData.first_name),
      last_name: textRequired(formData.last_name),
      email: textRequired(formData.email),
      contact: lengthRequired(
        formData.contact,
        10,
        "Enter a valid contact start with 07xxxxxx"
      ),
    };

    setValidationErrors({});
    if (Object.values(Errors).some(Boolean)) {
      setValidationErrors(Errors);
      return;
    }

    setFormState("submitting");

    let data = { ...formData, username: formData.email };

    toast.promise(
      updateCustomer(data),
      {
        pending: "Submitting ...",
        success: {
          render({ data }) {
            setFormState("success");
            return data.data;
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
        <MDBCol md="6" className="pb-2">
          <MDBRow>
            <MDBCol size="4">First Name:</MDBCol>
            <MDBCol>
              <input
                disabled={formState === "submitting"}
                type="text"
                name="first_name"
                className={
                  validationErrors?.first_name
                    ? "form-control is-invalid"
                    : "form-control"
                }
                value={formData.first_name}
                onChange={formDataUpdated}
              />
              {validationErrors?.first_name && (
                <div className="invalid-feedback">
                  {validationErrors?.first_name}
                </div>
              )}
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBCol md="6" className="pb-2">
          <MDBRow>
            <MDBCol size="3">Last Name:</MDBCol>
            <MDBCol>
              <input
                disabled={formState === "submitting"}
                type="text"
                name="last_name"
                className={
                  validationErrors?.last_name
                    ? "form-control is-invalid"
                    : "form-control"
                }
                value={formData.last_name}
                onChange={formDataUpdated}
              />
              {validationErrors?.last_name && (
                <div className="invalid-feedback">
                  {validationErrors?.last_name}
                </div>
              )}
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBCol size="12" className="pb-3">
          <MDBRow>
            <MDBCol size="2">Email:</MDBCol>
            <MDBCol>
              <input
                disabled={formState === "submitting"}
                type="text"
                name="email"
                className={
                  validationErrors?.email
                    ? "form-control is-invalid"
                    : "form-control"
                }
                value={formData.email}
                onChange={formDataUpdated}
              />
              {validationErrors?.email && (
                <div className="invalid-feedback">
                  {validationErrors?.email}
                </div>
              )}
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBCol size="12" className="pb-3">
          <MDBRow>
            <MDBCol size="2">Contact:</MDBCol>
            <MDBCol>
              <input
                disabled={formState === "submitting"}
                type="text"
                name="contact"
                className={
                  validationErrors?.contact
                    ? "form-control is-invalid"
                    : "form-control"
                }
                value={formData.contact}
                onChange={formDataUpdated}
              />
              {validationErrors?.contact && (
                <div className="invalid-feedback">
                  {validationErrors?.contact}
                </div>
              )}
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBCol size="12" className="pb-5">
          <MDBRow>
            <MDBCol size="2">Address:</MDBCol>
            <MDBCol>
              <textarea
                disabled={formState === "submitting"}
                rows="3"
                name="address"
                className={
                  validationErrors?.address
                    ? "form-control is-invalid"
                    : "form-control"
                }
                value={formData.address}
                onChange={formDataUpdated}
              />
              {validationErrors?.address && (
                <div className="invalid-feedback">
                  {validationErrors?.address}
                </div>
              )}
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBCol size="12">
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

const passwordDefaultData = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

function PasswordUpdateForm() {
  const [formData, setFormData] = useState({ ...passwordDefaultData });
  const [formState, setFormState] = useState("typing");
  const [validationErrors, setValidationErrors] = useState({});

  const [passwordToggle1, setPasswordToggle1] = useState(true);
  const [passwordToggle2, setPasswordToggle2] = useState(true);

  const { updateCustomerPassword } = useApi();

  function formDataUpdated(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
  function handleFormSubmit(e) {
    e.preventDefault();

    const Errors = {
      current_password: textRequired(formData.current_password),
      new_password: textRequired(formData.new_password),
      confirm_password: equalToRequired(
        formData.new_password,
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
    delete data.confirm_password;

    toast
      .promise(
        updateCustomerPassword(data),
        {
          pending: "Submitting ...",
          success: {
            render({ data }) {
              setFormData({ ...passwordDefaultData });
              return data.data;
            },
          },
          error: {
            render({ data }) {
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
    <form method="post" onSubmit={handleFormSubmit}>
      <MDBRow className="gy-4">
        <MDBCol size="12">
          <MDBRow>
            <MDBCol size="3">Current Password: </MDBCol>
            <MDBCol>
              <MDBInputGroup noBorder className="pb-3">
                <input
                  disabled={formState === "submitting"}
                  type={passwordToggle1 ? "password" : "text"}
                  name="current_password"
                  className={
                    validationErrors?.current_password
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  value={formData.current_password}
                  onChange={formDataUpdated}
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
              </MDBInputGroup>
              {validationErrors?.current_password && (
                <div className="invalid-feedback d-block">
                  {validationErrors?.current_password}
                </div>
              )}
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBCol size="12">
          <MDBRow>
            <MDBCol size="3">New Password:</MDBCol>
            <MDBCol>
              <MDBInputGroup noBorder className="pb-3">
                <input
                  disabled={formState === "submitting"}
                  type={passwordToggle2 ? "password" : "text"}
                  name="new_password"
                  className={
                    validationErrors?.new_password
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  value={formData.new_password}
                  onChange={formDataUpdated}
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
              </MDBInputGroup>
              {validationErrors?.new_password && (
                <div className="invalid-feedback d-block">
                  {validationErrors?.new_password}
                </div>
              )}
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBCol size="12" className="pb-5">
          <MDBRow>
            <MDBCol size="3">Confirm Password:</MDBCol>
            <MDBCol>
              <input
                disabled={formState === "submitting"}
                type="password"
                name="confirm_password"
                className={
                  validationErrors?.confirm_password
                    ? "form-control is-invalid"
                    : "form-control"
                }
                value={formData.confirm_password}
                onChange={formDataUpdated}
              />
              {validationErrors?.confirm_password && (
                <div className="invalid-feedback">
                  {validationErrors?.confirm_password}
                </div>
              )}
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBCol size="12">
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
