/* eslint-disable no-unused-vars */
/** @format */

import { useState } from "react";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import { handleKeyDownResidentStrength } from "@/utils/Makers";
import { employmentService } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import EmployeeComponent from "@/features/shared/ui/Search/EmployeeComponent";
import CreatableSelect from "react-select/creatable";

const FW4Form = () => {
  const [type, setType] = useState("Employee’s Withholding Certificate");
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
    employmentService.createFw4(fd, { employeeId, setLoading });
  };

  const options = [
    {
      value: "fw4",
      label: "fw4",
    },
  ];
  return (
    <>
      <NavWrapper title={"Employee’s Withholding Certificate"} isArrow={true} />

      <Container>
        <Form onSubmit={submitHandler}>
          <Row className="mb-2">
            <Col xs={12}>
              <EmployeeComponent
                MainPatientId={setEmployeeId}
                setWholeData={setEmployeeData}
                MainResidentName={setEmployeeName}
              />
            </Col>
          </Row>

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

export default HOC({ Wcomponenet: FW4Form });
