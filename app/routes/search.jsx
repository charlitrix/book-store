import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBContainer,
  MDBRipple,
  MDBRow,
  MDBCol,
  MDBCardText,
  MDBCardSubTitle,
  MDBSpinner,
  MDBBtn,
  MDBTypography,
} from "mdb-react-ui-kit";
import { Link, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import PageLayout from "~/components/PageLayoutComponent.jsx";
import { useApi } from "~/components/ApiProvider.jsx";
import { useDataStore } from "~/components/DataStoreProvider.jsx";
import { formatPrice } from "~/utils/formatters.js";

export default function Page() {
  const [pageLoading, setPageLoading] = useState(false);
  const [pageData, setPageData] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const { api, getCustomerBooks } = useApi();

  const dataContainer = () => {
    if (pageData.length === 0) {
      return (
        <MDBCol size="12" key="no-books-available-id">
          No books found relating to ...
        </MDBCol>
      );
    }
    return pageData.map((data, index) => (
      <>
        <MDBCol key={data.id} md="4">
          <MDBCard className="w-100 h-100">
            <MDBRow className="g-0">
              <MDBCol md="4">
                <MDBRipple rippleTag="div" className="bg-image hover-overlay">
                  <MDBCardImage
                    src={api.defaults.baseURL + data.cover_image}
                    alt={data.title}
                    fluid
                    position="top"
                  />
                </MDBRipple>
              </MDBCol>
              <MDBCol md="8">
                <MDBCardBody className="d-flex flex-column h-100 pb-2">
                  <MDBCardSubTitle>
                    <strong>{data.title}</strong>
                  </MDBCardSubTitle>

                  {data.author_name ? (
                    <MDBCardText tag="div" className="mt-auto">
                      <div>
                        <small className="text-muted">
                          <strong>By: </strong>
                          {data.author_name}
                        </small>
                      </div>
                      <div className="float-end">
                        <Link to={"/book/" + data.id}>
                          <MDBBtn color="secondary">View</MDBBtn>
                        </Link>
                      </div>
                    </MDBCardText>
                  ) : (
                    <MDBCardText tag="div" className="mt-auto">
                      <div className="float-end">
                        <Link to={"/book/" + data.id}>
                          <MDBBtn color="secondary">View</MDBBtn>
                        </Link>
                      </div>
                    </MDBCardText>
                  )}
                </MDBCardBody>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>
      </>
    ));
  };

  useEffect(() => {
    setPageLoading(true);
    getCustomerBooks(`?search_query=${searchParams.get("query")}`)
      .then((response) => {
        setPageData(response.data);
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, [searchParams]);
  return (
    <PageLayout>
      <MDBContainer fluid className="py-5">
        <MDBRow className="rounded-5 mx-3 px-5 pb-5 bg-super-light">
          <MDBRow className="gy-3">
            <MDBCol size="12">
              <MDBTypography variant="h6">
                Found {pageData.length}{" "}
                {pageData.length === 1 ? "result" : "results"}
              </MDBTypography>
            </MDBCol>
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
      </MDBContainer>
    </PageLayout>
  );
}
