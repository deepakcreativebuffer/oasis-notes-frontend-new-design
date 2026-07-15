/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Card,
  Button,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { CheckBoxMaker } from "@/utils/Makers";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import {
  AddSignature,
  deletePermission,
  fetchPaitentName,
  signatureFormat,
} from "@/utils/utils";
import { assistanceService } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import EmployeeComponent from "@/features/shared/ui/Search/EmployeeComponent";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import { DashComponent } from "@/features/shared/ui/HelpingComponents";
import SafeHtml from "@/features/shared/ui/common/SafeHtml";
import { ROLES } from "@/features/shared/constants";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const topicArr = [
  {
    label: "Knowledge of the rights of medications",
    value: "Knowledge of the rights of medications",
  },
  {
    label:
      "Knowledge of the common benefits, overdose, medication errors and adverse reactions of those medications",
    value:
      "Knowledge of the common benefits, overdose, medication errors and adverse reactions of those medications",
  },
  {
    label: "Knowledge for insuring timely receipt of medications",
    value: "Knowledge for insuring timely receipt of medications",
  },
  {
    label: "Knowledge of Proper storage and disposal and medication",
    value: "Knowledge of Proper storage and disposal and medication",
  },
  {
    label:
      "Knowledge about medication errors, error-prone situations, and strategies to prevent such medication errors and instructions on proper documentations and reporting of medication errors",
    value:
      "Knowledge about medication errors, error-prone situations, and strategies to prevent such medication errors and instructions on proper documentations and reporting of medication errors",
  },
  {
    label:
      "Proper documentation if a residents' refuses any prescribed medications, and necessary steps in notifying the registered nurse",
    value:
      "Proper documentation if a residents' refuses any prescribed medications, and necessary steps in notifying the registered nurse",
  },
  {
    label:
      "Identification of medication errors and medical emergencies related to medication that require emergency medical intervention",
    value:
      "Identification of medication errors and medical emergencies related to medication that require emergency medical intervention",
  },
  {
    label: "Sanitary procedures for handling medication",
    value: "Sanitary procedures for handling medication",
  },
  {
    label:
      "Ability to recognized and differentiate between medication administration and assisting in the self-administration of medication",
    value:
      "Ability to recognized and differentiate between medication administration and assisting in the self-administration of medication",
  },
  {
    label:
      "The Knowledge and skills in assisting in the self-administration of medication",
    value:
      "The Knowledge and skills in assisting in the self-administration of medication",
  },
  {
    label:
      "The Knowledge of the medical terminology used in assisting in the self- administration of medication",
    value:
      "The Knowledge of the medical terminology used in assisting in the self- administration of medication",
  },
  {
    label:
      "The Knowledge and skill in identifying the signs, symptoms, toxicity or overdose",
    value:
      "The Knowledge and skill in identifying the signs, symptoms, toxicity or overdose",
  },
  {
    label:
      "Demonstrating skill in documenting assistance in the self-administration of medication",
    value:
      "Demonstrating skill in documenting assistance in the self-administration of medication",
  },
  {
    label:
      "Demonstration of the personnel member's skills and knowledge necessary to provide assistance in the self-administration of medication",
    value:
      "Demonstration of the personnel member's skills and knowledge necessary to provide assistance in the self-administration of medication",
  },
];
const teachingMethodArr = [
  {
    value: "Training Material",
    label: "Training Material",
  },
  {
    value: "Verbal discussion",
    label: "Verbal discussion",
  },
];
const CreateAssistanceMed = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(userProfile);
  const hoursFormat = currentUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [topicsCovered, setToppicsCovered] = useState([]);
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [employeeSignatureDate, setEmployeeSignatureDate] = useState("");
  const [employeeSignatureTime, setEmployeeSignatureTime] = useState("");
  const [topic, setTopic] = useState([]);
  const [teachingMethod, setTeachingMethod] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acknowledgment, setAcknowledgment] = useState(false);
  const [trainingHours, setTrainingHours] = useState(0);
  const [signers, setSigners] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const queryClient = useQueryClient();
  useEffect(() => {
    if (currentUser?.userType === ROLES.EMPLOYEE)
      setEmployeeName(fetchPaitentName(currentUser));
  }, [currentUser]);
  const payload = {
    skillsAndKnowledge: topicsCovered?.map((i) => ({
      createdAt: i.createdAt,
      skillsAndKnowledge: i.topic,
      trainingMethod: i.teachingMethod,
    })),
    acknowledgment,
    trainingHours,
    employeeSignature,
    employeeSignatureDate,
    employeeId,
    employeeSignatureTime,
    signers: signers.map((signer) => ({
      signerId: signer.value,
      name: signer.label,
      signature: "",
      dateSigned: "",
      signedTime: "",
    })),
  };
  const submitHandler = (e) => {
    e.preventDefault();
    assistanceService.selfAdministration.create(payload, {
      successMsg: "Created !",
      setLoading,
      navigate,
      additionalFunctions: [
        () =>
          queryClient.invalidateQueries({
            queryKey: queryKeys.assistanceMed.all(),
          }),
      ],
    });
  };
  const arrObj = {
    createdAt: new Date(),
    topic: topic?.map((i) => `<li>${i?.value}</li>`).join(""),
    teachingMethod: teachingMethod?.map((i) => `<li>${i?.label}</li>`).join(""),
  };
  const addMore = () => {
    setToppicsCovered((prev) => {
      return [arrObj, ...prev];
    });
    setTopic([]);
    setTeachingMethod([]);
  };
  const removeOne = (index) => {
    setToppicsCovered((prev) => prev.filter((_, i) => i !== index));
  };
  const canDelete = deletePermission(currentUser, "asam");
  return (
    <>
      <AddSignature
        show={open}
        setValue={setEmployeeSignature}
        setDate={setEmployeeSignatureDate}
        setTime={setEmployeeSignatureTime}
      />
      <NavWrapper
        title={"Assistance with Self-Administration of Medication"}
        isArrow={true}
      />
      <Container>
        <Form onSubmit={submitHandler}>
          <Row className="mb-2">
            <Col xs={12}>
              {currentUser?.userType === ROLES.ADMIN && (
                <EmployeeComponent
                  MainPatientId={setEmployeeId}
                  setWholeData={setEmployeeData}
                  MainResidentName={setEmployeeName}
                />
              )}
            </Col>
          </Row>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Skills and knowledge
                  </Form.Label>
                  <CustomMultiSelectInput
                    options={topicArr}
                    multiselect={true}
                    value={topic}
                    required
                    onChange={(value) => setTopic(value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Training Method</Form.Label>
                  <CustomMultiSelectInput
                    options={teachingMethodArr}
                    multiselect={true}
                    required
                    value={teachingMethod}
                    onChange={(value) => setTeachingMethod(value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Row className="mb-3 text-center">
            <Col xs={12}>
              <Button
                type="button"
                className="theme-button hidePrint"
                onClick={() => addMore()}
              >
                Add More
              </Button>
            </Col>
          </Row>
          {topicsCovered?.length > 0 && (
            <Table responsive bordered>
              <thead>
                <tr>
                  <th className="w-[60%]">Skill and Knowledge</th>
                  <th>Training Method</th>
                  {canDelete && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {topicsCovered
                  ?.slice()
                  ?.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                  )
                  ?.map((i, index) => (
                    <tr key={index}>
                      <td className={`${i?.topic ? "" : "text-center"}`}>
                        {i?.topic ? (
                          <SafeHtml
                            as="ul"
                            className="ps-3 mb-0 list-style"
                            html={i?.topic}
                          />
                        ) : (
                          <DashComponent />
                        )}
                      </td>
                      <td
                        className={`${i?.teachingMethod ? "" : "text-center"}`}
                      >
                        {i?.teachingMethod ? (
                          <SafeHtml
                            as="ul"
                            className="ps-3 mb-0 list-style"
                            html={i?.teachingMethod}
                          />
                        ) : (
                          <DashComponent />
                        )}
                      </td>
                      {canDelete && (
                        <td>
                          <div className="icon-joiner">
                            <Link
                              className="del-btn"
                              onClick={() => removeOne(index)}
                            >
                              {" "}
                              <i className="fa-solid fa-trash" />{" "}
                            </Link>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
          <Card body className="mb-3">
            <Row>
              <Col xs={12}>
                <div className="d-flex">
                  <CheckBoxMaker
                    setValue={setAcknowledgment}
                    value={!acknowledgment}
                    checked={acknowledgment}
                    id="Ackn"
                  />
                  <Form.Label>
                    I <span className="fw-bold">{employeeName}</span>{" "}
                    acknowledged, read and understand the skills and knowledge
                    requirement to perform Assistance in the Self-administration
                    of Medication.
                  </Form.Label>
                </div>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col xs={12}>
                <Form.Label>
                  <span>
                    Acknowledged that{" "}
                    <span className="fw-bold">{employeeName}</span> has
                    successfully completed
                  </span>
                  <span className="mx-1">
                    <input
                      type="number"
                      min={0}
                      className="border-bottom w-[60px] text-center"
                      value={trainingHours}
                      onChange={(e) => setTrainingHours(e.target.value)}
                    />
                  </span>
                  <span>
                    {" "}
                    hour(s) Assistance in the self-administration of medication
                    training.
                  </span>{" "}
                </Form.Label>
              </Col>
            </Row>
          </Card>
          <Row>
            <Col xs={12} lg={6}>
              <Form.Label className="fw-bold w-100">
                Employee Signature
              </Form.Label>
              <Button
                type="button"
                className="theme-button hidePrint"
                onClick={() => setOpen(true)}
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
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="fw-bold">Signers:</Form.Label>
                <MultiEmployee setValue={setSigners} value={signers} />
              </Form.Group>
            </Col>
          </Row>
          <Row className="">
            <Col xs={12}>
              <div className="employee-btn-joiner mt-3 mt-md-5">
                <button
                  className="employee_create_btn"
                  type="submit"
                  disabled={employeeSignature?.length === 0}
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
  Wcomponenet: CreateAssistanceMed,
});
