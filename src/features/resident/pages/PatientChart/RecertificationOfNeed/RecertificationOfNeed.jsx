/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import CreateNav from "@/utils/CreateNav";
import HOC from "@/features/shared/layout/Inner/HOC";
import { patientChartService } from "@/features/shared/services";
import { formatDateToMMDDYYYY } from "@/utils/utils";
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
import { useRecertificationOfNeedList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const RecertificationOfNeed = () => {
  const { _id, userType, accountType, userPermissions } =
    useSelector(userProfile);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useRecertificationOfNeedList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.patientChart.list("recertificationOfNeed"),
    });
  }, [queryClient]);

  const deleteHandler = (docId) => {
    setShowDeleteModal(true);
    setDeleteId(docId);
  };

  useEffect(() => {
    if (response?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.docs?.length, page]);
  const dataList =
    response?.docs?.length > 0
      ? [...response?.docs]?.map((item) => [
          item?.clientName,
          formatDateToMMDDYYYY(item?.patientId?.admitDate),
          item?.saveAsDraft ? (
            <InDraft
              link={
                userType === ROLES.PATIENT
                  ? `/update-recertification-of-need-resident/${item._id}`
                  : `/update-recertification-of-need/${item._id}`
              }
            />
          ) : (
            <DropList
              viewLink={
                userType === ROLES.PATIENT
                  ? `/view-recertification-of-need-resident/${item._id}`
                  : `/view-recertification-of-need/${item._id}`
              }
              editLink={
                userType === ROLES.PATIENT
                  ? `/update-recertification-of-need-resident/${item._id}`
                  : `/update-recertification-of-need/${item._id}`
              }
              deleteLink={() => deleteHandler(item?._id)}
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
                  ).includes("ron"))
              }
              canDelete={
                (typeof userPermissions?.delete === "string"
                  ? userPermissions.delete.split(":")
                  : []
                ).includes("ron") || userType === ROLES.ADMIN
              }
            />
          ),
        ])
      : [];
  return (
    <>
      <CreateNav
        title={"Re-Certification of Need (RON)"}
        link={"/create-recertification-of-need"}
        isAuthorizedToCreate={userType !== ROLES.PATIENT}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={fetchHandler}
        onDelete={({ additionalFunctions }) =>
          patientChartService.recertificationOfNeed.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      />
      <Container className="full-width-container discharge-summary-cell-ellipsis">
        <TableLayout
          thead={["Resident Name", "Admit Date", "Action"]}
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
  Wcomponenet: RecertificationOfNeed,
});
