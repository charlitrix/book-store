import {
  MDBRow,
  MDBCol,
  MDBCardText,
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
  MDBBtnGroup,
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

  const [showCancelOrderDialog, setShowCancelOrderDialog] = useState(false);

  const [reason, setReason] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const [orderStatus, setOrderStatus] = useState("");

  const [formState, setFormState] = useState("interactive");

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
      <MDBCol key={pageData.id} size="12">
        <MDBRow className="g-0">
          <MDBCol size="12">
            <div className="d-flex flex-column h-100 pb-2">
              <MDBRow>
                <MDBCol>
                  <h3 className="mb-0">
                    <strong>Order Details</strong>
                  </h3>
                </MDBCol>
                <MDBCol>
                  <MDBBtnGroup>
                    {pageData.status === "PENDING" && (
                      <>
                        <MDBBtn
                          disabled={formState === "submitting"}
                          color="success"
                          onClick={() => showConfirmationDialog("CONFIRMED")}
                        >
                          Confirm Order
                        </MDBBtn>
                        <MDBBtn
                          disabled={formState === "submitting"}
                          color="danger"
                          onClick={() =>
                            setShowCancelOrderDialog(!showCancelOrderDialog)
                          }
                        >
                          Cancel Order
                        </MDBBtn>
                      </>
                    )}

                    {pageData.status === "CONFIRMED" && (
                      <MDBBtn
                        color="info"
                        disabled={formState === "submitting"}
                        onClick={() => showConfirmationDialog("DELIVERED")}
                      >
                        Order Delivered
                      </MDBBtn>
                    )}
                  </MDBBtnGroup>
                </MDBCol>
              </MDBRow>
              <hr />
              <MDBRow>
                <MDBCol>
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
                </MDBCol>
                <MDBCol>
                  <div>
                    <strong>Customer Details</strong>
                  </div>
                  <MDBRow className="mt-3">
                    <MDBCol size="3">Name:</MDBCol>
                    <MDBCol>{pageData.customer_details.full_name}</MDBCol>
                  </MDBRow>
                  <MDBRow className="mt-2">
                    <MDBCol size="3">Email:</MDBCol>
                    <MDBCol>{pageData.customer_details.email}</MDBCol>
                  </MDBRow>
                  <MDBRow className="mt-2">
                    <MDBCol size="3">Contact:</MDBCol>
                    <MDBCol>{pageData.customer_details.contact}</MDBCol>
                  </MDBRow>
                  <MDBRow className="mt-2">
                    <MDBCol size="3">Address:</MDBCol>
                    <MDBCol>{pageData.customer_details.address}</MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>

              {pageData.status === "CANCELLED" &&
                pageData.cancellation_reason.length > 0 && (
                  <MDBCardText className="text-danger">
                    <strong>Reason: </strong>
                    {pageData.cancellation_reason}
                  </MDBCardText>
                )}

              <h5 className="mt-4">
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
                        <tr key={"row-" + sale.id}>
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
                        <td scope="col" className="" colSpan="4">
                          Total
                        </td>
                        <td scope="col">{formatPrice(cartTotal)}</td>
                      </tr>
                    </MDBTableBody>
                  </MDBTable>
                </MDBCol>
              </MDBRow>
            </div>
          </MDBCol>
        </MDBRow>

        <MDBModal show={showDialog}>
          <MDBModalDialog size="sm">
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Confirm?</MDBModalTitle>
                <MDBBtn
                  className="btn-close"
                  color="none"
                  onClick={() => setShowDialog(!showDialog)}
                />
              </MDBModalHeader>
              <MDBModalBody>
                <MDBRow className="mt-3 justify-content-evenly">
                  <MDBCol size="auto">
                    <MDBBtn
                      rounded
                      outline
                      onClick={() => setShowDialog(!showDialog)}
                    >
                      No
                    </MDBBtn>
                  </MDBCol>
                  <MDBCol size="auto">
                    <MDBBtn rounded onClick={submitStatus}>
                      Yes
                    </MDBBtn>
                  </MDBCol>
                </MDBRow>
              </MDBModalBody>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
        <MDBModal show={showCancelOrderDialog}>
          <MDBModalDialog size="sm">
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Enter Reason</MDBModalTitle>
                <MDBBtn
                  className="btn-close"
                  color="none"
                  onClick={() =>
                    setShowCancelOrderDialog(!showCancelOrderDialog)
                  }
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
                    onClick={cancelOrderSubmit}
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

  function submitStatus() {
    setShowDialog(!showDialog);
    let data = {
      status: orderStatus,
    };
    submitUpdatedOrderStatus(data);
  }
  function cancelOrderSubmit(e) {
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

    setShowCancelOrderDialog(!showCancelOrderDialog);

    submitUpdatedOrderStatus(data);
  }

  function submitUpdatedOrderStatus(data) {
    setFormState("submitting");
    toast
      .promise(
        updateOrders(Id, data),
        {
          pending: "Submitting ...",
          success: {
            render({ data }) {
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
        setFormState("interactive");
      });
  }

  function showConfirmationDialog(status) {
    setOrderStatus(status);
    setShowDialog(!showDialog);
  }

  return (
    <MDBRow className="g-0 mx-3">
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
