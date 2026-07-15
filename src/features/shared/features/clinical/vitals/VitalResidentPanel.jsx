import React, { useEffect, useState } from "react";
import "./VitalResidentPanel.css";
import {
  BloodGlucose,
  BloodOxygen,
  BloodPressure,
  BodyTemperature,
  Height,
  PulseRate,
  RespirationRate,
  Weight,
} from "@/assets";
import { residentService } from "@/features/shared/services/index";
import { Row, Col, Card } from "react-bootstrap";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";

const Vital = () => {
  const [vitalData, setVitalData] = useState([]);
  const [patientId, setPatientId] = useState("");
  const profile = useSelector(userProfile);

  useEffect(() => {
    if (profile) {
      setPatientId(profile);
    }
  }, [profile]);

  useEffect(() => {
    if (patientId) {
      residentService.vitalData(patientId, setVitalData);
    }
  }, [patientId]);

  return (
    <>
      <Row>
        <Col xs={12} md={12} lg={12}>
          <div className="header-card-title mb-3">
            <h5 className="mb-0 page-name fw-bold">Vitals</h5>
          </div>
          <Row>
            <Col xs={12} md={6} lg={3}>
              <Card body className="mb-3 mb-lg-4 border-0 relative shadow-sm">
                <div className="vitals-card">
                  <div className="vitals-card-content d-flex gap-3 align-items-center">
                    <span className="vitals-icon pulserate-bg d-inline-flex align-items-center justify-content-center">
                      <img
                        src={PulseRate}
                        alt="Icon"
                        className="vitals-icon-image"
                      />
                    </span>
                    <div className="vitals-unit">
                      <span className="vitals-unit-count d-inline-block">
                        {vitalData?.[0]?.pulseRate}
                      </span>
                      <span className="vitals-unit-result d-inline-block ms-2">
                        bpm
                      </span>
                    </div>
                  </div>
                  <h5 className="vitals-name mt-3">Pulse Rate</h5>
                </div>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card body className="mb-3 mb-lg-4 border-0 relative shadow-sm">
                <div className="vitals-card">
                  <div className="vitals-card-content d-flex gap-3 align-items-center">
                    <span className="vitals-icon bloodpressure-bg d-inline-flex align-items-center justify-content-center">
                      <img
                        src={BloodPressure}
                        alt="Icon"
                        className="vitals-icon-image"
                      />
                    </span>
                    <div className="vitals-unit">
                      <span className="vitals-unit-count d-inline-block">
                        {vitalData?.[0]?.bloodPressure}
                      </span>
                      <span className="vitals-unit-result d-inline-block ms-2">
                        mmHg
                      </span>
                    </div>
                  </div>
                  <h5 className="vitals-name mt-3">
                    Blood Pressure Systolic/Diastolic
                  </h5>
                </div>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card body className="mb-3 mb-lg-4 border-0 relative shadow-sm">
                <div className="vitals-card">
                  <div className="vitals-card-content d-flex gap-3 align-items-center">
                    <span className="vitals-icon bloodglucose-bg d-inline-flex align-items-center justify-content-center">
                      <img
                        src={BloodGlucose}
                        alt="Icon"
                        className="vitals-icon-image"
                      />
                    </span>
                    <div className="vitals-unit">
                      <span className="vitals-unit-count d-inline-block">
                        {vitalData?.[0]?.bloodGlucoseLevel}
                      </span>
                      <span className="vitals-unit-result d-inline-block ms-2">
                        mm/dl
                      </span>
                    </div>
                  </div>
                  <h5 className="vitals-name mt-3">Blood Glucose Level</h5>
                </div>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card body className="mb-3 mb-lg-4 border-0 relative shadow-sm">
                <div className="vitals-card">
                  <div className="vitals-card-content d-flex gap-3 align-items-center">
                    <span className="vitals-icon bodytemperature-bg d-inline-flex align-items-center justify-content-center">
                      <img
                        src={BodyTemperature}
                        alt="Icon"
                        className="vitals-icon-image"
                      />
                    </span>
                    <div className="vitals-unit">
                      <span className="vitals-unit-count d-inline-block">
                        {vitalData?.[0]?.bodyTemperature}
                      </span>
                      <span className="vitals-unit-result d-inline-block ms-2">
                        ° F
                      </span>
                    </div>
                  </div>
                  <h5 className="vitals-name mt-3">Body Temperature</h5>
                </div>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card body className="mb-3 mb-lg-4 border-0 relative shadow-sm">
                <div className="vitals-card">
                  <div className="vitals-card-content d-flex gap-3 align-items-center">
                    <span className="vitals-icon respirationrate-bg d-inline-flex align-items-center justify-content-center">
                      <img
                        src={RespirationRate}
                        alt="Icon"
                        className="vitals-icon-image"
                      />
                    </span>
                    <div className="vitals-unit">
                      <span className="vitals-unit-count d-inline-block">
                        {vitalData?.[0]?.respirationRate}
                      </span>
                      <span className="vitals-unit-result d-inline-block ms-2">
                        bpm
                      </span>
                    </div>
                  </div>
                  <h5 className="vitals-name mt-3">Respiration Rate</h5>
                </div>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card body className="mb-3 mb-lg-4 border-0 relative shadow-sm">
                <div className="vitals-card">
                  <div className="vitals-card-content d-flex gap-3 align-items-center">
                    <span className="vitals-icon bloodoxygen-bg d-inline-flex align-items-center justify-content-center">
                      <img
                        src={BloodOxygen}
                        alt="Icon"
                        className="vitals-icon-image"
                      />
                    </span>
                    <div className="vitals-unit">
                      <span className="vitals-unit-count d-inline-block">
                        {vitalData?.[0]?.bloodOxygen}
                      </span>
                      <span className="vitals-unit-result d-inline-block ms-2">
                        %
                      </span>
                    </div>
                  </div>
                  <h5 className="vitals-name mt-3">Blood Oxygen</h5>
                </div>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card body className="mb-3 mb-lg-4 border-0 relative shadow-sm">
                <div className="vitals-card">
                  <div className="vitals-card-content d-flex gap-3 align-items-center">
                    <span className="vitals-icon weight-bg d-inline-flex align-items-center justify-content-center">
                      <img
                        src={Weight}
                        alt="Icon"
                        className="vitals-icon-image"
                      />
                    </span>
                    <div className="vitals-unit">
                      <span className="vitals-unit-count d-inline-block">
                        {vitalData?.[0]?.weight}
                      </span>
                      <span className="vitals-unit-result d-inline-block ms-2">
                        lbs
                      </span>
                    </div>
                  </div>
                  <h5 className="vitals-name mt-3">Weight</h5>
                </div>
              </Card>
            </Col>
            <Col xs={12} md={6} lg={3}>
              <Card body className="mb-3 mb-lg-4 border-0 relative shadow-sm">
                <div className="vitals-card">
                  <div className="vitals-card-content d-flex gap-3 align-items-center">
                    <span className="vitals-icon height-bg d-inline-flex align-items-center justify-content-center">
                      <img
                        src={Height}
                        alt="Icon"
                        className="vitals-icon-image"
                      />
                    </span>
                    <div className="vitals-unit">
                      <span className="vitals-unit-count d-inline-block">
                        {vitalData?.[0]?.height}
                      </span>
                      <span className="vitals-unit-result d-inline-block ms-2">
                        ft/inch
                      </span>
                    </div>
                  </div>
                  <h5 className="vitals-name mt-3">Height</h5>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Vital;
