import { Button, Row, Col, Form } from "react-bootstrap";
import { resolveAdminAssetPath } from "@/assets";
import Offcanvas from "react-bootstrap/Offcanvas";
import { defaultProfileIcon } from "@/assets/index";
import { getObjectUrlFromDownloadUrl } from "@/features/shared/services";
import DatePicker from "react-datepicker";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import MultiSelectFacility from "@/features/shared/ui/Search/MultiSelectFacility";
import ResidentDetailForm from "../../../components/form/ResidentDetailForm";
import { ROLES } from "@/features/shared/constants";
import {
  EMPLOYEE_ARRAY,
  INTAKE_ARRAY,
  CONTACT_ARRAY,
  DOCUMENT_ARRAY,
  MEDICAL_ARRAY,
  CALENDAR_ARRAY,
  CLINICAL_ARRAY,
  INCIDENT_ARRAY,
  REASSESSMENT_ARRAY,
  EMPLOYEE_TYPE_OPTION,
  PATIENT_TYPE_OPTION,
} from "./contactsConstants";

const ContactOffcanvas = ({
  show,
  handleClose,
  setModalType,
  modalType,
  fileInputRef,
  handleFileChange,
  previewImage,
  contactData,
  handleImageClick,
  changePassModalHandler,
  checkboxValues,
  handleCheckboxChange,
  permissionCategories,
  handleSelectAllToggle,
  handleToggle,
  updateContactDetailsHandler,
  contactForm,
  updateContactForm,
  patientFields,
  updatePatientField,
  facilityList,
  selectedFacility,
  setSelectedFacility,
  updateAssignState,
  setAddContactBtn,
  setModalShow,
}) => {
  return (
    <Offcanvas
      show={show}
      className="custom-offcanvas-height rounded-t-[10px]"
      placement="bottom"
      onHide={() => {
        handleClose();
        setModalType("contact");
      }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className="text-black font-semibold">
          {modalType === "contact" ? "User Details" : "User Permission"}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <hr className="text-gray-500 w-full" />
      <Offcanvas.Body>
        {modalType === "permission" ? (
          <Row>
            <Col md={12}>
              <Row>
                <Col xs={12} md={4} lg={3} xl={2}>
                  <div className="d-flex flex-column align-item-center justify-content-center mb-3 mb-md-4">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    <img
                      src={
                        previewImage?.length > 10
                          ? previewImage
                          : contactData?.profilePic
                            ? getObjectUrlFromDownloadUrl(
                                contactData?.profilePic,
                              )
                            : defaultProfileIcon
                      }
                      className="bg-[#f5f5f5] border border-[#eee] max-w-[125px] max-h-[125px] w-[85px] h-[85px] rounded-full cursor-pointer mx-auto"
                      alt="user"
                      onClick={handleImageClick}
                    />
                  </div>
                  <div className="text-center w-100 mb-3">
                    <Button
                      variant="primary"
                      onClick={() => changePassModalHandler("contact")}
                      className="theme-button"
                    >
                      Show User Details
                    </Button>
                  </div>
                  <div className="text-center w-100 mb-3">
                    <Button
                      variant="primary"
                      onClick={() => changePassModalHandler("password")}
                      className="theme-button"
                    >
                      Change Password
                    </Button>
                  </div>
                </Col>
                <Col xs={12} md={8} lg={9} xl={10}>
                  <Row>
                    {contactData.userType === ROLES.PATIENT ||
                    contactData?.userType === ROLES.GUARDIAN ? (
                      <Col xs={12} md={12}>
                        <>
                          <Row>
                            <Col xs={12} md={12} lg={2}>
                              <Form.Group>
                                <Form.Check
                                  checked={checkboxValues.pia}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "pia")
                                  }
                                  label="Initial Assessment"
                                />

                                <Form.Check
                                  checked={checkboxValues.ptp}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "ptp")
                                  }
                                  label="Behavioral Health Treatment Plan"
                                />

                                <Form.Check
                                  checked={checkboxValues.psp}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "psp")
                                  }
                                  label="Safety Plan"
                                />
                              </Form.Group>
                              <Form.Group>
                                <Form.Check
                                  checked={checkboxValues.pna}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "pna")
                                  }
                                  label="Nursing Assessment"
                                />

                                <Form.Check
                                  checked={checkboxValues.pfs}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "pfs")
                                  }
                                  label="Face Sheet"
                                />

                                <Form.Check
                                  checked={checkboxValues.pri}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "pri")
                                  }
                                  label="Resident's Intake"
                                />
                              </Form.Group>
                              <Form.Group>
                                <Form.Check
                                  checked={checkboxValues.pdischarge}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "pdischarge")
                                  }
                                  label="Discharge"
                                />
                                <Form.Check
                                  checked={checkboxValues.psn}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "psn")
                                  }
                                  label="ART Meetings"
                                />
                                <Form.Check
                                  checked={checkboxValues.pa}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "pa")
                                  }
                                  label="Authorization"
                                />
                                <Form.Check
                                  checked={checkboxValues.pcm}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "pcm")
                                  }
                                  label="Consent Medicaton"
                                />

                                <Form.Check
                                  checked={checkboxValues.pprn}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "pprn")
                                  }
                                  label="PRN"
                                />
                                <Form.Check
                                  checked={checkboxValues.prmt}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "prmt")
                                  }
                                  label="Refusal Medical Treatment"
                                />
                                <Form.Check
                                  checked={checkboxValues.pmars}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "pmars")
                                  }
                                  label="Mars"
                                />
                                <Form.Check
                                  checked={checkboxValues.papp}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "papp")
                                  }
                                  label="TB Risk Assessment"
                                />
                                <Form.Check
                                  checked={checkboxValues.pbhpn}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "pbhpn")
                                  }
                                  label="BHP Progress Notes"
                                />
                                <Form.Check
                                  checked={checkboxValues.pdp}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "pdp")
                                  }
                                  label="Discharge Planning"
                                />
                                <Form.Check
                                  checked={checkboxValues.pasamc}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "pasamc")
                                  }
                                  label="ASAM Criteria Checklist for Assessment"
                                />
                                <Form.Check
                                  checked={checkboxValues.pron}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "pron")
                                  }
                                  label="Re-Certification of Need (RON)"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </>
                      </Col>
                    ) : (
                      <>
                        <Row>
                          <Col xs={12} md={12}>
                            <Row className="mb-3">
                              <Col xs={12} md={12}>
                                <Form.Group className="mb-3">
                                  <div className="d-flex flex-row mt-3 mb-2">
                                    <Form.Check
                                      checked={permissionCategories.incident}
                                      className="font-bolder"
                                      onChange={(e) => {
                                        handleSelectAllToggle(
                                          e,
                                          INCIDENT_ARRAY,
                                        );
                                        handleToggle(
                                          e.target.checked,
                                          "incident",
                                          INCIDENT_ARRAY,
                                          "editIncident",
                                          "deleteIncident",
                                        );
                                      }}
                                      label="Organization"
                                    />
                                    <Form.Check
                                      checked={checkboxValues.editIncident}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "editIncident",
                                          INCIDENT_ARRAY,
                                          "incident",
                                          "Incident",
                                        )
                                      }
                                      className="mx-2"
                                      label="Edit Incident"
                                    />

                                    <Form.Check
                                      checked={checkboxValues.deleteIncident}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "deleteIncident",
                                          INCIDENT_ARRAY,
                                          "incident",
                                          "Incident",
                                        )
                                      }
                                      label="Delete Incident"
                                    />
                                  </div>

                                  <Form.Check
                                    checked={checkboxValues.inr}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "inr",
                                        INCIDENT_ARRAY,
                                        "incident",
                                        "Incident",
                                      )
                                    }
                                    label="Incident Report Form"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={12}>
                                <Form.Group className="mb-3">
                                  <div className="d-flex flex-row mt-3 mb-2">
                                    <Form.Check
                                      checked={
                                        permissionCategories.reassessmentCategory
                                      }
                                      className="font-bolder"
                                      onChange={(e) => {
                                        handleSelectAllToggle(
                                          e,
                                          REASSESSMENT_ARRAY,
                                        );
                                        handleToggle(
                                          e.target.checked,
                                          "reassessmentCategory",
                                          REASSESSMENT_ARRAY,
                                          "editReassessment",
                                          null,
                                        );
                                      }}
                                      label="Re-Assessment"
                                    />
                                    <Form.Check
                                      checked={checkboxValues.editReassessment}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "editReassessment",
                                          REASSESSMENT_ARRAY,
                                          "reassessmentCategory",
                                          "Reassessment",
                                        )
                                      }
                                      className="mx-2"
                                      label="Edit Re-Assessment"
                                    />
                                  </div>

                                  <Form.Check
                                    checked={checkboxValues.reassessment}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "reassessment",
                                        REASSESSMENT_ARRAY,
                                        "reassessmentCategory",
                                        "Reassessment",
                                      )
                                    }
                                    label="Re-Assessment Form"
                                  />
                                </Form.Group>
                              </Col>
                              <Col
                                xs={12}
                                md={12}
                                className="d-flex flex-row mb-2"
                              >
                                <Form.Check
                                  inline
                                  checked={permissionCategories.employeeInfo}
                                  className="font-bolder"
                                  onChange={(e) => {
                                    handleSelectAllToggle(e, EMPLOYEE_ARRAY);
                                    handleToggle(
                                      e.target.checked,
                                      "employeeInfo",
                                      EMPLOYEE_ARRAY,
                                      "editEmployee",
                                      "deleteEmployee",
                                    );
                                  }}
                                  label="Employee Information All Forms"
                                />

                                <Form.Check
                                  inline
                                  checked={checkboxValues.editEmployee}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      e,
                                      "editEmployee",
                                      EMPLOYEE_ARRAY,
                                      "employeeInfo",
                                      "Employee",
                                    )
                                  }
                                  label="Edit Employees"
                                />
                                <Form.Check
                                  inline
                                  checked={checkboxValues.deleteEmployee}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      e,
                                      "deleteEmployee",
                                      EMPLOYEE_ARRAY,
                                      "employeeInfo",
                                      "Employee",
                                    )
                                  }
                                  label="Delete Employees"
                                />
                              </Col>
                              <Col xs={12} md={12} lg={6} xl={4}>
                                <Form.Group>
                                  <Form.Check
                                    checked={checkboxValues.PI}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "PI",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Personal Information"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.offl}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "offl",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Offer Letter"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.app}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "app",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="TB Risk Assessment"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.f23}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "f23",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="2023 Forms"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.lrc1031a}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "lrc1031a",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="lrc-1031a"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.jd}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "jd",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Job Description"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.rc}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "rc",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Reference Check"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.tc}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "tc",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Tubercluosis"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.binf}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "binf",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Employment Application"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={12} lg={6} xl={4}>
                                <Form.Group>
                                  <Form.Check
                                    checked={checkboxValues.fw4}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "fw4",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Fw4"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.aps}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "aps",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Aps Consent"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.fw9}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "fw9",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Fw9"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.i9}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "i9",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="i-9"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.onsfov}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "onsfov",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Onsite And Facility Orientation Verification"
                                  />

                                  <Form.Check
                                    checked={checkboxValues.st}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "st",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Skill And Knowledge Training"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.etracking}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "etracking",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Employee Tracking"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={12} lg={6} xl={4}>
                                <Form.Group>
                                  <Form.Check
                                    checked={checkboxValues.ic}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "ic",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Infection Control"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.asam}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "asam",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Assistance With Self Administration Of Medication"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.fprt}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "fprt",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Fall Prevention And Recovery Training"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.et}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "et",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Employee Termination"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.tr}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "tr",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Time Off Request"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.staffsch}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "staffsch",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Staff Schedule"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.timesheet}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "timesheet",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Time Sheet"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.perf}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "perf",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Employee Performance"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={12} lg={6} xl={12}>
                                <Form.Group>
                                  <div className="d-flex flex-row mt-3 mb-2">
                                    <Form.Check
                                      checked={permissionCategories.intake}
                                      className="font-bolder"
                                      onChange={(e) => {
                                        handleSelectAllToggle(e, INTAKE_ARRAY);
                                        handleToggle(
                                          e.target.checked,
                                          "intake",
                                          INTAKE_ARRAY,
                                          "editIntake",
                                          "deleteIntake",
                                        );
                                      }}
                                      label="Intake"
                                    />
                                    <Form.Check
                                      checked={checkboxValues.editIntake}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "editIntake",
                                          INTAKE_ARRAY,
                                          "intake",
                                          "Intake",
                                        )
                                      }
                                      className="mx-2"
                                      label="Edit Intake"
                                    />
                                    <Form.Check
                                      checked={checkboxValues.deleteIntake}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "deleteIntake",
                                          INTAKE_ARRAY,
                                          "intake",
                                          "Intake",
                                        )
                                      }
                                      label="Delete Intake"
                                    />
                                  </div>
                                  <Form.Check
                                    checked={checkboxValues.iass}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "iass",
                                        INTAKE_ARRAY,
                                        "intake",
                                        "Intake",
                                      )
                                    }
                                    label="Initial Assessment"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.nass}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "nass",
                                        INTAKE_ARRAY,
                                        "intake",
                                        "Intake",
                                      )
                                    }
                                    label="Nurse Assessment"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.tp}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "tp",
                                        INTAKE_ARRAY,
                                        "intake",
                                        "Intake",
                                      )
                                    }
                                    label="Behavioral Health Treatment Plan"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.fs}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "fs",
                                        INTAKE_ARRAY,
                                        "intake",
                                        "Intake",
                                      )
                                    }
                                    label="Face Sheet"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.sp}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "sp",
                                        INTAKE_ARRAY,
                                        "intake",
                                        "Intake",
                                      )
                                    }
                                    label="Safety Plan"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.ri}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "ri",
                                        INTAKE_ARRAY,
                                        "intake",
                                        "Intake",
                                      )
                                    }
                                    label="Resident Intakes"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row className="mb-3">
                              <Col xs={12} md={12}>
                                <Form.Label className="font-bold my-3">
                                  Contact category form
                                </Form.Label>
                              </Col>
                              <Col xs={12} md={12}>
                                <div className="d-flex flex-row mb-2">
                                  <Form.Check
                                    checked={permissionCategories.contact}
                                    className="font-bolder"
                                    onChange={(e) => {
                                      handleSelectAllToggle(e, CONTACT_ARRAY);
                                      handleToggle(
                                        e.target.checked,
                                        "contact",
                                        CONTACT_ARRAY,
                                        "editContact",
                                        "deleteContact",
                                      );
                                    }}
                                    label="Contacts"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.editContact}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "editContact",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    className="mx-2"
                                    label="Edit Contacts"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.deleteContact}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "deleteContact",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Delete Contacts"
                                  />
                                </div>
                              </Col>
                              <Col xs={12} md={12} lg={6} xl={4}>
                                <Form.Group>
                                  <Form.Check
                                    checked={checkboxValues.pn}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "pn",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Shift Progress Note"
                                  />

                                  <Form.Check
                                    checked={checkboxValues.discharge}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "discharge",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Discharge"
                                  />

                                  <Form.Check
                                    checked={checkboxValues.sn}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "sn",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="ART Meetings"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.asamc}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "asamc",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="ASAM Criteria Checklist for Assessment"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.dp}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "dp",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Discharge Planning"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.ron}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "ron",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Re-Certification of Need (RON)"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.bhpn}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "bhpn",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="BHP Progress Note"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.spn}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "spn",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Special Notes"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.tn}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "tn",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Therapy Progress Note"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={12} lg={6} xl={4}>
                                <Form.Group>
                                  <Form.Check
                                    checked={checkboxValues.aschedule}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "aschedule",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Acitvity Schedule"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.cn}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "cn",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Contact Note"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.ml}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "ml",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Mileage Log"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.ari}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "ari",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Authorization For Release Of Information"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={12} lg={6} xl={4}>
                                <Form.Group>
                                  <Form.Check
                                    checked={checkboxValues.rt}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "rt",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Resident Tracking"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.mppr}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "mppr",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Manage Provider Pay Rates"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.ft}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "ft",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Financial Transaction Record"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.dtf}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "dtf",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Activity Of Daily Life Tracking Form"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={12} lg={12} xl={12}>
                                <Form.Group>
                                  <div className="d-flex flex-row mt-3 mb-2">
                                    <Form.Check
                                      checked={permissionCategories.document}
                                      className="font-bolder"
                                      onChange={(e) => {
                                        handleSelectAllToggle(
                                          e,
                                          DOCUMENT_ARRAY,
                                        );
                                        handleToggle(
                                          e.target.checked,
                                          "document",
                                          DOCUMENT_ARRAY,
                                          "editDocument",
                                          "deleteDocument",
                                        );
                                      }}
                                      label="Receipt and Upload Document"
                                    />
                                  </div>
                                  <Form.Check
                                    checked={checkboxValues.cf}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "cf",
                                        DOCUMENT_ARRAY,
                                        "document",
                                        "Document",
                                      )
                                    }
                                    label="Create File"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.df}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "df",
                                        DOCUMENT_ARRAY,
                                        "document",
                                        "Document",
                                      )
                                    }
                                    label="Delete File"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.uf}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "uf",
                                        DOCUMENT_ARRAY,
                                        "document",
                                        "Document",
                                      )
                                    }
                                    label="Upload File"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} md={12}>
                            <Row>
                              <Col xs={12} md={12} lg={6} xl={6}>
                                <Form.Group className="mb-2">
                                  <div className="d-flex flex-row mb-2">
                                    <Form.Check
                                      checked={permissionCategories.medical}
                                      className="font-bolder"
                                      onChange={(e) => {
                                        handleSelectAllToggle(e, MEDICAL_ARRAY);
                                        handleToggle(
                                          e.target.checked,
                                          "medical",
                                          MEDICAL_ARRAY,
                                          "editMedical",
                                          "deleteMedical",
                                        );
                                      }}
                                      label="Medical"
                                    />
                                    <Form.Check
                                      checked={checkboxValues.editMedical}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "editMedical",
                                          MEDICAL_ARRAY,
                                          "medical",
                                          "Medical",
                                        )
                                      }
                                      className="mx-2"
                                      label="Edit Medical"
                                    />
                                    <Form.Check
                                      checked={checkboxValues.deleteMedical}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "deleteMedical",
                                          MEDICAL_ARRAY,
                                          "medical",
                                          "Medical",
                                        )
                                      }
                                      label="Delete Medical"
                                    />
                                  </div>
                                  <Form.Check
                                    checked={checkboxValues.rv}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "rv",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="Resident Vitals"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.em}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "em",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="Resident Medication"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.mars}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "mars",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="Mars"
                                  />
                                </Form.Group>
                                <Form.Group>
                                  <Form.Check
                                    checked={checkboxValues.mr}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "mr",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="Medication Reconcillation"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.mc}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "mc",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="Medication Count"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.ms}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "ms",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="Mental Status"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.rmt}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "rmt",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="Refusal of Medical Treatment"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.icm}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "icm",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="Informed Consent For Medications"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.prn}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "prn",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="prn "
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={12} lg={6} xl={6}>
                                <>
                                  <Form.Group className="mb-2">
                                    <div className="d-flex flex-row mb-2">
                                      <Form.Check
                                        checked={permissionCategories.calendar}
                                        className="font-bolder"
                                        onChange={(e) => {
                                          handleSelectAllToggle(
                                            e,
                                            CALENDAR_ARRAY,
                                          );
                                          handleToggle(
                                            e.target.checked,
                                            "calendar",
                                            CALENDAR_ARRAY,
                                            "editCalendar",
                                            "deleteCalendar",
                                          );
                                        }}
                                        label="Calendar/Task"
                                      />
                                      <Form.Check
                                        checked={checkboxValues.editCalendar}
                                        onChange={(e) =>
                                          handleCheckboxChange(
                                            e,
                                            "editCalendar",
                                            CALENDAR_ARRAY,
                                            "calendar",
                                            "Calendar",
                                          )
                                        }
                                        className="mx-2"
                                        label="Edit Calendar"
                                      />
                                      <Form.Check
                                        checked={checkboxValues.deleteCalendar}
                                        onChange={(e) =>
                                          handleCheckboxChange(
                                            e,
                                            "deleteCalendar",
                                            CALENDAR_ARRAY,
                                            "calendar",
                                            "Calendar",
                                          )
                                        }
                                        label="Delete Calendar"
                                      />
                                    </div>
                                    <Form.Check
                                      checked={checkboxValues.ba}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "ba",
                                          CALENDAR_ARRAY,
                                          "calendar",
                                          "Calendar",
                                        )
                                      }
                                      label="Book Appointments"
                                    />
                                    <Form.Check
                                      checked={checkboxValues.va}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "va",
                                          CALENDAR_ARRAY,
                                          "calendar",
                                          "Calendar",
                                        )
                                      }
                                      label="Appointment Tracking log"
                                    />
                                    <Form.Check
                                      checked={checkboxValues.ma}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "ma",
                                          CALENDAR_ARRAY,
                                          "calendar",
                                          "Calendar",
                                        )
                                      }
                                      label="Manage Appointment"
                                    />
                                    <Form.Check
                                      checked={checkboxValues.ahis}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "ahis",
                                          CALENDAR_ARRAY,
                                          "calendar",
                                          "Calendar",
                                        )
                                      }
                                      label="Appointment History"
                                    />
                                  </Form.Group>
                                </>
                              </Col>
                              <Col xs={12} md={12} lg={6} xl={6}>
                                <Col xs={12} md={12}>
                                  <div className="d-flex flex-row mt-3 mb-2">
                                    <Form.Check
                                      checked={permissionCategories.clinical}
                                      className="font-bolder"
                                      onChange={(e) => {
                                        handleSelectAllToggle(
                                          e,
                                          CLINICAL_ARRAY,
                                        );
                                        handleToggle(
                                          e.target.checked,
                                          "clinical",
                                          CLINICAL_ARRAY,
                                          "editClinical",
                                          "deleteClinical",
                                        );
                                      }}
                                      label="Clinical"
                                    />
                                    <Form.Check
                                      checked={checkboxValues.editClinical}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "editClinical",
                                          CLINICAL_ARRAY,
                                          "clinical",
                                          "Clinical",
                                        )
                                      }
                                      className="mx-2"
                                      label="Edit Clinical"
                                    />
                                    <Form.Check
                                      checked={checkboxValues.deleteClinical}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "deleteClinical",
                                          CLINICAL_ARRAY,
                                          "clinical",
                                          "Clinical",
                                        )
                                      }
                                      label="Delete Clinical"
                                    />
                                  </div>

                                  <Form.Group>
                                    <Form.Check
                                      checked={checkboxValues.co}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "co",
                                          CLINICAL_ARRAY,
                                          "clinical",
                                          "Clinical",
                                        )
                                      }
                                      label="Clinical Oversight"
                                    />
                                  </Form.Group>
                                </Col>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </>
                    )}
                    <Row>
                      <Col>
                        <div className="mt-3">
                          <Button
                            className="theme-button"
                            onClick={updateContactDetailsHandler}
                          >
                            Update Permission
                          </Button>
                          {}
                        </div>
                      </Col>
                    </Row>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        ) : (
          <div className="">
            <Form onSubmit={updateContactDetailsHandler}>
              <Row>
                <Col xs={12} md={4} lg={3} xl={2}>
                  <div className="d-flex flex-column justify-content-center align-items-center mb-3">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <img
                      src={
                        previewImage?.length > 10
                          ? previewImage
                          : contactData?.profilePic
                            ? getObjectUrlFromDownloadUrl(
                                contactData?.profilePic,
                              )
                            : defaultProfileIcon
                      }
                      className="bg-[#f5f5f5] border border-[#eee] max-w-[125px] max-h-[125px] w-[85px] h-[85px] rounded-full cursor-pointer mx-auto"
                      alt="user"
                      onClick={handleImageClick}
                    />
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <Button
                      variant="primary"
                      onClick={() => changePassModalHandler("permission")}
                      className="theme-button mb-3"
                    >
                      Permissions
                    </Button>
                  </div>
                </Col>
                <Col xs={12} md={8} lg={9} xl={10}>
                  <Row>
                    <Col xs={12} md={12} lg={6} xl={6}>
                      <Row>
                        <Col xs={12} md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="font-bold">
                              First Name <span className="text-red-600">*</span>
                            </Form.Label>
                            <Form.Control
                              value={contactForm.firstName}
                              required
                              onChange={(e) =>
                                updateContactForm("firstName", e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="font-bold">
                              Last Name <span className="text-red-600">*</span>
                            </Form.Label>
                            <Form.Control
                              value={contactForm.lastName}
                              required
                              onChange={(e) =>
                                updateContactForm("lastName", e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="font-bold">
                              Title {}
                            </Form.Label>
                            <Form.Control
                              value={contactForm.title}
                              onChange={(e) =>
                                updateContactForm("title", e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="font-bold">
                              Email{" "}
                              {contactData?.userType !== ROLES.PATIENT && (
                                <span className="text-red-600">*</span>
                              )}
                            </Form.Label>
                            <Form.Control
                              value={contactForm.email}
                              type="email"
                              required={contactData?.userType !== ROLES.PATIENT}
                              onChange={(e) =>
                                updateContactForm("email", e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="font-bold">
                              Phone{" "}
                            </Form.Label>
                            <Form.Control
                              value={contactForm.phone}
                              onChange={(e) =>
                                updateContactForm(
                                  "phone",
                                  e.target.value?.trim(),
                                )
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="font-bold">
                              {contactData?.userType === ROLES.PATIENT
                                ? "Facility Address"
                                : "Address"}{" "}
                            </Form.Label>
                            <Form.Control
                              value={contactForm.address}
                              onChange={(e) =>
                                updateContactForm("address", e.target.value)
                              }
                            />
                            {}
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Group className="mb-3 d-flex flex-column">
                            <Form.Label className="font-bold">
                              Date of Birth{" "}
                            </Form.Label>
                            <DatePicker
                              selected={formatDateToMMDDYYYY(contactForm.dob)}
                              onChange={(selectedDate) =>
                                updateContactForm(
                                  "dob",
                                  selectedDate?.toDateString(),
                                )
                              }
                              dateFormat="MM/dd/yyyy"
                              placeholderText="MM/DD/YYYY"
                              className="form-control"
                              highlightDates={[
                                {
                                  "react-datepicker__day--highlighted-custom": [
                                    contactForm.dob
                                      ? formatDateToMMDDYYYY(contactForm.dob)
                                      : new Date(),
                                  ],
                                },
                              ]}
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={12} md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="font-bold">
                              User Type{" "}
                            </Form.Label>
                            <Form.Control
                              value={contactForm.typeUser}
                              disabled={true}
                              type="text"
                            />
                          </Form.Group>
                        </Col>
                        {contactData?.userType === ROLES.EMPLOYEE && (
                          <Col xs={12} md={12}>
                            <Form.Label className="fw-bold">
                              Select Facility
                            </Form.Label>
                            <MultiSelectFacility
                              data={facilityList.data}
                              setValue={(val) => {
                                setSelectedFacility(val);
                                if (val && val.length > 0) {
                                  const selectedFac = facilityList?.data?.find(
                                    (f) => f._id === val[0].value,
                                  );
                                  if (selectedFac?.location) {
                                    updateContactForm(
                                      "address",
                                      selectedFac.location,
                                    );
                                  }
                                }
                              }}
                              value={selectedFacility}
                            />
                          </Col>
                        )}
                      </Row>
                      {contactData?.userType === ROLES.PATIENT && (
                        <Row>
                          <Col xs={12} md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold">
                                Gender
                              </Form.Label>
                              <Form.Select
                                value={contactForm.gender}
                                onChange={(e) =>
                                  updateContactForm("gender", e.target.value)
                                }
                              >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Transgender">Transgender</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold">
                                Facility
                              </Form.Label>
                              <Form.Select
                                value={contactForm.facilityId}
                                onChange={(e) => {
                                  updateContactForm(
                                    "facilityId",
                                    e.target.value,
                                  );
                                  const selectedFac = facilityList?.data?.find(
                                    (f) => f._id === e.target.value,
                                  );
                                  if (selectedFac?.location) {
                                    updateContactForm(
                                      "address",
                                      selectedFac.location,
                                    );
                                  }
                                }}
                              >
                                <option value="" disabled>
                                  Select facility
                                </option>
                                {facilityList?.data?.map((facility) => (
                                  <option
                                    key={facility._id}
                                    value={facility._id}
                                  >
                                    {`${facility?.name}`}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>
                      )}
                    </Col>
                    <Col xs={12} md={12} lg={6} xl={6}>
                      <Row>
                        <Col xs={12} md={12}>
                          <div className="">
                            {contactData?.userType === ROLES.PATIENT && (
                              <>
                                <ResidentDetailForm
                                  admitDate={patientFields.admitDate}
                                  setAdmitDate={(v) =>
                                    updatePatientField("admitDate", v)
                                  }
                                  diet={patientFields.diet}
                                  setDiet={(v) => updatePatientField("diet", v)}
                                  fluidRestriction={
                                    patientFields.fluidRestriction
                                  }
                                  setFluidRestriction={(v) =>
                                    updatePatientField("fluidRestriction", v)
                                  }
                                  ahcccsId={contactForm.ahcccsId}
                                  setAhcccsId={(v) =>
                                    updateContactForm("ahcccsId", v)
                                  }
                                  diagnosis={contactForm.diagnosis}
                                  setDiagnosis={(v) =>
                                    updateContactForm("diagnosis", v)
                                  }
                                />
                              </>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} md={12}>
                          <Row>
                            <Col xs={12} md={6} lg={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">
                                  Active & Inactive :
                                </Form.Label>
                                <Form.Check
                                  checked={!contactForm.isActive}
                                  onChange={() =>
                                    updateContactForm(
                                      "isActive",
                                      !contactForm.isActive,
                                    )
                                  }
                                  label="Inactive & force log off"
                                />
                              </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">
                                  Password:
                                </Form.Label>

                                <Form.Check
                                  type="checkbox"
                                  label="Password reset (Link sent to their email)"
                                  checked={contactForm.password}
                                  onChange={(e) =>
                                    updateContactForm(
                                      "password",
                                      e.target.checked,
                                    )
                                  } // Pass true or false
                                />
                              </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={6}>
                              <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">
                                  Account type :
                                </Form.Label>
                                <Form.Select
                                  required
                                  onChange={(e) =>
                                    updateContactForm(
                                      "accountType",
                                      e.target.value,
                                    )
                                  }
                                  value={contactForm.accountType}
                                >
                                  {(contactData.userType === ROLES.PATIENT ||
                                  contactData?.userType === ROLES.GUARDIAN
                                    ? PATIENT_TYPE_OPTION
                                    : EMPLOYEE_TYPE_OPTION
                                  ).map((i) => (
                                    <option
                                      className="text-[#0C5C75]"
                                      value={i.value}
                                      key={i._id}
                                    >
                                      {i.label}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={12} md={12} lg={12} xl={6}>
                      <div className="my-2">
                        <Button className="theme-button" type="submit">
                          Update
                        </Button>
                        {}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
            <Row>
              <Col>
                <hr></hr>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Row>
                    {contactData.userType === ROLES.PATIENT ||
                    contactData?.userType === ROLES.GUARDIAN ? (
                      <Col xs={12} md={12}>
                        <>
                          <Row>
                            <Col xs={12} md={12} lg={6} xl={3}>
                              <Form.Group className="mb-3">
                                <Form.Label className="font-bold">
                                  Last Admitted At
                                </Form.Label>{" "}
                                -
                                <div className="flex items-center gap-[15px]">
                                  <img
                                    className="max-w-[25px] max-h-[25px]"
                                    src={resolveAdminAssetPath(
                                      "/Dashboard/home.png",
                                    )}
                                    alt=""
                                  />

                                  <p className="text-black m-0">Center 1</p>
                                </div>
                              </Form.Group>
                              <Form.Group className="mb-3">
                                {contactData?.userType === ROLES.PATIENT && (
                                  <Button
                                    onClick={() => {
                                      updateAssignState(
                                        "assignPatientId",
                                        contactData._id,
                                      );
                                      setAddContactBtn("assign");
                                      setModalShow(true);
                                    }}
                                    variant="primary"
                                    className="theme-button"
                                  >
                                    ASSIGN EMPLOYEE
                                  </Button>
                                )}
                              </Form.Group>
                              <Form.Group className="mb-3">
                                {contactData?.userType === ROLES.GUARDIAN && (
                                  <Button
                                    onClick={() => {
                                      updateAssignState(
                                        "assignPatientId",
                                        contactData._id,
                                      );
                                      setAddContactBtn("assignResident");
                                      setModalShow(true);
                                    }}
                                    variant="primary"
                                    className="theme-button"
                                  >
                                    ASSIGN RESIDENT
                                  </Button>
                                )}
                              </Form.Group>
                            </Col>
                          </Row>
                        </>
                      </Col>
                    ) : (
                      <Col xs={12} md={12} lg={6} xl={6}></Col>
                    )}
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            {}
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ContactOffcanvas;
