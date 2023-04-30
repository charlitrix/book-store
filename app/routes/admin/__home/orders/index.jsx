import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBSpinner,
  MDBIcon,
} from "mdb-react-ui-kit";
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { formatPrice } from "~/utils/formatters.js";
import { useApi } from "~/components/ApiProvider.jsx";

export default function Page() {
  const [pageLoading, setPageLoading] = useState(false);

  const [pageData, setPageData] = useState([]);

  const { getOrders } = useApi();

  const dataContainer = () => {
    if (pageData.length == 0) {
      return (
        <tr>
          <td scope="col" colSpan="100%">
            No data ...
          </td>
        </tr>
      );
    }
    return pageData.map((data, index) => (
      <tr key={data.id}>
        <td scope="col">{index + 1}</td>
        <td scope="col">{data.date}</td>
        <td scope="col">{data.customer_name}</td>
        <td scope="col">{formatPrice(data.bill)}</td>
        <td scope="col">{data.status}</td>
        <td scope="col">
          <Link to={"/admin/orders/" + data.id}>
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
      <h3>Orders</h3>
      <MDBTable className="mt-3">
        <MDBTableHead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Date</th>
            <th scope="col">Customer</th>
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
    </>
  );
}
