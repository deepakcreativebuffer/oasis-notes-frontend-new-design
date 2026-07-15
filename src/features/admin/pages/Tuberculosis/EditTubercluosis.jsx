/* eslint-disable no-unused-vars */
/** @format */

import { useCallback, useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
  Table,
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
import DatePicker from "react-datepicker";
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
    label: "What is TB?",
    value: "What is TB?",
  },
  {
    label: "How TB spreads",
    value: "How TB spreads",
  },
  {
    label: "Latent TB",
    value: "Latent TB",
  },
  {
    label: "Signs and symptoms",
    value: "Signs and symptoms",
  },
  {
    label: "Who is at risk?",
    value: "Who is at risk?",
  },
  {
    label: "Tb Testing",
    value: "Tb Testing",
  },
  {
    label: "TB Treatment",
    value: "TB Treatment",
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
const EditTubercluosis = () => {
  const { id, employeeId } = useParams();
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const [response, setResponse] = useState({});
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [position, setPosition] = useState("");
  const [employeeDate, setEmployeeDate] = useState(
    formatDateToMMDDYYYY(new Date()),
  );
  const [topicsCovered, setToppicsCovered] = useState([]);
  const [topic, setTopic] = useState([]);
  const [teachingMethod, setTeachingMethod] = useState([]);
  const [employeeData, setEmployeeData] = useState("");
  const [hoursCompleted, setHoursCompleted] = useState(0);
  const [isContractor, setIsContractor] = useState("");
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [employeeSignatureDate, setEmployeeSignatureDate] = useState("");
  const [employeeSignatureTime, setEmployeeSignatureTime] = useState("");
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [signers, setSigners] = useState([]);
  const [openSigner, setOpenSigner] = useState(false);
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
    trainingService.updateTuberculosis({
      id: id || employeeId,
      payload,
      successMsg: "Updated !",
      setLoading,
      navigate,
      additionalFunctions: [
        () =>
          queryClient.invalidateQueries({
            queryKey: queryKeys.tuberculosis.all(),
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
    setTablePayload((prev) => [arrObj, ...prev]);
    setToppicsCovered((prev) => [arrObj, ...prev]);
  };
  const removeRow = () => {
    setModalShow(true);
  };
  const fetchHandler = useCallback(() => {
    trainingService.getTuberculosisDetail({
      id: id || employeeId,
      page,
      limit,
      setResponse,
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
    if (response) {
      const item = response?.data;
      setEmployeeName(item?.employeeName);
      setPosition(item?.position || item?.employeeId?.position || "Admin");
      if (item?.topicsCovered?.docs?.length > 0) {
        setToppicsCovered(item?.topicsCovered?.docs);
      } else {
        setToppicsCovered([]);
      }
      setEmployeeData(item?.employeeData);
      setHoursCompleted(item?.hoursCompleted);
      setIsContractor(item?.isContractor);
      setEmployeeSignature(item?.employeeSignature);
      setEmployeeSignatureDate(item?.employeeSignatureDate);
      setEmployeeSignatureTime(item?.employeeSignatureTime);
      setAdminSignature(item?.adminSignature);
      setAdminDateSigned(item?.adminDateSigned);
      setAdminSignedTime(item?.adminSignedTime);
      setSigners(item?.signers);
      setEmployeeDate(item?.employeeDate);
    }
  }, [response]);
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
          ).includes("tc") &&
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
          ).includes("tc") &&
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
          ).includes("tc") &&
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
  const canDelete = deletePermission(profileInfo, "tc");
  return (
    <>
      <DeleteModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        url={"tuberculosis-training"}
        id={id}
        row={rowData}
        fetchHandler={fetchHandler}
        tablepayload={setTablePayload}
        responsetable={setToppicsCovered}
      />
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
      <NavWrapper title={"Tuberculosis Training"} isArrow={true} />
      <Container className="full-width-container">
        <h1 className="pdfTitle hidden">Tuberculosis</h1>
        <Form
          onSubmit={submitHandler}
          className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
        >
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={4}>
                <Form.Label className="fw-bold w-100">Employee Name</Form.Label>
                {employeeName && (
                  <Form.Label className="w-100 bg-white p-2 border rounded-2">
                    {employeeName}
                  </Form.Label>
                )}
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Form.Label className="fw-bold w-100">Position</Form.Label>
                {(employeeData?.position || position) && (
                  <Form.Label className="w-100 bg-white p-2 border rounded-2">
                    {employeeData?.position || position}
                  </Form.Label>
                )}
              </Col>
              <Col xs={12} md={6} lg={4}>
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
            <Row className="mb-3">
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
                              }
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

          <Card body className="mb-3">
            <Form.Label>
              Acknowledged that
              <span className="fw-bold mx-1">{employeeName}</span>
              <span>has successfully completed</span>
              <span className="fw-bold mx-1">
                <input
                  type={"number"}
                  min={0}
                  className="w-[60px]"
                  onChange={(e) => setHoursCompleted(e.target.value)}
                  value={hoursCompleted}
                />
              </span>
              <span>hour(s) of Tuberculosis Training</span>
            </Form.Label>
          </Card>
          <Row className="mb-3">
            <Col xs={12} lg={6}>
              <Form.Label className="fw-bold w-100">
                Employee Signature
              </Form.Label>
              {
                <Button
                  type="button"
                  onClick={() => setOpenSigner(true)}
                  className={`theme-button ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                >
                  {" "}
                  SAVED AND SIGNED
                </Button>
              }
            </Col>
            <Col xs={12} lg={6}>
              <div>
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
              </div>
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
  Wcomponenet: EditTubercluosis,
});
