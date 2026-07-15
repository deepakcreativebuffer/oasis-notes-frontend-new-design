/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { resolveAdminAssetPath } from "@/assets";
import { Button, Container, Form, ModalBody } from "react-bootstrap";
import "@/assets/styles/admin/Contacts.css";
import Select from "react-select";
import Offcanvas from "react-bootstrap/Offcanvas";
import Modal from "react-bootstrap/Modal";
import { getObjectUrlFromDownloadUrl } from "@/features/shared/services";
import { showNotification } from "@/utils";
import HOC from "@/features/shared/layout/Outer/HOC";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import { ROLES } from "@/features/shared/constants";
import {
  getAdminUser,
  sendNotification,
  getAllNotifications as getAllNotificationsApi,
} from "@/features/shared/services";
import { logger } from "@/utils";
const Notifications = () => {
  const [show, setShow] = useState(false);
  const [addContactBtn, setAddContactBtn] = useState(false);
  const handleClose = () => setShow(false);
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
    const fileUploadRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(
      resolveAdminAssetPath("/Dashboard/contacts/user.png"),
    );
    const [range, setRange] = useState([2, 6]);
    const [selected, setSelected] = useState([]);
    useEffect(() => {
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }
    }, [selectedFile]);
    const [employeesList, setEmployeesList] = useState([]);
    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
      if (props.onHide) {
        props.onHide();
      }
    };
    const handleButtonClick = () => {
      fileUploadRef.current?.click();
    };
    const [postData, setPostData] = useState({
      _id: "",
      title: "",
      body: "",
      date: "",
      image: "",
      time: "",
    });
    const handleFieldChange = (fieldName, newValue) => {
      setPostData({
        ...postData,
        [fieldName]: newValue,
      });
    };
    const getAllEmployees = async () => {
      try {
        const res = await getAdminUser();
        const filteredData = res?.data?.data?.filter(
          (item) => item.userType === ROLES.EMPLOYEE,
        );
        setEmployeesList(filteredData);
      } catch (error) {
        showNotification({ message: error?.response?.message, type: "danger" });
      }
    };
    useEffect(() => {
      if (modalShow) {
        getAllEmployees();
      }
    }, []);
    const handleSendNotification = async (e) => {
      e.preventDefault();
      try {
        const res = await sendNotification(postData);
        getAllNotifications();
        showNotification({ message: res.data.message, type: "success" });
        props.onHide();
      } catch (error) {
        showNotification({ message: error?.response?.message, type: "danger" });
      }
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
              <p className="text-black font-semibold text-2xl">
                Send Notification
              </p>
            </Modal.Header>
            <Form onSubmit={handleSendNotification}>
              <Modal.Body>
                <div>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Employee List
                    </Form.Label>
                    <Form.Select
                      onChange={(e) => handleFieldChange("_id", e.target.value)}
                      required
                      aria-label="Default select example"
                    >
                      <option value="">Select Employee</option>
                      {employeesList?.map((item) => {
                        return (
                          <option value={item?._id} key={item?._id}>
                            {item?.fullName}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">Title</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="Enter Title"
                      onChange={(e) =>
                        handleFieldChange("title", e.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">Body</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="Enter Body"
                      onChange={(e) =>
                        handleFieldChange("body", e.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">Date</Form.Label>
                    <Form.Control
                      type="date"
                      required
                      onChange={(e) =>
                        handleFieldChange("date", e.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">Time</Form.Label>
                    <Form.Control
                      type="time"
                      required
                      onChange={(e) =>
                        handleFieldChange("time", e.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">Image</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      onChange={(e) =>
                        handleFieldChange("image", e.target.value)
                      }
                    />
                  </Form.Group>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="w-[90%] flex justify-around">
                  <Button
                    className="bg-[#0C5C75] text-white font-medium py-2 px-14"
                    type="submit"
                  >
                    SEND
                  </Button>
                  <Button
                    className="py-2 px-14 ml-4 text-[#0C5C75] bg-transparent"
                    onClick={props.onHide}
                  >
                    CANCEL
                  </Button>
                </div>
              </Modal.Footer>
            </Form>
          </>
        ) : (
          <>
            <ModalBody>
              <div>
                <Form className="grid gap-4">
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Resident Full Name
                    </Form.Label>
                    <Form.Control type="text" placeholder="Enter Full Name" />
                  </Form.Group>
                </Form>
              </div>
            </ModalBody>
            <Modal.Footer>
              <div className="w-full flex justify-center">
                <Button
                  variant="primary"
                  className="py-2 px-22 bg-[#0C5C75] border-none cursor-pointer"
                  onClick={handleButtonClick}
                >
                  UPLOAD RECEIPT
                </Button>
                <input
                  ref={fileUploadRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>
    );
  }
  const [notifications, setNotifications] = useState([]);
  const getAllNotifications = () => {
    getAllNotificationsApi()
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => logger.debug(err));
  };
  const currentDate = formatDateToMMDDYYYY(new Date());
  useEffect(() => {
    getAllNotifications();
  }, []);
  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />{" "}
      <Offcanvas
        show={show}
        className="h-[80vh] rounded-t-lg p-6"
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
                  className="py-2 px-22 bg-[#1A9FB2] border-none"
                >
                  ASSIGN PATIENT
                </Button>
              </p>
            </p>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      <Container className="full-width-container dashboard-page">
        <div>
          <p className="text-lg font-semibold mt-6">Notifications </p>

          <div>
            <div>
              <Button variant="primary" onClick={() => setModalShow(true)}>
                Send Notification
              </Button>
            </div>
            <div>
              <p className="text-base font-semibold mt-10 text-[#1A9FB2] mb-4">
                TODAY
              </p>

              {notifications &&
                notifications.data &&
                notifications.data
                  .filter((item) => item.date === currentDate)
                  .map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-[35px] flex-wrap content-center"
                    >
                      <p>
                        <img
                          className="max-w-[50px] max-h-[50px] w-auto h-auto"
                          src={resolveAdminAssetPath("/notifiation.png")}
                          alt="notification"
                        />
                      </p>
                      <p className="flex flex-row flex-wrap gap-[15px]">
                        <span>
                          <img
                            src={item?.adminId?.profilePic || "/user.png"}
                            alt="user"
                            className="max-w-[45px] max-h-[35px] w-auto h-auto rounded-full"
                          />
                        </span>
                        <span className="flex flex-col">
                          <span>
                            <span className="font-bold">
                              {item.adminId?.firstName ||
                                item?.adminId?.fullName}
                            </span>{" "}
                            has assigned a new note to{" "}
                            {item?.employeeId?.firstName ||
                              item?.employeeId?.fullName}
                            <span className="font-bold text-[#0C5C75]">
                              ‘{item.groupName}’
                            </span>
                          </span>
                          <span className="text-[#0C5C75] font-bold">
                            {item?.title} {item.body}
                          </span>
                        </span>
                      </p>
                    </div>
                  ))}
            </div>{" "}
            <div>
              <p className="text-base font-semibold mt-10 text-[#1A9FB2] mb-4">
                PREVIOUS
              </p>

              {notifications &&
                notifications.data &&
                notifications.data
                  .filter((item) => item.date !== !currentDate)
                  .map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-[35px] flex-wrap content-center"
                    >
                      <p>
                        <img
                          className="max-w-[50px] max-h-[50px] w-auto h-auto"
                          src={resolveAdminAssetPath("/notifiation.png")}
                          alt="notification"
                        />
                      </p>
                      <p className="flex flex-row flex-wrap gap-[15px]">
                        <span>
                          <img
                            src={
                              item?.image
                                ? getObjectUrlFromDownloadUrl(
                                    item?.employeeId?.profilePic,
                                  ) ||
                                  getObjectUrlFromDownloadUrl(
                                    item?.patientId?.profilePic,
                                  )
                                : "/user.png"
                            }
                            alt="user"
                            className="w-[45px] h-[45px] rounded-full"
                          />
                        </span>
                        <span className="flex flex-col">
                          <span>
                            <span className="font-bold">
                              {" "}
                              {item?.employeeId?.fullName ||
                                item?.patientId?.fullName}
                            </span>{" "}
                            has assigned a new note{" "}
                            <span className="font-bold text-[#0C5C75]">
                              ‘{item.groupName}’
                            </span>
                          </span>
                          <span className="text-[#0C5C75] font-bold">
                            VIEW MORE {">"}
                          </span>
                        </span>
                      </p>
                    </div>
                  ))}
            </div>{" "}
          </div>
        </div>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: Notifications,
});
