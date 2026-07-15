/** @format */

import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { getData } from "@/features/shared/services";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { employmentService } from "@/features/shared/services";
import "./FW9.css";
import { useNavigate, useParams } from "react-router-dom";
import { handleKeyDownResidentStrength } from "@/utils/Makers";
import CreatableSelect from "react-select/creatable";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";

import { ROLES } from "@/features/shared/constants";

const FW9 = () => {
  const navigate = useNavigate();
  const { employeeId, id } = useParams();
  const isAdmin = useSelector(userProfile)?.userType === ROLES.ADMIN;

  const [type, setType] = useState({});
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);

  const fd = new FormData();
  fd.append("type", type.value);
  fd.append("image", file);

  const submitHandler = (e) => {
    e.preventDefault();
    employmentService.createFw9(fd, { employeeId, setLoading, navigate });
  };

  const updateHandler = (e) => {
    const fd = new FormData();
    fd.append("type", type.value);
    fd.append("image", file);
    e.preventDefault();
    employmentService.fw9.update({
      id,
      payload: fd,
      isAdmin,
      setLoading,
      navigate,
    });
  };

  const options = [
    {
      value: "fw9",
      label: "fw9",
    },
  ];

  const [data, setData] = useState({});

  const fetchHandler = () => {
    getData(
      setData,
      employeeId ? `admin/getFw9/${employeeId}` : "employee/getFw9",
    );
  };

  useEffect(() => {
    if (id) {
      setType({
        value: "fw9",
        label: "fw9",
      });
    }
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <NavWrapper title={"Fw9"} isArrow={true} />
      <Container>
        <Form onSubmit={id ? updateHandler : submitHandler}>
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
            {data?.data?.document && (
              <Row>
                <Col xs={12}>
                  <Form.Label className="fw-bold">
                    Preview previous uploaded document
                    <a
                      href={data?.data?.document}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {" Document"}
                    </a>{" "}
                  </Form.Label>
                </Col>
              </Row>
            )}
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
