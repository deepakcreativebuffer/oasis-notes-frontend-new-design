/** @format */

import React, { useEffect, useRef, useState } from "react";
import { Container, Table, Row, Col, Form } from "react-bootstrap";
import { getData } from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { useParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  fetchPaitentName,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import "@/assets/styles/Print.css";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
export const TableRow = ({ heading, row, input }) => {
  return (
    <tr>
      <td className="fw-light"> {heading} </td>
      {row?.map((i, index) => (
        <td key={index}>
          <div className="Radio_btns">
            <div className="btns fw-light">{i?.value ? "Yes" : "No"}</div>
          </div>
        </td>
      ))}
      <td className="fw-light">{input}</td>
    </tr>
  );
};
const ViewDTF = () => {
  const { id } = useParams();
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [detail, setDetail] = useState({});
  const printRef = useRef(null);
  const fetchDetails = () => {
    getData(setDetail, `employee/getADLTrackingFormById/${id}`);
  };
  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const KeyPair = [
    {
      heading: "Selecting Clothes",
      row: [
        {
          value: detail?.data?.selectingClothes?.requiresNoAssistance,
        },
        {
          value: detail?.data?.selectingClothes?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.selectingClothes?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.selectingClothes?.notApplicable,
        },
        {
          value: detail?.data?.selectingClothes?.refused,
        },
      ],
      input: detail?.data?.selectingClothes?.staffInitials,
    },
    {
      heading: "Bathing or Showering",
      row: [
        {
          value: detail?.data?.bathingOrShowering?.requiresNoAssistance,
        },
        {
          value: detail?.data?.bathingOrShowering?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.bathingOrShowering?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.bathingOrShowering?.notApplicable,
        },
        {
          value: detail?.data?.bathingOrShowering?.refused,
        },
      ],
      input: detail?.data?.bathingOrShowering?.staffInitials,
    },
    {
      heading: "Combing Hair",
      row: [
        {
          value: detail?.data?.combingHair?.requiresNoAssistance,
        },
        {
          value: detail?.data?.combingHair?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.combingHair?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.combingHair?.notApplicable,
        },
        {
          value: detail?.data?.combingHair?.refused,
        },
      ],
      input: detail?.data?.combingHair?.staffInitials,
    },
    {
      heading: "Applying Lotion",
      row: [
        {
          value: detail?.data?.applyingLotion?.requiresNoAssistance,
        },
        {
          value: detail?.data?.applyingLotion?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.applyingLotion?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.applyingLotion?.notApplicable,
        },
        {
          value: detail?.data?.applyingLotion?.refused,
        },
      ],
      input: detail?.data?.applyingLotion?.staffInitials,
    },
    {
      heading: "Laundry",
      row: [
        {
          value: detail?.data?.laundry?.requiresNoAssistance,
        },
        {
          value: detail?.data?.laundry?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.laundry?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.laundry?.notApplicable,
        },
        {
          value: detail?.data?.laundry?.refused,
        },
      ],
      input: detail?.data?.laundry?.staffInitials,
    },
    {
      heading: "Dressing",
      row: [
        {
          value: detail?.data?.dressing?.requiresNoAssistance,
        },
        {
          value: detail?.data?.dressing?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.dressing?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.dressing?.notApplicable,
        },
        {
          value: detail?.data?.dressing?.refused,
        },
      ],
      input: detail?.data?.dressing?.staffInitials,
    },
    {
      heading: "Shampooing Hair",
      row: [
        {
          value: detail?.data?.shampooingHair?.requiresNoAssistance,
        },
        {
          value: detail?.data?.shampooingHair?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.shampooingHair?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.shampooingHair?.notApplicable,
        },
        {
          value: detail?.data?.shampooingHair?.refused,
        },
      ],
      input: detail?.data?.shampooingHair?.staffInitials,
    },
    {
      heading: "Oral Care Evening",
      row: [
        {
          value: detail?.data?.oralCareEvening?.requiresNoAssistance,
        },
        {
          value: detail?.data?.oralCareEvening?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.oralCareEvening?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.oralCareEvening?.notApplicable,
        },
        {
          value: detail?.data?.oralCareEvening?.refused,
        },
      ],
      input: detail?.data?.oralCareEvening?.staffInitials,
    },
    {
      heading: "Oral Care Morning",
      row: [
        {
          value: detail?.data?.oralCareMorning?.requiresNoAssistance,
        },
        {
          value: detail?.data?.oralCareMorning?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.oralCareMorning?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.oralCareMorning?.notApplicable,
        },
        {
          value: detail?.data?.oralCareMorning?.refused,
        },
      ],
      input: detail?.data?.oralCareMorning?.staffInitials,
    },
    {
      heading: "Breakfast",
      row: [
        {
          value: detail?.data?.breakfast?.requiresNoAssistance,
        },
        {
          value: detail?.data?.breakfast?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.breakfast?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.breakfast?.notApplicable,
        },
        {
          value: detail?.data?.breakfast?.refused,
        },
      ],
      input: detail?.data?.breakfast?.staffInitials,
    },
    {
      heading: "Lunch",
      row: [
        {
          value: detail?.data?.lunch?.requiresNoAssistance,
        },
        {
          value: detail?.data?.lunch?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.lunch?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.lunch?.notApplicable,
        },
        {
          value: detail?.data?.lunch?.refused,
        },
      ],
      input: detail?.data?.lunch?.staffInitials,
    },
    {
      heading: "Dinner",
      row: [
        {
          value: detail?.data?.dinner?.requiresNoAssistance,
        },
        {
          value: detail?.data?.dinner?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.dinner?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.dinner?.notApplicable,
        },
        {
          value: detail?.data?.dinner?.refused,
        },
      ],
      input: detail?.data?.dinner?.staffInitials,
    },
    {
      heading: "AM Snack",
      row: [
        {
          value: detail?.data?.amSnacks?.requiresNoAssistance,
        },
        {
          value: detail?.data?.amSnacks?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.amSnacks?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.amSnacks?.notApplicable,
        },
        {
          value: detail?.data?.amSnacks?.refused,
        },
      ],
      input: detail?.data?.amSnacks?.staffInitials,
    },
    {
      heading: "PM Snack",
      row: [
        {
          value: detail?.data?.pmSnack?.requiresNoAssistance,
        },
        {
          value: detail?.data?.pmSnack?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.pmSnack?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.pmSnack?.notApplicable,
        },
        {
          value: detail?.data?.pmSnack?.refused,
        },
      ],
      input: detail?.data?.pmSnack?.staffInitials,
    },
    {
      heading: "AM Bowel Movement",
      row: [
        {
          value: detail?.data?.amBowelMovement?.requiresNoAssistance,
        },
        {
          value: detail?.data?.amBowelMovement?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.amBowelMovement?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.amBowelMovement?.notApplicable,
        },
        {
          value: detail?.data?.amBowelMovement?.refused,
        },
      ],
      input: detail?.data?.amBowelMovement?.staffInitials,
    },
    {
      heading: "PM Bowel Movement",
      row: [
        {
          value: detail?.data?.pmBowelMovement?.requiresNoAssistance,
        },
        {
          value: detail?.data?.pmBowelMovement?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.pmBowelMovement?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.pmBowelMovement?.notApplicable,
        },
        {
          value: detail?.data?.pmBowelMovement?.refused,
        },
      ],
      input: detail?.data?.pmBowelMovement?.staffInitials,
    },
    {
      heading: "Overnight Bowel Movement",
      row: [
        {
          value: detail?.data?.overnightBowelMovement?.requiresNoAssistance,
        },
        {
          value: detail?.data?.overnightBowelMovement?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.overnightBowelMovement?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.overnightBowelMovement?.notApplicable,
        },
        {
          value: detail?.data?.overnightBowelMovement?.refused,
        },
      ],
      input: detail?.data?.overnightBowelMovement?.staffInitials,
    },
    {
      heading: "Hand & Foot nail care",
      row: [
        {
          value: detail?.data?.handAndFootNailCare?.requiresNoAssistance,
        },
        {
          value: detail?.data?.handAndFootNailCare?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.handAndFootNailCare?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.handAndFootNailCare?.notApplicable,
        },
        {
          value: detail?.data?.handAndFootNailCare?.refused,
        },
      ],
      input: detail?.data?.handAndFootNailCare?.staffInitials,
    },
    {
      heading: "Bed Mobility",
      row: [
        {
          value: detail?.data?.bedMobility?.requiresNoAssistance,
        },
        {
          value: detail?.data?.bedMobility?.someAssistanceNeeded,
        },
        {
          value: detail?.data?.bedMobility?.completeAssistanceNeeded,
        },
        {
          value: detail?.data?.bedMobility?.notApplicable,
        },
        {
          value: detail?.data?.bedMobility?.refused,
        },
      ],
      input: detail?.data?.bedMobility?.staffInitials,
    },
  ];
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        detail?.data?.patientId || detail?.patientId,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      detail?.data?.patientId || detail?.patientId,
      profile,
    ),
    pageStyle: `
    @page {
      size: Landscape!important;
      margin: 12mm 9mm!important;
    }    
    .card {
      page-break-inside: avoid;
    }
    .view-details-grid {
      page-break-inside: avoid;
    }
    th, td {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
`,
  });
  const handlePrint2 = () => {
    downloadReport(handlePrint);
  };
  const print = usePrint(printRef, handlePrint2);
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper
        title={"Activities of Daily Living Tracking Form"}
        isArrow={true}
      />
      <Container>
        <div className="daily-living-form" ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">
            Activities of Daily Living Tracking Form
          </h1>
          <Row className="mb-2">
            <Col xs={12} sm={6} lg={6}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Resident : </p>
                <h5 className="view-value mb-0">
                  {detail?.data?.patientId &&
                    fetchPaitentName(detail?.data?.patientId)}{" "}
                </h5>
              </div>
            </Col>
            <Col xs={12} sm={6} lg={6}>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Today's Date : </p>
                <h5 className="view-value mb-0">
                  {" "}
                  {detail?.data?.date &&
                    formatDateToMMDDYYYY(detail?.data?.date)}{" "}
                </h5>
              </div>
            </Col>
          </Row>
          <Table responsive bordered>
            <thead>
              <tr>
                <th>ADLS</th>
                <th>Requires No Assistance</th>
                <th>Some Assistance Needed</th>
                <th>Complete Assistance Needed</th>
                <th>Not Applicable</th>
                <th>Refused</th>
                <th>Staff Initials</th>
              </tr>
            </thead>
            <tbody>
              {KeyPair?.map((item, index) => (
                <TableRow
                  heading={item?.heading}
                  row={item?.row}
                  input={item?.input}
                  setInput={item?.setInput}
                  key={index}
                />
              ))}
            </tbody>
          </Table>
          <Row>
            <Col xs={12} sm={12} lg={6}>
              <Form.Label className="fw-bold">
                Staff members are to initial once ADLs is completed on each
                shift.
              </Form.Label>
            </Col>
            <Col xs={12} sm={12} lg={6} className="text-end">
              <Row>
                <Col xs={12} lg={12} className="text-end text-end">
                  <Form.Label className="fw-normal mb-0 w-100 text-end">
                    {signatureFormat({
                      sign: detail?.data?.savedSigned,
                      date: detail?.data?.dateSigned,
                      time: detail?.data?.signedTime,
                      hoursFormat,
                    })}
                    {signatureFormat({
                      sign: detail?.data?.adminSignature,
                      date: detail?.data?.adminDateSigned,
                      time: detail?.data?.adminSignedTime,
                      hoursFormat,
                    })}
                  </Form.Label>
                  {detail?.data?.signers?.map?.((signer) =>
                    signer?.signature?.length ? (
                      <Form.Label
                        className="fw-normal mb-0 w-100 text-end"
                        key={signer?.signerId}
                      >
                        {signatureFormat({
                          sign: signer?.signature,
                          date: signer?.dateSigned,
                          time: signer?.signedTime,
                          hoursFormat,
                        })}
                      </Form.Label>
                    ) : null,
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="text-center">
            <Col xs={12} md={12}>
              <div className="employee-btn-joiner mt-3 hidePrint">
                <button
                  className="employee_create_btn"
                  type="button"
                  onClick={print}
                >
                  PRINT REPORT
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewDTF,
});
