/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import { resolveAdminAssetPath } from "@/assets";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  ModalBody,
  Table,
} from "react-bootstrap";
import "@/assets/styles/Contacts.css";
import { FaDownload } from "react-icons/fa";
import Select from "@/features/shared/ui/Search/Search";
import Offcanvas from "react-bootstrap/Offcanvas";
import Modal from "react-bootstrap/Modal";
import HOC from "@/features/shared/layout/Inner/HOC";
import { uploadService } from "@/features/shared/services";
import UnifiedFileUpload from "@/features/shared/ui/Upload/UnifiedFileUpload";
import {
  formatDateToMMDDYYYY,
  formatDateWithoutUTCHandleToMMDDYYYY,
} from "@/utils/utils";
import {
  getObjectUrlFromDownloadUrl,
  receiptsService,
} from "@/features/shared/services";
import "./Receipts.css";
import { Link } from "react-router-dom";
import NavWrapper from "@/utils/NavWrapper";
import DatePicker from "react-datepicker";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { showNotification } from "@/utils";
import { useReceiptsList } from "@/features/shared/services/queries";
import { useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const Receipts = () => {
  const profileUser = useSelector(userProfile);
  const [show, setShow] = useState(false);
  const [addContactBtn, setAddContactBtn] = useState(false);
  const [newFilterFun, setNewFilterFun] = useState([]);
  const handleClose = () => setShow(false);
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
  const [filteredDataFn, setFilteredDataFn] = useState(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  function MyVerticallyCenteredModal(props) {
    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    // Removing manual handleFileChange as logic is moved to UnifiedFileUpload component

    const handleUpload = async () => {
      if (!file) {
        showNotification({
          message: "Please select a file.",
          type: "danger",
        });
        return;
      }
      setUploading(true);
      const result = await uploadService.uploadSingle(
        `employee/addReceipt`,
        "file",
        file,
        {
          receiptName: name,
        },
        (p) => setProgress(p),
      );
      setUploading(false);
      if (result.success) {
        showNotification({
          message: result.message || "Receipt Uploaded!",
          type: "success",
        });
        props.onHide();
        queryClient.invalidateQueries({ queryKey: queryKeys.receipts.all() });
      } else {
        showNotification(result);
      }
    };
    const [docName, setDocName] = useState("");
    const [fromStartDate, setFromStartDate] = useState(newFilterFun?.[0] || "");
    const [fromEndDate, setFromEndDate] = useState(newFilterFun?.[1] || "");
    const clearFilterHandler = () => {
      setFromStartDate("");
      setFromEndDate("");
    };
    const handleNewFilterFun = () => {
      const dataDate = [];
      dataDate.push(fromStartDate, fromEndDate);
      setNewFilterFun(dataDate ?? []);
      props.onHide();
    };
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
              <h5 className="mb-0 fw-bold">Filter</h5>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>
                  <Col xs={12} md={4}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="w-full font-bold">From</Form.Label>
                      <DatePicker
                        selected={formatDateToMMDDYYYY(fromStartDate)}
                        onChange={(selectedDate) =>
                          setFromStartDate(selectedDate?.toDateString())
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              fromStartDate
                                ? formatDateToMMDDYYYY(fromStartDate)
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group className="mb-3 d-flex flex-column">
                      <Form.Label className="w-full font-bold">To </Form.Label>
                      <DatePicker
                        selected={formatDateToMMDDYYYY(fromEndDate)}
                        onChange={(selectedDate) =>
                          setFromEndDate(selectedDate?.toDateString())
                        }
                        dateFormat="MM/dd/yyyy"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        highlightDates={[
                          {
                            "react-datepicker__day--highlighted-custom": [
                              fromEndDate
                                ? formatDateToMMDDYYYY(fromEndDate)
                                : new Date(),
                            ],
                          },
                        ]}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={2}>
                    <Button
                      className="theme-button mt-4"
                      onClick={clearFilterHandler}
                    >
                      Clear
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
              <Button className="theme-button" onClick={handleNewFilterFun}>
                APPLY
              </Button>
              <Button
                className="theme-button-outline"
                onClick={() => {
                  props.onHide();
                }}
              >
                CANCEL
              </Button>
            </Modal.Footer>
          </>
        ) : addContactBtn === "add" ? (
          <>
            <ModalBody>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="w-full font-bold">
                    Resident Full Name:
                  </Form.Label>
                  <Form.Control
                    required
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Enter Full Name"
                  />
                </Form.Group>
              </Form>
            </ModalBody>
            <Modal.Footer className="justify-content-center">
              <Button className="theme-button" onClick={handleUpload}>
                UPLOAD RECEIPT
              </Button>
              <UnifiedFileUpload
                onFileSelect={(f) => {
                  setFile(f);
                  if (f) setName(f.name);
                }}
                uploading={uploading}
                progress={progress}
              />
            </Modal.Footer>
          </>
        ) : addContactBtn === "view" ? (
          <>
            <Modal.Header closeButton>
              <h5 className="mb-0">Document Viewer</h5>
            </Modal.Header>
            <ModalBody>
              <div>
                {docName && (
                  <iframe
                    title="Document Preview"
                    src={docName}
                    width="100%"
                    height={"400px"}
                  />
                )}
                <div>
                  <p></p>
                </div>
              </div>
            </ModalBody>
            <Modal.Footer>
              <div className="w-full flex justify-center">
                <Button
                  className="bg-[#0C5C75] text-white font-medium px-[3.5rem] py-2 cursor-pointer"
                  onClick={props.onHide}
                >
                  CANCEL
                </Button>
              </div>
            </Modal.Footer>
          </>
        ) : null}
      </Modal>
    );
  }
  const queryClient = useQueryClient();

  const { data: receiptsResponse, isLoading: loading } = useReceiptsList(
    {
      page,
      limit,
      debouncedQuery,
      fromDate: newFilterFun?.[0],
      toDate: newFilterFun?.[1],
    },
    { placeholderData: keepPreviousData },
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (receiptsResponse?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [receiptsResponse?.docs?.length, page]);
  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />{" "}
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
                  className="max-w-[20px] max-h-[20px]"
                  src={resolveAdminAssetPath("/Dashboard/admin.png")}
                  alt=""
                />
                <span>ADMIN</span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
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
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-[20px] max-h-[20px]"
                  src={resolveAdminAssetPath("/Dashboard/call.png")}
                  alt=""
                />
                <span>PHONE </span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-[20px] max-h-[20px]"
                  src={resolveAdminAssetPath("/Dashboard/call.png")}
                  alt=""
                />
                <span>ADDRESS -</span>
              </p>
              <p className="flex gap-[15px] items-center font-bold text-[#1A9FB2]">
                <img
                  className="max-w-[20px] max-h-[20px]"
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
      <Row>
        <Col>
          <NavWrapper title={"Receipts"} isArrow={true} />
        </Col>
      </Row>
      <Container>
        <Row>
          <Col xs={12} md={6} lg={4}>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Control
                type="search"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
              />
            </Form.Group>
          </Col>
          <Col xs="auto">
            <img
              onClick={() => {
                setAddContactBtn("filter");
                setModalShow(true);
              }}
              className="max-w-[35px] max-h-[35px] w-auto h-auto cursor-pointer"
              src={resolveAdminAssetPath("/Dashboard/contacts/filter.png")}
              alt="filter"
            />
          </Col>
          {(profileUser?.userType === ROLES.ADMIN ||
            profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
            (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
              profileUser?.userType === ROLES.EMPLOYEE &&
              profileUser.userPermissions?.view
                ?.split(":")
                .includes("uf"))) && (
            <Col xs="auto" className="ml-auto">
              <Button
                onClick={() => {
                  setAddContactBtn("add");
                  setModalShow(true);
                }}
                variant="primary"
                className="theme-button"
              >
                + UPLOAD RECEIPT
              </Button>
            </Col>
          )}
        </Row>
        <Row>
          <Col>
            <div className="receipt-list mt-3">
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Receipt Name</th>
                    <th>Date Uploaded</th>
                    <th>Document Type</th>
                    <th colSpan={2}>Size</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptsResponse?.docs?.length > 0 ? (
                    receiptsResponse?.docs.map((recipt) => (
                      <tr key={recipt._id}>
                        <td>{recipt.receiptName}</td>
                        <td>
                          {formatDateWithoutUTCHandleToMMDDYYYY(
                            recipt.updatedAt,
                          )}
                        </td>
                        <td>{recipt.documentType}</td>
                        <td colSpan={2}>{recipt.size}</td>

                        <td>
                          <a
                            className="no-underline"
                            href={getObjectUrlFromDownloadUrl(recipt?.document)}
                            download
                          >
                            <span className="flex gap-2 items-center">
                              <FaDownload className="text-[#0c5c75]" />
                              <span className="d-none d-md-inline-block text-[#0c5c75]">
                                DOWNLOAD RECEIPT
                              </span>
                            </span>
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                        No Receipts Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
        {receiptsResponse?.docs?.length > 0 && (
          <PaginationsPage
            page={page}
            setPage={setPage}
            totalPages={
              receiptsResponse?.totalPages && receiptsResponse?.totalPages
            }
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: Receipts,
});
