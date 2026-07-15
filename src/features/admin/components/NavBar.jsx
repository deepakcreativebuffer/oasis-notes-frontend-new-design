/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { resolveAdminAssetPath } from "@/assets";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./NavBar.css";
import { IoIosNotifications } from "react-icons/io";
import { Button, Col, Form, Offcanvas, Row, Toast } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useHistory } from "react-router-use-history";
import {
  adminPortalService,
  getObjectUrlFromDownloadUrl,
  timesheetService,
} from "@/features/shared/services";
import { getAllNotifications } from "@/features/shared/services";
import Typewriter from "typewriter-effect";
import { ROUTES } from "@/features/shared/constants";
import { logger } from "@/utils";
const NavBar = () => {
  const [show, setShow] = useState(false);
  const [editProfile, setEditProfile] = useState("profile");
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showA, setShowA] = useState(false);
  const [showB, setShowB] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagefile, setImagefile] = useState("");
  const [logoImage, setLogoImage] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [site1, setSite1] = useState("");
  const [site2, setSite2] = useState("");
  const [mainNotiFications, setMainNotifications] = useState([]);
  const location = useLocation();
  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImagefile(selectedImage);
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };
  const [notifications, setNotifications] = useState([]);
  const getAllNotificationsHandler = () => {
    getAllNotifications()
      .then((res) => {
        const todayNotifications = res.data.data?.filter((i) => {
          return (
            new Date(`${i?.date} ${i?.time}`).toDateString() ===
            new Date().toDateString()
          );
        });
        setNotifications(todayNotifications?.slice(0, 2));
        const newData = todayNotifications?.filter(
          (i) => i?.title && i.title.trim() !== "",
        );
        const newDate2 = newData?.map((i) => i?.body);
        if (newDate2 && newDate2?.length > 0) {
          const lastData = newDate2[newDate2.length - 1];
          setMainNotifications(lastData);
        }
      })
      .catch((error) => {
        logger.error(error?.message);
      });
  };
  useEffect(() => {
    getAllNotificationsHandler();
  }, []);
  const toggleShowA = () => setShowA(!showA);
  const toggleShowB = () => setShowB(!showB);
  const params = useParams();
  const history = useHistory();
  const [selectedItem, setSelectedItem] = useState(params.page || "contacts");
  const handleItemClick = (itemName, link) => {
    setSelectedItem(itemName);
    history.push(`/dashboard/${link}`);
  };
  useEffect(() => {
    setSelectedItem(params.page || "contacts");
  }, [params.page]);
  const userData = () => {
    timesheetService.getProfile({
      isAdmin: true,
      setResponse: (resData) => {
        setData(resData?.data || {});
      },
    });
  };
  useEffect(() => {
    userData();
  }, []);
  const handleUpdate = () => {
    const formData = new FormData();
    if (imagefile) formData.append("image", imagefile);
    if (logoImage) formData.append("logo", logoImage);
    if (name) formData.append("fullName", name);
    if (number) formData.append("mobileNumber", number);
    if (address) formData.append("address", address);
    if (companyName) formData.append("companyName", companyName);
    if (site1) formData.append("site1", site1);
    if (site2) formData.append("site2", site2);
    adminPortalService.updateProfile(formData, {
      successMsg: "Profile updated successfully!",
      additionalFunctions: [
        userData,
        () => setEditProfile("profile"),
        () => navigate(0),
      ],
    });
  };
  return (
    <>
      <Offcanvas
        className="offcanvas-navbar h-screen"
        show={show}
        placement="end"
        onHide={handleClose}
      >
        <Offcanvas.Header>
          <Offcanvas.Title>
            <img
              onClick={() => {
                setEditProfile("profile");
                handleClose();
              }}
              src="/close.png"
              alt="closeBtn"
              className="max-w-[25px] max-h-[25px] w-auto h-auto cursor-pointer"
            />{" "}
            {editProfile === "edit" ? (
              <span className="ml-4 font-bold">Edit Profile</span>
            ) : editProfile === "preference" ? (
              <span className="ml-4 font-bold">Preferences</span>
            ) : null}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            {editProfile === "profile" ? (
              <div>
                {" "}
                <div className="flex flex-col justify-center items-center text-center leading-4">
                  <img
                    src={
                      data?.profilePic
                        ? getObjectUrlFromDownloadUrl(data?.profilePic)
                        : resolveAdminAssetPath("/Dashboard/contacts/user.png")
                    }
                    alt="user"
                    className="max-w-[100px] max-h-[100px] w-auto h-auto rounded-full"
                  />
                  <p className="font-bold mt-4">{data?.fullName}</p>

                  <p>
                    <span></span>
                    <span className="font-bold text-[#4D4D4D] ml-[5px]">
                      {data?.companyName}
                    </span>
                  </p>
                  <span>
                    <img
                      onClick={() => navigate(ROUTES.HOME)}
                      className="max-w-[130px] max-h-[25px] w-auto h-auto mt-2 cursor-pointer"
                      src="/signout.png"
                      alt="Signout"
                    />
                  </span>
                </div>
                <div className="flex flex-col text-left px-[20%] text-[1.2rem] mt-6">
                  <p className="flex flex-row items-center gap-[10px]">
                    <span>
                      <img
                        className="max-w-[30px] max-h-[30px]"
                        src={resolveAdminAssetPath("/NavBar/editProfile.png")}
                        alt="edit1"
                      />
                    </span>
                    <span
                      onClick={() => setEditProfile("edit")}
                      className="font-bold opacity-70 cursor-pointer"
                    >
                      Edit Profile Details
                    </span>
                  </p>
                  <p className="flex flex-row items-center gap-[10px]">
                    <span>
                      <img
                        className="max-w-[30px] max-h-[30px]"
                        src={resolveAdminAssetPath("/NavBar/terms.png")}
                        alt="edit1"
                      />
                    </span>

                    <span className="font-bold opacity-70 cursor-pointer">
                      <a href="https://issa-website-website.vercel.app/Privacy-policy">
                        Terms & Conditions
                      </a>
                    </span>
                  </p>
                </div>
              </div>
            ) : editProfile === "edit" ? (
              <div>
                <div className="flex flex-col justify-center items-center text-center leading-4">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="imageInput"
                    />

                    <label htmlFor="imageInput">
                      <img
                        src={
                          imagePreview ||
                          (data?.profilePic
                            ? getObjectUrlFromDownloadUrl(data?.profilePic)
                            : "/user.png")
                        }
                        alt="user"
                        className="max-w-[100px] max-h-[100px] w-auto h-auto rounded-full cursor-pointer"
                      />
                    </label>
                  </div>

                  <p className="font-bold mt-4 text-[#0C5C75]">
                    CHANGE PROFILE IMAGE
                  </p>
                </div>

                <div className="text-center mt-8">
                  {data?.logo && (
                    <img
                      src={getObjectUrlFromDownloadUrl(data?.logo)}
                      alt="logo"
                      className="max-w-[200px] max-h-[100px] w-auto h-auto cursor-pointer"
                    />
                  )}
                  <p className="font-bold mt-4">Company Logo</p>
                </div>
                <div>
                  <Form
                    controlId="formFile"
                    className="mb-3 text-left w-[80%] px-[2%] mx-auto mt-8"
                  >
                    <Form.Group className="mb-3" controlId="formFile">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        onChange={(e) => setName(e.target.value)}
                        className="bg-[#EEEEEE]"
                        type="text"
                        placeholder={data?.fullName ? data.fullName : ""}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formFile">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        className="bg-[#EEEEEE]"
                        type="text"
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder={
                          data?.mobileNumber ? data.mobileNumber : ""
                        }
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formFile">
                      <Form.Label>Site 1</Form.Label>
                      <Form.Control
                        className="bg-[#EEEEEE]"
                        type="text"
                        onChange={(e) => setSite1(e.target.value)}
                        placeholder={data?.site1 ? data.site1 : ""}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formFile">
                      <Form.Label>Site 2</Form.Label>
                      <Form.Control
                        className="bg-[#EEEEEE]"
                        type="text"
                        onChange={(e) => setSite2(e.target.value)}
                        placeholder={data?.site2 ? data.site2 : ""}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formFile">
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control
                        className="bg-[#EEEEEE]"
                        type="text"
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={data?.companyName ? data.companyName : ""}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formFile">
                      <Form.Label> Logo</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={(e) => setLogoImage(e.target.files[0])}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formFile">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        className="bg-[#EEEEEE]"
                        as={"textarea"}
                        rows={3}
                        placeholder={
                          data?.address ? data.address : "Enter Address"
                        }
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </Form.Group>
                    <span className="flex justify-center">
                      <Button
                        onClick={() => handleUpdate()}
                        className="px-[5.5rem] py-2 bg-[#0C5C75] border-none mt-8"
                      >
                        SAVE CHANGES
                      </Button>
                    </span>
                  </Form>
                </div>
              </div>
            ) : editProfile === "preference" ? (
              <div>
                <div>
                  <Form className="mb-3">
                    <Form.Check
                      type="checkbox"
                      className="mb-3"
                      label="lorem ipsum"
                    />
                    <Form.Check
                      type="checkbox"
                      className="mb-3"
                      label="lorem ipsum"
                    />
                    <Form.Check
                      type="checkbox"
                      className="mb-3"
                      label="lorem ipsum"
                    />
                    <Form.Check
                      type="checkbox"
                      className="mb-3"
                      label="lorem ipsum"
                    />
                    <Form.Check
                      type="checkbox"
                      className="mb-3"
                      label="lorem ipsum"
                    />

                    <span className="flex justify-center">
                      <Button
                        onClick={() => setEditProfile("profile")}
                        className="py-2 px-[5.5rem] bg-[#0C5C75] border-none mt-8"
                      >
                        SAVE CHANGES
                      </Button>
                    </span>
                  </Form>
                </div>
              </div>
            ) : null}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      <div>
        <Navbar
          className="bg-[#D9D9D9] text-[1.3rem]"
          collapseOnSelect
          variant="light"
          expand="lg"
        >
          <Container className="navbar-container" expand="lg">
            <Navbar.Brand href="/dashboard/contacts">
              <img
                src={getObjectUrlFromDownloadUrl(data?.logo) || "/logo.png"}
                alt="logo"
                className="max-w-[175px] max-h-[65px] w-auto h-auto"
              />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse>
              <Nav className="me-auto w-[70%] m-auto">
                <p className="text-[18px] font-bold mt-6 text-[rgb(26,159,178)] break-words">
                  {mainNotiFications?.length > 0 && (
                    <Typewriter
                      options={{
                        strings: `${mainNotiFications}`,
                        autoStart: true,
                        loop: true,
                      }}
                    />
                  )}
                </p>
              </Nav>
              <Nav className="w-[25%] mx-auto text-[0.8rem] flex items-center">
                <Row>
                  <Col md={6} className="mb-2">
                    <IoIosNotifications
                      onClick={() => {
                        toggleShowA();
                      }}
                      className="text-yellow-400 max-w-[55px] max-h-[55px] w-auto h-auto text-[3rem] cursor-pointer"
                    />
                    <Toast
                      className="notification-toast-navbar bg-white"
                      show={showA}
                      onClose={toggleShowA}
                    >
                      <Toast.Header>
                        <img
                          src="holder.js/20x20?text=%20"
                          className="rounded me-2"
                          alt=""
                        />
                        <strong className="me-auto font-bold text-black">
                          Notifications
                        </strong>
                      </Toast.Header>
                      <Toast.Body>
                        <div>
                          {notifications?.map((data, index) => (
                            <div key={index}>
                              <div className="flex gap-[15px] content-center mb-4">
                                <p>
                                  <img
                                    className="max-w-[25px] max-h-[25px] w-auto h-auto"
                                    src={resolveAdminAssetPath(
                                      "/notifiation.png",
                                    )}
                                    alt="notification"
                                  />
                                </p>
                                <p className="flex flex-row flex-nowrap gap-[15px]">
                                  <span>
                                    <img
                                      src={
                                        getObjectUrlFromDownloadUrl(
                                          data?.adminId?.profilePic,
                                        ) || "/user.png"
                                      }
                                      alt="user"
                                      className="w-[35px] h-[35px] rounded-full"
                                    />
                                  </span>
                                  <span className="flex flex-col">
                                    <span>
                                      <span className="font-bold">
                                        {data?.adminId?.fullName ||
                                          data?.patientId?.fullName}
                                      </span>{" "}
                                      has added a new Note
                                      <span className="font-bold text-[#0C5C75]">
                                        ‘{data?.groupName}’
                                      </span>
                                    </span>
                                  </span>
                                </p>
                              </div>
                            </div>
                          ))}

                          <div className="flex justify-center mb-4">
                            <Button
                              onClick={() => {
                                handleItemClick(
                                  "notifications",
                                  "notifications",
                                );
                                toggleShowA();
                              }}
                              className="bg-white text-[#0C5C75] font-bold border border-[#0C5C75] rounded-[5px] py-2 px-[1.1rem]"
                            >
                              VIEW ALL
                            </Button>
                          </div>
                        </div>{" "}
                      </Toast.Body>
                    </Toast>
                  </Col>
                </Row>
                <Nav.Link eventKey={2} href="#memes">
                  <div className="flex items-center gap-4">
                    <img
                      onClick={handleShow}
                      className="max-w-[45px] max-h-[45px] rounded-full"
                      src={
                        data?.profilePic
                          ? getObjectUrlFromDownloadUrl(data?.profilePic)
                          : resolveAdminAssetPath(
                              "/Dashboard/contacts/user.png",
                            )
                      }
                      alt="user"
                    />
                    <div className="flex flex-col justify-center pt-[0.1rem] leading-[0.8rem] font-bold">
                      <p className="pt-3 text-[#0C5C75]">{data?.fullName}</p>
                      <p className="text-black opacity-70">
                        {data?.companyName}
                      </p>
                    </div>
                  </div>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </>
  );
};
export default NavBar;
