/** @format */
import React from "react";
import { resolveAdminAssetPath } from "@/assets";
import { Container, Table, Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "@/features/shared/ui/Loader/Loader";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { fetchPaitentName } from "@/utils/utils";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import FilterModal from "./FilterModal";
import { DEFAULT_PAGE_SIZE } from "@/features/shared/constants";
import { useAssignedResidents } from "@/features/shared/services/queries";
import { keepPreviousData } from "@tanstack/react-query";
const PatientList = () => {
  const ProfileDetails = useSelector(userProfile);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [showModal, setShowModal] = useState(false);
  const [filteredValue, setFilteredValue] = useState({
    isActiveUser: true,
  });

  const { isActiveUser } = filteredValue || {};
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    searchQuery: debouncedQuery || "",
    isActive:
      isActiveUser !== undefined && isActiveUser !== null ? isActiveUser : true,
  });

  const { data: response, isLoading: loading } = useAssignedResidents(
    { queryString: params.toString() },
    { placeholderData: keepPreviousData },
  );
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);
  useEffect(() => {
    if (response?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.docs?.length, page]);
  return (
    <Container>
      <div className="page-title-bar mb-3">
        <Row className="align-items-center">
          <Col xs={2} lg="3"></Col>
          <Col xs={8} lg="6">
            <p className="heading mb-sm-0">All Residents</p>
          </Col>
          <Col xs={2} lg="3"></Col>
        </Row>
      </div>
      <Row className="mt-4">
        <Col xs={12} md={6} lg={4}>
          <Form.Label className="fw-bold">Search:</Form.Label>
          <Form.Control
            type={"search"}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Name"
          ></Form.Control>
        </Col>
        <Col xs={4} md={2} className="d-flex flex-column justify-end">
          <img
            onClick={() => {
              setShowModal(true);
            }}
            className="max-w-[35px] max-h-[35px] w-auto h-auto cursor-pointer"
            src={resolveAdminAssetPath("/Dashboard/contacts/filter.png")}
            alt="filter"
          />
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : (
        <Row className="mt-4">
          <Col xs={12}>
            {response?.docs?.length > 0 ? (
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Resident Name</th>
                    <th>Refrence Id</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>App</th>
                    {ProfileDetails?.residentIntakes === true && <th></th>}
                  </tr>
                </thead>
                <tbody>
                  {response?.docs?.map((i, index) => (
                    <tr key={`${index}-${i?._id}`}>
                      <td>
                        <Link
                          to={`/search-list/${i?._id}`}
                          className="resident-list"
                        >
                          {fetchPaitentName(i)}
                        </Link>
                      </td>
                      <td> {i.Id} </td>
                      <td> {i.mobileNumber} </td>
                      <td> {i.email} </td>
                      <td> {i.isActive ? "Active" : "InActive"} </td>
                      <td>
                        <Link
                          to={`/book-appointment/${i?._id}`}
                          className="resident-list"
                        >
                          Book Appointment
                        </Link>
                      </td>
                      {ProfileDetails?.residentIntakes === true && (
                        <td>
                          {" "}
                          <Link
                            to={`/intake/${i._id}`}
                            className="resident-list"
                          >
                            Intake
                          </Link>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <NoFound />
            )}
          </Col>
        </Row>
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
      {showModal && (
        <FilterModal
          show={showModal}
          onHide={() => {
            setShowModal(false);
          }}
          setFilteredValue={setFilteredValue}
          isActiveUser={filteredValue.isActiveUser}
        />
      )}
    </Container>
  );
};
export default PatientList;
