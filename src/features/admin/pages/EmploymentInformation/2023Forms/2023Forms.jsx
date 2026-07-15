/** @format */

import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { getData } from "@/features/shared/services";
import { handleKeyDownResidentStrength } from "@/utils/Makers";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import {
  employmentService,
  getObjectUrlFromDownloadUrl,
} from "@/features/shared/services";
import { useNavigate, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { ROLES } from "@/features/shared/constants";

const Forms2023 = () => {
  const isAdmin = useSelector(userProfile)?.userType === ROLES.ADMIN;
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState({});
  const [file, setFile] = useState("");
  const { employeeId, id } = useParams();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    const fd = new FormData();
    fd.append("type", type.value);
    fd.append("image", file);
    e.preventDefault();
    employmentService.forms2023.create({
      employeeId,
      payload: fd,
      setLoading,
      navigate,
    });
  };

  const updateHandler = (e) => {
    const fd = new FormData();
    fd.append("type", type.value);
    fd.append("image", file);
    e.preventDefault();
    employmentService.forms2023.update({
      id,
      payload: fd,
      isAdmin,
      setLoading,
      navigate,
    });
  };

  const options = [
    {
      value: "2023 Forms",
      label: "2023 Forms",
    },
  ];

  const [data, setData] = useState({});

  const fetchHandler = () => {
    getData(
      setData,
      employeeId ? `admin/getForms2023/${employeeId}` : "employee/getForms2023",
    );
  };

  useEffect(() => {
    if (id) {
      setType({
        value: "2023 Forms",
        label: "2023 Forms",
      });
    }
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <NavWrapper isArrow={true} title={"Forms 2023"} />

      <Container>
        <Form onSubmit={id ? updateHandler : submitHandler}>
          <Card body className="mb-3">
            <Row>
              <Col xs={12}>
                <Form.Label className="fw-bold">
                  ▶ Go to{" "}
                  <a
                    href="https://azdor.gov/business/withholding-tax"
                    target="_blank"
                    rel="noreferrer"
                  >
                    azdor.gov/business/withholding-tax
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
                      href={getObjectUrlFromDownloadUrl(data?.data?.document)}
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
export default HOC({ Wcomponenet: Forms2023 });
