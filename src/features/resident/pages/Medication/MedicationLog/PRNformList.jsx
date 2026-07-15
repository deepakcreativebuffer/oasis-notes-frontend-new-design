/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import CreateNav from "@/utils/CreateNav";
import { medicationService } from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
import { fetchPaitentName } from "@/utils/utils";
import {
  DropList,
  InDraft,
  TableLayout,
} from "@/features/shared/ui/HelpingComponents";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage.jsx";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal.jsx";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { usePrnLogList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const PRNformList = () => {
  const { _id, userType, accountType, userPermissions } =
    useSelector(userProfile);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = usePrnLogList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.medication.list("prnLog"),
    });
  }, [queryClient]);

  useEffect(() => {
    if (response?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.docs?.length, page]);
  const dataList =
    response?.docs?.length > 0
      ? [...response?.docs]?.map((item) => [
          item?.residentName ||
            (item?.patientId && fetchPaitentName(item?.patientId)),
          item?.medicationAndStrength,
          item?.instructions,
          item?.prescriberName,
          item?.site,
          item?.saveAsDraft ? (
            <InDraft
              link={
                userType === ROLES.PATIENT
                  ? `/edit-prn-log-resident/${item?._id}`
                  : `/update-prn/${item?._id}`
              }
            />
          ) : (
            <DropList
              viewLink={
                userType === ROLES.PATIENT
                  ? `/view-prn-log-resident/${item?._id}`
                  : `/view-prn/${item?._id}`
              }
              editLink={
                userType === ROLES.PATIENT
                  ? `/edit-prn-log-resident/${item?._id}`
                  : `/update-prn/${item?._id}`
              }
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
                  ).includes("prn"))
              }
              canDelete={false}
            />
          ),
        ])
      : [];
  return (
    <>
      <CreateNav
        title={"PRN Medication Log"}
        link={"/create-prn-log"}
        isAuthorizedToCreate={userType !== ROLES.PATIENT}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={fetchHandler}
        onDelete={({ additionalFunctions }) =>
          medicationService.prnLog.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="full-width-container">
        <TableLayout
          thead={[
            "Resident’s Name",
            "Medication and Strength",
            "Instructions",
            "Prescriber Name",
            "Site Name",
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
  Wcomponenet: PRNformList,
});
