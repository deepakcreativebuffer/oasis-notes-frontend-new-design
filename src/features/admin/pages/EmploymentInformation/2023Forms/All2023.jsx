/** @format */

import { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import {
  employmentService,
  getObjectUrlFromDownloadUrl,
} from "@/features/shared/services";
import CreateNav from "@/utils/CreateNav";
import { fetchPaitentName, formatDateToMMDDYYYY } from "@/utils/utils";
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
import { useForms2023List } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

const All2023 = () => {
  const profile = useSelector(userProfile);
  const isAdmin = profile?.userType === ROLES.ADMIN;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useForms2023List(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const invalidateList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.forms2023.all() });
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
    response && response?.docs?.length > 0
      ? response?.docs
          ?.filter((log) => log?.employeeId)
          ?.map((log) => [
            formatDateToMMDDYYYY(log?.date),
            isAdmin ? fetchPaitentName(log?.employeeId) : log?.type,
            <DropList
              showDownload={true}
              download={getObjectUrlFromDownloadUrl(log?.document)}
              showView={false}
              canEdit={
                profile?.userType === ROLES.ADMIN ||
                profile?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                (profile?.accountType === ACCOUNT_TYPES.REGULAR &&
                  profile?.userType === ROLES.EMPLOYEE &&
                  (typeof profile.userPermissions?.edit === "string"
                    ? profile.userPermissions.edit.split(":")
                    : []
                  ).includes("f23"))
              }
              editLink={`/forms-2023/${log?._id}`}
              deleteLink={() => deleteHandler(log?._id)}
              canDelete={profile?.userPermissions?.delete
                ?.split(":")
                .includes("f23")}
            />,
          ])
      : [];
  return (
    <>
      <CreateNav
        title={"FORMS 2023"}
        link={"/forms-2023"}
        isAuthorizedToCreate={isAdmin ? false : true}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={invalidateList}
        onDelete={({ additionalFunctions }) =>
          employmentService.forms2023.remove({
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
  Wcomponenet: All2023,
});
