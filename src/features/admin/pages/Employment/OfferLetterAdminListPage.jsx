/* eslint-disable no-unused-vars, eqeqeq */
import React, { useCallback, useEffect, useState } from "react";
import { resolveAdminAssetPath } from "@/assets";
import {
  Button,
  Container,
  Form,
  ModalBody,
  Table,
  Row,
  Col,
} from "react-bootstrap";
import "@/assets/styles/admin/Contacts.css";
import { FaEdit, FaEye } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Select from "react-select";
import Offcanvas from "react-bootstrap/Offcanvas";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import {
  getAdminProfile,
  getAdminEmployees,
  addOfferLetter,
  adminDashboardService,
} from "@/features/shared/services/index";
import { showNotification } from "@/utils";
import { OfferLetter2 } from "./OfferLetterAdminPanel";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import NavWrapper from "@/utils/NavWrapper";
import DatePicker from "react-datepicker";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import { userProfile } from "@/store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { clearPrimarySignatureDraft } from "@/store/signatureDraftSlice";
import { getPrimarySignatureDraft } from "@/store/signatureDraftStore";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import { DEFAULT_PAGE_SIZE, ROLES } from "@/features/shared/constants/index";
import { logger } from "@/utils/index";
import { useOfferLetterList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const OfferLater = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [addContactBtn, setAddContactBtn] = React.useState(null);
  const Profile = useSelector(userProfile);
  const hoursFormat = Profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [adminProfile, setAdminProfile] = useState({});
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
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

  const { data: response, isLoading: loading } = useOfferLetterList(
    { page, limit, debouncedQuery },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const invalidateList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.offerLetter.all() });
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
  useEffect(() => {
    getAdminProfile().then((res) => {
      setAdminProfile(res?.data || {});
    });
  }, []);
  const handleClose = () => setShow(false);
  const deleteNote = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };
  const [signInModalShow, setSignInModalShow] = useState(false);
  const [viewItem, setViewItem] = useState({});
  function MyVerticallyCenteredModal(props) {
    const dispatch = useDispatch();
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(
      resolveAdminAssetPath("/Dashboard/contacts/user.png"),
    );
    const [employees, setEmployees] = useState([]);
    const [employeeDetails, setEmployeeDetails] = useState({
      employeeId: viewItem?.employeeId || "",
      employeeName: viewItem?.employeeName || "",
      companyName: viewItem?.companyName || "",
      positionOffered: viewItem?.positionOffered || "",
      startingPay: viewItem?.startingPay || "",
      startDate: viewItem?.startDate || "",
      offerDate: viewItem?.offerDate || "",
      administratorsName: viewItem?.administratorsName || "",
      administratorsSignature: viewItem?.administratorsSignature || "",
      administratorsSignatureDate: viewItem?.administratorsSignatureDate || "",
      administratorsSignatureTime: viewItem?.administratorsSignatureTime || "",
      employeeSignature: viewItem?.employeeSignature || "",
      employeeSignDate: viewItem?.employeeSignDate || "",
      signers: viewItem?.signers || [],
    });
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
    const checkSign = useCallback(async () => {
      let isAdminConditionValid = Profile.userType === ROLES.ADMIN;
      if (isAdminConditionValid) {
        setIsSubmitEnabled(true);
      } else {
        setIsSubmitEnabled(false);
      }
    }, []);
    useEffect(() => {
      if (addContactBtn == "v") {
        checkSign();
      }
    }, [checkSign]);
    const handleChange = (name, value) => {
      setEmployeeDetails((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
    const getAllEmployees = () => {
      getAdminEmployees()
        .then((res) => {
          setEmployees(res.data || []);
        })
        .catch((err) => {
          if (err.response?.status === 404) {
            setEmployees([]);
          }
        });
    };
    useEffect(() => {
      if (modalShow) {
        getAllEmployees();
      }
    }, []);
    const handleSelectChange = (e) => {
      const selectedEmployeeId = e.target.value;
      const selectedEmployee = employees.find(
        (item) => item._id === selectedEmployeeId,
      );
      if (selectedEmployee) {
        handleChange("employeeId", selectedEmployee._id);
        handleChange(
          "employeeName",
          `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
        );
      }
    };
    const signAdmin = (e) => {
      e.preventDefault();
      setEmployeeDetails((state) => ({
        ...state,
        administratorsName: adminProfile?.fullName,
        administratorsSignature: `${adminProfile?.fullName} Admin`,
        administratorsSignatureDate: new Date().toISOString(),
        administratorsSignatureTime: formatFormattedTime(),
      }));
    };
    const postDataHandler = async (e) => {
      e.preventDefault();
      try {
        if (
          employeeDetails?.administratorsName !== "" ||
          adminProfile?.fullName
        ) {
          if (employeeDetails?.administratorsName === "") {
            await addOfferLetter({
              ...employeeDetails,
              administratorsName: adminProfile?.fullName,
            });
          } else {
            await addOfferLetter({
              ...employeeDetails,
            });
          }
          invalidateList();
          showNotification({
            message: "Offer letter added successfully",
            type: "success",
          });
          props.onHide();
        } else {
          showNotification({
            message: "Administrators name not provided",
            type: "danger",
          });
        }
      } catch (err) {
        showNotification({
          message: err.response.data.message,
          type: "danger",
        });
      }
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
    function formatFormattedTime(date) {
      const now = date ? new Date(date) : new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // Format minutes and seconds with leading zeros if necessary
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
      return `${hours}:${formattedMinutes}:${formattedSeconds}`;
    }
    const updateOfferLater = async (e) => {
      e.preventDefault();
      try {
        const draft = getPrimarySignatureDraft();
        if (draft.staffLabel) {
          employeeDetails.administratorsName = draft.signedData;
          employeeDetails.administratorsSignature = draft.staffLabel;
          employeeDetails.administratorsSignatureDate = draft.signedDate;
          employeeDetails.administratorsSignatureTime = draft.signedTime;
          await addOfferLetter(employeeDetails);
          invalidateList();
          showNotification({
            message: "Offer letter added successfully",
            type: "success",
          });
          dispatch(clearPrimarySignatureDraft());
          props.onHide();
        }
        if (employeeDetails?.administratorsName) {
          await addOfferLetter(employeeDetails);
          invalidateList();
          showNotification({
            message: "Offer letter added successfully",
            type: "success",
          });
          dispatch(clearPrimarySignatureDraft());
          props.onHide();
        }
      } catch (err) {
        logger.error(err);
      }
    };
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {addContactBtn == "f" ? (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">View Offer Letter</h5>
            </Modal.Header>
            <Modal.Body>
              <OfferLetter2 item={viewItem} />
            </Modal.Body>
          </>
        ) : addContactBtn == "t" ? (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Offer Letter</h5>
            </Modal.Header>
            <Form onSubmit={postDataHandler}>
              <Modal.Body>
                <div>
                  <Row className="mb-3">
                    <Col xs={12} lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Select Employee
                        </Form.Label>
                        <Form.Select required onChange={handleSelectChange}>
                          <option value="">Select</option>
                          {employees.map((item, index) => (
                            <option key={index} value={item._id}>
                              {item.firstName + " " + item.lastName}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={12} lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Position Offered
                        </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          onChange={(e) =>
                            handleChange("positionOffered", e.target.value)
                          }
                          placeholder="Enter Position Offered"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} lg={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Starting Pay
                        </Form.Label>
                        <Form.Control
                          type="text"
                          required
                          onChange={(e) =>
                            handleChange("startingPay", e.target.value)
                          }
                          placeholder="Enter Starting Pay"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} lg={4}>
                      <Form.Group className="mb-3 d-flex flex-column">
                        <Form.Label className="fw-bold">Start Date</Form.Label>

                        <DatePicker
                          selected={formatDateToMMDDYYYY(
                            employeeDetails?.startDate,
                          )}
                          onChange={(selectedDate) =>
                            handleChange(
                              "startDate",
                              selectedDate?.toDateString(),
                            )
                          }
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          className="form-control"
                          highlightDates={[
                            {
                              "react-datepicker__day--highlighted-custom": [
                                employeeDetails?.startDate
                                  ? formatDateToMMDDYYYY(
                                      employeeDetails?.startDate,
                                    )
                                  : new Date(),
                              ],
                            },
                          ]}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} lg={4}>
                      <Form.Group className="mb-3 d-flex flex-column">
                        <Form.Label className="fw-bold">Offer Date</Form.Label>

                        <DatePicker
                          selected={formatDateToMMDDYYYY(
                            employeeDetails?.offerDate,
                          )}
                          onChange={(selectedDate) =>
                            handleChange(
                              "offerDate",
                              selectedDate?.toDateString(),
                            )
                          }
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          className="form-control"
                          highlightDates={[
                            {
                              "react-datepicker__day--highlighted-custom": [
                                employeeDetails?.offerDate
                                  ? formatDateToMMDDYYYY(
                                      employeeDetails?.offerDate,
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
                    <Col xs={12} lg={6}>
                      <Button className="theme-button" onClick={signAdmin}>
                        SAVED AND SIGNED
                      </Button>
                    </Col>
                    <Col xs={12} lg={6}>
                      <Form.Label className="text-end w-100 mb-0">
                        {signatureFormat({
                          sign: employeeDetails?.administratorsSignature,
                          time: employeeDetails?.administratorsSignatureTime,
                          date: employeeDetails?.administratorsSignatureDate,
                          hoursFormat,
                        })}
                        {signatureFormat({
                          sign: employeeDetails?.employeeSignature,
                          date: employeeDetails?.employeeSignDate,
                          hoursFormat,
                        })}
                      </Form.Label>
                    </Col>
                  </Row>
                </div>
              </Modal.Body>
              <Modal.Footer className="justify-content-center">
                <Button className="theme-button" type="submit">
                  SAVE
                </Button>
                <input id="fileUpload" type="file" className="hidden" />
                <Button className="theme-button-outline" onClick={props.onHide}>
                  Cancel
                </Button>
                <input id="fileUpload" type="file" className="hidden" />
              </Modal.Footer>
            </Form>
          </>
        ) : addContactBtn == "v" ? (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Edit Offer Letter</h5>
            </Modal.Header>
            <Form onSubmit={updateOfferLater}>
              <ModalBody>
                <Row>
                  <Col xs={12} lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Position Offered
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        onChange={(e) =>
                          handleChange("positionOffered", e.target.value)
                        }
                        placeholder="Enter Position Offered"
                        value={employeeDetails.positionOffered}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Starting Pay</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        onChange={(e) =>
                          handleChange("startingPay", e.target.value)
                        }
                        placeholder="Enter Starting Pay"
                        value={employeeDetails.startingPay}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="fw-bold">Start Date</Form.Label>

                      <DatePicker
                        selected={formatDateToMMDDYYYY(
                          employeeDetails?.startDate,
                        )}
                        onChange={(selectedDate) =>
                          handleChange(
                            "startDate",
                            selectedDate?.toDateString(),
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              employeeDetails?.startDate
                                ? formatDateToMMDDYYYY(
                                    employeeDetails?.startDate,
                                  )
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} lg={6}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="fw-bold">Offer Date</Form.Label>

                      <DatePicker
                        selected={formatDateToMMDDYYYY(
                          employeeDetails?.offerDate,
                        )}
                        onChange={(selectedDate) =>
                          handleChange(
                            "offerDate",
                            selectedDate?.toDateString(),
                          )
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              employeeDetails?.offerDate
                                ? formatDateToMMDDYYYY(
                                    employeeDetails?.offerDate,
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
                  <Col xs={12} lg={4}>
                    <Button className="theme-button" onClick={signAdmin}>
                      SAVED AND SIGNED
                    </Button>
                  </Col>
                  <Col xs={12} lg={8}>
                    <Form.Label className="w-100 text-end">
                      {signatureFormat({
                        sign: employeeDetails?.administratorsSignature,
                        time: employeeDetails?.administratorsSignatureTime,
                        date: employeeDetails?.administratorsSignatureDate,
                        hoursFormat,
                      })}
                      {signatureFormat({
                        sign: employeeDetails?.employeeSignature,
                        date: employeeDetails?.employeeSignDate,
                        hoursFormat,
                      })}
                    </Form.Label>
                    {employeeDetails?.signers?.map?.((signer) =>
                      signer?.signature?.length ? (
                        <Form.Label
                          className="w-100 text-end"
                          key={signer?.signerId}
                        >
                          {signatureFormat({
                            sign: signer?.signature,
                            time: signer?.signedTime,
                            date: signer?.dateSigned,
                            hoursFormat,
                          })}
                        </Form.Label>
                      ) : null,
                    )}
                  </Col>
                </Row>
              </ModalBody>
              <Modal.Footer className="justify-content-center">
                <Button
                  className="theme-button"
                  type="submit"
                  disabled={!isSubmitEnabled}
                >
                  SAVE
                </Button>
                <input id="fileUpload" type="file" className="hidden" />
                <Button className="theme-button-outline" onClick={props.onHide}>
                  Cancel
                </Button>
                <input id="fileUpload" type="file" className="hidden" />
              </Modal.Footer>
            </Form>
          </>
        ) : null}
      </Modal>
    );
  }
  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />{" "}
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={invalidateList}
        onDelete={({ additionalFunctions }) =>
          adminDashboardService.offerLetter.remove({
            id: deleteId,
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
              <p className="flex gap-[5px] items-center font-bold text-black">
                <img
                  className="max-w-5 max-h-5"
                  src={resolveAdminAssetPath("/Dashboard/admin.png")}
                  alt=""
                />
                <span>ADMIN</span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-5 max-h-5"
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
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-5 max-h-5"
                  src={resolveAdminAssetPath("/Dashboard/call.png")}
                  alt=""
                />
                <span>PHONE </span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-5 max-h-5"
                  src={resolveAdminAssetPath("/Dashboard/call.png")}
                  alt=""
                />
                <span>ADDRESS -</span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-5 max-h-5"
                  src={resolveAdminAssetPath("/Dashboard/user1.png")}
                  alt=""
                />
              </p>
              <p>
                <span>PERMISSIONS -</span>

                <p>
                  <Select
                    options={options}
                    isMulti
                    closeMenuOnSelect={false}
                    placeholder="All Accessible"
                  />
                </p>
              </p>
            </p>
            <p>
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
              <p className="text-[#1A9FB2] font-bold flex items-center gap-[15px]">
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
                  className="py-2 px-[5.5rem] bg-[#1A9FB2] border-none"
                >
                  ASSIGN PATIENT
                </Button>
              </p>
            </p>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      <NavWrapper title="Offer Letter" isArrow={true} />
      <Container>
        <Row className="mt-3">
          <Col xs={8} md={8} lg={4}>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Control
                type="search"
                placeholder="Search"
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
            </Form.Group>
          </Col>
          <Col xs={4} md={4} lg={8} className="text-end">
            <Button
              onClick={() => {
                dispatch(clearPrimarySignatureDraft());
                setSignInModalShow(false);
                setViewItem({});
                setAddContactBtn("t");
                setModalShow(true);
              }}
              variant="primary"
              className="theme-button"
            >
              + ADD NEW
            </Button>
          </Col>
        </Row>
        {response?.docs?.length === 0 ? (
          <NoFound />
        ) : (
          <Table bordered responsive className="mt-3">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Company Name</th>
                <th>Position Offered</th>
                <th>Starting pay</th>
                <th>Starting Date</th>
                <th>Offer Date</th>
                <th>Administrator Name</th>
                <th>Administrator Signature Date</th>

                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {response?.docs &&
                response?.docs?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.employeeName}</td>
                      <td>{item.companyName}</td>
                      <td>{item.positionOffered}</td>
                      <td>{item.startingPay}</td>
                      <td>{formatDateToMMDDYYYY(item.startDate)}</td>
                      <td>{formatDateToMMDDYYYY(item.offerDate)}</td>
                      <td>{item.administratorsName}</td>
                      <td>
                        {formatDateToMMDDYYYY(item.administratorsSignatureDate)}
                      </td>
                      <td>
                        <div className="iocn-joiner">
                          <Link
                            className="view-btn"
                            onClick={() => {
                              setViewItem(item);
                              setAddContactBtn("f");
                              setModalShow(true);
                            }}
                          >
                            <FaEye />{" "}
                          </Link>
                          <Link
                            className="edit-btn"
                            onClick={() => {
                              setViewItem(item);
                              setAddContactBtn("v");
                              setModalShow(true);
                            }}
                          >
                            <FaEdit />{" "}
                          </Link>

                          <Link
                            className="del-btn"
                            onClick={() => deleteNote(item._id)}
                          >
                            <RiDeleteBin5Fill />{" "}
                          </Link>
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
  Wcomponenet: OfferLater,
});
