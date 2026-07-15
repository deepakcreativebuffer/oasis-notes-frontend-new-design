/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { intakeService } from "@/features/shared/services/index";
import { AiFillDelete } from "react-icons/ai";
import {
  AddSignatureForTable,
  deletePermission,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  isSignerPresentOnAllPages,
  signatureFormat,
} from "@/utils/utils";
import { ClipLoader } from "react-spinners";
import { AutoSize } from "@/features/shared/ui/forms/AutoSize";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import { useNavigate } from "react-router-dom";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
} from "react-bootstrap";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import {
  houseRulesOptionValue,
  sanitizeHouseRulesArray,
} from "../houseRulesOptions";
import NavWrapper from "@/utils/NavWrapper";
import DatePicker from "react-datepicker";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants/index";
import { logger } from "@/utils/index";
import { useResidentIntakesPrint } from "@/features/resident/pages/Intake/ResidentIntake/ResidentIntakes/useResidentIntakesPrint";

const _adNorm = (v) => (v === true ? "yes" : v === false ? "no" : v || "");

export const useResidentIntakeLogic = () => {
  const Profile = useSelector(userProfile);
  const hoursFormat = Profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const url = useLocation().pathname;
  const [signers, setSigners] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [residentName, setResidentName] = useState(" ");
  const [patientDetail, setPatientDetail] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const {
    signatures: roleSignatures,
    updateSignature: updateRoleSignature,
    loadFromApi: loadRoleSignaturesFromApi,
  } = useSignatures();
  const [signatures, setSignatures] = useState([
    {
      page: 1,
      sign: [],
    },
    {
      page: 2,
      sign: [],
    },
    {
      page: 3,
      sign: [],
    },
    {
      page: 4,
      sign: [],
    },
    {
      page: 5,
      sign: [],
    },
    {
      page: 6,
      sign: [],
    },
    {
      page: 7,
      sign: [],
    },
    {
      page: 8,
      sign: [],
    },
    {
      page: 9,
      sign: [],
    },
    {
      page: 10,
      sign: [],
    },
    {
      page: 11,
      sign: [],
    },
  ]);
  // pages: 1-8 unchanged; 9 = House Rules (new); 10 = Lock Box (was 9); 11 = Insurance (was 10)

  const { guardTyped, dialog: typedGuardDialog } = useTypedGuard({
    signatures: roleSignatures,
    updateSignature: updateRoleSignature,
  });
  const hasTypedInForm = (signatures || []).some((p) =>
    (p?.sign || []).some((s) => !!s?.signature),
  );
  const clearAllTyped = () => {
    setSignatures((prev) =>
      (prev || []).map((p) => ({
        ...p,
        sign: [],
      })),
    );
  };
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
  const [signatureModals, setSignatureModals] = useState({
    signInModel1: false,
    signInModel2: false,
    signInModel3: false,
    signInModel6: false,
    signInModel10: false,
    signInModel20: false,
    signInModel12: false,
    signInModel14: false,
    sigInModel8New: false,
    signInModel17: false,
    signInModel19: false,
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
  const setSigInModel2 = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        signInModel2: v(prev.signInModel2),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, signInModel2: v }));
    }
  };
  const setSigInModel3 = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        signInModel3: v(prev.signInModel3),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, signInModel3: v }));
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
  const setSigInModel20 = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        signInModel20: v(prev.signInModel20),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, signInModel20: v }));
    }
  };
  const setSigInModel12 = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        signInModel12: v(prev.signInModel12),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, signInModel12: v }));
    }
  };
  const setSigInModel14 = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        signInModel14: v(prev.signInModel14),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, signInModel14: v }));
    }
  };
  const setSigInModel8New = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        sigInModel8New: v(prev.sigInModel8New),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, sigInModel8New: v }));
    }
  };
  const setSigInModel17 = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        signInModel17: v(prev.signInModel17),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, signInModel17: v }));
    }
  };
  const setSigInModel19 = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        signInModel19: v(prev.signInModel19),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, signInModel19: v }));
    }
  };
  const signInModel1 = signatureModals.signInModel1;
  const signInModel2 = signatureModals.signInModel2;
  const signInModel3 = signatureModals.signInModel3;
  const signInModel6 = signatureModals.signInModel6;
  const signInModel10 = signatureModals.signInModel10;
  const signInModel20 = signatureModals.signInModel20;
  const signInModel12 = signatureModals.signInModel12;
  const signInModel14 = signatureModals.signInModel14;
  const sigInModel8New = signatureModals.sigInModel8New;
  const signInModel17 = signatureModals.signInModel17;
  const signInModel19 = signatureModals.signInModel19;

  const [getApiData, setGetApiData] = useState({});
  const printApi = useResidentIntakesPrint({ getApiData, patientDetail });
  const resolvedCompanyName =
    Profile?.userType === ROLES.ADMIN
      ? Profile?.companyName
      : Profile?.adminId?.companyName;
  const [companyName, setCompanyName] = useState(resolvedCompanyName || "");

  useEffect(() => {
    if (resolvedCompanyName && !companyName) {
      setCompanyName(resolvedCompanyName);
    }
  }, [resolvedCompanyName]);

  const [iAgree, setiAgree] = useState(null);
  const [guardianRepresentativeName, setGuardianRepresentativeName] =
    useState("");
  const [guardianRepresentativeSignature, setGuardianRepresentativeSignature] =
    useState("");
  const [guardianRepresentativeDate, setGuardianRepresentativeDate] =
    useState("");
  const [guardianRepresentativeTime, setGuardianRepresentativeTime] =
    useState("");
  const [staffName, setStaffName] = useState("");
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
    useState(null);
  const [
    photoVideoConsentConsentWithdrawn,
    setPhotoVideoConsentConsentWithdrawn,
  ] = useState(null);
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
  const [orientationToAgencyCompany, setOrientationToAgencyCompany] =
    useState("");
  const [ORIENTATIONDropDown, setORIENTATIONDropDown] = useState([]);
  const [receiptDropDown, setReceiptDropDown] = useState([]);
  const [receiptName, setReceiptName] = useState("");
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
  ] = useState();
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
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [isNotEditableWithSigner, setIsNotEditableWithSigner] = useState(false);
  useEffect(() => {
    if (getApiData?.data) {
      let item;
      if (
        Array.isArray(getApiData?.data) &&
        getApiData?.data.length > 0 &&
        url === "/resident-intake"
      ) {
        item = getApiData?.data[0];
      } else {
        item = getApiData?.data;
      }
      if (item) {
        if (url !== "/resident-intake") {
          setPatientId(item?.patientId?._id);
          setiAgree(item?.iAgree);
          setPhotoVideoConsentConsentGiven(item?.photoVideoConsentConsentGiven);
          setPhotoVideoConsentConsentWithdrawn(
            item?.photoVideoConsentConsentWithdrawn,
          );
          setResidentName(item?.residentName);
          setSignatures(item?.signatures);
          if (item?.roleSignatures) {
            loadRoleSignaturesFromApi(item.roleSignatures);
          }
        }
        setAdvanceDirectivesResidentGender(item?.patientId?.gender);
        setGuardianRepresentativeName(item?.guardianRepresentativeName);
        setGuardianRepresentativeSignature(
          item?.guardianRepresentativeSignature,
        );
        setGuardianRepresentativeDate(item?.guardianRepresentativeDateitem);
        setGuardianRepresentativeTime(item?.guardianRepresentativeTime);
        setStaffName(item?.staffName);
        setInternalDisclosureList(
          item?.internalDisclosureList ? item?.internalDisclosureList : [],
        );
        setInternalDisclosureListExpire(item?.internalDisclosureListExpire);
        setInternalDisclosureListResidentName(
          item?.internalDisclosureListResidentName,
        );
        setInternalDisclosureListResidentSignature(
          item?.internalDisclosureListResidentSignature,
        );
        setInternalDisclosureListResidentDate(
          item?.internalDisclosureListResidentDate,
        );
        setInternalDisclosureListResidentTime(
          item?.internalDisclosureListResidentTime,
        );
        setInternalDisclosureListGuardianRepresentativeName(
          item?.internalDisclosureListGuardianRepresentativeName,
        );
        setInternalDisclosureListGuardianRepresentativeSignature(
          item?.internalDisclosureListGuardianRepresentativeSignature,
        );
        setInternalDisclosureListGuardianRepresentativeDate(
          item?.internalDisclosureListGuardianRepresentativeDate,
        );
        setInternalDisclosureListGuardianRepresentativeTime(
          item?.internalDisclosureListGuardianRepresentativeTime,
        );
        setInternalDisclosureListStaffSignature(
          item?.internalDisclosureListStaffSignature,
        );
        setInternalDisclosureListStaffDate(
          item?.internalDisclosureListStaffDate,
        );
        setInternalDisclosureListStaffTime(
          item?.internalDisclosureListStaffTime,
        );
        setResidentRightsResidentName(item?.residentRightsResidentName);
        setResidentRightsResidentSignature(
          item?.residentRightsResidentSignature,
        );
        setResidentRightsResidentDate(item?.residentRightsResidentDate);
        setResidentRightsResidentTime(item?.residentRightsResidentTime);
        setResidentRightsGuardianRepresentativeSignature(
          item?.residentRightsGuardianRepresentativeSignature,
        );
        setResidentRightsGuardianRepresentativeDate(
          item?.residentRightsGuardianRepresentativeDate,
        );
        setResidentRightsGuardianRepresentativeTime(
          item?.residentRightsGuardianRepresentativeTime,
        );
        setPhotoVideoConsentResidentName(item?.photoVideoConsentResidentName);
        setPhotoVideoConsentDateOfBirth(item?.photoVideoConsentDateOfBirth);
        setPhotoVideoConsentAdmissionDate(item?.patientId?.admitDate);
        setPhotoVideoConsentResidentSignature(
          item?.photoVideoConsentResidentSignature,
        );
        setPhotoVideoConsentResidentDate(item?.photoVideoConsentResidentDate);
        setPhotoVideoConsentResidentTime(item?.photoVideoConsentResidentTime);
        setPhotoVideoConsentGuardianRepresentativeName(
          item?.photoVideoConsentGuardianRepresentativeName,
        );
        setPhotoVideoConsentGuardianRepresentativeSignature(
          item?.photoVideoConsentGuardianRepresentativeSignature,
        );
        setPhotoVideoConsentGuardianRepresentativeDate(
          item?.photoVideoConsentGuardianRepresentativeDate,
        );
        setPhotoVideoConsentGuardianRepresentativeTime(
          item?.photoVideoConsentGuardianRepresentativeTime,
        );
        setAdvanceDirectivesResidentName(item?.advanceDirectivesResidentName);
        setAdvanceDirectivesResidentDateOfBirth(
          getApiData?.data?.patientId?.dateOfBirth
            ? getApiData?.data?.patientId?.dateOfBirth?.slice(0, 10)
            : "",
        );
        setAdvanceDirectivesResidentAddress(
          item?.advanceDirectivesResidentAddress,
        );
        setAdvanceDirectivesResidentDate(item?.advanceDirectivesResidentDate);
        setAdvanceDirectivesProvidedInfoInitials(
          item?.advanceDirectivesProvidedInfoInitials,
        );
        // Normalize legacy Boolean values (saved before the Boolean→String
        // schema swap) into the new "yes"/"no"/"" shape.
        setAdvanceDirectivesProvidedInfoAcknowledged(
          _adNorm(item?.advanceDirectivesProvidedInfoAcknowledged),
        );
        setAdvanceDirectivesRefusingAcknowledged(
          _adNorm(item?.advanceDirectivesRefusingAcknowledged),
        );
        setAdvanceDirectivesProvidedInfoDate(
          item?.advanceDirectivesProvidedInfoDate,
        );
        setAdvanceDirectivesProvidedInfoTime(item?.guardianRepresentativeTime);
        setAdvanceDirectivesProvidedInfoRefusingInitials(
          item?.advanceDirectivesProvidedInfoRefusingInitials,
        );
        setAdvanceDirectivesProvidedInfoRefusingDate(
          item?.advanceDirectivesProvidedInfoRefusingDate,
        );
        setAdvanceDirectivesProvidedInfoRefusingTime(
          item?.advanceDirectivesProvidedInfoRefusingTime,
        );
        setAdvanceDirectivesDeveloped(item?.advanceDirectivesDeveloped);
        setAdvanceDirectivesDevelopedComment(
          item?.advanceDirectivesDevelopedComment,
        );
        setAdvanceDirectivesExecutedInRecord(
          item?.advanceDirectivesExecutedInRecord,
        );
        setAdvanceDirectivesExecutedInRecordComment(
          item?.advanceDirectivesExecutedInRecordComment,
        );
        setAdvanceDirectivesFilingStatusWishNotFiled(
          item?.advanceDirectivesFilingStatusWishNotFiled,
        );
        setAdvanceDirectivesFilingStatusAskedForCopyNotProvided(
          item?.advanceDirectivesFilingStatusAskedForCopyNotProvided,
        );
        setAdvanceDirectivesFilingStatusOther(
          item?.advanceDirectivesFilingStatusOther,
        );
        setAdvanceDirectivesCoordinationOfCareCopySentToPCP(
          item?.advanceDirectivesCoordinationOfCareCopySentToPCP,
        );
        setAdvanceDirectivesCoordinationOfCareActedOn(
          item?.advanceDirectivesCoordinationOfCareActedOn,
        );
        setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotified(
          item?.advanceDirectivesCoordinationOfCareAppropriatePartiesNotified,
        );
        setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment(
          item?.advanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment,
        );
        setComplaintProcessAcknowledgementCompany(
          item?.complaintProcessAcknowledgementCompany,
        );
        setComplaintProcessAcknowledgementResidentName(
          item?.complaintProcessAcknowledgementResidentName,
        );
        setComplaintProcessAcknowledgementResidentSignature(
          item?.complaintProcessAcknowledgementResidentSignature,
        );
        setComplaintProcessAcknowledgementResidentDate(
          item?.complaintProcessAcknowledgementResidentDate,
        );
        setComplaintProcessAcknowledgementResidentTime(
          item?.complaintProcessAcknowledgementResidentTime,
        );
        setComplaintProcessAcknowledgementGuardianRepresentativeName(
          item?.complaintProcessAcknowledgementGuardianRepresentativeName,
        );
        setComplaintProcessAcknowledgementGuardianRepresentativeSignature(
          item?.complaintProcessAcknowledgementGuardianRepresentativeSignature,
        );
        setComplaintProcessAcknowledgementGuardianRepresentativeDate(
          item?.complaintProcessAcknowledgementGuardianRepresentativeDate,
        );
        setComplaintProcessAcknowledgementGuardianRepresentativeTime(
          item?.complaintProcessAcknowledgementGuardianRepresentativeTime,
        );
        setOrientationToAgencyCompany(item?.orientationToAgencyCompany);
        setORIENTATIONDropDown(item?.orientationToAgencyCompanyFollowing);
        setReceiptDropDown(item?.receiptOfInformationAtAdmission);
        setReceiptName(item?.receiptName);
        setHouseRulesDropDown(
          sanitizeHouseRulesArray(
            item?.houseRulesAcknowledgementAtAdmission ?? [],
          ),
        );
        setHouseRulesAcknowledgementName(
          item?.houseRulesAcknowledgementName ?? "",
        );
        setVerbalConsentResidentRepresentative(
          item?.verbalConsentResidentRepresentative ?? "",
        );
        setOrientationToAgencyResidentSignature(
          item?.orientationToAgencyResidentSignature,
        );
        setOrientationToAgencyResidentDate(
          item?.orientationToAgencyResidentDate,
        );
        setOrientationToAgencyResidentTime(
          item?.orientationToAgencyResidentTime,
        );
        setOrientationToAgencyGuardianRepresentativeName(
          item?.orientationToAgencyGuardianRepresentativeName,
        );
        setOrientationToAgencyGuardianRepresentativeSignature(
          item?.orientationToAgencyGuardianRepresentativeSignature,
        );
        setOrientationToAgencyGuardianRepresentativeDate(
          item?.orientationToAgencyGuardianRepresentativeDate,
        );
        setOrientationToAgencyGuardianRepresentativeTime(
          item?.orientationToAgencyGuardianRepresentativeTime,
        );
        setPromotionTalkStrategicApproach(item?.promotionTalkStrategicApproach);
        setLockBoxKeyIssueReturnDateKeyIssued(
          item?.lockBoxKeyIssueReturnDateKeyIssued,
        );
        setLockBoxKeyIssueReturnDateKeyReturned(
          item?.lockBoxKeyIssueReturnDateKeyReturned,
        );
        setLockBoxKeyIssueReturnAddress(item?.lockBoxKeyIssueReturnAddress);
        setLockBoxKeyIssueReturnResponsibleFor(
          item?.lockBoxKeyIssueReturnResponsibleFor,
        );
        setLockBoxKeyIssueReturnResponsibleForCorporation(
          item?.lockBoxKeyIssueReturnResponsibleForCorporation,
        );
        setLockBoxKeyIssueReturnCharged(item?.lockBoxKeyIssueReturnCharged);
        setLockBoxKeyIssueReturnResidentSignature(
          item?.lockBoxKeyIssueReturnResidentSignature,
        );
        setLockBoxKeyIssueReturnResidentDate(
          item?.lockBoxKeyIssueReturnResidentDate,
        );
        setLockBoxKeyIssueReturnResidentTime(
          item?.lockBoxKeyIssueReturnResidentTime,
        );
        setLockBoxKeyIssueReturnGuardianRepresentativeName(
          item?.lockBoxKeyIssueReturnGuardianRepresentativeName,
        );
        setLockBoxKeyIssueReturnGuardianRepresentativeSignature(
          item?.lockBoxKeyIssueReturnGuardianRepresentativeSignature,
        );
        setLockBoxKeyIssueReturnGuardianRepresentativeDate(
          item?.lockBoxKeyIssueReturnGuardianRepresentativeDate,
        );
        setLockBoxKeyIssueReturnGuardianRepresentativeTime(
          item?.lockBoxKeyIssueReturnGuardianRepresentativeTime,
        );
        setLockBoxKeyIssueReturnStaffName(item?.lockBoxKeyIssueReturnStaffName);
        setLockBoxKeyIssueReturnStaffSignature(
          item?.lockBoxKeyIssueReturnStaffSignature,
        );
        setLockBoxKeyIssueReturnStaffDate(item?.lockBoxKeyIssueReturnStaffDate);
        setLockBoxKeyIssueReturnStaffTime(item?.lockBoxKeyIssueReturnStaffTime);
        setPrimaryInsurance(item?.primaryInsurance);
        setInsuranceInformationPrimaryInsurancePolicyholderName(
          item?.insuranceInformationPrimaryInsurancePolicyholderName,
        );
        setInsuranceInformationPrimaryInsurancePolicyholderDateOfBirth(
          item?.insuranceInformationPrimaryInsurancePolicyholderDateOfBirth,
        );
        setInsuranceInformationPrimaryInsurancePolicyholderAddress(
          item?.insuranceInformationPrimaryInsurancePolicyholderAddress,
        );
        setInsuranceInformationPrimaryInsurancePolicyholderCity(
          item?.insuranceInformationPrimaryInsurancePolicyholderCity,
        );
        setInsuranceInformationPrimaryInsurancePolicyholderState(
          item?.insuranceInformationPrimaryInsurancePolicyholderState,
        );
        setInsuranceInformationPrimaryInsurancePolicyholderZip(
          item?.insuranceInformationPrimaryInsurancePolicyholderZip,
        );
        setInsuranceInformationPrimaryInsurancePolicyholderPhone(
          item?.insuranceInformationPrimaryInsurancePolicyholderPhone,
        );
        setInsuranceInformationPrimaryInsurancePolicyholderRelationship(
          item?.insuranceInformationPrimaryInsurancePolicyholderRelationship,
        );
        setInsuranceInformationPrimaryInsuranceCompany(
          item?.insuranceInformationPrimaryInsuranceCompany,
        );
        setInsuranceInformationPrimaryInsuranceCustomerServicePhone(
          item?.insuranceInformationPrimaryInsuranceCustomerServicePhone,
        );
        setInsuranceInformationPrimaryInsuranceSubscriberNumber(
          item?.insuranceInformationPrimaryInsuranceSubscriberNumber,
        );
        setInsuranceInformationPrimaryInsuranceSubscriberGroup(
          item?.insuranceInformationPrimaryInsuranceSubscriberGroup,
        );
        setInsuranceInformationPrimaryInsuranceSubscriberEffectiveDate(
          item?.insuranceInformationPrimaryInsuranceSubscriberEffectiveDate,
        );
        setInsuranceInformationSecondaryInsurancePolicyholderName(
          item?.insuranceInformationSecondaryInsurancePolicyholderName,
        );
        setInsuranceInformationSecondaryInsurancePolicyholderDateOfBirth(
          item?.insuranceInformationSecondaryInsurancePolicyholderDateOfBirth,
        );
        setInsuranceInformationSecondaryInsurancePolicyholderAddress(
          item?.insuranceInformationSecondaryInsurancePolicyholderAddress,
        );
        setInsuranceInformationSecondaryInsurancePolicyholderCity(
          item?.insuranceInformationSecondaryInsurancePolicyholderCity,
        );
        setInsuranceInformationSecondaryInsurancePolicyholderState(
          item?.insuranceInformationSecondaryInsurancePolicyholderState,
        );
        setInsuranceInformationSecondaryInsurancePolicyholderZip(
          item?.insuranceInformationSecondaryInsurancePolicyholderZip,
        );
        setInsuranceInformationSecondaryInsurancePolicyholderPhone(
          item?.insuranceInformationSecondaryInsurancePolicyholderPhone,
        );
        setInsuranceInformationSecondaryInsurancePolicyholderRelationship(
          item?.insuranceInformationSecondaryInsurancePolicyholderRelationship,
        );
        setInsuranceInformationSecondaryInsuranceCompany(
          item?.insuranceInformationSecondaryInsuranceCompany,
        );
        setInsuranceInformationSecondaryInsuranceCustomerServicePhone(
          item?.insuranceInformationSecondaryInsuranceCustomerServicePhone,
        );
        setInsuranceInformationSecondaryInsuranceSubscriberNumber(
          item?.insuranceInformationSecondaryInsuranceSubscriberNumber,
        );
        setInsuranceInformationSecondaryInsuranceSubscriberGroup(
          item?.insuranceInformationSecondaryInsuranceSubscriberGroup,
        );
        setInsuranceInformationSecondaryInsuranceSubscriberEffectiveDate(
          item?.insuranceInformationSecondaryInsuranceSubscriberEffectiveDate,
        );
        setObligationsAndAuthorizationResidentName(
          item?.obligationsAndAuthorizationResidentName,
        );
        setObligationsAndAuthorizationResidentSignature(
          item?.obligationsAndAuthorizationResidentSignature,
        );
        setObligationsAndAuthorizationResidentDate(
          item?.obligationsAndAuthorizationResidentDate,
        );
        setObligationsAndAuthorizationResidentTime(
          item?.obligationsAndAuthorizationResidentTime,
        );
        setObligationsAndAuthorizationGuardianRepresentativeName(
          item?.obligationsAndAuthorizationGuardianRepresentativeName,
        );
        setObligationsAndAuthorizationGuardianRepresentativeSignature(
          item?.obligationsAndAuthorizationGuardianRepresentativeSignature,
        );
        setObligationsAndAuthorizationGuardianRepresentativeDate(
          item?.obligationsAndAuthorizationGuardianRepresentativeDate,
        );
        setObligationsAndAuthorizationGuardianRepresentativeTime(
          item?.obligationsAndAuthorizationGuardianRepresentativeTime,
        );
        setPrimaryInsurance(item?.primaryInsurance);
        if (url === "/resident-intake") {
          setSigners([]);
        } else {
          if (Array.isArray(item?.signers)) setSigners(item?.signers);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApiData, id, url]);
  useEffect(() => {
    if (patientId && url === "/resident-intake") {
      intakeService.getResidentIntake({
        patientId,
        setResponse: setGetApiData,
        setLoading,
      });
    }
  }, [patientId, url]);
  useEffect(() => {
    if (id) {
      intakeService.getResidentIntake({ id, setResponse: setGetApiData });
    }
  }, [id]);
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
  const handleDeleteArrayInternalDisclosure = (index) => {
    setInternalDisclosureList((prev) => [
      ...prev.filter((_, i) => i !== index),
    ]);
  };
  useEffect(() => {
    if (!getApiData?.data) return;
    if (getApiData?.data) {
      const { userType, accountType, userPermissions } = Profile;
      if (
        (userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.REGULAR &&
          !(
            typeof userPermissions?.edit === "string"
              ? userPermissions.edit.split(":")
              : []
          ).includes("ri")) ||
        (userType === ROLES.EMPLOYEE &&
          accountType === ACCOUNT_TYPES.RESTRICTED)
      ) {
        setIsNotEditableWithSigner(true);
      } else {
        setIsNotEditableWithSigner(false);
      }
    }
  }, [
    getApiData?.data,
    Profile,
    Profile?._id,
    Profile?.accountType,
    Profile?.userPermissions?.edit,
    Profile?.userType,
  ]);
  const data = {
    patientId: patientId,
    iAgree,
    residentName,
    guardianRepresentativeName,
    guardianRepresentativeSignature,
    guardianRepresentativeDate,
    guardianRepresentativeTime,
    staffName,
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
    orientationToAgencyCompanyFollowing: ORIENTATIONDropDown,
    receiptOfInformationAtAdmission: receiptDropDown,
    receiptName,
    houseRulesAcknowledgementAtAdmission: houseRulesDropDown,
    houseRulesAcknowledgementName,
    verbalConsentResidentRepresentative,
    orientationToAgencyCompany,
    orientationToAgencyResidentSignature,
    orientationToAgencyResidentDate,
    orientationToAgencyResidentTime,
    orientationToAgencyGuardianRepresentativeName,
    promotionTalkStrategicApproach,
    lockBoxKeyIssueReturnDateKeyIssued,
    lockBoxKeyIssueReturnDateKeyReturned,
    lockBoxKeyIssueReturnAddress,
    lockBoxKeyIssueReturnResponsibleFor,
    lockBoxKeyIssueReturnResponsibleForCorporation,
    lockBoxKeyIssueReturnCharged,
    lockBoxKeyIssueReturnResidentName,
    lockBoxKeyIssueReturnResidentSignature,
    lockBoxKeyIssueReturnResidentDate,
    lockBoxKeyIssueReturnResidentTime,
    lockBoxKeyIssueReturnGuardianRepresentativeName,
    lockBoxKeyIssueReturnGuardianRepresentativeSignature,
    lockBoxKeyIssueReturnGuardianRepresentativeDate,
    lockBoxKeyIssueReturnGuardianRepresentativeTime,
    lockBoxKeyIssueReturnStaffName,
    primaryInsurance,
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
    obligationsAndAuthorizationResidentSignature,
    obligationsAndAuthorizationResidentDate,
    obligationsAndAuthorizationResidentTime,
    obligationsAndAuthorizationGuardianRepresentativeName,
    signatures,
    roleSignatures,
    signers: signers?.map((signer) => ({
      signerId: signer.value,
      signature: "",
      dateSigned: "",
    })),
  };
  const hasAnyPenSig = Object.values(roleSignatures || {}).some(
    (s) => !!s?.rawSignatureImage,
  );
  const allPenSigsHaveNames = Object.values(roleSignatures || {}).every(
    (s) => !s?.rawSignatureImage || !!s?.name?.trim(),
  );
  // Witness coupled-pair: block submit if signature exists without name OR
  // name exists without signature. Per client request 2026-04-26.
  const witnessNamePresent = !!(
    roleSignatures?.witness?.name &&
    roleSignatures.witness.name.trim() &&
    roleSignatures.witness.name.trim() !== "undefined undefined"
  );
  const witnessSigPresent = !!roleSignatures?.witness?.rawSignatureImage;
  const witnessIncomplete = witnessSigPresent && !witnessNamePresent;
  useEffect(() => {
    const perPageSignerPresent = isSignerPresentOnAllPages(
      signatures,
      Profile?._id,
    );
    setIsDisabled(!(perPageSignerPresent || hasAnyPenSig));
  }, [Profile?._id, signatures, hasAnyPenSig]);
  const optionValue = [
    {
      label:
        "An explanation of the behavioral health services the agency provides",
      value:
        "An explanation of the behavioral health services the agency provides",
    },
    {
      label:
        "A description of the expectations for resident behavior and rules",
      value:
        "A description of the expectations for resident behavior and rules",
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
      const optionExists = optionValue.some(
        (option) => option.value === inputValue,
      );
      if (!optionExists) {
        const newOptions = [
          ...optionValue,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setORIENTATIONDropDown(newOptions);
        const newSelectedValues = [
          ...ORIENTATIONDropDown,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setORIENTATIONDropDown(newSelectedValues);
      }
      event.target.value = "";
    }
  };
  const optionHandler = (optionValue) => {
    setORIENTATIONDropDown(optionValue);
  };
  const receiptOptionValue = [
    {
      label: "A copy and list of resident rights",
      value: "A copy and list of resident rights",
    },
    {
      label: "An explanation of fees and refunds",
      value: "An explanation of fees and refunds",
    },
    {
      label: "A copy of facility refund policy and procedure",
      value: "A copy of facility refund policy and procedure",
    },
    {
      label: "The current telephone number and address of",
      value: "The current telephone number and address of",
    },
    {
      label:
        "The AZDHS Office of Bureau of Behavioral Health Facilities Licensing 602-542-3422",
      value:
        "The AZDHS Office of Bureau of Behavioral Health Facilities Licensing 602-542-3422",
    },
    {
      label:
        "The AZDES Office of Adult Protective Services 1-877-SOS-ADULT (1-877-767-2385)",
      value:
        "The AZDES Office of Adult Protective Services 1-877-SOS-ADULT (1-877-767-2385)",
    },
    {
      label: "A copy of grievance policy and procedure",
      value: "A copy of grievance policy and procedure",
    },
    {
      label: "A copy of Advance Directives policy and procedure",
      value: "A copy of Advance Directives policy and procedure",
    },
    {
      label: "A copy of your house rules",
      value: "A copy of your house rules",
    },
  ];
  const handleKeyDownReceiptDropDown = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const inputValue = event.target.value.trim();
      const optionExists = receiptOptionValue.some(
        (option) => option.value === inputValue,
      );
      if (!optionExists) {
        const newOptions = [
          ...receiptOptionValue,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setReceiptDropDown(newOptions);
        const newSelectedValues = [
          ...ORIENTATIONDropDown,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setReceiptDropDown(newSelectedValues);
      }
      event.target.value = "";
    }
  };
  const receiptOptionHandler = (optionValue) => {
    setReceiptDropDown(optionValue);
  };
  const handleKeyDownHouseRulesDropDown = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const inputValue = event.target.value.trim();
      const optionExists = houseRulesOptionValue.some(
        (option) => option.value === inputValue,
      );
      if (!optionExists) {
        const newSelectedValues = [
          ...(houseRulesDropDown || []),
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setHouseRulesDropDown(newSelectedValues);
      }
      event.target.value = "";
    }
  };
  const houseRulesOptionHandler = (optionValue) => {
    setHouseRulesDropDown(optionValue);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (url === "/resident-intake") {
      intakeService.residentIntake.create({
        patientId,
        payload: data,
        successMsg: "Resident Intake updated !",
        setLoading,
        navigate,
      });
    } else {
      intakeService.residentIntake.update(id, data, { setLoading, navigate });
    }
  };
  const editSignHandler = (sign, page) => {
    setSignatures((prevSignature) =>
      prevSignature.map((entry) =>
        entry.page === page
          ? {
              ...entry,
              sign: entry.sign.some((s) => s.signerId === Profile?._id)
                ? entry.sign.map((s) =>
                    s.signerId === Profile?._id
                      ? {
                          ...s,
                          signature: sign,
                        }
                      : s,
                  )
                : [
                    ...entry.sign,
                    {
                      signerId: Profile._id,
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
      prevSignature.map((entry) =>
        entry.page === page
          ? {
              ...entry,
              sign: entry.sign.some((s) => s.signerId === Profile?._id)
                ? entry.sign.map((s) =>
                    s.signerId === Profile?._id
                      ? {
                          ...s,
                          dateSigned: date,
                        }
                      : s,
                  )
                : [
                    ...entry.sign,
                    {
                      signerId: Profile._id,
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

  // 2026-04-26: per client request the SAVED AND SIGNED button was moved to
  // page 11 only. When the user clicks it once, fan out the resulting signer
  // entry to ALL pages so the legacy "Digitally Signed by..." line renders on
  // every page (preserves existing PDF/print layout) AND the existing submit
  // gate (isSignerPresentOnAllPages) auto-passes.
  const editSignHandlerAllPages = (sign) => {
    setSignatures((prevSignature) =>
      prevSignature.map((entry) => ({
        ...entry,
        sign: entry.sign.some((s) => s.signerId === Profile?._id)
          ? entry.sign.map((s) =>
              s.signerId === Profile?._id
                ? {
                    ...s,
                    signature: sign,
                  }
                : s,
            )
          : [
              ...entry.sign,
              {
                signerId: Profile._id,
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
      prevSignature.map((entry) => ({
        ...entry,
        sign: entry.sign.some((s) => s.signerId === Profile?._id)
          ? entry.sign.map((s) =>
              s.signerId === Profile?._id
                ? {
                    ...s,
                    dateSigned: date,
                  }
                : s,
            )
          : [
              ...entry.sign,
              {
                signerId: Profile._id,
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
      show: signInModel6,
      onHide: setSigInModel6,
      page: 2,
    },
    {
      show: signInModel3,
      onHide: setSigInModel3,
      page: 3,
    },
    {
      show: signInModel10,
      onHide: setSigInModel10,
      page: 4,
    },
    {
      show: signInModel20,
      onHide: setSigInModel20,
      page: 5,
    },
    {
      show: signInModel12,
      onHide: setSigInModel12,
      page: 6,
    },
    {
      show: signInModel14,
      onHide: setSigInModel14,
      page: 7,
    },
    {
      show: sigInModel8New,
      onHide: setSigInModel8New,
      page: 8,
    },
    {
      show: signInModel17,
      onHide: setSigInModel17,
      page: 10,
    },
    {
      show: signInModel19,
      onHide: setSigInModel19,
      page: 11,
    },
  ];
  const canDelete = deletePermission(Profile, "ri");

  const formSetters = {
    setAdvanceDirectivesCoordinationOfCareActedOn,
    setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotified,
    setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment,
    setAdvanceDirectivesCoordinationOfCareCopySentToPCP,
    setAdvanceDirectivesDeveloped,
    setAdvanceDirectivesDevelopedComment,
    setAdvanceDirectivesExecutedInRecord,
    setAdvanceDirectivesExecutedInRecordComment,
    setAdvanceDirectivesFilingStatusAskedForCopyNotProvided,
    setAdvanceDirectivesFilingStatusOther,
    setAdvanceDirectivesFilingStatusWishNotFiled,
    setAdvanceDirectivesProvidedInfoAcknowledged,
    setAdvanceDirectivesProvidedInfoDate,
    setAdvanceDirectivesProvidedInfoInitials,
    setAdvanceDirectivesProvidedInfoRefusingDate,
    setAdvanceDirectivesProvidedInfoRefusingInitials,
    setAdvanceDirectivesProvidedInfoRefusingTime,
    setAdvanceDirectivesProvidedInfoTime,
    setAdvanceDirectivesRefusingAcknowledged,
    setAdvanceDirectivesResidentAddress,
    setAdvanceDirectivesResidentDate,
    setAdvanceDirectivesResidentDateOfBirth,
    setAdvanceDirectivesResidentGender,
    setAdvanceDirectivesResidentName,
    setCompanyName,
    setComplaintProcessAcknowledgementCompany,
    setComplaintProcessAcknowledgementGuardianRepresentativeDate,
    setComplaintProcessAcknowledgementGuardianRepresentativeName,
    setComplaintProcessAcknowledgementGuardianRepresentativeSignature,
    setComplaintProcessAcknowledgementGuardianRepresentativeTime,
    setComplaintProcessAcknowledgementResidentDate,
    setComplaintProcessAcknowledgementResidentName,
    setComplaintProcessAcknowledgementResidentSignature,
    setComplaintProcessAcknowledgementResidentTime,
    setGetApiData,
    setGuardianRepresentativeDate,
    setGuardianRepresentativeName,
    setGuardianRepresentativeSignature,
    setGuardianRepresentativeTime,
    setHouseRulesAcknowledgementName,
    setHouseRulesDropDown,
    setInsuranceInformationPrimaryInsuranceCompany,
    setInsuranceInformationPrimaryInsuranceCustomerServicePhone,
    setInsuranceInformationPrimaryInsurancePolicyholderAddress,
    setInsuranceInformationPrimaryInsurancePolicyholderCity,
    setInsuranceInformationPrimaryInsurancePolicyholderDateOfBirth,
    setInsuranceInformationPrimaryInsurancePolicyholderName,
    setInsuranceInformationPrimaryInsurancePolicyholderPhone,
    setInsuranceInformationPrimaryInsurancePolicyholderRelationship,
    setInsuranceInformationPrimaryInsurancePolicyholderState,
    setInsuranceInformationPrimaryInsurancePolicyholderZip,
    setInsuranceInformationPrimaryInsuranceSubscriberEffectiveDate,
    setInsuranceInformationPrimaryInsuranceSubscriberGroup,
    setInsuranceInformationPrimaryInsuranceSubscriberNumber,
    setInsuranceInformationSecondaryInsuranceCompany,
    setInsuranceInformationSecondaryInsuranceCustomerServicePhone,
    setInsuranceInformationSecondaryInsurancePolicyholderAddress,
    setInsuranceInformationSecondaryInsurancePolicyholderCity,
    setInsuranceInformationSecondaryInsurancePolicyholderDateOfBirth,
    setInsuranceInformationSecondaryInsurancePolicyholderName,
    setInsuranceInformationSecondaryInsurancePolicyholderPhone,
    setInsuranceInformationSecondaryInsurancePolicyholderRelationship,
    setInsuranceInformationSecondaryInsurancePolicyholderState,
    setInsuranceInformationSecondaryInsurancePolicyholderZip,
    setInsuranceInformationSecondaryInsuranceSubscriberEffectiveDate,
    setInsuranceInformationSecondaryInsuranceSubscriberGroup,
    setInsuranceInformationSecondaryInsuranceSubscriberNumber,
    setInternalContect,
    setInternalDisclosureList,
    setInternalDisclosureListExpire,
    setInternalDisclosureListGuardianRepresentativeDate,
    setInternalDisclosureListGuardianRepresentativeName,
    setInternalDisclosureListGuardianRepresentativeSignature,
    setInternalDisclosureListGuardianRepresentativeTime,
    setInternalDisclosureListResidentDate,
    setInternalDisclosureListResidentName,
    setInternalDisclosureListResidentSignature,
    setInternalDisclosureListResidentTime,
    setInternalDisclosureListStaffDate,
    setInternalDisclosureListStaffName,
    setInternalDisclosureListStaffSignature,
    setInternalDisclosureListStaffTime,
    setInternalName,
    setInternalRelationship,
    setIsDisabled,
    setIsNotEditableWithSigner,
    setLoading,
    setLockBoxKeyIssueReturnAddress,
    setLockBoxKeyIssueReturnCharged,
    setLockBoxKeyIssueReturnDateKeyIssued,
    setLockBoxKeyIssueReturnDateKeyReturned,
    setLockBoxKeyIssueReturnGuardianRepresentativeDate,
    setLockBoxKeyIssueReturnGuardianRepresentativeName,
    setLockBoxKeyIssueReturnGuardianRepresentativeSignature,
    setLockBoxKeyIssueReturnGuardianRepresentativeTime,
    setLockBoxKeyIssueReturnResidentDate,
    setLockBoxKeyIssueReturnResidentName,
    setLockBoxKeyIssueReturnResidentSignature,
    setLockBoxKeyIssueReturnResidentTime,
    setLockBoxKeyIssueReturnResponsibleFor,
    setLockBoxKeyIssueReturnResponsibleForCorporation,
    setLockBoxKeyIssueReturnStaffDate,
    setLockBoxKeyIssueReturnStaffName,
    setLockBoxKeyIssueReturnStaffSignature,
    setLockBoxKeyIssueReturnStaffTime,
    setORIENTATIONDropDown,
    setObligationsAndAuthorizationGuardianRepresentativeDate,
    setObligationsAndAuthorizationGuardianRepresentativeName,
    setObligationsAndAuthorizationGuardianRepresentativeSignature,
    setObligationsAndAuthorizationGuardianRepresentativeTime,
    setObligationsAndAuthorizationResidentDate,
    setObligationsAndAuthorizationResidentName,
    setObligationsAndAuthorizationResidentSignature,
    setObligationsAndAuthorizationResidentTime,
    setOrientationToAgencyCompany,
    setOrientationToAgencyGuardianRepresentativeDate,
    setOrientationToAgencyGuardianRepresentativeName,
    setOrientationToAgencyGuardianRepresentativeSignature,
    setOrientationToAgencyGuardianRepresentativeTime,
    setOrientationToAgencyResidentDate,
    setOrientationToAgencyResidentSignature,
    setOrientationToAgencyResidentTime,
    setPage,
    setPatientDetail,
    setPatientId,
    setPhotoVideoConsentAdmissionDate,
    setPhotoVideoConsentConsentGiven,
    setPhotoVideoConsentConsentWithdrawn,
    setPhotoVideoConsentDateOfBirth,
    setPhotoVideoConsentGuardianRepresentativeDate,
    setPhotoVideoConsentGuardianRepresentativeName,
    setPhotoVideoConsentGuardianRepresentativeSignature,
    setPhotoVideoConsentGuardianRepresentativeTime,
    setPhotoVideoConsentResidentDate,
    setPhotoVideoConsentResidentName,
    setPhotoVideoConsentResidentSignature,
    setPhotoVideoConsentResidentTime,
    setPrimaryInsurance,
    setPromotionTalkStrategicApproach,
    setReceiptDropDown,
    setReceiptName,
    setResidentName,
    setResidentRightsGuardianRepresentativeDate,
    setResidentRightsGuardianRepresentativeName,
    setResidentRightsGuardianRepresentativeSignature,
    setResidentRightsGuardianRepresentativeTime,
    setResidentRightsResidentDate,
    setResidentRightsResidentName,
    setResidentRightsResidentSignature,
    setResidentRightsResidentSignatureValue,
    setResidentRightsResidentSignatureValueDate,
    setResidentRightsResidentSignatureValueTime,
    setResidentRightsResidentTime,
    setSigInModel1,
    setSigInModel10,
    setSigInModel12,
    setSigInModel14,
    setSigInModel17,
    setSigInModel19,
    setSigInModel2,
    setSigInModel20,
    setSigInModel3,
    setSigInModel6,
    setSignatureModals,
    setSignatures,
    setSigners,
    setStaffName,
    setVerbalConsentResidentRepresentative,
    setiAgree,
  };

  return {
    ...data,
    Cpage,
    ORIENTATIONDropDown,
    Profile,
    _adNorm,
    advanceDirectivesDeveloped,
    advanceDirectivesResidentDate,
    advanceDirectivesResidentGender,
    advanceDirectivesResidentName,
    canDelete,
    clearAllTyped,
    companyName,
    editDateHandler,
    editDateHandlerAllPages,
    editSignHandler,
    editSignHandlerAllPages,
    getApiData,
    guardianRepresentativeDate,
    guardianRepresentativeName,
    guardianRepresentativeSignature,
    guardianRepresentativeTime,
    handleDeleteArrayInternalDisclosure,
    handleKeyDownHouseRulesDropDown,
    handleKeyDownORIENTATIONDropDown,
    handleKeyDownReceiptDropDown,
    handleNextPage,
    handlePrevPage,
    handleinternalData,
    hasTypedInForm,
    hoursFormat,
    houseRulesAcknowledgementName,
    houseRulesDropDown,
    houseRulesOptionHandler,
    iAgree,
    id,
    internalContect,
    internalDisclosureList,
    internalDisclosureListExpire,
    internalDisclosureListStaffDate,
    internalDisclosureListStaffName,
    internalDisclosureListStaffTime,
    internalName,
    internalRelationship,
    isDisabled,
    isNotEditableWithSigner,
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
    patientId,
    photoVideoConsentAdmissionDate,
    photoVideoConsentConsentGiven,
    photoVideoConsentDateOfBirth,
    photoVideoConsentResidentDate,
    photoVideoConsentResidentName,
    photoVideoConsentResidentTime,
    primaryInsurance,
    promotionTalkStrategicApproach,
    receiptDropDown,
    receiptName,
    receiptOptionHandler,
    receiptOptionValue,
    residentName,
    residentRightsResidentDate,
    residentRightsResidentName,
    residentRightsResidentSignature,
    residentRightsResidentTime,
    roleSignatures,
    setIsDisabled,
    setLoading,
    setPage,
    setPatientDetail,
    setPatientId,
    setResidentName,
    setSigInModel1,
    setSigInModel10,
    setSigInModel12,
    setSigInModel14,
    setSigInModel17,
    setSigInModel19,
    setSigInModel2,
    setSigInModel20,
    setSigInModel3,
    setSigInModel8New,
    setSignatures,
    setSigners,
    sigInModel8New,
    signInModel20,
    signatureModals,
    signaturePairs,
    signatures,
    signers,
    staffName,
    submitHandler,
    typedGuardDialog,
    updateRoleSignature,
    url,
    ...printApi,
    formSetters,
    ...formSetters,
    guardTyped,
  };
};
