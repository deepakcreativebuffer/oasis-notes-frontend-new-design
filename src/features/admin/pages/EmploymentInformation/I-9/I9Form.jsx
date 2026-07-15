/** @format */
import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { getData } from "@/features/shared/services";
import { handleKeyDownResidentStrength } from "@/utils/Makers";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { employmentService } from "@/features/shared/services";
import { useNavigate, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { useFileUpload } from "@shared/hooks";
import { ROLES } from "@/features/shared/constants";
import { showNotification } from "@/utils";
const I9Form = () => {
  const navigate = useNavigate();
  const isAdmin = useSelector(userProfile)?.userType === ROLES.ADMIN;
  const [type, setType] = useState({});
  const fileUpload = useFileUpload();
  const [loading, setLoading] = useState(false);
  const { employeeId, id } = useParams();
  const options = [
    {
      value: "i-9",
      label: "i-9",
    },
  ];
  const [data, setData] = useState({});
  const fetchHandler = () => {
    getData(
      setData,
      employeeId ? `admin/getI9/${employeeId}` : "employee/getI9",
    );
  };
  useEffect(() => {
    if (id) {
      setType({
        value: "i-9",
        label: "i-9",
      });
    }
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, id]);
  const submitHandler = (e) => {
    e.preventDefault();
    if (!fileUpload.file) {
      showNotification({
        message: "Please select a file.",
        type: "danger",
      });
      return;
    }
    const fd = new FormData();
    fd.append("type", type.value);
    fd.append("image", fileUpload.file);
    employmentService.createI9(fd, { employeeId, setLoading, navigate });
  };
  const updateHandler = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("type", type.value);
    if (fileUpload.file) {
      fd.append("image", fileUpload.file);
    }
    employmentService.i9.update({
      id,
      payload: fd,
      isAdmin,
      setLoading,
      navigate,
    });
  };
  return (
    <>
      <NavWrapper title={"I-9"} isArrow={true} />
      <Container>
        <Form onSubmit={id ? updateHandler : submitHandler}>
          <Card body className="mb-3">
            <Row>
              <Col xs={12}>
                <Form.Label className="fw-bold">
                  ▶ Go to{" "}
                  <a
                    href="https://www.uscis.gov/i-9"
                    target="_blank"
                    rel="noreferrer"
                  >
                    www.uscis.gov/i-9
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
                    onChange={fileUpload.onSelectFile}
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
                    components={{
                      DropdownIndicator: null,
                    }}
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
export default HOC({
  Wcomponenet: I9Form,
});
