/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { patientChartService } from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
import CreateNav from "@/utils/CreateNav";
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
import { useContactNoteList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const ContactNote = () => {
  const { _id, userType, accountType, userPermissions } =
    useSelector(userProfile);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useContactNoteList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const getAllData = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.patientChart.list("contactNote"),
    });
  }, [queryClient]);

  useEffect(() => {
    if (response?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.docs?.length, page]);
  const dataList =
    response?.docs?.length > 0
      ? [...response?.docs]?.map((item) => [
          item?.residentName,
          item?.familyMember,
          item?.email,
          item?.caseManager,
          item?.saveAsDraft ? (
            <InDraft link={`/update-contact-note/${item._id}`} />
          ) : (
            <DropList
              viewLink={`/view-contact-note/${item._id}`}
              editLink={`/update-contact-note/${item._id}`}
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
                  ).includes("cn"))
              }
              canDelete={(typeof userPermissions?.delete === "string"
                ? userPermissions.delete.split(":")
                : []
              ).includes("cn")}
            />
          ),
        ])
      : [];
  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };
  return (
    <>
      <CreateNav title={"Contact Note"} link={"/create-contact-note"} />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={getAllData}
        onDelete={({ additionalFunctions }) =>
          patientChartService.contactNote.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="full-width-container">
        <TableLayout
          thead={[
            "Resident’s Name",
            "Family Member",
            "Email",
            "Cash Manager",
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
  Wcomponenet: ContactNote,
});
