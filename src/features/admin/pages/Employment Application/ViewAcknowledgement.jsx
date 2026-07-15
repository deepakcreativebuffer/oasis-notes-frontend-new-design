/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { signatureFormat } from "@/utils/utils";

const ViewAcknowledgement = ({ formData }) => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [companyName, setCompanyName] = useState("");
  const [skill, setSkill] = useState("");
  const [nameOfApplicant, setNameOfApplicant] = useState("");
  const [signature, setSignature] = useState("");
  const [signdate, setSignDate] = useState("");
  const [signtime, setSignTime] = useState("");
  const companyNameFromAdmin = useSelector(userProfile)?.companyName;
  useEffect(() => {
    if (formData) {
      const item = formData;
      setCompanyName(item?.companyName);
      setSkill(item?.skill);
      setNameOfApplicant(item?.nameOfApplicant);
      setSignature(item?.signature);
      setSignDate(item?.signdate);
      setSignTime(item?.signtime);
    }
  }, [formData]);

  return (
    <>
      <Form id="form-appendix" className="w-full">
        <h6 className="fw-bold">Skills and Qualifications</h6>
        <Row>
          <Col xs={12}>
            <div className="view-details-grid my-1 my-md-2 p-3">
              <Form.Label className="mb-0">
                Summarize special skills and qualifications acquired from
                employment or other experiences that may qualify you for work
                with <span className="">{companyNameFromAdmin}</span>.
              </Form.Label>
            </div>
          </Col>
          <Col xs={12}>
            <div className="view-details-grid my-1 my-md-2 p-3">
              <p className="view-label mb-1">Skills : </p>
              <h5 className="view-value mb-0">{skill}</h5>
            </div>
          </Col>
          <Col xs={12}>
            <div className="view-details-grid my-1 my-md-2 p-3">
              <p className="mb-0 font-medium text-sm">
                By singing below, I acknowledge that all the information I have
                provided is accurate and true. I understand that, if employed,
                falsified statement on this application shall be ground to
                dismissal. I understand and agree that if employed, my
                employment will be “at will” and can be terminated with or
                without cause and with or without notice, at any time by{" "}
                {companyNameFromAdmin}. or myself. Furthermore, I authorize{" "}
                {companyNameFromAdmin} to thoroughly investigate my work,
                education and other matters related to my suitability for
                employment.
              </p>
            </div>
          </Col>
          <Col xs={12}>
            <div className="view-details-grid my-1 my-md-2 p-3">
              <p className="view-label mb-1">Name of Applicant : </p>
              <h5 className="view-value mb-0">{nameOfApplicant}</h5>
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs={12} lg={12} className="text-end">
            {signatureFormat({
              sign: signature,
              date: signdate,
              time: signtime,
              hoursFormat,
            })}
            {signatureFormat({
              sign: formData?.adminSignature,
              date: formData?.adminSigndate,
              hoursFormat,
            })}
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ViewAcknowledgement;
