/* eslint-disable no-unused-vars, eqeqeq */
import { useEffect, useState } from "react";
import { resolveAdminAssetPath } from "@/assets";
import { Button, Container, Form, ModalBody, Table } from "react-bootstrap";
import "@/assets/styles/admin/Contacts.css";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Select from "react-select";
import Offcanvas from "react-bootstrap/Offcanvas";
import Modal from "react-bootstrap/Modal";
import {
  deleteTask,
  getTasks,
  addTask,
  markAsDoneTask,
} from "@/features/shared/services";
import { FaEye } from "react-icons/fa";
import HOC from "@/features/shared/layout/Outer/HOC";
import { formatDateWithoutUTCHandleToMMDDYYYY } from "@/utils/utils";
import { logger, showNotification } from "@/utils";
const CalenderSchedule = (value) => {
  const [show, setShow] = useState(false);
  const [addContactBtn, setAddContactBtn] = useState("");
  const [todaysTask, setTodaysTask] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tomorrowTasks, setTomorrowTask] = useState([]);
  const [isToday, setIsToday] = useState(false);
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
  const [newValue, setNewValue] = useState({});
  const [taskItem, setTaskItem] = useState({});
  function MyVerticallyCenteredModal(props) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(
      resolveAdminAssetPath("/Dashboard/contacts/user.png"),
    );
    const [range, setRange] = useState([2, 6]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [time1, setTime1] = useState("");
    const [date1, setDate1] = useState("");
    useEffect(() => {
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }
    }, [selectedFile]);
    const submitHandler = async (e) => {
      e.preventDefault();
      const payload = {};
      if (title) payload.title = title;
      if (description) payload.description = description;
      if (time1) payload.time = time1;
      if (date1) payload.date = date1;
      try {
        const res = await addTask(payload);
        props.onHide();
        showNotification({ message: res.data.message, type: "success" });
      } catch (error) {
        showNotification({
          message: error.response?.data?.message || error.message,
          type: "danger",
        });
      }
    };
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {addContactBtn === "add" ? (
          <>
            <Modal.Header closeButton>
              <p className="text-black font-semibold text-2xl">Add Task</p>
            </Modal.Header>
            <Form onSubmit={submitHandler}>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label className="font-semibold">Title</Form.Label>
                  <Form.Control
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="font-semibold">Description</Form.Label>
                  <Form.Control
                    required
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="font-semibold">Date</Form.Label>
                  <Form.Control
                    required
                    onChange={(e) => setDate1(e.target.value)}
                    type="date"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="font-semibold">Time</Form.Label>
                  <Form.Control
                    required
                    onChange={(e) => setTime1(e.target.value)}
                    type="time"
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <div className="w-[90%] flex justify-around">
                  <Button
                    className="bg-[#0C5C75] text-white font-medium py-2 px-[3.5rem]"
                    type="submit"
                  >
                    APPLY
                  </Button>
                  <Button
                    className="py-2 px-[3.5rem] ml-4 text-[#0C5C75] bg-transparent"
                    onClick={props.onHide}
                  >
                    CANCEL
                  </Button>
                </div>
              </Modal.Footer>
            </Form>
          </>
        ) : addContactBtn === "view" ? (
          <>
            <Modal.Header closeButton>
              <p className="text-black font-semibold text-[1.2rem]">
                View Task
              </p>
            </Modal.Header>
            <ModalBody>
              <div>
                <Form className="grid gap-4">
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">Title</Form.Label>
                    <Form.Control disabled value={taskItem?.title} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">Date</Form.Label>
                    <Form.Control
                      disabled
                      value={taskItem?.date
                        ?.split("T")[0]
                        ?.split("-")
                        ?.reverse()
                        ?.join("-")}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">Time</Form.Label>
                    <Form.Control disabled value={taskItem?.time} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Description
                    </Form.Label>
                    <Form.Control
                      as={"textarea"}
                      disabled
                      value={taskItem?.description}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Completed
                    </Form.Label>
                    <Form.Control
                      disabled
                      value={taskItem?.complete ? "Yes" : "No"}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Created At
                    </Form.Label>
                    <Form.Control
                      disabled
                      value={formatDateWithoutUTCHandleToMMDDYYYY(
                        taskItem?.createdAt,
                      )}
                    />
                  </Form.Group>
                </Form>
              </div>
            </ModalBody>
            <Modal.Footer>
              <div className="w-full flex justify-around">
                <Button
                  className="bg-white text-[#0C5C75] font-semibold py-2 px-[3.5rem] cursor-pointer"
                  onClick={props.onHide}
                >
                  CANCEL
                </Button>
              </div>
            </Modal.Footer>
          </>
        ) : null}
      </Modal>
    );
  }
  const getValue = () => {
    const dateObj = value;
    const formattedDate1 = {
      value: dateObj.value.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      }),
    };
    const day = formattedDate1.value.slice(0, 3).split("-").reverse().join("-");
    const date = formattedDate1.value
      .slice(9, 11)
      .split("-")
      .reverse()
      .join("-");
    const year = formattedDate1.value
      .slice(13, 17)
      .split("-")
      .reverse()
      .join("-");
    const month = formattedDate1.value
      .slice(5, 8)
      .split("-")
      .reverse()
      .join("-");
    const time = formattedDate1.value.slice(19, 27).split(":").join(":");
    setNewValue({
      day: day,
      date: date,
      month: month,
      time: time,
      year: year,
    });
    if (newValue.date && newValue.month && newValue.day) {
      getAlltasks();
    }
  };
  useEffect(() => {
    getValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isToday]);
  const deleteHandler = (id) => {
    deleteTask(id, getAlltasks);
  };
  const getAlltasks = () => {
    const formattedDate = `${newValue.date} ${newValue.month}, ${newValue.day}`;
    getTasks()
      .then((res) => {
        const currentDate = new Date();
        if (res.data?.data?.today[formattedDate]) {
          setIsToday(true);
          setTodaysTask(res.data?.data?.today[formattedDate] || []);
          setTomorrowTask(res.data?.data?.tomorrow || []);
        } else {
          setIsToday(false);
          setTasks(res.data?.data?.yesterday[formattedDate] || []);
        }
        if (res.data?.data?.today[formattedDate]?.length == 0) {
          setIsToday(false);
          setTasks(res.data?.data?.yesterday[formattedDate] || []);
        }
        if (res.data?.data?.yesterday[formattedDate]?.length == 0) {
          setIsToday(false);
          setTasks(res.data?.data?.today[formattedDate] || []);
        }
      })
      .catch((err) => {
        logger.error("Error fetching tasks:", err.res.data);
      });
  };
  const markDone = async (id) => {
    try {
      const res = await markAsDoneTask(id);
      showNotification({ message: res.data.message, type: "success" });
      getAlltasks();
    } catch (error) {
      showNotification({
        message: error.response?.data?.message || error.message,
        type: "danger",
      });
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
      <Container className="full-width-container dashboard-page">
        <div>
          <p className="text-[1.3rem] font-semibold mt-6">
            Calender <span className="opacity-70 text-base"></span>
          </p>

          <div className="contacts-page-container1 border-b border-b-[#0C5C75] pb-[5px]">
            <div className="font-bold text-[#0C5C75] text-[1.1rem]">
              {newValue?.data?.date}
              {isToday &&
                `Today ${newValue?.date} ${newValue?.month}, ${newValue?.year} `}
              {!isToday &&
                ` ${newValue?.date} ${newValue?.month}, ${newValue?.year} `}
            </div>
            <div></div>

            <div>
              <Button
                onClick={() => {
                  setAddContactBtn("add");
                  setModalShow(true);
                }}
                variant="primary"
                className="py-2 px-[3.5rem] bg-[#0C5C75]"
              >
                + NEW TASK
              </Button>
            </div>
          </div>

          <div>
            <div className="mb-[5rem]">
              <Table className="text-left" responsive>
                <thead></thead>
                <tbody>
                  {todaysTask?.length > 0
                    ? todaysTask.map((data) => {
                        return (
                          <tr key={data.id}>
                            <td>
                              <div className="flex gap-2">
                                <img
                                  className="max-w-[20px] max-h-[20px] w-auto h-auto"
                                  src={resolveAdminAssetPath(
                                    "/Dashboard/clock.png",
                                  )}
                                  alt="pdf_image"
                                />
                                <p className="text-black font-bold">
                                  {data?.time.toUpperCase()}
                                </p>
                              </div>
                            </td>
                            <td className="text-base font-medium">
                              <p>{data?.title}</p>
                            </td>
                            <td className="text-base font-medium">
                              <span className="flex gap-2 items-center text-[#0C5C75] cursor-pointer">
                                <span
                                  onClick={() => markDone(data?._id)}
                                  className="text-[#0C5C75] text-base font-semibold cursor-pointer"
                                >
                                  {data?.complete
                                    ? "COMPLETED"
                                    : "MARK AS DONE"}
                                </span>
                              </span>
                            </td>

                            <td className="text-[0.8rem] font-medium">
                              <p className="flex gap-8 cursor-pointer text-2xl">
                                {" "}
                                <span
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setTaskItem(data);
                                    setAddContactBtn("view");
                                    setModalShow(true);
                                  }}
                                >
                                  <FaEye />
                                </span>
                                <span
                                  className="flex gap-2 items-center text-[#0C5C75]"
                                  onClick={() => {
                                    deleteHandler(data?._id);
                                  }}
                                >
                                  <RiDeleteBin5Fill className="text-[#FC0005]" />{" "}
                                  <span className="text-[#FC0005] text-[0.9rem] font-bold">
                                    DELETE
                                  </span>
                                </span>
                              </p>
                            </td>
                          </tr>
                        );
                      })
                    : tasks?.length > 0
                      ? tasks.map((data) => {
                          return (
                            <tr key={data.id}>
                              <td>
                                <div className="flex gap-2">
                                  <img
                                    className="max-w-[20px] max-h-[20px] w-auto h-auto"
                                    src={resolveAdminAssetPath(
                                      "/Dashboard/clock.png",
                                    )}
                                    alt="pdf_image"
                                  />
                                  <p className="text-black font-bold">
                                    {data?.time.toUpperCase()}
                                  </p>
                                </div>
                              </td>
                              <td className="text-base font-medium">
                                <p>{data?.title}</p>
                              </td>
                              <td className="text-base font-medium">
                                <span
                                  onClick={() => {
                                    setAddContactBtn("v");
                                    setModalShow(true);
                                  }}
                                  className="flex gap-2 items-center text-[#0C5C75]"
                                >
                                  <span className="text-[#0C5C75] text-base font-semibold">
                                    MARK AS DONE
                                  </span>
                                </span>
                              </td>

                              <td className="text-[0.8rem] font-medium">
                                <p className="flex gap-8 cursor-pointer text-2xl">
                                  <span className="flex gap-2 items-center text-[#0C5C75]">
                                    <RiDeleteBin5Fill className="text-[#FC0005]" />{" "}
                                    <span className="text-[#FC0005] text-[0.9rem] font-bold">
                                      DELETE
                                    </span>
                                  </span>
                                </p>
                              </td>
                            </tr>
                          );
                        })
                      : null}
                </tbody>
              </Table>
            </div>
          </div>
          {isToday && (
            <div className="contacts-page-container1 border-b border-b-[#0C5C75] pb-[5px]">
              <div className="font-bold text-[#0C5C75] text-[1.1rem]">
                Tomorrow ( 21 Oct, Fri )
              </div>
              <div></div>

              <div></div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: CalenderSchedule,
});
