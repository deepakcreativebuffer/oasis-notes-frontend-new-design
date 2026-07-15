/** @format */

import { useCallback, useEffect } from "react";
import { employeeService } from "@/features/shared/services/index";
import { assessmentService } from "../servicesApi/assessment.service";

/**
 * Loads and persists Initial Assessment data via intakeService.
 */
export function useAssessmentApi({
  id,
  patientId,
  isCreateRoute,
  setGetApiData,
  setLoading,
  setUserData,
}) {
  useEffect(() => {
    if (patientId && isCreateRoute) {
      assessmentService.getById({
        patientId,
        setResponse: setGetApiData,
        setLoading,
      });
    }
  }, [patientId, isCreateRoute, setGetApiData, setLoading]);

  useEffect(() => {
    if (id) {
      assessmentService.getById({ id, setResponse: setGetApiData });
    }
    employeeService.getProfile({ setResponse: setUserData });
  }, [id, setGetApiData, setUserData]);

  const submitCreate = useCallback(
    ({ patientId: pid, payload, setLoading: setLoad, navigate }) => {
      assessmentService.create({
        patientId: pid,
        payload,
        setLoading: setLoad,
        successMsg: "Success!",
        navigate,
      });
    },
    [],
  );

  const submitUpdate = useCallback(
    ({ id: recordId, payload, setLoading: setLoad, navigate }) => {
      assessmentService.update(recordId, payload, {
        setLoading: setLoad,
        navigate,
      });
    },
    [],
  );

  return { submitCreate, submitUpdate };
}
