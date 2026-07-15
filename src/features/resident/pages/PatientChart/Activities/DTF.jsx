/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import HOC from "@/features/shared/layout/Inner/HOC";
import CreateNav from "@/utils/CreateNav";
import { patientChartService } from "@/features/shared/services";
import { fetchPaitentName, formatDateToMMDDYYYY } from "@/utils/utils";
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
import { useAdlTrackingList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const DTF = () => {
  const { _id, userType, accountType, userPermissions } =
    useSelector(userProfile);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useAdlTrackingList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.patientChart.list("adlTracking"),
    });
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
      ? [...response?.docs]?.map((item) => [
          formatDateToMMDDYYYY(item?.date),
          item?.selectingClothes?.someAssistanceNeeded ? "Yes" : "No",
          item?.bathingOrShowering?.someAssistanceNeeded ? "Yes" : "No",
          item?.patientId && fetchPaitentName(item?.patientId),
          item?.saveAsDraft ? (
            <InDraft link={`/update-dtf/${item._id}`} />
          ) : (
            <DropList
              viewLink={`/view-dtf/${item._id}`}
              editLink={`/update-dtf/${item._id}`}
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
                  ).includes("dtf"))
              }
              canDelete={(typeof userPermissions?.delete === "string"
                ? userPermissions.delete.split(":")
                : []
              ).includes("dtf")}
            />
          ),
        ])
      : [];
  return (
    <>
      <CreateNav
        title={"Activities of Daily Living Tracking Form"}
        link={"/create-dtf"}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={fetchHandler}
        onDelete={({ additionalFunctions }) =>
          patientChartService.adlTracking.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="full-width-container">
        <TableLayout
          thead={[
            "Date",
            "Selecting Clothes",
            "Bathing or Showering",
            "Resident's Name",
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
  Wcomponenet: DTF,
});
