/* eslint-disable no-unused-vars */
/** @format */
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  disableMedicationTimeStatus,
  deleteMedicationTimeStatus,
  getResidentsForMedication,
  filterResidentsForMedication,
  addMedicationEmployeeRecord,
  getMedicationEmployeeById,
  updateMedicationEmployeeRecord,
  toggleMedicationInstructionStatus,
  deleteMarsMedication,
  saveMarsMedication,
  saveMedicationTimeStatus,
} from "@/features/shared/services";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { patient_form_treatment_get } from "@/utils/utils";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { ROLES } from "@/features/shared/constants";
import { showNotification, logger } from "@/utils";
import {
  ColourOption,
  ColourSingleValue,
} from "./employeeMedicationColourComponents";

export const useEmployeeMedicationModalLogic = (parentCtx) => {
  const {
    addContactBtn,
    viewItem,
    noteId,
    setNoteId,
    getAllEmployeeMedications,
    colorOption,
    profile,
    hoursFormat,
    printRef,
    options,
    onHide,
    show,
  } = parentCtx;

  const [patientId, setPatientId] = useState("");
  const [patients, setPatients] = useState([]);
  const profileUser = useSelector(userProfile);
  const [admitDate, setAdmitDate] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [location, setLocation] = useState("");
  const [psychiatricProvider, setPsychiatricProvider] = useState("");
  const [psychiatricProviderContact, setPsychiatricProviderContact] =
    useState("");
  const [psychiatricProviderAddress, setPsychiatricProviderAddress] =
    useState("");
  const [pcpProvider, setPcpProvider] = useState("");
  const [primaryCareProviderContact, setPrimaryCareProviderContact] =
    useState("");
  const [primaryCareProviderAddress, setPrimaryCareProviderAddress] =
    useState("");
  const [diet, setDiet] = useState("");
  const [fluidRestriction, setFluidRestriction] = useState("");
  const [allergies, setAllergies] = useState("");
  const [getApiData, setGetApiData] = useState();
  const [datesList, setDatesList] = useState();
  const [medLoading, setMedloading] = useState(false);
  const [medStatusLoading, setMedStatusLoading] = useState(false);
  const [delMedStatusLoading, setDelMedStatusLoading] = useState(false);
  const [timeLoading, setTimeLoading] = useState(false);
  const medicationRefs = useRef({});
  const defaultMedication = {
    name: "",
    instruction: [
      {
        instruction: "",
        _id: "",
      },
    ],
    other: "",
    timeStatus: [
      {
        time: "",
        color: "",
      },
    ],
    status: "Continue",
    refillCount: "",
    expirationDate: "",
    provider: "",
  };

  useEffect(() => {
    if (!show) {
      setPatientId("");
      setAdmitDate("");
      setMonth("");
      setYear("");
      setLocation("");
      setPsychiatricProvider("");
      setPsychiatricProviderContact("");
      setPsychiatricProviderAddress("");
      setPcpProvider("");
      setPrimaryCareProviderContact("");
      setPrimaryCareProviderAddress("");
      setDiet("");
      setFluidRestriction("");
      setAllergies("");
      setDiagnosis("");
      setAhcccsId("");
      setGetApiData(null);
      setMedications([{ ...defaultMedication }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  let initialMedication = [];
  if (viewItem?.medication?.length > 0) {
    initialMedication = viewItem?.medication
      ?.sort((a, b) => {
        if (a.status === "Continue" && b.status !== "Continue") return -1;
        if (a.status !== "Continue" && b.status === "Continue") return 1;
        return 0;
      })
      .map((item) => ({
        name: item?.name,
        other: item?.other,
        instruction: item?.instruction?.map((item) => ({
          label: item?.instruction,
          value: item?.instruction,
        })),
        timeStatus: item?.timeStatus,
        status: item?.status,
        refillCount: item?.refillCount,
        expirationDate: item?.expirationDate,
        provider: item?.provider,
        _id: item._id,
      }));
  }
  const handleRemoveTimeRow = async (
    medicationIndex,
    timeStatusIndex,
    medicationId,
  ) => {
    const updatedMedications = [...medications];
    const removeData = medications[medicationIndex].timeStatus[timeStatusIndex];
    updatedMedications[medicationIndex].timeStatus = updatedMedications[
      medicationIndex
    ].timeStatus.filter((item, index) => index !== timeStatusIndex);
    if (removeData?._id) {
      try {
        const result = await disableMedicationTimeStatus(
          medicationId,
          removeData?.time,
        );
        getAllDataById();
        showNotification({
          message: result.message || "Time status disabled successfully",
          type: "success",
        });
      } catch (error) {
        showNotification({
          message: error.message || "Failed to disable time status.",
          type: "danger",
        });
        logger.error(
          "Failed to disable time status in EmployeeMedication",
          error,
        );
      }
    }
    setMedications(updatedMedications);
  };
  const handleAdminDeleteTimeRow = async (
    medicationIndex,
    timeStatusIndex,
    medicationId,
  ) => {
    const updatedMedications = [...medications];
    const removeData = medications[medicationIndex].timeStatus[timeStatusIndex];
    updatedMedications[medicationIndex].timeStatus = updatedMedications[
      medicationIndex
    ].timeStatus.filter((item, index) => index !== timeStatusIndex);
    if (removeData?._id) {
      try {
        const result = await deleteMedicationTimeStatus(
          medicationId,
          removeData?.time,
        );
        getAllDataById();
        showNotification({
          message: result.message || "Time status deleted successfully",
          type: "success",
        });
      } catch (error) {
        showNotification({
          message: error.message || "Failed to delete time status.",
          type: "danger",
        });
        logger.error(
          "Failed to delete time status in EmployeeMedication",
          error,
        );
      }
    }
    setMedications(updatedMedications);
  };
  const [medications, setMedications] = useState(
    initialMedication.length > 0 ? initialMedication : [defaultMedication],
  );
  const [medicationsCopy, setMedicationsCopy] = useState(
    initialMedication.length > 0 ? initialMedication : [defaultMedication],
  );
  const [editCheckMedications, setEditCheckMedications] = useState(
    viewItem?.medication,
  );
  const [selectedValues, setSelectedValues] = useState(
    Array(medications.length).fill([]),
  );
  const handleAddMedication = () => {
    const sortMedication = [
      ...medications,
      {
        name: "",
        instruction: [],
        other: "",
        timeStatus: [
          {
            time: "",
            color: "",
          },
        ],
        status: "Continue",
        refillCount: "",
        expirationDate: "",
        provider: "",
        id: Date.now().toString(),
      },
    ]?.sort((a, b) => {
      if (a.status === "Continue" && b.status !== "Continue") return -1;
      if (a.status !== "Continue" && b.status === "Continue") return 1;
      return 0;
    });
    setMedications(sortMedication);
  };
  const handleDeleteMedication = async (id, index) => {
    if (medications?.length > 1)
      setMedications((prev) => {
        const updated = prev.filter((item, i) => i !== index);
        return updated;
      });
  };
  const handleAddTimeRow = (medIndex) => {
    const newMedications = [...medications]?.sort((a, b) => {
      if (a.status === "Continue" && b.status !== "Continue") return -1;
      if (a.status !== "Continue" && b.status === "Continue") return 1;
      return 0;
    });
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    newMedications[medIndex].timeStatus = [
      ...newMedications[medIndex].timeStatus,
      {
        time: "",
        color: `#${randomColor.padStart(6, "0")}`,
      },
    ];
    setMedications(newMedications);
  };
  const addHandleChangeMedicationName = (index, value) => {
    const updatedMedications = [...medications];
    updatedMedications[index].name = value;
    setMedications(updatedMedications);
  };
  const addHandleChangeRefillCount = (index, value) => {
    const updatedMedications = [...medications];
    updatedMedications[index].refillCount = +value;
    setMedications(updatedMedications);
  };
  const addHandleChangeExpirationDate = (index, value) => {
    const updatedMedications = [...medications];
    updatedMedications[index].expirationDate = value;
    setMedications(updatedMedications);
  };
  const addHandleChangeProvider = (index, value) => {
    const updatedMedications = [...medications];
    updatedMedications[index].provider = value;
    setMedications(updatedMedications);
  };
  const addHandleSelectChange21 = (index, selectedOptions) => {
    const updatedSelectedValues = [...selectedValues];
    updatedSelectedValues[index] = selectedOptions;
    setSelectedValues(updatedSelectedValues);
    const updatedMedications = [...medications];
    updatedMedications[index].instruction = selectedOptions;
    setMedications(updatedMedications);
  };
  const addHandleInstructionChange = (index, value) => {
    const updatedMedications = [...medications];
    updatedMedications[index].other = value;
    setMedications(updatedMedications);
  };
  const addHandleTimeStatusChange = (
    medIndex,
    timeStatusIndex,
    name,
    value,
  ) => {
    const updatedMedications = [...medications];
    const medication = updatedMedications[medIndex];
    const isDuplicateTime =
      name === "time" &&
      medication.timeStatus.some(
        (med, index) => med.time === value && index !== timeStatusIndex,
      );
    if (isDuplicateTime) {
      showNotification({
        message: "Duplicate times are not allowed for the same medication.",
        type: "danger",
      });
      return;
    }
    medication.timeStatus[timeStatusIndex][name] = value;
    setMedications(updatedMedications);
  };
  const addHandleChangeOtherInstructions = (
    medIndex,
    timeStatusIndex,
    name,
    value,
  ) => {
    const updatedMedications = [...medications];
    updatedMedications[medIndex].timeStatus[timeStatusIndex][name] = value;
    setMedications(updatedMedications);
  };
  const addHandleAddMedication = () => {
    setMedications([
      ...medications,
      {
        name: "",
        instruction: [],
        other: "",
        timeStatus: [
          {
            time: "",
            color: "",
          },
        ],
        status: "Continue",
        id: Date.now().toString(),
      },
    ]);
  };
  const handleChangeMedicationName = (index, value, medicationType) => {
    const newMedications = [...medications];
    const medicationList = newMedications.filter(
      (med) => med.status === medicationType,
    );
    medicationList[index].name = value;
    const updatedMedications = newMedications.map((med) =>
      med.status === medicationType ? medicationList.shift() : med,
    );
    setMedications(updatedMedications);
  };
  const handleChangeRefillChange = (index, value, medicationType) => {
    const newMedications = [...medications];
    const medicationList = newMedications.filter(
      (med) => med.status === medicationType,
    );
    medicationList[index].refillCount = +value;
    const updatedMedications = newMedications.map((med) =>
      med.status === medicationType ? medicationList.shift() : med,
    );
    setMedications(updatedMedications);
  };
  const handleChangeExpirationDate = (index, value, medicationType) => {
    const newMedications = [...medications];
    const medicationList = newMedications.filter(
      (med) => med.status === medicationType,
    );
    medicationList[index].expirationDate = value;
    const updatedMedications = newMedications.map((med) =>
      med.status === medicationType ? medicationList.shift() : med,
    );
    setMedications(updatedMedications);
  };
  const handleChangeProvider = (index, value, medicationType) => {
    const newMedications = [...medications];
    const medicationList = newMedications.filter(
      (med) => med.status === medicationType,
    );
    medicationList[index].provider = value;
    const updatedMedications = newMedications.map((med) =>
      med.status === medicationType ? medicationList.shift() : med,
    );
    setMedications(updatedMedications);
  };
  const handleInstructionChange = (index, value, medicationType) => {
    const newMedications = [...medications];
    const medicationList = newMedications.filter(
      (med) => med.status === medicationType,
    );
    medicationList[index].instruction = value.map((item) => ({
      value: item.value,
      label: item.label,
    }));
    const updatedMedications = newMedications.map((med) =>
      med.status === medicationType ? medicationList.shift() : med,
    );
    setMedications(updatedMedications);
  };
  const handleTimeStatusChange = (
    medIndex,
    timeStatusIndex,
    name,
    value,
    medicationType,
    medicationObj,
  ) => {
    const newMedications = [...medications];
    const medicationList = newMedications.filter(
      (med) => med.status === medicationType,
    );
    const medication = medicationList[medIndex];
    const isDuplicateTime =
      name === "time" &&
      medication.timeStatus.some(
        (med, index) => med.time === value && index !== timeStatusIndex,
      );
    if (isDuplicateTime) {
      showNotification({
        message: "Duplicate times are not allowed for the same medication.",
        type: "danger",
      });
      return;
    }
    medication.timeStatus = [...medication.timeStatus];
    medication.timeStatus[timeStatusIndex] = {
      ...medication.timeStatus[timeStatusIndex],
      [name]: value,
    };
    const timeColorMap = {};
    medication.timeStatus.forEach((med) => {
      if (med.time === value) {
        timeColorMap[med.time] = med.color;
      }
    });
    medication.timeStatus.forEach((med) => {
      med.color = timeColorMap[med.time] || med.color;
    });
    const updatedMedications = newMedications.map((med) =>
      med.status === medicationType ? medicationList.shift() : med,
    );
    setMedications(updatedMedications);
    if (medicationObj) {
      handleSaveTimeRow(medicationObj, medIndex);
      sessionStorage.setItem("medId", medication?._id);
    }
  };
  const handleChangeOtherInstructions = (index, value, medicationType) => {
    const newMedications = [...medications];
    const medicationList = newMedications.filter(
      (med) => med.status === medicationType,
    );
    medicationList[index].other = value;
    const updatedMedications = newMedications.map((med) =>
      med.status === medicationType ? medicationList.shift() : med,
    );
    setMedications(updatedMedications);
  };
  const getAllPatients = useCallback(async () => {
    if (addContactBtn === "t") {
      try {
        const result = await getResidentsForMedication(
          profileUser?.userType === ROLES.ADMIN,
        );
        if (!result.success) {
          showNotification(result);
          return;
        }
        setPatients(
          filterResidentsForMedication(result, profileUser?.userType),
        );
      } catch (error) {
        showNotification({
          message: error.message || "Failed to fetch residents list.",
          type: "danger",
        });
        logger.error("Failed to fetch residents in EmployeeMedication", error);
      }
    }
  }, [profileUser?.userType, addContactBtn]);
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!medications || medications.length === 0) {
      showNotification({
        message: "Please fill medication",
        type: "danger",
      });
      return;
    }
    if (!month) {
      showNotification({
        message: "Please Add medication month",
        type: "danger",
      });
      return;
    }
    for (let i = 0; i < medications.length; i++) {
      const medication = medications[i];
      const instructions = selectedValues[i]
        ? selectedValues[i].map((item) => item.value)
        : [];
      const timeStatuses = medication.timeStatus || [];
      if (!medication.name || medication.name.trim() === "") {
        showNotification({
          message: `Medication name cannot be empty for medication #${i + 1}`,
          type: "danger",
        });
        return;
      }
    }
    const formData = {};
    if (admitDate) formData.admitDate = admitDate;
    if (month) {
      const [yearNum, monthNum] = month.split("-");
      formData.month = monthNum;
      if (yearNum);
      formData.year = yearNum;
    }
    if (location) formData.location = location;
    if (psychiatricProvider) formData.psychiatricProvider = psychiatricProvider;
    if (psychiatricProviderContact)
      formData.psychiatricProviderContact = psychiatricProviderContact;
    if (psychiatricProviderAddress)
      formData.psychiatricProviderAddress = psychiatricProviderAddress;
    if (pcpProvider) formData.pcpProvider = pcpProvider;
    if (primaryCareProviderContact)
      formData.primaryCareProviderContact = primaryCareProviderContact;
    if (primaryCareProviderAddress)
      formData.primaryCareProviderAddress = primaryCareProviderAddress;
    if (diet) formData.diet = diet;
    if (fluidRestriction) formData.fluidRestriction = fluidRestriction;
    if (allergies) formData.allergies = allergies;
    if (patientId) {
      formData.patientId = patientId;
    }
    formData.medication = medications?.map((medication, index) => {
      return {
        ...medication,
        instruction:
          (selectedValues[index] &&
            selectedValues[index].map((item) => ({
              instruction: item.value,
            }))) ||
          [],
        timeStatus: medication?.timeStatus || [],
      };
    });
    try {
      const result = await addMedicationEmployeeRecord(
        profileUser?.userType === ROLES.ADMIN,
        formData,
      );
      if (!result.success) {
        showNotification(result);
        return;
      }
      showNotification({
        message: result.message || "Medication added successfully",
        type: "success",
      });
      onHide();
      getAllEmployeeMedications();
    } catch (error) {
      showNotification({
        message: error.message || "Failed to add medication.",
        type: "danger",
      });
      logger.error("Failed to add medication in EmployeeMedication", error);
    }
  };
  useEffect(() => {
    getAllPatients();
  }, [getAllPatients]);
  const [noteUrl, setNoteUrl] = useState("");
  const [noteData, setNoteData] = useState({});
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        noteData?.patientId,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(noteData?.patientId),
    pageStyle: `
      @page {
        size:portrait!important;
        margin: 12mm 9mm!important;
      }    
      .card {
        page-break-inside: avoid;
      }
      .view-details-grid {
        page-break-inside: avoid;
      }
    `,
  });
  const print = usePrint(printRef, handlePrint);
  const getAllDataById = async () => {
    try {
      const result = await getMedicationEmployeeById(noteId);
      if (!result.success) {
        showNotification(result);
        return;
      }
      const responseData = result.data || {};
      const data =
        responseData.medication?.map((el) => ({
          instruction:
            el.instruction?.map((i) => ({
              label: i.instruction,
              value: i.instruction,
            })) || [],
          name: el.name,
          other: el.otherInstruction,
          status: el.status,
          timeStatus:
            el.medicationStatus?.[0]?.timeStatus || el.timeStatus || [],
          color:
            el.medicationStatus?.[0]?.timeStatus?.map((i) => i?.color) || [],
          refillCount: el.refillCount,
          expirationDate: el.expirationDate,
          provider: el.provider,
          _id: el._id,
          MarsId: el.MarsId,
        })) || [];
      const dataClone =
        responseData.medication
          ?.map((el) => ({
            instruction:
              el.instruction?.map((i) => ({
                label: i.instruction,
                value: i.instruction,
              })) || [],
            name: el.name,
            other: el.otherInstruction,
            status: el.status,
            timeStatus: el.timeStatus || [],
            color:
              el.medicationStatus?.[0]?.timeStatus?.map((i) => i?.color) || [],
            refillCount: el.refillCount,
            expirationDate: el.expirationDate,
            provider: el.provider,
            _id: el._id,
          }))
          ?.sort((a, b) => {
            if (a.status === "Continue" && b.status === "DisContinue")
              return -1;
            if (a.status === "DisContinue" && b.status === "Continue") return 1;
            return 0;
          }) || [];
      if (addContactBtn === "f") {
        setMedications(data);
        setMedicationsCopy(dataClone);
      }
      setNoteData(responseData);
    } catch (error) {
      showNotification({
        message: error.message || "Failed to load medication details.",
        type: "danger",
      });
      logger.error(
        "Failed to load medication by ID in EmployeeMedication",
        error,
      );
    }
  };
  useEffect(() => {
    if (noteId) {
      getAllDataById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId, addContactBtn]);
  const submitHandler2 = async (e) => {
    e.preventDefault();
    const formData = {};
    formData.patientId = viewItem?.patientId?._id;
    formData.medication = medications.map((medication) => ({
      ...medication,
      instruction:
        medication?.instruction?.map((item) => ({
          instruction: item.value,
        })) || [],
      timeStatus:
        medication?.timeStatus?.map((item) => ({
          time: item.time,
          color: item.color,
        })) || [],
    }));
    try {
      if (medications.length > 0) {
        const result = await updateMedicationEmployeeRecord(
          viewItem?._id,
          formData,
        );
        if (!result.success) {
          showNotification(result);
          return;
        }
        getAllEmployeeMedications();
        showNotification({
          message: result.message || "Medication updated successfully",
          type: "success",
        });
        onHide();
      }
    } catch (error) {
      showNotification({
        message: error.message || "Failed to update medication.",
        type: "danger",
      });
      logger.error("Failed to update medication in EmployeeMedication", error);
    }
  };
  const addMedication = async (mainId, status) => {
    setMedStatusLoading(true);
    try {
      const result = await toggleMedicationInstructionStatus(
        noteId,
        mainId,
        status === "Continue" ? "DisContinue" : "Continue",
      );
      if (!result.success) {
        showNotification(result);
        setMedStatusLoading(false);
        return;
      }
      getAllDataById();
      showNotification({
        message: result.message || "Medication status updated",
        type: "success",
      });
      setMedStatusLoading(false);
    } catch (error) {
      setMedStatusLoading(false);
      showNotification({
        message: error.message || "Failed to update medication status.",
        type: "danger",
      });
      logger.error(
        "Failed to update medication status in EmployeeMedication",
        error,
      );
    }
  };
  const deleteMedication = async (medId, MarsId, elementIndex) => {
    if (!MarsId) {
      setMedications(
        medications?.filter((value, index) => index !== elementIndex),
      );
      return;
    }
    setDelMedStatusLoading(true);
    try {
      const result = await deleteMarsMedication(medId);
      if (!result.success) {
        showNotification(result);
        setDelMedStatusLoading(false);
        return;
      }
      getAllDataById();
      showNotification({
        message: result.message || "Mars medication deleted successfully",
        type: "success",
      });
      setDelMedStatusLoading(false);
    } catch (error) {
      setDelMedStatusLoading(false);
      showNotification({
        message: error.message || "Failed to delete mars medication.",
        type: "danger",
      });
      logger.error(
        "Failed to delete mars medication in EmployeeMedication",
        error,
      );
    }
  };
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    if (patientId) {
      const fetchData = async () => {
        try {
          const data = await patient_form_treatment_get(patientId);
          setGetApiData(data);
          setMonth("");
          if (data.dates) {
            setDatesList(data.dates);
            const currentDate = new Date();
            const currentMonth = (currentDate.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            const currentYear = currentDate.getFullYear().toString();
            const isDateInList = data.dates?.some(
              (date) =>
                date.month === currentMonth && date.year === currentYear,
            );
            if (isDateInList === false) {
              setMonth(new Date().toISOString().slice(0, 7));
            }
          } else {
            setDatesList();
          }
          if (data) {
            setAdmitDate(data?.patientId?.admitDate || null);

            const selectedPatient = patients?.find((p) => p._id === patientId);
            setLocation(
              selectedPatient?.facilityAddress ||
                data?.patientId?.facilityAddress ||
                "",
            );
            setDiagnosis(data?.patientId?.diagnosis);
            setAhcccsId(data?.patientId?.ahcccsId);
            setPsychiatricProvider(data?.patientId?.psychiatricProvider);
            setPsychiatricProviderContact(
              data?.patientId?.psychiatricProviderContact,
            );
            setPsychiatricProviderAddress(
              data?.patientId?.psychiatricProviderAddress,
            );
            setPcpProvider(data?.patientId?.primaryCareProvider);
            setPrimaryCareProviderContact(
              data?.patientId?.primaryCareProviderContact,
            );
            setPrimaryCareProviderAddress(
              data?.patientId?.primaryCareProviderAddress,
            );
            setDiet(data?.Diet);
            setFluidRestriction(data?.fluidRestrictions);
            setAllergies(data?.patientId?.allergies);
          } else {
            setAdmitDate("");
            setMonth("");
            setYear("");
            setLocation("");
            setPsychiatricProvider("");
            setPsychiatricProviderContact("");
            setPsychiatricProviderAddress("");
            setPcpProvider("");
            setPrimaryCareProviderContact("");
            setPrimaryCareProviderAddress("");
            setDiet("");
            setFluidRestriction("");
            setAllergies("");
            setDiagnosis("");
            setAhcccsId("");
          }
        } catch (error) {
          setAdmitDate("");
          setMonth("");
          setDiagnosis("");
          setAhcccsId("");
          setYear("");
          setLocation("");
          setPsychiatricProvider("");
          setPsychiatricProviderContact("");
          setPsychiatricProviderAddress("");
          setPcpProvider("");
          setPrimaryCareProviderContact("");
          setPrimaryCareProviderAddress("");
          setDiet("");
          setFluidRestriction("");
          setAllergies("");
        }
      };
      fetchData();
    }
  }, [patientId]);
  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    const [year, month] = selectedMonth.split("-");
    const isDateInList = datesList?.some(
      (date) => date.month === month && date.year === year,
    );
    if (isDateInList) {
      showNotification({
        message: `Medication has already been added for this month. Please select another month.`,
        type: "default",
      });
      e.target.value = "";
      setMonth("");
      return;
    }
    setMonth(selectedMonth);
    setYear(year);
  };
  const handleSaveMedication = async (medication) => {
    setMedloading(true);
    let marsId = medications?.[0]?.MarsId ?? viewItem.MarsId;
    try {
      const result = await saveMarsMedication(marsId, medication);
      if (!result.success) {
        showNotification(result);
        setMedloading(false);
        return;
      }
      getAllDataById();
      showNotification({
        message: result.message || "Medication saved successfully",
        type: "success",
      });
      setMedloading(false);
    } catch (error) {
      setMedloading(false);
      showNotification({
        message: error.message || "Failed to save medication details.",
        type: "danger",
      });
      logger.error(
        "Failed to save medication details in EmployeeMedication",
        error,
      );
    }
  };
  const handleSaveTimeRow = async (medication, index) => {
    const updatePayload = medication.timeStatus
      .map((row, timeStatusIndex) => {
        const originalRow = medicationsCopy[index]?.timeStatus[timeStatusIndex];
        const originalRowColor = medicationsCopy[index]?.color[timeStatusIndex];
        if (
          originalRow &&
          (row.time !== originalRow.time || row.color !== originalRowColor)
        ) {
          return {
            prevTime: originalRow,
            currTime: row.time,
            color: row.color,
            _id: row?._id,
          };
        }
        if (originalRow === "" && (row.time !== "" || row.color !== "")) {
          return {
            currTime: row.time,
            color: row.color,
            _id: row?._id,
          };
        }
        return null;
      })
      .filter((row) => row !== null);
    const rowsToSave = medication.timeStatus.filter(
      (row) => row.time && row.color && !row._id,
    );
    let payload;
    if (updatePayload?.length > 0 && rowsToSave?.length > 0) {
      payload = {
        timeStatus: rowsToSave,
        updatedTimeStatus: updatePayload,
      };
    } else if (updatePayload?.length > 0) {
      payload = {
        updatedTimeStatus: updatePayload,
      };
    } else if (rowsToSave?.length > 0) {
      payload = {
        timeStatus: rowsToSave,
      };
    }
    if (medication._id) {
      try {
        setTimeLoading(true);
        const result = await saveMedicationTimeStatus(medication._id, payload);
        if (!result.success) {
          showNotification(result);
          setTimeLoading(false);
          return;
        }
        getAllDataById();
        showNotification({
          message: result.message || "Time status added",
          type: "success",
        });
        setTimeLoading(false);
      } catch (error) {
        setTimeLoading(false);
        showNotification({
          message: error.message || "Failed to add time status.",
          type: "danger",
        });
        logger.error("Failed to add time status in EmployeeMedication", error);
      }
    }
  };

  return {
    ColourOption,
    ColourSingleValue,
    addContactBtn,
    addHandleAddMedication,
    addHandleChangeExpirationDate,
    addHandleChangeMedicationName,
    addHandleChangeOtherInstructions,
    addHandleChangeProvider,
    addHandleChangeRefillCount,
    addHandleInstructionChange,
    addHandleSelectChange21,
    addHandleTimeStatusChange,
    addMedication,
    admitDate,
    ahcccsId,
    allergies,
    colorOption,
    componentRef,
    datesList,
    delMedStatusLoading,
    deleteMedication,
    diagnosis,
    diet,
    editCheckMedications,
    fluidRestriction,
    formatDate,
    getAllDataById,
    getAllEmployeeMedications,
    getAllPatients,
    getApiData,
    handleAddMedication,
    handleAddTimeRow,
    handleAdminDeleteTimeRow,
    handleChangeExpirationDate,
    handleChangeMedicationName,
    handleChangeOtherInstructions,
    handleChangeProvider,
    handleChangeRefillChange,
    handleDeleteMedication,
    handleInstructionChange,
    handleMonthChange,
    handleRemoveTimeRow,
    handleSaveMedication,
    handleSaveTimeRow,
    handleTimeStatusChange,
    hoursFormat,
    location,
    medLoading,
    medStatusLoading,
    medicationRefs,
    medications,
    medicationsCopy,
    month,
    noteData,
    noteId,
    noteUrl,
    options,
    patientId,
    patients,
    setPatientId,
    setAdmitDate,
    setAhcccsId,
    setDiagnosis,
    setLocation,
    setPsychiatricProvider,
    setPsychiatricProviderContact,
    setPsychiatricProviderAddress,
    setPcpProvider,
    setPrimaryCareProviderContact,
    setPrimaryCareProviderAddress,
    setDiet,
    setFluidRestriction,
    setAllergies,
    profileUser,
    showNotification,
    pcpProvider,
    printRef,
    print,
    profile,
    psychiatricProvider,
    psychiatricProviderContact,
    psychiatricProviderAddress,
    primaryCareProviderContact,
    primaryCareProviderAddress,
    selectedValues,
    setNoteId,
    submitHandler,
    submitHandler2,
    timeLoading,
    viewItem,
    year,
    onHide,
  };
};
