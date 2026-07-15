/** @format */

import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { Container, Card, Form, Row, Col, Button } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import { ClipLoader } from "react-spinners";
import { getData } from "@/features/shared/services";
import { employmentService } from "@/features/shared/services";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
const EditAPS = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [data, setData] = useState({});
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [administratorName, setAdministratorName] = useState("");
  const [administratorSignature, setAdministratorSignature] = useState("");
  const [date, setDate] = useState("");
  const [classification, setClassification] = useState("");
  const [dateOfIncident, setDateOfIncident] = useState("");
  const [noRecordFound, setNoRecordFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employeeDate, setEmployeeDate] = useState("");
  const [employeeTime, setEmployeeTime] = useState("");
  const profileDetail = useSelector(userProfile);
  const [signers, setSigners] = useState([]);
  const [openSigner, setOpenSigner] = useState(false);
  const { id, employeeId } = useParams();
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [saveAsDrafIsNotEditable, setSaveAsDrafIsNotEditable] = useState(false);
  const [
    saveAsDrafIsNotEditableWithoutSigner,
    setSaveAsDrafIsNotEditableWithoutSigner,
  ] = useState(false);
  const [isNotEditableWithSigner, setIsNotEditableWithSigner] = useState(false);
  const options = [
    {
      label: "Yes",
      value: true,
    },
    {
      label: "No",
      value: false,
    },
  ];
  const getProfile = () => {
    getData(
      setData,
      employeeId
        ? `employee/getApsConsentById/${employeeId}`
        : `employee/getApsConsentById/${id}`,
    );
  };
  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const payload = {
    employeeName: profileDetail?.fullName,
    employeeSignature,
    employeeDate,
    employeeTime,
    administratorName,
    administratorSignature,
    date,
    classification,
    dateOfIncident,
    noRecordFound,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    saveAsDraft: saveAsDraft,
    signers,
  };
  const submitHandler = (e) => {
    e.preventDefault();
    employmentService.aps.update(employeeId || id, payload, {
      setLoading,
      navigate,
    });
  };
  useEffect(() => {
    if (data) {
      const item = data?.data;
      setClassification(item?.classification);
      setDate(item?.date);
      setDateOfIncident(item?.dateOfIncident);
      setNoRecordFound(item?.noRecordFound);
      setEmployeeSignature(item?.employeeSignature);
      setEmployeeTime(item?.employeeTime);
      setEmployeeDate(item?.employeeDate);
      setAdministratorName(item?.administratorName);
      setAdministratorSignature(item?.administratorSignature);
      setAdminSignature(item?.adminSignature);
      setAdminDateSigned(item?.adminDateSigned);
      setAdminSignedTime(item?.adminSignedTime);
      setSigners(item?.signers);
    }
  }, [data]);
  const employeeIdFromResponse =
    data?.data?.employeeId?._id || data?.data?.employeeId;
  const checkSign = useCallback(async () => {
    let signerIndex = signers?.findIndex?.(
      (signer, i) => signer.signerId === profileInfo._id,
    );
    let isSignerValid =
      signerIndex !== -1 && signers?.[signerIndex]?.signature?.length > 0;
    let isAdminConditionValid = profileInfo.userType === ROLES.ADMIN;
    let isEmployeeConditionValid =
      employeeIdFromResponse === profileInfo?._id &&
      employeeSignature?.length > 0;
    let signerGuadianIndex = signers?.findIndex?.((signer, i) =>
      profileInfo.patientsAssigned?.includes(signer.signerId),
    );
    let isGuadianConditionValid =
      signerGuadianIndex !== -1 &&
      signers?.[signerGuadianIndex]?.signature?.length > 0;
    if (
      isSignerValid ||
      isAdminConditionValid ||
      isEmployeeConditionValid ||
      isGuadianConditionValid
    ) {
      setIsSubmitEnabled(true);
    } else {
      setIsSubmitEnabled(false);
    }
  }, [
    signers,
    profileInfo.userType,
    profileInfo._id,
    profileInfo.patientsAssigned,
    employeeIdFromResponse,
    employeeSignature?.length,
  ]);
  useEffect(() => {
    if (!data?.data) return;
    if (data?.data) {
      const { saveAsDraft, signers } = data.data;
      const { _id, userType, accountType, userPermissions } = profileInfo;
      const isSigner = signers?.findIndex?.(
        (signer, i) => signer.signerId === _id,
      );
      // SaveAsDraft with signer
      if (
        (saveAsDraft &&
          userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.REGULAR &&
          !(
            typeof userPermissions?.edit === "string"
              ? userPermissions.edit.split(":")
              : []
          ).includes("aps") &&
          isSigner !== -1) ||
        (saveAsDraft &&
          userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.RESTRICTED &&
          isSigner !== -1)
      ) {
        setSaveAsDrafIsNotEditable(true);
      } else {
        setSaveAsDrafIsNotEditable(false);
      }

      // SaveAsDraft withOut Signer
      if (
        (saveAsDraft &&
          userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.REGULAR &&
          !(
            typeof userPermissions?.edit === "string"
              ? userPermissions.edit.split(":")
              : []
          ).includes("aps") &&
          isSigner === -1) ||
        (saveAsDraft &&
          userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.RESTRICTED &&
          isSigner === -1)
      ) {
        setSaveAsDrafIsNotEditableWithoutSigner(true);
      } else {
        setSaveAsDrafIsNotEditableWithoutSigner(false);
      }

      // signer without edit permission
      if (
        (userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.REGULAR &&
          !(
            typeof userPermissions?.edit === "string"
              ? userPermissions.edit.split(":")
              : []
          ).includes("aps") &&
          isSigner !== -1) ||
        (userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.RESTRICTED &&
          isSigner !== -1)
      ) {
        setIsNotEditableWithSigner(true);
      } else {
        setIsNotEditableWithSigner(false);
      }
    }
  }, [
    data?.data,
    profileInfo,
    profileInfo?._id,
    profileInfo?.accountType,
    profileInfo?.userPermissions?.edit,
    profileInfo?.userType,
  ]);
  useEffect(() => {
    if (id || employeeId) {
      checkSign();
    }
  }, [employeeSignature, adminSignature, id, checkSign, employeeId]);
  const companyName =
    profileInfo?.userType === ROLES.ADMIN
      ? profileInfo?.companyName
      : profileInfo?.adminId?.companyName;
  let signerIndex = signers?.findIndex?.(
    (signer, i) => signer.signerId === profileInfo._id,
  );
  function setSignerSignature(sign) {
    if (signerIndex !== -1)
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          signature: sign,
        };
        return newSigners;
      });
  }
  function setSignerDate(date) {
    if (signerIndex !== -1) {
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          dateSigned: date,
        };
        return newSigners;
      });
    }
  }
  function setSignerTime(time) {
    if (signerIndex !== -1) {
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          signedTime: time,
        };
        return newSigners;
      });
    }
  }
  const editSignHandler = (sign) => {
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
      setSignerSignature(sign);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      // setEmployeeSignature(sign)
      setSigners((prevSigners) => {
        const signerIndex = prevSigners.findIndex(
          (signer) => signer.signerId === profileInfo?._id,
        );
        if (signerIndex !== -1) {
          const updatedSigners = [...prevSigners];
          updatedSigners[signerIndex] = {
            ...updatedSigners[signerIndex],
            signature: sign,
          };
          return updatedSigners;
        } else {
          return [
            ...prevSigners,
            {
              signerId: profileInfo._id,
              signature: sign,
              dateSigned: "",
              signedTime: "",
            },
          ];
        }
      });
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignature(sign);
    }
  };
  const editDateHandler = (date) => {
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
      setSignerDate(date);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      // setEmployeeDate(date)
      setSigners((prevSigners) => {
        const signerIndex = prevSigners.findIndex(
          (signer) => signer.signerId === profileInfo?._id,
        );
        if (signerIndex !== -1) {
          const updatedSigners = [...prevSigners];
          updatedSigners[signerIndex] = {
            ...updatedSigners[signerIndex],
            dateSigned: date,
          };
          return updatedSigners;
        } else {
          return [
            ...prevSigners,
            {
              signerId: profileInfo._id,
              signature: "",
              dateSigned: date,
              signedTime: "",
            },
          ];
        }
      });
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminDateSigned(date);
    }
  };
  const editTimeHandler = (time) => {
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
      setSignerTime(time);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setEmployeeTime(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignedTime(time);
    }
  };
  return (
    <>
      <AddSignature
        show={openSigner}
        setValue={(sign) =>
          employeeIdFromResponse === profileInfo?._id
            ? setEmployeeSignature(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          employeeIdFromResponse === profileInfo?._id
            ? setEmployeeDate(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          employeeIdFromResponse === profileInfo?._id
            ? setEmployeeTime(time)
            : editTimeHandler(time)
        }
      />

      <NavWrapper title="APS Consent" isArrow={true} />

      <Container>
        <Form
          onSubmit={submitHandler}
          className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
        >
          <Card body className="mb-3">
            <Row>
              <Col xs={12}>
                <Form.Label>
                  <span className="fw-bold"> {companyName}</span> conducts adult
                  protective service search through the department of health
                  services APS search registry. These searches are conducted
                  randomly and also yearly thereafter.
                </Form.Label>
                <Form.Label>
                  a. Administrator will conduct a search on the APS registry
                  through he department of health services AZ Care Check using
                  employee’s first name, last name and date of birth. Search
                  results will fall into the following categories:
                </Form.Label>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    i. Record Found with (a) Classification
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => setClassification(e.target.value)}
                    value={classification}
                  >
                    {options.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">
                    (b) Date of the incident
                  </Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(dateOfIncident)}
                    onChange={(selectedDate) =>
                      setDateOfIncident(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          date ? formatDateToMMDDYYYY(date) : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    ii. APS Registry Record Found
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => setNoRecordFound(e.target.value)}
                    value={noRecordFound}
                  >
                    {options.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Card body className="mb-3">
            <Row>
              <Col xs={12}>
                <Form.Label>
                  b. Employees or subcontractors shall be prohibited from
                  providing services to{" "}
                  <span className="fw-bold"> {companyName}</span> residents if
                  the search of the APS Registry contains any substantiated
                  report of abuse, neglect, or exploitation of vulnerable adults
                  or children.
                </Form.Label>
                <Form.Label>
                  By Signing this, Employee gives{" "}
                  <span className="fw-bold"> {companyName}</span> consent to
                  conduct a search on the AZ Department of Health APS search
                  registry.
                </Form.Label>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={4}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Date</Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(date)}
                    onChange={(selectedDate) =>
                      setDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          date ? formatDateToMMDDYYYY(date) : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>

          <Row>
            <Col xs={12} lg={6}>
              <Button
                type="button"
                className={`theme-button ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                onClick={() => setOpenSigner(true)}
              >
                SAVED AND SIGNED
              </Button>
            </Col>
            <Col xs={12} lg={6}>
              {signatureFormat({
                sign: employeeSignature,
                date: employeeDate,
                time: employeeTime,
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
                  signer?.signature && (
                    <div key={signer?.signerId}>
                      {signatureFormat({
                        sign: signer?.signature,
                        date: signer?.dateSigned,
                        time: signer?.signedTime,
                        hoursFormat,
                      })}
                    </div>
                  ),
              )}
            </Col>
          </Row>
          <Row className="mt-3 mt-md-5">
            <Col xs={12}>
              <div className="employee-btn-joiner">
                {data?.data?.saveAsDraft && (
                  <button
                    className={`draft ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                    type="submit"
                    onClick={() => {
                      setSaveAsDraft(true);
                    }}
                  >
                    SAVE AS DRAFT
                  </button>
                )}
                <button
                  className={`employee_create_btn ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                  type="submit"
                  disabled={!isSubmitEnabled}
                >
                  {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: EditAPS,
});
