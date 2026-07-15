import React from "react";
import {
  Button,
  Col,
  Form,
  Modal,
  ModalBody,
  Row,
  Table,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import { Link } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";

const WaterTemperatureCreateUpdate = ({
  facilitiesList,
  handleSubmitWaterTemp,
  handleWaterTempSubmit,
  waterData,
  setWaterData,
  handleWaterTemperatureChange,
  removeWaterTemp,
  addWaterTemperature,
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
        <h5 className="fw-bold">Water Temperature log</h5>
      </Modal.Header>
      <Form
        onSubmit={editStatus ? handleSubmitWaterTemp : handleWaterTempSubmit}
      >
        <ModalBody>
          <div>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Select Facility:</Form.Label>
              <Form.Select
                value={
                  waterData?.facilityId?._id || waterData?.facilityId || ""
                }
                onChange={(e) => {
                  const selectedFacility = facilitiesList?.find(
                    (fac) => fac._id === e.target.value,
                  );
                  if (selectedFacility) {
                    setWaterData({
                      ...waterData,
                      facilityId: selectedFacility._id,
                      location:
                        selectedFacility.address ||
                        selectedFacility.location ||
                        "",
                    });
                  } else {
                    setWaterData({
                      ...waterData,
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
                  setWaterData({
                    ...waterData,
                    location: e.target.value,
                  })
                }
                value={waterData?.location}
                type="text"
                placeholder="Enter Facility Address"
              />
            </Form.Group>
            <Form.Group className="mt-3 mb-3">
              <Form.Label className="fw-bold w-100 text-center">
                {" "}
                Water temperature should be less than 120 degrees.
              </Form.Label>
            </Form.Group>
            <Table responsive hover bordered>
              <thead>
                <tr>
                  <th>
                    <p>Date</p>
                  </th>
                  <th>
                    <p>Water Temperature reading (Kitchen sink)</p>
                  </th>
                  <th>
                    <p>Water Temperature reading (Restroom sink)</p>
                  </th>
                  {(currentUser?.userType === ROLES.ADMIN ||
                    currentUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                    (currentUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                      currentUser?.userType === ROLES.EMPLOYEE &&
                      currentUser.userPermissions?.delete
                        ?.split(":")
                        .includes("spn"))) && (
                    <th>
                      <p className="mb-0 text-[14px]">Actions</p>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {waterData.temperatureLog.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <DatePicker
                        selected={formatDateToMMDDYYYY(row.date)}
                        onChange={(selectedDate) =>
                          handleWaterTemperatureChange(
                            index,
                            "date",
                            selectedDate?.toDateString(),
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              row.date
                                ? formatDateToMMDDYYYY(row.date)
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        required
                        value={row.kitchenSinkReading}
                        onChange={(e) =>
                          handleWaterTemperatureChange(
                            index,
                            "kitchenSinkReading",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        required
                        value={row.restroomSinkReading}
                        onChange={(e) =>
                          handleWaterTemperatureChange(
                            index,
                            "restroomSinkReading",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    {(currentUser?.userType === ROLES.ADMIN ||
                      currentUser?.accountType ===
                        ACCOUNT_TYPES.ADMINISTRATOR ||
                      (currentUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                        currentUser?.userType === ROLES.EMPLOYEE &&
                        currentUser.userPermissions?.delete
                          ?.split(":")
                          .includes("spn"))) && (
                      <td>
                        <div className="icon-joiner">
                          <Link
                            className="del-btn hidePrint"
                            onClick={() => removeWaterTemp(index)}
                          >
                            <AiFillDelete />
                          </Link>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>

            <div>
              <Button variant="primary" onClick={addWaterTemperature}>
                Add Row
              </Button>
            </div>
            <hr />
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
            {editStatus ? "Update" : "Save"}
          </Button>
          <Button className="theme-button-outline" onClick={onHide}>
            CANCEL
          </Button>
        </Modal.Footer>
      </Form>
    </>
  );
};

export default WaterTemperatureCreateUpdate;
