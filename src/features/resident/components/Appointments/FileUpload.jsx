/* eslint-disable no-unused-vars */
// Appointments.js
import React, { useEffect, useState } from "react";
import "./Appointments.css";
import { residentService } from "@/features/shared/services";
import { showNotification } from "@/utils";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { Container } from "react-bootstrap";
import "../Forms/Form.css";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";

const FileUpload = () => {
  const profile = useSelector(userProfile);
  const [appoinmentUpcoming, setAppoinmentUpcoming] = useState("");
  const [appoinmentPast, setAppoinmentPast] = useState("");
  const [patientId, setPatientId] = useState("");
  const [medication, setMedication] = useState("");
  const [script, setScript] = useState("");

  const [addScript, setAddScript] = useState("");

  useEffect(() => {
    if (profile) {
      setPatientId(profile);
    }
  }, [profile]);
  useEffect(() => {
    residentService.getUpcomingAppointments(setAppoinmentUpcoming);
    residentService.getPastAppointments(setAppoinmentPast);
    residentService.getAllPatientMedication(setScript);
    residentService.getTodayMedications(setMedication);
  }, []);

  useEffect(() => {
    if (addScript) {
      showNotification({
        message: "Document Upload Successfully",
        type: "success",
      });
    }
  }, [addScript]);

  return (
    <div className="appointmentcontainer">
      <NavWrapper title={"File Upload"} isArrow={true} />
      <Container className="full-width-container dashboard-page">
        <div className="file_parent">
          <div className="p-[10px]">
            <h5>Action</h5>
            <button type="button" className="file_parent_button">
              Add Additinal Files
            </button>
          </div>
          <div>
            <h5>File Type</h5>
            <select className="w-[300px]">
              <option value="">PDF</option>
              <option value="">DOCX</option>
              <option value="">HTML </option>
              <option value="">HTM</option>
              <option value="">XLS </option>
              <option value="">XLSX</option>
              <option value="">JPG</option>
              <option value="">PNG</option>
            </select>
          </div>
          <div>
            <h5>File Name</h5>
            <input type="file" />
          </div>
        </div>

        <div className="text-right mt-4">
          <button className="px-[20px] py-[5px] border-none outline-none bg-[#1A9FB2] rounded-[2px]">
            Upload
          </button>
        </div>
      </Container>
    </div>
  );
};

export default HOC({ Wcomponenet: FileUpload });
