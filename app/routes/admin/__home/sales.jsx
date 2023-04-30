import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBSpinner,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import { formatPrice } from "~/utils/formatters.js";
import { useApi } from "~/components/ApiProvider.jsx";

export default function Page() {
  const [pageLoading, setPageLoading] = useState(false);

  const [pageData, setPageData] = useState([]);

  const { getSales } = useApi();

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
        <td scope="col">{data.customer}</td>
        <td scope="col">{formatPrice(data.unit_price)}</td>
        <td scope="col">{data.quantity}</td>
        <td scope="col">{formatPrice(data.quantity ^ data.unit_price)}</td>
      </tr>
    ));
  };

  const totalAmount = pageData.reduce(
    (total, value) => total + value.quantity * value.unit_price,
    0
  );

  useEffect(() => {
    setPageLoading(true);
    getSales()
      .then((response) => {
        setPageData(response.data);
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, []);

  return (
    <>
      <div className="px-3">
        <div className="d-flex justify-content-between">
          <div>
            <h3>Sales</h3>
          </div>
          <div className="pe-5">
            <h5>{formatPrice(totalAmount)}</h5>
          </div>
        </div>
        <MDBTable className="mt-3">
          <MDBTableHead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">Customer</th>
              <th scope="col">Unit Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Amount</th>
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
      </div>
    </>
  );
}
