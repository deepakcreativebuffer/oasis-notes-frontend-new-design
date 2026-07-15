/** @format */
import React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { ROLES } from "@/features/shared/constants/index";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";

const ViewResidentIntakesContentPart2 = (props) => {
  const {
    ORIENTATIONDropDown,
    componentRef5,
    componentRef6,
    componentRef7,
    componentRef8,
    componentRefNew8,
    getApiData,
    companyName,
    handleNextPage,
    handlePrevPage,
    hoursFormat,
    houseRulesAcknowledgementName,
    houseRulesDropDown,
    lockBoxKeyIssueReturnAddress,
    lockBoxKeyIssueReturnCharged,
    lockBoxKeyIssueReturnStaffDate,
    lockBoxKeyIssueReturnStaffTime,
    page,
    patientDetail,
    primaryInsurance,
    print,
    printAllMode,
    receiptDropDown,
    renderInlineSignatures,
    location,
    legacySignatures,
    setSigInModel5,
    setShowSignatureResident,
    lockBoxKeyIssueReturnDateKeyIssued,
    lockBoxKeyIssueReturnDateKeyReturned,
    lockBoxKeyIssueReturnStaffSignature,
    lockBoxKeyIssueReturnResidentSignature,
    lockBoxKeyIssueReturnResidentDate,
    lockBoxKeyIssueReturnResidentTime,
    insuranceInformationPrimaryInsurancePolicyholderName,
    insuranceInformationPrimaryInsurancePolicyholderDateOfBirth,
    insuranceInformationPrimaryInsurancePolicyholderAddress,
    insuranceInformationPrimaryInsurancePolicyholderCity,
    insuranceInformationPrimaryInsurancePolicyholderState,
    insuranceInformationPrimaryInsurancePolicyholderZip,
    insuranceInformationPrimaryInsurancePolicyholderPhone,
    insuranceInformationPrimaryInsurancePolicyholderRelationship,
    insuranceInformationPrimaryInsuranceCompany,
    insuranceInformationPrimaryInsuranceCustomerServicePhone,
    insuranceInformationPrimaryInsuranceSubscriberNumber,
    insuranceInformationPrimaryInsuranceSubscriberGroup,
    insuranceInformationPrimaryInsuranceSubscriberEffectiveDate,
    insuranceInformationSecondaryInsurancePolicyholderName,
    insuranceInformationSecondaryInsurancePolicyholderDateOfBirth,
    insuranceInformationSecondaryInsurancePolicyholderAddress,
    insuranceInformationSecondaryInsurancePolicyholderCity,
    insuranceInformationSecondaryInsurancePolicyholderState,
    insuranceInformationSecondaryInsurancePolicyholderZip,
    insuranceInformationSecondaryInsurancePolicyholderPhone,
    insuranceInformationSecondaryInsurancePolicyholderRelationship,
    insuranceInformationSecondaryInsuranceCompany,
    insuranceInformationSecondaryInsuranceCustomerServicePhone,
    insuranceInformationSecondaryInsuranceSubscriberNumber,
    insuranceInformationSecondaryInsuranceSubscriberGroup,
    insuranceInformationSecondaryInsuranceSubscriberEffectiveDate,
    verbalConsentResidentRepresentative,
  } = props;

  return (
    <>
      {(page === 6 || printAllMode) && (
        <>
          <div ref={componentRef5} className="residentintakes-print">
            <h1 className="pdfTitle w-100 text-center my-3 hidden">
              Acknowledgement Of Complaint Process{" "}
            </h1>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} md={12}>
                  <Form.Label>
                    I,{" "}
                    <span className="fw-bold">
                      {`${getApiData?.patientId?.firstName} ${getApiData?.patientId?.lastName} `}
                    </span>
                    have been explained by facility staff of the facility
                    resident complaint process. Resident/Guardian understands
                    that they have the right to file complaint with the
                    facilities administrator, and with the Arizona Department of
                    Residential Licensing when complaint can not be resolved
                    with the facility.
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12}>
                  <p className="text-black text-sm">
                    <p>Bureau of Behavioral Health Facilities Licensing</p>
                    <p>150 N. 18th Ave, Suite 420</p>
                    <p>Phoenix AZ, 85007</p>
                  </p>
                  <p className="text-black text-sm">
                    <a
                      target="_blank"
                      href="mailto:BehavioralHealth.Licensing@azdhs.gov"
                      rel="noreferrer"
                    >
                      Behavioral Health.Licensing@azdhs.gov
                    </a>
                  </p>
                  <p className="text-black text-sm">
                    Phone Number : 602-542-3422
                  </p>
                  <p className="text-black text-sm">
                    By signing below, resident acknowledge to have been informed
                    of the complaint process.
                  </p>
                </Col>
              </Row>
            </Card>
            <Row></Row>

            <Row className="mb-3">
              <Col xs={12} md={12} lg={6}>
                <div className="d-flex">
                  {location === "/residentintakes-resident" && (
                    <Button
                      className="theme-button hidePrint me-2"
                      type="button"
                      onClick={() => setSigInModel5(true)}
                    >
                      SAVED AND SIGNED
                    </Button>
                  )}
                  <Button
                    className="theme-button hidePrint me-2"
                    type="button"
                    onClick={print}
                  >
                    PRINT THIS FORM
                  </Button>
                </div>
              </Col>
              <Col xs={12} md={12} lg={6} className="text-end">
                {legacySignatures
                  ?.find((s) => s.page === 6)
                  ?.sign?.map((sign) =>
                    sign?.signerId ? (
                      <div key={sign?.signerId} className="signature-box">
                        {signatureFormat({
                          sign: sign.signature,
                          date: sign.dateSigned,
                          hoursFormat,
                        })}
                      </div>
                    ) : null,
                  )}
              </Col>
            </Row>

            {renderInlineSignatures()}
            <div className="form-actions-next resident-btn">
              {page !== 1 && (
                <div className="hidePrint">
                  <Button
                    className="theme-button"
                    type="button"
                    onClick={handlePrevPage}
                  >
                    Prev Page
                  </Button>
                </div>
              )}

              {page !== 11 && (
                <div className="hidePrint">
                  <Button
                    className="theme-button"
                    type="button"
                    onClick={handleNextPage}
                  >
                    Next Page
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* section 7 */}
      {(page === 7 || printAllMode) && (
        <>
          <div ref={componentRef6} className="residentintakes-print">
            <h1 className="pdfTitle w-100 text-center my-3 hidden">
              ORIENTATION TO AGENCY
            </h1>
            <Card body className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label>
                  I,{" "}
                  <span className="fw-bold">
                    {" "}
                    {`${getApiData?.patientId?.firstName} ${getApiData?.patientId?.lastName} `}
                  </span>
                  received an orientation by facility by staff. The orientation
                  included but not limited to the following:
                </Form.Label>
                <ul className="ps-3">
                  {(ORIENTATIONDropDown ?? "")
                    .split(",")
                    ?.map((sentence, index) => (
                      <li className="list-disc">
                        <p className="mb-2 text-sm" key={index}>
                          {sentence.trim()}
                        </p>
                      </li>
                    ))}
                </ul>
              </Form.Group>
            </Card>
            <Row className="mb-3">
              <Col xs={12} md={6}>
                <div className="d-flex">
                  {location === "/residentintakes-resident" && (
                    <Button
                      className="theme-button hidePrint me-2"
                      type="button"
                    >
                      SAVED AND SIGNED
                    </Button>
                  )}

                  <Button
                    type="button"
                    onClick={print}
                    className="theme-button hidePrint me-2"
                  >
                    PRINT THIS FORM
                  </Button>
                </div>
              </Col>
              <Col xs={12} md={6} className="text-end">
                {legacySignatures
                  ?.find((s) => s.page === 7)
                  ?.sign?.map((sign) =>
                    sign?.signerId ? (
                      <div key={sign?.signerId} className="signature-box">
                        {signatureFormat({
                          sign: sign.signature,
                          date: sign.dateSigned,
                          hoursFormat,
                        })}
                      </div>
                    ) : null,
                  )}
              </Col>
            </Row>

            {renderInlineSignatures()}
            <div className="form-actions-next resident-btn">
              {page !== 1 && (
                <div className="hidePrint">
                  <Button
                    type="button"
                    className="theme-button"
                    onClick={handlePrevPage}
                  >
                    Prev Page
                  </Button>
                </div>
              )}

              {page !== 11 && (
                <div className="hidePrint">
                  <Button
                    type="button"
                    className="theme-button"
                    onClick={handleNextPage}
                  >
                    Next Page
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {/* section 8 */}
      {(page === 8 || printAllMode) && (
        <>
          <div
            ref={componentRefNew8}
            className="print-content increase-print-width residentintakes-print"
          >
            <h1 className="pdfTitle mb-0 mt-2 hidden">
              RECEIPT OF INFORMATION AT ADMISSION
            </h1>
            <Card body className="mb-3 mt-3">
              <Row>
                <Form.Group className="mb-3">
                  <Form.Label>
                    By signing below, I,{" "}
                    <span className="fw-bold">
                      {" "}
                      {`${getApiData?.patientId?.firstName} ${getApiData?.patientId?.lastName} `}
                    </span>
                    acknowledge having received the following information:
                  </Form.Label>
                  {(receiptDropDown?.length ?? 0) > 0 && (
                    <ul className="ps-3">
                      {(typeof receiptDropDown === "string"
                        ? receiptDropDown
                        : ""
                      )
                        .split(",")
                        ?.map((sentence, index) => (
                          <li className="list-disc">
                            <p className="mb-2 text-sm" key={index}>
                              {sentence.trim()}
                            </p>
                          </li>
                        ))}
                    </ul>
                  )}
                </Form.Group>
              </Row>
            </Card>
            <Row className="flex items-start">
              <Col xs={12} md={6}>
                <Button
                  onClick={print}
                  className="theme-button hide-print-btn"
                  type="button"
                >
                  PRINT THIS FORM
                </Button>
              </Col>
              <Col xs={12} md={6} className="text-end">
                {legacySignatures
                  ?.find((s) => s.page === 8)
                  ?.sign?.map((sign) =>
                    sign?.signerId ? (
                      <div key={sign?.signerId} className="signature-box">
                        {signatureFormat({
                          sign: sign.signature,
                          date: sign.dateSigned,
                          hoursFormat,
                        })}
                      </div>
                    ) : null,
                  )}
              </Col>
            </Row>

            {renderInlineSignatures()}
            <div className="form-actions-next resident-btn">
              {page !== 1 && (
                <div className="hidePrint">
                  <Button
                    type="button"
                    className="theme-button"
                    onClick={handlePrevPage}
                  >
                    Prev Page
                  </Button>
                </div>
              )}

              {page !== 11 && (
                <div className="hidePrint">
                  <Button
                    type="button"
                    className="theme-button"
                    onClick={handleNextPage}
                  >
                    Next Page
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {/* section 9 — House Rules Acknowledgement (new) */}
      {(page === 9 || printAllMode) && (
        <>
          <div className="residentintakes-print">
            <h1 className="pdfTitle w-100 text-center my-3 hidden">
              HOUSE RULES ACKNOWLEDGEMENT
            </h1>
            <Card body className="mb-3 mt-3">
              <Row>
                <Form.Group className="mb-3">
                  <Form.Label>
                    By signing below, I,
                    <span className="fw-bold">
                      {" "}
                      {houseRulesAcknowledgementName ||
                        `${getApiData?.patientId?.firstName ?? ""} ${getApiData?.patientId?.lastName ?? ""}`}{" "}
                    </span>
                    acknowledge the following house rules:
                  </Form.Label>
                  {houseRulesDropDown?.length > 0 && (
                    <ul className="ps-3">
                      {houseRulesDropDown.map((item, index) => (
                        <li className="list-disc" key={index}>
                          <p className="mb-2 text-sm">
                            {item?.value || item?.label}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </Form.Group>
              </Row>
            </Card>
            {renderInlineSignatures()}
            <Row className="flex items-start">
              <Col xs={12} className="text-end">
                {legacySignatures
                  ?.find((s) => s.page === 9)
                  ?.sign?.map((sign) =>
                    sign?.signerId ? (
                      <div key={sign?.signerId} className="signature-box">
                        {signatureFormat({
                          sign: sign.signature,
                          date: sign.dateSigned,
                          hoursFormat,
                        })}
                      </div>
                    ) : null,
                  )}
              </Col>
            </Row>
            <div className="form-actions-next resident-btn">
              {page !== 1 && (
                <div className="hidePrint">
                  <Button
                    className="theme-button"
                    type="button"
                    onClick={handlePrevPage}
                  >
                    Prev Page
                  </Button>
                </div>
              )}
              {page !== 11 && (
                <div className="hidePrint">
                  <Button
                    className="theme-button"
                    type="button"
                    onClick={handleNextPage}
                  >
                    Next Page
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* section 10 — Resident Lock Box (was page 9) */}
      {(page === 10 || printAllMode) && (
        <>
          <div ref={componentRef7} className="residentintakes-print">
            <h1 className="pdfTitle w-100 text-center my-3 hidden">
              Resident Lock Box Key Issue and Return Optional
            </h1>

            <Row className="mb-2">
              <Col xs={12} sm={8} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Resident’s Name :</p>
                  <h5 className="view-value mb-0">
                    {`${getApiData?.patientId?.firstName} ${getApiData?.patientId?.lastName}`}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={4} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date Key Issued : </p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(lockBoxKeyIssueReturnDateKeyIssued)}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date Key Returned : </p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(lockBoxKeyIssueReturnDateKeyReturned)}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Address : </p>
                  <h5 className="view-value mb-0">
                    {lockBoxKeyIssueReturnAddress}
                  </h5>
                </div>
              </Col>
            </Row>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} md={12} lg={12}>
                  <div className="Residentrights">
                    <p>
                      I,
                      <Form.Label className="mx-1 fw-bold my-0">
                        {`${patientDetail?.userType === ROLES.EMPLOYEE ? `${getApiData?.patientId?.firstName} ${getApiData?.patientId?.lastName}` : ` ${patientDetail?.firstName} ${patientDetail?.lastName}`}`}
                      </Form.Label>
                      will be responsible for my individual lock box key to
                      <Form.Label className="mx-1 fw-bold my-0">
                        {companyName}
                      </Form.Label>
                      Corporation lock box located in my room. I will not give
                      my key to anyone except to staff upon request. I
                      understand that if I loose my key I will be charged a $
                      <Form.Label className="mx-1 fw-bold my-0">
                        {lockBoxKeyIssueReturnCharged}
                      </Form.Label>
                      re-key fee. I understand that upon my discharge from this
                      program I will return my key to the program.
                    </p>
                  </div>
                </Col>
              </Row>
            </Card>
            <Row className="mb-3">
              <Col xs={12} md={12} lg={6}>
                <div className="d-flex">
                  {location === "/residentintakes-resident" && (
                    <Button
                      className="theme-button hidePrint me-2"
                      type="button"
                    >
                      SAVED AND SIGNED
                    </Button>
                  )}
                  <Button
                    onClick={print}
                    className="theme-button hidePrint me-2"
                    type="button"
                  >
                    PRINT THIS FORM
                  </Button>
                </div>
              </Col>
              <Col xs={12} md={12} lg={6} className="text-end">
                {/* Employee Sign  */}
                {signatureFormat({
                  sign: lockBoxKeyIssueReturnStaffSignature,
                  date: lockBoxKeyIssueReturnStaffDate,
                  time: lockBoxKeyIssueReturnStaffTime,
                  hoursFormat,
                })}
                {/* Resident Sign */}
                {lockBoxKeyIssueReturnResidentSignature &&
                  signatureFormat({
                    sign: lockBoxKeyIssueReturnResidentSignature,
                    date: lockBoxKeyIssueReturnResidentDate,
                    time: lockBoxKeyIssueReturnResidentTime,
                    hoursFormat,
                  })}
                {legacySignatures
                  ?.find((s) => s.page === 10)
                  ?.sign?.map((sign) =>
                    sign?.signerId ? (
                      <div key={sign?.signerId} className="signature-box">
                        {signatureFormat({
                          sign: sign.signature,
                          date: sign.dateSigned,
                          hoursFormat,
                        })}
                      </div>
                    ) : null,
                  )}
              </Col>
            </Row>

            {renderInlineSignatures()}
            <div className="form-actions-next resident-btn">
              {page !== 1 && (
                <div className="hidePrint">
                  <Button
                    type="button"
                    className="theme-button"
                    onClick={handlePrevPage}
                  >
                    Prev Page
                  </Button>
                </div>
              )}

              {page !== 11 && (
                <div className="hidePrint">
                  <Button
                    type="button"
                    className="theme-button"
                    onClick={handleNextPage}
                  >
                    Next Page
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* section 10 */}
      {(page === 11 || printAllMode) && (
        <>
          <div ref={componentRef8} className="residentintakes-print">
            <h1 className="pdfTitle w-100 text-center my-3 hidden">
              INSURANCE INFORMATION
            </h1>
            <div className="view-details-grid my-1 my-md-2 p-3">
              <p className="view-label mb-1">Name :</p>
              <h5 className="view-value mb-0">
                {insuranceInformationPrimaryInsurancePolicyholderName}
              </h5>
            </div>
            <Row>
              <Col xs={12} sm={12} lg={8}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Primary Insurance :</p>
                  <h5 className="view-value mb-0">{primaryInsurance}</h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date of Birth :</p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(
                      insuranceInformationPrimaryInsurancePolicyholderDateOfBirth,
                    )}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={8}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Address (if different than Resident) :
                  </p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationPrimaryInsurancePolicyholderAddress}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">City :</p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationPrimaryInsurancePolicyholderCity}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">State :</p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationPrimaryInsurancePolicyholderState}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Zip :</p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationPrimaryInsurancePolicyholderZip}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1"> Phone Number : </p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationPrimaryInsurancePolicyholderPhone}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Relationship to Resident : </p>
                  <h5 className="view-value mb-0">
                    {
                      insuranceInformationPrimaryInsurancePolicyholderRelationship
                    }
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Insurance Company Name : </p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationPrimaryInsuranceCompany}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4} xl={4}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Customer Service Phone Number :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationPrimaryInsuranceCustomerServicePhone}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Subscriber # :</p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationPrimaryInsuranceSubscriberNumber}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Group# :</p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationPrimaryInsuranceSubscriberGroup}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Effective Date :</p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(
                      insuranceInformationPrimaryInsuranceSubscriberEffectiveDate,
                    )}
                  </h5>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} lg={12}>
                <hr className="hidePrint" />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} lg={8}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Secondary Insurance :</p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationSecondaryInsurancePolicyholderName}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date of Birth :</p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(
                      insuranceInformationSecondaryInsurancePolicyholderDateOfBirth,
                    )}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={8}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Address (if different than Resident) :
                  </p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationSecondaryInsurancePolicyholderAddress}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">City :</p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationSecondaryInsurancePolicyholderCity}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">State :</p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationSecondaryInsurancePolicyholderState}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Zip :</p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationSecondaryInsurancePolicyholderZip}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Phone Number : </p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationSecondaryInsurancePolicyholderPhone}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Relationship to Resident : </p>
                  <h5 className="view-value mb-0">
                    {
                      insuranceInformationSecondaryInsurancePolicyholderRelationship
                    }
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Insurance Company Name : </p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationSecondaryInsuranceCompany}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Customer Service Phone Number :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationSecondaryInsuranceCustomerServicePhone}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Subscriber # :</p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationSecondaryInsuranceSubscriberNumber}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Group# :</p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationSecondaryInsuranceSubscriberGroup}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Effective Date :</p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(
                      insuranceInformationSecondaryInsuranceSubscriberEffectiveDate,
                    )}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    OBLIGATIONS OF RESPONSIBLE PARTY :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    Our facility files for reimbursement with your insurance
                    company. However, the ultimate responsibility for your
                    account is yours. Insurance billing is a courtesy, and the
                    facility does not accept the responsibility for collection
                    of your claim or of negotiating a settlement on a disputed
                    claim. If the Resident is responsible for a balance due, you
                    will receive monthly statements.
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">ASSIGNMENT OF BENEFITS : </p>
                  <h5 className="view-value mb-0">
                    I hereby authorize this facility to release the minimum
                    medical information necessary to process my insurance
                    claims. I further authorize the above insurance company(s)
                    to make payment directly to the provider for the benefits
                    herein and otherwise payable to me.
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Verbal Consent given by resident/representative :
                  </p>
                  <h5 className="view-value mb-0">
                    {verbalConsentResidentRepresentative}
                  </h5>
                </div>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={12} md={6}>
                <div className="d-flex gap-2">
                  {location === "/residentintakes-resident" && (
                    <Button
                      className="theme-button hidePrint me-2"
                      type="button"
                      onClick={() => setShowSignatureResident(true)}
                    >
                      SAVED AND SIGNED
                    </Button>
                  )}
                  <Button
                    className="theme-button hidePrint me-2"
                    type="button"
                    onClick={print}
                  >
                    PRINT THIS FORM
                  </Button>
                </div>
              </Col>
              <Col xs={12} md={6} className="text-end">
                {legacySignatures
                  ?.find((s) => s.page === 11)
                  ?.sign?.map((sign) =>
                    sign?.signerId ? (
                      <div key={sign?.signerId} className="signature-box">
                        {signatureFormat({
                          sign: sign.signature,
                          date: sign.dateSigned,
                          hoursFormat,
                        })}
                      </div>
                    ) : null,
                  )}
              </Col>
            </Row>

            <Row className="mt-3 mt-md-4 text-start">
              <Col xs={12}></Col>
            </Row>

            {renderInlineSignatures()}
            <div className="form-actions-next resident-btn">
              {page !== 1 && (
                <div className="hidePrint">
                  <Button
                    className="theme-button"
                    type="button"
                    onClick={handlePrevPage}
                  >
                    Prev Page
                  </Button>
                </div>
              )}

              {page !== 11 && (
                <div className="hidePrint">
                  <Button
                    className="theme-button"
                    type="button"
                    onClick={handleNextPage}
                  >
                    Next Page
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ViewResidentIntakesContentPart2;
