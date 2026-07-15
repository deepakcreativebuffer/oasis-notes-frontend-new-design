import React from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  ModalBody,
  Row,
  Table,
} from "react-bootstrap";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import DatePicker from "react-datepicker";

import { ROLES } from "@/features/shared/constants";

const MonthlyVehicleInspectionCreateUpdate = ({
  facilitiesList,
  handleSubmit10,
  vehicleInspectionData,
  setVehicleInspectionData,
  vanEmergency,
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
        <h5 className="mb-0 fw-bold">Monthly Vehicle Inspection</h5>
      </Modal.Header>
      <Form onSubmit={handleSubmit10}>
        <ModalBody>
          <div>
            <Form.Label className="fw-bold">
              Vehicle are inspected weekly for issues. Please report any issues
              with the van to the Administrator
            </Form.Label>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} lg={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Select Facility:
                    </Form.Label>
                    <Form.Select
                      value={
                        vehicleInspectionData?.facilityId?._id ||
                        vehicleInspectionData?.facilityId ||
                        ""
                      }
                      onChange={(e) => {
                        const selectedFacility = facilitiesList?.find(
                          (fac) => fac._id === e.target.value,
                        );
                        if (selectedFacility) {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            facilityId: selectedFacility._id,
                            facilityAddress:
                              selectedFacility.address ||
                              selectedFacility.location ||
                              selectedFacility.facilityAddress ||
                              "",
                          });
                        } else {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
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
                        setVehicleInspectionData({
                          ...vehicleInspectionData,
                          facilityAddress: e.target.value,
                        })
                      }
                      value={vehicleInspectionData?.facilityAddress}
                      type="text"
                      placeholder="Enter Facility Address"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Month / Year:
                    </Form.Label>
                    <Row>
                      <Col xs={6} lg={6}>
                        <Form.Control
                          required
                          classname="mb-3"
                          onChange={(e) => {
                            setVehicleInspectionData({
                              ...vehicleInspectionData,
                              month: e.target.value,
                            });
                          }}
                          type="text"
                          placeholder="MM"
                          value={vehicleInspectionData?.month}
                        />
                      </Col>
                      <Col xs={6} lg={6}>
                        <Form.Control
                          classname="mb-3"
                          required
                          onChange={(e) => {
                            setVehicleInspectionData({
                              ...vehicleInspectionData,
                              year: e.target.value,
                            });
                          }}
                          type="text"
                          placeholder="YYYY"
                          value={vehicleInspectionData?.year}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Vehicle:
                    </Form.Label>
                    <Form.Control
                      required
                      onChange={(e) => {
                        setVehicleInspectionData({
                          ...vehicleInspectionData,
                          vehicle: e.target.value,
                        });
                      }}
                      value={vehicleInspectionData?.vehicle}
                      type="text"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="w-full font-bold">
                      Date of Last Service:
                    </Form.Label>

                    <DatePicker
                      selected={formatDateToMMDDYYYY(
                        vehicleInspectionData?.dateOfLastService,
                      )}
                      onChange={(selectedDate) =>
                        setVehicleInspectionData({
                          ...vehicleInspectionData,
                          dateOfLastService: selectedDate?.toDateString(),
                        })
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            vehicleInspectionData?.dateOfLastService
                              ? formatDateToMMDDYYYY(
                                  vehicleInspectionData?.dateOfLastService,
                                )
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="w-full font-bold">
                      Date of Next Service:
                    </Form.Label>

                    <DatePicker
                      selected={formatDateToMMDDYYYY(
                        vehicleInspectionData?.dateOfNextService,
                      )}
                      onChange={(selectedDate) =>
                        setVehicleInspectionData({
                          ...vehicleInspectionData,
                          dateOfNextService: selectedDate?.toDateString(),
                        })
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            vehicleInspectionData?.dateOfNextService
                              ? formatDateToMMDDYYYY(
                                  vehicleInspectionData?.dateOfNextService,
                                )
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card>
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Status</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lights:</td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        className={`border-none text-[${vehicleInspectionData?.itemsLights === "Fail" ? "red" : "green"}]`}
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsLights: e.target.value,
                          });
                        }}
                        value={vehicleInspectionData?.itemsLights || ""}
                      >
                        <option value="" disabled hidden>
                          SELECT
                        </option>
                        <option
                          value={"Pass"}
                          className="text-green-600 font-bold"
                        >
                          Pass
                        </option>
                        <option
                          value={"Fail"}
                          className="text-red-600 font-bold"
                        >
                          Fail
                        </option>
                      </Form.Select>
                    </Form.Group>{" "}
                  </td>
                  <td>
                    <Form.Group>
                      <Form.Control
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsLightsComment: e.target.value,
                          });
                        }}
                        as={"textarea"}
                        rows={3}
                        value={vehicleInspectionData?.itemsLightsComment}
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>Turn Signals</td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        className={`border-none text-[${vehicleInspectionData?.itemsTurnSignals === "Fail" ? "red" : "green"}]`}
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsTurnSignals: e.target.value,
                          });
                        }}
                        value={vehicleInspectionData?.itemsTurnSignals || ""}
                      >
                        <option className="text-black">SELECT</option>
                        <option
                          value={"Pass"}
                          className="text-green-600 font-bold"
                        >
                          Pass
                        </option>
                        <option
                          value={"Fail"}
                          className="text-red-600 font-bold"
                        >
                          Fail
                        </option>
                      </Form.Select>
                    </Form.Group>{" "}
                  </td>
                  <td>
                    <Form.Group>
                      <Form.Control
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsTurnSignalsComment: e.target.value,
                          });
                        }}
                        as={"textarea"}
                        rows={3}
                        value={vehicleInspectionData?.itemsTurnSignalsComment}
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>Horn</td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        className={`border-none text-[${vehicleInspectionData?.itemsHorn === "Fail" ? "red" : "green"}]`}
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsHorn: e.target.value,
                          });
                        }}
                        value={vehicleInspectionData?.itemsHorn || ""}
                      >
                        <option className="text-black">SELECT</option>
                        <option
                          value={"Pass"}
                          className="text-green-600 font-bold"
                        >
                          Pass
                        </option>
                        <option
                          value={"Fail"}
                          className="text-red-600 font-bold"
                        >
                          Fail
                        </option>
                      </Form.Select>
                    </Form.Group>{" "}
                  </td>
                  <td>
                    <Form.Group>
                      <Form.Control
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsHornComment: e.target.value,
                          });
                        }}
                        as="textarea"
                        rows={3}
                        value={vehicleInspectionData?.itemsHornComment}
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>Wipers:</td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        className={`border-none text-[${vehicleInspectionData?.itemsWipers === "Fail" ? "red" : "green"}]`}
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsWipers: e.target.value,
                          });
                        }}
                        value={vehicleInspectionData?.itemsWipers || ""}
                      >
                        <option className="text-black">SELECT</option>
                        <option
                          value={"Pass"}
                          className="text-green-600 font-bold"
                        >
                          Pass
                        </option>
                        <option
                          value={"Fail"}
                          className="text-red-600 font-bold"
                        >
                          Fail
                        </option>
                      </Form.Select>
                    </Form.Group>{" "}
                  </td>
                  <td>
                    <Form.Group>
                      <Form.Control
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsWipersComment: e.target.value,
                          });
                        }}
                        value={vanEmergency?.itemsWipersComment}
                        as="textarea"
                        rows={3}
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>AC:</td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        className={`border-none text-[${vehicleInspectionData?.itemsAC === "Fail" ? "red" : "green"}]`}
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsAC: e.target.value,
                          });
                        }}
                        value={vehicleInspectionData?.itemsAC || ""}
                      >
                        <option className="text-black">SELECT</option>
                        <option
                          value={"Pass"}
                          className="text-green-600 font-bold"
                        >
                          Pass
                        </option>
                        <option
                          value={"Fail"}
                          className="text-red-600 font-bold"
                        >
                          Fail
                        </option>
                      </Form.Select>
                    </Form.Group>{" "}
                  </td>
                  <td>
                    <Form.Group>
                      <Form.Control
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsACComment: e.target.value,
                          });
                        }}
                        as="textarea"
                        rows={3}
                        value={vanEmergency?.itemsACComment}
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>Tires</td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsTires: e.target.value,
                          });
                        }}
                        value={vehicleInspectionData?.itemsTires || ""}
                        className={`border-none text-[${vehicleInspectionData?.itemsTires === "Fail" ? "red" : "green"}]`}
                      >
                        <option className="text-black">SELECT</option>
                        <option
                          value={"Pass"}
                          className="text-green-600 font-bold"
                        >
                          Pass
                        </option>
                        <option
                          value={"Fail"}
                          className="text-red-600 font-bold"
                        >
                          Fail
                        </option>
                      </Form.Select>
                    </Form.Group>{" "}
                  </td>
                  <td>
                    <Form.Group>
                      <Form.Control
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsTiresComment: e.target.value,
                          });
                        }}
                        as="textarea"
                        rows={3}
                        value={vehicleInspectionData?.itemsTiresComment}
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>Steering:</td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        className={`border-none text-[${vehicleInspectionData?.itemsSteering === "Fail" ? "red" : "green"}]`}
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsSteering: e.target.value,
                          });
                        }}
                        value={vehicleInspectionData?.itemsSteering || ""}
                      >
                        <option className="text-black">SELECT</option>
                        <option
                          value={"Pass"}
                          className="text-green-600 font-bold"
                        >
                          Pass
                        </option>
                        <option
                          value={"Fail"}
                          className="text-red-600 font-bold"
                        >
                          Fail
                        </option>
                      </Form.Select>
                    </Form.Group>{" "}
                  </td>
                  <td>
                    <Form.Group>
                      <Form.Control
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsSteeringComment: e.target.value,
                          });
                        }}
                        as="textarea"
                        rows={3}
                        value={vehicleInspectionData?.itemsSteeringComment}
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>Fluid Leaks / Gas Odour:</td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        className={`border-none text-[${vehicleInspectionData?.itemsFluidLeaksGasOdor === "Fail" ? "red" : "green"}]`}
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsFluidLeaksGasOdor: e.target.value,
                          });
                        }}
                        value={
                          vehicleInspectionData?.itemsFluidLeaksGasOdor || ""
                        }
                      >
                        <option className="text-black">SELECT</option>
                        <option
                          value={"Pass"}
                          className="text-green-600 font-bold"
                        >
                          Pass
                        </option>
                        <option
                          value={"Fail"}
                          className="text-red-600 font-bold"
                        >
                          Fail
                        </option>
                      </Form.Select>
                    </Form.Group>{" "}
                  </td>
                  <td>
                    <Form.Group>
                      <Form.Control
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsFluidLeaksGasOdorComment: e.target.value,
                          });
                        }}
                        as="textarea"
                        rows={3}
                        value={
                          vehicleInspectionData?.itemsFluidLeaksGasOdorComment
                        }
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>Body Dents:</td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        className={`border-none text-[${vehicleInspectionData?.itemsBodyDents === "Fail" ? "red" : "green"}]`}
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsBodyDents: e.target.value,
                          });
                        }}
                        value={vehicleInspectionData?.itemsBodyDents || ""}
                      >
                        <option className="text-black">SELECT</option>
                        <option
                          value={"Pass"}
                          className="text-green-600 font-bold"
                        >
                          Pass
                        </option>
                        <option
                          value={"Fail"}
                          className="text-red-600 font-bold"
                        >
                          Fail
                        </option>
                      </Form.Select>
                    </Form.Group>{" "}
                  </td>

                  <td>
                    <Form.Group>
                      <Form.Control
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsBodyDentsComment: e.target.value,
                          });
                        }}
                        value={vehicleInspectionData?.itemsBodyDentsComment}
                        as={"textarea"}
                        rows={3}
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>Mirrors:</td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        className={`border-none text-[${vehicleInspectionData?.itemsMirrors === "Fail" ? "red" : "green"}]`}
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsMirrors: e.target.value,
                          });
                        }}
                        value={vehicleInspectionData?.itemsMirrors || ""}
                      >
                        <option className="text-black">SELECT</option>
                        <option
                          value={"Pass"}
                          className="text-green-600 font-bold"
                        >
                          Pass
                        </option>
                        <option
                          value={"Fail"}
                          className="text-red-600 font-bold"
                        >
                          Fail
                        </option>
                      </Form.Select>
                    </Form.Group>{" "}
                  </td>

                  <td>
                    <Form.Group>
                      <Form.Control
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsMirrorsComment: e.target.value,
                          });
                        }}
                        value={vehicleInspectionData?.itemsMirrorsComment}
                        as={"textarea"}
                        rows={3}
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>External Cleanliness:</td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        className={`border-none text-[${vehicleInspectionData?.itemsExternalCleanliness === "Fail" ? "red" : "green"}]`}
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsExternalCleanliness: e.target.value,
                          });
                        }}
                        value={
                          vehicleInspectionData?.itemsExternalCleanliness || ""
                        }
                      >
                        <option className="text-black">SELECT</option>
                        <option
                          value={"Pass"}
                          className="text-green-600 font-bold"
                        >
                          Pass
                        </option>
                        <option
                          value={"Fail"}
                          className="text-red-600 font-bold"
                        >
                          Fail
                        </option>
                      </Form.Select>
                    </Form.Group>{" "}
                  </td>

                  <td>
                    <Form.Group>
                      <Form.Control
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsExternalCleanlinessComment: e.target.value,
                          });
                        }}
                        value={
                          vehicleInspectionData?.itemsExternalCleanlinessComment
                        }
                        as={"textarea"}
                        rows={3}
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>Interior Cleanliness:</td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        className={`border-none text-[${vehicleInspectionData?.itemsExternalCleanliness === "Fail" ? "red" : "green"}]`}
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsInteriorCleanliness: e.target.value,
                          });
                        }}
                        value={
                          vehicleInspectionData?.itemsInteriorCleanliness || ""
                        }
                      >
                        <option className="text-black">SELECT</option>
                        <option
                          value={"Pass"}
                          className="text-green-600 font-bold"
                        >
                          Pass
                        </option>
                        <option
                          value={"Fail"}
                          className="text-red-600 font-bold"
                        >
                          Fail
                        </option>
                      </Form.Select>
                    </Form.Group>{" "}
                  </td>

                  <td>
                    <Form.Group>
                      <Form.Control
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsInteriorCleanlinessComment: e.target.value,
                          });
                        }}
                        value={
                          vehicleInspectionData?.itemsInteriorCleanlinessComment
                        }
                        as={"textarea"}
                        rows={3}
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>First Aid Kit</td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        className={`border-none text-[${vehicleInspectionData?.itemsFirstAidKit === "Fail" ? "red" : "green"}]`}
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsFirstAidKit: e.target.value,
                          });
                        }}
                        value={vehicleInspectionData?.itemsFirstAidKit || ""}
                      >
                        <option className="text-black">SELECT</option>
                        <option
                          value={"Pass"}
                          className="text-green-600 font-bold"
                        >
                          Pass
                        </option>
                        <option
                          value={"Fail"}
                          className="text-red-600 font-bold"
                        >
                          Fail
                        </option>
                      </Form.Select>
                    </Form.Group>{" "}
                  </td>

                  <td>
                    <Form.Group>
                      <Form.Control
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsFirstAidKitComment: e.target.value,
                          });
                        }}
                        value={vehicleInspectionData?.itemsFirstAidKitComment}
                        as={"textarea"}
                        rows={3}
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>Water:</td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsWater: e.target.value,
                          });
                        }}
                        value={vehicleInspectionData?.itemsWater || ""}
                        className={`border-none text-[${vehicleInspectionData?.itemsWater === "Fail" ? "red" : "green"}]`}
                      >
                        <option className="text-black">SELECT</option>
                        <option
                          value={"Pass"}
                          className="text-green-600 font-bold"
                        >
                          Pass
                        </option>
                        <option
                          value={"Fail"}
                          className="text-red-600 font-bold"
                        >
                          Fail
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </td>

                  <td>
                    <Form.Group>
                      <Form.Control
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsWaterComment: e.target.value,
                          });
                        }}
                        value={vehicleInspectionData?.itemsWaterComment}
                        as={"textarea"}
                        rows={3}
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>Fire Extinguisher :</td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        className={`border-none text-[${vehicleInspectionData?.itemsFireExtinguisher === "Fail" ? "red" : "green"}]`}
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsFireExtinguisher: e.target.value,
                          });
                        }}
                        value={
                          vehicleInspectionData?.itemsFireExtinguisher || ""
                        }
                      >
                        <option className="text-black">SELECT</option>
                        <option
                          value={"Pass"}
                          className="text-green-600 font-bold"
                        >
                          Pass
                        </option>
                        <option
                          value={"Fail"}
                          className="text-red-600 font-bold"
                        >
                          Fail
                        </option>
                      </Form.Select>
                    </Form.Group>{" "}
                  </td>

                  <td>
                    <Form.Group>
                      <Form.Control
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsFireExtinguisherComment: e.target.value,
                          });
                        }}
                        value={
                          vehicleInspectionData?.itemsFireExtinguisherComment
                        }
                        as={"textarea"}
                        rows={3}
                      />
                    </Form.Group>
                  </td>
                </tr>
                <tr>
                  <td>Brakes</td>
                  <td>
                    <Form.Group>
                      <Form.Select
                        className={`border-none text-[${vehicleInspectionData?.itemsBrakes === "Fail" ? "red" : "green"}]`}
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsBrakes: e.target.value,
                          });
                        }}
                        value={vehicleInspectionData?.itemsBrakes || ""}
                      >
                        <option className="text-black">SELECT</option>
                        <option
                          value={"Pass"}
                          className="text-green-600 font-bold"
                        >
                          Pass
                        </option>
                        <option
                          value={"Fail"}
                          className="text-red-600 font-bold"
                        >
                          Fail
                        </option>
                      </Form.Select>
                    </Form.Group>{" "}
                  </td>

                  <td>
                    <Form.Group>
                      <Form.Control
                        onChange={(e) => {
                          setVehicleInspectionData({
                            ...vehicleInspectionData,
                            itemsBrakesComment: e.target.value,
                          });
                        }}
                        value={vehicleInspectionData?.itemsBrakesComment || ""}
                        as={"textarea"}
                        rows={3}
                      />
                    </Form.Group>
                  </td>
                </tr>
              </tbody>
            </Table>
            <Row>
              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Comments:</Form.Label>
                  <Form.Control
                    as={"textarea"}
                    rows={3}
                    onChange={(e) => {
                      setVehicleInspectionData({
                        ...vehicleInspectionData,
                        comments: e.target.value,
                      });
                    }}
                    value={vehicleInspectionData?.comments}
                    placeholder="Type Here..."
                  />
                </Form.Group>
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
            <Row className="mt-3">
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

export default MonthlyVehicleInspectionCreateUpdate;
