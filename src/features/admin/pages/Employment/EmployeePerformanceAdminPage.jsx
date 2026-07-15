/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import { Button, Container, Form, ModalBody, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import "@/assets/styles/admin/Contacts.css";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Modal from "react-bootstrap/Modal";
import { Row, Col } from "react-bootstrap";
import { showNotification } from "@/utils";
import { EmployeePerformance2 } from "./EmployeePerformanceAdminPanel";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { clearPrimarySignatureDraft } from "@/store/signatureDraftSlice";
import NavWrapper from "@/utils/NavWrapper";
import {
  AddSignature,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import DatePicker from "react-datepicker";
import {
  getAdminProfile as getAdminProfileApi,
  getAdminUser,
  createEmployeePerformanceReview as createEmployeePerformanceReviewApi,
  adminDashboardService,
} from "@/features/shared/services/index";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants/index";
import { useEmployeePerformanceList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const EmployeePerformance = () => {
  const dispatch = useDispatch();
  const profilePermission = useSelector(userProfile);
  const hoursFormat =
    profilePermission?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [show, setShow] = useState(false);
  const [addContactBtn, setAddContactBtn] = useState("");
  const [userId, setUserId] = useState("");
  const [viewlog, setViewLog] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [adminProfile, setAdminProfile] = useState({});
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  useEffect(() => {
    getAdminProfileApi().then((res) => {
      setAdminProfile(res?.data?.data || {});
    });
  }, []);
  const { data: response, isLoading: loading } = useEmployeePerformanceList(
    { page, limit, debouncedQuery },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const employeePerformanceData = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.employeePerformance.all(),
    });
  }, [queryClient]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);
  useEffect(() => {
    if (response?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.docs?.length, page]);
  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };
  function MyVerticallyCenteredModal(props) {
    const [openShow, setOpenShow] = useState(false);
    const [viewItem, setViewItem] = useState({});
    const [ad, setAd] = useState("");
    const [ads, setAds] = useState("");
    const [name, setName] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [date, setDate] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [mangager, setMangager] = useState("");
    const [typeofReview, setTypeofReview] = useState(
      viewlog?.typeofReview || "sixMonth",
    );
    const [hireDate, setHireDate] = useState("");
    const [reviewPeriod, setReviewPeriod] = useState("");
    const [rating1, setRating1] = useState("");
    const [rating1Error, setRating1Error] = useState("");
    const [rating2, setRating2] = useState("");
    const [rating2Error, setRating2Error] = useState("");
    const [rating3, setRating3] = useState("");
    const [rating3Error, setRating3Error] = useState("");
    const [rating4, setRating4] = useState("");
    const [rating4Error, setRating4Error] = useState("");
    const [rating5, setRating5] = useState("");
    const [rating5Error, setRating5Error] = useState("");
    const [rating6, setRating6] = useState("");
    const [rating6Error, setRating6Error] = useState("");
    const [overallRating, setOverallRating] = useState("");
    const [overAllRatingError, setOverAllRatingError] = useState("");
    const [evolution, setEvolution] = useState("");
    const [additionalCommet, setAdditionalCommet] = useState("");
    const [administratorName, setAdministratorName] = useState("");
    const [administratorSignature, setAdministratorSignature] = useState("");
    const [administratorDate, setAdministratorDate] = useState("");
    const [administratorTime, setAdministratorTime] = useState("");
    const [allEmployees, setAllEmployees] = useState([]);
    const [signers, setSigners] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [employeeData, setEmployeeData] = useState({
      employeeId: viewItem?.employeeId || "",
      jobDescription: viewItem?.jobDescription || "",
      positionsSupervised: viewItem?.positionsSupervised || false,
      primaryResponsibilities: viewItem?.primaryResponsibilities || [""],
      coreCompetencies: viewItem?.coreCompetencies || [""],
      minimumQualifications: viewItem?.minimumQualifications || [""],
      minimumDescription: viewItem?.minimumDescription || "",
      employeeInfoName: viewItem?.employeeInfoName || "",
      pleaseNote: viewItem?.pleaseNote || "",
      companyName: viewItem?.companyName || "",
    });
    const getAllEmployees = () => {
      getAdminUser().then((res) => {
        let filteredData = res.data?.data?.filter(
          (item) => item.userType === ROLES.EMPLOYEE,
        );
        setAllEmployees(filteredData);
      });
    };
    useEffect(() => {
      if (modalShow) {
        getAllEmployees();
      }
    }, []);
    useEffect(() => {
      if (addContactBtn === "default") {
        setDate(formatDateToMMDDYYYY(new Date()));
        setJobTitle("Employee");
        setMangager("John");
        setTypeofReview("sixMonth");
        setHireDate(formatDateToMMDDYYYY(new Date()));
        setReviewPeriod(formatDateToMMDDYYYY(new Date()));
        setRating1("5");
        setRating2("5");
        setRating3("5");
        setRating4("5");
        setRating5("5");
        setRating6("5");
        setOverallRating("5");
        setEvolution("Good");
        setAdditionalCommet("Impressed with the performance");
      } else if (addContactBtn === "edit") {
        setEmployeeId(viewlog?.employeeId?._id);
        setDate(formatDateToMMDDYYYY(viewlog?.employeeDate));
        setJobTitle(viewlog?.employeeJobTitle);
        setMangager(viewlog?.employeeManager);
        setTypeofReview(viewlog?.typeofReview);
        setHireDate(formatDateToMMDDYYYY(viewlog?.employeeHireDate));
        setReviewPeriod(formatDateToMMDDYYYY(viewlog?.reviewPeriod));
        setRating1(viewlog?.ratingsPerformanceAndQualityOfWork);
        setRating2(viewlog?.ratingsCommunication);
        setRating3(viewlog?.ratingsProfessionalism);
        setRating4(viewlog?.ratingsAttendanceAndPunctuality);
        setRating5(viewlog?.ratingsTimeManagement);
        setRating6(viewlog?.ratingsReliabilityDependability);
        setOverallRating(viewlog?.overallRating);
        setEvolution(viewlog?.evaluation);
        setAdditionalCommet(viewlog?.additionalComments);
        setAdministratorSignature(viewlog.administratorSignature);
        setAdministratorDate(viewlog.administratorDate);
        setAdministratorTime(viewlog.administratorTime);
        setSigners(viewlog?.signers);
      }
      setAdministratorName(fetchPaitentName(profilePermission));
    }, []);
    async function createEmployeePerformance(payload) {
      try {
        setIsLoading(true);
        const res = await createEmployeePerformanceReviewApi(payload);
        employeePerformanceData();
        setModalShow(false);
        showNotification({ message: res.data.message, type: "success" });
      } catch (error) {
        showNotification({
          message: error.response?.data?.message || error.message,
          type: "danger",
        });
      } finally {
        setIsLoading(false);
      }
    }
    const handleAddNew = (e) => {
      e.preventDefault();
      if (!employeeId) {
        showNotification({
          message: "Please select an employee",
          type: "danger",
        });
        return; // Exit the function early if employeeId is not selected
      }
      const payload = {};
      if (employeeId) payload.employeeId = employeeId;
      if (date) payload.employeeDate = date;
      if (jobTitle) payload.employeeJobTitle = jobTitle;
      if (mangager) payload.employeeManager = mangager;
      if (typeofReview) payload.typeOfReview = typeofReview;
      if (hireDate) payload.employeeHireDate = hireDate;
      if (reviewPeriod) payload.reviewPeriod = reviewPeriod;
      if (rating1) payload.ratingsPerformanceAndQualityOfWork = rating1;
      if (rating2) payload.ratingsCommunication = rating2;
      if (rating3) payload.ratingsProfessionalism = rating3;
      if (rating4) payload.ratingsAttendanceAndPunctuality = rating4;
      if (rating5) payload.ratingsTimeManagement = rating5;
      if (rating6) payload.ratingsReliabilityDependability = rating6;
      if (overallRating) payload.overallRating = overallRating;
      if (evolution) payload.evaluation = evolution;
      if (additionalCommet) payload.additionalComments = additionalCommet;
      if (administratorName) payload.administratorName = administratorName;
      if (administratorSignature)
        payload.administratorSignature = administratorSignature;
      if (administratorDate) payload.administratorDate = administratorDate;
      if (administratorTime) payload.administratorTime = administratorTime;
      payload.signers = signers.map((signer) => ({
        signerId: signer.value,
        name: signer.label,
        signature: "",
        dateSigned: "",
        signedTime: "",
      }));
      createEmployeePerformance(payload);
    };
    const handleUpdate = (e) => {
      e.preventDefault();
      const payload = viewlog;
      if (employeeId) payload.employeeId = employeeId;
      else payload.employeeId = viewlog?.employeeId?._id;
      if (date) payload.employeeDate = date;
      if (jobTitle) payload.employeeJobTitle = jobTitle;
      if (mangager) payload.employeeManager = mangager;
      if (typeofReview) payload.typeOfReview = typeofReview;
      if (hireDate) payload.employeeHireDate = hireDate;
      if (reviewPeriod) payload.employeeHireDate = reviewPeriod;
      if (rating1) payload.ratingsPerformanceAndQualityOfWork = rating1;
      if (rating2) payload.ratingsCommunication = rating2;
      if (rating3) payload.ratingsProfessionalism = rating3;
      if (rating4) payload.ratingsAttendanceAndPunctuality = rating4;
      if (rating5) payload.ratingsTimeManagement = rating5;
      if (rating6) payload.ratingsReliabilityDependability = rating6;
      if (overallRating) payload.overallRating = overallRating;
      if (evolution) payload.evaluation = evolution;
      if (additionalCommet) payload.additionalComments = additionalCommet;
      if (administratorName) payload.administratorName = administratorName;
      if (administratorSignature)
        payload.administratorSignature = administratorSignature;
      if (administratorDate) payload.administratorDate = administratorDate;
      if (administratorTime) payload.administratorTime = administratorTime;
      createEmployeePerformance(payload);
    };
    const handleUpdateEmployeeData = (name, value) => {
      setEmployeeData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
    const employeeDataChangeHandler = (e) => {
      const selectedEmployeeId = e.target.value;
      const selectedEmployee = allEmployees.find(
        (employee) => employee._id === selectedEmployeeId,
      );
      setEmployeeId(selectedEmployeeId);
      if (selectedEmployee) {
        handleUpdateEmployeeData("employeeId", selectedEmployeeId);
        handleUpdateEmployeeData("employeeInfoName", selectedEmployee.fullName);
      }
    };
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
    const checkSign = useCallback(async () => {
      let isAdminConditionValid =
        profilePermission.userType === ROLES.ADMIN &&
        administratorSignature?.length > 0;
      if (isAdminConditionValid) {
        setIsSubmitEnabled(true);
      } else {
        setIsSubmitEnabled(false);
      }
    }, [administratorSignature?.length]);
    useEffect(() => {
      if (addContactBtn === "edit") {
        checkSign();
      }
    }, [administratorSignature, checkSign]);
    const checkFormat = (inputString) => {
      if (inputString === "") {
        return {
          isValid: true,
          error: "",
        };
      }
      const pattern = /^(\d{1,4})\/(\d{1,4})$/;
      const match = inputString.match(pattern);
      if (!/^[0-9/]+$/.test(inputString)) {
        return {
          isValid: false,
          error: "Format must be like 1/10",
        };
      }
      if (!match) {
        return {
          isValid: false,
          error: "Format must be like 1/10",
        };
      }
      const left = Number(match[1]);
      const right = Number(match[2]);
      if (right === 0) {
        return {
          isValid: false,
          error: "Total cannot be 0",
        };
      }
      if (left > right) {
        return {
          isValid: false,
          error: "Rating cannot be greater than total",
        };
      }
      return {
        isValid: true,
        error: "",
      };
    };
    const handleRatingChange = (e, setvalue, setError) => {
      let value = e.target.value;
      const result = checkFormat(value);
      setvalue(value);
      setError(result.isValid ? "" : result.error);
    };
    return (
      <>
        <AddSignature
          show={openShow}
          setValue={setAdministratorSignature}
          setDate={setAdministratorDate}
        />
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          {addContactBtn === "edit" ? (
            <>
              <Modal.Header closeButton>
                <h5 className="fw-bold mb-0">
                  Edit Employee Performance Details
                </h5>
              </Modal.Header>
              <Modal.Body>
                <div id="form-appendix">
                  <Row className="mb-3">
                    <Col sm="12" md="6">
                      <Form.Group className="mb-3">
                        <Form.Label>Name:</Form.Label>
                        <Form.Select
                          required
                          onChange={employeeDataChangeHandler}
                          disabled
                          aria-label="Default select example"
                          value={employeeId}
                        >
                          <option value={""}>Select Employee</option>
                          {allEmployees &&
                            allEmployees.map((item) => (
                              <option
                                value={item._id.toString()}
                                key={item._id}
                              >
                                {`${item.firstName} ${item.lastName}`}
                              </option>
                            ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col sm="12" md="6">
                      <Form.Group className="mb-3 d-flex flex-column">
                        <Form.Label>Date:</Form.Label>

                        <DatePicker
                          selected={formatDateToMMDDYYYY(date)}
                          onChange={(selectedDate) =>
                            setDate(selectedDate?.toDateString())
                          }
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          className="form-control"
                          highlightDates={[
                            {
                              "react-datepicker__day--highlighted-custom": [
                                date ? formatDateToMMDDYYYY(date) : new Date(),
                              ],
                            },
                          ]}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm="12" md="6">
                      <Form.Group className="mb-3">
                        <Form.Label>Job Title:</Form.Label>
                        <Form.Control
                          type="text"
                          onChange={(e) => setJobTitle(e.target.value)}
                          value={jobTitle}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm="12" md="6">
                      <Form.Group className="mb-3">
                        <Form.Label>Manager:</Form.Label>
                        <Form.Control
                          onChange={(e) => setMangager(e.target.value)}
                          type="text"
                          value={mangager}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm="12" md="6">
                      <Form.Group className="mb-3">
                        <Form.Label>Type of Review</Form.Label>
                        <Form.Select
                          required
                          onChange={(e) => setTypeofReview(e.target.value)}
                          value={typeofReview}
                          aria-label="Default select example"
                        >
                          <option value={"sixMonth"}>6 months</option>
                          <option value={"Annual"}>Annual</option>
                          <option value={"Other"}>Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col sm="12" md="6">
                      <Form.Group className="mb-3 d-flex flex-column">
                        <Form.Label>Hire Date:</Form.Label>

                        <DatePicker
                          selected={formatDateToMMDDYYYY(hireDate)}
                          onChange={(selectedDate) =>
                            setHireDate(selectedDate?.toDateString())
                          }
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          className="form-control"
                          highlightDates={[
                            {
                              "react-datepicker__day--highlighted-custom": [
                                hireDate
                                  ? formatDateToMMDDYYYY(hireDate)
                                  : new Date(),
                              ],
                            },
                          ]}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm="12" md="12">
                      <Form.Group className="mb-3 d-flex flex-column">
                        <Form.Label>Review Period:</Form.Label>

                        <DatePicker
                          selected={formatDateToMMDDYYYY(reviewPeriod)}
                          onChange={(selectedDate) =>
                            setReviewPeriod(selectedDate?.toDateString())
                          }
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          className="form-control"
                          highlightDates={[
                            {
                              "react-datepicker__day--highlighted-custom": [
                                reviewPeriod
                                  ? formatDateToMMDDYYYY(reviewPeriod)
                                  : new Date(),
                              ],
                            },
                          ]}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <div className="rating-criteria mt-2">
                        <Form.Label className="w-100 fw-bold">
                          Rating Criteria
                        </Form.Label>
                        <ul className="list-unstyled text-sm">
                          <li>
                            <b>Outstanding:</b> Performance in this area is far
                            exceeded expectations and requirements
                          </li>
                          <li>
                            <b>Exceed Expectations:</b> Accomplished more than
                            expected
                          </li>
                          <li>
                            <b>Meets Expectations:</b> Fully competent,
                            consistently meets requirements and expectations
                          </li>
                          <li>
                            <b>Needs Improvement:</b>
                            Requires significant amount of guidance and
                            supervision
                          </li>
                          <li>
                            <b>Expectation not met:</b> Improve in all areas is
                            needed
                          </li>
                        </ul>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>
                      <Form.Label className="w-100 fw-bold">
                        Ratings:
                      </Form.Label>
                      <Form.Label className="w-100 fw-bold">
                        Factors{" "}
                      </Form.Label>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Performance and Quality of work ( work is completed
                          without guidance of supervision, work is completed
                          accurately and met within deadline)
                        </Form.Label>
                        <Form.Control
                          onChange={(e) =>
                            handleRatingChange(e, setRating1, setRating1Error)
                          }
                          value={rating1}
                          type="text"
                          placeholder="Enter Rating like: (1/10)"
                          isInvalid={!!rating1Error}
                        />
                        <Form.Control.Feedback type="invalid">
                          {rating1Error}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Communication (positive interaction with staff,
                          management, and other employees. Communicate essential
                          information relating to patient care and employment.
                          Written and oral communications are clear and
                          effective.)
                        </Form.Label>
                        <Form.Control
                          onChange={(e) =>
                            handleRatingChange(e, setRating2, setRating2Error)
                          }
                          value={rating2}
                          type="text"
                          placeholder="Enter Rating like: (1/10)"
                          isInvalid={!!rating2Error}
                        />
                        <Form.Control.Feedback type="invalid">
                          {rating2Error}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Professionalism (employee maintains professionalism
                          when dealing with staff, residents, and others)
                        </Form.Label>
                        <Form.Control
                          onChange={(e) =>
                            handleRatingChange(e, setRating3, setRating3Error)
                          }
                          value={rating3}
                          type="text"
                          placeholder="Enter Rating like: (1/10)"
                          isInvalid={!!rating3Error}
                        />
                        <Form.Control.Feedback type="invalid">
                          {rating3Error}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Attendance and Punctuality (employee is punctual to
                          work. Employee notifies supervisor ahead of time in
                          the case of absence. Employee always shows up to work)
                        </Form.Label>
                        <Form.Control
                          onChange={(e) =>
                            handleRatingChange(e, setRating4, setRating4Error)
                          }
                          value={rating4}
                          type="text"
                          placeholder="Enter Rating like: (1/10)"
                          isInvalid={!!rating4Error}
                        />
                        <Form.Control.Feedback type="invalid">
                          {rating4Error}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Time management (time management in completing task
                          and meeting deadline)
                        </Form.Label>
                        <Form.Control
                          onChange={(e) =>
                            handleRatingChange(e, setRating5, setRating5Error)
                          }
                          value={rating5}
                          type="text"
                          placeholder="Enter Rating like: (1/10)"
                          isInvalid={!!rating5Error}
                        />
                        <Form.Control.Feedback type="invalid">
                          {rating5Error}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Reliaility/Depedendability (manage workload
                          effectively. Willing to assist others. Goes over and
                          beyond to ensure task is completed)
                        </Form.Label>
                        <Form.Control
                          onChange={(e) =>
                            handleRatingChange(e, setRating6, setRating6Error)
                          }
                          value={rating6}
                          type="text"
                          placeholder="Enter Rating like: (1/10)"
                          isInvalid={!!rating6Error}
                        />
                        <Form.Control.Feedback type="invalid">
                          {rating6Error}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Overall Rating – Rate employee’s overall performance
                          in comparison to position duties and responsibilities.
                        </Form.Label>
                        <Form.Control
                          onChange={(e) =>
                            handleRatingChange(
                              e,
                              setOverallRating,
                              setOverAllRatingError,
                            )
                          }
                          value={overallRating}
                          type="text"
                          placeholder="Enter Rating like: (1/10)"
                          isInvalid={!!overAllRatingError}
                        />
                        <Form.Control.Feedback type="invalid">
                          {overAllRatingError}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Row className="mb-3">
                        <Col sm="12" md="6">
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                              Evaluation:
                            </Form.Label>
                            <Form.Control
                              onChange={(e) => setEvolution(e.target.value)}
                              type="text"
                              rows="3"
                              value={evolution}
                            />
                          </Form.Group>
                        </Col>
                        <Col sm="12" md="6">
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                              Additional Comments:
                            </Form.Label>
                            <Form.Control
                              onChange={(e) =>
                                setAdditionalCommet(e.target.value)
                              }
                              type="text"
                              rows="3"
                              value={additionalCommet}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Form.Label className="fw-bold w-100">
                    <span> Verification of Review:</span> By signing this form,
                    you confirm that you have discussed this review in detail
                    with your supervisor. Signing this form does not necessarily
                    indicate that you agree with this evaluation.
                  </Form.Label>
                  <Row>
                    <Col xs={12} lg={4}>
                      <Button
                        className="theme-button"
                        onClick={() => setOpenShow(true)}
                      >
                        SAVED AND SIGNED
                      </Button>
                    </Col>
                    <Col xs={12} lg={8}>
                      <Form.Label className="w-100 text-end">
                        {signatureFormat({
                          sign: administratorSignature,
                          date: administratorDate,
                          time: administratorTime,
                          hoursFormat,
                        })}
                        {signatureFormat({
                          sign: viewlog.employeeSignature,
                          date: viewlog.employeeSignDate,
                          time: viewlog.administratorTime,
                          hoursFormat,
                        })}
                      </Form.Label>
                      <Form.Label className="w-100 text-end">
                        {signers?.map(
                          (signer) =>
                            signer.signature && (
                              <div key={signer?.signerId}>
                                {signatureFormat({
                                  sign: signer.signature,
                                  date: signer.dateSigned,
                                  time: signer.signedTime,
                                  hoursFormat,
                                })}
                              </div>
                            ),
                        )}
                      </Form.Label>
                    </Col>
                  </Row>
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-content-center">
                <Button
                  className="theme-button"
                  onClick={handleUpdate}
                  disabled={!isSubmitEnabled}
                >
                  Update
                </Button>

                <Button className="theme-button-outline" onClick={props.onHide}>
                  Cancle
                </Button>
              </Modal.Footer>
            </>
          ) : addContactBtn === "view" ? (
            <>
              <Modal.Header closeButton>
                <h5 className="fw-bold mb-0">Employee Performance</h5>
              </Modal.Header>
              <ModalBody>
                <EmployeePerformance2 item={viewlog} ad={ad} ads={ads} />
              </ModalBody>
            </>
          ) : addContactBtn === "default" ? (
            <>
              <Modal.Header closeButton>
                <h5 className="fw-bold mb-0">Default Employee Performance</h5>
              </Modal.Header>
              <Form noSubmit={handleAddNew}>
                <Modal.Body>
                  <div id="form-appendix">
                    <p className="text-base font-bold">Employee Information:</p>
                    <Row className="mb-3">
                      <Col sm="12" md="6">
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">Employee</Form.Label>
                          <Form.Select
                            required
                            onChange={employeeDataChangeHandler}
                            aria-label="Default select example"
                            defaultValue={
                              employeeId || viewlog?.employeeId?._id
                            }
                          >
                            <option value={""}>Select Employee</option>
                            {allEmployees?.map((item) => {
                              return (
                                <option value={item?._id} key={item?._id}>
                                  {item?._id === viewlog?.employeeId?._id}
                                  {`${item?.firstName} ${item?.lastName}`}
                                </option>
                              );
                            })}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm="12" md="6">
                        <Form.Group className="mb-3 d-flex flex-column">
                          <Form.Label className="fw-bold">Date:</Form.Label>

                          <DatePicker
                            selected={formatDateToMMDDYYYY(
                              date || viewlog?.employeeDate,
                            )}
                            onChange={(selectedDate) =>
                              setDate(selectedDate?.toDateString())
                            }
                            dateFormat="MM/dd/yyyy"
                            placeholderText="MM/DD/YYYY"
                            className="form-control"
                            highlightDates={[
                              {
                                "react-datepicker__day--highlighted-custom": [
                                  date || viewlog?.employeeDate
                                    ? formatDateToMMDDYYYY(
                                        date || viewlog?.employeeDate,
                                      )
                                    : new Date(),
                                ],
                              },
                            ]}
                          />
                        </Form.Group>
                      </Col>
                      <Col sm="12" md="6">
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            Job Title:
                          </Form.Label>
                          <Form.Control
                            type="text"
                            onChange={(e) => setJobTitle(e.target.value)}
                            value={jobTitle || viewlog?.employeeJobTitle}
                          />
                        </Form.Group>
                      </Col>
                      <Col sm="12" md="6">
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">Manager:</Form.Label>
                          <Form.Control
                            onChange={(e) => setMangager(e.target.value)}
                            type="text"
                            value={mangager || viewlog?.employeeManager}
                          />
                        </Form.Group>
                      </Col>
                      <Col sm="12" md="6">
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            Type of Review
                          </Form.Label>
                          <Form.Select
                            required
                            onChange={(e) => setTypeofReview(e.target.value)}
                            value={typeofReview}
                            aria-label="Default select example"
                          >
                            <option value={"sixMonth"}>6 months</option>
                            <option value={"Annual"}>Annual</option>
                            <option value={"Other"}>Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm="12" md="6">
                        <Form.Group className="mb-3 d-flex flex-column">
                          <Form.Label className="fw-bold">
                            Hire Date:
                          </Form.Label>

                          <DatePicker
                            selected={formatDateToMMDDYYYY(
                              hireDate || viewlog?.employeeHireDate,
                            )}
                            onChange={(selectedDate) =>
                              setHireDate(selectedDate?.toDateString())
                            }
                            dateFormat="MM/dd/yyyy"
                            placeholderText="MM/DD/YYYY"
                            className="form-control"
                            highlightDates={[
                              {
                                "react-datepicker__day--highlighted-custom": [
                                  hireDate || viewlog?.employeeHireDate
                                    ? formatDateToMMDDYYYY(
                                        hireDate || viewlog?.employeeHireDate,
                                      )
                                    : new Date(),
                                ],
                              },
                            ]}
                          />
                        </Form.Group>
                      </Col>
                      <Col sm="12" md="12">
                        <Form.Group className="mb-3 d-flex flex-column">
                          <Form.Label className="fw-bold">
                            Review Period:
                          </Form.Label>

                          <DatePicker
                            selected={formatDateToMMDDYYYY(
                              reviewPeriod || viewlog?.reviewPeriod,
                            )}
                            onChange={(selectedDate) =>
                              setReviewPeriod(selectedDate?.toDateString())
                            }
                            dateFormat="MM/dd/yyyy"
                            placeholderText="MM/DD/YYYY"
                            className="form-control"
                            highlightDates={[
                              {
                                "react-datepicker__day--highlighted-custom": [
                                  reviewPeriod || viewlog?.reviewPeriod
                                    ? formatDateToMMDDYYYY(
                                        reviewPeriod || viewlog?.reviewPeriod,
                                      )
                                    : new Date(),
                                ],
                              },
                            ]}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col>
                        <Form.Label className="fw-bold w-100">
                          Rating Criteria
                        </Form.Label>
                        <ul className="list-unstyled text-sm">
                          <li>
                            <b>Outstanding:</b> Performance in this area is far
                            exceeded expectations and requirements
                          </li>
                          <li>
                            <b>Exceed Expectations:</b> Accomplished more than
                            expected
                          </li>
                          <li>
                            <b>Meets Expectations:</b> Fully competent,
                            consistently meets requirements and expectations
                          </li>
                          <li>
                            <b>Needs Improvement:</b> Requires significant
                            amount of guidance and supervision
                          </li>
                          <li>
                            <b>Expectation not met:</b> Improve in all areas is
                            needed
                          </li>
                        </ul>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col>
                        <Form.Label className="fw-bold w-100">
                          Ratings:
                        </Form.Label>
                        <Form.Label className="fw-bold w-100">
                          Factors{" "}
                        </Form.Label>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold w-100">
                            Performance and Quality of work ( work is completed
                            without guidance of supervision, work is completed
                            accurately and met within deadline)
                          </Form.Label>
                          <Form.Control
                            onChange={(e) => setRating1(e.target.value)}
                            value={
                              rating1 ||
                              viewlog?.ratingsPerformanceAndQualityOfWork
                            }
                            type="text"
                            placeholder="Enter Rating like: (0/10)"
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold w-100">
                            Communication (positive interaction with staff,
                            management, and other employees. Communicate
                            essential information relating to patient care and
                            employment. Written and oral communications are
                            clear and effective.)
                          </Form.Label>
                          <Form.Control
                            onChange={(e) => setRating2(e.target.value)}
                            value={rating2 || viewlog?.ratingsCommunication}
                            type="text"
                            placeholder="Enter Rating like: (0/10)"
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold w-100">
                            Professionalism (employee maintains professionalism
                            when dealing with staff, residents, and others)
                          </Form.Label>
                          <Form.Control
                            onChange={(e) => setRating3(e.target.value)}
                            value={rating3 || viewlog?.ratingsProfessionalism}
                            type="text"
                            placeholder="Enter Rating like: (0/10)"
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold w-100">
                            Attendance and Punctuality (employee is punctual to
                            work. Employee notifies supervisor ahead of time in
                            the case of absence. Employee always shows up to
                            work)
                          </Form.Label>
                          <Form.Control
                            onChange={(e) => setRating4(e.target.value)}
                            value={
                              rating4 ||
                              viewlog?.ratingsAttendanceAndPunctuality
                            }
                            type="text"
                            placeholder="Enter Rating like: (0/10)"
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold w-100">
                            Time management (time management in completing task
                            and meeting deadline)
                          </Form.Label>
                          <Form.Control
                            onChange={(e) => setRating5(e.target.value)}
                            value={rating5 || viewlog?.ratingsTimeManagement}
                            type="text"
                            placeholder="Enter Rating like: (0/10)"
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold w-100">
                            Reliaility/Depedendability (manage workload
                            effectively. Willing to assist others. Goes over and
                            beyond to ensure task is completed)
                          </Form.Label>
                          <Form.Control
                            onChange={(e) => setRating6(e.target.value)}
                            value={
                              rating6 ||
                              viewlog?.ratingsReliabilityDependability
                            }
                            type="text"
                            placeholder="Enter Rating like: (0/10)"
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold w-100">
                            Overall Rating – Rate employee’s overall performance
                            in comparison to position duties and
                            responsibilities.
                          </Form.Label>
                          <Form.Control
                            onChange={(e) => setOverallRating(e.target.value)}
                            value={overallRating || viewlog?.overallRating}
                            type="text"
                            placeholder="Enter Rating like: (0/10)"
                          />
                        </Form.Group>
                        <Row>
                          <Col sm="12" md="6">
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold w-100">
                                Evaluation:
                              </Form.Label>
                              <Form.Control
                                onChange={(e) => setEvolution(e.target.value)}
                                type="text"
                                rows="3"
                                value={evolution || viewlog?.evaluation}
                              />
                            </Form.Group>
                          </Col>
                          <Col sm="12" md="6">
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold w-100">
                                Additional Comments:
                              </Form.Label>
                              <Form.Control
                                onChange={(e) =>
                                  setAdditionalCommet(e.target.value)
                                }
                                type="text"
                                rows="3"
                                value={
                                  additionalCommet ||
                                  viewlog?.additionalComments
                                }
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Form.Label className="fw-bold w-100">
                      <span> Verification of Review:</span> By signing this
                      form, you confirm that you have discussed this review in
                      detail with your supervisor. Signing this form does not
                      necessarily indicate that you agree with this evaluation.
                    </Form.Label>
                    <Row className="mb-3">
                      <Col xs={12} lg={4}>
                        <Button
                          className="theme-button"
                          onClick={() => setOpenShow(true)}
                        >
                          SAVED AND SIGNED
                        </Button>
                      </Col>
                      <Col xs={12} lg={8}>
                        <Form.Label className="fw-bold w-100 text-end">
                          {signatureFormat({
                            sign: administratorSignature,
                            date: administratorDate,
                            time: administratorTime,
                            hoursFormat,
                          })}
                        </Form.Label>
                      </Col>
                    </Row>
                  </div>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                  <Button
                    className="theme-button"
                    type="submit"
                    onClick={handleAddNew}
                  >
                    SAVE
                  </Button>

                  <Button
                    className="theme-button-outline"
                    onClick={() => setModalShow(false)}
                    type="reset"
                  >
                    Cancel
                  </Button>
                  <input id="fileUpload" type="file" className="hidden" />
                </Modal.Footer>
              </Form>
            </>
          ) : addContactBtn === "add" ? (
            <>
              <Modal.Header closeButton>
                <h5 className="fw-bold mb-0">Add Employee Performance</h5>
              </Modal.Header>
              <Form onSubmit={handleAddNew}>
                <Modal.Body>
                  <div id="form-appendix">
                    <Row>
                      <Col sm="12" md="6">
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">Employee</Form.Label>
                          <Form.Select
                            required
                            onChange={employeeDataChangeHandler}
                            aria-label="Default select example"
                          >
                            <option value={""}>Select Employee</option>
                            {allEmployees?.map((item) => {
                              return (
                                <option value={item._id} key={item._id}>
                                  {`${item.firstName} ${item.lastName}`}
                                </option>
                              );
                            })}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm="12" md="6">
                        <Form.Group className="mb-3 d-flex flex-column">
                          <Form.Label className="fw-bold">Date:</Form.Label>

                          <DatePicker
                            selected={formatDateToMMDDYYYY(
                              date || viewlog?.employeeDate,
                            )}
                            onChange={(selectedDate) =>
                              setDate(selectedDate?.toDateString())
                            }
                            dateFormat="MM/dd/yyyy"
                            placeholderText="MM/DD/YYYY"
                            className="form-control"
                            highlightDates={[
                              {
                                "react-datepicker__day--highlighted-custom": [
                                  date || viewlog?.employeeDate
                                    ? formatDateToMMDDYYYY(
                                        date || viewlog?.employeeDate,
                                      )
                                    : new Date(),
                                ],
                              },
                            ]}
                          />
                        </Form.Group>
                      </Col>
                      <Col sm="12" md="6">
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            Job Title:
                          </Form.Label>
                          <Form.Control
                            type="text"
                            onChange={(e) => setJobTitle(e.target.value)}
                            value={jobTitle || viewlog?.employeeJobTitle}
                          />
                        </Form.Group>
                      </Col>
                      <Col sm="12" md="6">
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">Manager:</Form.Label>
                          <Form.Control
                            onChange={(e) => setMangager(e.target.value)}
                            type="text"
                            value={mangager || viewlog?.employeeManager}
                          />
                        </Form.Group>
                      </Col>
                      <Col sm="12" md="6">
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">
                            Type of Review
                          </Form.Label>
                          <Form.Select
                            required
                            onChange={(e) => setTypeofReview(e.target.value)}
                            value={typeofReview}
                            aria-label="Default select example"
                          >
                            <option value={"sixMonth"}>6 months</option>
                            <option value={"Annual"}>Annual</option>
                            <option value={"Other"}>Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm="12" md="6">
                        <Form.Group className="mb-3 d-flex flex-column">
                          <Form.Label className="fw-bold">
                            Hire Date:
                          </Form.Label>

                          <DatePicker
                            selected={formatDateToMMDDYYYY(
                              hireDate || viewlog?.employeeHireDate,
                            )}
                            onChange={(selectedDate) =>
                              setHireDate(selectedDate?.toDateString())
                            }
                            dateFormat="MM/dd/yyyy"
                            placeholderText="MM/DD/YYYY"
                            className="form-control"
                            highlightDates={[
                              {
                                "react-datepicker__day--highlighted-custom": [
                                  hireDate || viewlog?.employeeHireDate
                                    ? formatDateToMMDDYYYY(
                                        viewlog?.employeeHireDate,
                                      )
                                    : new Date(),
                                ],
                              },
                            ]}
                          />
                        </Form.Group>
                      </Col>
                      <Col sm="12" md="12">
                        <Form.Group className="mb-3 d-flex flex-column">
                          <Form.Label className="fw-bold">
                            Review Period:
                          </Form.Label>

                          <DatePicker
                            selected={formatDateToMMDDYYYY(
                              reviewPeriod || viewlog?.reviewPeriod,
                            )}
                            onChange={(selectedDate) =>
                              setReviewPeriod(selectedDate?.toDateString())
                            }
                            dateFormat="MM/dd/yyyy"
                            placeholderText="MM/DD/YYYY"
                            className="form-control"
                            highlightDates={[
                              {
                                "react-datepicker__day--highlighted-custom": [
                                  reviewPeriod || viewlog?.reviewPeriod
                                    ? formatDateToMMDDYYYY(
                                        reviewPeriod || viewlog?.reviewPeriod,
                                      )
                                    : new Date(),
                                ],
                              },
                            ]}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Label className="fw-bold w-100">
                          Rating Criteria
                        </Form.Label>
                        <ul className="list-unstyled text-sm">
                          <li>
                            <b>Outstanding :</b> Performance in this area is far
                            exceeded expectations and requirements
                          </li>
                          <li>
                            <b>Exceed Expectations :</b> Accomplished more than
                            expected
                          </li>
                          <li>
                            <b>Meets Expectations :</b> Fully competent,
                            consistently meets requirements and expectations
                          </li>
                          <li>
                            <b>Needs Improvement :</b> Requires significant
                            amount of guidance and supervision
                          </li>
                          <li>
                            <b>Expectation not met :</b> Improve in all areas is
                            needed
                          </li>
                        </ul>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Label className="fw-bold w-100">
                          Factors
                        </Form.Label>
                        <Form.Group className="mb-3" controlId="rating1">
                          <Form.Label className="fw-bold w-100">
                            Performance and Quality of work ( work is completed
                            without guidance of supervision, work is completed
                            accurately and met within deadline)
                          </Form.Label>
                          <Form.Control
                            onChange={(e) =>
                              handleRatingChange(e, setRating1, setRating1Error)
                            }
                            value={
                              rating1 ||
                              viewlog?.ratingsPerformanceAndQualityOfWork
                            }
                            type="text"
                            placeholder="Enter Rating like: (1/10)"
                            isInvalid={!!rating1Error}
                          />
                          <Form.Control.Feedback type="invalid">
                            {rating1Error}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold w-100">
                            Communication (positive interaction with staff,
                            management, and other employees. Communicate
                            essential information relating to patient care and
                            employment. Written and oral communications are
                            clear and effective.)
                          </Form.Label>
                          <Form.Control
                            onChange={(e) =>
                              handleRatingChange(e, setRating2, setRating2Error)
                            }
                            value={rating2 || viewlog?.ratingsCommunication}
                            type="text"
                            placeholder="Enter Rating like: (1/10)"
                            isInvalid={!!rating2Error}
                          />
                          <Form.Control.Feedback type="invalid">
                            {rating2Error}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold w-100">
                            Professionalism (employee maintains professionalism
                            when dealing with staff, residents, and others)
                          </Form.Label>
                          <Form.Control
                            onChange={(e) =>
                              handleRatingChange(e, setRating3, setRating3Error)
                            }
                            value={rating3 || viewlog?.ratingsProfessionalism}
                            type="text"
                            placeholder="Enter Rating like: (1/10)"
                            isInvalid={!!rating3Error}
                          />
                          <Form.Control.Feedback type="invalid">
                            {rating3Error}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold w-100">
                            Attendance and Punctuality (employee is punctual to
                            work. Employee notifies supervisor ahead of time in
                            the case of absence. Employee always shows up to
                            work)
                          </Form.Label>
                          <Form.Control
                            onChange={(e) =>
                              handleRatingChange(e, setRating4, setRating4Error)
                            }
                            value={
                              rating4 ||
                              viewlog?.ratingsAttendanceAndPunctuality
                            }
                            type="text"
                            placeholder="Enter Rating like: (1/10)"
                            isInvalid={!!rating4Error}
                          />
                          <Form.Control.Feedback type="invalid">
                            {rating4Error}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold w-100">
                            Time management (time management in completing task
                            and meeting deadline)
                          </Form.Label>
                          <Form.Control
                            onChange={(e) =>
                              handleRatingChange(e, setRating5, setRating5Error)
                            }
                            value={rating5 || viewlog?.ratingsTimeManagement}
                            type="text"
                            placeholder="Enter Rating like: (1/10)"
                            isInvalid={!!rating5Error}
                          />
                          <Form.Control.Feedback type="invalid">
                            {rating5Error}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold w-100">
                            Reliaility/Depedendability (manage workload
                            effectively. Willing to assist others. Goes over and
                            beyond to ensure task is completed)
                          </Form.Label>
                          <Form.Control
                            onChange={(e) =>
                              handleRatingChange(e, setRating6, setRating6Error)
                            }
                            value={
                              rating6 ||
                              viewlog?.ratingsReliabilityDependability
                            }
                            type="text"
                            placeholder="Enter Rating like: (1/10)"
                            isInvalid={!!rating6Error}
                          />
                          <Form.Control.Feedback type="invalid">
                            {rating6Error}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold w-100">
                            Overall Rating – Rate employee’s overall performance
                            in comparison to position duties and
                            responsibilities.
                          </Form.Label>
                          <Form.Control
                            onChange={(e) =>
                              handleRatingChange(
                                e,
                                setOverallRating,
                                setOverAllRatingError,
                              )
                            }
                            value={overallRating || viewlog?.overallRating}
                            type="text"
                            placeholder="Enter Rating like: (1/10)"
                            isInvalid={!!overAllRatingError}
                          />
                          <Form.Control.Feedback type="invalid">
                            {overAllRatingError}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Row>
                          <Col sm="12" md="6">
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold w-100">
                                Evaluation:
                              </Form.Label>
                              <Form.Control
                                onChange={(e) => setEvolution(e.target.value)}
                                type="text"
                                rows="3"
                                value={evolution || viewlog?.evaluation}
                              />
                            </Form.Group>
                          </Col>
                          <Col sm="12" md="6">
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-bold w-100">
                                Additional Comments:
                              </Form.Label>
                              <Form.Control
                                onChange={(e) =>
                                  setAdditionalCommet(e.target.value)
                                }
                                type="text"
                                rows="3"
                                value={
                                  additionalCommet ||
                                  viewlog?.additionalComments
                                }
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Label className="fw-bold w-100">
                          <span> Verification of Review:</span> By signing this
                          form, you confirm that you have discussed this review
                          in detail with your supervisor. Signing this form does
                          not necessarily indicate that you agree with this
                          evaluation.
                        </Form.Label>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col xs={12} lg={4}>
                        <Button
                          className="theme-button"
                          onClick={() => setOpenShow(true)}
                        >
                          SAVED AND SIGNED
                        </Button>
                      </Col>
                      <Col xs={12} lg={8}>
                        <Form.Label className="text-end w-100 mb-0">
                          {signatureFormat({
                            sign: administratorSignature,
                            date: administratorDate,
                            time: administratorTime,
                            hoursFormat,
                          })}
                        </Form.Label>
                      </Col>
                    </Row>
                  </div>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                  <Button
                    className="theme-button"
                    type="submit"
                    onClick={handleAddNew}
                  >
                    {isLoading ? "Adding..." : "SAVE"}
                  </Button>
                  <input id="fileUpload" type="file" className="hidden" />
                  <Button
                    className="theme-button-outline"
                    onClick={() => setModalShow(false)}
                    type="reset"
                  >
                    Cancel
                  </Button>
                  <input id="fileUpload" type="file" className="hidden" />
                </Modal.Footer>
              </Form>
            </>
          ) : null}
        </Modal>
      </>
    );
  }
  return (
    <>
      {modalShow && (
        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => {
            setModalShow(false);
            setViewLog({});
          }}
        />
      )}

      <NavWrapper title="Employee Performance" isArrow={true} />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={employeePerformanceData}
        onDelete={({ additionalFunctions }) =>
          adminDashboardService.employeePerformance.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container>
        <Row className="mt-3">
          <Col xs={12} md={8} lg={4}>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Control
                type="search"
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4} lg={8} className="text-end">
            <Button
              onClick={() => {
                setAddContactBtn("add");
                setModalShow(true);
              }}
              variant="primary"
              className="theme-button me-2"
            >
              + ADD NEW
            </Button>
            <Button
              onClick={() => {
                setAddContactBtn("default");
                setModalShow(true);
              }}
              variant="primary"
              className="theme-button"
            >
              DEFAULT
            </Button>
          </Col>
        </Row>

        {response?.docs?.length === 0 ? (
          <NoFound />
        ) : (
          <Table bordered responsive="lg" className="mt-3">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Job Title</th>
                <th>Manager</th>
                <th>Type of Review</th>
                <th>Hire Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {response &&
                response?.docs?.length > 0 &&
                response?.docs?.map((request) => {
                  return (
                    <tr key={request._id}>
                      <td>{fetchPaitentName(request.employeeId)}</td>
                      <td>{formatDateToMMDDYYYY(request.employeeDate)}</td>
                      <td>{request.employeeJobTitle}</td>
                      <td>{request.employeeManager}</td>
                      <td>{request.typeOfReview}</td>
                      <td>{formatDateToMMDDYYYY(request.employeeHireDate)}</td>

                      <td>
                        <div className="icon-joiner">
                          {(profilePermission?.userType === ROLES.ADMIN ||
                            profilePermission?.accountType ===
                              ACCOUNT_TYPES.ADMINISTRATOR ||
                            profilePermission?.userPermissions?.view
                              ?.split(":")
                              ?.includes("perf")) && (
                            <Link
                              className="view-btn"
                              onClick={() => {
                                setViewLog(request);
                                setAddContactBtn("view");
                                setModalShow(true);
                              }}
                            >
                              <FaEye />
                            </Link>
                          )}
                          {(profilePermission?.userType === ROLES.ADMIN ||
                            profilePermission?.accountType ===
                              ACCOUNT_TYPES.ADMINISTRATOR ||
                            profilePermission?.userPermissions?.edit
                              ?.split(":")
                              ?.includes("perf")) && (
                            <Link
                              className="edit-btn"
                              onClick={() => {
                                dispatch(clearPrimarySignatureDraft());
                                setViewLog(request);
                                setUserId(request._id);
                                setAddContactBtn("edit");
                                setModalShow(true);
                              }}
                            >
                              <FaRegEdit />
                            </Link>
                          )}
                          {(profilePermission?.userType === ROLES.ADMIN ||
                            profilePermission?.accountType ===
                              ACCOUNT_TYPES.ADMINISTRATOR ||
                            profilePermission?.userPermissions?.delete
                              ?.split(":")
                              ?.includes("perf")) && (
                            <Link
                              className="del-btn"
                              onClick={() => handleDelete(request._id)}
                            >
                              <RiDeleteBin5Fill />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        )}
        {response?.docs?.length > 0 && (
          <PaginationsPage
            page={page}
            setPage={setPage}
            totalPages={response?.totalPages ?? 1}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: EmployeePerformance,
});
