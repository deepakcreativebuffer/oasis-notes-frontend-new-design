import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import {
  AddSignatureForTable,
  parseTimeStringToDate,
  signatureFormat,
} from "@/utils/utils";
import { BorderlessInput, CheckBoxMaker } from "@/utils/Makers";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { medicationService } from "@/features/shared/services";
import { ROLES } from "@/features/shared/constants";
import { showNotification } from "@/utils";
const PrnModel = (props) => {
  const [timeReEvaluated, setTimeReEvaluated] = useState("");
  const [resposneCode, setResponseCode] = useState([]);
  const [responseCodeOther, setResponseCodeOther] = useState("");
  const [revaluatedStaffInitials, setRevaluatedStaffInitials] = useState("");
  const [revaluatedStaffSignatureDate, setRevaluatedStaffSignatureDate] =
    useState("");
  const hoursFormat =
    props.profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [open, setOpen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const pushInArr = ({ array, value, setArr }) => {
    if (array?.includes(value)) {
      const filtered = array?.filter((item) => item !== value);
      setArr(filtered);
    } else {
      setArr([...array, value]);
    }
  };
  useEffect(() => {
    if (props.show && props.tableRow) {
      setResponseCode(props.tableRow.resposneCode || []);
      setResponseCodeOther(props.tableRow.responseCodeOther || "");
      setTimeReEvaluated(props.tableRow.timeReEvaluated || "");
      setRevaluatedStaffInitials(props.tableRow.revaluatedStaffInitials || "");
      setRevaluatedStaffSignatureDate(
        props.tableRow.revaluatedStaffSignatureDate || "",
      );
    }
  }, [props.show, props.tableRow]);
  const clearField = () => {
    setTimeReEvaluated("");
    setResponseCode([]);
    setResponseCodeOther("");
    setRevaluatedStaffInitials("");
    setRevaluatedStaffSignatureDate("");
    setIsEmpty(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!revaluatedStaffInitials) {
      setIsEmpty(true);
      return;
    }
    let isLock;
    if (
      (props.profileInfo?.userType === ROLES.ADMIN &&
        resposneCode.length > 0 &&
        timeReEvaluated) ||
      props.profileInfo?.userType === ROLES.EMPLOYEE
    ) {
      isLock = true;
    } else if (
      (props.profileInfo?.userType === ROLES.ADMIN &&
        (resposneCode.length > 0 || timeReEvaluated)) ||
      props.profileInfo?.userType === ROLES.ADMIN
    ) {
      isLock = false;
    } else {
      isLock = false;
    }
    const updatedRow = props.tableRow._id
      ? {
          resposneCode,
          responseCodeOther,
          timeReEvaluated,
          revaluatedStaffInitials,
          revaluatedStaffSignatureDate,
          isLocked: isLock,
        }
      : {
          ...props.tableRow,
          resposneCode,
          responseCodeOther,
          timeReEvaluated,
          revaluatedStaffInitials,
          revaluatedStaffSignatureDate,
          isLocked: isLock,
        };
    if (props.tableRow._id) {
      try {
        await medicationService.mars.updatePrnRow(
          props.MedId,
          props.tableRow._id,
          updatedRow,
          { setLoading },
        );
        props.onRefresh?.();
        props.onHide();
        clearField();
      } catch (err) {
        showNotification({
          message: err?.message || "Failed to update",
          type: "danger",
        });
      }
    } else {
      props.onUpdateRow(updatedRow);
      props.onHide();
      clearField();
    }
  };
  return (
    <>
      <AddSignatureForTable
        show={open}
        setValue={(sign) => setRevaluatedStaffInitials(sign)}
        setDate={(date) => setRevaluatedStaffSignatureDate(date)}
        setShow={setOpen}
      />
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h6 className="fw-bold mb-0">{`${"Update"}`}</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="w-100">
            <Row>
              <Col
                xs={12}
                md={8}
                lg={8}
                className={
                  props.profileInfo?.userType === ROLES.PATIENT ||
                  props.profileInfo?.userType === ROLES.GUARDIAN
                    ? "pe-none"
                    : ""
                }
              >
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Time Re-evaluated</Form.Label>
                  <CustomTimePicker
                    use24Hours={hoursFormat === "HH:mm"}
                    value={
                      timeReEvaluated
                        ? parseTimeStringToDate(timeReEvaluated)
                        : null
                    }
                    onChange={setTimeReEvaluated}
                  />
                </Form.Group>
              </Col>
              {props.profileInfo.userType === ROLES.ADMIN && (
                <Col
                  xs={12}
                  md={4}
                  lg={4}
                  className="flex items-center align-items-center mt-3"
                >
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setTimeReEvaluated("");
                    }}
                  >
                    Reset
                  </Button>
                </Col>
              )}
            </Row>
            <Row>
              <Col
                xs={12}
                md={12}
                lg={12}
                className={
                  props.profileInfo?.userType === ROLES.PATIENT ||
                  props.profileInfo?.userType === ROLES.GUARDIAN
                    ? "pe-none"
                    : ""
                }
              >
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Response Code</Form.Label>
                  <div className="radio-inline">
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: resposneCode,
                          value: "Relief",
                          setArr: setResponseCode,
                        })
                      }
                      value="Relief"
                      id="responseCode1"
                      label="Relief"
                      checked={resposneCode?.includes("Relief")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: resposneCode,
                          value: "No Relief",
                          setArr: setResponseCode,
                        })
                      }
                      value="No Relief"
                      id="responseCode2"
                      label="No Relief"
                      checked={resposneCode?.includes("No Relief")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: resposneCode,
                          value: "Sleeping",
                          setArr: setResponseCode,
                        })
                      }
                      value="Sleeping"
                      id="responseCode3"
                      label="Sleeping"
                      checked={resposneCode?.includes("Sleeping")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: resposneCode,
                          value: "Out Of Facility",
                          setArr: setResponseCode,
                        })
                      }
                      value="Out Of Facility"
                      id="responseCode4"
                      label="Out Of Facility"
                      checked={resposneCode?.includes("Out Of Facility")}
                    />
                    <CheckBoxMaker
                      setValue={() =>
                        pushInArr({
                          array: resposneCode,
                          value: "Other",
                          setArr: setResponseCode,
                        })
                      }
                      value="Other"
                      id="responseCode5"
                      label="Other"
                      checked={resposneCode?.includes("Other")}
                    />

                    {resposneCode?.includes("Other") && (
                      <BorderlessInput
                        className="w-auto"
                        setState={setResponseCodeOther}
                        type="text"
                        value={responseCodeOther}
                      />
                    )}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              {props.profileInfo?.userType !== ROLES.PATIENT && (
                <Row>
                  <Col
                    xs={12}
                    md={8}
                    lg={8}
                    className="flex gap-1 items-center"
                  >
                    <Button
                      type="button"
                      className="theme-button text-sm p-[5px]"
                      onClick={() => setOpen(true)}
                    >
                      Time Re-evaluated Staff Initials
                    </Button>
                    <div className="text-red-600 text-[12px]">
                      *
                      {isEmpty && !revaluatedStaffInitials && (
                        <span>This field is required</span>
                      )}
                    </div>
                  </Col>
                  <Col xs={12} md={4} lg={4}>
                    {signatureFormat({
                      sign: revaluatedStaffInitials,
                      date: revaluatedStaffSignatureDate,
                      hoursFormat,
                    })}
                  </Col>
                </Row>
              )}
            </Row>
          </Form>
          <Row className="justify-content-center mt-3 pt-3 border-top">
            <Col xs={12} sm={12} md={12} xl={12} className="text-center">
              <button className="btn theme-button mx-1" onClick={handleSubmit}>
                {loading ? <ClipLoader color="#fff" /> : "Submit"}
              </button>
              <button
                className="btn theme-button-outline mx-1"
                onClick={(e) => {
                  e.preventDefault();
                  props.onHide();
                }}
              >
                Cancel
              </button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default PrnModel;
