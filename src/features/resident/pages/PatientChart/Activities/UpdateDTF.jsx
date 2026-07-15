/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container, Table, Row, Col, Button, Form } from "react-bootstrap";
import { patientChartService } from "@/features/shared/services";
import { CheckBoxMaker } from "@/utils/Makers";
import { ClipLoader } from "react-spinners";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { useNavigate, useParams } from "react-router-dom";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { fetchPaitentName } from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import DatePicker from "react-datepicker";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
export const TableRow = ({ heading, row, input, setInput }) => {
  return (
    <tr>
      <td> {heading} </td>
      {row?.map((i, index) => (
        <td key={index}>
          <CheckBoxMaker
            setValue={i?.setValue}
            value={!i?.value}
            id={`${heading}${i?.value}`}
            label=""
            checked={i?.value}
          />{" "}
        </td>
      ))}
      <td>
        <Form.Control
          size="sm"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
        ></Form.Control>
      </td>
    </tr>
  );
};
const UpdateDTF = () => {
  const navigate = useNavigate();
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [
    requiresNoAssistanceSelectingClothes,
    setRequiresNoAssistanceSelectingClothes,
  ] = useState(false);
  const [
    someAssistanceNeededSelectingClothes,
    setSomeAssistanceNeededSelectingClothes,
  ] = useState(false);
  const [
    completeAssistanceNeededSelectingClothes,
    setCompleteAssistanceNeededSelectingClothes,
  ] = useState(false);
  const [notApplicableSelectingClothes, setNotApplicableSelectingClothes] =
    useState(false);
  const [refusedSelectingClothes, setRefusedSelectingClothes] = useState(false);
  const [staffInitialsSelectingClothes, setStaffInitialsSelectingClothes] =
    useState("");
  const [
    requiresNoAssistanceBathingOrShowering,
    setRequiresNoAssistanceBathingOrShowering,
  ] = useState(false);
  const [
    someAssistanceNeededBathingOrShowering,
    setSomeAssistanceNeededBathingOrShowering,
  ] = useState(false);
  const [
    completeAssistanceNeededBathingOrShowering,
    setCompleteAssistanceNeededBathingOrShowering,
  ] = useState(false);
  const [notApplicableBathingOrShowering, setNotApplicableBathingOrShowering] =
    useState(false);
  const [refusedBathingOrShowering, setRefusedBathingOrShowering] =
    useState(false);
  const [staffInitialsBathingOrShowering, setStaffInitialsBathingOrShowering] =
    useState("");
  const [requiresNoAssistanceCombingHair, setRequiresNoAssistanceCombingHair] =
    useState(false);
  const [someAssistanceNeededCombingHair, setSomeAssistanceNeededCombingHair] =
    useState(false);
  const [
    completeAssistanceNeededCombingHair,
    setCompleteAssistanceNeededCombingHair,
  ] = useState(false);
  const [notApplicableCombingHair, setNotApplicableCombingHair] =
    useState(false);
  const [refusedCombingHair, setRefusedCombingHair] = useState(false);
  const [staffInitialsCombingHair, setStaffInitialsCombingHair] = useState("");
  const [
    requiresNoAssistanceApplyingLotion,
    setRequiresNoAssistanceApplyingLotion,
  ] = useState(false);
  const [
    someAssistanceNeededApplyingLotion,
    setSomeAssistanceNeededApplyingLotion,
  ] = useState(false);
  const [
    completeAssistanceNeededApplyingLotion,
    setCompleteAssistanceNeededApplyingLotion,
  ] = useState(false);
  const [notApplicableApplyingLotion, setNotApplicableApplyingLotion] =
    useState(false);
  const [refusedApplyingLotion, setRefusedApplyingLotion] = useState(false);
  const [staffInitialsApplyingLotion, setStaffInitialsApplyingLotion] =
    useState("");
  const [requiresNoAssistanceLaundry, setRequiresNoAssistanceLaundry] =
    useState(false);
  const [someAssistanceNeededLaundry, setSomeAssistanceNeededLaundry] =
    useState(false);
  const [completeAssistanceNeededLaundry, setCompleteAssistanceNeededLaundry] =
    useState(false);
  const [notApplicableLaundry, setNotApplicableLaundry] = useState(false);
  const [refusedLaundry, setRefusedLaundry] = useState(false);
  const [staffInitialsLaundry, setStaffInitialsLaundry] = useState("");
  const [requiresNoAssistanceDressing, setRequiresNoAssistanceDressing] =
    useState(false);
  const [someAssistanceNeededDressing, setSomeAssistanceNeededDressing] =
    useState(false);
  const [
    completeAssistanceNeededDressing,
    setCompleteAssistanceNeededDressing,
  ] = useState(false);
  const [notApplicableDressing, setNotApplicableDressing] = useState(false);
  const [refusedDressing, setRefusedDressing] = useState(false);
  const [staffInitialsDressing, setStaffInitialsDressing] = useState("");
  const [
    requiresNoAssistanceShampooingHair,
    setRequiresNoAssistanceShampooingHair,
  ] = useState(false);
  const [
    someAssistanceNeededShampooingHair,
    setSomeAssistanceNeededShampooingHair,
  ] = useState(false);
  const [
    completeAssistanceNeededShampooingHair,
    setCompleteAssistanceNeededShampooingHair,
  ] = useState(false);
  const [notApplicableShampooingHair, setNotApplicableShampooingHair] =
    useState(false);
  const [refusedShampooingHair, setRefusedShampooingHair] = useState(false);
  const [staffInitialsShampooingHair, setStaffInitialsShampooingHair] =
    useState("");
  const [
    requiresNoAssistanceOralCareMorning,
    setRequiresNoAssistanceOralCareMorning,
  ] = useState(false);
  const [
    someAssistanceNeededOralCareMorning,
    setSomeAssistanceNeededOralCareMorning,
  ] = useState(false);
  const [
    completeAssistanceNeededOralCareMorning,
    setCompleteAssistanceNeededOralCareMorning,
  ] = useState(false);
  const [notApplicableOralCareMorning, setNotApplicableOralCareMorning] =
    useState(false);
  const [refusedOralCareMorning, setRefusedOralCareMorning] = useState(false);
  const [staffInitialsOralCareMorning, setStaffInitialsOralCareMorning] =
    useState("");
  const [
    requiresNoAssistanceOralCareEvening,
    setRequiresNoAssistanceOralCareEvening,
  ] = useState(false);
  const [
    someAssistanceNeededOralCareEvening,
    setSomeAssistanceNeededOralCareEvening,
  ] = useState(false);
  const [
    completeAssistanceNeededOralCareEvening,
    setCompleteAssistanceNeededOralCareEvening,
  ] = useState(false);
  const [notApplicableOralCareEvening, setNotApplicableOralCareEvening] =
    useState(false);
  const [refusedOralCareEvening, setRefusedOralCareEvening] = useState(false);
  const [staffInitialsOralCareEvening, setStaffInitialsOralCareEvening] =
    useState("");
  const [requiresNoAssistanceBreakfast, setRequiresNoAssistanceBreakfast] =
    useState(false);
  const [someAssistanceNeededBreakfast, setSomeAssistanceNeededBreakfast] =
    useState(false);
  const [
    completeAssistanceNeededBreakfast,
    setCompleteAssistanceNeededBreakfast,
  ] = useState(false);
  const [notApplicableBreakfast, setNotApplicableBreakfast] = useState(false);
  const [refusedBreakfast, setRefusedBreakfast] = useState(false);
  const [staffInitialsBreakfast, setStaffInitialsBreakfast] = useState("");
  const [requiresNoAssistanceLunch, setRequiresNoAssistanceLunch] =
    useState(false);
  const [someAssistanceNeededLunch, setSomeAssistanceNeededLunch] =
    useState(false);
  const [completeAssistanceNeededLunch, setCompleteAssistanceNeededLunch] =
    useState(false);
  const [notApplicableLunch, setNotApplicableLunch] = useState(false);
  const [refusedLunch, setRefusedLunch] = useState(false);
  const [staffInitialsLunch, setStaffInitialsLunch] = useState("");
  const [requiresNoAssistanceDinner, setRequiresNoAssistanceDinner] =
    useState(false);
  const [someAssistanceNeededDinner, setSomeAssistanceNeededDinner] =
    useState(false);
  const [completeAssistanceNeededDinner, setCompleteAssistanceNeededDinner] =
    useState(false);
  const [notApplicableDinner, setNotApplicableDinner] = useState(false);
  const [refusedDinner, setRefusedDinner] = useState(false);
  const [staffInitialsDinner, setStaffInitialsDinner] = useState("");
  const [requiresNoAssistanceAMSnack, setRequiresNoAssistanceAMSnack] =
    useState(false);
  const [someAssistanceNeededAMSnack, setSomeAssistanceNeededAMSnack] =
    useState(false);
  const [completeAssistanceNeededAMSnack, setCompleteAssistanceNeededAMSnack] =
    useState(false);
  const [notApplicableAMSnack, setNotApplicableAMSnack] = useState(false);
  const [refusedAMSnack, setRefusedAMSnack] = useState(false);
  const [staffInitialsAMSnack, setStaffInitialsAMSnack] = useState("");
  const [requiresNoAssistancePMSnack, setRequiresNoAssistancePMSnack] =
    useState(false);
  const [someAssistanceNeededPMSnack, setSomeAssistanceNeededPMSnack] =
    useState(false);
  const [completeAssistanceNeededPMSnack, setCompleteAssistanceNeededPMSnack] =
    useState(false);
  const [notApplicablePMSnack, setNotApplicablePMSnack] = useState(false);
  const [refusedPMSnack, setRefusedPMSnack] = useState(false);
  const [staffInitialsPMSnack, setStaffInitialsPMSnack] = useState("");
  const [
    requiresNoAssistanceAMBowelMovement,
    setRequiresNoAssistanceAMBowelMovement,
  ] = useState(false);
  const [
    someAssistanceNeededAMBowelMovement,
    setSomeAssistanceNeededAMBowelMovement,
  ] = useState(false);
  const [
    completeAssistanceNeededAMBowelMovement,
    setCompleteAssistanceNeededAMBowelMovement,
  ] = useState(false);
  const [notApplicableAMBowelMovement, setNotApplicableAMBowelMovement] =
    useState(false);
  const [refusedAMBowelMovement, setRefusedAMBowelMovement] = useState(false);
  const [staffInitialsAMBowelMovement, setStaffInitialsAMBowelMovement] =
    useState("");
  const [
    requiresNoAssistancePMBowelMovement,
    setRequiresNoAssistancePMBowelMovement,
  ] = useState(false);
  const [
    someAssistanceNeededPMBowelMovement,
    setSomeAssistanceNeededPMBowelMovement,
  ] = useState(false);
  const [
    completeAssistanceNeededPMBowelMovement,
    setCompleteAssistanceNeededPMBowelMovement,
  ] = useState(false);
  const [notApplicablePMBowelMovement, setNotApplicablePMBowelMovement] =
    useState(false);
  const [refusedPMBowelMovement, setRefusedPMBowelMovement] = useState(false);
  const [staffInitialsPMBowelMovement, setStaffInitialsPMBowelMovement] =
    useState("");
  const [
    requiresNoAssistanceOvernightBowelMovement,
    setRequiresNoAssistanceOvernightBowelMovement,
  ] = useState(false);
  const [
    someAssistanceNeededOvernightBowelMovement,
    setSomeAssistanceNeededOvernightBowelMovement,
  ] = useState(false);
  const [
    completeAssistanceNeededOvernightBowelMovement,
    setCompleteAssistanceNeededOvernightBowelMovement,
  ] = useState(false);
  const [
    notApplicableOvernightBowelMovement,
    setNotApplicableOvernightBowelMovement,
  ] = useState(false);
  const [refusedOvernightBowelMovement, setRefusedOvernightBowelMovement] =
    useState(false);
  const [
    staffInitialsOvernightBowelMovement,
    setStaffInitialsOvernightBowelMovement,
  ] = useState("");
  const [
    requiresNoAssistanceHandAndFootNailCare,
    setRequiresNoAssistanceHandAndFootNailCare,
  ] = useState(false);
  const [
    someAssistanceNeededHandAndFootNailCare,
    setSomeAssistanceNeededHandAndFootNailCare,
  ] = useState(false);
  const [
    completeAssistanceNeededHandAndFootNailCare,
    setCompleteAssistanceNeededHandAndFootNailCare,
  ] = useState(false);
  const [
    notApplicableHandAndFootNailCare,
    setNotApplicableHandAndFootNailCare,
  ] = useState(false);
  const [refusedHandAndFootNailCare, setRefusedHandAndFootNailCare] =
    useState(false);
  const [
    staffInitialsHandAndFootNailCare,
    setStaffInitialsHandAndFootNailCare,
  ] = useState("");
  const [requiresNoAssistanceBedMobility, setRequiresNoAssistanceBedMobility] =
    useState(false);
  const [someAssistanceNeededBedMobility, setSomeAssistanceNeededBedMobility] =
    useState(false);
  const [
    completeAssistanceNeededBedMobility,
    setCompleteAssistanceNeededBedMobility,
  ] = useState(false);
  const [notApplicableBedMobility, setNotApplicableBedMobility] =
    useState(false);
  const [refusedBedMobility, setRefusedBedMobility] = useState(false);
  const [staffInitialsBedMobility, setStaffInitialsBedMobility] = useState("");
  const [open, setOpen] = useState(false);
  const [savedSigned, setSavedSigned] = useState("");
  const [savedTime, setSavedTime] = useState("");
  const [detail, setDetail] = useState({});
  const [dateSigned, setDateSigned] = useState("");
  const [signers, setSigners] = useState([]);
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [saveAsDrafIsNotEditable, setSaveAsDrafIsNotEditable] = useState(false);
  const [
    saveAsDrafIsNotEditableWithoutSigner,
    setSaveAsDrafIsNotEditableWithoutSigner,
  ] = useState(false);
  const [isNotEditableWithSigner, setIsNotEditableWithSigner] = useState(false);
  const initialFormData = {
    patientId,
    date,
    selectingClothes: {
      requiresNoAssistance: requiresNoAssistanceSelectingClothes,
      someAssistanceNeeded: someAssistanceNeededSelectingClothes,
      completeAssistanceNeeded: completeAssistanceNeededSelectingClothes,
      notApplicable: notApplicableSelectingClothes,
      refused: refusedSelectingClothes,
      staffInitials: staffInitialsSelectingClothes,
    },
    bathingOrShowering: {
      requiresNoAssistance: requiresNoAssistanceBathingOrShowering,
      someAssistanceNeeded: someAssistanceNeededBathingOrShowering,
      completeAssistanceNeeded: completeAssistanceNeededBathingOrShowering,
      notApplicable: notApplicableBathingOrShowering,
      refused: refusedBathingOrShowering,
      staffInitials: staffInitialsBathingOrShowering,
    },
    combingHair: {
      requiresNoAssistance: requiresNoAssistanceCombingHair,
      someAssistanceNeeded: someAssistanceNeededCombingHair,
      completeAssistanceNeeded: completeAssistanceNeededCombingHair,
      notApplicable: notApplicableCombingHair,
      refused: refusedCombingHair,
      staffInitials: staffInitialsCombingHair,
    },
    applyingLotion: {
      requiresNoAssistance: requiresNoAssistanceApplyingLotion,
      someAssistanceNeeded: someAssistanceNeededApplyingLotion,
      completeAssistanceNeeded: completeAssistanceNeededApplyingLotion,
      notApplicable: notApplicableApplyingLotion,
      refused: refusedApplyingLotion,
      staffInitials: staffInitialsApplyingLotion,
    },
    laundry: {
      requiresNoAssistance: requiresNoAssistanceLaundry,
      someAssistanceNeeded: someAssistanceNeededLaundry,
      completeAssistanceNeeded: completeAssistanceNeededLaundry,
      notApplicable: notApplicableLaundry,
      refused: refusedLaundry,
      staffInitials: staffInitialsLaundry,
    },
    dressing: {
      requiresNoAssistance: requiresNoAssistanceDressing,
      someAssistanceNeeded: someAssistanceNeededDressing,
      completeAssistanceNeeded: completeAssistanceNeededDressing,
      notApplicable: notApplicableDressing,
      refused: refusedDressing,
      staffInitials: staffInitialsDressing,
    },
    shampooingHair: {
      requiresNoAssistance: requiresNoAssistanceShampooingHair,
      someAssistanceNeeded: someAssistanceNeededShampooingHair,
      completeAssistanceNeeded: completeAssistanceNeededShampooingHair,
      notApplicable: notApplicableShampooingHair,
      refused: refusedShampooingHair,
      staffInitials: staffInitialsShampooingHair,
    },
    oralCareMorning: {
      requiresNoAssistance: requiresNoAssistanceOralCareMorning,
      someAssistanceNeeded: someAssistanceNeededOralCareMorning,
      completeAssistanceNeeded: completeAssistanceNeededOralCareMorning,
      notApplicable: notApplicableOralCareMorning,
      refused: refusedOralCareMorning,
      staffInitials: staffInitialsOralCareMorning,
    },
    oralCareEvening: {
      requiresNoAssistance: requiresNoAssistanceOralCareEvening,
      someAssistanceNeeded: someAssistanceNeededOralCareEvening,
      completeAssistanceNeeded: completeAssistanceNeededOralCareEvening,
      notApplicable: notApplicableOralCareEvening,
      refused: refusedOralCareEvening,
      staffInitials: staffInitialsOralCareEvening,
    },
    lunch: {
      requiresNoAssistance: requiresNoAssistanceLunch,
      someAssistanceNeeded: someAssistanceNeededLunch,
      completeAssistanceNeeded: completeAssistanceNeededLunch,
      notApplicable: notApplicableLunch,
      refused: refusedLunch,
      staffInitials: staffInitialsLunch,
    },
    breakfast: {
      requiresNoAssistance: requiresNoAssistanceBreakfast,
      someAssistanceNeeded: someAssistanceNeededBreakfast,
      completeAssistanceNeeded: completeAssistanceNeededBreakfast,
      notApplicable: notApplicableBreakfast,
      refused: refusedBreakfast,
      staffInitials: staffInitialsBreakfast,
    },
    dinner: {
      requiresNoAssistance: requiresNoAssistanceDinner,
      someAssistanceNeeded: someAssistanceNeededDinner,
      completeAssistanceNeeded: completeAssistanceNeededDinner,
      notApplicable: notApplicableDinner,
      refused: refusedDinner,
      staffInitials: staffInitialsDinner,
    },
    amSnack: {
      requiresNoAssistance: requiresNoAssistanceAMSnack,
      someAssistanceNeeded: someAssistanceNeededAMSnack,
      completeAssistanceNeeded: completeAssistanceNeededAMSnack,
      notApplicable: notApplicableAMSnack,
      refused: refusedAMSnack,
      staffInitials: staffInitialsAMSnack,
    },
    pmSnack: {
      requiresNoAssistance: requiresNoAssistancePMSnack,
      someAssistanceNeeded: someAssistanceNeededPMSnack,
      completeAssistanceNeeded: completeAssistanceNeededPMSnack,
      notApplicable: notApplicablePMSnack,
      refused: refusedPMSnack,
      staffInitials: staffInitialsPMSnack,
    },
    amBowelMovement: {
      requiresNoAssistance: requiresNoAssistanceAMBowelMovement,
      someAssistanceNeeded: someAssistanceNeededAMBowelMovement,
      completeAssistanceNeeded: completeAssistanceNeededAMBowelMovement,
      notApplicable: notApplicableAMBowelMovement,
      refused: refusedAMBowelMovement,
      staffInitials: staffInitialsAMBowelMovement,
    },
    pmBowelMovement: {
      requiresNoAssistance: requiresNoAssistancePMBowelMovement,
      someAssistanceNeeded: someAssistanceNeededPMBowelMovement,
      completeAssistanceNeeded: completeAssistanceNeededPMBowelMovement,
      notApplicable: notApplicablePMBowelMovement,
      refused: refusedPMBowelMovement,
      staffInitials: staffInitialsPMBowelMovement,
    },
    overnightBowelMovement: {
      requiresNoAssistance: requiresNoAssistanceOvernightBowelMovement,
      someAssistanceNeeded: someAssistanceNeededOvernightBowelMovement,
      completeAssistanceNeeded: completeAssistanceNeededOvernightBowelMovement,
      notApplicable: notApplicableOvernightBowelMovement,
      refused: refusedOvernightBowelMovement,
      staffInitials: staffInitialsOvernightBowelMovement,
    },
    handAndFootNailCare: {
      requiresNoAssistance: requiresNoAssistanceHandAndFootNailCare,
      someAssistanceNeeded: someAssistanceNeededHandAndFootNailCare,
      completeAssistanceNeeded: completeAssistanceNeededHandAndFootNailCare,
      notApplicable: notApplicableHandAndFootNailCare,
      refused: refusedHandAndFootNailCare,
      staffInitials: staffInitialsHandAndFootNailCare,
    },
    bedMobility: {
      requiresNoAssistance: requiresNoAssistanceBedMobility,
      someAssistanceNeeded: someAssistanceNeededBedMobility,
      completeAssistanceNeeded: completeAssistanceNeededBedMobility,
      notApplicable: notApplicableBedMobility,
      refused: refusedBedMobility,
      staffInitials: staffInitialsBedMobility,
    },
    savedSigned,
    dateSigned,
    signedTime: savedTime,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    saveAsDraft,
    signers,
  };
  const submitHandler = (e) => {
    e.preventDefault();
    patientChartService.adlTracking.update(id, initialFormData, {
      setLoading,
      navigate,
    });
  };
  const KeyPair = [
    {
      heading: "Selecting Clothes",
      row: [
        {
          setValue: setRequiresNoAssistanceSelectingClothes,
          value: requiresNoAssistanceSelectingClothes,
        },
        {
          setValue: setSomeAssistanceNeededSelectingClothes,
          value: someAssistanceNeededSelectingClothes,
        },
        {
          setValue: setCompleteAssistanceNeededSelectingClothes,
          value: completeAssistanceNeededSelectingClothes,
        },
        {
          setValue: setNotApplicableSelectingClothes,
          value: notApplicableSelectingClothes,
        },
        {
          setValue: setRefusedSelectingClothes,
          value: refusedSelectingClothes,
        },
      ],
      input: staffInitialsSelectingClothes,
      setInput: setStaffInitialsSelectingClothes,
    },
    {
      heading: "Bathing or Showering",
      row: [
        {
          setValue: setRequiresNoAssistanceBathingOrShowering,
          value: requiresNoAssistanceBathingOrShowering,
        },
        {
          setValue: setSomeAssistanceNeededBathingOrShowering,
          value: someAssistanceNeededBathingOrShowering,
        },
        {
          setValue: setCompleteAssistanceNeededBathingOrShowering,
          value: completeAssistanceNeededBathingOrShowering,
        },
        {
          setValue: setNotApplicableBathingOrShowering,
          value: notApplicableBathingOrShowering,
        },
        {
          setValue: setRefusedBathingOrShowering,
          value: refusedBathingOrShowering,
        },
      ],
      input: staffInitialsBathingOrShowering,
      setInput: setStaffInitialsBathingOrShowering,
    },
    {
      heading: "Combing Hair",
      row: [
        {
          setValue: setRequiresNoAssistanceCombingHair,
          value: requiresNoAssistanceCombingHair,
        },
        {
          setValue: setSomeAssistanceNeededCombingHair,
          value: someAssistanceNeededCombingHair,
        },
        {
          setValue: setCompleteAssistanceNeededCombingHair,
          value: completeAssistanceNeededCombingHair,
        },
        {
          setValue: setNotApplicableCombingHair,
          value: notApplicableCombingHair,
        },
        {
          setValue: setRefusedCombingHair,
          value: refusedCombingHair,
        },
      ],
      setInput: setStaffInitialsCombingHair,
      input: staffInitialsCombingHair,
    },
    {
      heading: "Applying Lotion",
      row: [
        {
          setValue: setRequiresNoAssistanceApplyingLotion,
          value: requiresNoAssistanceApplyingLotion,
        },
        {
          setValue: setSomeAssistanceNeededApplyingLotion,
          value: someAssistanceNeededApplyingLotion,
        },
        {
          setValue: setCompleteAssistanceNeededApplyingLotion,
          value: completeAssistanceNeededApplyingLotion,
        },
        {
          setValue: setNotApplicableApplyingLotion,
          value: notApplicableApplyingLotion,
        },
        {
          setValue: setRefusedApplyingLotion,
          value: refusedApplyingLotion,
        },
      ],
      setInput: setStaffInitialsApplyingLotion,
      input: staffInitialsApplyingLotion,
    },
    {
      heading: "Laundry",
      row: [
        {
          setValue: setRequiresNoAssistanceLaundry,
          value: requiresNoAssistanceLaundry,
        },
        {
          setValue: setSomeAssistanceNeededLaundry,
          value: someAssistanceNeededLaundry,
        },
        {
          setValue: setCompleteAssistanceNeededLaundry,
          value: completeAssistanceNeededLaundry,
        },
        {
          setValue: setNotApplicableLaundry,
          value: notApplicableLaundry,
        },
        {
          setValue: setRefusedLaundry,
          value: refusedLaundry,
        },
      ],
      setInput: setStaffInitialsLaundry,
      input: staffInitialsLaundry,
    },
    {
      heading: "Dressing",
      row: [
        {
          setValue: setRequiresNoAssistanceDressing,
          value: requiresNoAssistanceDressing,
        },
        {
          setValue: setSomeAssistanceNeededDressing,
          value: someAssistanceNeededDressing,
        },
        {
          setValue: setCompleteAssistanceNeededDressing,
          value: completeAssistanceNeededDressing,
        },
        {
          setValue: setNotApplicableDressing,
          value: notApplicableDressing,
        },
        {
          setValue: setRefusedDressing,
          value: refusedDressing,
        },
      ],
      setInput: setStaffInitialsDressing,
      input: staffInitialsDressing,
    },
    {
      heading: "Shampooing Hair",
      row: [
        {
          setValue: setRequiresNoAssistanceShampooingHair,
          value: requiresNoAssistanceShampooingHair,
        },
        {
          setValue: setSomeAssistanceNeededShampooingHair,
          value: someAssistanceNeededShampooingHair,
        },
        {
          setValue: setCompleteAssistanceNeededShampooingHair,
          value: completeAssistanceNeededShampooingHair,
        },
        {
          setValue: setNotApplicableShampooingHair,
          value: notApplicableShampooingHair,
        },
        {
          setValue: setRefusedShampooingHair,
          value: refusedShampooingHair,
        },
      ],
      setInput: setStaffInitialsShampooingHair,
      input: staffInitialsShampooingHair,
    },
    {
      heading: "Oral Care Evening",
      row: [
        {
          setValue: setRequiresNoAssistanceOralCareEvening,
          value: requiresNoAssistanceOralCareEvening,
        },
        {
          setValue: setSomeAssistanceNeededOralCareEvening,
          value: someAssistanceNeededOralCareEvening,
        },
        {
          setValue: setCompleteAssistanceNeededOralCareEvening,
          value: completeAssistanceNeededOralCareEvening,
        },
        {
          setValue: setNotApplicableOralCareEvening,
          value: notApplicableOralCareEvening,
        },
        {
          setValue: setRefusedOralCareEvening,
          value: refusedOralCareEvening,
        },
      ],
      setInput: setStaffInitialsOralCareEvening,
      input: staffInitialsOralCareEvening,
    },
    {
      heading: "Oral Care Morning",
      row: [
        {
          setValue: setRequiresNoAssistanceOralCareMorning,
          value: requiresNoAssistanceOralCareMorning,
        },
        {
          setValue: setSomeAssistanceNeededOralCareMorning,
          value: someAssistanceNeededOralCareMorning,
        },
        {
          setValue: setCompleteAssistanceNeededOralCareMorning,
          value: completeAssistanceNeededOralCareMorning,
        },
        {
          setValue: setNotApplicableOralCareMorning,
          value: notApplicableOralCareMorning,
        },
        {
          setValue: setRefusedOralCareMorning,
          value: refusedOralCareMorning,
        },
      ],
      setInput: setStaffInitialsOralCareMorning,
      input: staffInitialsOralCareMorning,
    },
    {
      heading: "Breakfast",
      row: [
        {
          setValue: setRequiresNoAssistanceBreakfast,
          value: requiresNoAssistanceBreakfast,
        },
        {
          setValue: setSomeAssistanceNeededBreakfast,
          value: someAssistanceNeededBreakfast,
        },
        {
          setValue: setCompleteAssistanceNeededBreakfast,
          value: completeAssistanceNeededBreakfast,
        },
        {
          setValue: setNotApplicableBreakfast,
          value: notApplicableBreakfast,
        },
        {
          setValue: setRefusedBreakfast,
          value: refusedBreakfast,
        },
      ],
      setInput: setStaffInitialsBreakfast,
      input: staffInitialsBreakfast,
    },
    {
      heading: "Lunch",
      row: [
        {
          setValue: setRequiresNoAssistanceLunch,
          value: requiresNoAssistanceLunch,
        },
        {
          setValue: setSomeAssistanceNeededLunch,
          value: someAssistanceNeededLunch,
        },
        {
          setValue: setCompleteAssistanceNeededLunch,
          value: completeAssistanceNeededLunch,
        },
        {
          setValue: setNotApplicableLunch,
          value: notApplicableLunch,
        },
        {
          setValue: setRefusedLunch,
          value: refusedLunch,
        },
      ],
      setInput: setStaffInitialsLunch,
      input: staffInitialsLunch,
    },
    {
      heading: "Dinner",
      row: [
        {
          setValue: setRequiresNoAssistanceDinner,
          value: requiresNoAssistanceDinner,
        },
        {
          setValue: setSomeAssistanceNeededDinner,
          value: someAssistanceNeededDinner,
        },
        {
          setValue: setCompleteAssistanceNeededDinner,
          value: completeAssistanceNeededDinner,
        },
        {
          setValue: setNotApplicableDinner,
          value: notApplicableDinner,
        },
        {
          setValue: setRefusedDinner,
          value: refusedDinner,
        },
      ],
      setInput: setStaffInitialsDinner,
      input: staffInitialsDinner,
    },
    {
      heading: "AM Snack",
      row: [
        {
          setValue: setRequiresNoAssistanceAMSnack,
          value: requiresNoAssistanceAMSnack,
        },
        {
          setValue: setSomeAssistanceNeededAMSnack,
          value: someAssistanceNeededAMSnack,
        },
        {
          setValue: setCompleteAssistanceNeededAMSnack,
          value: completeAssistanceNeededAMSnack,
        },
        {
          setValue: setNotApplicableAMSnack,
          value: notApplicableAMSnack,
        },
        {
          setValue: setRefusedAMSnack,
          value: refusedAMSnack,
        },
      ],
      setInput: setStaffInitialsAMSnack,
      input: staffInitialsAMSnack,
    },
    {
      heading: "PM Snack",
      row: [
        {
          setValue: setRequiresNoAssistancePMSnack,
          value: requiresNoAssistancePMSnack,
        },
        {
          setValue: setSomeAssistanceNeededPMSnack,
          value: someAssistanceNeededPMSnack,
        },
        {
          setValue: setCompleteAssistanceNeededPMSnack,
          value: completeAssistanceNeededPMSnack,
        },
        {
          setValue: setNotApplicablePMSnack,
          value: notApplicablePMSnack,
        },
        {
          setValue: setRefusedPMSnack,
          value: refusedPMSnack,
        },
      ],
      setInput: setStaffInitialsPMSnack,
      input: staffInitialsPMSnack,
    },
    {
      heading: "AM Bowel Movement",
      row: [
        {
          setValue: setRequiresNoAssistanceAMBowelMovement,
          value: requiresNoAssistanceAMBowelMovement,
        },
        {
          setValue: setSomeAssistanceNeededAMBowelMovement,
          value: someAssistanceNeededAMBowelMovement,
        },
        {
          setValue: setCompleteAssistanceNeededAMBowelMovement,
          value: completeAssistanceNeededAMBowelMovement,
        },
        {
          setValue: setNotApplicableAMBowelMovement,
          value: notApplicableAMBowelMovement,
        },
        {
          setValue: setRefusedAMBowelMovement,
          value: refusedAMBowelMovement,
        },
      ],
      setInput: setStaffInitialsAMBowelMovement,
      input: staffInitialsAMBowelMovement,
    },
    {
      heading: "PM Bowel Movement",
      row: [
        {
          setValue: setRequiresNoAssistancePMBowelMovement,
          value: requiresNoAssistancePMBowelMovement,
        },
        {
          setValue: setSomeAssistanceNeededPMBowelMovement,
          value: someAssistanceNeededPMBowelMovement,
        },
        {
          setValue: setCompleteAssistanceNeededPMBowelMovement,
          value: completeAssistanceNeededPMBowelMovement,
        },
        {
          setValue: setNotApplicablePMBowelMovement,
          value: notApplicablePMBowelMovement,
        },
        {
          setValue: setRefusedPMBowelMovement,
          value: refusedPMBowelMovement,
        },
      ],
      setInput: setStaffInitialsPMBowelMovement,
      input: staffInitialsPMBowelMovement,
    },
    {
      heading: "Overnight Bowel Movement",
      row: [
        {
          setValue: setRequiresNoAssistanceOvernightBowelMovement,
          value: requiresNoAssistanceOvernightBowelMovement,
        },
        {
          setValue: setSomeAssistanceNeededOvernightBowelMovement,
          value: someAssistanceNeededOvernightBowelMovement,
        },
        {
          setValue: setCompleteAssistanceNeededOvernightBowelMovement,
          value: completeAssistanceNeededOvernightBowelMovement,
        },
        {
          setValue: setNotApplicableOvernightBowelMovement,
          value: notApplicableOvernightBowelMovement,
        },
        {
          setValue: setRefusedOvernightBowelMovement,
          value: refusedOvernightBowelMovement,
        },
      ],
      setInput: setStaffInitialsOvernightBowelMovement,
      input: staffInitialsOvernightBowelMovement,
    },
    {
      heading: "Hand & Foot nail care",
      row: [
        {
          setValue: setRequiresNoAssistanceHandAndFootNailCare,
          value: requiresNoAssistanceHandAndFootNailCare,
        },
        {
          setValue: setSomeAssistanceNeededHandAndFootNailCare,
          value: someAssistanceNeededHandAndFootNailCare,
        },
        {
          setValue: setCompleteAssistanceNeededHandAndFootNailCare,
          value: completeAssistanceNeededHandAndFootNailCare,
        },
        {
          setValue: setNotApplicableHandAndFootNailCare,
          value: notApplicableHandAndFootNailCare,
        },
        {
          setValue: setRefusedHandAndFootNailCare,
          value: refusedHandAndFootNailCare,
        },
      ],
      setInput: setStaffInitialsHandAndFootNailCare,
      input: staffInitialsHandAndFootNailCare,
    },
    {
      heading: "Bed Mobility",
      row: [
        {
          setValue: setRequiresNoAssistanceBedMobility,
          value: requiresNoAssistanceBedMobility,
        },
        {
          setValue: setSomeAssistanceNeededBedMobility,
          value: someAssistanceNeededBedMobility,
        },
        {
          setValue: setCompleteAssistanceNeededBedMobility,
          value: completeAssistanceNeededBedMobility,
        },
        {
          setValue: setNotApplicableBedMobility,
          value: notApplicableBedMobility,
        },
        {
          setValue: setRefusedBedMobility,
          value: refusedBedMobility,
        },
      ],
      setInput: setStaffInitialsBedMobility,
      input: staffInitialsBedMobility,
    },
  ];
  const fetchDetails = () => {
    patientChartService.adlTracking.getById(id, { setResponse: setDetail });
  };
  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (detail) {
      const item = detail?.data;
      setPatientId(item?.patientId?._id);
      setDate(item?.date);
      setRequiresNoAssistanceSelectingClothes(
        item?.selectingClothes?.requiresNoAssistance,
      );
      setSomeAssistanceNeededSelectingClothes(
        item?.selectingClothes?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededSelectingClothes(
        item?.selectingClothes?.completeAssistanceNeeded,
      );
      setNotApplicableSelectingClothes(item?.selectingClothes?.notApplicable);
      setRefusedSelectingClothes(item?.selectingClothes?.refused);
      setStaffInitialsSelectingClothes(item?.selectingClothes?.staffInitials);
      // Bathing or Showering
      setRequiresNoAssistanceBathingOrShowering(
        item?.bathingOrShowering?.requiresNoAssistance,
      );
      setSomeAssistanceNeededBathingOrShowering(
        item?.bathingOrShowering?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededBathingOrShowering(
        item?.bathingOrShowering?.completeAssistanceNeeded,
      );
      setNotApplicableBathingOrShowering(
        item?.bathingOrShowering?.notApplicable,
      );
      setRefusedBathingOrShowering(item?.bathingOrShowering?.refused);
      setStaffInitialsBathingOrShowering(
        item?.bathingOrShowering?.staffInitials,
      );
      // Combing Hair
      setRequiresNoAssistanceCombingHair(
        item?.combingHair?.requiresNoAssistance,
      );
      setSomeAssistanceNeededCombingHair(
        item?.combingHair?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededCombingHair(
        item?.combingHair?.completeAssistanceNeeded,
      );
      setNotApplicableCombingHair(item?.combingHair?.notApplicable);
      setRefusedCombingHair(item?.combingHair?.refused);
      setStaffInitialsCombingHair(item?.combingHair?.staffInitials);
      // Applying Lotion
      setRequiresNoAssistanceApplyingLotion(
        item?.applyingLotion?.requiresNoAssistance,
      );
      setSomeAssistanceNeededApplyingLotion(
        item?.applyingLotion?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededApplyingLotion(
        item?.applyingLotion?.completeAssistanceNeeded,
      );
      setNotApplicableApplyingLotion(item?.applyingLotion?.notApplicable);
      setRefusedApplyingLotion(item?.applyingLotion?.refused);
      setStaffInitialsApplyingLotion(item?.applyingLotion?.staffInitials);
      // laundry
      setRequiresNoAssistanceLaundry(item?.laundry?.requiresNoAssistance);
      setSomeAssistanceNeededLaundry(item?.laundry?.someAssistanceNeeded);
      setCompleteAssistanceNeededLaundry(
        item?.laundry?.completeAssistanceNeeded,
      );
      setNotApplicableLaundry(item?.laundry?.notApplicable);
      setRefusedLaundry(item?.laundry?.refused);
      setStaffInitialsLaundry(item?.laundry?.staffInitials);
      // Dressing
      setRequiresNoAssistanceDressing(item?.dressing?.requiresNoAssistance);
      setSomeAssistanceNeededDressing(item?.dressing?.someAssistanceNeeded);
      setCompleteAssistanceNeededDressing(
        item?.dressing?.completeAssistanceNeeded,
      );
      setNotApplicableDressing(item?.dressing?.notApplicable);
      setRefusedDressing(item?.dressing?.refused);
      setStaffInitialsDressing(item?.dressing?.staffInitials);
      // Shampooing hair
      setRequiresNoAssistanceShampooingHair(
        item?.shampooingHair?.requiresNoAssistance,
      );
      setSomeAssistanceNeededShampooingHair(
        item?.shampooingHair?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededShampooingHair(
        item?.shampooingHair?.completeAssistanceNeeded,
      );
      setNotApplicableShampooingHair(item?.shampooingHair?.notApplicable);
      setRefusedShampooingHair(item?.shampooingHair?.refused);
      setStaffInitialsShampooingHair(item?.shampooingHair?.staffInitials);
      // Oral Care Evening
      setRequiresNoAssistanceOralCareEvening(
        item?.oralCareEvening?.requiresNoAssistance,
      );
      setSomeAssistanceNeededOralCareEvening(
        item?.oralCareEvening?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededOralCareEvening(
        item?.oralCareEvening?.completeAssistanceNeeded,
      );
      setNotApplicableOralCareEvening(item?.oralCareEvening?.notApplicable);
      setRefusedOralCareEvening(item?.oralCareEvening?.refused);
      setStaffInitialsOralCareEvening(item?.oralCareEvening?.staffInitials);
      // Oral Care Morning
      setRequiresNoAssistanceOralCareMorning(
        item?.oralCareMorning?.requiresNoAssistance,
      );
      setSomeAssistanceNeededOralCareMorning(
        item?.oralCareMorning?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededOralCareMorning(
        item?.oralCareMorning?.completeAssistanceNeeded,
      );
      setNotApplicableOralCareMorning(item?.oralCareMorning?.notApplicable);
      setRefusedOralCareMorning(item?.oralCareMorning?.refused);
      setStaffInitialsOralCareMorning(item?.oralCareMorning?.staffInitials);
      // Lunch
      setRequiresNoAssistanceLunch(item?.lunch?.requiresNoAssistance);
      setSomeAssistanceNeededLunch(item?.lunch?.someAssistanceNeeded);
      setCompleteAssistanceNeededLunch(item?.lunch?.completeAssistanceNeeded);
      setNotApplicableLunch(item?.lunch?.notApplicable);
      setRefusedLunch(item?.lunch?.refused);
      setStaffInitialsLunch(item?.lunch?.staffInitials);
      // Breakfast
      setRequiresNoAssistanceBreakfast(item?.breakfast?.requiresNoAssistance);
      setSomeAssistanceNeededBreakfast(item?.breakfast?.someAssistanceNeeded);
      setCompleteAssistanceNeededBreakfast(
        item?.breakfast?.completeAssistanceNeeded,
      );
      setNotApplicableBreakfast(item?.breakfast?.notApplicable);
      setRefusedBreakfast(item?.breakfast?.refused);
      setStaffInitialsBreakfast(item?.breakfast?.staffInitials);
      // Dinner
      setRequiresNoAssistanceDinner(item?.dinner?.requiresNoAssistance);
      setSomeAssistanceNeededDinner(item?.dinner?.someAssistanceNeeded);
      setCompleteAssistanceNeededDinner(item?.dinner?.completeAssistanceNeeded);
      setNotApplicableDinner(item?.dinner?.notApplicable);
      setRefusedDinner(item?.dinner?.refused);
      setStaffInitialsDinner(item?.dinner?.staffInitials);
      // Am Snack
      setRequiresNoAssistanceAMSnack(item?.amSnack?.requiresNoAssistance);
      setSomeAssistanceNeededAMSnack(item?.amSnack?.someAssistanceNeeded);
      setCompleteAssistanceNeededAMSnack(
        item?.amSnack?.completeAssistanceNeeded,
      );
      setNotApplicableAMSnack(item?.amSnack?.notApplicable);
      setRefusedAMSnack(item?.amSnack?.refused);
      setStaffInitialsAMSnack(item?.amSnack?.staffInitials);
      //  Pm Snack
      setRequiresNoAssistancePMSnack(item?.pmSnack?.requiresNoAssistance);
      setSomeAssistanceNeededPMSnack(item?.pmSnack?.someAssistanceNeeded);
      setCompleteAssistanceNeededPMSnack(
        item?.pmSnack?.completeAssistanceNeeded,
      );
      setNotApplicablePMSnack(item?.pmSnack?.notApplicable);
      setRefusedPMSnack(item?.pmSnack?.refused);
      setStaffInitialsPMSnack(item?.pmSnack?.staffInitials);
      // Am Bowl Movement
      setRequiresNoAssistanceAMBowelMovement(
        item?.amBowelMovement?.requiresNoAssistance,
      );
      setSomeAssistanceNeededAMBowelMovement(
        item?.amBowelMovement?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededAMBowelMovement(
        item?.amBowelMovement?.completeAssistanceNeeded,
      );
      setNotApplicableAMBowelMovement(item?.amBowelMovement?.notApplicable);
      setRefusedAMBowelMovement(item?.amBowelMovement?.refused);
      setStaffInitialsAMBowelMovement(item?.amBowelMovement?.staffInitials);
      // Pm Bowl Movement
      setRequiresNoAssistancePMBowelMovement(
        item?.pmBowelMovement?.requiresNoAssistance,
      );
      setSomeAssistanceNeededPMBowelMovement(
        item?.pmBowelMovement?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededPMBowelMovement(
        item?.pmBowelMovement?.completeAssistanceNeeded,
      );
      setNotApplicablePMBowelMovement(item?.pmBowelMovement?.notApplicable);
      setRefusedPMBowelMovement(item?.pmBowelMovement?.refused);
      setStaffInitialsPMBowelMovement(item?.pmBowelMovement?.staffInitials);
      // OverNight Bowel Movement
      setRequiresNoAssistanceOvernightBowelMovement(
        item?.overnightBowelMovement?.requiresNoAssistance,
      );
      setSomeAssistanceNeededOvernightBowelMovement(
        item?.overnightBowelMovement?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededOvernightBowelMovement(
        item?.overnightBowelMovement?.completeAssistanceNeeded,
      );
      setNotApplicableOvernightBowelMovement(
        item?.overnightBowelMovement?.notApplicable,
      );
      setRefusedOvernightBowelMovement(item?.overnightBowelMovement?.refused);
      setStaffInitialsOvernightBowelMovement(
        item?.overnightBowelMovement?.staffInitials,
      );
      // Hand Foot
      setRequiresNoAssistanceHandAndFootNailCare(
        item?.handAndFootNailCare?.requiresNoAssistance,
      );
      setSomeAssistanceNeededHandAndFootNailCare(
        item?.handAndFootNailCare?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededHandAndFootNailCare(
        item?.handAndFootNailCare?.completeAssistanceNeeded,
      );
      setNotApplicableHandAndFootNailCare(
        item?.handAndFootNailCare?.notApplicable,
      );
      setRefusedHandAndFootNailCare(item?.handAndFootNailCare?.refused);
      setStaffInitialsHandAndFootNailCare(
        item?.handAndFootNailCare?.staffInitials,
      );
      // Bed Mobility
      setRequiresNoAssistanceBedMobility(
        item?.bedMobility?.requiresNoAssistance,
      );
      setSomeAssistanceNeededBedMobility(
        item?.bedMobility?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededBedMobility(
        item?.bedMobility?.completeAssistanceNeeded,
      );
      setNotApplicableBedMobility(item?.bedMobility?.notApplicable);
      setRefusedBedMobility(item?.bedMobility?.refused);
      setStaffInitialsBedMobility(item?.bedMobility?.staffInitials);
      setSavedSigned(item?.savedSigned);
      setDateSigned(item?.dateSigned);
      setDate(item?.date);
      setSavedTime(item?.signedTime);
      setSigners(item?.signers);
      setAdminSignature(item?.adminSignature);
      setAdminDateSigned(item?.adminDateSigned);
      setAdminSignedTime(item?.adminSignedTime);
    }
  }, [detail]);
  useEffect(() => {
    if (!detail?.data) return;
    if (detail?.data) {
      const { saveAsDraft, signers } = detail.data;
      const { _id, userType, accountType, userPermissions } = profileInfo;
      const isSigner = signers?.findIndex?.(
        (signer, i) => signer.signerId === _id,
      );
      const isEmployeeRegular =
        userType === ROLES.EMPLOYEE && accountType === ACCOUNT_TYPES.REGULAR;
      const isEmployeeRestricted =
        userType === ROLES.EMPLOYEE && accountType === ACCOUNT_TYPES.RESTRICTED;
      const cannotEditDocument = !userPermissions?.edit
        ?.split(":")
        .includes("dtf");
      const isSignerFound = isSigner !== -1;
      const isSignerNotFound = isSigner === -1;

      const isRegularSignerWithoutEdit =
        isEmployeeRegular && cannotEditDocument && isSignerFound;
      const isRestrictedSigner = isEmployeeRestricted && isSignerFound;
      const isNotEditableSigner =
        isRegularSignerWithoutEdit || isRestrictedSigner;

      const isRegularNonSignerWithoutEdit =
        isEmployeeRegular && cannotEditDocument && isSignerNotFound;
      const isRestrictedNonSigner = isEmployeeRestricted && isSignerNotFound;

      const isSaveAsDraftWithSigner = saveAsDraft && isNotEditableSigner;
      setSaveAsDrafIsNotEditable(isSaveAsDraftWithSigner);

      const isSaveAsDraftWithoutSigner =
        saveAsDraft && (isRegularNonSignerWithoutEdit || isRestrictedNonSigner);
      setSaveAsDrafIsNotEditableWithoutSigner(isSaveAsDraftWithoutSigner);

      setIsNotEditableWithSigner(isNotEditableSigner);
    }
  }, [
    detail?.data,
    profileInfo,
    profileInfo?._id,
    profileInfo?.accountType,
    profileInfo?.userPermissions?.edit,
    profileInfo?.userType,
  ]);
  const checkSign = useCallback(async () => {
    let signerIndex = signers?.findIndex?.(
      (signer, i) => signer.signerId === profileInfo._id,
    );
    let isSignerValid =
      signerIndex !== -1 && signers?.[signerIndex]?.signature?.length > 0;
    let isAdminConditionValid = profileInfo.userType === ROLES.ADMIN;
    let isEmployeeConditionValid =
      (detail?.data?.employeeId === profileInfo?._id ||
        detail?.data?.employeeId?._id === profileInfo?._id) &&
      savedSigned?.length > 0;
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
    detail?.data?.employeeId,
    savedSigned?.length,
  ]);
  useEffect(() => {
    if (id) {
      checkSign();
    }
  }, [savedSigned, adminSignature, id, checkSign]);
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
      // setDateSigned(date)
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
      setSavedTime(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignedTime(time);
    }
  };
  return (
    <>
      <AddSignature
        show={open}
        setValue={(sign) =>
          detail?.data?.employeeId === profileInfo?._id
            ? setSavedSigned(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          detail?.data?.employeeId === profileInfo?._id
            ? setDateSigned(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          detail?.data?.employeeId === profileInfo?._id
            ? setSavedTime(time)
            : editTimeHandler(time)
        }
      />
      <NavWrapper
        title={"Activities of Daily Living Tracking Form"}
        isArrow={true}
      />
      <Container className="full-width-container">
        <Form onSubmit={submitHandler}>
          <Row
            className={`mb-3 ${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"} `}
          >
            <Col xs={12} md={12} lg={4}>
              <Row>
                <Col xs={2}>
                  <Form.Label className="fw-bold">Resident:</Form.Label>
                </Col>
                <Col xs={10}>
                  <Form.Control
                    size="sm"
                    value={
                      detail?.data?.patientId &&
                      fetchPaitentName(detail?.data?.patientId)
                    }
                  ></Form.Control>
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={12} lg={4}></Col>
            <Col xs={12} md={12} lg={4}>
              <Row>
                <Col xs={4}>
                  <Form.Label className="fw-bold">Today's Date:</Form.Label>
                </Col>
                <Col xs={8}>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(date)}
                    onChange={(selectedDate) =>
                      setDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          date ? formatDateToMMDDYYYY(date) : new Date(),
                        ],
                      },
                    ]}
                    className="form-control form-control-sm"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Table
            responsive
            bordered
            className={`${(saveAsDrafIsNotEditable || saveAsDrafIsNotEditableWithoutSigner || isNotEditableWithSigner) && "pe-none"}`}
          >
            <thead>
              <tr>
                <th>ADLS</th>
                <th>Requires No  Assistance</th>
                <th>Some  Assistance  Needed</th>
                <th>Complete  Assistance  Needed</th>
                <th>Not  Applicable</th>
                <th>Refused</th>
                <th>Staff Initials</th>
              </tr>
            </thead>
            <tbody>
              {KeyPair?.map((item, index) => (
                <TableRow
                  heading={item?.heading}
                  row={item?.row}
                  input={item?.input}
                  setInput={item?.setInput}
                  key={index}
                />
              ))}
            </tbody>
          </Table>
          <Row>
            <Col xs={12}>
              <Form.Label className="fw-bold">
                Staff members are to initial once ADLs is completed on each
                shift.
              </Form.Label>
            </Col>
          </Row>
          <Row
            className={`my-2 ${saveAsDrafIsNotEditableWithoutSigner && "pe-none"}`}
          >
            <Col xs={12} md={6}>
              <Button
                type="button"
                className="theme-button"
                onClick={() => setOpen(true)}
              >
                SAVED AND SIGNED
              </Button>
            </Col>
            <Col xs={12} md={6}>
              {signatureFormat({
                sign: savedSigned,
                date: dateSigned,
                time: savedTime,
                hoursFormat,
              })}
              {signatureFormat({
                sign: adminSignature,
                date: adminDateSigned,
                time: adminSignedTime,
                hoursFormat,
              })}
              {signers?.map(
                (signer, i) =>
                  signer.signature && (
                    <div className="text-end" key={signer?.signerId}>
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
          <div className="employee-btn-joiner mt-2">
            {detail?.data?.saveAsDraft && (
              <button
                className={`draft ${saveAsDrafIsNotEditableWithoutSigner && "pe-none"}`}
                type="submit"
                onClick={() => setSaveAsDraft(true)}
              >
                Save as Draft
              </button>
            )}
            <button className="employee_create_btn" disabled={!isSubmitEnabled}>
              {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
            </button>
          </div>
        </Form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: UpdateDTF,
});
