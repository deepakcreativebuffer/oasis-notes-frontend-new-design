/** @format */
import React from "react";
import "@/assets/styles/Contacts.css";
import HOC from "@/features/shared/layout/Inner/HOC";
import { useEmployeeMedicationLogic } from "./EmployeeMedication/useEmployeeMedicationLogic";
import EmployeeMedicationContent from "./EmployeeMedication/EmployeeMedicationContent";

const EmployeeMedication = () => {
  const ctx = useEmployeeMedicationLogic();
  const parentCtx = {
    addContactBtn: ctx.addContactBtn,
    viewItem: ctx.viewItem,
    noteId: ctx.noteId,
    setNoteId: ctx.setNoteId,
    getAllEmployeeMedications: ctx.getAllEmployeeMedications,
    colorOption: ctx.colorOption,
    profile: ctx.profile,
    hoursFormat: ctx.hoursFormat,
    printRef: ctx.printRef,
    options: ctx.options,
  };
  return <EmployeeMedicationContent {...ctx} parentCtx={parentCtx} />;
};

export default HOC({
  Wcomponenet: EmployeeMedication,
});
