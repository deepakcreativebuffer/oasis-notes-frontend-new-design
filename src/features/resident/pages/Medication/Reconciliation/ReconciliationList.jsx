/** @format */
import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import CreateNav from "@/utils/CreateNav";
import { medicationService } from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
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
import { useReconciliationList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const ReconciliationList = () => {
  const { _id, userType, accountType, userPermissions } =
    useSelector(userProfile);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useReconciliationList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const getAllData = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.medication.list("reconciliation"),
    });
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
  const dataList =
    response?.docs?.length > 0
      ? [...response?.docs]?.map((item) => [
          item?.residentName,
          item?.providerName,
          item?.providerSignatureSaveAsDraft ? (
            <InDraft link={`/update-reconciliation/${item?._id}`} />
          ) : (
            <DropList
              viewLink={`/view-reconciliation/${item?._id}`}
              editLink={`/update-reconciliation/${item?._id}`}
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
                  ).includes("mr"))
              }
              canDelete={(typeof userPermissions?.delete === "string"
                ? userPermissions.delete.split(":")
                : []
              ).includes("mr")}
            />
          ),
        ])
      : [];
  return (
    <>
      <CreateNav
        title={"Medication Reconciliation"}
        link="/create-reconciliation"
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={getAllData}
        onDelete={({ additionalFunctions }) =>
          medicationService.reconciliation.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="full-width-container reconciliation-text-ellipsis">
        <TableLayout
          thead={["Resident Name", "Provider Name", "Action"]}
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
  Wcomponenet: ReconciliationList,
});
