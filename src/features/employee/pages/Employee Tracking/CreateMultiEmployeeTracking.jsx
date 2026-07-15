/* eslint-disable no-unused-vars */
/** @format */
import { useEffect, useState } from "react";
import { Form, Container, Card, Row, Col } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { userProfile } from "@/store/authSlice";
import {
  employeeTrackingService,
  updateEmployeeTracking,
  UploadEmployeeTracking,
} from "@/features/shared/services";
import { useFileUpload } from "@shared/hooks";
import { fetchPaitentName, formatDateToMMDDYYYY } from "@/utils/utils";
import NavWrapper from "@/utils/NavWrapper";
import EmployeeComponent from "@/features/shared/ui/Search/EmployeeComponent";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import CustomSelect from "@/features/shared/ui/selectors/CustomSelect";
import { ROLES } from "@/features/shared/constants";
import { ADMIN_APIS } from "@/features/shared/services";
import { EMPLOYEE_APIS } from "@/features/shared/services";
import { showNotification } from "@/utils";
const CreateMultiEmployeeTracking = () => {
  const profileDetail = useSelector(userProfile);
  const { id } = useParams();
  const navigate = useNavigate();
  const fileUpload = useFileUpload();
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [data, setData] = useState("");
  const [user, setUser] = useState({});
  const options = [
    "CPR/First Aid",
    "TB Test/Chest Xray",
    "TB test Questionnaire",
    "Fingerprint Clearance Card",
    "Infectious Control Training",
    "TB Annual Education",
    "Fall Prevention and Fall Recovery",
    "APS Search",
    "CPI/Prevention and Support",
    "Annual abuse and neglect training",
  ];
  const fetchHandler = () => {
    employeeTrackingService.getMultiTracking({
      isAdmin: profileDetail?.userType === ROLES.ADMIN,
      id,
      setLoading,
      setResponse: setData,
    });
  };
  useEffect(() => {
    if (id) {
      fetchHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const item = data?.data;
    if (item) {
      setName(item.type);
      setDueDate(item?.dueDate);
      setUser(item?.userId);
    }
  }, [data?.data]);
  const submitHandler = (e) => {
    e.preventDefault();
    if (!fileUpload.file) {
      showNotification({
        message: "Please select a file",
        type: "danger",
      });
      return;
    }
    const formData = new FormData();
    formData.append("type", name);
    formData.append("file", fileUpload.file);
    formData.append("dueDate", dueDate);
    if (employeeId) {
      UploadEmployeeTracking({
        url: ADMIN_APIS.ADMIN_ADD_EMPLOYEE_TRACKING(employeeId),
        formData,
        setLoading,
        successMsg: "Uploaded !",
        navigate,
      });
    } else {
      UploadEmployeeTracking({
        url: EMPLOYEE_APIS.EMPLOYEE_ADD_EMPLOYEE_TRACKING,
        formData,
        setLoading,
        successMsg: "Uploaded !",
        navigate,
      });
    }
  };
  const updateHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("type", name);
    if (fileUpload.file) {
      formData.append("file", fileUpload.file);
    }
    formData.append("dueDate", dueDate);
    updateEmployeeTracking({
      url:
        profileDetail?.userType === ROLES.ADMIN
          ? `admin/update-employee-tracking/${id}`
          : `employee/update-employee-tracking/${id}`,
      formData,
      setLoading,
      successMsg: "Uploaded !",
      navigate,
    });
  };
  return (
    <>
      <NavWrapper title={"Employee Tracking / Upload"} isArrow={true} />
      <Form onSubmit={id ? updateHandler : submitHandler}>
        <Container className="full-width-container">
          <Row>
            <Col xs={12} md={12} lg={12}>
              <Form.Label className="fw-bold">
                {profileDetail?.userType === ROLES.ADMIN && !id && (
                  <EmployeeComponent
                    className={"grid-item"}
                    MainPatientId={setEmployeeId}
                    setWholeData={setEmployeeData}
                    MainResidentName={setEmployeeName}
                  />
                )}
                {profileDetail?.userType === ROLES.ADMIN && id && (
                  <Form.Group className="d-flex flex-row">
                    <Form.Label>Employee Name : </Form.Label>
                    <Form.Label>{fetchPaitentName(user)}</Form.Label>
                  </Form.Group>
                )}
              </Form.Label>
            </Col>
          </Row>
          <>
            <Card body className="mb-3">
              <Row>
                <Col xs={12} md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">File Name</Form.Label>
                    <CustomSelect
                      options={options}
                      filterOnType
                      onChange={(value) => setName(value)}
                      value={name}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={8}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Choose File</Form.Label>
                    <Form.Control
                      type="file"
                      placeholder=""
                      onChange={fileUpload.onSelectFile}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">Due Date</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(dueDate)}
                      onChange={(selectedDate) =>
                        setDueDate(selectedDate?.toDateString())
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      className="form-control"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            dueDate
                              ? formatDateToMMDDYYYY(dueDate)
                              : new Date(),
                          ],
                        },
                      ]}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card>
            <Row>
              <Col xs={12} lg={12}>
                <div className="employee-btn-joiner">
                  <button className="employee_create_btn" type="submit">
                    {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                  </button>
                </div>
              </Col>
            </Row>
          </>
        </Container>
      </Form>
    </>
  );
};
export default HOC({
  Wcomponenet: CreateMultiEmployeeTracking,
});
