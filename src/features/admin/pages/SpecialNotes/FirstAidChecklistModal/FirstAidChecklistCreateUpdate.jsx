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
import { Link } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import DatePicker from "react-datepicker";

import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";

const FirstAidChecklistCreateUpdate = ({
  facilitiesList,
  submitHandler,
  formState,
  setFormState,
  months3,
  vanEmergency,
  handleQuantityChangeSub,
  handleDateChanger,
  handleQuantityChangeAdd,
  month2,
  handleMonthChange,
  checklistData,
  setChecklistData,
  handleCountChangexyz,
  handleMonthChangexyz,
  addRow,
  deleteRow,
  handleStaffChange,
  currentUser,
  signHandler,
  employeeSignature,
  employeeSignatureDate,
  employeeSignatureTime,
  hoursFormat,
  adminSignature,
  adminDateSigned,
  adminSignedTime,
  removeaddStaff,
  addStaff,
  signers,
  editStatus,
  setSigners,
  isSubmitEnabled,
  onHide,
  count1,
  count2,
  count3,
  count4,
  count5,
  count6,
  count7,
  count8,
  count9,
  count10,
}) => {
  return (
    <>
      <Modal.Header closeButton onHide={onHide}>
        <h5 className="fw-bold mb-0">First Aid Checklist</h5>
      </Modal.Header>{" "}
      <Form onSubmit={submitHandler}>
        <ModalBody>
          <div>
            <Card body className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Select Facility:</Form.Label>
                <Form.Select
                  value={
                    formState?.facilityId?._id || formState?.facilityId || ""
                  }
                  onChange={(e) => {
                    const selectedFacility = facilitiesList?.find(
                      (fac) => fac._id === e.target.value,
                    );
                    if (selectedFacility) {
                      setFormState({
                        ...formState,
                        facilityId: selectedFacility._id,
                        location:
                          selectedFacility.address ||
                          selectedFacility.location ||
                          "",
                      });
                    } else {
                      setFormState({
                        ...formState,
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
                    setFormState({
                      ...formState,
                      location: e.target.value,
                    })
                  }
                  value={formState?.location}
                  type="text"
                  placeholder="Enter Facility Address"
                />
              </Form.Group>
            </Card>
            <Form.Label className="fw-bold">
              Each First Aid Kit Should be Checked Monthly :
            </Form.Label>

            <Table responsive bordered>
              <thead>
                <tr>
                  <th>Items Name</th>
                  <th>Quantity</th>

                  {months3.map((month, index) => (
                    <th key={index}>
                      <DatePicker
                        selected={formatDateToMMDDYYYY(
                          formState[`${month}Date`] ||
                            vanEmergency[`${month}Date`],
                        )}
                        name={`${month}Date`}
                        size="sm"
                        onChange={(selectedDate) =>
                          handleDateChanger(month, selectedDate?.toDateString())
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control form-control-sm"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              formState[`${month}Date`] ||
                              vanEmergency[`${month}Date`]
                                ? formatDateToMMDDYYYY(
                                    formState[`${month}Date`] ||
                                      vanEmergency[`${month}Date`],
                                  )
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Adhesive Strip Bandages</td>

                  <td>
                    <div className="d-flex gap-2 align-items-center">
                      <Button
                        size="sm"
                        onClick={(e) =>
                          handleQuantityChangeSub(
                            "AdhesiveStripBandages",
                            e.target.value,
                          )
                        }
                      >
                        -{" "}
                      </Button>{" "}
                      {formState?.AdhesiveStripBandages?.item}{" "}
                      <Button
                        size="sm"
                        onClick={(e) =>
                          handleQuantityChangeAdd(
                            "AdhesiveStripBandages",
                            e.target.value,
                          )
                        }
                        type="button"
                      >
                        +
                      </Button>{" "}
                    </div>
                  </td>

                  {month2.map((month, index) => (
                    <td key={index}>
                      <Form.Select
                        key={index}
                        size="sm"
                        className="text-[#0C5C75] bg-white min-w-[100px]"
                        onChange={(e) =>
                          handleMonthChange(
                            "AdhesiveStripBandages",
                            month,
                            e.target.value,
                            count1,
                          )
                        }
                        value={formState?.AdhesiveStripBandages[`${month}`]}
                      >
                        <option value={""}>Select</option>
                        <option value={"Present"}>P</option>
                        <option value={"Absent"}>A</option>
                      </Form.Select>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Adhesive Tap</td>

                  <td>
                    <div className="d-flex gap-2 align-items-center">
                      <Button
                        onClick={() => handleQuantityChangeSub("AdhesiveTap")}
                        size="sm"
                        type="button"
                      >
                        -{" "}
                      </Button>{" "}
                      {formState?.AdhesiveTap?.item}{" "}
                      <Button
                        onClick={() => handleQuantityChangeAdd("AdhesiveTap")}
                        size="sm"
                        type="button"
                      >
                        +
                      </Button>{" "}
                    </div>
                  </td>

                  {month2.map((month, index) => (
                    <td key={index}>
                      <Form.Select
                        key={index}
                        size="sm"
                        className="text-[#0C5C75] bg-white min-w-[100px]"
                        onChange={(e) =>
                          handleMonthChange(
                            "AdhesiveTap",
                            month,
                            e.target.value,
                            count2,
                          )
                        }
                        value={formState?.AdhesiveTap[`${month}`]}
                      >
                        <option value={""}>Select</option>
                        <option value={"Present"}>P</option>
                        <option value={"Absent"}>A</option>
                      </Form.Select>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>CPR Mouth Guard/Shield</td>

                  <td>
                    <div className="d-flex gap-2 align-items-center">
                      <Button
                        onClick={() =>
                          handleQuantityChangeSub("CPRMouthGuardShield")
                        }
                        size="sm"
                        type="button"
                      >
                        -{" "}
                      </Button>{" "}
                      {formState?.CPRMouthGuardShield?.item}{" "}
                      <Button
                        onClick={() =>
                          handleQuantityChangeAdd("CPRMouthGuardShield")
                        }
                        size="sm"
                        type="button"
                      >
                        +
                      </Button>{" "}
                    </div>
                  </td>

                  {month2.map((month, index) => (
                    <td key={index}>
                      <Form.Select
                        key={index}
                        size="sm"
                        className="text-[#0C5C75] bg-white min-w-[100px]"
                        onChange={(e) =>
                          handleMonthChange(
                            "CPRMouthGuardShield",
                            month,
                            e.target.value,
                            count3,
                          )
                        }
                        value={formState?.CPRMouthGuardShield[`${month}`]}
                      >
                        <option value={""}>Select</option>
                        <option value={"Present"}>P</option>
                        <option value={"Absent"}>A</option>
                      </Form.Select>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Disposable Latex Gloves</td>

                  <td>
                    <div className="d-flex gap-2 align-items-center">
                      <Button
                        onClick={() =>
                          handleQuantityChangeSub("DisposableLatexGloves")
                        }
                        size="sm"
                        type="button"
                      >
                        -{" "}
                      </Button>{" "}
                      {formState?.DisposableLatexGloves?.item}{" "}
                      <Button
                        onClick={() =>
                          handleQuantityChangeAdd("DisposableLatexGloves")
                        }
                        size="sm"
                        type="button"
                      >
                        +
                      </Button>{" "}
                    </div>
                  </td>

                  {month2.map((month, index) => (
                    <td key={index}>
                      <Form.Select
                        key={index}
                        size="sm"
                        className="text-[#0C5C75] bg-white min-w-[100px]"
                        onChange={(e) =>
                          handleMonthChange(
                            "DisposableLatexGloves",
                            month,
                            e.target.value,
                            count4,
                          )
                        }
                        value={formState?.DisposableLatexGloves[`${month}`]}
                      >
                        <option value={""}>Select</option>
                        <option value={"Present"}>P</option>
                        <option value={"Absent"}>A</option>
                      </Form.Select>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Non-Stick Sterile Pads</td>

                  <td>
                    <div className="d-flex gap-2 align-items-center">
                      <Button
                        type="button"
                        onClick={() =>
                          handleQuantityChangeSub("NonStickSterilePads")
                        }
                        size="sm"
                      >
                        -{" "}
                      </Button>{" "}
                      {formState?.NonStickSterilePads?.item}{" "}
                      <Button
                        type="button"
                        onClick={() =>
                          handleQuantityChangeAdd("NonStickSterilePads")
                        }
                        size="sm"
                      >
                        +
                      </Button>{" "}
                    </div>
                  </td>

                  {month2.map((month, index) => (
                    <td key={index}>
                      <Form.Select
                        key={index}
                        size="sm"
                        className="text-[#0C5C75] bg-white min-w-[100px]"
                        onChange={(e) =>
                          handleMonthChange(
                            "NonStickSterilePads",
                            month,
                            e.target.value,
                            count5,
                          )
                        }
                        value={formState?.NonStickSterilePads[`${month}`]}
                      >
                        <option value={""}>Select</option>
                        <option value={"Present"}>P</option>
                        <option value={"Absent"}>A</option>
                      </Form.Select>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Roller Gauze</td>

                  <td>
                    <div className="d-flex gap-2 align-items-center">
                      <Button
                        type="button"
                        onClick={() => handleQuantityChangeSub("RollerGauze")}
                        size="sm"
                      >
                        -{" "}
                      </Button>{" "}
                      {formState?.RollerGauze?.item}{" "}
                      <Button
                        type="button"
                        onClick={() => handleQuantityChangeAdd("RollerGauze")}
                        size="sm"
                      >
                        +
                      </Button>{" "}
                    </div>
                  </td>

                  {month2.map((month, index) => (
                    <td key={index}>
                      <Form.Select
                        key={index}
                        size="sm"
                        className="text-[#0C5C75] bg-white min-w-[100px]"
                        onChange={(e) =>
                          handleMonthChange(
                            "RollerGauze",
                            month,
                            e.target.value,
                            count6,
                          )
                        }
                        value={formState?.RollerGauze[`${month}`]}
                      >
                        <option value={""}>Select</option>
                        <option value={"Present"}>P</option>
                        <option value={"Absent"}>A</option>
                      </Form.Select>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Scissors</td>

                  <td>
                    <div className="d-flex gap-2 align-items-center">
                      <Button
                        type="button"
                        onClick={() => handleQuantityChangeSub("Scissors")}
                        size="sm"
                      >
                        -{" "}
                      </Button>{" "}
                      {formState?.Scissors?.item}{" "}
                      <Button
                        type="button"
                        onClick={() => handleQuantityChangeAdd("Scissors")}
                        size="sm"
                      >
                        +
                      </Button>{" "}
                    </div>
                  </td>

                  {month2.map((month, index) => (
                    <td key={index}>
                      <Form.Select
                        key={index}
                        size="sm"
                        className="text-[#0C5C75] bg-white min-w-[100px]"
                        onChange={(e) =>
                          handleMonthChange(
                            "Scissors",
                            month,
                            e.target.value,
                            count7,
                          )
                        }
                        value={formState?.Scissors[`${month}`]}
                      >
                        <option value={""}>Select</option>
                        <option value={"Present"}>P</option>
                        <option value={"Absent"}>A</option>
                      </Form.Select>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Sterile Guaze Squares</td>

                  <td>
                    <div className="d-flex gap-2 align-items-center">
                      <Button
                        onClick={() =>
                          handleQuantityChangeSub("SterileGuazeSquares")
                        }
                        size="sm"
                        type="button"
                      >
                        -{" "}
                      </Button>{" "}
                      {formState?.SterileGuazeSquares?.item}{" "}
                      <Button
                        onClick={() =>
                          handleQuantityChangeAdd("SterileGuazeSquares")
                        }
                        size="sm"
                        type="button"
                      >
                        +
                      </Button>{" "}
                    </div>
                  </td>

                  {month2.map((month, index) => (
                    <td key={index}>
                      <Form.Select
                        key={index}
                        size="sm"
                        className="text-[#0C5C75] bg-white min-w-[100px]"
                        onChange={(e) =>
                          handleMonthChange(
                            "SterileGuazeSquares",
                            month,
                            e.target.value,
                            count8,
                          )
                        }
                        value={formState?.SterileGuazeSquares[`${month}`]}
                      >
                        <option value={""}>Select</option>
                        <option value={"Present"}>P</option>
                        <option value={"Absent"}>A</option>
                      </Form.Select>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Triangular Bandages</td>

                  <td>
                    <div className="d-flex gap-2 align-items-center">
                      <Button
                        type="button"
                        onClick={() =>
                          handleQuantityChangeSub("TriangularBandages")
                        }
                        size="sm"
                      >
                        -{" "}
                      </Button>{" "}
                      {formState?.TriangularBandages?.item}{" "}
                      <Button
                        type="button"
                        onClick={() =>
                          handleQuantityChangeAdd("TriangularBandages")
                        }
                        size="sm"
                      >
                        +
                      </Button>{" "}
                    </div>
                  </td>

                  {month2.map((month, index) => (
                    <td key={index}>
                      <Form.Select
                        key={index}
                        size="sm"
                        className="text-[#0C5C75] bg-white min-w-[100px]"
                        onChange={(e) =>
                          handleMonthChange(
                            "TriangularBandages",
                            month,
                            e.target.value,
                            count9,
                          )
                        }
                        value={formState?.TriangularBandages[`${month}`]}
                      >
                        <option value={""}>Select</option>
                        <option value={"Present"}>P</option>
                        <option value={"Absent"}>A</option>
                      </Form.Select>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Tweezers</td>

                  <td>
                    <div className="d-flex gap-2 align-items-center">
                      <Button
                        type="button"
                        onClick={() => handleQuantityChangeSub("Tweezers")}
                        size="sm"
                      >
                        -{" "}
                      </Button>{" "}
                      {formState?.Tweezers?.item}{" "}
                      <Button
                        type="button"
                        onClick={() => handleQuantityChangeAdd("Tweezers")}
                        size="sm"
                      >
                        +
                      </Button>{" "}
                    </div>
                  </td>

                  {month2.map((month, index) => (
                    <td key={index}>
                      <Form.Select
                        key={index}
                        size="sm"
                        className="text-[#0C5C75] bg-white min-w-[100px]"
                        onChange={(e) =>
                          handleMonthChange(
                            "Tweezers",
                            month,
                            e.target.value,
                            count10,
                          )
                        }
                        value={formState?.Tweezers[`${month}`]}
                      >
                        <option value={""}>Select</option>
                        <option value={"Present"}>P</option>
                        <option value={"Absent"}>A</option>
                      </Form.Select>
                    </td>
                  ))}
                </tr>
                {checklistData.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Control
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const newData = [...checklistData];
                          newData[index].name = e.target.value;
                          setChecklistData(newData);
                        }}
                      ></Form.Control>
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={item.item}
                        onChange={(e) =>
                          handleCountChangexyz(index, e.target.value)
                        }
                      ></Form.Control>
                    </td>
                    {Object.entries(item).map(([month, value], i) => {
                      if (
                        month === "name" ||
                        month === "item" ||
                        month === "_id"
                      )
                        return null;
                      return (
                        <td key={i}>
                          <Form.Select
                            size="sm"
                            className="text-[#0C5C75] bg-white min-w-[100px]"
                            onChange={(e) =>
                              handleMonthChangexyz(index, month, e.target.value)
                            }
                            value={value}
                          >
                            <option value={""}>Select</option>
                            <option value={"Present"}>P</option>
                            <option value={"Absent"}>A</option>
                          </Form.Select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </Table>
            <Row className="mt-2 mb-3">
              <Col xs={12}>
                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    type="button"
                    onClick={addRow}
                  >
                    Add Row
                  </Button>
                  <Button
                    variant="danger"
                    type="button"
                    onClick={deleteRow}
                    size="sm"
                  >
                    Delete Row
                  </Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs="12" sm="6" md="4">
                <Card body className="mb-3">
                  <p className="mb-0 fw-bold text-center text-sm text-teal-600 font-sans">
                    P - Present
                  </p>
                </Card>
              </Col>
              <Col xs="12" sm="6" md="4">
                <Card body className="mb-3">
                  <p className="mb-0 fw-bold text-center text-sm text-red-500 font-sans">
                    A - Absent
                  </p>
                </Card>
              </Col>
            </Row>

            <Form.Label className="fw-bold">Staff Details:</Form.Label>
            <Card body className="mb-3">
              {formState.staff.map((staffItem, index) => (
                <div
                  className="flex justify-between items-center"
                  key={`staffItem${index}`}
                >
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
                              handleStaffChange(
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
                              handleStaffChange(
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
                    currentUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                    (currentUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                      currentUser?.userType === ROLES.EMPLOYEE &&
                      currentUser.userPermissions?.delete
                        ?.split(":")
                        .includes("spn"))) && (
                    <div className="icon-joiner">
                      <Link
                        className="del-btn hidePrint"
                        onClick={() => removeaddStaff(index)}
                      >
                        <AiFillDelete />{" "}
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </Card>
            <Row className="mb-3 text-center">
              <Col xs={12}>
                <Button
                  className="staffbtn px-10 py-2 bg-white font-semibold"
                  onClick={addStaff}
                >
                  <span>
                    <img
                      className="w-[20px] h-[20px] mx-auto font-semibold mb-2"
                      src="/add.png"
                      alt="images-p"
                    />
                  </span>
                  <span className="text-[#1A9FB2] font-semibold">
                    ADD MORE STAFF
                  </span>
                </Button>
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

export default FirstAidChecklistCreateUpdate;
