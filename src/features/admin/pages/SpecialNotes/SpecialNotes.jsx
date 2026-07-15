/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  OverlayTrigger,
  Popover,
  Table,
} from "react-bootstrap";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { ClipLoader } from "react-spinners";
import "@/assets/styles/Print.css";
import { formatDateWithoutUTCHandleToMMDDYYYY } from "@/utils/utils";
import { removeApi, specialNotesService } from "@/features/shared/services";
import HOC from "@/features/shared/layout/Outer/HOC";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { clearAllSignatureDrafts } from "@/store/signatureDraftSlice";
import NavWrapper from "@/utils/NavWrapper";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import { specialNotesListNames } from "@/features/shared/constants";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import SpecialNotesModal from "./SpecialNotesModal";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { COMMON_APIS } from "@/features/shared/services";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const SpecialNotes = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(userProfile);
  const hoursFormat = currentUser?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const [show, setShow] = useState(false);
  const [addContactBtn, setAddContactBtn] = useState("add");
  const [editStatus, setEditStatus] = useState(false);
  const [vanEmergency, setVanEmergency] = useState({});
  const [overlayShow, setOverlayShow] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUrl, setDeleteUrl] = useState(null);
  const handleHideAndDateReset = (hide) => {
    setStartDate("");
    setEndDate("");
    hide();
  };
  const deleteDataHandler = (item) => {
    setShowDeleteModal(true);
    setDeleteUrl(
      COMMON_APIS.GET_BASE_API_2(
        item?.name === "Water Temperature Log"
          ? "temperature-log"
          : "employee/deleteNotes",
        item?._id,
      ),
    );
  };
  const { data, isLoading: loading } = useQuery({
    queryKey: queryKeys.specialNotes.list({ page, limit, debouncedQuery }),
    queryFn: () => specialNotesService.list({ page, limit, debouncedQuery }),
    placeholderData: keepPreviousData,
  });

  const queryClient = useQueryClient();
  const getAllData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.specialNotes.all() });
  }, [queryClient]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (data?.data?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [data?.data?.length, page]);
  const viewContactBtnMap = {
    fireEquipementMonitoring: "free",
    firstAidChecklist: "addE",
    evacuationAndFireDrill: "addEv",
    disasterDrill: "addEvd",
    disasterPlanReview: "addEvdd",
    WeeklyVehicleInspectionChecklist: "wee1",
    vanEmergencyInformationForm: "vanemer",
    MonthlyVehicleInspection: "mvi",
    qualityManagement: "qmanagement",
    infectiousData: "inf",
    incidentReport: "inte",
    RefregiratorTemparatureMonitoring: "refView",
    "Water Temperature Log": "waterView",
  };

  const handleViewNotes = (name, item, id) => {
    dispatch(clearAllSignatureDrafts());

    if (viewContactBtnMap[name]) {
      setAddContactBtn(viewContactBtnMap[name]);
      setModalShow(true);
    }
  };
  function formatAndWrap(name, facillityAddress) {
    const formattedName = specialNotesListNames?.[name];
    return facillityAddress ? (
      <span>
        {formattedName} - {facillityAddress}
      </span>
    ) : (
      <span>{formattedName}</span>
    );
  }
  return (
    <>
      {modalShow && (
        <SpecialNotesModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          getAllData={getAllData}
          setModalShow={setModalShow}
          vanEmergency={vanEmergency}
          editStatus={editStatus}
          setEditStatus={setEditStatus}
          addContactBtn={addContactBtn}
          currentUser={currentUser}
          printRef={printRef}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          hoursFormat={hoursFormat}
          setShow={setShow}
          handleHideAndDateReset={handleHideAndDateReset}
        />
      )}

      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={getAllData}
        deleteUrl={deleteUrl}
      ></DeleteDocModal>
      <NavWrapper title={" Special Notes"} isArrow={true} />
      <Container>
        <Row className="mt-3">
          <Col xs={12} md={6} lg={4}>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Control
                type="text"
                placeholder="Search"
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                onDragStart={(event) => event.preventDefault()}
                onDrop={(event) => event.preventDefault()}
              />
            </Form.Group>
          </Col>

          <Col xs="auto" className="ml-auto">
            <OverlayTrigger
              trigger="click"
              key={"bottom"}
              placement={"bottom"}
              show={overlayShow}
              overlay={
                <Popover
                  id={`popover-positioned-${"bottom"}`}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  style={{ maxWidth: "400px", width: "350px" }}
                >
                  <Popover.Body className="h-[330px] overflow-auto min-w-[300px] pe-2 d-flex flex-column gap-3 py-3">
                    <p className="mb-0">
                      <span className="flex items-center justify-between font-bold gap-3">
                        <span>First Aid Checklist </span>
                        <img
                          onClick={() => {
                            setOverlayShow(false);
                            setAddContactBtn("add");
                            setModalShow(true);
                          }}
                          className="max-w-[25px] max-h-[25px] cursor-pointer"
                          src="/special/add.png"
                          alt="special"
                        />
                      </span>
                    </p>
                    <p className="mb-0">
                      <span className="flex items-center justify-between font-bold gap-3">
                        <span>Fire Equipment Monitoring</span>
                        <img
                          onClick={() => {
                            setOverlayShow(false);
                            setAddContactBtn("fire");
                            setModalShow(true);
                          }}
                          className="max-w-[25px] max-h-[25px] cursor-pointer"
                          src="/special/add.png"
                          alt="special"
                        />
                      </span>
                    </p>
                    <p className="mb-0">
                      <span className="flex items-center justify-between font-bold gap-3">
                        <span>Evacuation Drill Report</span>
                        <img
                          onClick={() => {
                            setOverlayShow(false);
                            setAddContactBtn("eva");
                            setModalShow(true);
                          }}
                          className="max-w-[25px] max-h-[25px] cursor-pointer"
                          src="/special/add.png"
                          alt="special"
                        />
                      </span>
                    </p>
                    <p className="mb-0">
                      <span className="flex items-center justify-between font-bold gap-3">
                        <span>Disaster Drill</span>
                        <img
                          onClick={() => {
                            setOverlayShow(false);
                            setAddContactBtn("dis");
                            setModalShow(true);
                          }}
                          className="max-w-[25px] max-h-[25px] cursor-pointer"
                          src="/special/add.png"
                          alt="special"
                        />
                      </span>
                    </p>
                    <p className="mb-0">
                      <span className="flex items-center justify-between font-bold gap-3">
                        <span>Weekly Vehicle Inspection</span>
                        <img
                          onClick={() => {
                            setOverlayShow(false);
                            setAddContactBtn("wee");
                            setModalShow(true);
                          }}
                          className="max-w-[25px] max-h-[25px] cursor-pointer"
                          src="/special/add.png"
                          alt="special"
                        />
                      </span>
                    </p>
                    <p className="mb-0">
                      <span className="flex items-center justify-between font-bold gap-3">
                        <span>Monthly Vehicle Inspection</span>
                        <img
                          onClick={() => {
                            setOverlayShow(false);
                            setAddContactBtn("veh");
                            setModalShow(true);
                          }}
                          className="max-w-[25px] max-h-[25px] cursor-pointer"
                          src="/special/add.png"
                          alt="special"
                        />
                      </span>
                    </p>
                    <p className="mb-0">
                      <span className="flex items-center justify-between font-bold gap-3">
                        <span>Van Emergency Information</span>
                        <img
                          onClick={() => {
                            setOverlayShow(false);
                            setAddContactBtn("van");
                            setModalShow(true);
                          }}
                          className="max-w-[25px] max-h-[25px] cursor-pointer"
                          src="/special/add.png"
                          alt="special"
                        />
                      </span>
                    </p>
                    <p className="mb-0">
                      <span className="flex items-center justify-between font-bold gap-3">
                        <span>Quality Management Data Reports</span>
                        <img
                          onClick={() => {
                            setOverlayShow(false);
                            setAddContactBtn("quality");
                            setModalShow(true);
                          }}
                          className="max-w-[25px] max-h-[25px] cursor-pointer"
                          src="/special/add.png"
                          alt="special"
                        />
                      </span>
                    </p>
                    <p className="mb-0">
                      <span className="flex items-center justify-between font-bold gap-3">
                        <span>Infectous Data</span>
                        <img
                          onClick={() => {
                            setOverlayShow(false);
                            setAddContactBtn("dinfectousData");
                            setModalShow(true);
                          }}
                          className="max-w-[25px] max-h-[25px] cursor-pointer"
                          src="/special/add.png"
                          alt="special"
                        />
                      </span>
                    </p>
                    <p className="mb-0">
                      <span className="flex items-center justify-between font-bold gap-3">
                        <span>Disaster Plan Review</span>
                        <img
                          onClick={() => {
                            setOverlayShow(false);
                            setAddContactBtn("disasterPlan");
                            setModalShow(true);
                          }}
                          className="max-w-[25px] max-h-[25px] cursor-pointer"
                          src="/special/add.png"
                          alt="special"
                        />
                      </span>
                    </p>
                    <p className="mb-0">
                      <span className="flex items-center justify-between font-bold gap-3">
                        <span>Refrigerator Temperature Monitoring</span>
                        <img
                          onClick={() => {
                            setOverlayShow(false);
                            setAddContactBtn("ref");
                            setModalShow(true);
                          }}
                          className="max-w-[25px] max-h-[25px] cursor-pointer"
                          src="/special/add.png"
                          alt="special"
                        />
                      </span>
                    </p>
                    <p className="mb-0">
                      <span className="flex items-center justify-between font-bold gap-3">
                        <span>Water Temperature Log</span>
                        <img
                          onClick={() => {
                            setOverlayShow(false);
                            setAddContactBtn("waterTemp");
                            setModalShow(true);
                          }}
                          className="max-w-[25px] max-h-[25px] cursor-pointer"
                          src="/special/add.png"
                          alt="special"
                        />
                      </span>
                    </p>
                  </Popover.Body>
                </Popover>
              }
            >
              <Button
                disabled={currentUser?.accountType === ACCOUNT_TYPES.RESTRICTED}
                onClick={() => {
                  dispatch(clearAllSignatureDrafts());
                  setEditStatus(false);
                  setVanEmergency({});
                  setAddContactBtn(true);
                  setOverlayShow(!overlayShow);
                }}
                variant="primary"
                className="theme-button"
              >
                + ADD NEW
              </Button>
            </OverlayTrigger>
          </Col>
        </Row>

        <div className="special-notes-table">
          <Table responsive bordered>
            <thead>
              <tr>
                <th>Name</th>
                <th colSpan={2}>Created On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-2">
                    <ClipLoader color="rgb(26, 159, 178)" />
                  </td>
                </tr>
              ) : !data?.data?.docs?.length ? (
                <tr>
                  <td colSpan="4" className="text-center p-0">
                    <NoFound />
                  </td>
                </tr>
              ) : (
                data?.data?.docs?.map((item, index) => {
                  const isAdmin =
                    currentUser?.userType === ROLES.ADMIN ||
                    currentUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR;
                  const isRegularOrRestrictedEmployee =
                    (currentUser?.accountType === ACCOUNT_TYPES.REGULAR ||
                      currentUser?.accountType === ACCOUNT_TYPES.RESTRICTED) &&
                    currentUser?.userType === ROLES.EMPLOYEE;
                  const hasViewPermission =
                    isRegularOrRestrictedEmployee &&
                    currentUser.userPermissions?.view
                      ?.split(":")
                      .includes("spn");
                  const canViewSpecialNotes = isAdmin || hasViewPermission;

                  const isPendingSigner =
                    item?.signers?.filter?.(
                      (signer) =>
                        signer.signerId === currentUser?._id &&
                        !signer?.signature?.length,
                    )?.length > 0;
                  const hasEditPermission =
                    currentUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                    currentUser?.userType === ROLES.EMPLOYEE &&
                    currentUser.userPermissions?.edit
                      ?.split(":")
                      .includes("spn");
                  const canEditSpecialNotes =
                    isPendingSigner || isAdmin || hasEditPermission;

                  const hasDeletePermission =
                    currentUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                    currentUser?.userType === ROLES.EMPLOYEE &&
                    currentUser.userPermissions?.delete
                      ?.split(":")
                      .includes("spn");
                  const canDeleteSpecialNotes = isAdmin || hasDeletePermission;

                  const editContactBtnMap = {
                    fireEquipementMonitoring: "fire",
                    firstAidChecklist: "add",
                    evacuationAndFireDrill: "eva",
                    disasterDrill: "dis",
                    disasterPlanReview: "disasterPlan",
                    WeeklyVehicleInspectionChecklist: "wee",
                    vanEmergencyInformationForm: "van",
                    MonthlyVehicleInspection: "veh",
                    qualityManagement: "quality",
                    infectiousData: "dinfectousData",
                    incidentReport: "inst",
                    RefregiratorTemparatureMonitoring: "ref",
                    "Water Temperature Log": "waterTemp",
                  };

                  return (
                    <tr key={index}>
                      <td>
                        {item?.data?.[item?.data?.length - 1]
                          ?.facilityAddress ||
                        item?.data?.[item?.data?.length - 1]?.location
                          ? formatAndWrap(
                              item.name,
                              item?.data?.[item?.data?.length - 1]
                                ?.facilityAddress ||
                                item?.data?.[item?.data?.length - 1]?.location,
                            )
                          : item?.facilityAddress ||
                              item?.facititAddress ||
                              item?.location
                            ? formatAndWrap(
                                item.name,
                                item?.facilityAddress ||
                                  item?.facititAddress ||
                                  item?.location,
                              )
                            : formatAndWrap(item.name)}
                      </td>

                      <td colSpan={2}>
                        <div className="d-flex align-items-center">
                          {formatDateWithoutUTCHandleToMMDDYYYY(item.createdAt)}
                        </div>
                      </td>
                      <td>
                        <div className="icon-joiner">
                          {canViewSpecialNotes && (
                            <span
                              onClick={() => {
                                setVanEmergency(item);
                                handleViewNotes(item.name);
                              }}
                              className="view-btn"
                            >
                              <FaEye />
                            </span>
                          )}
                          {canEditSpecialNotes && (
                            <span className="edit-btn">
                              <FaRegEdit
                                onClick={() => {
                                  setOverlayShow(false);
                                  setEditStatus(true);
                                  setVanEmergency(item);
                                  if (editContactBtnMap[item?.name]) {
                                    setAddContactBtn(
                                      editContactBtnMap[item?.name],
                                    );
                                    setModalShow(true);
                                  }
                                }}
                              />
                            </span>
                          )}

                          {canDeleteSpecialNotes && (
                            <span className="del-btn">
                              <RiDeleteBin5Fill
                                onClick={() => deleteDataHandler(item)}
                              />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
        {data?.data?.docs?.length > 0 && (
          <PaginationsPage
            page={page}
            setPage={setPage}
            totalPages={data?.data?.totalPages && data?.data?.totalPages}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: SpecialNotes,
});
