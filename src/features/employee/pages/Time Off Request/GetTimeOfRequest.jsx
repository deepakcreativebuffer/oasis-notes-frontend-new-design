/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import CreateNav from "@/utils/CreateNav";
import { timeOffService } from "@/features/shared/services";
import {
  DropList,
  InDraft,
  TableLayout,
} from "@/features/shared/ui/HelpingComponents";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { formatDateToMMDDYYYY, getSignature } from "@/utils/utils";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage.jsx";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal.jsx";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { useTimeOffList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const GetTimeOfRequest = () => {
  const { _id, userType, accountType, userPermissions, hoursFormat } =
    useSelector(userProfile);
  const hoursFormats = hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const isAdmin = userType === ROLES.ADMIN;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useTimeOffList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const getAllData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.timeOff.all() });
  }, [queryClient]);

  useEffect(() => {
    if (response?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.docs?.length, page]);
  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };
  const dataList =
    response?.docs?.length > 0
      ? [...response?.docs]?.map((i) => [
          i?.requestType,
          i?.beginDate && formatDateToMMDDYYYY(i?.beginDate),
          i?.endDate && formatDateToMMDDYYYY(i?.endDate),
          i?.status,
          getSignature(
            i,
            hoursFormats,
            "adminSignature",
            "adminDateSigned",
            "signature",
            "signatureDate",
          ),
          i?.signatureSaveAsDraft ? (
            <InDraft link={`/edit-time-off-request/${i?._id}`} />
          ) : (
            <DropList
              viewLink={`/view-time-of-request/${i._id}`}
              showDelete={
                accountType === ROLES.ADMIN ||
                accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                (typeof userPermissions?.delete === "string"
                  ? userPermissions.delete.split(":")
                  : []
                ).includes("tr")
              }
              editLink={`/edit-time-off-request/${i?._id}`}
              deleteLink={() => handleDelete(i?._id)}
              canEdit={
                i?.signers?.filter?.(
                  (signer) =>
                    signer.signerId === _id && !signer?.signature?.length,
                )?.length ||
                accountType === ROLES.ADMIN ||
                accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                (accountType === ACCOUNT_TYPES.REGULAR &&
                  userType === ROLES.EMPLOYEE &&
                  (typeof userPermissions?.edit === "string"
                    ? userPermissions.edit.split(":")
                    : []
                  ).includes("tr"))
              }
              canDelete={(typeof userPermissions?.delete === "string"
                ? userPermissions.delete.split(":")
                : []
              ).includes("tr")}
            />
          ),
        ])
      : [];
  return (
    <>
      <CreateNav
        title={"Time off Request"}
        link={"/create-time-of-request"}
        isAuthorizedToCreate={isAdmin ? false : true}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={getAllData}
        onDelete={({ additionalFunctions }) =>
          timeOffService.requests.remove({ id: deleteId, additionalFunctions })
        }
      ></DeleteDocModal>
      <Container className="full-width-container">
        <TableLayout
          thead={[
            "Request Type",
            "Begin Date ",
            "End Date ",
            "Status",
            "Signature",
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
  Wcomponenet: GetTimeOfRequest,
});
