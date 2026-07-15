/** @format */

import React, { useEffect, useState } from "react";
import "@/features/shared/features/clinical/vitals/Vitals.css";
import { Container, Card, Row, Col } from "react-bootstrap";
import Loader from "@/features/shared/ui/Loader/Loader";
import HOC from "@/features/shared/layout/Inner/HOC";
import { vitalsService } from "@/features/shared/services/index";
import CreateNav from "@/utils/CreateNav";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { format } from "date-fns";

import { ROLES } from "@/features/shared/constants/index";
import { resolveVitalAssetPath } from "@/assets";

const VitalsList = () => {
  const [id, setId] = useState("");
  const [data, setData] = useState({});
  const [type, setType] = useState("today");
  const [loading, setLoading] = useState(false);
  const profileUser = useSelector(userProfile);
  const formattedDate = format(new Date(), "MM/dd/yyyy");
  const fetchVitals = () => {
    vitalsService.getByPatient({
      patientId: id,
      forFilter: type,
      date: formattedDate,
      isAdmin: profileUser?.userType === ROLES.ADMIN,
      setResponse: setData,
      setLoading,
    });
  };

  useEffect(() => {
    if (id) {
      fetchVitals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  const item = data?.data?.[0];

  return (
    <>
      <CreateNav title={"Resident Vitals"} link={"/create-vital"} />

      <Container>
        <Row className="mb-2">
          <Col xs={12}>
            <PatientComponent MainPatientId={setId} />
          </Col>
        </Row>
        <Card body className="mb-3">
          <Row>
            <Col xs={12}>
              <div className="date_filter_text">
                <ul>
                  <li
                    className={`${type === "today" && "active"}`}
                    onClick={() => setType("today")}
                  >
                    Today
                  </li>

                  <li
                    className={`${type === "week" && "active"}`}
                    onClick={() => setType("week")}
                  >
                    Last Week
                  </li>
                  <li
                    className={`${type === "month" && "active"}`}
                    onClick={() => setType("month")}
                  >
                    Last month
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {loading ? (
                <Loader />
              ) : (
                item && (
                  <React.Fragment>
                    <Row>
                      <Col xs={12} sm={6} md={6} lg={3} xl={2}>
                        <Card body className="mb-3">
                          <div className="vital-card text-center">
                            <img
                              src={resolveVitalAssetPath(
                                "/Dashboard2/Vitals/thermameter.png",
                              )}
                              alt=""
                            />
                            <h6 className="mt-2">Body Temp</h6>
                            <h5 className="mb-0">{item?.bodyTemperature} °F</h5>
                          </div>
                        </Card>
                      </Col>
                      <Col xs={12} sm={6} md={6} lg={3} xl={2}>
                        <Card body className="mb-3">
                          <div className="vital-card text-center">
                            <img
                              src={resolveVitalAssetPath(
                                "/Dashboard2/Vitals/heart.png",
                              )}
                              alt=""
                            />
                            <h6 className="mt-2">Pulse Rate</h6>
                            <h5 className="mb-0">{item?.pulseRate} bpm</h5>
                          </div>
                        </Card>
                      </Col>
                      <Col xs={12} sm={6} md={6} lg={3} xl={2}>
                        <Card body className="mb-3">
                          <div className="vital-card text-center">
                            <img
                              src={resolveVitalAssetPath(
                                "/Dashboard2/Vitals/lungs.png",
                              )}
                              alt=""
                            />
                            <h6 className="mt-2">Respiration Rate</h6>
                            <h5 className="mb-0">{item?.respirationRate}</h5>
                          </div>
                        </Card>
                      </Col>
                      <Col xs={12} sm={6} md={6} lg={3} xl={2}>
                        <Card body className="mb-3">
                          <div className="vital-card text-center">
                            <img
                              src={resolveVitalAssetPath(
                                "/Dashboard2/Vitals/hand.png",
                              )}
                              alt=""
                            />
                            <h6 className="mt-2">
                              Blood Pressure Systolic/Diastolic
                            </h6>
                            <h5 className="mb-0">{item?.bloodPressure} mmHg</h5>
                          </div>
                        </Card>
                      </Col>
                      <Col xs={12} sm={6} md={6} lg={3} xl={2}>
                        <Card body className="mb-3">
                          <div className="vital-card text-center">
                            <img
                              src={resolveVitalAssetPath(
                                "/Dashboard2/Vitals/o2.png",
                              )}
                              alt=""
                            />
                            <h6 className="mt-2">Blood Oxygen</h6>
                            <h5 className="mb-0">{item?.bloodOxygen} %</h5>
                          </div>
                        </Card>
                      </Col>
                      <Col xs={12} sm={6} md={6} lg={3} xl={2}>
                        <Card body className="mb-3">
                          <div className="vital-card text-center">
                            <img
                              src={resolveVitalAssetPath(
                                "/Dashboard2/Vitals/clock.png",
                              )}
                              alt=""
                            />
                            <h6 className="mt-2">Weight</h6>
                            <h5 className="mb-0">{item?.weight} lbs</h5>
                          </div>
                        </Card>
                      </Col>
                      <Col xs={12} sm={6} md={6} lg={3} xl={2}>
                        <Card body className="mb-3">
                          <div className="vital-card text-center">
                            <img
                              src={resolveVitalAssetPath(
                                "/Dashboard2/Vitals/hieght.png",
                              )}
                              alt=""
                            />
                            <h6 className="mt-2">Height</h6>
                            <h5 className="mb-0">{item?.height} Ft/inch</h5>
                          </div>
                        </Card>
                      </Col>
                      <Col xs={12} sm={6} md={6} lg={3} xl={2}>
                        <Card body className="mb-3">
                          <div className="vital-card text-center">
                            <img
                              src={resolveVitalAssetPath(
                                "/Dashboard2/Vitals/last.png",
                              )}
                              alt=""
                            />
                            <h6 className="mt-2">Blood Glucose Level</h6>
                            <h5 className="mb-0">
                              {item?.bloodGlucoseLevel} mm/dl
                            </h5>
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </React.Fragment>
                )
              )}
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
};

export default HOC({ Wcomponenet: VitalsList });
