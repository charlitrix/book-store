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
  MDBInputGroup,
  MDBIcon,
  MDBModalContent,
} from "mdb-react-ui-kit";

import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useApi } from "~/components/ApiProvider.jsx";
import { useDataStore } from "~/components/DataStoreProvider.jsx";
import { formatPrice } from "~/utils/formatters.js";

export default function Page() {
  const [pageLoading, setPageLoading] = useState(false);
  const [pageData, setPageData] = useState({});

  const [showDialog, setShowDialog] = useState(false);

  const { Id } = useParams();

  const { api, getCustomerBooks } = useApi();

  const [quantity, setQuantity] = useState(1);

  const { dispatch } = useDataStore();

  const dataContainer = () => {
    if (!(pageData.id >= 1)) {
      return (
        <MDBCol size="12" key="no-books-available-id">
          Book is not found ...
        </MDBCol>
      );
    }
    return (
      <MDBCol key={pageData.id} md="12">
        <MDBCard className="w-100 h-100">
          <MDBRow className="g-0">
            <MDBCol md="3">
              <MDBRipple
                rippleTag="div"
                className="bg-image hover-overlay hover-zoom"
              >
                <MDBCardImage
                  src={api.defaults.baseURL + pageData.cover_image}
                  alt={pageData.title}
                  fluid
                  position="top"
                />
              </MDBRipple>
            </MDBCol>
            <MDBCol md="8">
              <MDBCardBody className="d-flex flex-column h-100 pb-2">
                <MDBCardTitle>
                  <strong>{pageData.title}</strong>
                </MDBCardTitle>
                <hr />
                <MDBCardText>
                  <strong>{formatPrice(pageData.price)}</strong>
                </MDBCardText>
                {pageData.author_name && (
                  <MDBCardText>
                    <small className="text-muted">
                      <strong>Author: </strong>
                      {pageData.author_name}
                    </small>
                  </MDBCardText>
                )}
                {pageData.author_name && (
                  <MDBCardText>
                    <small className="text-muted">
                      <strong>Publisher: </strong>
                      {pageData.publisher}
                    </small>
                  </MDBCardText>
                )}
                <MDBCardText>
                  <small className="text-muted">
                    <strong>Publish Date: </strong>
                    {pageData.publish_date}
                  </small>
                </MDBCardText>
                <h4>Overview</h4>
                <p>{pageData.description}</p>
                <MDBBtn
                  rounded
                  block
                  className="mt-3"
                  onClick={() => setShowDialog(!showDialog)}
                >
                  Add To Cart
                </MDBBtn>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
        <MDBModal show={showDialog}>
          <MDBModalDialog size="sm">
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>How many do you want?</MDBModalTitle>
                <MDBBtn
                  className="btn-close"
                  color="none"
                  onClick={() => setShowDialog(!showDialog)}
                />
              </MDBModalHeader>
              <MDBModalBody>
                <MDBInputGroup
                  noBorder
                  textBefore={
                    <MDBBtn
                      floating
                      size="sm"
                      onClick={() =>
                        quantity - 1 < 1 && setQuantity(quantity - 1)
                      }
                    >
                      <MDBIcon fas icon="minus" />
                    </MDBBtn>
                  }
                  textAfter={
                    <MDBBtn
                      floating
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <MDBIcon fas icon="plus" />
                    </MDBBtn>
                  }
                >
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      e.target.value < 1
                        ? setQuantity(1)
                        : setQuantity(e.target.value)
                    }
                    className="form-control text-center"
                  />
                </MDBInputGroup>
                <MDBBtn block rounded className="mt-4" onClick={addToCart}>
                  Confirm
                </MDBBtn>
              </MDBModalBody>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </MDBCol>
    );
  };

  useEffect(() => {
    setPageLoading(true);
    getCustomerBooks(`/${Id}`)
      .then((response) => {
        setPageData(response.data);
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, []);

  function addToCart() {
    dispatch({
      type: "UPDATE_CART",
      payload: {
        id: pageData.id,
        title: pageData.title,
        quantity: quantity,
        image: pageData.cover_image,
        author: pageData.author_name,
        price: pageData.price,
      },
    });
    setShowDialog(!showDialog);
  }
  return (
    <MDBRow className="rounded-5 mx-3 px-5 pb-5 bg-super-light">
      <MDBRow className="gy-3">
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
