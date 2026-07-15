import {
  Button,
  Col,
  Form,
  Modal,
  ModalBody,
  Row,
  Table,
} from "react-bootstrap";
import { ModalOpner } from "@/features/shared/ui/Mod/ModalOpner";
import { ROLES } from "@/features/shared/constants";

const RefrigeratorTemperatureRefEditForm = ({
  vanEmergency,
  handleSubmitRef,
  refrigeratorData,
  setRefrigeratorData,
  handleTemperatureChange,
  addTemperature,
  editStatus,
  isSubmitEnabled,
  currentUser,
  employeeSignature,
  onHide,
}) => {
  return (
    <>
      <Modal.Header closeButton onHide={onHide}>
        <h5 className="mb-0 fw-bold">
          Monthly Refrgirator Temperature Monitoring
        </h5>
      </Modal.Header>
      <Form onSubmit={handleSubmitRef}>
        <ModalBody>
          <div>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="w-full font-bold">
                    Date: {vanEmergency?.date}
                  </Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setRefrigeratorData({
                        ...refrigeratorData,
                        date: e.target.value,
                      })
                    }
                    type="date"
                    required
                    value={refrigeratorData?.date?.slice(0, 10)}
                    placeholder="Enter Full Name"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="w-full font-bold">
                    Facility Address: {refrigeratorData?.location}11
                  </Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setRefrigeratorData({
                        ...refrigeratorData,
                        location: e.target.value,
                      })
                    }
                    value={refrigeratorData?.location}
                    type="text"
                    placeholder="Enter Facility Address"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Temperature Reading</th>
                  <th>Staff Initials</th>
                </tr>
              </thead>
              <tbody>
                {refrigeratorData.temperature.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Control
                        type="date"
                        size="sm"
                        required
                        value={row.date}
                        onChange={(e) =>
                          handleTemperatureChange(index, "date", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        size="sm"
                        required
                        value={row.temperature}
                        onChange={(e) =>
                          handleTemperatureChange(
                            index,
                            "temperature",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        size="sm"
                        required
                        value={row.initials}
                        onChange={(e) =>
                          handleTemperatureChange(
                            index,
                            "initials",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="mt-2">
              <Button size="sm" variant="primary" onClick={addTemperature}>
                Add Row
              </Button>
            </div>
            <div className="mt-3">
              <ModalOpner />
            </div>
          </div>
        </ModalBody>
        <Modal.Footer className="justify-content-center">
          <Button
            className="theme-button"
            type="submit"
            disabled={
              editStatus
                ? !isSubmitEnabled
                : currentUser.userType === ROLES.ADMIN
                  ? false
                  : employeeSignature.length === 0
            }
          >
            {editStatus ? "UPDATE" : "SAVE"}
          </Button>
          <Button className="theme-button-outline" onClick={onHide}>
            CANCEL
          </Button>
        </Modal.Footer>
      </Form>
    </>
  );
};

export default RefrigeratorTemperatureRefEditForm;
