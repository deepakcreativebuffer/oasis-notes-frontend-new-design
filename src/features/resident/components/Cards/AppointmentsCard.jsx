import React from "react";
import "./AppointmentsCard.css";
import {
  MdOutlineCalendarMonth,
  MdEventAvailable,
  MdOutlineAccessTime,
  MdOutlineMap,
} from "react-icons/md";
import { Card } from "react-bootstrap";

const AppointmentsCard = React.memo(({ imageUrl, date, slot, location }) => {
  return (
    <Card body className="mb-3 mb-lg-4 border-0 relative shadow-sm">
      <div className="appointment-cards-content">
        <div className="upcoming-appointment-card d-flex align-items-center py-md-2 px-md-2">
          <div className="stats-icon blue-soft me-3 flex-shirnk-0">
            <MdOutlineCalendarMonth />
          </div>
          <div className="upcoming-appointment-info">
            <p className="upcoming-appointment-title fw-bold mb-0">
              Medical Appointment
            </p>
            <div className="appointment-datetime d-inline-flex align-items-center gap-4 mt-2">
              <div className="appointment-date d-inline-flex align-items-center gap-2">
                <MdEventAvailable />
                <span className="d-inline-block">{date}</span>
              </div>
              <div className="appointment-time d-inline-flex align-items-center gap-2">
                <MdOutlineAccessTime />
                <span className="d-inline-block">{slot}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="appointment-loaction mt-3">
          <div className="appointment-map d-inline-flex align-items-center gap-2">
            <MdOutlineMap />
            <span className="fw-bold">Address:</span>
            <span className="d-inline-block">{location}</span>
          </div>
        </div>
      </div>
    </Card>
  );
});

export default AppointmentsCard;
