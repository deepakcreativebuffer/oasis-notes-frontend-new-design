/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HOC from "@/features/shared/layout/Inner/HOC";
import { Row, Col, Container, Form } from "react-bootstrap";
import {
  clinicalOversightService,
  employeeService,
  facilityService,
} from "@/features/shared/services";
import NavWrapper from "@/utils/NavWrapper";
import {
  convertTimeFormat,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import "@/assets/styles/Print.css";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { usePrint } from "@shared/hooks";
import { ROLES } from "@/features/shared/constants";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
const ViewClinicalOversight = () => {
  const { id } = useParams();
  const currentUser = useSelector(userProfile);
  const hoursFormat = currentUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const [response, setResponse] = useState({});
  const [signers, setSigners] = useState([]);
  const [facilitiesList, setFacilitiesList] = useState([]);

  useEffect(() => {
    if (currentUser?.userType === ROLES.ADMIN) {
      facilityService.list({
        setResponse: (data) => setFacilitiesList(data?.data || []),
      });
    } else {
      setFacilitiesList(currentUser?.facilityId || []);
    }
  }, [currentUser]);
  const [data, setData] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [employeeInvovle, setEmployeeInvovle] = useState([]);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        currentUser,
        currentUser,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      { fullName: employeeInvovle, userType: ROLES.EMPLOYEE },
      currentUser,
    ),
    pageStyle: `
    @page {
      size: portrait !important;
      margin: 12mm 9mm!important;
    }    
    .card {
      page-break-inside: avoid;
    }
    .view-details-grid {
      page-break-inside: avoid;
    }
  `,
  });
  const print = usePrint(printRef, handlePrint);
  const [clinicalOversightData, setClinicalOversightData] = useState({
    facilityAddress: "",
    topic: "",
    adminId: "",
    date: "",
    beginTime: "",
    endTime: "",
    lengthOfTime: "",
    conductedViaRemoteTeleConferenceWithAudioVideo: false,
    conductedViaInPerson: false,
    clinicalOversightTypeIndividual: false,
    clinicalOversightTypeGroup: false,
    participants: [],
    topicsAddressedUniqueTreatmentNeeds: false,
    topicsAddressedEnhancingSkills: false,
    topicsAddressedAssessmentOrTreatmentPlan: false,
    topicsAddressedStaffTrainingPlan: false,
    topicsAddressedJobDutiesDirection: false,
    additionalComments: "",
    opportunitiesForTraining: "",
    bhpNameAndCredentials: "",
    bhpSignature: "",
    administratorName: "",
    administratorSignature: "",
  });
  useEffect(() => {
    employeeService.getEmployee({ setResponse: setData });
  }, []);
  useEffect(() => {
    if (id) {
      clinicalOversightService.getNotesById(id, { setResponse: setResponse });
    }
  }, [id]);
  useEffect(() => {
    if (data) {
      const optionsData = (data?.data || []).filter(
        (i) => i.userType === ROLES.EMPLOYEE,
      );
      const options = (optionsData || [])
        ?.map((i) => ({
          value: i._id,
          label: fetchPaitentName(i),
        }))
        .filter((i) => i.value !== currentUser._id);
      setEmployeeOptions(options);
    }
  }, [currentUser._id, data]);
  useEffect(() => {
    setClinicalOversightData(response?.data);
    const involveEmpolyee = response?.data?.employeesInvolved
      ?.map((emp) => {
        return {
          name: `${emp?.firstName} ${emp?.lastName}`,
        };
      })
      .map((employee) => employee?.name)
      .join(", ");
    setEmployeeInvovle(involveEmpolyee);
    if (response?.data?.signers) {
      const formattedSigners = response.data.signers.map((signer) => ({
        value: signer?._id,
        label: signer?.name,
      }));
      setSigners(formattedSigners);
    }
  }, [response]);
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper title={"Clinical Oversight"} isArrow={true} />
      <Container>
        <div ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">Clinical Oversight</h1>
          <Row>
            <Col
              xs={12}
              sm={8}
              md={12}
              lg={6}
              className={`${!employeeInvovle && "hidePrint"}`}
            >
              <div
                className={`view-details-grid view-details-grid-inline my-1 my-md-2 p-3`}
              >
                <p className="view-label mb-1">BHT Name : </p>
                <h5 className="view-value mb-0">{employeeInvovle}</h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={4}
              md={6}
              lg={6}
              className={`${!clinicalOversightData?.date && "hidePrint"}`}
            >
              <div
                className={`view-details-grid view-details-grid-inline my-1 my-md-2 p-3`}
              >
                <p className="view-label mb-1">Date : </p>
                <h5 className="view-value mb-0">
                  {formatDateToMMDDYYYY(clinicalOversightData?.date)}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={6}
              lg={6}
              className={`${!clinicalOversightData?.beginTime && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1"> Begin Time : </p>
                <h5 className="view-value mb-0">
                  {convertTimeFormat(
                    clinicalOversightData?.beginTime,
                    hoursFormat,
                  )}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={6}
              lg={6}
              className={`${!clinicalOversightData?.endTime && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1"> End Time : </p>
                <h5 className="view-value mb-0">
                  {convertTimeFormat(
                    clinicalOversightData?.endTime,
                    hoursFormat,
                  )}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className={`${!clinicalOversightData?.lengthOfTime && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Length of Time : </p>
                <h5 className="view-value mb-0">
                  {clinicalOversightData?.lengthOfTime}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className={`${(clinicalOversightData?.conductedViaRemoteTeleConferenceWithAudioVideo === (null || undefined) || clinicalOversightData?.conductedViaInPerson === (null || undefined)) && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Conducted Via: </p>
                <h5 className="view-value mb-0">
                  {clinicalOversightData?.conductedViaRemoteTeleConferenceWithAudioVideo
                    ? "Teleconference with Audio Video Communications (Remote)"
                    : clinicalOversightData?.conductedViaInPerson
                      ? "In Person"
                      : ""}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className={`${(clinicalOversightData?.clinicalOversightTypeIndividual === (null || undefined) || clinicalOversightData?.clinicalOversightTypeGroup === (null || undefined)) && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Select one of the following: </p>
                <h5 className="view-value mb-0">
                  {clinicalOversightData?.clinicalOversightTypeIndividual
                    ? "Individual Clinical Oversight"
                    : clinicalOversightData?.clinicalOversightTypeGroup
                      ? "Group Clinical Oversight"
                      : ""}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className={`${!clinicalOversightData?.facilityId && "hidePrint"}`}
            >
              <div
                className={`view-details-grid view-details-grid-inline my-1 my-md-2 p-3`}
              >
                <p className="view-label mb-1">Facility : </p>
                <h5 className="view-value mb-0">
                  {clinicalOversightData?.facilityId?.name ||
                    facilitiesList?.find(
                      (fac) =>
                        fac._id ===
                        (clinicalOversightData?.facilityId?._id ||
                          clinicalOversightData?.facilityId),
                    )?.name ||
                    ""}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className={`${!clinicalOversightData?.facilityAddress && "hidePrint"}`}
            >
              <div
                className={`view-details-grid view-details-grid-inline my-1 my-md-2 p-3`}
              >
                <p className="view-label mb-1">Facility Address : </p>
                <h5 className="view-value mb-0">
                  {clinicalOversightData?.facilityAddress}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className={`${!clinicalOversightData?.topic && "hidePrint"}`}
            >
              <div
                className={`view-details-grid view-details-grid-inline my-1 my-md-2 p-3`}
              >
                <p className="view-label mb-1">Topic : </p>
                <h5 className="view-value mb-0">
                  {clinicalOversightData?.topic}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className={`${!clinicalOversightData?.additionalComments && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Clinical Oversight Summary : </p>
                <h5 className="view-value mb-0">
                  {clinicalOversightData?.additionalComments}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className={`${!clinicalOversightData?.opportunitiesForTraining && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">
                  Identified opportunities for staff training, as applicable
                  :{" "}
                </p>
                <h5 className="view-value mb-0">
                  {clinicalOversightData?.opportunitiesForTraining}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className={`${!clinicalOversightData?.bhpNameAndCredentials && "hidePrint"}`}
            >
              <div className="view-details-grid d-block my-1 my-md-2 p-3">
                <h6 className="fw-bold mb-2">Staff Detail </h6>
                <div className="mb-2 view-details-grid-inline">
                  <p className="view-label mb-1">BHP Name : </p>
                  <h5 className="view-value mb-0">
                    {clinicalOversightData?.bhpNameAndCredentials}
                  </h5>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12}>
              <div className="view-details-grid d-block my-1 my-md-2 p-3">
                <p className="view-label mb-2">Topic Addressed : </p>
                <h5 className="view-value mb-0">
                  <div>
                    {clinicalOversightData?.topicsAddressedUniqueTreatmentNeeds ===
                      true &&
                      "Recognizing & Meeting the unique treatment needs of the residents served by the agency."}
                  </div>
                  <div className="mt-2">
                    {clinicalOversightData?.topicsAddressedEnhancingSkills ===
                      true &&
                      "Reviewing & discussing other topics that enhance the skills & knowledge of Staff Members"}
                  </div>
                  <div className="mt-2">
                    {clinicalOversightData?.topicsAddressedAssessmentOrTreatmentPlan ===
                      true &&
                      "For a behavioral health technician providing a resident with an assessment or  behavioral health treatment plan, determining whether an assessment or behavioral health treatment plan is complete and accurate and meets the resident’s treatments needs."}
                  </div>
                  <div className="mt-2">
                    {clinicalOversightData?.topicsAddressedStaffTrainingPlan ===
                      true && "Review of an individual staff training plan."}
                  </div>
                  <div className="mt-2">
                    {clinicalOversightData?.topicsAddressedJobDutiesDirection ===
                      true &&
                      "Assessing that staff has sufficient direction to perform job duties"}
                  </div>
                </h5>
              </div>
            </Col>
          </Row>

          <div className="signature-sections-inline mt-3">
            <SignatureSection
              role="bht"
              label="BHT Signature"
              variant="blue"
              mode="view"
              signature={response?.data?.signatures?.bht}
            />
            <SignatureSection
              role="bhp"
              label="BHP Signature"
              variant="pink"
              mode="view"
              signature={response?.data?.signatures?.bhp}
            />
            {/* <SignatureSection
              role="resident"
              label="Resident/Representative Signature"
              variant="blue"
              mode="view"
              signature={response?.data?.signatures?.resident}
              signerNameOverride={employeeInvovle || ""}
            /> */}
            {/* <SignatureSection
              role="witness"
              label="Witness Signature"
              variant="yellow"
              mode="view"
              signature={response?.data?.signatures?.witness}
            /> */}
          </div>

          {signers && (
            <Row className="mt-2">
              <Col xs={4} lg={4}>
                <Form.Label className="fw-bold w-100">Signed By:</Form.Label>
              </Col>
              <Col xs={8} lg={8} className="text-end">
                {signatureFormat({
                  sign: response?.data?.employeeSignature,
                  date: response?.data?.employeeSignatureDate,
                  time: response?.data?.employeeSignatureTime,
                  hoursFormat,
                })}
                {signatureFormat({
                  sign: response?.data?.adminSignature,
                  date: response?.data?.adminDateSigned,
                  time: response?.data?.adminSignedTime,
                  hoursFormat,
                })}
                {response?.data?.signers?.map?.((signer) =>
                  signer?.signature?.length ? (
                    <p className="text-end mb-0" key={signer?.signerId}>
                      {signatureFormat({
                        sign: signer?.signature,
                        date: signer?.dateSigned,
                        time: signer?.signedTime,
                        hoursFormat,
                      })}
                    </p>
                  ) : null,
                )}
              </Col>
            </Row>
          )}

          <Row>
            <Col xs={12}>
              <button
                className="employee_create_btn hidePrint mt-3 mt-md-4"
                type="button"
                onClick={print}
              >
                Print Report
              </button>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewClinicalOversight,
});
