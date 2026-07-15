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

const ResidentIntakesContentPart1 = (props) => {
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
    photoVideoConsentConsentWithdrawn,
    setPhotoVideoConsentConsentGiven,
    setPhotoVideoConsentConsentWithdrawn,
    advanceDirectivesResidentDateOfBirth,
    advanceDirectivesResidentAddress,
    setAdvanceDirectivesResidentGender,
    advanceDirectivesProvidedInfoAcknowledged,
    advanceDirectivesProvidedInfoDate,
    advanceDirectivesRefusingAcknowledged,
    advanceDirectivesProvidedInfoRefusingDate,
    setAdvanceDirectivesDeveloped,
    advanceDirectivesDevelopedComment,
    setAdvanceDirectivesDevelopedComment,
    advanceDirectivesExecutedInRecord,
    setAdvanceDirectivesExecutedInRecord,
    advanceDirectivesExecutedInRecordComment,
    setAdvanceDirectivesExecutedInRecordComment,
    advanceDirectivesFilingStatusWishNotFiled,
    setAdvanceDirectivesFilingStatusWishNotFiled,
    advanceDirectivesFilingStatusAskedForCopyNotProvided,
    setAdvanceDirectivesFilingStatusAskedForCopyNotProvided,
    advanceDirectivesFilingStatusOther,
    setAdvanceDirectivesFilingStatusOther,
    advanceDirectivesCoordinationOfCareCopySentToPCP,
    setAdvanceDirectivesCoordinationOfCareCopySentToPCP,
    advanceDirectivesCoordinationOfCareActedOn,
    setAdvanceDirectivesCoordinationOfCareActedOn,
    advanceDirectivesCoordinationOfCareAppropriatePartiesNotified,
    setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotified,
    advanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment,
    setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotifiedComment,
    setAdvanceDirectivesProvidedInfoAcknowledged,
    setAdvanceDirectivesProvidedInfoDate,
    setAdvanceDirectivesRefusingAcknowledged,
    setAdvanceDirectivesProvidedInfoRefusingDate,
    setiAgree,
  } = props;

  return (
    <>
      {page === 1 && (
        <>
          <div ref={componentRef1} className="residentintakes-print">
            <h1 className="pdfTitle w-100 text-center resident-title hidden">
              General Consent for Treatment
            </h1>
            <Card body className="mb-3">
              <Row className="mb-3">
                <Col xs={12}>
                  <Form.Label>
                    I voluntarily apply for evaluation/behavioral health
                    treatment at {companyName} and understand, consent and agree
                    as follows (to be executed by legally authorized person if
                    the Resident is incapable of giving informed consent):
                  </Form.Label>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={12}>
                  <ul className="list-decimal ps-3">
                    <li className="mb-2 text-sm">
                      I agree to participate in my treatment to the best of my
                      ability and will let my provider know if situations occur
                      that prevent me from participating in treatment.
                    </li>
                    <li className="mb-2 text-sm">
                      I understand that this consent will remain valid so long
                      as I am admitted in this facility, or until I withdraw
                      consent.
                    </li>
                    <li className="mb-2 text-sm">
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
                      {companyName} and/or it’s subcontracted providers
                      concerning the provision of covered services.
                    </li>
                    <li className="mb-2 text-sm">
                      I consent to the use and disclosure of my protected health
                      information (PHI) by {companyName}, it’s staff members and
                      it’s contractors / interns for the purpose of treatment,
                      payment and health care operations. This is a joint
                      consent form between {companyName} and it’s staff members.
                      I understand the following: My signature on the consent is
                      required in order for me to receive care from{" "}
                      {companyName}, I have the right to revoke this consent, in
                      writing, at any time, except to the extent that{" "}
                      {companyName} has taken action in reliance upon this
                      consent.
                    </li>
                    <li className="mb-2 text-sm">
                      I understand that services include counseling, assessment,
                      treatment planning, non-emergency transportation,
                      medication services, care coordination, and personal care
                      (only if the facility is approved for PCS). I agree to
                      participate in treatment to the best of my ability.
                    </li>
                    <li className="mb-2 text-sm">
                      However, confidential information may be disclosed without
                      my consent in accordance with state and federal law.
                    </li>
                    <li className="mb-2 text-sm">
                      I understand that this Consent to treatment is voluntary,
                      and I may decline at any time.
                    </li>
                  </ul>
                </Col>
              </Row>
              <Row className="mb-3 flex flex-col">
                <Col>
                  <Form.Check
                    inline
                    label="I Agree to the Terms & Conditions"
                    disabled={
                      patientDetail?.userType === ROLES.EMPLOYEE ? true : false
                    }
                    type="checkbox"
                    checked={iAgree === true}
                    onChange={() => setiAgree(true)}
                  />
                </Col>
                <Col>
                  <Form.Check
                    inline
                    label="I disagree to the Terms & Conditions"
                    disabled={
                      patientDetail?.userType === ROLES.EMPLOYEE ? true : false
                    }
                    type="checkbox"
                    checked={iAgree === false}
                    onChange={() => setiAgree(false)}
                  />
                </Col>
              </Row>
            </Card>
            <Row>
              <Col xs={12} md={6}>
                {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): SAVED AND SIGNED button moved to page 11 only.
                             <Button
                              className="theme-button hide-print-btn me-2"
                              type="button"
                              onClick={() => setSigInModel1(!signInModel1)}
                             >
                              SAVED AND SIGNED
                             </Button>
                             */}
              </Col>
              <Col xs={12} md={6}>
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
            <div className="form-actions-next  resident-btn">
              {page !== 1 && (
                <div>
                  <Button
                    className="theme-button hidePrint"
                    onClick={handlePrevPage}
                  >
                    Prev Page
                  </Button>
                </div>
              )}

              {page !== 11 && (
                <div>
                  <Button
                    className="theme-button hidePrint"
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

      {/* section 2 */}
      {page === 2 && (
        <>
          <div ref={componentRef2} className="residentintakes-print">
            <h1 className="pdfTitle w-100 text-center resident-title hidden">
              Internal Resident Disclosure List
            </h1>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} md={12}>
                  <Form.Label>
                    I authorize and agree that{" "}
                    <span className="mx-1">{companyName} </span> sssad may
                    verbally disclose my protected health information (PHI) to
                    the following family members, individuals and / or
                    significant others in my life each of whom is directly
                    involved in my care and are concerned about my well being
                    specifically for the purpose of coordinating care issues
                    either in person or on the telephone.
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12}>
                  <Form.Label>
                    I authorize and agree that{" "}
                    <span className="mx-1">{companyName} </span>
                    may acknowledge and accept telephone calls from the
                    following family members, individuals and / All significant
                    others in my life each of whom is directly involved in my
                    care and are concerned about my well being who may want to
                    talk to me while at{" "}
                    <span className="mx-1">{companyName}</span>
                  </Form.Label>
                </Col>
              </Row>
            </Card>
            <Row>
              <Col xs={12} md={12}>
                {internalDisclosureList.length > 0 && (
                  <Table responsive bordered>
                    <thead>
                      <tr>
                        <th>Name of Person</th>
                        <th>Relationship</th>
                        <th>Contact</th>
                        <th className="hidePrint">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {internalDisclosureList?.map((i, index) => (
                        <tr>
                          <td>{` ${i.personName}`} </td>
                          <td>{` ${i.relationship}`} </td>
                          <td>{` ${i.contactNumber}`} </td>
                          <td className="hidePrint">
                            {
                              <div className="icon-joiner">
                                <Link
                                  className={
                                    patientDetail?.userType === ROLES.PATIENT ||
                                    patientDetail?.userType === ROLES.GUARDIAN
                                      ? "del-btn pe-none"
                                      : "del-btn"
                                  }
                                  onClick={() =>
                                    handleDeleteArrayInternalDisclosure(index)
                                  }
                                >
                                  <AiFillDelete />
                                </Link>
                              </div>
                            }{" "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={12} md={12}>
                <Form.Label>
                  I acknowledge and agree that{" "}
                  <span className="mx-1">{companyName}</span>
                  may disclose my protected health information to the person(s)
                  set forth in this form. I understand that I can revoke this
                  authorization in writing, except to the extent that action has
                  already been taken, at any time and it will expire on{" "}
                  {internalDisclosureListExpire}
                  or one year from the date of my signature.{" "}
                </Form.Label>
              </Col>
            </Row>

            <Row>
              <Col xs={12} md={6}>
                <div className="d-flex">
                  {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): SAVED AND SIGNED button moved to page 11 only.
                               <Button
                                className="theme-button hide-print-btn me-2"
                                type="button"
                                onClick={() => setSignInModel2(!signInModel2)}
                               >
                                SAVED AND SIGNED
                               </Button>
                               */}
                </div>
              </Col>
              <Col xs={12} md={6}>
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

            <div className="form-actions-next  resident-btn">
              {page !== 1 && (
                <div>
                  <Button
                    type="button"
                    className="theme-button hidePrint"
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
                    className="theme-button hidePrint"
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
          <div ref={componentRef2} className="residentintakes-print">
            <h1 className="pdfTitle w-100 text-center resident-title hidden">
              R9-10-711. Resident Rights
            </h1>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} md={12}>
                  <div className="Residentrights">
                    <p>A. An administrator shall ensure that:</p>
                    <p>
                      1. The requirements in subsection (B) and the resident
                      rights in subsection (E) are conspicuously posted on the
                      premises;
                    </p>
                    <p>
                      2. At the time of admission, a resident or the resident 's
                      representative receives a written copy of the requirements
                      in subsection (B) and the resident rights in subsection
                      (E); and
                    </p>
                    <p>3. Policies and procedures include:</p>
                    <p>
                      a. How and when a resident or the resident’s
                      representative is informed of the resident rights in
                      subsection (E), and
                    </p>
                    <p>
                      b. Where resident rights are posted as required in
                      subsection (A)(1).
                    </p>
                    <p>B. An administrator shall ensure that:</p>
                    <p>
                      1. A resident is treated with dignity, respect, and
                      consideration;
                    </p>
                    <p>2. A resident is not subjected to:</p>
                    <p>a. Abuse;</p>
                    <p>b. Neglect;</p>
                    <p>c. Exploitation;</p>
                    <p>d. Coercion;</p>
                    <p>e. Manipulation;</p>
                    <p>f. Sexual abuse;</p>
                    <p>g. Sexual assault;</p>
                    <p>h. Seclusion;</p>
                    <p>i. Restraint;</p>
                    <p>
                      j. Retaliation for submitting a complaint to the
                      Department or another entity;
                    </p>
                    <p>
                      k. Misappropriation of personal and private property by
                      the behavioral health residential facility’s personnel
                      members, employees, volunteers, or students;
                    </p>
                    <p>
                      l. Discharge or transfer, or threat of discharge or
                      transfer, for reasons unrelated to the resident’s
                      treatment needs, except as established in a fee agreement
                      signed by the resident or the resident 's representative;
                      or
                    </p>
                    <p>m. Treatment that involves the denial of:</p>
                    <p>i. Food,</p>
                    <p>ii. The opportunity to sleep, or</p>
                    <p>iii. The opportunity to use the toilet;</p>
                    <p>
                      3. Except as provided in subsection (C) or (D), and unless
                      restricted by the resident’s representative, is allowed
                      to:
                    </p>
                    <p>
                      a. Associate with individuals of the resident’s choice,
                      receive visitors, and make telephone calls during the
                      hours established by the behavioral health residential
                      facility;
                    </p>
                    <p>
                      b. Have privacy in correspondence, communication,
                      visitation, financial affairs, and personal hygiene; and
                    </p>
                    <p>
                      c. Unless restricted by a court order, send and receive
                      uncensored and unopened mail; and
                    </p>
                    <p>4. A resident or the resident's representative:</p>
                    <p>
                      a. Except in an emergency, either consents to or refuses
                      treatment;
                    </p>
                    <p>
                      b. May refuse or withdraw general consent for treatment
                      before treatment is initiated, unless the treatment is
                      ordered by a ourt according to A.R.S. Title 36, Chapter;
                    </p>
                    <p>
                      5 or A.R.S. 8-341.01; is necessary to save the resident’s
                      life or physical health; or is provided according to
                      A.R.S. § 36-512;
                    </p>
                    <p>
                      c. Except in an emergency, is informed of proposed
                      treatment alternatives, associated risks, and possible
                      complications;
                    </p>
                    <p>d. Is informed of the following:</p>
                    <p>
                      i. The behavioral health residential facility’s policy on
                      health care directives, and
                    </p>
                    <p>ii. The resident complaint process; and</p>
                    <p>
                      e. Except as otherwise permitted by law, provides written
                      consent to the release of information in the resident’s:
                    </p>
                    <p>i. Medical record, or</p>
                    <p>ii. Financial records.</p>
                    <p>
                      C. For a behavioral health residential facility with
                      licensed capacity of less than 10 residents, if a
                      behavioral health professional determines that a
                      resident’s treatment requires the behavioral health
                      residential facility to restrict the resident’s ability to
                      participate in the activities in subsection (B)(3), the
                      behavioral health professional shall:
                    </p>
                    <p>
                      1. Document a specific treatment purpose in the resident’s
                      medical record that justifies restricting the resident
                      from the activity,
                    </p>
                    <p>
                      2. Inform the resident or resident’s representative of the
                      reason why the activity is being restricted, and
                    </p>
                    <p>
                      3. Inform the resident or resident’s representative of the
                      resident’s right to file a complaint and the procedure for
                      filing a complaint.
                    </p>
                    <p>
                      D. For a behavioral health residential facility with a
                      licensed capacity of 10 or more residents, if a clinical
                      director determines that a resident’s treatment requires
                      the behavioral health residential facility to restrict the
                      resident’s ability to participate in the activities in
                      subsection (B)(3), the clinical director shall comply with
                      the requirements in subsections (C)(1) through (3).
                    </p>
                    <p>E. A resident has the following rights:</p>
                    <p>
                      1. Not to be discriminated against based on race, national
                      origin, religion, gender, sexual orientation, age,
                      disability, marital status, or diagnosis;
                    </p>
                    <p>2. To receive treatment that:</p>
                    <p>
                      a. Supports and respects the resident’s individuality,
                      choices, strengths, and abilities;
                    </p>
                    <p>
                      b. Supports the resident’s personal liberty and only
                      restricts the resident’s personal liberty according to a
                      court order, by the resident’s or the resident’s
                      representative’s general consent, or as permitted in this
                      Chapter; and
                    </p>
                    <p>
                      c. Is provided in the least restrictive environment that
                      meets the resident’s treatment needs;
                    </p>
                    <p>
                      3. To receive privacy in treatment and care for personal
                      needs, including the right not to be fingerprinted,
                      photographed, or recorded without consent, except:
                    </p>
                    <p>
                      a. A resident may be photographed when admitted to a
                      behavioral health residential facility for identification
                      and administrative purposes
                    </p>
                    <p>
                      b. For a resident receiving treatment according to A.R.S.
                      Title 36, Chapter 37; or
                    </p>
                    <p>
                      c. For video recordings used for security purposes that
                      are maintained only on a temporary basis;
                    </p>
                    <p>
                      4. Not to be prevented or impeded from exercising the
                      resident’s civil rights unless the resident has been
                      adjudicated incompetent or a court of competent
                      jurisdiction has found that the resident is not able to
                      exercise a specific right or category of rights;
                    </p>
                    <p>
                      5. To review, upon written request, the resident’s own
                      medical record according to A.R.S. §§12-2293, 12-2294, and
                      12-2294.01;
                    </p>
                    <p>
                      6. To be provided locked storage space for the resident’s
                      belongings while the resident receives treatment;
                    </p>
                    <p>
                      7. To have opportunities for social contact and daily
                      social, recreational, or rehabilitative activities;
                    </p>
                    <p>
                      8. To be informed of the requirements necessary for the
                      resident’s discharge or transfer to a less restrictive
                      physical environment;
                    </p>
                    <p>
                      9. To receive a referral to another health care
                      institution if the behavioral health residential facility
                      is not authorized or not able to provide physical health
                      services or behavioral health services needed by the
                      resident;
                    </p>
                    <p>
                      10. To participate or have the resident's representative
                      participate in the development of a behavioral health
                      treatment plan or decisions concerning treatment;
                    </p>
                    <p>
                      11. To participate or refuse to participate in research or
                      experimental treatment.
                    </p>
                    <p>
                      12. To receive assistance from a family member, the
                      resident’s representative, or other individual in
                      understanding, protecting, or exercising the resident’s
                      right
                    </p>
                  </div>
                </Col>
              </Row>
            </Card>

            <Row>
              <Col xs={12} md={6}>
                <div className="d-flex">
                  {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): SAVED AND SIGNED button moved to page 11 only.
                               <Button
                                className="theme-button hide-print-btn me-2"
                                type="button"
                                onClick={() => setSignInModel3(!signInModel3)}
                               >
                                SAVED AND SIGNED
                               </Button>
                               */}
                </div>
              </Col>
              <Col xs={12} md={6}>
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

            <div className="form-actions-next  resident-btn">
              {page !== 1 && (
                <div>
                  <Button
                    type="button"
                    className="theme-button hidePrint"
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
                    className="theme-button hidePrint"
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
          <div ref={componentRef3} className="residentintakes-print">
            <h1 className="pdfTitle w-100 text-center hidden">
              PHOTO/VIDEO CONSENT FORM
            </h1>

            <Row>
              <Col xs={12} md={12}>
                <Form.Label className="fw-bold hidePrint">
                  Consent to appear in photographs and videotapes. Internal use
                  only.
                </Form.Label>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={12} sm={12} md={4} lg={4}>
                <div className="view-details-grid resident-name-print my-1 my-md-2 p-3">
                  <p className="view-label increse-size mb-1">
                    Resident Name :{" "}
                  </p>
                  <h5 className="view-value increse-size mb-0">
                    {`${getApiData?.patientId?.firstName} ${getApiData?.patientId?.lastName}`}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={6} md={4} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date of Birth : </p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(photoVideoConsentDateOfBirth)}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={6} md={4} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Admit Date : </p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(photoVideoConsentAdmissionDate)}
                  </h5>
                </div>
              </Col>
            </Row>

            <Card body className="mb-3">
              <Row>
                <Col xs={12} md={12}>
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
              <Row>
                <Col xs={12} md={12}>
                  <Form.Label>
                    Consent to appear in photographs and videotapes. Internal
                    use only.
                  </Form.Label>
                  <br />
                  <Form.Check
                    inline
                    label="I DO give consent to appear in photographs and videotapes."
                    type="checkbox"
                    disabled={
                      patientDetail?.userType === ROLES.EMPLOYEE ? true : false
                    }
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
                    disabled={
                      patientDetail?.userType === ROLES.EMPLOYEE ? true : false
                    }
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

            <Row>
              <Col xs={12} md={6}>
                <div className="d-flex">
                  {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): SAVED AND SIGNED button moved to page 11 only.
                               <Button
                                className="theme-button hide-print-btn me-2"
                                type="button"
                                onClick={() => setSigInModel4(!signInModel4)}
                               >
                                SAVED AND SIGNED
                               </Button>
                               */}
                </div>
              </Col>
              <Col xs={12} md={6}>
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

            <Row className="mb-3"></Row>

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

      {/* section 5 */}
      {page === 5 && (
        <>
          <div ref={componentRef4} className="residentintakes-print">
            <h1 className="pdfTitle w-100 text-center hidden">
              Advance Directives Form
            </h1>
            <Form.Label className="fw-bold hidePrint">
              THIS FORM MUST BE COMPLETED AND PROMINENTLY DISPLAYED IN THE
              MEMBER MEDICAL RECORD
            </Form.Label>

            <Row className="mb-3">
              <Col xs={12} sm={6} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Resident Name : </p>
                  <h5 className="view-value mb-0">
                    {`${getApiData?.patientId?.firstName} ${getApiData?.patientId?.lastName}`}
                  </h5>
                </div>
              </Col>

              <Col xs={12} sm={6} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date of Birth : </p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(advanceDirectivesResidentDateOfBirth)}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={6} md={6} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date : </p>
                  <h5 className="view-value mb-0">
                    {formatDateToMMDDYYYY(advanceDirectivesResidentDate)}
                  </h5>
                </div>
              </Col>
              <Col xs={12} sm={6} md={12} lg={6}>
                <div className="view-details-grid my-1 my-md-2 p-3 align-items-center">
                  <p className="view-label mb-1">Select Gender : </p>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      label="Male"
                      disabled
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
                      disabled
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
                      disabled
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
                </div>
              </Col>
              <Col xs={12} sm={6} md={12} lg={6}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Address : </p>
                  <h5 className="view-value mb-0">
                    {advanceDirectivesResidentAddress}
                  </h5>
                </div>
              </Col>
            </Row>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} md={12}>
                  <Form.Label className="w-100 fw-bold">
                    Advance Directives Information
                  </Form.Label>
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
                    {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): Member initials replaced with checkbox toggle above. */}
                    {/* Member initials{" "}
                                 <span className="mx-1">
                                  <AutoSize value={advanceDirectivesProvidedInfoInitials} setValue={setAdvanceDirectivesProvidedInfoInitials} placeholder={"____________"} />
                                 </span> */}
                    Date{" "}
                    <span className="mx-1">
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
                    {/* Member initials{" "}
                                 <span className="mx-1">
                                  <AutoSize value={advanceDirectivesProvidedInfoRefusingInitials} setValue={setAdvanceDirectivesProvidedInfoRefusingInitials} placeholder={"____________"} />
                                 </span> */}
                    Date{" "}
                    <span className="mx-1">
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
            <Form.Label className="fw-bold">
              Advance Directives Development
            </Form.Label>
            <Row>
              <Col xs={12} sm={12} md={12}>
                <div className="view-details-grid my-1 my-md-2 p-3 d-md-flex align-items-md-center">
                  <p className="view-label mb-1">
                    Resident has developed an Advanced Directive :{" "}
                  </p>
                  <div className="radio-inline">
                    <Form.Check
                      inline
                      disabled={
                        patientDetail?.userType === ROLES.EMPLOYEE ||
                        patientDetail?.userType === ROLES.PATIENT ||
                        patientDetail?.userType === ROLES.GUARDIAN
                          ? true
                          : false
                      }
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
                      disabled={
                        patientDetail?.userType === ROLES.EMPLOYEE ||
                        patientDetail?.userType === ROLES.PATIENT ||
                        patientDetail?.userType === ROLES.GUARDIAN
                          ? true
                          : false
                      }
                      label="No"
                      type="checkbox"
                      id="noRadio"
                      name="option"
                      value="no"
                      checked={advanceDirectivesDeveloped === "no"}
                      onChange={() => setAdvanceDirectivesDeveloped("no")}
                    />
                  </div>
                  {advanceDirectivesDeveloped === "no" && (
                    <span className="view-value">
                      {" "}
                      {advanceDirectivesDevelopedComment}
                    </span>
                  )}
                </div>
              </Col>
            </Row>

            <Form.Label className="fw-bold">
              If No, stop and let Resident know that assistance in developing an
              Advanced Directive is available.
            </Form.Label>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} sm={12} md={12}>
                  <div className="view-details-grid-inline mb-2">
                    <Form.Label className="hidePrint me-2">
                      If the Advanced Directive has been executed (developed),
                      is it in the BHRF medical record? :
                    </Form.Label>
                    <div className="radio-inline">
                      <Form.Check
                        inline
                        disabled={
                          patientDetail?.userType === ROLES.EMPLOYEE ||
                          patientDetail?.userType === ROLES.PATIENT ||
                          patientDetail?.userType === ROLES.GUARDIAN ||
                          patientDetail?.userType === ROLES.ADMIN
                            ? true
                            : false
                        }
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
                        disabled={
                          patientDetail?.userType === ROLES.EMPLOYEE ||
                          patientDetail?.userType === ROLES.PATIENT ||
                          patientDetail?.userType === ROLES.GUARDIAN ||
                          patientDetail?.userType === ROLES.ADMIN
                            ? true
                            : false
                        }
                        label="No"
                        type="checkbox"
                        id="noCheckbox"
                        checked={advanceDirectivesExecutedInRecord === "no"}
                        onChange={() =>
                          setAdvanceDirectivesExecutedInRecord("no")
                        }
                      />
                      {advanceDirectivesExecutedInRecord === "no" && (
                        <span className="view-value">
                          {advanceDirectivesExecutedInRecordComment}
                        </span>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <div className="view-details-grid-inline mb-2">
                    <Form.Label className="w-100">
                      If the Advanced Directive has been executed, but not filed
                      in the BHRF medical record, please check the applicable
                      box below :
                    </Form.Label>
                  </div>
                  <div className="yeschechbox2">
                    <Form.Check
                      inline
                      type="checkbox"
                      disabled={
                        patientDetail?.userType === ROLES.EMPLOYEE ||
                        patientDetail?.userType === ROLES.PATIENT ||
                        patientDetail?.userType === ROLES.GUARDIAN ||
                        patientDetail?.userType === ROLES.ADMIN
                          ? true
                          : false
                      }
                      id="exampleCheckbox"
                      checked={advanceDirectivesFilingStatusWishNotFiled}
                      onChange={() =>
                        setAdvanceDirectivesFilingStatusWishNotFiled(
                          !advanceDirectivesFilingStatusWishNotFiled,
                        )
                      }
                    />
                    <Form.Label
                      className="w-100 mb-[5px]"
                      htmlFor="advanceDirectivesFilingStatusWishNotFiled"
                    >
                      Resident does not wish to have it filed in his/her medical
                      record.
                    </Form.Label>
                  </div>
                  <div className="yeschechbox2">
                    <Form.Check
                      inline
                      type="checkbox"
                      disabled={
                        patientDetail?.userType === ROLES.EMPLOYEE ||
                        patientDetail?.userType === ROLES.PATIENT ||
                        patientDetail?.userType === ROLES.GUARDIAN ||
                        patientDetail?.userType === ROLES.ADMIN
                          ? true
                          : false
                      }
                      id="exampleCheckbox"
                      checked={
                        advanceDirectivesFilingStatusAskedForCopyNotProvided
                      }
                      onChange={() =>
                        setAdvanceDirectivesFilingStatusAskedForCopyNotProvided(
                          !advanceDirectivesFilingStatusAskedForCopyNotProvided,
                        )
                      }
                    />
                    <Form.Label className="mb-[5px]">
                      BHRF has asked for a copy, but it has not been provided.
                    </Form.Label>
                  </div>
                  <div className="yeschechbox2">
                    <Form.Check
                      inline
                      type="checkbox"
                      disabled={
                        patientDetail?.userType === ROLES.EMPLOYEE ||
                        patientDetail?.userType === ROLES.PATIENT ||
                        patientDetail?.userType === ROLES.GUARDIAN ||
                        patientDetail?.userType === ROLES.ADMIN
                          ? true
                          : false
                      }
                      id="exampleCheckbox"
                      checked={advanceDirectivesFilingStatusOther}
                      onChange={() =>
                        setAdvanceDirectivesFilingStatusOther(
                          !advanceDirectivesFilingStatusOther,
                        )
                      }
                    />
                    <Form.Label className="mb-[5px]">Other</Form.Label>
                  </div>

                  <div className="yeschechbox2">
                    <div>
                      <Form.Label>
                        To facilitate coordination of care :{" "}
                      </Form.Label>
                    </div>
                  </div>
                  <div className="view-details-grid-inline mb-2">
                    <Form.Label>
                      Has a copy of an executed Advanced Directive or refusal
                      been sent to the Member’s Primary Care Physician? :
                    </Form.Label>
                    <div className="radio-inline">
                      <Form.Check
                        inline
                        type="checkbox"
                        disabled={
                          patientDetail?.userType === ROLES.EMPLOYEE ||
                          patientDetail?.userType === ROLES.ADMIN ||
                          patientDetail?.userType === ROLES.GUARDIAN ||
                          patientDetail?.userType === ROLES.PATIENT
                            ? true
                            : false
                        }
                        id="yesCheckbox"
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
                        disabled={
                          patientDetail?.userType === ROLES.EMPLOYEE ||
                          patientDetail?.userType === ROLES.PATIENT ||
                          patientDetail?.userType === ROLES.GUARDIAN ||
                          patientDetail?.userType === ROLES.ADMIN
                            ? true
                            : false
                        }
                        id="noCheckbox"
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
                  </div>
                  <div className="view-details-grid-inline mb-2">
                    <Form.Label>
                      Has the Advance Directive document ever been acted on? :
                    </Form.Label>
                    <div className="radio-inline">
                      <Form.Check
                        inline
                        type="checkbox"
                        disabled={
                          patientDetail?.userType === ROLES.EMPLOYEE ||
                          patientDetail?.userType === ROLES.PATIENT ||
                          patientDetail?.userType === ROLES.GUARDIAN ||
                          patientDetail?.userType === ROLES.ADMIN
                            ? true
                            : false
                        }
                        id="yesCheckbox"
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
                        disabled={
                          patientDetail?.userType === ROLES.EMPLOYEE ||
                          patientDetail?.userType === ROLES.PATIENT ||
                          patientDetail?.userType === ROLES.GUARDIAN ||
                          patientDetail?.userType === ROLES.ADMIN
                            ? true
                            : false
                        }
                        id="noCheckbox"
                        checked={
                          advanceDirectivesCoordinationOfCareActedOn === "no"
                        }
                        onChange={() =>
                          setAdvanceDirectivesCoordinationOfCareActedOn("no")
                        }
                        label="No"
                      />
                    </div>
                  </div>
                  <div className="view-details-grid-inline mb-2">
                    <Form.Label>
                      If Yes, have all appropriate parties been notified? :
                    </Form.Label>
                    <div className="radio-inline">
                      <Form.Check
                        inline
                        type="checkbox"
                        disabled={
                          patientDetail?.userType === ROLES.EMPLOYEE ||
                          patientDetail?.userType === ROLES.PATIENT ||
                          patientDetail?.userType === ROLES.GUARDIAN ||
                          patientDetail?.userType === ROLES.ADMIN
                            ? true
                            : false
                        }
                        id="yesCheckbox"
                        checked={
                          advanceDirectivesCoordinationOfCareAppropriatePartiesNotified ===
                          "yes"
                        }
                        onChange={() =>
                          setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotified(
                            "yes",
                          )
                        }
                        label="Yes (Specify who)"
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

                      <Form.Check
                        inline
                        type="checkbox"
                        id="noCheckbox"
                        disabled={
                          patientDetail?.userType === ROLES.EMPLOYEE ||
                          patientDetail?.userType === ROLES.PATIENT ||
                          patientDetail?.userType === ROLES.GUARDIAN ||
                          patientDetail?.userType === ROLES.ADMIN
                            ? true
                            : false
                        }
                        checked={
                          advanceDirectivesCoordinationOfCareAppropriatePartiesNotified ===
                          "no"
                        }
                        onChange={() =>
                          setAdvanceDirectivesCoordinationOfCareAppropriatePartiesNotified(
                            "no",
                          )
                        }
                        label="No (Describe why)"
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
              <Col xs={12} md={6}>
                <div className="d-flex">
                  {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): SAVED AND SIGNED button moved to page 11 only.
                               <Button
                                className="theme-button hide-print-btn me-2"
                                type="button"
                                onClick={() => setSigInModel5(!signInModel5)}
                               >
                                SAVED AND SIGNED
                               </Button>
                               */}
                </div>
              </Col>
              <Col xs={12} md={6}>
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
    </>
  );
};

export default ResidentIntakesContentPart1;
