/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { resolveAdminAssetPath } from "@/assets";
import { useSelector } from "react-redux";
import {
  Button,
  Form,
  ModalBody,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import Select from "react-select";
import Offcanvas from "react-bootstrap/Offcanvas";
import Modal from "react-bootstrap/Modal";
import { MultiSelect } from "react-multi-select-component";
import { Link, useNavigate } from "react-router-dom";
import { userProfile } from "@/store/authSlice";
import { fetchPaitentName } from "@/utils/utils";
import HOC from "@/features/shared/layout/Outer/HOC";
import {
  MdGroup,
  MdInsertChartOutlined,
  MdAccessTime,
  MdHistory,
  MdNorthEast,
  MdCircleNotifications,
} from "react-icons/md";
import "./Dashboard/Dashboard.css";
import {
  adminPortalService,
  getAdminProfile,
  getSuperadminNotifications,
} from "@/features/shared/services";
import { ROLES } from "@/features/shared/constants";
import { logger } from "@/utils";
const HomePage1 = () => {
  const ProfileDetails = useSelector(userProfile);
  const [show, setShow] = useState(false);
  const [addContactBtn] = useState("");
  const [viewItem] = useState({});
  const handleClose = () => setShow(false);
  const [companyName, setCompanyName] = useState("");
  const [notifications, setNotifications] = useState({});
  const [mainNotifications, setMainNotifications] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const getAllAdminDetails = () => {
      getAdminProfile().then((res) => {
        if (res?.success) {
          setCompanyName(res?.data?.fullName);
        }
      });
    };
    const getAllNotifications = () => {
      if (ProfileDetails?.userType !== ROLES.ADMIN) return;
      getSuperadminNotifications()
        .then((res) => {
          const dataList = Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.data?.docs)
              ? res.data.docs
              : [];
          if (dataList.length === 0) return;

          const today = new Date().setHours(0, 0, 0, 0); // Today's date at midnight

          const todayAndFutureNotifications = dataList.filter((i) => {
            const notificationDate = new Date(i?.date || i?.time).setHours(
              0,
              0,
              0,
              0,
            );
            return notificationDate >= today; // Include today and future notifications
          });

          // Update state with first two notifications
          setNotifications(todayAndFutureNotifications.slice(0, 2));

          // Extract non-empty titles
          const titles = todayAndFutureNotifications
            .map((i) => i.title?.trim())
            .filter(Boolean);
          if (titles.length > 0) {
            setMainNotifications(titles[titles.length - 1]); // Set last non-empty title
          }
        })
        .catch((err) => logger.debug(err));
    };

    getAllNotifications();
    getAllAdminDetails();
  }, [ProfileDetails?.userType]);
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
      label: "Patient",
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
  function MyVerticallyCenteredModal(props) {
    const [selectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(
      resolveAdminAssetPath("/public/Dashboard/contacts/user.png"),
    );
    const [selected, setSelected] = useState([]);
    const handleChange = (selectedOptions) => {
      setSelected(selectedOptions);
    };
    useEffect(() => {
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFile]);
    const [title, setTitle] = useState(viewItem?.title || "");
    const [discription, setDiscription] = useState(viewItem?.description || "");
    const [imageFileData, setImageFileData] = useState(null);
    const addNewsHandler = (e) => {
      e.preventDefault();
      const formdata = new FormData();
      formdata.append("title", title);
      formdata.append("description", discription);
      formdata.append("image", imageFileData);
      adminPortalService.createNews(formdata, {
        additionalFunctions: [getAllNews, props.onHide],
      });
    };
    const addNewsHandler2 = (e) => {
      e.preventDefault();
      const formdata = new FormData();
      if (imageFileData) {
        formdata.append("image", imageFileData);
      }
      if (title) {
        formdata.append("title", title);
      }
      if (discription) {
        formdata.append("description", discription);
      }
      adminPortalService.updateNews(viewItem?._id, formdata, {
        additionalFunctions: [getAllNews, props.onHide],
      });
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
              <p className="text-black font-semibold text-[1.5rem]">Filter</p>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <Form.Group className="mb-3">
                  <Form.Label className="w-full font-bold">Admin</Form.Label>
                  <MultiSelect
                    options={optionAdmin}
                    value={selected}
                    onChange={handleChange}
                    labelledBy="Select"
                    hasSelectAll={false}
                  />
                </Form.Group>
                <Form className="mb-3">
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Subject
                    </Form.Label>
                    <Form.Control type="Enter Question" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Information
                    </Form.Label>
                    <Form.Control as={"textarea"} rows={3} type="Enter text" />
                  </Form.Group>
                </Form>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="w-[90%] flex justify-around">
                <Button
                  className="bg-[#0C5C75] text-white font-medium px-[3.5rem] py-2"
                  onClick={props.onHide}
                >
                  APPLY
                </Button>
                <Button
                  className="px-[3.5rem] py-2 ml-4 text-[#0C5C75] bg-transparent"
                  onClick={props.onHide}
                >
                  CANCEL
                </Button>
              </div>
            </Modal.Footer>
          </>
        ) : addContactBtn === "add" ? (
          <>
            <Modal.Header closeButton>
              <p className="text-black font-semibold text-[1.2rem]">Add News</p>
            </Modal.Header>
            <Form onSubmit={addNewsHandler}>
              <ModalBody>
                <div>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">Image</Form.Label>
                    <Form.Control
                      onChange={(e) => setImageFileData(e.target.files[0])}
                      required
                      type="file"
                      placeholder="Enter Full Name"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">Title</Form.Label>
                    <Form.Control
                      onChange={(e) => setTitle(e.target.value)}
                      type="text"
                      required
                      placeholder="Enter Title"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Description
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setDiscription(e.target.value)}
                      type="text"
                      placeholder="Enter Description"
                      required
                    />
                  </Form.Group>
                </div>
              </ModalBody>
              <Modal.Footer>
                <div className="w-full flex justify-center">
                  <Button
                    className="bg-[#0C5C75] text-white font-medium px-[3.5rem] py-2 cursor-pointer"
                    type="submit"
                  >
                    ADD
                  </Button>
                </div>
              </Modal.Footer>
            </Form>
          </>
        ) : addContactBtn === "edit" ? (
          <>
            <Modal.Header closeButton>
              <p className="text-black font-semibold text-[1.2rem]">
                Update News
              </p>
            </Modal.Header>
            <Form onSubmit={addNewsHandler2}>
              <ModalBody>
                <div>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">Image</Form.Label>
                    <Form.Control
                      onChange={(e) => setImageFileData(e.target.files[0])}
                      type="file"
                      placeholder="Enter Full Name"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">Title</Form.Label>
                    <Form.Control
                      onChange={(e) => setTitle(e.target.value)}
                      type="text"
                      value={title}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Description
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setDiscription(e.target.value)}
                      type="text"
                      value={discription}
                    />
                  </Form.Group>
                </div>
              </ModalBody>
              <Modal.Footer>
                <div className="w-full flex justify-center">
                  <Button
                    className="bg-[#0C5C75] text-white font-medium py-2 px-[3.5rem] cursor-pointer"
                    type="submit"
                  >
                    EDIT
                  </Button>
                </div>
              </Modal.Footer>
            </Form>
          </>
        ) : null}
      </Modal>
    );
  }
  const [data, setData] = useState([]);
  const getAllNews = () => {
    adminPortalService.getNews({
      setResponse: (resData) => {
        setData(resData?.data || []);
      },
    });
  };
  useEffect(() => {
    getAllNews();
  }, []);
  const optionAdmin = [];
  const getAllAdmin = () => {
    adminPortalService.getSuperAdminList({
      setResponse: (resData) => {
        if (resData?.data) {
          resData.data.forEach((item) => {
            if (item.userType === ROLES.ADMIN) {
              optionAdmin.push({
                value: item._id,
                label: item.fullName,
              });
            }
          });
        }
      },
    });
  };
  useEffect(() => {
    if (modalShow) getAllAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalShow]);
  const [query] = useState("");
  const [currentPage2, setCurrentPage2] = useState(1);
  const [postPerPage2] = useState(5);
  const [dashboardInfo, setDashboardInfo] = useState();
  let pages2 = [];
  const TotolData = query
    ? data?.filter(
        (i) =>
          i?.title?.toLowerCase().includes(query?.toLowerCase()) ||
          i?.email?.toLowerCase().includes(query?.toLowerCase()) ||
          i?.role?.toLowerCase().includes(query?.toLowerCase()),
      )
    : data;
  useEffect(() => {
    if (query) {
      setCurrentPage2(1);
    }
  }, [query]);
  for (let i = 1; i <= Math.ceil(TotolData?.length / postPerPage2); i++) {
    pages2.push(i);
  }
  useEffect(() => {
    adminPortalService.getDashboardInfo({
      setResponse: (resData) => {
        if (resData) {
          setDashboardInfo(resData?.data?.data || resData?.data);
        }
      },
    });
  }, []);
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
              src={resolveAdminAssetPath("/public/Dashboard/user.png")}
              className="max-w-[125px] max-h-[125px] w-auto h-auto"
              alt="user"
            />

            <p>
              <p className="font-bold text-black">Jhon Smith</p>
              <p className="flex gap-[5px] items-center font-bold text-black">
                <img
                  className="max-w-[20px] max-h-[20px]"
                  src={resolveAdminAssetPath("/public/Dashboard/admin.png")}
                  alt=""
                />

                <span>ADMIN</span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-[20px] max-h-[20px]"
                  src={resolveAdminAssetPath("/public/Dashboard/message.png")}
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
                  src={resolveAdminAssetPath("/public/Dashboard/call.png")}
                  alt=""
                />

                <span>PHONE </span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-[20px] max-h-[20px]"
                  src={resolveAdminAssetPath("/public/Dashboard/call.png")}
                  alt=""
                />

                <span>ADDRESS -</span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-[20px] max-h-[20px]"
                  src={resolveAdminAssetPath("/public/Dashboard/user1.png")}
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
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                LAST ADMITTED AT -
                <span className="flex items-center gap-[15px]">
                  <img
                    className="max-w-[25px] max-h-[25px]"
                    src={resolveAdminAssetPath("/public/Dashboard/home.png")}
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
      <Container fluid className="dashboard-page">
        <Row>
          <Col xs={12} md={12} xl={12} className="mb-3 mb-lg-4">
            <Card
              no-body
              className="HomePageDashboard overflow-hidden border-0"
            >
              <Row className="align-items-center">
                <Col xs={12} md={12} lg={4} xl={4}>
                  <div className="position-relative z-1 card-body text-center text-lg-start">
                    <h4 className="text-white fw-semibold my-md-3 py-lg-7 mb-3 fs-4">
                      Welcome Back{" "}
                      <span className="fw-normal ">
                        {ProfileDetails && fetchPaitentName(ProfileDetails)}!
                      </span>
                    </h4>
                    <h6 className="opacity-75 fw-normal text-white mb-0 fs-6">
                      How can we help you today?
                    </h6>
                  </div>
                </Col>
                <Col xs={12} md={12} lg={4} xl={4}>
                  <div className="position-relative z-1 card-body">
                    <div className="my-md-3 py-lg-7 text-center">
                      <h4 className="text-white fw-normal mb-3 fs-4">
                        <span className="fw-semibold text-wrap-auto whitespace-break-spaces">
                          Welcome to the Oasis Notes!
                        </span>
                      </h4>
                      {mainNotifications && (
                        <span className="badge badge-custom-dark d-inline-flex gap-2 fs-6 text-wrap-auto whitespace-break-spaces">
                          <MdCircleNotifications className="shrink-0" />
                          <span className="fw-normal text-wrap-auto whitespace-break-spaces">
                            {mainNotifications}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </Col>
                <Col
                  xs={12}
                  md={12}
                  lg={4}
                  xl={4}
                  className="align-self-end text-center text-lg-right"
                >
                  <div className="position-relative z-1">
                    <img
                      src="/doctor-appoint.svg"
                      className="img-fluid d-none d-lg-inline-block float-lg-end max-h-[200px]"
                      alt="welcome-patient"
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <div className="dashboard-stats">
          <Row>
            <Col xs={12} md={12} xl={7}>
              <div className="header-card-title mb-3">
                <h5 className="mb-0 page-name fw-bold">
                  Manage your therapy note software efficiently with the
                  following tools and features
                </h5>
              </div>
              <Row>
                <Col xs={12} md={6} xl={6}>
                  <Card
                    body
                    className="mb-3 mb-lg-4 border-0 relative shadow-sm cursor-pointer"
                    onClick={() => {
                      navigate("/employee-list");
                    }}
                  >
                    <div className="stats-card d-flex align-items-center py-md-3 px-md-2">
                      <div className="stats-icon blue-soft me-3 flex-shirnk-0">
                        <MdGroup />
                      </div>
                      <div className="stats-info">
                        <p className="stats-counter mb-0">
                          {dashboardInfo?.employeeCount || 0}
                        </p>
                        <h3 className="stats-title mb-0">Total Employee</h3>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} md={6} xl={6}>
                  <Card
                    body
                    className="mb-3 mb-lg-4 border-0 relative shadow-sm cursor-pointer"
                    onClick={() => {
                      navigate("/patient-list");
                    }}
                  >
                    <div className="stats-card d-flex align-items-center py-md-3 px-md-2">
                      <div className="stats-icon purple-soft me-3 flex-shirnk-0">
                        <MdInsertChartOutlined />
                      </div>
                      <div className="stats-info">
                        <p className="stats-counter mb-0">
                          {dashboardInfo?.patientCount || 0}
                        </p>
                        <h3 className="stats-title mb-0">Total Residents</h3>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} md={6} xl={6}>
                  <Card
                    body
                    className="mb-3 mb-lg-4 border-0 relative shadow-sm cursor-pointer"
                    onClick={() => {
                      navigate("/get-time-of-request");
                    }}
                  >
                    <div className="stats-card d-flex align-items-center py-md-3 px-md-2">
                      <div className="stats-icon green-soft me-3 flex-shirnk-0">
                        <MdAccessTime />
                      </div>
                      <div className="stats-info">
                        <p className="stats-counter mb-0">
                          {dashboardInfo?.ptoRequest || 0}
                        </p>
                        <h3 className="stats-title mb-0">
                          Pending PTO Requests
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} md={6} xl={6}>
                  <Card
                    body
                    className="mb-3 mb-lg-4 border-0 relative shadow-sm cursor-pointer"
                    onClick={() => {
                      navigate("/get-time-of-request");
                    }}
                  >
                    <div className="stats-card d-flex align-items-center py-md-3 px-md-2">
                      <div className="stats-icon yellow-soft me-3 flex-shirnk-0">
                        <MdHistory />
                      </div>
                      <div className="stats-info">
                        <p className="stats-counter mb-0">
                          {dashboardInfo?.sickTineOffRequest || 0}
                        </p>
                        <h3 className="stats-title mb-0">
                          Sick Time Off Request
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={12} xl={5}>
              <div className="header-card-title mb-3">
                <h5 className="mb-0 page-name fw-bold">Quick Links</h5>
              </div>
              <Card body className="mb-3 border-0 relative shadow-sm">
                <div
                  className="ps-lg-2 pe-lg-3 force-overflow scrollbar"
                  id="scroll-vertically"
                >
                  <Link
                    className="quick-links-btn p-3 my-2"
                    to={"/dashboard/contacts"}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <h6 className="mb-0 quick-links-name">Add New User</h6>
                      <MdNorthEast className="arrow-icon" />
                    </div>
                  </Link>
                  <Link
                    className="quick-links-btn p-3 my-2"
                    to={"/dashboard/patient-vitals"}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <h6 className="mb-0 quick-links-name">Resident Vitals</h6>
                      <MdNorthEast className="arrow-icon" />
                    </div>
                  </Link>
                  <Link
                    className="quick-links-btn p-3 my-2"
                    to={"/dashboard/patient-tracking"}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <h6 className="mb-0 quick-links-name">
                        Resident Tracking
                      </h6>
                      <MdNorthEast className="arrow-icon" />
                    </div>
                  </Link>
                  <Link
                    className="quick-links-btn p-3 my-2"
                    to={"/dashboard/logs"}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <h6 className="mb-0 quick-links-name">View Logs</h6>
                      <MdNorthEast className="arrow-icon" />
                    </div>
                  </Link>
                  <Link
                    className="quick-links-btn p-3 my-2"
                    to={"/skills-knowledge-training"}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <h6 className="mb-0 quick-links-name">
                        Skills and Knowledge Training
                      </h6>
                      <MdNorthEast className="arrow-icon" />
                    </div>
                  </Link>
                  <Link className="quick-links-btn p-3 my-2" to={"/on-site"}>
                    <div className="d-flex align-items-center justify-content-between">
                      <h6 className="mb-0 quick-links-name">
                        On Site and Facility Orientation Verification
                      </h6>
                      <MdNorthEast className="arrow-icon" />
                    </div>
                  </Link>
                  <Link
                    className="quick-links-btn p-3 my-2"
                    to={"/list-clinical-oversight"}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <h6 className="mb-0 quick-links-name">
                        Clinical Oversight
                      </h6>
                      <MdNorthEast className="arrow-icon" />
                    </div>
                  </Link>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: HomePage1,
});
