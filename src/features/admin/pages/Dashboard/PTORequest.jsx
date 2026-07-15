/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { resolveAdminAssetPath } from "@/assets";
import {
  Button,
  Col,
  Container,
  Form,
  ModalBody,
  OverlayTrigger,
  Popover,
  Table,
  Row,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "@/assets/styles/admin/Contacts.css";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Select from "react-select";
import Offcanvas from "react-bootstrap/Offcanvas";
import Modal from "react-bootstrap/Modal";
import { showNotification } from "@/utils";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import {
  getAllTimeOffRequestsForAdmin,
  deleteTimeOffRequest,
  updateTimeOffRequestStatus,
} from "@/features/shared/services";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import NavWrapper from "@/utils/NavWrapper";
import { DateFormatter } from "@/utils/Makers";
import { formatDateToMMDDYYYY } from "@/utils/utils";
const PTORequest = () => {
  const [show, setShow] = useState(false);
  const [addContactBtn, setAddContactBtn] = useState(false);
  const [requests, setRequests] = useState([]);
  const handleClose = () => setShow(false);
  const [personId, setPersonId] = useState([]);
  const [ptoRequest, setPtoRequest] = useState(["SICKTIME", "PTO"]);
  const [showpopup, setShowpopup] = useState(false);
  const [requestData, setRequestData] = useState({});
  const options = [
    { value: "business", label: "Business" },
    { value: "employee", label: "Employee" },
    { value: "patient", label: "Patient" },
    { value: "psychiatric", label: "Psychiatric Provider" },
    { value: "claims", label: "Claims Submission" },
  ];
  const [modalShow, setModalShow] = useState(false);

  const getAllRequests = () => {
    getAllTimeOffRequestsForAdmin()
      .then((response) => {
        const filteredData = response.data?.data?.filter((item) =>
          ptoRequest.includes(item.requestType),
        );

        setRequests(filteredData);
        return;
      })
      .catch((error) => {
        showNotification({ message: error.message, type: "danger" });
      });
  };

  useEffect(() => {
    getAllRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ptoRequest]);

  const deleteHandler = (id) => {
    deleteTimeOffRequest(id)
      .then((response) => {
        getAllRequests();
        showNotification({ message: response.data.message, type: "success" });
      })
      .catch((error) => {
        showNotification({
          message: error.response.data.message,
          type: "danger",
        });
      });
  };
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
      if (e.target.files && e.target.files.length > 0) {
        setSelectedFile(e.target.files[0]);
      }
    };
    const [status, setStatus] = useState("");

    const updateHandler = () => {
      updateTimeOffRequestStatus(personId, {
        status: status,
      })
        .then((response) => {
          getAllRequests();
          setShow(false);
          showNotification({ message: response.data.message, type: "success" });
          props.onHide();
        })
        .catch((error) => {
          showNotification({
            message: error.response.data.message,
            type: "danger",
          });
        });
    };

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
              <h5 className="fw-bold mb-0">For Administrator</h5>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col xs={12} md={6} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Begin Date requested
                    </Form.Label>
                    <Form.Control
                      disabled
                      type={"date"}
                      value={DateFormatter(requestData?.beginDate)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      End Date requested
                    </Form.Label>
                    <Form.Control
                      disabled
                      type={"date"}
                      value={DateFormatter(requestData?.endDate)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={4} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Unpaid Hours left
                    </Form.Label>
                    <Form.Control
                      disabled
                      type={"text"}
                      value={requestData?.unPaidHrLeft}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={4} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Vacation/Personal time used
                    </Form.Label>
                    <Form.Control
                      disabled
                      type={"text"}
                      value={requestData?.vacationPersonTimeUsed}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} md={4} lg={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Sick Time used</Form.Label>
                    <Form.Control
                      disabled
                      type={"text"}
                      value={requestData?.sickTimeUsed}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={6} lg={4}>
                  <Form.Label className="fw-bold">
                    Time Off Request approved
                  </Form.Label>
                </Col>
                <Col xs={12} sm={6} lg={8}>
                  <div
                    onChange={(e) => setStatus(e.target.value)}
                    className="radio-inline"
                  >
                    <Form.Check
                      name="group1"
                      inline
                      type="radio"
                      value={"Accept"}
                      label="Yes"
                    />
                    <Form.Check
                      name="group1"
                      inline
                      type="radio"
                      value={"Reject"}
                      label="No"
                    />
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
              <Button className="theme-button" onClick={updateHandler}>
                SAVE
              </Button>
              <Button className="theme-button-outline" onClick={props.onHide}>
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
              <Form>
                <Row>
                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter Full Name" />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Completion</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Completion"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Date</Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Enter Completion"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Due Date</Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Enter Completion"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Last Updated</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter last Update"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Number</Form.Label>
                      <Form.Control type="text" placeholder="Enter Number" />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
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
  const [query, setQuery] = useState("");
  const [currentPage2, setCurrentPage2] = useState(1);
  const [postPerPage2] = useState(5);
  const lastPostIndex2 = currentPage2 * postPerPage2;
  const firstPostIndex2 = lastPostIndex2 - postPerPage2;
  let pages2 = [];

  const TotolData = query
    ? requests?.filter(
        (i) =>
          i?.patientId?.fullName
            ?.toLowerCase()
            .includes(query?.toLowerCase()) ||
          i?.firstName?.toLowerCase().includes(query?.toLowerCase()) ||
          i?.lastName?.toLowerCase().includes(query?.toLowerCase()),
      )
    : requests;

  useEffect(() => {
    if (query) {
      setCurrentPage2(1);
    }
  }, [query]);

  const slicedData = TotolData?.slice(firstPostIndex2, lastPostIndex2);

  for (let i = 1; i <= Math.ceil(TotolData?.length / postPerPage2); i++) {
    pages2.push(i);
  }

  function Next() {
    setCurrentPage2(currentPage2 + 1);
  }

  function Prev() {
    if (currentPage2 !== 1) {
      setCurrentPage2(currentPage2 - 1);
    }
  }
  useEffect(() => {
    // If the current page has no data after deletion, move to the previous page
    if (slicedData?.length === 0 && currentPage2 > 1) {
      setCurrentPage2(currentPage2 - 1);
    }
  }, [TotolData, currentPage2, slicedData]);
  const handleCheckboxChange = (checkboxValue) => {
    if (ptoRequest.includes(checkboxValue)) {
      const updatedPtoRequest = ptoRequest.filter(
        (value) => value !== checkboxValue,
      );
      setPtoRequest(updatedPtoRequest);
    } else {
      const updatedPtoRequest = [...ptoRequest, checkboxValue];
      setPtoRequest(updatedPtoRequest);
    }
  };

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
      <NavWrapper title="PTO Request" isArrow={true} />
      <Container>
        <Row className="mt-3">
          <Col xs={8} md={4}>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Control
                type="search"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
              />
            </Form.Group>
          </Col>
          <Col xs={4} md={2}>
            <OverlayTrigger
              trigger="click"
              key={"bottom"}
              placement={"bottom"}
              show={showpopup}
              overlay={
                <Popover id={`popover-positioned-${"bottom"}`}>
                  <Popover.Body>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                      <Form.Check
                        type="checkbox"
                        checked={ptoRequest.includes("PTO")}
                        label="PTO REQUEST"
                        onClick={() => {
                          handleCheckboxChange("PTO");
                          setShowpopup(!showpopup);
                        }}
                      />
                      <Form.Check
                        type="checkbox"
                        checked={ptoRequest.includes("SICKTIME")}
                        label="SICK TIME REQUEST"
                        onClick={() => {
                          handleCheckboxChange("SICKTIME");
                          setShowpopup(!showpopup);
                        }}
                      />
                    </Form.Group>
                  </Popover.Body>
                </Popover>
              }
            >
              <img
                className="max-w-[35px] max-h-[35px] w-auto h-auto cursor-pointer"
                onClick={() => setShowpopup(!showpopup)}
                src={resolveAdminAssetPath("/Dashboard/contacts/filter.png")}
                alt="filter"
              />
            </OverlayTrigger>
          </Col>
          <Col xs={8} md={6} className="text-end"></Col>
        </Row>
        {slicedData.length === 0 ? (
          <NoFound />
        ) : (
          <Table responsive bordered className="mt-2">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Date of Birth</th>
                <th>ID</th>
                <th>Mobile No.</th>
                <th>Request Type</th>
                <th>Time off request approved</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {slicedData &&
                slicedData.map((request) => {
                  return (
                    <tr key={request.id}>
                      <td>
                        {`${request.employeeId?.firstName} ${request.employeeId?.lastName}`}
                      </td>
                      <td>
                        {formatDateToMMDDYYYY(request.employeeId?.dateOfBirth)}
                      </td>
                      <td>{request.employeeId?.Id}</td>
                      <td>{request.employeeId?.mobileNumber}</td>
                      <td>{request.requestType}</td>
                      <td>{request.status}</td>
                      <td>
                        <div className="icon-joiner">
                          <Link
                            className="edit-btn"
                            onClick={() => {
                              setRequestData(request);
                              setPersonId(request._id);
                              setModalShow(true);
                            }}
                          >
                            <FaRegEdit />
                          </Link>
                          <Link
                            className="del-btn"
                            onClick={() => deleteHandler(request._id)}
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
      </Container>
    </>
  );
};

export default HOC({ Wcomponenet: PTORequest });
