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

const RefrigeratorTemperatureCreateUpdate = ({
  facilitiesList,
  handleSubmitRef2,
  handleSubmitRef,
  refrigeratorData,
  setRefrigeratorData,
  handleTemperatureChange,
  addTemperature,
  removeRefrigratorTemp,
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
        <h5 className="mb-0 fw-bold">Refrigerator Temperature Monitoring</h5>
      </Modal.Header>
      <Form onSubmit={editStatus ? handleSubmitRef2 : handleSubmitRef}>
        <ModalBody>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3 d-flex flex-column">
                <Form.Label className="fw-bold">Date:</Form.Label>
                <DatePicker
                  selected={
                    refrigeratorData?.date
                      ? new Date(refrigeratorData.date)
                      : null
                  }
                  onChange={(selectedDate) =>
                    setRefrigeratorData({
                      ...refrigeratorData,
                      date: selectedDate?.toISOString(),
                    })
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  className="form-control w-100"
                  wrapperClassName="w-100"
                  highlightDates={[
                    {
                      "react-datepicker__day--highlighted-custom": [
                        refrigeratorData?.date
                          ? new Date(refrigeratorData.date)
                          : new Date(),
                      ],
                    },
                  ]}
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Select Facility:</Form.Label>
                <Form.Select
                  value={
                    refrigeratorData?.facilityId?._id ||
                    refrigeratorData?.facilityId ||
                    ""
                  }
                  onChange={(e) => {
                    const selectedFacility = facilitiesList?.find(
                      (fac) => fac._id === e.target.value,
                    );
                    if (selectedFacility) {
                      setRefrigeratorData({
                        ...refrigeratorData,
                        facilityId: selectedFacility._id,
                        location:
                          selectedFacility.address ||
                          selectedFacility.location ||
                          "",
                      });
                    } else {
                      setRefrigeratorData({
                        ...refrigeratorData,
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
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Facility Address:</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    setRefrigeratorData({
                      ...refrigeratorData,
                      location: e.target.value,
                    })
                  }
                  value={refrigeratorData?.location}
                  type="text"
                  placeholder="Enter Facility Address"
                />
              </Form.Group>
            </Col>
          </Row>
          <Table responsive bordered size="sm">
            <thead>
              <tr>
                <th>
                  <p className="mb-0 text-[14px]">Date</p>
                </th>
                <th>
                  <p className="mb-0 text-[14px]">Temperature Reading</p>
                </th>
                <th>
                  <p className="mb-0 text-[14px]">Staff Initials</p>
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
              {refrigeratorData.temperature.map((row, index) => (
                <tr key={index}>
                  <td>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(row.date)}
                      onChange={(selectedDate) =>
                        handleTemperatureChange(
                          index,
                          "date",
                          selectedDate?.toDateString(),
                        )
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      wrapperClassName="w-100"
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
                      size="sm"
                      type="text"
                      required
                      value={row.temperature}
                      onChange={(e) =>
                        handleTemperatureChange(
                          index,
                          "temperature",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      size="sm"
                      type="text"
                      required
                      value={row.initials}
                      onChange={(e) =>
                        handleTemperatureChange(
                          index,
                          "initials",
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  {(currentUser?.userType === ROLES.ADMIN ||
                    currentUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                    (currentUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                      currentUser?.userType === ROLES.EMPLOYEE &&
                      currentUser.userPermissions?.delete
                        ?.split(":")
                        .includes("spn"))) && (
                    <td>
                      <div className="icon-joiner">
                        <Link
                          className="del-btn hidePrint"
                          onClick={() => removeRefrigratorTemp(index)}
                        >
                          <AiFillDelete />{" "}
                        </Link>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
          <Row>
            <Col xs={12}>
              <div className="mb-3">
                <Button size="sm" variant="primary" onClick={addTemperature}>
                  Add Row
                </Button>
              </div>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col xs={12} lg={6}>
              <Button
                type="button"
                onClick={signHandler}
                className="theme-button mt-2"
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

export default RefrigeratorTemperatureCreateUpdate;
