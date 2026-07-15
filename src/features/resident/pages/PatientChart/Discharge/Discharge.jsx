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
import { useDischargeSummaryList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const Discharge = () => {
  const { _id, userType, accountType, userPermissions } =
    useSelector(userProfile);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useDischargeSummaryList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.patientChart.list("dischargeSummary"),
    });
  }, [queryClient]);

  const deleteHandler = (id) => {
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
          item?.clientName,
          formatDateToMMDDYYYY(item?.patientId?.admitDate),
          formatDateToMMDDYYYY(item?.dateOfDischarge),
          item?.reasonForDischarge,
          item?.treatmentProvided,
          item?.saveAsDraft ? (
            <InDraft
              link={
                userType === ROLES.PATIENT
                  ? `/edit-discharge-summary-resident/${item._id}`
                  : `/update-discharge/${item._id}`
              }
            />
          ) : (
            <DropList
              viewLink={
                userType === ROLES.PATIENT
                  ? `/view-discharge-summary-resident/${item._id}`
                  : `/view-discharge/${item._id}`
              }
              editLink={
                userType === ROLES.PATIENT
                  ? `/edit-discharge-summary-resident/${item._id}`
                  : `/update-discharge/${item._id}`
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
                  ).includes("discharge"))
              }
              canDelete={userPermissions?.delete
                ?.split(":")
                .includes("discharge")}
            />
          ),
        ])
      : [];
  return (
    <>
      <CreateNav
        title={"Discharge Summary"}
        link={"/create-discharge-summary"}
        isAuthorizedToCreate={userType !== ROLES.PATIENT}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={fetchHandler}
        onDelete={({ additionalFunctions }) =>
          patientChartService.dischargeSummary.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="full-width-container discharge-summary-cell-ellipsis">
        <TableLayout
          thead={[
            `Resident Name`,
            "Admit Date",
            "Date of Discharge",
            "Reason for Discharge",
            "Treatment Provided",
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
  Wcomponenet: Discharge,
});
