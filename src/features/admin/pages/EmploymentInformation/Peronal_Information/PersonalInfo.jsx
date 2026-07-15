/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { employmentService } from "@/features/shared/services";
import { Link } from "react-router-dom";
import Loader from "@/features/shared/ui/Loader/Loader";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import CreateNav from "@/utils/CreateNav";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { usePersonalInfoList } from "@/features/shared/services/queries";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

const PersonalInfo = () => {
  const { userType, accountType, userPermissions } = useSelector(userProfile);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: response, isLoading: loading } = usePersonalInfoList(
    { page, limit },
    { placeholderData: keepPreviousData },
  );

  const queryClient = useQueryClient();

  const invalidateList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.personalInfo.all() });
  }, [queryClient]);

  useEffect(() => {
    if (response?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [response?.docs?.length, page]);

  const isAdmin = userType === ROLES.ADMIN;
  let items = response?.docs;
  if (!Array.isArray(items) && items !== undefined) {
    items = [items];
  }
  const deleteHandler = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };
  return (
    <>
      <CreateNav
        title={"Personal Information"}
        link={"/create-personal-information"}
        isAuthorizedToCreate={isAdmin ? false : true}
      />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={invalidateList}
        onDelete={({ additionalFunctions }) =>
          employmentService.personalInfo.delete({
            id: deleteId,
            isAdmin,
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
                <th>Date</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item, index) => (
                <tr key={index}>
                  <td> {formatDateToMMDDYYYY(item?.date)} </td>
                  <td> {item?.firstName} </td>
                  <td> {item?.lastName} </td>
                  <td>
                    <div className="icon-joiner">
                      {(userType === ROLES.ADMIN ||
                        accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                        ((accountType === ACCOUNT_TYPES.REGULAR ||
                          accountType === ACCOUNT_TYPES.RESTRICTED) &&
                          userType === ROLES.EMPLOYEE &&
                          userPermissions?.view
                            ?.split(":")
                            .includes("PI"))) && (
                        <Link
                          className="view-btn"
                          to={`/view-employee-information/${isAdmin ? item?.employeeId?._id : item?.employeeId?._id}`}
                        >
                          <i className="fa-solid fa-eye" />
                        </Link>
                      )}

                      {(userType === ROLES.ADMIN ||
                        accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                        (accountType === ACCOUNT_TYPES.REGULAR &&
                          userType === ROLES.EMPLOYEE &&
                          userPermissions?.edit
                            ?.split(":")
                            .includes("PI"))) && (
                        <Link
                          className="edit-btn"
                          to={
                            isAdmin
                              ? `/dashboard/Personal-Information/${item?.employeeId?._id}`
                              : `/personal-information`
                          }
                        >
                          <i className="fa-solid fa-edit" />
                        </Link>
                      )}
                      {(userType === ROLES.ADMIN ||
                        accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                        (accountType === ACCOUNT_TYPES.REGULAR &&
                          userType === ROLES.EMPLOYEE &&
                          userPermissions?.delete
                            ?.split(":")
                            .includes("PI"))) && (
                        <Link className="del-btn">
                          <i
                            className="fa-solid fa-trash-can"
                            onClick={() => deleteHandler(item?.employeeId?._id)}
                          />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {items.length > 0 && (
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
export default HOC({
  Wcomponenet: PersonalInfo,
});
