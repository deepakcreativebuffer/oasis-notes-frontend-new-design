/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { medicationService } from "@/features/shared/services";
import CreateNav from "@/utils/CreateNav";
import HOC from "@/features/shared/layout/Inner/HOC";
import {
  DropList,
  InDraft,
  TableLayout,
} from "@/features/shared/ui/HelpingComponents";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { fetchPaitentName, formatDateToMMDDYYYY } from "@/utils/utils";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage.jsx";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal.jsx";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { useInformedConsentList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const InformedConsentList = () => {
  const { _id, userType, accountType, userPermissions } =
    useSelector(userProfile);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useInformedConsentList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const handleDelete = async (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const getAllData = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.medication.informedConsent.list(),
    });
  }, [queryClient]);

  useEffect(() => {
    if (response?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.docs?.length, page]);
  const dataList =
    response?.docs?.length > 0
      ? [...response?.docs]?.map((i) => [
          fetchPaitentName(i?.patientId),
          i?.patientId?.admitDate &&
            formatDateToMMDDYYYY(i?.patientId?.admitDate),
          i?.saveAsDraft || i?.residentGuardianSignatureSaveAsDraft ? (
            <InDraft
              link={
                userType === ROLES.PATIENT
                  ? `/edit-informed-consent-resident/${i?._id}`
                  : `/update-informed/${i?._id}`
              }
            />
          ) : (
            <DropList
              viewLink={
                userType === ROLES.PATIENT
                  ? `/view-informed-consent-resident/${i?._id}`
                  : `/view-inform/${i?._id}`
              }
              editLink={
                userType === ROLES.PATIENT
                  ? `/edit-informed-consent-resident/${i?._id}`
                  : `/update-informed/${i?._id}`
              }
              deleteLink={() => handleDelete(i?._id)}
              canEdit={
                i?.signers?.filter?.(
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
                  ).includes("icm"))
              }
              canDelete={false}
            />
          ),
        ])
      : [];
  return (
    <>
      <CreateNav
        title={"Informed Consent for Medications "}
        link={"/create-informed-consent"}
        isAuthorizedToCreate={userType !== ROLES.PATIENT}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={getAllData}
        onDelete={({ additionalFunctions }) =>
          medicationService.informedConsent.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="full-width-container">
        <TableLayout
          thead={["Resident’s Name", "Admit Date", "Action"]}
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
  Wcomponenet: InformedConsentList,
});
