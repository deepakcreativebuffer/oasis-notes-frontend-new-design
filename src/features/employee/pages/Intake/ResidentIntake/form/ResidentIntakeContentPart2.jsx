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

const ResidentIntakeContentPart2 = (props) => {
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
    setComplaintProcessAcknowledgementCompany,
    setOrientationToAgencyCompany,
    setReceiptName,
    setHouseRulesAcknowledgementName,
    lockBoxKeyIssueReturnDateKeyIssued,
    setLockBoxKeyIssueReturnDateKeyIssued,
    lockBoxKeyIssueReturnDateKeyReturned,
    setLockBoxKeyIssueReturnDateKeyReturned,
    setLockBoxKeyIssueReturnAddress,
    lockBoxKeyIssueReturnResponsibleFor,
    setLockBoxKeyIssueReturnResponsibleFor,
    lockBoxKeyIssueReturnResponsibleForCorporation,
    setLockBoxKeyIssueReturnResponsibleForCorporation,
    setPrimaryInsurance,
    insuranceInformationPrimaryInsurancePolicyholderName,
    setInsuranceInformationPrimaryInsurancePolicyholderName,
    insuranceInformationPrimaryInsurancePolicyholderDateOfBirth,
    setInsuranceInformationPrimaryInsurancePolicyholderDateOfBirth,
    insuranceInformationPrimaryInsurancePolicyholderAddress,
    setInsuranceInformationPrimaryInsurancePolicyholderAddress,
    insuranceInformationPrimaryInsurancePolicyholderCity,
    setInsuranceInformationPrimaryInsurancePolicyholderCity,
    insuranceInformationPrimaryInsurancePolicyholderState,
    setInsuranceInformationPrimaryInsurancePolicyholderState,
    insuranceInformationPrimaryInsurancePolicyholderZip,
    setInsuranceInformationPrimaryInsurancePolicyholderZip,
    insuranceInformationPrimaryInsurancePolicyholderPhone,
    setInsuranceInformationPrimaryInsurancePolicyholderPhone,
    insuranceInformationPrimaryInsurancePolicyholderRelationship,
    setInsuranceInformationPrimaryInsurancePolicyholderRelationship,
    insuranceInformationPrimaryInsuranceCompany,
    setInsuranceInformationPrimaryInsuranceCompany,
    insuranceInformationPrimaryInsuranceCustomerServicePhone,
    setInsuranceInformationPrimaryInsuranceCustomerServicePhone,
    insuranceInformationPrimaryInsuranceSubscriberNumber,
    setInsuranceInformationPrimaryInsuranceSubscriberNumber,
    insuranceInformationPrimaryInsuranceSubscriberGroup,
    setInsuranceInformationPrimaryInsuranceSubscriberGroup,
    insuranceInformationPrimaryInsuranceSubscriberEffectiveDate,
    setInsuranceInformationPrimaryInsuranceSubscriberEffectiveDate,
    insuranceInformationSecondaryInsurancePolicyholderName,
    setInsuranceInformationSecondaryInsurancePolicyholderName,
    insuranceInformationSecondaryInsurancePolicyholderDateOfBirth,
    setInsuranceInformationSecondaryInsurancePolicyholderDateOfBirth,
    insuranceInformationSecondaryInsurancePolicyholderAddress,
    setInsuranceInformationSecondaryInsurancePolicyholderAddress,
    insuranceInformationSecondaryInsurancePolicyholderCity,
    setInsuranceInformationSecondaryInsurancePolicyholderCity,
    insuranceInformationSecondaryInsurancePolicyholderState,
    setInsuranceInformationSecondaryInsurancePolicyholderState,
    insuranceInformationSecondaryInsurancePolicyholderZip,
    setInsuranceInformationSecondaryInsurancePolicyholderZip,
    insuranceInformationSecondaryInsurancePolicyholderPhone,
    setInsuranceInformationSecondaryInsurancePolicyholderPhone,
    insuranceInformationSecondaryInsurancePolicyholderRelationship,
    setInsuranceInformationSecondaryInsurancePolicyholderRelationship,
    insuranceInformationSecondaryInsuranceCompany,
    setInsuranceInformationSecondaryInsuranceCompany,
    insuranceInformationSecondaryInsuranceCustomerServicePhone,
    setInsuranceInformationSecondaryInsuranceCustomerServicePhone,
    insuranceInformationSecondaryInsuranceSubscriberNumber,
    setInsuranceInformationSecondaryInsuranceSubscriberNumber,
    insuranceInformationSecondaryInsuranceSubscriberGroup,
    setInsuranceInformationSecondaryInsuranceSubscriberGroup,
    insuranceInformationSecondaryInsuranceSubscriberEffectiveDate,
    setInsuranceInformationSecondaryInsuranceSubscriberEffectiveDate,
    verbalConsentResidentRepresentative,
    setVerbalConsentResidentRepresentative,
    guardTyped,
    setLockBoxKeyIssueReturnCharged,
    setSigners,
  } = props;

  return (
    <>
      {page === 6 && (
        <>
          <div className="print-content increase-print-width">
            <h1 className="pdfTitle mb-0 mt-2 hidden">
              Acknowledgement Of Complaint Process
            </h1>
            <div className="grid-item long-input resident-details print-d-block my-2 print-border-bottom hidden">
              <span className="increse-size fw-bold">Resident Name: </span>
              <span className="increse-size">{residentName}</span>
            </div>

            <Card body className="mb-3">
              <h6 className="fw-bold">Acknowledgement Of Complaint Process</h6>
              <Row>
                <Col xs={12} lg={8}>
                  <Form.Group>
                    <Form.Label>
                      I,{" "}
                      <span>
                        <AutoSize
                          value={
                            residentName ||
                            `${getApiData?.data?.patientId?.firstName} ${getApiData?.data?.patientId?.lastName}   ` ||
                            ""
                          }
                          setValue={setComplaintProcessAcknowledgementCompany}
                          placeholder={"____________"}
                        />
                      </span>
                      have been explained by facility staff of the facility
                      resident complaint process. Resident/Guardian understands
                      that they have the right to file complaint with the
                      facilities, and with the Arizona Department of Residential
                      Licensing when complaint can not be resolved with the
                      facility.
                    </Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      Bureau of Behavioral Health Facilities Licensing
                    </Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>150 N. 18th Ave, Suite 420</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Phoenix AZ, 85007</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      <a
                        target="_blank"
                        href="mailto:BehavioralHealth.Licensing@azdhs.gov"
                        rel="noopener noreferrer"
                      >
                        Behavioral Health.Licensing@azdhs.gov
                      </a>
                    </Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Phone Number : 602-542-3422</Form.Label>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      By signing below, resident acknowledge to have been
                      informed of the complaint process.
                    </Form.Label>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
            <Row className="flex items-start">
              <Col xs={12} lg={6}>
                {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): SAVED AND SIGNED button moved to page 11 only.
                         <Button
                          className={`theme-button hide-print-btn me-2 ${
                            isNotEditableWithSigner && "pointer-events-auto"
                          }`}
                          type="button"
                          onClick={() => guardTyped(() => setSigInModel12(true))}
                         >
                          SAVED AND SIGNED
                         </Button>
                         */}
              </Col>
              <Col xs={12} lg={6} className="text-end">
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

            <div className="form-actions-next hidePrint">
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

      {/* section 7 */}
      {page === 7 && (
        <>
          <div className="print-content increase-print-width">
            <h1 className="pdfTitle mb-0 mt-2 hidden">Orientation To Agency</h1>
            <div className="grid-item long-input resident-details print-d-block my-2 print-border-bottom hidden">
              <span className="increse-size fw-bold">Resident Name: </span>
              <span className="increse-size">{residentName}</span>
            </div>

            <Card body className="mb-3">
              <h6 className="fw-bold">ORIENTATION TO AGENCY</h6>
              <Row>
                <Col xs={12} lg={12}>
                  <Form.Label>
                    I,
                    <span>
                      <AutoSize
                        value={
                          residentName ||
                          `${fetchPaitentName(getApiData?.data?.patientId)}`
                        }
                        setValue={setOrientationToAgencyCompany}
                        placeholder={"____________"}
                      />
                    </span>
                    received an orientation by facility by staff. The
                    orientation included but not limited to the following:
                  </Form.Label>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={12} lg={12}>
                  <CustomMultiSelectInput
                    isMulti
                    options={optionValue}
                    value={ORIENTATIONDropDown}
                    onChange={optionHandler}
                    isCreatable={true}
                    onKeyDown={handleKeyDownORIENTATIONDropDown}
                    className="print-pad-0 print-border-hide"
                  />
                </Col>
              </Row>
            </Card>
            <Row className="flex items-start mt-3">
              <Col xs={12} lg={6}>
                {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): SAVED AND SIGNED button moved to page 11 only.
                         <Button
                          className={`theme-button hide-print-btn me-2 ${
                            isNotEditableWithSigner && "pointer-events-auto"
                          }`}
                          type="button"
                          onClick={() => guardTyped(() => setSigInModel14(true))}
                         >
                          SAVED AND SIGNED
                         </Button>
                         */}
              </Col>
              <Col xs={12} lg={6} className="text-end">
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

            <div className="form-actions-next hidePrint">
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
      {/* section 8 */}
      {page === 8 && (
        <>
          <div className="print-content increase-print-width">
            <h1 className="pdfTitle mb-0 mt-2 hidden">
              RECEIPT OF INFORMATION AT ADMISSION
            </h1>
            <Card body className="mb-3 mt-3">
              <Row>
                <Col xs={12} lg={12}>
                  <Form.Label>
                    By signing below, I,
                    <span>
                      <AutoSize
                        value={
                          residentName ||
                          `${getApiData?.data?.patientId && fetchPaitentName(getApiData?.data?.patientId)}` ||
                          receiptName
                        }
                        setValue={setReceiptName}
                        placeholder={"____________"}
                      />
                    </span>
                    acknowledge having received the following information:
                  </Form.Label>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={12} lg={12}>
                  <CustomMultiSelectInput
                    isMulti
                    options={receiptOptionValue}
                    value={receiptDropDown}
                    onChange={receiptOptionHandler}
                    isCreatable={true}
                    onKeyDown={handleKeyDownReceiptDropDown}
                    className="print-pad-0 print-border-hide"
                  />
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
                          onClick={() => guardTyped(() => setSigInModel8New(true))}
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

      {/* section 9 — House Rules Acknowledgement (new) */}
      {page === 9 && (
        <>
          <div className="print-content increase-print-width">
            <h1 className="pdfTitle mb-0 mt-2 hidden">
              HOUSE RULES ACKNOWLEDGEMENT
            </h1>
            <Card body className="mb-3 mt-3">
              <Row>
                <Col xs={12} lg={12}>
                  <Form.Label>
                    By signing below, I,
                    <span>
                      <AutoSize
                        value={
                          houseRulesAcknowledgementName ||
                          residentName ||
                          `${getApiData?.data?.patientId && fetchPaitentName(getApiData?.data?.patientId)}` ||
                          ""
                        }
                        setValue={setHouseRulesAcknowledgementName}
                        placeholder={"____________"}
                      />
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
                    onChange={houseRulesOptionHandler}
                    isCreatable={true}
                    onKeyDown={handleKeyDownHouseRulesDropDown}
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

      {/* section 10 — Resident Lock Box (was page 9) */}
      {page === 10 && (
        <>
          <div className="print-content increase-print-width">
            <h1 className="pdfTitle mb-0 mt-2 hidden">
              Resident Lock Box Key Issue and Return Optional
            </h1>
            <div className="grid-item long-input resident-details print-d-block my-2 print-border-bottom hidden">
              <span className="increse-size fw-bold">Resident Name: </span>
              <span className="increse-size">{residentName}</span>
            </div>
            <Card body className="mb-3">
              <h6 className="fw-bold">
                Resident Lock Box Key Issue and Return Optional
              </h6>
              <Row className="mt-3">
                <Col xs={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group d-flex flex-column">
                    <Form.Label className="fw-bold">Date Key Issued</Form.Label>

                    <DatePicker
                      selected={formatDateToMMDDYYYY(
                        lockBoxKeyIssueReturnDateKeyIssued,
                      )}
                      onChange={(selectedDate) =>
                        setLockBoxKeyIssueReturnDateKeyIssued(
                          selectedDate?.toDateString(),
                        )
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            lockBoxKeyIssueReturnDateKeyIssued
                              ? formatDateToMMDDYYYY(
                                  lockBoxKeyIssueReturnDateKeyIssued,
                                )
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group d-flex flex-column">
                    <Form.Label className="fw-bold">
                      Date Key Returned
                    </Form.Label>

                    <DatePicker
                      selected={formatDateToMMDDYYYY(
                        lockBoxKeyIssueReturnDateKeyReturned,
                      )}
                      onChange={(selectedDate) =>
                        setLockBoxKeyIssueReturnDateKeyReturned(
                          selectedDate?.toDateString(),
                        )
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            lockBoxKeyIssueReturnDateKeyReturned
                              ? formatDateToMMDDYYYY(
                                  lockBoxKeyIssueReturnDateKeyReturned,
                                )
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} lg={12}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Address</Form.Label>
                    <Form.Control
                      type="text"
                      value={lockBoxKeyIssueReturnAddress}
                      placeholder="Enter address"
                      required
                      onChange={(e) =>
                        setLockBoxKeyIssueReturnAddress(e.target.value)
                      }
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} lg={12}>
                  <Form.Label>
                    I,{" "}
                    <span>
                      <AutoSize
                        value={
                          residentName ||
                          `${getApiData?.data?.patientId?.firstName} ${getApiData?.data?.patientId?.lastName}`
                        }
                        setValue={setLockBoxKeyIssueReturnResponsibleFor}
                        placeholder={"____________"}
                      />
                    </span>
                    will be responsible for my individual lock box key to
                    <span>
                      <span>
                        <AutoSize
                          value={companyName}
                          setValue={
                            setLockBoxKeyIssueReturnResponsibleForCorporation
                          }
                          placeholder={"____________"}
                        />
                      </span>
                    </span>{" "}
                    Corporation lock box located in my room. I will not give my
                    key to anyone except to staff upon request. I understand
                    that if I loose my key I will be charged a $
                    <span>
                      <span>
                        <AutoSize
                          type="number"
                          value={lockBoxKeyIssueReturnCharged}
                          setValue={setLockBoxKeyIssueReturnCharged}
                          placeholder={"____________"}
                        />
                      </span>
                    </span>{" "}
                    re-key fee. I understand that upon my discharge from this
                    program I will return my key to the program.
                  </Form.Label>
                </Col>
              </Row>
            </Card>
            <Row className="flex items-start">
              <Col xs={12} className="text-end">
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
            <div className="form-actions-next hidePrint">
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

      {/* section 9 */}
      {page === 11 && (
        <>
          <div className="print-content increase-print-width">
            <h1 className="pdfTitle mb-0 mt-2 hidden">Consent for Treatment</h1>
            <div className="grid-item long-input resident-details print-d-block my-2 print-border-bottom hidden">
              <span className="increse-size fw-bold">Resident Name: </span>
              <span className="increse-size">{residentName}</span>
            </div>
            <Card body className="mb-3">
              <Col xs={12} sm={12} lg={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold w-80">
                    Primary Insurance
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setPrimaryInsurance(e.target.value)}
                    value={primaryInsurance}
                    placeholder={""}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Row className="mt-3">
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Name </Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationPrimaryInsurancePolicyholderName(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationPrimaryInsurancePolicyholderName
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group d-flex flex-column">
                    <Form.Label className="fw-bold">Date of Birth</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(
                        insuranceInformationPrimaryInsurancePolicyholderDateOfBirth,
                      )}
                      onChange={(selectedDate) =>
                        setInsuranceInformationPrimaryInsurancePolicyholderDateOfBirth(
                          selectedDate?.toDateString(),
                        )
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            insuranceInformationPrimaryInsurancePolicyholderDateOfBirth
                              ? formatDateToMMDDYYYY(
                                  insuranceInformationPrimaryInsurancePolicyholderDateOfBirth,
                                )
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">City</Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationPrimaryInsurancePolicyholderCity(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationPrimaryInsurancePolicyholderCity
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">State</Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationPrimaryInsurancePolicyholderState(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationPrimaryInsurancePolicyholderState
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Zip</Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationPrimaryInsurancePolicyholderZip(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationPrimaryInsurancePolicyholderZip
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Phone Number</Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationPrimaryInsurancePolicyholderPhone(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationPrimaryInsurancePolicyholderPhone
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Relationship to Resident
                    </Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationPrimaryInsurancePolicyholderRelationship(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationPrimaryInsurancePolicyholderRelationship
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Address (if different than Resident)
                    </Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationPrimaryInsurancePolicyholderAddress(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationPrimaryInsurancePolicyholderAddress
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Insurance Company Name
                    </Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationPrimaryInsuranceCompany(
                          e.target.value,
                        )
                      }
                      value={insuranceInformationPrimaryInsuranceCompany}
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Customer Service Phone Number
                    </Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationPrimaryInsuranceCustomerServicePhone(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationPrimaryInsuranceCustomerServicePhone
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Subscriber #</Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationPrimaryInsuranceSubscriberNumber(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationPrimaryInsuranceSubscriberNumber
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Group# </Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationPrimaryInsuranceSubscriberGroup(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationPrimaryInsuranceSubscriberGroup
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group d-flex flex-column">
                    <Form.Label className="fw-bold">Effective Date </Form.Label>

                    <DatePicker
                      selected={formatDateToMMDDYYYY(
                        insuranceInformationPrimaryInsuranceSubscriberEffectiveDate,
                      )}
                      onChange={(selectedDate) =>
                        setInsuranceInformationPrimaryInsuranceSubscriberEffectiveDate(
                          selectedDate?.toDateString(),
                        )
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            insuranceInformationPrimaryInsuranceSubscriberEffectiveDate
                              ? formatDateToMMDDYYYY(
                                  insuranceInformationPrimaryInsuranceSubscriberEffectiveDate,
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
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Secondary Insurance Name{" "}
                    </Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationSecondaryInsurancePolicyholderName(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationSecondaryInsurancePolicyholderName
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group d-flex flex-column">
                    <Form.Label className="fw-bold">Date of Birth </Form.Label>

                    <DatePicker
                      selected={formatDateToMMDDYYYY(
                        insuranceInformationSecondaryInsurancePolicyholderDateOfBirth,
                      )}
                      onChange={(selectedDate) =>
                        setInsuranceInformationSecondaryInsurancePolicyholderDateOfBirth(
                          selectedDate?.toDateString(),
                        )
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            insuranceInformationSecondaryInsurancePolicyholderDateOfBirth
                              ? formatDateToMMDDYYYY(
                                  insuranceInformationSecondaryInsurancePolicyholderDateOfBirth,
                                )
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Address (if different than Resident)
                    </Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationSecondaryInsurancePolicyholderAddress(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationSecondaryInsurancePolicyholderAddress
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">City</Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationSecondaryInsurancePolicyholderCity(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationSecondaryInsurancePolicyholderCity
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">State</Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationSecondaryInsurancePolicyholderState(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationSecondaryInsurancePolicyholderState
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Zip</Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationSecondaryInsurancePolicyholderZip(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationSecondaryInsurancePolicyholderZip
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Phone Number</Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationSecondaryInsurancePolicyholderPhone(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationSecondaryInsurancePolicyholderPhone
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Relationship to Resident
                    </Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationSecondaryInsurancePolicyholderRelationship(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationSecondaryInsurancePolicyholderRelationship
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Insurance Company Name{" "}
                    </Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationSecondaryInsuranceCompany(
                          e.target.value,
                        )
                      }
                      value={insuranceInformationSecondaryInsuranceCompany}
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">
                      Customer Service Phone Number
                    </Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationSecondaryInsuranceCustomerServicePhone(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationSecondaryInsuranceCustomerServicePhone
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Subscriber #</Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationSecondaryInsuranceSubscriberNumber(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationSecondaryInsuranceSubscriberNumber
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group">
                    <Form.Label className="fw-bold">Group# </Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setInsuranceInformationSecondaryInsuranceSubscriberGroup(
                          e.target.value,
                        )
                      }
                      value={
                        insuranceInformationSecondaryInsuranceSubscriberGroup
                      }
                      placeholder={""}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  <Form.Group className="mb-3 form-print-group-align form-print-group d-flex flex-column">
                    <Form.Label className="fw-bold">Effective Date </Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(
                        insuranceInformationSecondaryInsuranceSubscriberEffectiveDate,
                      )}
                      onChange={(selectedDate) =>
                        setInsuranceInformationSecondaryInsuranceSubscriberEffectiveDate(
                          selectedDate?.toDateString(),
                        )
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            insuranceInformationSecondaryInsuranceSubscriberEffectiveDate
                              ? formatDateToMMDDYYYY(
                                  insuranceInformationSecondaryInsuranceSubscriberEffectiveDate,
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
                <Col xs={12} sm={12} lg={12}>
                  <Form.Label className="fw-bold">
                    OBLIGATIONS OF RESPONSIBLE PARTY
                  </Form.Label>
                  <div>
                    <Form.Label>
                      Our facility files for reimbursement with your insurance
                      company. However, the ultimate responsibility for your
                      account is yours. Insurance billing is a courtesy, and the
                      facility does not accept the responsibility for collection
                      of your claim or of negotiating a settlement on a disputed
                      claim. If the Resident is responsible for a balance due,
                      you will receive monthly statements.
                    </Form.Label>
                  </div>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col xs={12} sm={12} lg={12}>
                  <Form.Label className="fw-bold">
                    ASSIGNMENT OF BENEFITS
                  </Form.Label>
                  <div>
                    <Form.Label>
                      I hereby authorize this facility to release the minimum
                      medical information necessary to process my insurance
                      claims. I further authorize the above insurance company(s)
                      to make payment directly to the provider for the benefits
                      herein and otherwise payable to me.
                    </Form.Label>
                  </div>
                </Col>
              </Row>
            </Card>
            <Card body className="mb-3">
              <Row>
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
            </Card>
            <Row>
              <Col xs={12} lg={6} className="d-flex align-items-start">
                <Button
                  className={`theme-button hide-print-btn me-2 inline-block ${isNotEditableWithSigner && "pointer-events-auto"}`}
                  type="button"
                  onClick={() => guardTyped(() => setSigInModel19(true))}
                >
                  SAVED AND SIGNED
                </Button>
              </Col>
              <Col xs={12} lg={6} className="text-end">
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
            <div className="form-actions-next hidePrint">
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

      {page === 11 && (
        <>
          <div className="signature-sections-inline mt-3">
            <SignatureNamesPanel
              signatures={roleSignatures}
              onUpdate={updateRoleSignature}
              formHasTyped={hasTypedInForm}
              onClearAllTyped={clearAllTyped}
            />
            {/* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): hidden per client request. See documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */}
            {/* <SignatureSection role="bht" label="BHT Signature" variant="green" signature={roleSignatures.bht} onUpdate={updateRoleSignature} formHasTyped={hasTypedInForm} onClearAllTyped={clearAllTyped} /> */}
            {/* <SignatureSection role="bhp" label="BHP Signature" variant="purple" signature={roleSignatures.bhp} onUpdate={updateRoleSignature} externalName formHasTyped={hasTypedInForm} onClearAllTyped={clearAllTyped} /> */}
            {/* <SignatureSection role="admin" label="Admin Signature" variant="pink" signature={roleSignatures.admin} onUpdate={updateRoleSignature} externalName formHasTyped={hasTypedInForm} onClearAllTyped={clearAllTyped} /> */}
            <SignatureSection
              role="resident"
              label="Resident/Representative Signature"
              variant="blue"
              signature={roleSignatures.resident}
              onUpdate={updateRoleSignature}
              signerNameOverride={residentName || ""}
              formHasTyped={hasTypedInForm}
              onClearAllTyped={clearAllTyped}
            />
            <SignatureSection
              role="witness"
              label="Witness Signature"
              variant="yellow"
              signature={roleSignatures.witness}
              onUpdate={updateRoleSignature}
              externalName
              formHasTyped={hasTypedInForm}
              onClearAllTyped={clearAllTyped}
            />
          </div>
          {!id && (
            <Form.Group className="mt-3 hidePrint">
              <Form.Label className="fw-bold">Signers:</Form.Label>
              <MultiEmployee
                alsoResident
                setValue={setSigners}
                value={signers}
              />
            </Form.Group>
          )}
          <div className="employee-btn-joiner hidePrint">
            <button
              type="submit"
              className={`employee_create_btn ${isNotEditableWithSigner && "pointer-events-auto"}`}
              /* TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): submit gate
                 reverted + Witness coupled-pair (2026-04-26). See
                 documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md. */ disabled={
                witnessIncomplete ||
                (Profile?.userType === ROLES.ADMIN ? false : isDisabled)
              }
              /* TEMP-DISABLED-BHP-BHT-ADMIN: original gate
                disabled={
                !allPenSigsHaveNames
                  ? true
                  : Profile?.userType === ROLES.ADMIN
                    ? false
                    : isDisabled
                }
                */
            >
              {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ResidentIntakeContentPart2;
