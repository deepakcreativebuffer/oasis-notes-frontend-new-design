/* eslint-disable no-unused-vars, eqeqeq */
import { useCallback, useEffect, useRef, useState } from "react";
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
import { FaCopy, FaEdit, FaEye, FaSpinner } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { ClipLoader } from "react-spinners";
import Select from "react-select";
import Offcanvas from "react-bootstrap/Offcanvas";
import Modal from "react-bootstrap/Modal";
import { Link, useParams } from "react-router-dom";
import { useHistory } from "react-router-use-history";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import parse from "html-react-parser";
import { sanitizeHtml } from "@/utils/security/sanitizeHtml";
import HOC from "@/features/shared/layout/Outer/HOC";
import {
  adminNotesLibraryService,
  adminDashboardService,
} from "@/features/shared/services";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import TextEditor from "@/features/shared/ui/TextEditor/TextEditor";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import { DEFAULT_PAGE_SIZE } from "@/features/shared/constants";
import { showNotification, logger } from "@/utils";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const NotesLibrary2 = () => {
  const [show, setShow] = useState(false);
  const [addContactBtn, setAddContactBtn] = useState(null);
  const params = useParams();
  const history = useHistory();
  const [editId, setEditId] = useState("");
  const [selectedItem, setSelectedItem] = useState(params.page || "contacts");
  const profileInfo = useSelector(userProfile);
  const [viewItem, setViewItem] = useState({});
  const handleItemClick = (itemName, link) => {
    setSelectedItem(itemName);
    history.push(`/dashboard/${link}`);
  };
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
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { data: notes, isLoading: loading } = useQuery({
    queryKey: queryKeys.dashboard.list({
      page,
      limit,
      debouncedQuery,
      type: "bhrfTherapyTopic",
    }),
    queryFn: () =>
      adminDashboardService.bhrfTherapyTopic.list({
        page,
        limit,
        debouncedQuery,
      }),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();
  const getAllnotes = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
  }, [queryClient]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (notes?.data?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [notes?.data?.docs?.length, page]);
  const [cloneLoading, setCloneLoading] = useState(false);
  const [cloneId, setCloneId] = useState("");
  const deleteNote = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };
  const handleMakeClone = function (id) {
    setCloneId(id);
    setCloneLoading(true);
    adminNotesLibraryService
      .cloneBhrfTherapyTopic(id)
      .then((res) => {
        showNotification({
          message: "Note Cloned !",
          type: "success",
        });
        getAllnotes();
        setPage(1);
      })
      .catch((err) => {
        showNotification({
          message: err?.response?.data?.message || "Clone failed",
          type: "danger",
        });
      })
      .finally(() => {
        setCloneLoading(false);
      });
  };
  function MyVerticallyCenteredModal(props) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(
      resolveAdminAssetPath("/Dashboard/contacts/user.png"),
    );
    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [plan, setPlan] = useState("");
    const payload = {};
    if (title) {
      payload.title = title;
    }
    if (subTitle) {
      payload.subTitle = subTitle;
    }
    if (plan) {
      payload.plan = plan;
    }
    const postDataHandler = (e) => {
      e.preventDefault();
      adminNotesLibraryService.addBhrfTherapySuper(payload).then((res) => {
        getAllnotes();
        showNotification({ message: res.message, type: "success" });
        setTitle("");
        setSubTitle("");
        if (props.onHide) {
          props.onHide();
        }
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
    const [formData, setFormData] = useState({
      bhrfTherapyId: viewItem?.bhrfTherapyId || "",
      topic: viewItem?.topic || "",
      notesSummary: viewItem?.notesSummary || "",
      planRecommendation: viewItem?.planRecommendation || "",
    });
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const payload = { ...formData };
        if (!payload.bhrfTherapyId) {
          delete payload.bhrfTherapyId;
        }
        const res = await adminNotesLibraryService.addBhrfTherapyTopic(payload);
        showNotification({ message: res.message, type: "success" });
        getAllnotes();
        if (props.onHide) {
          props.onHide();
        }
      } catch (error) {
        logger.error("Error submitting form data:", error);
        if (error.response) {
          logger.error("Server responded with:", error.response.data);
        } else if (error.request) {
          logger.error("No response received from the server");
        } else {
          logger.error("An unexpected error occurred:", error.message);
        }
      }
    };
    const handleSubmit2 = async (e) => {
      e.preventDefault();
      const payload2 = {};
      if (formData.topic) {
        payload2.topic = formData.topic;
      }
      if (formData.notesSummary) {
        payload2.notesSummary = formData.notesSummary;
      }
      if (formData.planRecommendation) {
        payload2.planRecommendation = formData.planRecommendation;
      }
      try {
        const res = await adminNotesLibraryService.editBhrfTherapyTopic(
          editId,
          payload2,
        );
        showNotification({ message: res.message, type: "success" });
        getAllnotes();
        if (props.onHide) {
          props.onHide();
        }
      } catch (error) {
        logger.error("Error submitting form data:", error);
      }
    };
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () =>
        printDocumentContent(
          componentRef.current.cloneNode(true),
          profileInfo,
          profileInfo,
        ),
      documentTitle: printDocumentTitleExceptFirstPage(
        profileInfo,
        profileInfo,
      ),
      pageStyle: `
      @page {
        margin: 12mm 9mm !important;
      }    
      .card {
        page-break-inside: avoid;
      }
      .view-details-grid {
        page-break-inside: avoid;
      }
    `,
    });
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
              <h5 className="fw-bold mb-0">View Note</h5>
            </Modal.Header>
            <Modal.Body>
              <div ref={componentRef}>
                <h1 className="pdfTitle hidden m-2.5">View Note</h1>
                <Form>
                  <div className="view-details">
                    <Row>
                      <Col xs={12} md={12} lg={12}>
                        <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                          <p className="view-label mb-1">Topic : </p>
                          <h5 className="view-value mb-0">
                            {viewItem?.topic
                              .replace("Topic : ", "")
                              .replace("Topic: ", "")}
                          </h5>
                        </div>
                      </Col>
                      <Col xs={12} md={12} lg={12}>
                        <div className="view-details-grid my-1 my-md-2 p-3">
                          <p className="view-label mb-1">Added By : </p>
                          <h5 className="view-value mb-0">{viewItem?.addBy}</h5>
                        </div>
                      </Col>
                      <Col xs={12} md={12} lg={12}>
                        <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                          <p className="view-label mb-1">Note Summary : </p>
                          <h5 className="view-value mb-0">
                            {parse(sanitizeHtml(viewItem?.notesSummary))}
                          </h5>
                        </div>
                      </Col>
                      <Col xs={12} md={12} lg={12}>
                        <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                          <p className="view-label mb-1">
                            Plan Recommendation :{" "}
                          </p>
                          <h5 className="view-value mb-0">
                            {parse(sanitizeHtml(viewItem?.planRecommendation))}
                          </h5>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
              <Button className="theme-button" onClick={handlePrint}>
                PRINT
              </Button>
              <Button className="theme-button-outline" onClick={props.onHide}>
                CANCEL
              </Button>
            </Modal.Footer>
          </>
        ) : addContactBtn == "t" ? (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Notes Library</h5>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
              <ModalBody>
                <div>
                  <Form.Group controlId="topic">
                    <Form.Label className="fw-bold">Topic:</Form.Label>
                    <Form.Control
                      type="text"
                      name="topic"
                      required
                      value={formData.topic}
                      onChange={handleInputChange}
                      className="mb-3"
                    />
                  </Form.Group>

                  <Form.Group controlId="notesSummary">
                    <Form.Label className="fw-bold">Notes Summary:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="5"
                      name="notesSummary"
                      value={formData.notesSummary}
                      required
                      className="mb-3"
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="planRecommendation">
                    <Form.Label className="fw-bold">
                      Plan Recommendation:
                    </Form.Label>

                    <Form.Control
                      required
                      name="planRecommendation"
                      className="mb-3"
                      as="textarea"
                      rows="5"
                      value={formData.planRecommendation}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </div>
              </ModalBody>
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
              <h5 className="fw-bold mb-0">Update Notes Library</h5>
            </Modal.Header>
            <Form onSubmit={handleSubmit2}>
              <ModalBody>
                <div>
                  <Form.Group controlId="topic">
                    <Form.Label className="fw-bold">Topic:</Form.Label>
                    <Form.Control
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      className="mb-3"
                    />
                  </Form.Group>
                  <Form.Group controlId="notesSummary">
                    <Form.Label className="fw-bold">Notes Summary:</Form.Label>

                    <TextEditor
                      value={formData.notesSummary}
                      setValue={(value) => {
                        setFormData((prevData) => ({
                          ...prevData,
                          notesSummary: value,
                        }));
                      }}
                    />
                  </Form.Group>

                  <Form.Group controlId="planRecommendation">
                    <Form.Label className="fw-bold">
                      Plan Recommendation:
                    </Form.Label>

                    <TextEditor
                      value={formData.planRecommendation}
                      setValue={(value) => {
                        setFormData((prevData) => ({
                          ...prevData,
                          planRecommendation: value,
                        }));
                      }}
                    />
                  </Form.Group>
                </div>
              </ModalBody>
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
        ) : null}
      </Modal>
    );
  }
  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={getAllnotes}
        onDelete={({ additionalFunctions }) =>
          adminDashboardService.bhrfTherapyTopic.remove({
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
      <Container>
        <Row>
          <Col>
            <div className="page-title-bar">
              <p className="heading">Notes Library</p>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={8} md={4}>
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
          <Col xs={4} md={8} className="text-end">
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
        <Table bordered responsive>
          <thead>
            <tr>
              <th className="w-[70%]">Topic</th>
              <th>Added By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-2">
                  <ClipLoader color="rgb(26, 159, 178)" />
                </td>
              </tr>
            ) : !notes?.data?.docs?.length ? (
              <tr>
                <td colSpan="3" className="text-center p-0">
                  <NoFound />
                </td>
              </tr>
            ) : (
              notes?.data?.docs &&
              notes?.data?.docs?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      {item.topic
                        .replace("Topic : ", "")
                        .replace("Topic: ", "")}
                    </td>
                    <td>
                      {item.addBy} {item.is_cloned && "(cloned)"}
                    </td>

                    <td>
                      <div className="icon-joiner">
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
                        {item?.addBy === "superAdmin" && (
                          <Link
                            className="edit-btn"
                            onClick={() => {
                              handleMakeClone(item._id);
                            }}
                          >
                            {cloneLoading && item?._id === cloneId ? (
                              <FaSpinner />
                            ) : (
                              <FaCopy />
                            )}
                          </Link>
                        )}
                        {item?.addBy === "admin" && (
                          <>
                            <Link
                              className="edit-btn"
                              onClick={() => {
                                setViewItem(item);
                                setEditId(item._id);
                                setAddContactBtn("v");
                                setModalShow(true);
                              }}
                            >
                              <FaEdit />
                            </Link>

                            <Link
                              className="del-btn"
                              onClick={() => deleteNote(item._id)}
                            >
                              <RiDeleteBin5Fill />{" "}
                            </Link>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
        {notes?.data?.docs?.length > 0 && (
          <PaginationsPage
            page={page}
            setPage={setPage}
            totalPages={notes?.data?.totalPages && notes?.data?.totalPages}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: NotesLibrary2,
});
