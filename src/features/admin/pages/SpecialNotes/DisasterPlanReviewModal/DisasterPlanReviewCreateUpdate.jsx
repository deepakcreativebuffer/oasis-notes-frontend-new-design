import React from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  ModalBody,
  Row,
} from "react-bootstrap";
import {
  formatDateToMMDDYYYY,
  parseTimeStringToDate,
  signatureFormat,
} from "@/utils/utils";
import DatePicker from "react-datepicker";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import { MultiSelect } from "react-multi-select-component";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { ROLES } from "@/features/shared/constants";

const DisasterPlanReviewCreateUpdate = ({
  facilitiesList,
  handleSubmit7,
  disasterPlanData,
  setDisasterPlanData,
  employeeOptions,
  currentUser,
  isSubmitEnabled,
  signHandler,
  editStatus,
  signers,
  setSigners,
  employeeSignature,
  employeeSignatureDate,
  employeeSignatureTime,
  hoursFormat,
  adminSignature,
  adminDateSigned,
  adminSignedTime,
  onHide,
}) => {
  return (
    <>
      <Modal.Header closeButton onHide={onHide}>
        <h5 className="mb-0 fw-bold">Disaster Plan Review</h5>
      </Modal.Header>
      <Form onSubmit={handleSubmit7}>
        <ModalBody>
          <div>
            <Form.Label className="fw-bold">
              (A disaster plan will be reviewed every 12 months and Disaster
              Review Document is maintained for at least 12 months after the
              date of review){" "}
            </Form.Label>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Select Facility:
                    </Form.Label>
                    <Form.Select
                      value={
                        disasterPlanData?.facilityId?._id ||
                        disasterPlanData?.facilityId ||
                        ""
                      }
                      onChange={(e) => {
                        const selectedFacility = facilitiesList?.find(
                          (fac) => fac._id === e.target.value,
                        );
                        if (selectedFacility) {
                          setDisasterPlanData({
                            ...disasterPlanData,
                            facilityId: selectedFacility._id,
                            facilityAddress:
                              selectedFacility.address ||
                              selectedFacility.location ||
                              "",
                          });
                        } else {
                          setDisasterPlanData({
                            ...disasterPlanData,
                            facilityId: "",
                            facilityAddress: "",
                          });
                        }
                      }}
                    >
                      <option value="">Select Facility</option>
                      {facilitiesList?.map((facility) => (
                        <option key={facility._id} value={facility._id}>
                          {facility.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Facility Address:
                    </Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setDisasterPlanData({
                          ...disasterPlanData,
                          facilityAddress: e.target.value,
                        })
                      }
                      value={disasterPlanData?.facilityAddress}
                      type="text"
                      placeholder="Enter Facility Address"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="mb-2.5 font-bold">Date:</Form.Label>

                    <DatePicker
                      selected={formatDateToMMDDYYYY(disasterPlanData.date)}
                      onChange={(selectedDate) =>
                        setDisasterPlanData({
                          ...disasterPlanData,
                          date: selectedDate?.toDateString(),
                        })
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            disasterPlanData.date
                              ? formatDateToMMDDYYYY(disasterPlanData.date)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} lg={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="font-bold">Time:</Form.Label>

                    <CustomTimePicker
                      use24Hours={hoursFormat === "HH:mm"}
                      value={
                        disasterPlanData?.shiftTime
                          ? parseTimeStringToDate(disasterPlanData?.shiftTime)
                          : null
                      }
                      onChange={(e, timeString) => {
                        setDisasterPlanData({
                          ...disasterPlanData,
                          shiftTime: timeString,
                        });
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="font-bold">Shift From:</Form.Label>

                    <CustomTimePicker
                      use24Hours={hoursFormat === "HH:mm"}
                      value={
                        disasterPlanData?.shiftFrom
                          ? parseTimeStringToDate(disasterPlanData?.shiftFrom)
                          : null
                      }
                      onChange={(e, timeString) => {
                        setDisasterPlanData({
                          ...disasterPlanData,
                          shiftFrom: timeString,
                        });
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="font-bold">Shift To:</Form.Label>

                    <CustomTimePicker
                      use24Hours={hoursFormat === "HH:mm"}
                      value={
                        disasterPlanData?.shiftTo
                          ? parseTimeStringToDate(disasterPlanData?.shiftTo)
                          : null
                      }
                      onChange={(e, timeString) => {
                        setDisasterPlanData({
                          ...disasterPlanData,
                          shiftTo: timeString,
                        });
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card>
            <Card body className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Name of staff or volunteer participating in the Disaster Plan
                  Review:
                </Form.Label>
                <MultiSelect
                  options={employeeOptions}
                  onChange={(selectedOptions) => {
                    const selectedValues = Array.isArray(selectedOptions)
                      ? selectedOptions.map((option) => option.value)
                      : [];

                    setDisasterPlanData((prevFireDrill) => ({
                      ...prevFireDrill,
                      participants: selectedValues,
                    }));
                  }}
                  value={employeeOptions.filter((option) =>
                    disasterPlanData.participants.includes(option.value),
                  )}
                  overrideStrings={{
                    selectSomeItems: "Select...",
                    allItemsAreSelected: employeeOptions
                      .filter((option) =>
                        disasterPlanData.participants.includes(option.value),
                      )
                      .map((item) => item.label)
                      .join(", "),
                  }}
                  placeholder="Select"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="mb-0 fw-bold">
                  Critique of the Disaster Plan Review (Problems Identified):
                </Form.Label>
                <Form.Control
                  as={"textarea"}
                  rows={3}
                  required
                  onChange={(e) =>
                    setDisasterPlanData({
                      ...disasterPlanData,
                      critiqueProblemsIdentified: e.target.value,
                    })
                  }
                  value={disasterPlanData.critiqueProblemsIdentified}
                  placeholder="Type Here..."
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="mb-0 fw-bold">
                  Recommendation(s) for Improvement :
                </Form.Label>
                <Form.Control
                  as={"textarea"}
                  rows={3}
                  required
                  onChange={(e) =>
                    setDisasterPlanData({
                      ...disasterPlanData,
                      recommendationsForImprovement: e.target.value,
                    })
                  }
                  value={disasterPlanData.recommendationsForImprovement}
                  placeholder="Type Here..."
                />
              </Form.Group>

              <Form.Group className="mb-3 d-flex flex-column">
                <Form.Label className="fw-bold">
                  Date for next disaster annual review Plan:
                </Form.Label>

                <DatePicker
                  selected={formatDateToMMDDYYYY(
                    disasterPlanData.nextReviewDate,
                  )}
                  onChange={(selectedDate) =>
                    setDisasterPlanData({
                      ...disasterPlanData,
                      nextReviewDate: selectedDate.toDateString(),
                    })
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  className="form-control"
                  highlightDates={[
                    {
                      "react-datepicker__day--highlighted-custom": [
                        disasterPlanData.nextReviewDate
                          ? formatDateToMMDDYYYY(
                              disasterPlanData.nextReviewDate,
                            )
                          : new Date(),
                      ],
                    },
                  ]}
                />
              </Form.Group>
            </Card>
            <Card body className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Review Completed By:
                </Form.Label>
                <Form.Control
                  type="textarea"
                  required
                  onChange={(e) =>
                    setDisasterPlanData({
                      ...disasterPlanData,
                      reviewCompletedByName: e.target.value,
                    })
                  }
                  value={disasterPlanData.reviewCompletedByName}
                  placeholder="Type Here"
                />
              </Form.Group>
            </Card>
            <Row>
              <Col xs={12} lg={6}>
                <Button
                  type="button"
                  onClick={signHandler}
                  className="theme-button"
                >
                  SAVED AND SIGNED
                </Button>
              </Col>
              <Col xs={12} lg={6}>
                <div>
                  {signatureFormat({
                    sign: employeeSignature,
                    date: employeeSignatureDate,
                    time: employeeSignatureTime,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: adminSignature,
                    date: adminDateSigned,
                    time: adminSignedTime,
                    hoursFormat,
                  })}
                </div>
                <div>
                  {signers?.map(
                    (signer) =>
                      signer.signature && (
                        <div key={signer?.signerId}>
                          {signatureFormat({
                            sign: signer.signature,
                            date: signer.dateSigned,
                            time: signer.signedTime,
                            hoursFormat,
                          })}
                        </div>
                      ),
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                {!editStatus && (
                  <div>
                    <Form.Label className="fw-bold">Signers:</Form.Label>
                    <MultiEmployee setValue={setSigners} value={signers} />
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </ModalBody>
        <Modal.Footer className="justify-content-center">
          <Button
            className="theme-button"
            type="submit"
            disabled={
              editStatus
                ? !isSubmitEnabled
                : currentUser.userType === ROLES.ADMIN
                  ? false
                  : employeeSignature.length === 0
            }
          >
            {editStatus ? "UPDATE" : "SAVE"}
          </Button>
          <Button className="theme-button-outline" onClick={onHide}>
            CANCEL
          </Button>
        </Modal.Footer>
      </Form>
    </>
  );
};

export default DisasterPlanReviewCreateUpdate;
