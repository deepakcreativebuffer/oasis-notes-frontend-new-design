/* eslint-disable no-unused-vars, eqeqeq */
import { useEffect, useState } from "react";
import { resolveAdminAssetPath } from "@/assets";
import { Button, Col, Form, ModalBody, Row, Table } from "react-bootstrap";
import { showNotification } from "@/utils";
import Modal from "react-bootstrap/Modal";
import { adminSchedulingService } from "@/features/shared/services";
const StaffSchedule = () => {
  const [viewItem, setViewItem] = useState({});
  const [addContactBtn, setAddContactBtn] = useState("");
  const [data, setData] = useState([]);
  const [employeeSingleData, setEmployeeSingleData] = useState([]);
  const [employee1Name, setEmployee1Name] = useState("");
  const [employeeData, setEmployeeData] = useState({});
  const [employeeId, setEmployeeId] = useState("");

  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [employees, setEmployees] = useState([]);
  const getEmployees = () => {
    adminSchedulingService
      .getActiveEmployees()
      .then((response) => {
        const filteredData = response.data?.data;
        setData(filteredData);
        setEmployees(filteredData);
      })
      .catch((error) => {
        if (error.response?.data?.message === "No data found") {
          setEmployeeData([]);
        } else {
          setEmployeeData([]);
          showNotification({ message: error.response.message, type: "danger" });
        }
        if (error.response?.status === 404) {
          setEmployeeData([]);
        }
      });
  };

  const getEmployeeDataHandler = async (id) => {
    if (id) {
      if (!yearFilter && !monthFilter) {
        return;
      }
      try {
        const res = await adminSchedulingService.getStaffScheduleByEmployeeId({
          employeeId: id,
          year: yearFilter,
          month: monthFilter,
        });

        setEmployeeSingleData(res.data?.data);
        showNotification({ message: res.data?.message, type: "success" });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setEmployeeSingleData([]);
        } else {
          showNotification({
            message: error.response.data.message,
            type: "danger",
          });
        }
      }
    } else {
      getEmployees();
    }
  };
  useEffect(() => {
    if (employeeId) {
      getEmployeeDataHandler(employeeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, yearFilter, monthFilter]);

  const [keyChange, setKeyChange] = useState(false);

  useEffect(() => {
    getEmployees();
  }, []);
  function MyVerticallyCenteredModal(props) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(
      resolveAdminAssetPath("/Dashboard/contacts/user.png"),
    );
    const [date11, setDate11] = useState("");
    const [date112, setDate112] = useState("");
    const [date113, setDate113] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [administratorAndNumber, setAdministrator] = useState("");
    const [registeredNurseAndNumber, setRegisteredNurseAndNumber] =
      useState("");
    const [bhtNameAndNumber, setBhtNameAndNumber] = useState("");
    const initialSchedule = [
      {
        start: "",
        end: "",
        type: "",
      },
    ];

    const [schedule, setSchedule] = useState(initialSchedule);

    const handleChange = (index, field, value) => {
      const updatedSchedule = [...schedule];
      updatedSchedule[index][field] = value;
      setSchedule(updatedSchedule);
    };

    const handleAddScheduleItem = () => {
      setSchedule([...schedule, { date: currentDate }]);
    };
    useEffect(() => {
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }
    }, [selectedFile]);

    const handleDateChange = (e) => {
      const selectedDate = e.target.value;

      const dateObj = new Date(selectedDate);
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const date = String(dateObj.getDate()).padStart(2, "0");
      const year = dateObj.getFullYear();
      setDate11(date);
      setDate112(month);
      setDate113(year);

      setCurrentDate(selectedDate);
    };
    const handleSubmit = (e) => {
      e.preventDefault();
      const payload = {};

      payload.currentDate = date11.toString();
      payload.month = String(date112);
      payload.year = String(date113);

      if (employeeId) payload.employeeId = employeeId;

      if (administratorAndNumber)
        payload.administratorAndNumber = administratorAndNumber;
      if (registeredNurseAndNumber)
        payload.registeredNurseAndNumber = registeredNurseAndNumber;
      if (bhtNameAndNumber) payload.bhtNameAndNumber = bhtNameAndNumber;
      if (schedule) payload.schedule = schedule;

      adminSchedulingService
        .addStaffSchedule(payload)
        .then((res) => {
          showNotification({ message: res.data.message, type: "success" });
          setModalShow(false);
        })
        .catch((error) => {
          showNotification({
            message: error.response.data.message,
            type: "danger",
          });
        });
    };

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {addContactBtn === "edit" ? (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Edit Resident’s Details</h5>
            </Modal.Header>
            <Modal.Body>
              <Form.Label className="w-100 fw-bold">
                Last Updated ( Date Range )
              </Form.Label>
              <Form>
                <Row>
                  <Col xs={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Staff Full Name{" "}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Staff Full Name"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} lg={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Day </Form.Label>
                      <Form.Control type="text" placeholder="Enter Day" />
                    </Form.Group>
                  </Col>
                  <Col xs={12} lg={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Date </Form.Label>
                      <Form.Control type="date" placeholder="Enter  Date" />
                    </Form.Group>
                  </Col>
                  <Col xs={12} lg={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Shift Time </Form.Label>
                      <Form.Control
                        type="date"
                        placeholder="Enter Shift Time"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <Row>
                <Col xs={12}></Col>
              </Row>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
              <Button className="theme-button" onClick={props.onHide}>
                SAVE
              </Button>
              <Button className="theme-button-outline" onClick={props.onHide}>
                CANCEL
              </Button>
            </Modal.Footer>
          </>
        ) : addContactBtn == "add" ? (
          <>
            {" "}
            <Form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <h5 className="fw-bold mb-0">
                  {keyChange ? "Edit" : "Add"} Staff Schedule
                </h5>
              </Modal.Header>
              <ModalBody>
                <div>
                  <Row>
                    <Col xs={12} lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Select Employee:
                        </Form.Label>
                        <Form.Select
                          required
                          onChange={(e) => {
                            setEmployeeId(e.target.value);
                            setEmployee1Name(
                              e.target.options[e.target.selectedIndex].text,
                            );
                          }}
                          aria-label="Default select example"
                        >
                          <option value={""}>Select Employee</option>
                          {employees?.map((employee, index) => (
                            <option key={index} required value={employee._id}>
                              {employee.fullName}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={12} lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Date:</Form.Label>
                        <Form.Control
                          required
                          type="date"
                          onChange={handleDateChange}
                          placeholder="Enter Date"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {schedule.map((item, index) => (
                    <Form key={index}>
                      <Row>
                        <Col xs={12} lg={4}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                              Start Time:
                            </Form.Label>
                            <Form.Control
                              required
                              type="time"
                              value={item.start}
                              onChange={(e) =>
                                handleChange(index, "start", e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={12} lg={4}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                              End Time:
                            </Form.Label>
                            <Form.Control
                              required
                              type="time"
                              value={item.end}
                              onChange={(e) =>
                                handleChange(index, "end", e.target.value)
                              }
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={12} lg={4}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Type:</Form.Label>
                            <Form.Select
                              required
                              onChange={(e) =>
                                handleChange(index, "type", e.target.value)
                              }
                            >
                              <option value={""}>Select Type</option>
                              <option value="amToPm">AM to PM</option>
                              <option value="pmToAm">PM to AM</option>
                              <option value="pmToAm">PM to AM</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                  ))}
                  <Row className="text-center my-3">
                    <Col xs={12}>
                      <Button onClick={handleAddScheduleItem}>
                        Add Schedule Item
                      </Button>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3 mt-3">
                    <Form.Label className="fw-bold">
                      Administrator Name and Number:
                    </Form.Label>
                    <Form.Control
                      required
                      onChange={(e) => setAdministrator(e.target.value)}
                      type="text"
                      placeholder="Enter Administrator Name and Number"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Registered Nurse:
                    </Form.Label>
                    <Form.Control
                      required
                      onChange={(e) =>
                        setRegisteredNurseAndNumber(e.target.value)
                      }
                      type="text"
                      placeholder="Enter  Registered Nurse Name and Number"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      BHT Name and Number:
                    </Form.Label>
                    <Form.Control
                      required
                      onChange={(e) => setBhtNameAndNumber(e.target.value)}
                      type="text"
                      placeholder="Enter  BHT Name and Number"
                    />
                  </Form.Group>
                </div>
              </ModalBody>
              <Modal.Footer className="justify-content-center">
                <Button className="theme-button" type="submit">
                  APPLY
                </Button>
                <Button className="theme-button-outline" onClick={props.onHide}>
                  CANCEL
                </Button>
              </Modal.Footer>
            </Form>
          </>
        ) : (
          <>
            {" "}
            <Form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <h5 className="fw-bold mb-0">Staff Schedule Details</h5>
              </Modal.Header>
              <ModalBody>
                <div>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">Date:</Form.Label>
                    <Form.Control required disabled value={viewItem?.date} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Administrator Name and Number:
                    </Form.Label>
                    <Form.Control
                      required
                      disabled
                      value={viewItem?.administratorAndNumber}
                      type="text"
                      placeholder="Enter Text.."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Registered Nurse:
                    </Form.Label>
                    <Form.Control
                      required
                      disabled
                      value={viewItem?.registeredNurseAndNumber}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Bht Name and Number:
                    </Form.Label>
                    <Form.Control
                      required
                      disabled
                      value={viewItem?.bhtNameAndNumber}
                    />
                  </Form.Group>
                  <Table responsive bordered className="mt-2">
                    <thead>
                      <tr>
                        <th>Start</th>
                        <th>End</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewItem?.schedule?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.start}</td>
                          <td>{item.end}</td>
                          <td>{item.type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </ModalBody>
              <Modal.Footer className="justify-content-center">
                <Button className="theme-button" onClick={props.onHide}>
                  CANCEL
                </Button>
              </Modal.Footer>
            </Form>
          </>
        )}
      </Modal>
    );
  }

  const [query, setQuery] = useState("");
  const [currentPage2, setCurrentPage2] = useState(1);
  const [postPerPage2] = useState(5);
  const lastPostIndex2 = currentPage2 * postPerPage2;
  const firstPostIndex2 = lastPostIndex2 - postPerPage2;
  let pages2 = [];

  const TotolData = query
    ? employeeSingleData?.filter(
        (i) =>
          i?.patientId?.fullName
            ?.toLowerCase()
            .includes(query?.toLowerCase()) ||
          i?.email?.toLowerCase().includes(query?.toLowerCase()) ||
          i?.role?.toLowerCase().includes(query?.toLowerCase()),
      )
    : employeeSingleData;

  useEffect(() => {
    if (query) {
      setCurrentPage2(1);
    }
  }, [query]);

  const slicedData = TotolData?.slice(firstPostIndex2, lastPostIndex2);

  for (let i = 1; i <= Math.ceil(TotolData?.length / postPerPage2); i++) {
    pages2.push(i);
  }

  function Next() {
    setCurrentPage2(currentPage2 + 1);
  }

  function Prev() {
    if (currentPage2 !== 1) {
      setCurrentPage2(currentPage2 - 1);
    }
  }

  return <></>;
};

export default StaffSchedule;
