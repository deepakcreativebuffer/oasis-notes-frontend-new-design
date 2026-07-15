/** @format */
import React from "react";
import { Container, Form, Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import Loader from "@/features/shared/ui/Loader/Loader";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { fetchPaitentName } from "@/utils/utils";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import { DEFAULT_PAGE_SIZE } from "@/features/shared/constants";
import { usePaginatedEmployees } from "@/features/shared/services/queries";
import { keepPreviousData } from "@tanstack/react-query";
const EmployeeList = () => {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const ProfileDetails = useSelector(userProfile);

  const { data: response, isLoading: loading } = usePaginatedEmployees(
    { limit, page, query },
    { placeholderData: keepPreviousData },
  );
  const boldStyle = {
    color: "#1A9FB2",
    cursor: "pointer",
    fontWeight: "bold",
  };
  const debouncedSetQuery = (term) => {
    clearTimeout(debouncedSetQuery.timeoutId);
    debouncedSetQuery.timeoutId = setTimeout(() => {
      setQuery(term);
    }, 500);
  };
  useEffect(() => {
    // Redirect to the previous page if the current page has no data and it's not the first page
    if (response?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.docs?.length, page]);
  return (
    <Container>
      <Row>
        <Col>
          <div className="page-title-bar">
            <p className="heading">All Employees</p>
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={12} md={6} lg={4}>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Control
              type={"search"}
              onChange={(e) => debouncedSetQuery(e.target.value)}
              placeholder="Name"
            />
          </Form.Group>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : response?.docs?.length === 0 ? (
        <NoFound />
      ) : (
        <Table bordered className="mt-3" responsive>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Reference Id</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Status</th>
              {ProfileDetails?.residentIntakes === true && <th></th>}
            </tr>
          </thead>
          <tbody>
            {response?.docs?.map((i, index) => (
              <tr key={index}>
                <td>
                  <Link
                    to={`/dashboard/employee-data/${i._id}`}
                    style={boldStyle}
                  >
                    {fetchPaitentName(i)}
                  </Link>
                </td>
                <td> {i.Id} </td>
                <td> {i.mobileNumber} </td>
                <td> {i.email} </td>
                <td> {i.isActive ? "Active" : "InActive"} </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {response?.docs?.length > 0 && (
        <PaginationsPage
          page={page}
          setPage={setPage}
          totalPages={response?.totalPages ?? 1}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </Container>
  );
};
export default HOC({
  Wcomponenet: EmployeeList,
});
