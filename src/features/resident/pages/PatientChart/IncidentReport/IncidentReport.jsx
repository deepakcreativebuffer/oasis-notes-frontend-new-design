/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { patientChartService } from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
import CreateNav from "@/utils/CreateNav";
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
import { useIncidentReportList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const IncidentReport = () => {
  const { _id, userType, accountType, userPermissions } =
    useSelector(userProfile);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useIncidentReportList(
    { page, limit, isAdmin: userType === ROLES.ADMIN },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.patientChart.list("incidentReport"),
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
      ? [...response?.docs]?.map((i) => [
          i.patientId && fetchPaitentName(i?.patientId),
          formatDateToMMDDYYYY(i?.dateOfIncident),
          <ul className="mb-0 list-unstyled">
            {i?.employeesInvolved?.map((list, index) => (
              <li className="underline" key={`${list}${index}`}>
                {" "}
                {`${list?.firstName} ${list?.lastName}`}{" "}
              </li>
            ))}
          </ul>,
          <ul className="mb-0 list-unstyled">
            {i?.residentsInvolved?.map((list, index) => (
              <li className="underline" key={`${list}${index}`}>
                {" "}
                {`${list?.firstName} ${list?.lastName}`}{" "}
              </li>
            ))}
          </ul>,
          i?.saveAsDraft ? (
            <InDraft link={`/update-incident/${i._id}`} />
          ) : (
            <DropList
              viewLink={`/view-incident-report/${i?._id}`}
              showView={
                i?.signers?.filter?.(
                  (signer) =>
                    signer.signerId === _id && !signer?.signature?.length,
                )?.length ||
                userType === ROLES.ADMIN ||
                accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                ((accountType === ACCOUNT_TYPES.REGULAR ||
                  accountType === ACCOUNT_TYPES.RESTRICTED) &&
                  userType === ROLES.EMPLOYEE &&
                  (typeof userPermissions?.view === "string"
                    ? userPermissions.view.split(":")
                    : []
                  ).includes("inr"))
              }
              editLink={`/update-incident/${i._id}`}
              deleteLink={() => deleteHandler(i?._id)}
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
                  ).includes("inr"))
              }
              canDelete={(typeof userPermissions?.delete === "string"
                ? userPermissions.delete.split(":")
                : []
              ).includes("inr")}
            />
          ),
        ])
      : [];
  return (
    <>
      <CreateNav
        title={"Incident Report Form"}
        link={"/create-incident-report"}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={fetchHandler}
        onDelete={({ additionalFunctions }) =>
          patientChartService.incidentReport.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="full-width-container">
        <TableLayout
          thead={[
            "Resident’s Name",
            "Date of Incident",
            "Name of Employee/s Involved",
            "Name Resident/s Involved ",
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
  Wcomponenet: IncidentReport,
});
