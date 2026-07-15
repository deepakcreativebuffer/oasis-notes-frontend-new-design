/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { resolveAdminAssetPath } from "@/assets";
import {
  Button,
  Form,
  ModalBody,
  Table,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import "@/assets/styles/admin/Contacts.css";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Select from "react-select";
import Offcanvas from "react-bootstrap/Offcanvas";
import Modal from "react-bootstrap/Modal";
import { showNotification } from "@/utils";
import {
  getObjectUrlFromDownloadUrl,
  adminDashboardService,
  adminAdmitLogsService,
  getUserById,
} from "@/features/shared/services";
import HOC from "@/features/shared/layout/Outer/HOC";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import Loader from "@/features/shared/ui/Loader/Loader";
import DatePicker from "react-datepicker";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import { usePrint } from "@shared/hooks";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import { DEFAULT_PAGE_SIZE, ROLES } from "@/features/shared/constants";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

const Logs = () => {
  const printBtnRef = useRef(null);
  const [show, setShow] = useState(false);
  const [addContactBtn, setAddContactBtn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [contactData, setContactData] = useState({});
  const [logId, setLogId] = useState(null);
  const [userData, setUserData] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [filterFun, setFilterFun] = useState({});
  const [viewLog, setViewLog] = useState({});
  const [logsPrint, setLogsPrint] = useState([]);
  const [newFilterFun, setNewFilterFun] = useState(null);
  const profileInfo = useSelector(userProfile);
  const printRef = React.useRef(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const userDataget = async () => {
    const response = await getUserById(userId);
    if (response.success) {
      setUserData(response.data);
    }
  };
  const setAssignPatientId = () => {};
  const handlePermissionChange = () => {};
  const handlePermissionChange2 = () => {};
  const options = [
    {
      value: "permissionPsychiatricProvider",
      label: "Psychiatric Provider",
    },
    {
      value: "permissionClaimSubmission",
      label: "Claims Submission",
    },
  ];
  const option2 = [
    {
      label: "Initial Assessment",
      value: "initialAssessment",
    },
    {
      label: "Nursing Assessment",
      value: "nursingAssessment",
    },
    {
      label: "Behavioral Health Treatment Plan",
      value: "treatmentPlan",
    },
    {
      label: "Face Sheet",
      value: "faceSheet",
    },
    {
      label: "Safety Plan",
      value: "safetyPlan",
    },
    {
      label: "Resident Intakes",
      value: "residentIntakes",
    },
  ];
  const [modalShow, setModalShow] = useState(false);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        profileInfo,
        profileInfo,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(profileInfo, profileInfo),
    pageStyle: `
    @page {
      margin: 10mm 9mm!important;
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
  function MyVerticallyCenteredModal(props) {
    const [patients, setPatients] = useState([]);
    const [patientId, setPatientId] = useState(null);
    const [AHCCCSId, setAHCCCSId] = useState(" ");
    const [admitDate, setAdmitDate] = useState(null);
    const getAllPatients = async () => {
      const response = await adminAdmitLogsService.getUsers();
      if (response.success) {
        const filteredData = response.data.filter(
          (item) => item.userType === ROLES.PATIENT,
        );
        setPatients(filteredData);
      }
    };
    useEffect(() => {
      if (modalShow) {
        getAllPatients();
      }
    }, []);
    useEffect(() => {
      const patientDetails = patients.find(
        (patient) => patient?._id === patientId,
      );
      setAHCCCSId(patientDetails?.ahcccsId);
      setAdmitDate(patientDetails?.admitDate);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientId]);
    const submitHandler = async (e) => {
      e.preventDefault();
      const payload = {};
      if (AHCCCSId) {
        payload.ahcccsId = AHCCCSId;
      }
      if (admitDate) {
        payload.dateOfAdmit = admitDate;
      }
      if (patientId) {
        payload.patientId = patientId;
      }
      const response = await adminAdmitLogsService.addAdmitDetails(payload);
      if (response.success) {
        showNotification({ message: response.message, type: "success" });
        getAllLogs();
        props.onHide();
      } else {
        showNotification({ message: response.message, type: "danger" });
      }
    };
    const [updatePatientData, setUpdatePatientData] = useState({
      reasonOfDischarge: viewLog?.reasonOfDischarge || "",
      dateOfDischarge: viewLog?.dateOfDischarge || "",
    });
    const updatePatientDataHandler = (name, value) => {
      setUpdatePatientData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
    const updateHandler = async (e) => {
      e.preventDefault();
      const res = await adminAdmitLogsService.updateAdmitDetails(
        logId,
        updatePatientData,
      );
      if (res.success) {
        showNotification({ message: res.message, type: "success" });
        getAllLogs();
        props.onHide();
      } else {
        showNotification({ message: res.message, type: "danger" });
      }
    };
    const [startDischargeDate, setStartDischargeDate] = useState(
      newFilterFun?.[0] || "",
    );
    const [endDischargeDate, setEndDischargeDate] = useState(
      newFilterFun?.[1] || "",
    );
    const handleFilterFunction = () => {
      const datedata = [];
      datedata.push(startDischargeDate, endDischargeDate);
      setNewFilterFun(datedata);
      props.onHide();
      setModalShow(false);
    };
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {addContactBtn === "filter" ? (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Filter</h5>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <p className="text-black font-semibold">Discharge Date Range</p>
                <Form>
                  <Row>
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="w-full font-bold">
                          From{" "}
                        </Form.Label>
                        <Form.Control
                          onChange={(e) =>
                            setStartDischargeDate(e.target.value)
                          }
                          type="date"
                          placeholder="Enter Start Date"
                          value={startDischargeDate}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="w-full font-bold">
                          To{" "}
                        </Form.Label>
                        <Form.Control
                          onChange={(e) => setEndDischargeDate(e.target.value)}
                          type="date"
                          placeholder="Enter Start Date"
                          value={endDischargeDate}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
              <Button className="theme-button" onClick={handleFilterFunction}>
                APPLY
              </Button>
              <Button className="theme-button-outline" onClick={props.onHide}>
                CANCEL
              </Button>
            </Modal.Footer>
          </>
        ) : addContactBtn === "add" ? (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Add New Resident's Log</h5>
            </Modal.Header>
            <Form onSubmit={submitHandler}>
              <ModalBody>
                <Form.Group className="mb-3">
                  <Form.Label className="w-full font-bold">
                    Resident Full Name:
                  </Form.Label>
                  <Form.Select
                    required
                    onChange={(e) => {
                      setPatientId(e.target.value);
                    }}
                  >
                    <option value="">Select Resident</option>
                    {patients.map((patient) => (
                      <option value={patient._id} key={patient._id}>
                        {patient.firstName} {patient.lastName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="w-full font-bold">
                    AHCCCS ID:
                  </Form.Label>
                  <Form.Control
                    disabled
                    type="text"
                    placeholder="Enter Completion"
                    value={AHCCCSId || ""}
                  />
                </Form.Group>
                <Form.Group required className="mb-3 d-flex flex-column">
                  <Form.Label className="w-full font-bold">
                    Admit Date:
                  </Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(admitDate)}
                    onChange={(selectedDate) =>
                      setAdmitDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          admitDate
                            ? formatDateToMMDDYYYY(admitDate)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                    disabled
                  />
                </Form.Group>
              </ModalBody>
              <Modal.Footer className="justify-content-center">
                <Button className="theme-button" type="submit">
                  APPLY
                </Button>
                <Button className="theme-button-outline" onClick={props.onHide}>
                  CANCEL
                </Button>
              </Modal.Footer>{" "}
            </Form>
          </>
        ) : addContactBtn === "edit" ? (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Edit Resident's Log</h5>
            </Modal.Header>
            <ModalBody>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="w-full font-bold">
                    Reason of Discharge
                  </Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      updatePatientDataHandler(
                        "reasonOfDischarge",
                        e.target.value,
                      )
                    }
                    type="text"
                    placeholder="Enter Reason"
                    value={updatePatientData.reasonOfDischarge}
                  />
                </Form.Group>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="w-full font-bold">
                    Date of Discharge
                  </Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(
                      updatePatientData?.dateOfDischarge,
                    )}
                    onChange={(selectedDate) =>
                      updatePatientDataHandler(
                        "dateOfDischarge",
                        selectedDate?.toDateString(),
                      )
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          updatePatientData?.dateOfDischarge
                            ? formatDateToMMDDYYYY(
                                updatePatientData?.dateOfDischarge,
                              )
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Form>
            </ModalBody>

            <Modal.Footer className="justify-content-center">
              <Button className="theme-button" onClick={updateHandler}>
                APPLY
              </Button>
              <Button className="theme-button-outline" onClick={props.onHide}>
                CANCEL
              </Button>
            </Modal.Footer>
          </>
        ) : addContactBtn === "view" ? (
          <div ref={printRef} tabIndex={0} className="outline-none">
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">View Resident's Log</h5>
            </Modal.Header>
            <ModalBody>
              <div ref={componentRef}>
                <h1 className="pdfTitle hidden mt-2.5"> Resident's Log</h1>
                <Form>
                  {viewLog?.patientId?.profilePic ? (
                    <Form.Group className="mb-3 flex justify-center">
                      <img
                        src={getObjectUrlFromDownloadUrl(
                          viewLog?.patientId?.profilePic,
                        )}
                        alt="view"
                        className="w-25 h-25 rounded-full"
                      />
                    </Form.Group>
                  ) : (
                    <div className="flex justify-center mb-5">
                      <img
                        src="https://www.w3schools.com/howto/img_avatar.png"
                        alt="view"
                        className="w-25 h-25 rounded-full"
                      />
                    </div>
                  )}
                  <div className="view-details">
                    <Row>
                      <Col xs={12} sm={5} md={12} lg={6}>
                        <div className="view-details-grid my-1 my-md-2 p-3">
                          <p className="view-label mb-1 mb-md-0">
                            Resident Name :{" "}
                          </p>
                          <h5 className="view-value mb-0">
                            {viewLog?.patientId?.firstName}{" "}
                            {viewLog?.patientId?.lastName}
                          </h5>
                        </div>
                      </Col>
                      <Col xs={12} sm={3} md={12} lg={6}>
                        <div className="view-details-grid my-1 my-md-2 p-3">
                          <p className="view-label mb-1 mb-md-0">
                            AHCCCS Id :{" "}
                          </p>
                          <h5 className="view-value mb-0">
                            {viewLog?.ahcccsId}
                          </h5>
                        </div>
                      </Col>
                      <Col xs={12} sm={4} md={12} lg={6}>
                        <div className="view-details-grid my-1 my-md-2 p-3">
                          <p className="view-label mb-1 mb-md-0">
                            Date Of Birth :{" "}
                          </p>
                          <h5 className="view-value mb-0">
                            {formatDateToMMDDYYYY(viewLog?.dateOfBirth)}
                          </h5>
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={6}>
                        <div className="view-details-grid my-1 my-md-2 p-3">
                          <p className="view-label mb-1 mb-md-0">
                            Date Of Admit :{" "}
                          </p>
                          <h5 className="view-value mb-0">
                            {formatDateToMMDDYYYY(viewLog?.dateOfAdmit)}
                          </h5>
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={6}>
                        <div className="view-details-grid my-1 my-md-2 p-3">
                          <p className="view-label mb-1 mb-md-0">
                            Resident Email :{" "}
                          </p>
                          <h5 className="view-value mb-0">
                            {viewLog?.patientId?.email}
                          </h5>
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={6}>
                        <div className="view-details-grid my-1 my-md-2 p-3">
                          <p className="view-label mb-1 mb-md-0">
                            Date Of DisCharge :{" "}
                          </p>
                          <h5 className="view-value mb-0">
                            {formatDateToMMDDYYYY(viewLog?.dateOfDischarge)}
                          </h5>
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <div className="view-details-grid my-1 my-md-2 p-3">
                          <p className="view-label mb-1 mb-md-0">
                            Discharged :{" "}
                          </p>
                          <h5 className="view-value mb-0">
                            {viewLog?.isDischarge ? "Yes" : "No"}
                          </h5>
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                          <p className="view-label mb-1 mb-md-0">
                            Reason Of Discharge :{" "}
                          </p>
                          <h5 className="view-value mb-0">
                            {viewLog?.reasonOfDischarge}
                          </h5>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </div>
            </ModalBody>
            <Modal.Footer className="justify-content-center">
              <Button
                id="printBtn"
                ref={printBtnRef}
                onClick={print}
                className="theme-button"
              >
                PRINT
              </Button>
              <Button className="theme-button-outline" onClick={props.onHide}>
                CANCEL
              </Button>
            </Modal.Footer>
          </div>
        ) : null}
      </Modal>
    );
  }
  const { data: logs, isLoading: loading } = useQuery({
    queryKey: queryKeys.adminAdmitLogs.list({
      page,
      limit,
      search: debouncedQuery,
    }),
    queryFn: () =>
      adminAdmitLogsService.getAdmitDetails({
        page,
        limit,
        search: debouncedQuery,
      }),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();
  const getAllLogs = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.adminAdmitLogs.all() });
  }, [queryClient]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (logs?.data?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [logs?.data?.docs?.length, page]);
  const deleteHandler = async (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };
  useEffect(() => {
    if (show) {
      userDataget();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);
  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={getAllLogs}
        onDelete={({ additionalFunctions }) =>
          adminDashboardService.deleteAdmitDetails(deleteId, {
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
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
              src={
                getObjectUrlFromDownloadUrl(contactData?.profilePic) ||
                resolveAdminAssetPath("/Dashboard/contacts/user.png")
              }
              className="max-w-[125px] max-h-[125px] w-[85px] h-[85px] rounded-full"
              alt="user"
            />
            <p>
              <p className="font-bold text-black">
                {contactData?.firstName} {contactData?.lastName}
              </p>
              <p className="flex gap-[5px] items-center font-bold text-black">
                <img
                  className="w-5 h-5"
                  src={resolveAdminAssetPath("/Dashboard/admin.png")}
                  alt=""
                />
                <span>{contactData?.userType}</span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="w-5 h-5"
                  src={resolveAdminAssetPath("/Dashboard/message.png")}
                  alt=""
                />
                <span>
                  EMAIL -{" "}
                  <span className="text-black font-normal">
                    {contactData?.email}
                  </span>{" "}
                </span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-5 max-h-5"
                  src={resolveAdminAssetPath("/Dashboard/call.png")}
                  alt=""
                />
                <span>
                  PHONE-{" "}
                  <span className="text-black font-normal">
                    {contactData?.mobileNumber}
                  </span>{" "}
                </span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-5 max-h-5"
                  src={resolveAdminAssetPath("/Dashboard/call.png")}
                  alt=""
                />
                <span>
                  ADDRESS -{" "}
                  <span className="text-black font-normal">
                    {contactData?.address}
                  </span>{" "}
                </span>
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
                  {contactData?.userType === ROLES.EMPLOYEE ? (
                    <>
                      <Select
                        options={options}
                        defaultValue={[
                          contactData.permissionPsychiatricProvider
                            ? options[1]
                            : null,
                          contactData.permissionClaimSubmission
                            ? options[2]
                            : null,
                        ].filter(Boolean)}
                        isMulti
                        closeMenuOnSelect={false}
                        placeholder="All Accessible"
                        onChange={(selectedOptions) => {
                          handlePermissionChange(
                            selectedOptions,
                            contactData._id,
                            contactData.userType,
                          );
                        }}
                      />
                    </>
                  ) : (
                    <Select
                      options={option2}
                      defaultValue={[
                        contactData.initialAssessment ? option2[0] : null,
                        contactData.nursingAssessment ? option2[1] : null,
                        contactData.treatmentPlan ? option2[2] : null,
                        contactData.faceSheet ? option2[3] : null,
                        contactData.safetyPlan ? option2[4] : null,
                        contactData.residentIntakes ? option2[5] : null,
                      ].filter(Boolean)}
                      isMulti
                      closeMenuOnSelect={false}
                      placeholder="All Accessible"
                      onChange={(selectedOptions) => {
                        handlePermissionChange2(
                          selectedOptions,
                          contactData._id,
                          contactData.userType,
                        );
                      }}
                    />
                  )}
                </p>
              </p>
            </p>
            <p>
              <p className="font-bold text-[#0C5C75]">Description</p>
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
                    className="max-w-5 max-h-5"
                    src={resolveAdminAssetPath("/Dashboard/home.png")}
                    alt=""
                  />
                  <p className="text-black m-0">Center 1</p>
                </span>
              </p>
              <p>
                {contactData?.userType === ROLES.PATIENT && (
                  <Button
                    onClick={() => {
                      setAssignPatientId(contactData._id);
                      setAddContactBtn("assign");
                      setModalShow(true);
                    }}
                    variant="primary"
                    className="py-2 px-[5.5rem] bg-[#1A9FB2] border-none cursor-pointer"
                  >
                    ASSIGN PATIENT
                  </Button>
                )}
              </p>
            </p>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      <Container className="full-width-container dashboard-page">
        <Row>
          <Col>
            <div className="page-title-bar">
              <p className="heading">Resident Admission & Discharge Logs</p>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={8} md={4}>
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

          <Col xs={4} md={8} className="text-end">
            <Button
              onClick={() => {
                setViewLog({});
                setAddContactBtn("add");
                setModalShow(true);
              }}
              variant="primary"
              className="theme-button"
            >
              + ADD NEW LOG
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {loading ? (
              <Loader />
            ) : !logs?.data?.docs?.length ? (
              <NoFound />
            ) : (
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Resident Name</th>

                    <th>AHCCCS ID</th>
                    <th>Admit Date</th>
                    <th>Discharge Date</th>
                    <th>Reason for Discharge</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {logs?.data?.docs?.length > 0 &&
                    logs?.data?.docs?.map((log) => {
                      return (
                        <tr key={log._id}>
                          <td
                            onClick={() => {
                              setContactData(log);
                              setUserId(log.patientId?._id);
                              handleShow();
                            }}
                          >
                            {log.patientId?.firstName}
                            {log.patientId?.lastName}
                          </td>
                          <td>{log?.patientId?.ahcccsId}</td>
                          <td
                            className={`${log?.patientId?.admitDate ? "" : "text-center"}`}
                          >
                            {formatDateToMMDDYYYY(
                              log?.patientId?.admitDate,
                            ) || <span>&mdash;</span>}
                          </td>
                          <td
                            className={`${log?.dateOfDischarge ? "" : "text-center"}`}
                          >
                            {formatDateToMMDDYYYY(log.dateOfDischarge) || (
                              <span>&mdash;</span>
                            )}
                          </td>
                          <td
                            className={`${log?.reasonOfDischarge ? "" : "text-center"}`}
                          >
                            {log.reasonOfDischarge || <span>&mdash;</span>}
                          </td>
                          <td>
                            <div className="icon-joiner">
                              <Link
                                className="view-btn"
                                onClick={() => {
                                  setViewLog(log);
                                  setAddContactBtn("view");
                                  setModalShow(true);
                                }}
                              >
                                <FaEye />
                              </Link>
                              <Link
                                className="edit-btn"
                                onClick={() => {
                                  setViewLog(log);
                                  setLogId(log._id);
                                  setAddContactBtn("edit");
                                  setModalShow(true);
                                }}
                              >
                                <FaRegEdit />
                              </Link>
                              <Link
                                className="del-btn"
                                onClick={() => {
                                  deleteHandler(log._id);
                                }}
                              >
                                <RiDeleteBin5Fill />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
        {logs?.data?.docs.length > 0 && (
          <PaginationsPage
            page={page}
            setPage={setPage}
            totalPages={logs?.data?.totalPages && logs?.data?.totalPages}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: Logs,
});
