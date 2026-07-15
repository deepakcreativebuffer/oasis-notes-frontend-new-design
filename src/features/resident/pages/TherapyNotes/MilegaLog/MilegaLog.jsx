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
import { useMileageLogList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

const MilegaLog = () => {
  const { _id, userType, accountType, userPermissions, hoursFormat } =
    useSelector(userProfile);
  const hoursFormats = hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useMileageLogList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const getAllLogs = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.therapyNotes.list("mileageLog"),
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
      ? [...response?.docs]?.map((log) => [
          fetchPaitentName(log?.employeeId),
          formatDateToMMDDYYYY(log?.date),
          log?.residentInitials,
          log?.destination,
          getSignature(
            log,
            hoursFormats,
            "adminSignature",
            "adminDateSigned",
            "driverSignature",
            "signedDate",
          ),
          log?.saveAsDraft ? (
            <InDraft link={`/update-milega-log/${log?._id}`} />
          ) : (
            <DropList
              viewLink={`/view-milega-log/${log?._id}`}
              editLink={`/update-milega-log/${log?._id}`}
              deleteLink={() => deleteHandler(log?._id)}
              canEdit={
                log?.signers?.filter?.(
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
                  ).includes("ml"))
              }
              canDelete={(typeof userPermissions?.delete === "string"
                ? userPermissions.delete.split(":")
                : []
              ).includes("ml")}
            />
          ),
        ])
      : [];

  return (
    <>
      <CreateNav title={"Mileage Log"} link={"/create-milega-log"} />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={getAllLogs}
        onDelete={({ additionalFunctions }) =>
          therapyNotesService.mileageLog.delete({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="full-width-container">
        <TableLayout
          thead={[
            "Employee Name",
            "Date",
            "Resident Initials",
            "Destination",
            "Employee Signature",
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
  Wcomponenet: MilegaLog,
});
