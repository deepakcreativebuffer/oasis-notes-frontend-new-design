/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { Button, Container, Form, Row, Col, Card } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import {
  clinicalOversightService,
  employeeService,
  facilityService,
} from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import {
  AddSignature,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  parseTimeStringToDate,
  signatureFormat,
} from "@/utils/utils";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import CustomSelect from "@/features/shared/ui/selectors/CustomSelect";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MultiPatients from "@/features/shared/ui/Search/MultiPatients";
import Loader from "@/features/shared/ui/Loader/Loader";
import DatePicker from "react-datepicker";
import CustomTimePicker from "@/features/shared/ui/TimePicker/CustomTimePicker";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
const ClinicalOversight = () => {
  const profileInfo = useSelector(userProfile);
  const url = useLocation().pathname;
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [signers, setSigners] = useState([]);
  const [open, setOpen] = useState(false);
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [employeeSignatureDate, setEmployeeSignatureDate] = useState("");
  const [employeeSignatureTime, setEmployeeSignatureTime] = useState("");
  const [data, setData] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const currentUser = useSelector(userProfile);
  const [facilitiesList, setFacilitiesList] = useState([]);

  useEffect(() => {
    if (currentUser?.userType === ROLES.ADMIN) {
      facilityService.list({
        setResponse: (data) => setFacilitiesList(data?.data || []),
      });
    } else {
      setFacilitiesList(currentUser?.facilityId || []);
    }
  }, [currentUser]);

  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [openAdmin, setAdminOpen] = useState(false);
  const [employeeId1, setEmployeeId1] = useState("");
  const [employeeId, setEmployeeId] = useState([]);
  const [response, setResponse] = useState({});
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [clinicalOversightData, setClinicalOversightData] = useState({
    facilityId: "",
    facilityAddress: "",
    topic: "",
    adminId: "",
    date: "",
    beginTime: "",
    endTime: "",
    lengthOfTime: "",
    conductedViaRemoteTeleConferenceWithAudioVideo: false,
    conductedViaInPerson: false,
    clinicalOversightTypeIndividual: false,
    clinicalOversightTypeGroup: false,
    participants: [],
    topicsAddressedUniqueTreatmentNeeds: false,
    topicsAddressedEnhancingSkills: false,
    topicsAddressedAssessmentOrTreatmentPlan: false,
    topicsAddressedStaffTrainingPlan: false,
    topicsAddressedJobDutiesDirection: false,
    additionalComments: "",
    opportunitiesForTraining: "",
    bhpNameAndCredentials: "",
    bhpSignature: "",
    administratorName: "",
    administratorSignature: "",
  });
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [saveAsDrafIsNotEditable, setSaveAsDrafIsNotEditable] = useState(false);
  const [
    saveAsDrafIsNotEditableWithoutSigner,
    setSaveAsDrafIsNotEditableWithoutSigner,
  ] = useState(false);
  const [isNotEditableWithSigner, setIsNotEditableWithSigner] = useState(false);

  const {
    signatures,
    updateSignature,
    loadFromApi: loadSignaturesFromApi,
  } = useSignatures();
  const { guardTyped, dialog: typedGuardDialog } = useTypedGuard({
    signatures,
    updateSignature,
  });

  const hasTypedInForm = !!employeeSignature || !!adminSignature;

  const bhtNamePresent = !!(
    signatures?.bht?.name &&
    signatures.bht.name.trim() &&
    signatures.bht.name.trim() !== "undefined undefined"
  );
  const bhtSigPresent = !!signatures?.bht?.rawSignatureImage;
  const bhtIncomplete = bhtSigPresent && !bhtNamePresent && !hasTypedInForm;

  const bhpNamePresent = !!(
    signatures?.bhp?.name &&
    signatures.bhp.name.trim() &&
    signatures.bhp.name.trim() !== "undefined undefined"
  );
  const bhpSigPresent = !!signatures?.bhp?.rawSignatureImage;
  const bhpIncomplete = bhpSigPresent && !bhpNamePresent && !hasTypedInForm;

  const witnessNamePresent = !!(
    signatures?.witness?.name &&
    signatures.witness.name.trim() &&
    signatures.witness.name.trim() !== "undefined undefined"
  );
  const witnessSigPresent = !!signatures?.witness?.rawSignatureImage;
  const witnessRoleIncomplete =
    witnessSigPresent && !witnessNamePresent && !hasTypedInForm;

  const witnessIncomplete =
    bhtIncomplete || bhpIncomplete || witnessRoleIncomplete;

  const clearAllTyped = () => {
    setEmployeeSignature("");
    setEmployeeSignatureDate("");
    setEmployeeSignatureTime("");
    setAdminSignature("");
    setAdminDateSigned("");
    setAdminSignedTime("");
  };

  useEffect(() => {
    if (clinicalOversightData?.beginTime && clinicalOversightData?.endTime) {
      const start = parseTimeStringToDate(clinicalOversightData.beginTime);
      const end = parseTimeStringToDate(clinicalOversightData.endTime);
      if (start && end) {
        let diff = (end - start) / 60000;
        if (diff < 0) diff += 24 * 60;
        const hours = Math.floor(diff / 60);
        const mins = Math.round(diff % 60);
        let result = "";
        if (hours > 0) result += `${hours} hr${hours > 1 ? "s" : ""} `;
        if (mins > 0) result += `${mins} min${mins > 1 ? "s" : ""}`;
        result = result.trim();
        setClinicalOversightData((prev) =>
          prev?.lengthOfTime !== result
            ? { ...prev, lengthOfTime: result }
            : prev,
        );
      }
    } else {
      setClinicalOversightData((prev) =>
        prev?.lengthOfTime !== "" ? { ...prev, lengthOfTime: "" } : prev,
      );
    }
  }, [clinicalOversightData?.beginTime, clinicalOversightData?.endTime]);

  useEffect(() => {
    if (id) {
      clinicalOversightService.getNotesById(id, {
        setResponse: setResponse,
        setLoading,
      });
    }
  }, [id]);
  useEffect(() => {
    if (response && id) {
      setClinicalOversightData(response?.data);
      setAdminSignature(response?.data?.adminSignature);
      setAdminDateSigned(response?.data?.adminDateSigned);
      setAdminSignedTime(response?.data?.adminSignedTime);
      setEmployeeSignature(response?.data?.employeeSignature);
      setEmployeeSignatureDate(response?.data?.employeeSignatureDate);
      setEmployeeSignatureTime(response?.data?.employeeSignatureTime);
      setSigners(response?.data?.signers);
      setSaveAsDraft(response?.data?.saveAsDraft || false);
      setEmployeeId(response?.data?.employeesInvolved);
      if (response?.data?.employeesInvolved) {
        const employeeIds = response?.data?.employeesInvolved?.map(
          (employee) => ({
            value: employee._id,
            label: `${employee.firstName} ${employee.lastName}`,
            accessId: employee?.ahcccsId,
            diagnosis: employee?.diagnosis,
          }),
        );
        setEmployeeId(employeeIds);
      }
      if (response?.data?.signatures) {
        loadSignaturesFromApi(response.data.signatures);
      }
    }
  }, [id, response, loadSignaturesFromApi]);
  useEffect(() => {
    employeeService.getEmployee({ setResponse: setData });
  }, []);
  const handleSubmit9 = async (e) => {
    e.preventDefault();
    const employeesInvolved = employeeId?.map(
      (employeeId) => employeeId?.value,
    );
    const payloadData = {
      ...clinicalOversightData,
      facilityId:
        typeof clinicalOversightData?.facilityId === "object"
          ? clinicalOversightData?.facilityId?._id || ""
          : clinicalOversightData?.facilityId || "",
      saveAsDraft,
      employeesInvolved,
      employeeSignature,
      employeeSignatureDate,
      employeeSignatureTime,
      adminSignature,
      adminDateSigned,
      adminSignedTime,
      signers: signers?.map((signer) => ({
        signerId: signer.value,
        name: signer.label,
        signature: "",
        dateSigned: "",
        signedTime: "",
      })),
      signatures,
    };
    const updatePayloadData = {
      ...clinicalOversightData,
      facilityId:
        typeof clinicalOversightData?.facilityId === "object"
          ? clinicalOversightData?.facilityId?._id || ""
          : clinicalOversightData?.facilityId || "",
      saveAsDraft,
      employeesInvolved,
      employeeSignature,
      employeeSignatureDate,
      employeeSignatureTime,
      adminSignature,
      adminDateSigned,
      adminSignedTime,
      signers,
      signatures,
    };
    if (id) {
      clinicalOversightService.update(id, updatePayloadData, {
        isAdmin: currentUser?.userType === ROLES.ADMIN,
        setLoading,
        successMsg: "Clinical Oversight Data created!",
        navigate,
      });
    } else
      clinicalOversightService.create(payloadData, {
        isAdmin: currentUser?.userType === ROLES.ADMIN,
        setLoading,
        successMsg: "Clinical Oversight Data created!",
        navigate,
      });
  };
  useEffect(() => {
    if (data) {
      const optionsData = (data?.data || []).filter(
        (i) => i.userType === ROLES.EMPLOYEE,
      );
      const options = (optionsData || [])
        ?.map((i) => ({
          value: i._id,
          label: fetchPaitentName(i),
        }))
        .filter((i) => i.value !== currentUser._id);
      setEmployeeOptions(options);
    }
  }, [currentUser._id, data]);
  const checkSign = useCallback(async () => {
    let signerIndex = signers?.findIndex?.(
      (signer, i) => signer.signerId === profileInfo._id,
    );
    let isSignerValid =
      signerIndex !== -1 && signers?.[signerIndex]?.signature?.length > 0;
    let isAdminConditionValid = profileInfo.userType === ROLES.ADMIN;
    let isEmployeeConditionValid =
      (response?.data?.employeeId === profileInfo?._id ||
        response?.data?.employeeId?._id === profileInfo?._id) &&
      response?.data?.employeeSignature?.length > 0;
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
    response?.data?.employeeId,
    response?.data?.employeeSignature?.length,
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
          ).includes("co") &&
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
          ).includes("co") &&
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
          ).includes("co") &&
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
    if (id) {
      checkSign();
    }
  }, [adminSignature, id, checkSign]);
  let signerIndex = signers?.findIndex?.(
    (signer, i) => signer.signerId === currentUser._id,
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
    if (signers?.[signerIndex]?.signerId === currentUser?._id) {
      setSignerSignature(sign);
    } else if (currentUser.userType === ROLES.EMPLOYEE) {
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
    } else if (currentUser.userType === ROLES.ADMIN) {
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
  return (
    <>
      {typedGuardDialog}
      {loading ? (
        <Loader />
      ) : (
        <>
          <AddSignature
            show={openAdmin}
            setValue={setAdminSignature}
            setDate={setAdminDateSigned}
            setTime={setAdminSignedTime}
          />

          <AddSignature
            show={open}
            setValue={(sign) => {
              response?.data?.employeeId === currentUser?._id ||
              response?.data?.employeeId?._id === currentUser?._id ||
              (!response?.data?.employeeId &&
                url === "/clinical-oversight" &&
                profileInfo?.userType === ROLES.EMPLOYEE)
                ? setEmployeeSignature(sign)
                : editSignHandler(sign);
            }}
            setDate={(date) => {
              response?.data?.employeeId === currentUser?._id ||
              response?.data?.employeeId?._id === currentUser?._id ||
              (!response?.data?.employeeId &&
                url === "/clinical-oversight" &&
                profileInfo?.userType === ROLES.EMPLOYEE)
                ? setEmployeeSignatureDate(date)
                : editDateHandler(date);
            }}
            setTime={(time) => {
              response?.data?.employeeId === currentUser?._id ||
              response?.data?.employeeId?._id === currentUser?._id ||
              (!response?.data?.employeeId &&
                url === "/clinical-oversight" &&
                profileInfo?.userType === ROLES.EMPLOYEE)
                ? setEmployeeSignatureTime(time)
                : editTimeHandler(time);
            }}
          />

          <NavWrapper title={"Clinical Oversight"} isArrow={true} />
          <Container className="full-width-container">
            <Form
              onSubmit={handleSubmit9}
              className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
            >
              <Card body className="mb-3">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">BHT Name</Form.Label>
                  {id ? (
                    employeeId && (
                      <MultiPatients
                        isClinical={true}
                        setValue={(val) => {
                          setEmployeeId(val);
                        }}
                        value={employeeId}
                      />
                    )
                  ) : (
                    <MultiPatients
                      isClinical={true}
                      setValue={(val) => {
                        setEmployeeId(val);
                      }}
                      value={employeeId}
                    />
                  )}
                </Form.Group>
                <div className="mb-3 w-full font-bold">
                  <Form.Label>Select Facility</Form.Label>
                  <Form.Select
                    disabled={!!id}
                    value={
                      typeof clinicalOversightData?.facilityId === "object"
                        ? clinicalOversightData?.facilityId?._id || ""
                        : clinicalOversightData?.facilityId || ""
                    }
                    onChange={(e) => {
                      const selectedFacility = facilitiesList?.find(
                        (fac) => fac._id === e.target.value,
                      );
                      if (selectedFacility) {
                        setClinicalOversightData({
                          ...clinicalOversightData,
                          facilityId: selectedFacility._id,
                          facilityAddress:
                            selectedFacility.address ||
                            selectedFacility.location ||
                            "",
                        });
                      } else {
                        setClinicalOversightData({
                          ...clinicalOversightData,
                          facilityId: "",
                          facilityAddress: "",
                        });
                      }
                    }}
                    className="mb-3"
                  >
                    <option value="">Select Facility</option>
                    {facilitiesList?.map((facility) => (
                      <option key={facility._id} value={facility._id}>
                        {facility.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Label>Facility Address</Form.Label>
                  <Form.Control
                    disabled={!!id}
                    type="text"
                    value={clinicalOversightData?.facilityAddress}
                    onChange={(e) =>
                      setClinicalOversightData({
                        ...clinicalOversightData,
                        facilityAddress: e.target.value,
                      })
                    }
                    placeholder="Enter Facility Address"
                  />
                </div>
                <div className="mb-3 w-full font-bold">
                  <Form.Label>Topic</Form.Label>
                  <Form.Control
                    type="text"
                    value={clinicalOversightData?.topic}
                    onChange={(e) =>
                      setClinicalOversightData({
                        ...clinicalOversightData,
                        topic: e.target.value,
                      })
                    }
                    placeholder="Enter topic"
                  />
                </div>
              </Card>
              <Card body className="mb-3">
                <Row>
                  <Col xs="12" lg="3">
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="w-full font-bold">
                        Date:
                      </Form.Label>
                      <DatePicker
                        selected={formatDateToMMDDYYYY(
                          clinicalOversightData?.date,
                        )}
                        onChange={(selectedDate) =>
                          setClinicalOversightData({
                            ...clinicalOversightData,
                            date: selectedDate?.toDateString(),
                          })
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              clinicalOversightData?.date
                                ? formatDateToMMDDYYYY(
                                    clinicalOversightData?.date,
                                  )
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs="12" lg="3">
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="w-full font-bold">
                        {" "}
                        Begin Time:
                      </Form.Label>

                      <CustomTimePicker
                        value={
                          clinicalOversightData?.beginTime
                            ? parseTimeStringToDate(
                                clinicalOversightData?.beginTime,
                              )
                            : null
                        }
                        onChange={(e, timeString) => {
                          setClinicalOversightData({
                            ...clinicalOversightData,
                            beginTime: timeString,
                          });
                        }}
                        use24Hours={hoursFormat === "HH:mm"}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs="12" lg="3">
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="w-full font-bold">
                        {" "}
                        End Time:
                      </Form.Label>

                      <CustomTimePicker
                        value={
                          clinicalOversightData?.endTime
                            ? parseTimeStringToDate(
                                clinicalOversightData?.endTime,
                              )
                            : null
                        }
                        onChange={(e, timeString) => {
                          setClinicalOversightData({
                            ...clinicalOversightData,
                            endTime: timeString,
                          });
                        }}
                        use24Hours={hoursFormat === "HH:mm"}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs="12" lg="3">
                    <Form.Group className="mb-3">
                      <Form.Label className="w-full font-bold">
                        {" "}
                        Length of Time:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Name"
                        autoFocus
                        onChange={(e) =>
                          setClinicalOversightData({
                            ...clinicalOversightData,
                            lengthOfTime: e.target.value,
                          })
                        }
                        value={clinicalOversightData?.lengthOfTime}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
              <Card body className="mb-3">
                <Row>
                  <Col xs="12" lg="6">
                    <Form.Group className="mb-3">
                      <Form.Label className="w-full font-bold">
                        {" "}
                        Conducted Via:
                      </Form.Label>
                      <CustomSelect
                        options={[
                          {
                            value: "1",
                            label:
                              " Teleconference with Audio Video Communications (Remote)",
                          },
                          {
                            value: "0",
                            label: "In Person",
                          },
                        ]}
                        onChange={(value) => {
                          if (value === "1") {
                            setClinicalOversightData({
                              ...clinicalOversightData,
                              conductedViaRemoteTeleConferenceWithAudioVideo: true,
                            });
                            return;
                          } else {
                            setClinicalOversightData({
                              ...clinicalOversightData,
                              conductedViaInPerson: true,
                            });
                          }
                        }}
                        value={
                          clinicalOversightData?.conductedViaRemoteTeleConferenceWithAudioVideo ===
                          true
                            ? [
                                "Teleconference with Audio Video Communications (Remote)",
                              ]
                            : clinicalOversightData?.conductedViaInPerson ===
                                true
                              ? ["In Person"]
                              : []
                        }
                        styleOpt={{
                          border: "1px solid #ccc",
                          padding: "4px",
                          borderRadius: "4px",
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs="12" lg="6">
                    <Form.Group className="mb-3">
                      <Form.Label className="w-full font-bold">
                        Select one of the following:
                      </Form.Label>

                      <CustomSelect
                        options={[
                          {
                            value: "in",
                            label: "Individual Clinical Oversight",
                          },
                          {
                            value: "group",
                            label: "Group Clinical Oversight",
                          },
                        ]}
                        onChange={(value) => {
                          if (value === "in") {
                            setClinicalOversightData({
                              ...clinicalOversightData,
                              clinicalOversightTypeIndividual: true,
                            });
                          } else {
                            setClinicalOversightData({
                              ...clinicalOversightData,
                              clinicalOversightTypeGroup: true,
                            });
                          }
                        }}
                        value={
                          clinicalOversightData?.clinicalOversightTypeIndividual ===
                          true
                            ? ["Individual Clinical Oversight"]
                            : clinicalOversightData?.clinicalOversightTypeGroup ===
                                true
                              ? ["Group Clinical Oversight"]
                              : []
                        }
                        styleOpt={{
                          border: "1px solid #ccc",
                          padding: "4px",
                          borderRadius: "4px",
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card>

              <Card body className="mb-3">
                <Row>
                  <Col xs="12" lg="12">
                    <Form.Label className="fw-bold">
                      Topic Addressed:
                    </Form.Label>
                    <Form.Group>
                      <Form.Check
                        type="checkbox"
                        label="Recognizing & Meeting the unique treatment needs of the residents served by the agency."
                        checked={
                          clinicalOversightData?.topicsAddressedUniqueTreatmentNeeds
                        }
                        onChange={(e) => {
                          setClinicalOversightData({
                            ...clinicalOversightData,
                            topicsAddressedUniqueTreatmentNeeds:
                              e.target.checked,
                          });
                        }}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Reviewing & discussing other topics that enhance the skills & knowledge of Staff Members"
                        checked={
                          clinicalOversightData?.topicsAddressedEnhancingSkills
                        }
                        onChange={(e) => {
                          setClinicalOversightData({
                            ...clinicalOversightData,
                            topicsAddressedEnhancingSkills: e.target.checked,
                          });
                        }}
                      />
                      <Form.Check
                        type="checkbox"
                        label="For a behavioral health technician providing a resident with an assessment or behavioral health treatment plan, determining whether an assessment or behavioral health treatment plan is complete and accurate and meets the resident’s treatments needs."
                        checked={
                          clinicalOversightData?.topicsAddressedAssessmentOrTreatmentPlan
                        }
                        onChange={(e) => {
                          setClinicalOversightData({
                            ...clinicalOversightData,
                            topicsAddressedAssessmentOrTreatmentPlan:
                              e.target.checked,
                          });
                        }}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Review of an individual staff training plan."
                        checked={
                          clinicalOversightData?.topicsAddressedStaffTrainingPlan
                        }
                        onChange={(e) => {
                          setClinicalOversightData({
                            ...clinicalOversightData,
                            topicsAddressedStaffTrainingPlan: e.target.checked,
                          });
                        }}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Assessing that staff has sufficient direction to perform job duties"
                        checked={
                          clinicalOversightData?.topicsAddressedJobDutiesDirection
                        }
                        onChange={(e) => {
                          setClinicalOversightData({
                            ...clinicalOversightData,
                            topicsAddressedJobDutiesDirection: e.target.checked,
                          });
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="mt-3 mb-3">
                      <Form.Label className="font-bold">
                        Clinical Oversight Summary:
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter Comments"
                        required
                        onChange={(e) => {
                          setClinicalOversightData({
                            ...clinicalOversightData,
                            additionalComments: e.target.value,
                          });
                        }}
                        value={clinicalOversightData?.additionalComments}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
              <Form.Group className="mt-3 mb-3">
                <Form.Label className="fw-bold">
                  Identified opportunities for staff training, as applicable:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={"Enter Text...."}
                  onChange={(e) => {
                    setClinicalOversightData({
                      ...clinicalOversightData,
                      opportunitiesForTraining: e.target.value,
                    });
                  }}
                  value={clinicalOversightData?.opportunitiesForTraining}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Staff Detail</Form.Label>
                <Card body className="mb-3">
                  <Form.Group>
                    <Form.Label className="fw-bold">BHP Name :</Form.Label>
                    <Form.Control
                      onChange={(e) => {
                        setClinicalOversightData({
                          ...clinicalOversightData,
                          bhpNameAndCredentials: e.target.value,
                        });
                      }}
                      value={clinicalOversightData?.bhpNameAndCredentials}
                      type="text"
                    ></Form.Control>
                  </Form.Group>
                </Card>
              </Form.Group>
              <Row>
                <Col xs={12} lg={6}>
                  <Button
                    type="button"
                    className={`theme-button ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                    onClick={() => {
                      if (id) {
                        setOpen(true);
                      } else {
                        if (currentUser.userType === ROLES.ADMIN)
                          setAdminOpen(true);
                      }
                      if (currentUser.userType === ROLES.EMPLOYEE)
                        setOpen(true);
                    }}
                  >
                    SAVED AND SIGNED
                  </Button>
                </Col>
                <Col xs={12} lg={6} className="text-right">
                  {signatureFormat({
                    sign:
                      employeeSignature || response?.data?.employeeSignature,
                    date:
                      employeeSignatureDate ||
                      response?.data?.employeeSignatureDate,
                    time:
                      employeeSignatureTime ||
                      response?.data?.employeeSignatureTime,
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
                        <div className="text-right" key={signer?.signerId}>
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

              <div className="signature-sections-inline mt-3">
                <SignatureNamesPanel
                  signatures={signatures}
                  onUpdate={updateSignature}
                  formHasTyped={hasTypedInForm}
                  onClearAllTyped={clearAllTyped}
                  roles={[
                    { role: "bht", label: "BHT" },
                    { role: "bhp", label: "BHP" },
                  ]}
                />
                <SignatureSection
                  role="bht"
                  label="BHT Signature"
                  variant="blue"
                  signature={signatures?.bht}
                  onUpdate={updateSignature}
                  externalName
                  signerNameOverride={signatures?.bht?.name || undefined}
                  formHasTyped={hasTypedInForm}
                  onClearAllTyped={clearAllTyped}
                />
                <SignatureSection
                  role="bhp"
                  label="BHP Signature"
                  variant="pink"
                  signature={signatures?.bhp}
                  onUpdate={updateSignature}
                  externalName
                  signerNameOverride={signatures?.bhp?.name || undefined}
                  formHasTyped={hasTypedInForm}
                  onClearAllTyped={clearAllTyped}
                />
                {/* <SignatureSection
                  role="resident"
                  label="Resident/Representative Signature"
                  variant="blue"
                  signature={signatures?.resident}
                  onUpdate={updateSignature}
                  signerNameOverride={
                    employeeId?.length > 0
                      ? employeeId.map((e) => e.label).join(", ")
                      : ""
                  }
                  formHasTyped={hasTypedInForm}
                  onClearAllTyped={clearAllTyped}
                /> */}
                {/* <SignatureSection
                  role="witness"
                  label="Witness Signature"
                  variant="yellow"
                  signature={signatures?.witness}
                  onUpdate={updateSignature}
                  externalName
                  formHasTyped={hasTypedInForm}
                  onClearAllTyped={clearAllTyped}
                /> */}
              </div>

              {!id && (
                <Row className="mt-3">
                  <Col xs={12}>
                    <Card body className="mb-3">
                      <Form.Label className="fw-bold">Participants:</Form.Label>
                      <MultiEmployee setValue={setSigners} value={signers} />
                    </Card>
                  </Col>
                </Row>
              )}

              <Row>
                <Col xs={12}>
                  <div className="employee-btn-joiner">
                    <button
                      className={`draft ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                      type="submit"
                      onClick={() => setSaveAsDraft(true)}
                    >
                      Save as Draft
                    </button>
                    <button
                      className={`employee_create_btn ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
                      type="submit"
                      disabled={
                        witnessIncomplete
                          ? true
                          : id
                            ? !isSubmitEnabled
                            : profileInfo?.userType === ROLES.EMPLOYEE
                              ? employeeSignature.length === 0
                              : false
                      }
                      onClick={() => setSaveAsDraft(false)}
                    >
                      SUBMIT
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Container>
        </>
      )}
    </>
  );
};
export default HOC({
  Wcomponenet: ClinicalOversight,
});
