/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { DropList, TableLayout } from "@/features/shared/ui/HelpingComponents";
import CreateNav from "@/utils/CreateNav";
import HOC from "@/features/shared/layout/Inner/HOC";
import { medicationService } from "@/features/shared/services";
import { userProfile } from "@/store/authSlice";
import { convertTimeFormat, formatDateToMMDDYYYY } from "@/utils/utils";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { useTrackingLogList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const TrackingLog = () => {
  const { _id, userType, accountType, userPermissions, hoursFormat } =
    useSelector(userProfile);
  const hoursFormats = hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useTrackingLogList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.medication.list("trackingLog"),
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
          item?.name,
          item?.date && formatDateToMMDDYYYY(item?.date),
          convertTimeFormat(item?.time, hoursFormats),
          <DropList
            showView={
              userType === ROLES.ADMIN ||
              accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
              ((accountType === ACCOUNT_TYPES.REGULAR ||
                accountType === ACCOUNT_TYPES.RESTRICTED) &&
                userType === ROLES.EMPLOYEE &&
                (typeof userPermissions?.view === "string"
                  ? userPermissions.view.split(":")
                  : []
                ).includes("va"))
            }
            viewLink={`/view-tracking-log/${item?._id}`}
            editLink={`/update-tracking-log/${item?._id}`}
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
                ).includes("va"))
            }
            canDelete={(typeof userPermissions?.delete === "string"
              ? userPermissions.delete.split(":")
              : []
            ).includes("va")}
          />,
        ])
      : [];
  return (
    <>
      <CreateNav
        title={"Today's Appointment Tracking Log"}
        link={"/create-tracking-log"}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={fetchHandler}
        onDelete={({ additionalFunctions }) =>
          medicationService.trackingLog.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="full-width-container">
        <TableLayout
          thead={["Resident Name", "Date", "Time", "Action"]}
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
  Wcomponenet: TrackingLog,
});
