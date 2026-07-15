import React, { useEffect, useState } from "react";
import HistoryCard from "../Cards/HistoryCards";
import { RiDeleteBin6Fill } from "react-icons/ri";
import "./ManageAppointments.css";
import {
  getObjectUrlFromDownloadUrl,
  residentService,
} from "@/features/shared/services";
import { NurseImg } from "@/assets/index";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import Alert from "react-bootstrap/Alert";
import { Container, Row, Col } from "react-bootstrap";
import AppointmentCardViews from "./AppointmentCardView";

const ManageAppointments = () => {
  const [appoinmentPast, setAppoinmentPast] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    residentService.getUpcomingAppointments(setAppoinmentPast);
  }, []);

  const again_Call_appointment = () => {
    residentService.getUpcomingAppointments(setAppoinmentPast);
  };

  return (
    <>
      <AppointmentCardViews
        show={modalShow}
        onHide={() => setModalShow(false)}
        modalData={data}
      />
      <div className="booking-container">
        <NavWrapper title={"Manage Appointment"} isArrow={true} />

        <div className="form-container">
          <Container>
            <Alert variant="danger">
              <Alert.Heading className="d-flex gap-2 fw-bold">
                {" "}
                Cancel Appointment <RiDeleteBin6Fill className="text-red-500" />
              </Alert.Heading>
              <p className="mb-0">
                <span>Select & Mark</span> all your Upcoming Appointments you
                want to Cancel
              </p>
            </Alert>
            <Row>
              {(appoinmentPast?.data || appoinmentPast)?.map(
                (history, index) => (
                  <Col xs={12} md={12} lg={6}>
                    <HistoryCard
                      id={history?._id}
                      again_Call_appointment={again_Call_appointment}
                      name={history?.name}
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
                      data={history}
                      address={history?.address}
                    />
                  </Col>
                ),
              )}
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};

export default HOC({ Wcomponenet: ManageAppointments });
