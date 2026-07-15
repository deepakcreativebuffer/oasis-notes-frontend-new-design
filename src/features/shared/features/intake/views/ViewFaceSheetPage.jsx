/** @format */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import HOC from "@/features/shared/layout/Outer/HOC";
import { intakeService } from "@/features/shared/services/index";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { Container, Row, Col, Form, Table } from "react-bootstrap";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
const ViewFaceSheet = () => {
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [getApiData, setGetApiData] = useState({});
  const { id } = useParams();
  const printRef = React.useRef(null);
  useEffect(() => {
    intakeService.getFaceSheet({ id, setResponse: setGetApiData });
  }, [id]);
  const LableText = ({ label, value }) => {
    return (
      <>
        {" "}
        <p className="view-label mb-1">{label + " : "} </p>{" "}
        <h5 className="view-value mb-0">{value}</h5>{" "}
      </>
    );
  };
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        getApiData?.data?.patientId || getApiData?.patientId,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      getApiData?.data?.patientId || getApiData?.patientId,
      profile,
    ),
    pageStyle: `
      @page {
        margin: 12mm 9mm!important;
        size: portrait !important;
      } 
      .card {
        page-break-inside: avoid;
      }
    `,
  });
  const handlePrint2 = () => {
    // downloadReport(handlePrint);
    handlePrint();
  };
  const navigate = useNavigate();
  function emptyChecker(value) {
    return !value
      ? "view-details-grid view-details-grid-inline my-1 my-md-2 p-3 hidePrint"
      : "view-details-grid view-details-grid-inline my-1 my-md-2 p-3";
  }
  function emptyCheckerObjectValues(value) {
    if (value) {
      const arr = Object.values(value);
      let count = 0;
      for (let x of arr) {
        if (x) {
          count += 1;
        }
        if (count === 2) break;
      }
      return count === 2 ? "" : "hidePrint";
    }
  }
  const print = usePrint(printRef, handlePrint2);
  const renderDiagnoses = (title, arr) => {
    let displayArr = arr;
    if (!displayArr || !Array.isArray(displayArr) || displayArr.length === 0) {
      displayArr = [
        { name: "Primary", icdCode: "", description: "" },
        { name: "Secondary", icdCode: "", description: "" },
        { name: "Tertiary", icdCode: "", description: "" },
        { name: "Additional", icdCode: "", description: "" },
        {
          name: "Other",
          isOther: true,
          otherName: "",
          icdCode: "",
          description: "",
        },
      ];
    }

    return (
      <Table bordered className="mb-0">
        <thead>
          <tr>
            <th>{title}</th>
            <th>ICD Code</th>
            <th className="w-50">Description</th>
          </tr>
        </thead>
        <tbody>
          {displayArr.map((diag, i) => {
            const isOther = diag.name === "Other" && diag.isOther;
            return (
              <tr key={i}>
                <td>
                  {isOther ? (
                    <div className="d-flex align-items-center">
                      <span className="me-2">
                        Other: {diag.otherName || ""}
                      </span>
                    </div>
                  ) : (
                    <span className="me-2">
                      {diag.name}
                      {diag.name === "Primary" ? "*" : ""}
                    </span>
                  )}
                </td>
                <td>{diag.icdCode || "-"}</td>
                <td>{diag.description || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  const extractString = (val, key) => {
    if (typeof val === "string") return val;
    if (Array.isArray(val)) return val[0]?.[key] || "";
    if (val && typeof val === "object") return val[key] || "";
    return "";
  };

  const pcpName = extractString(
    getApiData?.data?.patientId?.primaryCareProvider ||
      getApiData?.data?.primaryCareProvider,
    "name",
  );
  const pcpContact = extractString(
    getApiData?.data?.patientId?.primaryCareProviderContact ||
      getApiData?.data?.primaryCareProviderContact ||
      getApiData?.data?.primaryCareProvider,
    "phone",
  );
  const pcpAddress = extractString(
    getApiData?.data?.patientId?.primaryCareProviderAddress ||
      getApiData?.data?.primaryCareProviderAddress ||
      getApiData?.data?.primaryCareProvider,
    "address",
  );

  const psychName = extractString(
    getApiData?.data?.patientId?.psychiatricProvider ||
      getApiData?.data?.psychiatricProvider,
    "name",
  );
  const psychContact = extractString(
    getApiData?.data?.patientId?.psychiatricProviderContact ||
      getApiData?.data?.psychiatricProviderContact ||
      getApiData?.data?.psychiatricProvider,
    "phone",
  );
  const psychAddress = extractString(
    getApiData?.data?.patientId?.psychiatricProviderAddress ||
      getApiData?.data?.psychiatricProviderAddress ||
      getApiData?.data?.psychiatricProvider,
    "address",
  );

  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <Container>
        <div className="page-title-bar mb-3 hidePrint">
          <Row className="align-items-center">
            <Col xs={2} lg="3">
              <div className="d-flex align-items-center">
                <img
                  onClick={() => navigate(-1)}
                  src="/back_button2.png"
                  alt=""
                  className="arrow cursor-pointer me-1 me-md-3"
                />
                <p className="m-0 fw-bold d-none d-md-inline-block">Back</p>
              </div>
            </Col>
            <Col xs={8} lg="6">
              <p className="heading mb-sm-0">Face Sheet</p>
            </Col>
            <Col xs={2} lg="3"></Col>
          </Row>
        </div>
        <div className="facesheet-print" ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden"> Face Sheet</h1>
          <Form className="form-view-facesheet">
            <div className="view-details mb-3">
              <Row>
                <Col xs={12} sm={5} md={6} lg={4} xl={4}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Resident Name : </p>
                    <h5 className="view-value mb-0">{`${getApiData?.data?.patientId?.firstName} ${getApiData?.data?.patientId?.lastName}`}</h5>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} xl={4}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Date of Birth : </p>
                    <h5 className="view-value mb-0">
                      {getApiData?.data?.patientId?.dateOfBirth &&
                        formatDateToMMDDYYYY(
                          getApiData?.data?.patientId?.dateOfBirth,
                        )}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={3} md={4} lg={4} xl={4}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Admit Date : </p>
                    <h5 className="view-value mb-0">
                      {getApiData?.data?.dateOfAdmit &&
                        formatDateToMMDDYYYY(
                          getApiData?.data?.patientId?.admitDate,
                        )}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={8} lg={12}>
                  <div
                    className={emptyChecker(
                      getApiData?.data?.patientId?.diagnosis,
                    )}
                  >
                    <p className="view-label mb-1">
                      Diagnosis (specify if new or continuing) :{" "}
                    </p>
                    <h5 className="view-value mb-0">
                      {getApiData?.data?.patientId?.diagnosis}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={4}>
                  <div
                    className={emptyChecker(getApiData?.data?.facilityAddress)}
                  >
                    <p className="view-label mb-1">Facility Address : </p>
                    <h5 className="view-value mb-0">
                      {getApiData?.data?.facilityAddress}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={4}>
                  <div
                    className={emptyChecker(
                      getApiData?.data?.facilityPhoneNumber,
                    )}
                  >
                    <p className="view-label mb-1">Facility Phone Number : </p>
                    <h5 className="view-value mb-0">
                      {getApiData?.data?.facilityPhoneNumber}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={4}>
                  <div className={emptyChecker(getApiData?.data?.placeOfBirth)}>
                    <p className="view-label mb-1">Place of Birth : </p>
                    <h5 className="view-value mb-0">
                      {getApiData?.data?.placeOfBirth}
                    </h5>
                  </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={6} xl={4}>
                  <div className={emptyChecker(getApiData?.data?.eyeColor)}>
                    <p className="view-label mb-1">Eye Color : </p>
                    <h5 className="view-value mb-0">
                      {getApiData?.data?.eyeColor}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={4}>
                  <div className={emptyChecker(getApiData?.data?.race)}>
                    <p className="view-label mb-1">Race : </p>
                    <h5 className="view-value mb-0">
                      {getApiData?.data?.race}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={4}>
                  <div className={emptyChecker(getApiData?.data?.height)}>
                    <p className="view-label mb-1">Height : </p>
                    <h5 className="view-value mb-0">
                      {getApiData?.data?.height}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={4}>
                  <div className={emptyChecker(getApiData?.data?.weight)}>
                    <p className="view-label mb-1">Weight : </p>
                    <h5 className="view-value mb-0">
                      {getApiData?.data?.weight}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={6} xl={4}>
                  <div className={emptyChecker(getApiData?.data?.hairColor)}>
                    <p className="view-label mb-1">Hair Color : </p>
                    <h5 className="view-value mb-0">
                      {getApiData?.data?.hairColor}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} xl={4}>
                  <div
                    className={emptyChecker(
                      getApiData?.data?.identifiableMarks,
                    )}
                  >
                    <p className="view-label mb-1">Identifiable Marks : </p>
                    <h5 className="view-value mb-0">
                      {getApiData?.data?.identifiableMarks}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                  <div
                    className={emptyChecker(getApiData?.data?.primaryLanguage)}
                  >
                    <p className="view-label mb-1">Primary Language : </p>
                    <h5 className="view-value mb-0">
                      {getApiData?.data?.primaryLanguage}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">
                      Court Ordered Treatment? :{" "}
                    </p>
                    <h5 className="view-value mb-0">
                      {getApiData?.data?.courtOrderedTreatment === true
                        ? "Yes"
                        : "No"}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                  <div
                    className={emptyChecker(
                      getApiData?.data?.familyGuardianEmergencyName,
                    )}
                  >
                    {LableText({
                      label:
                        " Family/Guardian Emergency Name and Contact Number",
                      value: getApiData?.data?.familyGuardianEmergencyName,
                    })}
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                  <div
                    className={emptyChecker(
                      getApiData?.data?.facilityEmergencyContact,
                    )}
                  >
                    {LableText({
                      label: "Facility Emergency Contact Number",
                      value: getApiData?.data?.facilityEmergencyContact,
                    })}
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  {(() => {
                    let yes = null;
                    let comment = "";
                    const arr = getApiData?.data?.patientId?.allergies;
                    if (arr && Array.isArray(arr) && arr.length > 0) {
                      const allergy = arr[0];
                      if (allergy) {
                        yes = allergy.yes;
                        comment = allergy.comments || "";
                      }
                    }

                    return (
                      <Table bordered className="mb-0 mt-3">
                        <thead>
                          <tr>
                            <th>Condition</th>
                            <th className="text-center">Yes</th>
                            <th className="text-center">No</th>
                            <th className="w-50">Comments</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Allergies</td>
                            <td className="text-center">
                              <Form.Check
                                type="checkbox"
                                checked={yes === true}
                                readOnly
                                disabled
                              />
                            </td>
                            <td className="text-center">
                              <Form.Check
                                type="checkbox"
                                checked={yes === false}
                                readOnly
                                disabled
                              />
                            </td>
                            <td>{comment}</td>
                          </tr>
                        </tbody>
                      </Table>
                    );
                  })()}
                </Col>
              </Row>
            </div>
            <div className={`${!pcpName && !psychName ? "hidePrint" : ""}`}>
              <Row className="mt-2">
                <Col xs={12} md={12} lg={12} xl={12}>
                  <div className={`${!pcpName ? "hidePrint" : ""}`}>
                    <div className="view-details">
                      <Row>
                        <Col xs={12} sm={12} md={4}>
                          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                            {LableText({
                              label: "Primary Care Provider Name",
                              value: pcpName,
                            })}
                          </div>
                        </Col>
                        <Col xs={12} sm={12} md={4}>
                          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                            {LableText({
                              label: "Primary Care Provider Contact",
                              value: pcpContact,
                            })}
                          </div>
                        </Col>
                        <Col xs={12} sm={12} md={4}>
                          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                            {LableText({
                              label: "Primary Care Provider Address",
                              value: pcpAddress,
                            })}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
                <Col xs={12} md={12} lg={12} xl={12}>
                  <div className={`${!psychName ? "hidePrint" : ""}`}>
                    <div className="view-details">
                      <Row>
                        <Col xs={12} sm={12} md={4}>
                          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                            {LableText({
                              label: "Psychiatric Provider Name",
                              value: psychName,
                            })}
                          </div>
                        </Col>
                        <Col xs={12} sm={12} md={4}>
                          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                            {LableText({
                              label: "Psychiatric Provider Contact",
                              value: psychContact,
                            })}
                          </div>
                        </Col>
                        <Col xs={12} sm={12} md={4}>
                          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                            {LableText({
                              label: "Psychiatric Provider Address",
                              value: psychAddress,
                            })}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <Row className="mt-2">
              {getApiData?.data?.primaryCareProviderOtherSpecialists?.length >
                0 && (
                <Col xs={12} md={12} lg={12} xl={6}>
                  <Form.Label className="fw-bold w-100">
                    Other Specialists - please specify
                  </Form.Label>
                  <div className="view-details">
                    {getApiData?.data?.primaryCareProviderOtherSpecialists?.map(
                      (item, index) => (
                        <React.Fragment key={`Primaruy${index}`}>
                          <Row>
                            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                                {LableText({
                                  label: "Name",
                                  value: item?.name,
                                })}
                              </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                                {LableText({
                                  label: "Phone Number",
                                  value: item?.phone,
                                })}
                              </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                                {LableText({
                                  label: "Address",
                                  value: item?.address,
                                })}
                              </div>
                            </Col>
                          </Row>
                        </React.Fragment>
                      ),
                    )}
                  </div>
                </Col>
              )}
              {getApiData?.data?.psychiatricProviderOtherSpecialists?.length >
                0 && (
                <Col xs={12} md={12} lg={12} xl={6}>
                  <Form.Label className="fw-bold w-100">
                    Other Specialists - please specify
                  </Form.Label>
                  <div className="view-details">
                    {getApiData?.data?.psychiatricProviderOtherSpecialists?.map(
                      (item, index) => (
                        <React.Fragment key={`Primary${index}`}>
                          <Row>
                            <Col xs={12} sm={12} md={12} lg={6}>
                              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                                {LableText({
                                  label: "Name",
                                  value: item?.name,
                                })}
                              </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={6}>
                              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                                {LableText({
                                  label: "Phone Number",
                                  value: item?.phone,
                                })}
                              </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12}>
                              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                                {LableText({
                                  label: "Address",
                                  value: item?.address,
                                })}
                              </div>
                            </Col>
                          </Row>
                        </React.Fragment>
                      ),
                    )}
                  </div>
                </Col>
              )}
            </Row>
            <Row className="mt-2">
              <Col xs={12} md={12} lg={12} xl={6}>
                <div
                  className={`${emptyCheckerObjectValues(getApiData?.data?.primaryCareProvider?.[0])}`}
                >
                  <div className="view-details">
                    {getApiData?.data?.primaryCareProvider?.map(
                      (item, index) => (
                        <React.Fragment key={`Primaruy${index}`}>
                          <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                                {LableText({
                                  label: "Preferred Hospital",
                                  value: item?.preferredHospitalAddress,
                                })}
                              </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                                {LableText({
                                  label: "Preferred Hospital Name",
                                  value: item?.preferredHospitalName,
                                })}
                              </div>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                                {LableText({
                                  label: "Preferred Hospital Phone Number",
                                  value: item?.preferredHospitalPhone,
                                })}
                              </div>
                            </Col>
                          </Row>
                        </React.Fragment>
                      ),
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <div className="view-details mb-2">
              <Row>
                <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                  <div
                    className={`${!getApiData?.data?.healthPlan && "hidePrint"}
                    view-details-grid view-details-grid-inline my-1 my-md-2 p-3`}
                  >
                    {LableText({
                      label: "Health Plan",
                      value: getApiData?.data?.healthPlan,
                    })}
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                  <div
                    className={`${!getApiData?.data?.healthPlanId && "hidePrint"}
                    view-details-grid view-details-grid-inline my-1 my-md-2 p-3`}
                  >
                    {LableText({
                      label: "ID #",
                      value: getApiData?.data?.healthPlanId,
                    })}
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={4}>
                  <div
                    className={`${!getApiData?.data?.caseManagerName && !getApiData?.data?.caseManagerPhone && !getApiData?.data?.caseManagerEmail && "hidePrint"}
                    view-details-grid view-details-grid-inline my-1 my-md-2 p-3`}
                  >
                    {LableText({
                      label: "Case Manager",
                      value: getApiData?.data?.caseManagerName,
                    })}
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={4}>
                  <div
                    className={`${!getApiData?.data?.caseManagerName && !getApiData?.data?.caseManagerPhone && !getApiData?.data?.caseManagerEmail && "hidePrint"}
                    view-details-grid view-details-grid-inline my-1 my-md-2 p-3`}
                  >
                    {" "}
                    {LableText({
                      label: "Phone Number",
                      value: getApiData?.data?.caseManagerPhone,
                    })}
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={4}>
                  <div
                    className={`${!getApiData?.data?.caseManagerName && !getApiData?.data?.caseManagerPhone && !getApiData?.data?.caseManagerEmail && "hidePrint"}
                    view-details-grid view-details-grid-inline my-1 my-md-2 p-3`}
                  >
                    {" "}
                    {LableText({
                      label: "E-Mail",
                      value: getApiData?.data?.caseManagerEmail,
                    })}
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={4}>
                  <div
                    className={`${!getApiData?.data?.socialSecurityRepresentativePayeeName && !getApiData?.data?.socialSecurityRepresentativePayeePhone && !getApiData?.data?.socialSecurityRepresentativePayeeEmail && "hidePrint"}
                    view-details-grid view-details-grid-inline my-1 my-md-2 p-3`}
                  >
                    {LableText({
                      label: "Social Security Representative Payee",
                      value:
                        getApiData?.data?.socialSecurityRepresentativePayeeName,
                    })}
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={4}>
                  <div
                    className={`${!getApiData?.data?.socialSecurityRepresentativePayeeName && !getApiData?.data?.socialSecurityRepresentativePayeePhone && !getApiData?.data?.socialSecurityRepresentativePayeeEmail && "hidePrint"}
                    view-details-grid view-details-grid-inline my-1 my-md-2 p-3`}
                  >
                    {LableText({
                      label: "Phone Number",
                      value:
                        getApiData?.data
                          ?.socialSecurityRepresentativePayeePhone,
                    })}
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6} xl={4}>
                  <div
                    className={`${!getApiData?.data?.socialSecurityRepresentativePayeeName && !getApiData?.data?.socialSecurityRepresentativePayeePhone && !getApiData?.data?.socialSecurityRepresentativePayeeEmail && "hidePrint"}
                    view-details-grid view-details-grid-inline my-1 my-md-2 p-3`}
                  >
                    {LableText({
                      label: "E-Mail",
                      value:
                        getApiData?.data
                          ?.socialSecurityRepresentativePayeeEmail,
                    })}
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className="mt-4 mb-3"
                >
                  {renderDiagnoses(
                    "Mental Health Diagnoses",
                    getApiData?.data?.patientId?.psychiatricDiagnoses ||
                      getApiData?.data?.patientId?.psychiatricDiagnosesArray ||
                      getApiData?.data?.psychiatricDiagnoses,
                  )}
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className="mt-2 mb-4"
                >
                  {renderDiagnoses(
                    "Medical Diagnoses",
                    getApiData?.data?.patientId?.medicalDiagnoses ||
                      getApiData?.data?.patientId?.medicalDiagnosesArray ||
                      getApiData?.data?.medicalDiagnoses,
                  )}
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div
                    className={emptyChecker(getApiData?.data?.pastSurgeries)}
                  >
                    {" "}
                    {LableText({
                      label: "Past Surgeries",
                      value: getApiData?.data?.pastSurgeries,
                    })}
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
              <Col xs={12} lg={12} className="text-end">
                {signatureFormat({
                  sign: getApiData?.data?.bhpSignature,
                  date: getApiData?.data?.bhpDate,
                  time: getApiData?.data?.time,
                  hoursFormat,
                })}
                {signatureFormat({
                  sign: getApiData?.data?.adminSignature,
                  date: getApiData?.data?.adminSignatureDate,
                  time: getApiData?.data?.adminSignatureTime,
                  hoursFormat,
                })}
                <div className="text-end">
                  {getApiData?.data?.signers?.map(
                    (signer) =>
                      signer.signature && (
                        <Form.Label
                          className="w-100 text-end mb-0"
                          key={signer.signerId}
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
                </div>
              </Col>
            </Row>
            <Row className="mt-3 text-center">
              <Col xs={12} md={12}>
                <div className="employee-btn-joiner hidePrint">
                  <button
                    className="employee_create_btn"
                    type="button"
                    onClick={print}
                  >
                    PRINT THIS FORM
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </Container>
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewFaceSheet,
});
