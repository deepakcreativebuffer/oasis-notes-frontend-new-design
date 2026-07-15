/** @format */

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Container } from "react-bootstrap";
import HOC from "@/features/shared/layout/Inner/HOC";
import CreateNav from "@/utils/CreateNav";
import { intakeService } from "@/features/shared/services/index";
import { formatDateWithoutUTCHandleToMMDDYYYY } from "@/utils/utils";
import {
  InDraft,
  DropList,
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
} from "@/features/shared/constants/index";
import {
  getIntakeDocumentLinks,
  canCreateIntakeDocument,
} from "@/features/shared/intake/intakeLinks";
import { useNursingAssessmentList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const NursingAssessmentList = () => {
  const { _id, userType, accountType, userPermissions } =
    useSelector(userProfile);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useNursingAssessmentList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.intake.list("nursingAssessment"),
    });
  }, [queryClient]);

  const deleteProgressNoteHandler = useCallback((id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  }, []);
  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  useEffect(() => {
    if (response?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.docs?.length, page]);
  const dataList = useMemo(() => {
    return response?.docs?.length > 0
      ? [...response?.docs]?.map((dataItem) => {
          const links = getIntakeDocumentLinks(
            "nursingAssessment",
            userType,
            dataItem?._id,
          );
          return [
            `${dataItem?.patientId?.firstName} ${dataItem?.patientId?.lastName}`,
            formatDateWithoutUTCHandleToMMDDYYYY(dataItem?.createdAt),
            dataItem?.patientId?.diagnosis,
            dataItem?.saveAsDraft ? (
              <InDraft link={links.edit} />
            ) : (
              <DropList
                viewLink={links.view}
                editLink={links.edit}
                deleteLink={() => deleteProgressNoteHandler(dataItem?._id)}
                canEdit={
                  dataItem?.signers?.filter?.(
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
                    ).includes("nass"))
                }
                canDelete={(typeof userPermissions?.delete === "string"
                  ? userPermissions.delete.split(":")
                  : []
                ).includes("nass")}
              />
            ),
          ];
        })
      : [];
  }, [
    response,
    userType,
    _id,
    accountType,
    userPermissions,
    deleteProgressNoteHandler,
  ]);
  return (
    <>
      <CreateNav
        title={"Nursing Assessment"}
        link={"/nursing-assessment"}
        isAuthorizedToCreate={canCreateIntakeDocument(userType)}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        fetchHandler={fetchHandler}
        onDelete={({ additionalFunctions }) =>
          intakeService.nursingAssessment.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="full-width-container">
        <TableLayout
          thead={[
            "Resident’s Name",
            "Created On",
            "Diagnosis (specify if new or continuing)",
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
  Wcomponenet: NursingAssessmentList,
});
