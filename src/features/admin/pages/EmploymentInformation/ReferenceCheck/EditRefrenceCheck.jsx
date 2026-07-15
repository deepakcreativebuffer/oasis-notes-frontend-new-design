/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Card,
  Table,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { employmentService } from "@/features/shared/services";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import Loader from "@/features/shared/ui/Loader/Loader";
import DatePicker from "react-datepicker";
import { ROLES } from "@/features/shared/constants";
const EditRefrenceCheck = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const { id } = useParams();
  const navigate = useNavigate();
  const [openSigner, setOpenSigner] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState({});
  const [signers, setSigners] = useState([]);
  const [referenceName, setRefrenceName] = useState("");
  const [referenceRecommendation, setReferenceRecommendation] = useState("");
  const [date, setDate] = useState("");
  const [savedSigned, setSavedSigned] = useState("");
  const [signDate, setSignDate] = useState("");
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [employeeSignDate, setEmployeeSignDate] = useState("");
  const [multipleTable, setMultipleTable] = useState([]);
  useEffect(() => {
    if (id) {
      employmentService.referenceCheck.getById(id, {
        setResponse: setDetail,
        setLoading,
      });
    }
  }, [id]);
  useEffect(() => {
    if (detail) {
      setEmployeeSignature(detail?.data?.employeeSignature);
      setEmployeeSignDate(detail?.data?.employeeSignDate);
      setMultipleTable(detail?.data?.data);
      setSigners(detail?.data?.signers);
    }
  }, [detail, loading]);
  const table = {
    referenceName,
    referenceRecommendation,
    date,
    savedSigned,
    signDate,
  };
  const addTable = async () => {
    setMultipleTable((prev) => [...prev, table]);
    setRefrenceName("");
    setReferenceRecommendation("");
    setDate("");
  };
  const removeOne = async (e, index) => {
    e.preventDefault();
    setMultipleTable((prev) => prev.filter((_, i) => i !== index));
  };
  const submitHandle = async (e) => {
    let apiPayload = {
      signers,
    };
    if (profileInfo?.userType === ROLES.ADMIN) {
      apiPayload = {
        data: multipleTable,
        signers,
      };
    } else {
      apiPayload = {
        employeeSignature,
        employeeSignDate,
        signers,
      };
    }
    e.preventDefault();
    employmentService.referenceCheck.update(id, apiPayload, {
      setLoading,
      navigate,
    });
  };
  let signerIndex = signers?.findIndex?.(
    (signer, i) => signer.signerId === profileInfo._id,
  );
  if (signerIndex === undefined || signerIndex === null) signerIndex = -1;
  function setSignerSignature(sign) {
    if (signerIndex !== -1)
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          signature: sign,
        };
        return newSigners;
      });
  }
  function setSignerDate(date) {
    if (signerIndex !== -1) {
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          dateSigned: date,
        };
        return newSigners;
      });
    }
  }
  const editSignHandler = (sign) => {
    if (
      signers?.[signerIndex]?.signerId === profileInfo?._id ||
      profileInfo?.patientsAssigned?.includes(signers?.[signerIndex]?.signerId)
    ) {
      setSignerSignature(sign);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setEmployeeSignature(sign);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setSavedSigned(sign);
    }
  };
  const editDateHandler = (date) => {
    if (
      signers?.[signerIndex]?.signerId === profileInfo?._id ||
      profileInfo?.patientsAssigned?.includes(signers?.[signerIndex]?.signerId)
    ) {
      setSignerDate(date);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setEmployeeSignDate(date);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setSignDate(date);
    }
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <AddSignature
            show={openSigner}
            setValue={(sign) =>
              detail?.data?.employeeId === profileInfo?._id
                ? setEmployeeSignature(sign)
                : editSignHandler(sign)
            }
            setDate={(date) =>
              detail?.data?.employeeId === profileInfo?._id
                ? setEmployeeSignDate(date)
                : editDateHandler(date)
            }
          />
          <NavWrapper
            title={"Reference Check and Recommendation"}
            isArrow={true}
          />

          <Container>
            <Form onSubmit={submitHandle}>
              <Form.Label className="fw-bold w--100 text-center">
                Good faith recommendation from references to include a former
                employer.
              </Form.Label>
              {profileInfo?.userType === ROLES.ADMIN && (
                <>
                  <Card body className="mb-3">
                    <Row>
                      <Col xs={12} md={6} lg={6}>
                        <Form.Group className="mb-3 d-flex flex-column">
                          <Form.Label className="fw-bold">
                            Date of Contact
                          </Form.Label>
                          <DatePicker
                            selected={formatDateToMMDDYYYY(date)}
                            onChange={(selectedDate) =>
                              setDate(selectedDate?.toDateString())
                            }
                            dateFormat="MM/dd/yyyy"
                            placeholderText="MM/DD/YYYY"
                            className="form-control"
                            highlightDates={[
                              {
                                "react-datepicker__day--highlighted-custom": [
                                  date
                                    ? formatDateToMMDDYYYY(date)
                                    : new Date(),
                                ],
                              },
                            ]}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={6} lg={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            Reference Name
                          </Form.Label>
                          <Form.Control
                            onChange={(e) => setRefrenceName(e.target.value)}
                            placeholder=""
                            type={"text"}
                            value={referenceName}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={12} lg={12}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            Reference Recommendation
                          </Form.Label>
                          <Form.Control
                            onChange={(e) =>
                              setReferenceRecommendation(e.target.value)
                            }
                            placeholder=""
                            type={"text"}
                            value={referenceRecommendation}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} lg={6}>
                        <div>
                          <Button
                            type="button"
                            className="theme-button"
                            onClick={() => setOpenAdmin(true)}
                          >
                            SAVED AND SIGNED
                          </Button>
                        </div>
                      </Col>
                      <Col xs={12} lg={6}>
                        {signatureFormat({
                          sign: savedSigned,
                          date: signDate,
                          hoursFormat,
                        })}
                      </Col>
                    </Row>
                  </Card>
                  <Row className="mb-3 text-center">
                    <Col xs={12}>
                      <Button
                        className="theme-button"
                        onClick={() => addTable()}
                        type="button"
                      >
                        Add More
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
              {multipleTable?.length > 0 && (
                <Row className="my-3">
                  <Col xs={12}>
                    <Table bordered responsive>
                      <thead>
                        <tr>
                          <th>Reference Name:</th>
                          <th>Date of Contact:</th>
                          <th>Reference Recommendation</th>
                          <th>Signature</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {multipleTable?.map((i, index) => (
                          <tr key={index}>
                            <td> {i.referenceName || "NA/NA"} </td>
                            <td> {i.referenceRecommendation || "NA/NA"} </td>
                            <td> {formatDateToMMDDYYYY(i.date)} </td>
                            <td>
                              {" "}
                              {i?.savedSigned ? (
                                <span>
                                  {" "}
                                  {signatureFormat({
                                    sign: i?.savedSigned,
                                    date: i?.signDate,
                                    hoursFormat,
                                  })}
                                </span>
                              ) : (
                                "NA/NA"
                              )}
                            </td>
                            <td>
                              <div className="icon-joiner">
                                <Link
                                  className="del-btn"
                                  onClick={(e) =>
                                    profileInfo?.userType === ROLES.ADMIN
                                      ? removeOne(e, index)
                                      : ""
                                  }
                                >
                                  <i className="fa-solid fa-trash" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              )}
              <Row>
                <Col xs={12} lg={6}>
                  <div>
                    {profileInfo?.userType !== ROLES.ADMIN && (
                      <Button
                        type="button"
                        className="theme-button"
                        onClick={() => setOpenSigner(true)}
                      >
                        SAVED AND SIGNED
                      </Button>
                    )}
                  </div>
                </Col>
                <Col xs={12} lg={6}>
                  {signatureFormat({
                    sign: employeeSignature,
                    date: employeeSignDate,
                    hoursFormat,
                  })}
                  {signers?.map(
                    (signer) =>
                      signer.signature && (
                        <Form.Label
                          className="w-100 text-end"
                          key={signer?.signerId}
                        >
                          {signatureFormat({
                            sign: signer.signature,
                            date: signer.dateSigned,
                            time: signer.signedTime,
                            hoursFormat,
                          })}
                        </Form.Label>
                      ),
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <button
                    className="employee_create_btn hidePrint"
                    type="submit"
                    disabled={signers?.[signerIndex]?.signature?.length < 0}
                  >
                    {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                  </button>
                </Col>
              </Row>
            </Form>
          </Container>
        </div>
      )}
    </>
  );
};
export default HOC({
  Wcomponenet: EditRefrenceCheck,
});
