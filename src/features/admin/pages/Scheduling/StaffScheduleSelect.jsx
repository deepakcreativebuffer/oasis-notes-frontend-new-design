import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { showNotification } from "@/utils";
import { weekDays } from "@/features/shared/constants";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { getAdminProfile } from "@/features/shared/services/index";
import { setPayPeriod } from "@/features/shared/services/index";

const StaffScheduleSelect = () => {
  const [defaultWeekDay, setDefaultWeekDay] = useState(1);
  const profile = useSelector(userProfile);

  useEffect(() => {
    try {
      getAdminProfile().then((res) => {
        setDefaultWeekDay(
          res?.data?.payPeriodStart || profile?.payPeriodStart || 1,
        );
      });
    } catch (error) {
      setDefaultWeekDay(profile?.payPeriodStart || 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleSelectPayChange = async (e) => {
    setDefaultWeekDay(e.target.value);
    const result = await setPayPeriod({ payPeriodStart: e.target.value });
    if (!result.success) {
      showNotification({ message: result.message, type: "danger" });
    }
  };
  return (
    <Form.Group className="mb-3 mt-3 hidePrint">
      <Form.Label className="fw-bold">
        Choose the starting day of the week to set your pay period:
      </Form.Label>
      <Form.Select
        onChange={handleSelectPayChange}
        value={defaultWeekDay}
        defaultValue={defaultWeekDay}
      >
        {weekDays.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default StaffScheduleSelect;
