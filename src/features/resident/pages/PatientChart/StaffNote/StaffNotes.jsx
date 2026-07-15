/** @format */

// NOTE: Form is "Staffing Note" in code but "ART Meeting" in the UI.
// See CreateStaffNote.js header for context.

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { patientChartService } from "@/features/shared/services";
import CreateNav from "@/utils/CreateNav";
import HOC from "@/features/shared/layout/Inner/HOC";
import {
  DropList,
  InDraft,
  TableLayout,
} from "@/features/shared/ui/HelpingComponents";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { convertTimeFormat, formatDateToMMDDYYYY } from "@/utils/utils";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { useStaffingNoteList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const StaffNotes = () => {
  const { _id, userType, accountType, userPermissions, hoursFormat } =
    useSelector(userProfile);
  const hoursFormats = hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useStaffingNoteList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.patientChart.list("staffingNote"),
    });
  }, [queryClient]);

  const deleteDataHandler = (id) => {
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
          formatDateToMMDDYYYY(item?.todayDate),
          convertTimeFormat(item.beginTime, hoursFormats),
          convertTimeFormat(item.endTime, hoursFormats),
          item.progress,
          item.barriers,
          item?.saveAsDraft ? (
            <InDraft
              link={
                userType === ROLES.PATIENT
                  ? `/edit-staff-note-resident/${item._id}`
                  : `/update-staff-note/${item._id}`
              }
            />
          ) : (
            <DropList
              viewLink={
                userType === ROLES.PATIENT
                  ? `/view-staff-note-resident/${item._id}`
                  : `/view-staff-note/${item._id}`
              }
              editLink={
                userType === ROLES.PATIENT
                  ? `/edit-staff-note-resident/${item._id}`
                  : `/update-staff-note/${item._id}`
              }
              deleteLink={() => deleteDataHandler(item?._id)}
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
                  ).includes("sn"))
              }
              canDelete={(typeof userPermissions?.delete === "string"
                ? userPermissions.delete.split(":")
                : []
              ).includes("sn")}
            />
          ),
        ])
      : [];
  return (
    <>
      <CreateNav
        title={"ART Meeting"}
        link="/create-staff-note"
        isAuthorizedToCreate={userType !== ROLES.PATIENT}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={fetchHandler}
        onDelete={({ additionalFunctions }) =>
          patientChartService.staffingNote.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="full-width-container staff-note-table-cell-ellipsis">
        <TableLayout
          thead={[
            "Resident’s Name",
            "Today's Date",
            "Begin Time",
            "End Time",
            "ART Meeting Summary",
            "Barrier(s)",
            "Action",
          ]}
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
  Wcomponenet: StaffNotes,
});
