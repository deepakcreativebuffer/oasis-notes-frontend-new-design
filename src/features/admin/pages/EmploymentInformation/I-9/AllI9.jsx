/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import {
  employmentService,
  getObjectUrlFromDownloadUrl,
} from "@/features/shared/services";
import CreateNav from "@/utils/CreateNav";
import {
  fetchPaitentName,
  formatDateWithoutUTCHandleToMMDDYYYY,
} from "@/utils/utils";
import { DropList, TableLayout } from "@/features/shared/ui/HelpingComponents";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { useI9List } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const ALLI9 = () => {
  const { userType, accountType, userPermissions } = useSelector(userProfile);
  const isAdmin = userType === ROLES.ADMIN;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useI9List(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const invalidateList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.i9.all() });
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
          formatDateWithoutUTCHandleToMMDDYYYY(log?.updatedAt),
          isAdmin ? fetchPaitentName(log?.employeeId) : log?.type,
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
                ).includes("i9"))
            }
            editLink={`/i-9/${log?._id}`}
            deleteLink={() => deleteHandler(log?._id)}
            canDelete={(typeof userPermissions?.delete === "string"
              ? userPermissions.delete.split(":")
              : []
            ).includes("i9")}
          />,
        ])
      : [];
  return (
    <>
      <CreateNav
        title={"I-9"}
        link={"/i-9"}
        isAuthorizedToCreate={isAdmin ? false : true}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={invalidateList}
        onDelete={({ additionalFunctions }) =>
          employmentService.i9.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="full-width-container">
        <TableLayout
          thead={["Date", isAdmin ? "Employee Name" : "Type", "Action"]}
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
  Wcomponenet: ALLI9,
});
