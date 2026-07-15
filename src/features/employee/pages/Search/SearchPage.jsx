/* eslint-disable no-unused-vars */
/** @format */
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { usePrint } from "@shared/hooks";
import { useModal } from "@/features/shared/contexts/ModalContext";
import { DEFAULT_PAGE_SIZE, ROLES } from "@/features/shared/constants";
import { downloadReport } from "@/utils";
import { EMPLOYEE_APIS, searchService } from "@/features/shared/services";
import {
  MEDICATION_OPTION,
  INTAKE_OPTION,
  getDocumentOptionsForUser,
  SEARCH_PRINT_PAGE_STYLE,
  INITIAL_FILTER_STATE,
  createFieldUpdater,
} from "./SearchPage/searchPageConstants";
import { useSearchPageDocumentData } from "./SearchPage/useSearchPageDocumentData";
import SearchPageContent from "./SearchPage/SearchPageContent";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  useSearchPatient,
  useSearchDocuments,
  useSearchVitals,
  useSearchMedications,
  useSearchIntake,
  useSearchAppointments,
} from "@/features/shared/services/queries";

const SearchPage = () => {
  const { openDeleteModal } = useModal();
  const [filters, setFilters] = useState(INITIAL_FILTER_STATE);
  const updateFilter = createFieldUpdater(setFilters);
  const {
    searchMedication,
    searchIntake,
    dateFilter,
    medicationFilterStartDate,
    medicationFilterEndDate,
    vitalsFilterStartDate,
    vitalsFilterEndDate,
    documentsFilterStartDate,
    documentsFilterEndDate,
    scheduleFilterDate,
    intakeFilterStartDate,
    intakeFilterEndDate,
  } = filters;
  const setSearchMedication = (v) => updateFilter("searchMedication", v);
  const setSearchIntake = (v) => updateFilter("searchIntake", v);
  const setDateFilter = (v) => updateFilter("dateFilter", v);
  const setMedicationFilterStartDate = (v) =>
    updateFilter("medicationFilterStartDate", v);
  const setMedicationFilterEndDate = (v) =>
    updateFilter("medicationFilterEndDate", v);
  const setVitalsFilterStartDate = (v) =>
    updateFilter("vitalsFilterStartDate", v);
  const setVitalsFilterEndDate = (v) => updateFilter("vitalsFilterEndDate", v);
  const setDocumentsFilterStartDate = (v) =>
    updateFilter("documentsFilterStartDate", v);
  const setDocumentsFilterEndDate = (v) =>
    updateFilter("documentsFilterEndDate", v);
  const setScheduleFilterDate = (v) => {
    if (typeof v === "function") {
      setFilters((prev) => ({
        ...prev,
        scheduleFilterDate: v(prev.scheduleFilterDate),
      }));
    } else {
      updateFilter("scheduleFilterDate", v);
    }
  };
  const setIntakeFilterStartDate = (v) =>
    updateFilter("intakeFilterStartDate", v);
  const setIntakeFilterEndDate = (v) => updateFilter("intakeFilterEndDate", v);
  const [show, setShow] = useState(false);
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("tab") || "Info";
  const setType = (newType) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", newType);
    setSearchParams(params, { replace: true });
  };
  const [documentTypes, setDocumentTypes] = useState("All");

  const [pagination, setPagination] = useState({
    vitalLimit: 10,
    vitalPage: 1,
    scheduleLimit: 10,
    schedulePage: 1,
    limit: DEFAULT_PAGE_SIZE,
    page: 1,
  });
  const updatePagination = createFieldUpdater(setPagination);
  const { vitalLimit, vitalPage, scheduleLimit, schedulePage, limit, page } =
    pagination;

  // React Query Hooks
  const info = useSearchPatient(id);

  const documents = useSearchDocuments(
    id,
    {},
    { enabled: type === "Documents" },
  );

  const vitals = useSearchVitals(
    id,
    { vitalLimit, vitalPage },
    { enabled: type === "Vitals", placeholderData: keepPreviousData },
  );

  const medication = useSearchMedications(
    id,
    {},
    { enabled: type === "Medications" },
  );

  const intake = useSearchIntake(id, {}, { enabled: type === "Intake" });

  const schedule = useSearchAppointments(
    id,
    { scheduleLimit, schedulePage },
    { enabled: type === "Schedule", placeholderData: keepPreviousData },
  );

  const loading =
    documents.isLoading ||
    vitals.isLoading ||
    medication.isLoading ||
    intake.isLoading ||
    schedule.isLoading;
  const queryClient = useQueryClient();
  const componentRef = React.useRef();
  const currentUserId = useSelector(userProfile)._id;
  const profileUser = useSelector(userProfile);
  const hoursFormat = profileUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const navigate = useNavigate();

  const setVitalLimit = (v) => updatePagination("vitalLimit", v);
  const setVitalPage = useCallback(
    (v) => updatePagination("vitalPage", v),
    [updatePagination],
  );
  const setScheduleLimit = (v) => updatePagination("scheduleLimit", v);
  const setSchedulePage = useCallback(
    (v) => updatePagination("schedulePage", v),
    [updatePagination],
  );
  const setLimit = (v) => updatePagination("limit", v);
  const setPage = useCallback(
    (v) => updatePagination("page", v),
    [updatePagination],
  );
  const [downloadState, setDownloadState] = useState({
    downloading: false,
    downloadingId: null,
  });
  const { downloading, downloadingId } = downloadState;
  const setDownloading = (v) =>
    setDownloadState((prev) => ({ ...prev, downloading: v }));
  const setDownloadingId = (v) =>
    setDownloadState((prev) => ({ ...prev, downloadingId: v }));
  const hideFilter = () => {
    setDateFilter("");
  };
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        profileUser,
        profileUser,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(info?.data, profileUser),
    pageStyle: SEARCH_PRINT_PAGE_STYLE,
  });
  const handlePrint2 = () => {
    downloadReport(handlePrint);
  };
  const print = usePrint(printRef, handlePrint2);
  const downloadAllHandler = async () => {
    setDownloading(true);
    return;
  };
  const optionsToDisplay = getDocumentOptionsForUser(
    profileUser?.userType,
    ROLES,
  );

  const fetchDocument = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.search.documents(id),
    });
  }, [queryClient, id]);

  const fetchVitals = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.search.vitals(id),
    });
  }, [queryClient, id]);

  const fetchMedication = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.search.medications(id),
    });
  }, [queryClient, id]);

  const fetchIntake = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.search.intake(id),
    });
  }, [queryClient, id]);

  const fetchSchedule = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.search.appointments(id),
    });
  }, [queryClient, id]);
  const typeSelector = ({ type, func }) => {
    setPage(1);
    setLimit(10);
    setType(type);
    if (func) {
      func();
    }
  };
  const showIfPresent = ({ label, value }) => {
    if (value) {
      return (
        <div className="view-details-grid my-1 my-md-2 p-3">
          <p className="view-label mb-1">{label} : </p>
          <h5 className="view-value mb-0">{value}</h5>
        </div>
      );
    }
  };
  useEffect(() => {
    if (vitals?.data?.length === 0 && vitalPage > 1) {
      setPage(vitalPage - 1);
    }
  }, [vitals?.data?.length, vitalPage, setPage]);
  const deleteVitals = useCallback(
    (id) => {
      openDeleteModal({
        url: EMPLOYEE_APIS.EMPLOYEE_DELETEPATIENTVITALS(id),
        onSuccess: fetchVitals,
      });
    },
    [openDeleteModal, fetchVitals],
  );

  useEffect(() => {
    if (schedule?.data?.length === 0 && schedulePage > 1) {
      setPage(schedulePage - 1);
    }
  }, [schedule?.data?.length, schedulePage, setPage]);

  const {
    renderRows,
    renderMedRows,
    renderIntakeRows,
    totalDocumentPages,
    totalMedPages,
    totalIntakesPages,
    selectedFormType,
  } = useSearchPageDocumentData({
    documents,
    medication,
    intake,
    documentsFilterStartDate,
    documentsFilterEndDate,
    documentTypes,
    medicationFilterStartDate,
    medicationFilterEndDate,
    searchMedication,
    intakeFilterStartDate,
    intakeFilterEndDate,
    searchIntake,
    page,
    limit,
    profileUser,
    currentUserId,
    hoursFormat,
    downloadingId,
    setDownloadingId,
    fetchDocument,
    fetchIntake,
  });

  const tabs = [
    {
      title: "Info",
      type: "Info",
    },
    {
      title: "Documents",
      type: "Documents",
      func: fetchDocument,
    },
    {
      title: "Resident Vitals",
      type: "Vitals",
      func: fetchVitals,
    },
    {
      title: "Medications",
      type: "Medications",
      func: fetchMedication,
    },
    {
      title: "Intake",
      type: "Intake",
      func: fetchIntake,
    },
    {
      title: "Schedule",
      type: "Schedule",
      func: fetchSchedule,
    },
  ];
  return (
    <SearchPageContent
      printRef={printRef}
      componentRef={componentRef}
      id={id}
      show={show}
      setShow={setShow}
      fetchDocument={fetchDocument}
      type={type}
      info={info}
      navigate={navigate}
      tabs={tabs}
      typeSelector={typeSelector}
      loading={loading}
      profileUser={profileUser}
      optionsToDisplay={optionsToDisplay}
      documentsFilterStartDate={documentsFilterStartDate}
      documentsFilterEndDate={documentsFilterEndDate}
      setDocumentsFilterStartDate={setDocumentsFilterStartDate}
      setDocumentsFilterEndDate={setDocumentsFilterEndDate}
      hideFilter={hideFilter}
      documentTypes={documentTypes}
      setDocumentTypes={setDocumentTypes}
      setPage={setPage}
      downloadAllHandler={downloadAllHandler}
      renderRows={renderRows}
      totalDocumentPages={totalDocumentPages}
      page={page}
      limit={limit}
      setLimit={setLimit}
      vitals={vitals}
      vitalsFilterStartDate={vitalsFilterStartDate}
      vitalsFilterEndDate={vitalsFilterEndDate}
      setVitalsFilterStartDate={setVitalsFilterStartDate}
      setVitalsFilterEndDate={setVitalsFilterEndDate}
      hoursFormat={hoursFormat}
      deleteVitals={deleteVitals}
      medicationFilterStartDate={medicationFilterStartDate}
      medicationFilterEndDate={medicationFilterEndDate}
      setMedicationFilterStartDate={setMedicationFilterStartDate}
      setMedicationFilterEndDate={setMedicationFilterEndDate}
      searchMedication={searchMedication}
      setSearchMedication={setSearchMedication}
      MEDICATION_OPTION={MEDICATION_OPTION}
      renderMedRows={renderMedRows}
      totalMedPages={totalMedPages}
      schedule={schedule}
      scheduleFilterDate={scheduleFilterDate}
      setScheduleFilterDate={setScheduleFilterDate}
      schedulePage={schedulePage}
      setSchedulePage={setSchedulePage}
      scheduleLimit={scheduleLimit}
      setScheduleLimit={setScheduleLimit}
      intakeFilterStartDate={intakeFilterStartDate}
      intakeFilterEndDate={intakeFilterEndDate}
      setIntakeFilterStartDate={setIntakeFilterStartDate}
      setIntakeFilterEndDate={setIntakeFilterEndDate}
      searchIntake={searchIntake}
      setSearchIntake={setSearchIntake}
      INTAKE_OPTION={INTAKE_OPTION}
      renderIntakeRows={renderIntakeRows}
      totalIntakesPages={totalIntakesPages}
      vitalPage={vitalPage}
      setVitalPage={setVitalPage}
      vitalLimit={vitalLimit}
      setVitalLimit={setVitalLimit}
      print={print}
      downloading={downloading}
      setDownloading={setDownloading}
      showIfPresent={showIfPresent}
    />
  );
};
export default SearchPage;
