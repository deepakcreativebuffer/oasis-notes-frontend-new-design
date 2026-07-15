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
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { BorderlessInput } from "@/utils/Makers";
import { MultiSelect } from "react-multi-select-component";

import { ROLES } from "@/features/shared/constants";

const DisasterDrillCreateUpdate = ({
  facilitiesList,
  handleSubmit4,
  disasterDrillData,
  setDisasterDrillData,
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
  React.useEffect(() => {
    if (disasterDrillData?.beginTime && disasterDrillData?.endTime) {
      const start = parseTimeStringToDate(disasterDrillData.beginTime);
      const end = parseTimeStringToDate(disasterDrillData.endTime);
      if (start && end) {
        let diff = (end - start) / 60000;
        if (diff < 0) diff += 24 * 60;
        const hours = Math.floor(diff / 60);
        const mins = Math.round(diff % 60);
        let result = "";
        if (hours > 0) result += `${hours} hr${hours > 1 ? "s" : ""} `;
        if (mins > 0) result += `${mins} min${mins > 1 ? "s" : ""}`;
        result = result.trim();
        if (disasterDrillData.totalTime !== result) {
          setDisasterDrillData((prev) => ({ ...prev, totalTime: result }));
        }
      }
    } else if (
      disasterDrillData?.totalTime !== "" &&
      disasterDrillData?.totalTime !== undefined &&
      disasterDrillData?.totalTime !== null
    ) {
      setDisasterDrillData((prev) => ({ ...prev, totalTime: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disasterDrillData?.beginTime, disasterDrillData?.endTime]);

  return (
    <>
      <Modal.Header closeButton onHide={onHide}>
        <h5 className="fw-bold mb-0">Disaster Drill</h5>
      </Modal.Header>
      <Form onSubmit={handleSubmit4}>
        <ModalBody>
          <div>
            <Form.Label className="fw-bold">
              (COMPETED EVERY 3 MONTHS STAFF ONLY on each shift)
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
                        disasterDrillData?.facilityId?._id ||
                        disasterDrillData?.facilityId ||
                        ""
                      }
                      onChange={(e) => {
                        const selectedFacility = facilitiesList?.find(
                          (fac) => fac._id === e.target.value,
                        );
                        if (selectedFacility) {
                          setDisasterDrillData({
                            ...disasterDrillData,
                            facilityId: selectedFacility._id,
                            facilityAddress:
                              selectedFacility.address ||
                              selectedFacility.location ||
                              "",
                          });
                        } else {
                          setDisasterDrillData({
                            ...disasterDrillData,
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
                        setDisasterDrillData({
                          ...disasterDrillData,
                          facilityAddress: e.target.value,
                        })
                      }
                      value={disasterDrillData?.facilityAddress}
                      type="text"
                      placeholder="Enter Facility Address"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={6}>
                  <Form.Group
                    className="mb-3 
   d-flex flex-column"
                  >
                    <Form.Label className="fw-bold">Date:</Form.Label>

                    <DatePicker
                      selected={formatDateToMMDDYYYY(disasterDrillData?.date)}
                      onChange={(selectedDate) =>
                        setDisasterDrillData({
                          ...disasterDrillData,
                          date: selectedDate?.toDateString(),
                        })
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            disasterDrillData?.date
                              ? formatDateToMMDDYYYY(disasterDrillData?.date)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card>

            <Form.Label className="fw-bold">
              Disasters covered in the drill :{" "}
            </Form.Label>
            <Card body className="mb-3">
              <div className="radio-inline">
                <Form.Check
                  inline
                  type="checkbox"
                  label="Tornado"
                  id="Tornado"
                  checked={disasterDrillData.tornado}
                  onChange={(e) =>
                    setDisasterDrillData({
                      ...disasterDrillData,
                      tornado: e.target.checked,
                    })
                  }
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="Structure Damage"
                  id="Structure Damage"
                  checked={disasterDrillData.structureDamage}
                  onChange={(e) =>
                    setDisasterDrillData({
                      ...disasterDrillData,
                      structureDamage: e.target.checked,
                    })
                  }
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="Storm"
                  id="Storm"
                  checked={disasterDrillData.storm}
                  onChange={(e) =>
                    setDisasterDrillData({
                      ...disasterDrillData,
                      storm: e.target.checked,
                    })
                  }
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="Fire"
                  id="Fire"
                  checked={disasterDrillData.fire}
                  onChange={(e) =>
                    setDisasterDrillData({
                      ...disasterDrillData,
                      fire: e.target.checked,
                    })
                  }
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="Earthquake"
                  id="Earthquake"
                  checked={disasterDrillData.earthQuake}
                  onChange={(e) =>
                    setDisasterDrillData({
                      ...disasterDrillData,
                      earthQuake: e.target.checked,
                    })
                  }
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="Bomb Threat"
                  id="Bomb Threat"
                  checked={disasterDrillData.bombThreat}
                  onChange={(e) =>
                    setDisasterDrillData({
                      ...disasterDrillData,
                      bombThreat: e.target.checked,
                    })
                  }
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="Terrorist Act"
                  id="Terrorist Act"
                  checked={disasterDrillData.terroristAct}
                  onChange={(e) =>
                    setDisasterDrillData({
                      ...disasterDrillData,
                      terroristAct: e.target.checked,
                    })
                  }
                />
                <Form.Check
                  inline
                  type="checkbox"
                  label="Other"
                  id="OtherDisaster"
                  checked={disasterDrillData.other}
                  onChange={(e) =>
                    setDisasterDrillData({
                      ...disasterDrillData,
                      other: e.target.checked,
                    })
                  }
                />
                {disasterDrillData?.other && (
                  <BorderlessInput
                    required
                    onChange={(e) =>
                      setDisasterDrillData({
                        ...disasterDrillData,
                        otherDetailsData: e.target.value,
                      })
                    }
                    value={disasterDrillData?.otherDetailsData}
                    type="text"
                  />
                )}
              </div>
            </Card>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} lg={3} xl={2}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="w-full font-bold">
                      Begin Time:
                    </Form.Label>

                    <CustomTimePicker
                      use24Hours={hoursFormat === "HH:mm"}
                      value={
                        disasterDrillData?.beginTime
                          ? parseTimeStringToDate(disasterDrillData?.beginTime)
                          : null
                      }
                      onChange={(e, timeString) => {
                        setDisasterDrillData({
                          ...disasterDrillData,
                          beginTime: timeString,
                        });
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={3} xl={2}>
                  <Form.Group className="mb-3  d-flex flex-column">
                    <Form.Label className="w-full font-bold">
                      End Time:
                    </Form.Label>

                    <CustomTimePicker
                      use24Hours={hoursFormat === "HH:mm"}
                      value={
                        disasterDrillData?.endTime
                          ? parseTimeStringToDate(disasterDrillData?.endTime)
                          : null
                      }
                      onChange={(e, timeString) => {
                        setDisasterDrillData({
                          ...disasterDrillData,
                          endTime: timeString,
                        });
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={2} xl={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Total Time:
                    </Form.Label>
                    <Form.Control
                      required
                      onChange={(e) =>
                        setDisasterDrillData({
                          ...disasterDrillData,
                          totalTime: e.target.value,
                        })
                      }
                      value={disasterDrillData?.totalTime}
                      type="text"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={2} xl={2}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="w-full font-bold">
                      Shift From:
                    </Form.Label>

                    <CustomTimePicker
                      use24Hours={hoursFormat === "HH:mm"}
                      value={
                        disasterDrillData?.shiftFrom
                          ? parseTimeStringToDate(disasterDrillData?.shiftFrom)
                          : null
                      }
                      onChange={(e, timeString) => {
                        setDisasterDrillData({
                          ...disasterDrillData,
                          shiftFrom: timeString,
                        });
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={2} xl={2}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="w-full font-bold">
                      Shift To:
                    </Form.Label>

                    <CustomTimePicker
                      use24Hours={hoursFormat === "HH:mm"}
                      value={
                        disasterDrillData?.shiftTo
                          ? parseTimeStringToDate(disasterDrillData?.shiftTo)
                          : null
                      }
                      onChange={(e, timeString) => {
                        setDisasterDrillData({
                          ...disasterDrillData,
                          shiftTo: timeString,
                        });
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Staff Present:
                    </Form.Label>

                    <MultiSelect
                      options={employeeOptions}
                      onChange={(selectedOptions) => {
                        const selectedValues = Array.isArray(selectedOptions)
                          ? selectedOptions.map((option) => option.value)
                          : [];

                        setDisasterDrillData((prevFireDrill) => ({
                          ...prevFireDrill,
                          staffPresent: selectedValues,
                        }));
                      }}
                      value={employeeOptions.filter((option) =>
                        disasterDrillData?.staffPresent.includes(option.value),
                      )}
                      overrideStrings={{
                        selectSomeItems: "Select...",
                        allItemsAreSelected: employeeOptions
                          .filter((option) =>
                            disasterDrillData?.staffPresent.includes(
                              option.value,
                            ),
                          )
                          .map((item) => item.label)
                          .join(", "),
                      }}
                      placeholder="Select"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Did you contact Manager or Coordinator?
                    </Form.Label>
                    <Form.Select
                      onChange={(e) =>
                        setDisasterDrillData({
                          ...disasterDrillData,
                          contactManagerCoordinator: e.target.value,
                        })
                      }
                      value={disasterDrillData?.contactManagerCoordinator}
                    >
                      <option value={null}>Select</option>
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Any Injuries?
                    </Form.Label>
                    <Form.Select
                      onChange={(e) =>
                        setDisasterDrillData({
                          ...disasterDrillData,
                          anyInjuries: e.target.value,
                        })
                      }
                      value={disasterDrillData?.anyInjuries}
                    >
                      <option value={null}>Select</option>
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      was 911 Called?
                    </Form.Label>
                    <Form.Select
                      onChange={(e) =>
                        setDisasterDrillData({
                          ...disasterDrillData,
                          was911Called: e.target.value,
                        })
                      }
                      value={disasterDrillData?.was911Called}
                    >
                      <option value={null}>Select</option>
                      <option value={"Yes"}>Yes</option>
                      <option value={"No"}>No</option>
                      <option value={"simulation"}>simulation </option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Was fire extinguisher taken to scene?
                    </Form.Label>
                    <Form.Select
                      required
                      onChange={(e) =>
                        setDisasterDrillData({
                          ...disasterDrillData,
                          extinguisherTaken: e.target.value,
                        })
                      }
                      value={disasterDrillData?.extinguisherTaken}
                    >
                      <option value={null}>Select</option>
                      <option value={"Yes"}>Yes</option>
                      <option value={"No"}>No</option>
                      <option value={"N/A"}>N/A</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Did you have to relocated the residents? if so where
                </Form.Label>
                <Form.Control
                  type="text"
                  required
                  onChange={(e) =>
                    setDisasterDrillData({
                      ...disasterDrillData,
                      relocatedTheResidentsData: e.target.value,
                    })
                  }
                  value={disasterDrillData?.relocatedTheResidentsData}
                  placeholder="Type Here..."
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">& how:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  onChange={(e) =>
                    setDisasterDrillData({
                      ...disasterDrillData,
                      relocatedTheResidents: e.target.value,
                    })
                  }
                  value={disasterDrillData?.relocatedTheResidents}
                  placeholder="Type Here..."
                />
              </Form.Group>
              <Row>
                <Col xs={12} md={6} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Did you take resident’s Medication?
                    </Form.Label>
                    <Form.Select
                      required
                      onChange={(e) =>
                        setDisasterDrillData({
                          ...disasterDrillData,
                          residentMedication: e.target.value,
                        })
                      }
                      value={disasterDrillData?.residentMedication}
                    >
                      <option value={null}>Select</option>
                      <option value={"Yes"}>Yes</option>
                      <option value={"No"}>No</option>
                      <option value={"N/A"}>N/A</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Was Water / Food Accessible?
                    </Form.Label>
                    <Form.Select
                      required
                      onChange={(e) =>
                        setDisasterDrillData({
                          ...disasterDrillData,
                          waterFoodAccessible: e.target.value,
                        })
                      }
                      value={disasterDrillData?.waterFoodAccessible}
                    >
                      <option value={null}>Select</option>
                      <option value={"Yes"}>Yes</option>
                      <option value={"No"}>No</option>
                      <option value={"N/A"}>N/A</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Are all resident’s accounted for?
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  onChange={(e) =>
                    setDisasterDrillData({
                      ...disasterDrillData,
                      residentsAccounted: e.target.value,
                    })
                  }
                  value={disasterDrillData?.residentsAccounted}
                  placeholder="Type Here"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Overall, what steps did you take to handle the disaster?
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  onChange={(e) =>
                    setDisasterDrillData({
                      ...disasterDrillData,
                      handleTheDisaster: e.target.value,
                    })
                  }
                  value={disasterDrillData?.handleTheDisaster}
                  placeholder="Type Here"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="w-full font-bold">
                  Comments / Concerns:
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  onChange={(e) =>
                    setDisasterDrillData({
                      ...disasterDrillData,
                      commentsConcerns: e.target.value,
                    })
                  }
                  value={disasterDrillData?.commentsConcerns}
                  placeholder="Type Here"
                />
              </Form.Group>
            </Card>
            <Form.Label className="w-full font-bold">
              Person Conducting the Disaster Drill:{" "}
            </Form.Label>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} md={12} lg={4}>
                  <Form.Group>
                    <Form.Label className="w-full font-bold">Name:</Form.Label>
                    <Form.Control
                      required
                      onChange={(e) =>
                        setDisasterDrillData({
                          ...disasterDrillData,
                          conducatingName: e.target.value,
                        })
                      }
                      type="text"
                      value={disasterDrillData?.conducatingName}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={12} lg={4}>
                  <Form.Group>
                    <Form.Label className="w-full font-bold">Title:</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      onChange={(e) =>
                        setDisasterDrillData({
                          ...disasterDrillData,
                          title: e.target.value,
                        })
                      }
                      value={disasterDrillData?.title}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={12} lg={4}>
                  <Form.Group className="d-flex flex-column">
                    <Form.Label className="w-full font-bold">Date:</Form.Label>

                    <DatePicker
                      selected={formatDateToMMDDYYYY(
                        disasterDrillData?.conducatingDate,
                      )}
                      onChange={(selectedDate) =>
                        setDisasterDrillData({
                          ...disasterDrillData,
                          conducatingDate: selectedDate?.toDateString(),
                        })
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            disasterDrillData?.conducatingDate
                              ? formatDateToMMDDYYYY(
                                  disasterDrillData?.conducatingDate,
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

export default DisasterDrillCreateUpdate;
