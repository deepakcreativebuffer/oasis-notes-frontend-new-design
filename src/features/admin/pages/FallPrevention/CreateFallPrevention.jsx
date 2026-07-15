/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
  Table,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import {
  AddSignature,
  deletePermission,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { trainingService } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import EmployeeComponent from "@/features/shared/ui/Search/EmployeeComponent";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import DatePicker from "react-datepicker";
import SafeHtml from "@/features/shared/ui/common/SafeHtml";
import { DashComponent } from "@/features/shared/ui/HelpingComponents";
import { ROLES } from "@/features/shared/constants";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const topicArr = [
  {
    label: "Statistics on falls",
    value: "Statistics on falls",
  },
  {
    label: "Risk factors that contribute to falling",
    value: "Risk factors that contribute to falling",
  },
  {
    label:
      "Tips to reduce fall hazards inside and outside the facility (prevention)",
    value:
      "Tips to reduce fall hazards inside and outside the facility (prevention)",
  },
  {
    label: "Steps to take following a fall (recovery)",
    value: "Steps to take following a fall (recovery)",
  },
  {
    label: "Consequences of falls",
    value: "Consequences of falls",
  },
  {
    label: "Identifying why falls happen",
    value: "Identifying why falls happen",
  },
];
const teachingMethodArr = [
  {
    value: "Training material",
    label: "Training material",
  },
  {
    value: "Verbal Discussion",
    label: "Verbal Discussion",
  },
];
const CreateFallPrevention = () => {
  const currentUser = useSelector(userProfile);
  const hoursFormat = currentUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topicsCovered, setToppicsCovered] = useState([]);
  const [topic, setTopic] = useState([]);
  const [teachingMethod, setTeachingMethod] = useState([]);
  const [employeeData, setEmployeeData] = useState("");
  const [hoursCompleted, setHoursCompleted] = useState(0);
  const [isContractor, setIsContractor] = useState("");
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [employeeSignatureDate, setEmployeeSignatureDate] = useState("");
  const [employeeSignatureTime, setEmployeeSignatureTime] = useState("");
  const [employeeDate, setEmployeeDate] = useState(new Date());
  const [signers, setSigners] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const position = currentUser.position;
  const queryClient = useQueryClient();
  useEffect(() => {
    if (currentUser?.userType === ROLES.EMPLOYEE)
      setEmployeeName(fetchPaitentName(currentUser));
  }, [currentUser]);
  const payload = {
    employeeName,
    position,
    topicsCovered,
    employeeData,
    hoursCompleted,
    isContractor,
    employeeSignature,
    employeeSignatureDate,
    employeeSignatureTime,
    employeeId,
    employeeDate,
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
    trainingService.createFallPrevention(payload, {
      successMsg: "Created !",
      setLoading,
      navigate,
      additionalFunctions: [
        () =>
          queryClient.invalidateQueries({
            queryKey: queryKeys.fallPrevention.all(),
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
    setToppicsCovered((prev) => [arrObj, ...prev]);
    setTopic([]);
    setTeachingMethod([]);
  };
  const removeOne = (index) => {
    setToppicsCovered((prev) => prev.filter((_, i) => i !== index));
  };
  const canDelete = deletePermission(currentUser, "fprt");
  return (
    <>
      <AddSignature
        show={open}
        setValue={setEmployeeSignature}
        setDate={setEmployeeSignatureDate}
        setTime={setEmployeeSignatureTime}
      />
      <NavWrapper
        title={"Fall Prevention and Recovery Training"}
        isArrow={true}
      />
      <Container>
        <Form onSubmit={submitHandler}>
          <Row>
            <Col xs={12} md={12} lg={12}>
              {currentUser?.userType === ROLES.ADMIN ? (
                <EmployeeComponent
                  className={"grid-item"}
                  MainPatientId={setEmployeeId}
                  setWholeData={setEmployeeData}
                  MainResidentName={setEmployeeName}
                />
              ) : (
                <div className="grid-item long-input">
                  <Form.Label className="fw-bold d-block me-2">
                    Employee Name :
                  </Form.Label>
                  <span className="d-block bordered rounded-2  mb-2">
                    {employeeName}
                  </span>
                </div>
              )}
            </Col>
          </Row>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={6}>
                <Form.Label className="fw-bold w-100">Position</Form.Label>
                {(employeeData?.position || position) && (
                  <Form.Label className="w-100 bg-white p-2 border rounded-2">
                    {employeeData?.position || position}
                  </Form.Label>
                )}
              </Col>
              <Col xs={12} md={6} lg={6}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Date</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(employeeDate)}
                    onChange={(selectedDate) =>
                      setEmployeeDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          employeeDate
                            ? formatDateToMMDDYYYY(employeeDate)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Topic Covered</Form.Label>

                  <CustomMultiSelectInput
                    options={topicArr}
                    multiselect={true}
                    required
                    value={topic}
                    onChange={(value) => setTopic(value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={12} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Teaching method</Form.Label>

                  <CustomMultiSelectInput
                    options={teachingMethodArr}
                    multiselect={true}
                    value={teachingMethod}
                    required
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
            <Row>
              <Col xs={12}>
                <Table responsive bordered>
                  <thead>
                    <tr>
                      <th>Topic Covered</th>
                      <th>Teaching Method</th>
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
              </Col>
            </Row>
          )}
          <Card body className="mb-3">
            <Form.Label>
              Acknowledged that
              <span className="fw-bold mx-1">{employeeName}</span>
              <span>has successfully completed</span>
              <input
                type={"number"}
                min={0}
                className="mx-2 text-center w-10"
                onChange={(e) => setHoursCompleted(e.target.value)}
                value={hoursCompleted}
              />
              <span>
                hour(s) of annual Fall Prevention and Fall Recovery Training
              </span>
            </Form.Label>
          </Card>
          <Row className="mb-3">
            <Col xs={12} lg={6}>
              <Button
                type="button"
                className="theme-button"
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
          <Row className="mb-3">
            <Col xs={12} lg={12}>
              <Form.Group>
                <Form.Label className="fw-bold">Signers :</Form.Label>
                <MultiEmployee setValue={setSigners} value={signers} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs={12} lg={12}>
              <button
                className="employee_create_btn mt-3 mt-md-4"
                type="submit"
                disabled={employeeSignature?.length === 0}
                onClick={submitHandler}
              >
                {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
              </button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: CreateFallPrevention,
});
