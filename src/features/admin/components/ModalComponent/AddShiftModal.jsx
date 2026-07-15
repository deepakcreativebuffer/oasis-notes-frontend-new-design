import { useEffect, useState } from "react";
import { showNotification } from "@/utils";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import ListGroup from "react-bootstrap/ListGroup";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { convertTimeFormat, parseTimeStringToDate } from "@/utils/utils";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import { adminPortalService } from "@/features/shared/services";
const AddShiftModal = (props) => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [schedule, setSchedule] = useState([
    {
      start: "",
      end: "",
    },
  ]);
  const [editIndex, setEditIndex] = useState(null);
  const [editSchedule, setEditSchedule] = useState([
    {
      start: "",
      end: "",
    },
  ]);
  const handleStartTimeChange = (index, value) => {
    const updatedSchedule =
      editIndex !== null ? [...editSchedule] : [...schedule];
    updatedSchedule[index].start = value;
    if (editIndex !== null) {
      setEditSchedule(updatedSchedule);
    } else {
      setSchedule(updatedSchedule);
    }
  };
  const handleEndTimeChange = (index, value) => {
    const updatedSchedule =
      editIndex !== null ? [...editSchedule] : [...schedule];
    updatedSchedule[index].end = value;
    if (editIndex !== null) {
      setEditSchedule(updatedSchedule);
    } else {
      setSchedule(updatedSchedule);
    }
  };
  const addShiftRow = () => {
    const totalSlots = (props?.allShifts?.length || 0) + schedule.length;
    if (totalSlots < 3) {
      setSchedule([
        ...schedule,
        {
          start: "",
          end: "",
        },
      ]);
    } else {
      showNotification({
        message: "You can only select up to 3 shifts.",
        type: "info",
      });
    }
  };
  const removeShiftRow = (index) => {
    const updatedSchedule = [...schedule];
    updatedSchedule.splice(index, 1);
    setSchedule(updatedSchedule);
  };
  const handleEditShift = (index) => {
    setEditIndex(index);
    const shiftToEdit = props.allShifts[index];
    setEditSchedule((prevSchedule) => {
      const updatedSchedule = [...prevSchedule];
      updatedSchedule[index] = {
        start: shiftToEdit.start,
        end: shiftToEdit.end,
      };
      return updatedSchedule;
    });
  };
  const handleSaveEdit = (index, item) => {
    const updatedShift = editSchedule[index];

    if (!updatedShift.start || !updatedShift.end) {
      showNotification({
        message: "Start and end times are required.",
        type: "error",
      });
      return;
    }

    const isDup = props?.allShifts?.some(
      (shift, i) =>
        i !== index &&
        convertTimeFormat(shift.start, "HH:mm") ===
          convertTimeFormat(updatedShift.start, "HH:mm") &&
        convertTimeFormat(shift.end, "HH:mm") ===
          convertTimeFormat(updatedShift.end, "HH:mm"),
    );

    if (isDup) {
      showNotification({
        message: "This shift already exists.",
        type: "error",
      });
      return;
    }

    adminPortalService.updateShift(item?._id, updatedShift, {
      additionalFunctions: [
        () => setEditIndex(null),
        () =>
          setEditSchedule([
            {
              start: "",
              end: "",
            },
          ]),
        () => props.getAllShifts(),
      ],
    });
  };
  const submitDetails11 = (e) => {
    e.preventDefault();

    const validSchedule = schedule.filter(
      ({ start, end }) => start && end && start.length && end.length,
    );

    for (let i = 0; i < validSchedule.length; i++) {
      for (let j = i + 1; j < validSchedule.length; j++) {
        if (
          convertTimeFormat(validSchedule[i].start, "HH:mm") ===
            convertTimeFormat(validSchedule[j].start, "HH:mm") &&
          convertTimeFormat(validSchedule[i].end, "HH:mm") ===
            convertTimeFormat(validSchedule[j].end, "HH:mm")
        ) {
          showNotification({
            message: "Duplicate shifts are not allowed.",
            type: "error",
          });
          return;
        }
      }

      const isDup = props?.allShifts?.some(
        (shift) =>
          convertTimeFormat(shift.start, "HH:mm") ===
            convertTimeFormat(validSchedule[i].start, "HH:mm") &&
          convertTimeFormat(shift.end, "HH:mm") ===
            convertTimeFormat(validSchedule[i].end, "HH:mm"),
      );
      if (isDup) {
        showNotification({
          message: "This shift already exists.",
          type: "error",
        });
        return;
      }
    }

    const payload = {
      schedule: validSchedule.map(({ start, end }) => ({
        start,
        end,
      })),
      facilityId: props.facilityId,
    };
    adminPortalService.createShift(payload, {
      additionalFunctions: [props.onHide, () => props.getAllShifts()],
    });
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold" id="contained-modal-title-vcenter">
            Add Shift
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitDetails11}>
          <Modal.Body>
            <Form.Group>
              <Form.Label className="fw-bold w-100">All Shifts</Form.Label>
            </Form.Group>

            {props?.allShifts?.map((item, index) => (
              <ListGroup key={index}>
                <ListGroup.Item className="mb-2">
                  <Row>
                    <Col xs={8}>
                      <Row>
                        {editIndex === index ? (
                          <>
                            <Col md={6} className="d-flex flex-column">
                              <Form.Label className="fw-bold ">
                                Start Time:
                              </Form.Label>

                              <CustomTimePicker
                                value={
                                  editSchedule[index].start
                                    ? parseTimeStringToDate(
                                        editSchedule[index].start,
                                      )
                                    : null
                                }
                                onChange={(e, timeString) => {
                                  handleStartTimeChange(index, timeString);
                                }}
                                use24Hours={hoursFormat === "HH:mm"}
                              />
                            </Col>
                            <Col md={6} className="d-flex flex-column">
                              <Form.Label className="fw-bold">
                                End Time:
                              </Form.Label>

                              <CustomTimePicker
                                value={
                                  editSchedule[index].end
                                    ? parseTimeStringToDate(
                                        editSchedule[index].end,
                                      )
                                    : null
                                }
                                onChange={(e, timeString) => {
                                  handleEndTimeChange(index, timeString);
                                }}
                                use24Hours={hoursFormat === "HH:mm"}
                              />
                            </Col>
                          </>
                        ) : (
                          <Form.Label className="fw-bold">
                            {convertTimeFormat(item.start, hoursFormat)} -{" "}
                            {convertTimeFormat(item.end, hoursFormat)}
                          </Form.Label>
                        )}
                      </Row>
                    </Col>
                    <Col xs={4}>
                      <div className="icon-joiner justify-content-end">
                        {editIndex === index ? (
                          <div className="d-flex flex-column justify-content-evenly">
                            <Button
                              className="btn-sm"
                              onClick={() => handleSaveEdit(index, item)}
                            >
                              Save
                            </Button>
                            <Button
                              variant="danger"
                              className="btn-sm mt-2"
                              onClick={() => setEditIndex(null)}
                            >
                              Cancle
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Link
                              className="edit-btn"
                              onClick={() => handleEditShift(index, item)}
                            >
                              <MdEdit />
                            </Link>
                            <Link
                              className="del-btn"
                              onClick={() => props.deleteShift(item._id)}
                            >
                              <MdDelete />
                            </Link>
                          </>
                        )}
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            ))}
            {schedule.map((shift, index) => {
              if ((props?.allShifts?.length || 0) + index >= 3) return null;
              return (
                <ListGroup key={index}>
                  <ListGroup.Item>
                    <Row>
                      <Col xs={8}>
                        <Row>
                          <Col xs={6}>
                            <Form.Group className="d-flex flex-column">
                              <Form.Label className="fw-bold">
                                Start Time:
                              </Form.Label>

                              <CustomTimePicker
                                value={
                                  shift.start
                                    ? parseTimeStringToDate(shift.start)
                                    : null
                                }
                                onChange={(e, timeString) => {
                                  handleStartTimeChange(index, timeString);
                                }}
                                use24Hours={hoursFormat === "HH:mm"}
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={6}>
                            <Form.Group className="d-flex flex-column">
                              <Form.Label className="fw-bold">
                                End Time:
                              </Form.Label>

                              <CustomTimePicker
                                value={
                                  shift.end
                                    ? parseTimeStringToDate(shift.end)
                                    : null
                                }
                                onChange={(e, timeString) => {
                                  handleEndTimeChange(index, timeString);
                                }}
                                use24Hours={hoursFormat === "HH:mm"}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={4}>
                        <Form.Label className="fw-bold">&nbsp;</Form.Label>
                        <div className="icon-joiner justify-content-end">
                          <Link
                            className="del-btn"
                            onClick={() => removeShiftRow(index)}
                          >
                            <MdDelete />
                          </Link>
                        </div>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              );
            })}

            {(props?.allShifts?.length || 0) + schedule.length < 3 ? (
              <>
                <Row className="my-3 text-center">
                  <Col xs={12}>
                    <Button className="theme-button" onClick={addShiftRow}>
                      Add Shift
                    </Button>
                  </Col>
                </Row>
              </>
            ) : (
              <Row className="my-3">
                <Col xs={12}>
                  <Form.Label className="fw-bold">
                    You can only select up to 3 shifts.
                  </Form.Label>
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button className="theme-button" type="submit">
              Submit
            </Button>
            <Button className="theme-button-outline" onClick={props.onHide}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
export default AddShiftModal;
