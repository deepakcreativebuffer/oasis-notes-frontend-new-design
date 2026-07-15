/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import {
  employeeTrackingService,
  getObjectUrlFromDownloadUrl,
} from "@/features/shared/services";
import CreateNav from "@/utils/CreateNav";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { DropList, TableLayout } from "@/features/shared/ui/HelpingComponents";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { useEmployeeTrackingList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const MultiEmployeeTrackingList = () => {
  const { userType, accountType, userPermissions } = useSelector(userProfile);
  const isAdmin = userType === ROLES.ADMIN;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useEmployeeTrackingList(
    { page, limit, isAdmin },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.employeeTracking.all(),
    });
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
      ? response?.docs?.map((log) => [
          log?.type,
          formatDateToMMDDYYYY(log?.dueDate),
          <DropList
            showView={false}
            showDownload={true}
            download={getObjectUrlFromDownloadUrl(log?.document)}
            canEdit={
              userType === ROLES.ADMIN ||
              accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
              (accountType === ACCOUNT_TYPES.REGULAR &&
                userType === ROLES.EMPLOYEE &&
                (typeof userPermissions?.edit === "string"
                  ? userPermissions.edit.split(":")
                  : []
                ).includes("etracking"))
            }
            editLink={`/upload-employee-tracking/${log?._id}`}
            deleteLink={() => deleteHandler(log?._id)}
            canDelete={
              userType === ROLES.ADMIN ||
              accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
              (accountType === ACCOUNT_TYPES.REGULAR &&
                userType === ROLES.EMPLOYEE &&
                (typeof userPermissions?.delete === "string"
                  ? userPermissions.delete.split(":")
                  : []
                ).includes("etracking"))
            }
          />,
        ])
      : [];
  return (
    <>
      <CreateNav
        title={"Employee Tracking"}
        link={"/upload-employee-tracking"}
        isAuthorizedToCreate={true}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={fetchHandler}
        onDelete={({ additionalFunctions }) =>
          employeeTrackingService.delete({
            id: deleteId,
            isAdmin,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container>
        <TableLayout
          thead={["Name", "DueDate", "Action"]}
          tbody={dataList}
          loading={loading}
        />
        {dataList?.length > 0 && (
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
  Wcomponenet: MultiEmployeeTrackingList,
});
