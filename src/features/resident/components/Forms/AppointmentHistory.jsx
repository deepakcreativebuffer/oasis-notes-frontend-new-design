/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import HistoryCard from "../Cards/HistoryCards";
import { NurseImg } from "@/assets/index";
import {
  getObjectUrlFromDownloadUrl,
  residentService,
} from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { Col, Container, Row } from "react-bootstrap";
import AppointmentCardViews from "./AppointmentCardView";

const AppointmentHistory = () => {
  const [appoinmentUpcoming, setAppoinmentUpcoming] = useState([]);
  const [appoinmentPast, setAppoinmentPast] = useState([]);
  const [deleteAppoinment, setDeleteAppoinment] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    residentService.getUpcomingAppointments(setAppoinmentUpcoming);
    residentService.getPastAppointments(setAppoinmentPast);
  }, []);

  const again_Call_appointment = async () => {
    await residentService.getUpcomingAppointments(setAppoinmentUpcoming);
    await residentService.getPastAppointments(setAppoinmentPast);
  };

  return (
    <>
      <AppointmentCardViews
        show={modalShow}
        onHide={() => setModalShow(false)}
        modalData={data}
      />
      <div className="booking-container mb-4">
        <NavWrapper title={"Appointment History"} isArrow={true} />
        <Container>
          <div className="form-container1 p-0 mt-4">
            <div className="SchedulingCard">
              <div className="todayappointments all-appointment-list">
                <div className="header-card-title mb-3">
                  <h5 className="mb-0 page-name fw-bold">
                    Upcoming Appointments
                  </h5>
                </div>
                <div className="default-shadow-box">
                  <Row>
                    {(appoinmentUpcoming?.data || appoinmentUpcoming)?.length >
                    0 ? (
                      (appoinmentUpcoming?.data || appoinmentUpcoming)?.map(
                        (history, index) => (
                          <Col xs={12} md={12} lg={6}>
                            <HistoryCard
                              name={history?.name}
                              data={history}
                              id={history?._id}
                              deleteAppoinment={deleteAppoinment}
                              again_Call_appointment={again_Call_appointment}
                              imageUrl={
                                history?.adminId?.profilePic
                                  ? getObjectUrlFromDownloadUrl(
                                      history?.adminId?.profilePic,
                                    )
                                  : NurseImg
                              }
                              from={history.date}
                              visit={history.reasonForVisit}
                              referenceId={history.patientId}
                              status={history?.status}
                              modelHandler={setModalShow}
                              modalData={setData}
                              address={history?.address}
                            />
                          </Col>
                        ),
                      )
                    ) : (
                      <Col xs={12} md={12} lg={12}>
                        <div className="Scheduling-card mb-3">
                          No Upcoming Appointments
                        </div>
                      </Col>
                    )}
                  </Row>
                </div>
              </div>
              <div className="tomorrowappointments all-appointment-list">
                <div className="header-card-title mb-3">
                  <h5 className="mb-0 page-name fw-bold">Past Appointments</h5>
                </div>
                <div className="default-shadow-box">
                  <Row>
                    {(appoinmentPast?.data || appoinmentPast)?.length > 0 ? (
                      (appoinmentPast?.data || appoinmentPast)?.map(
                        (history, index) => (
                          <Col xs={12} md={12} lg={6}>
                            <HistoryCard
                              name={history?.name}
                              id={history?._id}
                              data={history}
                              again_Call_appointment={again_Call_appointment}
                              imageUrl={
                                history?.adminId?.profilePic
                                  ? getObjectUrlFromDownloadUrl(
                                      history?.adminId?.profilePic,
                                    )
                                  : NurseImg
                              }
                              from={history.date}
                              visit={history.reasonForVisit}
                              referenceId={history.patientId}
                              status={history?.status}
                              deleteAppoinment={deleteAppoinment}
                              modelHandler={setModalShow}
                              modalData={setData}
                              address={history?.address}
                            />
                          </Col>
                        ),
                      )
                    ) : (
                      <Col xs={12} md={12} lg={12}>
                        <div className="Scheduling-card">
                          No Past Appointments
                        </div>
                      </Col>
                    )}
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default HOC({ Wcomponenet: AppointmentHistory });
