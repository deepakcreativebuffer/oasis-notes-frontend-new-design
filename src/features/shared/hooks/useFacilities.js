import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFacilities, selectFacilities } from "@/store/facilitySlice";
import { facilityService } from "../services";

export const useFacilities = () => {
  const dispatch = useDispatch();
  const facilities = useSelector(selectFacilities);
  useEffect(() => {
    if (!facilities || facilities.length === 0) {
      facilityService.list({
        setResponse: (response) => {
          if (response?.data) {
            dispatch(setFacilities(response.data?.data || response.data));
          }
        },
      });
    }
  }, [dispatch, facilities]);
  return facilities;
};
