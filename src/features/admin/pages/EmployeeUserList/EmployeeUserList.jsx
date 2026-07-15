/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { resolveAdminAssetPath } from "@/assets";
import HOC from "@/features/shared/layout/Outer/HOC";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import { getObjectUrlFromDownloadUrl } from "@/features/shared/services";
import { defaultProfileIcon } from "@/assets/index";
import {
  formatDateToMMDDYYYY,
  formatDateWithoutUTCHandleToMMDDYYYY,
} from "@/utils/utils";
import { employeeService } from "@/features/shared/services";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { isAction } from "@reduxjs/toolkit";
import { DEFAULT_PAGE_SIZE, ROLES } from "@/features/shared/constants";
import { useListUsers } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { updateUserStatus } from "@/features/shared/services";
import { queryKeys } from "@/lib/queryKeys";
const FilterModalUser = React.memo(
  ({ show, onHide, profileDetail, params1, setFilteredValue, setParams1 }) => {
    const [params, setParams] = useState({
      facilityId: "",
    });
    const [facilityList, setFacilityList] = useState([]);
    useEffect(() => {
      setParams(params1);
      setFacilityList(profileDetail?.facilityId || []);
    }, [params1, profileDetail]);
    const handleFacilityTypeChange = useCallback((id) => {
      setParams((prevParams) => ({
        ...prevParams,
        facilityId: id || "",
      }));
    }, []);
    const handleApplyFilter = useCallback(() => {
      setFilteredValue(params);
      setParams1(params);
      onHide();
    }, [params, setFilteredValue, setParams1, onHide]);
    const clearFilter = useCallback(() => {
      setParams((prevParams) => ({
        ...prevParams,
        facilityId: "",
      }));
    }, []);
    return (
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <h5 className="fw-bold mb-0">Filter</h5>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Facility</Form.Label>
                <Form.Select
                  value={params.facilityId}
                  onChange={(e) => handleFacilityTypeChange(e.target.value)}
                >
                  <option value="" disabled>
                    Select facility
                  </option>
                  {facilityList?.map((facility) => (
                    <option key={facility._id} value={facility._id}>
                      {`${facility?.name}`}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Button className="theme-button mt-8" onClick={clearFilter}>
                Clear
              </Button>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button className="theme-button" onClick={handleApplyFilter}>
            APPLY
          </Button>
          <Button className="theme-button-outline" onClick={onHide}>
            CANCEL
          </Button>
        </Modal.Footer>
      </Modal>
    );
  },
);
const EmployeeUserList = () => {
  const profileDetail = useSelector(userProfile);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [modalShow, setModalShow] = useState(false);
  const [filteredValue, setFilteredValue] = useState({
    isActive: true,
  });
  const [params1, setParams1] = useState({
    facilityId: "",
  });

  const { facilityId } = filteredValue || {};
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    searchQuery: debouncedQuery || "",
    facilityId: facilityId || "",
    isActive: "true",
  });

  const { data: contactsResponse, isLoading: loading } = useListUsers(
    params.toString(),
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const deleteUser = async (id, isActive) => {
    const res = await updateUserStatus(id, {
      isActive: !isActive,
    });
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: queryKeys.employee.all() });
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 800);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (contactsResponse?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [contactsResponse?.docs?.length, page]);
  const handleHideModal = useCallback(() => {
    setModalShow(false);
  }, []);
  const handleShowModal = useCallback(() => {
    setModalShow(true);
  }, []);
  const handleQueryChange = useCallback((e) => {
    setQuery(e.target.value);
    setPage(1);
  }, []);
  return (
    <>
      <FilterModalUser
        show={modalShow}
        onHide={handleHideModal}
        profileDetail={profileDetail}
        params1={params1}
        setFilteredValue={setFilteredValue}
        setParams1={setParams1}
      />
      <Container className="dashboard-page">
        <Row>
          <Col>
            <div className="page-title-bar">
              <p className="heading mb-sm-0">Active Residents</p>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={12} md={4}>
            <Form.Group className="mb-2 mb-md-0" controlId="formBasicCheckbox">
              <Form.Control
                onChange={handleQueryChange}
                type="search"
                placeholder="Search"
              />
            </Form.Group>
          </Col>
          <Col xs={4} md={2}>
            <img
              onClick={handleShowModal}
              className="max-w-[35px] max-h-[35px] w-auto h-auto cursor-pointer"
              src={resolveAdminAssetPath("/Dashboard/contacts/filter.png")}
              alt="filter"
            />
          </Col>
        </Row>
        <Table bordered responsive className="mt-3 position-relative">
          <thead>
            <tr>
              <th>Resident Name</th>
              <th>Type</th>
              <th>AHCCSS ID</th>
              <th>DOB</th>
              <th>Admit Date</th>
              <th>Status</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12} key="loading">
                  <div className="d-flex justify-center">
                    <ClipLoader color="rgb(26, 159, 178)" />
                  </div>
                </td>
              </tr>
            ) : contactsResponse?.docs?.length > 0 ? (
              contactsResponse?.docs?.map((contact) => {
                return (
                  <tr key={contact._id}>
                    <td>
                      <p
                        // onClick={() => {
                        //   setContactId(contact._id);
                        //   handleShow(contact._id);
                        // }}
                        className="mb-0 d-xl-flex gap-2 cursor-pointer"
                      >
                        <img
                          className="w-[32px] h-[32px] rounded-full border border-[#0C5C75] flex-shirnk-0"
                          src={
                            contact?.profilePic
                              ? getObjectUrlFromDownloadUrl(contact?.profilePic)
                              : defaultProfileIcon
                          }
                          alt="profile_image"
                        />
                        <p
                          //   onClick={() => {
                          //     setContactId(contact._id);
                          //     handleShow(contact._id);
                          //   }}
                          className="mb-0 flex flex-col font-semibold"
                        >
                          <span>
                            {contact.firstName} {contact.lastName}
                          </span>
                          <span className="opacity-70">
                            ADDED ON{" "}
                            {formatDateWithoutUTCHandleToMMDDYYYY(
                              contact.createdAt,
                            )}
                          </span>
                        </p>
                      </p>
                    </td>
                    <td>
                      <p className="mb-0 d-xl-flex justify-content-center align-items-center gap-2">
                        <img
                          className="w-[32px] h-[32px] rounded-full border border-[#0C5C75] flex-shirnk-0"
                          src={
                            contact?.profilePic
                              ? getObjectUrlFromDownloadUrl(contact?.profilePic)
                              : defaultProfileIcon
                          }
                          alt="profile_image"
                        />
                        <span>
                          {contact.userType === ROLES.PATIENT
                            ? "RESIDENT"
                            : contact?.userType === ROLES.GUARDIAN
                              ? "GUARDIAN"
                              : "EMPLOYEE"}
                        </span>{" "}
                        <span className="opacity-70"></span>
                      </p>
                    </td>
                    <td>{contact.ahcccsId}</td>
                    <td>
                      {contact.dateOfBirth
                        ? `XX/XX/${formatDateToMMDDYYYY(contact.dateOfBirth).slice(6, 10)}`
                        : ""}
                    </td>
                    <td>{formatDateToMMDDYYYY(contact.admitDate)}</td>
                    <td>
                      <Col xs={12} md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="font-bold">
                            {contact.isActive ? "Active" : "Inactive"}
                          </Form.Label>
                          <Form.Check
                            type="switch"
                            id="custom-switch"
                            label={contact.isActive ? "Enabled" : "Disabled"}
                            checked={contact.isActive}
                            onChange={() =>
                              deleteUser(contact._id, contact.isActive)
                            }
                          />
                        </Form.Group>
                      </Col>
                    </td>
                    <td>{contact.address}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center">
                  {"No Contacts"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {contactsResponse?.docs?.length > 0 && (
          <PaginationsPage
            page={page}
            setPage={setPage}
            totalPages={
              contactsResponse?.totalPages && contactsResponse?.totalPages
            }
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: EmployeeUserList,
});
