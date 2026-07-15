/* eslint-disable no-unused-vars, eqeqeq */
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  ModalBody,
  Table,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "@/assets/styles/admin/Contacts.css";
import { FaEdit, FaEye } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Modal from "react-bootstrap/Modal";
import { showNotification } from "@/utils";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  AddSignatureForTable,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import NavWrapper from "@/utils/NavWrapper";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import {
  employeeService,
  getAdminProfile as getAdminProfileApi,
  createReferenceCheck,
  editReferenceCheck,
  employmentService,
} from "@/features/shared/services/index";
import DatePicker from "react-datepicker";
import {
  DashComponent,
  emptyChecker,
} from "@/features/shared/ui/HelpingComponents";
import { usePrint } from "@shared/hooks";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import { DEFAULT_PAGE_SIZE, ROLES } from "@/features/shared/constants/index";
import { useReferenceCheckList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const ReferenceCheck = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [addContactBtn, setAddContactBtn] = useState(null);
  const [viewItem, setViewItem] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [adminProfile, setAdminProfile] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [noteData, setNoteData] = useState({});
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

  const { data: response, isLoading: loading } = useReferenceCheckList(
    { page, limit, debouncedQuery },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const getReferenceCheck = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.referenceCheck.all() });
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
  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };
  function MyVerticallyCenteredModal(props) {
    const componentRef = React.useRef();
    const [employeeId1, setEmployeeId1] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [referenceName, setReferenceName] = useState("");
    const [date, setDate] = useState("");
    const [referenceRecommendation, setReferenceRecommendation] = useState("");
    const [savedSigned, setSavedSigned] = useState("");
    const [signTime, setSignTime] = useState("");
    const [signDate, setSignDate] = useState("");
    const [signers, setSigners] = useState([]);
    const [multipleTable, setMultipleTable] = useState([]);
    const [openAdmin, setOpenAdmin] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const printRef = React.useRef(null);
    const [employeeData, setEmployeeData] = useState([]);
    const handlePrint = useReactToPrint({
      content: () =>
        printDocumentContent(
          componentRef.current.cloneNode(true),
          profileInfo,
          profileInfo,
        ),
      documentTitle: printDocumentTitleExceptFirstPage(
        viewItem?.employeeId,
        profileInfo,
      ),
      pageStyle: `
      @page {
        margin: 12mm 9mm!important;
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
    const getEmployee = () => {
      employeeService.getEmployee({
        setResponse: setEmployeeData,
      });
    };
    useEffect(() => {
      if (modalShow) {
        getEmployee();
      }
    }, []);
    const submitHandler = async (e) => {
      e.preventDefault();
      if (isEdit) {
        const updatePayload = {
          data: multipleTable,
          signers,
        };
        try {
          const response = await editReferenceCheck(
            viewItem?._id,
            updatePayload,
          );
          showNotification({ message: response.data.message, type: "success" });
          getReferenceCheck();
          props.onHide();
        } catch (error) {
          showNotification({ message: error.message, type: "danger" });
        }
      } else {
        const payload = {
          data: multipleTable,
          employeeId: employeeId1,
          signers: signers?.map((signer) => ({
            signerId: signer.value,
            name: signer.label,
            signature: "",
            dateSigned: "",
            signedTime: "",
          })),
        };
        try {
          const response = await createReferenceCheck(payload);
          getReferenceCheck();
          showNotification({ message: response.data.message, type: "success" });
          getReferenceCheck();
          props.onHide();
        } catch (error) {
          showNotification({ message: error.message, type: "danger" });
        }
      }
    };
    const signAdmin = (e) => {
      e.preventDefault();
      setSavedSigned(`${adminProfile?.fullName} Admin`);
      setSignTime(formatFormattedTime());
      setSignDate(formatDateToMMDDYYYY(new Date()));
    };
    useEffect(() => {
      if (isEdit) {
        setEmployeeName(
          `${viewItem?.employeeId?.firstName} ${viewItem?.employeeId?.lastName}`,
        );
        setMultipleTable(viewItem?.data);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit]);
    const table = {
      referenceName,
      referenceRecommendation,
      date,
      savedSigned,
      signDate,
      signTime,
    };
    const addTable = async () => {
      if (!savedSigned) {
        setIsEmpty(true);
        return;
      }
      setMultipleTable((prev) => [...prev, table]);
      setReferenceName("");
      setReferenceRecommendation("");
      setDate("");
      setIsEmpty(false);
    };
    const removeOne = async (e, index) => {
      e.preventDefault();
      setMultipleTable((prev) => prev.filter((_, i) => i !== index));
    };
    return (
      <>
        <AddSignatureForTable
          show={openAdmin}
          setValue={setSavedSigned}
          setDate={setSignDate}
          setShow={setOpenAdmin}
        />
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          {addContactBtn == "f" ? (
            <>
              <Modal.Header closeButton>
                <h5 className="fw-bold mb-0">Reference Check Edit</h5>
              </Modal.Header>
              <Form onSubmit={submitHandler}>
                <ModalBody>
                  <Form>
                    <Form.Label
                      onClick={(e) => e.preventDefault()}
                    ></Form.Label>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        {" "}
                        Employee Name :{" "}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        disabled
                        value={`${viewItem?.employeeId?.firstName} ${viewItem?.employeeId?.lastName}`}
                      ></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Reference Name:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="referenceName"
                        value={referenceName}
                        onChange={(e) => setReferenceName(e.target.value)}
                        placeholder={`Medication Name ${"index" + 1}`}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="fw-bold">
                        Date of Contact:
                      </Form.Label>
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
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        Reference Recommendation:
                      </Form.Label>
                      <Form.Control
                        name="referenceRecommendation"
                        value={referenceRecommendation}
                        onChange={(e) =>
                          setReferenceRecommendation(e.target.value)
                        }
                        type="text"
                        placeholder="Other Instructions"
                      />
                    </Form.Group>
                    <Row>
                      <Col xs={12} lg={4} className="flex gap-1 items-center">
                        <Button className="theme-button" onClick={signAdmin}>
                          SAVED AND SIGNED
                        </Button>
                        <div className="text-red-600 text-[12px]">
                          *
                          {isEmpty && !savedSigned && (
                            <span>This field is required</span>
                          )}
                        </div>
                      </Col>
                      <Col xs={12} lg={8}>
                        <Form.Label className="text-end w-100 mb-0">
                          {signatureFormat({
                            sign: savedSigned,
                            date: signDate,
                            time: signTime,
                            hoursFormat,
                          })}
                        </Form.Label>
                      </Col>
                    </Row>
                    <Row className="mb-3 text-center">
                      <Col xs={12}>
                        <Button
                          className="theme-button"
                          onClick={() => addTable()}
                          type="button"
                        >
                          Add More
                        </Button>
                      </Col>
                    </Row>

                    {multipleTable?.length > 0 && (
                      <Row className="my-3">
                        <Col xs={12}>
                          <Table bordered responsive>
                            <thead>
                              <tr>
                                <th>Reference Name:</th>
                                <th>Date of Contact:</th>
                                <th>Reference Recommendation</th>
                                <th>Signature</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {multipleTable?.map((i, index) => (
                                <tr key={index}>
                                  <td
                                    className={`${i?.referenceName ? "" : "text-center"}`}
                                  >
                                    {" "}
                                    {i.referenceName || (
                                      <span>&mdash;</span>
                                    )}{" "}
                                  </td>
                                  <td
                                    className={`${i?.date ? "" : "text-center"}`}
                                  >
                                    {" "}
                                    {formatDateToMMDDYYYY(i.date) || (
                                      <span>&mdash;</span>
                                    )}{" "}
                                  </td>
                                  <td
                                    className={`${i?.referenceRecommendation ? "" : "text-center"}`}
                                  >
                                    {" "}
                                    {i.referenceRecommendation || (
                                      <span>&mdash;</span>
                                    )}{" "}
                                  </td>
                                  <td
                                    className={`${i?.savedSigned ? "" : "text-center"}`}
                                  >
                                    {" "}
                                    {i?.savedSigned ? (
                                      <span>
                                        {" "}
                                        {signatureFormat({
                                          sign: i.savedSigned,
                                          date: i.signDate,
                                          hoursFormat,
                                        })}
                                      </span>
                                    ) : (
                                      <span>&mdash;</span>
                                    )}
                                  </td>
                                  <td>
                                    <div className="icon-joiner">
                                      <Link
                                        className="del-btn"
                                        onClick={(e) => removeOne(e, index)}
                                      >
                                        <i className="fa-solid fa-trash" />
                                      </Link>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    )}
                  </Form>
                  <div className="text-end">
                    {signatureFormat({
                      sign: viewItem?.employeeSignature,
                      date: viewItem?.employeeSignDate,
                      hoursFormat,
                    })}
                    {viewItem?.signers?.map((value) =>
                      value?.signature
                        ? signatureFormat({
                            sign: value?.signature,
                            date: value?.dateSigned,
                            hoursFormat,
                          })
                        : null,
                    )}
                  </div>
                </ModalBody>
                <Modal.Footer className="justify-content-center">
                  <Button className="theme-button" type="submit">
                    SAVE
                  </Button>
                  <Button
                    className="theme-button-outline"
                    onClick={props.onHide}
                  >
                    CANCEL
                  </Button>
                </Modal.Footer>
              </Form>
            </>
          ) : addContactBtn == "t" ? (
            <>
              <Modal.Header closeButton>
                <h5 className="fw-bold mb-0">Add Reference Check</h5>
              </Modal.Header>
              <ModalBody>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Employee</Form.Label>
                  <Form.Select
                    required
                    onChange={(e) => setEmployeeId1(e.target.value)}
                  >
                    <option value={""}>Select Employee</option>
                    {employeeData?.data?.length > 0 &&
                      employeeData?.data?.map((item) => {
                        if (item?.userType !== ROLES.PATIENT) {
                          return (
                            <option value={item._id} key={item._id}>
                              {item.firstName} {item.lastName}
                            </option>
                          );
                        }
                        return null;
                      })}
                  </Form.Select>
                </Form.Group>
                <Row>
                  <Col xs={12}>
                    <Form.Label className="font-bold">
                      Good faith recommendation from references to include a
                      former employer.
                    </Form.Label>
                  </Col>
                </Row>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="font-bold">
                      Reference Name:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      onChange={(e) => setReferenceName(e.target.value)}
                      value={referenceName}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="font-bold">
                      Date of Contact:
                    </Form.Label>
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
                  <Form.Group className="mb-3">
                    <Form.Label className="font-bold">
                      Reference Recommendation:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      onChange={(e) =>
                        setReferenceRecommendation(e.target.value)
                      }
                      value={referenceRecommendation}
                    />
                  </Form.Group>
                  <Row className="mb-3">
                    <Col xs={12} lg={6} className="flex gap-1 items-center">
                      <Button
                        className="theme-button"
                        onClick={() => setOpenAdmin(true)}
                      >
                        SAVED AND SIGNED
                      </Button>
                      <div className="text-red-600 text-[12px]">
                        *
                        {isEmpty && !savedSigned && (
                          <span>This field is required</span>
                        )}
                      </div>
                    </Col>
                    <Col xs={12} lg={6}>
                      <Form.Label className="w-100 text-end">
                        {signatureFormat({
                          sign: savedSigned,
                          date: signDate,
                          time: signTime,
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
                                  hoursFormat,
                                })}
                              </div>
                            ),
                        )}
                      </Form.Label>
                    </Col>
                  </Row>
                  <Row className="mb-3 text-center">
                    <Col xs={12}>
                      <Button
                        className="theme-button"
                        onClick={() => addTable()}
                        type="button"
                      >
                        Add More
                      </Button>
                    </Col>
                  </Row>

                  {multipleTable?.length > 0 && (
                    <Row className="mb-3">
                      <Col xs={12}>
                        <Table bordered responsive>
                          <thead>
                            <tr>
                              <th>Reference Name:</th>
                              <th>Date of Contact:</th>
                              <th>Reference Recommendation</th>
                              <th>Signature</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {multipleTable?.map((i, index) => (
                              <tr key={index}>
                                <td
                                  className={`${i?.referenceName ? "" : "text-center"}`}
                                >
                                  {" "}
                                  {i.referenceName || <span>&mdash;</span>}{" "}
                                </td>
                                <td
                                  className={`${i?.date ? "" : "text-center"}`}
                                >
                                  {" "}
                                  {formatDateToMMDDYYYY(i.date) || (
                                    <span>&mdash;</span>
                                  )}{" "}
                                </td>
                                <td
                                  className={`${i?.referenceRecommendation ? "" : "text-center"}`}
                                >
                                  {" "}
                                  {i.referenceRecommendation || (
                                    <span>&mdash;</span>
                                  )}{" "}
                                </td>
                                <td
                                  className={`${i?.savedSigned ? "" : "text-center"}`}
                                >
                                  {" "}
                                  {i?.savedSigned ? (
                                    <span>
                                      {" "}
                                      {signatureFormat({
                                        sign: savedSigned,
                                        date: signDate,
                                        hoursFormat,
                                      })}
                                    </span>
                                  ) : (
                                    <span>&mdash;</span>
                                  )}
                                </td>
                                <td>
                                  <div className="icon-joiner">
                                    <Link
                                      className="del-btn"
                                      onClick={(e) => removeOne(e, index)}
                                    >
                                      <i className="fa-solid fa-trash" />
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  )}
                </Form>
              </ModalBody>
              <Modal.Footer className="justify-content-center">
                <Button className="theme-button" onClick={submitHandler}>
                  SAVE
                </Button>
                <Button className="theme-button-outline" onClick={props.onHide}>
                  CANCEL
                </Button>
              </Modal.Footer>
            </>
          ) : addContactBtn == "v" ? (
            <div ref={printRef} tabIndex={0} className="outline-none">
              <Modal.Header closeButton>
                <h5 className="fw-bold mb-0">Reference Check Details</h5>
              </Modal.Header>
              <ModalBody>
                <div ref={componentRef}>
                  <h1 className="pdfTitle my-3 hidden">
                    {" "}
                    Reference Check Details
                  </h1>
                  <div className="view-details">
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <div className="view-details-grid my-1 my-md-2 p-3">
                          <p className="view-label mb-1"> Employee Name : </p>
                          <h5 className="view-value mb-0">
                            {`${viewItem?.employeeId?.firstName} ${viewItem?.employeeId?.lastName}`}
                          </h5>
                        </div>
                      </Col>
                    </Row>
                    {viewItem?.data?.length > 0 && (
                      <Row className="mb-3">
                        <Col xs={12}>
                          <Table bordered responsive>
                            <thead>
                              <tr>
                                <th>Reference Name:</th>
                                <th>Date of Contact:</th>
                                <th>Reference Recommendation</th>
                                <th>Signature</th>
                              </tr>
                            </thead>
                            <tbody>
                              {viewItem?.data?.map((i, index) => (
                                <tr key={index}>
                                  <td
                                    className={`${i?.referenceName ? "" : "text-center"}`}
                                  >
                                    {" "}
                                    {i.referenceName || (
                                      <span>&mdash;</span>
                                    )}{" "}
                                  </td>
                                  <td
                                    className={`${i?.date ? "" : "text-center"}`}
                                  >
                                    {" "}
                                    {formatDateToMMDDYYYY(i.date) || (
                                      <span>&mdash;</span>
                                    )}{" "}
                                  </td>
                                  <td
                                    className={`${i?.referenceRecommendation ? "" : "text-center"}`}
                                  >
                                    {" "}
                                    {i.referenceRecommendation || (
                                      <span>&mdash;</span>
                                    )}{" "}
                                  </td>
                                  <td
                                    className={`${i?.savedSigned ? "" : "text-center"}`}
                                  >
                                    {" "}
                                    {i?.savedSigned ? (
                                      <span>
                                        {" "}
                                        {signatureFormat({
                                          sign: i?.savedSigned,
                                          date: i?.signDate,
                                          hoursFormat,
                                        })}
                                      </span>
                                    ) : (
                                      <span>&mdash;</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                          <div className="text-end">
                            {signatureFormat({
                              sign: viewItem?.employeeSignature,
                              date: viewItem?.employeeSignDate,
                              hoursFormat,
                            })}
                            {viewItem?.signers?.map((value) =>
                              value?.signature
                                ? signatureFormat({
                                    sign: value?.signature,
                                    date: value?.dateSigned,
                                    hoursFormat,
                                  })
                                : null,
                            )}
                          </div>
                        </Col>
                      </Row>
                    )}
                  </div>
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
      </>
    );
  }
  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <NavWrapper title="Refrence Check" isArrow={true} />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={getReferenceCheck}
        onDelete={({ additionalFunctions }) =>
          employmentService.referenceCheck.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
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
          <Table responsive bordered className="mt-2">
            <thead>
              <tr>
                <th>Reference Name</th>
                <th>Date:</th>
                <th>Reference Recommendation</th>
                <th>Signature</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {response &&
                response?.docs?.length > 0 &&
                response?.docs?.map((item, index) => (
                  <tr key={item._id}>
                    <td>
                      {emptyChecker(item?.data[0]?.referenceName) ? (
                        <DashComponent />
                      ) : (
                        item?.data[0]?.referenceName
                      )}
                    </td>
                    <td>
                      {emptyChecker(item?.data[0]?.date) ? (
                        <DashComponent />
                      ) : (
                        formatDateToMMDDYYYY(item?.data[0]?.date)
                      )}
                    </td>
                    <td>
                      {emptyChecker(item?.data[0]?.referenceRecommendation) ? (
                        <DashComponent />
                      ) : (
                        item?.data[0]?.referenceRecommendation
                      )}
                    </td>
                    <td>
                      {emptyChecker(item?.data[0]?.savedSigned) ? (
                        <DashComponent />
                      ) : (
                        signatureFormat({
                          sign: item?.data?.[0]?.savedSigned,
                          date: item?.data?.[0]?.signDate,
                          hoursFormat,
                        })
                      )}
                    </td>
                    <td>
                      <div className="icon-joiner">
                        <Link
                          className="view-btn"
                          onClick={() => {
                            setViewItem(item);
                            setAddContactBtn("v");
                            setModalShow(true);
                          }}
                        >
                          <FaEye />{" "}
                        </Link>
                        <Link
                          className="edit-btn"
                          onClick={() => {
                            setViewItem(item);
                            setNoteData(item);
                            setAddContactBtn("f");
                            setModalShow(true);
                            setIsEdit(true);
                          }}
                        >
                          <FaEdit />{" "}
                        </Link>
                        <Link
                          className="del-btn"
                          onClick={() => handleDelete(item._id)}
                        >
                          <RiDeleteBin5Fill />{" "}
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
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
  Wcomponenet: ReferenceCheck,
});
