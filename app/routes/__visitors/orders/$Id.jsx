import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRipple,
  MDBRow,
  MDBCol,
  MDBCardText,
  MDBCardTitle,
  MDBSpinner,
  MDBBtn,
  MDBModalDialog,
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalContent,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBTextArea,
} from "mdb-react-ui-kit";

import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useApi } from "~/components/ApiProvider.jsx";
import { formatPrice, errorParser } from "~/utils/formatters.js";
import { greaterThanRequired } from "~/utils/validators.js";
import { toast } from "react-toastify";

export default function Page() {
  const [pageLoading, setPageLoading] = useState(false);
  const [pageData, setPageData] = useState({});

  const [showDialog, setShowDialog] = useState(false);

  const { Id } = useParams();

  const { getOrders, updateOrders } = useApi();

  const [reason, setReason] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const [submittingData, setSubmittingData] = useState(false);

  const cartTotal = pageData.sales
    ? pageData.sales.reduce(
        (total, value) => total + value.quantity * value.unit_price,
        0
      )
    : 0;

  const dataContainer = () => {
    if (!(pageData.id >= 1)) {
      return (
        <MDBCol size="12" key="no-books-available-id">
          Order is not available ...
        </MDBCol>
      );
    }
    return (
      <MDBCol key={pageData.id} md="8" offsetMd="2">
        <MDBCard className="w-100 h-100">
          <MDBRow className="g-0">
            <MDBCol size="12">
              <MDBCardBody className="d-flex flex-column h-100 pb-2">
                <h3 className="mb-0">
                  <strong>Order</strong>
                </h3>

                <hr />
                <MDBRow className="mb-2">
                  <MDBCol size="2">
                    <strong>Ref:</strong>
                  </MDBCol>
                  <MDBCol>{pageData.id}</MDBCol>
                </MDBRow>
                <MDBRow className="mb-2">
                  <MDBCol size="2">
                    <strong>Date:</strong>
                  </MDBCol>
                  <MDBCol>{pageData.date}</MDBCol>
                </MDBRow>
                <MDBRow className="mb-2">
                  <MDBCol size="2">
                    <strong>Bill:</strong>
                  </MDBCol>
                  <MDBCol>{formatPrice(pageData.bill)}</MDBCol>
                </MDBRow>
                <MDBRow className="mb-2">
                  <MDBCol size="2">
                    <i>
                      <strong>Status:</strong>
                    </i>
                  </MDBCol>
                  <MDBCol>
                    <i>{pageData.status}</i>
                  </MDBCol>
                </MDBRow>

                {pageData.status === "CANCELLED" &&
                  pageData.cancellation_reason.length > 0 && (
                    <MDBCardText className="text-danger">
                      <strong>Reason: </strong>
                      {pageData.cancellation_reason}
                    </MDBCardText>
                  )}

                <h5 className="mt-4 mx-4">
                  <strong>Items</strong>
                </h5>
                <MDBRow>
                  <MDBCol md="12">
                    <MDBTable className="mt-3">
                      <MDBTableHead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Book</th>
                          <th scope="col">Unit Price</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">Total</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                        {pageData.sales.map((sale, index) => (
                          <tr key={"table-row-" + sale.id}>
                            <td scope="col">{index + 1}</td>
                            <td scope="col">{sale.book_title}</td>
                            <td scope="col">{formatPrice(sale.unit_price)}</td>
                            <td scope="col">{sale.quantity}</td>
                            <td scope="col">
                              {formatPrice(sale.quantity * sale.unit_price)}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td scope="col" colSpan="4">
                            Total
                          </td>
                          <td scope="col">{formatPrice(cartTotal)}</td>
                        </tr>
                      </MDBTableBody>
                    </MDBTable>
                  </MDBCol>
                </MDBRow>
                {pageData.status === "PENDING" && (
                  <>
                    {submittingData === true ? (
                      <MDBBtn disabled block rounded>
                        <MDBSpinner size="sm" role="status" tag="span" />
                        <span className="visually-hidden">...Sending</span>
                      </MDBBtn>
                    ) : (
                      <MDBBtn
                        rounded
                        block
                        color="danger"
                        className="mt-3"
                        onClick={() => setShowDialog(!showDialog)}
                      >
                        Cancel Order
                      </MDBBtn>
                    )}
                  </>
                )}
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
        <MDBModal show={showDialog}>
          <MDBModalDialog size="sm">
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Enter Reason</MDBModalTitle>
                <MDBBtn
                  className="btn-close"
                  color="none"
                  onClick={() => setShowDialog(!showDialog)}
                />
              </MDBModalHeader>
              <MDBModalBody>
                <form method="post">
                  <MDBTextArea
                    rows="3"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className={validationErrors?.reason ? "is-invalid" : ""}
                    required
                  />
                  {validationErrors?.reason && (
                    <div className="invalid-feedback d-block">
                      {validationErrors?.reason}
                    </div>
                  )}
                  <MDBBtn
                    block
                    rounded
                    className="mt-4"
                    type="submit"
                    onClick={handleFormSubmit}
                  >
                    Confirm
                  </MDBBtn>
                </form>
              </MDBModalBody>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </MDBCol>
    );
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  function fetchPageData() {
    setPageLoading(true);
    getOrders(`/${Id}`)
      .then((response) => {
        setPageData(response.data);
      })
      .finally(() => {
        setPageLoading(false);
      });
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const Errors = {
      reason: greaterThanRequired(
        reason,
        10,
        "Reason should be atleast 10 characters long"
      ),
    };
    setValidationErrors({});
    if (Object.values(Errors).some(Boolean)) {
      setValidationErrors(Errors);
      return;
    }

    let data = { reason, status: "CANCELLED" };

    setShowDialog(!showDialog);
    setSubmittingData(true);

    toast
      .promise(
        updateOrders(Id, data),
        {
          pending: "Submitting ...",
          success: {
            render({ data }) {
              setReason("");
              fetchPageData();
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
        setSubmittingData(false);
      });
  }
  return (
    <MDBRow className="px-5 p-3 pb-5 g-0">
      <MDBRow className="g-0">
        {pageLoading === true ? (
          <MDBCol
            size="12"
            key="loading-data-id"
            className="d-flex flex-column justify-content-center"
          >
            <div>
              <MDBSpinner className="my-3 mx-auto">
                <span className="visually-hidden">Loading ...</span>
              </MDBSpinner>
            </div>
            <div>Please wait ...</div>
          </MDBCol>
        ) : (
          dataContainer()
        )}
      </MDBRow>
    </MDBRow>
  );
}
