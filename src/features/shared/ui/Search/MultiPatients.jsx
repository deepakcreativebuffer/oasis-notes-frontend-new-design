import React, { useEffect, useState, useMemo, useCallback } from "react";
import { employeeService, patientService } from "../../services";
import { debouncedSetQuery, fetchPaitentName } from "@/utils/utils";
import { MultiSelect } from "@/utils/Makers";

import { ROLES } from "../../constants";

const MultiPatients = React.memo(
  ({
    setValue,
    value,
    isClinical = false,
    url,
    facilityId,
    isfaciliated,
    checkTemp,
    setTemp,
    isMulti = true,
  }) => {
    const [data, setData] = useState({});
    const [search, setSearch] = useState("");

    const QuerySetter = useCallback(async (term) => {
      await debouncedSetQuery({ term, setQuery: setSearch });
    }, []);

    useEffect(() => {
      if (isfaciliated) {
        employeeService.listUsers({
          queryString: `facilityId=${facilityId}&view=list&isActive=true`,
          setResponse: setData,
        });
      } else if (isClinical) {
        employeeService.getEmployee({
          setResponse: setData,
        });
      } else {
        patientService.listForSearch({
          setResponse: setData,
        });
      }
    }, [isfaciliated, isClinical, search, facilityId]);

    const normalizePatients = useCallback(() => {
      if (!data?.data) return [];

      if (isfaciliated) {
        return Array.isArray(data.data) ? data.data : [];
      }

      if (isClinical) {
        return (Array.isArray(data.data) ? data.data : []).filter(
          (i) => i?.userType === ROLES.EMPLOYEE,
        );
      }

      return data.data.docs || [];
    }, [data?.data, isfaciliated, isClinical]);

    const patientArray = normalizePatients();

    const options = useMemo(() => {
      if (isfaciliated && (!facilityId || facilityId.length === 0)) {
        return [];
      }
      return (
        patientArray?.map((i) => ({
          value: i._id,
          label: fetchPaitentName(i),
          accessId: i.ahcccsId,
          diagnosis: i.diagnosis,
          address: i.address || i.physicalAddress || i.currentAddress || "",
          facilityAddress:
            i.facilityAddress ||
            i.facilityId?.location ||
            i.facilityId?.address ||
            i.facility?.location ||
            i.facility?.address ||
            i.assignedFacilityId?.location ||
            i.location ||
            "",
          facilityId:
            i.facilityId?._id ||
            i.facilityId ||
            i.facility?._id ||
            i.facility ||
            i.assignedFacilityId?._id ||
            i.assignedFacilityId ||
            "",
        })) || []
      );
    }, [patientArray, isfaciliated, facilityId]);

    useEffect(() => {
      if (isfaciliated && facilityId?.length > 0 && options.length > 0) {
        const newValues = options.map((opt) => ({
          value: opt.value,
          label: opt.label,
          accessId: opt.accessId,
          diagnosis: opt.diagnosis,
          address: opt.address,
          facilityAddress: opt.facilityAddress,
          facilityId: opt.facilityId,
        }));

        const areArraysEqual = (arr1, arr2) =>
          arr1?.length === arr2?.length &&
          arr1?.every((item, idx) => item.value === arr2[idx]?.value);

        if (!value || value.length === 0) {
          if (checkTemp !== true) {
            if (!areArraysEqual(value, newValues)) {
              setValue(newValues);
            }
          }
          return;
        }

        const isFacilityChanged = !value.every((v) =>
          newValues.some((nv) => nv.value === v.value),
        );

        if (isFacilityChanged) {
          if (!areArraysEqual(value, newValues)) {
            setValue(newValues);
          }
          return;
        }

        if (value.length > 0) {
          const filtered = value.filter((v) =>
            newValues.some((nv) => nv.value === v.value),
          );

          if (!areArraysEqual(value, filtered)) {
            setValue(filtered);
          }
        }
      }
    }, [facilityId, options, isfaciliated, value, checkTemp, setValue]);

    return (
      <>
        <MultiSelect
          options={options}
          setValue={setValue}
          value={value}
          overrideStrings={{
            selectSomeItems: "Select...",
            allItemsAreSelected: (value || [])
              .map((item) => item.label)
              .join(", "),
          }}
          inputValue={QuerySetter}
          setTemp={setTemp}
          isMulti={isMulti}
        />
      </>
    );
  },
);

export default MultiPatients;
