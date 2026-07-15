/** @format */

import React, { useCallback, useEffect, useState } from "react";
import {
  Container,
  Table,
  Card,
  Form,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import SafeHtml from "@/features/shared/ui/common/SafeHtml";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import {
  AddSignature,
  deletePermission,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { trainingService } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import { DashComponent } from "@/features/shared/ui/HelpingComponents";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteModal from "@/features/shared/ui/Mod/DeleteModal/DeleteModal";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const topicArr = [
  {
    label: "Chain of Infection",
    value: "Chain of Infection",
  },
  {
    label: "Standard Precaution",
    value: "Standard Precaution",
  },
  {
    label: "Susceptible Hosts",
    value: "Susceptible Hosts",
  },
  {
    label: "Methods of Transmission",
    value: "Methods of Transmission",
  },
  {
    label: "Hand Hygiene",
    value: "Hand Hygiene",
  },
  {
    label: "Chain of Infection",
    value: "Chain of Infection",
  },
];
const teachingMethodArr = [
  {
    value: "Training Material",
    label: "Training Material",
  },
  {
    value: "Verbal Discussion",
    label: "Verbal Discussion",
  },
];
const EditInfectionControl = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const [employeeName, setEmployeeName] = useState("");
  const [position, setPosition] = useState("");
  const [topicsCovered, setToppicsCovered] = useState([]);
  const [employeeData, setEmployeeData] = useState("");
  const [employeeDate, setEmployeeDate] = useState("");
  const [hoursCompleted, setHoursCompleted] = useState(0);
  const [isContractor, setIsContractor] = useState("");
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [employeeSignatureDate, setEmployeeSignatureDate] = useState("");
  const [employeeSignatureTime, setEmployeeSignatureTime] = useState("");
  const [topic, setTopic] = useState([]);
  const [teachingMethod, setTeachingMethod] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const { id, employeeId } = useParams();
  const [signers, setSigners] = useState([]);
  const [openSigner, setOpenSigner] = useState(false);
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [tablePayload, setTablePayload] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [rowData, setRowData] = useState({});
  const [saveAsDrafIsNotEditable, setSaveAsDrafIsNotEditable] = useState(false);
  const [
    saveAsDrafIsNotEditableWithoutSigner,
    setSaveAsDrafIsNotEditableWithoutSigner,
  ] = useState(false);
  const [isNotEditableWithSigner, setIsNotEditableWithSigner] = useState(false);
  const queryClient = useQueryClient();
  const payload = {
    employeeName,
    position,
    topicsCovered: tablePayload,
    employeeData,
    hoursCompleted,
    isContractor,
    employeeSignature,
    employeeSignatureDate,
    employeeSignatureTime,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    signers,
    employeeDate,
  };
  const submitHandler = (e) => {
    e.preventDefault();
    trainingService.updateInfectionControl({
      id: id || employeeId,
      payload,
      successMsg: "Updated !",
      setLoading,
      navigate,
      additionalFunctions: [
        () =>
          queryClient.invalidateQueries({
            queryKey: queryKeys.infectionControl.all(),
          }),
      ],
    });
  };
  const fetchHandler = useCallback(() => {
    trainingService.getInfectionControlDetail({
      id: id || employeeId,
      page,
      limit,
      setResponse: setResponse,
      setLoading,
    });
  }, [employeeId, id, limit, page]);
  useEffect(() => {
    fetchHandler();
    if (response?.data?.topicsCovered?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.data?.topicsCovered?.docs?.length, fetchHandler, page]);
  useEffect(() => {
    if (response?.data) {
      const item = response?.data;
      setEmployeeName(item?.employeeName);
      setPosition(item?.position || item?.employeeId?.position);
      setEmployeeData(item?.employeeData);
      setHoursCompleted(item?.hoursCompleted);
      setIsContractor(item?.isContractor);
      setEmployeeSignature(item?.employeeSignature);
      setEmployeeSignatureDate(item?.employeeSignatureDate);
      setEmployeeSignatureTime(item?.employeeSignatureTime);
      setAdminSignature(item?.adminSignature);
      setAdminDateSigned(item?.adminDateSigned);
      setAdminSignedTime(item?.adminSignedTime);
      setEmployeeDate(item?.employeeDate);
      if (item?.topicsCovered?.docs?.length > 0) {
        setToppicsCovered(item?.topicsCovered?.docs);
      } else {
        setToppicsCovered([]);
      }
      setSigners(item?.signers);
    }
  }, [response]);
  const arrObj = {
    createdAt: new Date(),
    topic: topic?.map((i) => `<li>${i?.value}</li>`).join(""),
    teachingMethod: teachingMethod?.map((i) => `<li>${i?.label}</li>`).join(""),
  };
  const addMore = () => {
    setTablePayload((prev) => [arrObj, ...prev]);
    setToppicsCovered((prev) => [arrObj, ...prev]);
  };
  const removeRow = () => {
    setModalShow(true);
  };
  const employeeIdFromResponse =
    response?.data?.employeeId?._id || response?.data?.employeeId;
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
    if (!response?.data) return;
    if (response?.data) {
      const { saveAsDraft, signers } = response.data;
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
          ).includes("ic") &&
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
          ).includes("ic") &&
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
          ).includes("ic") &&
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
    response?.data,
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
      setEmployeeSignatureTime(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignedTime(time);
    }
  };
  const canDelete = deletePermission(profileInfo, "ic");
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
            ? setEmployeeSignatureDate(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          employeeIdFromResponse === profileInfo?._id
            ? setEmployeeSignatureTime(time)
            : editTimeHandler(time)
        }
      />
      <DeleteModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        url={"infection-control-training"}
        id={id}
        row={rowData}
        fetchHandler={fetchHandler}
        tablepayload={setTablePayload}
        responsetable={setToppicsCovered}
      />
      <NavWrapper title={"Infection Control"} isArrow={true} />
      <Container>
        <Form
          onSubmit={submitHandler}
          className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
        >
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={4}>
                <Card body className="mb-3">
                  <Form.Label className="fw-normal">Employee Name :</Form.Label>
                  <Form.Label className="fw-bold px-2">{` ${employeeName}`}</Form.Label>
                </Card>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Card body className="mb-3">
                  <Form.Label className="fw-normal"> Position :</Form.Label>
                  <Form.Label className="fw-bold px-2">
                    {" "}
                    {` ${position}`}
                  </Form.Label>
                </Card>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Card body className="mb-3">
                  <Form.Label className="fw-normal">Date :</Form.Label>
                  <Form.Label className="fw-bold px-2">
                    {" "}
                    {formatDateToMMDDYYYY(employeeDate)}
                  </Form.Label>
                </Card>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Topic Covered</Form.Label>
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
                  <Form.Label className="fw-bold">Teaching Method</Form.Label>
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
                <Table bordered responsive>
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
                              {
                                <div className="icon-joiner">
                                  <span
                                    className="del-btn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      removeRow();
                                      setRowData(i);
                                    }}
                                  >
                                    <i className="fa-solid fa-trash" />
                                  </span>
                                </div>
                              }{" "}
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          )}
          {response.data?.topicsCovered?.docs?.length > 0 && (
            <PaginationsPage
              page={page}
              setPage={setPage}
              totalPages={
                response?.data?.topicsCovered?.totalPages &&
                response?.data?.topicsCovered?.totalPages
              }
              limit={limit}
              setLimit={setLimit}
            />
          )}

          <Row>
            <Col xs={12}>
              <Form.Label>
                Acknowledged that
                <span className="fw-bold"> {employeeName} </span>
                has successfully completed
                <span className="mx-1">
                  <input
                    type="number"
                    value={hoursCompleted}
                    className="min-w-[60px] w-[60px]"
                    onChange={(e) => setHoursCompleted(e.target.value)}
                  />
                </span>
                hour(s) of annual Infection Control Training.
              </Form.Label>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col xs={12} lg={6}>
              {
                <div className="custome-cloud-btn">
                  <div className="btns">
                    <Button
                      type="button"
                      onClick={() => setOpenSigner(true)}
                      className={`theme-button ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                    >
                      {" "}
                      SAVED AND SIGNED
                    </Button>
                  </div>
                </div>
              }
            </Col>
            <Col xs={12} lg={6}>
              <label className="w-100 text-end print-light-weight">
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
              </label>
            </Col>
          </Row>

          <Row className="mt-2 text-center">
            <Col xs={12} lg={12}>
              <div className="employee-btn-joiner">
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
  Wcomponenet: EditInfectionControl,
});
