import { ProgressBar, Row, Col } from "react-bootstrap";
const ProgressIndicator = ({ currentStep = 10, totalSteps = 25 }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-100">
      <ProgressBar now={progress} className="custom-progress h-2 rounded" />
      <Row className="mt-2 mb-2 align-items-center justify-content-between">
        <Col xs="auto">
          <small className="text-muted fw-medium">
            Pdf {currentStep} of {totalSteps}
          </small>
        </Col>
        <Col xs="auto">
          <small className="text-primary fw-bold">
            {Math.round(+progress || 0)}%
          </small>
        </Col>
      </Row>
    </div>
  );
};

export default ProgressIndicator;
