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
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import { signatureFormat } from "@/utils/utils";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { ROLES } from "@/features/shared/constants";

const VanEmergencyCreateUpdate = ({
  facilitiesList,
  submitHandler5,
  emergencyData,
  setEmergencyData,
  dateOfBirth,
  setPatientId,
  setResidentName,
  setPatientDetail,
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
  patientDetail,
  vanEmergency,
}) => {
  const renderAllergiesTable = (arr) => {
    let yes = null;
    let comment = "";
    if (arr && Array.isArray(arr) && arr.length > 0) {
      const allergy = arr[0];
      if (allergy) {
        yes = allergy.yes;
        comment = allergy.comments || "";
      }
    }

    return (
      <Col md={12} className="mb-3">
        <Table responsive="lg" bordered className="mb-0">
          <thead>
            <tr>
              <th>Condition</th>
              <th className="text-center">Yes</th>
              <th className="text-center">No</th>
              <th className="w-50">Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Allergies</td>
              <td className="text-center">
                <Form.Check
                  type="checkbox"
                  checked={yes === true}
                  readOnly
                  disabled
                />
              </td>
              <td className="text-center">
                <Form.Check
                  type="checkbox"
                  checked={yes === false}
                  readOnly
                  disabled
                />
              </td>
              <td>{comment}</td>
            </tr>
          </tbody>
        </Table>
      </Col>
    );
  };

  return (
    <>
      <Modal.Header closeButton onHide={onHide}>
        <h5 className="mb-0 fw-bold">Van Emergency Information</h5>
      </Modal.Header>
      <Form onSubmit={submitHandler5}>
        <ModalBody>
          <Row>
            <Col xs={12} md={6}>
              {emergencyData?.residentName || (
                <PatientComponent
                  className={""}
                  MainPatientId={setPatientId}
                  MainResidentName={setResidentName}
                  setWholeData={setPatientDetail}
                />
              )}
            </Col>

            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Facility Address:</Form.Label>
                <Form.Control
                  disabled={editStatus}
                  onChange={(e) =>
                    setEmergencyData({
                      ...emergencyData,
                      location: e.target.value,
                    })
                  }
                  value={emergencyData?.location}
                  type="text"
                  placeholder="Enter Facility Address"
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="font-bold">
                  {" "}
                  Facility Phone Number:{" "}
                </Form.Label>
                <Form.Control
                  onChange={(e) =>
                    setEmergencyData({
                      ...emergencyData,
                      facilityPhoneNumber: e.target.value,
                    })
                  }
                  type="number"
                  value={emergencyData?.facilityPhoneNumber}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="w-full font-bold">
              {" "}
              Guardian Information:{" "}
            </Form.Label>
            <Form.Control
              onChange={(e) =>
                setEmergencyData({
                  ...emergencyData,
                  guardianInformation: e.target.value,
                })
              }
              as="textarea"
              row={3}
              value={emergencyData?.guardianInformation}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="w-full font-bold">
              {" "}
              BHRF Administrator Information:{" "}
            </Form.Label>
            <Form.Control
              required
              onChange={(e) =>
                setEmergencyData({
                  ...emergencyData,
                  BHRFAdministratorInformation: e.target.value,
                })
              }
              value={emergencyData?.BHRFAdministratorInformation}
              type="text"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="w-full font-bold">
              {" "}
              Case Manager Information:{" "}
            </Form.Label>
            <Form.Control
              required
              onChange={(e) =>
                setEmergencyData({
                  ...emergencyData,
                  caseManagerInformation: e.target.value,
                })
              }
              value={emergencyData?.caseManagerInformation}
              type="text"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="w-full font-bold">
              {" "}
              Pharmacy Information:{" "}
            </Form.Label>
            <Form.Control
              onChange={(e) =>
                setEmergencyData({
                  ...emergencyData,
                  pharamacyHospital: e.target.value,
                })
              }
              value={emergencyData?.pharamacyHospital}
              as="textarea"
              rows={3}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="w-full font-bold">
              {" "}
              Preferred Hospital:{" "}
            </Form.Label>
            <Form.Control
              required
              onChange={(e) =>
                setEmergencyData({
                  ...emergencyData,
                  preferredHospital: e.target.value,
                })
              }
              value={emergencyData?.preferredHospital}
              as="textarea"
              rows={3}
            />
          </Form.Group>
          {renderAllergiesTable(
            patientDetail?.allergies ||
              vanEmergency?.patientId?.allergies ||
              emergencyData?.allergiesTable,
          )}
          <Form.Label className="fw-bold">
            Medication : Facility or Pharmacy will be contacted in case of an
            emergency for updated medication list.
          </Form.Label>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">
              {" "}
              In case of an Emergency, Notify the following Agency Staff
              Member{" "}
            </Form.Label>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="font-bold"> Name: </Form.Label>
            <Form.Control
              required
              onChange={(e) =>
                setEmergencyData({
                  ...emergencyData,
                  staffMemberName: e.target.value,
                })
              }
              value={emergencyData?.staffMemberName}
              type="text"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="font-bold"> Phone Number:</Form.Label>
            <Form.Control
              required
              onChange={(e) =>
                setEmergencyData({
                  ...emergencyData,
                  staffMemberPhoneNumber: e.target.value,
                })
              }
              value={emergencyData?.staffMemberPhoneNumber}
              type="number"
            />
          </Form.Group>
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

export default VanEmergencyCreateUpdate;
