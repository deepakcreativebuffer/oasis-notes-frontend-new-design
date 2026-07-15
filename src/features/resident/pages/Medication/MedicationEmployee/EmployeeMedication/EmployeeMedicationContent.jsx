/* eslint-disable no-unused-vars */
/** @format */
import React from "react";
import { resolveAdminAssetPath } from "@/assets";
import { Container, Row, Col, Button, Form, Table } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import NavWrapper from "@/utils/NavWrapper";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import Select from "@/features/shared/ui/Search/Search";
import { ClipLoader } from "react-spinners";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import { FaEdit, FaEye } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
import EmployeeMedicationModal from "./EmployeeMedicationModal";

const EmployeeMedicationContent = (props) => {
  const {
    show,
    handleClose,
    modalShow,
    setModalShow,
    setNoteId,
    addContactBtn,
    getAllEmployeeMedications,
    showDeleteModal,
    setShowDeleteModal,
    deleteUrl,
    options,
    setQuery,
    setPage,
    profile,
    setViewItem,
    setAddContactBtn,
    loading,
    data,
    handleDelete,
    setEditId,
    setEditId1,
    setEditName,
    profileUser,
    limit,
    page,
    setLimit,
    colorOption,
    printRef,
    parentCtx,
  } = props;

  return (
    <>
      <NavWrapper title={"Resident Medication"} isArrow={true} />
      <EmployeeMedicationModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          setNoteId(null);
          if (addContactBtn === "f") getAllEmployeeMedications();
        }}
        parentCtx={parentCtx}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={getAllEmployeeMedications}
        deleteUrl={deleteUrl}
      ></DeleteDocModal>
      <Container>
        <Row>
          <Col xs={8} md={4}>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Control
                type="search"
                placeholder="Search"
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
            </Form.Group>
          </Col>
          <Col xs="auto" className="ml-auto">
            <Button
              onClick={() => {
                setViewItem({});
                setAddContactBtn("t");
                setModalShow(true);
              }}
              className="theme-button"
              variant="primary"
              disabled={
                profile.userType === ROLES.EMPLOYEE &&
                profile.accountType === ACCOUNT_TYPES.RESTRICTED
              }
            >
              + ADD NEW
            </Button>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="resident-medication mt-4">
              <Table bordered responsive="md">
                <thead>
                  <tr>
                    <th>Resident Name</th>
                    <th>Medication Name</th>
                    <th>Medication Month</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="loading-cell">
                        <ClipLoader color="rgb(26, 159, 178)" />
                      </td>
                    </tr>
                  ) : data?.docs?.length > 0 ? (
                    data?.docs?.map((item) => (
                      <tr key={item._id}>
                        <td>
                          {item.patientId?.firstName +
                            " " +
                            item.patientId?.lastName}
                        </td>
                        <td>
                          {item?.medication?.map(
                            (i, index) =>
                              i.status === "Continue" && (
                                <ul className="list-unstyled m-0">
                                  <li className="text-truncate-one" key={index}>
                                    {i.name}
                                  </li>
                                </ul>
                              ),
                          )}
                        </td>
                        <td>
                          {`${
                            item?.year
                              ? new Date(
                                  item?.year,
                                  item?.month - 1,
                                ).toLocaleString("default", {
                                  month: "long",
                                })
                              : "-"
                          } ${item?.year ? item?.year : ""}`}
                        </td>
                        <td>
                          <div className="icon-joiner">
                            {(profileUser?.userType === ROLES.ADMIN ||
                              profileUser?.accountType ===
                                ACCOUNT_TYPES.ADMINISTRATOR ||
                              ((profileUser?.accountType ===
                                ACCOUNT_TYPES.REGULAR ||
                                profileUser?.accountType ===
                                  ACCOUNT_TYPES.RESTRICTED) &&
                                profileUser?.userType === ROLES.EMPLOYEE &&
                                profileUser.userPermissions?.view
                                  ?.split(":")
                                  .includes("em"))) && (
                              <div
                                className="view-btn"
                                onClick={() => {
                                  if (!loading) {
                                    setViewItem(item);
                                    setEditId1(item?._id);
                                    setNoteId(item._id);
                                    setAddContactBtn("v");
                                    setModalShow(true);
                                  }
                                }}
                              >
                                <FaEye />{" "}
                              </div>
                            )}

                            {(profileUser?.userType === ROLES.ADMIN ||
                              profileUser?.accountType ===
                                ACCOUNT_TYPES.ADMINISTRATOR ||
                              (profileUser?.accountType ===
                                ACCOUNT_TYPES.REGULAR &&
                                profileUser?.userType === ROLES.EMPLOYEE &&
                                profileUser.userPermissions?.edit
                                  ?.split(":")
                                  .includes("em"))) && (
                              <div
                                className="edit-btn"
                                onClick={() => {
                                  if (!loading) {
                                    setViewItem(item);
                                    setNoteId(item._id);
                                    setEditId(item._id);
                                    setEditName(item.name);
                                    setAddContactBtn("f");
                                    setModalShow(true);
                                  }
                                }}
                              >
                                <FaEdit />{" "}
                              </div>
                            )}

                            {(profileUser?.userType === ROLES.ADMIN ||
                              profileUser?.accountType ===
                                ACCOUNT_TYPES.ADMINISTRATOR) && (
                              <div
                                className="del-btn"
                                onClick={() => {
                                  if (!loading) {
                                    handleDelete(item._id);
                                    setNoteId(null);
                                  }
                                }}
                              >
                                <RiDeleteBin5Fill />{" "}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                        {"No Medication Found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              {data?.docs?.length > 0 && (
                <PaginationsPage
                  page={page}
                  setPage={setPage}
                  totalPages={data?.totalPages ?? 1}
                  limit={limit}
                  setLimit={setLimit}
                  medication={true}
                />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EmployeeMedicationContent;
