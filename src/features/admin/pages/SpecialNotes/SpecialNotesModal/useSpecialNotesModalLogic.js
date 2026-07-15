/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState, useRef } from "react";
import { resolveAdminAssetPath } from "@/assets";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  specialNotesService,
  employeeService,
  facilityService,
} from "@/features/shared/services";
import { formatDateToMMDDYYYY, fetchPaitentName } from "@/utils/utils";
import { usePrint } from "@shared/hooks";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { ROLES } from "@/features/shared/constants";
import { showNotification } from "@/utils";
import { getPrimarySignatureDraft } from "@/store/signatureDraftStore";
import { applySavedSignatureFields } from "@/store/signatureDraftSlice";
import {
  MONTHS3,
  MONTH2,
  INITIAL_STAFF,
  createInitialFormState,
  createInitialItemCounts,
  createEmptyMonthState,
  INITIAL_SIGNATURE_STATE,
  INITIAL_UI_STATE,
  createFieldUpdater,
  LANDSCAPE_PRINT_PAGE_STYLE,
} from "./specialNotesFormState";

export const useSpecialNotesModalLogic = ({
  show,
  onHide,
  getAllData,
  setModalShow,
  vanEmergency,
  editStatus,
  setEditStatus,
  addContactBtn,
  currentUser,
  printRef,
  setStartDate,
  setEndDate,
  hoursFormat,
  setShow,
  handleHideAndDateReset,
}) => {
  const [uiState, setUiState] = useState(INITIAL_UI_STATE);
  const updateUiState = createFieldUpdater(setUiState);
  const {
    modalShow2,
    modalStartDate,
    modalEndDate,
    open,
    openAdmin,
    openSigner,
  } = uiState;
  const setModalShow2 = (value) => updateUiState("modalShow2", value);
  const setModalStartDate = (value) => updateUiState("modalStartDate", value);
  const setModalEndDate = (value) => updateUiState("modalEndDate", value);
  const setOpen = (value) => updateUiState("open", value);
  const setOpenAdmin = (value) => updateUiState("openAdmin", value);
  const setOpenSigner = (value) => updateUiState("openSigner", value);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    resolveAdminAssetPath("/Dashboard/contacts/user.png"),
  );
  const componentRef = useRef();
  const [signers, setSigners] = useState([]);
  const [signatureState, setSignatureState] = useState(INITIAL_SIGNATURE_STATE);
  const updateSignature = createFieldUpdater(setSignatureState);
  const {
    employeeSignature,
    employeeSignatureDate,
    employeeSignatureTime,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
  } = signatureState;
  const setEmployeeSignature = (value) =>
    updateSignature("employeeSignature", value);
  const setEmployeeSignatureDate = (value) =>
    updateSignature("employeeSignatureDate", value);
  const setEmployeeSignatureTime = (value) =>
    updateSignature("employeeSignatureTime", value);
  const setAdminSignature = (value) => updateSignature("adminSignature", value);
  const setAdminDateSigned = (value) =>
    updateSignature("adminDateSigned", value);
  const setAdminSignedTime = (value) =>
    updateSignature("adminSignedTime", value);
  const [patientDetail, setPatientDetail] = useState({});
  const [patientId, setPatientId] = useState("");
  const [residentName, setResidentName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
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

  useEffect(() => {
    if (editStatus && facilitiesList?.length > 0 && vanEmergency) {
      // Priority 1: Match by facilityId (most reliable - single source of truth)
      let matchedFac = null;
      const facId =
        typeof vanEmergency?.facilityId === "object" &&
        vanEmergency?.facilityId !== null
          ? vanEmergency?.facilityId?._id || vanEmergency?.facilityId
          : vanEmergency?.facilityId;

      if (facId && facilitiesList?.length > 0) {
        matchedFac = facilitiesList.find(
          (f) => String(f._id) === String(facId),
        );
      }

      // Priority 2: Fall back to address matching if facilityId is missing
      if (!matchedFac) {
        const savedLoc =
          vanEmergency?.location ||
          vanEmergency?.facilityAddress ||
          vanEmergency?.facititAddress ||
          vanEmergency?.data?.[vanEmergency?.data?.length - 1]
            ?.facilityAddress ||
          vanEmergency?.data?.[vanEmergency?.data?.length - 1]?.location;

        if (savedLoc) {
          matchedFac = facilitiesList.find(
            (f) => f.address === savedLoc || f.location === savedLoc,
          );
        }
      }

      if (matchedFac) {
        // Only set facilityId so the dropdown is populated correctly.
        // Do NOT overwrite the saved address — it is already initialized
        // from vanEmergency in each useState. The address should only
        // change when the user manually selects a different facility.
        setFormState((prev) => ({
          ...prev,
          facilityId: matchedFac._id,
        }));
        setFireDrill((prev) => ({
          ...prev,
          facilityId: matchedFac._id,
        }));
        setDisasterDrillData((prev) => ({
          ...prev,
          facilityId: matchedFac._id,
        }));
        setWeeklyVehicle((prev) => ({
          ...prev,
          facilityId: matchedFac._id,
        }));
        setFireman((prev) => ({
          ...prev,
          facilityId: matchedFac._id,
        }));
        setEmergencyData((prev) => ({
          ...prev,
          facilityId: matchedFac._id,
        }));
        setInfectiousData((prev) =>
          prev.map((item) => ({
            ...item,
            facilityId: matchedFac._id,
          })),
        );
        setDisasterPlanData((prev) => ({
          ...prev,
          facilityId: matchedFac._id,
        }));
        setQualityManagement((prev) => ({
          ...prev,
          facilityId: matchedFac._id,
        }));
        setVehicleInspectionData((prev) => ({
          ...prev,
          facilityId: matchedFac._id,
        }));
        setRefrigeratorData((prev) => ({
          ...prev,
          facilityId: matchedFac._id,
        }));
        setWaterData((prev) => ({
          ...prev,
          facilityId: matchedFac._id,
        }));
      }
    }
  }, [facilitiesList, editStatus, vanEmergency]);

  useEffect(() => {
    if (patientDetail) {
      setDateOfBirth(patientDetail?.dateOfBirth);
    }
  }, [patientDetail]);
  const checkSign = useCallback(async () => {
    let signerIndex = signers?.findIndex?.(
      (signer, i) => signer.signerId === currentUser._id,
    );
    let isSignerValid =
      signerIndex !== -1 && signers?.[signerIndex]?.signature?.length > 0;
    let isAdminConditionValid = currentUser.userType === ROLES.ADMIN;
    let isEmployeeConditionValid = employeeSignature?.length > 0;
    let signerGuadianIndex = signers?.findIndex?.((signer, i) =>
      currentUser.patientsAssigned?.includes(signer.signerId),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeSignature?.length, signers]);
  useEffect(() => {
    if (editStatus) {
      checkSign();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeSignature, adminSignature, checkSign]);
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        currentUser,
        currentUser,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(currentUser, currentUser),
    pageStyle: `
      @page {
        size: landscape !important;
        margin: 12mm 9mm!important;
      } 
      th {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }   
      .card {
        page-break-inside: avoid;
      }
      .view-details-grid {
        page-break-inside: avoid;
      }
    `,
  });
  const handlePrint1 = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        currentUser,
        currentUser,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(currentUser, currentUser),
    pageStyle: `
      @page {
        size: landscape !important;
        margin: 12mm 9mm!important;
      }
      th {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .card {
        page-break-inside: avoid;
      }
      .view-details-grid {
        page-break-inside: avoid;
      }
    `,
  });
  const handlePrint2 = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        currentUser,
        currentUser,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(currentUser, currentUser),
    pageStyle: `
        @page {
          size: landscape !important;
          margin: 12mm 9mm!important;
        }
       .lableTitle{
          page-break-before: always !important;
        }
       .card {
          page-break-inside: avoid;
        }
      `,
  });
  const print = usePrint(printRef, handlePrint);
  const print1 = usePrint(printRef, handlePrint1);
  const print2 = usePrint(printRef, handlePrint2);
  const filterApply = (hide) => {
    setStartDate(modalStartDate);
    setEndDate(modalEndDate);
    hide();
  };
  const [itemCounts] = useState(createInitialItemCounts(vanEmergency));
  const [formState, setFormState] = useState(
    createInitialFormState(vanEmergency, editStatus),
  );
  useEffect(() => {
    setEmployeeSignature(vanEmergency?.employeeSignature ?? "");
    setEmployeeSignatureDate(vanEmergency?.employeeSignatureDate ?? "");
    setEmployeeSignatureTime(vanEmergency?.employeeSignatureTime ?? "");
    setSigners(vanEmergency?.signers ?? []);
    setAdminSignature(vanEmergency?.adminSignature ?? "");
    setAdminDateSigned(vanEmergency?.adminDateSigned ?? "");
    setAdminSignedTime(vanEmergency?.adminSignedTime ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const months3 = MONTHS3;
  const handleDateChanger = (month, e) => {
    setFormState((prevState) => ({
      ...prevState,
      [`${month}Date`]: e,
    }));
  };
  const handleMonthChange = (itemName, month, value, itemQuantity) => {
    setFormState((prevState) => ({
      ...prevState,
      [itemName]: {
        ...prevState[itemName],
        [month]: value,
      },
    }));
  };
  const handleQuantityChangeSub = (itemName) => {
    setFormState((prevState) => ({
      ...prevState,
      [itemName]: {
        ...prevState[itemName],
        item: formState?.[itemName].item - 1,
      },
    }));
  };
  const handleQuantityChangeAdd = (itemName) => {
    setFormState((prevState) => ({
      ...prevState,
      [itemName]: {
        ...prevState[itemName],
        item: formState?.[itemName].item + 1,
      },
    }));
  };
  const handleStaffChange = (index, field, value) => {
    setFormState((prevState) => ({
      ...prevState,
      staff: prevState.staff.map((staffItem, idx) =>
        idx === index
          ? {
              ...staffItem,
              [field]: value,
            }
          : staffItem,
      ),
    }));
  };
  const handleStaffChange3 = (index, field, value) => {
    setFireman((prevState) => ({
      ...prevState,
      staff: prevState.staff.map((staffItem, idx) =>
        idx === index
          ? {
              ...staffItem,
              [field]: value,
            }
          : staffItem,
      ),
    }));
  };
  const addStaff = () => {
    setFormState((prevState) => ({
      ...prevState,
      staff: [
        ...prevState.staff,
        {
          ...INITIAL_STAFF,
        },
      ],
    }));
  };
  const removeaddStaff = (index) => {
    setFormState((prevState) => ({
      ...prevState,
      staff: prevState.staff.filter((_, i) => i !== index),
    }));
  };
  const addStaff3 = () => {
    setFireman((prevState) => ({
      ...prevState,
      staff: [
        ...prevState.staff,
        {
          ...INITIAL_STAFF,
        },
      ],
    }));
  };
  const removeaddStaff3 = (index) => {
    setFireman((prevState) => ({
      ...prevState,
      staff: prevState.staff.filter((_, i) => i !== index),
    }));
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (checklistData) {
      formState.firstAidChecklistData = checklistData;
    }
    const updatePayload = {
      ...formState,
      facilityId: formState?.facilityId?._id || formState?.facilityId || "",
      employeeSignature,
      employeeSignatureDate,
      employeeSignatureTime,
      adminSignature,
      adminDateSigned,
      adminSignedTime,
      signers,
    };
    const payload = {
      ...formState,
      facilityId: formState?.facilityId?._id || formState?.facilityId || "",
      employeeSignature,
      employeeSignatureDate,
      employeeSignatureTime,
      residentName: `${patientDetail?.firstName} ${patientDetail?.lastName}`,
      dateOfBirth: patientDetail?.dateOfBirth,
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
    };
    if (editStatus) {
      specialNotesService.updateFirstAidChecklist(
        vanEmergency?._id,
        updatePayload,
        {
          additionalFunctions: [
            getAllData,
            () => setModalShow(false),
            () => setModalShow2(false),
            () => setEditStatus(false),
          ],
        },
      );
    } else {
      specialNotesService.createFirstAidChecklist(payload, {
        isAdmin: currentUser.userType === ROLES.ADMIN,
        additionalFunctions: [
          () => setShow(false),
          () =>
            setFormState({
              date: "",
              location: "",
              AdhesiveStripBandages: {
                item: 0,
                ...createEmptyMonthState(),
              },
              AdhesiveTap: {
                item: 0,
                ...createEmptyMonthState(),
              },
              CPRMouthGuardShield: {
                item: 0,
                ...createEmptyMonthState(),
              },
              DisposableLatexGloves: {
                item: 0,
                ...createEmptyMonthState(),
              },
              NonStickSterilePads: {
                item: 0,
                ...createEmptyMonthState(),
              },
              RollerGauze: {
                item: 0,
                ...createEmptyMonthState(),
              },
              Scissors: {
                item: 0,
                ...createEmptyMonthState(),
              },
              SterileGuazeSquares: {
                item: 0,
                ...createEmptyMonthState(),
              },
              TriangularBandages: {
                item: 0,
                ...createEmptyMonthState(),
              },
              Tweezers: {
                item: 0,
                ...createEmptyMonthState(),
              },
              staff: [],
            }),
          getAllData,
          onHide,
        ],
      });
    }
  };
  const [refrigeratorData, setRefrigeratorData] = useState({
    facilityId: vanEmergency?.facilityId?._id || vanEmergency?.facilityId || "",
    date: vanEmergency?.date || "",
    time: "",
    location: vanEmergency?.location || "",
    temperature: vanEmergency?.temperature || [
      {
        date: "",
        temperature: "",
        initials: "",
      },
    ],
    savedSigned: "",
    savedDate: "",
    savedTime: "",
    saveAsDraft: true,
  });
  const handleTemperatureChange = (index, name, value) => {
    const newTemperatures = refrigeratorData.temperature.map((temp, i) => {
      if (i === index) {
        return {
          ...temp,
          [name]: value,
        };
      }
      return temp;
    });
    setRefrigeratorData((prevData) => ({
      ...prevData,
      temperature: newTemperatures,
    }));
  };
  const addTemperature = () => {
    setRefrigeratorData((prevData) => ({
      ...prevData,
      temperature: [
        ...prevData.temperature,
        {
          date: "",
          temperature: "",
          initials: "",
        },
      ],
    }));
  };
  const handleSubmitRef = async (e) => {
    e.preventDefault();
    applySavedSignatureFields(refrigeratorData, getPrimarySignatureDraft());
    const payload = {
      ...refrigeratorData,
      facilityId:
        refrigeratorData?.facilityId?._id || refrigeratorData?.facilityId || "",
      employeeSignature,
      employeeSignatureDate,
      employeeSignatureTime,
      residentName: `${patientDetail?.firstName} ${patientDetail?.lastName}`,
      dateOfBirth: patientDetail?.dateOfBirth,
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
    };
    specialNotesService.createRefrigeratorMonitoring(payload, {
      isAdmin: currentUser.userType === ROLES.ADMIN,
      additionalFunctions: [getAllData, () => setModalShow(false)],
    });
  };
  const handleSubmitRef2 = async (e) => {
    e.preventDefault();
    applySavedSignatureFields(refrigeratorData, getPrimarySignatureDraft());
    const updatePayload = {
      ...refrigeratorData,
      facilityId:
        refrigeratorData?.facilityId?._id || refrigeratorData?.facilityId || "",
      employeeSignature,
      employeeSignatureDate,
      employeeSignatureTime,
      signers,
      dateOfBirth: patientDetail?.dateOfBirth,
      adminSignature,
      adminDateSigned,
      adminSignedTime,
    };
    specialNotesService.updateRefrigeratorMonitoring(
      vanEmergency?._id,
      updatePayload,
      { additionalFunctions: [getAllData, () => setModalShow(false)] },
    );
  };
  const [waterData, setWaterData] = useState({
    facilityId: vanEmergency?.facilityId?._id || vanEmergency?.facilityId || "",
    name: vanEmergency?.name || "Water Temperature Log",
    location: vanEmergency?.location || "",
    temperatureLog: vanEmergency?.temperatureLog || [
      {
        date: "",
        kitchenSinkReading: "",
        restroomSinkReading: "",
      },
    ],
    savedSigned: "",
    savedDate: "",
    savedTime: "",
    saveAsDraft: false,
  });
  const handleWaterTemperatureChange = (index, name, value) => {
    const newTemperatures = waterData.temperatureLog.map((temp, i) => {
      if (i === index) {
        return {
          ...temp,
          [name]: value,
        };
      }
      return temp;
    });
    setWaterData((prevData) => ({
      ...prevData,
      temperatureLog: newTemperatures,
    }));
  };
  const addWaterTemperature = () => {
    waterData.temperatureLog.push({
      date: "",
      temperature: "",
      initials: "",
    });
    setWaterData((prevData) => ({
      ...prevData,
      temperatureLog: [...waterData?.temperatureLog],
    }));
  };
  const removeWaterTemp = (index) => {
    const temp = waterData.temperatureLog.filter((val, ind) => ind !== index);
    setWaterData((prev) => {
      return {
        ...prev,
        temperatureLog: temp,
      };
    });
  };
  const handleWaterTempSubmit = async (e) => {
    e.preventDefault();
    applySavedSignatureFields(waterData, getPrimarySignatureDraft());
    const payload = {
      ...waterData,
      facilityId: waterData?.facilityId?._id || waterData?.facilityId || "",
      employeeSignature,
      employeeSignatureDate,
      adminSignature,
      adminDateSigned,
      signers: signers?.map((signer) => ({
        signerId: signer.value,
        name: signer.label,
        signature: "",
        dateSigned: "",
        signedTime: "",
      })),
    };
    specialNotesService.createTemperatureLog(payload, {
      additionalFunctions: [getAllData, () => setModalShow(false)],
    });
  };
  const handleSubmitWaterTemp = async (e) => {
    e.preventDefault();
    applySavedSignatureFields(waterData, getPrimarySignatureDraft());
    const updatePayload = {
      ...waterData,
      facilityId: waterData?.facilityId?._id || waterData?.facilityId || "",
      employeeSignature,
      employeeSignatureDate,
      residentName: `${patientDetail?.firstName} ${patientDetail?.lastName}`,
      dateOfBirth: patientDetail?.dateOfBirth,
      adminSignature,
      adminDateSigned,
      signers,
    };
    specialNotesService.updateTemperatureLog(vanEmergency?._id, updatePayload, {
      additionalFunctions: [getAllData, () => setModalShow(false)],
    });
  };
  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, [selectedFile]);
  const month2 = MONTH2;
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [residentsOptions, setResidentsOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [residents, setResident] = useState([]);
  const getAllEmployeesAndResidents = () => {
    const fetchUsers =
      currentUser?.userType === ROLES.ADMIN
        ? specialNotesService.getAdminUsers
        : employeeService.getUsers;
    fetchUsers({
      setLoading,
      setResponse: (resData) => {
        if (resData?.data) {
          const filteredEmployeeData = resData.data.filter(
            (item) => item.userType === ROLES.EMPLOYEE,
          );
          const filteredResidentData = resData.data.filter(
            (item) => item.userType === ROLES.PATIENT,
          );
          setResident(filteredResidentData);
          setEmployeeOptions(
            filteredEmployeeData.map((item) => ({
              value: item._id,
              label: fetchPaitentName(item),
            })),
          );
          setResidentsOptions(
            filteredResidentData.map((item) => ({
              value: item._id,
              label: fetchPaitentName(item),
            })),
          );
        } else {
          setResident([]);
          setEmployeeOptions([]);
          setResidentsOptions([]);
        }
      },
    });
  };
  const [checklistData, setChecklistData] = useState(
    vanEmergency?.firstAidChecklistData || [],
  );
  const addRow = () => {
    setChecklistData([
      ...checklistData,
      {
        name: "",
        item: 0,
        jan: "None",
        feb: "None",
        mar: "None",
        Apr: "None",
        May: "None",
        Jun: "None",
        Jul: "None",
        Aug: "None",
        Sept: "None",
        Oct: "None",
        Nov: "None",
        Dec: "None",
      },
    ]);
  };
  const handleCountChangexyz = (index, newValue) => {
    const newData = [...checklistData];
    newData[index].item = newValue;
    setChecklistData(newData);
  };
  const deleteRow = () => {
    if (checklistData.length > 0) {
      const newData = [...checklistData];
      newData.pop();
      setChecklistData(newData);
    }
  };
  const handleMonthChangexyz = (index, month, value) => {
    const newData = [...checklistData];
    newData[index][month] = value;
    setChecklistData(newData);
  };
  useEffect(() => {
    getAllEmployeesAndResidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [fireDrill, setFireDrill] = useState({
    facilityId: vanEmergency?.facilityId?._id || vanEmergency?.facilityId || "",
    shiftFrom: vanEmergency?.shiftFrom || "",
    shiftTo: vanEmergency?.shiftTo || "",
    residentsInvolved: vanEmergency?.residentsInvolved || [],
    facititAddress: vanEmergency?.facititAddress || "",
    date: vanEmergency?.date || "",
    startTime: vanEmergency?.startTime || "",
    endTime: vanEmergency?.endTime || "",
    shift: vanEmergency?.shift || "",
    evacuationPersonConduct: vanEmergency?.evacuationPersonConduct || "",
    evacuationParticipatingEmployee:
      vanEmergency?.evacuationParticipatingEmployee || [],
    residentsAssistanceEmployee:
      vanEmergency?.residentsAssistanceEmployee || [],
    noOfOccupantsEvacuated: vanEmergency?.noOfOccupantsEvacuated || 0,
    fireAlaramActivationMethod: vanEmergency?.fireAlaramActivationMethod || "",
    totalTimeOfEvacuationDrill: vanEmergency?.totalTimeOfEvacuationDrill || "",
    unusualConditionText: vanEmergency?.unusualConditionText || "",
    condition: vanEmergency?.condition || "",
    problemEncounteredDuringEvacuationDrill:
      vanEmergency?.problemEncounteredDuringEvacuationDrill || "",
    recommendations: vanEmergency?.recommendations || "",
    planAction: vanEmergency?.planAction || "",
    signatureofPersonCompletingDrill:
      vanEmergency?.signatureofPersonCompletingDrill || "",
  });
  const [counte, setCounte] = useState(fireDrill?.noOfOccupantsEvacuated || 0);
  const submitHandler3 = async (e) => {
    e.preventDefault();
    if (counte) fireDrill.noOfOccupantsEvacuated = counte;
    if (editStatus) {
      const updatedPayload = {
        ...fireDrill,
        facilityId: fireDrill?.facilityId?._id || fireDrill?.facilityId || "",
        signers,
        residentName: `${patientDetail?.firstName} ${patientDetail?.lastName}`,
        dateOfBirth: patientDetail?.dateOfBirth,
        employeeSignature,
        employeeSignatureDate,
        employeeSignatureTime,
        adminSignature,
        adminDateSigned,
        adminSignedTime,
      };
      specialNotesService.updateEvacuationAndFireDrill(
        vanEmergency?._id,
        updatedPayload,
        {
          additionalFunctions: [
            () => {
              const sig = getPrimarySignatureDraft();
              if (sig.staffLabel) {
                fireDrill.signatureofPersonCompletingDrill = sig.staffLabel;
              }
            },
            getAllData,
            () => setModalShow(false),
          ],
        },
      );
    } else {
      fireDrill.signatureofPersonCompletingDrill =
        getPrimarySignatureDraft().staffLabel;
      const payload = {
        ...fireDrill,
        facilityId: fireDrill?.facilityId?._id || fireDrill?.facilityId || "",
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
      };
      specialNotesService.createEvacuationAndFireDrill(payload, {
        isAdmin: currentUser.userType === ROLES.ADMIN,
        additionalFunctions: [getAllData, () => setModalShow(false)],
      });
    }
  };
  const [disasterDrillData, setDisasterDrillData] = useState({
    facilityId: vanEmergency?.facilityId?._id || vanEmergency?.facilityId || "",
    shiftFrom: vanEmergency?.shiftFrom || "",
    shiftTo: vanEmergency?.shiftTo || "",
    facilityAddress: vanEmergency?.facilityAddress || "",
    date: vanEmergency?.date || "",
    tornado: vanEmergency?.tornado || false,
    structureDamage: vanEmergency?.structureDamage || false,
    fire: vanEmergency?.fire || false,
    storm: vanEmergency?.storm || false,
    earthQuake: vanEmergency?.earthQuake || false,
    bombThreat: vanEmergency?.bombThreat || false,
    terroristAct: vanEmergency?.terroristAct || false,
    other: vanEmergency?.other || false,
    otherDetailsData: vanEmergency?.otherDetailsData || "",
    beginTime: vanEmergency?.beginTime || "",
    endTime: vanEmergency?.endTime || "",
    totalTime: vanEmergency?.totalTime || "",
    staffPresent: vanEmergency?.staffPresent || [],
    contactManagerCoordinator: vanEmergency?.contactManagerCoordinator,
    was911Called: vanEmergency?.was911Called || false,
    extinguisherTaken: vanEmergency?.extinguisherTaken || false,
    relocatedTheResidents: vanEmergency?.relocatedTheResidents || "",
    relocatedTheResidentsData: vanEmergency?.relocatedTheResidentsData || "",
    recommendations: vanEmergency?.recommendations || "",
    residentMedication: vanEmergency?.residentMedication || false,
    waterFoodAccessible: vanEmergency?.waterFoodAccessible || false,
    residentsAccounted: vanEmergency?.residentsAccounted || "",
    handleTheDisaster: vanEmergency?.handleTheDisaster || "",
    commentsConcerns: vanEmergency?.commentsConcerns || "",
    title: vanEmergency?.title || "",
    personConductingTheDisasterDrill:
      vanEmergency?.personConductingTheDisasterDrill || "",
    conducatingDate: vanEmergency?.conducatingDate || "",
    conducatingName: vanEmergency?.conducatingName || "",
    anyInjuries: vanEmergency?.anyInjuries,
  });
  const handleSubmit4 = async (event) => {
    const updatePayload = {
      ...disasterDrillData,
      facilityId:
        disasterDrillData?.facilityId?._id ||
        disasterDrillData?.facilityId ||
        "",
      employeeSignature,
      employeeSignatureDate,
      employeeSignatureTime,
      signers,
      dateOfBirth: patientDetail?.dateOfBirth,
      adminSignature,
      adminDateSigned,
      adminSignedTime,
    };
    const payload = {
      ...disasterDrillData,
      facilityId:
        disasterDrillData?.facilityId?._id ||
        disasterDrillData?.facilityId ||
        "",
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
    };
    event.preventDefault();
    if (editStatus) {
      specialNotesService.updateDisasterDrill(
        vanEmergency?._id,
        updatePayload,
        { additionalFunctions: [getAllData, onHide] },
      );
    } else {
      specialNotesService.createDisasterDrill(payload, {
        isAdmin: currentUser.userType === ROLES.ADMIN,
        additionalFunctions: [getAllData, () => setModalShow(false)],
      });
    }
  };
  const [weeklyVehicle, setWeeklyVehicle] = useState({
    facilityId: vanEmergency?.facilityId?._id || vanEmergency?.facilityId || "",
    facilityAddress: vanEmergency?.facilityAddress || "",
    site: vanEmergency?.site || "",
    date: vanEmergency?.date || "",
    year: vanEmergency?.year || "",
    make: vanEmergency?.make || "",
    model: vanEmergency?.model || "",
    vehicleLicensePlate: vanEmergency?.vehicleLicensePlate || "",
    lights: {
      highBeam: vanEmergency?.lights?.highBeam || false,
      lowBeam: vanEmergency?.lights?.lowBeam || false,
      brakeLights: vanEmergency?.lights?.brakeLights || false,
      emergencyLights: vanEmergency?.lights?.emergencyLights || false,
      rightLeftFrontTurnSignal:
        vanEmergency?.lights?.rightLeftFrontTurnSignal || false,
      rightLeftBackTurnSignal:
        vanEmergency?.lights?.rightLeftBackTurnSignal || false,
      rightLeftTailLight: vanEmergency?.lights?.rightLeftTailLight || false,
      rightLeftEmergencyLight:
        vanEmergency?.lights?.rightLeftEmergencyLight || false,
      rightLeftFrontDayRunning:
        vanEmergency?.lights?.rightLeftFrontDayRunning || false,
      rightLeftBackDayRunning:
        vanEmergency?.lights?.rightLeftBackDayRunning || false,
    },
    glass: {
      windshield: vanEmergency?.glass?.windshield || false,
      rear: vanEmergency?.glass?.rear || false,
      rightLeftFront: vanEmergency?.glass?.rightLeftFront || false,
      rightLeftMiddle: vanEmergency?.glass?.rightLeftMiddle || false,
      rightLeftBack: vanEmergency?.glass?.rightLeftBack || false,
    },
    fluidsAndLubricants: {
      fuel: vanEmergency?.fluidsAndLubricants?.fuel || false,
      engineOil: vanEmergency?.fluidsAndLubricants?.engineOil || false,
      coolantFluid: vanEmergency?.fluidsAndLubricants?.coolantFluid || false,
      powerSteeringFluid:
        vanEmergency?.fluidsAndLubricants?.powerSteeringFluid || false,
      brakeFluid: vanEmergency?.fluidsAndLubricants?.brakeFluid || false,
      clutchOil: vanEmergency?.fluidsAndLubricants?.clutchOil || false,
      batteryFluid: vanEmergency?.fluidsAndLubricants?.batteryFluid || false,
      windshieldWasherFluid:
        vanEmergency?.fluidsAndLubricants?.windshieldWasherFluid || false,
      water: vanEmergency?.fluidsAndLubricants?.water || false,
    },
    tires: {
      spare: vanEmergency?.tires?.spare || false,
      rightLeftFront: vanEmergency?.tires?.rightLeftFront || false,
      rightLeftBack: vanEmergency?.tires?.rightLeftBack || false,
      jackAndWrench: vanEmergency?.tires?.jackAndWrench || false,
    },
    mirrors: {
      rightLeftMirror: vanEmergency?.tires?.rightLeftMirror || false,
      middleInterior: vanEmergency?.tires?.middleInterior || false,
    },
    emergencyEquipment: {
      firstAidKit: vanEmergency?.emergencyEquipment?.firstAidKit || false,
      gloves: vanEmergency?.emergencyEquipment?.gloves || false,
      redTriangles: vanEmergency?.emergencyEquipment?.redTriangles || false,
      flashlight: vanEmergency?.emergencyEquipment?.flashlight || false,
      water: vanEmergency?.emergencyEquipment?.water || false,
    },
    general: {
      wiperBladesMotor: vanEmergency?.general?.wiperBladesMotor || false,
      horn: vanEmergency?.general?.horn || false,
      heater: vanEmergency?.general?.heater || false,
      airConditioner: vanEmergency?.general?.airConditioner || false,
      seatBelts: vanEmergency?.general?.seatBelts || false,
      hose: vanEmergency?.general?.hose || false,
      driveBelt: vanEmergency?.general?.driveBelt || false,
      battery: vanEmergency?.general?.battery || false,
    },
    staffName: "",
    staffSignature: "",
    inspectionDate: "",
  });
  const [fireman, setFireman] = useState({
    facilityId: vanEmergency?.facilityId?._id || vanEmergency?.facilityId || "",
    date: vanEmergency?.date || formatDateToMMDDYYYY(new Date()),
    location: vanEmergency?.location || "",
    alaramDate: "",
    alaram: vanEmergency?.alaram || [
      {
        id: 1,
        working: "",
      },
    ],
    extinguisher: vanEmergency?.extinguisher || [
      {
        id: 1,
        working: "",
        date: "",
      },
    ],
    staff: vanEmergency?.staff || [INITIAL_STAFF],
  });
  const handleAddAlarm = () => {
    const newId = fireman.alaram.length + 1;
    setFireman((prevState) => ({
      ...prevState,
      alaram: [
        ...prevState.alaram,
        {
          id: newId,
          working: "",
        },
      ],
    }));
  };
  const handleAddExtinguisher = () => {
    const newId = fireman?.extinguisher.length + 1;
    setFireman((prevState) => ({
      ...prevState,
      extinguisher: [
        ...prevState.extinguisher,
        {
          id: newId,
          working: "",
          date: "",
        },
      ],
    }));
  };
  const handleAlarmChange = (id, field, value) => {
    const updatedAlaram = fireman?.alaram.map((alarm) => {
      if (alarm.id === id) {
        return {
          ...alarm,
          [field]: value,
        };
      }
      return alarm;
    });
    setFireman((prevState) => ({
      ...prevState,
      alaram: updatedAlaram,
    }));
  };
  const handleExtinguisherChange = (id, field, value) => {
    const updatedExtinguishers = fireman.extinguisher.map((extinguisher) => {
      if (extinguisher.id === id) {
        return {
          ...extinguisher,
          [field]: value,
        };
      }
      return extinguisher;
    });
    setFireman((prevState) => ({
      ...prevState,
      extinguisher: updatedExtinguishers,
    }));
  };
  const handleSubmit51 = async (e) => {
    e.preventDefault();
    const updatePayload = {
      ...fireman,
      facilityId: fireman?.facilityId?._id || fireman?.facilityId || "",
      employeeSignature,
      employeeSignatureDate,
      employeeSignatureTime,
      adminSignature,
      adminDateSigned,
      adminSignedTime,
      signers,
    };
    const payload = {
      ...fireman,
      facilityId: fireman?.facilityId?._id || fireman?.facilityId || "",
      employeeSignature,
      employeeSignatureDate,
      employeeSignatureTime,
      residentName: `${patientDetail?.firstName} ${patientDetail?.lastName}`,
      dateOfBirth: patientDetail?.dateOfBirth,
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
    };
    if (editStatus) {
      specialNotesService.updateFireEquipmentMonitoring(
        vanEmergency?._id,
        updatePayload,
        { additionalFunctions: [getAllData, onHide] },
      );
    } else {
      specialNotesService.createFireEquipmentMonitoring(payload, {
        isAdmin: currentUser.userType === ROLES.ADMIN,
        additionalFunctions: [getAllData, onHide],
      });
    }
  };
  const handleSubmit5 = async (event) => {
    event.preventDefault();
    if (editStatus) {
      const sig = getPrimarySignatureDraft();
      if (sig.staffLabel) {
        weeklyVehicle.staffName = sig.staffLabel;
      }
      const updatePayload = {
        ...weeklyVehicle,
        facilityId:
          weeklyVehicle?.facilityId?._id || weeklyVehicle?.facilityId || "",
        employeeSignature,
        employeeSignatureDate,
        employeeSignatureTime,
        signers,
        dateOfBirth: patientDetail?.dateOfBirth,
        adminSignature,
        adminDateSigned,
        adminSignedTime,
      };
      specialNotesService.updateWeeklyVehicleInspection(
        vanEmergency?._id,
        updatePayload,
        { additionalFunctions: [getAllData, () => setModalShow(false)] },
      );
    } else {
      weeklyVehicle.staffName = getPrimarySignatureDraft().staffLabel;
      const payload = {
        ...weeklyVehicle,
        facilityId:
          weeklyVehicle?.facilityId?._id || weeklyVehicle?.facilityId || "",
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
      };
      specialNotesService.createWeeklyVehicleInspection(payload, {
        additionalFunctions: [getAllData, () => setModalShow(false)],
      });
    }
  };
  const [emergencyData, setEmergencyData] = useState({
    facilityId: vanEmergency?.facilityId?._id || vanEmergency?.facilityId || "",
    residentName: vanEmergency?.residentName || "",
    dateOfBirth: vanEmergency?.dateOfBirth || "",
    facilityAddress: vanEmergency?.facilityAddress || "",
    location: vanEmergency?.location || vanEmergency?.facilityAddress || "",
    facilityPhoneNumber: vanEmergency?.facilityPhoneNumber || "",
    guardianInformation: vanEmergency?.guardianInformation || "",
    BHRFAdministratorInformation:
      vanEmergency?.BHRFAdministratorInformation || "",
    pharamacyHospital: vanEmergency?.pharamacyHospital || "",
    pharmacyInformation: vanEmergency?.pharmacyInformation || "",
    caseManagerInformation: vanEmergency?.caseManagerInformation || "",
    preferredHospital: vanEmergency?.preferredHospital || "",
    allergies: vanEmergency?.allergies || "",
    staffMemberName: vanEmergency?.staffMemberName || "",
    staffMemberPhoneNumber: vanEmergency?.staffMemberPhoneNumber || "",
  });

  useEffect(() => {
    if (patientDetail && Object.keys(patientDetail).length > 0) {
      const facId =
        patientDetail?.facilityId?._id || patientDetail?.facilityId || "";
      const facAddress =
        patientDetail?.facilityAddress || patientDetail?.location || "";
      setEmergencyData((prev) => ({
        ...prev,
        facilityId: facId,
        location: facAddress,
        facilityAddress: facAddress,
      }));
    }
  }, [patientDetail]);
  const submitHandler5 = async (e) => {
    const updatePayload = {
      ...emergencyData,
      facilityId:
        emergencyData?.facilityId?._id || emergencyData?.facilityId || "",
      employeeSignature,
      employeeSignatureDate,
      employeeSignatureTime,
      signers,
      dateOfBirth: patientDetail?.dateOfBirth,
      patientId:
        patientId ||
        patientDetail?._id ||
        vanEmergency?.patientId?._id ||
        vanEmergency?.patientId,
      adminSignature,
      adminDateSigned,
      adminSignedTime,
    };
    const payload = {
      ...emergencyData,
      facilityId:
        emergencyData?.facilityId?._id || emergencyData?.facilityId || "",
      employeeSignature,
      employeeSignatureDate,
      employeeSignatureTime,
      residentName: `${patientDetail?.firstName} ${patientDetail?.lastName}`,
      dateOfBirth: patientDetail?.dateOfBirth,
      patientId:
        patientId ||
        patientDetail?._id ||
        vanEmergency?.patientId?._id ||
        vanEmergency?.patientId,
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
    };
    e.preventDefault();
    if (editStatus) {
      specialNotesService.updateVanEmergencyInformation(
        vanEmergency?._id,
        updatePayload,
        { additionalFunctions: [getAllData, () => setModalShow(false)] },
      );
    } else {
      specialNotesService.createVanEmergencyInformation(payload, {
        isAdmin: currentUser.userType === ROLES.ADMIN,
        additionalFunctions: [getAllData, onHide],
      });
    }
  };
  const [infectiousData, setInfectiousData] = useState(
    vanEmergency?.data || [
      {
        facilityId:
          vanEmergency?.facilityId?._id || vanEmergency?.facilityId || "",
        facilityAddress: "",
        employeeName: "",
        dateOfDataCollection: "",
        typeOfDataCollection: "",
        issuesNoted: "",
        dataCollectedBy: "",
      },
    ],
  );
  const handleInputChange6 = (index, field, value) => {
    const newData = [...infectiousData];
    newData[index][field] = value;
    setInfectiousData(newData);
  };
  const handleAddRow = () => {
    setInfectiousData([
      ...infectiousData,
      {
        facilityId:
          vanEmergency?.facilityId?._id || vanEmergency?.facilityId || "",
        employeeName: "",
        facilityAddress: "",
        dateOfDataCollection: "",
        typeOfDataCollection: "",
        issuesNoted: "",
        dataCollectedBy: "",
      },
    ]);
  };
  const handleDeleteRow = (index) => {
    const newData = [...infectiousData];
    newData.splice(index, 1);
    setInfectiousData(newData);
  };
  const handleSubmit6 = async (e) => {
    e.preventDefault();
    const updatePayload = {
      data: infectiousData.map((item) => ({
        ...item,
        facilityId: item.facilityId?._id || item.facilityId || "",
      })),
      employeeSignature,
      employeeSignatureDate,
      employeeSignatureTime,
      signers,
      dateOfBirth: patientDetail?.dateOfBirth,
      adminSignature,
      adminDateSigned,
      adminSignedTime,
    };
    const payload = {
      data: infectiousData.map((item) => ({
        ...item,
        facilityId: item.facilityId?._id || item.facilityId || "",
      })),
      employeeSignature,
      employeeSignatureDate,
      employeeSignatureTime,
      residentName: `${patientDetail?.firstName} ${patientDetail?.lastName}`,
      dateOfBirth: patientDetail?.dateOfBirth,
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
    };
    if (editStatus) {
      specialNotesService.updateInfectiousData(
        vanEmergency?._id,
        updatePayload,
        { additionalFunctions: [getAllData, onHide] },
      );
    } else {
      specialNotesService.createInfectiousData(payload, {
        isAdmin: currentUser.userType === ROLES.ADMIN,
        additionalFunctions: [() => setModalShow(false), getAllData, onHide],
      });
    }
  };
  const [disasterPlanData, setDisasterPlanData] = useState({
    facilityId: vanEmergency?.facilityId?._id || vanEmergency?.facilityId || "",
    adminId: vanEmergency?.adminId || "",
    facilityAddress: vanEmergency?.facilityAddress || "",
    date: vanEmergency?.date || "",
    shiftTime: vanEmergency?.shiftTime || "",
    shiftFrom: vanEmergency?.shiftFrom || "",
    shiftTo: vanEmergency?.shiftTo || "",
    participants: vanEmergency?.participants || [],
    critiqueProblemsIdentified: vanEmergency?.critiqueProblemsIdentified || "",
    recommendationsForImprovement:
      vanEmergency?.recommendationsForImprovement || "",
    nextReviewDate: vanEmergency?.nextReviewDate || "",
    reviewCompletedByName: vanEmergency?.reviewCompletedByName || "",
    reviewCompletedBySignature: vanEmergency?.reviewCompletedBySignature || "",
    reviewCompletedByDate: vanEmergency?.reviewCompletedByDate || "",
  });
  const handleSubmit7 = async (e) => {
    e.preventDefault();
    if (editStatus) {
      const sig = getPrimarySignatureDraft();
      if (sig.staffLabel) {
        disasterPlanData.reviewCompletedBySignature = sig.staffLabel;
      }
      const updatePayload = {
        ...disasterPlanData,
        facilityId:
          disasterPlanData?.facilityId?._id ||
          disasterPlanData?.facilityId ||
          "",
        employeeSignature,
        employeeSignatureDate,
        employeeSignatureTime,
        signers,
        dateOfBirth: patientDetail?.dateOfBirth,
        adminSignature,
        adminDateSigned,
        adminSignedTime,
      };
      specialNotesService.updateDisasterPlanReview(
        vanEmergency?._id,
        updatePayload,
        { additionalFunctions: [getAllData, () => setModalShow(false)] },
      );
    } else {
      disasterPlanData.reviewCompletedBySignature =
        getPrimarySignatureDraft().staffLabel;
      const payload = {
        ...disasterPlanData,
        facilityId:
          disasterPlanData?.facilityId?._id ||
          disasterPlanData?.facilityId ||
          "",
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
      };
      specialNotesService.createDisasterPlanReview(payload, {
        isAdmin: currentUser.userType === ROLES.ADMIN,
        additionalFunctions: [getAllData, () => setModalShow(false)],
      });
    }
  };
  const [qualitymanagement, setQualityManagement] = useState({
    facilityId: vanEmergency?.facilityId?._id || vanEmergency?.facilityId || "",
    facilityAddress: vanEmergency?.facilityAddress || "",
    adminId: vanEmergency?.adminId || "",
    dateOfBirth: vanEmergency?.dateOfBirth || "",
    month: vanEmergency?.month || "",
    year: vanEmergency?.year || "",
    areasImproved: vanEmergency?.areasImproved || "",
    dataCollectionPatientChart: vanEmergency?.dataCollectionPatientChart || "",
    dataCollectionIncidentReports:
      vanEmergency?.dataCollectionIncidentReports || 0,
    dataCollectionAdmissions: vanEmergency?.dataCollectionAdmissions || 0,
    dataCollectionDischarges: vanEmergency?.dataCollectionDischarges || 0,
    dataCollectionClientsVisitedHospital:
      vanEmergency?.dataCollectionClientsVisitedHospital || 0,
    dataCollectionFalls: vanEmergency?.dataCollectionFalls || 0,
    dataCollectionMedicationErrors:
      vanEmergency?.dataCollectionMedicationErrors || 0,
    dataCollectionInfectiousDisease:
      vanEmergency?.dataCollectionInfectiousDisease || 0,
    dataCollectionClientsRefusingMedications:
      vanEmergency?.dataCollectionClientsRefusingMedications || 0,
    dataCollectionClientsRefusingAppointments:
      vanEmergency?.dataCollectionClientsRefusingAppointments || 0,
    dataCollectionOpioidMedicationRelatedDeath:
      vanEmergency?.dataCollectionOpioidMedicationRelatedDeath || 0,
    dataCollectionOpioidMedicationError:
      vanEmergency?.dataCollectionOpioidMedicationError || 0,
    dataCollectionExperiencingRapidWeightLossGain:
      vanEmergency?.dataCollectionExperiencingRapidWeightLossGain || 0,
    dataCollectionResidentsReportedRelapses:
      vanEmergency?.dataCollectionResidentsReportedRelapses || 0,
    dataCollectionReferredHigherLowerLevelCare:
      vanEmergency?.dataCollectionReferredHigherLowerLevelCare || 0,
    dataCollectionResidentsReportingLossPersonalProperty:
      vanEmergency?.dataCollectionResidentsReportingLossPersonalProperty || 0,
    areasNonCompliance: vanEmergency?.areasNonCompliance || "",
    trends: vanEmergency?.trends || "",
    staffName: vanEmergency?.staffName || "",
    staffSignature: vanEmergency?.staffSignature || "",
    type: vanEmergency?.type || "",
  });
  const [formGroups, setFormGroups] = useState(
    vanEmergency?.moreData || [
      {
        text: "",
        count: "",
      },
    ],
  );
  const handleSubmit8 = async (e) => {
    e.preventDefault();
    const updatePayload = {
      ...qualitymanagement,
      facilityId:
        qualitymanagement?.facilityId?._id ||
        qualitymanagement?.facilityId ||
        "",
      employeeSignature,
      employeeSignatureDate,
      employeeSignatureTime,
      signers,
      dateOfBirth: patientDetail?.dateOfBirth,
      adminSignature,
      adminDateSigned,
      adminSignedTime,
    };
    const payload = {
      ...qualitymanagement,
      facilityId:
        qualitymanagement?.facilityId?._id ||
        qualitymanagement?.facilityId ||
        "",
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
    };
    if (editStatus) {
      specialNotesService.updateQualityManagement(
        vanEmergency?._id,
        updatePayload,
        { additionalFunctions: [getAllData, () => setModalShow(false)] },
      );
    } else {
      qualitymanagement.staffName = getPrimarySignatureDraft().staffLabel;
      specialNotesService.createQualityManagement(payload, {
        isAdmin: currentUser.userType === ROLES.ADMIN,
        additionalFunctions: [getAllData, () => setModalShow(false)],
      });
    }
  };
  const [vehicleInspectionData, setVehicleInspectionData] = useState({
    facilityId: vanEmergency?.facilityId?._id || vanEmergency?.facilityId || "",
    adminId: vanEmergency?.adminId || "",
    date: vanEmergency?.date || "",
    month: vanEmergency?.month || "",
    year: vanEmergency?.year || "",
    vehicle: vanEmergency?.vehicle || "",
    dateOfLastService: vanEmergency?.dateOfLastService || "",
    dateOfNextService: vanEmergency?.dateOfNextService || "",
    itemsLights: vanEmergency?.itemsLights || "",
    itemsLightsComment: vanEmergency?.itemsLightsComment || "",
    itemsTurnSignals: vanEmergency?.itemsTurnSignals || "",
    itemsTurnSignalsComment: vanEmergency?.itemsTurnSignalsComment || "",
    itemsHorn: vanEmergency?.itemsHorn || "",
    itemsHornComment: vanEmergency?.itemsHornComment || "",
    itemsWipers: vanEmergency?.itemsWipers || "",
    itemsWipersComment: vanEmergency?.itemsWipersComment || "",
    itemsAC: vanEmergency?.itemsAC || "",
    itemsACComment: vanEmergency?.itemsACComment || "",
    itemsTires: vanEmergency?.itemsTires || "",
    itemsTiresComment: vanEmergency?.itemsTiresComment || "",
    itemsSteering: vanEmergency?.itemsSteering || "",
    itemsSteeringComment: vanEmergency?.itemsSteeringComment || "",
    itemsFluidLeaksGasOdor: vanEmergency?.itemsFluidLeaksGasOdor || "",
    itemsFluidLeaksGasOdorComment:
      vanEmergency?.itemsFluidLeaksGasOdorComment || "",
    itemsBodyDents: vanEmergency?.itemsBodyDents || "",
    itemsBodyDentsComment: vanEmergency?.itemsBodyDentsComment || "",
    itemsMirrors: vanEmergency?.itemsMirrors || "",
    itemsMirrorsComment: vanEmergency?.itemsMirrorsComment || "",
    itemsExternalCleanliness: vanEmergency?.itemsExternalCleanliness || "",
    itemsExternalCleanlinessComment:
      vanEmergency?.itemsExternalCleanlinessComment || "",
    itemsInteriorCleanliness: vanEmergency?.itemsInteriorCleanliness || "",
    itemsInteriorCleanlinessComment:
      vanEmergency?.itemsInteriorCleanlinessComment || "",
    itemsFirstAidKit: vanEmergency?.itemsFirstAidKit || "",
    itemsFirstAidKitComment: vanEmergency?.itemsFirstAidKitComment || "",
    itemsWater: vanEmergency?.itemsWater || "",
    itemsWaterComment: vanEmergency?.itemsWaterComment || "",
    itemsFireExtinguisher: vanEmergency?.itemsFireExtinguisher || "",
    itemsFireExtinguisherComment:
      vanEmergency?.itemsFireExtinguisherComment || "",
    itemsBrakes: vanEmergency?.itemsBrakes || "",
    itemsBrakesComment: vanEmergency?.itemsBrakesComment || "",
    comments: vanEmergency?.comments || "",
    inspectorSignature: vanEmergency?.inspectorSignature || "",
    inspectorDate: vanEmergency?.inspectorDate || "",
    facilityAddress:
      vanEmergency?.facilityAddress || vanEmergency?.location || "",
  });
  const handleSubmit10 = async (e) => {
    const updatePayload = {
      ...vehicleInspectionData,
      facilityId:
        vehicleInspectionData?.facilityId?._id ||
        vehicleInspectionData?.facilityId ||
        "",
      employeeSignature,
      employeeSignatureDate,
      employeeSignatureTime,
      signers,
      dateOfBirth: patientDetail?.dateOfBirth,
      adminSignature,
      adminDateSigned,
      adminSignedTime,
    };
    const payload = {
      ...vehicleInspectionData,
      facilityId:
        vehicleInspectionData?.facilityId?._id ||
        vehicleInspectionData?.facilityId ||
        "",
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
    };
    e.preventDefault();
    if (editStatus) {
      specialNotesService.updateMonthlyVehicleInspection(
        vanEmergency?._id,
        updatePayload,
        { additionalFunctions: [getAllData, () => setModalShow(false)] },
      );
    } else {
      specialNotesService.createMonthlyVehicleInspection(payload, {
        isAdmin: currentUser.userType === ROLES.ADMIN,
        additionalFunctions: [getAllData, () => setModalShow(false)],
      });
    }
  };
  const handleAddFormGroup = () => {
    setFormGroups([
      ...formGroups,
      {
        text: "",
        count: "",
      },
    ]);
  };
  const handleChangeFormGroup = (index, key, value) => {
    const newFormGroups = [...formGroups];
    newFormGroups[index][key] = value;
    setFormGroups(newFormGroups);
    setQualityManagement({
      ...qualitymanagement,
      moreData: newFormGroups,
    });
  };
  const removeFormGroup = (index) => {
    const newGroup = formGroups?.filter((val, ind) => ind !== index);
    setFormGroups(newGroup);
  };
  const removeRefrigratorTemp = (index) => {
    const temp = refrigeratorData.temperature.filter(
      (val, ind) => ind !== index,
    );
    setRefrigeratorData((prev) => {
      return {
        ...prev,
        temperature: temp,
      };
    });
  };
  const profileInfo = useSelector(userProfile);
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
    if (profileInfo.userType === ROLES.EMPLOYEE) {
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
    }
  };
  const editDateHandler = (date) => {
    if (profileInfo.userType === ROLES.EMPLOYEE) {
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
    }
  };
  const signHandler = () => {
    if (editStatus) {
      if (signerIndex !== -1) {
        setOpenSigner(true);
      } else {
        currentUser?.userType === ROLES.ADMIN
          ? setOpenAdmin(true)
          : setOpen(true);
      }
    } else {
      currentUser?.userType === ROLES.ADMIN
        ? setOpenAdmin(true)
        : setOpen(true);
    }
  };
  return {
    facilitiesList,
    addContactBtn,
    onHide,
    handleHideAndDateReset,
    filterApply,
    modalStartDate,
    setModalStartDate,
    modalEndDate,
    setModalEndDate,
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
    itemCounts,
    handleSubmit51,
    fireman,
    setFireman,
    handleAlarmChange,
    handleAddAlarm,
    handleExtinguisherChange,
    handleAddExtinguisher,
    handleStaffChange3,
    removeaddStaff3,
    addStaff3,
    componentRef,
    print,
    print1,
    print2,
    employeeOptions,
    submitHandler3,
    fireDrill,
    setFireDrill,
    counte,
    setCounte,
    residentsOptions,
    handleSubmit4,
    disasterDrillData,
    setDisasterDrillData,
    handleSubmit5,
    weeklyVehicle,
    setWeeklyVehicle,
    handleSubmit10,
    vehicleInspectionData,
    setVehicleInspectionData,
    submitHandler5,
    emergencyData,
    setEmergencyData,
    handleSubmit6,
    infectiousData,
    setInfectiousData,
    handleInputChange6,
    handleAddRow,
    handleDeleteRow,
    handleSubmit7,
    disasterPlanData,
    setDisasterPlanData,
    handleSubmit8,
    qualitymanagement,
    setQualityManagement,
    formGroups,
    handleAddFormGroup,
    handleChangeFormGroup,
    removeFormGroup,
    handleSubmitRef2,
    handleSubmitRef,
    refrigeratorData,
    setRefrigeratorData,
    handleTemperatureChange,
    addTemperature,
    removeRefrigratorTemp,
    handleSubmitWaterTemp,
    handleWaterTempSubmit,
    waterData,
    setWaterData,
    handleWaterTemperatureChange,
    removeWaterTemp,
    addWaterTemperature,
    open,
    setOpen,
    openSigner,
    setOpenSigner,
    openAdmin,
    setOpenAdmin,
    profileInfo,
    setEmployeeSignature,
    editSignHandler,
    setEmployeeSignatureDate,
    editDateHandler,
    setSignerSignature,
    setSignerDate,
    setSignerTime,
    setAdminSignature,
    setAdminDateSigned,
    setAdminSignedTime,
    printRef,
    patientDetail,
    patientId,
    residentName,
    dateOfBirth,
    setPatientId,
    setResidentName,
    setPatientDetail,
  };
};
