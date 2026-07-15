/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { employmentService } from "@/features/shared/services";
import { Link } from "react-router-dom";
import Loader from "@/features/shared/ui/Loader/Loader";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import CreateNav from "@/utils/CreateNav";
import { fetchPaitentName, formatDateToMMDDYYYY } from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { DashComponent } from "@/features/shared/ui/HelpingComponents";
import { FaFileSignature } from "react-icons/fa";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { useAppendixList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

const AllAppendix = () => {
  const { _id, userType, accountType, userPermissions } =
    useSelector(userProfile);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = useAppendixList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const invalidateList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.appendix.all() });
  }, [queryClient]);

  useEffect(() => {
    if (response?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.docs?.length, page]);

  const items = response?.docs;
  const deleteHandler = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };
  return (
    <>
      <CreateNav
        title={"TB Risk Assessment"}
        link={"/appendix"}
        isAuthorizedToCreate={
          userType === ROLES.ADMIN
            ? false
            : userType === ROLES.PATIENT
              ? false
              : true
        }
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={invalidateList}
        onDelete={({ additionalFunctions }) =>
          employmentService.appendix.remove({
            id: deleteId,
            additionalFunctions,
          })
        }
      ></DeleteDocModal>
      {loading ? (
        <Loader />
      ) : items?.length > 0 ? (
        <Container>
          <Table responsive bordered>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Resident</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items?.map(
                (item, index) =>
                  item.employeeId && (
                    <tr key={index}>
                      <td
                        className={`${item?.employeeName?.firstName ? "" : "text-center"}`}
                      >
                        {fetchPaitentName(item?.employeeName) ?? (
                          <DashComponent />
                        )}
                      </td>
                      <td> {formatDateToMMDDYYYY(item?.nameDate)} </td>
                      <td
                        className={`${item?.resident?.firstName ? "" : "text-center"}`}
                      >
                        {fetchPaitentName(item?.resident) ?? <DashComponent />}
                      </td>
                      <td>
                        <div className="icon-joiner">
                          <Link
                            className="view-btn"
                            to={
                              userType === ROLES.PATIENT
                                ? `/view-appendix-resident/${item?._id}`
                                : `/view-appendix/${item?._id}`
                            }
                          >
                            <i className="fa-solid fa-eye" />
                          </Link>
                          {(((item?.employeeId?._id || item?.employeeId) ===
                            _id &&
                            !item?.employeeSignature?.length) ||
                            item?.signers?.filter?.(
                              (signer) =>
                                signer.signerId === _id &&
                                !signer?.signature?.length,
                            )?.length ||
                            userType === ROLES.ADMIN ||
                            accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                            (accountType === ACCOUNT_TYPES.REGULAR &&
                              userType === ROLES.EMPLOYEE &&
                              userPermissions?.edit
                                ?.split(":")
                                ?.includes("app"))) && (
                            <Link
                              className="edit-btn"
                              to={
                                userType === ROLES.PATIENT
                                  ? `/sign-appendix-resident/${item?._id}`
                                  : `/sign-appendix/${item?._id}`
                              }
                            >
                              {userType === ROLES.GUARDIAN ||
                              userType === ROLES.PATIENT ? (
                                <FaFileSignature />
                              ) : (
                                <i className="fa-solid fa-edit" />
                              )}
                            </Link>
                          )}

                          {(userType === ROLES.ADMIN ||
                            accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                            (accountType === ACCOUNT_TYPES.REGULAR &&
                              userType === ROLES.EMPLOYEE &&
                              userPermissions?.delete
                                ?.split(":")
                                ?.includes("app"))) && (
                            <Link
                              className="del-btn"
                              onClick={() => deleteHandler(item?._id)}
                            >
                              <i className="fa-solid fa-trash-can" />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ),
              )}
            </tbody>
          </Table>
          {response?.docs?.length > 0 && (
            <PaginationsPage
              page={page}
              setPage={setPage}
              totalPages={response?.totalPages ?? 1}
              limit={limit}
              setLimit={setLimit}
            />
          )}
        </Container>
      ) : (
        <Container>
          <NoFound msg={"No Data Found"} />
        </Container>
      )}
    </>
  );
};
export default AllAppendix;
