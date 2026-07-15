/* eslint-disable no-unused-vars */
/** @format */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
} from "react-bootstrap";
import {
  formatDateToMMDDYYYY,
  fetchPaitentName,
  signatureFormat,
} from "@/utils/utils";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import DatePicker from "react-datepicker";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import AutoSize from "@/features/shared/ui/forms/AutoSize";
import { AiFillDelete } from "react-icons/ai";
import { ROLES } from "@/features/shared/constants/index";
import {
  houseRulesOptionValue,
  sanitizeHouseRulesArray,
} from "@/features/employee/pages/Intake/ResidentIntake/houseRulesOptions";

const ResidentIntakesContentPart2 = (props) => {
  const {
    Cpage,
    ORIENTATIONDropDown,
    Profile,
    _adNorm,
    advanceDirectivesDeveloped,
    advanceDirectivesResidentDate,
    advanceDirectivesResidentGender,
    advanceDirectivesResidentName,
    canDelete,
    companyName,
    componentRef1,
    componentRef2,
    componentRef3,
    componentRef4,
    componentRef5,
    componentRef6,
    componentRef7,
    componentRef8,
    componentRef9,
    componentRefNew3,
    componentRefNew8,
    editDateHandler,
    editDateHandlerAllPages,
    editSignHandler,
    editSignHandlerAllPages,
    filedForm,
    getApiData,
    guardianRepresentativeDate,
    guardianRepresentativeName,
    guardianRepresentativeSignature,
    guardianRepresentativeTime,
    handleDeleteArrayInternalDisclosure,
    handleKeyDownORIENTATIONDropDown,
    handleNextPage,
    handlePrevPage,
    handlePrintAll,
    handlePrintUpdate1,
    handlePrintUpdate2,
    handlePrintUpdate3,
    handlePrintUpdate4,
    handlePrintUpdate5,
    handlePrintUpdate6,
    handlePrintUpdate7,
    handlePrintUpdate8,
    handlePrintUpdate9,
    handleinternalData,
    hoursFormat,
    houseRulesAcknowledgementName,
    houseRulesDropDown,
    iAgree,
    id,
    initializeValues,
    internalContect,
    internalDisclosureList,
    internalDisclosureListExpire,
    internalDisclosureListStaffDate,
    internalDisclosureListStaffName,
    internalDisclosureListStaffTime,
    internalName,
    internalRelationship,
    isDisabled,
    isNotEditableWithSigner,
    loading,
    lockBoxKeyIssueReturnAddress,
    lockBoxKeyIssueReturnCharged,
    lockBoxKeyIssueReturnStaffDate,
    lockBoxKeyIssueReturnStaffName,
    lockBoxKeyIssueReturnStaffTime,
    navigate,
    newOptions,
    newSelectedValues,
    optionHandler,
    optionValue,
    orientationToAgencyCompany,
    orientationToAgencyResidentDate,
    orientationToAgencyResidentTime,
    page,
    patientDetail,
    patientId,
    photoVideoConsentAdmissionDate,
    photoVideoConsentConsentGiven,
    photoVideoConsentDateOfBirth,
    photoVideoConsentResidentDate,
    photoVideoConsentResidentName,
    photoVideoConsentResidentTime,
    previusData,
    primaryInsurance,
    print,
    printAllMode,
    profile,
    promotionTalkStrategicApproach,
    receiptDropDown,
    residentDate,
    residentName,
    residentRightsResidentDate,
    residentRightsResidentName,
    residentRightsResidentSignature,
    residentRightsResidentTime,
    residentSignature,
    residentSignatureTime,
    roleSignatures,
    saveAsDraft,
    setGetApiData,
    setLoading,
    setPage,
    setPatientDetail,
    setPatientId,
    setResidentName,
    setSigInModel1,
    setSigInModel10,
    setSigInModel4,
    setSigInModel5,
    setSigInModel6,
    setSigInModel7,
    setSigInModel8,
    setSigInModel9,
    setSignInModel2,
    setSignInModel3,
    showSignatureResident,
    signatureModals,
    signaturePairs,
    signatures,
    staffDate,
    staffName,
    staffSignature,
    staffTime,
    submitHandler,
    typedGuardDialog,
    updateRoleSignature,
    useResidentIntakesLogic,
    user,
    userDetail,
    userId,
    witnessIncomplete,
    lockBoxKeyIssueReturnDateKeyIssued,
    lockBoxKeyIssueReturnDateKeyReturned,
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
    setHouseRulesDropDown,
    setVerbalConsentResidentRepresentative,
  } = props;

  return (
    <>
      {/* section 6 */}
      {page === 6 && (
        <>
          <div ref={componentRef5} className="residentintakes-print">
            <h1 className="pdfTitle w-100 text-center hidden">
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
                      rel="noopener noreferrer"
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
                  {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): SAVED AND SIGNED button moved to page 11 only.
                               <Button
                                className="theme-button hidePrint me-2"
                                type="button"
                                onClick={() => setSigInModel6(true)}
                               >
                                SAVED AND SIGNED
                               </Button>
                               */}
                </div>
              </Col>
              <Col xs={12} md={12} lg={6}>
                {signatures
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
      {page === 7 && (
        <>
          <div ref={componentRef6} className="residentintakes-print">
            <h1 className="pdfTitle w-100 text-center hidden">
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
                  {ORIENTATIONDropDown.split(",")?.map((sentence, index) => (
                    <li className="list-disc">
                      <p className="mb-2 text-sm" key={index}>
                        {sentence.trim()}
                      </p>
                    </li>
                  ))}
                </ul>
              </Form.Group>
            </Card>
            <Row className="mb-3"></Row>
            <Row className="mb-3">
              <Col xs={12} md={6}>
                <div className="d-flex">
                  {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): SAVED AND SIGNED button moved to page 11 only.
                               <Button
                                className="theme-button hidePrint me-2"
                                type="button"
                                onClick={() => setSigInModel7(true)}
                               >
                                SAVED AND SIGNED
                               </Button>
                               */}
                </div>
              </Col>
              <Col xs={12} md={6}>
                {signatures
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
      {page === 8 && (
        <>
          <div
            ref={componentRef2}
            className="print-content increase-print-width"
          >
            <h1 className="pdfTitle mb-0 mt-2 hidden">
              RECEIPT OF INFORMATION AT ADMISSION
            </h1>
            <Card body className="mb-3 mt-3">
              <Row className="mt-3">
                <Form.Group className="mb-3">
                  <Form.Label>
                    By signing bellow, I,{" "}
                    <span className="fw-bold">
                      {" "}
                      {`${getApiData?.patientId?.firstName} ${getApiData?.patientId?.lastName} `}
                    </span>
                    acknowledge having received the following information:
                  </Form.Label>
                  {receiptDropDown.length > 0 && (
                    <ul className="ps-3">
                      {receiptDropDown.split(",")?.map((sentence, index) => (
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
                {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): SAVED AND SIGNED button moved to page 11 only.
                             <Button
                              className="theme-button hide-print-btn me-2"
                              type="button"
                              onClick={() => setSigInModel8(true)}
                             >
                              SAVED AND SIGNED
                             </Button>
                             */}
              </Col>
              <Col xs={12} md={6} className="text-end">
                {signatures
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

            <div className="form-actions-next hidePrint">
              {page !== 1 && (
                <div>
                  <Button
                    type="button"
                    className="theme-button me-2"
                    onClick={handlePrevPage}
                  >
                    Prev Page
                  </Button>
                </div>
              )}

              {page !== 11 && (
                <div>
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
      {page === 9 && (
        <>
          <div className="residentintakes-print">
            <h1 className="pdfTitle w-100 text-center hidden">
              HOUSE RULES ACKNOWLEDGEMENT
            </h1>
            <Card body className="mb-3 mt-3">
              <Row>
                <Col xs={12} lg={12}>
                  <Form.Label>
                    By signing below, I,
                    <span className="fw-bold">
                      {" "}
                      {houseRulesAcknowledgementName ||
                        `${getApiData?.patientId && fetchPaitentName(getApiData?.patientId)}` ||
                        ""}{" "}
                    </span>
                    acknowledge the following house rules:
                  </Form.Label>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={12} lg={12}>
                  <CustomMultiSelectInput
                    isMulti
                    options={houseRulesOptionValue}
                    value={houseRulesDropDown}
                    onChange={(opt) => setHouseRulesDropDown(opt)}
                    isCreatable={true}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value) {
                        const v = e.target.value.trim();
                        const exists = (houseRulesDropDown || []).some(
                          (o) => o.value === v,
                        );
                        if (!exists) {
                          setHouseRulesDropDown([
                            ...(houseRulesDropDown || []),
                            {
                              value: v,
                              label: v,
                            },
                          ]);
                        }
                        e.target.value = "";
                      }
                    }}
                    className="print-pad-0 print-border-hide"
                  />
                </Col>
              </Row>
            </Card>
            <Row className="flex items-start">
              <Col xs={12} className="text-end">
                {signatures
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
      {page === 10 && (
        <>
          <div ref={componentRef7} className="residentintakes-print">
            <h1 className="pdfTitle w-100 text-center hidden">
              Resident Lock Box Key Issue and Return Optional
            </h1>

            <Row className="mb-3">
              <Col xs={12} sm={6} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Resident’s Name :</p>
                  <h5 className="view-value mb-0">
                    {`${getApiData?.patientId?.firstName} ${getApiData?.patientId?.lastName}`}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={6} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date Key Issued : </p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(lockBoxKeyIssueReturnDateKeyIssued)}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={6} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date Key Returned : </p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(lockBoxKeyIssueReturnDateKeyReturned)}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={6} md={12} lg={12}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Address : </p>
                  <h5 className="view-value mb-0">
                    {lockBoxKeyIssueReturnAddress}
                  </h5>
                </div>
              </Col>
            </Row>
            <Card body className="mb-2">
              <Row>
                <Col xs={12} md={12} lg={12}>
                  <div className="Residentrights">
                    <p>
                      I,{" "}
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
                <div className="d-flex align-items-start">
                  {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): SAVED AND SIGNED button moved to page 11 only.
                               <Button
                                className="theme-button hidePrint me-2"
                                type="button"
                                onClick={() => setSigInModel9(true)}
                               >
                                SAVED AND SIGNED
                               </Button>
                               */}
                </div>
              </Col>
              <Col xs={12} md={12} lg={6}>
                {signatures
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
      {page === 11 && (
        <>
          <div ref={componentRef8} className="residentintakes-print">
            <h1 className="pdfTitle w-100 text-center hidden">
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
                  <p className="view-label mb-1">Phone Number :</p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationPrimaryInsurancePolicyholderPhone}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-2">Relationship to Resident : </p>
                  <h5 className="view-value mb-0">
                    {
                      insuranceInformationPrimaryInsurancePolicyholderRelationship
                    }
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-2">Insurance Company Name : </p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationPrimaryInsuranceCompany}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-2">
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
                  <p className="view-label mb-1">Phone Number :</p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationSecondaryInsurancePolicyholderPhone}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-2">Relationship to Resident :</p>
                  <h5 className="view-value mb-0">
                    {
                      insuranceInformationSecondaryInsurancePolicyholderRelationship
                    }
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-2">Insurance Company Name :</p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationSecondaryInsuranceCompany}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-2">
                    Customer Service Phone Number :
                  </p>
                  <h5 className="view-value mb-0">
                    {insuranceInformationSecondaryInsuranceCustomerServicePhone}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Subscriber# :</p>
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
            </Row>

            <Row className="mb-3">
              <Col xs={12} lg={12}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    Verbal Consent given by resident/representative:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={verbalConsentResidentRepresentative}
                    placeholder="Enter text"
                    onChange={(e) =>
                      setVerbalConsentResidentRepresentative(e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col xs={12} md={6}>
                <div className="d-flex align-items-start gap-2">
                  <Button
                    className="theme-button hidePrint me-2"
                    type="button"
                    onClick={() => setSigInModel10(true)}
                  >
                    SAVED AND SIGNED
                  </Button>
                </div>
              </Col>
              <Col xs={12} md={6}>
                {signatures
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
      {page === 11 && (
        <>
          <div className="signature-sections-inline mt-3">
            <SignatureNamesPanel
              signatures={roleSignatures}
              onUpdate={updateRoleSignature}
            />
            {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): hidden per client request. See documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */}
            {/* <SignatureSection role="bht" label="BHT Signature" variant="green" signature={roleSignatures.bht} onUpdate={updateRoleSignature} /> */}
            {/* <SignatureSection role="bhp" label="BHP Signature" variant="purple" signature={roleSignatures.bhp} onUpdate={updateRoleSignature} externalName /> */}
            {/* <SignatureSection role="admin" label="Admin Signature" variant="pink" signature={roleSignatures.admin} onUpdate={updateRoleSignature} externalName /> */}
            <SignatureSection
              role="resident"
              label="Resident/Representative Signature"
              variant="blue"
              signature={roleSignatures.resident}
              onUpdate={updateRoleSignature}
              signerNameOverride={`${patientDetail?.firstName || ""} ${patientDetail?.lastName || ""}`.trim()}
            />
            <SignatureSection
              role="witness"
              label="Witness Signature"
              variant="yellow"
              signature={roleSignatures.witness}
              onUpdate={updateRoleSignature}
              externalName
            />
          </div>
          <div className="employee-btn-joiner">
            {(patientDetail.userType === ROLES.PATIENT ||
              profile.userType === ROLES.GUARDIAN) && (
              <button
                type="submit"
                className="employee_create_btn hidePrint"
                /* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): submit gate
                       reverted (no disabled prop on resident-side intake).
                       See documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */
                /* TEMP-DISABLED-BHP-BHT-ADMIN: disabled={!allPenSigsHaveNames} */ disabled={
                  witnessIncomplete
                }
              >
                SUBMIT DETAILS
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ResidentIntakesContentPart2;
