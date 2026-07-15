/* eslint-disable no-unused-vars */
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
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import HOC from "@/features/shared/layout/Outer/HOC";
import { adminDashboardService } from "@/features/shared/services";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import TextEditor from "@/features/shared/ui/TextEditor/TextEditor";
import ReactQuill from "react-quill";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import { DEFAULT_PAGE_SIZE } from "@/features/shared/constants";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

const MesaurableGoal = () => {
  const [addContactBtn, setAddContactBtn] = useState(null);
  const [editId, setEditId] = useState("");
  const profileInfo = useSelector(userProfile);
  const [viewItem, setViewItem] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { data: mesaurableGoal, isLoading: loading } = useQuery({
    queryKey: queryKeys.dashboard.list({
      page,
      limit,
      debouncedQuery,
      type: "measurables",
    }),
    queryFn: () =>
      adminDashboardService.treatmentMeasureable.listMeasureables({
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
    if (mesaurableGoal?.data?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [mesaurableGoal?.data?.docs?.length, page]);
  const [cloneLoading, setCloneLoading] = useState(false);
  const [cloneId, setCloneId] = useState("");
  const deleteNote = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };
  const handleMakeClone = function (id) {
    setCloneId(id);
    adminDashboardService.treatmentMeasureable.clone(id, {
      successMsg: "Treatment Measurable Cloned !",
      setLoading: setCloneLoading,
      additionalFunctions: [getAllnotes, () => setPage(1)],
    });
  };
  function MyVerticallyCenteredModal(props) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(
      resolveAdminAssetPath("/Dashboard/contacts/user.png"),
    );
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
      topic: viewItem?.topic || "",
      value: viewItem?.value || "",
      type: "MEASURABLES",
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
      adminDashboardService.treatmentMeasureable.create(formData, {
        successMsg: "Treatment Measurable Created !",
        additionalFunctions: [getAllnotes, props.onHide],
      });
    };
    const handleSubmit2 = async (e) => {
      e.preventDefault();
      const payload2 = {};
      if (formData.topic) {
        payload2.topic = formData.topic;
      }
      if (formData.value) {
        payload2.value = formData.value;
      }
      adminDashboardService.treatmentMeasureable.update(editId, payload2, {
        successMsg: "Treatment Measurable Updated !",
        additionalFunctions: [getAllnotes, props.onHide],
      });
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
        {addContactBtn === "f" ? (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">View Treatment Mesaurable Goal</h5>
            </Modal.Header>
            <Modal.Body>
              <div ref={componentRef}>
                <h1 className="pdfTitle hidden m-2.5">
                  View Treatment Mesaurable Goal
                </h1>
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
                          <p className="view-label mb-1">
                            Treatment Mesaurable Goal :{" "}
                          </p>
                          {/* <h5 className="view-value mb-0">{parse(viewItem?.value)}</h5> */}
                          <ReactQuill
                            theme="bubble"
                            value={viewItem?.value}
                            readOnly={true}
                          />
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
        ) : addContactBtn === "t" ? (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Treatment Mesaurable Goal</h5>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
              <ModalBody>
                <div>
                  <Form.Group controlId="topic">
                    <Form.Label className="fw-bold">Topic : </Form.Label>
                    <Form.Control
                      type="text"
                      name="topic"
                      required
                      value={formData.topic}
                      onChange={handleInputChange}
                      className="mb-3"
                    />
                  </Form.Group>

                  <Form.Group controlId="mesaurableGoalSummary">
                    <Form.Label className="fw-bold">
                      Mesaurable Goal Summary :{" "}
                    </Form.Label>

                    <TextEditor
                      value={formData.value}
                      setValue={(value) => {
                        setFormData((prevData) => ({
                          ...prevData,
                          value: value,
                        }));
                      }}
                      defaultBullet={true}
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
        ) : addContactBtn === "v" ? (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Update Treatment Mesaurable Goal</h5>
            </Modal.Header>
            <Form onSubmit={handleSubmit2}>
              <ModalBody>
                <div>
                  <Form.Group controlId="topic">
                    <Form.Label className="fw-bold">Topic : </Form.Label>
                    <Form.Control
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      className="mb-3"
                    />
                  </Form.Group>
                  <Form.Group controlId="mesaurableGoalSummary">
                    <Form.Label className="fw-bold">
                      Treatment Mesaurable Goal :{" "}
                    </Form.Label>
                    <TextEditor
                      value={formData.value}
                      setValue={(value) => {
                        setFormData((prevData) => ({
                          ...prevData,
                          value: value,
                        }));
                      }}
                      defaultBullet={true}
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
          adminDashboardService.treatmentMeasureable.delete(deleteId, {
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container>
        <Row>
          <Col>
            <div className="page-title-bar">
              <p className="heading">Treatment Mesaurable Goal</p>
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
            ) : !mesaurableGoal?.data?.docs?.length ? (
              <tr>
                <td colSpan="3" className="text-center p-0">
                  <NoFound />
                </td>
              </tr>
            ) : (
              mesaurableGoal?.data?.docs &&
              mesaurableGoal?.data?.docs?.map((item, index) => {
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
                        {item?.addBy === "SuperAdmin" && (
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
                        {item?.addBy === "Admin" && (
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
        {mesaurableGoal?.data?.docs?.length > 0 && (
          <PaginationsPage
            page={page}
            setPage={setPage}
            totalPages={
              mesaurableGoal?.data?.totalPages &&
              mesaurableGoal?.data?.totalPages
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
  Wcomponenet: MesaurableGoal,
});
