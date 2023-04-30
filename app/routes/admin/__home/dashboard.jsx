import {
  MDBSpinner,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardSubTitle,
} from "mdb-react-ui-kit";
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useApi } from "~/components/ApiProvider.jsx";
import { formatPrice } from "~/utils/formatters.js";

export default function Page() {
  const [pageLoading, setPageLoading] = useState(false);

  const [pageData, setPageData] = useState([]);

  const { getSummary } = useApi();

  const dataContainer = () => {
    return (
      <>
        <MDBCol md="6">
          <MDBCard className="bg-info bg-gradient text-white">
            <MDBCardBody>
              <h1>Books</h1>
              <div className="d-flex justify-content-end">
                <div>
                  <h3>{pageData.books}</h3>
                </div>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="6">
          <MDBCard className="bg-danger bg-gradient text-white">
            <MDBCardBody>
              <h1>Orders</h1>
              <div className="d-flex justify-content-end">
                <div>
                  <h3>{pageData.orders}</h3>
                </div>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol size="12">
          <MDBCard className="bg-success bg-gradient text-white ">
            <MDBCardBody>
              <h1>Sales</h1>
              <div className="d-flex justify-content-end">
                <div>
                  <h3>{formatPrice(pageData.sales)}</h3>
                </div>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </>
    );
  };

  useEffect(() => {
    setPageLoading(true);
    getSummary()
      .then((response) => {
        setPageData(response.data);
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, []);

  return (
    <>
      <MDBRow className="rounded-5 px-5 bg-super-light">
        <MDBRow className="gy-4">
          {pageLoading === true ? (
            <MDBCol size="12">
              <MDBSpinner className="my-3">
                <span className="visually-hidden">Loading ...</span>
              </MDBSpinner>
            </MDBCol>
          ) : (
            dataContainer()
          )}
        </MDBRow>
      </MDBRow>
    </>
  );
}
