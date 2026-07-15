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
import DatePicker from "react-datepicker";
import {
  formatDateToMMDDYYYY,
  parseTimeStringToDate,
  signatureFormat,
} from "@/utils/utils";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import { MultiSelect } from "react-multi-select-component";
import CustomSelect from "@/features/shared/ui/selectors/CustomSelect";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";

import { ROLES } from "@/features/shared/constants";

const EvacuationAndFireDrillCreateUpdate = ({
  facilitiesList,
  submitHandler3,
  fireDrill,
  setFireDrill,
  currentUser,
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
  isSubmitEnabled,
  onHide,
  counte,
  setCounte,
  employeeOptions,
  residentsOptions,
}) => {
  return (
    <>
      <Modal.Header closeButton onHide={onHide}>
        <h5 className="fw-bold mb-0">Evacuation Drill Report</h5>
      </Modal.Header>
      <Form onSubmit={submitHandler3}>
        <ModalBody>
          <Form.Label className="fw-bold">
            Evacuation Drill will be conducted once every six (6) months on each
            shift by staff and residents
          </Form.Label>
          <div>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Select Facility:
                    </Form.Label>
                    <Form.Select
                      value={
                        fireDrill?.facilityId?._id ||
                        fireDrill?.facilityId ||
                        ""
                      }
                      onChange={(e) => {
                        const selectedFacility = facilitiesList?.find(
                          (fac) => fac._id === e.target.value,
                        );
                        if (selectedFacility) {
                          setFireDrill({
                            ...fireDrill,
                            facilityId: selectedFacility._id,
                            facititAddress:
                              selectedFacility.address ||
                              selectedFacility.location ||
                              "",
                          });
                        } else {
                          setFireDrill({
                            ...fireDrill,
                            facilityId: "",
                            facititAddress: "",
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
                        setFireDrill({
                          ...fireDrill,
                          facititAddress: e.target.value,
                        })
                      }
                      value={fireDrill?.facititAddress}
                      type="text"
                      placeholder="Enter Facility Address"
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="mb-0 w-full font-bold">
                      Date:
                    </Form.Label>

                    <DatePicker
                      selected={formatDateToMMDDYYYY(fireDrill.date)}
                      onChange={(selectedDate) =>
                        setFireDrill({
                          ...fireDrill,
                          date: selectedDate?.toDateString(),
                        })
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            fireDrill.date
                              ? formatDateToMMDDYYYY(fireDrill.date)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="mb-0 w-full font-bold">
                      Start Time:
                    </Form.Label>

                    <CustomTimePicker
                      use24Hours={hoursFormat === "HH:mm"}
                      value={parseTimeStringToDate(fireDrill.startTime)}
                      onChange={(e, timeString) => {
                        setFireDrill({
                          ...fireDrill,
                          startTime: timeString,
                        });
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="mb-0 w-full font-bold">
                      End Time:
                    </Form.Label>

                    <CustomTimePicker
                      use24Hours={hoursFormat === "HH:mm"}
                      value={
                        fireDrill.endTime
                          ? parseTimeStringToDate(fireDrill.endTime)
                          : null
                      }
                      onChange={(e, timeString) => {
                        setFireDrill({
                          ...fireDrill,
                          endTime: timeString,
                        });
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="mb-0 w-full font-bold">
                      Shift From:
                    </Form.Label>

                    <CustomTimePicker
                      use24Hours={hoursFormat === "HH:mm"}
                      value={
                        fireDrill.shiftFrom
                          ? parseTimeStringToDate(fireDrill.shiftFrom)
                          : null
                      }
                      onChange={(e, timeString) => {
                        setFireDrill({
                          ...fireDrill,
                          shiftFrom: timeString,
                        });
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="mb-0 w-full font-bold">
                      Shift To:
                    </Form.Label>

                    <CustomTimePicker
                      use24Hours={hoursFormat === "HH:mm"}
                      value={
                        fireDrill.shiftTo
                          ? parseTimeStringToDate(fireDrill.shiftTo)
                          : null
                      }
                      onChange={(e, timeString) => {
                        setFireDrill({
                          ...fireDrill,
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
                  Name of Person Conducting the Evacuation Drill:
                </Form.Label>
                <Form.Control
                  onChange={(e) =>
                    setFireDrill({
                      ...fireDrill,
                      evacuationPersonConduct: e.target.value,
                    })
                  }
                  value={fireDrill.evacuationPersonConduct}
                  required
                  type="text"
                ></Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Name (s) of Employees Partiacipating in Evacuation Drill:
                </Form.Label>

                <MultiSelect
                  options={employeeOptions}
                  onChange={(selectedOptions) => {
                    const selectedValues = Array.isArray(selectedOptions)
                      ? selectedOptions.map((option) => option.value)
                      : [];

                    setFireDrill((prevFireDrill) => ({
                      ...prevFireDrill,
                      evacuationParticipatingEmployee: selectedValues,
                    }));
                  }}
                  value={employeeOptions.filter((option) =>
                    fireDrill.evacuationParticipatingEmployee.includes(
                      option.value,
                    ),
                  )}
                  overrideStrings={{
                    selectSomeItems: "Select...",
                    allItemsAreSelected: employeeOptions
                      .filter((option) =>
                        fireDrill.evacuationParticipatingEmployee.includes(
                          option.value,
                        ),
                      )
                      .map((item) => item.label)
                      .join(", "),
                  }}
                  placeholder="Select"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Name(s) of Residents Participating in Evacuation Drill:
                </Form.Label>

                <MultiSelect
                  options={residentsOptions}
                  onChange={(selectedOptions) => {
                    const selectedValues = Array.isArray(selectedOptions)
                      ? selectedOptions.map((option) => option.value)
                      : [];

                    setFireDrill((prevFireDrill) => ({
                      ...prevFireDrill,
                      residentsInvolved: selectedValues,
                    }));
                  }}
                  value={residentsOptions.filter((option) =>
                    fireDrill?.residentsInvolved?.includes(option.value),
                  )}
                  overrideStrings={{
                    selectSomeItems: "Select...",
                    allItemsAreSelected: residentsOptions
                      .filter((option) =>
                        fireDrill?.residentsInvolved?.includes(option.value),
                      )
                      .map((item) => item.label)
                      .join(", "),
                  }}
                  placeholder="Select"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Name (s) of Residents requiring Assistance for Evacuation:
                </Form.Label>

                <MultiSelect
                  options={residentsOptions}
                  onChange={(selectedOptions) => {
                    const selectedValues = Array.isArray(selectedOptions)
                      ? selectedOptions.map((option) => option.value)
                      : [];

                    setFireDrill((prevFireDrill) => ({
                      ...prevFireDrill,
                      residentsAssistanceEmployee: selectedValues,
                    }));
                  }}
                  value={residentsOptions.filter((option) =>
                    fireDrill.residentsAssistanceEmployee?.includes(
                      option.value,
                    ),
                  )}
                  overrideStrings={{
                    selectSomeItems: "Select...",
                    allItemsAreSelected: residentsOptions
                      .filter((option) =>
                        fireDrill.residentsAssistanceEmployee?.includes(
                          option.value,
                        ),
                      )
                      .map((item) => item.label)
                      .join(", "),
                  }}
                  placeholder="Select"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Fire Alarm Activation Method
                </Form.Label>

                <CustomSelect
                  options={[
                    {
                      value: "Smoke Detector activated",
                      label: " Smoke Detector activated",
                    },
                    { value: "Whistle", label: "Whistle" },
                  ]}
                  onChange={(e) =>
                    setFireDrill({
                      ...fireDrill,
                      fireAlaramActivationMethod: e,
                    })
                  }
                  styleOpt={{
                    border: "1px solid #ccc",
                    padding: "4px",
                    borderRadius: "4px",
                  }}
                  value={fireDrill.fireAlaramActivationMethod}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <span>
                  <Form.Label className="mb-0 flex gap-4">
                    <span className="fw-bold">Unusual Condition : </span>
                    <span className="flex gap-4">
                      <Form.Check
                        onChange={(e) =>
                          setFireDrill({
                            ...fireDrill,
                            unusualConditionText: "Yes",
                          })
                        }
                        label="Yes"
                        id="unusualYes"
                        checked={fireDrill.unusualConditionText === "Yes"}
                      />
                      <Form.Check
                        onChange={(e) =>
                          setFireDrill({
                            ...fireDrill,
                            unusualConditionText: "No",
                          })
                        }
                        label="No"
                        id="unusualNo"
                        checked={fireDrill.unusualConditionText === "No"}
                      />
                    </span>
                  </Form.Label>
                </span>
              </Form.Group>
              {fireDrill.unusualConditionText === "Yes" && (
                <Form.Group className="mb-3">
                  <Form.Label className="w-full font-bold">
                    Unusual Conditions , If yes List:
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    required
                    onChange={(e) =>
                      setFireDrill({
                        ...fireDrill,
                        condition: e.target.value,
                      })
                    }
                    value={fireDrill?.condition}
                    placeholder="Type Here"
                    className="break-all"
                  />
                </Form.Group>
              )}
              (Weather, remodeling, temporary exits)
            </Card>
            <Card body className="mb-3">
              <div className="flex justify-between flex-wrap font-bold">
                <div className="text-[14px]">
                  Number of Occupants Evacuated:
                </div>
                <div className="flex items-center gap-[0.2rem] bg-[#EEEEEE] px-6 py-2 rounded-lg cursor-pointer">
                  <span>
                    <img
                      onClick={() => setCounte(counte - 1)}
                      className="max-w-[25px] max-h-[25px] w-auto h-auto"
                      src="/sub.png"
                      alt="sub"
                    />
                  </span>
                  <span></span>
                  {counte} Persons
                  <span>
                    <img
                      onClick={() => setCounte(counte + 1)}
                      className="max-w-[25px] max-h-[25px] w-auto h-auto"
                      src="/add.png"
                      alt="sub"
                    />
                  </span>
                </div>
              </div>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Total Time of Evacuation Drill:
                </Form.Label>
                <Form.Control
                  required
                  onChange={(e) =>
                    setFireDrill({
                      ...fireDrill,
                      totalTimeOfEvacuationDrill: e.target.value,
                    })
                  }
                  value={fireDrill.totalTimeOfEvacuationDrill}
                  type="text"
                ></Form.Control>
              </Form.Group>
            </Card>
            <Card body className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Problems Encountered During Evacuation Drill:
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  onChange={(e) =>
                    setFireDrill({
                      ...fireDrill,
                      problemEncounteredDuringEvacuationDrill: e.target.value,
                    })
                  }
                  value={fireDrill?.problemEncounteredDuringEvacuationDrill}
                  placeholder="Type Here"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Recommendation(s):
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  onChange={(e) =>
                    setFireDrill({
                      ...fireDrill,
                      recommendations: e.target.value,
                    })
                  }
                  value={fireDrill?.recommendations}
                  placeholder="Type Here"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Plan Of Actions:
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  onChange={(e) =>
                    setFireDrill({
                      ...fireDrill,
                      planAction: e.target.value,
                    })
                  }
                  value={fireDrill?.planAction}
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
              </Col>
            </Row>
            <Row className="mt-2">
              <Col xs={12}>
                {!editStatus && (
                  <div>
                    <Form.Label className="fw-bold">Signers</Form.Label>
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
            type={"submit"}
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

export default EvacuationAndFireDrillCreateUpdate;
