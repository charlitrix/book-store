import {
  MDBBtn,
  MDBInputGroup,
  MDBContainer,
  MDBSpinner,
  MDBRow,
  MDBCol,
  MDBFile,
} from "mdb-react-ui-kit";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { textRequired, numberRequired } from "~/utils/validators.js";
import { errorParser } from "~/utils/formatters.js";
import { useApi } from "~/components/ApiProvider.jsx";

const defaultFormData = {
  title: "",
  description: "",
  image_file: { value: "" },
  price: 0,
  publish_date: "",
  author_name: "",
  publisher: "",
};

export default function Page() {
  const [formData, setFormData] = useState({ ...defaultFormData });
  const [formState, setFormState] = useState("typing");
  const [validationErrors, setValidationErrors] = useState({});

  const { createBooks } = useApi();

  function formDataUpdated(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function fileDataUpdated(e) {
    setFormData({
      ...formData,
      [e.target.name]: {
        file: e.target.files[0],
        value: e.target.value,
      },
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const Errors = {
      title: textRequired(formData.title),
      description: textRequired(formData.description),
      price: numberRequired(formData.price),
      image_file: textRequired(formData.image_file.value),
      publish_date: textRequired(formData.publish_date),
    };

    setValidationErrors({});
    if (Object.values(Errors).some(Boolean)) {
      setValidationErrors(Errors);
      return;
    }

    setFormState("submitting");

    let data = { ...formData };
    // set image attribute to image file object
    data.image_file = data.image_file.file;

    // wrap payload in form data object
    const formObj = new FormData();
    Object.keys(data).forEach((key) => {
      formObj.append(key, data[key]);
    });

    toast.promise(
      createBooks(formObj),
      {
        pending: "Submitting ...",
        success: {
          render({ data }) {
            setFormData({ ...defaultFormData });
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
    <MDBContainer className="px-5 pb-5">
      <h3 className="mb-5">Create New Book</h3>
      <form encType="multipart/form-data" onSubmit={handleFormSubmit}>
        <MDBRow className="gy-4">
          <MDBCol size="12" className="pb-2">
            <MDBInputGroup noBorder textBefore="Title">
              <input
                disabled={formState === "submitting"}
                type="text"
                name="title"
                className={
                  validationErrors?.title
                    ? "form-control is-invalid"
                    : "form-control"
                }
                value={formData.title}
                onChange={formDataUpdated}
              />
              {validationErrors?.title && (
                <div className="invalid-feedback">
                  {validationErrors?.title}
                </div>
              )}
            </MDBInputGroup>
          </MDBCol>
          <MDBCol size="12" className="pb-2">
            <MDBInputGroup noBorder textBefore="Price" textAfter="UGX">
              <input
                disabled={formState === "submitting"}
                type="number"
                name="price"
                className={
                  validationErrors?.price
                    ? "form-control is-invalid"
                    : "form-control"
                }
                value={formData.price}
                onChange={formDataUpdated}
              />
              {validationErrors?.price && (
                <div className="invalid-feedback">
                  {validationErrors?.price}
                </div>
              )}
            </MDBInputGroup>
          </MDBCol>
          <MDBCol size="12" className="pb-2">
            <MDBInputGroup noBorder textBefore="Author">
              <input
                disabled={formState === "submitting"}
                name="author_name"
                className={
                  validationErrors?.author_name
                    ? "form-control is-invalid"
                    : "form-control"
                }
                value={formData.author_name}
                onChange={formDataUpdated}
              />
              {validationErrors?.author_name && (
                <div className="invalid-feedback">
                  {validationErrors?.author_name}
                </div>
              )}
            </MDBInputGroup>
          </MDBCol>
          <MDBCol size="12" className="pb-2">
            <MDBInputGroup noBorder textBefore="Publisher">
              <input
                disabled={formState === "submitting"}
                name="publisher"
                className={
                  validationErrors?.publisher
                    ? "form-control is-invalid"
                    : "form-control"
                }
                value={formData.publisher}
                onChange={formDataUpdated}
              />
              {validationErrors?.publisher && (
                <div className="invalid-feedback">
                  {validationErrors?.publisher}
                </div>
              )}
            </MDBInputGroup>
          </MDBCol>
          <MDBCol size="12" className="pb-2">
            <MDBInputGroup noBorder textBefore="Publish Date">
              <input
                disabled={formState === "submitting"}
                type="date"
                name="publish_date"
                className={
                  validationErrors?.publish_date
                    ? "form-control is-invalid"
                    : "form-control"
                }
                value={formData.publish_date}
                onChange={formDataUpdated}
              />
              {validationErrors?.publish_date && (
                <div className="invalid-feedback">
                  {validationErrors?.publish_date}
                </div>
              )}
            </MDBInputGroup>
          </MDBCol>
          <MDBCol size="12" className="pb-3">
            <MDBInputGroup noBorder textBefore="Description">
              <textarea
                disabled={formState === "submitting"}
                name="description"
                style={{ height: "100px" }}
                className={
                  validationErrors?.description
                    ? "form-control is-invalid"
                    : "form-control"
                }
                value={formData.description}
                onChange={formDataUpdated}
              />
              {validationErrors?.description && (
                <div className="invalid-feedback">
                  {validationErrors?.description}
                </div>
              )}
            </MDBInputGroup>
          </MDBCol>
          <MDBCol size="12" className="pb-3">
            <MDBInputGroup noBorder textBefore="Cover Image">
              <MDBFile
                disabled={formState === "submitting"}
                name="image_file"
                className={
                  validationErrors?.image_file
                    ? "form-control is-invalid"
                    : "form-control"
                }
                value={formData.image_file?.value}
                onChange={fileDataUpdated}
              />
              {validationErrors?.image_file && (
                <div className="invalid-feedback">
                  {validationErrors?.image_file}
                </div>
              )}
            </MDBInputGroup>
          </MDBCol>

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
        </MDBRow>
      </form>
    </MDBContainer>
  );
}
