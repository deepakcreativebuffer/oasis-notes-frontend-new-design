/* eslint-disable no-unused-vars */
/** @format */

// Appointments.js
import React, { useEffect, useState, useCallback, useMemo } from "react";
import AppointmentsCard from "../Cards/AppointmentsCard";
import { ClipLoader } from "react-spinners";
import { nurse1 } from "@/assets";
import { residentService, COMMON_APIS } from "@/features/shared/services";
import { useFileUpload } from "@shared/hooks";
import Vital from "@/features/shared/features/clinical/vitals/VitalResidentPanel";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import {
  Container,
  Table,
  Row,
  Col,
  Form,
  Card,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import CustomSelect from "@/features/shared/ui/selectors/CustomSelect";
import HOC from "@/features/shared/layout/Outer/HOC";
import "./Appointments.css";
import "../Appointment Scheduling/AppointmentScheduling.css";
import "../Forms/Form.css";
import {
  convertTimeFormat,
  formatDateToMMDDYYYY,
  fetchPaitentName,
} from "@/utils/utils";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { MdOutlineAdd, MdOutlineFileUpload } from "react-icons/md";
import { ROLES } from "@/features/shared/constants";
import ENV from "@/features/shared/config/env";
import { showNotification, logger } from "@/utils";
const FilesNames = [
  "Progress Note",
  "Discharge",
  "Activities of Daily Living Tracking Form",
  "Financial Transactions Record",
  "ART Meeting",
  "Authorization for Release of Information",
  "Incident Report",
  "Contact Note",
  "Mars",
  "Medication Reconciliation",
  "Medication Count",
  "Informed Consent for Medications",
  "PRN Medication Log",
  "Mental Status",
  "Refusal of Medical Treatment Form",
  "Appointment Tracking Log",
];
const DocumentUploader = React.memo((props) => {
  const [fileType, setFileType] = useState("");
  const fileUpload = useFileUpload();
  const [arr, setArr] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [docArr, setDocArr] = useState();
  const removeFile = useCallback((index, data) => {
    residentService.deleteDocument(data._id);
    setArr((prevArr) => prevArr.filter((_, i) => index !== i));
  }, []);
  const uploadFiles = useCallback(
    (e) => {
      e.preventDefault();
      if (!fileUpload.file) {
        showNotification({
          message: "Please select a file",
          type: "danger",
        });
        return;
      }
      const filePayload = new FormData();
      filePayload.append("type", fileType);
      filePayload.append("file", fileUpload.file);
      residentService.uploadDocument({
        payload: filePayload,
        setArr,
        setLoading: setUploading,
      });
    },
    [fileUpload.file, fileType],
  );
  useEffect(() => {
    if (props?.show) {
      if (!props?.patitentId) {
        residentService.getApiResident({
          url: COMMON_APIS.GET_USER_DOCUMENTS,
          setResponse: setDocArr,
        });
      }
    }
  }, [props?.show, props?.patitentId]);
  const openBlobUrl = useCallback(async (downloadUrl) => {
    try {
      if (!downloadUrl) return;
      const url = encodeURI(`${ENV.CLOUDFRONT_URL}${downloadUrl}`);
      window.open(url, "_blank");
    } catch (error) {
      logger.error("Error opening document URL", error);
      showNotification({
        message: "Failed to open document.",
        type: "danger",
      });
    }
  }, []);
  useEffect(() => {
    if (docArr && docArr.data)
      setArr((prevData) => [...prevData, ...docArr.data]);
  }, [docArr]);
  const handleSelectFileType = useCallback((value) => setFileType(value), []);
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="file-upload-modal">
        <Form onSubmit={uploadFiles}>
          <div className="close-header">
            <h5>File Upload </h5>
            <FontAwesomeIcon
              icon={faTimes}
              className="fa-xmark"
              onClick={props.onHide}
            />
          </div>
          <Card body className="mb-3 mt-3">
            <Row>
              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">File Name</Form.Label>
                  <CustomSelect
                    options={FilesNames}
                    filterOnType
                    onChange={handleSelectFileType}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Choose File</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={fileUpload.onSelectFile}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Upload File</Form.Label>
                  <div className="d-block">
                    <Button className="theme-button w-100" type="submit">
                      {uploading ? <ClipLoader color="#fff" /> : "Upload File"}
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Table responsive bordered className="mt-3">
                  <thead>
                    <tr>
                      <th className="text-start">Type</th>
                      <th className="text-start">File</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {arr?.map((i, index) => (
                      <tr key={index}>
                        <td className="text-start"> {i.type} </td>
                        <td className="text-start">
                          <Button
                            size="sm"
                            onClick={(event) => {
                              event.preventDefault();
                              openBlobUrl(i.document);
                            }}
                            className="delete-btn"
                          >
                            Download File
                          </Button>
                        </td>
                        <td>
                          <div className="icon-joiner">
                            <Link className="del-btn">
                              <FontAwesomeIcon
                                icon={faTrashCan}
                                className="fa-solid fa-trash-can"
                                onClick={() => removeFile(index, i)}
                              />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Card>
        </Form>
      </Modal.Body>
    </Modal>
  );
});
const Appointments = () => {
  const [show, setShow] = useState(false);
  const profileUser = useSelector(userProfile);
  const hoursFormat = profileUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const [appoinmentUpcoming, setAppoinmentUpcoming] = useState([]);
  const [view, setView] = useState(false);
  useEffect(() => {
    residentService.getUpcomingAppointments(setAppoinmentUpcoming);
  }, []);
  const handleHide = useCallback(() => setShow(false), []);
  const handleShow = useCallback(() => setShow(true), []);
  const handleBookAppointment = useCallback(() => {
    navigate(
      profileUser?.userType === ROLES.GUARDIAN
        ? "/bookappointment-resident"
        : "/booknewappointment",
    );
  }, [profileUser?.userType, navigate]);
  const handleGoToHistory = useCallback(() => {
    navigate("/appointmenthistory");
  }, [navigate]);
  const handleManageAppointment = useCallback(() => {
    navigate("/manageappointment");
  }, [navigate]);
  return (
    <div className="dashboard-stats">
      <Container fluid>
        <Row>
          <Col xs={12} md={12} xl={12} className="mb-3 mb-lg-4">
            <Card
              no-body
              className="HomePageDashboard overflow-hidden border-0"
            >
              <Row className="align-items-center">
                <Col xs={12} md={4} lg={4} xl={4}>
                  <div className="position-relative z-1 text-center text-lg-start card-body">
                    <h4 className="text-white fw-semibold my-md-3 mb-3 fs-4">
                      Welcome Back{" "}
                      <span className="fw-normal ">
                        {profileUser && fetchPaitentName(profileUser)}!
                      </span>
                    </h4>
                    <h6 className="opacity-75 fw-normal text-white mb-0 fs-6">
                      How can we help you today?
                    </h6>
                  </div>
                </Col>
                <Col xs={12} md={4} lg={4} xl={4}>
                  <div className="position-relative z-1 card-body">
                    <div className="text-center py-lg-7">
                      <h4 className="text-white fw-semibold text-center my-md-3 mb-3 fs-4">
                        <span>Welcome to the Oasis Notes!</span>
                      </h4>
                    </div>
                  </div>
                </Col>
                <Col
                  xs={12}
                  md={4}
                  xl={4}
                  className="align-self-end text-center text-lg-right"
                >
                  <div className="position-relative z-1">
                    <img
                      src="/doctor-appoint.svg"
                      className="img-fluid d-none d-md-inline-block float-md-end max-h-[200px]"
                      alt="welcome-patient"
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
      <Container fluid>
        <Row className="align-items-center mb-3">
          <Col xs={12} sm={12} md={5} lg={4}>
            <div className="header-card-title">
              <h5 className="mb-md-0 page-name fw-bold">
                Upcoming Appointments
              </h5>
            </div>
          </Col>
          <Col xs={12} sm={12} md={7} lg={8}>
            <div className="d-sm-flex justify-content-sm-end align-items-center gap-2">
              <Button
                type="button"
                className="appointment-btn m-1 my-sm-0"
                onClick={handleBookAppointment}
              >
                <span className="d-flex align-items-center gap-2">
                  <MdOutlineAdd />
                  <span className="d-inline-block">Book New Appointment</span>
                </span>
              </Button>
              <Button
                type="button"
                className="blue-theme-btn m-1 my-sm-0"
                onClick={handleGoToHistory}
              >
                Appointment History
              </Button>
              <Button
                type="button"
                className="success-theme-btn m-1 my-sm-0"
                onClick={handleManageAppointment}
              >
                Manage Appointment
              </Button>
            </div>
          </Col>
        </Row>
        {(appoinmentUpcoming?.data || appoinmentUpcoming)?.length > 0 ? (
          <Card
            body
            className="mb-3 mb-lg-4 border-0 relative shadow-sm d-none"
          >
            Upcoming Appointments
          </Card>
        ) : (
          <Card body className="mb-3 mb-lg-4 border-0 relative shadow-sm">
            No Upcoming Appointments
          </Card>
        )}
        <Row>
          {view
            ? (appoinmentUpcoming?.data || appoinmentUpcoming)?.map(
                (appointment, index) => (
                  <Col xs={12} md={12} lg={4} key={index}>
                    <AppointmentsCard
                      imageUrl={
                        appointment?.adminId?.profilePic
                          ? appointment?.adminId?.profilePic
                          : nurse1
                      }
                      date={formatDateToMMDDYYYY(appointment?.date)}
                      slot={convertTimeFormat(appointment?.time, hoursFormat)}
                      location={appointment?.address}
                    />
                  </Col>
                ),
              )
            : (appoinmentUpcoming?.data || appoinmentUpcoming)
                ?.slice(0, 6)
                ?.map((appointment, index) => (
                  <Col xs={12} md={12} lg={4} key={index}>
                    <AppointmentsCard
                      imageUrl={
                        appointment?.adminId?.profilePic
                          ? appointment?.adminId?.profilePic
                          : nurse1
                      }
                      date={formatDateToMMDDYYYY(appointment?.date)}
                      slot={convertTimeFormat(appointment?.time, hoursFormat)}
                      location={appointment?.address}
                    />
                  </Col>
                ))}
        </Row>

        {profileUser?.userType === ROLES.PATIENT && <Vital />}

        {profileUser?.userType === ROLES.PATIENT && (
          <div className="default-shadow-box">
            <div className="header-card-title mb-3">
              <h5 className="mb-0 page-name fw-bold">Upload Document</h5>
            </div>
            <Row>
              <Col sm={12} md={6} lg={3}>
                <button
                  onClick={handleShow}
                  className="upload-document-btn py-md-4 w-100 card text-center"
                >
                  <MdOutlineFileUpload className="mx-auto" />
                  <span className="file-upload-text d-inline-block mt-3">
                    File Upload
                  </span>
                </button>
              </Col>
            </Row>
          </div>
        )}

        {/* model section */}
        <DocumentUploader show={show} onHide={handleHide} />
      </Container>
    </div>
  );
};
export default HOC({
  Wcomponenet: Appointments,
});
