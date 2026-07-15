/** @format */
import React from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "@/features/shared/ui/Loader/Loader";
import { DocumentUploader } from "@/features/shared/ui/Mod/Modal";
import {
  convertTimeFormat,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  getFormattedDateTime,
} from "@/utils/utils";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FilterByDate } from "@/utils/FilterByDate";
import { SearchAndSelect } from "@/utils/SearchAndSelect";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import NoFound from "@/features/shared/ui/Loader/NoFound";
import PDFModal from "@/features/shared/ui/Mod/PdfProcessModal";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
import { TYPE_MAP } from "./searchPageConstants";

const typeMap = TYPE_MAP;

const SearchPageContent = ({
  printRef,
  componentRef,
  id,
  show,
  setShow,
  fetchDocument,
  type,
  info,
  navigate,
  tabs,
  typeSelector,
  loading,
  profileUser,
  optionsToDisplay,
  documentsFilterStartDate,
  documentsFilterEndDate,
  setDocumentsFilterStartDate,
  setDocumentsFilterEndDate,
  hideFilter,
  documentTypes,
  setDocumentTypes,
  setPage,
  downloadAllHandler,
  renderRows,
  totalDocumentPages,
  page,
  limit,
  setLimit,
  vitals,
  vitalsFilterStartDate,
  vitalsFilterEndDate,
  setVitalsFilterStartDate,
  setVitalsFilterEndDate,
  hoursFormat,
  deleteVitals,
  medicationFilterStartDate,
  medicationFilterEndDate,
  setMedicationFilterStartDate,
  setMedicationFilterEndDate,
  searchMedication,
  setSearchMedication,
  MEDICATION_OPTION,
  renderMedRows,
  totalMedPages,
  schedule,
  scheduleFilterDate,
  setScheduleFilterDate,
  schedulePage,
  setSchedulePage,
  scheduleLimit,
  setScheduleLimit,
  intakeFilterStartDate,
  intakeFilterEndDate,
  setIntakeFilterStartDate,
  setIntakeFilterEndDate,
  searchIntake,
  setSearchIntake,
  INTAKE_OPTION,
  renderIntakeRows,
  totalIntakesPages,
  vitalPage,
  setVitalPage,
  vitalLimit,
  setVitalLimit,
  print,
  downloading,
  setDownloading,
  showIfPresent,
}) => {
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <DocumentUploader
        patitentId={id}
        show={show}
        onHide={() => setShow(false)}
        fetchDocument={fetchDocument}
      />
      <Container>
        <div className="search-page" ref={componentRef}>
          <h1 className="pdfTitle my-2 hidden text-[26px] font-semibold">
            {type === "Info" && "Resident Information"}
            {type === "Vitals" && "Resident Vitals"}
            {type === "Schedule" && "Resident Appointments"}
          </h1>
          <div className="page-title-bar mb-3 hidePrint">
            <Row className="align-items-center">
              <Col xs={2} lg="3">
                <div className="d-flex align-items-center">
                  <img
                    onClick={() => navigate(-1)}
                    src="/back_button2.png"
                    alt=""
                    className="arrow cursor-pointer me-1 me-md-3"
                  />
                  <p className="m-0 fw-bold d-none d-md-inline-block">Back</p>
                </div>
              </Col>
              <Col xs={8} lg="6">
                <p className="heading mb-sm-0">
                  Resident : {fetchPaitentName(info?.data)}
                </p>
              </Col>
              <Col xs={2} lg="3"></Col>
            </Row>
          </div>
          <div className="tabs-list hidePrint">
            <ul>
              {tabs?.map((i, index) => (
                <li
                  key={`tab${index}`}
                  className={
                    type === i.type
                      ? "active font-bold underline underline-offset-4"
                      : ""
                  }
                  onClick={() =>
                    typeSelector({
                      type: i.type,
                      func: i.func,
                    })
                  }
                >
                  {i.title}
                </li>
              ))}
            </ul>
          </div>

          {type === "Info" && (
            <div className="">
              <div className="resident-name-facesheet justify-content-start hidden">
                <Form.Label className="fw-bold">Resident Name : </Form.Label>
                <Form.Label className="ms-1">
                  {fetchPaitentName(info?.data)}
                </Form.Label>
              </div>
              <Form.Label className="fw-bold hidePrint">
                Resident Information{" "}
              </Form.Label>
              <div className="view-details">
                {showIfPresent({
                  label: "Legal Name",
                  value: fetchPaitentName(info?.data),
                })}

                {showIfPresent({
                  label: "Email",
                  value: info?.data?.email,
                })}
                {showIfPresent({
                  label: "Admit Date",
                  value:
                    info?.data?.admitDate &&
                    formatDateToMMDDYYYY(info?.data?.admitDate),
                })}
                {showIfPresent({
                  label: "AHCCCS ID",
                  value: info?.data?.ahcccsId,
                })}
                {showIfPresent({
                  label: "Gender",
                  value: info?.data?.gender,
                })}

                {showIfPresent({
                  label: "Company Name",
                  value: info?.data?.companyName,
                })}
                {showIfPresent({
                  label: "Mobile Phone",
                  value: info?.data?.mobileNumber,
                })}
                {showIfPresent({
                  label: "Date of Birth",
                  value:
                    info?.data?.dateOfBirth &&
                    formatDateToMMDDYYYY(info?.data?.dateOfBirth),
                })}
                {showIfPresent({
                  label: "Address",
                  value: info?.data?.address,
                })}
                {showIfPresent({
                  label: "Allergies and Reactions",
                  value: info?.patientDetail?.allergies,
                })}
              </div>
            </div>
          )}

          {type === "Documents" &&
            (loading ? (
              <Loader />
            ) : (
              <div className="print">
                <div className="d-md-flex flex-wrap gap-2 justify-content-end mb-2 hidePrint">
                  <FilterByDate
                    setFromStartDate={setDocumentsFilterStartDate}
                    setFromEndDate={setDocumentsFilterEndDate}
                    fromStartDate={documentsFilterStartDate}
                    fromEndDate={documentsFilterEndDate}
                    onHide={hideFilter}
                  />
                  <SearchAndSelect
                    text="Search Documents"
                    options={optionsToDisplay}
                    selectedValue={documentTypes}
                    setSelectedValue={setDocumentTypes}
                    setPage={setPage}
                  />
                  <Button
                    className={`theme-button self-end p-1 max-md:!mt-3`}
                    onClick={() => downloadAllHandler()}
                  >
                    <>
                      <i className="fa-solid fa-cloud-arrow-down"></i>
                      <span className="inline-block ml-1">Download All</span>
                    </>
                  </Button>
                  {(profileUser?.userType === ROLES.ADMIN ||
                    profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
                    (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                      profileUser?.userType === ROLES.EMPLOYEE &&
                      profileUser.userPermissions?.view
                        ?.split(":")
                        .includes("uf"))) && (
                    <Button
                      className="theme-button self-end p-1 max-md:!mt-3 "
                      onClick={() => setShow(true)}
                    >
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                      <span className="inline-block ml-1">
                        Upload Resident File
                      </span>
                    </Button>
                  )}
                </div>

                <Table responsive bordered>
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Date</th>
                      <th>Signature</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>{renderRows}</tbody>
                </Table>
                <div className="hidePrint">
                  <PaginationsPage
                    page={page}
                    setPage={setPage}
                    totalPages={totalDocumentPages}
                    limit={limit}
                    setLimit={setLimit}
                  />
                </div>
              </div>
            ))}

          {type === "Vitals" &&
            (loading ? (
              <Loader />
            ) : !vitals?.data?.length ? (
              <NoFound />
            ) : (
              <>
                <div className="d-sm-flex justify-between items-center gap-4 mb-2">
                  <div className="resident-name-facesheet justify-content-start">
                    <Form.Label className="fw-bold">
                      Resident Name :{" "}
                    </Form.Label>
                    <Form.Label className="ms-1">
                      {" "}
                      {fetchPaitentName(info?.data)}
                    </Form.Label>
                  </div>

                  <div className="hidePrint">
                    <FilterByDate
                      setFromStartDate={setVitalsFilterStartDate}
                      setFromEndDate={setVitalsFilterEndDate}
                      fromStartDate={vitalsFilterStartDate}
                      fromEndDate={vitalsFilterEndDate}
                      onHide={hideFilter}
                    />
                  </div>
                </div>
                <Table responsive bordered>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Body Temp</th>
                      <th>Pulse Rate</th>
                      <th>Respiration Rate</th>
                      <th>Blood Pressure Systolic/Diastolic</th>
                      <th>Blood Oxygen</th>
                      <th>Weight</th>
                      <th>Height</th>
                      <th>Blood Glucose Level</th>
                      <th>Signature</th>
                      {(profileUser?.userType === ROLES.ADMIN ||
                        profileUser?.accountType ===
                          ACCOUNT_TYPES.ADMINISTRATOR ||
                        (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                          profileUser?.userType === ROLES.EMPLOYEE &&
                          profileUser.userPermissions?.edit
                            ?.split(":")
                            .includes("rv")) ||
                        profileUser?.userType === ROLES.ADMIN ||
                        profileUser?.accountType ===
                          ACCOUNT_TYPES.ADMINISTRATOR ||
                        (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                          profileUser?.userType === ROLES.EMPLOYEE &&
                          profileUser.userPermissions?.delete
                            ?.split(":")
                            .includes("rv"))) && (
                        <th className="hidePrint">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="search-tbody">
                    {vitals?.data
                      ?.filter((i) => {
                        const createdAt = new Date(i?.createdAt);
                        const startDate = vitalsFilterStartDate
                          ? new Date(vitalsFilterStartDate)
                          : null;
                        const endDate = vitalsFilterEndDate
                          ? new Date(vitalsFilterEndDate)
                          : null;
                        if (startDate && endDate) {
                          return createdAt >= startDate && createdAt <= endDate;
                        }
                        return i;
                      })
                      ?.sort((a, b) => new Date(b?.date) - new Date(a?.date))
                      ?.map((i, index) => (
                        <tr key={`vital${index}`}>
                          <td> {formatDateToMMDDYYYY(i.date)} </td>
                          <td>{convertTimeFormat(i?.time, hoursFormat)}</td>
                          <td>{i?.bodyTemperature} °F</td>
                          <td>{i?.pulseRate} bpm</td>
                          <td>{i?.respirationRate}</td>
                          <td>{i?.bloodPressure} mmHg</td>
                          <td>{i?.bloodOxygen} %</td>
                          <td>{i?.weight} lbs</td>
                          <td>{i?.height} ft/inch</td>
                          <td>{i?.bloodGlucoseLevel} mm/dl</td>
                          <td>
                            {i?.bhpSignature
                              ? `${i?.bhpSignature} ${getFormattedDateTime(i?.bhpSignatureDate, hoursFormat)}`
                              : ""}
                          </td>
                          {(profileUser?.userType === ROLES.ADMIN ||
                            profileUser?.accountType ===
                              ACCOUNT_TYPES.ADMINISTRATOR ||
                            (profileUser?.accountType ===
                              ACCOUNT_TYPES.REGULAR &&
                              profileUser?.userType === ROLES.EMPLOYEE &&
                              profileUser.userPermissions?.edit
                                ?.split(":")
                                .includes("rv")) ||
                            profileUser?.userType === ROLES.ADMIN ||
                            profileUser?.accountType ===
                              ACCOUNT_TYPES.ADMINISTRATOR ||
                            (profileUser?.accountType ===
                              ACCOUNT_TYPES.REGULAR &&
                              profileUser?.userType === ROLES.EMPLOYEE &&
                              profileUser.userPermissions?.delete
                                ?.split(":")
                                .includes("rv"))) && (
                            <td className="hidePrint">
                              <div className="icon-joiner">
                                {(profileUser?.userType === ROLES.ADMIN ||
                                  profileUser?.accountType ===
                                    ACCOUNT_TYPES.ADMINISTRATOR ||
                                  (profileUser?.accountType ===
                                    ACCOUNT_TYPES.REGULAR &&
                                    profileUser?.userType === ROLES.EMPLOYEE &&
                                    profileUser.userPermissions?.edit
                                      ?.split(":")
                                      .includes("rv"))) && (
                                  <Link
                                    className="edit-btn"
                                    to={
                                      profileUser?.userType === ROLES.EMPLOYEE
                                        ? `/employee-edit-vital/${i?._id}`
                                        : `/edit-vital/${i?._id}`
                                    }
                                  >
                                    <FaEdit />
                                  </Link>
                                )}

                                {(profileUser?.userType === ROLES.ADMIN ||
                                  profileUser?.accountType ===
                                    ACCOUNT_TYPES.ADMINISTRATOR ||
                                  (profileUser?.accountType ===
                                    ACCOUNT_TYPES.REGULAR &&
                                    profileUser?.userType === ROLES.EMPLOYEE &&
                                    profileUser.userPermissions?.delete
                                      ?.split(":")
                                      .includes("rv"))) && (
                                  <Link className="del-btn">
                                    <RiDeleteBin5Fill
                                      onClick={() => {
                                        deleteVitals(i?._id);
                                      }}
                                    />
                                  </Link>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </>
            ))}

          {type === "Medications" &&
            (loading ? (
              <Loader />
            ) : (
              <div>
                <div className="mb-2 d-sm-flex gap-2 justify-content-end hidePrint">
                  <FilterByDate
                    setFromStartDate={setMedicationFilterStartDate}
                    setFromEndDate={setMedicationFilterEndDate}
                    fromStartDate={medicationFilterStartDate}
                    fromEndDate={medicationFilterEndDate}
                    onHide={hideFilter}
                  />
                  <SearchAndSelect
                    options={MEDICATION_OPTION}
                    selectedValue={searchMedication}
                    setSelectedValue={setSearchMedication}
                    text={"Search Medications"}
                  />
                  <Button
                    className={`theme-button self-end p-1 max-md:!mt-3`}
                    onClick={() => downloadAllHandler()}
                  >
                    <>
                      <i className="fa-solid fa-cloud-arrow-down"></i>
                      <span className="inline-block ml-1">Download All</span>
                    </>
                  </Button>
                </div>
                <Table responsive bordered>
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Date</th>
                      <th>Signature</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>{renderMedRows}</tbody>
                </Table>
                <div className="hidePrint">
                  <PaginationsPage
                    page={page}
                    setPage={setPage}
                    totalPages={totalMedPages}
                    limit={limit}
                    setLimit={setLimit}
                  />
                </div>
              </div>
            ))}

          {type === "Schedule" &&
            (loading ? (
              <Loader />
            ) : (
              <div>
                <div className="flex-container font-arial-print">
                  <div className="resident-name-facesheet justify-content-start hidden items-center">
                    <Form.Label className="fw-bold">
                      Resident Name :{" "}
                    </Form.Label>
                    <Form.Label className="ms-1">
                      {" "}
                      {fetchPaitentName(info?.data)}
                    </Form.Label>
                  </div>
                </div>
                {schedule?.data?.docs?.length > 0 && (
                  <>
                    <div className="d-sm-flex gap-2 items-center flex-wrap justify-between mb-2">
                      <Form.Label className="fw-bold">
                        Past Appointments (Total :{" "}
                        {schedule.data?.pastAppointmentsCount}){" "}
                      </Form.Label>
                      <div className="hidePrint">
                        <FilterByDate
                          setFromStartDate={(value) =>
                            setScheduleFilterDate((prev) => ({
                              ...prev,
                              pastStartDate: value,
                            }))
                          }
                          setFromEndDate={(value) =>
                            setScheduleFilterDate((prev) => ({
                              ...prev,
                              pastEndDate: value,
                            }))
                          }
                          fromStartDate={scheduleFilterDate.pastStartDate}
                          fromEndDate={scheduleFilterDate.pastEndDate}
                          onHide={hideFilter}
                        />
                      </div>
                    </div>
                    <Table responsive bordered>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Reason for visit</th>
                          <th> Time </th>
                          <th> Date </th>
                          <th> Contact Number </th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule?.data?.docs
                          ?.filter((i) => {
                            const createdAt = new Date(i?.date);
                            const startDate = scheduleFilterDate.pastStartDate
                              ? new Date(scheduleFilterDate.pastStartDate)
                              : null;
                            const endDate = scheduleFilterDate.pastEndDate
                              ? new Date(scheduleFilterDate.pastEndDate)
                              : null;
                            if (startDate && endDate) {
                              return (
                                createdAt >= startDate &&
                                createdAt <= endDate &&
                                i.type === "Past"
                              );
                            }
                            return i.type === "Past";
                          })
                          ?.map((i, index) => (
                            <tr key={`pastAppointments${index}`}>
                              <td> {i.name} </td>
                              <td> {i.reasonForVisit} </td>
                              <td>
                                {" "}
                                {convertTimeFormat(i.time, hoursFormat)}{" "}
                              </td>
                              <td>
                                {" "}
                                {i.date && formatDateToMMDDYYYY(i.date)}{" "}
                              </td>
                              <td>{i.contactNumber}</td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </>
                )}

                {schedule?.data?.docs?.length > 0 && (
                  <>
                    <div className="flex gap-2 items-center justify-start mb-2">
                      <Form.Label className="fw-bold">
                        Upcoming Appointments (Total :{" "}
                        {schedule?.data?.upcomingAppointmentsCount}){" "}
                      </Form.Label>
                    </div>
                    {schedule?.data?.upcomingAppointmentsCount > 0 && (
                      <Table responsive bordered>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Reason for visit</th>
                            <th> Time </th>
                            <th> Date </th>
                            <th> Contact Number </th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedule?.data?.docs
                            ?.filter((i) => {
                              const createdAt = new Date(i?.date);
                              const startDate = scheduleFilterDate.pastStartDate
                                ? new Date(scheduleFilterDate.pastStartDate)
                                : null;
                              const endDate = scheduleFilterDate.pastEndDate
                                ? new Date(scheduleFilterDate.pastEndDate)
                                : null;
                              if (startDate && endDate) {
                                return (
                                  createdAt >= startDate &&
                                  createdAt <= endDate &&
                                  i.type === "Upcoming"
                                );
                              }
                              return i.type === "Upcoming";
                            })
                            ?.map((i, index) => (
                              <tr key={`upcomingAppointments${index}`}>
                                <td> {i.name} </td>
                                <td> {i.reasonForVisit} </td>
                                <td>
                                  {" "}
                                  {convertTimeFormat(i.time, hoursFormat)}{" "}
                                </td>
                                <td>
                                  {" "}
                                  {i.date && formatDateToMMDDYYYY(i.date)}{" "}
                                </td>
                                <td>{i.contactNumber}</td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    )}
                  </>
                )}
              </div>
            ))}

          {type === "Schedule" && schedule?.data?.docs?.length > 0 && (
            <div className="hidePrint">
              <PaginationsPage
                page={schedulePage}
                setPage={setSchedulePage}
                totalPages={
                  schedule?.data?.totalPages && schedule?.data?.totalPages
                }
                limit={scheduleLimit}
                setLimit={setScheduleLimit}
              />
            </div>
          )}

          {type === "Intake" &&
            (loading ? (
              <Loader />
            ) : (
              <div>
                <div className="mb-2 d-sm-flex gap-2 justify-content-end hidePrint">
                  <FilterByDate
                    setFromStartDate={setIntakeFilterStartDate}
                    setFromEndDate={setIntakeFilterEndDate}
                    fromStartDate={intakeFilterStartDate}
                    fromEndDate={intakeFilterEndDate}
                    onHide={hideFilter}
                  />
                  <SearchAndSelect
                    text="Search Intakes"
                    options={INTAKE_OPTION}
                    selectedValue={searchIntake}
                    setSelectedValue={setSearchIntake}
                  />
                  <Button
                    className={`theme-button self-end p-1 max-md:!mt-3 `}
                    onClick={() => downloadAllHandler()}
                  >
                    <>
                      <i className="fa-solid fa-cloud-arrow-down"></i>
                      <span className="inline-block ml-1">Download All</span>
                    </>
                  </Button>
                </div>
                <Table responsive bordered>
                  <thead>
                    <tr>
                      <th className="text-start">Document</th>
                      <th className="text-start">Date</th>
                      <th className="text-start">Status</th>
                      <th className="text-start">Actions</th>
                    </tr>
                  </thead>
                  <tbody>{renderIntakeRows}</tbody>
                </Table>
                <div className="hidePrint">
                  <PaginationsPage
                    page={page}
                    setPage={setPage}
                    totalPages={totalIntakesPages}
                    limit={limit}
                    setLimit={setLimit}
                  />
                </div>
              </div>
            ))}

          {type === "Vitals" && vitals?.data?.length > 0 && (
            <div className="hidePrint">
              <PaginationsPage
                page={vitalPage}
                setPage={setVitalPage}
                totalPages={
                  vitals?.pagination?.totalPages &&
                  vitals?.pagination?.totalPages
                }
                limit={vitalLimit}
                setLimit={setVitalLimit}
              />
            </div>
          )}

          {!loading &&
            ((type === "Schedule" && schedule?.data?.docs?.length) ||
              (type === "Info" && info?.data) ||
              (type === "Vitals" && vitals?.data?.length)) && (
              <button
                className="print_btn mt-3 mt-md-4 hidePrint"
                type="button"
                onClick={print}
              >
                PRINT REPORT
              </button>
            )}
        </div>
      </Container>
      {downloading && (
        <PDFModal
          open={downloading}
          handleClose={() => setDownloading(false)}
          // documents={selectedFormType?.length>0 ? selectedFormType : typeMap[type]  || []}
          documents={typeMap[type] || []}
          panel="Employee"
        />
      )}
    </div>
  );
};

export default SearchPageContent;
