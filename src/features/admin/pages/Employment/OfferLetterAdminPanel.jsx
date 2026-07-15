import { Form, Row, Col, Button } from "react-bootstrap";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import React from "react";
import {
  fetchPaitentName,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
export const OfferLetter2 = ({ item }) => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);

  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        profileInfo,
        profileInfo,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(profileInfo, profileInfo),

    pageStyle: `
      @page {
        size: portrait !important;
        margin: 12mm 9mm !important;
      }
    `,
  });
  const print = usePrint(printRef, handlePrint);

  return (
    <div
      className="main-div-personal important outline-none"
      ref={printRef}
      tabIndex={0}
    >
      <Form ref={componentRef} id="formId">
        <h1 className="pdfTitle my-3 hidden"> Offer letter </h1>
        <Form.Label className="w-100 mb-3">
          Offer Date :
          <span className="ms-1">{formatDateToMMDDYYYY(item?.offerDate)}</span>
        </Form.Label>
        <Form.Label className="w-100">
          Dear
          <span className="mx-1">{item?.employeeName},</span>
        </Form.Label>
        <Form.Group className="my-3">
          <Form.Label className="w-100">
            Congratulations!
            <span className="ms-1">{item?.companyName}</span> is pleased to
            offer you the position of Behavioral Health Technician. We trust
            that you will find this opportunity both exciting and rewarding. As
            discussed, this is a full-time position, with a starting pay rate of{" "}
            <span className="mx-1"> ${item?.startingPay}</span>per hour. Your
            first day of work will be
            <span className="ms-1">
              {formatDateToMMDDYYYY(item?.startDate)}
            </span>
            . Please note that this offer is contingent upon the satisfactory
            completion of your reference checks and submission of all required
            documentation.{" "}
          </Form.Label>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>
            The entire team at <span>{item?.companyName}</span> is excited to
            welcome you aboard, and we are confident that you will make valuable
            contributions to the success of our organization.
          </Form.Label>
        </Form.Group>
        <Form.Label className="w-100">
          Once again, congratulations, and we look forward to having you as part
          of our team!
        </Form.Label>
        <Form.Label className="w-100">Sincerely,</Form.Label>
        <Form.Group>
          <Form.Label>
            Administrators Name : <span>{fetchPaitentName(profileInfo)} </span>
          </Form.Label>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="w-100 text-end">
            {signatureFormat({
              sign: item?.administratorsSignature,
              date: item?.administratorsSignatureDate,
              time: item?.administratorsSignatureTime,
              hoursFormat,
            })}
            {signatureFormat({
              sign: item?.employeeSignature,
              date: item?.employeeSignDate,
              hoursFormat,
            })}
            {item?.signers?.map((value) =>
              value?.signature
                ? signatureFormat({
                    sign: value?.signature,
                    date: value?.dateSigned,
                    hoursFormat,
                  })
                : null,
            )}
          </Form.Label>
        </Form.Group>
        <div className="save-as-draft-btn123"></div>
      </Form>
      <Row className="mt-3 text-center border-top pt-3">
        <Col xs={12}>
          <Button className="theme-button" onClick={print} type="submit">
            PRINT
          </Button>
        </Col>
      </Row>
    </div>
  );
};
