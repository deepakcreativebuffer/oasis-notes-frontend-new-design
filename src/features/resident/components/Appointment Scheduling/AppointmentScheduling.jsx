import React, { useEffect, useState } from "react";
import "./AppointmentScheduling.css";
import AppointmentsCard from "../Cards/AppointmentsCard";
import { nurse1 } from "@/assets";
import { residentService } from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";

const AppointmentScheduling = () => {
  const [appoinmentUpcoming, setAppoinmentUpcoming] = useState([]);
  const [appoinmentPast, setAppoinmentPast] = useState([]);

  useEffect(() => {
    residentService.getUpcomingAppointments(setAppoinmentUpcoming);
    residentService.getPastAppointments(setAppoinmentPast);
  }, []);

  return (
    <div className="Appointment_Schedulingcontainer">
      <div className="appointmentcontent">
        <p>Upcoming Appointments</p>
      </div>
      <div className="SchedulingCard">
        <div className="todayappointments">
          <p>TODAY</p>
          {(appoinmentUpcoming?.data || appoinmentUpcoming)?.map(
            (appointment, index) => (
              <AppointmentsCard
                key={index}
                imageUrl={
                  appointment?.adminId?.profilePic
                    ? appointment?.adminId?.profilePic
                    : nurse1
                }
                date={new Date(appointment?.date).toLocaleDateString()}
                slot={appointment?.time}
                location={appointment?.adminId?.address}
              />
            ),
          )}
        </div>
        <div className="tomorrowappointments">
          <p>TOMORROW</p>
          {(appoinmentPast?.data || appoinmentPast)?.map(
            (appointment, index) => (
              <AppointmentsCard
                key={index}
                imageUrl={
                  appointment?.adminId?.profilePic
                    ? appointment?.adminId?.profilePic
                    : nurse1
                }
                date={new Date(appointment?.date).toLocaleDateString()}
                slot={appointment?.time}
                location={appointment?.adminId?.address}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default HOC(AppointmentScheduling);
