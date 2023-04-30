import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBSpinner,
  MDBIcon,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useApi } from "~/components/ApiProvider.jsx";
import { formatPrice } from "~/utils/formatters.js";

export default function Page() {
  const [pageLoading, setPageLoading] = useState(false);

  const [pageData, setPageData] = useState([]);

  const { getOrders } = useApi();

  const dataContainer = () => {
    if (pageData.length == 0) {
      return (
        <tr>
          <td scope="col" colSpan="100%">
            No orders ...
          </td>
        </tr>
      );
    }
    return pageData.map((data, index) => (
      <tr key={data.id}>
        <td scope="col">{index + 1}</td>
        <td scope="col">{data.date}</td>
        <td scope="col">{formatPrice(data.bill)}</td>
        <td scope="col">{data.status}</td>
        <td scope="col">
          <Link to={"/orders/" + data.id}>
            <MDBBtn floating size="sm">
              <MDBIcon fas icon="arrow-right" />
            </MDBBtn>
          </Link>
        </td>
      </tr>
    ));
  };

  useEffect(() => {
    setPageLoading(true);
    getOrders()
      .then((response) => {
        setPageData(response.data);
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, []);

  return (
    <>
      <MDBRow className="rounded-5 mx-5 mt-1 p-5 pb-5 bg-super-light">
        <MDBRow className="gy-3">
          <MDBRow className="gx-5">
            <MDBCol size="auto">
              <h3>Orders</h3>
            </MDBCol>
          </MDBRow>

          <MDBTable className="mt-3">
            <MDBTableHead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Bill</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {pageLoading === true ? (
                <tr>
                  <td scope="col" colSpan="100%">
                    <MDBSpinner className="my-3">
                      <span className="visually-hidden">Loading ...</span>
                    </MDBSpinner>
                  </td>
                </tr>
              ) : (
                dataContainer()
              )}
            </MDBTableBody>
          </MDBTable>
        </MDBRow>
      </MDBRow>
    </>
  );
}
