// Card.js
import React from "react";
import "./AppointmentsCard.css";
import { CiCircleRemove } from "react-icons/ci";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Card } from "react-bootstrap";
import {
  MdOutlineCalendarMonth,
  MdEventAvailable,
  MdOutlineNoteAlt,
  MdOutlineMap,
} from "react-icons/md";
import { residentService } from "@/features/shared/services";
import { formatDateToMMDDYYYY } from "@/utils/utils";

const HistoryCard = ({
  name,
  imageUrl,
  from,
  visit,
  referenceId,
  status = null,
  id,
  again_Call_appointment,
  deleteAppoinment,
  modelHandler,
  modalData,
  data,
  address,
}) => {
  const handleStatus = async (id) => {
    if (deleteAppoinment) {
      await residentService.deleteAppointment(id);
    } else {
      await residentService.cancelAppointment(id);
    }
    await again_Call_appointment();
  };

  return (
    <Card
      body
      className="mb-3 mb-lg-4 border-0 relative shadow-sm cursor-pointer"
      onClick={() => {
        modelHandler(true);
        modalData(data);
      }}
    >
      <div className="appointment-cards-content">
        <div className="upcoming-appointment-card d-flex align-items-center py-md-2 px-md-2">
          <div className="stats-icon blue-soft me-3 flex-shirnk-0">
            <MdOutlineCalendarMonth />
          </div>
          <div className="upcoming-appointment-info">
            <p className="upcoming-appointment-title fw-bold mb-0">{name}</p>
            <div className="appointment-datetime d-inline-flex align-items-center gap-4 mt-2">
              <div className="appointment-date d-inline-flex align-items-center gap-2">
                <MdEventAvailable />
                <span className="d-inline-block">
                  {formatDateToMMDDYYYY(from)}
                </span>
              </div>
              {status && (
                <div className="appointment-time d-inline-flex align-items-center gap-2 text-[#ff1c1c]">
                  <span className="d-inline-block">
                    <CiCircleRemove className="text-[#ff1c1c]" />
                  </span>{" "}
                  <span className="text-[#ff1c1c]">Status : {status}</span>
                </div>
              )}
            </div>
          </div>
          <RiDeleteBin6Fill
            className="delete_button text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              handleStatus(id);
            }}
          />
        </div>
        <div className="appointment-loaction w-100 border-top border-light mt-2 pt-2">
          <div className="appointment-map w-100 d-inline-flex align-items-center gap-2">
            <span className="flex-shrink-0 d-inline-flex align-items-center gap-2">
              <MdOutlineNoteAlt />
              <span className="fw-bold">Reason :</span>
            </span>
            <span className="d-inline-block text-truncate">
              {visit?.length > 50 ? `${visit.slice(0, 50)}...` : visit}
            </span>
          </div>
        </div>
        <div className="appointment-loaction w-100 border-top border-light mt-2 pt-2">
          <div className="appointment-map w-100 d-inline-flex align-items-center gap-2">
            <span className="flex-shrink-0 d-inline-flex align-items-center gap-2">
              <MdOutlineMap />
              <span className="fw-bold">Address :</span>
            </span>
            <span className="d-inline-block text-truncate">{address}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HistoryCard;
