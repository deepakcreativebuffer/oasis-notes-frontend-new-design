/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { DropList, TableLayout } from "@/features/shared/ui/HelpingComponents";
import CreateNav from "@/utils/CreateNav";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { assistanceService } from "@/features/shared/services";
import { formatDateWithoutUTCHandleToMMDDYYYY } from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { useAssistanceMedList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const AssistanceMed = () => {
  const { _id, userType, accountType, userPermissions } =
    useSelector(userProfile);
  const isAdmin = userType === ROLES.ADMIN;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useAssistanceMedList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.assistanceMed.all() });
  }, [queryClient]);

  useEffect(() => {
    if (response?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.docs?.length, page]);
  const deleteHandler = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };
  const dataList =
    response?.docs?.length > 0
      ? [...response?.docs]?.map((i, index) => {
          const result = [
            `${index + 1}`,
            i?.trainingHours,
            `${i?.employeeId?.firstName} ${i?.employeeId?.lastName}`,
            i?.createdAt && formatDateWithoutUTCHandleToMMDDYYYY(i?.createdAt),
            <DropList
              viewLink={`/view-assistance-med/${i._id}`}
              showView={
                userType === ROLES.ADMIN ||
                accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                ((accountType === ACCOUNT_TYPES.REGULAR ||
                  accountType === ACCOUNT_TYPES.RESTRICTED) &&
                  userType === ROLES.EMPLOYEE &&
                  (typeof userPermissions?.view === "string"
                    ? userPermissions.view.split(":")
                    : []
                  ).includes("asam"))
              }
              showDelete={
                userType === ROLES.ADMIN ||
                accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                (accountType === ACCOUNT_TYPES.REGULAR &&
                  userType === ROLES.EMPLOYEE &&
                  (typeof userPermissions?.delete === "string"
                    ? userPermissions.delete.split(":")
                    : []
                  ).includes("asam"))
              }
              editLink={`/edit-assistance-med/${i._id}`}
              deleteLink={() => deleteHandler(i._id)}
              canEdit={
                ((i?.employeeId?._id || i?.employeeId) === _id &&
                  !i?.employeeSignature?.length) ||
                i?.signers?.filter?.(
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
                  ).includes("asam"))
              }
              canDelete={(typeof userPermissions?.delete === "string"
                ? userPermissions.delete.split(":")
                : []
              ).includes("asam")}
            />,
          ];
          if (isAdmin)
            result?.splice(3, 0, i?.employeeSignature ? "Yes" : "No");
          return result;
        })
      : [];
  const tHead = [
    "Sno",
    "Training hours",
    "Employee Name",
    "Created at",
    "Action",
  ];
  if (isAdmin) tHead?.splice(3, 0, "Employee Training Completion");
  return (
    <>
      <CreateNav
        title={"Assistance with Self-Administration of Medication"}
        link={"/create-administration-medication"}
        isAuthorizedToCreate={isAdmin ? false : true}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={fetchHandler}
        onDelete={({ additionalFunctions }) =>
          assistanceService.selfAdministration.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="full-width-container">
        <TableLayout thead={tHead} tbody={dataList} loading={loading} />
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
  Wcomponenet: AssistanceMed,
});
