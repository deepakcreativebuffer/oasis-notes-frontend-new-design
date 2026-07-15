/** @format */

import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import NavWrapper from "@/utils/NavWrapper";
import {
  employmentService,
  getObjectUrlFromDownloadUrl,
} from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { handleKeyDownResidentStrength } from "@/utils/Makers";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { getData } from "@/features/shared/services";

import { ROLES } from "@/features/shared/constants";

const LRC1031 = () => {
  const isAdmin = useSelector(userProfile)?.userType === ROLES.ADMIN;
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState({});
  const [file, setFile] = useState("");
  const { employeeId, id } = useParams();
  const navigate = useNavigate();
  const fd = new FormData();
  fd.append("type", type.value);
  fd.append("image", file);

  const submitHandler = (e) => {
    e.preventDefault();
    employmentService.createLrc1031(fd, { employeeId, setLoading, navigate });
  };

  const updateHandler = (e) => {
    const fd = new FormData();
    fd.append("type", type.value);
    fd.append("image", file);
    e.preventDefault();
    employmentService.lrc1031.update({
      id,
      payload: fd,
      isAdmin,
      setLoading,
      navigate,
    });
  };

  const options = [
    {
      value: "LRC-1031A",
      label: "LRC-1031A",
    },
  ];

  const [data, setData] = useState({});

  const fetchHandler = () => {
    getData(
      setData,
      employeeId ? `admin/getLrc1031A/${employeeId}` : "employee/getLrc1031A",
    );
  };

  useEffect(() => {
    if (id) {
      setType({
        value: "LRC-1031A",
        label: "LRC-1031A",
      });
    }
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <NavWrapper title={"LRC-1031A"} isArrow={true} />
      <Container>
        <Form onSubmit={id ? updateHandler : submitHandler}>
          <Card body className="mb-3">
            <Row>
              <Col xs={12}>
                <Form.Label className="fw-bold">
                  ▶ Go to{" "}
                  <a
                    href="https://des.az.gov/digital-library/lcr-1034a"
                    target="_blank"
                    rel="noreferrer"
                  >
                    des.az.gov/digital-library/lcr-1034a
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

export default HOC({ Wcomponenet: LRC1031 });
