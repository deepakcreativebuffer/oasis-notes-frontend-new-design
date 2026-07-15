/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import HOC from "@/features/shared/layout/Inner/HOC";
import CreateNav from "@/utils/CreateNav";
import { intakeService } from "@/features/shared/services";
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
} from "@/features/shared/constants";
import {
  getIntakeDocumentLinks,
  canCreateIntakeDocument,
} from "@/features/shared/intake/intakeLinks";
import { useSafetyPlanList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const SafetyPlanList = () => {
  const { _id, userType, accountType, userPermissions } =
    useSelector(userProfile);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useSafetyPlanList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.intake.list("safetyPlan"),
    });
  }, [queryClient]);

  const deleteProgressNoteHandler = (id) => {
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
      ? [...response?.docs]?.map((data) => {
          const links = getIntakeDocumentLinks(
            "safetyPlan",
            userType,
            data?._id,
          );
          return [
            `${data?.patientId?.firstName} ${data?.patientId?.lastName}`,
            formatDateWithoutUTCHandleToMMDDYYYY(data?.createdAt),
            data?.patientId?.diagnosis,
            data?.saveAsDraft ? (
              <InDraft link={links.edit} />
            ) : (
              <DropList
                viewLink={links.view}
                editLink={links.edit}
                deleteLink={() => deleteProgressNoteHandler(data?._id)}
                canEdit={
                  data?.signers?.filter?.(
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
                    ).includes("sp"))
                }
                canDelete={(typeof userPermissions?.delete === "string"
                  ? userPermissions.delete.split(":")
                  : []
                ).includes("sp")}
              />
            ),
          ];
        })
      : [];
  return (
    <>
      <CreateNav
        title={"Safety Plan"}
        link={"/safety-plan"}
        isAuthorizedToCreate={canCreateIntakeDocument(userType)}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={fetchHandler}
        onDelete={({ additionalFunctions }) =>
          intakeService.safetyPlan.remove({ id: deleteId, additionalFunctions })
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
  Wcomponenet: SafetyPlanList,
});
