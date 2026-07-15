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
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import CustomSelect from "@/features/shared/ui/selectors/CustomSelect";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";

import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";

const FireEquipmentCreateUpdate = ({
  facilitiesList,
  handleSubmit51,
  fireman,
  setFireman,
  handleAddAlarm,
  handleAlarmChange,
  handleExtinguisherChange,
  handleAddExtinguisher,
  handleStaffChange3,
  currentUser,
  employeeSignature,
  removeaddStaff3,
  addStaff3,
  signHandler,
  editStatus,
  signers,
  setSigners,
  employeeSignatureDate,
  employeeSignatureTime,
  hoursFormat,
  adminSignature,
  adminDateSigned,
  adminSignedTime,
  isSubmitEnabled,
  onHide,
}) => {
  return (
    <>
      <Modal.Header closeButton onHide={onHide}>
        <h5 className="fw-bold mb-0">Fire Equipment Monitoring</h5>
      </Modal.Header>
      <Form onSubmit={handleSubmit51}>
        <ModalBody>
          <Row>
            <Col xs={12} sm={6} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Select Facility:</Form.Label>
                <Form.Select
                  value={fireman?.facilityId?._id || fireman?.facilityId || ""}
                  onChange={(e) => {
                    const selectedFacility = facilitiesList?.find(
                      (fac) => fac._id === e.target.value,
                    );
                    if (selectedFacility) {
                      setFireman({
                        ...fireman,
                        facilityId: selectedFacility._id,
                        location:
                          selectedFacility.address ||
                          selectedFacility.location ||
                          "",
                      });
                    } else {
                      setFireman({
                        ...fireman,
                        facilityId: "",
                        location: "",
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
                <Form.Label className="fw-bold">Facility Address:</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    setFireman({
                      ...fireman,
                      location: e.target.value,
                    })
                  }
                  value={fireman?.location}
                  type="text"
                  placeholder="Enter Facility Address"
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={6}>
              <Form.Group className="mb-3 d-flex flex-column">
                <Form.Label className="w-full font-bold">
                  Today's Date:
                </Form.Label>

                <DatePicker
                  selected={formatDateToMMDDYYYY(fireman?.date)}
                  onChange={(selectedDate) =>
                    setFireman({
                      ...fireman,
                      date: selectedDate?.toDateString(),
                    })
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  className="form-control"
                  highlightDates={[
                    {
                      "react-datepicker__day--highlighted-custom": [
                        fireman?.date
                          ? formatDateToMMDDYYYY(fireman?.date)
                          : new Date(),
                      ],
                    },
                  ]}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Form.Label className="fw-bold">Smoke Alarms</Form.Label>
              <Card body className="mb-3">
                <Form>
                  <Card body className="mb-3">
                    {fireman.alaram.map((alarm, index) => (
                      <Row>
                        <Col xs={12}>
                          <Form.Group key={alarm.id} className="mb-3">
                            <Form.Label className="w-full font-bold">
                              Smoke Alarm {index + 1}:
                            </Form.Label>

                            <CustomSelect
                              options={[
                                {
                                  value: "working",
                                  label: " Working Properly",
                                },
                                {
                                  value: "NeedRepair",
                                  label: "Needs to be Repaired",
                                },
                                {
                                  value: "RepairAndWork",
                                  label: "Repaired & Working",
                                },
                              ]}
                              onChange={(e) =>
                                handleAlarmChange(alarm.id, "working", e)
                              }
                              styleOpt={{
                                border: "1px solid #ccc",
                                padding: "4px",
                                borderRadius: "4px",
                              }}
                              value={alarm.working}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    ))}
                    <Button
                      variant="primary"
                      className="mb-3"
                      size="sm"
                      onClick={handleAddAlarm}
                    >
                      Add Smoke Alarm
                    </Button>
                  </Card>
                  <Form.Label className="fw-bold">Extinguishers</Form.Label>
                  <Card body className="mb-3">
                    {fireman.extinguisher.map((extinguisher, index) => (
                      <Form.Group key={extinguisher.id} className="mb-3">
                        <Row>
                          {" "}
                          <Col xs={12} md={6}>
                            <Form.Label className="w-full font-bold">
                              Extinguisher {index + 1}:
                            </Form.Label>

                            <CustomSelect
                              options={[
                                {
                                  value: "working",
                                  label: "Working Properly",
                                },
                                {
                                  value: "NeedRepair",
                                  label: "Needs to be Repaired",
                                },
                                {
                                  value: "RepairAndWork",
                                  label: "Repaired & Working",
                                },
                              ]}
                              onChange={(e) =>
                                handleExtinguisherChange(
                                  extinguisher.id,
                                  "working",
                                  e,
                                )
                              }
                              styleOpt={{
                                border: "1px solid #ccc",
                                padding: "4px",
                                borderRadius: "4px",
                              }}
                              value={extinguisher.working}
                            />
                          </Col>
                          <Col xs={12} md={6}>
                            <Form.Group className="d-flex flex-column">
                              <Form.Label className="w-full font-bold">
                                Expiration Date {index + 1}:
                              </Form.Label>

                              <DatePicker
                                selected={formatDateToMMDDYYYY(
                                  extinguisher.date,
                                )}
                                onChange={(selectedDate) =>
                                  handleExtinguisherChange(
                                    extinguisher.id,
                                    "date",
                                    selectedDate?.toDateString(),
                                  )
                                }
                                dateFormat="MM/dd/yyyy"
                                placeholderText="MM/DD/YYYY"
                                className="form-control"
                                highlightDates={[
                                  {
                                    "react-datepicker__day--highlighted-custom":
                                      [
                                        extinguisher.date
                                          ? formatDateToMMDDYYYY(
                                              extinguisher.date,
                                            )
                                          : new Date(),
                                      ],
                                  },
                                ]}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Form.Group>
                    ))}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAddExtinguisher}
                    >
                      Add Extinguisher
                    </Button>
                  </Card>
                </Form>
              </Card>
              <Form.Label className="fw-bold">Staff Details:</Form.Label>
              <Card body className="mb-3">
                {fireman.staff.map((staffItem, index) => (
                  <div className="flex justify-between items-center">
                    <Form key={index}>
                      <Row>
                        <Col xs={12} sm={6} md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="w-full font-bold">
                              Staff Name:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter Staff Name"
                              value={staffItem.staffName}
                              required
                              onChange={(e) =>
                                handleStaffChange3(
                                  index,
                                  "staffName",
                                  e.target.value,
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={6} md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="w-full font-bold">
                              Initials:
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter Initials"
                              value={staffItem.initial}
                              required
                              onChange={(e) =>
                                handleStaffChange3(
                                  index,
                                  "initial",
                                  e.target.value,
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                    {(currentUser?.userType === ROLES.ADMIN ||
                      currentUser?.accountType ===
                        ACCOUNT_TYPES.ADMINISTRATOR ||
                      (currentUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                        currentUser?.userType === ROLES.EMPLOYEE &&
                        currentUser.userPermissions?.delete
                          ?.split(":")
                          .includes("spn"))) && (
                      <div className="icon-joiner">
                        <Link
                          className="del-btn hidePrint"
                          onClick={() => removeaddStaff3(index)}
                        >
                          <AiFillDelete />{" "}
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </Card>
              <Card body className="mb-3">
                <Button
                  className="staffbtn px-10 py-2 bg-white text-[#0C5C75] font-semibold"
                  onClick={addStaff3}
                >
                  <span>
                    <img
                      className="w-5 h-5 mx-auto mb-2 font-semibold"
                      src="/add.png"
                      alt="images-p"
                    />
                  </span>
                  <span className="text-[#1A9FB2] font-semibold">
                    ADD MORE STAFF
                  </span>
                </Button>
              </Card>
            </Col>
          </Row>
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
                  <Form.Label className="fw-bold">Signers:</Form.Label>
                  <MultiEmployee setValue={setSigners} value={signers} />
                </div>
              )}
            </Col>
          </Row>
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

export default FireEquipmentCreateUpdate;
