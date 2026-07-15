/** @format */

import { useCallback, useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Table,
  Button,
} from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { trainingService } from "@/features/shared/services";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AddSignature,
  deletePermission,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import DatePicker from "react-datepicker";
import { DashComponent } from "@/features/shared/ui/HelpingComponents";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage.jsx";
import DeleteModal from "@/features/shared/ui/Mod/DeleteModal/DeleteModal.jsx";
import EmployeeComponent from "@/features/shared/ui/Search/EmployeeComponent";
import { DEFAULT_PAGE_SIZE, ROLES } from "@/features/shared/constants";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
const dropDownOptions = [
  {
    value: "Chain of Command",
    label: "Chain of Command",
  },
  {
    value: "Resident Rights",
    label: "Resident Rights",
  },
  {
    value:
      "Immediately report suspected or alleged abuse, neglect, or exploitation or a violation of a resident’s rights.",
    label:
      "Immediately report suspected or alleged abuse, neglect, or exploitation or a violation of a resident’s rights.",
  },
  {
    value: "Program evacuation path/Safety Disaster Plan",
    label: "Program evacuation path/Safety Disaster Plan",
  },
  {
    value: "Ethics/professionalism",
    label: "Ethics/professionalism",
  },
  {
    value: "Residents' activities/treatment schedule",
    label: "Residents' activities/treatment schedule",
  },
  {
    value: "Current Resident issues",
    label: "Current Resident issues",
  },
  {
    value: "Personnel – payroll, benefits, disciplinary process",
    label: "Personnel – payroll, benefits, disciplinary process",
  },
  {
    value: "Supervision",
    label: "Supervision",
  },
  {
    value: "Training Plan",
    label: "Training Plan",
  },
  {
    value: "Policy and Procedure Manual",
    label: "Policy and Procedure Manual",
  },
  {
    value: "Use of facility equipment",
    label: "Use of facility equipment",
  },
  {
    value:
      "Documentation in the medical record, and how information is protected",
    label:
      "Documentation in the medical record, and how information is protected",
  },
  {
    value: "Confidentiality/HIPAA",
    label: "Confidentiality/HIPAA",
  },
  {
    value: "Incident and Accident reporting",
    label: "Incident and Accident reporting",
  },
  {
    value: "Job description",
    label: "Job description",
  },
  {
    value: "Program Rules",
    label: "Program Rules",
  },
  {
    value:
      "Procedures for responding to a fire, disaster, hazard, a medical emergency, and a resident experiencing a crisis situation",
    label:
      "Procedures for responding to a fire, disaster, hazard, a medical emergency, and a resident experiencing a crisis situation",
  },
  {
    value: "Infectious diseases and bloodborne pathogens",
    label: "Infectious diseases and bloodborne pathogens",
  },
  {
    value: "Sexual Harassment - Q & A's",
    label: "Sexual Harassment - Q & A's",
  },
  {
    value: "Personal Protective Equipment",
    label: "Personal Protective Equipment",
  },
  {
    value: "Fire Safety",
    label: "Fire Safety",
  },
];
const OnSiteForm = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [employeeSignature, setEmployeeSignature] = useState("");
  const [employeeDate, setEmployeeDate] = useState("");
  const [trainerSignature, setTrainerSignature] = useState("");
  const [trainerDate, setTrainerDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [arr, setArr] = useState([]);
  const [traineeTime, setTraineeTime] = useState("");
  const [employeeTime, setEmployeeTime] = useState("");
  const { id, employeeId: routeEmployeeId } = useParams();
  const isEdit = Boolean(id || routeEmployeeId);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [data, setData] = useState({});
  const [signers, setSigners] = useState([]);
  const [openSigner, setOpenSigner] = useState(false);
  const [employeeSaveAsDraft, setEmployeeSaveAsDraft] = useState(false);
  const navigate = useNavigate();
  const [values, setValues] = useState([]);
  const [adminSignature, setAdminSignature] = useState("");
  const [adminDateSigned, setAdminDateSigned] = useState("");
  const [adminSignedTime, setAdminSignedTime] = useState("");
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [tablePayload, setTablePayload] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [rowData, setRowData] = useState({});
  const queryClient = useQueryClient();
  const arrPayload = {
    createdAt: new Date(),
    date,
    duration,
    title: values,
  };
  const pushInArr = () => {
    setTablePayload((prev) => [arrPayload, ...prev]);
    setArr((prev) => [arrPayload, ...prev]);
    setDuration("");
    setValues([]);
  };
  const removeRow = () => {
    setModalShow(true);
  };
  const payload = {
    training: tablePayload?.map((i) => ({
      createdAt: i.createdAt,
      date: i.date,
      duration: i.duration || "0",
      title: i.title,
    })),
    description,
    employeeSignature,
    employeeDate,
    trainerSignature,
    trainerDate,
    employeeTime,
    adminSignature,
    adminDateSigned,
    adminSignedTime,
    employeeSaveAsDraft,
    traineeTime,
    signers,
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const invalidateOnSite = () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.onSite.all() });
    };
    if (isEdit) {
      trainingService.onsiteFacility.update(id || routeEmployeeId, payload, {
        setLoading,
        navigate,
        additionalFunctions: [invalidateOnSite],
      });
    } else {
      await trainingService.createOnsiteFacility(
        selectedEmployeeId,
        {
          ...payload,
          employeeId: selectedEmployeeId,
          signers: (signers || []).map((signer) => ({
            signerId: signer.value,
            name: signer.label,
            signature: "",
            dateSigned: "",
            signedTime: "",
          })),
        },
        {
          setLoading,
          navigate,
          additionalFunctions: [invalidateOnSite],
        },
      );
    }
  };
  const fetchHandler = useCallback(() => {
    if (!isEdit) return;
    trainingService.getOnsiteDetail({
      id,
      employeeId: routeEmployeeId,
      page,
      limit,
      setResponse: setData,
      setLoading,
    });
  }, [routeEmployeeId, id, limit, page, isEdit]);
  useEffect(() => {
    if (!isEdit) return;
    fetchHandler();
    if (data?.data?.training?.docs?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [data?.data?.training?.docs?.length, fetchHandler, page, isEdit]);
  useEffect(() => {
    if (data) {
      const item = data?.data;
      setDescription(item?.description);
      setEmployeeDate(item?.employeeDate);
      setEmployeeSignature(item?.employeeSignature);
      setTrainerSignature(item?.trainerSignature);
      setTrainerDate(item?.trainerDate);
      setEmployeeTime(item?.employeeTime);
      setTraineeTime(item?.traineeTime);
      if (item?.training?.docs?.length > 0) {
        setArr(item?.training?.docs);
      } else {
        setArr([]);
      }
      setAdminSignature(item?.adminSignature);
      setAdminDateSigned(item?.adminDateSigned);
      setAdminSignedTime(item?.adminSignedTime);
      setSigners(item?.signers);
    }
  }, [data]);
  const checkSign = useCallback(async () => {
    let signerIndex = signers?.findIndex?.(
      (signer, i) => signer.signerId === profileInfo._id,
    );
    let isSignerValid =
      signerIndex !== -1 && signers?.[signerIndex]?.signature?.length > 0;
    let isAdminConditionValid = profileInfo.userType === ROLES.ADMIN;
    let isEmployeeConditionValid =
      (data?.data?.employeeId === profileInfo?._id ||
        data?.data?.employeeId?._id === profileInfo?._id) &&
      employeeSignature?.length > 0;
    let signerGuadianIndex = signers?.findIndex?.((signer, i) =>
      profileInfo.patientsAssigned?.includes(signer.signerId),
    );
    let isGuadianConditionValid =
      signerGuadianIndex !== -1 &&
      signers?.[signerGuadianIndex]?.signature?.length > 0;
    if (
      isSignerValid ||
      isAdminConditionValid ||
      isEmployeeConditionValid ||
      isGuadianConditionValid
    ) {
      setIsSubmitEnabled(true);
    } else {
      setIsSubmitEnabled(false);
    }
  }, [
    signers,
    profileInfo.userType,
    profileInfo._id,
    profileInfo.patientsAssigned,
    data?.data?.employeeId,
    employeeSignature?.length,
  ]);
  useEffect(() => {
    if (id || routeEmployeeId) {
      checkSign();
    }
  }, [employeeSignature, adminSignature, id, checkSign, routeEmployeeId]);
  let signerIndex = signers?.findIndex?.(
    (signer, i) => signer.signerId === profileInfo._id,
  );
  if (signerIndex === undefined || signerIndex === null) signerIndex = -1;
  function setSignerSignature(sign) {
    if (signerIndex !== -1)
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          signature: sign,
        };
        return newSigners;
      });
  }
  function setSignerDate(date) {
    if (signerIndex !== -1) {
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          dateSigned: date,
        };
        return newSigners;
      });
    }
  }
  function setSignerTime(time) {
    if (signerIndex !== -1) {
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          signedTime: time,
        };
        return newSigners;
      });
    }
  }
  const editSignHandler = (sign) => {
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
      setSignerSignature(sign);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setSigners((prevSigners) => {
        const signerIndex = prevSigners.findIndex(
          (signer) => signer.signerId === profileInfo?._id,
        );
        if (signerIndex !== -1) {
          const updatedSigners = [...prevSigners];
          updatedSigners[signerIndex] = {
            ...updatedSigners[signerIndex],
            signature: sign,
          };
          return updatedSigners;
        } else {
          return [
            ...prevSigners,
            {
              signerId: profileInfo._id,
              signature: sign,
              dateSigned: "",
              signedTime: "",
            },
          ];
        }
      });
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignature(sign);
    }
  };
  const editDateHandler = (date) => {
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
      setSignerDate(date);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setSigners((prevSigners) => {
        const signerIndex = prevSigners.findIndex(
          (signer) => signer.signerId === profileInfo?._id,
        );
        if (signerIndex !== -1) {
          const updatedSigners = [...prevSigners];
          updatedSigners[signerIndex] = {
            ...updatedSigners[signerIndex],
            dateSigned: date,
          };
          return updatedSigners;
        } else {
          return [
            ...prevSigners,
            {
              signerId: profileInfo._id,
              signature: "",
              dateSigned: date,
              signedTime: "",
            },
          ];
        }
      });
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminDateSigned(date);
    }
  };
  const editTimeHandler = (time) => {
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
      setSignerTime(time);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setEmployeeTime(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignedTime(time);
    }
  };
  const canDelete = deletePermission(profileInfo, "onsfov");
  return (
    <>
      <AddSignature
        show={openSigner}
        setValue={(sign) =>
          data?.data?.employeeId === profileInfo?._id
            ? setEmployeeSignature(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          data?.data?.employeeId === profileInfo?._id
            ? setEmployeeDate(date)
            : editDateHandler(date)
        }
        setTime={(time) =>
          data?.data?.employeeId === profileInfo?._id
            ? setEmployeeTime(time)
            : editTimeHandler(time)
        }
      />
      {isEdit && (
        <DeleteModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          url={"onsite-facility"}
          id={id}
          row={rowData}
          fetchHandler={fetchHandler}
          tablepayload={setTablePayload}
          responsetable={setArr}
        />
      )}

      <NavWrapper
        title={"On Site and Facility Orientation Verification"}
        isArrow={true}
      />

      <Container
        className={
          profileInfo?.userType === ROLES.EMPLOYEE && "pointer-events-none"
        }
      >
        <Form onSubmit={submitHandler}>
          {!isEdit && profileInfo?.userType === ROLES.ADMIN && (
            <Row className="mb-2">
              <Col xs={12}>
                <EmployeeComponent MainPatientId={setSelectedEmployeeId} />
              </Col>
            </Row>
          )}
          <Card body className="mb-3">
            <Row className="mb-2">
              <Col xs={12}>
                <Form.Label className="fw-bold">
                  The following orientation trainings are conducted during the 1
                  st week of hire and before providing services to residents.
                </Form.Label>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs={12}>
                <CustomMultiSelectInput
                  multiselect={true}
                  value={values}
                  onChange={(value) => setValues(value)}
                  options={dropDownOptions}
                />
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs={12}>
                <Form.Label className="fw-bold">
                  Document more than one training date and duration of training
                  if training occurs more than in one time period.
                </Form.Label>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col xs={12} lg={6}>
                <Form.Group className="mb-3 d-flex flex-column">
                  <Form.Label className="fw-bold">Training Date</Form.Label>
                  <DatePicker
                    selected={formatDateToMMDDYYYY(date)}
                    onChange={(selectedDate) =>
                      setDate(selectedDate?.toDateString())
                    }
                    dateFormat="MM/dd/yyyy"
                    placeholderText="MM/DD/YYYY"
                    highlightDates={[
                      {
                        "react-datepicker__day--highlighted-custom": [
                          date ? formatDateToMMDDYYYY(date) : new Date(),
                        ],
                      },
                    ]}
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Duration</Form.Label>
                  <Form.Control
                    onChange={(e) => setDuration(e.target.value)}
                    value={duration}
                    type="text"
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Row className="mb-3 text-center">
            <Col xs={12}>
              <Button
                className="theme-button"
                onClick={() => pushInArr()}
                type="button"
              >
                Add More
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {arr?.length > 0 && (
                <Table responsive bordered>
                  <thead>
                    <tr>
                      <th>Training Date</th>
                      <th>Duration</th>
                      <th>Training</th>
                      {canDelete && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {arr
                      ?.slice()
                      ?.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                      )
                      ?.map((i, index) => (
                        <tr key={index}>
                          <td className={`${i?.date ? "" : "text-center"}`}>
                            {" "}
                            {(i.date && formatDateToMMDDYYYY(i.date)) || (
                              <DashComponent />
                            )}{" "}
                          </td>
                          <td> {i.duration || 0} </td>
                          <td
                            className={`${i?.title?.length ? "" : "text-center"}`}
                          >
                            <ul className="ps-3 mt-2 mb-0">
                              {i?.title?.length ? (
                                i.title?.map((i, index) => (
                                  <li className="mb-2 list-disc" key={index}>
                                    {i.label}
                                  </li>
                                ))
                              ) : (
                                <span className="me-2">
                                  <DashComponent />
                                </span>
                              )}
                            </ul>
                          </td>

                          {canDelete && (
                            <td>
                              <div className="icon-joiner">
                                <Link
                                  className="del-btn"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeRow();
                                    setRowData(i);
                                  }}
                                >
                                  {" "}
                                  <i className="fa-solid fa-trash" />{" "}
                                </Link>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </Table>
              )}
            </Col>
          </Row>
          {data.data?.training?.docs?.length > 0 && (
            <PaginationsPage
              page={page}
              setPage={setPage}
              totalPages={
                data?.data?.training?.totalPages &&
                data?.data?.training?.totalPages
              }
              limit={limit}
              setLimit={setLimit}
            />
          )}

          <Row className="mb-3">
            <Col xs={12}>
              <Form.Label className="fw-bold">Employee signature</Form.Label>
              <Row className="mb-3">
                <Col xs={12} lg={6}>
                  <Button
                    type="button"
                    className="theme-button pointer-events-auto"
                    onClick={() => setOpenSigner(true)}
                  >
                    SAVED AND SIGNED
                  </Button>
                </Col>
                <Col xs={12} lg={6}>
                  {signatureFormat({
                    sign: employeeSignature,
                    date: employeeDate,
                    time: employeeTime,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: adminSignature,
                    date: adminDateSigned,
                    time: adminSignedTime,
                    hoursFormat,
                  })}
                  <div>
                    {signers?.map(
                      (signer) =>
                        signer.signature && (
                          <div key={signer?.signerId}>
                            {signatureFormat({
                              sign: signer.signature,
                              date: signer.dateSigned,
                              time: signer.signedTime,
                              hoursFormat,
                            })}
                          </div>
                        ),
                    )}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <div className="employee-btn-joiner mt-3 mt-md-4 pointer-events-auto">
                {data?.data?.employeeSaveAsDraft && (
                  <button
                    className="draft"
                    type="submit"
                    onClick={() => setEmployeeSaveAsDraft(true)}
                  >
                    Save as Draft
                  </button>
                )}
                <button
                  className="employee_create_btn mt-5"
                  type="submit"
                  disabled={!isSubmitEnabled}
                >
                  {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
                </button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: OnSiteForm,
});
