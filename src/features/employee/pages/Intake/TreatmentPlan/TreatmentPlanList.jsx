/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import HOC from "@/features/shared/layout/Inner/HOC";
import CreateNav from "@/utils/CreateNav";
import { treatmentPlanService } from "@/features/shared/services/index";
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
import { getIntakeDocumentLinks } from "@/features/shared/intake/intakeLinks";
import { isResidentPortalUser } from "@/features/shared/permissions/portalRoles";
import { useTreatmentPlanList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const TreatmentPlanList = () => {
  const { _id, userType, accountType, userPermissions } =
    useSelector(userProfile);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useTreatmentPlanList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.treatmentPlan.all(),
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
            "treatmentPlan",
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
                deleteLink={
                  isResidentPortalUser(userType)
                    ? true
                    : () => deleteProgressNoteHandler(data?._id)
                }
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
                    ).includes("tp"))
                }
                canDelete={(typeof userPermissions?.delete === "string"
                  ? userPermissions.delete.split(":")
                  : []
                ).includes("tp")}
              />
            ),
          ];
        })
      : [];
  return (
    <>
      <CreateNav title={"Treatment Plan"} link={"/treatment-plan"} />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={fetchHandler}
        onDelete={({ additionalFunctions }) =>
          treatmentPlanService.delete({ id: deleteId, additionalFunctions })
        }
      ></DeleteDocModal>
      <Container>
        <TableLayout
          thead={["Resident Name", "Date", "Diagnosis", "Action"]}
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
  Wcomponenet: TreatmentPlanList,
});
