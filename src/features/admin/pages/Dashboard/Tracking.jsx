/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { resolveAdminAssetPath } from "@/assets";
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  ModalBody,
  Table,
} from "react-bootstrap";
import "@/assets/styles/admin/Contacts.css";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Select from "react-select";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import Modal from "react-bootstrap/Modal";
import { showNotification } from "@/utils";
import {
  getObjectUrlFromDownloadUrl,
  adminDashboardService,
  adminAdmitLogsService,
  adminTrackingService,
} from "@/features/shared/services";
import HOC from "@/features/shared/layout/Outer/HOC";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import Loader from "@/features/shared/ui/Loader/Loader";
import DatePicker from "react-datepicker";
import { fetchPaitentName, formatDateToMMDDYYYY } from "@/utils/utils";
import { usePrint } from "@shared/hooks";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import { DEFAULT_PAGE_SIZE, ROLES } from "@/features/shared/constants";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

const Tracking = () => {
  const [show, setShow] = useState(false);
  const [addContactBtn, setAddContactBtn] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [currentPage2, setCurrentPage2] = useState(1);
  const [postPerPage2] = useState(5);
  const lastPostIndex2 = currentPage2 * postPerPage2;
  const firstPostIndex2 = lastPostIndex2 - postPerPage2;
  const [filteredDataFn, setFilteredDataFn] = useState(null);
  const [newFilterFn, setNewFilterFn] = useState(null);
  const [viewTracking, setViewTracking] = useState({});
  const printRef = React.useRef(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const profileInfo = useSelector(userProfile);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  useEffect(() => {
    if (query) {
      setCurrentPage2(1);
    }
  }, [query]);
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
      margin:12mm 9mm !important;
    }    
    .card {
      page-break-inside: avoid;
    }
    .view-details-grid {
      page-break-inside: avoid;
    }
  `,
  });
  const print = usePrint(printRef, handlePrint);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const options = [
    {
      value: "business",
      label: "Business",
    },
    {
      value: "employee",
      label: "Employee",
    },
    {
      value: "patient",
      label: "Patient",
    },
    {
      value: "psychiatric",
      label: "Psychiatric Provider",
    },
    {
      value: "claims",
      label: "Claims Submission",
    },
  ];
  const [modalShow, setModalShow] = useState(false);
  const { data, isLoading: loading } = useQuery({
    queryKey: queryKeys.adminTracking.list({
      page,
      limit,
      search: debouncedQuery,
    }),
    queryFn: () =>
      adminTrackingService.getAdminTracking({
        page,
        limit,
        search: debouncedQuery,
      }),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();
  const getAdminTracking = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.adminTracking.all() });
  }, [queryClient]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (data?.data?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [data?.data?.docs?.length, page]);
  function MyVerticallyCenteredModal(props) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(
      resolveAdminAssetPath("/Dashboard/contacts/user.png"),
    );
    const [name, setName] = useState("");
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");
    const [completePercent, setCompletePercent] = useState(0);
    const [date, setDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [lastupdated, setLastUpdated] = useState("");
    const [number, setNumber] = useState("");
    const [location, setLocation] = useState("");
    const [file, setFile] = useState("");
    const filterAdminTracking = [];
    const [employeesInvolved, setEmployeesInvolved] = useState([]);
    const getAllUserData = () => {
      adminAdmitLogsService
        .getUsers({
          isActive: true,
          userType: ROLES.EMPLOYEE,
        })
        .then((response) => {
          if (response.success) {
            setUsers(response.data);
          }
        });
    };
    useEffect(() => {
      getAllUserData();
    }, []);
    const employeeOptions = users?.map((i) => ({
      label: fetchPaitentName(i),
      value: i._id,
    }));
    const submitHandler = (e) => {
      e.preventDefault();
      const payload = new FormData();
      if (name) payload.append("name", name);
      if (completePercent) payload.append("completePer", +completePercent);
      if (date) payload.append("date", date);
      if (dueDate) payload.append("dueDate", dueDate);
      if (lastupdated) payload.append("lastupdated", lastupdated);
      if (number) payload.append("number", number);
      if (location) payload.append("location", location);
      if (file) payload.append("file", file);
      employeesInvolved.forEach(({ value }) =>
        payload.append("employeesInvolved", value),
      );
      adminTrackingService
        .addAdminTracking(payload)
        .then((res) => {
          getAdminTracking();
          showNotification({ message: res.data.message, type: "success" });
          props.onHide();
          setEmployeesInvolved([]);
        })
        .catch((error) => {
          showNotification({
            message: error.response.data.message,
            type: "danger",
          });
        });
    };
    const updateHandler = (id) => {
      const payload = new FormData();
      if (name) payload.append("name", name);
      if (completePercent) payload.append("completePer", +completePercent);
      if (date) payload.append("date", date);
      if (dueDate) payload.append("dueDate", dueDate);
      if (lastupdated) payload.append("lastupdated", lastupdated);
      if (number) payload.append("number", number);
      if (location) payload.append("location", location);
      if (file) payload.append("file", file);
      employeesInvolved.forEach(({ value }) =>
        payload.append("employeesInvolved", value),
      );
      adminTrackingService
        .updateAdminTracking(updateId, payload)
        .then((res) => {
          getAdminTracking();
          showNotification({ message: res.data.message, type: "success" });
          props.onHide();
          setEmployeesInvolved([]);
        })
        .catch((error) => {
          showNotification({
            message: error.response.data.message,
            type: "danger",
          });
        });
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
    const fileChangedHandler = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        setSelectedFile(e.target.files[0]);
      }
    };
    const weekDays = ["0%", "25%", "50%", "75%", "100%"];
    const [startDate, setStartDate] = useState(newFilterFn?.[0] || "");
    const [endDate, setEndDate] = useState(newFilterFn?.[1] || "");
    const [documentTypes, setDocumentTypes] = useState({
      PDF: false,
      DOCX: false,
      RTF: false,
      JPG: false,
      PNG: false,
    });
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(6);
    const [minCaption, setMinCaption] = useState(weekDays[0]);
    const [maxCaption, setMaxCaption] = useState(weekDays[6]);
    const handleDateChange = (e, type) => {
      const value = e;
      if (type === "start") {
        setStartDate(value);
      } else if (type === "end") {
        setEndDate(value);
      }
    };
    const handleApplyFilter = () => {
      setFilteredDataFn({
        startDate,
        endDate,
        maxValue,
        minCaption,
        maxCaption,
      });
      props.onHide();
    };
    const handleFilter = () => {
      const datedata = [];
      datedata.push(startDate, endDate);
      setNewFilterFn(datedata);
      props.onHide();
    };
    useEffect(() => {
      if (data?.data?.docs) {
        const filteredData = data?.data?.docs?.filter(
          (i) => i._id === updateId,
        );
        setName(filteredData[0]?.name);
        setCompletePercent(filteredData[0]?.completePer);
        if (addContactBtn === "add") {
          setDueDate("");
          setEmployeesInvolved([]);
        } else {
          setDueDate(filteredData[0]?.dueDate);
          if (filteredData?.[0]?.employeesInvolved) {
            const uniqueDate = new Set([
              ...employeesInvolved,
              ...filteredData[0]?.employeesInvolved,
            ]);
            const uniqueDateArr = Array.from(uniqueDate)?.map((i) => ({
              label: fetchPaitentName(i),
              value: i?._id,
            }));
            setEmployeesInvolved(uniqueDateArr);
          }
        }
        setLocation(filteredData[0]?.location);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateId]);
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {addContactBtn === "filter" ? (
          <>
            <Modal.Header closeButton>
              <p className="mb-0 text-black font-semibold text-[1.5rem]">
                Filter
              </p>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="w-full font-bold">
                        From{" "}
                      </Form.Label>

                      <DatePicker
                        selected={formatDateToMMDDYYYY(startDate)}
                        onChange={(selectedDate) =>
                          handleDateChange(
                            selectedDate?.toDateString(),
                            "start",
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              startDate
                                ? formatDateToMMDDYYYY(startDate)
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="w-full font-bold">To </Form.Label>

                      <DatePicker
                        selected={formatDateToMMDDYYYY(endDate)}
                        onChange={(selectedDate) =>
                          handleDateChange(selectedDate?.toDateString(), "end")
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              endDate
                                ? formatDateToMMDDYYYY(endDate)
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
              <Button className="theme-button" onClick={handleFilter}>
                APPLY
              </Button>
              <Button className="theme-button-outline" onClick={props.onHide}>
                CANCEL
              </Button>
            </Modal.Footer>
          </>
        ) : addContactBtn === "add" ? (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Admin Tracking</h5>
            </Modal.Header>
            <Form onSubmit={submitHandler}>
              <ModalBody>
                <Row>
                  <Col xs={12} md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="w-full font-bold">
                        Document Name:
                      </Form.Label>
                      {/* <Form.Select
                        required
                        onChange={(e) => setName(e.target.value)}
                       >
                        <option value="">Select</option>
                        <option value="Annual Disaster Drill Plan">
                          Annual Disaster Drill Plan
                        </option>
                        <option value="Disaster Drill report">
                          Disaster Drill report
                        </option>
                        <option value="Evacuation Drill">
                          Evacuation Drill
                        </option>
                        <option value="Quality Management">
                          Quality Management
                        </option>
                        <option value="Infectious Control ">
                          Infectious Control{" "}
                        </option>
                        <option value="Dietitian Contract">
                          Dietitian Contract
                        </option>
                        <option value="Vehicle Renewal">Vehicle Renewal</option>
                        <option value="Vehicle Insurance renewal">
                          Vehicle Insurance renewal
                        </option>
                        <option value="Workers Compensation Renewal">
                          Workers Compensation Renewal
                        </option>
                        <option value="Liability and Comprehensive Insurance Renewal">
                          Liability and Comprehensive Insurance Renewal
                        </option>
                        <option value="License Plate Renewal">
                          License Plate Renewal
                        </option>
                        <option value="Pest Control Contract">
                          Pest Control Contract
                        </option>
                        <option value="Annual abuse and neglect training">
                          Annual abuse and neglect training
                        </option>
                        <option value="Incident/Complaint Tracking">
                          Incident/Complaint Tracking
                        </option>
                        <option value="Fire Extinguisher">
                          Fire Extinguisher
                        </option>
                       </Form.Select> */}
                      <Form.Control
                        required
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Enter Name"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="w-full font-bold">
                        Due Date:
                      </Form.Label>
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
                  <Col xs={12} md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="w-full font-bold">
                        Location:
                      </Form.Label>
                      <Form.Control
                        required
                        onChange={(e) => setLocation(e.target.value)}
                        type="text"
                        placeholder="Enter Location"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="w-full font-bold">
                        File Type
                      </Form.Label>
                      <Form.Control
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={12} lg={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Name of Employee/s Involved :{" "}
                      </Form.Label>
                      <Select
                        isMulti
                        options={employeeOptions}
                        isSearchable={false}
                        value={employeesInvolved}
                        onChange={(value) => setEmployeesInvolved(value)}
                        overrideStrings={{
                          selectSomeItems: "Select...",
                          allItemsAreSelected: employeesInvolved
                            .map((item) => item.label)
                            .join(", "),
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
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
        ) : addContactBtn === "update" ? (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Admin Tracking</h5>
            </Modal.Header>
            <ModalBody>
              <Form>
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="w-full font-bold">
                        Document Name:
                      </Form.Label>
                      {/* <Form.Select
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled
                       >
                        <option value="">Select</option>
                        <option value="Annual Disaster Drill Plan">
                          Annual Disaster Drill Plan
                        </option>
                        <option value="Disaster Drill report">
                          Disaster Drill report
                        </option>
                        <option value="Evacuation Drill">
                          Evacuation Drill
                        </option>
                        <option value="Quality Management">
                          Quality Management
                        </option>
                        <option value="Infectious Control ">
                          Infectious Control{" "}
                        </option>
                        <option value="Dietitian Contract">
                          Dietitian Contract
                        </option>
                        <option value="Vehicle Renewal">Vehicle Renewal</option>
                        <option value="Vehicle Insurance renewal">
                          Vehicle Insurance renewal
                        </option>
                        <option value="Workers Compensation Renewal">
                          Workers Compensation Renewal
                        </option>
                        <option value="Liability and Comprehensive Insurance Renewal">
                          Liability and Comprehensive Insurance Renewal
                        </option>
                        <option value="License Plate Renewal">
                          License Plate Renewal
                        </option>
                        <option value="Pest Control Contract">
                          Pest Control Contract
                        </option>
                        <option value="Annual abuse and neglect training">
                          Annual abuse and neglect training
                        </option>
                        <option value="Incident/Complaint Tracking">
                          Incident/Complaint Tracking
                        </option>
                        <option value="Fire Extinguisher">
                          Fire Extinguisher
                        </option>
                       </Form.Select> */}
                      <Form.Control
                        required
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        value={name}
                        placeholder="Enter Name"
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="w-full font-bold">
                        Due Date:
                      </Form.Label>

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
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="w-full font-bold">
                        Location
                      </Form.Label>
                      <Form.Control
                        type="text"
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter location"
                        value={location}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="w-full font-bold">
                        File Type
                      </Form.Label>
                      <Form.Control
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={12} lg={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Name of Employee/s Involved :{" "}
                      </Form.Label>
                      <Select
                        isMulti
                        options={employeeOptions}
                        isSearchable={false}
                        value={employeesInvolved}
                        onChange={(value) => setEmployeesInvolved(value)}
                        overrideStrings={{
                          selectSomeItems: "Select...",
                          allItemsAreSelected: employeesInvolved
                            .map((item) => item.label)
                            .join(", "),
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
            <Modal.Footer className="justify-content-center">
              <Button className="theme-button" onClick={updateHandler}>
                APPLY
              </Button>
              <Button className="theme-button-outline" onClick={props.onHide}>
                CANCEL
              </Button>
            </Modal.Footer>
          </>
        ) : addContactBtn === "view" ? (
          <div ref={printRef} tabIndex={0} className="outline-none">
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">View Admin Tracking</h5>
            </Modal.Header>
            <ModalBody>
              <div ref={componentRef}>
                <h1 className="pdfTitle hidden mt-2.5"> Admin Tracking</h1>
                <Form>
                  <div className="view-details">
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={6}>
                        <div className="view-details-grid my-1 my-md-2 p-3">
                          <p className="view-label mb-1">Name : </p>
                          <h5 className="view-value mb-0">
                            {viewTracking?.name}
                          </h5>
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={6}>
                        <div className="view-details-grid my-1 my-md-2 p-3">
                          <p className="view-label mb-1">Due Date : </p>
                          <h5 className="view-value mb-0">
                            {formatDateToMMDDYYYY(viewTracking?.dueDate)}
                          </h5>
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={6}>
                        <div className="view-details-grid my-1 my-md-2 p-3">
                          <p className="view-label mb-1">Created At : </p>
                          <h5 className="view-value mb-0">
                            {formatDateToMMDDYYYY(viewTracking?.createdAt)}
                          </h5>
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={6}>
                        <div className="view-details-grid my-1 my-md-2 p-3">
                          <p className="view-label mb-1">Updated At : </p>
                          <h5 className="view-value mb-0">
                            {formatDateToMMDDYYYY(viewTracking?.updatedAt)}
                          </h5>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </div>
            </ModalBody>
            <Modal.Footer className="justify-content-center">
              <Button className="theme-button" onClick={print}>
                PRINT
              </Button>
              <Button className="theme-button-outline" onClick={props.onHide}>
                CANCEL
              </Button>
            </Modal.Footer>
          </div>
        ) : null}
      </Modal>
    );
  }
  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };
  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={getAdminTracking}
        onDelete={({ additionalFunctions }) =>
          adminDashboardService.deleteAdminTracking(deleteId, {
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Offcanvas
        show={show}
        className="h-[80vh] rounded-t-[10px] p-6"
        placement="bottom"
        onHide={handleClose}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="text-black font-semibold">
            Contact Details
          </Offcanvas.Title>
        </Offcanvas.Header>
        <hr className="text-gray-500 w-[60%]" />
        <Offcanvas.Body>
          <div className="profile-dropdown-container">
            <img
              src={resolveAdminAssetPath("/Dashboard/user.png")}
              className="max-w-[125px] max-h-[125px] w-auto h-auto"
              alt="user"
            />
            <p>
              <p className="font-bold text-black">Jhon Smith</p>
              <p className="flex items-center gap-[5px] font-bold text-black">
                <img
                  className="max-w-[20px] max-h-[20px]"
                  src={resolveAdminAssetPath("/Dashboard/admin.png")}
                  alt=""
                />
                <span>ADMIN</span>
              </p>
              <p className="flex items-center gap-[15px] font-bold text-[#1A9FB2]">
                <img
                  className="max-w-[20px] max-h-[20px]"
                  src={resolveAdminAssetPath("/Dashboard/message.png")}
                  alt=""
                />
                <span>
                  EMAIL -{" "}
                  <span className="text-black font-normal">
                    loremipsum@gmail.com
                  </span>{" "}
                </span>
              </p>
              <p className="flex items-center gap-[15px] font-bold text-[#1A9FB2]">
                <img
                  className="max-w-[20px] max-h-[20px]"
                  src={resolveAdminAssetPath("/Dashboard/call.png")}
                  alt=""
                />
                <span>PHONE </span>
              </p>
              <p className="flex items-center gap-[15px] font-bold text-[#1A9FB2]">
                <img
                  className="max-w-[20px] max-h-[20px]"
                  src={resolveAdminAssetPath("/Dashboard/call.png")}
                  alt=""
                />
                <span>ADDRESS -</span>
              </p>
              <p className="flex items-center gap-[15px] font-bold text-[#1A9FB2]">
                <img
                  className="max-w-[20px] max-h-[20px]"
                  src={resolveAdminAssetPath("/Dashboard/user1.png")}
                  alt=""
                />
              </p>
              <div>
                <span>PERMISSIONS -</span>

                <p>
                  <Select
                    options={options}
                    isMulti
                    closeMenuOnSelect={false}
                    placeholder="All Accessible"
                  />
                </p>
              </div>
            </p>
            <div>
              <p>Description</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                vestibulum erat erat, eu dapibus quam lobortis vitae. Aenean ut
                tellus ex. Donec vel risus ut urna scelerisque maximus. Duis
                vestibulum, enim sit amet fermentum vulputate, justo neque
                rhoncus mi, sed tempor justo velit nec dui. Maecenas condimentum
                condimentum tincidunt. Aliquam gravida eleifend sollicitudin.
                Fusce a nulla non dolor finibus vestibulum eu eu quam. Etiam
                volutpat viverra pretium. Fusce pulvinar velit tortor, sed
                luctus quam dignissim vitae. Etiam consequat porttitor velit id
                luctus. Sed vulputate tortor eu bibendum luctus. Integer a
                lectus non magna vestibulum pharetra. Vivamus ultrices metus vel
                purus iaculis mollis. Morbi sem diam, lacinia vitae ex
                facilisis, eleifend viverra metus. Donec pretium est tortor, non
                posuere quam vulputate id.{" "}
              </p>
              <p className="flex items-center gap-[15px] font-bold text-[#1A9FB2]">
                LAST ADMITTED AT -
                <span className="flex items-center gap-[15px]">
                  <img
                    className="max-w-[25px] max-h-[25px]"
                    src={resolveAdminAssetPath("/Dashboard/home.png")}
                    alt=""
                  />
                  <p className="text-black m-0">Center 1</p>
                </span>
              </p>
              <p>
                {" "}
                <Button
                  variant="primary"
                  className="px-[5.5rem] py-2 bg-[#1A9FB2] border-none"
                >
                  ASSIGN PATIENT
                </Button>
              </p>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      <Container className="full-width-container dashboard-page">
        <Row>
          <Col>
            <div className="page-title-bar">
              <p className="heading">Admin Tracking</p>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={8} md={4}>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Control
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search"
              />
            </Form.Group>
          </Col>

          <Col xs={4} md={8} className="text-end">
            <Button
              onClick={() => {
                setAddContactBtn("add");
                setModalShow(true);
              }}
              variant="primary"
              className="theme-button"
            >
              + Upload File
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {loading ? (
              <Loader />
            ) : !data?.data?.docs?.length ? (
              <NoFound />
            ) : (
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Document Name</th>

                    <th>Location</th>
                    <th>Due Date</th>
                    <th>Action </th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? null
                    : data?.data?.docs?.length > 0
                      ? data?.data?.docs.map((data) => {
                          return (
                            <tr key={data._id}>
                              <td
                                className={`${data.name ? "" : "text-center"}`}
                              >
                                {data.name || <span>&mdash;</span>}
                              </td>

                              <td
                                className={`${data.location ? "" : "text-center"}`}
                              >
                                {data.location || <span>&mdash;</span>}
                              </td>
                              <td>
                                <p
                                  className={`mb-0 ${data.dueDate ? "" : "text-center"}`}
                                >
                                  <span>
                                    {formatDateToMMDDYYYY(data.dueDate) || (
                                      <span>&mdash;</span>
                                    )}
                                  </span>
                                </p>
                              </td>
                              <td>
                                <div className="icon-joiner">
                                  <Link
                                    className="view-btn"
                                    onClick={() => {
                                      setViewTracking(data);
                                      setAddContactBtn("view");
                                      setModalShow(true);
                                    }}
                                  >
                                    <FaEye />
                                  </Link>
                                  <a
                                    className="view-btn"
                                    href={getObjectUrlFromDownloadUrl(
                                      data?.file,
                                    )}
                                    download
                                  >
                                    <i className="fa-solid fa-download"></i>
                                  </a>
                                  {data?.addBy === "Admin" && (
                                    <>
                                      <Link
                                        className="edit-btn"
                                        onClick={() => {
                                          setAddContactBtn("update");
                                          setUpdateId(data._id);
                                          setModalShow(true);
                                        }}
                                      >
                                        <FaRegEdit />
                                      </Link>
                                      <Link
                                        className="del-btn"
                                        onClick={() => handleDelete(data._id)}
                                      >
                                        <RiDeleteBin5Fill />
                                      </Link>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      : null}
                </tbody>
              </Table>
            )}
            {data?.data?.docs.length > 0 && (
              <PaginationsPage
                page={page}
                setPage={setPage}
                totalPages={data?.data?.totalPages && data?.data?.totalPages}
                limit={limit}
                setLimit={setLimit}
              />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: Tracking,
});
