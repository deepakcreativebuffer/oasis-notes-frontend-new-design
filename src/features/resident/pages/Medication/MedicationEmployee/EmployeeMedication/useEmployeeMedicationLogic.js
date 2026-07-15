/* eslint-disable no-unused-vars */
/** @format */
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { ROLES } from "@/features/shared/constants";
import { EMPLOYEE_APIS } from "@/features/shared/services";
import {
  ColourOption,
  ColourSingleValue,
} from "./employeeMedicationColourComponents";
import { useMedicationEmployeeList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

export const useEmployeeMedicationLogic = () => {
  const profile = useSelector(userProfile);
  const hoursFormat = profile.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const [show, setShow] = useState(false);
  const [addContactBtn, setAddContactBtn] = useState(null);
  const [viewItem, setViewItem] = useState({});
  const [editId1, setEditId1] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const profileUser = useSelector(userProfile);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUrl, setDeleteUrl] = useState(null);
  const options = [
    {
      value: "Take 1 tab by mouth daily",
      label: "Take 1 tab by mouth daily",
    },
    {
      value: "Take 1 tab twice daily",
      label: "Take 1 tab twice daily",
    },
    {
      value: "Take 1 tab by mouth three times daily",
      label: "Take 1 tab by mouth three times daily",
    },
    {
      value: "Take 1 tab by mouth 4 times daily",
      label: "Take 1 tab by mouth 4 times daily",
    },
    {
      value: "Take 1 tab by mouth at bedtime",
      label: "Take 1 tab by mouth at bedtime",
    },
    {
      value: "Take 1/2 tab by mouth daily",
      label: "Take 1/2 tab by mouth daily",
    },
    {
      value: "Take ½ tab by mouth twice daily",
      label: "Take ½ tab by mouth twice daily",
    },
    {
      value: "Take ½ tab by mouth three times daily",
      label: "Take ½ tab by mouth three times daily",
    },
    {
      value: "Dissolve 1 tab under the tongue daily",
      label: "Dissolve 1 tab under the tongue daily",
    },
    {
      value: "Dissolve 1 tab under the tongue at bedtime",
      label: "Dissolve 1 tab under the tongue at bedtime",
    },
    {
      value:
        "Take 1 tab by mouth on empty stomach one (1) hour before breakfast",
      label:
        "Take 1 tab by mouth on empty stomach one (1) hour before breakfast",
    },
  ];
  const [noteId, setNoteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const colorOption = [
    {
      value: "#F5DB7F",
      label: "#F5DB7F",
    },
    {
      value: "#7FF5AE",
      label: "#7FF5AE",
    },
    {
      value: "#7FDBF5",
      label: "#7FDBF5",
    },
    {
      value: "#F5DBD1",
      label: "#F5DBD1",
    },
    {
      value: "#F587A8",
      label: "#F587A8",
    },
  ];
  const { data: response, isLoading: loading } = useMedicationEmployeeList(
    { page, limit, debouncedQuery, isAdmin: profile.userType === ROLES.ADMIN },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const getAllEmployeeMedications = useCallback(async () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.medication.employee.list(),
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
    setDeleteUrl(EMPLOYEE_APIS.EMPLOYEE_DELETEMEDICATIONEMPLOYEE(id));
  };

  return {
    ColourOption,
    ColourSingleValue,
    addContactBtn,
    colorOption,
    data: response,
    debouncedQuery,
    deleteUrl,
    editId,
    editId1,
    editName,
    getAllEmployeeMedications,
    handleClose,
    handleDelete,
    handleShow,
    hoursFormat,
    limit,
    loading,
    modalShow,
    noteId,
    options,
    page,
    printRef,
    profile,
    profileUser,
    query,
    setAddContactBtn,
    setDebouncedQuery,
    setDeleteUrl,
    setEditId,
    setEditId1,
    setEditName,
    setLimit,
    setModalShow,
    setNoteId,
    setPage,
    setQuery,
    setShow,
    setShowDeleteModal,
    setViewItem,
    show,
    showDeleteModal,
    viewItem,
  };
};
