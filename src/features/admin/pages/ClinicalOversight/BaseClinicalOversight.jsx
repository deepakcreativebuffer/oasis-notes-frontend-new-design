import HOC from "@/features/shared/layout/Inner/HOC";
import CreateNav from "@/utils/CreateNav";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { convertTimeFormat, formatDateToMMDDYYYY } from "@/utils/utils";
import {
  DropList,
  InDraft,
  TableLayout,
} from "@/features/shared/ui/HelpingComponents";
import { Container } from "react-bootstrap";
import { userProfile } from "@/store/authSlice";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import { useModal } from "@/features/shared/contexts/ModalContext";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { EMPLOYEE_APIS } from "@/features/shared/services";
import { useClinicalOversightList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const BaseClinicalOversight = () => {
  const { _id, userType, accountType, userPermissions, hoursFormat } =
    useSelector(userProfile);
  const hoursFormats = hoursFormat === "24" ? "HH:mm" : "h:mm a";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const { openDeleteModal } = useModal();

  const { data: response, isLoading: loading } = useClinicalOversightList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const fetchHandler = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.clinicalOversight.all(),
    });
  }, [queryClient]);

  useEffect(() => {
    if (response?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.docs?.length, page]);
  const deleteClinicalOversightHandler = useCallback(
    (id) => {
      openDeleteModal({
        url: EMPLOYEE_APIS.EMPLOYEE_DELETENOTES(id),
        onSuccess: fetchHandler,
      });
    },
    [openDeleteModal, fetchHandler],
  );
  const multipleNameAdjuster = useCallback((arr) => {
    return (
      <>
        {arr?.map((value, index) => (
          <li key={index} className="underline list-none m-0">
            {value?.firstName} {value?.lastName}
          </li>
        ))}
      </>
    );
  }, []);
  const dataList = useMemo(() => {
    return response?.docs?.length > 0
      ? [...response?.docs]?.map((item) => [
          formatDateToMMDDYYYY(item?.date),
          multipleNameAdjuster(item?.employeesInvolved),
          item?.bhpNameAndCredentials,
          item?.facilityAddress,
          `${convertTimeFormat(item?.beginTime, hoursFormats)} - ${convertTimeFormat(item?.endTime, hoursFormats)}`,
          item?.saveAsDraft ? (
            <InDraft link={`/clinical-oversight/${item?._id}`} />
          ) : (
            <DropList
              viewLink={`/view-clinical-oversight/${item?._id}`}
              editLink={`/clinical-oversight/${item?._id}`}
              deleteLink={() => deleteClinicalOversightHandler(item?._id)}
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
                  ).includes("co"))
              }
              canDelete={(typeof userPermissions?.delete === "string"
                ? userPermissions.delete.split(":")
                : []
              ).includes("co")}
            />
          ),
        ])
      : [];
  }, [
    response,
    hoursFormats,
    multipleNameAdjuster,
    deleteClinicalOversightHandler,
    _id,
    userType,
    accountType,
    userPermissions,
  ]);
  return (
    <>
      <CreateNav title={"Clinical Oversight"} link={"/clinical-oversight"} />
      <Container className="full-width-container">
        <TableLayout
          thead={[
            "Date",
            "Employee's Name",
            "BHP Name",
            "Facility Address",
            "Shift",
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
  Wcomponenet: BaseClinicalOversight,
});
