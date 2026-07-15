import React from "react";
import { Button, Col, Form, Modal, ModalBody, Row } from "react-bootstrap";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { signatureFormat } from "@/utils/utils";

import { ROLES } from "@/features/shared/constants";

const WeeklyVehicleInspectionCreateUpdate = ({
  facilitiesList,
  handleSubmit5,
  weeklyVehicle,
  setWeeklyVehicle,
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
        <h5 className="mb-0 fw-bold">Weekly Vehicle Inspection</h5>
      </Modal.Header>
      <Form onSubmit={handleSubmit5}>
        <ModalBody>
          <Row>
            <Col>
              <p className="font-bold text-base">
                Weekly Vehicle Inspection Checklist :
              </p>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Select Facility:</Form.Label>
                <Form.Select
                  value={
                    weeklyVehicle?.facilityId?._id ||
                    weeklyVehicle?.facilityId ||
                    ""
                  }
                  onChange={(e) => {
                    const selectedFacility = facilitiesList?.find(
                      (fac) => fac._id === e.target.value,
                    );
                    if (selectedFacility) {
                      setWeeklyVehicle({
                        ...weeklyVehicle,
                        facilityId: selectedFacility._id,
                        facilityAddress:
                          selectedFacility.address ||
                          selectedFacility.location ||
                          selectedFacility.facilityAddress ||
                          "",
                      });
                    } else {
                      setWeeklyVehicle({
                        ...weeklyVehicle,
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
                <Form.Label className="fw-bold">Facility Address:</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    setWeeklyVehicle({
                      ...weeklyVehicle,
                      facilityAddress: e.target.value,
                    })
                  }
                  value={weeklyVehicle?.facilityAddress}
                  type="text"
                  placeholder="Enter Facility Address"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="font-bold text-base">Vehicle Details:</p>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6} lg={3}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">Year:</Form.Label>
                <Form.Control
                  required
                  onChange={(e) =>
                    setWeeklyVehicle({
                      ...weeklyVehicle,
                      year: e.target.value,
                    })
                  }
                  value={weeklyVehicle?.year}
                  type="text"
                  placeholder="YYYY"
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">Make:</Form.Label>
                <Form.Control
                  required
                  onChange={(e) =>
                    setWeeklyVehicle({
                      ...weeklyVehicle,
                      make: e.target.value,
                    })
                  }
                  value={weeklyVehicle?.make}
                  type="text"
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">Model:</Form.Label>
                <Form.Control
                  required
                  onChange={(e) =>
                    setWeeklyVehicle({
                      ...weeklyVehicle,
                      model: e.target.value,
                    })
                  }
                  value={weeklyVehicle?.model}
                  type="text"
                  placeholder="Type Here ..."
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Vehicle License Plate:
                </Form.Label>
                <Form.Control
                  required
                  onChange={(e) =>
                    setWeeklyVehicle({
                      ...weeklyVehicle,
                      vehicleLicensePlate: e.target.value,
                    })
                  }
                  value={weeklyVehicle?.vehicleLicensePlate}
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="font-bold text-base">
                Light Satisfactory Comments:
              </p>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">High Beam:</Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      lights: {
                        ...prevState.lights,
                        highBeam: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.lights?.highBeam}
                >
                  <option>Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">Low Beam:</Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      lights: {
                        ...prevState.lights,
                        lowBeam: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.lights?.lowBeam}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Brake Lights:
                </Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      lights: {
                        ...prevState.lights,
                        brakeLights: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.lights?.brakeLights}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Emergency Lights:
                </Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      lights: {
                        ...prevState.lights,
                        emergencyLights: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.lights?.emergencyLights}
                >
                  <option value="">Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  R / L Front Turn Signal:
                </Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      lights: {
                        ...prevState.lights,
                        rightLeftFrontTurnSignal: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.lights?.rightLeftFrontTurnSignal}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  R / L Back Turn Signal:
                </Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      lights: {
                        ...prevState.lights,
                        rightLeftBackTurnSignal: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.lights?.rightLeftBackTurnSignal}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  R / L Taillight:
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      lights: {
                        ...prevState.lights,
                        rightLeftTailLight: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.lights?.rightLeftTailLight}
                >
                  <option>Select</option> <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  R / L Emergency Light:
                </Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      lights: {
                        ...prevState.lights,
                        rightLeftEmergencyLight: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.lights?.rightLeftEmergencyLight}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  R / L Front Day Running:
                </Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      lights: {
                        ...prevState.lights,
                        rightLeftFrontDayRunning: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.lights?.rightLeftFrontDayRunning}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  R / L Back Day Running:
                </Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      lights: {
                        ...prevState.lights,
                        rightLeftBackDayRunning: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.lights?.rightLeftBackDayRunning}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="font-bold text-base">
                Glass Satisfactory Comments :
              </p>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Windshield:
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      glass: {
                        ...prevState.glass,
                        windshield: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.glass?.windshield}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">Rear:</Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      glass: {
                        ...prevState.glass,
                        rear: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.glass?.rear}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  R / L Front:
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      glass: {
                        ...prevState.glass,
                        rightLeftFront: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.glass?.rightLeftFront}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  R / L Middle
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      glass: {
                        ...prevState.glass,
                        rightLeftMiddle: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.glass?.rightLeftMiddle}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  R / L Back:
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      glass: {
                        ...prevState.glass,
                        rightLeftBack: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.glass?.rightLeftBack}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="font-bold text-base">
                Fluids & Lubricants Satisfactory Comments:
              </p>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">Fuel :</Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      fluidsAndLubricants: {
                        ...prevState.fluidsAndLubricants,
                        fuel: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.fluidsAndLubricants?.fuel}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Engine oil:
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      fluidsAndLubricants: {
                        ...prevState.fluidsAndLubricants,
                        engineOil: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.fluidsAndLubricants?.engineOil}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Coolant fluid :
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      fluidsAndLubricants: {
                        ...prevState.fluidsAndLubricants,
                        coolantFluid: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.fluidsAndLubricants?.coolantFluid}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Power steering fluid :
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      fluidsAndLubricants: {
                        ...prevState.fluidsAndLubricants,
                        powerSteeringFluid: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.fluidsAndLubricants?.powerSteeringFluid}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Brake fluid :
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      fluidsAndLubricants: {
                        ...prevState.fluidsAndLubricants,
                        brakeFluid: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.fluidsAndLubricants?.brakeFluid}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Clutch oil:
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      fluidsAndLubricants: {
                        ...prevState.fluidsAndLubricants,
                        clutchOil: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.fluidsAndLubricants?.clutchOil}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Battery fluid:
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      fluidsAndLubricants: {
                        ...prevState.fluidsAndLubricants,
                        batteryFluid: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.fluidsAndLubricants?.batteryFluid}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Windshield washer fluid:
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      fluidsAndLubricants: {
                        ...prevState.fluidsAndLubricants,
                        windshieldWasherFluid: e.target.value,
                      },
                    }))
                  }
                  value={
                    weeklyVehicle?.fluidsAndLubricants?.windshieldWasherFluid
                  }
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">Water:</Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      fluidsAndLubricants: {
                        ...prevState.fluidsAndLubricants,
                        water: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.fluidsAndLubricants?.water}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <p className="font-bold text-base">
                Tires Satisfactory Comments:
              </p>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">Spare:</Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      tires: {
                        ...prevState.tires,
                        spare: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.tires?.spare}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  R / L Front:
                </Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      tires: {
                        ...prevState.tires,
                        rightLeftFront: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.tires?.rightLeftFront}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  R / L Back:
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      tires: {
                        ...prevState.tires,
                        rightLeftBack: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.tires?.rightLeftBack}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Jack & Wrench:
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      tires: {
                        ...prevState.tires,
                        jackAndWrench: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.tires?.jackAndWrench}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <p className="font-bold text-base">
                Mirrors Satisfactory Comments
              </p>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  R / L Mirror:
                </Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      mirrors: {
                        ...prevState.mirrors,
                        rightLeftMirror: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.mirrors?.rightLeftMirror}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Middle Interior:
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      mirrors: {
                        ...prevState.mirrors,
                        middleInterior: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.mirrors?.middleInterior}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <p className="font-bold text-base">
                Emergency Equipment Satisfactory Comments:
              </p>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  First Aid Kit
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      emergencyEquipment: {
                        ...prevState.emergencyEquipment,
                        firstAidKit: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.emergencyEquipment?.firstAidKit}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">Gloves:</Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      emergencyEquipment: {
                        ...prevState.emergencyEquipment,
                        gloves: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.emergencyEquipment?.gloves}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">Blanket</Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      emergencyEquipment: {
                        ...prevState.emergencyEquipment,
                        redTriangles: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.emergencyEquipment?.redTriangles}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Flashlights:
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      emergencyEquipment: {
                        ...prevState.emergencyEquipment,
                        flashlight: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.emergencyEquipment?.flashlight}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">Water:</Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      emergencyEquipment: {
                        ...prevState.emergencyEquipment,
                        water: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.emergencyEquipment?.water}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <p className="font-bold text-base">
                General Satisfactory Comments:
              </p>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Wiper Blades / Motor:
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      general: {
                        ...prevState.general,
                        wiperBladesMotor: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.general?.wiperBladesMotor}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">Horn</Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      general: {
                        ...prevState.general,
                        horn: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.general?.horn}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">Heater:</Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      general: {
                        ...prevState.general,
                        heater: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.general?.heater}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Air Conditioner:
                </Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      general: {
                        ...prevState.general,
                        airConditioner: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.general?.airConditioner}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Seat Belts:
                </Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      general: {
                        ...prevState.general,
                        seatBelts: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.general?.seatBelts}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">Hose:</Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      general: {
                        ...prevState.general,
                        hose: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.general?.hose}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Drive Belt:
                </Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      general: {
                        ...prevState.general,
                        driveBelt: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.general?.driveBelt}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} md={6} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">Battery:</Form.Label>
                <Form.Select
                  required
                  onChange={(e) =>
                    setWeeklyVehicle((prevState) => ({
                      ...prevState,
                      general: {
                        ...prevState.general,
                        battery: e.target.value,
                      },
                    }))
                  }
                  value={weeklyVehicle?.general?.battery}
                >
                  <option>Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Form.Select>
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
          <Row>
            <Col>
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

export default WeeklyVehicleInspectionCreateUpdate;
