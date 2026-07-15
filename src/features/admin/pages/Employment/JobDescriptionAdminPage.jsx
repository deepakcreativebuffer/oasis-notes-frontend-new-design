/* eslint-disable no-unused-vars, eqeqeq */
import React, { useCallback, useEffect, useState, useRef } from "react";
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
import { Link, useParams } from "react-router-dom";
import { useHistory } from "react-router-use-history";
import { showNotification } from "@/utils";
import {
  getAdminUser,
  getAllJobDescriptions,
  addJobDescription,
  getAdminProfile as getAdminProfileApi,
  adminDashboardService,
} from "@/features/shared/services/index";
import ReactQuill from "react-quill";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import NavWrapper from "@/utils/NavWrapper";
import { fetchPaitentName, signatureFormat } from "@/utils/utils";
import { usePrint } from "@shared/hooks";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage.jsx";
import SafeHtml from "@/features/shared/ui/common/SafeHtml.jsx";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal.jsx";
import { DEFAULT_PAGE_SIZE, ROLES } from "@/features/shared/constants/index";
import { useJobDescriptionList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const JobDescription = () => {
  const [show, setShow] = useState(false);
  const [addContactBtn, setAddContactBtn] = useState(null);
  const params = useParams();
  const [viewItem, setViewItem] = useState({});
  const history = useHistory();
  const [data, setData] = useState({});
  const [editId, setEditId] = useState(null);
  const [employeeName, setEmployeeName] = useState(null);
  const [selectedItem, setSelectedItem] = useState(params.page || "contacts");
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        profile,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(profile),
    pageStyle: `
      @page {
        size: portrait !important;
        margin: 12mm 9mm!important;
      }
      .form-label{
        page-break-inside: avoid;
      }
      body {
        margin: 0;
        padding: 20px; 
      }
      .print-container {
        border: 3px solid red;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        page-break-after: always;
      }
     .needtoMove{
      marginTop: 40px;
     }
      footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        padding: 10px;
        background-color: #fff;
        border-top: 1px solid #ddd;
        box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
      }
      footer::before {
        content: counter(page);
        margin-right: 10px;
      }
      footer::after {
        content: attr(data-site-name);
        position: absolute;
        left: 20px;
        bottom: 0;
      }
    `,
  });
  const print = usePrint(printRef, handlePrint);
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
  const companyName =
    profile?.userType === ROLES.ADMIN
      ? profile?.companyName
      : profile?.adminId?.companyName;
  const [modalShow, setModalShow] = useState(false);
  const [file, setFile] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useJobDescriptionList(
    { page, limit, debouncedQuery },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const getAllnotes = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.jobDescription.all() });
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
  const deleteNote = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };
  function MyVerticallyCenteredModal(props) {
    const fileUploadRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(
      resolveAdminAssetPath("/Dashboard/contacts/user.png"),
    );
    const [defaultJobDescription, setDefaultJobDescription] = useState("");
    const [value, setValue] = useState("");
    const [value2, setValue2] = useState(viewItem?.jobDescription || "");

    useEffect(() => {
      if (addContactBtn === "f" && viewItem?.jobDescription) {
        setValue2(
          viewItem.jobDescription
            .replaceAll("undefineds", "tests")
            .replaceAll("undefined", companyName)
            .replace(
              /<span class="companyName">.*?<\/span>/g,
              `<span class="companyName">${companyName}</span>`,
            )
            .replaceAll("--company-name--", companyName),
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewItem, addContactBtn, companyName]);
    const [value3, setValue3] = useState("");
    const [signers, setSigners] = useState([]);
    const handleChange = (content, delta, source, editor) => {
      setValue(content);
    };
    const handleChange2 = (content, delta, source, editor) => {
      setValue2(content);
    };
    const handleChange3 = (content, delta, source, editor) => {
      setValue3(content);
    };
    const getJobDesccription = async () => {
      const res = await getAllJobDescriptions();
      if (res.success && res.data?.length > 0) {
        const desc = res.data[0].jobDescription
          .replaceAll("undefineds", "tests")
          .replaceAll("undefined", companyName)
          .replace(
            /<span class="companyName">.*?<\/span>/g,
            `<span class="companyName">${companyName}</span>`,
          )
          .replaceAll("--company-name--", companyName);
        setDefaultJobDescription(desc);
        setValue3(desc);
      }
    };
    useEffect(() => {
      if (addContactBtn === "default") {
        getJobDesccription();
      }
    }, []);
    const [allEmployees, setAllEmployees] = useState([]);
    const defaultData = {
      jobDescription: "BEHAVIORAL HEALTH TECHNICIAN",
      positionsSupervised: true,
      primaryResponsibilities: [
        "Responsible for providing behavioral health services to residents, according to",
        "Ensures the safety well-being of residents and provides a positive, supportive environment.",
        "Responsible for assisting residents in developing recovery program, treatment activities, and participates in the program development process.",
        "Performs screening tests as required accurately.",
        "Responsible for resident assessment, and maintaining documentation as required.",
        "Interacts with residents to address the behavioral aspects of their care.",
        "Provides supportive role with resident’s personal care, including necessary baths, oral hygiene, and basic house choices.",
        "Ensures linens, nutritional items and meals are made available to residents.",
        "Takes and records temperature, pulse, respiration and blood pressure with appropriate skills and competency.",
        "Ability to perform leadership role by mentoring residents about health consequences of substance abuse and the physiological effects.",
        "Assists with follow-up and events that may take place in the facility.",
        "Communicates effectively and professionally with residents, providers, case managers, medical stake holders and other staff members.",
        "Make an inform decision to communicates information necessary to coordinate care in an appropriate manner and within established guidelines.",
        "Participates in Quality Improvement plans.",
        "Pursues continuing educational opportunities for skill development.",
        "Attends all required staff meetings.",
        "Maintains a neat, clean, and professional demeanor.",
      ],
      coreCompetencies: [
        "Demonstrates knowledge of addictions and behavioral health disorders.",
        "Capable of multi-tasking, and assist counselors or therapeutic team by giving clinical support services to Residents who are suffering from substance abuse or mental irregularities.",
        "Demonstrates ability to perform screening tests and obtain vital signs accurately.",
        "Maintains detailed and accurate client documentation records that satisfies licensure, funding and accreditation requirements.",
        "Culturally competent, and aware of the impact of other individual differences on treatment and recovery.",
        "Ability to communicate effectively, and to develop, establishes, and maintains positive professional relationships and demeanor with residents, staff and members of the community.",
      ],
      minimumQualifications: [
        "No experience required, how ever one year of behavioral health experience preferred.",
        "C.P.R. and First Aid certification required. Must be twenty-one (21) years old.",
        "Valid Fingerprint Clearance Card.",
        "Must be able to read and write.",
        "Freedom of tuberculosis (TB).",
      ],
      minimumDescription:
        "Upon a successfully hiring process, my signature below indicates that I understand and agree to the duties of BEHAVIORAL HEALTH TECHNICIAN(BHT), and I have meet the stated qualifications, experience requirements, and can adequately perform duties prescribed or as stated in this job descriptions.",
      pleaseNote:
        "Job descriptions are not intended, and should not be construed, to be exhaustive lists of all responsibilities, skills and efforts. Nor are they intended to form contractual relationships between the employee and the agency. Rather, they are intended to be accurate reflections of the primary elements of a job including, but not limited to, the essential functions. ",
    };
    const [employeeId1, setEmployeeId1] = useState("");
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
      companyName: viewItem?.companyName || companyName,
    });
    const handleUpdateEmployeeData = (name, value) => {
      setEmployeeData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
    const getAllEmployees = async () => {
      const res = await getAdminUser();
      if (res.success) {
        const filteredData = res.data?.filter(
          (item) => item.userType === ROLES.EMPLOYEE,
        );
        setAllEmployees(filteredData);
      }
    };
    useEffect(() => {
      if (modalShow) {
        getAllEmployees();
      }
    }, []);
    const handleAddItem = (itemName) => {
      setEmployeeData((prevData) => ({
        ...prevData,
        [itemName]: [...prevData[itemName], ""],
      }));
    };
    const handleItemChange = (itemName, index, value) => {
      setEmployeeData((prevData) => {
        const newItems = [...prevData[itemName]];
        newItems[index] = value;
        return {
          ...prevData,
          [itemName]: newItems,
        };
      });
    };
    const postDataHandler = async (e) => {
      e.preventDefault();
      const payload = {
        employeeId: employeeId1,
        jobDescription: value,
        signers: signers.map((signer) => ({
          signerId: signer.value,
          name: signer.label,
          signature: "",
          dateSigned: "",
          signedTime: "",
        })),
      };
      const res = await addJobDescription(payload);
      if (res.success) {
        getAllnotes();
        showNotification({ message: res.message, type: "success" });
        props.onHide();
      } else {
        showNotification({ message: res.message, type: "danger" });
      }
    };
    const postDataHandler2 = async (e) => {
      e.preventDefault();
      const payload = {};
      if (editId) payload.employeeId = editId;
      if (value2) payload.jobDescription = value2;
      const res = await addJobDescription(payload);
      if (res.success) {
        showNotification({ message: res.message, type: "success" });
        getAllnotes();
        props.onHide();
      } else {
        showNotification({ message: res.message, type: "danger" });
      }
    };
    const postDataHandler3 = async (e) => {
      e.preventDefault();
      const payload = {};
      payload.employeeId = employeeId1;
      payload.jobDescription = value3;
      payload.signers = signers.map((signer) => ({
        signerId: signer.value,
        name: signer.label,
        signature: "",
        dateSigned: "",
        signedTime: "",
      }));
      const res = await addJobDescription(payload);
      if (res.success) {
        showNotification({ message: res.message, type: "success" });
        getAllnotes();
        props.onHide();
      } else {
        showNotification({ message: res.message, type: "danger" });
      }
    };
    const employeeDataChangeHandler = (e) => {
      const selectedEmployeeId = e.target.value;
      const selectedEmployee = allEmployees.find(
        (employee) => employee._id === selectedEmployeeId,
      );
      if (selectedEmployee) {
        handleUpdateEmployeeData("employeeId", selectedEmployeeId);
        handleUpdateEmployeeData("employeeInfoName", selectedEmployee.fullName);
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
    const fileChangedHandler = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        setSelectedFile(e.target.files[0]);
      }
    };
    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
      if (props.onHide) {
        props.onHide();
      }
    };
    const handleButtonClick = () => {
      fileUploadRef.current?.click();
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
              <h5 className="fw-bold mb-0">Job Description Edit</h5>
            </Modal.Header>
            <Form onSubmit={postDataHandler2}>
              <ModalBody>
                <div>
                  <Form.Group className="mb-3">
                    <ReactQuill
                      theme="snow"
                      value={value2}
                      onChange={handleChange2}
                    />
                  </Form.Group>
                  <div className="text-end">
                    {signatureFormat({
                      sign: viewItem?.employeeSignature,
                      date: viewItem?.employeeSignDate,
                      hoursFormat,
                    })}
                    {viewItem?.signers?.map(
                      (signer, i) =>
                        signer.signature && (
                          <div className="text-end" key={signer?.signerId}>
                            {signatureFormat({
                              sign: signer.signature,
                              date: signer.dateSigned,
                              time: signer.signedTime,
                              hoursFormat,
                            })}
                          </div>
                        ),
                    )}
                  </div>
                </div>
              </ModalBody>
              <Modal.Footer className="justify-content-center">
                <Button className="theme-button" type="submit">
                  SAVE
                </Button>
                <input ref={fileUploadRef} type="file" className="hidden" />
                <Button className="theme-button-outline" onClick={props.onHide}>
                  Cancel
                </Button>
                <input ref={fileUploadRef} type="file" className="hidden" />
              </Modal.Footer>
            </Form>
          </>
        ) : addContactBtn == "t" ? (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Job Description</h5>
            </Modal.Header>
            <Form onSubmit={postDataHandler}>
              <ModalBody>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Employee</Form.Label>
                  <Form.Select
                    required
                    onChange={(e) => setEmployeeId1(e.target.value)}
                  >
                    <option value={""}>Select Employee</option>
                    {allEmployees?.map((item) => {
                      return (
                        <option value={item._id} key={item._id}>
                          {item.firstName} {item.lastName}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={handleChange}
                  />
                </Form.Group>
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
          <div ref={printRef} tabIndex={0} className="outline-none">
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Job Description View</h5>
            </Modal.Header>
            <ModalBody>
              <div ref={componentRef} className="w-full m-auto">
                <h1 className="pdfTitle hidden mt-2.5"> Job Description</h1>
                <SafeHtml
                  className="viewJobDescriptionMain"
                  html={viewItem?.jobDescription
                    ?.replaceAll("undefineds", "tests")
                    ?.replaceAll("undefined", companyName)
                    ?.replace(
                      /<span class="companyName">.*?<\/span>/g,
                      `<span class="companyName">${companyName}</span>`,
                    )
                    ?.replaceAll("--company-name--", companyName)}
                />
                <div className="text-end">
                  {signatureFormat({
                    sign: viewItem?.employeeSignature,
                    date: viewItem?.employeeSignDate,
                    hoursFormat,
                  })}
                  {viewItem?.signers?.map(
                    (signer, i) =>
                      signer.signature && (
                        <div className="text-end" key={signer?.signerId}>
                          {signatureFormat({
                            sign: signer.signature,
                            date: signer.dateSigned,
                            time: signer.signedTime,
                            hoursFormat,
                          })}
                        </div>
                      ),
                  )}
                </div>
              </div>
            </ModalBody>
            <Modal.Footer className="justify-content-center">
              <Button className="theme-button" onClick={print}>
                PRINT
              </Button>
            </Modal.Footer>
          </div>
        ) : addContactBtn == "r" ? (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Job Description</h5>
            </Modal.Header>
            <Form onSubmit={postDataHandler}>
              <ModalBody>
                <div>
                  <Form.Group className="mb-3">
                    <Form.Label className="w-full font-bold">
                      Employee
                    </Form.Label>
                    <Form.Select
                      required
                      onChange={employeeDataChangeHandler}
                      aria-label="Default select example"
                    >
                      <option value={""}>Select Employee</option>
                      {allEmployees?.map((item) => {
                        return (
                          <option value={item._id} key={item._id}>
                            {item.fullName}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <ReactQuill
                      theme="snow"
                      value={value}
                      onChange={handleChange}
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
        ) : addContactBtn == "default" ? (
          <>
            <Modal.Header closeButton>
              <h5 className="fw-bold mb-0">Default Job Description</h5>
            </Modal.Header>
            <Form onSubmit={postDataHandler3}>
              <ModalBody>
                <Row>
                  <Col xs={12} sm={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Employee</Form.Label>
                      <Form.Select
                        required
                        onChange={(e) => {
                          setEmployeeId1(e.target.value);
                        }}
                        aria-label="Default select example"
                      >
                        <option value={""}>Select Employee</option>
                        {allEmployees?.map((item) => {
                          return (
                            <option value={item._id} key={item._id}>
                              {item.firstName} {item.lastName}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={12}>
                    <Form.Label className="fw-bold">Employee Desc</Form.Label>
                    <ReactQuill
                      theme="snow"
                      value={value3}
                      onChange={handleChange3}
                    />
                  </Col>
                </Row>
              </ModalBody>
              <Modal.Footer className="justify-content-center">
                <Button className="theme-button" type="submit">
                  SAVE
                </Button>

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
        fetchHandler={getAllnotes}
        onDelete={({ additionalFunctions }) =>
          adminDashboardService.jobDescription.remove({
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
                    className="max-w-[20px] max-h-[20px]"
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
                  className="bg-[#1A9FB2] border-none py-2 px[5.5rem]"
                >
                  ASSIGN PATIENT
                </Button>
              </p>
            </p>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      <NavWrapper title="Job Description" isArrow={true} />
      <Container>
        <Row className="mt-3">
          <Col xs={12} md={6} lg={4}>
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
          <Col xs={12} md={6} lg={8} className="text-end">
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
            <Button
              onClick={() => {
                setAddContactBtn("default");
                setModalShow(true);
              }}
              variant="primary"
              className="theme-button ms-2"
            >
              DEFAULT
            </Button>
          </Col>
        </Row>

        {response?.docs?.length === 0 ? (
          <NoFound />
        ) : (
          <Table responsive bordered className="mt-2">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {response &&
                response?.docs?.length > 0 &&
                response?.docs?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{fetchPaitentName(item.employeeData)}</td>
                      <td>
                        <div className="icon-joiner">
                          {" "}
                          <Link
                            className="view-btn"
                            onClick={() => {
                              setViewItem(item);
                              setAddContactBtn("v");
                              setModalShow(true);
                            }}
                          >
                            <FaEye />
                          </Link>
                          <Link
                            className="edit-btn"
                            onClick={() => {
                              setViewItem(item);
                              setEditId(item.employeeData._id);
                              setEmployeeName(item.employeeInfoName);
                              setAddContactBtn("f");
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
  Wcomponenet: JobDescription,
});
