import { Button, Container, Row, Col, Form, Table } from "react-bootstrap";
import { resolveAdminAssetPath } from "@/assets";
import { ClipLoader } from "react-spinners";
import { defaultProfileIcon } from "@/assets/index";
import { getObjectUrlFromDownloadUrl } from "@/features/shared/services";
import { formatDateWithoutUTCHandleToMMDDYYYY } from "@/utils/utils";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage.jsx";
import { ROLES } from "@/features/shared/constants";

const ContactsTable = ({
  query,
  setQuery,
  setPage,
  setAddContactBtn,
  setModalShow,
  loading,
  data,
  errorMessage,
  handleShow,
  setContactId,
  deleteUser,
  page,
  limit,
  setLimit,
}) => {
  return (
    <Container className="dashboard-page">
      <Row>
        <Col>
          <div className="page-title-bar">
            <p className="heading mb-sm-0">Users</p>
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={12} md={4}>
          <Form.Group className="mb-2 mb-md-0" controlId="formBasicCheckbox">
            <Form.Control
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              type="search"
              placeholder="Search"
            />
          </Form.Group>
        </Col>
        <Col xs={4} md={2}>
          <img
            onClick={() => {
              setAddContactBtn("filter");
              setModalShow(true);
            }}
            className="max-w-[35px] max-h-[35px] w-auto h-auto cursor-pointer"
            src={resolveAdminAssetPath("/Dashboard/contacts/filter.png")}
            alt="filter"
          />
        </Col>
        <Col xs={8} md={6} className="text-end">
          <Button
            onClick={() => {
              setAddContactBtn("add");
              setModalShow(true);
            }}
            variant="primary"
            className="theme-button"
          >
            + ADD USER
          </Button>
        </Col>
      </Row>
      <Table bordered responsive className="mt-3 position-relative">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Email</th>
            <th>Status</th>
            <th>Phone</th>
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
          ) : data?.data && data?.data?.docs?.length > 0 ? (
            data?.data?.docs?.map((contact) => {
              return (
                <tr key={contact._id}>
                  <td>
                    <div
                      onClick={() => {
                        setContactId(contact._id);
                        handleShow(contact._id);
                      }}
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
                        onClick={() => {
                          setContactId(contact._id);
                          handleShow(contact._id);
                        }}
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
                    </div>
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
                  <td>{contact.email}</td>
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
                  <td>{contact.mobileNumber}</td>
                  <td>
                    {contact?.userType === ROLES.PATIENT
                      ? contact?.facilityAddress || ""
                      : contact?.userType === ROLES.EMPLOYEE
                        ? contact?.address || ""
                        : contact?.address || ""}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="text-center">
                {errorMessage ? errorMessage : "No Contacts"}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {data?.data?.docs?.length > 0 && (
        <PaginationsPage
          page={page}
          setPage={setPage}
          totalPages={data?.data?.totalPages ?? 1}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </Container>
  );
};

export default ContactsTable;
