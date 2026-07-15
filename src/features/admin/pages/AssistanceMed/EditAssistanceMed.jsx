/** @format */

import { useCallback, useEffect, useState } from "react";
import {
  Container,
  Table,
  Card,
  Button,
  Form,
  Row,
  Col,
} from "react-bootstrap";
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
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import { DashComponent } from "@/features/shared/ui/HelpingComponents";
import SafeHtml from "@/features/shared/ui/common/SafeHtml";
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
      "Proper documentation if a residents’ refuses any prescribed medications, and necessary steps in notifying the registered nurse",
    value:
      "Proper documentation if a residents’ refuses any prescribed medications, and necessary steps in notifying the registered nurse",
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
      "Demonstration of the personnel member’s skills and knowledge necessary to provide assistance in the self-administration of medication",
    value:
      "Demonstration of the personnel member’s skills and knowledge necessary to provide assistance in the self-administration of medication",
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
const EditAssistanceMed = () => {
  const { id, employeeId } = useParams();
  const navigate = useNavigate();
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [topicsCovered, setToppicsCovered] = useState([]);
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [employeeSignatureDate, setEmployeeSignatureDate] = useState("");
  const [employeeSignatureTime, setEmployeeSignatureTime] = useState("");
  const [topic, setTopic] = useState([]);
  const [teachingMethod, setTeachingMethod] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nurseSignature, setNurseSignature] = useState("");
  const [nurseSignatureDate, setNurseSignatureDate] = useState("");
  const [nurseSignatureTime, setNurseSignatureTime] = useState("");
  const [acknowledgment, setAcknowledgment] = useState(false);
  const [trainingHours, setTrainingHours] = useState(0);
  const [response, setResponse] = useState({});
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
    skillsAndKnowledge: tablePayload?.map((i) => ({
      createdAt: i.createdAt,
      skillsAndKnowledge: i.topic,
      trainingMethod: i.teachingMethod,
    })),
    acknowledgment,
    trainingHours,
    employeeSignature,
    employeeSignatureDate,
    employeeSignatureTime,
    nurseSignature,
    nurseSignatureDate,
    nurseSignatureTime,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    signers,
  };
  const submitHandler = (e) => {
    e.preventDefault();
    assistanceService.selfAdministration.update(id || employeeId, payload, {
      successMsg: "Updated !",
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
    setTablePayload((prev) => [arrObj, ...prev]);
    setToppicsCovered((prev) => [arrObj, ...prev]);
  };
  const removeRow = () => {
    setModalShow(true);
  };
  const fetchHandler = useCallback(() => {
    assistanceService.getDetailPaginated({
      id: id || employeeId,
      page,
      limit,
      setResponse: setResponse,
      setLoading,
    });
  }, [employeeId, id, limit, page]);
  useEffect(() => {
    fetchHandler();
    if (response?.data?.skillsAndKnowledge?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.data?.skillsAndKnowledge?.docs?.length, fetchHandler, page]);
  useEffect(() => {
    if (response) {
      const item = response?.data;
      if (item?.skillsAndKnowledge?.docs?.length > 0) {
        const skillMap = item?.skillsAndKnowledge?.docs?.map((i) => ({
          createdAt: i.createdAt,
          topic: i?.skillsAndKnowledge,
          teachingMethod: i?.trainingMethod,
        }));
        setToppicsCovered(skillMap);
      } else {
        setToppicsCovered([]);
      }
      setEmployeeSignature(item?.employeeSignature);
      setEmployeeSignatureDate(item?.employeeSignatureDate);
      setEmployeeSignatureTime(item?.employeeSignatureTime);
      setNurseSignature(item?.nurseSignature);
      setNurseSignatureDate(item?.nurseSignatureDate);
      setNurseSignatureTime(item?.nurseSignatureTime);
      setAcknowledgment(item?.acknowledgment);
      setTrainingHours(item?.trainingHours);
      setAdminSignature(item?.adminSignature);
      setAdminDateSigned(item?.adminDateSigned);
      setAdminSignedTime(item?.adminSignedTime);
      setSigners(item?.signers);
    }
  }, [response]);
  const employeeName = fetchPaitentName(response?.data?.employeeId);
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
    employeeIdFromResponse,
    employeeSignature?.length,
    profileInfo._id,
    profileInfo.patientsAssigned,
    profileInfo.userType,
    signers,
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
          ).includes("asam") &&
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
          ).includes("asam") &&
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
          ).includes("asam") &&
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
      // setEmployeeSignatureDate(date)
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
  const canDelete = deletePermission(profileInfo, "asam");
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
        url={"assistance-with-self-administration"}
        id={id}
        row={rowData}
        fetchHandler={fetchHandler}
        tablepayload={setTablePayload}
        responsetable={setToppicsCovered}
      />
      <NavWrapper
        title={"Assistance with Self-Administration of Medication"}
        isArrow={true}
      />
      <Container>
        <Form
          onSubmit={submitHandler}
          className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
        >
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
                    value={teachingMethod}
                    required
                    onChange={(value) => setTeachingMethod(value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Row className="mb-3">
            <Col xs={12} className="d-flex justify-content-center">
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
                  {canDelete && <th>Actions</th>}
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
                          <Link
                            className="del-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              removeRow();
                              setRowData(i);
                            }}
                          >
                            {" "}
                            <i className="fa-solid fa-trash" />{" "}
                          </Link>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
          {response.data?.skillsAndKnowledge?.docs?.length > 0 && (
            <PaginationsPage
              page={page}
              setPage={setPage}
              totalPages={
                response?.data?.skillsAndKnowledge?.totalPages &&
                response?.data?.skillsAndKnowledge?.totalPages
              }
              limit={limit}
              setLimit={setLimit}
            />
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
            <Row className="mt-3">
              <Col xs={12}>
                <Form.Label>
                  <span>
                    Acknowledged that{" "}
                    <span className="fw-bold">{employeeName}</span> has
                    successfully completed
                  </span>
                  <span className="mx-2">
                    <input
                      type="number"
                      min={0}
                      className="w-[60px]"
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
              <Form.Label className="w-100 fw-bold">
                Employee Signature
              </Form.Label>
              {
                <div className="custome-cloud-btn">
                  <div className="btns">
                    <Button
                      type="button"
                      className={`theme-button hidePrint ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                      onClick={() => setOpenSigner(true)}
                    >
                      {" "}
                      SAVED AND SIGNED
                    </Button>
                  </div>
                </div>
              }
            </Col>
            <Col xs={12} lg={6} className="text-end">
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
          <Row className="">
            <Col xs={12}>
              <button
                className={`employee_create_btn ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                type="submit"
                disabled={!isSubmitEnabled}
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
  Wcomponenet: EditAssistanceMed,
});
