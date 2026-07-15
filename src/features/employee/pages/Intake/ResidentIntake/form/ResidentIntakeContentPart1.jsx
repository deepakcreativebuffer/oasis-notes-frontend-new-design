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
import { ClipLoader } from "react-spinners";
import { AutoSize } from "@/features/shared/ui/forms/AutoSize";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import {
  formatDateToMMDDYYYY,
  fetchPaitentName,
  deletePermission,
  signatureFormat,
} from "@/utils/utils";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import DatePicker from "react-datepicker";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import { AiFillDelete } from "react-icons/ai";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants/index";
import {
  houseRulesOptionValue,
  sanitizeHouseRulesArray,
} from "../houseRulesOptions";

import { useResidentIntakeFormContext } from "../context/ResidentIntakeFormContext";

const ResidentIntakeContentPart1 = (props) => {
  const { formSetters } = useResidentIntakeFormContext();
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
    clearAllTyped,
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
    getApiData,
    guardianRepresentativeDate,
    guardianRepresentativeName,
    guardianRepresentativeSignature,
    guardianRepresentativeTime,
    handleDeleteArrayInternalDisclosure,
    handleKeyDownHouseRulesDropDown,
    handleKeyDownORIENTATIONDropDown,
    handleKeyDownReceiptDropDown,
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
    hasTypedInForm,
    hoursFormat,
    houseRulesAcknowledgementName,
    houseRulesDropDown,
    houseRulesOptionHandler,
    iAgree,
    id,
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
    primaryInsurance,
    print,
    printAllMode,
    profile,
    promotionTalkStrategicApproach,
    receiptDropDown,
    receiptName,
    receiptOptionHandler,
    receiptOptionValue,
    residentName,
    residentRightsResidentDate,
    residentRightsResidentName,
    residentRightsResidentSignature,
    residentRightsResidentTime,
    roleSignatures,
    setGetApiData,
    setLoading,
    setPage,
    setPatientDetail,
    setPatientId,
    setResidentName,
    setSigInModel1,
    setSigInModel10,
    setSigInModel12,
    setSigInModel14,
    setSigInModel17,
    setSigInModel19,
    setSigInModel2,
    setSigInModel20,
    setSigInModel3,
    setSigInModel8New,
    sigInModel8New,
    signInModel20,
    signatureModals,
    signaturePairs,
    signatures,
    signers,
    staffName,
    submitHandler,
    typedGuardDialog,
    updateRoleSignature,
    witnessIncomplete,
    setCompanyName,
    setiAgree,
    setInternalName,
    setInternalRelationship,
    setInternalContect,
    photoVideoConsentConsentWithdrawn,
    advanceDirectivesResidentDateOfBirth,
    advanceDirectivesResidentAddress,
    advanceDirectivesProvidedInfoAcknowledged,
    advanceDirectivesProvidedInfoDate,
    advanceDirectivesRefusingAcknowledged,
    advanceDirectivesProvidedInfoRefusingDate,
    advanceDirectivesDevelopedComment,
    advanceDirectivesExecutedInRecord,
    advanceDirectivesExecutedInRecordComment,
    advanceDirectivesFilingStatusWishNotFiled,
    advanceDirectivesFilingStatusAskedForCopyNotProvided,
    advanceDirectivesFilingStatusOther,
    advanceDirectivesCoordinationOfCareCopySentToPCP,
    advanceDirectivesCoordinationOfCareActedOn,
    advanceDirectivesCoordinationOfCareAppropriatePartiesNotified,
    advanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment,
    setInternalDisclosureListExpire,
  } = props;

  const {
    setPhotoVideoConsentConsentGiven,
    setPhotoVideoConsentConsentWithdrawn,
    setPhotoVideoConsentDateOfBirth,
    setPhotoVideoConsentAdmissionDate,
    setAdvanceDirectivesResidentGender,
    setAdvanceDirectivesDeveloped,
    setAdvanceDirectivesDevelopedComment,
    setAdvanceDirectivesExecutedInRecord,
    setAdvanceDirectivesExecutedInRecordComment,
    setAdvanceDirectivesFilingStatusWishNotFiled,
    setAdvanceDirectivesFilingStatusAskedForCopyNotProvided,
    setAdvanceDirectivesFilingStatusOther,
    setAdvanceDirectivesCoordinationOfCareCopySentToPCP,
    setAdvanceDirectivesCoordinationOfCareActedOn,
    setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotified,
    setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment,
    setAdvanceDirectivesProvidedInfoAcknowledged,
    setAdvanceDirectivesProvidedInfoDate,
    setAdvanceDirectivesRefusingAcknowledged,
    setAdvanceDirectivesProvidedInfoRefusingDate,
    setAdvanceDirectivesResidentDateOfBirth,
    setAdvanceDirectivesResidentAddress,
    setAdvanceDirectivesResidentDate,
  } = formSetters;

  return (
    <>
      {page === 1 && (
        <>
          <div className="increase-print-width">
            <h1 className="pdfTitle mb-0 mt-2 hidden">Consent for Treatment</h1>
            <div className="grid-item long-input resident-details print-d-block my-2 print-border-bottom hidden">
              <span className="increse-size fw-bold">Resident Name: </span>
              <span className="increse-size">{residentName}</span>
            </div>
            <Card body className="mb-3">
              <Row>
                <Col xs={12}>
                  <Form.Label>
                    I voluntarily apply for evaluation/behavioral health
                    treatment at
                    <span>
                      <AutoSize
                        value={companyName}
                        setValue={setCompanyName}
                        placeholder={"Company Name"}
                      />
                    </span>{" "}
                    and understand, consent and agree as follows (to be executed
                    by legally authorized person if the Resident is incapable of
                    giving informed consent):
                  </Form.Label>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={12}>
                  <ul className="ps-3 list-decimal text-sm">
                    <li className="mb-3">
                      I agree to participate in my treatment to the best of my
                      ability and will let my provider know if situations occur
                      that prevent me from participating in treatment.
                    </li>
                    <li className="mb-3">
                      I understand that this consent will remain valid so long
                      as I am admitted in this facility, or until I withdraw
                      consent.
                    </li>
                    <li className="mb-3">
                      Information developed as part of evaluation/treatment and
                      your psychiatric record is confidential but may be
                      released to those parties as required by law such as
                      (information may be released without my consent) in cases
                      of medical emergency, abuse or neglect, court order,
                      insurance billing claims requirements, audit and program
                      evaluation and where otherwise legally required.
                      Additionally, I understand that by signing this consent I
                      am giving permission for ADHS/DBHS to access my
                      information and records maintained by the T/RBHA,{" "}
                      <span>
                        <AutoSize
                          value={companyName}
                          setValue={setCompanyName}
                          placeholder={"Company Name"}
                        />
                      </span>
                      and/or it's subcontracted providers concerning the
                      provision of covered services.
                    </li>
                    <li className="mb-3">
                      I consent to the use and disclosure of my protected health
                      information (PHI) by
                      <span>
                        <AutoSize
                          value={companyName}
                          setValue={setCompanyName}
                          placeholder={"Company Name"}
                        />
                      </span>
                      , it's staff members and it's contractors / interns for
                      the purpose of treatment, payment and health care
                      operations. This is a joint consent form between
                      <span>
                        <AutoSize
                          value={companyName}
                          setValue={setCompanyName}
                          placeholder={"Company Name"}
                        />
                      </span>{" "}
                      and it's staff members. I understand the following: My
                      signature on the consent is required in order for me to
                      receive care from{" "}
                      <span>
                        <AutoSize
                          value={companyName}
                          setValue={setCompanyName}
                          placeholder={"Company Name"}
                        />
                      </span>
                      , I have the right to revoke this consent, in writing, at
                      any time, except to the extent that
                      <span>
                        <AutoSize
                          value={companyName}
                          setValue={setCompanyName}
                          placeholder={"Company Name"}
                        />
                      </span>{" "}
                      has taken action in reliance upon this consent.
                    </li>
                    <li className="mb-3">
                      I understand that services include counseling, assessment,
                      treatment planning, non-emergency transportation,
                      medication services, care coordination, and personal care
                      (only if the facility is approved for PCS). I agree to
                      participate in treatment to the best of my ability.
                    </li>
                    <li className="mb-3">
                      However, confidential information may be disclosed without
                      my consent in accordance with state and federal law.
                    </li>
                    <li className="mb-3">
                      I understand that this Consent to treatment is voluntary,
                      and I may decline at any time.
                    </li>
                  </ul>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={12}>
                  <Form.Check
                    inline
                    label="I Agree to the Terms & Conditions"
                    type="checkbox"
                    checked={iAgree === true}
                    onChange={() => setiAgree(true)}
                  />
                </Col>
                <Col xs={12}>
                  <Form.Check
                    inline
                    label="I disagree to the Terms & Conditions"
                    type="checkbox"
                    checked={iAgree === false}
                    onChange={() => setiAgree(false)}
                  />
                </Col>
              </Row>
            </Card>
            <Row className="mt-3">
              <Col xs={12} lg={6} className="flex items-start">
                {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): SAVED AND SIGNED button moved to page 11 only. Single click on page 11 fans out the signer to all pages.
                         <Button
                          className={`theme-button hide-print-btn me-2 ${
                            isNotEditableWithSigner && "pointer-events-auto"
                          }`}
                          type="button"
                          onClick={() => guardTyped(() => setSigInModel1(true))}
                         >
                          SAVED AND SIGNED
                         </Button>
                         */}
              </Col>
              <Col xs={12} lg={6}>
                {signatures
                  ?.find((s) => s.page === 1)
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
            <div className="form-actions-next hidePrint mt-3">
              {page !== 1 && (
                <div>
                  <Button
                    type="button"
                    className={`theme-button ${isNotEditableWithSigner && "pointer-events-auto"}`}
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
                    className={`theme-button ${isNotEditableWithSigner && "pointer-events-auto"}`}
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

      {/* second session2 */}
      {page === 2 && (
        <>
          <div className="print-content increase-print-width">
            <h1 className="pdfTitle mb-0 mt-2 hidden">
              Internal Resident Disclosure List
            </h1>
            <div className="grid-item long-input resident-details print-d-block my-2 print-border-bottom hidden">
              <span className="increse-size fw-bold">Resident Name: </span>
              <span className="increse-size">{residentName}</span>
            </div>
            <Card body className="mb-3">
              <Row>
                <Col xs={12}>
                  <h6 className="fw-bold">Internal Resident Disclosure List</h6>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <Form.Label>
                    I authorize and agree that
                    <span>
                      <AutoSize
                        value={companyName}
                        setValue={setCompanyName}
                        placeholder={"Company Name"}
                      />
                    </span>{" "}
                    may verbally disclose my protected health information (PHI)
                    to the following family members, individuals and / or
                    significant others in my life each of whom is directly
                    involved in my care and are concerned about my well being
                    specifically for the purpose of coordinating care issues
                    either in person or on the telephone.
                  </Form.Label>
                  <Form.Label>
                    I authorize and agree that{" "}
                    <span>
                      <AutoSize
                        value={companyName}
                        setValue={setCompanyName}
                        placeholder={"Company Name"}
                      />
                    </span>{" "}
                    may acknowledge and accept telephone calls from the
                    following family members, individuals and / All significant
                    others in my life each of whom is directly involved in my
                    care and are concerned about my well being who may want to
                    talk to me while at{" "}
                    <span>
                      <AutoSize
                        value={companyName}
                        setValue={setCompanyName}
                        placeholder={"Company Name"}
                      />
                    </span>
                  </Form.Label>
                </Col>
              </Row>
            </Card>

            <Card body className="mb-3">
              <Row>
                <Col xs={12} sm={6} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Name of Person</Form.Label>
                    <Form.Control
                      type="text"
                      value={internalName}
                      placeholder="Enter text"
                      onChange={(e) => setInternalName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Relationship</Form.Label>
                    <Form.Control
                      type="text"
                      value={internalRelationship}
                      placeholder="Enter text"
                      onChange={(e) => setInternalRelationship(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Contact</Form.Label>
                    <Form.Control
                      type="number"
                      value={internalContect}
                      placeholder="Enter Number"
                      onChange={(e) => setInternalContect(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
            <Row className="mb-3 text-center hidePrint">
              <Col xs={12}>
                <Button
                  type="button"
                  className="theme-button"
                  onClick={handleinternalData}
                >
                  ADD
                </Button>
              </Col>
            </Row>
            {internalDisclosureList.length > 0 && (
              <Row className="mb-3">
                <Col xs={12}>
                  <Table responsive bordered>
                    <thead>
                      <tr>
                        <th>Name of Person</th>
                        <th>Relationship</th>
                        <th>Contact</th>
                        {canDelete && <th className="hidePrint">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {internalDisclosureList?.map((i, index) => (
                        <tr>
                          <td>{` ${i.personName}`} </td>
                          <td>{` ${i.relationship}`} </td>
                          <td>{` ${i.contactNumber}`} </td>
                          {canDelete && (
                            <td className="hidePrint">
                              {
                                <div className="icon-joiner">
                                  <span
                                    className="del-btn cursor-pointer"
                                    onClick={() =>
                                      handleDeleteArrayInternalDisclosure(index)
                                    }
                                  >
                                    <AiFillDelete />
                                  </span>
                                </div>
                              }{" "}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            )}
            <Row>
              <Col xs={12}>
                <Card body className="mb-3">
                  <Form.Label>
                    I acknowledge and agree that{" "}
                    <span>
                      <AutoSize
                        value={companyName}
                        setValue={setCompanyName}
                        placeholder={"Company Name"}
                      />
                    </span>{" "}
                    may disclose my protected health information to the
                    person(s) set forth in this form. I understand that I can
                    revoke this authorization in writing, except to the extent
                    that action has already been taken, at any time and it will
                    expire on{" "}
                    <span>
                      <DatePicker
                        selected={formatDateToMMDDYYYY(
                          internalDisclosureListExpire,
                        )}
                        onChange={(selectedDate) =>
                          setInternalDisclosureListExpire(
                            selectedDate?.toDateString(),
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              internalDisclosureListExpire
                                ? formatDateToMMDDYYYY(
                                    internalDisclosureListExpire,
                                  )
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </span>{" "}
                    or one year from the date of my signature.{" "}
                  </Form.Label>
                </Card>
              </Col>
            </Row>

            <Row className="flex">
              <Col xs={12} md={6}>
                {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): SAVED AND SIGNED button moved to page 11 only.
                         <Button
                          className={`theme-button hide-print-btn me-2 ${
                            isNotEditableWithSigner && "pointer-events-auto"
                          }`}
                          type="button"
                          onClick={() => guardTyped(() => setSigInModel6(true))}
                         >
                          SAVED AND SIGNED
                         </Button>
                         */}
              </Col>
              <Col xs={12} md={6} className="text-end">
                {signatures
                  ?.find((s) => s.page === 2)
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
                    className={`theme-button me-2 ${isNotEditableWithSigner && "pointer-events-auto"}`}
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
                    className={`theme-button ${isNotEditableWithSigner && "pointer-events-auto"}`}
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
      {/* section 3 */}
      {page === 3 && (
        <>
          <div className="print-content increase-print-width">
            <h1 className="pdfTitle mb-0 mt-2 hidden">
              R9-10-711. Resident Rights
            </h1>
            <Card body className="mb-3 mt-3">
              <Row className="mt-3">
                <Col xs={12}>
                  <div className="Residentrights">
                    <Form.Label className="font-medium">
                      A. An administrator shall ensure that:
                    </Form.Label>
                    <ul className="decimal-list text-sm">
                      <li>
                        The requirements in subsection (B) and the resident
                        rights in subsection (E) are conspicuously posted on the
                        premises;
                      </li>
                      <li>
                        At the time of admission, a resident or the resident 's
                        representative receives a written copy of the
                        requirements in subsection (B) and the resident rights
                        in subsection (E); and
                      </li>
                      <li>
                        Policies and procedures include:
                        <ul className="loweralpha-list">
                          <li>
                            How and when a resident or the resident's
                            representative is informed of the resident rights in
                            subsection (E), and
                          </li>
                          <li>
                            Where resident rights are posted as required in
                            subsection (A)(1).
                          </li>
                          <li>
                            An administrator shall ensure that:
                            <ul className="decimal-list">
                              <li>
                                A resident is treated with dignity, respect, and
                                consideration;
                              </li>
                              <li>
                                A resident is not subjected to:
                                <ul className="loweralpha-list">
                                  <li>Abuse;</li>
                                  <li>Neglect;</li>
                                  <li>Exploitation;</li>
                                  <li>Coercion;</li>
                                  <li>Manipulation;</li>
                                  <li>Sexual abuse;</li>
                                  <li>Sexual assault;</li>
                                  <li>Seclusion;</li>
                                  <li>Restraint;</li>
                                  <li>
                                    Retaliation for submitting a complaint to
                                    the Department or another entity;
                                  </li>
                                  <li>
                                    Misappropriation of personal and private
                                    property by the behavioral health
                                    residential facility's personnel members,
                                    employees, volunteers, or students;
                                  </li>
                                  <li>
                                    Discharge or transfer, or threat of
                                    discharge or transfer, for reasons unrelated
                                    to the resident's treatment needs, except as
                                    established in a fee agreement signed by the
                                    resident or the resident 's
                                    representative;or
                                  </li>
                                  <li>
                                    Treatment that involves the denial of:
                                    <ul className="lowerroman-list">
                                      <li>Food,</li>
                                      <li>The opportunity to sleep, or</li>
                                      <li>
                                        The opportunity to use the toilet;
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                      <li>
                        Except as provided in subsection (C) or (D), and unless
                        restricted by the resident's representative, is allowed
                        to:
                        <ul className="loweralpha-list">
                          <li>
                            Associate with individuals of the resident's choice,
                            receive visitors, and make telephone calls during
                            the hours established by the behavioral health
                            residential facility;
                          </li>
                          <li>
                            Have privacy in correspondence, communication,
                            visitation, financial affairs, and personal hygiene;
                            and
                          </li>
                          <li>
                            Unless restricted by a court order, send and receive
                            uncensored and unopened mail; and
                          </li>
                        </ul>
                      </li>
                      <li>
                        A resident or the resident's representative:
                        <ul className="loweralpha-list">
                          <li>
                            Except in an emergency, either consents to or
                            refuses treatment;
                          </li>
                          <li>
                            May refuse or withdraw general consent for treatment
                            before treatment is initiated, unless the treatment
                            is ordered by a ourt according to A.R.S. Title 36,
                            Chapter;
                          </li>
                        </ul>
                      </li>
                      <li>
                        or A.R.S. 8-341.01; is necessary to save the resident's
                        life or physical health; or is provided according to
                        A.R.S. § 36-512;
                        <ul className="loweralpha-list">
                          <li>
                            Except in an emergency, is informed of proposed
                            treatment alternatives, associated risks, and
                            possible complications;
                          </li>
                          <li>
                            Is informed of the following:
                            <ul className="lowerroman-list">
                              <li>
                                The behavioral health residential facility's
                                policy on health care directives, and
                              </li>
                              <li>The resident complaint process; and</li>
                            </ul>
                          </li>
                          <li>
                            Except as otherwise permitted by law, provides
                            written consent to the release of information in the
                            resident's:
                            <ul className="lowerroman-list">
                              <li>Medical record, or</li>
                              <li>Financial records.</li>
                            </ul>
                          </li>
                          <li>
                            For a behavioral health residential facility with
                            licensed capacity of less than 10 residents, if a
                            behavioral health professional determines that a
                            resident's treatment requires the behavioral health
                            residential facility to restrict the resident's
                            ability to participate in the activities in
                            subsection (B)(3), the behavioral health
                            professional shall:
                            <ul className="lowerroman-list">
                              <li>
                                Document a specific treatment purpose in the
                                resident's medical record that justifies
                                restricting the resident from the activity,
                              </li>
                              <li>
                                Inform the resident or resident's representative
                                of the reason why the activity is being
                                restricted, and
                              </li>
                              <li>
                                Inform the resident or resident's representative
                                of the resident's right to file a complaint and
                                the procedure for filing a complaint.
                              </li>
                              <li>
                                For a behavioral health residential facility
                                with a licensed capacity of 10 or more
                                residents, if a clinical director determines
                                that a resident's treatment requires the
                                behavioral health residential facility to
                                restrict the resident's ability to participate
                                in the activities in subsection (B)(3), the
                                clinical director shall comply with the
                                requirements in subsections (C)(1) through (3).
                              </li>
                            </ul>
                          </li>
                          <li>
                            A resident has the following rights:
                            <ul className="loweralpha-list">
                              <li>
                                Not to be discriminated against based on race,
                                national origin, religion, gender, sexual
                                orientation, age, disability, marital status, or
                                diagnosis;
                              </li>
                              <li>
                                To receive treatment that:
                                <ul className="lowerroman-list">
                                  <li>
                                    Supports and respects the resident's
                                    individuality, choices, strengths, and
                                    abilities;
                                  </li>
                                  <li>
                                    Supports the resident's personal liberty and
                                    only restricts the resident's personal
                                    liberty according to a court order, by the
                                    resident's or the resident's
                                    representative's general consent, or as
                                    permitted in this Chapter; and
                                  </li>
                                  <li>
                                    Is provided in the least restrictive
                                    environment that meets the resident's
                                    treatment needs;
                                  </li>
                                </ul>
                              </li>
                              <li>
                                To receive privacy in treatment and care for
                                personal needs, including the right not to be
                                fingerprinted, photographed, or recorded without
                                consent, except:
                                <ul className="lowerroman-list">
                                  <li>
                                    A resident may be photographed when admitted
                                    to a behavioral health residential facility
                                    for identification and administrative
                                    purposes
                                  </li>
                                  <li>
                                    For a resident receiving treatment according
                                    to A.R.S. Title 36, Chapter 37; or
                                  </li>
                                  <li>
                                    For video recordings used for security
                                    purposes that are maintained only on a
                                    temporary basis;
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                      <li>
                        Not to be prevented or impeded from exercising the
                        resident's civil rights unless the resident has been
                        adjudicated incompetent or a court of competent
                        jurisdiction has found that the resident is not able to
                        exercise a specific right or category of rights;
                      </li>
                      <li>
                        To review, upon written request, the resident's own
                        medical record according to A.R.S. §§12-2293, 12-2294,
                        and 12-2294.01;
                      </li>
                      <li>
                        To be provided locked storage space for the resident's
                        belongings while the resident receives treatment;
                      </li>
                      <li>
                        To have opportunities for social contact and daily
                        social, recreational, or rehabilitative activities;
                      </li>
                      <li>
                        To be informed of the requirements necessary for the
                        resident's discharge or transfer to a less restrictive
                        physical environment;
                      </li>
                      <li>
                        To receive a referral to another health care institution
                        if the behavioral health residential facility is not
                        authorized or not able to provide physical health
                        services or behavioral health services needed by the
                        resident;
                      </li>
                      <li>
                        To participate or have the resident's representative
                        participate in the development of a behavioral health
                        treatment plan or decisions concerning treatment;
                      </li>
                      <li>
                        To participate or refuse to participate in research or
                        experimental treatment.
                      </li>
                      <li>
                        To receive assistance from a family member, the
                        resident's representative, or other individual in
                        understanding, protecting, or exercising the resident's
                        right
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Card>
            <Row className="flex items-start">
              <Col xs={12} md={6}>
                {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): SAVED AND SIGNED button moved to page 11 only.
                         <Button
                          className={`theme-button hide-print-btn me-2 ${
                            isNotEditableWithSigner && "pointer-events-auto"
                          }`}
                          type="button"
                          onClick={() => guardTyped(() => setSigInModel3(true))}
                         >
                          SAVED AND SIGNED
                         </Button>
                         */}
              </Col>
              <Col xs={12} md={6} className="text-end">
                {signatures
                  ?.find((s) => s.page === 3)
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
                    className={`theme-button me-2 ${isNotEditableWithSigner && "pointer-events-auto"}`}
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
                    className={`theme-button ${isNotEditableWithSigner && "pointer-events-auto"}`}
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

      {/* section 4 */}
      {page === 4 && (
        <>
          <div className="print-content increase-print-width">
            <h1 className="pdfTitle mb-0 mt-2 hidden">
              Photo/Video Consent Form
            </h1>
            <div className="grid-item long-input resident-details print-d-block my-2 print-border-bottom hidden">
              <span className="increse-size fw-bold">Resident Name: </span>
              <span className="increse-size">{residentName}</span>
            </div>
            <Card body className="mb-3">
              <Row>
                <Col xs={12}>
                  <h6 className="fw-bold">PHOTO/VIDEO CONSENT FORM</h6>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <Form.Label>
                    Consent to appear in photographs and videotapes. Internal
                    use only.
                  </Form.Label>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={12} sm={6} lg="4">
                  <Form.Group className="mb-3 form-print-group-align form-print-group d-flex flex-column">
                    <Form.Label className="fw-bold">Date of Birth</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(
                        patientDetail?.dateOfBirth ||
                          photoVideoConsentDateOfBirth,
                      )}
                      disabled
                      onChange={(selectedDate) =>
                        setPhotoVideoConsentDateOfBirth(
                          selectedDate?.toDateString(),
                        )
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            patientDetail?.dateOfBirth ||
                            photoVideoConsentDateOfBirth
                              ? formatDateToMMDDYYYY(
                                  patientDetail?.dateOfBirth ||
                                    photoVideoConsentDateOfBirth,
                                )
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} lg="4">
                  <Form.Group className="mb-3 form-print-group-align form-print-group d-flex flex-column">
                    <Form.Label className="fw-bold">Admit Date</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(
                        patientDetail?.admitDate ||
                          photoVideoConsentAdmissionDate,
                      )}
                      disabled
                      onChange={(selectedDate) =>
                        setPhotoVideoConsentAdmissionDate(
                          selectedDate?.toDateString(),
                        )
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            patientDetail?.admitDate ||
                            photoVideoConsentAdmissionDate
                              ? formatDateToMMDDYYYY(
                                  patientDetail?.admitDate ||
                                    photoVideoConsentAdmissionDate,
                                )
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card>

            <Card body className="mb-3">
              <Row>
                <Col xs={12}>
                  <Form.Label>
                    Agree to give <span className="mx-1">{companyName}</span>
                    the consent to appear in photographs and videotapes for the
                    purpose of identification and capturing memories from
                    activities. I understand that the photographs and videos
                    will only be displayed within the home it will never be made
                    or displayed in public. I understand that the photographs
                    and videos are for internal purposes only, meaning that
                    staff members and residents are the only individuals who
                    will see the photographs and videotapes.
                  </Form.Label>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={12}>
                  <Form.Check
                    label=" I DO give consent to appear in photographs and
                            videotapes."
                    type="checkbox"
                    id="photoVideoConsentConsentGiven"
                    checked={photoVideoConsentConsentGiven === true}
                    onChange={() => {
                      setPhotoVideoConsentConsentGiven(true);
                      setPhotoVideoConsentConsentWithdrawn(false);
                    }}
                  />
                  <Form.Check
                    label="I DO NOT give consent to appear in photographs and
                            videotapes."
                    type="checkbox"
                    id="photoVideoConsentConsentWithdrawn"
                    checked={photoVideoConsentConsentWithdrawn === true}
                    onChange={() => {
                      setPhotoVideoConsentConsentWithdrawn(true);
                      setPhotoVideoConsentConsentGiven(false);
                    }}
                  />
                </Col>
              </Row>
            </Card>
            <Row className="flex items-start mt-3">
              <Col xs={12} lg="6">
                {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): SAVED AND SIGNED button moved to page 11 only.
                         <Button
                          className={`theme-button hide-print-btn me-2 ${
                            isNotEditableWithSigner && "pointer-events-auto"
                          }`}
                          type="button"
                          onClick={() => guardTyped(() => setSigInModel10(true))}
                         >
                          SAVED AND SIGNED
                         </Button>
                         */}
              </Col>
              <Col xs={12} lg="6" className="text-end">
                {signatures
                  ?.find((s) => s.page === 4)
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
                    className={`theme-button me-2 ${isNotEditableWithSigner && "pointer-events-auto"}`}
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
                    className={`theme-button ${isNotEditableWithSigner && "pointer-events-auto"}`}
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

      {/* section 5 */}
      {page === 5 && (
        <>
          <div className="print-content increase-print-width">
            <h1 className="pdfTitle mb-0 mt-2 hidden">
              Advance Directives Form
            </h1>
            <div className="grid-item long-input resident-details print-d-block my-2 print-border-bottom hidden">
              <span className="increse-size fw-bold">Resident Name: </span>
              <span className="increse-size">{residentName}</span>
            </div>
            <Card body className="mb-3">
              <Row>
                <Col xs={12}>
                  <h6 className="fw-bold">ADVANCED DIRECTIVE FORM</h6>
                  <h6 className="fw-bold">
                    THIS FORM MUST BE COMPLETED AND PROMINENTLY DISPLAYED IN THE
                    MEMBER MEDICAL RECORD
                  </h6>
                </Col>
              </Row>
            </Card>
            <Row>
              <Col xs={12} sm={12} lg="4">
                <Card body className="mb-3">
                  <Form.Group className="form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Select Gender</Form.Label>
                    <div className="radio-inline">
                      <Form.Check
                        inline
                        label="Male"
                        type="radio"
                        id="maleRadio"
                        name="gender"
                        value="male"
                        checked={advanceDirectivesResidentGender === "Male"}
                        onChange={() =>
                          setAdvanceDirectivesResidentGender("Male")
                        }
                      />
                      <Form.Check
                        inline
                        label="Female"
                        type="radio"
                        id="femaleRadio"
                        name="gender"
                        value="female"
                        checked={advanceDirectivesResidentGender === "Female"}
                        onChange={() =>
                          setAdvanceDirectivesResidentGender("Female")
                        }
                      />
                      <Form.Check
                        inline
                        label="Transgender"
                        type="radio"
                        id="otherRadio"
                        name="gender"
                        value="other"
                        checked={
                          advanceDirectivesResidentGender === "Transgender"
                        }
                        onChange={() =>
                          setAdvanceDirectivesResidentGender("Transgender")
                        }
                      />
                    </div>
                  </Form.Group>
                </Card>
              </Col>
              <Col xs={12} sm={12} lg="4">
                <Card body className="mb-3 d-flex flex-column">
                  <Form.Group className="form-print-group-align form-print-group d-flex flex-column">
                    <Form.Label className="fw-bold">Date of Birth</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(
                        patientDetail?.dateOfBirth ||
                          advanceDirectivesResidentDateOfBirth,
                      )}
                      disabled
                      onChange={(selectedDate) =>
                        setAdvanceDirectivesResidentDateOfBirth(
                          selectedDate?.toDateString(),
                        )
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            patientDetail?.dateOfBirth ||
                            advanceDirectivesResidentDateOfBirth
                              ? formatDateToMMDDYYYY(
                                  patientDetail?.dateOfBirth ||
                                    advanceDirectivesResidentDateOfBirth,
                                )
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Card>
              </Col>
              <Col xs={12} sm={12} lg="6">
                <Card body className="mb-3">
                  <Form.Group className="form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Address</Form.Label>
                    <Form.Control
                      type="text"
                      value={advanceDirectivesResidentAddress}
                      placeholder="Enter Address"
                      required
                      onChange={(e) =>
                        setAdvanceDirectivesResidentAddress(e.target.value)
                      }
                    ></Form.Control>
                  </Form.Group>
                </Card>
              </Col>
              <Col xs={12} sm={12} lg="6">
                <Card body className="mb-3">
                  <Form.Group className="form-print-group-align form-print-group d-flex flex-column">
                    <Form.Label className="fw-bold">Date</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(
                        advanceDirectivesResidentDate,
                      )}
                      onChange={(selectedDate) =>
                        setAdvanceDirectivesResidentDate(
                          selectedDate?.toDateString(),
                        )
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            advanceDirectivesResidentDate
                              ? formatDateToMMDDYYYY(
                                  advanceDirectivesResidentDate,
                                )
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Card>
              </Col>
            </Row>
            <h6 className="font-bold">Advance Directives Information</h6>
            <Card body className="mb-3">
              <Row>
                <Col xs={12}>
                  <Form.Label className="mb-0 w-100">
                    I have been provided information and verbal explanation
                    about Advance Directive.
                    <div className="mt-1">
                      <Form.Check
                        inline
                        type="checkbox"
                        id="advanceDirectivesProvidedInfoAckYes"
                        checked={
                          advanceDirectivesProvidedInfoAcknowledged === "yes"
                        }
                        onChange={() =>
                          setAdvanceDirectivesProvidedInfoAcknowledged("yes")
                        }
                        label="Yes"
                      />
                      <Form.Check
                        inline
                        type="checkbox"
                        id="advanceDirectivesProvidedInfoAckNo"
                        checked={
                          advanceDirectivesProvidedInfoAcknowledged === "no"
                        }
                        onChange={() =>
                          setAdvanceDirectivesProvidedInfoAcknowledged("no")
                        }
                        label="No"
                      />
                    </div>
                    <br />
                    {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): Member initials replaced with checkbox toggle above per client request. To restore, uncomment block. */}
                    {/* Member initials{" "}
                             <span>
                              <AutoSize
                                value={advanceDirectivesProvidedInfoInitials}
                                setValue={setAdvanceDirectivesProvidedInfoInitials}
                                placeholder={"____________"}
                              />
                             </span> */}
                    Date{" "}
                    <span>
                      <DatePicker
                        selected={
                          advanceDirectivesProvidedInfoDate
                            ? new Date(advanceDirectivesProvidedInfoDate)
                            : null
                        }
                        onChange={(selectedDate) =>
                          setAdvanceDirectivesProvidedInfoDate(
                            selectedDate?.toDateString(),
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                      />
                    </span>
                  </Form.Label>
                  <br />
                  <Form.Label className="w-100">
                    Resident is refusing advance directives.
                    <div className="mt-1">
                      <Form.Check
                        inline
                        type="checkbox"
                        id="advanceDirectivesRefusingAckYes"
                        checked={
                          advanceDirectivesRefusingAcknowledged === "yes"
                        }
                        onChange={() =>
                          setAdvanceDirectivesRefusingAcknowledged("yes")
                        }
                        label="Yes"
                      />
                      <Form.Check
                        inline
                        type="checkbox"
                        id="advanceDirectivesRefusingAckNo"
                        checked={advanceDirectivesRefusingAcknowledged === "no"}
                        onChange={() =>
                          setAdvanceDirectivesRefusingAcknowledged("no")
                        }
                        label="No"
                      />
                    </div>
                    <br />
                    {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): Member initials replaced with checkbox toggle above. */}
                    {/* Member initials
                             <span>
                              <AutoSize
                                value={
                                  advanceDirectivesProvidedInfoRefusingInitials
                                }
                                setValue={
                                  setAdvanceDirectivesProvidedInfoRefusingInitials
                                }
                                placeholder={"____________"}
                              />
                             </span> */}
                    Date{" "}
                    <span>
                      <DatePicker
                        selected={
                          advanceDirectivesProvidedInfoRefusingDate
                            ? new Date(
                                advanceDirectivesProvidedInfoRefusingDate,
                              )
                            : null
                        }
                        onChange={(selectedDate) =>
                          setAdvanceDirectivesProvidedInfoRefusingDate(
                            selectedDate?.toDateString(),
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                      />
                    </span>
                  </Form.Label>
                </Col>
              </Row>
            </Card>

            <h6 className="font-bold">Advance Directives Development</h6>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} lg={8}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Resident has developed an Advanced Directive
                    </Form.Label>
                    <div className="radio-inline">
                      <Form.Check
                        inline
                        label="Yes"
                        type="checkbox"
                        id="yesRadio"
                        name="option"
                        value="yes"
                        checked={advanceDirectivesDeveloped === "yes"}
                        onChange={() => setAdvanceDirectivesDeveloped("yes")}
                      />
                      <Form.Check
                        inline
                        label="No"
                        type="checkbox"
                        id="noRadio"
                        name="option"
                        value="no"
                        checked={advanceDirectivesDeveloped === "no"}
                        onChange={() => setAdvanceDirectivesDeveloped("no")}
                      />
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      If No, stop and let Resident know that assistance in
                      developing an Advanced Directive is available.
                    </Form.Label>
                  </Form.Group>
                </Col>
                <Col xs={12} lg={4}>
                  {advanceDirectivesDeveloped === "no" && (
                    <Form.Control
                      type="text"
                      placeholder="Please enter"
                      value={advanceDirectivesDevelopedComment}
                      onChange={(e) =>
                        setAdvanceDirectivesDevelopedComment(e.target.value)
                      }
                    ></Form.Control>
                  )}
                </Col>
              </Row>

              <Row className="mt-3">
                <Col xs={12} lg={8}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      {" "}
                      If the Advanced Directive has been executed (developed),
                      is it in the BHRF medical record?
                    </Form.Label>
                    <div className="radio-inline">
                      <Form.Check
                        inline
                        label="Yes"
                        type="checkbox"
                        id="yesCheckbox"
                        checked={advanceDirectivesExecutedInRecord === "yes"}
                        onChange={() =>
                          setAdvanceDirectivesExecutedInRecord("yes")
                        }
                      />
                      <Form.Check
                        inline
                        label="No"
                        type="checkbox"
                        id="noCheckbox"
                        checked={advanceDirectivesExecutedInRecord === "no"}
                        onChange={() =>
                          setAdvanceDirectivesExecutedInRecord("no")
                        }
                      />
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      If the Advanced Directive has been executed, but not filed
                      in the BHRF medical record, please check the applicable
                      box below:
                    </Form.Label>
                  </Form.Group>
                </Col>
                <Col xs={12} lg={7}>
                  {advanceDirectivesExecutedInRecord === "no" && (
                    <Form.Control
                      type="text"
                      className="mb-4"
                      placeholder="Please enter"
                      value={advanceDirectivesExecutedInRecordComment}
                      onChange={(e) =>
                        setAdvanceDirectivesExecutedInRecordComment(
                          e.target.value,
                        )
                      }
                    ></Form.Control>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="yeschechbox2">
                    <div className="flex items-center gap-2.5 mt-2.5">
                      <Form.Check
                        inline
                        type="checkbox"
                        id="advanceDirectivesFilingStatusWishNotFiled"
                        checked={advanceDirectivesFilingStatusWishNotFiled}
                        onChange={() =>
                          setAdvanceDirectivesFilingStatusWishNotFiled(
                            !advanceDirectivesFilingStatusWishNotFiled,
                          )
                        }
                      />
                      <Form.Label htmlFor="advanceDirectivesFilingStatusWishNotFiled">
                        Resident does not wish to have it filed in his/her
                        medical record.
                      </Form.Label>
                    </div>
                  </div>
                  <div className="yeschechbox2">
                    <div className="flex items-center gap-2.5">
                      <Form.Check
                        inline
                        type="checkbox"
                        id="advanceDirectivesFilingStatusAskedForCopyNotProvided"
                        checked={
                          advanceDirectivesFilingStatusAskedForCopyNotProvided
                        }
                        onChange={() =>
                          setAdvanceDirectivesFilingStatusAskedForCopyNotProvided(
                            !advanceDirectivesFilingStatusAskedForCopyNotProvided,
                          )
                        }
                      />
                      <Form.Label htmlFor="advanceDirectivesFilingStatusAskedForCopyNotProvided">
                        BHRF has asked for a copy, but it has not been provided.
                      </Form.Label>
                    </div>
                  </div>
                  <div className="yeschechbox2">
                    <div className="flex items-center gap-2.5">
                      <Form.Check
                        inline
                        type="checkbox"
                        id="advanceDirectivesFilingStatusOther"
                        checked={advanceDirectivesFilingStatusOther}
                        onChange={() =>
                          setAdvanceDirectivesFilingStatusOther(
                            !advanceDirectivesFilingStatusOther,
                          )
                        }
                      />
                      <Form.Label htmlFor="advanceDirectivesFilingStatusOther">
                        Other
                      </Form.Label>
                    </div>
                  </div>
                  <div className="yeschechbox2 mt-3">
                    <div>
                      <Form.Label>
                        To facilitate coordination of care:
                      </Form.Label>
                    </div>
                  </div>
                  <div className="">
                    <div>
                      <Form.Label>
                        Has a copy of an executed Advanced Directive or refusal
                        been sent to the Member's Primary Care Physician?
                      </Form.Label>
                    </div>
                    <Form.Check
                      inline
                      type="checkbox"
                      id="yesCheckboxCopy"
                      checked={
                        advanceDirectivesCoordinationOfCareCopySentToPCP ===
                        "yes"
                      }
                      onChange={() =>
                        setAdvanceDirectivesCoordinationOfCareCopySentToPCP(
                          "yes",
                        )
                      }
                      label="Yes"
                    />
                    <Form.Check
                      inline
                      type="checkbox"
                      id="noCheckboxCopy"
                      checked={
                        advanceDirectivesCoordinationOfCareCopySentToPCP ===
                        "no"
                      }
                      onChange={() =>
                        setAdvanceDirectivesCoordinationOfCareCopySentToPCP(
                          "no",
                        )
                      }
                      label="No"
                    />
                  </div>
                  <div className="">
                    <div>
                      <Form.Label>
                        Has the Advance Directive document ever been acted on?
                      </Form.Label>
                    </div>
                    <Form.Check
                      inline
                      type="checkbox"
                      id="yesCheckboxDocument"
                      checked={
                        advanceDirectivesCoordinationOfCareActedOn === "yes"
                      }
                      onChange={() =>
                        setAdvanceDirectivesCoordinationOfCareActedOn("yes")
                      }
                      label="Yes"
                    />
                    <Form.Check
                      inline
                      type="checkbox"
                      id="noCheckboxDocument"
                      checked={
                        advanceDirectivesCoordinationOfCareActedOn === "no"
                      }
                      onChange={() =>
                        setAdvanceDirectivesCoordinationOfCareActedOn("no")
                      }
                      label="No"
                    />
                  </div>
                  <div className="yeschechbox2">
                    <div>
                      <Form.Label>
                        If Yes, have all appropriate parties been notified?
                      </Form.Label>
                    </div>
                  </div>
                  <div className="yeschechbox2">
                    <div>
                      <Form.Label htmlFor="yesCheckboxNotified">
                        Yes (Specify who)
                      </Form.Label>
                    </div>
                    <div>
                      <Form.Check
                        inline
                        type="checkbox"
                        id="yesCheckboxNotified"
                        checked={
                          advanceDirectivesCoordinationOfCareAppropriatePartiesNotified ===
                          "yes"
                        }
                        onChange={() =>
                          setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotified(
                            "yes",
                          )
                        }
                      />
                      {advanceDirectivesCoordinationOfCareAppropriatePartiesNotified ===
                        "yes" && (
                        <input
                          type="text"
                          className="outline-none border-none"
                          placeholder="__________________"
                          value={
                            advanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment
                          }
                          onChange={(e) =>
                            setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment(
                              e.target.value,
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="yeschechbox2">
                    <div>
                      <Form.Label htmlFor="noCheckboxDescribe">
                        No (Describe why){" "}
                      </Form.Label>
                    </div>
                    <div>
                      <Form.Check
                        inline
                        type="checkbox"
                        id="noCheckboxDescribe"
                        checked={
                          advanceDirectivesCoordinationOfCareAppropriatePartiesNotified ===
                          "no"
                        }
                        onChange={() =>
                          setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotified(
                            "no",
                          )
                        }
                      />
                      {advanceDirectivesCoordinationOfCareAppropriatePartiesNotified ===
                        "no" && (
                        <input
                          type="text"
                          className="outline-none border-none"
                          placeholder="__________________"
                          value={
                            advanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment
                          }
                          onChange={(e) =>
                            setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment(
                              e.target.value,
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
            <Row>
              <Col>
                <div className="d-flex">
                  {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): SAVED AND SIGNED button moved to page 11 only.
                           <Button
                            className={`theme-button hide-print-btn me-2 ${
                              isNotEditableWithSigner && "pointer-events-auto"
                            }`}
                            type="button"
                            onClick={() => guardTyped(() => setSigInModel20(true))}
                           >
                            SAVED AND SIGNED
                           </Button>
                           */}
                </div>
              </Col>
              <Col xs={12} lg={6} className="text-end">
                {signatures
                  ?.find((s) => s.page === 5)
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

            <div className="form-actions-next hide-print-btn">
              {page !== 1 && (
                <div>
                  <Button
                    type="button"
                    className={`theme-button ${isNotEditableWithSigner && "pointer-events-auto"}`}
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
                    className={`theme-button ${isNotEditableWithSigner && "pointer-events-auto"}`}
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

      {/* section 6 */}
    </>
  );
};

export default ResidentIntakeContentPart1;
