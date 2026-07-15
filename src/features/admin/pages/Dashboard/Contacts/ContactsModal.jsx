import { useEffect, useState } from "react";
import { Button, Row, Col, Form, ModalBody } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { defaultProfileIcon } from "@/assets/index";
import { RiDeleteBin5Fill } from "react-icons/ri";
import ResidentDetailForm from "../../../components/form/ResidentDetailForm";
import {
  getAdminUser,
  assignPatientToGuardian,
  assignEmployeesToPatient,
  removeEmployeeFromPatient,
  createAdminUser,
} from "@/features/shared/services";
import DatePicker from "react-datepicker";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import MultiSelectFacility from "@/features/shared/ui/Search/MultiSelectFacility";
import { ROLES } from "@/features/shared/constants";
import { showNotification, logger } from "@/utils";
import {
  EMPLOYEE_ARRAY,
  INTAKE_ARRAY,
  CONTACT_ARRAY,
  DOCUMENT_ARRAY,
  MEDICAL_ARRAY,
  CALENDAR_ARRAY,
  CLINICAL_ARRAY,
  INCIDENT_ARRAY,
  REASSESSMENT_ARRAY,
  EMPLOYEE_TYPE_OPTION,
  PATIENT_TYPE_OPTION,
} from "./contactsConstants";

const ContactsModal = ({
  show,
  onHide,
  addContactBtn,
  params1,
  assignerValue,
  assignerValueResident,
  contactData,
  setModalShow,
  setShow,
  getAllContacts,
  setFilterApplied,
  setFilteredValue,
  setParams1,
  facilityList,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [userType, setUserType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [dob, setDob] = useState("");
  const [admitDate, setAdmitDate] = useState("");
  const [psychiatricProvider, setPsychiatricProvider] = useState("");
  const [pcpProvider, setPcpProvider] = useState("");
  const [diet, setDiet] = useState("");
  const [fluidRestriction, setFluidRestriction] = useState("");
  const [allergies, setAllergies] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [residentList, setResidentList] = useState([]);
  const [assigners, setAssigners] = useState([]);
  const [gender, setGender] = useState("");
  const [facilityId, setFacilityId] = useState("");
  const [selectedFacility, setSelectedFacility] = useState([]);
  const [password, setPassword] = useState("");
  const [accountTypeCreate, setAccountTypeCreate] = useState("");
  const [params, setParams] = useState({
    userType: "",
    permissions: [],
    accountTypeVal: "",
    isActiveUser: "",
  });
  const [employeeInfo, setEmployeeInfo] = useState();
  const [intake, setIntake] = useState();
  const [contact, setContact] = useState();
  const [document, setDocument] = useState();
  const [medical, setMedical] = useState();
  const [calendar, setCalendar] = useState();
  const [clinical, setClinical] = useState();
  const [incident, setIncident] = useState(false);
  const [reassessmentCategory, setReassessmentCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const getAllEmployees = async () => {
    const res = await getAdminUser();
    if (res.success) {
      const filteredData = res.data?.filter(
        (item) => item.userType === ROLES.EMPLOYEE,
      );
      const filteredDataResident = res.data?.filter(
        (item) => item.userType === ROLES.PATIENT,
      );
      setEmployeeList(filteredData);
      setResidentList(filteredDataResident);
    }
  };
  useEffect(() => {
    if (show) getAllEmployees();
  }, [show]);

  // New permissons

  const [permissions, setPermissions] = useState({
    view: "",
    edit: "",
    delete: "",
  });
  const [checkboxValues, setCheckboxValues] = useState({
    editEmployee: false,
    deleteEmployee: false,
    editIntake: false,
    deleteIntake: false,
    editContact: false,
    deleteContact: false,
    editDocument: false,
    deleteDocument: false,
    editMedical: false,
    deleteMedical: false,
    editCalendar: false,
    deleteCalendar: false,
    editClinical: false,
    deleteClinical: false,
    editIncident: false,
    deleteIncident: false,
    co: false,
    inr: false,
    PI: false,
    offl: false,
    app: false,
    f23: false,
    lrc1031a: false,
    jd: false,
    rc: false,
    fw4: false,
    aps: false,
    fw9: false,
    i9: false,
    onsfov: false,
    st: false,
    ic: false,
    asam: false,
    fprt: false,
    et: false,
    tr: false,
    staffsch: false,
    timesheet: false,
    perf: false,
    etracking: false,
    tc: false,
    binf: false,
    pn: false,
    discharge: false,
    bhpn: false,
    dp: false,
    ron: false,
    asamc: false,
    sn: false,
    spn: false,
    tn: false,
    ari: false,
    aschedule: false,
    cn: false,
    ml: false,
    rt: false,
    mppr: false,
    ft: false,
    dtf: false,
    iass: false,
    nass: false,
    tp: false,
    fs: false,
    sp: false,
    ri: false,
    rv: false,
    em: false,
    mars: false,
    mr: false,
    mc: false,
    ms: false,
    rmt: false,
    icm: false,
    prn: false,
    ba: false,
    va: false,
    ma: false,
    ahis: false,
    cf: false,
    df: false,
    uf: false,
    pia: false,
    ptp: false,
    psp: false,
    pna: false,
    pfs: false,
    pri: false,
    pdischarge: false,
    psn: false,
    pa: false,
    pcm: false,
    pprn: false,
    prmt: false,
    pmars: false,
    papp: false,
    pbhpn: false,
    pdp: false,
    pasamc: false,
    pron: false,
  });
  const updatePermissionValue = (values, permissionKey, keysArray) => {
    const updatedView = Object.keys(values)
      .filter(
        (key) =>
          key !== "edit" &&
          key !== "delete" &&
          key !== "editEmployee" &&
          key !== "deleteEmployee" &&
          key !== "editIntake" &&
          key !== "deleteIntake" &&
          key !== "editContact" &&
          key !== "deleteContact" &&
          key !== "editDocument" &&
          key !== "deleteDocument" &&
          key !== "editCalendar" &&
          key !== "deleteCalendar" &&
          key !== "editClinical" &&
          key !== "deleteClinical" &&
          key !== "editIncident" &&
          key !== "deleteIncident" &&
          key !== "editMedical" &&
          key !== "deleteMedical" &&
          key !== "editReassessment" &&
          key !== "deleteReassessment" &&
          key !==
            `edit${permissionKey || "Employee" || "Intake" || "Contact" || "Document" || "Calendar" || "Clinical" || "Incident" || "Medical"}` &&
          key !==
            `delete${permissionKey || "Employee" || "Intake" || "Contact" || "Document" || "Calendar" || "Clinical" || "Incident" || "Medical"}` &&
          values[key],
      )
      .join(":");
    setPermissions((prevPermissions) => {
      let updatedEdit = prevPermissions.edit
        ? prevPermissions.edit.split(":")
        : [];
      let updatedDelete = prevPermissions.delete
        ? prevPermissions.delete.split(":")
        : [];
      // **New Condition: Remove keysArray values if editIncident/deleteIncident is false**
      if (!values.editEmployee) {
        updatedEdit = updatedEdit.filter((key) => !keysArray?.includes(key));
      }
      if (!values.deleteEmployee) {
        updatedDelete = updatedDelete.filter(
          (key) => !keysArray?.includes(key),
        );
      }
      if (!values.editIntake) {
        updatedEdit = updatedEdit.filter((key) => !keysArray?.includes(key));
      }
      if (!values.deleteIntake) {
        updatedDelete = updatedDelete.filter(
          (key) => !keysArray?.includes(key),
        );
      }
      if (!values.editContact) {
        updatedEdit = updatedEdit.filter((key) => !keysArray?.includes(key));
      }
      if (!values.deleteContact) {
        updatedDelete = updatedDelete.filter(
          (key) => !keysArray?.includes(key),
        );
      }
      if (!values.editDocument) {
        updatedEdit = updatedEdit.filter((key) => !keysArray?.includes(key));
      }
      if (!values.deleteDocument) {
        updatedDelete = updatedDelete.filter(
          (key) => !keysArray?.includes(key),
        );
      }
      if (!values.editCalendar) {
        updatedEdit = updatedEdit.filter((key) => !keysArray?.includes(key));
      }
      if (!values.deleteCalendar) {
        updatedDelete = updatedDelete.filter(
          (key) => !keysArray?.includes(key),
        );
      }
      if (!values.editClinical) {
        updatedEdit = updatedEdit.filter((key) => !keysArray?.includes(key));
      }
      if (!values.deleteClinical) {
        updatedDelete = updatedDelete.filter(
          (key) => !keysArray?.includes(key),
        );
      }
      if (!values.editIncident) {
        updatedEdit = updatedEdit.filter((key) => !keysArray?.includes(key));
      }
      if (!values.deleteIncident) {
        updatedDelete = updatedDelete.filter(
          (key) => !keysArray?.includes(key),
        );
      }
      if (!values.editMedical) {
        updatedEdit = updatedEdit.filter((key) => !keysArray?.includes(key));
      }
      if (!values.deleteMedical) {
        updatedDelete = updatedDelete.filter(
          (key) => !keysArray?.includes(key),
        );
      }
      if (!values.editReassessment) {
        updatedEdit = updatedEdit.filter((key) => !keysArray?.includes(key));
      }
      const filteredKeysArray = keysArray?.filter((key) =>
        updatedView?.split(":").includes(key),
      );
      const newUpdateEditValue = updatedEdit?.filter(
        (key) => !keysArray?.includes(key),
      );
      const newUpdateDeleteValue = updatedDelete?.filter(
        (key) => !keysArray?.includes(key),
      );
      if (values[`edit${permissionKey}`]) {
        updatedEdit = [
          ...new Set([...newUpdateEditValue, ...filteredKeysArray]),
        ];
      } else {
        updatedEdit = updatedEdit?.filter(
          (k) => !filteredKeysArray?.includes(k),
        );
      }
      if (values[`delete${permissionKey}`]) {
        updatedDelete = [
          ...new Set([...newUpdateDeleteValue, ...filteredKeysArray]),
        ];
      } else {
        updatedDelete = updatedDelete?.filter(
          (k) => !filteredKeysArray?.includes(k),
        );
      }
      return {
        ...prevPermissions,
        view: updatedView,
        edit: updatedEdit.join(":"),
        delete: updatedDelete.join(":"),
      };
    });
  };
  const handleCheckboxChange = (
    e,
    checkboxKey,
    keysArray,
    key,
    permissionKey,
  ) => {
    const { checked } = e.target;
    setCheckboxValues((prevValues) => {
      const updatedValues = {
        ...prevValues,
        [checkboxKey]: checked,
      };

      // Check if all individual checkboxes are selected
      const allChecked = keysArray?.every(
        (checkboxKey) => updatedValues[checkboxKey],
      );
      const allUnChecked = keysArray?.every(
        (checkboxKey) => !updatedValues[checkboxKey],
      );
      if (key === "employeeInfo") {
        if (allUnChecked) {
          updatedValues.editEmployee = false;
          updatedValues.deleteEmployee = false;
        }
        setEmployeeInfo(allChecked);
      } else if (key === "intake") {
        if (allUnChecked) {
          updatedValues.editIntake = false;
          updatedValues.deleteIntake = false;
        }
        setIntake(allChecked);
      } else if (key === "contact") {
        if (allUnChecked) {
          updatedValues.editContact = false;
          updatedValues.deleteContact = false;
        }
        setContact(allChecked);
      } else if (key === "document") {
        if (allUnChecked) {
          updatedValues.editDocument = false;
          updatedValues.deleteDocument = false;
        }
        setDocument(allChecked);
      } else if (key === "medical") {
        if (allUnChecked) {
          updatedValues.editMedical = false;
          updatedValues.deleteMedical = false;
        }
        setMedical(allChecked);
      } else if (key === "calendar") {
        if (allUnChecked) {
          updatedValues.editCalendar = false;
          updatedValues.deleteCalendar = false;
        }
        setCalendar(allChecked);
      } else if (key === "clinical") {
        if (allUnChecked) {
          updatedValues.editClinical = false;
          updatedValues.deleteClinical = false;
        }
        setClinical(allChecked);
      } else if (key === "incident") {
        if (allUnChecked) {
          updatedValues.editIncident = false;
          updatedValues.deleteIncident = false;
        }
        setIncident(allChecked);
      } else if (key === "reassessmentCategory") {
        if (allUnChecked) {
          updatedValues.editReassessment = false;
        }
        setReassessmentCategory(allChecked);
      }
      updatePermissionValue(updatedValues, permissionKey, keysArray);
      return updatedValues;
    });
  };

  // Handler for toggling select/deselect for specific checkboxes without altering other keys
  const handleSelectAllToggle = (e, field) => {
    const { checked } = e.target;
    setCheckboxValues((prevValues) => {
      const updatedValues = {
        ...prevValues,
        ...field.reduce((acc, key) => {
          acc[key] = checked;
          return acc;
        }, {}),
      };
      updatePermissionValue(updatedValues);
      return updatedValues;
    });
  };
  const handleToggle = (checked, setValue, keysArray, editKey, deletekey) => {
    setValue(checked);
    if (!checked) {
      setCheckboxValues((prevValues) => ({
        ...prevValues,
        [editKey]: false,
        [deletekey]: false,
      }));
    }
    setPermissions((prevPermissions) => {
      let updatedEdit = prevPermissions.edit
        ? prevPermissions.edit.split(":")
        : [];
      let updatedDelete = prevPermissions.delete
        ? prevPermissions.delete.split(":")
        : [];
      const newUpdateEditValue = updatedEdit?.filter(
        (key) => !keysArray?.includes(key),
      );
      const newUpdateDeleteValue = updatedDelete?.filter(
        (key) => !keysArray?.includes(key),
      );
      return {
        ...prevPermissions,
        edit: newUpdateEditValue.join(":"),
        delete: newUpdateDeleteValue.join(":"),
      };
    });
  };
  useEffect(() => {
    if (!show) return;
    setParams(params1);
    if (addContactBtn === "assign") {
      setAssigners(assignerValue);
    }
    if (addContactBtn === "assignResident") {
      setAssigners(assignerValueResident);
    }
  }, [show, addContactBtn, params1, assignerValue, assignerValueResident]);
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
    const file = e.target.files[0];
    if (file) {
      const validFileTypes = ["image/jpeg", "image/png"];
      if (!validFileTypes.includes(file.type)) {
        showNotification({
          message: "Please select a valid JPG or PNG image.",
          type: "default",
        });
        return;
      }
      const maxSizeInBytes = 2 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        showNotification({
          message: "File size should be less than 2 MB.",
          type: "default",
        });
        return;
      }
    }
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const formData = new FormData();
    if (firstName) {
      formData.append("firstName", firstName);
    }
    if (lastName) {
      formData.append("lastName", lastName);
    }
    if (email) formData.append("email", email);
    if (phone) formData.append("mobileNumber", phone);
    if (address && userType !== ROLES.PATIENT)
      formData.append("address", address);
    if (userType) formData.append("userType", userType);
    if (accountTypeCreate) formData.append("accountType", accountTypeCreate);
    if (ahcccsId) formData.append("ahcccsId", ahcccsId);
    if (diagnosis) formData.append("diagnosis", diagnosis);
    if (dob) formData.append("dateOfBirth", dob);
    if (title) formData.append("position", title);
    if (userType === ROLES.EMPLOYEE) {
      if (selectedFacility.length)
        selectedFacility.forEach(({ value }) =>
          formData.append("facilityId", value),
        );
    }
    formData.append("userPermissions", JSON.stringify(permissions));
    formData.append("dispatchResetLink", password);
    if (userType === ROLES.PATIENT) {
      if (admitDate) formData.append("admitDate", admitDate);
      if (address) formData.append("location", address);
      if (psychiatricProvider)
        formData.append("psychiatricProvider", psychiatricProvider);
      if (pcpProvider) formData.append("PCPProvider", pcpProvider);
      if (diet) formData.append("Diet", diet);
      if (fluidRestriction)
        formData.append("fluidRestrictions", fluidRestriction);
      if (allergies) formData.append("allergies", allergies);
      if (gender) formData.append("gender", gender);
      if (facilityId) {
        formData.append("facilityId[0]", facilityId);
        const selectedFac = facilityList?.data?.find(
          (f) => f._id === facilityId,
        );
        if (selectedFac?.location) {
          formData.append("facilityAddress", selectedFac.location);
        }
      }
    }
    if (selectedFile) formData.append("image", selectedFile);
    try {
      createAdminUser(formData)
        .then((res) => {
          setLoading(false);
          if (!res.success) {
            showNotification({
              message: res.message || "Failed to create user",
              type: "danger",
            });
            return;
          }
          showNotification({ message: res.message, type: "success" });
          getAllContacts();
          onHide();
        })
        .catch((err) => {
          setLoading(false);
          showNotification({
            message: err.response?.data?.message,
            type: "danger",
          });
        });
    } catch (error) {
      setLoading(false);
      showNotification({ message: error.res?.message, type: "danger" });
    }
  };
  const handleUserTypeChange = (userType) => {
    if (userType)
      setParams((prevParams) => ({
        ...prevParams,
        userType: userType,
      }));
    else
      setParams((prevParams) => ({
        ...prevParams,
        userType: "",
      }));
  };
  const handleAccountTypeChange = (accountTypeVal) => {
    if (accountTypeVal)
      setParams((prevParams) => ({
        ...prevParams,
        accountTypeVal: accountTypeVal,
      }));
    else
      setParams((prevParams) => ({
        ...prevParams,
        accountTypeVal: "",
      }));
  };
  const handleIsActveChange = (isActiveUser) => {
    if (isActiveUser)
      setParams((prevParams) => ({
        ...prevParams,
        isActiveUser: isActiveUser,
      }));
    else
      setParams((prevParams) => ({
        ...prevParams,
        isActiveUser: "",
      }));
  };
  const handleApplyFilter = () => {
    setFilterApplied(true);
    setFilteredValue(params);
    setParams1(params);
    onHide();
  };
  const handleAssignResident = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const assignerIds = assigners.map((item) => item?.value);
    try {
      const res = await assignPatientToGuardian(contactData?._id, {
        patientIds: assignerIds,
      });
      setLoading(false);
      if (!res.success) {
        showNotification({ message: res.message, type: "danger" });
        return;
      }
      setModalShow(false);
      setShow(false);
      getAllContacts();
      showNotification({ message: res.message, type: "success" });
      onHide();
    } catch (error) {
      setLoading(false);
      logger.error(error);
    }
  };
  const handleRemoveResident = async (id, user) => {
    const updatedAssigners = assigners
      .filter((item) => item.value !== user?._id)
      ?.map((item) => item?.value);
    try {
      const res = await assignPatientToGuardian(contactData?._id, {
        patientIds: updatedAssigners,
      });
      if (!res.success) {
        showNotification({ message: res.message, type: "danger" });
        return;
      }
      showNotification({ message: res.message, type: "success" });
      getAllContacts();
      setShow(false);
      onHide();
    } catch (error) {
      logger.error(error);
    }
  };
  const handleAssign = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const assignerIds = assigners.map((item) => item?.value);
    try {
      const res = await assignEmployeesToPatient(contactData?._id, {
        employeesId: assignerIds,
      });
      setLoading(false);
      if (!res.success) {
        showNotification({ message: res.message, type: "danger" });
        return;
      }
      setModalShow(false);
      setShow(false);
      getAllContacts();
      showNotification({ message: res.message, type: "success" });
      onHide();
    } catch (error) {
      setLoading(false);
      logger.error(error);
    }
  };
  const handleRemoveEmployee = async (id, user) => {
    try {
      const res = await removeEmployeeFromPatient(contactData?._id, user?._id);
      if (!res.success) {
        showNotification({ message: res.message, type: "danger" });
        return;
      }
      showNotification({ message: res.message, type: "success" });
      getAllContacts();
      setShow(false);
      onHide();
    } catch (error) {
      logger.error(error);
    }
  };
  logger.debug("params====>", params);
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {addContactBtn === "filter" ? (
        <>
          <Modal.Header closeButton>
            <h5 className="fw-bold mb-0">Filter</h5>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col xs={12} md={4}>
                <div className="radio-inline">
                  <Form.Check
                    inline
                    type="checkbox"
                    label="Employee"
                    onChange={() => {
                      handleUserTypeChange(
                        params?.userType === ROLES.EMPLOYEE ? "" : "Employee",
                      );
                    }}
                    checked={params?.userType === ROLES.EMPLOYEE}
                  />
                  <Form.Check
                    inline
                    type="checkbox"
                    label="Resident"
                    onChange={() =>
                      handleUserTypeChange(
                        params?.userType === ROLES.PATIENT ? "" : "Patient",
                      )
                    }
                    checked={params?.userType === ROLES.PATIENT}
                  />
                  <Form.Check
                    inline
                    type="checkbox"
                    label="Guardian"
                    onChange={() =>
                      handleUserTypeChange(
                        params?.userType === ROLES.GUARDIAN ? "" : "Guardian",
                      )
                    }
                    checked={params?.userType === ROLES.GUARDIAN}
                  />
                </div>
              </Col>
              <Col xs={12} md={4}>
                <div className="fileter-btn">
                  <Form.Check
                    inline
                    checked={params.isActiveUser === "true"}
                    onChange={() =>
                      handleIsActveChange(
                        params.isActiveUser === "true" ? "" : "true",
                      )
                    }
                    label="Active"
                  />
                  <Form.Check
                    inline
                    checked={params.isActiveUser === "false"}
                    onChange={() =>
                      handleIsActveChange(
                        params.isActiveUser === "false" ? "" : "false",
                      )
                    }
                    label="Inactive"
                  />
                </div>
              </Col>
              <Col xs={12} md={4}>
                <div className="fileter-btn">
                  <Form.Check
                    inline
                    checked={params.accountTypeVal === "regular"}
                    onChange={() =>
                      handleAccountTypeChange(
                        params?.accountTypeVal === "regular" ? "" : "regular",
                      )
                    }
                    label="Regular"
                  />
                  <Form.Check
                    inline
                    checked={params.accountTypeVal === "restricted"}
                    onChange={() =>
                      handleAccountTypeChange(
                        params?.accountTypeVal === "restricted"
                          ? ""
                          : "restricted",
                      )
                    }
                    label="Restricted"
                  />
                  <Form.Check
                    inline
                    checked={params.accountTypeVal === "adminstrator"}
                    onChange={() =>
                      handleAccountTypeChange(
                        params.accountTypeVal === "adminstrator"
                          ? ""
                          : "adminstrator",
                      )
                    }
                    label="Adminstrator"
                  />
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button className="theme-button" onClick={handleApplyFilter}>
              APPLY
            </Button>
            <Button className="theme-button-outline" onClick={onHide}>
              CANCEL
            </Button>
          </Modal.Footer>
        </>
      ) : addContactBtn === "add" ? (
        <>
          <Modal.Header closeButton>
            <h5 className="fw-bold mb-0">Add New User</h5>
          </Modal.Header>
          <Form onSubmit={submitHandler} className="margin-bottom-2">
            <ModalBody>
              <Row>
                <Col xs={12} lg="3">
                  <div className="text-center d-block">
                    <label htmlFor="fileInput">
                      <p className="flex justify-center cursor-pointer">
                        <img
                          className="w-[100px] h-[100px] rounded-full border border-[#eee] bg-[#f5f5f5] mx-auto"
                          src={
                            previewUrl?.length > 10
                              ? previewUrl
                              : defaultProfileIcon
                          }
                          alt="images"
                        />
                      </p>
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      className="hidden"
                      accept="image/*"
                      onChange={fileChangedHandler}
                    />
                  </div>
                </Col>
                <Col xs={12} lg="9">
                  <Row>
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-black font-semibold text-sm">
                          First Name: <span className="text-red-600">*</span>
                        </Form.Label>
                        <Form.Control
                          required
                          onChange={(e) => setFirstName(e.target.value)}
                          type="text"
                          placeholder="Enter First Name"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-black font-semibold text-sm">
                          Last Name: <span className="text-red-600">*</span>
                        </Form.Label>
                        <Form.Control
                          required
                          onChange={(e) => setLastName(e.target.value)}
                          type="text"
                          placeholder="Enter Last Name"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-black font-semibold text-sm">
                          Title:
                        </Form.Label>
                        <Form.Control
                          required
                          onChange={(e) => setTitle(e.target.value)}
                          type="text"
                          placeholder="Enter Title"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-black font-semibold text-sm">
                          Email:{" "}
                          {userType !== ROLES.PATIENT && (
                            <span className="text-red-600">*</span>
                          )}
                        </Form.Label>
                        <Form.Control
                          required={userType !== ROLES.PATIENT}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          placeholder="Enter Email"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-black font-semibold text-sm">
                          {userType === ROLES.PATIENT
                            ? "Facility Address:"
                            : "Address:"}
                        </Form.Label>
                        <Form.Control
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          type="text"
                          placeholder="Enter Address"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group className="mb-3 d-flex flex-column">
                        <Form.Label className="text-black font-semibold text-sm">
                          Date of Birth:
                        </Form.Label>

                        <DatePicker
                          selected={formatDateToMMDDYYYY(dob)}
                          onChange={(selectedDate) =>
                            setDob(selectedDate?.toDateString())
                          }
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          className="form-control"
                          highlightDates={[
                            {
                              "react-datepicker__day--highlighted-custom": [
                                dob ? formatDateToMMDDYYYY(dob) : new Date(),
                              ],
                            },
                          ]}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-black font-semibold text-sm">
                      Phone Number:
                    </Form.Label>
                    <Form.Control
                      onChange={(e) => setPhone(e.target.value?.trim())}
                      type="text"
                      placeholder="Enter Number"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Type:</Form.Label>
                    <Form.Select
                      required
                      onChange={(e) => setUserType(e.target.value)}
                    >
                      <option value={""}>Select </option>
                      <option className="text-[#0C5C75]" value="Employee">
                        EMPLOYEE
                      </option>
                      <option className="text-[#0C5C75]" value="Patient">
                        RESIDENT
                      </option>
                      <option className="text-[#0C5C75]" value="Guardian">
                        GUARDIAN
                      </option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                {userType === ROLES.EMPLOYEE && (
                  <Col xs={12} md={12}>
                    <Form.Label className="fw-bold">Select Facility</Form.Label>
                    <MultiSelectFacility
                      data={facilityList.data}
                      setValue={(val) => {
                        setSelectedFacility(val);
                        if (val && val.length > 0) {
                          const selectedFac = facilityList?.data?.find(
                            (f) => f._id === val[0].value,
                          );
                          if (selectedFac?.location) {
                            setAddress(selectedFac.location);
                          }
                        }
                      }}
                      value={selectedFacility}
                    />
                  </Col>
                )}
              </Row>
              {userType === ROLES.PATIENT && (
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Gender</Form.Label>
                      <Form.Select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Transgender">Transgender</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Facility</Form.Label>
                      <Form.Select
                        value={facilityId}
                        onChange={(e) => {
                          setFacilityId(e.target.value);
                          const selectedFac = facilityList?.data?.find(
                            (f) => f._id === e.target.value,
                          );
                          if (selectedFac?.location) {
                            setAddress(selectedFac.location);
                          }
                        }}
                      >
                        <option value="" disabled>
                          Select facility
                        </option>
                        {facilityList?.data?.map((facility) => (
                          <option key={facility._id} value={facility._id}>
                            {`${facility?.name}`}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              )}
              <Row>
                <Col xs={12}>
                  {userType === ROLES.PATIENT && (
                    <ResidentDetailForm
                      admitDate={admitDate}
                      setAdmitDate={setAdmitDate}
                      diet={diet}
                      setDiet={setDiet}
                      fluidRestriction={fluidRestriction}
                      setFluidRestriction={setFluidRestriction}
                      ahcccsId={ahcccsId}
                      setAhcccsId={setAhcccsId}
                      diagnosis={diagnosis}
                      setDiagnosis={setDiagnosis}
                    />
                  )}
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Password:</Form.Label>

                    <Form.Check
                      type="checkbox"
                      label="Password reset (Link sent to their email)"
                      checked={password}
                      onChange={(e) => setPassword(e.target.checked)} // Pass true or false
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Account type :</Form.Label>
                    <Form.Select
                      required
                      onChange={(e) => {
                        setAccountTypeCreate(e.target.value);
                      }}
                      value={accountTypeCreate}
                    >
                      <option value="">Select </option>

                      {(userType === ROLES.PATIENT ||
                      userType === ROLES.GUARDIAN
                        ? PATIENT_TYPE_OPTION
                        : EMPLOYEE_TYPE_OPTION
                      ).map((i) => (
                        <option
                          className="text-[#0C5C75]"
                          value={i.value}
                          key={i._id}
                        >
                          {i.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              {accountTypeCreate !== "adminstrator" && (
                <Row>
                  <Col xs={12} md={12}>
                    <Form.Group>
                      <Form.Label className="fw-bold w-100">
                        Permissions :
                      </Form.Label>
                    </Form.Group>
                    {userType === ROLES.PATIENT ||
                    userType === ROLES.GUARDIAN ? (
                      <>
                        <Row>
                          <Col xs={12} md={6}>
                            <Form.Group className="mb-3">
                              <Form.Check
                                checked={checkboxValues.pia}
                                onChange={(e) => handleCheckboxChange(e, "pia")}
                                label="Initial Assessment"
                              />
                              <Form.Check
                                checked={checkboxValues.ptp}
                                onChange={(e) => handleCheckboxChange(e, "ptp")}
                                label="Behavioral Health Treatment Plan"
                              />
                              <Form.Check
                                checked={checkboxValues.psp}
                                onChange={(e) => handleCheckboxChange(e, "psp")}
                                label="Safety Plan"
                              />
                              <Form.Check
                                checked={checkboxValues.pna}
                                onChange={(e) => handleCheckboxChange(e, "pna")}
                                label="Nursing Assessment"
                              />
                              <Form.Check
                                checked={checkboxValues.pfs}
                                onChange={(e) => handleCheckboxChange(e, "pfs")}
                                label="Face Sheet"
                              />
                              <Form.Check
                                checked={checkboxValues.pri}
                                onChange={(e) => handleCheckboxChange(e, "pri")}
                                label="Resident's Intake"
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6}>
                            <Form.Group className="mb-3">
                              <Form.Check
                                checked={checkboxValues.pdischarge}
                                onChange={(e) =>
                                  handleCheckboxChange(e, "pdischarge")
                                }
                                label="Discharge"
                              />
                              <Form.Check
                                checked={checkboxValues.psn}
                                onChange={(e) => handleCheckboxChange(e, "psn")}
                                label="ART Meetings"
                              />
                              <Form.Check
                                checked={checkboxValues.pa}
                                onChange={(e) => handleCheckboxChange(e, "pa")}
                                label="Authorization"
                              />
                              <Form.Check
                                checked={checkboxValues.pcm}
                                onChange={(e) => handleCheckboxChange(e, "pcm")}
                                label="Consent Medicaton"
                              />
                              <Form.Check
                                checked={checkboxValues.pprn}
                                onChange={(e) =>
                                  handleCheckboxChange(e, "pprn")
                                }
                                label="PRN"
                              />
                              <Form.Check
                                checked={checkboxValues.prmt}
                                onChange={(e) =>
                                  handleCheckboxChange(e, "prmt")
                                }
                                label="Refusal Medical Treatment"
                              />
                              <Form.Check
                                checked={checkboxValues.pmars}
                                onChange={(e) =>
                                  handleCheckboxChange(e, "pmars")
                                }
                                label="Mars"
                              />
                              <Form.Check
                                checked={checkboxValues.papp}
                                onChange={(e) =>
                                  handleCheckboxChange(e, "papp")
                                }
                                label="TB Risk Assessment"
                              />
                              <Form.Check
                                checked={checkboxValues.pbhpn}
                                onChange={(e) =>
                                  handleCheckboxChange(e, "pbhpn")
                                }
                                label="BHP Progress Notes"
                              />
                              <Form.Check
                                checked={checkboxValues.pdp}
                                onChange={(e) => handleCheckboxChange(e, "pdp")}
                                label="Discharge Planning"
                              />
                              <Form.Check
                                checked={checkboxValues.pasamc}
                                onChange={(e) =>
                                  handleCheckboxChange(e, "pasamc")
                                }
                                label="ASAM Criteria Checklist for Assessment"
                              />
                              <Form.Check
                                checked={checkboxValues.pron}
                                onChange={(e) =>
                                  handleCheckboxChange(e, "pron")
                                }
                                label="Re-Certification of Need (RON)"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </>
                    ) : (
                      <>
                        <Row>
                          <Col xs={12} md={12}>
                            <div className="d-flex flex-row mt-3 mb-2">
                              <Form.Check
                                checked={incident}
                                className="font-bolder"
                                onChange={(e) => {
                                  handleSelectAllToggle(e, INCIDENT_ARRAY);
                                  handleToggle(
                                    e.target.checked,
                                    setIncident,
                                    INCIDENT_ARRAY,
                                    "editIncident",
                                    "deleteIncident",
                                  );
                                }}
                                label="Organization"
                              />
                              <Form.Check
                                checked={checkboxValues.editIncident}
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    e,
                                    "editIncident",
                                    INCIDENT_ARRAY,
                                    "incident",
                                    "Incident",
                                  )
                                }
                                className="mx-2"
                                label="Edit Incident"
                              />
                              <Form.Check
                                checked={checkboxValues.deleteIncident}
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    e,
                                    "deleteIncident",
                                    INCIDENT_ARRAY,
                                    "incident",
                                    "Incident",
                                  )
                                }
                                label="Delete Incident"
                              />
                            </div>
                            <Row>
                              <Col xs={12} md={12} lg={3}>
                                <Form.Group>
                                  <Form.Check
                                    checked={checkboxValues.inr}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "inr",
                                        INCIDENT_ARRAY,
                                        "incident",
                                        "Incident",
                                      )
                                    }
                                    label="Incident Report Form"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            <div className="d-flex flex-row mt-3 mb-2">
                              <Form.Check
                                checked={reassessmentCategory || false}
                                className="fw-bold font-bolder"
                                onChange={(e) => {
                                  handleSelectAllToggle(e, REASSESSMENT_ARRAY);
                                  handleToggle(
                                    e.target.checked,
                                    setReassessmentCategory,
                                    REASSESSMENT_ARRAY,
                                    "editReassessment",
                                    null,
                                  );
                                }}
                                label="Re-Assessment"
                              />
                              <Form.Check
                                checked={checkboxValues.editReassessment}
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    e,
                                    "editReassessment",
                                    REASSESSMENT_ARRAY,
                                    "reassessmentCategory",
                                    "Reassessment",
                                  )
                                }
                                className="mx-2"
                                label="Edit Re-Assessment"
                              />
                            </div>
                            <Row>
                              <Col xs={12} md={12} lg={3}>
                                <Form.Group>
                                  <Form.Check
                                    checked={checkboxValues.reassessment}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "reassessment",
                                        REASSESSMENT_ARRAY,
                                        "reassessmentCategory",
                                        "Reassessment",
                                      )
                                    }
                                    label="Re-Assessment Form"
                                  />
                                </Form.Group>
                              </Col>

                              <div className="d-flex flex-row mt-3 mb-2">
                                <Form.Check
                                  inline
                                  className="fw-bold font-bolder"
                                  checked={employeeInfo}
                                  onChange={(e) => {
                                    handleSelectAllToggle(e, EMPLOYEE_ARRAY);
                                    handleToggle(
                                      e.target.checked,
                                      setEmployeeInfo,
                                      EMPLOYEE_ARRAY,
                                      "editEmployee",
                                      "deleteEmployee",
                                    );
                                  }}
                                  label="Employee Information All Forms "
                                />
                                <Form.Check
                                  inline
                                  checked={checkboxValues.editEmployee}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      e,
                                      "editEmployee",
                                      EMPLOYEE_ARRAY,
                                      "employeeInfo",
                                      "Employee",
                                    )
                                  }
                                  className="mx-2"
                                  label="Edit Employees"
                                />
                                <Form.Check
                                  inline
                                  checked={checkboxValues.deleteEmployee}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      e,
                                      "deleteEmployee",
                                      EMPLOYEE_ARRAY,
                                      "employeeInfo",
                                      "Employee",
                                    )
                                  }
                                  label="Delete Employees"
                                />
                              </div>
                              <Col xs={12} md={12} lg={6}>
                                <Form.Group>
                                  <Form.Check
                                    checked={checkboxValues.PI}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "PI",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Personal Information"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.offl}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "offl",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Offer Letter"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.app}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "app",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="TB Risk Assessment"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.f23}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "f23",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="2023 Forms"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.lrc1031a}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "lrc1031a",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Lrc-1031a"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.jd}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "jd",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Job Description"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.rc}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "rc",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Reference Check"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={12} lg={6}>
                                <Form.Group>
                                  <Form.Check
                                    checked={checkboxValues.fw4}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "fw4",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Fw4"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.aps}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "aps",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Aps Consent"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.fw9}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "fw9",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Fw9"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.i9}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "i9",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="i-9"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.onsfov}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "onsfov",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Onsite And Facility Orientation Verification"
                                  />

                                  <Form.Check
                                    checked={checkboxValues.st}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "st",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Skill And Knowledge Training"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={12} lg={6}>
                                <Form.Group>
                                  <Form.Check
                                    checked={checkboxValues.ic}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "ic",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Infection Control"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.asam}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "asam",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Assistance With Self Administration Of Medication"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.fprt}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "fprt",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Fall Prevention And Recovery Training"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.et}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "et",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Employee Termination"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={12} lg={6}>
                                <Form.Group>
                                  <Form.Check
                                    checked={checkboxValues.tr}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "tr",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Time Off Request"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.staffsch}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "staffsch",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Staff Schedule"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.timesheet}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "timesheet",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Time Sheet"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.perf}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "perf",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Employee Performance"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.etracking}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "etracking",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Employee Tracking"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.tc}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "tc",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Tubercluosis"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.binf}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "binf",
                                        EMPLOYEE_ARRAY,
                                        "employeeInfo",
                                        "Employee",
                                      )
                                    }
                                    label="Employment Application"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} md={12}>
                            <Row>
                              <Form.Label className="font-bold">
                                Contact category form
                              </Form.Label>

                              <div className="d-flex flex-row mt-3 mb-2">
                                <Form.Check
                                  inline
                                  checked={contact}
                                  className="font-bolder"
                                  onChange={(e) => {
                                    handleSelectAllToggle(e, CONTACT_ARRAY);
                                    handleToggle(
                                      e.target.checked,
                                      setContact,
                                      CONTACT_ARRAY,
                                      "editContact",
                                      "deleteContact",
                                    );
                                  }}
                                  label="Contacts"
                                />
                                <Form.Check
                                  inline
                                  checked={checkboxValues.editContact}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      e,
                                      "editContact",
                                      CONTACT_ARRAY,
                                      "contact",
                                      "Contact",
                                    )
                                  }
                                  label="Edit Contacts"
                                />
                                <Form.Check
                                  inline
                                  checked={checkboxValues.deleteContact}
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      e,
                                      "deleteContact",
                                      CONTACT_ARRAY,
                                      "contact",
                                      "Contact",
                                    )
                                  }
                                  label="Delete Contacts"
                                />
                              </div>
                              <Col xs={12} md={12} lg={6}>
                                <Form.Group className="mb-3">
                                  <Form.Check
                                    checked={checkboxValues.pn}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "pn",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Shift Progress Note"
                                  />

                                  <Form.Check
                                    checked={checkboxValues.discharge}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "discharge",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Discharge"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.asamc}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "asamc",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="ASAM Criteria Checklist for Assessment"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.dp}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "dp",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Discharge Planning"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.ron}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "ron",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Re-Certification of Need (RON)"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.bhpn}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "bhpn",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="BHP Progress Note"
                                  />

                                  <Form.Check
                                    checked={checkboxValues.sn}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "sn",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="ART Meetings"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.spn}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "spn",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Special Notes"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.tn}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "tn",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Therapy Progress Note"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={12} lg={6}>
                                <Form.Group className="mb-3">
                                  <Form.Check
                                    checked={checkboxValues.aschedule}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "aschedule",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Acitvity Schedule"
                                  />

                                  <Form.Check
                                    checked={checkboxValues.cn}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "cn",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Contact Note"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={12} lg={6}>
                                <Form.Group className="mb-3">
                                  <Form.Check
                                    checked={checkboxValues.ml}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "ml",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Mileage Log"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.rt}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "rt",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Resident Tracking"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.mppr}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "mppr",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Manage Provider Pay Rates"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.ari}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "ari",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Authorization For Release Of Information"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={12} lg={6}>
                                <Form.Group className="mb-3">
                                  <Form.Check
                                    checked={checkboxValues.ft}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "ft",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Financial Transaction Record"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.dtf}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "dtf",
                                        CONTACT_ARRAY,
                                        "contact",
                                        "Contact",
                                      )
                                    }
                                    label="Activity Of Daily Life Tracking Form"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} md={12}>
                            <Row>
                              <Col xs={12} md={12} lg={6}>
                                <Form.Group>
                                  <div className="d-flex flex-row mt-3 mb-2">
                                    <Form.Check
                                      inline
                                      checked={intake}
                                      className="font-bolder"
                                      onChange={(e) => {
                                        handleSelectAllToggle(e, INTAKE_ARRAY);
                                        setIntake(e.target.checked);
                                        handleToggle(
                                          e.target.checked,
                                          setIntake,
                                          INTAKE_ARRAY,
                                          "editIntake",
                                          "deleteIntake",
                                        );
                                      }}
                                      label="Intake"
                                    />
                                    <Form.Check
                                      inline
                                      checked={checkboxValues.editIntake}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "editIntake",
                                          INTAKE_ARRAY,
                                          "intake",
                                          "Intake",
                                        )
                                      }
                                      label="Edit Intake"
                                    />
                                    <Form.Check
                                      inline
                                      checked={checkboxValues.deleteIntake}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "deleteIntake",
                                          INTAKE_ARRAY,
                                          "intake",
                                          "Intake",
                                        )
                                      }
                                      label="Delete Intake"
                                    />
                                  </div>
                                  <Form.Check
                                    checked={checkboxValues.iass}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "iass",
                                        INTAKE_ARRAY,
                                        "intake",
                                        "Intake",
                                      )
                                    }
                                    label="Initial Assessment"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.nass}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "nass",
                                        INTAKE_ARRAY,
                                        "intake",
                                        "Intake",
                                      )
                                    }
                                    label="Nurse Assessment"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.tp}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "tp",
                                        INTAKE_ARRAY,
                                        "intake",
                                        "Intake",
                                      )
                                    }
                                    label="Behavioral Health Treatment Plan"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.fs}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "fs",
                                        INTAKE_ARRAY,
                                        "intake",
                                        "Intake",
                                      )
                                    }
                                    label="Face Sheet"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.sp}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "sp",
                                        INTAKE_ARRAY,
                                        "intake",
                                        "Intake",
                                      )
                                    }
                                    label="Safety Plan"
                                  />
                                  <Form.Check
                                    checked={checkboxValues.ri}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "ri",
                                        INTAKE_ARRAY,
                                        "intake",
                                        "Intake",
                                      )
                                    }
                                    label="Resident Intakes"
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={12} lg={6}>
                                <Form.Group>
                                  <div className="d-flex flex-row mt-3 mb-2">
                                    <Form.Check
                                      checked={medical}
                                      className="font-bolder"
                                      onChange={(e) => {
                                        handleSelectAllToggle(e, MEDICAL_ARRAY);
                                        handleToggle(
                                          e.target.checked,
                                          setMedical,
                                          MEDICAL_ARRAY,
                                          "editMedical",
                                          "deleteMedical",
                                        );
                                      }}
                                      label="Medical"
                                    />
                                    <Form.Check
                                      checked={checkboxValues.editMedical}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "editMedical",
                                          MEDICAL_ARRAY,
                                          "medical",
                                          "Medical",
                                        )
                                      }
                                      className="mx-2"
                                      label="Edit Medical"
                                    />
                                    <Form.Check
                                      checked={checkboxValues.deleteMedical}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "deleteMedical",
                                          MEDICAL_ARRAY,
                                          "medical",
                                          "Medical",
                                        )
                                      }
                                      label="Delete Medical"
                                    />
                                  </div>
                                  <Form.Check
                                    inline
                                    checked={checkboxValues.rv}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "rv",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="Resident Vitals"
                                  />
                                  <Form.Check
                                    inline
                                    checked={checkboxValues.em}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "em",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="Resident Medication"
                                  />
                                  <Form.Check
                                    inline
                                    checked={checkboxValues.mars}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "mars",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="Mars"
                                  />
                                  <Form.Check
                                    inline
                                    checked={checkboxValues.mr}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "mr",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="Medication Reconcillation"
                                  />
                                  <Form.Check
                                    inline
                                    checked={checkboxValues.mc}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "mc",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="Medication Count"
                                  />
                                  <Form.Check
                                    inline
                                    checked={checkboxValues.ms}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "ms",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="Mental Status"
                                  />
                                  <Form.Check
                                    inline
                                    checked={checkboxValues.mc}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "rmt",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="Refusal of Medical Treatment"
                                  />
                                  <Form.Check
                                    inline
                                    checked={checkboxValues.icm}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "icm",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="Informed Consent For Medications"
                                  />
                                  <Form.Check
                                    inline
                                    checked={checkboxValues.prn}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "prn",
                                        MEDICAL_ARRAY,
                                        "medical",
                                        "Medical",
                                      )
                                    }
                                    label="Prn "
                                  />
                                </Form.Group>
                              </Col>
                              <Col xs={12} md={12} lg={12}>
                                <>
                                  <Form.Group>
                                    <div className="d-flex flex-row mt-3 mb-2">
                                      <Form.Check
                                        inline
                                        checked={calendar}
                                        className="font-bolder"
                                        onChange={(e) => {
                                          handleSelectAllToggle(
                                            e,
                                            CALENDAR_ARRAY,
                                          );
                                          handleToggle(
                                            e.target.checked,
                                            setCalendar,
                                            CALENDAR_ARRAY,
                                            "editCalendar",
                                            "deleteCalendar",
                                          );
                                        }}
                                        label="Calendar/Task"
                                      />
                                      <Form.Check
                                        inline
                                        checked={checkboxValues.editCalendar}
                                        onChange={(e) =>
                                          handleCheckboxChange(
                                            e,
                                            "editCalendar",
                                            CALENDAR_ARRAY,
                                            "calendar",
                                            "Calendar",
                                          )
                                        }
                                        className="mx-2"
                                        label="Edit Calendar"
                                      />
                                      <Form.Check
                                        inline
                                        checked={checkboxValues.deleteCalendar}
                                        onChange={(e) =>
                                          handleCheckboxChange(
                                            e,
                                            "deleteCalendar",
                                            CALENDAR_ARRAY,
                                            "calendar",
                                            "Calendar",
                                          )
                                        }
                                        label="Delete Calendar"
                                      />
                                    </div>
                                    <Form.Check
                                      inline
                                      checked={checkboxValues.ba}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "ba",
                                          CALENDAR_ARRAY,
                                          "calendar",
                                          "Calendar",
                                        )
                                      }
                                      label="Book Appointments"
                                    />
                                    <Form.Check
                                      inline
                                      checked={checkboxValues.va}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "va",
                                          CALENDAR_ARRAY,
                                          "calendar",
                                          "Calendar",
                                        )
                                      }
                                      label="Appointment Tracking log"
                                    />
                                    <Form.Check
                                      inline
                                      checked={checkboxValues.ma}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "ma",
                                          CALENDAR_ARRAY,
                                          "calendar",
                                          "Calendar",
                                        )
                                      }
                                      label="Manage Appointment"
                                    />
                                    <Form.Check
                                      inline
                                      checked={checkboxValues.ahis}
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          e,
                                          "ahis",
                                          CALENDAR_ARRAY,
                                          "calendar",
                                          "Calendar",
                                        )
                                      }
                                      label="Appointment History"
                                    />
                                  </Form.Group>
                                </>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} md={12} lg={12}>
                                <Form.Group>
                                  <div className="d-flex flex-row mt-3 mb-2">
                                    <Form.Check
                                      inline
                                      checked={document}
                                      className="font-bolder"
                                      onChange={(e) => {
                                        handleSelectAllToggle(
                                          e,
                                          DOCUMENT_ARRAY,
                                        );
                                        handleToggle(
                                          e.target.checked,
                                          setDocument,
                                          DOCUMENT_ARRAY,
                                          "editDocument",
                                          "deleteDocument",
                                        );
                                      }}
                                      label="Receipt and Upload Document"
                                    />
                                  </div>
                                  <Form.Check
                                    inline
                                    checked={checkboxValues.cf}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "cf",
                                        DOCUMENT_ARRAY,
                                        "document",
                                        "Document",
                                      )
                                    }
                                    label="Create File"
                                  />
                                  <Form.Check
                                    inline
                                    checked={checkboxValues.df}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "df",
                                        DOCUMENT_ARRAY,
                                        "document",
                                        "Document",
                                      )
                                    }
                                    label="Delete File"
                                  />
                                  <Form.Check
                                    inline
                                    checked={checkboxValues.uf}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "uf",
                                        DOCUMENT_ARRAY,
                                        "document",
                                        "Document",
                                      )
                                    }
                                    label="Upload File"
                                  />
                                </Form.Group>
                                <div className="d-flex flex-row mt-3 mb-2">
                                  <Form.Check
                                    inline
                                    checked={clinical}
                                    className="font-bolder"
                                    onChange={(e) => {
                                      handleSelectAllToggle(e, CLINICAL_ARRAY);
                                      handleToggle(
                                        e.target.checked,
                                        setClinical,
                                        CLINICAL_ARRAY,
                                        "editClinical",
                                        "deleteClinical",
                                      );
                                    }}
                                    label="Clinical"
                                  />
                                  <Form.Check
                                    inline
                                    checked={checkboxValues.editClinical}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "editClinical",
                                        CLINICAL_ARRAY,
                                        "clinical",
                                        "Clinical",
                                      )
                                    }
                                    label="Edit Clinical"
                                  />
                                  <Form.Check
                                    inline
                                    checked={checkboxValues.deleteClinical}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "deleteClinical",
                                        CLINICAL_ARRAY,
                                        "clinical",
                                        "Clinical",
                                      )
                                    }
                                    label="Delete Clinical"
                                  />
                                </div>
                                <Form.Group>
                                  <Form.Check
                                    inline
                                    checked={checkboxValues.co}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "co",
                                        CLINICAL_ARRAY,
                                        "clinical",
                                        "Clinical",
                                      )
                                    }
                                    label="Clinical Oversight"
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Col>
                </Row>
              )}
            </ModalBody>
            <Modal.Footer className="justify-content-center">
              <Button className="theme-button" type="submit" disabled={loading}>
                {loading ? "SUBMITTING..." : "SUBMIT"}
              </Button>
              <Button
                className="theme-button-outline"
                onClick={onHide}
                disabled={loading}
              >
                CANCEL
              </Button>
            </Modal.Footer>
          </Form>
        </>
      ) : addContactBtn === "assign" || addContactBtn === "assignResident" ? (
        <>
          <Modal.Header closeButton>
            <h5 className="fw-bold mb-0">
              {addContactBtn === "assignResident"
                ? "Assign Resident"
                : "Assign Employee"}
            </h5>
          </Modal.Header>
          <Form
            onSubmit={
              addContactBtn === "assignResident"
                ? handleAssignResident
                : handleAssign
            }
            className="margin-bottom-2"
          >
            <ModalBody>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold w-full">
                  {addContactBtn === "assignResident"
                    ? `Select Resident`
                    : `Select Employee`}
                </Form.Label>

                <MultiEmployee
                  onlyResident={
                    addContactBtn === "assignResident" ? true : false
                  }
                  setValue={setAssigners}
                  value={assigners}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold w-full">
                  {addContactBtn === "assignResident"
                    ? ` Assigned Resident`
                    : ` Assigned Employee`}
                </Form.Label>
                <div>
                  {addContactBtn === "assign" ? (
                    Array.isArray(contactData?.employeesId) &&
                    contactData.employeesId.length > 0 ? (
                      contactData.employeesId.map((user, index) => (
                        <>
                          <div className="flex justify-between gap-4 mb-[0.7rem]">
                            <Form.Control
                              className="margin-bottom-2"
                              key={index}
                              type="text"
                              value={
                                employeeList.find(
                                  (emp) => emp._id === user?._id,
                                )
                                  ? `${employeeList.find((emp) => emp._id === user?._id).firstName} ${employeeList.find((emp) => emp._id === user?._id).lastName}`
                                  : ""
                              }
                              disabled
                              readOnly
                            />
                            <span
                              onClick={() =>
                                handleRemoveEmployee(assigners, user)
                              }
                            >
                              <RiDeleteBin5Fill className="cursor-pointer text-[red] mt-2" />
                            </span>
                          </div>
                        </>
                      ))
                    ) : (
                      <p>No assigned employees</p>
                    )
                  ) : Array.isArray(contactData?.patientsAssigned) &&
                    contactData.patientsAssigned.length > 0 ? (
                    contactData.patientsAssigned.map((user, index) => (
                      <>
                        <div className="flex justify-between gap-4 mb-[0.7rem]">
                          <Form.Control
                            className="margin-bottom-2"
                            key={index}
                            type="text"
                            value={
                              residentList.find((emp) => emp._id === user?._id)
                                ? `${residentList.find((emp) => emp._id === user?._id).firstName} ${residentList.find((emp) => emp._id === user?._id).lastName}`
                                : ""
                            }
                            disabled
                            readOnly
                          />
                          <span
                            onClick={() =>
                              handleRemoveResident(assigners, user)
                            }
                          >
                            <RiDeleteBin5Fill className="mt-2 cursor-pointer text-[red]" />
                          </span>
                        </div>
                      </>
                    ))
                  ) : (
                    <p>No assigned residents</p>
                  )}
                </div>
              </Form.Group>
            </ModalBody>
            <Modal.Footer className="justify-content-center">
              <Button className="theme-button" type="submit" disabled={loading}>
                {loading ? "APPLYING..." : "APPLY"}
              </Button>
              <Button
                className="theme-button-outline"
                onClick={onHide}
                disabled={loading}
              >
                CANCEL
              </Button>
            </Modal.Footer>
          </Form>
        </>
      ) : null}
    </Modal>
  );
};

export default ContactsModal;
