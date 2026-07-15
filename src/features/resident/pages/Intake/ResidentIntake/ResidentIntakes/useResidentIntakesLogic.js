/* eslint-disable no-unused-vars */
/** @format */
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  intakeService,
  residentService,
  COMMON_APIS,
} from "@/features/shared/services/index";
import { AiFillDelete } from "react-icons/ai";
import AutoSize from "@/features/shared/ui/forms/AutoSize";
import { signatureFormat } from "@/utils/utils";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import NavWrapper from "@/utils/NavWrapper";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
} from "react-bootstrap";
import {
  AddSignatureForTable,
  formatDateToMMDDYYYY,
  fetchPaitentName,
} from "@/utils/utils";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import {
  houseRulesOptionValue,
  sanitizeHouseRulesArray,
} from "@/features/employee/pages/Intake/ResidentIntake/houseRulesOptions";
import DatePicker from "react-datepicker";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import { ROLES } from "@/features/shared/constants/index";
import { useResidentIntakesPrint } from "./useResidentIntakesPrint";

const _adNorm = (v) => (v === true ? "yes" : v === false ? "no" : v || "");

export const useResidentIntakesLogic = () => {
  const [getApiData, setGetApiData] = useState("");
  const { id } = useParams();
  const [loading, setLoading] = useState("");
  const [filedForm, setFiledForm] = useState("");
  const navigate = useNavigate();
  const patientDetail = useSelector(userProfile);
  const hoursFormat = patientDetail?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printApi = useResidentIntakesPrint({ getApiData, patientDetail });
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
  } = printApi;
  //page state
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
  const [signatureModals, setSignatureModals] = useState({
    signInModel1: false,
    signInModel2: false,
    signInModel3: false,
    signInModel4: false,
    signInModel5: false,
    signInModel6: false,
    signInModel7: false,
    signInModel8: false,
    signInModel9: false,
    signInModel10: false,
  });
  const setSigInModel1 = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        signInModel1: v(prev.signInModel1),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, signInModel1: v }));
    }
  };
  const setSignInModel2 = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        signInModel2: v(prev.signInModel2),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, signInModel2: v }));
    }
  };
  const setSignInModel3 = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        signInModel3: v(prev.signInModel3),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, signInModel3: v }));
    }
  };
  const setSigInModel4 = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        signInModel4: v(prev.signInModel4),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, signInModel4: v }));
    }
  };
  const setSigInModel5 = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        signInModel5: v(prev.signInModel5),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, signInModel5: v }));
    }
  };
  const setSigInModel6 = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        signInModel6: v(prev.signInModel6),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, signInModel6: v }));
    }
  };
  const setSigInModel7 = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        signInModel7: v(prev.signInModel7),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, signInModel7: v }));
    }
  };
  const setSigInModel8 = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        signInModel8: v(prev.signInModel8),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, signInModel8: v }));
    }
  };
  const setSigInModel9 = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        signInModel9: v(prev.signInModel9),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, signInModel9: v }));
    }
  };
  const setSigInModel10 = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        signInModel10: v(prev.signInModel10),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, signInModel10: v }));
    }
  };
  const signInModel1 = signatureModals.signInModel1;
  const signInModel2 = signatureModals.signInModel2;
  const signInModel3 = signatureModals.signInModel3;
  const signInModel4 = signatureModals.signInModel4;
  const signInModel5 = signatureModals.signInModel5;
  const signInModel6 = signatureModals.signInModel6;
  const signInModel7 = signatureModals.signInModel7;
  const signInModel8 = signatureModals.signInModel8;
  const signInModel9 = signatureModals.signInModel9;
  const signInModel10 = signatureModals.signInModel10;

  //state
  const [draftModel, setDraftModel] = useState(false);
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [user, setUser] = useState("");
  const profile = useSelector(userProfile);
  const userDetail = profile || "";
  const companyName =
    userDetail?.userType === ROLES.ADMIN
      ? userDetail?.companyName
      : userDetail?.adminId?.companyName || "";
  // useState value is start
  const userId = userDetail?._id || "";
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
  const [receiptDropDown, setReceiptDropDown] = useState([]);
  const [houseRulesDropDown, setHouseRulesDropDown] = useState([]);
  const [houseRulesAcknowledgementName, setHouseRulesAcknowledgementName] =
    useState("");
  const [
    verbalConsentResidentRepresentative,
    setVerbalConsentResidentRepresentative,
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
  const {
    signatures: roleSignatures,
    updateSignature: updateRoleSignature,
    loadFromApi: loadRoleSignaturesFromApi,
  } = useSignatures();
  // Witness coupled-pair (2026-04-26): block submit if witness sig XOR name.
  const witnessNamePresent = !!(
    roleSignatures?.witness?.name &&
    roleSignatures.witness.name.trim() &&
    roleSignatures.witness.name.trim() !== "undefined undefined"
  );
  const witnessSigPresent = !!roleSignatures?.witness?.rawSignatureImage;
  const witnessIncomplete = witnessSigPresent && !witnessNamePresent;
  const allPenSigsHaveNames = Object.values(roleSignatures || {}).every(
    (s) => !s?.rawSignatureImage || !!s?.name?.trim(),
  );

  // Function to format the date as MM-DD-YYYY

  useEffect(() => {
    if (getApiData) {
      setiAgree(getApiData?.iAgree);
      setResidentSignature(getApiData?.residentSignature);
      setResidentDate(getApiData?.residentDate ? getApiData?.residentDate : "");
      setSignatures(getApiData?.signatures);
      if (getApiData?.roleSignatures) {
        loadRoleSignaturesFromApi(getApiData.roleSignatures);
      }
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
          ? getApiData?.patientId?.dateOfBirth?.slice(0, 10)
          : "",
      );
      setPhotoVideoConsentAdmissionDate(
        getApiData?.patientId?.admitDate
          ? getApiData?.patientId?.admitDate?.slice(0, 10)
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
          ? getApiData?.patientId?.dateOfBirth?.slice(0, 10)
          : "",
      );
      setAdvanceDirectivesResidentAddress(
        getApiData?.advanceDirectivesResidentAddress,
      );
      setAdvanceDirectivesResidentDate(
        getApiData?.advanceDirectivesResidentDate
          ? getApiData?.advanceDirectivesResidentDate.slice(0, 10)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApiData]);
  const [previusData, setPreviusData] = useState(false);
  useEffect(() => {
    if (id) {
      residentService.getApiResident({
        url: COMMON_APIS.GET_PATIENT_INTAKE(id),
        setResponse: setGetApiData,
        isIntake: true,
      });
    }
  }, [id]);
  useEffect(() => {
    setLoading(true);
    if (previusData) {
      residentService.getResidentIntakeForm(userId, setGetApiData, setLoading);
    } else {
      setLoading(false);
    }
  }, [userId, previusData]);
  useEffect(() => {
    setFiledForm(userDetail?.residentIntakes);
  }, [userDetail]);

  // handle internal list
  const handleinternalData = () => {
    if (internalContect || internalName || internalRelationship) {
      setInternalDisclosureList((prev) => [
        ...prev,
        {
          contactNumber: internalContect,
          personName: internalName,
          relationship: internalRelationship,
        },
      ]);
      setInternalContect("");
      setInternalRelationship("");
      setInternalName("");
    }
  };

  // handle delete array
  const handleDeleteArrayInternalDisclosure = (index) => {
    setInternalDisclosureList((prev) => [
      ...prev.filter((_, i) => i !== index),
    ]);
  };
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
    // new value
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
    advanceDirectivesProvidedInfoAcknowledged,
    advanceDirectivesRefusingAcknowledged,
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
    houseRulesAcknowledgementAtAdmission: houseRulesDropDown,
    houseRulesAcknowledgementName,
    verbalConsentResidentRepresentative,
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
    roleSignatures,
  };
  const optionValue = [
    {
      label:
        "An explanation of the behavioral health services the agency provides",
      value:
        "An explanation of the behavioral health services the agency provides",
    },
    {
      label:
        "A description of the expectations for resident behavior and program rules",
      value:
        "A description of the expectations for resident behavior and program rules",
    },
    {
      label: "A tour of the premises and identification of the evacuation path",
      value: "A tour of the premises and identification of the evacuation path",
    },
    {
      label: "A schedule of planned activities for residents",
      value: "A schedule of planned activities for residents",
    },
    {
      label: "Introductions to staff members and employees.",
      value: "Introductions to staff members and employees.",
    },
  ];
  const handleKeyDownORIENTATIONDropDown = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const inputValue = event.target.value.trim();

      // Check if the input value already exists in the options array
      const optionExists = optionValue.some(
        (option) => option.value === inputValue,
      );

      // If the input value doesn't exist, add it to the array
      if (!optionExists) {
        const newOptions = [
          ...optionValue,
          {
            value: inputValue,
            label: inputValue,
          },
        ];

        // Update the state with the new options
        setORIENTATIONDropDown(newOptions);

        // Update the selected values to include the newly created option
        const newSelectedValues = [
          ...ORIENTATIONDropDown,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setORIENTATIONDropDown(newSelectedValues);
      }

      // Clear the input value after adding the option
      event.target.value = "";
    }
  };
  const optionHandler = (optionValue) => {
    setORIENTATIONDropDown(optionValue);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    intakeService.residentIntake.update(id, data, { setLoading, navigate });
  };
  const editSignHandler = (sign, page) => {
    setSignatures((prevSignature) =>
      prevSignature?.map((entry) =>
        entry.page === page
          ? {
              ...entry,
              sign: entry?.sign?.some((s) => s.signerId === patientDetail?._id)
                ? entry.sign?.map((s) =>
                    s.signerId === patientDetail?._id
                      ? {
                          ...s,
                          signature: sign,
                        }
                      : s,
                  )
                : [
                    ...entry.sign,
                    {
                      signerId: patientDetail._id,
                      signature: sign,
                      dateSigned: "",
                      signedTime: "",
                    },
                  ],
            }
          : entry,
      ),
    );
  };
  const editDateHandler = (date, page) => {
    setSignatures((prevSignature) =>
      prevSignature?.map((entry) =>
        entry.page === page
          ? {
              ...entry,
              sign: entry?.sign?.some((s) => s.signerId === patientDetail?._id)
                ? entry.sign?.map((s) =>
                    s.signerId === patientDetail?._id
                      ? {
                          ...s,
                          dateSigned: date,
                        }
                      : s,
                  )
                : [
                    ...entry.sign,
                    {
                      signerId: patientDetail._id,
                      signature: "",
                      dateSigned: date,
                      signedTime: "",
                    },
                  ],
            }
          : entry,
      ),
    );
  };

  // 2026-04-26: per client request, only page 11's SAVED AND SIGNED button
  // is shown; clicking it fans out the signer entry to all pages so the
  // legacy "Digitally Signed by..." line still renders on every page in the
  // PDF/print and the existing per-page submit-gate auto-passes.
  const editSignHandlerAllPages = (sign) => {
    setSignatures((prevSignature) =>
      prevSignature?.map((entry) => ({
        ...entry,
        sign: entry?.sign?.some((s) => s.signerId === patientDetail?._id)
          ? entry.sign?.map((s) =>
              s.signerId === patientDetail?._id
                ? {
                    ...s,
                    signature: sign,
                  }
                : s,
            )
          : [
              ...entry.sign,
              {
                signerId: patientDetail._id,
                signature: sign,
                dateSigned: "",
                signedTime: "",
              },
            ],
      })),
    );
  };
  const editDateHandlerAllPages = (date) => {
    setSignatures((prevSignature) =>
      prevSignature?.map((entry) => ({
        ...entry,
        sign: entry?.sign?.some((s) => s.signerId === patientDetail?._id)
          ? entry.sign?.map((s) =>
              s.signerId === patientDetail?._id
                ? {
                    ...s,
                    dateSigned: date,
                  }
                : s,
            )
          : [
              ...entry.sign,
              {
                signerId: patientDetail._id,
                signature: "",
                dateSigned: date,
                signedTime: "",
              },
            ],
      })),
    );
  };
  const signaturePairs = [
    {
      show: signInModel1,
      onHide: setSigInModel1,
      page: 1,
    },
    {
      show: signInModel2,
      onHide: setSignInModel2,
      page: 2,
    },
    {
      show: signInModel3,
      onHide: setSignInModel3,
      page: 3,
    },
    {
      show: signInModel4,
      onHide: setSigInModel4,
      page: 4,
    },
    {
      show: signInModel5,
      onHide: setSigInModel5,
      page: 5,
    },
    {
      show: signInModel6,
      onHide: setSigInModel6,
      page: 6,
    },
    {
      show: signInModel7,
      onHide: setSigInModel7,
      page: 7,
    },
    {
      show: signInModel8,
      onHide: setSigInModel8,
      page: 8,
    },
    {
      show: signInModel9,
      onHide: setSigInModel9,
      page: 10,
    },
    {
      show: signInModel10,
      onHide: setSigInModel10,
      page: 11,
    },
  ];

  return {
    ...data,
    Cpage,
    ORIENTATIONDropDown,
    _adNorm,
    advanceDirectivesDeveloped,
    advanceDirectivesResidentDate,
    advanceDirectivesResidentGender,
    advanceDirectivesResidentName,
    companyName,
    draftModel,
    editDateHandler,
    editDateHandlerAllPages,
    editSignHandler,
    editSignHandlerAllPages,
    filedForm,
    getApiData,
    guardianRepresentativeDate,
    guardianRepresentativeName,
    guardianRepresentativeSignature,
    guardianRepresentativeTime,
    handleDeleteArrayInternalDisclosure,
    handleKeyDownORIENTATIONDropDown,
    handleNextPage,
    handlePrevPage,
    handleinternalData,
    hoursFormat,
    houseRulesAcknowledgementName,
    houseRulesDropDown,
    iAgree,
    id,
    initializeValues,
    internalContect,
    internalDisclosureList,
    internalDisclosureListExpire,
    internalDisclosureListStaffDate,
    internalDisclosureListStaffName,
    internalDisclosureListStaffTime,
    internalName,
    internalRelationship,
    loadRoleSignaturesFromApi,
    loading,
    lockBoxKeyIssueReturnAddress,
    lockBoxKeyIssueReturnCharged,
    lockBoxKeyIssueReturnStaffDate,
    lockBoxKeyIssueReturnStaffName,
    lockBoxKeyIssueReturnStaffTime,
    navigate,
    optionHandler,
    optionValue,
    orientationToAgencyCompany,
    orientationToAgencyResidentDate,
    orientationToAgencyResidentTime,
    page,
    patientDetail,
    photoVideoConsentAdmissionDate,
    photoVideoConsentConsentGiven,
    photoVideoConsentDateOfBirth,
    photoVideoConsentResidentDate,
    photoVideoConsentResidentName,
    photoVideoConsentResidentTime,
    previusData,
    primaryInsurance,
    profile,
    promotionTalkStrategicApproach,
    receiptDropDown,
    residentDate,
    residentRightsResidentDate,
    residentRightsResidentName,
    residentRightsResidentSignature,
    residentRightsResidentTime,
    residentSignature,
    residentSignatureTime,
    roleSignatures,
    saveAsDraft,
    setDraftModel,
    setFiledForm,
    setGetApiData,
    setLoading,
    setPage,
    setSigInModel1,
    setSigInModel10,
    setSigInModel4,
    setSigInModel5,
    setSigInModel6,
    setSigInModel7,
    setSigInModel8,
    setSigInModel9,
    setSignInModel2,
    setSignInModel3,
    showSignatureResident,
    signatureModals,
    signaturePairs,
    signatures,
    staffDate,
    staffName,
    staffSignature,
    staffTime,
    submitHandler,
    updateRoleSignature,
    user,
    userDetail,
    userId,
    witnessIncomplete,
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
    setAdvanceDirectivesProvidedInfoAcknowledged,
    setAdvanceDirectivesProvidedInfoDate,
    setAdvanceDirectivesRefusingAcknowledged,
    setAdvanceDirectivesProvidedInfoRefusingDate,
    setHouseRulesDropDown,
    setVerbalConsentResidentRepresentative,
  };
};
