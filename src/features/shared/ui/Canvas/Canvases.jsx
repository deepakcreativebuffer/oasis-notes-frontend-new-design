/** @format */
import { useEffect, useMemo, useRef, useState } from "react";
import { Toast, Modal } from "react-bootstrap";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { ClipLoader } from "react-spinners";
import {
  chatService,
  employeeService,
  getObjectUrlFromDownloadUrl,
  removeApi,
} from "../../services";
import {
  fetchPaitentName,
  convertTimeFormat,
  formatDateWithoutUTCHandleToMMDDYYYY,
} from "@/utils/utils";
import { ProfileImg, defaultUserImg } from "@/assets";
import { useDispatch, useSelector } from "react-redux";
import { updateUnreadNotificationCount, userProfile } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import { getSocket } from "@/socket";
import { ROLES } from "../../constants";
import { COMMON_APIS } from "../../services";
import { showNotification } from "@/utils";
const socket = getSocket();
export const NotificationToast = ({
  show,
  setShow,
  handleClose,
  notifications,
  setNotifications,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const notificationContainerRef = useRef(null);
  const ProfileDetails = useSelector(userProfile);
  const hoursFormat = ProfileDetails?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  useEffect(() => {
    if (show) {
      employeeService.getNotifications({
        isAdmin: ProfileDetails?.userType === ROLES.ADMIN,
        setResponse: setNotifications,
        setLoading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, setNotifications]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationContainerRef.current &&
        !notificationContainerRef.current.contains(event.target)
      )
        setShow(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShow]);
  const handleOnNotificationClick = async (i) => {
    if (ProfileDetails?.userType === ROLES.EMPLOYEE) {
      await removeApi({
        url: COMMON_APIS.GET_NOTIFICATION(i._id),
        showToast: false,
      });
      if (i?.TherapySession) {
        navigate(`/update-therapy-log/${i?.TherapySession}`);
      } else if (i?.mileageLog) {
        navigate(`/update-milega-log/${i?.mileageLog}`);
      } else if (i?.progressNote) {
        navigate(`/progree-note/${i?.progressNote}`);
      } else if (i?.StaffingNote) {
        navigate(`/update-staff-note/${i?.StaffingNote}`);
      } else if (i?.ADLTrackingForm) {
        navigate(`/update-dtf/${i?.ADLTrackingForm}`);
      } else if (i?.authorizationForReleaseOfInformation) {
        navigate(
          `/update-authorization/${i?.authorizationForReleaseOfInformation}`,
        );
      } else if (
        i?.notes &&
        i?.title?.includes("Incident Report" || "Incident report")
      ) {
        navigate(`/update-incident/${i?.notes}`);
      } else if (i?.notes && i?.title.includes("Clinical")) {
        navigate(`/clinical-oversight/${i?.notes}`);
      } else if (i?.ContactNote) {
        navigate(`/update-contact-note/${i?.ContactNote}`);
      } else if (i?.MedicationReconciliation) {
        navigate(`/update-reconciliation/${i?.MedicationReconciliation}`);
      } else if (i?.PrnMedicationLog) {
        navigate(`/update-prn/${i?.PrnMedicationLog}`);
      } else if (i?.mentalStatusReport) {
        navigate(`/update-mental-status/${i?.mentalStatusReport}`);
      } else if (i?.DischargeSummary) {
        navigate(`/update-discharge/${i?.DischargeSummary}`);
      } else if (i?.financialTransactionsRecord) {
        navigate(`/edit-record/${i?.financialTransactionsRecord}`);
      } else if (i?.medicationOpioidCount) {
        navigate(`/update-count/${i?.medicationOpioidCount}`);
      } else if (i?.informedConsentForMedication) {
        navigate(`/update-informed/${i?.informedConsentForMedication}`);
      } else if (i?.refusalMedicalTreatment) {
        navigate(`/update-refusal/${i?.refusalMedicalTreatment}`);
      } else if (i?.OfferLetter) {
        navigate(`/sign-offer-letter-form/${i.OfferLetter}`);
      } else if (i?.personalInformation) {
        navigate(`/sign-personal/${i?.personalInformation?.employeeId}`);
      } else if (i?.appendixTBScreeningAssessment) {
        navigate(`/sign-appendix/${i?.appendixTBScreeningAssessment?._id}`);
      } else if (i?.referenceCheck) {
        navigate(`/edit-refrence-check/${i?.referenceCheck}`);
      } else if (i?.APSSearchConsent) {
        navigate(`/edit-aps/${i?.APSSearchConsent}`);
      } else if (i?.onSiteFacility) {
        navigate(`/edit-on-site/${i?.onSiteFacility}`);
      } else if (i?.EmployeeInServiceLog) {
        navigate(`/edit-service-log/${i?.EmployeeInServiceLog}`);
      } else if (i?.skillAndKnowledge) {
        navigate(`/edit-skill-training/${i?.skillAndKnowledge}`);
      } else if (i?.timeOffRequest) {
        navigate(`/edit-time-off-request/${i?.timeOffRequest}`);
      } else if (i?.PerformanceReview) {
        navigate(`/updated-employee-performance/${i.PerformanceReview}`);
      } else if (i?.InfectionControlTraining) {
        navigate(`/edit-infection-control/${i.InfectionControlTraining}`);
      } else if (i?.AssistanceWithSelfAdministration) {
        navigate(`/edit-assistance-med/${i.AssistanceWithSelfAdministration}`);
      } else if (i?.FallPreventionAndFallRecoveryTraining) {
        navigate(
          `/edit-fall-prevention/${i.FallPreventionAndFallRecoveryTraining}`,
        );
      } else if (i?.TuberculosisTraining) {
        navigate(`/edit-tubercluosis/${i.TuberculosisTraining}`);
      } else if (i?.jobDescription) {
        navigate(`/sign-job-description/${i.jobDescription}`);
      } else if (i.initialAssessment) {
        navigate(`/edit-initial-assessment/${i.initialAssessment?._id}`);
      } else if (i.residentSafetyPlan) {
        navigate(`/edit-safety-plan/${i.residentSafetyPlan}`);
      } else if (i?.TreatmentPlan) {
        navigate(`/edit-treatment-plan/${i.TreatmentPlan}`);
      } else if (i?.faceSheet) {
        navigate(`/edit-faceSheet/${i.faceSheet}`);
      } else if (i?.nursingAssessment) {
        navigate(`/edit-nursing-assessment/${i.nursingAssessment}`);
      } else if (i?.StaffScheduleSigners) {
        navigate(`/time-sheet/${i.StaffScheduleSigners}`);
      } else if (i?.notes) {
        navigate(`/special-notes`);
      } else if (i?.trainingPermission === "skillAndKnowledge") {
        navigate(`/skills-knowledge-training`);
      } else if (i?.trainingPermission === "onSiteFacilitys") {
        navigate(`/on-site`);
      } else if (i?.TemperatureLog) {
        navigate("/special-notes");
      } else if (i?.EmployeeTermination) {
        navigate(`/updateEmployeeTermination/${i?.EmployeeTermination}`);
      } else if (i?.title === "Patient Assigned") {
        navigate(`/patient-list`);
      } else if (i?.title === "Patient unassigned") {
        navigate(`/patient-list`);
      } else if (
        i?.title === "Resident Intake Signature Required" ||
        i?.title === "Resident Intake updated."
      ) {
        navigate(`/edit-resident-intake/${i?.residentIntake?._id}`);
      } else if (i?.patientTracking) {
        navigate(`/patient-tracking`);
      } else if (i?.employeeApplication?.employeeId) {
        navigate(`/basic-information`);
      } else if (i?.employeeEducation?.employeeId) {
        navigate(`/educational-background`);
      } else if (i?.employeeHistory?.employeeId) {
        navigate(`/employement-history`);
      } else if (i?.employeeOtherInfo?.employeeId) {
        navigate(`/other-information`);
      } else if (i?.employeeSkillAndQualification?.employeeId) {
        navigate(`/acknowledgement`);
      } else if (i?.BHPProgress) {
        navigate(`/update-bhp-progress/${i.BHPProgress}`);
      } else if (i?.ASAMAssessment) {
        navigate(`/update-asam-assessment/${i.ASAMAssessment}`);
      } else if (i?.DischargePlanning) {
        navigate(`/update-discharge-planning/${i.DischargePlanning}`);
      }
    }
    if (ProfileDetails?.userType === ROLES.ADMIN) {
      await removeApi({
        url: COMMON_APIS.GET_NOTIFICATION(i._id),
        showToast: false,
      });
      if (i?.TherapySession) {
        navigate(`/update-therapy-log/${i?.TherapySession}`);
      } else if (i?.mileageLog) {
        navigate(`/update-milega-log/${i?.mileageLog}`);
      } else if (i?.progressNote) {
        navigate(`/progree-note/${i?.progressNote}`);
      } else if (i?.StaffingNote) {
        navigate(`/update-staff-note/${i?.StaffingNote}`);
      } else if (i?.ADLTrackingForm) {
        navigate(`/update-dtf/${i?.ADLTrackingForm}`);
      } else if (i?.authorizationForReleaseOfInformation) {
        navigate(
          `/update-authorization/${i?.authorizationForReleaseOfInformation}`,
        );
      } else if (
        i?.notes &&
        i?.title?.includes("Incident Report" || "Incident report")
      ) {
        navigate(`/update-incident/${i?.notes}`);
      } else if (i?.notes && i?.title.includes("Clinical")) {
        navigate(`/clinical-oversight/${i?.notes}`);
      } else if (i?.ContactNote) {
        navigate(`/update-contact-note/${i?.ContactNote}`);
      } else if (i?.MedicationReconciliation) {
        navigate(`/update-reconciliation/${i?.MedicationReconciliation}`);
      } else if (i?.PrnMedicationLog) {
        navigate(`/update-prn/${i?.PrnMedicationLog}`);
      } else if (i?.mentalStatusReport) {
        navigate(`/update-mental-status/${i?.mentalStatusReport}`);
      } else if (i?.DischargeSummary) {
        navigate(`/update-discharge/${i?.DischargeSummary}`);
      } else if (i?.financialTransactionsRecord) {
        navigate(`/edit-record/${i?.financialTransactionsRecord}`);
      } else if (i?.medicationOpioidCount) {
        navigate(`/update-count/${i?.medicationOpioidCount}`);
      } else if (i?.informedConsentForMedication) {
        navigate(`/update-informed/${i?.informedConsentForMedication}`);
      } else if (i?.refusalMedicalTreatment) {
        navigate(`/update-refusal/${i?.refusalMedicalTreatment}`);
      } else if (i?.OfferLetter) {
        navigate(`/offer-letter/${i.employeeId?._id}`);
      } else if (i?.personalInformation) {
        navigate(
          `/dashboard/personal-information/${i?.personalInformation?.employeeId}`,
        );
      } else if (i?.appendixTBScreeningAssessment) {
        navigate(`/sign-appendix/${i?.appendixTBScreeningAssessment?._id}`);
      } else if (i?.referenceCheck) {
        navigate(`/dashboard/edit-refrence-check/${i?.referenceCheck}`);
      } else if (i?.APSSearchConsent) {
        navigate(`/edit-aps/${i?.APSSearchConsent}`);
      } else if (i?.onSiteFacility) {
        navigate(`/edit-on-site/${i?.onSiteFacility}`);
      } else if (i?.EmployeeInServiceLog) {
        navigate(`/edit-service-log/${i?.EmployeeInServiceLog}`);
      } else if (i?.skillAndKnowledge) {
        navigate(`/edit-skill-training/${i?.skillAndKnowledge}`);
      } else if (i?.timeOffRequest) {
        navigate(`/edit-time-off-request/${i?.timeOffRequest}`);
      } else if (i?.PerformanceReview) {
        navigate(
          `/dashboard/update-employee-performance/${i.PerformanceReview}`,
        );
      } else if (i?.InfectionControlTraining) {
        navigate(`/edit-infection-control/${i.InfectionControlTraining}`);
      } else if (i?.AssistanceWithSelfAdministration) {
        navigate(`/edit-assistance-med/${i.AssistanceWithSelfAdministration}`);
      } else if (i?.FallPreventionAndFallRecoveryTraining) {
        navigate(
          `/edit-fall-prevention/${i.FallPreventionAndFallRecoveryTraining}`,
        );
      } else if (i?.TuberculosisTraining) {
        navigate(`/edit-tubercluosis/${i.TuberculosisTraining}`);
      } else if (i?.jobDescription) {
        navigate(`/dashboard/sign-job-description/${i.jobDescription}`);
      } else if (i.initialAssessment) {
        navigate(`/edit-initial-assessment/${i.initialAssessment?._id}`);
      } else if (i.residentSafetyPlan) {
        navigate(`/edit-safety-plan/${i.residentSafetyPlan}`);
      } else if (i?.TreatmentPlan) {
        navigate(`/edit-treatment-plan/${i.TreatmentPlan}`);
      } else if (i?.faceSheet) {
        navigate(`/edit-faceSheet/${i.faceSheet}`);
      } else if (i?.nursingAssessment) {
        navigate(`/edit-nursing-assessment/${i.nursingAssessment}`);
      } else if (i?.notes) {
        navigate(`/special-notes`);
      } else if (i?.TemperatureLog) {
        navigate("/special-notes");
      } else if (i?.EmployeeTermination) {
        navigate(
          `/dashboard/updateEmployeeTermination/${i?.EmployeeTermination}`,
        );
      } else if (i?.title === "Patient Assigned") {
        navigate(`/patient-list`);
      } else if (i?.title === "Patient unassigned") {
        navigate(`/patient-list`);
      } else if (
        i?.title === "Resident Intake Signature Required" ||
        i?.title === "Resident Intake updated."
      ) {
        navigate(`/edit-resident-intake/${i?.residentIntake?._id}`);
      } else if (i?.patientTracking) {
        navigate(`/dashboard/patient-tracking`);
      } else if (i?.employeeApplication?.employeeId) {
        navigate(`/basic-information/${i?.employeeApplication?.employeeId}`);
      } else if (i?.employeeEducation?.employeeId) {
        navigate(`/educational-background/${i?.employeeEducation?.employeeId}`);
      } else if (i?.employeeHistory?.employeeId) {
        navigate(`/employement-history/${i?.employeeHistory?.employeeId}`);
      } else if (i?.employeeOtherInfo?.employeeId) {
        navigate(`/other-information/${i?.employeeOtherInfo?.employeeId}`);
      } else if (i?.employeeSkillAndQualification?.employeeId) {
        navigate(
          `/acknowledgement/${i?.employeeSkillAndQualification?.employeeId}`,
        );
      } else if (i?.BHPProgress) {
        navigate(`/update-bhp-progress/${i.BHPProgress}`);
      } else if (i?.ASAMAssessment) {
        navigate(`/update-asam-assessment/${i.ASAMAssessment}`);
      } else if (i?.DischargePlanning) {
        navigate(`/update-discharge-planning/${i.DischargePlanning}`);
      }
    }
    dispatch(
      updateUnreadNotificationCount({
        count: 1,
        read: true,
      }),
    );
  };
  const handleNotificationClick = async (notifi) => {
    await removeApi({
      url: COMMON_APIS.GET_NOTIFICATION(notifi._id),
      showToast: false,
    });
    if (notifi?.faceSheet) {
      navigate(`/edit-facesheet-resident/${notifi?.faceSheet}`);
    } else if (notifi?.residentSafetyPlan) {
      navigate(`/edit-safetyplan-resident/${notifi?.residentSafetyPlan}`);
    } else if (notifi?.initialAssessment) {
      navigate(
        `/edit-initial-Assessment-resident/${notifi?.initialAssessment?._id}`,
      );
    } else if (notifi?.residentIntake) {
      navigate(`/edit-residentintakes-resident/${notifi?.residentIntake?._id}`);
    } else if (notifi?.TreatmentPlan) {
      navigate(`/edit-treatmentplan-resident/${notifi?.TreatmentPlan}`);
    } else if (notifi?.nursingAssessment) {
      navigate(
        `/edit-nursing-assessment-resident/${notifi?.nursingAssessment}`,
      );
    } else if (notifi?.informedConsentForMedication) {
      navigate(
        `/edit-informed-consent-resident/${notifi?.informedConsentForMedication}`,
      );
    } else if (notifi?.PrnMedicationLog) {
      navigate(`/edit-prn-log-resident/${notifi?.PrnMedicationLog}`);
    } else if (notifi?.authorizationForReleaseOfInformation) {
      navigate(
        `/edit-authorization-resident/${notifi?.authorizationForReleaseOfInformation}`,
      );
    } else if (notifi?.StaffingNote) {
      navigate(`/edit-staff-note-resident/${notifi?.StaffingNote}`);
    } else if (notifi?.refusalMedicalTreatment) {
      navigate(`/edit-refusal-resident/${notifi?.refusalMedicalTreatment}`);
    } else if (notifi?.DischargeSummary) {
      navigate(`/edit-discharge-summary-resident/${notifi?.DischargeSummary}`);
    } else if (notifi?.appendixTBScreeningAssessment) {
      navigate(
        `/sign-appendix-resident/${notifi?.appendixTBScreeningAssessment?._id}`,
      );
    } else if (notifi?.BHPProgress) {
      navigate(`/update-bhp-progress-resident/${notifi.BHPProgress}`);
    } else if (notifi?.ASAMAssessment) {
      navigate(`/update-asam-assessment-resident/${notifi.ASAMAssessment}`);
    } else if (notifi?.DischargePlanning) {
      navigate(
        `/update-discharge-planning-resident/${notifi.DischargePlanning}`,
      );
    }
  };
  return (
    <div className="Notification_toast">
      <div className="container" ref={notificationContainerRef}>
        <Toast className="z-1 bg-[#fff]" show={show} onClose={handleClose}>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Notifications</strong>
          </Toast.Header>
          {loading ? (
            <div className="block mx-auto text-center p-[10px]">
              <ClipLoader />
            </div>
          ) : (
            <>
              <div className="notifications">
                {notifications?.data?.map((i, index) => (
                  <p
                    className="notification-text"
                    key={`notification${index}`}
                    onClick={() => {
                      ProfileDetails?.userType === ROLES.PATIENT ||
                      ProfileDetails?.userType === ROLES.GUARDIAN
                        ? handleNotificationClick(i)
                        : handleOnNotificationClick(i);
                    }}
                  >
                    <span>{i.body}</span>
                    <span className="time">
                      {`${i.updatedAt && formatDateWithoutUTCHandleToMMDDYYYY(i.updatedAt)} `}
                      {convertTimeFormat(i.updatedAt, hoursFormat)}
                    </span>
                  </p>
                ))}
              </div>
              {!notifications?.data?.length && (
                <p class="text-[#1a9fb2] text-center font-semibold">
                  No Notifications
                </p>
              )}
            </>
          )}
        </Toast>
      </div>
    </div>
  );
};
export const CreateGroup = ({ show, handleClose, chatListHandler }) => {
  const [allEmployees, setAllEmployess] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [limit, setLimit] = useState(25);
  const [loading, setLoading] = useState(false);
  const [ids, setIds] = useState([]);
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [img, setImg] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const ProfileDetails = useSelector(userProfile);
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (show) {
      chatService.getUsersForChat(limit, {
        setResponse: (response) => {
          setAllEmployess(response?.data?.docs || []);
          setFilteredEmployees(response?.data?.docs || []);
        },
        setLoading,
      });
    }
  }, [limit, show]);
  useEffect(() => {
    if (search) {
      const filtered = allEmployees.filter((employee) =>
        fetchPaitentName(employee).toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(allEmployees);
    }
  }, [search, allEmployees]);
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const hasMore =
    allEmployees?.data?.totalDocs > allEmployees?.data?.docs?.length;
  const customDebounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  const loadMore = customDebounce(() => {
    if (
      limit === allEmployees?.data?.totalDocs ||
      limit < allEmployees?.data?.totalDocs
    ) {
      setLimit(limit + 25);
    }
  }, 500);
  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: hasMore,
    onLoadMore: loadMore,
    disabled: loading,
  });
  const handleAdd = (object) => {
    const alreadyPresent = ids?.some((i) => i._id === object?._id);
    if (alreadyPresent) {
      const filteredObj = ids?.filter((i) => i._id !== object?._id);
      setIds(filteredObj);
    } else {
      setIds((prev) => [...prev, object]);
    }
  };
  const handleImage = (file) => {
    if (file) {
      const validFileTypes = ["image/jpeg", "image/png"];
      if (!validFileTypes.includes(file.type)) {
        showNotification({
          message: "Please select a valid JPG or PNG image.",
          type: "default",
        });
        return;
      }
      const maxSizeInBytes = 2 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        showNotification({
          message: "File size should be less than 2 MB.",
          type: "default",
        });
        return;
      }
    }
    setImg(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
    }
  };
  const openInput = () => {
    fileInputRef.current?.click();
  };
  useEffect(() => {
    const filterdEmployess = allEmployees?.filter(
      (i) => i._id !== ProfileDetails?._id,
    );
    if (search) {
      const filtered = filterdEmployess.filter((employee) =>
        fetchPaitentName(employee).toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(filterdEmployess);
    }
  }, [search, allEmployees, ProfileDetails?._id]);
  const handleModalClose = () => {
    setStep(1);
    setIds([]);
    handleClose(); // Call the original close function
  };
  const createDocument = async () => {
    const members = ids?.map((i) => i._id);
    const formData = new FormData();
    formData.append("name", title);
    formData.append("members", members);
    formData.append("logo", img);
    const res = await chatService.createGroup(formData, {
      setLoading,
      successMsg: "Group Created",
    });
    handleModalClose();
    chatListHandler();
    if (res?.data) {
      const emitData = {
        type: "GROUP",
        id: res?.data?.data?._id,
      };
      socket.emit("join-room", JSON.stringify(emitData));
    }
  };
  return (
    <Modal show={show} onHide={handleModalClose} placement="end">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          {step === 2 ? "New Group" : "Add group memebers"}{" "}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="relative">
          {step === 1 && (
            <>
              <div className="selected-ids">
                {ids?.map((i, index) => (
                  <div className="main" key={`user${index}`}>
                    <img
                      src={
                        i.profilePic
                          ? getObjectUrlFromDownloadUrl(i.profilePic)
                          : defaultUserImg
                      }
                      className="original-img"
                      alt=""
                    />

                    <div className="content">
                      <p className="heading">{fetchPaitentName(i)} </p>
                    </div>
                    <i
                      onClick={() => handleAdd(i)}
                      className="fa-solid fa-xmark"
                    ></i>
                  </div>
                ))}
              </div>

              <div className="serach-bar">
                <input
                  type="search"
                  onChange={handleSearch}
                  value={search}
                  placeholder="Search name"
                />
              </div>

              {filteredEmployees?.length > 0 && (
                <>
                  <div className="create-new-chat-room">
                    {filteredEmployees?.map((i, index) => (
                      <div
                        className="select-employee"
                        onClick={() => handleAdd(i)}
                        key={`user${index}`}
                      >
                        <div className="group-chat-info">
                          <img
                            src={
                              i.profilePic
                                ? getObjectUrlFromDownloadUrl(i.profilePic)
                                : defaultUserImg
                            }
                            className="original-img"
                            alt=""
                          />

                          <div className="content">
                            <p className="heading text-start">
                              {fetchPaitentName(i)}{" "}
                            </p>
                            <p className="faded">{i.email} </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="block m-auto">
                        <ClipLoader />
                      </div>
                    )}
                    <div ref={sentryRef}></div>
                  </div>
                </>
              )}
            </>
          )}

          {ids?.length > 0 && step === 1 && (
            <div className="employee-btn-joiner">
              <button
                type="button"
                className="employee_create_btn"
                onClick={() => setStep(2)}
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <>
              <div className="group-description">
                <img
                  src={
                    imageUrl
                      ? imageUrl
                      : img
                        ? getObjectUrlFromDownloadUrl(img)
                        : ProfileImg
                  }
                  onClick={() => openInput()}
                  alt=""
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => handleImage(e.target.files[0])}
                />
                <div className="serach-bar">
                  <input
                    type="text"
                    placeholder="Group Name"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="employee-btn-joiner">
                  {step === 2 && (
                    <button
                      type="button"
                      className="draft"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    className="employee_create_btn"
                    onClick={() => createDocument()}
                  >
                    Create
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
export const GroupInfo = ({
  show,
  handleClose,
  document,
  chatListHandler,
  isExistGroup,
}) => {
  const ProfileDetails = useSelector(userProfile);
  const [open, setOpen] = useState(false);
  const removeMember = (id, groupId) => {
    const additionalFunctions = [chatListHandler];
    removeApi({
      url: COMMON_APIS.GET_CHAT_REMOVE_MEMBER(groupId, id),
      additionalFunctions,
    });
  };
  const toggleFunc = () => {
    handleClose();
    setOpen(true);
  };
  const updatedMembers = useMemo(() => {
    if (!document || !document?.createdBy) return document?.members || [];
    if (document?.createdBy?._id !== ProfileDetails?._id) {
      return [...(document?.members || []), document?.createdBy];
    }
    return document?.members || [];
  }, [document, ProfileDetails?._id]);
  return (
    <>
      <AddMember
        show={open}
        handleClose={() => setOpen(false)}
        document={document}
        chatListHandler={chatListHandler}
        isExistGroup={isExistGroup}
      />
      <Modal
        className="group-chat-modal"
        show={show}
        onHide={handleClose}
        placement="end"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="group-description">
            <img
              className="cursor-default"
              src={
                document?.image
                  ? getObjectUrlFromDownloadUrl(document?.image)
                  : defaultUserImg
              }
              alt=""
            />
          </div>
          <div className="group-chat-title">
            <p className="title"> {document?.title} </p>
          </div>
          <div className="go-to-chat">
            <h5 className="fw-bold mb-0 w-100 text-start">
              {document?.members?.length} Members
            </h5>
          </div>

          <div className="add_member" onClick={() => toggleFunc()}>
            <i className="fa-solid fa-user-plus"></i>
            <p>Add Member</p>
          </div>

          <div className="create-new-chat-room">
            {updatedMembers?.map((i, index) => (
              <div
                className="select-employee cursor-default"
                key={`user${index}`}
              >
                <div className="group-chat-info">
                  <img
                    src={
                      i?.profilePic
                        ? getObjectUrlFromDownloadUrl(i?.profilePic)
                        : defaultUserImg
                    }
                    className="original-img"
                    alt=""
                  />

                  <div className="content">
                    <p className="heading text-start">{fetchPaitentName(i)} </p>
                    <p className="faded"> {i.mobileNumber} </p>
                    <p className="faded">{i.email} </p>
                  </div>
                </div>
                <div className="eclipse-dropdown">
                  <button
                    type="button"
                    onClick={() => removeMember(i._id, document?._id)}
                    className="remove-group-chat"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export const AddMember = ({
  show,
  handleClose,
  document,
  chatListHandler,
  isExistGroup,
}) => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]); // Store filtered list
  const [limit] = useState(25);
  const [loading, setLoading] = useState(false);
  const [ids, setIds] = useState([]);
  const [search, setSearch] = useState("");
  const ProfileDetails = useSelector(userProfile);
  const navigate = useNavigate();
  useEffect(() => {
    if (show) {
      chatService.getUsersForChat(limit, {
        setResponse: (response) => {
          const employees = response?.data?.docs || [];
          setAllEmployees(employees);
          setFilteredEmployees(employees);
        },
        setLoading,
      });
      setIds([]);
    }
  }, [limit, show]);
  useEffect(() => {
    if (search) {
      const filtered = allEmployees.filter((employee) =>
        fetchPaitentName(employee).toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(allEmployees);
    }
  }, [search, allEmployees]);
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const filterdEmployees = useMemo(() => {
    return isExistGroup
      ? filteredEmployees?.filter(
          (i) =>
            !document?.members?.some((member) => member._id === i?._id) &&
            document?.createdBy?._id !== i?._id &&
            i?._id !== ProfileDetails?._id,
        )
      : filteredEmployees?.filter((i) => i._id !== ProfileDetails?._id);
  }, [isExistGroup, filteredEmployees, document, ProfileDetails?._id]);
  const handleAdd = (object) => {
    const alreadyPresent = ids?.some((i) => i._id === object?._id);
    if (alreadyPresent) {
      setIds(ids?.filter((i) => i._id !== object?._id));
    } else {
      setIds([...ids, object]);
    }
  };
  const addMember = async (id) => {
    const addMembers = ids?.map((member) => member?._id);
    try {
      await chatService.updateGroup(
        id,
        { members: addMembers },
        {
          setLoading,
          showAlert: false,
          navigate: navigate(
            ProfileDetails?.userType === ROLES.GUARDIAN ||
              ProfileDetails?.userType === ROLES.PATIENT
              ? "/chatPatient"
              : "/chat",
          ),
        },
      );
      handleClose();
    } catch (error) {
      showNotification({
        message: error.message || "Error adding members",
        type: "danger",
      });
    }
    handleClose();
    chatListHandler();
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Add Member</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="created-chat-main-div relative">
          <div className="selected-ids">
            {ids?.map((i, index) => (
              <div className="main" key={`user${index}`}>
                <img
                  src={
                    i.profilePic
                      ? getObjectUrlFromDownloadUrl(i.profilePic)
                      : defaultUserImg
                  }
                  className="original-img"
                  alt=""
                />
                <div className="content">
                  <p className="heading">{fetchPaitentName(i)}</p>
                </div>
                <i
                  onClick={() => handleAdd(i)}
                  className="fa-solid fa-xmark"
                ></i>
              </div>
            ))}
          </div>

          <div className="serach-bar">
            <input
              type="search"
              onChange={handleSearch}
              value={search}
              placeholder="Search name"
            />
          </div>

          {loading && (
            <div className="p-2.5 text-center">
              <ClipLoader />
            </div>
          )}

          {filterdEmployees?.length > 0 ? (
            <div className="create-new-chat-room">
              {filterdEmployees?.map((i, index) => (
                <div
                  className="select-employee"
                  onClick={() => handleAdd(i)}
                  key={`user${index}`}
                >
                  <div className="group-chat-info">
                    <img
                      src={
                        i.profilePic
                          ? getObjectUrlFromDownloadUrl(i.profilePic)
                          : defaultUserImg
                      }
                      className="original-img"
                      alt=""
                    />
                    <div className="content">
                      <p className="heading text-start">
                        {fetchPaitentName(i)}
                      </p>
                      <p className="faded">{i.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No results found</p>
          )}

          {ids?.length > 0 && (
            <div className="employee-btn-joiner">
              <button
                type="button"
                onClick={() => addMember(document?._id)}
                className="employee_create_btn"
              >
                Add Member
              </button>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
