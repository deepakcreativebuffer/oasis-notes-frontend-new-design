/** @format */

import { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import CreateNav from "@/utils/CreateNav";
import { trainingService } from "@/features/shared/services";
import {
  DropList,
  InDraft,
  TableLayout,
} from "@/features/shared/ui/HelpingComponents";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import TrainingAssignModal from "@/features/shared/features/training/TrainingAssignModal.jsx";
import { useLocation } from "react-router-dom";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage.jsx";
import { extractSignFromSigner } from "@/utils/utils";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal.jsx";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { useSkillsList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const SkillsList = () => {
  const { _id, userType, accountType, userPermissions, hoursFormat } =
    useSelector(userProfile);
  const hoursFormats = hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const isAdmin = userType === ROLES.ADMIN;
  const urlPath = useLocation().pathname;
  const [modalShow, setModalShow] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useSkillsList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const getAllData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.skills.all() });
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
      ? [...response?.docs]?.map((i) => {
          const result = [
            i?.hoursCompleted,
            i?.employeeTitle,
            `${i?.employeeId?.firstName} ${i?.employeeId?.lastName}`,
            i?.employeeSaveAsDraft ? (
              <InDraft link={`/edit-skill-training/${i?._id}`} />
            ) : (
              <DropList
                viewLink={`/view-site-training/${i?._id}`}
                showView={
                  userType === ROLES.ADMIN ||
                  accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                  (typeof userPermissions?.view === "string"
                    ? userPermissions.view.split(":")
                    : []
                  ).includes("st")
                }
                showDelete={
                  userType === ROLES.ADMIN ||
                  accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                  (typeof userPermissions?.delete === "string"
                    ? userPermissions.delete.split(":")
                    : []
                  ).includes("st")
                }
                editLink={`/edit-skill-training/${i?._id}`}
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
                    ).includes("st"))
                }
                canDelete={(typeof userPermissions?.delete === "string"
                  ? userPermissions.delete.split(":")
                  : []
                ).includes("st")}
                isOnlyAdmin={userType === ROLES.ADMIN}
                isSignAvailable={
                  (i.employeeSignature ||
                    extractSignFromSigner(
                      i?.signers,
                      i.employeeId?._id,
                      hoursFormats,
                    )) &&
                  userType === ROLES.EMPLOYEE
                    ? false
                    : true
                }
                signatureButton={userType === ROLES.EMPLOYEE}
              />
            ),
          ];
          if (isAdmin)
            result?.splice(
              2,
              0,
              i?.employeeSignature ||
                extractSignFromSigner(
                  i?.signers,
                  i.employeeId._id,
                  hoursFormats,
                  false,
                  true,
                )
                ? "Yes"
                : "No",
            );
          return result;
        })
      : [];
  const tHead = ["Hours completed", "Verified By", "Employee Name", "Action"];
  if (isAdmin) tHead?.splice(2, 0, "Employee Training Completion");
  return (
    <>
      <TrainingAssignModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
        formkey="sktc"
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={getAllData}
        onDelete={({ additionalFunctions }) =>
          trainingService.skillAndKnowledge.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      <CreateNav
        title={"Skills and Knowledge Training"}
        link={"/create-skill-training"}
        isAuthorizedToCreate={isAdmin ? true : false}
        setModalShow={setModalShow}
        url={urlPath}
      />

      <Container className="full-width-container">
        <TableLayout thead={tHead} tbody={dataList} loading={loading} />
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
  Wcomponenet: SkillsList,
});
