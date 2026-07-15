/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { adminDashboardService } from "@/features/shared/services";
import CreateNav from "@/utils/CreateNav";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import {
  DropList,
  InDraft,
  TableLayout,
} from "@/features/shared/ui/HelpingComponents";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { formatDateToMMDDYYYY, getSignature } from "@/utils/utils";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import { DEFAULT_PAGE_SIZE } from "@/features/shared/constants";
import { useTerminationsList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const EmployeeTerminationlist = () => {
  const { hoursFormat } = useSelector(userProfile);
  const hoursFormats = hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useTerminationsList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.terminations.all() });
  }, [queryClient]);

  useEffect(() => {
    if (response?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.docs?.length, page]);
  const deleteDataHandler = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };
  const dataList =
    response?.docs?.length > 0
      ? [...response?.docs]?.map((item) => [
          `${item?.Employee?.firstName} ${item?.Employee?.lastName}`,
          formatDateToMMDDYYYY(item?.terminationDate),
          formatDateToMMDDYYYY(item?.hireDate),
          getSignature(
            item,
            hoursFormats,
            "adminSignature",
            "adminDateSigned",
            "employeeSignature",
            "dateSigned",
          ),
          item?.savedAsDraft ? (
            <InDraft
              link={`/dashboard/updateEmployeeTermination/${item.employeeId}`}
            />
          ) : (
            <DropList
              viewLink={`/dashboard/viewEmployeeTermination/${item.employeeId}`}
              editLink={`/dashboard/updateEmployeeTermination/${item.employeeId}`}
              deleteLink={() => deleteDataHandler(item?.employeeId)}
            />
          ),
        ])
      : [];
  return (
    <>
      <CreateNav
        title={"Employee Termination"}
        link="/dashboard/employeeTermination"
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={fetchHandler}
        onDelete={({ additionalFunctions }) =>
          adminDashboardService.deleteTermination(deleteId, {
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <Container className="full-width-container staff-note-table-cell-ellipsis">
        <TableLayout
          thead={[
            "Employee Name",
            "Termination Date",
            "Hire Date",
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
  Wcomponenet: EmployeeTerminationlist,
});
