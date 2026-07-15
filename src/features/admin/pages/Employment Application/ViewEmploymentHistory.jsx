import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { formatDateToMMDDYYYY } from "@/utils/utils";

const ViewEmploymentHistory = ({ formData }) => {
  const [arr, setArr] = useState([]);

  useEffect(() => {
    if (formData) {
      setArr(formData?.previousCompany);
    }
  }, [formData]);

  return (
    <>
      <Form className="mt-2">
        <Form.Label className="fw-bold">
          Please list your work experience in the past five (5) years, beginning
          with the most recent job held. If you were self-employed, give firm
          name. Attach additional sheets if necessary. Please do not write “see
          resume”.
        </Form.Label>

        {arr?.map((i, index) => (
          <div className="mb-3 mt-3" key={index}>
            <Row>
              <Col xs={12} md={6} lg={6}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Employer Name : </p>
                  <h5 className="view-value mb-0">{i.employeeName}</h5>
                </div>
              </Col>
              <Col xs={12} md={6} lg={6}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Street Address : </p>
                  <h5 className="view-value mb-0">{i.streetAddress}</h5>
                </div>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">City : </p>
                  <h5 className="view-value mb-0">{i.city}</h5>
                </div>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">State : </p>
                  <h5 className="view-value mb-0">{i.state}</h5>
                </div>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Zip Code : </p>
                  <h5 className="view-value mb-0">{i.zipCode}</h5>
                </div>
              </Col>
              <Col xs={12} md={6} lg={3}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Phone Number : </p>
                  <h5 className="view-value mb-0">{i.phoneNumber}</h5>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Supervisor Name and Title :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {i.supervisorNameAndTitle}
                  </h5>
                </div>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Employment Date : </p>
                  <h5 className="view-value mb-0">
                    {`${formatDateToMMDDYYYY(i?.from)} - 
                    ${formatDateToMMDDYYYY(i?.to)}`}
                  </h5>
                </div>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Salary : </p>
                  <h5 className="view-value mb-0">
                    {i.fromSalary} -{i.toSalary}
                  </h5>
                </div>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Your Job Title(s) : </p>
                  <h5 className="view-value mb-0">{i?.jobTitle}</h5>
                </div>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Duties performed and advancements or promotions earned while
                    with this employer :{" "}
                  </p>
                  <h5 className="view-value mb-0">{i?.dutiesPerformed}</h5>
                </div>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Reason(s) for leaving : </p>
                  <h5 className="view-value mb-0">{i?.reasonForLeaving}</h5>
                </div>
              </Col>
              <Col xs={12} md={12} lg={12}>
                <div className="view-details-grid align-items-center my-1 my-md-2 p-3">
                  <p className="view-label mb-sm-0">
                    May we contact this employer? :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {i?.mayContactWithEmployee === true ? "Yes" : "No"}
                  </h5>
                </div>
              </Col>
            </Row>
          </div>
        ))}
      </Form>
    </>
  );
};

export default ViewEmploymentHistory;
