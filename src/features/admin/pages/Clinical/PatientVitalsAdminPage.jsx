/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
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
import Select from "react-select";
import Offcanvas from "react-bootstrap/Offcanvas";
import Modal from "react-bootstrap/Modal";
import { singleData, getAdminUsers } from "@/features/shared/services/index";
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
import { usePrint } from "@shared/hooks";
import { ROLES } from "@/features/shared/constants/index";

const PatientVitals = () => {
  const [show, setShow] = useState(false);
  const [addContactBtn, setAddContactBtn] = useState(false);
  const [data, setData] = useState([]);
  const [employeeData, setEmployeeData] = useState({});
  const profileInfo = useSelector(userProfile);
  const printRef = useRef(null);

  const handleClose = () => setShow(false);
  const options = [
    { value: "business", label: "Business" },
    { value: "employee", label: "Employee" },
    { value: "patient", label: "Resident" },
    { value: "psychiatric", label: "Psychiatric Provider" },
    { value: "claims", label: "Claims Submission" },
  ];
  const [modalShow, setModalShow] = useState(false);

  const getEmployees = () => {
    getAdminUsers()
      .then((response) => {
        const filteredData = (response.data || []).filter(
          (item) => item.userType === ROLES.PATIENT,
        );
        setData(filteredData);
      })
      .catch((error) => {
        if (error.response?.data?.message === "No data found") {
          setEmployeeData([]);
        } else {
          setEmployeeData([]);
        }
        if (error.response?.status === 404) {
          setEmployeeData([]);
        }
      });
  };

  const getEmployeeData = (id) => {
    if (id) {
      singleData("admin/getPatientVitalsByPatientId", id)
        .then((response) => {
          setEmployeeData(response.data.data);

          if (response?.data?.data?.length === 0) {
          }
        })
        .catch((error) => {
          if (error.response?.status === 404) {
            setEmployeeData([]);
          }
        });
    } else {
      getEmployees();
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);
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

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {!addContactBtn ? (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Edit Resident’s Details</h5>
            </Modal.Header>
            <Modal.Body>
              <Form.Label className="fw-bold w-100">
                Last Updated ( Date Range )
              </Form.Label>
              <Form>
                <Row>
                  <Col xs={12} lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Staff Full Name{" "}
                      </Form.Label>
                      <Form.Control type="text" placeholder="Enter Full Name" />
                    </Form.Group>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Day </Form.Label>
                      <Form.Control type="text" placeholder="Enter Day" />
                    </Form.Group>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Date </Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Enter Start Date"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Shift Time </Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Enter Start Date"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
              <Button className="theme-button" onClick={props.onHide}>
                SAVE
              </Button>
              <Button className="theme-button-outine" onClick={props.onHide}>
                CANCEL
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Admin Tracking</h5>
            </Modal.Header>
            <ModalBody>
              <Row>
                <Col xs={12} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Full Name" />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Completion</Form.Label>
                    <Form.Control type="text" placeholder="Enter Completion" />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Date</Form.Label>
                    <Form.Control type="date" placeholder="Enter Completion" />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Due Date</Form.Label>
                    <Form.Control type="date" placeholder="Enter Completion" />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Last Updated</Form.Label>
                    <Form.Control type="text" placeholder="Enter last Update" />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Number</Form.Label>
                    <Form.Control type="text" placeholder="Enter Number" />
                  </Form.Group>
                </Col>
              </Row>
              <Form></Form>
            </ModalBody>
            <Modal.Footer className="justify-content-center">
              <Button className="theme-button" onClick={props.onHide}>
                APPLY
              </Button>
              <Button className="theme-button-outline" onClick={props.onHide}>
                CANCEL
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    );
  }

  const componentRef = useRef();
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
      size: landscape !important;
      margin: 12mm 9mm!important;
    }
    th {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  `,
  });
  const print = usePrint(printRef, handlePrint);

  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
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
                  className="max-w-[20px] max-h-[20px]"
                  src={resolveAdminAssetPath("/Dashboard/admin.png")}
                  alt=""
                />
                <span>ADMIN</span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-[20px] max-h-[20px]"
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
                  className="max-w-[20px] max-h-[20px]"
                  src={resolveAdminAssetPath("/Dashboard/call.png")}
                  alt=""
                />
                <span>PHONE </span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-[20px] max-h-[20px]"
                  src={resolveAdminAssetPath("/Dashboard/call.png")}
                  alt=""
                />
                <span>ADDRESS -</span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-[20px] max-h-[20px]"
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
              <p className="heading">Resident Vitals</p>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={12} md={6} lg={4}>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Select
                onChange={(e) => {
                  getEmployeeData(e.target.value);
                }}
              >
                <option>Select Resident</option>
                {data.map((employee) => {
                  return (
                    <option key={employee.id} value={employee._id}>
                      {employee.firstName + " " + employee.lastName}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={8} className="text-end"></Col>
        </Row>
        <div ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">Resident Vitals</h1>
          {employeeData.length === 0 ? (
            <NoFound />
          ) : (
            <Table className="mt-3" bordered responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Body Temperature</th>
                  <th>Pulse Rate</th>
                  <th>Respiration Rate</th>
                  <th>Blood Pressure Systolic/Diastolic</th>
                  <th>Blood oxygen</th>
                  <th>Weight</th>
                  <th>Blood Glucose Level</th>
                  <th>height</th>
                </tr>
              </thead>
              <tbody>
                {employeeData.length > 0 &&
                  employeeData?.map((vitals) => {
                    return (
                      <tr key={vitals._id}>
                        <td>{formatDateToMMDDYYYY(vitals?.date)}</td>
                        <td>
                          {vitals.bodyTemperature
                            ? `${vitals.bodyTemperature} °F`
                            : ""}
                        </td>
                        <td>
                          {vitals.pulseRate ? `${vitals.pulseRate} bpm` : ""}
                        </td>
                        <td>
                          {vitals.respirationRate
                            ? `${vitals.respirationRate}`
                            : ""}
                        </td>
                        <td>
                          {vitals.bloodPressure
                            ? `${vitals.bloodPressure} mmHg`
                            : ""}
                        </td>
                        <td>
                          {vitals.bloodOxygen ? `${vitals.bloodOxygen} %` : ""}
                        </td>
                        <td>{vitals.weight ? `${vitals.weight} lbs` : ""}</td>
                        <td>
                          {vitals.bloodGlucoseLevel
                            ? `${vitals.bloodGlucoseLevel} mm/dl`
                            : ""}
                        </td>
                        <td>
                          {vitals.height ? `${vitals.height} Ft/inch` : ""}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          )}

          <Row>
            <Col xs={12}>
              <button
                className="employee_create_btn hidePrint mt-3 mt-md-4"
                type="button"
                onClick={print}
              >
                PRINT REPORT
              </button>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default HOC({ Wcomponenet: PatientVitals });
