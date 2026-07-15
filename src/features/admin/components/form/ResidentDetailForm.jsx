import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { formatDateToMMDDYYYY } from "@/utils/utils";

const ResidentDetailForm = ({
  admitDate,
  setAdmitDate,
  fluidRestriction,
  setFluidRestriction,
  ahcccsId,
  setAhcccsId,
  diagnosis,
  setDiagnosis,
  diet,
  setDiet,
}) => {
  return (
    <>
      <Row>
        <Col xs={12} md={6}>
          <Form.Group className="mb-3 add-medication-form d-flex flex-column">
            <Form.Label className="font-bold">Admit Date: </Form.Label>
            <DatePicker
              selected={formatDateToMMDDYYYY(admitDate)}
              onChange={(selectedDate) =>
                setAdmitDate(selectedDate?.toDateString())
              }
              dateFormat="MM/dd/yyyy"
              placeholderText="MM/DD/YYYY"
              className="form-control"
              highlightDates={[
                {
                  "react-datepicker__day--highlighted-custom": [
                    admitDate ? formatDateToMMDDYYYY(admitDate) : new Date(),
                  ],
                },
              ]}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group className="mb-3 add-medication-form">
            <Form.Label className="font-bold">AHCCCS ID: </Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setAhcccsId(e.target.value)}
              value={ahcccsId}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group className="mb-3 add-medication-form">
            <Form.Label className="font-bold">
              Diagnosis (specify if new or continuing):{" "}
            </Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setDiagnosis(e.target.value)}
              value={diagnosis}
            />
          </Form.Group>
        </Col>

        <Col xs={12} md={6}>
          <Form.Group className="mb-3 add-medication-form">
            <Form.Label className="font-bold">Diet: </Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setDiet(e.target.value)}
              value={diet}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group className="mb-3 add-medication-form">
            <Form.Label className="font-bold">Fluid Restrictions: </Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setFluidRestriction(e.target.value)}
              value={fluidRestriction}
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

ResidentDetailForm.propTypes = {
  admitDate: PropTypes.string,
  setAdmitDate: PropTypes.func,
  fluidRestriction: PropTypes.string,
  setFluidRestriction: PropTypes.func,
  ahcccsId: PropTypes.string,
  setAhcccsId: PropTypes.func,
  diagnosis: PropTypes.string,
  setDiagnosis: PropTypes.func,
  diet: PropTypes.string,
  setDiet: PropTypes.func,
};

export default ResidentDetailForm;
