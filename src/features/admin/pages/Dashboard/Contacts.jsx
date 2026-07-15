/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useRef, useState } from "react";
import "@/assets/styles/admin/Contacts.css";
import HOC from "@/features/shared/layout/Outer/HOC";
import {
  employeeService,
  facilityService,
  getUserById,
  updateUserStatus,
  updateAdminUser,
} from "@/features/shared/services";
import { DEFAULT_PAGE_SIZE, ROLES } from "@/features/shared/constants";
import { showNotification, logger } from "@/utils";
import { useListUsers } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import ContactsModal from "./Contacts/ContactsModal";
import ContactOffcanvas from "./Contacts/ContactOffcanvas";
import ContactsTable from "./Contacts/ContactsTable";
import {
  EMPLOYEE_ARRAY,
  INTAKE_ARRAY,
  CONTACT_ARRAY,
  DOCUMENT_ARRAY,
  MEDICAL_ARRAY,
  CALENDAR_ARRAY,
  CLINICAL_ARRAY,
  INCIDENT_ARRAY,
  DEFAULT_CHECKBOX_VALUES,
  INITIAL_CONTACT_FORM,
  INITIAL_PATIENT_FIELDS,
  INITIAL_PERMISSION_CATEGORIES,
  PERMISSION_CATEGORY_ARRAYS,
  createFieldUpdater,
  REASSESSMENT_ARRAY,
} from "./Contacts/contactsConstants";

const Contacts = () => {
  const [uiState, setUiState] = useState({
    show: false,
    modalShow: null,
    addContactBtn: false,
    modalType: "",
  });
  const [listState, setListState] = useState({
    query: "",
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
  });
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [contactId, setContactId] = useState(null);
  const [contactData, setContactData] = useState({});
  const [patientDetail, setPatientDetail] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [contactForm, setContactForm] = useState(INITIAL_CONTACT_FORM);
  const [patientFields, setPatientFields] = useState(INITIAL_PATIENT_FIELDS);
  const [assignState, setAssignState] = useState({
    assignPatientId: "",
    assignerValue: [],
    assignerValueResident: [],
  });
  const [facilityList, setFacilityList] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState([]);
  const [params1, setParams1] = useState({
    userType: "",
    permissions: [],
    accountTypeVal: "",
    isActiveUser: "true",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [filterApplied, setFilterApplied] = useState(false);
  const [filteredValue, setFilteredValue] = useState({
    isActiveUser: "true",
  });
  const [permissions, setPermissions] = useState({
    view: "",
    edit: "",
    delete: "",
  });
  const [checkboxValues, setCheckboxValues] = useState(DEFAULT_CHECKBOX_VALUES);
  const [permissionCategories, setPermissionCategories] = useState(
    INITIAL_PERMISSION_CATEGORIES,
  );
  const [image1, setImage1] = useState(null);

  const updateUiState = createFieldUpdater(setUiState);
  const updateListState = createFieldUpdater(setListState);
  const updateContactForm = createFieldUpdater(setContactForm);
  const updatePatientField = createFieldUpdater(setPatientFields);
  const updateAssignState = createFieldUpdater(setAssignState);
  const setPermissionCategory = createFieldUpdater(setPermissionCategories);

  const { show, modalShow, addContactBtn, modalType } = uiState;
  const { query, page, limit } = listState;
  const { assignerValue, assignerValueResident } = assignState;

  const setShow = (value) => updateUiState("show", value);
  const setModalShow = (value) => updateUiState("modalShow", value);
  const setAddContactBtn = (value) => updateUiState("addContactBtn", value);
  const setModalType = (value) => updateUiState("modalType", value);
  const setQuery = (value) => updateListState("query", value);
  const setPage = useCallback(
    (value) => updateListState("page", value),
    [updateListState],
  );
  const setLimit = (value) => updateListState("limit", value);
  const setAssignPatientId = (value) =>
    updateAssignState("assignPatientId", value);

  const handleClose = () => {
    setShow(false);
    setPreviewImage(null);
    updateContactForm("password", false);
  };

  const handleShow = (id) => {
    if (id) {
      setContactData({});
      setContactForm(INITIAL_CONTACT_FORM);
      setModalType("contact");
      setShow(true);
      getUserData(id);
    }
  };

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
      const allChecked = keysArray?.every((itemKey) => updatedValues[itemKey]);
      const allUnChecked = keysArray?.every(
        (itemKey) => !updatedValues[itemKey],
      );
      if (key && PERMISSION_CATEGORY_ARRAYS[key]) {
        if (allUnChecked) {
          const editKey = `edit${permissionKey}`;
          const deleteKey = `delete${permissionKey}`;
          if (updatedValues[editKey] !== undefined)
            updatedValues[editKey] = false;
          if (updatedValues[deleteKey] !== undefined)
            updatedValues[deleteKey] = false;
        }
        setPermissionCategory(key, allChecked);
      }
      updatePermissionValue(updatedValues, permissionKey, keysArray);
      return updatedValues;
    });
  };

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

  const handleToggle = (
    checked,
    categoryKey,
    keysArray,
    editKey,
    deletekey,
  ) => {
    setPermissionCategory(categoryKey, checked);
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
    fetchHandler();
  }, []);

  const fetchHandler = () => {
    facilityService.list({
      setResponse: setFacilityList,
    });
  };

  const {
    userType,
    accountTypeVal,
    isActiveUser,
    permissions: filterPermissions = [],
  } = filteredValue || {};

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    searchQuery: debouncedQuery || "",
    userType: userType || "",
    accountType: accountTypeVal || "",
    isActive: isActiveUser || "",
    ...(filterPermissions.includes("Business") && {
      permissionAdmin: true,
    }),
    ...(filterPermissions.includes("Employee") && {
      permissionEmployee: true,
    }),
    ...(filterPermissions.includes("Patient") && {
      permissionPatient: true,
    }),
    ...(filterPermissions.includes("Psychiatric Provider") && {
      permissionPsychiatricProvider: true,
    }),
    ...(filterPermissions.includes("Claims Submission") && {
      permissionClaimSubmission: true,
    }),
  });

  const { data: contactsResponse, isLoading: isLoadingContacts } = useListUsers(
    queryParams.toString(),
    {
      placeholderData: keepPreviousData,
    },
  );

  const queryClient = useQueryClient();

  const getAllContacts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.employee.all() });
  }, [queryClient]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 800);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (contactsResponse?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [contactsResponse?.docs?.length, page, setPage]);

  const getUserData = async (id) => {
    const res = await getUserById(id);
    if (res.success) {
      setPatientDetail(res.patientDetail || res.data?.patientDetail || {});
      setContactData(res.data);
    } else {
      showNotification(res);
    }
  };

  useEffect(() => {
    if (!contactData?.userPermissions?.view) return;
    setTimeout(() => {
      const viewPermissions = contactData.userPermissions.view.split(":");
      setPermissionCategories({
        employeeInfo: EMPLOYEE_ARRAY.every((item) =>
          viewPermissions.includes(item),
        ),
        intake: INTAKE_ARRAY.every((item) => viewPermissions.includes(item)),
        contact: CONTACT_ARRAY.every((item) => viewPermissions.includes(item)),
        document: DOCUMENT_ARRAY.every((item) =>
          viewPermissions.includes(item),
        ),
        medical: MEDICAL_ARRAY.every((item) => viewPermissions.includes(item)),
        calendar: CALENDAR_ARRAY.every((item) =>
          viewPermissions.includes(item),
        ),
        clinical: CLINICAL_ARRAY.every((item) =>
          viewPermissions.includes(item),
        ),
        incident: INCIDENT_ARRAY.every((item) =>
          viewPermissions.includes(item),
        ),
        reassessmentCategory: REASSESSMENT_ARRAY.every((item) =>
          viewPermissions.includes(item),
        ),
      });
    }, 0);
  }, [contactData]);

  useEffect(() => {
    if (contactData?.userPermissions) {
      const viewPermissions = contactData?.userPermissions?.view?.split(":");
      const editPermissions = contactData?.userPermissions?.edit?.split(":");
      const deletePermissions =
        contactData?.userPermissions?.delete?.split(":");

      const updatedCheckboxValues = Object.keys(DEFAULT_CHECKBOX_VALUES).reduce(
        (acc, key) => {
          acc[key] = false;
          return acc;
        },
        {},
      );
      viewPermissions?.forEach((perm) => {
        if (updatedCheckboxValues.hasOwnProperty(perm)) {
          updatedCheckboxValues[perm] = true;
        }
      });
      if (editPermissions?.some((perm) => EMPLOYEE_ARRAY?.includes(perm))) {
        updatedCheckboxValues.editEmployee = true;
      }
      if (deletePermissions?.some((perm) => EMPLOYEE_ARRAY?.includes(perm))) {
        updatedCheckboxValues.deleteEmployee = true;
      }
      if (editPermissions?.some((perm) => INTAKE_ARRAY?.includes(perm))) {
        updatedCheckboxValues.editIntake = true;
      }
      if (deletePermissions?.some((perm) => INTAKE_ARRAY?.includes(perm))) {
        updatedCheckboxValues.deleteIntake = true;
      }
      if (editPermissions?.some((perm) => CONTACT_ARRAY?.includes(perm))) {
        updatedCheckboxValues.editContact = true;
      }
      if (deletePermissions?.some((perm) => CONTACT_ARRAY.includes(perm))) {
        updatedCheckboxValues.deleteContact = true;
      }
      if (editPermissions?.some((perm) => DOCUMENT_ARRAY?.includes(perm))) {
        updatedCheckboxValues.editDocument = true;
      }
      if (deletePermissions?.some((perm) => DOCUMENT_ARRAY?.includes(perm))) {
        updatedCheckboxValues.deleteDocument = true;
      }
      if (editPermissions?.some((perm) => MEDICAL_ARRAY?.includes(perm))) {
        updatedCheckboxValues.editMedical = true;
      }
      if (deletePermissions?.some((perm) => MEDICAL_ARRAY?.includes(perm))) {
        updatedCheckboxValues.deleteMedical = true;
      }
      if (editPermissions?.some((perm) => CALENDAR_ARRAY?.includes(perm))) {
        updatedCheckboxValues.editCalendar = true;
      }
      if (deletePermissions?.some((perm) => CALENDAR_ARRAY?.includes(perm))) {
        updatedCheckboxValues.deleteCalendar = true;
      }
      if (editPermissions?.some((perm) => CLINICAL_ARRAY?.includes(perm))) {
        updatedCheckboxValues.editClinical = true;
      }
      if (deletePermissions?.some((perm) => CLINICAL_ARRAY?.includes(perm))) {
        updatedCheckboxValues.deleteClinical = true;
      }
      if (editPermissions?.some((perm) => INCIDENT_ARRAY?.includes(perm))) {
        updatedCheckboxValues.editIncident = true;
      }
      if (deletePermissions?.some((perm) => INCIDENT_ARRAY?.includes(perm))) {
        updatedCheckboxValues.deleteIncident = true;
      }
      if (editPermissions?.some((perm) => REASSESSMENT_ARRAY?.includes(perm))) {
        updatedCheckboxValues.editReassessment = true;
      }
      setCheckboxValues(updatedCheckboxValues);
      setPermissions({
        view: contactData?.userPermissions?.view || "",
        edit: contactData?.userPermissions?.edit || "",
        delete: contactData?.userPermissions?.delete || "",
      });
    }
  }, [contactData]);

  const deleteUser = async (id, isActive) => {
    const res = await updateUserStatus(id, {
      isActive: !isActive,
    });
    if (res.success) {
      showNotification({ message: res.message, type: "success" });
      getAllContacts();
    } else {
      showNotification({ message: res.message, type: "danger" });
    }
  };

  const fileInputRef = useRef(null);
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    setPreviewImage("");
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
    setImage1(file);
  };

  const updateContactDetailsHandler = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    if (contactForm.firstName) {
      payload.append("firstName", contactForm.firstName);
    }
    if (contactForm.lastName) {
      payload.append("lastName", contactForm.lastName);
    }
    payload.append("email", contactForm.email);
    payload.append("mobileNumber", contactForm.phone ?? "");
    if (contactData?.userType !== ROLES.PATIENT) {
      payload.append("address", contactForm.address ?? "");
    }
    payload.append("position", contactForm.title ?? "");
    payload.append("accountType", contactForm.accountType ?? "");
    payload.append("dateOfBirth", contactForm.dob ?? "");
    payload.append("ahcccsId", contactForm.ahcccsId ?? "");
    payload.append("diagnosis", contactForm.diagnosis ?? "");
    payload.append("dispatchResetLink", contactForm.password);
    payload.append("isActive", contactForm.isActive);
    payload.append("userPermissions", JSON.stringify(permissions));
    if (contactData?.userType === ROLES.EMPLOYEE) {
      if (selectedFacility.length)
        selectedFacility.forEach(({ value }) =>
          payload.append("facilityId", value),
        );
    }
    if (contactData?.userType === ROLES.PATIENT) {
      payload.append("admitDate", patientFields.admitDate ?? "");
      payload.append("location", contactForm.address ?? "");
      payload.append("facilityAddress", contactForm.address ?? "");
      payload.append(
        "psychiatricProvider",
        patientFields.psychiatricProvider ?? "",
      );
      payload.append("PCPProvider", patientFields.pcpProvider ?? "");
      payload.append("Diet", patientFields.diet ?? "");
      payload.append("fluidRestrictions", patientFields.fluidRestriction ?? "");
      payload.append("allergies", patientFields.allergies ?? "");
      payload.append("gender", contactForm.gender ?? "");
      if (contactForm.facilityId) {
        payload.append("facilityId[0]", contactForm.facilityId);
        const selectedFac = facilityList?.data?.find(
          (f) => f._id === contactForm.facilityId,
        );
        // if (selectedFac?.location) {
        //   payload.append("facilityAddress", selectedFac.location);
        // }
      }
    }
    if (image1) payload.append("image", image1);
    const response = await updateAdminUser(contactData?._id, payload);
    if (response.success) {
      showNotification({ message: response.message, type: "success" });
      setModalShow(false);
      getAllContacts();
      setShow(false);
      setModalType("");
      updateContactForm("password", "");
    } else {
      showNotification({ message: response.message, type: "danger" });
      setShow(false);
      setModalType("");
    }
  };

  useEffect(() => {
    if (!contactData?._id) return;
    setContactForm((prev) => ({
      ...prev,
      firstName: contactData?.firstName || "",
      lastName: contactData?.lastName || "",
      email: contactData?.email || "",
      phone: contactData?.mobileNumber || "",
      address:
        contactData?.userType === ROLES.PATIENT
          ? contactData?.facilityAddress || ""
          : contactData?.address || "",
      title: contactData?.position || "",
      accountType: contactData?.accountType || "",
      gender: contactData?.gender,
      facilityId:
        contactData?.userType === ROLES.PATIENT &&
        contactData?.facilityId?.length > 0
          ? contactData?.facilityId?.[0]
          : prev.facilityId,
      isActive: contactData?.isActive || false,
      permissionPsychiatricProvider:
        contactData?.permissionPsychiatricProvider || false,
      permissionClaimSubmission:
        contactData?.permissionClaimSubmission || false,
      dob: contactData?.dateOfBirth || "",
      ahcccsId: contactData?.ahcccsId || "",
      diagnosis: contactData?.diagnosis || "",
      typeUser:
        (contactData?.userType === ROLES.PATIENT
          ? "Resident"
          : contactData?.userType) || "",
    }));

    if (contactData?.userType === ROLES.EMPLOYEE) {
      const assignFacility = Array.isArray(contactData?.facilityId)
        ? contactData.facilityId
            .map((item) => {
              const f = facilityList?.data?.find((f) => f._id === item);
              return f
                ? {
                    value: f._id,
                    label: f.name,
                  }
                : null;
            })
            .filter(Boolean)
        : [];
      setSelectedFacility(assignFacility);
    }

    setAssignState({
      assignPatientId: "",
      assignerValue:
        contactData?.employeesId?.map((item) => ({
          value: item?._id,
          label: `${item?.firstName} ${item?.lastName}`,
        })) || [],
      assignerValueResident:
        contactData?.patientsAssigned?.map((item) => ({
          value: item?._id,
          label: `${item?.firstName} ${item?.lastName}`,
        })) || [],
    });
  }, [contactData, facilityList?.data]);
  useEffect(() => {
    setPatientFields({
      admitDate: patientDetail?.admitDate || contactData?.admitDate || "",
      psychiatricProvider:
        patientDetail?.psychiatricProvider ||
        contactData?.psychiatricProvider ||
        "",
      pcpProvider: patientDetail?.PCPProvider || contactData?.PCPProvider || "",
      diet: patientDetail?.Diet || contactData?.Diet || "",
      fluidRestriction:
        patientDetail?.fluidRestrictions ||
        contactData?.fluidRestrictions ||
        "",
      allergies: patientDetail?.allergies || contactData?.allergies || "",
    });
  }, [patientDetail, contactData]);

  const changePassModalHandler = (type) => {
    setModalType(type);
  };

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <ContactsModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
        addContactBtn={addContactBtn}
        params1={params1}
        assignerValue={assignerValue}
        assignerValueResident={assignerValueResident}
        contactData={contactData}
        setModalShow={setModalShow}
        setShow={setShow}
        getAllContacts={getAllContacts}
        setFilterApplied={setFilterApplied}
        setFilteredValue={setFilteredValue}
        setParams1={setParams1}
        facilityList={facilityList}
      />
      <ContactOffcanvas
        show={show}
        handleClose={handleClose}
        setModalType={setModalType}
        modalType={modalType}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        previewImage={previewImage}
        contactData={contactData}
        handleImageClick={handleImageClick}
        changePassModalHandler={changePassModalHandler}
        checkboxValues={checkboxValues}
        handleCheckboxChange={handleCheckboxChange}
        permissionCategories={permissionCategories}
        handleSelectAllToggle={handleSelectAllToggle}
        handleToggle={handleToggle}
        updateContactDetailsHandler={updateContactDetailsHandler}
        contactForm={contactForm}
        updateContactForm={updateContactForm}
        patientFields={patientFields}
        updatePatientField={updatePatientField}
        facilityList={facilityList}
        selectedFacility={selectedFacility}
        setSelectedFacility={setSelectedFacility}
        updateAssignState={updateAssignState}
        setAddContactBtn={setAddContactBtn}
        setModalShow={setModalShow}
      />
      <ContactsTable
        query={query}
        setQuery={setQuery}
        setPage={setPage}
        setAddContactBtn={setAddContactBtn}
        setModalShow={setModalShow}
        loading={isLoadingContacts}
        data={{ data: contactsResponse || {} }}
        errorMessage={errorMessage}
        handleShow={handleShow}
        setContactId={setContactId}
        deleteUser={deleteUser}
        page={page}
        limit={limit}
        setLimit={setLimit}
      />
    </>
  );
};
export default HOC({
  Wcomponenet: Contacts,
});
