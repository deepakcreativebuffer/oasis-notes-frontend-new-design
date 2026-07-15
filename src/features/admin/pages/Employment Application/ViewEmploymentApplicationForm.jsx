import React, { useEffect, useRef, useState } from "react";
import { employmentService } from "@/features/shared/services";
import { Container } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";
import NavWrapper from "@/utils/NavWrapper";
import ViewBasicInformation from "./ViewBasicInformation";
import ViewEducationalBackground from "./ViewEducationalBackground";
import ViewEmploymentHistory from "./ViewEmploymentHistory";
import ViewOtherInformation from "./ViewOtherInformation";
import ViewAcknowledgement from "./ViewAcknowledgement";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import Loader from "@/features/shared/ui/Loader/Loader";
import { usePrint } from "@shared/hooks";

import { ROLES } from "@/features/shared/constants";

const ViewEmploymentApplicationForm = () => {
  const url = useLocation().pathname;
  const ProfileDetails = useSelector(userProfile);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const componentRef = useRef();
  const { employeId } = useParams();
  const printRef = React.useRef(null);
  const fetchHandler = () => {
    employmentService.getApplicationForms({
      isAdmin: ProfileDetails?.userType === ROLES.ADMIN,
      employeId,
      setLoading,
      setResponse: setData,
    });
  };
  useEffect(() => {
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        data?.data?.employeeId,
        ProfileDetails,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      data?.data?.employeeId,
      ProfileDetails,
    ),
    pageStyle: `
        @page {
          margin: 12mm 9mm !important;
          size: portrait !important;
        }
        .no-print {
          display: none !important;
        }
        .section {
          page-break-inside: avoid;
        }
        `,
  });
  const print = usePrint(printRef, handlePrint);
  return (
    <>
      {" "}
      {loading ? (
        <Loader />
      ) : (
        <div ref={printRef} tabIndex={0} className="outline-none">
          <NavWrapper
            url={url}
            title={"Employment Application"}
            isArrow={true}
          />
          {data?.data && (
            <>
              {" "}
              <Container>
                <div ref={componentRef}>
                  <h1 className="pdfTitle my-3 hidden">
                    Employment Application
                  </h1>
                  <ViewBasicInformation formData={data?.data?.application} />
                  <ViewEducationalBackground formData={data?.data?.education} />
                  <ViewEmploymentHistory formData={data?.data?.history} />
                  <ViewOtherInformation formData={data?.data?.other} />
                  <ViewAcknowledgement
                    formData={data?.data?.skillAndEducation}
                  />
                </div>
              </Container>
              <button
                className="print_btn no-print"
                type="button"
                onClick={print}
              >
                PRINT APPLICATION
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default HOC({
  Wcomponenet: ViewEmploymentApplicationForm,
});
