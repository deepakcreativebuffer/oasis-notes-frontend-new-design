/** @format */

import { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { DropList, TableLayout } from "@/features/shared/ui/HelpingComponents";
import CreateNav from "@/utils/CreateNav";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { trainingService } from "@/features/shared/services";
import {
  formatDateToMMDDYYYY,
  formatDateWithoutUTCHandleToMMDDYYYY,
} from "@/utils/utils";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { useTuberculosisList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const Tubercluosis = () => {
  const { _id, userType, accountType, userPermissions } =
    useSelector(userProfile);
  const isAdmin = userType === ROLES.ADMIN;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useTuberculosisList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.tuberculosis.all() });
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
            i?.employeeName,
            formatDateToMMDDYYYY(i?.employeeDate),
            i?.createdAt && formatDateWithoutUTCHandleToMMDDYYYY(i?.createdAt),
            <DropList
              viewLink={`/tubercluosis/${i._id}`}
              showView={
                userType === ROLES.ADMIN ||
                accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                (typeof userPermissions?.view === "string"
                  ? userPermissions.view.split(":")
                  : []
                ).includes("tc")
              }
              showDelete={
                userType === ROLES.ADMIN ||
                accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                (typeof userPermissions?.delete === "string"
                  ? userPermissions.delete.split(":")
                  : []
                ).includes("tc")
              }
              editLink={`/edit-tubercluosis/${i._id}`}
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
                  ).includes("tc"))
              }
              canDelete={(typeof userPermissions?.delete === "string"
                ? userPermissions.delete.split(":")
                : []
              ).includes("tc")}
            />,
          ];
          if (isAdmin)
            result?.splice(4, 0, i?.employeeSignature ? "Yes" : "No");
          return result;
        })
      : [];
  const tHead = ["Sno", "Employee Name", "Date", "Created at", "Action"];
  if (isAdmin) tHead?.splice(4, 0, "Employee Training Completion");
  return (
    <>
      <CreateNav
        title={"Tuberculosis Training"}
        link={"/create-tubercluosis"}
        isAuthorizedToCreate={isAdmin ? false : true}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={fetchHandler}
        onDelete={({ additionalFunctions }) =>
          trainingService.tuberculosis.remove({
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
  Wcomponenet: Tubercluosis,
});
