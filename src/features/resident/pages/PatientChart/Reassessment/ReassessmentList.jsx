import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import HOC from "@/features/shared/layout/Inner/HOC";
import CreateNav from "@/utils/CreateNav";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import { DropList, TableLayout } from "@/features/shared/ui/HelpingComponents";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { useReassessmentList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";

const ReassessmentList = () => {
  const { userType, accountType, userPermissions } = useSelector(userProfile);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);

  const { data: response, isLoading: loading } = useReassessmentList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  useEffect(() => {
    if (response?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.docs?.length, page]);

  const dataList =
    response?.docs?.length > 0
      ? [...response?.docs]?.map((data) => [
          data?.fullName ||
            `${data?.firstName || ""} ${data?.lastName || ""}`.trim(),
          formatDateToMMDDYYYY(data?.createdAt),
          <DropList
            viewLink={`/view-reassessment/${data?._id}`}
            editLink={`/update-reassessment/${data?._id}`}
            canEdit={
              userType === ROLES.ADMIN ||
              accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
              (userType === ROLES.EMPLOYEE &&
                (typeof userPermissions?.edit === "string"
                  ? userPermissions.edit.split(":")
                  : []
                ).includes("reassessment"))
            }
            canDelete={false}
            isOnlyAdmin={false}
          />,
        ])
      : [];

  return (
    <>
      <CreateNav title={"Re-Assessment"} isAuthorizedToCreate={false} />
      <Container className="full-width-container">
        <TableLayout
          thead={["Resident’s Name", "Created Date", "Action"]}
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
  Wcomponenet: ReassessmentList,
});
