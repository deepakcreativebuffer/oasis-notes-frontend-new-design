/** @format */
import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { residentService, COMMON_APIS } from "@/features/shared/services/index";
import { sanitizeHouseRulesArray } from "@/features/employee/pages/Intake/ResidentIntake/houseRulesOptions";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import { useViewResidentIntakesPrint } from "./useViewResidentIntakesPrint";
import { ROLES } from "@/features/shared/constants";

const _adNorm = (v) => (v === true ? "yes" : v === false ? "no" : v || "");

export const useViewResidentIntakesLogic = () => {
  const [getApiData, setGetApiData] = useState("");
  const location = useLocation().pathname;
  const { id } = useParams();
  const [loading, setLoading] = useState("");
  const [filedForm, setFiledForm] = useState("");
  // When true, ALL 10 pages render into the DOM so the print-all button can
  // capture every page in one PDF. Toggled on by handlePrintAll; toggled off
  // after the print dialog closes. Also used to auto-print from ?autoPrint=1.
  const [printAllMode, setPrintAllMode] = useState(false);
  const navigate = useNavigate();
  const patientDetail = useSelector(userProfile);
  const hoursFormat = patientDetail?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printApi = useViewResidentIntakesPrint({
    getApiData,
    patientDetail,
    setPrintAllMode,
  });
  const {
    componentRef1,
    componentRef2,
    componentRef3,
    componentRef4,
    componentRef5,
    componentRef6,
    componentRef7,
    componentRef8,
    componentRef9,
    handlePrintUpdate1,
    handlePrintUpdate2,
    handlePrintUpdate3,
    handlePrintUpdate4,
    handlePrintUpdate5,
    handlePrintUpdate6,
    handlePrintUpdate7,
    handlePrintUpdate8,
    handlePrintUpdate9,
    componentRefNew3,
    componentRefNew8,
    handlePrintNew3,
    handlePrintNew8,
    handlePrintAll,
    printRef,
    print,
    triggerPrintAll,
  } = printApi;

  const [Cpage, setPage] = useState({
    page: 1,
  });
  const { page } = Cpage;
  const handleNextPage = () => {
    if (page <= 10) {
      setPage((c) => {
        return {
          ...c,
          page: page + 1,
        };
      });
    }
  };
  const handlePrevPage = () => {
    if (page >= 2) {
      setPage((c) => {
        return {
          ...c,
          page: page - 1,
        };
      });
    }
  };

  //singin model
  const [draftModel, setDraftModel] = useState(false);
  //  all model
  const [signInModel1, setSigInModel1] = useState(false);
  const [signInModel2, setSigInModel2] = useState(false);
  const [signInModel3, setSigInModel3] = useState(false);
  const [signInModel4, setSigInModel4] = useState(false);
  const [signInModel5, setSigInModel5] = useState(false);
  const [signInModel6, setSigInModel6] = useState(false);

  //state
  const [saveAsDraft] = useState(false);
  const [userDetail, setUserDetail] = useState("");
  const [user] = useState("");
  const profile = useSelector(userProfile);
  const [companyName, setCompanyName] = useState("");

  // useState value is start
  const [userId, setUserId] = useState("");
  const [iAgree, setiAgree] = useState(false);
  const [residentSignature, setResidentSignature] = useState("");
  const [residentDate, setResidentDate] = useState("");
  const [residentSignatureTime, setResidentSignatureTime] = useState("");
  const [guardianRepresentativeName, setGuardianRepresentativeName] =
    useState("");
  const [guardianRepresentativeSignature, setGuardianRepresentativeSignature] =
    useState("");
  const [guardianRepresentativeDate, setGuardianRepresentativeDate] =
    useState("");
  const [guardianRepresentativeTime, setGuardianRepresentativeTime] =
    useState("");
  const [staffName, setStaffName] = useState("");
  const [staffSignature, setStaffSignature] = useState("");
  const [staffDate, setStaffDate] = useState("");
  const [staffTime, setStaffTime] = useState("");

  // not present
  const [internalName, setInternalName] = useState("");
  const [internalRelationship, setInternalRelationship] = useState("");
  const [internalContect, setInternalContect] = useState("");
  const [internalDisclosureList, setInternalDisclosureList] = useState([]);
  const [internalDisclosureListExpire, setInternalDisclosureListExpire] =
    useState("");
  const [
    internalDisclosureListResidentName,
    setInternalDisclosureListResidentName,
  ] = useState("");
  const [
    internalDisclosureListResidentSignature,
    setInternalDisclosureListResidentSignature,
  ] = useState("");
  const [
    internalDisclosureListResidentDate,
    setInternalDisclosureListResidentDate,
  ] = useState("");
  const [
    internalDisclosureListResidentTime,
    setInternalDisclosureListResidentTime,
  ] = useState("");
  const [
    internalDisclosureListGuardianRepresentativeName,
    setInternalDisclosureListGuardianRepresentativeName,
  ] = useState("");
  const [
    internalDisclosureListGuardianRepresentativeSignature,
    setInternalDisclosureListGuardianRepresentativeSignature,
  ] = useState("");
  const [
    internalDisclosureListGuardianRepresentativeDate,
    setInternalDisclosureListGuardianRepresentativeDate,
  ] = useState("");
  const [
    internalDisclosureListGuardianRepresentativeTime,
    setInternalDisclosureListGuardianRepresentativeTime,
  ] = useState("");
  // not present
  const [internalDisclosureListStaffName, setInternalDisclosureListStaffName] =
    useState("");
  const [
    internalDisclosureListStaffSignature,
    setInternalDisclosureListStaffSignature,
  ] = useState("");
  const [internalDisclosureListStaffDate, setInternalDisclosureListStaffDate] =
    useState("");
  const [internalDisclosureListStaffTime, setInternalDisclosureListStaffTime] =
    useState("");
  // Resident Signature not present start
  const [
    residentRightsGuardianRepresentativeName,
    setResidentRightsGuardianRepresentativeName,
  ] = useState();
  const [
    residentRightsGuardianRepresentativeSignature,
    setResidentRightsGuardianRepresentativeSignature,
  ] = useState("");
  const [
    residentRightsGuardianRepresentativeDate,
    setResidentRightsGuardianRepresentativeDate,
  ] = useState("");
  const [
    residentRightsGuardianRepresentativeTime,
    setResidentRightsGuardianRepresentativeTime,
  ] = useState("");
  // Resident Signature not present end
  const [
    residentRightsResidentSignatureValue,
    setResidentRightsResidentSignatureValue,
  ] = useState("");
  const [
    residentRightsResidentSignatureValueDate,
    setResidentRightsResidentSignatureValueDate,
  ] = useState("");
  const [
    residentRightsResidentSignatureValueTime,
    setResidentRightsResidentSignatureValueTime,
  ] = useState("");
  const [residentRightsResidentName, setResidentRightsResidentName] =
    useState("");
  const [residentRightsResidentSignature, setResidentRightsResidentSignature] =
    useState();
  const [residentRightsResidentDate, setResidentRightsResidentDate] =
    useState("");
  const [residentRightsResidentTime, setResidentRightsResidentTime] =
    useState("");
  const [photoVideoConsentResidentName, setPhotoVideoConsentResidentName] =
    useState("");
  const [photoVideoConsentDateOfBirth, setPhotoVideoConsentDateOfBirth] =
    useState("");
  const [photoVideoConsentAdmissionDate, setPhotoVideoConsentAdmissionDate] =
    useState("");
  const [photoVideoConsentConsentGiven, setPhotoVideoConsentConsentGiven] =
    useState(false);
  const [
    photoVideoConsentConsentWithdrawn,
    setPhotoVideoConsentConsentWithdrawn,
  ] = useState(false);
  const [
    photoVideoConsentResidentSignature,
    setPhotoVideoConsentResidentSignature,
  ] = useState("");
  const [photoVideoConsentResidentDate, setPhotoVideoConsentResidentDate] =
    useState("");
  const [photoVideoConsentResidentTime, setPhotoVideoConsentResidentTime] =
    useState("");
  const [
    photoVideoConsentGuardianRepresentativeName,
    setPhotoVideoConsentGuardianRepresentativeName,
  ] = useState("");
  const [
    photoVideoConsentGuardianRepresentativeSignature,
    setPhotoVideoConsentGuardianRepresentativeSignature,
  ] = useState("");
  const [
    photoVideoConsentGuardianRepresentativeDate,
    setPhotoVideoConsentGuardianRepresentativeDate,
  ] = useState("");
  const [
    photoVideoConsentGuardianRepresentativeTime,
    setPhotoVideoConsentGuardianRepresentativeTime,
  ] = useState("");
  const [advanceDirectivesResidentName, setAdvanceDirectivesResidentName] =
    useState("");
  const [advanceDirectivesResidentGender, setAdvanceDirectivesResidentGender] =
    useState("");
  const [
    advanceDirectivesResidentDateOfBirth,
    setAdvanceDirectivesResidentDateOfBirth,
  ] = useState("");
  const [
    advanceDirectivesResidentAddress,
    setAdvanceDirectivesResidentAddress,
  ] = useState("");
  const [advanceDirectivesResidentDate, setAdvanceDirectivesResidentDate] =
    useState("");

  // autosizeinput state start
  const [
    advanceDirectivesProvidedInfoInitials,
    setAdvanceDirectivesProvidedInfoInitials,
  ] = useState("");
  const [
    advanceDirectivesProvidedInfoAcknowledged,
    setAdvanceDirectivesProvidedInfoAcknowledged,
  ] = useState("");
  const [
    advanceDirectivesRefusingAcknowledged,
    setAdvanceDirectivesRefusingAcknowledged,
  ] = useState("");
  const [
    advanceDirectivesProvidedInfoDate,
    setAdvanceDirectivesProvidedInfoDate,
  ] = useState("");
  const [
    advanceDirectivesProvidedInfoTime,
    setAdvanceDirectivesProvidedInfoTime,
  ] = useState("");
  const [
    advanceDirectivesProvidedInfoRefusingInitials,
    setAdvanceDirectivesProvidedInfoRefusingInitials,
  ] = useState("");
  const [
    advanceDirectivesProvidedInfoRefusingDate,
    setAdvanceDirectivesProvidedInfoRefusingDate,
  ] = useState();
  const [
    advanceDirectivesProvidedInfoRefusingTime,
    setAdvanceDirectivesProvidedInfoRefusingTime,
  ] = useState("");
  // autosizeinput state end

  const [advanceDirectivesDeveloped, setAdvanceDirectivesDeveloped] =
    useState();
  const [
    advanceDirectivesDevelopedComment,
    setAdvanceDirectivesDevelopedComment,
  ] = useState("");
  const [
    advanceDirectivesExecutedInRecord,
    setAdvanceDirectivesExecutedInRecord,
  ] = useState("");
  const [
    advanceDirectivesExecutedInRecordComment,
    setAdvanceDirectivesExecutedInRecordComment,
  ] = useState("");
  const [
    advanceDirectivesFilingStatusWishNotFiled,
    setAdvanceDirectivesFilingStatusWishNotFiled,
  ] = useState(false);
  const [
    advanceDirectivesFilingStatusAskedForCopyNotProvided,
    setAdvanceDirectivesFilingStatusAskedForCopyNotProvided,
  ] = useState(false);
  const [
    advanceDirectivesFilingStatusOther,
    setAdvanceDirectivesFilingStatusOther,
  ] = useState(false);
  const [
    advanceDirectivesCoordinationOfCareCopySentToPCP,
    setAdvanceDirectivesCoordinationOfCareCopySentToPCP,
  ] = useState("");
  const [
    advanceDirectivesCoordinationOfCareActedOn,
    setAdvanceDirectivesCoordinationOfCareActedOn,
  ] = useState("");
  const [
    advanceDirectivesCoordinationOfCareAppropriatePartiesNotified,
    setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotified,
  ] = useState("");
  const [
    advanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment,
    setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment,
  ] = useState("");
  const [
    complaintProcessAcknowledgementCompany,
    setComplaintProcessAcknowledgementCompany,
  ] = useState("");
  const [
    complaintProcessAcknowledgementResidentName,
    setComplaintProcessAcknowledgementResidentName,
  ] = useState("");
  const [
    complaintProcessAcknowledgementResidentSignature,
    setComplaintProcessAcknowledgementResidentSignature,
  ] = useState("");
  const [
    complaintProcessAcknowledgementResidentDate,
    setComplaintProcessAcknowledgementResidentDate,
  ] = useState("");
  const [
    complaintProcessAcknowledgementResidentTime,
    setComplaintProcessAcknowledgementResidentTime,
  ] = useState("");
  const [
    complaintProcessAcknowledgementGuardianRepresentativeName,
    setComplaintProcessAcknowledgementGuardianRepresentativeName,
  ] = useState("");
  const [
    complaintProcessAcknowledgementGuardianRepresentativeSignature,
    setComplaintProcessAcknowledgementGuardianRepresentativeSignature,
  ] = useState("");
  const [
    complaintProcessAcknowledgementGuardianRepresentativeDate,
    setComplaintProcessAcknowledgementGuardianRepresentativeDate,
  ] = useState("");
  const [
    complaintProcessAcknowledgementGuardianRepresentativeTime,
    setComplaintProcessAcknowledgementGuardianRepresentativeTime,
  ] = useState("");

  // not present
  const [
    orientationToAgencyCompanyFollowing,
    setOrientationToAgencyCompanyFollowing,
  ] = useState("");
  const [orientationToAgencyCompany, setOrientationToAgencyCompany] =
    useState("");
  const [ORIENTATIONDropDown, setORIENTATIONDropDown] = useState("");
  const [receiptDropDown, setReceiptDropDown] = useState("");
  const [houseRulesDropDown, setHouseRulesDropDown] = useState([]);
  const [houseRulesAcknowledgementName, setHouseRulesAcknowledgementName] =
    useState("");
  const [
    verbalConsentResidentRepresentative,
    setVerbalConsentResidentRepresentative,
  ] = useState("");
  const [
    orientationToAgencyResidentSignature,
    setOrientationToAgencyResidentSignature,
  ] = useState("");
  const [orientationToAgencyResidentDate, setOrientationToAgencyResidentDate] =
    useState("");
  const [orientationToAgencyResidentTime, setOrientationToAgencyResidentTime] =
    useState("");
  const [
    orientationToAgencyGuardianRepresentativeName,
    setOrientationToAgencyGuardianRepresentativeName,
  ] = useState("");
  const [
    orientationToAgencyGuardianRepresentativeSignature,
    setOrientationToAgencyGuardianRepresentativeSignature,
  ] = useState("");
  const [
    orientationToAgencyGuardianRepresentativeDate,
    setOrientationToAgencyGuardianRepresentativeDate,
  ] = useState("");
  const [
    orientationToAgencyGuardianRepresentativeTime,
    setOrientationToAgencyGuardianRepresentativeTime,
  ] = useState("");
  const [promotionTalkStrategicApproach, setPromotionTalkStrategicApproach] =
    useState("");
  const [
    lockBoxKeyIssueReturnDateKeyIssued,
    setLockBoxKeyIssueReturnDateKeyIssued,
  ] = useState("");
  const [
    lockBoxKeyIssueReturnDateKeyReturned,
    setLockBoxKeyIssueReturnDateKeyReturned,
  ] = useState("");
  const [lockBoxKeyIssueReturnAddress, setLockBoxKeyIssueReturnAddress] =
    useState("");
  const [
    lockBoxKeyIssueReturnResponsibleFor,
    setLockBoxKeyIssueReturnResponsibleFor,
  ] = useState("");
  const [
    lockBoxKeyIssueReturnResponsibleForCorporation,
    setLockBoxKeyIssueReturnResponsibleForCorporation,
  ] = useState("");
  const [lockBoxKeyIssueReturnCharged, setLockBoxKeyIssueReturnCharged] =
    useState("");
  const [
    lockBoxKeyIssueReturnResidentName,
    setLockBoxKeyIssueReturnResidentName,
  ] = useState("");
  const [
    lockBoxKeyIssueReturnResidentSignature,
    setLockBoxKeyIssueReturnResidentSignature,
  ] = useState("");
  const [
    lockBoxKeyIssueReturnResidentDate,
    setLockBoxKeyIssueReturnResidentDate,
  ] = useState("");
  const [
    lockBoxKeyIssueReturnResidentTime,
    setLockBoxKeyIssueReturnResidentTime,
  ] = useState("");
  const [
    lockBoxKeyIssueReturnGuardianRepresentativeName,
    setLockBoxKeyIssueReturnGuardianRepresentativeName,
  ] = useState("");
  const [
    lockBoxKeyIssueReturnGuardianRepresentativeSignature,
    setLockBoxKeyIssueReturnGuardianRepresentativeSignature,
  ] = useState("");
  const [
    lockBoxKeyIssueReturnGuardianRepresentativeDate,
    setLockBoxKeyIssueReturnGuardianRepresentativeDate,
  ] = useState("");
  const [
    lockBoxKeyIssueReturnGuardianRepresentativeTime,
    setLockBoxKeyIssueReturnGuardianRepresentativeTime,
  ] = useState("");
  const [lockBoxKeyIssueReturnStaffName, setLockBoxKeyIssueReturnStaffName] =
    useState("");
  const [
    lockBoxKeyIssueReturnStaffSignature,
    setLockBoxKeyIssueReturnStaffSignature,
  ] = useState("");
  const [lockBoxKeyIssueReturnStaffDate, setLockBoxKeyIssueReturnStaffDate] =
    useState("");
  const [lockBoxKeyIssueReturnStaffTime, setLockBoxKeyIssueReturnStaffTime] =
    useState("");
  const [primaryInsurance, setPrimaryInsurance] = useState("");
  const [
    insuranceInformationPrimaryInsurancePolicyholderName,
    setInsuranceInformationPrimaryInsurancePolicyholderName,
  ] = useState("");
  const [
    insuranceInformationPrimaryInsurancePolicyholderDateOfBirth,
    setInsuranceInformationPrimaryInsurancePolicyholderDateOfBirth,
  ] = useState("");
  const [
    insuranceInformationPrimaryInsurancePolicyholderAddress,
    setInsuranceInformationPrimaryInsurancePolicyholderAddress,
  ] = useState("");
  const [
    insuranceInformationPrimaryInsurancePolicyholderCity,
    setInsuranceInformationPrimaryInsurancePolicyholderCity,
  ] = useState("");
  const [
    insuranceInformationPrimaryInsurancePolicyholderState,
    setInsuranceInformationPrimaryInsurancePolicyholderState,
  ] = useState("");
  const [
    insuranceInformationPrimaryInsurancePolicyholderZip,
    setInsuranceInformationPrimaryInsurancePolicyholderZip,
  ] = useState("");
  const [
    insuranceInformationPrimaryInsurancePolicyholderPhone,
    setInsuranceInformationPrimaryInsurancePolicyholderPhone,
  ] = useState("");
  const [
    insuranceInformationPrimaryInsurancePolicyholderRelationship,
    setInsuranceInformationPrimaryInsurancePolicyholderRelationship,
  ] = useState("");
  const [
    insuranceInformationPrimaryInsuranceCompany,
    setInsuranceInformationPrimaryInsuranceCompany,
  ] = useState("");
  const [
    insuranceInformationPrimaryInsuranceCustomerServicePhone,
    setInsuranceInformationPrimaryInsuranceCustomerServicePhone,
  ] = useState("");
  const [
    insuranceInformationPrimaryInsuranceSubscriberNumber,
    setInsuranceInformationPrimaryInsuranceSubscriberNumber,
  ] = useState("");
  const [
    insuranceInformationPrimaryInsuranceSubscriberGroup,
    setInsuranceInformationPrimaryInsuranceSubscriberGroup,
  ] = useState("");
  const [
    insuranceInformationPrimaryInsuranceSubscriberEffectiveDate,
    setInsuranceInformationPrimaryInsuranceSubscriberEffectiveDate,
  ] = useState("");
  const [
    insuranceInformationSecondaryInsurancePolicyholderName,
    setInsuranceInformationSecondaryInsurancePolicyholderName,
  ] = useState("");
  const [
    insuranceInformationSecondaryInsurancePolicyholderDateOfBirth,
    setInsuranceInformationSecondaryInsurancePolicyholderDateOfBirth,
  ] = useState("");
  const [
    insuranceInformationSecondaryInsurancePolicyholderAddress,
    setInsuranceInformationSecondaryInsurancePolicyholderAddress,
  ] = useState("");
  const [
    insuranceInformationSecondaryInsurancePolicyholderCity,
    setInsuranceInformationSecondaryInsurancePolicyholderCity,
  ] = useState("");
  const [
    insuranceInformationSecondaryInsurancePolicyholderState,
    setInsuranceInformationSecondaryInsurancePolicyholderState,
  ] = useState("");
  const [
    insuranceInformationSecondaryInsurancePolicyholderZip,
    setInsuranceInformationSecondaryInsurancePolicyholderZip,
  ] = useState("");
  const [
    insuranceInformationSecondaryInsurancePolicyholderPhone,
    setInsuranceInformationSecondaryInsurancePolicyholderPhone,
  ] = useState("");
  const [
    insuranceInformationSecondaryInsurancePolicyholderRelationship,
    setInsuranceInformationSecondaryInsurancePolicyholderRelationship,
  ] = useState("");
  const [
    insuranceInformationSecondaryInsuranceCompany,
    setInsuranceInformationSecondaryInsuranceCompany,
  ] = useState("");
  const [
    insuranceInformationSecondaryInsuranceCustomerServicePhone,
    setInsuranceInformationSecondaryInsuranceCustomerServicePhone,
  ] = useState("");
  const [
    insuranceInformationSecondaryInsuranceSubscriberNumber,
    setInsuranceInformationSecondaryInsuranceSubscriberNumber,
  ] = useState("");
  const [
    insuranceInformationSecondaryInsuranceSubscriberGroup,
    setInsuranceInformationSecondaryInsuranceSubscriberGroup,
  ] = useState("");
  const [
    insuranceInformationSecondaryInsuranceSubscriberEffectiveDate,
    setInsuranceInformationSecondaryInsuranceSubscriberEffectiveDate,
  ] = useState("");
  const [
    obligationsAndAuthorizationResidentName,
    setObligationsAndAuthorizationResidentName,
  ] = useState("");
  const [
    obligationsAndAuthorizationResidentSignature,
    setObligationsAndAuthorizationResidentSignature,
  ] = useState("");
  const [
    obligationsAndAuthorizationResidentDate,
    setObligationsAndAuthorizationResidentDate,
  ] = useState("");
  const [
    obligationsAndAuthorizationResidentTime,
    setObligationsAndAuthorizationResidentTime,
  ] = useState("");
  const [showSignatureResident, setShowSignatureResident] = useState(false);
  const [
    obligationsAndAuthorizationGuardianRepresentativeName,
    setObligationsAndAuthorizationGuardianRepresentativeName,
  ] = useState("");
  const [
    obligationsAndAuthorizationGuardianRepresentativeSignature,
    setObligationsAndAuthorizationGuardianRepresentativeSignature,
  ] = useState("");
  const [
    obligationsAndAuthorizationGuardianRepresentativeDate,
    setObligationsAndAuthorizationGuardianRepresentativeDate,
  ] = useState("");
  const [
    obligationsAndAuthorizationGuardianRepresentativeTime,
    setObligationsAndAuthorizationGuardianRepresentativeTime,
  ] = useState("");
  const [signatures, setSignatures] = useState([]);
  useEffect(() => {
    if (getApiData) {
      setiAgree(getApiData?.iAgree);
      setResidentSignature(getApiData?.residentSignature);
      setResidentDate(getApiData?.residentDate ? getApiData?.residentDate : "");
      setSignatures(getApiData?.signatures || []);
      setResidentSignatureTime(getApiData?.residentSignatureTime);
      setGuardianRepresentativeName(getApiData?.guardianRepresentativeName);
      setGuardianRepresentativeSignature(
        getApiData?.guardianRepresentativeSignature,
      );
      setGuardianRepresentativeDate(
        getApiData?.guardianRepresentativeDate
          ? getApiData?.guardianRepresentativeDate
          : "",
      );
      setGuardianRepresentativeTime(getApiData?.guardianRepresentativeTime);
      setStaffName(getApiData?.staffName);
      setInternalDisclosureList(
        getApiData?.internalDisclosureList
          ? getApiData?.internalDisclosureList
          : [],
      );
      setInternalDisclosureListExpire(
        getApiData?.internalDisclosureListExpire
          ? getApiData?.internalDisclosureListExpire?.slice(0, 10)
          : "",
      );
      setInternalDisclosureListResidentName(
        getApiData?.internalDisclosureListResidentName,
      );
      setInternalDisclosureListResidentSignature(
        getApiData?.internalDisclosureListResidentSignature,
      );
      setInternalDisclosureListResidentDate(
        getApiData?.internalDisclosureListResidentDate
          ? getApiData?.internalDisclosureListResidentDate
          : "",
      );
      setInternalDisclosureListResidentTime(
        getApiData?.internalDisclosureListResidentTime,
      );
      setInternalDisclosureListGuardianRepresentativeName(
        getApiData?.internalDisclosureListGuardianRepresentativeName,
      );
      setInternalDisclosureListGuardianRepresentativeSignature(
        getApiData?.internalDisclosureListGuardianRepresentativeSignature,
      );
      setInternalDisclosureListGuardianRepresentativeDate(
        getApiData?.internalDisclosureListGuardianRepresentativeDate
          ? getApiData?.internalDisclosureListGuardianRepresentativeDate
          : "",
      );
      setInternalDisclosureListGuardianRepresentativeTime(
        getApiData?.internalDisclosureListGuardianRepresentativeTime,
      );
      setResidentRightsResidentSignatureValue(
        getApiData?.residentRightsResidentSignatureValue,
      );
      setResidentRightsResidentSignatureValueDate(
        getApiData?.residentRightsResidentSignatureValueDate
          ? getApiData?.residentRightsResidentSignatureValueDate?.slice(0, 10)
          : "",
      );
      setResidentRightsResidentSignatureValueTime(
        getApiData?.internalDisclosureListStaffTime,
      );
      setResidentRightsResidentName(getApiData?.residentRightsResidentName);
      setResidentRightsResidentSignature(
        getApiData?.residentRightsResidentSignature,
      );
      setResidentRightsResidentDate(
        getApiData?.residentRightsResidentDate
          ? getApiData?.residentRightsResidentDate
          : "",
      );
      // new value
      setResidentRightsResidentTime(getApiData?.residentRightsResidentTime);
      setResidentRightsGuardianRepresentativeSignature(
        getApiData?.residentRightsGuardianRepresentativeSignature,
      );
      setResidentRightsGuardianRepresentativeDate(
        getApiData?.residentRightsGuardianRepresentativeDate
          ? getApiData?.residentRightsGuardianRepresentativeDate
          : "",
      );
      setResidentRightsGuardianRepresentativeTime(
        getApiData?.residentRightsGuardianRepresentativeTime,
      );
      setPhotoVideoConsentResidentName(
        getApiData?.photoVideoConsentResidentName,
      );
      setPhotoVideoConsentDateOfBirth(
        getApiData?.patientId?.dateOfBirth
          ? getApiData?.patientId?.dateOfBirth
          : "",
      );
      setPhotoVideoConsentAdmissionDate(
        getApiData?.patientId?.admitDate
          ? getApiData?.patientId?.admitDate
          : "",
      );
      setPhotoVideoConsentConsentGiven(
        getApiData?.photoVideoConsentConsentGiven,
      );
      setPhotoVideoConsentConsentWithdrawn(
        getApiData?.photoVideoConsentConsentWithdrawn,
      );
      setPhotoVideoConsentResidentSignature(
        getApiData?.photoVideoConsentResidentSignature,
      );
      setPhotoVideoConsentResidentDate(
        getApiData?.photoVideoConsentResidentDate
          ? getApiData?.photoVideoConsentResidentDate
          : "",
      );
      setPhotoVideoConsentResidentTime(
        getApiData?.photoVideoConsentResidentTime,
      );
      setPhotoVideoConsentGuardianRepresentativeName(
        getApiData?.photoVideoConsentGuardianRepresentativeName,
      );
      setAdvanceDirectivesResidentName(
        getApiData?.advanceDirectivesResidentName,
      );
      setAdvanceDirectivesResidentGender(getApiData?.patientId?.gender);
      setAdvanceDirectivesResidentDateOfBirth(
        getApiData?.patientId?.dateOfBirth
          ? getApiData?.patientId?.dateOfBirth
          : "",
      );
      setAdvanceDirectivesResidentAddress(
        getApiData?.advanceDirectivesResidentAddress,
      );
      setAdvanceDirectivesResidentDate(
        getApiData?.advanceDirectivesResidentDate
          ? getApiData?.advanceDirectivesResidentDate
          : "",
      );
      setAdvanceDirectivesProvidedInfoInitials(
        getApiData?.advanceDirectivesProvidedInfoInitials,
      );
      // Normalize legacy Boolean values (saved before the Boolean→String
      // schema swap) into the new "yes"/"no"/"" shape.
      setAdvanceDirectivesProvidedInfoAcknowledged(
        _adNorm(getApiData?.advanceDirectivesProvidedInfoAcknowledged),
      );
      setAdvanceDirectivesRefusingAcknowledged(
        _adNorm(getApiData?.advanceDirectivesRefusingAcknowledged),
      );
      setAdvanceDirectivesProvidedInfoDate(
        getApiData?.advanceDirectivesProvidedInfoDate
          ? getApiData?.advanceDirectivesProvidedInfoDate
          : "",
      );
      setAdvanceDirectivesProvidedInfoTime(
        getApiData?.guardianRepresentativeTime,
      );
      setAdvanceDirectivesProvidedInfoRefusingInitials(
        getApiData?.advanceDirectivesProvidedInfoRefusingInitials,
      );
      setAdvanceDirectivesProvidedInfoRefusingDate(
        getApiData?.advanceDirectivesProvidedInfoRefusingDate
          ? getApiData?.advanceDirectivesProvidedInfoRefusingDate
          : "",
      );
      setAdvanceDirectivesProvidedInfoRefusingTime(
        getApiData?.advanceDirectivesProvidedInfoRefusingTime,
      );
      setAdvanceDirectivesDeveloped(getApiData?.advanceDirectivesDeveloped);
      setAdvanceDirectivesDevelopedComment(
        getApiData?.advanceDirectivesDevelopedComment,
      );
      setAdvanceDirectivesExecutedInRecord(
        getApiData?.advanceDirectivesExecutedInRecord,
      );
      setAdvanceDirectivesExecutedInRecordComment(
        getApiData?.advanceDirectivesExecutedInRecordComment,
      );
      setAdvanceDirectivesFilingStatusWishNotFiled(
        getApiData?.advanceDirectivesFilingStatusWishNotFiled,
      );
      setAdvanceDirectivesFilingStatusAskedForCopyNotProvided(
        getApiData?.advanceDirectivesFilingStatusAskedForCopyNotProvided,
      );
      setAdvanceDirectivesFilingStatusOther(
        getApiData?.advanceDirectivesFilingStatusOther,
      );
      setAdvanceDirectivesCoordinationOfCareCopySentToPCP(
        getApiData?.advanceDirectivesCoordinationOfCareCopySentToPCP,
      );
      setAdvanceDirectivesCoordinationOfCareActedOn(
        getApiData?.advanceDirectivesCoordinationOfCareActedOn,
      );
      setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotified(
        getApiData?.advanceDirectivesCoordinationOfCareAppropriatePartiesNotified,
      );
      setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment(
        getApiData?.advanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment,
      );
      setComplaintProcessAcknowledgementCompany(
        getApiData?.complaintProcessAcknowledgementCompany,
      );
      setComplaintProcessAcknowledgementResidentName(
        getApiData?.complaintProcessAcknowledgementResidentName,
      );
      setComplaintProcessAcknowledgementResidentSignature(
        getApiData?.complaintProcessAcknowledgementResidentSignature,
      );
      setComplaintProcessAcknowledgementResidentDate(
        getApiData?.complaintProcessAcknowledgementResidentDate
          ? getApiData?.complaintProcessAcknowledgementResidentDate
          : "",
      );
      setComplaintProcessAcknowledgementResidentTime(
        getApiData?.complaintProcessAcknowledgementResidentTime,
      );
      setComplaintProcessAcknowledgementGuardianRepresentativeName(
        getApiData?.complaintProcessAcknowledgementGuardianRepresentativeName,
      );
      setOrientationToAgencyCompany(getApiData?.orientationToAgencyCompany);
      setORIENTATIONDropDown(
        getApiData?.orientationToAgencyCompanyFollowing
          ? getApiData?.orientationToAgencyCompanyFollowing
              ?.map((item) => item.label)
              .join(",")
          : "",
      );
      setReceiptDropDown(
        getApiData?.receiptOfInformationAtAdmission
          ? getApiData?.receiptOfInformationAtAdmission
              ?.map((item) => item.label)
              .join(",")
          : "",
      );
      setHouseRulesDropDown(
        sanitizeHouseRulesArray(
          getApiData?.houseRulesAcknowledgementAtAdmission ?? [],
        ),
      );
      setHouseRulesAcknowledgementName(
        getApiData?.houseRulesAcknowledgementName ?? "",
      );
      setVerbalConsentResidentRepresentative(
        getApiData?.verbalConsentResidentRepresentative ?? "",
      );
      setOrientationToAgencyResidentSignature(
        getApiData?.orientationToAgencyResidentSignature,
      );
      setOrientationToAgencyResidentDate(
        getApiData?.orientationToAgencyResidentDate
          ? getApiData?.orientationToAgencyResidentDate
          : "",
      );
      setOrientationToAgencyResidentTime(
        getApiData?.orientationToAgencyResidentTime,
      );
      setOrientationToAgencyGuardianRepresentativeName(
        getApiData?.orientationToAgencyGuardianRepresentativeName,
      );
      setPromotionTalkStrategicApproach(
        getApiData?.promotionTalkStrategicApproach,
      );
      setLockBoxKeyIssueReturnDateKeyIssued(
        getApiData?.lockBoxKeyIssueReturnDateKeyIssued
          ? getApiData?.lockBoxKeyIssueReturnDateKeyIssued?.slice(0, 10)
          : "",
      );
      setLockBoxKeyIssueReturnDateKeyReturned(
        getApiData?.lockBoxKeyIssueReturnDateKeyReturned
          ? getApiData?.lockBoxKeyIssueReturnDateKeyReturned?.slice(0, 10)
          : "",
      );
      setLockBoxKeyIssueReturnAddress(getApiData?.lockBoxKeyIssueReturnAddress);
      setLockBoxKeyIssueReturnResponsibleFor(
        getApiData?.lockBoxKeyIssueReturnResponsibleFor,
      );
      setLockBoxKeyIssueReturnResponsibleForCorporation(
        getApiData?.lockBoxKeyIssueReturnResponsibleForCorporation,
      );
      setLockBoxKeyIssueReturnCharged(getApiData?.lockBoxKeyIssueReturnCharged);
      setLockBoxKeyIssueReturnResidentSignature(
        getApiData?.lockBoxKeyIssueReturnResidentSignature,
      );
      setLockBoxKeyIssueReturnResidentDate(
        getApiData?.lockBoxKeyIssueReturnResidentDate
          ? getApiData?.lockBoxKeyIssueReturnResidentDate
          : "",
      );
      setLockBoxKeyIssueReturnResidentTime(
        getApiData?.lockBoxKeyIssueReturnResidentTime,
      );
      setLockBoxKeyIssueReturnGuardianRepresentativeName(
        getApiData?.lockBoxKeyIssueReturnGuardianRepresentativeName,
      );
      setLockBoxKeyIssueReturnGuardianRepresentativeSignature(
        getApiData?.lockBoxKeyIssueReturnGuardianRepresentativeSignature,
      );
      setLockBoxKeyIssueReturnGuardianRepresentativeDate(
        getApiData?.lockBoxKeyIssueReturnGuardianRepresentativeDate
          ? getApiData?.lockBoxKeyIssueReturnGuardianRepresentativeDate
          : "",
      );
      setLockBoxKeyIssueReturnGuardianRepresentativeTime(
        getApiData?.lockBoxKeyIssueReturnGuardianRepresentativeTime,
      );
      setLockBoxKeyIssueReturnStaffName(
        getApiData?.lockBoxKeyIssueReturnStaffName,
      );
      setPrimaryInsurance(getApiData?.primaryInsurance);
      setInsuranceInformationPrimaryInsurancePolicyholderName(
        getApiData?.insuranceInformationPrimaryInsurancePolicyholderName,
      );
      setInsuranceInformationPrimaryInsurancePolicyholderDateOfBirth(
        getApiData?.insuranceInformationPrimaryInsurancePolicyholderDateOfBirth
          ? getApiData?.insuranceInformationPrimaryInsurancePolicyholderDateOfBirth.slice(
              0,
              10,
            )
          : "",
      );
      setInsuranceInformationPrimaryInsurancePolicyholderAddress(
        getApiData?.insuranceInformationPrimaryInsurancePolicyholderAddress,
      );
      setInsuranceInformationPrimaryInsurancePolicyholderCity(
        getApiData?.insuranceInformationPrimaryInsurancePolicyholderCity,
      );
      setInsuranceInformationPrimaryInsurancePolicyholderState(
        getApiData?.insuranceInformationPrimaryInsurancePolicyholderState,
      );
      setInsuranceInformationPrimaryInsurancePolicyholderZip(
        getApiData?.insuranceInformationPrimaryInsurancePolicyholderZip,
      );
      setInsuranceInformationPrimaryInsurancePolicyholderPhone(
        getApiData?.insuranceInformationPrimaryInsurancePolicyholderPhone,
      );
      setInsuranceInformationPrimaryInsurancePolicyholderRelationship(
        getApiData?.insuranceInformationPrimaryInsurancePolicyholderRelationship,
      );
      setInsuranceInformationPrimaryInsuranceCompany(
        getApiData?.insuranceInformationPrimaryInsuranceCompany,
      );
      setInsuranceInformationPrimaryInsuranceCustomerServicePhone(
        getApiData?.insuranceInformationPrimaryInsuranceCustomerServicePhone,
      );
      setInsuranceInformationPrimaryInsuranceSubscriberNumber(
        getApiData?.insuranceInformationPrimaryInsuranceSubscriberNumber,
      );
      setInsuranceInformationPrimaryInsuranceSubscriberGroup(
        getApiData?.insuranceInformationPrimaryInsuranceSubscriberGroup,
      );
      setInsuranceInformationPrimaryInsuranceSubscriberEffectiveDate(
        getApiData?.insuranceInformationPrimaryInsuranceSubscriberEffectiveDate
          ? getApiData?.insuranceInformationPrimaryInsuranceSubscriberEffectiveDate.slice(
              0,
              10,
            )
          : "",
      );
      setInsuranceInformationSecondaryInsurancePolicyholderName(
        getApiData?.insuranceInformationSecondaryInsurancePolicyholderName,
      );
      setInsuranceInformationSecondaryInsurancePolicyholderDateOfBirth(
        getApiData?.insuranceInformationSecondaryInsurancePolicyholderDateOfBirth
          ? getApiData?.insuranceInformationSecondaryInsurancePolicyholderDateOfBirth.slice(
              0,
              10,
            )
          : "",
      );
      setInsuranceInformationSecondaryInsurancePolicyholderAddress(
        getApiData?.insuranceInformationSecondaryInsurancePolicyholderAddress,
      );
      setInsuranceInformationSecondaryInsurancePolicyholderCity(
        getApiData?.insuranceInformationSecondaryInsurancePolicyholderCity,
      );
      setInsuranceInformationSecondaryInsurancePolicyholderState(
        getApiData?.insuranceInformationSecondaryInsurancePolicyholderState,
      );
      setInsuranceInformationSecondaryInsurancePolicyholderZip(
        getApiData?.insuranceInformationSecondaryInsurancePolicyholderZip,
      );
      setInsuranceInformationSecondaryInsurancePolicyholderPhone(
        getApiData?.insuranceInformationSecondaryInsurancePolicyholderPhone,
      );
      setInsuranceInformationSecondaryInsurancePolicyholderRelationship(
        getApiData?.insuranceInformationSecondaryInsurancePolicyholderRelationship,
      );
      setInsuranceInformationSecondaryInsuranceCompany(
        getApiData?.insuranceInformationSecondaryInsuranceCompany,
      );
      setInsuranceInformationSecondaryInsuranceCustomerServicePhone(
        getApiData?.insuranceInformationSecondaryInsuranceCustomerServicePhone,
      );
      setInsuranceInformationSecondaryInsuranceSubscriberNumber(
        getApiData?.insuranceInformationSecondaryInsuranceSubscriberNumber,
      );
      setInsuranceInformationSecondaryInsuranceSubscriberGroup(
        getApiData?.insuranceInformationSecondaryInsuranceSubscriberGroup,
      );
      setInsuranceInformationSecondaryInsuranceSubscriberEffectiveDate(
        getApiData?.insuranceInformationSecondaryInsuranceSubscriberEffectiveDate
          ? getApiData?.insuranceInformationSecondaryInsuranceSubscriberEffectiveDate.slice(
              0,
              10,
            )
          : "",
      );
      setObligationsAndAuthorizationResidentName(
        getApiData?.obligationsAndAuthorizationResidentName,
      );
      setObligationsAndAuthorizationResidentSignature(
        getApiData?.obligationsAndAuthorizationResidentSignature,
      );
      setObligationsAndAuthorizationResidentDate(
        getApiData?.obligationsAndAuthorizationResidentDate
          ? getApiData?.obligationsAndAuthorizationResidentDate
          : "",
      );
      setObligationsAndAuthorizationResidentTime(
        getApiData?.obligationsAndAuthorizationResidentTime,
      );
      setObligationsAndAuthorizationGuardianRepresentativeName(
        getApiData?.obligationsAndAuthorizationGuardianRepresentativeName,
      );
    }
  }, [getApiData]);
  const [previusData] = useState(false);
  useEffect(() => {
    if (id) {
      residentService.getApiResident({
        url: COMMON_APIS.GET_PATIENT_INTAKE(id),
        setResponse: setGetApiData,
        isIntake: true,
      });
    }
    setLoading(true);
    if (previusData) {
      residentService.getResidentIntakeForm(userId, setGetApiData, setLoading);
    } else {
      setLoading(false);
    }
    setFiledForm(userDetail?.residentIntakes);
    setUserId(userDetail?._id);
    setCompanyName((prev) => {
      const newCompany =
        userDetail?.userType === ROLES.ADMIN
          ? userDetail?.companyName
          : userDetail?.adminId?.companyName;
      return prev !== newCompany ? newCompany : prev;
    });
    if (profile) {
      setUserDetail(profile);
    }
  }, [
    id,
    previusData,
    profile,
    userDetail?._id,
    userDetail?.companyName,
    userDetail?.adminId?.companyName,
    userDetail?.userType,
    userDetail?.residentIntakes,
    userId,
  ]);
  const initializeValues = () => {
    setiAgree(false);
    setResidentSignature("");
    setResidentDate("");
    setResidentSignatureTime("");
    setGuardianRepresentativeName("");
    setGuardianRepresentativeSignature("");
    setGuardianRepresentativeDate("");
    setGuardianRepresentativeTime("");
    setStaffName("");
    setStaffSignature("");
    setStaffDate("");
    setStaffTime("");
    setInternalName("");
    setInternalRelationship("");
    setInternalContect("");
    setInternalDisclosureList([]);
    setInternalDisclosureListExpire("");
    setInternalDisclosureListResidentName("");
    setInternalDisclosureListResidentSignature("");
    setInternalDisclosureListResidentDate("");
    setInternalDisclosureListResidentTime("");
    setInternalDisclosureListGuardianRepresentativeName("");
    setInternalDisclosureListGuardianRepresentativeSignature("");
    setInternalDisclosureListGuardianRepresentativeDate("");
    setInternalDisclosureListGuardianRepresentativeTime("");
    setInternalDisclosureListStaffName("");
    setInternalDisclosureListStaffSignature("");
    setInternalDisclosureListStaffDate("");
    setInternalDisclosureListStaffTime("");
    setResidentRightsResidentName("");
    setResidentRightsResidentSignature("");
    setResidentRightsResidentDate("");
    setResidentRightsResidentTime("");
    setResidentRightsGuardianRepresentativeName("");
    setResidentRightsGuardianRepresentativeSignature("");
    setResidentRightsGuardianRepresentativeDate("");
    setResidentRightsGuardianRepresentativeTime("");
    setPhotoVideoConsentResidentName("");
    setPhotoVideoConsentDateOfBirth("");
    setPhotoVideoConsentAdmissionDate("");
    setPhotoVideoConsentConsentGiven("");
    setPhotoVideoConsentConsentWithdrawn("");
    setPhotoVideoConsentResidentSignature("");
    setPhotoVideoConsentResidentDate("");
    setPhotoVideoConsentResidentTime("");
    setPhotoVideoConsentGuardianRepresentativeName("");
    setPhotoVideoConsentGuardianRepresentativeSignature("");
    setPhotoVideoConsentGuardianRepresentativeDate("");
    setPhotoVideoConsentGuardianRepresentativeTime("");
    setAdvanceDirectivesResidentName("");
    setAdvanceDirectivesResidentGender("");
    setAdvanceDirectivesResidentDateOfBirth("");
    setAdvanceDirectivesResidentAddress("");
    setAdvanceDirectivesResidentDate("");
    setAdvanceDirectivesProvidedInfoInitials("");
    setAdvanceDirectivesProvidedInfoDate("");
    setAdvanceDirectivesProvidedInfoTime("");
    setAdvanceDirectivesProvidedInfoRefusingInitials("");
    setAdvanceDirectivesProvidedInfoRefusingDate("");
    setAdvanceDirectivesProvidedInfoRefusingTime("");
    setAdvanceDirectivesDeveloped("");
    setAdvanceDirectivesDevelopedComment("");
    setAdvanceDirectivesExecutedInRecord("");
    setAdvanceDirectivesExecutedInRecordComment("");
    setAdvanceDirectivesFilingStatusWishNotFiled(false);
    setAdvanceDirectivesFilingStatusAskedForCopyNotProvided(false);
    setAdvanceDirectivesFilingStatusOther(false);
    setAdvanceDirectivesCoordinationOfCareCopySentToPCP("");
    setAdvanceDirectivesCoordinationOfCareActedOn("");
    setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotified("");
    setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment("");
    setComplaintProcessAcknowledgementCompany("");
    setComplaintProcessAcknowledgementResidentName("");
    setComplaintProcessAcknowledgementResidentSignature("");
    setComplaintProcessAcknowledgementResidentDate("");
    setComplaintProcessAcknowledgementResidentTime("");
    setComplaintProcessAcknowledgementGuardianRepresentativeName("");
    setComplaintProcessAcknowledgementGuardianRepresentativeSignature("");
    setComplaintProcessAcknowledgementGuardianRepresentativeDate("");
    setComplaintProcessAcknowledgementGuardianRepresentativeTime("");
    setOrientationToAgencyCompanyFollowing("");
    setOrientationToAgencyCompany("");
    setORIENTATIONDropDown("");
    setOrientationToAgencyResidentSignature("");
    setOrientationToAgencyResidentDate("");
    setOrientationToAgencyResidentTime("");
    setOrientationToAgencyGuardianRepresentativeName("");
    setOrientationToAgencyGuardianRepresentativeSignature("");
    setOrientationToAgencyGuardianRepresentativeDate("");
    setOrientationToAgencyGuardianRepresentativeTime("");
    setPromotionTalkStrategicApproach("");
    setLockBoxKeyIssueReturnDateKeyIssued("");
    setLockBoxKeyIssueReturnDateKeyReturned("");
    setLockBoxKeyIssueReturnAddress("");
    setLockBoxKeyIssueReturnResponsibleFor("");
    setLockBoxKeyIssueReturnResponsibleForCorporation("");
    setLockBoxKeyIssueReturnCharged("");
    setLockBoxKeyIssueReturnResidentName("");
    setLockBoxKeyIssueReturnResidentSignature("");
    setLockBoxKeyIssueReturnResidentDate("");
    setLockBoxKeyIssueReturnResidentTime("");
    setLockBoxKeyIssueReturnGuardianRepresentativeName("");
    setLockBoxKeyIssueReturnGuardianRepresentativeSignature("");
    setLockBoxKeyIssueReturnGuardianRepresentativeDate("");
    setLockBoxKeyIssueReturnGuardianRepresentativeTime("");
    setLockBoxKeyIssueReturnStaffName("");
    setLockBoxKeyIssueReturnStaffSignature("");
    setLockBoxKeyIssueReturnStaffDate("");
    setLockBoxKeyIssueReturnStaffTime("");
    setInsuranceInformationPrimaryInsurancePolicyholderName("");
    setInsuranceInformationPrimaryInsurancePolicyholderDateOfBirth("");
    setInsuranceInformationPrimaryInsurancePolicyholderAddress("");
    setInsuranceInformationPrimaryInsurancePolicyholderCity("");
    setInsuranceInformationPrimaryInsurancePolicyholderState("");
    setInsuranceInformationPrimaryInsurancePolicyholderZip("");
    setInsuranceInformationPrimaryInsurancePolicyholderPhone("");
    setInsuranceInformationPrimaryInsurancePolicyholderRelationship("");
    setInsuranceInformationPrimaryInsuranceCompany("");
    setInsuranceInformationPrimaryInsuranceCustomerServicePhone("");
    setInsuranceInformationPrimaryInsuranceSubscriberNumber("");
    setInsuranceInformationPrimaryInsuranceSubscriberGroup("");
    setInsuranceInformationPrimaryInsuranceSubscriberEffectiveDate("");
    setInsuranceInformationSecondaryInsurancePolicyholderName("");
    setInsuranceInformationSecondaryInsurancePolicyholderDateOfBirth("");
    setInsuranceInformationSecondaryInsurancePolicyholderAddress("");
    setInsuranceInformationSecondaryInsurancePolicyholderCity("");
    setInsuranceInformationSecondaryInsurancePolicyholderState("");
    setInsuranceInformationSecondaryInsurancePolicyholderZip("");
    setInsuranceInformationSecondaryInsurancePolicyholderPhone("");
    setInsuranceInformationSecondaryInsurancePolicyholderRelationship("");
    setInsuranceInformationSecondaryInsuranceCompany("");
    setInsuranceInformationSecondaryInsuranceCustomerServicePhone("");
    setInsuranceInformationSecondaryInsuranceSubscriberNumber("");
    setInsuranceInformationSecondaryInsuranceSubscriberGroup("");
    setInsuranceInformationSecondaryInsuranceSubscriberEffectiveDate("");
    setObligationsAndAuthorizationResidentName("");
    setObligationsAndAuthorizationResidentSignature("");
    setObligationsAndAuthorizationResidentDate("");
    setObligationsAndAuthorizationResidentTime("");
    setObligationsAndAuthorizationGuardianRepresentativeName("");
    setObligationsAndAuthorizationGuardianRepresentativeSignature("");
    setObligationsAndAuthorizationGuardianRepresentativeDate("");
    setObligationsAndAuthorizationGuardianRepresentativeTime("");
  };
  const data = {
    patientId: userId,
    iAgree,
    saveAsDraft,
    guardianRepresentativeName,
    guardianRepresentativeSignature,
    guardianRepresentativeDate,
    guardianRepresentativeTime,
    staffName,
    staffSignature,
    staffDate,
    staffTime,
    internalDisclosureList: internalDisclosureList,
    internalDisclosureListExpire,
    internalDisclosureListResidentName,
    internalDisclosureListResidentSignature,
    internalDisclosureListResidentDate,
    internalDisclosureListGuardianRepresentativeName,
    internalDisclosureListGuardianRepresentativeSignature,
    internalDisclosureListGuardianRepresentativeDate,
    internalDisclosureListGuardianRepresentativeTime,
    internalDisclosureListResidentTime,
    internalDisclosureListStaffName,
    residentRightsResidentSignatureValue,
    residentRightsResidentSignatureValueDate,
    residentRightsResidentSignatureValueTime,
    residentRightsResidentName,
    residentRightsResidentSignature,
    residentRightsResidentDate,
    residentRightsResidentTime,
    residentRightsGuardianRepresentativeName,
    residentRightsGuardianRepresentativeSignature,
    residentRightsGuardianRepresentativeDate,
    residentRightsGuardianRepresentativeTime,
    photoVideoConsentResidentName,
    photoVideoConsentDateOfBirth,
    photoVideoConsentAdmissionDate,
    photoVideoConsentConsentGiven,
    photoVideoConsentConsentWithdrawn,
    photoVideoConsentResidentSignature,
    photoVideoConsentResidentDate,
    photoVideoConsentResidentTime,
    photoVideoConsentGuardianRepresentativeName,
    advanceDirectivesResidentName,
    advanceDirectivesResidentGender,
    advanceDirectivesResidentDateOfBirth,
    advanceDirectivesResidentAddress,
    advanceDirectivesResidentDate,
    advanceDirectivesProvidedInfoInitials,
    advanceDirectivesProvidedInfoDate,
    advanceDirectivesProvidedInfoRefusingInitials,
    advanceDirectivesProvidedInfoRefusingDate,
    advanceDirectivesProvidedInfoRefusingTime,
    advanceDirectivesDeveloped,
    advanceDirectivesDevelopedComment,
    advanceDirectivesExecutedInRecord,
    advanceDirectivesExecutedInRecordComment,
    advanceDirectivesFilingStatusWishNotFiled,
    advanceDirectivesFilingStatusAskedForCopyNotProvided,
    advanceDirectivesFilingStatusOther,
    advanceDirectivesCoordinationOfCareCopySentToPCP,
    advanceDirectivesCoordinationOfCareActedOn,
    advanceDirectivesCoordinationOfCareAppropriatePartiesNotified,
    advanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment,
    complaintProcessAcknowledgementCompany,
    complaintProcessAcknowledgementResidentName,
    complaintProcessAcknowledgementResidentSignature,
    complaintProcessAcknowledgementResidentDate,
    complaintProcessAcknowledgementResidentTime,
    complaintProcessAcknowledgementGuardianRepresentativeName,
    orientationToAgencyCompany,
    orientationToAgencyGuardianRepresentativeName,
    promotionTalkStrategicApproach,
    lockBoxKeyIssueReturnDateKeyIssued,
    lockBoxKeyIssueReturnDateKeyReturned,
    lockBoxKeyIssueReturnAddress,
    lockBoxKeyIssueReturnResponsibleFor,
    lockBoxKeyIssueReturnResponsibleForCorporation,
    lockBoxKeyIssueReturnCharged,
    lockBoxKeyIssueReturnResidentName,
    lockBoxKeyIssueReturnGuardianRepresentativeName,
    lockBoxKeyIssueReturnGuardianRepresentativeSignature,
    lockBoxKeyIssueReturnGuardianRepresentativeDate,
    lockBoxKeyIssueReturnGuardianRepresentativeTime,
    lockBoxKeyIssueReturnStaffName,
    insuranceInformationPrimaryInsurancePolicyholderName,
    insuranceInformationPrimaryInsurancePolicyholderDateOfBirth,
    insuranceInformationPrimaryInsurancePolicyholderAddress,
    insuranceInformationPrimaryInsurancePolicyholderCity,
    insuranceInformationPrimaryInsurancePolicyholderState,
    insuranceInformationPrimaryInsurancePolicyholderZip,
    insuranceInformationPrimaryInsurancePolicyholderPhone,
    insuranceInformationPrimaryInsurancePolicyholderRelationship,
    insuranceInformationPrimaryInsuranceCompany,
    insuranceInformationPrimaryInsuranceCustomerServicePhone,
    insuranceInformationPrimaryInsuranceSubscriberNumber,
    insuranceInformationPrimaryInsuranceSubscriberGroup,
    insuranceInformationPrimaryInsuranceSubscriberEffectiveDate,
    insuranceInformationSecondaryInsurancePolicyholderName,
    insuranceInformationSecondaryInsurancePolicyholderDateOfBirth,
    insuranceInformationSecondaryInsurancePolicyholderAddress,
    insuranceInformationSecondaryInsurancePolicyholderCity,
    insuranceInformationSecondaryInsurancePolicyholderState,
    insuranceInformationSecondaryInsurancePolicyholderZip,
    insuranceInformationSecondaryInsurancePolicyholderPhone,
    insuranceInformationSecondaryInsurancePolicyholderRelationship,
    insuranceInformationSecondaryInsuranceCompany,
    insuranceInformationSecondaryInsuranceCustomerServicePhone,
    insuranceInformationSecondaryInsuranceSubscriberNumber,
    insuranceInformationSecondaryInsuranceSubscriberGroup,
    insuranceInformationSecondaryInsuranceSubscriberEffectiveDate,
    obligationsAndAuthorizationResidentName,
    obligationsAndAuthorizationGuardianRepresentativeName,
    signatures,
  };
  const submitHandler = (e) => {
    e.preventDefault();
    initializeValues();
    navigate("/intake");
  };
  // Every "PRINT THIS FORM" button now prints ALL 10 pages in one PDF.
  // The per-page handlePrintUpdate{N} functions are retained (Cmd+P and the
  // legacy single-page print path still route through them if needed) but
  // the visible button below dispatches triggerPrintAll.

  // Auto-fire print-all when opened with ?autoPrint=1 (from the resident
  // documents list download button). Wait for data to load before firing.
  const [searchParams] = useSearchParams();
  const [hasAutoPrinted, setHasAutoPrinted] = useState(false);
  useEffect(() => {
    if (
      !hasAutoPrinted &&
      searchParams.get("autoPrint") === "1" &&
      getApiData
    ) {
      setHasAutoPrinted(true);
      setTimeout(() => triggerPrintAll(), 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApiData, searchParams, hasAutoPrinted]);

  // TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): typed-vs-pen mutex was removed,
  // so both methods can coexist on the same record. Legacy "Digitally Signed
  // by..." per-page lines are NO longer suppressed by inline pen signatures —
  // both render side by side. Original suppression kept as comment.
  const legacySignatures = signatures || [];
  /* TEMP-DISABLED-BHP-BHT-ADMIN: original suppression
  const hasAnyInlineSignature = ["resident", "witness"].some(
    (r) => getApiData?.roleSignatures?.[r]?.rawSignatureImage
  );
  const legacySignatures = hasAnyInlineSignature ? [] : (signatures || []);
  */
  const renderInlineSignatures = () => (
    <div className="signature-sections-inline mt-3">
      {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): hidden per client request. See documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */}
      {/* <SignatureSection role="bht" label="BHT Signature" variant="green" mode="view" signature={getApiData?.roleSignatures?.bht} /> */}
      {/* <SignatureSection role="bhp" label="BHP Signature" variant="purple" mode="view" signature={getApiData?.roleSignatures?.bhp} /> */}
      {/* <SignatureSection role="admin" label="Admin Signature" variant="pink" mode="view" signature={getApiData?.roleSignatures?.admin} /> */}
      <SignatureSection
        role="resident"
        label="Resident/Representative Signature"
        variant="blue"
        mode="view"
        signature={getApiData?.roleSignatures?.resident}
        signerNameOverride={`${getApiData?.patientId?.firstName ?? ""} ${getApiData?.patientId?.lastName ?? ""}`.trim()}
      />
      <SignatureSection
        role="witness"
        label="Witness Signature"
        variant="yellow"
        mode="view"
        signature={getApiData?.roleSignatures?.witness}
      />
    </div>
  );

  const formDisplayState = {
    advanceDirectivesCoordinationOfCareActedOn,
    advanceDirectivesCoordinationOfCareAppropriatePartiesNotified,
    advanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment,
    advanceDirectivesCoordinationOfCareCopySentToPCP,
    advanceDirectivesDeveloped,
    advanceDirectivesDevelopedComment,
    advanceDirectivesExecutedInRecord,
    advanceDirectivesExecutedInRecordComment,
    advanceDirectivesFilingStatusAskedForCopyNotProvided,
    advanceDirectivesFilingStatusOther,
    advanceDirectivesFilingStatusWishNotFiled,
    advanceDirectivesProvidedInfoAcknowledged,
    advanceDirectivesProvidedInfoDate,
    advanceDirectivesProvidedInfoInitials,
    advanceDirectivesProvidedInfoRefusingDate,
    advanceDirectivesProvidedInfoRefusingInitials,
    advanceDirectivesProvidedInfoRefusingTime,
    advanceDirectivesProvidedInfoTime,
    advanceDirectivesRefusingAcknowledged,
    advanceDirectivesResidentAddress,
    advanceDirectivesResidentDate,
    advanceDirectivesResidentDateOfBirth,
    advanceDirectivesResidentGender,
    advanceDirectivesResidentName,
    complaintProcessAcknowledgementCompany,
    complaintProcessAcknowledgementGuardianRepresentativeDate,
    complaintProcessAcknowledgementGuardianRepresentativeName,
    complaintProcessAcknowledgementGuardianRepresentativeSignature,
    complaintProcessAcknowledgementGuardianRepresentativeTime,
    complaintProcessAcknowledgementResidentDate,
    complaintProcessAcknowledgementResidentName,
    complaintProcessAcknowledgementResidentSignature,
    complaintProcessAcknowledgementResidentTime,
    guardianRepresentativeDate,
    guardianRepresentativeName,
    guardianRepresentativeSignature,
    guardianRepresentativeTime,
    houseRulesAcknowledgementName,
    houseRulesDropDown,
    iAgree,
    insuranceInformationPrimaryInsuranceCompany,
    insuranceInformationPrimaryInsuranceCustomerServicePhone,
    insuranceInformationPrimaryInsurancePolicyholderAddress,
    insuranceInformationPrimaryInsurancePolicyholderCity,
    insuranceInformationPrimaryInsurancePolicyholderDateOfBirth,
    insuranceInformationPrimaryInsurancePolicyholderName,
    insuranceInformationPrimaryInsurancePolicyholderPhone,
    insuranceInformationPrimaryInsurancePolicyholderRelationship,
    insuranceInformationPrimaryInsurancePolicyholderState,
    insuranceInformationPrimaryInsurancePolicyholderZip,
    insuranceInformationPrimaryInsuranceSubscriberEffectiveDate,
    insuranceInformationPrimaryInsuranceSubscriberGroup,
    insuranceInformationPrimaryInsuranceSubscriberNumber,
    insuranceInformationSecondaryInsuranceCompany,
    insuranceInformationSecondaryInsuranceCustomerServicePhone,
    insuranceInformationSecondaryInsurancePolicyholderAddress,
    insuranceInformationSecondaryInsurancePolicyholderCity,
    insuranceInformationSecondaryInsurancePolicyholderDateOfBirth,
    insuranceInformationSecondaryInsurancePolicyholderName,
    insuranceInformationSecondaryInsurancePolicyholderPhone,
    insuranceInformationSecondaryInsurancePolicyholderRelationship,
    insuranceInformationSecondaryInsurancePolicyholderState,
    insuranceInformationSecondaryInsurancePolicyholderZip,
    insuranceInformationSecondaryInsuranceSubscriberEffectiveDate,
    insuranceInformationSecondaryInsuranceSubscriberGroup,
    insuranceInformationSecondaryInsuranceSubscriberNumber,
    internalContect,
    internalDisclosureListExpire,
    internalDisclosureListGuardianRepresentativeDate,
    internalDisclosureListGuardianRepresentativeName,
    internalDisclosureListGuardianRepresentativeSignature,
    internalDisclosureListGuardianRepresentativeTime,
    internalDisclosureListResidentDate,
    internalDisclosureListResidentName,
    internalDisclosureListResidentSignature,
    internalDisclosureListResidentTime,
    internalDisclosureListStaffDate,
    internalDisclosureListStaffName,
    internalDisclosureListStaffSignature,
    internalDisclosureListStaffTime,
    internalName,
    internalRelationship,
    lockBoxKeyIssueReturnAddress,
    lockBoxKeyIssueReturnCharged,
    lockBoxKeyIssueReturnDateKeyIssued,
    lockBoxKeyIssueReturnDateKeyReturned,
    lockBoxKeyIssueReturnGuardianRepresentativeDate,
    lockBoxKeyIssueReturnGuardianRepresentativeName,
    lockBoxKeyIssueReturnGuardianRepresentativeSignature,
    lockBoxKeyIssueReturnGuardianRepresentativeTime,
    lockBoxKeyIssueReturnResidentName,
    lockBoxKeyIssueReturnResponsibleFor,
    lockBoxKeyIssueReturnResponsibleForCorporation,
    lockBoxKeyIssueReturnStaffName,
    obligationsAndAuthorizationGuardianRepresentativeDate,
    obligationsAndAuthorizationGuardianRepresentativeName,
    obligationsAndAuthorizationGuardianRepresentativeSignature,
    obligationsAndAuthorizationGuardianRepresentativeTime,
    obligationsAndAuthorizationResidentDate,
    obligationsAndAuthorizationResidentName,
    obligationsAndAuthorizationResidentSignature,
    obligationsAndAuthorizationResidentTime,
    orientationToAgencyCompany,
    orientationToAgencyCompanyFollowing,
    orientationToAgencyGuardianRepresentativeDate,
    orientationToAgencyGuardianRepresentativeName,
    orientationToAgencyGuardianRepresentativeSignature,
    orientationToAgencyGuardianRepresentativeTime,
    orientationToAgencyResidentDate,
    orientationToAgencyResidentSignature,
    orientationToAgencyResidentTime,
    photoVideoConsentAdmissionDate,
    photoVideoConsentConsentGiven,
    photoVideoConsentConsentWithdrawn,
    photoVideoConsentDateOfBirth,
    photoVideoConsentGuardianRepresentativeDate,
    photoVideoConsentGuardianRepresentativeName,
    photoVideoConsentGuardianRepresentativeSignature,
    photoVideoConsentGuardianRepresentativeTime,
    photoVideoConsentResidentDate,
    photoVideoConsentResidentName,
    photoVideoConsentResidentSignature,
    photoVideoConsentResidentTime,
    promotionTalkStrategicApproach,
    receiptDropDown,
    residentDate,
    residentRightsGuardianRepresentativeDate,
    residentRightsGuardianRepresentativeName,
    residentRightsGuardianRepresentativeSignature,
    residentRightsGuardianRepresentativeTime,
    residentRightsResidentDate,
    residentRightsResidentName,
    residentRightsResidentSignature,
    residentRightsResidentSignatureValue,
    residentRightsResidentSignatureValueDate,
    residentRightsResidentSignatureValueTime,
    residentRightsResidentTime,
    residentSignature,
    residentSignatureTime,
    saveAsDraft,
    signatures,
    staffDate,
    staffName,
    staffSignature,
    staffTime,
    userId,
  };

  return {
    ...data,
    ...formDisplayState,
    Cpage,
    page,
    setPage,
    location,
    patientDetail,
    hoursFormat,
    navigate,
    id,
    profile,
    ORIENTATIONDropDown,
    _adNorm,
    companyName,
    draftModel,
    setDraftModel,
    filedForm,
    getApiData,
    handleNextPage,
    handlePrevPage,
    hasAutoPrinted,
    previusData,
    primaryInsurance,
    printAllMode,
    renderInlineSignatures,
    legacySignatures,
    showSignatureResident,
    setShowSignatureResident,
    signInModel1,
    signInModel2,
    signInModel3,
    signInModel4,
    signInModel5,
    signInModel6,
    setSigInModel1,
    setSigInModel2,
    setSigInModel3,
    setSigInModel4,
    setSigInModel5,
    setSigInModel6,
    setiAgree,
    setPhotoVideoConsentConsentGiven,
    setPhotoVideoConsentConsentWithdrawn,
    setAdvanceDirectivesResidentGender,
    setAdvanceDirectivesDeveloped,
    setAdvanceDirectivesDevelopedComment,
    setAdvanceDirectivesExecutedInRecord,
    setAdvanceDirectivesExecutedInRecordComment,
    setAdvanceDirectivesFilingStatusWishNotFiled,
    setAdvanceDirectivesFilingStatusAskedForCopyNotProvided,
    setAdvanceDirectivesFilingStatusOther,
    setAdvanceDirectivesCoordinationOfCareCopySentToPCP,
    setAdvanceDirectivesCoordinationOfCareActedOn,
    setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotified,
    setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment,
    verbalConsentResidentRepresentative,
    lockBoxKeyIssueReturnStaffSignature,
    lockBoxKeyIssueReturnStaffDate,
    lockBoxKeyIssueReturnStaffTime,
    lockBoxKeyIssueReturnResidentSignature,
    lockBoxKeyIssueReturnResidentDate,
    lockBoxKeyIssueReturnResidentTime,
    loading,
    initializeValues,
    submitHandler,
    user,
    userDetail,
    componentRef1,
    componentRef2,
    componentRef3,
    componentRef4,
    componentRef5,
    componentRef6,
    componentRef7,
    componentRef8,
    componentRef9,
    handlePrintUpdate1,
    handlePrintUpdate2,
    handlePrintUpdate3,
    handlePrintUpdate4,
    handlePrintUpdate5,
    handlePrintUpdate6,
    handlePrintUpdate7,
    handlePrintUpdate8,
    handlePrintUpdate9,
    componentRefNew3,
    componentRefNew8,
    handlePrintNew3,
    handlePrintNew8,
    printRef,
    print,
    handlePrintAll,
    triggerPrintAll,
  };
};
