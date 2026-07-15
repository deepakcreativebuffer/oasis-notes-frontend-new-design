import React, { useEffect, useState } from "react";
import { Form, Container, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import EmploymentHistoryForm from "./EmploymentHistoryForm";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { useNavigateWithParams } from "@shared/hooks";
import {
  createEmployeeHistory,
  updateEmployeeHistory,
  getEmployeeHistory,
} from "@/features/shared/services";
import { showNotification, logger } from "@/utils";
const EmploymentHistory = () => {
  const { navigateWithParams } = useNavigateWithParams();
  const navigate = useNavigate();
  const ProfileDetails = useSelector(userProfile);
  const { employeId } = useParams();
  const [loading, setLoading] = useState(false);
  const fetchHandler = async () => {
    try {
      const result = await getEmployeeHistory(
        ProfileDetails?.userType,
        employeId,
      );
      if (!result.success) {
        showNotification(result);
        return;
      }
      const data = result.data?.previousCompany || result.data || [];
      setExperiences(data);
    } catch (error) {
      showNotification({
        message: error.message || "Failed to load employment history.",
        type: "danger",
      });
      logger.error("Failed to fetch employment history", error);
    }
  };
  useEffect(() => {
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [experiences, setExperiences] = useState([
    {
      employeeName: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      supervisorNameAndTitle: "",
      from: "",
      to: "",
      fromSalary: "",
      toSalary: "",
      jobTitle: "",
      dutiesPerformed: "",
      reasonForLeaving: "",
      mayContactWithEmployee: "",
    },
  ]);
  const handleExperienceChange = (
    e,
    index,
    field,
    mayContactWithEmployeeBoolean,
  ) => {
    const updated = [...experiences];
    if (field === "from" || field === "to") {
      updated[index][field] = e; // For date fields
    } else if (field === "mayContactWithEmployee") {
      updated[index][field] = mayContactWithEmployeeBoolean; // Handle checkbox as boolean
    } else {
      updated[index][field] = e.target.value; // For text inputs
    }
    setExperiences(updated);
  };
  const addExperience = () => {
    const lastExperience = experiences[experiences.length - 1] || {}; // Get the last experience or an empty object
    setExperiences([
      ...experiences,
      {
        ...lastExperience,
      }, // Clone the last experience
    ]);
  };
  const removeExperience = (index) => {
    const updated = experiences.filter((_, i) => i !== index);
    setExperiences(updated);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const sanitizedExperiences = experiences.map((exp) => ({
      ...exp,
      mayContactWithEmployee: exp.mayContactWithEmployee || false,
    }));
    setLoading(true);
    try {
      const result = await createEmployeeHistory({
        previousCompany: sanitizedExperiences,
      });
      if (!result.success) {
        showNotification(result);
        setLoading(false);
        return;
      }
      showNotification({
        message: result.message || "Experiences saved successfully.",
      });
      setLoading(false);
      navigateWithParams("/other-information");
    } catch (e) {
      setLoading(false);
      showNotification({
        message: e.message || "Failed to save experience.",
        type: "danger",
      });
      logger.error("Failed to add employee history", e);
    }
  };
  const updateSubmitHandle = async (e) => {
    e.preventDefault();
    const sanitizedExperiences = experiences.map((exp) => ({
      ...exp,
      mayContactWithEmployee: exp.mayContactWithEmployee || false,
    }));
    setLoading(true);
    try {
      const result = await updateEmployeeHistory(employeId, {
        previousCompany: sanitizedExperiences,
      });
      if (!result.success) {
        showNotification(result);
        setLoading(false);
        return;
      }
      showNotification({
        message: result.message || "Experiences updated successfully.",
      });
      setLoading(false);
      navigate(`/other-information/${employeId}`);
    } catch (e) {
      setLoading(false);
      showNotification({
        message: e.message || "Failed to update experience.",
        type: "danger",
      });
      logger.error("Failed to update employee history", e);
    }
  };
  return (
    <>
      <NavWrapper
        title={"Employemant History"}
        isArrow={true}
        filled={3}
        empty={2}
      />

      <Container className="full-width-container">
        <Form
          className="employee1"
          onSubmit={employeId ? updateSubmitHandle : submitHandler}
        >
          <Form.Label className="fw-bold">
            Please list your work experience in the past five (5) years,
            beginning with the most recent job held. If you were self-employed,
            give firm name. Attach additional sheets if necessary. Please do not
            write “see resume”.
          </Form.Label>

          {experiences.map((data, index) => (
            <EmploymentHistoryForm
              key={index}
              data={data}
              index={index}
              handleChange={handleExperienceChange}
              onRemove={() => removeExperience(index)}
            />
          ))}
          <Button
            variant="primary"
            size="sm"
            type="button"
            onClick={addExperience}
          >
            Add More Experience
          </Button>

          <div className="employee_btn_div view_btn">
            <button className="employee_create_btn" type="submit">
              {loading ? <ClipLoader color="#fff" /> : "NEXT"}
            </button>
          </div>
        </Form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: EmploymentHistory,
});
