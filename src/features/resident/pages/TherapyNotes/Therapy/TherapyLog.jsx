/** @format */

import { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import HOC from "@/features/shared/layout/Inner/HOC";
import { therapyNotesService } from "@/features/shared/services";
import CreateNav from "@/utils/CreateNav";
import {
  fetchPaitentName,
  formatDateToMMDDYYYY,
  getSignature,
} from "@/utils/utils";
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
import { useTherapySessionList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

const TherapyLog = () => {
  const { _id, userType, accountType, userPermissions, hoursFormat } =
    useSelector(userProfile);
  const hoursFormats = hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: logs, isLoading: loading } = useTherapySessionList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const getAllLogs = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.therapyNotes.list("session"),
    });
  }, [queryClient]);

  useEffect(() => {
    if (logs?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [logs?.docs?.length, page]);

  const deleteHandler = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const dataList =
    logs && logs?.docs?.length > 0
      ? [...logs?.docs]?.map((log) => [
          fetchPaitentName(log?.residentId?.[0]),
          formatDateToMMDDYYYY(log?.date),
          getSignature(
            log,
            hoursFormats,
            "adminSignature",
            "adminDateSigned",
            "behavioralTechnicianSignature",
            "behavioralTechnicianDateSigned",
          ),
          log?.therapyType?.join(", "),
          log?.saveAsDraft ? (
            <InDraft link={`/update-therapy-log/${log?._id}`} />
          ) : (
            <DropList
              viewLink={`/view-therapy-log/${log?._id}`}
              editLink={`/update-therapy-log/${log?._id}`}
              deleteLink={() => deleteHandler(log?._id)}
              canEdit={
                log?.signers?.filter?.(
                  (signer) =>
                    signer.signerId === _id && !signer?.signature?.length,
                )?.length ||
                accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                (accountType === ACCOUNT_TYPES.REGULAR &&
                  userType === ROLES.EMPLOYEE &&
                  (typeof userPermissions?.edit === "string"
                    ? userPermissions.edit.split(":")
                    : []
                  ).includes("tn"))
              }
              canDelete={(typeof userPermissions?.delete === "string"
                ? userPermissions.delete.split(":")
                : []
              ).includes("tn")}
            />
          ),
        ])
      : [];

  return (
    <>
      <CreateNav
        title={"Therapy Progress Notes"}
        link={"/create-therapy-note"}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={getAllLogs}
        onDelete={({ additionalFunctions }) =>
          therapyNotesService.therapySession.delete({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="full-width-container">
        <TableLayout
          thead={[
            "Resident's Name",
            "Date",
            "Technician Signature",
            "Therapy Type",
            "Action",
          ]}
          tbody={dataList}
          loading={loading}
        />
        {dataList.length > 0 && (
          <PaginationsPage
            page={page}
            setPage={setPage}
            totalPages={logs?.totalPages ?? 1}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </Container>
    </>
  );
};

export default HOC({
  Wcomponenet: TherapyLog,
});
