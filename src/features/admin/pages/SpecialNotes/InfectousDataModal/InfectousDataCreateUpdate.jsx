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
import { RiDeleteBin5Fill } from "react-icons/ri";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";

const InfectousDataCreateUpdate = ({
  handleSubmit6,
  infectiousData,
  facilitiesList,
  handleInputChange6,
  handleAddRow,
  handleDeleteRow,
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
        <h5 className="fw-bold mb-0">Infectous Data</h5>
      </Modal.Header>
      <Form onSubmit={handleSubmit6}>
        <ModalBody>
          <div>
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Facility Address</th>
                  <th>Date of Data Collection</th>
                  <th>
                    <p className="mb-0 text-sm">Type of Data Collection</p>
                    <p className="mb-0 text-sm">(Data Collected)</p>
                  </th>
                  <th>
                    <p className="mb-0 text-sm">Any Issues Noted</p>
                  </th>
                  <th>
                    <p className="mb-0 text-sm"> Data Collected By</p>
                  </th>
                  {(currentUser?.userType === ROLES.ADMIN ||
                    currentUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                    (currentUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                      currentUser?.userType === ROLES.EMPLOYEE &&
                      currentUser.userPermissions?.delete
                        ?.split(":")
                        .includes("spn"))) && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {infectiousData.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Control
                        type="text"
                        size="sm"
                        value={row.employeeName}
                        required
                        onChange={(e) =>
                          handleInputChange6(
                            index,
                            "employeeName",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td>
                      <Form.Select
                        size="sm"
                        className="mb-1"
                        value={row?.facilityId?._id || row?.facilityId || ""}
                        onChange={(e) => {
                          const selectedFacility = facilitiesList?.find(
                            (fac) => fac._id === e.target.value,
                          );
                          if (selectedFacility) {
                            handleInputChange6(
                              index,
                              "facilityId",
                              selectedFacility._id,
                            );
                            handleInputChange6(
                              index,
                              "facilityAddress",
                              selectedFacility.address ||
                                selectedFacility.location ||
                                "",
                            );
                          } else {
                            handleInputChange6(index, "facilityId", "");
                            handleInputChange6(index, "facilityAddress", "");
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
                      <Form.Control
                        type="text"
                        size="sm"
                        value={row.facilityAddress}
                        onChange={(e) =>
                          handleInputChange6(
                            index,
                            "facilityAddress",
                            e.target.value,
                          )
                        }
                        placeholder="Facility Address"
                      />
                    </td>
                    <td>
                      <DatePicker
                        selected={formatDateToMMDDYYYY(
                          row.dateOfDataCollection,
                        )}
                        onChange={(selectedDate) =>
                          handleInputChange6(
                            index,
                            "dateOfDataCollection",
                            selectedDate?.toDateString(),
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              row.dateOfDataCollection
                                ? formatDateToMMDDYYYY(row.dateOfDataCollection)
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        size="sm"
                        required
                        value={row.typeOfDataCollection}
                        onChange={(e) =>
                          handleInputChange6(
                            index,
                            "typeOfDataCollection",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        size="sm"
                        value={row.issuesNoted}
                        required
                        onChange={(e) =>
                          handleInputChange6(
                            index,
                            "issuesNoted",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        size="sm"
                        value={row.dataCollectedBy}
                        onChange={(e) =>
                          handleInputChange6(
                            index,
                            "dataCollectedBy",
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
                      <td className="grid place-items-center">
                        <RiDeleteBin5Fill
                          onClick={() => handleDeleteRow(index)}
                          className="text-red-500 cursor-pointer"
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>

            <Row className="mt-2">
              <Col xs={12}>
                <Button size="sm" variant="primary" onClick={handleAddRow}>
                  Add Row
                </Button>
              </Col>
            </Row>
            <Row className="mt-3">
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

export default InfectousDataCreateUpdate;
