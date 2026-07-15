/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { resolveAdminAssetPath } from "@/assets";
import {
  Button,
  Container,
  Form,
  ModalBody,
  Table,
  Row,
  Col,
} from "react-bootstrap";
import "@/assets/styles/admin/Contacts.css";
import { Link } from "react-router-dom";
import { FaEdit, FaEye } from "react-icons/fa";
import Select from "react-select";
import Offcanvas from "react-bootstrap/Offcanvas";
import Modal from "react-bootstrap/Modal";
import { showNotification } from "@/utils";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import DatePicker from "react-datepicker";
import { usePrint } from "@shared/hooks";
import {
  adminPortalService,
  updateDueDateInPatientTracking,
} from "@/features/shared/services";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import { DEFAULT_PAGE_SIZE } from "@/features/shared/constants";
import { usePatientTrackingList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const PatinentTracking = () => {
  const [show, setShow] = useState(false);
  const [addContactBtn, setAddContactBtn] = useState(false);
  const [data, setData] = useState({});
  const handleClose = () => setShow(false);
  const [viewPatient, setViewPatient] = useState({});
  const profileInfo = useSelector(userProfile);
  const printRef = React.useRef(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const options = [
    {
      value: "business",
      label: "Business",
    },
    {
      value: "employee",
      label: "Employee",
    },
    {
      value: "patient",
      label: "Resident",
    },
    {
      value: "psychiatric",
      label: "Psychiatric Provider",
    },
    {
      value: "claims",
      label: "Claims Submission",
    },
  ];
  const [modalShow, setModalShow] = useState(false);

  const { data: response, isLoading: loading } = usePatientTrackingList(
    { page, limit, debouncedQuery },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const getAllRequests = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.adminTracking.all() });
  }, [queryClient]);
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
  function MyVerticallyCenteredModal(props) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(
      resolveAdminAssetPath("/Dashboard/contacts/user.png"),
    );
    useEffect(() => {
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }
    }, [selectedFile]);
    const fileChangedHandler = (e) => {
      if (e.target.files && e.target.files?.length > 0) {
        setSelectedFile(e.target.files[0]);
      }
    };
    const [status, setStatus] = useState("");
    const [dueDate, setDueDate] = useState("");
    const updateHandler = (e) => {
      e.preventDefault();
      updateDueDateInPatientTracking(viewPatient?._id, {
        dueDate: dueDate,
      })
        .then((response) => {
          getAllRequests();
          setShow(false);
          showNotification({ message: response.data.message, type: "success" });
          props.onHide();
        })
        .catch((error) => {
          showNotification({
            message: error.response?.data?.message || error.message,
            type: "danger",
          });
        });
    };
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () =>
        printDocumentContent(
          componentRef.current.cloneNode(true),
          profileInfo,
          profileInfo,
        ),
      documentTitle: printDocumentTitleExceptFirstPage(
        profileInfo,
        profileInfo,
      ),
      pageStyle: `
      @page {
        margin: 12mm 9mm!important;
      }    
      .card {
        page-break-inside: avoid;
      }
      .view-details-grid {
        page-break-inside: avoid;
      }
    `,
    });
    const print = usePrint(printRef, handlePrint);
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {addContactBtn === "view" ? (
          <div ref={printRef} tabIndex={0} className="outline-none">
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">View Resident Tracking</h5>
            </Modal.Header>
            <Modal.Body>
              <div ref={componentRef}>
                <h1 className="pdfTitle my-3 hidden">Resident Tracking </h1>

                <div className="view-details">
                  <Row>
                    <Col xs={12} sm={6} md={12} lg={6}>
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Resident Name : </p>
                        <h5 className="view-value mb-0">{`${viewPatient?.patientId?.firstName || ""} ${viewPatient?.patientId?.lastName || ""}`}</h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={6} md={12} lg={6}>
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">TB Test due date : </p>
                        <h5 className="view-value mb-0">
                          {formatDateToMMDDYYYY(viewPatient?.tbTestDate)}
                        </h5>
                      </div>
                    </Col>

                    <Col xs={12} sm={12} md={12} lg={6}>
                      <div className="view-details-grid flex-wrap my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Initial Assessment due date :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {formatDateToMMDDYYYY(viewPatient?.initialAssessment)}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={6}>
                      <div className="view-details-grid flex-wrap my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Nursing Assessment due date :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {formatDateToMMDDYYYY(viewPatient?.nursingAssessment)}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={6}>
                      <div className="view-details-grid flex-wrap my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Behavioral Health Treatment Plan Review due date
                          :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {formatDateToMMDDYYYY(
                            viewPatient?.treatmentPlanReviewDate,
                          )}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={6}>
                      <div className="view-details-grid flex-wrap my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Flu Shot due date : </p>
                        <h5 className="view-value mb-0">
                          {formatDateToMMDDYYYY(viewPatient?.fluShot)}
                        </h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={6}>
                      <div className="view-details-grid flex-wrap my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Staffing due date : </p>
                        <h5 className="view-value mb-0">
                          {formatDateToMMDDYYYY(viewPatient?.staffing)}
                        </h5>
                      </div>
                    </Col>

                    <Col xs={12} sm={12} md={12} lg={6}>
                      <div className="view-details-grid flex-wrap my-1 my-md-2 p-3">
                        <p className="view-label mb-1">
                          Concurrent Review due date :{" "}
                        </p>
                        <h5 className="view-value mb-0">
                          {formatDateToMMDDYYYY(viewPatient?.currentReviewDate)}
                        </h5>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
              <Button className="theme-button" onClick={print}>
                PRINT
              </Button>
              <Button className="theme-button-outline" onClick={props.onHide}>
                CANCEL
              </Button>
            </Modal.Footer>
          </div>
        ) : (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Update Due Date</h5>
            </Modal.Header>
            <Form onSubmit={updateHandler}>
              <ModalBody>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Due Date</Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(dueDate)}
                    onChange={(selectedDate) =>
                      setDueDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          dueDate ? formatDateToMMDDYYYY(dueDate) : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </ModalBody>
              <Modal.Footer className="justify-content-center">
                <Button className="theme-button" type="submit">
                  APPLY
                </Button>
                <Button className="theme-button" onClick={props.onHide}>
                  CANCEL
                </Button>
              </Modal.Footer>
            </Form>
          </>
        )}
      </Modal>
    );
  }
  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />{" "}
      <Offcanvas
        show={show}
        className="h-[80vh] rounded-t-[10px] p-6"
        placement="bottom"
        onHide={handleClose}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="text-black font-semibold">
            Contact Details
          </Offcanvas.Title>
        </Offcanvas.Header>
        <hr className="text-gray-500 w-[60%]" />
        <Offcanvas.Body>
          <div className="profile-dropdown-container">
            <img
              src={resolveAdminAssetPath("/Dashboard/user.png")}
              className="max-w-[125px] max-h-[125px] w-auto h-auto"
              alt="user"
            />
            <p>
              <p className="font-bold text-black">Jhon Smith</p>
              <p className="flex gap-[5px] items-center font-bold text-black">
                <img
                  className="max-w-5 max-h-5"
                  src={resolveAdminAssetPath("/Dashboard/admin.png")}
                  alt=""
                />
                <span>ADMIN</span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-5 max-h-5"
                  src={resolveAdminAssetPath("/Dashboard/message.png")}
                  alt=""
                />
                <span>
                  EMAIL -{" "}
                  <span className="text-black font-normal">
                    loremipsum@gmail.com
                  </span>{" "}
                </span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-5 max-h-5"
                  src={resolveAdminAssetPath("/Dashboard/call.png")}
                  alt=""
                />
                <span>PHONE </span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-5 max-h-5"
                  src={resolveAdminAssetPath("/Dashboard/call.png")}
                  alt=""
                />
                <span>ADDRESS -</span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-5 max-h-5"
                  src={resolveAdminAssetPath("/Dashboard/user1.png")}
                  alt=""
                />
              </p>
              <p>
                <span>PERMISSIONS -</span>

                <p>
                  <Select
                    options={options}
                    isMulti
                    closeMenuOnSelect={false}
                    placeholder="All Accessible"
                  />
                </p>
              </p>
            </p>
            <p>
              <p>Description</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                vestibulum erat erat, eu dapibus quam lobortis vitae. Aenean ut
                tellus ex. Donec vel risus ut urna scelerisque maximus. Duis
                vestibulum, enim sit amet fermentum vulputate, justo neque
                rhoncus mi, sed tempor justo velit nec dui. Maecenas condimentum
                condimentum tincidunt. Aliquam gravida eleifend sollicitudin.
                Fusce a nulla non dolor finibus vestibulum eu eu quam. Etiam
                volutpat viverra pretium. Fusce pulvinar velit tortor, sed
                luctus quam dignissim vitae. Etiam consequat porttitor velit id
                luctus. Sed vulputate tortor eu bibendum luctus. Integer a
                lectus non magna vestibulum pharetra. Vivamus ultrices metus vel
                purus iaculis mollis. Morbi sem diam, lacinia vitae ex
                facilisis, eleifend viverra metus. Donec pretium est tortor, non
                posuere quam vulputate id.{" "}
              </p>
              <p className="text-[#1A9FB2] font-bold flex items-center gap-[15px]">
                LAST ADMITTED AT -
                <span className="flex items-center gap-[15px]">
                  <img
                    className="max-w-[25px] max-h-[25px]"
                    src={resolveAdminAssetPath("/Dashboard/home.png")}
                    alt=""
                  />
                  <p className="text-black m-0">Center 1</p>
                </span>
              </p>
              <p>
                {" "}
                <Button
                  variant="primary"
                  className="py-2 px-[5.5rem] bg-[#1A9FB2] border-none"
                >
                  ASSIGN PATIENT
                </Button>
              </p>
            </p>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      <Container>
        <Row>
          <Col>
            <div className="page-title-bar">
              <p className="heading">Resident Tracking</p>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={12} md={6} lg={4}>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Control
                type="search"
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={8} className="text-end"></Col>
        </Row>
        {response?.docs?.length === 0 ? (
          <NoFound />
        ) : (
          <Table className="mt-3" bordered responsive>
            <thead>
              <tr>
                <th>Resident Name</th>
                <th>TB Test</th>
                <th>Behavioral Health Treatment Plan Review date</th>
                <th>Staffing/ART meeting Date</th>
                <th>Flu Shot</th>
                <th>Due Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {response?.docs?.map((request) => {
                return (
                  <tr key={request._id}>
                    <td>
                      {request.patientId?.firstName}{" "}
                      {request.patientId?.lastName}
                    </td>
                    <td>
                      <p>{formatDateToMMDDYYYY(request?.tbTestDate)}</p>
                    </td>
                    <td>
                      <p>
                        {formatDateToMMDDYYYY(request?.treatmentPlanReviewDate)}
                      </p>
                    </td>
                    <td>
                      <p>{formatDateToMMDDYYYY(request?.staffing)}</p>
                    </td>
                    <td>
                      <p>{formatDateToMMDDYYYY(request?.fluShot)}</p>
                    </td>
                    <td>{formatDateToMMDDYYYY(request?.dueDate)}</td>
                    <td>
                      <div className="icon-joiner">
                        <Link
                          className="view-btn"
                          onClick={() => {
                            setViewPatient(request);
                            setAddContactBtn("view");
                            setModalShow(true);
                          }}
                        >
                          <FaEye />
                        </Link>
                        <Link
                          className="edit-btn"
                          onClick={() => {
                            setAddContactBtn("edit");
                            setViewPatient(request);
                            setModalShow(true);
                          }}
                        >
                          <FaEdit />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
    </>
  );
};
export default HOC({
  Wcomponenet: PatinentTracking,
});
