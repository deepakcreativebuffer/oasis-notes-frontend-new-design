import DatePicker from "react-datepicker";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { formatDateToMMDDYYYY } from "@/utils/utils";

const EmploymentHistoryForm = ({ data, index, handleChange, onRemove }) => {
  return (
    <Card body className="mb-3 mt-3" key={index}>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} md={6} lg={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Employer Name:</Form.Label>
              <Form.Control
                placeholder={""}
                type={"text"}
                value={data.employeeName}
                onChange={(e) => handleChange(e, index, "employeeName")}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Street Address:</Form.Label>
              <Form.Control
                placeholder={""}
                type={"text"}
                value={data.streetAddress}
                onChange={(e) => handleChange(e, index, "streetAddress")}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">City:</Form.Label>
              <Form.Control
                placeholder={""}
                type={"text"}
                value={data.city}
                onChange={(e) => handleChange(e, index, "city")}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">State:</Form.Label>
              <Form.Control
                placeholder={""}
                type={"text"}
                value={data.state}
                onChange={(e) => handleChange(e, index, "state")}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Zip Code:</Form.Label>
              <Form.Control
                placeholder={""}
                type={"text"}
                value={data.zipCode}
                onChange={(e) => handleChange(e, index, "zipCode")}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Phone Number:</Form.Label>
              <Form.Control
                placeholder={""}
                type={"text"}
                value={data.phoneNumber}
                onChange={(e) => handleChange(e, index, "phoneNumber")}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Row>
        <Col xs={12} md={12} lg={4}>
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">
                Supervisor Name and Title:
              </Form.Label>
              <Form.Control
                placeholder={""}
                type={"text"}
                value={data.supervisorNameAndTitle}
                onChange={(e) =>
                  handleChange(e, index, "supervisorNameAndTitle")
                }
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
        <Col xs={12} md={12} lg={4}>
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">Employment Date:</Form.Label>
              <Row>
                <Col xs={6}>
                  <Form.Group className="d-flex flex-column">
                    <DatePicker
                      selected={formatDateToMMDDYYYY(data?.from)}
                      onChange={(selectedDate) =>
                        handleChange(
                          selectedDate?.toDateString(),
                          index,
                          "from",
                        )
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            data?.from
                              ? formatDateToMMDDYYYY(data?.from)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(data?.to)}
                    onChange={(selectedDate) =>
                      handleChange(selectedDate?.toDateString(), index, "to")
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          data?.to
                            ? formatDateToMMDDYYYY(data?.to)
                            : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Col>
              </Row>
            </Form.Group>
          </Card>
        </Col>
        <Col xs={12} md={12} lg={4}>
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">Salary:</Form.Label>
              <Row>
                <Col xs={6}>
                  <Form.Control
                    placeholder={""}
                    type={"text"}
                    value={data.fromSalary}
                    onChange={(e) => handleChange(e, index, "fromSalary")}
                  ></Form.Control>
                </Col>
                <Col xs={6}>
                  <Form.Control
                    placeholder={""}
                    type={"text"}
                    value={data.toSalary}
                    onChange={(e) => handleChange(e, index, "toSalary")}
                  ></Form.Control>
                </Col>
              </Row>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Card body className="mb-3">
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Your Job Title(s):</Form.Label>
          <Form.Control
            placeholder={""}
            type={"text"}
            value={data?.jobTitle}
            onChange={(e) => handleChange(e, index, "jobTitle")}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">
            Duties performed and advancements or promotions earned while with
            this employer:
          </Form.Label>
          <Form.Control
            placeholder={""}
            type={"text"}
            value={data?.dutiesPerformed}
            onChange={(e) => handleChange(e, index, "dutiesPerformed")}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Reason(s) for leaving:</Form.Label>
          <Form.Control
            placeholder={""}
            type={"text"}
            value={data?.reasonForLeaving}
            onChange={(e) => handleChange(e, index, "reasonForLeaving")}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">
            May we contact this employer?
          </Form.Label>

          <div className="radio-inline">
            <Form.Check
              inline
              type="radio"
              name={`contactEmployer-${index}`}
              id={`contactEmployerYes-${index}`}
              label="Yes"
              value={true}
              checked={data?.mayContactWithEmployee === true}
              onChange={(e) =>
                handleChange(e, index, "mayContactWithEmployee", true)
              }
            />
            <Form.Check
              inline
              type="radio"
              name={`contactEmployer-${index}`}
              id={`contactEmployerNo-${index}`}
              label="No"
              value={false}
              checked={data?.mayContactWithEmployee === false}
              onChange={(e) =>
                handleChange(e, index, "mayContactWithEmployee", false)
              }
            />
          </div>
        </Form.Group>
      </Card>
      {index > 0 && (
        <Button
          variant="danger"
          type="button"
          size="sm"
          onClick={() => onRemove(index)}
        >
          Remove
        </Button>
      )}
    </Card>
  );
};

export default EmploymentHistoryForm;
