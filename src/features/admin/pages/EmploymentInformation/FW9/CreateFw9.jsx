/* eslint-disable no-unused-vars */
/** @format */

import React from "react";
import { useState } from "react";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { employmentService } from "@/features/shared/services";
import "./FW9.css";
import EmployeeComponent from "@/features/shared/ui/Search/EmployeeComponent";
import CreatableSelect from "react-select/creatable";
import { handleKeyDownResidentStrength } from "@/utils/Makers";

const FW9 = () => {
  const [type, setType] = useState(
    "Request for Taxpayer Identification Number and Certification",
  );
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  const fd = new FormData();
  fd.append("type", type);
  fd.append("image", file);

  const submitHandler = (e) => {
    e.preventDefault();
    employmentService.createFw9(fd, { employeeId, setLoading });
  };

  const options = [
    {
      value: "fw9",
      label: "fw9",
    },
  ];

  return (
    <>
      <NavWrapper
        title={"Request for Taxpayer Identification Number and Certification"}
        isArrow={true}
      />
      <Container>
        <Form onSubmit={submitHandler}>
          <Row className="mb-2">
            <Col xs={12}>
              <EmployeeComponent
                className={"grid-item"}
                MainPatientId={setEmployeeId}
                setWholeData={setEmployeeData}
                MainResidentName={setEmployeeName}
              />
            </Col>
          </Row>
          <Card body className="mb-3">
            <Row>
              <Col xs={12}>
                <Form.Label className="fw-bold">
                  ▶ Go to{" "}
                  <a
                    href="https://www.irs.gov/FormW9"
                    target="_blank"
                    rel="noreferrer"
                  >
                    www.irs.gov/FormW9
                  </a>{" "}
                  for instructions and the latest information.
                </Form.Label>
              </Col>
            </Row>
          </Card>
          <Card body className="mb-3">
            <Row>
              <Col xs={12} md={6} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Choose file</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Type</Form.Label>

                  <CreatableSelect
                    isMulti={false}
                    options={options}
                    onChange={(v) => setType(v)}
                    value={type}
                    components={{ DropdownIndicator: null }}
                    onKeyDown={(event) =>
                      handleKeyDownResidentStrength(
                        event,
                        options,
                        setType,
                        type,
                      )
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Row className="text-center">
            <Col xs={12}>
              <button className="employee_create_btn" type="submit">
                {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
              </button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default HOC({ Wcomponenet: FW9 });
