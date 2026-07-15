/** @format */

import React, { useEffect, useState } from "react";
import { Container, Table, Row, Col, Button, Form } from "react-bootstrap";
import { CheckBoxMaker } from "@/utils/Makers";
import { ClipLoader } from "react-spinners";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import { createForRole, patientChartService } from "@/features/shared/services";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { ROLES } from "@/features/shared/constants";
export const TableRow = ({ heading, row, input, setInput }) => {
  return (
    <tr>
      <td> {heading} </td>
      {row?.map((i, index) => (
        <td key={index} className="text-center">
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
const CreateDTF = () => {
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const url = useLocation()?.pathname;
  const [getData, setGetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState(formatDateToMMDDYYYY(new Date()));
  const profileUser = useSelector(userProfile);
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
  const [dateSigned, setDateSigned] = useState("");
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [signers, setSigners] = useState([]);
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [openAdmin, setAdminOpen] = useState(false);
  useEffect(() => {
    if (patientId) {
      patientChartService.adlTracking.getByPatientId(patientId, {
        setResponse: setGetData,
        setLoading,
      });
    }
  }, [patientId, profile?.userType]);
  useEffect(() => {
    let populateData;
    if (Array.isArray(getData?.data)) {
      populateData = getData?.data?.find((item) => {
        return (
          item?.patientId?._id === patientId || item?.patientId === patientId
        );
      });
    }
    if (populateData) {
      if (url !== "/create-dtf") {
        setDate(populateData?.date);
      }
      setRequiresNoAssistanceSelectingClothes(
        populateData?.selectingClothes?.requiresNoAssistance,
      );
      setSomeAssistanceNeededSelectingClothes(
        populateData?.selectingClothes?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededSelectingClothes(
        populateData?.selectingClothes?.completeAssistanceNeeded,
      );
      setNotApplicableSelectingClothes(
        populateData?.selectingClothes?.notApplicable,
      );
      setRefusedSelectingClothes(populateData?.selectingClothes?.refused);
      setStaffInitialsSelectingClothes(
        populateData?.selectingClothes?.staffInitials,
      );
      // Bathing or Showering
      setRequiresNoAssistanceBathingOrShowering(
        populateData?.bathingOrShowering?.requiresNoAssistance,
      );
      setSomeAssistanceNeededBathingOrShowering(
        populateData?.bathingOrShowering?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededBathingOrShowering(
        populateData?.bathingOrShowering?.completeAssistanceNeeded,
      );
      setNotApplicableBathingOrShowering(
        populateData?.bathingOrShowering?.notApplicable,
      );
      setRefusedBathingOrShowering(populateData?.bathingOrShowering?.refused);
      setStaffInitialsBathingOrShowering(
        populateData?.bathingOrShowering?.staffInitials,
      );
      // Combing Hair
      setRequiresNoAssistanceCombingHair(
        populateData?.combingHair?.requiresNoAssistance,
      );
      setSomeAssistanceNeededCombingHair(
        populateData?.combingHair?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededCombingHair(
        populateData?.combingHair?.completeAssistanceNeeded,
      );
      setNotApplicableCombingHair(populateData?.combingHair?.notApplicable);
      setRefusedCombingHair(populateData?.combingHair?.refused);
      setStaffInitialsCombingHair(populateData?.combingHair?.staffInitials);
      // Applying Lotion
      setRequiresNoAssistanceApplyingLotion(
        populateData?.applyingLotion?.requiresNoAssistance,
      );
      setSomeAssistanceNeededApplyingLotion(
        populateData?.applyingLotion?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededApplyingLotion(
        populateData?.applyingLotion?.completeAssistanceNeeded,
      );
      setNotApplicableApplyingLotion(
        populateData?.applyingLotion?.notApplicable,
      );
      setRefusedApplyingLotion(populateData?.applyingLotion?.refused);
      setStaffInitialsApplyingLotion(
        populateData?.applyingLotion?.staffInitials,
      );
      // laundry
      setRequiresNoAssistanceLaundry(
        populateData?.laundry?.requiresNoAssistance,
      );
      setSomeAssistanceNeededLaundry(
        populateData?.laundry?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededLaundry(
        populateData?.laundry?.completeAssistanceNeeded,
      );
      setNotApplicableLaundry(populateData?.laundry?.notApplicable);
      setRefusedLaundry(populateData?.laundry?.refused);
      setStaffInitialsLaundry(populateData?.laundry?.staffInitials);
      // Dressing
      setRequiresNoAssistanceDressing(
        populateData?.dressing?.requiresNoAssistance,
      );
      setSomeAssistanceNeededDressing(
        populateData?.dressing?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededDressing(
        populateData?.dressing?.completeAssistanceNeeded,
      );
      setNotApplicableDressing(populateData?.dressing?.notApplicable);
      setRefusedDressing(populateData?.dressing?.refused);
      setStaffInitialsDressing(populateData?.dressing?.staffInitials);
      // Shampooing hair
      setRequiresNoAssistanceShampooingHair(
        populateData?.shampooingHair?.requiresNoAssistance,
      );
      setSomeAssistanceNeededShampooingHair(
        populateData?.shampooingHair?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededShampooingHair(
        populateData?.shampooingHair?.completeAssistanceNeeded,
      );
      setNotApplicableShampooingHair(
        populateData?.shampooingHair?.notApplicable,
      );
      setRefusedShampooingHair(populateData?.shampooingHair?.refused);
      setStaffInitialsShampooingHair(
        populateData?.shampooingHair?.staffInitials,
      );
      // Oral Care Evening
      setRequiresNoAssistanceOralCareEvening(
        populateData?.oralCareEvening?.requiresNoAssistance,
      );
      setSomeAssistanceNeededOralCareEvening(
        populateData?.oralCareEvening?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededOralCareEvening(
        populateData?.oralCareEvening?.completeAssistanceNeeded,
      );
      setNotApplicableOralCareEvening(
        populateData?.oralCareEvening?.notApplicable,
      );
      setRefusedOralCareEvening(populateData?.oralCareEvening?.refused);
      setStaffInitialsOralCareEvening(
        populateData?.oralCareEvening?.staffInitials,
      );
      // Oral Care Morning
      setRequiresNoAssistanceOralCareMorning(
        populateData?.oralCareMorning?.requiresNoAssistance,
      );
      setSomeAssistanceNeededOralCareMorning(
        populateData?.oralCareMorning?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededOralCareMorning(
        populateData?.oralCareMorning?.completeAssistanceNeeded,
      );
      setNotApplicableOralCareMorning(
        populateData?.oralCareMorning?.notApplicable,
      );
      setRefusedOralCareMorning(populateData?.oralCareMorning?.refused);
      setStaffInitialsOralCareMorning(
        populateData?.oralCareMorning?.staffInitials,
      );
      // Lunch
      setRequiresNoAssistanceLunch(populateData?.lunch?.requiresNoAssistance);
      setSomeAssistanceNeededLunch(populateData?.lunch?.someAssistanceNeeded);
      setCompleteAssistanceNeededLunch(
        populateData?.lunch?.completeAssistanceNeeded,
      );
      setNotApplicableLunch(populateData?.lunch?.notApplicable);
      setRefusedLunch(populateData?.lunch?.refused);
      setStaffInitialsLunch(populateData?.lunch?.staffInitials);
      // Breakfast
      setRequiresNoAssistanceBreakfast(
        populateData?.breakfast?.requiresNoAssistance,
      );
      setSomeAssistanceNeededBreakfast(
        populateData?.breakfast?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededBreakfast(
        populateData?.breakfast?.completeAssistanceNeeded,
      );
      setNotApplicableBreakfast(populateData?.breakfast?.notApplicable);
      setRefusedBreakfast(populateData?.breakfast?.refused);
      setStaffInitialsBreakfast(populateData?.breakfast?.staffInitials);
      // Dinner
      setRequiresNoAssistanceDinner(populateData?.dinner?.requiresNoAssistance);
      setSomeAssistanceNeededDinner(populateData?.dinner?.someAssistanceNeeded);
      setCompleteAssistanceNeededDinner(
        populateData?.dinner?.completeAssistanceNeeded,
      );
      setNotApplicableDinner(populateData?.dinner?.notApplicable);
      setRefusedDinner(populateData?.dinner?.refused);
      setStaffInitialsDinner(populateData?.dinner?.staffInitials);
      // Am Snack
      setRequiresNoAssistanceAMSnack(
        populateData?.amSnacks?.requiresNoAssistance,
      );
      setSomeAssistanceNeededAMSnack(
        populateData?.amSnacks?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededAMSnack(
        populateData?.amSnacks?.completeAssistanceNeeded,
      );
      setNotApplicableAMSnack(populateData?.amSnacks?.notApplicable);
      setRefusedAMSnack(populateData?.amSnacks?.refused);
      setStaffInitialsAMSnack(populateData?.amSnacks?.staffInitials);
      //  Pm Snack
      setRequiresNoAssistancePMSnack(
        populateData?.pmSnack?.requiresNoAssistance,
      );
      setSomeAssistanceNeededPMSnack(
        populateData?.pmSnack?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededPMSnack(
        populateData?.pmSnack?.completeAssistanceNeeded,
      );
      setNotApplicablePMSnack(populateData?.pmSnack?.notApplicable);
      setRefusedPMSnack(populateData?.pmSnack?.refused);
      setStaffInitialsPMSnack(populateData?.pmSnack?.staffInitials);
      // Am Bowl Movement
      setRequiresNoAssistanceAMBowelMovement(
        populateData?.amBowelMovement?.requiresNoAssistance,
      );
      setSomeAssistanceNeededAMBowelMovement(
        populateData?.amBowelMovement?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededAMBowelMovement(
        populateData?.amBowelMovement?.completeAssistanceNeeded,
      );
      setNotApplicableAMBowelMovement(
        populateData?.amBowelMovement?.notApplicable,
      );
      setRefusedAMBowelMovement(populateData?.amBowelMovement?.refused);
      setStaffInitialsAMBowelMovement(
        populateData?.amBowelMovement?.staffInitials,
      );
      // Pm Bowl Movement
      setRequiresNoAssistancePMBowelMovement(
        populateData?.pmBowelMovement?.requiresNoAssistance,
      );
      setSomeAssistanceNeededPMBowelMovement(
        populateData?.pmBowelMovement?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededPMBowelMovement(
        populateData?.pmBowelMovement?.completeAssistanceNeeded,
      );
      setNotApplicablePMBowelMovement(
        populateData?.pmBowelMovement?.notApplicable,
      );
      setRefusedPMBowelMovement(populateData?.pmBowelMovement?.refused);
      setStaffInitialsPMBowelMovement(
        populateData?.pmBowelMovement?.staffInitials,
      );
      // OverNight Bowel Movement
      setRequiresNoAssistanceOvernightBowelMovement(
        populateData?.overnightBowelMovement?.requiresNoAssistance,
      );
      setSomeAssistanceNeededOvernightBowelMovement(
        populateData?.overnightBowelMovement?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededOvernightBowelMovement(
        populateData?.overnightBowelMovement?.completeAssistanceNeeded,
      );
      setNotApplicableOvernightBowelMovement(
        populateData?.overnightBowelMovement?.notApplicable,
      );
      setRefusedOvernightBowelMovement(
        populateData?.overnightBowelMovement?.refused,
      );
      setStaffInitialsOvernightBowelMovement(
        populateData?.overnightBowelMovement?.staffInitials,
      );
      // Hand Foot
      setRequiresNoAssistanceHandAndFootNailCare(
        populateData?.handAndFootNailCare?.requiresNoAssistance,
      );
      setSomeAssistanceNeededHandAndFootNailCare(
        populateData?.handAndFootNailCare?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededHandAndFootNailCare(
        populateData?.handAndFootNailCare?.completeAssistanceNeeded,
      );
      setNotApplicableHandAndFootNailCare(
        populateData?.handAndFootNailCare?.notApplicable,
      );
      setRefusedHandAndFootNailCare(populateData?.handAndFootNailCare?.refused);
      setStaffInitialsHandAndFootNailCare(
        populateData?.handAndFootNailCare?.staffInitials,
      );
      // Bed Mobility
      setRequiresNoAssistanceBedMobility(
        populateData?.bedMobility?.requiresNoAssistance,
      );
      setSomeAssistanceNeededBedMobility(
        populateData?.bedMobility?.someAssistanceNeeded,
      );
      setCompleteAssistanceNeededBedMobility(
        populateData?.bedMobility?.completeAssistanceNeeded,
      );
      setNotApplicableBedMobility(populateData?.bedMobility?.notApplicable);
      setRefusedBedMobility(populateData?.bedMobility?.refused);
      setStaffInitialsBedMobility(populateData?.bedMobility?.staffInitials);
    } else {
      setRequiresNoAssistanceSelectingClothes(false);
      setSomeAssistanceNeededSelectingClothes(false);
      setCompleteAssistanceNeededSelectingClothes(false);
      setNotApplicableSelectingClothes(false);
      setRefusedSelectingClothes(false);
      setStaffInitialsSelectingClothes("");
      // Bathing or Showering
      setRequiresNoAssistanceBathingOrShowering(false);
      setSomeAssistanceNeededBathingOrShowering(false);
      setCompleteAssistanceNeededBathingOrShowering(false);
      setNotApplicableBathingOrShowering(false);
      setRefusedBathingOrShowering(false);
      setStaffInitialsBathingOrShowering("");
      // Combing Hair
      setRequiresNoAssistanceCombingHair(false);
      setSomeAssistanceNeededCombingHair(false);
      setCompleteAssistanceNeededCombingHair(false);
      setNotApplicableCombingHair(false);
      setRefusedCombingHair(false);
      setStaffInitialsCombingHair("");
      // Applying Lotion
      setRequiresNoAssistanceApplyingLotion(false);
      setSomeAssistanceNeededApplyingLotion(false);
      setCompleteAssistanceNeededApplyingLotion(false);
      setNotApplicableApplyingLotion(false);
      setRefusedApplyingLotion(false);
      setStaffInitialsApplyingLotion("");
      // laundry
      setRequiresNoAssistanceLaundry(false);
      setSomeAssistanceNeededLaundry(false);
      setCompleteAssistanceNeededLaundry(false);
      setNotApplicableLaundry(false);
      setRefusedLaundry(false);
      setStaffInitialsLaundry("");
      // Dressing
      setRequiresNoAssistanceDressing(false);
      setSomeAssistanceNeededDressing(false);
      setCompleteAssistanceNeededDressing(false);
      setNotApplicableDressing(false);
      setRefusedDressing(false);
      setStaffInitialsDressing("");
      // Shampooing hair
      setRequiresNoAssistanceShampooingHair(false);
      setSomeAssistanceNeededShampooingHair(false);
      setCompleteAssistanceNeededShampooingHair(false);
      setNotApplicableShampooingHair(false);
      setRefusedShampooingHair(false);
      setStaffInitialsShampooingHair("");
      // Oral Care Evening
      setRequiresNoAssistanceOralCareEvening(false);
      setSomeAssistanceNeededOralCareEvening(false);
      setCompleteAssistanceNeededOralCareEvening(false);
      setNotApplicableOralCareEvening(false);
      setRefusedOralCareEvening(false);
      setStaffInitialsOralCareEvening("");
      // Oral Care Morning
      setRequiresNoAssistanceOralCareMorning(false);
      setSomeAssistanceNeededOralCareMorning(false);
      setCompleteAssistanceNeededOralCareMorning(false);
      setNotApplicableOralCareMorning(false);
      setRefusedOralCareMorning(false);
      setStaffInitialsOralCareMorning("");
      // Lunch
      setRequiresNoAssistanceLunch(false);
      setSomeAssistanceNeededLunch(false);
      setCompleteAssistanceNeededLunch(false);
      setNotApplicableLunch(false);
      setRefusedLunch(false);
      setStaffInitialsLunch("");
      // Breakfast
      setRequiresNoAssistanceBreakfast(false);
      setSomeAssistanceNeededBreakfast(false);
      setCompleteAssistanceNeededBreakfast(false);
      setNotApplicableBreakfast(false);
      setRefusedBreakfast(false);
      setStaffInitialsBreakfast("");
      // Dinner
      setRequiresNoAssistanceDinner(false);
      setSomeAssistanceNeededDinner(false);
      setCompleteAssistanceNeededDinner(false);
      setNotApplicableDinner(false);
      setRefusedDinner(false);
      setStaffInitialsDinner("");
      // Am Snack
      setRequiresNoAssistanceAMSnack(false);
      setSomeAssistanceNeededAMSnack(false);
      setCompleteAssistanceNeededAMSnack(false);
      setNotApplicableAMSnack(false);
      setRefusedAMSnack(false);
      setStaffInitialsAMSnack("");
      //  Pm Snack
      setRequiresNoAssistancePMSnack(false);
      setSomeAssistanceNeededPMSnack(false);
      setCompleteAssistanceNeededPMSnack(false);
      setNotApplicablePMSnack(false);
      setRefusedPMSnack(false);
      setStaffInitialsPMSnack("");
      // Am Bowl Movement
      setRequiresNoAssistanceAMBowelMovement(false);
      setSomeAssistanceNeededAMBowelMovement(false);
      setCompleteAssistanceNeededAMBowelMovement(false);
      setNotApplicableAMBowelMovement(false);
      setRefusedAMBowelMovement(false);
      setStaffInitialsAMBowelMovement("");
      // Pm Bowl Movement
      setRequiresNoAssistancePMBowelMovement(false);
      setSomeAssistanceNeededPMBowelMovement(false);
      setCompleteAssistanceNeededPMBowelMovement(false);
      setNotApplicablePMBowelMovement(false);
      setRefusedPMBowelMovement(false);
      setStaffInitialsPMBowelMovement("");
      // OverNight Bowel Movement
      setRequiresNoAssistanceOvernightBowelMovement(false);
      setSomeAssistanceNeededOvernightBowelMovement(false);
      setCompleteAssistanceNeededOvernightBowelMovement(false);
      setNotApplicableOvernightBowelMovement(false);
      setRefusedOvernightBowelMovement(false);
      setStaffInitialsOvernightBowelMovement("");
      // Hand Foot
      setRequiresNoAssistanceHandAndFootNailCare(false);
      setSomeAssistanceNeededHandAndFootNailCare(false);
      setCompleteAssistanceNeededHandAndFootNailCare(false);
      setNotApplicableHandAndFootNailCare(false);
      setRefusedHandAndFootNailCare(false);
      setStaffInitialsHandAndFootNailCare("");
      // Bed Mobility
      setRequiresNoAssistanceBedMobility(false);
      setSomeAssistanceNeededBedMobility(false);
      setCompleteAssistanceNeededBedMobility(false);
      setNotApplicableBedMobility(false);
      setRefusedBedMobility(false);
      setStaffInitialsBedMobility("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getData, patientId, profile._id]);
  const initialFormData = {
    patientId,
    date,
    saveAsDraft,
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
    signers: signers?.map((signer) => ({
      signerId: signer.value,
      name: signer.label,
      signature: "",
      dateSigned: "",
      signedTime: "",
    })),
  };
  const submitHandler = (e) => {
    e.preventDefault();
    createForRole(
      profileUser?.userType === ROLES.ADMIN,
      "admin/create-adl-tracking-form",
      "employee/createADLTrackingForm",
      initialFormData,
      { setLoading, navigate, successMsg: "Created" },
    );
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
  return (
    <>
      <AddSignature
        show={open}
        setValue={setSavedSigned}
        setDate={setDateSigned}
        setTime={setSavedTime}
      />
      <AddSignature
        show={openAdmin}
        setValue={setAdminSignature}
        setDate={setAdminDateSigned}
        setTime={setAdminSignedTime}
      />
      <NavWrapper
        title={"Activities of Daily Living Tracking Form"}
        isArrow={true}
      />
      <Container className="full-width-container mb-5">
        <Form className="mt-3" onSubmit={submitHandler}>
          <Row className="align-items-center">
            <Col xs={12} md={6} lg={8}>
              <PatientComponent MainPatientId={setPatientId} />
            </Col>
            <Col xs={12} md={6} lg={4}>
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
          <Row className="mt-2">
            <Col xs={12} md={12} lg={12}>
              <Table responsive bordered>
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
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Form.Label className="fw-bold">
                Staff members are to initial once ADLs is completed on each
                shift.
              </Form.Label>
            </Col>
          </Row>
          <Row className="my-2">
            <Col xs={12} md={6}>
              <Button
                type="button"
                className="theme-button"
                onClick={() =>
                  profile.userType === ROLES.ADMIN
                    ? setAdminOpen(true)
                    : setOpen(true)
                }
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
            </Col>
          </Row>
          <Row className="my-2">
            <Col xs={12} md={12}>
              <Form.Group>
                <Form.Label className="fw-bold">Signers</Form.Label>
                <MultiEmployee setValue={setSigners} value={signers} />
              </Form.Group>
            </Col>
          </Row>
          <div className="employee-btn-joiner mt-5">
            <button
              className="draft"
              type="submit"
              onClick={() => setSaveAsDraft(true)}
            >
              Save as Draft
            </button>

            <button
              className="employee_create_btn"
              type="submit"
              disabled={
                profileUser.userType === ROLES.ADMIN
                  ? false
                  : savedSigned?.length === 0
              }
            >
              {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
            </button>
          </div>
        </Form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: CreateDTF,
});
