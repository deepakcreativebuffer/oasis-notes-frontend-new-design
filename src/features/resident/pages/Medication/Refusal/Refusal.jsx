/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  DropList,
  InDraft,
  TableLayout,
} from "@/features/shared/ui/HelpingComponents";
import CreateNav from "@/utils/CreateNav";
import HOC from "@/features/shared/layout/Inner/HOC";
import { medicationService } from "@/features/shared/services";
import { userProfile } from "@/store/authSlice";
import { formatDateToMMDDYYYY, getSignature } from "@/utils/utils";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { useRefusalList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const Refusal = () => {
  const { _id, userType, accountType, userPermissions, hoursFormat } =
    useSelector(userProfile);
  const hoursFormats = hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useRefusalList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.medication.list("refusal"),
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
          item?.patientName,
          item?.toDayDate && formatDateToMMDDYYYY(item?.toDayDate),
          getSignature(
            item,
            hoursFormats,
            "adminSignature",
            "adminDateSigned",
            "staffSignature",
            "staffDate",
          ),
          item?.saveAsDraft ? (
            <InDraft link={`/update-refusal/${item?._id}`} />
          ) : (
            <DropList
              viewLink={
                userType === ROLES.PATIENT
                  ? `/view-refusal-resident/${item?._id}`
                  : `/view-refusal/${item?._id}`
              }
              editLink={
                userType === ROLES.PATIENT
                  ? `/edit-refusal-resident/${item?._id}`
                  : `/update-refusal/${item?._id}`
              }
              deleteLink={() => deleteHandler(item?._id)}
              canEdit={
                item?.signers?.filter?.(
                  (signer) =>
                    signer.signerId === _id && !signer?.signature?.length,
                )?.length ||
                accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                (accountType === ACCOUNT_TYPES.REGULAR &&
                  userType === ROLES.EMPLOYEE &&
                  (typeof userPermissions?.edit === "string"
                    ? userPermissions.edit.split(":")
                    : []
                  ).includes("rmt"))
              }
              canDelete={(typeof userPermissions?.delete === "string"
                ? userPermissions.delete.split(":")
                : []
              ).includes("rmt")}
            />
          ),
        ])
      : [];
  return (
    <>
      <CreateNav
        title={"Refusal of Medical Treatment Form"}
        link={"/create-refusal"}
        isAuthorizedToCreate={userType !== ROLES.PATIENT}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={fetchHandler}
        onDelete={({ additionalFunctions }) =>
          medicationService.refusal.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="full-width-container">
        <TableLayout
          thead={["Patient", "Date", "Staff Signature", "Action"]}
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
  Wcomponenet: Refusal,
});
