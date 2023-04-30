import {
  MDBCard,
  MDBInputGroup,
  MDBBtn,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBRipple,
  MDBCardImage,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalTitle,
  MDBModalHeader,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import { formatPrice, errorParser } from "~/utils/formatters.js";
import { useApi } from "~/components/ApiProvider.jsx";
import { useDataStore } from "~/components/DataStoreProvider.jsx";
import { Navigate } from "react-router-dom";
import { Link } from "@remix-run/react";
import { toast } from "react-toastify";

export default function Page() {
  const { api, createOrders } = useApi();

  const { dataStore, dispatch } = useDataStore();

  const [pageData, setPageData] = useState([]);

  const [pageState, setPageState] = useState("interactive");

  const [showDialog, setShowDialog] = useState(false);

  const cartTotal = pageData.reduce(
    (total, value) => total + value.quantity * value.price,
    0
  );

  const dataContainer = () => {
    if (pageData.length == 0) {
      return (
        <MDBCol size="12" className="p-3" key="noDataItem">
          No cart items ...
          <div className="text-center">
            <Link to="/">Go Shopping</Link>
          </div>
        </MDBCol>
      );
    }
    return pageData.map((data, index) => (
      <MDBCol size="12" key={data.id}>
        <MDBCard className="m-2 p-3 rounded-7">
          <MDBRow className="g-0">
            <MDBCol size="auto pe-5">
              <MDBRipple
                rippleTag="div"
                className="bg-image hover-overlay hover-zoom"
              >
                <MDBCardImage
                  src={api.defaults.baseURL + data.image}
                  alt={pageData.title}
                  fluid
                  position="top"
                  style={{ height: "80px" }}
                />
              </MDBRipple>
            </MDBCol>
            <MDBCol className="d-flex flex-column align-content-center">
              <div>{data.title}</div>
              {data.author && (
                <div>
                  <small>
                    <strong>By:</strong>
                    {data.author}
                  </small>
                </div>
              )}
            </MDBCol>
            <MDBCol className="d-flex flex-column justify-content-center text-center">
              <div>{formatPrice(data.price)}</div>
            </MDBCol>
            <MDBCol className="d-flex align-items-center">
              <div>
                <MDBInputGroup
                  noBorder
                  textBefore={
                    <MDBBtn
                      disabled={pageState === "submitting"}
                      floating
                      size="sm"
                      onClick={() =>
                        data.quantity - 1 < 1
                          ? updateCartItem(data.id, 0)
                          : updateCartItem(data.id, -1)
                      }
                    >
                      <MDBIcon fas icon="minus" />
                    </MDBBtn>
                  }
                  textAfter={
                    <MDBBtn
                      disabled={pageState === "submitting"}
                      floating
                      size="sm"
                      onClick={() => updateCartItem(data.id, 1)}
                    >
                      <MDBIcon fas icon="plus" />
                    </MDBBtn>
                  }
                >
                  <input
                    disabled={pageState === "submitting"}
                    type="number"
                    value={data.quantity}
                    onChange={(e) =>
                      e.target.value < 1
                        ? updateCartItem(data.id, 0)
                        : updateCartItem(
                            data.id,
                            e.target.value - data.quantity
                          )
                    }
                    className="form-control text-center"
                  />
                </MDBInputGroup>
              </div>
            </MDBCol>
            <MDBCol size="auto" className="d-flex align-items-center">
              <div>
                <MDBBtn
                  disabled={pageState === "submitting"}
                  floating
                  color="light"
                  onClick={() => deleteItem(data.id)}
                >
                  <MDBIcon fas icon="trash" size="xl" color="danger" />
                </MDBBtn>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBCol>
    ));
  };

  useEffect(() => {
    if (dataStore.cart) {
      setPageData(dataStore.cart);
    }
  }, [dataStore.cart]);

  if (pageState === "success") {
    return <Navigate to="/orders" replace={true} />;
  }

  function deleteItem(id) {
    dispatch({
      type: "DELETE_CART_ITEM",
      payload: id,
    });
  }

  function updateCartItem(id, quantity) {
    dispatch({
      type: "UPDATE_CART",
      payload: {
        id: id,
        quantity: quantity,
      },
    });
  }
  function placeOrder() {
    setShowDialog(!showDialog);
    setPageState("submitting");

    let data = pageData.map((item) => ({
      book_id: item.id,
      quantity: item.quantity,
    }));
    toast.promise(
      createOrders(data),
      {
        pending: "Submitting ...",
        success: {
          render({ data }) {
            dispatch({
              type: "CLEAR_CART",
            });
            setPageState("success");
            return data.data;
          },
        },
        error: {
          render({ data }) {
            setPageState("interactive");
            return errorParser(data);
          },
        },
      },
      { position: toast.POSITION.TOP_CENTER }
    );
  }

  return (
    <>
      <MDBRow className="pt-5 g-0">
        <MDBCol md="8" offsetMd="2">
          <MDBRow className="rounded-5 mx-4 p-4 pb-5 bg-super-light">
            <h3>Cart</h3>
            <div className="border"></div>
            <MDBRow>
              {dataContainer()}
              {pageData.length > 0 && (
                <MDBCol size="12">
                  <MDBCard className="m-2 p-3 rounded-7">
                    <MDBRow className="g-0">
                      <MDBCol>
                        <strong>Total:</strong>
                      </MDBCol>
                      <MDBCol>
                        <strong>{formatPrice(cartTotal)}</strong>
                      </MDBCol>
                    </MDBRow>
                  </MDBCard>
                </MDBCol>
              )}
            </MDBRow>
            <div className="d-flex justify-content-end pt-2">
              <div>
                {pageState === "submitting" ? (
                  <MDBBtn disabled block rounded>
                    <MDBSpinner size="sm" role="status" tag="span" />
                    <span className="visually-hidden">...Sending</span>
                  </MDBBtn>
                ) : (
                  <MDBBtn
                    disabled={pageData.length == 0}
                    rounded
                    onClick={() => setShowDialog(!showDialog)}
                  >
                    Proceed to Checkout
                  </MDBBtn>
                )}
              </div>
            </div>
          </MDBRow>
        </MDBCol>
      </MDBRow>
      <MDBModal show={showDialog}>
        <MDBModalDialog size="sm">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Confirmation</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => setShowDialog(!showDialog)}
              />
            </MDBModalHeader>
            <MDBModalBody>
              <p>Are you sure you want to place order?</p>
              <MDBRow>
                <MDBCol>
                  <MDBBtn
                    rounded
                    color="light"
                    onClick={() => setShowDialog(!showDialog)}
                  >
                    Not Sure
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn rounded onClick={placeOrder}>
                    Am sure
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
