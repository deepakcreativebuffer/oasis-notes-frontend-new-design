/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { trainingService } from "@/features/shared/services";
import CreateNav from "@/utils/CreateNav";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import {
  extractSignFromSigner,
  formatDateToMMDDYYYY,
  getSignature,
} from "@/utils/utils";
import {
  DropList,
  InDraft,
  TableLayout,
} from "@/features/shared/ui/HelpingComponents";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import TrainingAssignModal from "@/features/shared/features/training/TrainingAssignModal.jsx";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage.jsx";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal.jsx";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { useOnSiteList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const OnSiteList = () => {
  const { _id, userType, accountType, userPermissions, hoursFormat } =
    useSelector(userProfile);
  const hoursFormats = hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const urlPath = useLocation().pathname;
  const [modalShow, setModalShow] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useOnSiteList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.onSite.all() });
  }, [queryClient]);

  useEffect(() => {
    if (response?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.docs?.length, page]);
  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };
  const isAdmin = userType === ROLES.ADMIN;
  const dataList =
    response?.docs?.length > 0
      ? [...response?.docs]?.map((item) => [
          item.training?.[0]?.date &&
            formatDateToMMDDYYYY(item.training?.[0]?.date),
          item.training?.[0]?.duration,
          isAdmin
            ? item.employeeSignature ||
              extractSignFromSigner(
                item?.signers,
                item.employeeId._id,
                hoursFormats,
                false,
                true,
              )
              ? "Yes"
              : "No"
            : getSignature(
                item,
                hoursFormats,
                "adminSignature",
                "adminDateSigned",
                "employeeSignature",
                "employeeDate",
              ),
          `${item.employeeId?.firstName} ${item.employeeId?.lastName}`,
          item?.employeeSaveAsDraft ? (
            <InDraft link={`/edit-on-site/${item._id}`} />
          ) : (
            <DropList
              viewLink={`/view-site/${item?._id}`}
              editLink={`/edit-on-site/${item._id}`}
              deleteLink={() => handleDelete(item?._id)}
              canEdit={
                item?.signers?.filter?.(
                  (signer) =>
                    signer.signerId === _id && !signer?.signature?.length,
                )?.length ||
                userType === ROLES.ADMIN ||
                accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                (accountType === ACCOUNT_TYPES.REGULAR &&
                  userType === ROLES.EMPLOYEE &&
                  (typeof userPermissions?.edit === "string"
                    ? userPermissions.edit.split(":")
                    : []
                  ).includes("onsfov"))
              }
              canDelete={(typeof userPermissions?.delete === "string"
                ? userPermissions.delete.split(":")
                : []
              ).includes("onsfov")}
              isOnlyAdmin={userType === ROLES.ADMIN}
              isSignAvailable={
                (item.employeeSignature ||
                  extractSignFromSigner(
                    item?.signers,
                    item.employeeId?._id,
                    hoursFormats,
                  )) &&
                userType === ROLES.EMPLOYEE
                  ? false
                  : true
              }
              signatureButton={userType === ROLES.EMPLOYEE}
            />
          ),
        ])
      : [];
  return (
    <>
      <TrainingAssignModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
        formkey="onSite"
      />
      <CreateNav
        title={"On Site and Facility Orientation Verification"}
        link={"/create-on-site-facility"}
        isAuthorizedToCreate={isAdmin ? true : false}
        setModalShow={setModalShow}
        url={urlPath}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={fetchHandler}
        onDelete={({ additionalFunctions }) =>
          trainingService.onsiteFacility.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="full-width-container">
        <TableLayout
          thead={[
            "Training Date",
            "Duration",
            isAdmin ? "Employee Training Completion" : "Employee signature",
            "Employee Name",
            "Action",
          ]}
          tbody={dataList}
          loading={loading}
        />
        {dataList.length > 0 && (
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
  Wcomponenet: OnSiteList,
});
