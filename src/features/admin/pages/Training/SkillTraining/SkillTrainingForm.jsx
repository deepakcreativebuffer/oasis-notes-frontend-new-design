/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container, Card, Form, Row, Col, Button } from "react-bootstrap";
import { getData } from "@/features/shared/services";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { BorderlessInput, MultiSelect } from "@/utils/Makers";
import { trainingService } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import DatePicker from "react-datepicker";
import EmployeeComponent from "@/features/shared/ui/Search/EmployeeComponent";
import { ROLES } from "@/features/shared/constants";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const options = [
  {
    value: "Protect resident rights",
    label: "Protect resident rights",
  },
  {
    value:
      "Provide treatment that promotes resident dignity, independence, individuality, strengths, privacy and choice",
    label:
      "Provide treatment that promotes resident dignity, independence, individuality, strengths, privacy and choice",
  },
  {
    value:
      "Recognize obvious symptoms of a mental disorder, personality disorder, or substance abuse",
    label:
      "Recognize obvious symptoms of a mental disorder, personality disorder, or substance abuse",
  },
  {
    value:
      "Provide the behavioral health services that the agency is authorized to provide and that the staff member is qualified to provide",
    label:
      "Provide the behavioral health services that the agency is authorized to provide and that the staff member is qualified to provide",
  },
  {
    value:
      "Meet the unique needs of the resident populations served by the agency or the staff member, adults age18 and older, individuals who have substance abuse problems, individuals who are seriously mentally ill, or individuals who have co-occurring disorders",
    label:
      "Meet the unique needs of the resident populations served by the agency or the staff member, adults age18 and older, individuals who have substance abuse problems, individuals who are seriously mentally ill, or individuals who have co-occurring disorders",
  },
  {
    value:
      "Protect and maintain the confidentiality of resident records and information",
    label:
      "Protect and maintain the confidentiality of resident records and information",
  },
  {
    value: "Recognize and respect cultural differences",
    label: "Recognize and respect cultural differences",
  },
  {
    value: "Recognize, prevent, and respond to a situation in which a resident",
    label: "Recognize, prevent, and respond to a situation in which a resident",
  },
  {
    value: "May be a danger to self or a danger to others",
    label: "May be a danger to self or a danger to others",
  },
  {
    value: "Behaves in an aggressive or destructive manner",
    label: "Behaves in an aggressive or destructive manner",
  },
  {
    value: "May be experiencing a crisis situation",
    label: "May be experiencing a crisis situation",
  },
  {
    value: "May be experiencing a medical emergency",
    label: "May be experiencing a medical emergency",
  },
  {
    value: "Read and implement a resident’s behavioral health treatment plan",
    label: "Read and implement a resident’s behavioral health treatment plan",
  },
  {
    value: "Assist a resident in accessing community services and resources",
    label: "Assist a resident in accessing community services and resources",
  },
  {
    value: "Record and document resident information",
    label: "Record and document resident information",
  },
  {
    value:
      "Demonstrate ethical behavior, such as by respecting staff member and resident boundaries and recognizing the inappropriateness of receiving gratuities from a resident",
    label:
      "Demonstrate ethical behavior, such as by respecting staff member and resident boundaries and recognizing the inappropriateness of receiving gratuities from a resident",
  },
  {
    value:
      "Identify types of medications commonly prescribed for mental disorders, personality disorders, and substance abuse and the common side effects and adverse reactions of the medications",
    label:
      "Identify types of medications commonly prescribed for mental disorders, personality disorders, and substance abuse and the common side effects and adverse reactions of the medications",
  },
  {
    value:
      "Recognize and respond to a fire, disaster, hazard, and medical emergency",
    label:
      "Recognize and respond to a fire, disaster, hazard, and medical emergency",
  },
  {
    value:
      "Provide the activities or behavioral health services identified in the staff member’s job description or the agency’s policies and procedures",
    label:
      "Provide the activities or behavioral health services identified in the staff member’s job description or the agency’s policies and procedures",
  },
  {
    value: "Being able to Conduct group counseling",
    label: "Being able to Conduct group counseling",
  },
];
const options2 = [
  {
    value:
      "Visual observation of the staff member interacting with another individual, such as through role-playing exercises",
    label:
      "Visual observation of the staff member interacting with another individual, such as through role playing exercises",
  },
  {
    value:
      "Verbal interaction with the staff member, such as interviewing, discussion, or question and answer",
    label:
      "Verbal interaction with the staff member, such as interviewing, discussion, or question and answer",
  },
];
const SkillTrainingForm = () => {
  const navigate = useNavigate();
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const { id, employeeId: routeEmployeeId } = useParams();
  const isEdit = Boolean(id || routeEmployeeId);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [hoursCompleted, setHoursCompleted] = useState(0);
  const [selectedTrainingTopics, setSelectedTrainingTopics] = useState([]);
  const [verificationMethod, setVerificationMethod] = useState([]);
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [employeeTitle, setEmployeeTitle] = useState("");
  const [employeeTitleDate, setEmployeeTitleDate] = useState("");
  const [employeeDate, setEmployeeDate] = useState("");
  const [employeeTime, setEmployeeTime] = useState("");
  const [verifiedBySignature, setVerifiedBySignature] = useState("");
  const [verifiedByTitle, setVerifiedByTitle] = useState("");
  const [verifiedByDate, setVerifiedByDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifiedBySignatureDate, setVerifiedBySignatureDate] = useState("");
  const [verifiedBySignatureTime, setVerifiedBySignatureTime] = useState("");
  const [detail, setDetails] = useState({});
  const [signers, setSigners] = useState([]);
  const [openSigner, setOpenSigner] = useState(false);
  const [employeeSaveAsDraft, setEmployeeSaveAsDraft] = useState(false);
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const queryClient = useQueryClient();
  const fetchHandler = useCallback(() => {
    if (!isEdit) return;
    getData(
      setDetails,
      `employee/getSkillAndKnowledgeById/${routeEmployeeId || id}`,
    );
  }, [routeEmployeeId, id, isEdit]);
  useEffect(() => {
    if (!isEdit) return;
    fetchHandler();
  }, [fetchHandler, isEdit]);
  const currentUser = useSelector(userProfile);
  const companyName =
    currentUser?.userType === ROLES.ADMIN
      ? currentUser?.companyName
      : currentUser?.adminId?.companyName;
  const payload = {
    hoursCompleted,
    companyName,
    selectedTrainingTopics: selectedTrainingTopics?.map((i) => i.value),
    verificationMethod: verificationMethod?.map((i) => i.value),
    employeeSignature,
    employeeTitle,
    employeeTitleDate,
    employeeDate,
    employeeTime,
    verifiedBySignature,
    verifiedByTitle,
    verifiedByDate,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    employeeSaveAsDraft,
    signers,
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const invalidateSkills = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.all() });
    };
    if (isEdit) {
      trainingService.skillAndKnowledge.update(id || routeEmployeeId, payload, {
        setLoading,
        navigate,
        additionalFunctions: [invalidateSkills],
      });
    } else {
      await trainingService.createSkillAndKnowledge(
        selectedEmployeeId,
        {
          ...payload,
          signers: (signers || []).map((signer) => ({
            signerId: signer.value,
            name: signer.label,
            signature: "",
            dateSigned: "",
            signedTime: "",
          })),
        },
        {
          setLoading,
          navigate,
          additionalFunctions: [invalidateSkills],
        },
      );
    }
  };
  useEffect(() => {
    if (detail?.data) {
      const item = detail?.data;
      setHoursCompleted(item?.hoursCompleted);
      if (item?.selectedTrainingTopics?.length > 0) {
        const options = item?.selectedTrainingTopics?.map((i) => ({
          value: i,
          label: i,
        }));
        setSelectedTrainingTopics(options);
      }
      if (item?.verificationMethod?.length > 0) {
        const options = item?.verificationMethod?.map((i) => ({
          value: i,
          label: i,
        }));
        setVerificationMethod(options);
      }
      setEmployeeTitle(item?.employeeTitle);
      setEmployeeTitleDate(item?.employeeTitleDate);
      setEmployeeDate(item?.employeeDate);
      setEmployeeTime(item?.employeeTime);
      setVerifiedByTitle(item?.verifiedByTitle);
      setVerifiedByDate(item?.verifiedByDate);
      setVerifiedBySignatureDate(item?.verifiedBySignatureDate);
      setVerifiedBySignatureTime(item?.verifiedBySignatureTime);
      setVerifiedBySignature(item?.verifiedBySignature);
      setEmployeeSignature(item?.employeeSignature);
      setAdminSignature(item?.adminSignature);
      setAdminDateSigned(item?.adminDateSigned);
      setAdminSignedTime(item?.adminSignedTime);
      setSigners(item?.signers);
    }
  }, [detail]);
  const checkSign = useCallback(async () => {
    let signerIndex = signers?.findIndex?.(
      (signer, i) => signer.signerId === profileInfo._id,
    );
    let isSignerValid =
      signerIndex !== -1 && signers?.[signerIndex]?.signature?.length > 0;
    let isAdminConditionValid = profileInfo.userType === ROLES.ADMIN;
    let isEmployeeConditionValid =
      ((!isEdit && profileInfo.userType === ROLES.EMPLOYEE) ||
        detail?.data?.employeeId === profileInfo?._id ||
        detail?.data?.employeeId?._id === profileInfo?._id) &&
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
    detail?.data?.employeeId,
    employeeSignature?.length,
  ]);
  useEffect(() => {
    checkSign();
  }, [employeeSignature, adminSignature, id, checkSign, routeEmployeeId]);
  let signerIndex = signers?.findIndex?.(
    (signer, i) => signer.signerId === profileInfo._id,
  );
  if (signerIndex === undefined || signerIndex === null) signerIndex = -1;
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
          detail?.data?.employeeId === profileInfo?._id
            ? setEmployeeSignature(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          detail?.data?.employeeId === profileInfo?._id
            ? setEmployeeDate(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          detail?.data?.employeeId === profileInfo?._id
            ? setEmployeeTime(time)
            : editTimeHandler(time)
        }
      />
      <NavWrapper title={"Skills and Knowledge Training"} isArrow={true} />
      <Container
        className={`${profileInfo?.userType === ROLES.EMPLOYEE && "pointer-events-none"}`}
      >
        <Form onSubmit={submitHandler}>
          {!isEdit && profileInfo?.userType === ROLES.ADMIN && (
            <Row className="mb-2">
              <Col xs={12}>
                <EmployeeComponent MainPatientId={setSelectedEmployeeId} />
              </Col>
            </Row>
          )}
          <Card className="grid-container mb-3 d-block p-2">
            <Form.Label className="inline break-words">
              I,{" "}
              {detail?.data?.employeeId && (
                <span className="fw-bold">
                  {detail?.data?.employeeId?.firstName}{" "}
                  {detail?.data?.employeeId?.lastName}
                </span>
              )}{" "}
              attest I have received
            </Form.Label>
            <BorderlessInput
              setState={setHoursCompleted}
              type="text"
              value={hoursCompleted}
              className="max-w-[30px] mr-[10px] text-center font-bold"
            />
            <Form.Label className="text-wrap d-inline">
              hour(s) of Skills and Knowledge training at{" "}
              <span className="fw-bold">{companyName}</span> to perform the job
              duties as consistent with my job description.
            </Form.Label>
          </Card>
          <Card body className="mb-3">
            <Row>
              <Col xs={12}>
                <MultiSelect
                  options={options}
                  setValue={setSelectedTrainingTopics}
                  value={selectedTrainingTopics}
                  overrideStrings={{
                    selectSomeItems: "Select...",
                    allItemsAreSelected: selectedTrainingTopics
                      .map((item) => item.label)
                      .join(", "),
                  }}
                />
              </Col>
            </Row>
          </Card>

          <Row className="mb-3">
            <Col xs={12}>
              <Form.Label className="fw-bold">
                The above listed skills and knowledge were verified by:
              </Form.Label>
            </Col>
          </Row>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Verification Method
                  </Form.Label>
                  <CustomMultiSelectInput
                    multiselect={true}
                    value={verificationMethod}
                    onChange={(value) => setVerificationMethod(value)}
                    options={options2}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Verified by:</Form.Label>
                  <Form.Control
                    onChange={(e) => setEmployeeTitle(e.target.value)}
                    type="text"
                    value={employeeTitle}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Date</Form.Label>

                  <DatePicker
                    selected={formatDateToMMDDYYYY(employeeTitleDate)}
                    onChange={(selectedDate) =>
                      setEmployeeTitleDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          employeeTitleDate
                            ? formatDateToMMDDYYYY(employeeTitleDate)
                            : new Date(),
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
                className="theme-button hidePrint pointer-events-auto"
                type="button"
                onClick={() => setOpenSigner(true)}
              >
                {" "}
                SAVED AND SIGNED
              </Button>
            </Col>
            <Col xs={12} lg={6}>
              {signatureFormat({
                sign: employeeSignature,
                time: employeeTime,
                date: employeeDate,
                hoursFormat,
              })}
              {signatureFormat({
                sign: adminSignature,
                date: adminDateSigned,
                time: adminSignedTime,
                hoursFormat,
              })}
              <div>
                {signatureFormat({
                  sign: verifiedBySignature,
                  time: verifiedBySignatureTime,
                  date: verifiedBySignatureDate,
                  hoursFormat,
                })}
              </div>
              <div>
                {signers?.map(
                  (signer) =>
                    signer.signature && (
                      <div key={signer.signerId}>
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
          </Row>
          <Row className="text-center mt-3 mt-md-5">
            <Col xs={12} lg={12}>
              <div className="employee-btn-joiner pointer-events-auto">
                {detail?.data?.employeeSaveAsDraft && (
                  <button
                    className="draft"
                    type="submit"
                    onClick={() => setEmployeeSaveAsDraft(true)}
                  >
                    Save as Draft
                  </button>
                )}
                <button
                  className="employee_create_btn"
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
  Wcomponenet: SkillTrainingForm,
});
