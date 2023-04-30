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

export default function Page() {
  const [pageLoading, setPageLoading] = useState(false);

  const [pageData, setPageData] = useState([]);

  const { getBooks } = useApi();

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
        <td scope="col">{data.title}</td>
        <td scope="col">{data.author_name}</td>
        <td scope="col">{data.publisher}</td>
        <td scope="col">
          <Link to={"/admin/books/" + data.id}>
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
    getBooks()
      .then((response) => {
        setPageData(response.data);
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, []);

  return (
    <>
      <MDBRow className="gx-5">
        <MDBCol size="auto">
          <h3>Books</h3>
        </MDBCol>
        <MDBCol size="auto">
          <Link to="create">
            <MDBBtn>Add Book</MDBBtn>
          </Link>
        </MDBCol>
      </MDBRow>

      <MDBTable className="mt-3">
        <MDBTableHead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Author</th>
            <th scope="col">Publisher</th>
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
