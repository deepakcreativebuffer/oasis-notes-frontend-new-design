/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { patientChartService } from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
import CreateNav from "@/utils/CreateNav";
import { formatDateWithoutUTCHandleToMMDDYYYY } from "@/utils/utils";
import {
  DropList,
  InDraft,
  TableLayout,
} from "@/features/shared/ui/HelpingComponents";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { useAuthorizationList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const Authorization = () => {
  const { _id, userType, accountType, userPermissions } =
    useSelector(userProfile);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useAuthorizationList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.patientChart.list("authorization"),
    });
  }, [queryClient]);

  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  useEffect(() => {
    if (response?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.docs?.length, page]);
  const dataList =
    response?.docs?.length > 0
      ? [...response?.docs]?.map((item) => [
          item?.residentName,
          item?.authorizedPersonPhone,
          item?.createdAt &&
            formatDateWithoutUTCHandleToMMDDYYYY(item?.createdAt),
          item?.witness,
          item?.saveAsDraft ? (
            <InDraft
              link={
                userType === ROLES.PATIENT
                  ? `/edit-authorization-resident/${item?._id}`
                  : `/update-authorization/${item._id}`
              }
            />
          ) : (
            <DropList
              viewLink={
                userType === ROLES.PATIENT
                  ? `/view-authorization-resident/${item?._id}`
                  : `/view-authorization/${item._id}`
              }
              editLink={
                userType === ROLES.PATIENT
                  ? `/edit-authorization-resident/${item?._id}`
                  : `/update-authorization/${item._id}`
              }
              deleteLink={() => handleDelete(item._id)}
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
                  ).includes("ari"))
              }
              canDelete={(typeof userPermissions?.delete === "string"
                ? userPermissions.delete.split(":")
                : []
              ).includes("ari")}
            />
          ),
        ])
      : [];
  return (
    <>
      <CreateNav
        title={"Authorization for Release of information"}
        link={"/create-authorization"}
        isAuthorizedToCreate={userType !== ROLES.PATIENT}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={fetchHandler}
        onDelete={({ additionalFunctions }) =>
          patientChartService.authorization.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="authorization-table-cell-ellipsis">
        <TableLayout
          thead={["Resident’s Name", "Phone", "Date", "Witness", "Action"]}
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
  Wcomponenet: Authorization,
});
