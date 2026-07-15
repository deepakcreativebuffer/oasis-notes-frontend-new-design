/* eslint-disable no-unused-vars, eqeqeq */
/** @format */

import React, { useCallback, useEffect, useState } from "react";
import {
  Container,
  Modal,
  Table,
  Row,
  Col,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import { BorderlessSelect } from "@/utils/Makers";
import { medicationService } from "@/features/shared/services";
import { ClipLoader } from "react-spinners";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import {
  convertTimeFormat,
  formatDateToMMDDYYYY,
  signatureFormat,
  fetchPaitentName,
  getFormattedDateTime,
} from "@/utils/utils";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { useParams } from "react-router-dom";
import { getMarsDataByMonthAndYear } from "@/features/shared/services";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { residentService } from "@/features/shared/services";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
import { downloadReport, showNotification } from "@/utils";
const options = [
  {
    value: "H",
    label: "Hospital (H) ",
  },
  {
    value: "HP",
    label: "Home Pass (HP)",
  },
  {
    value: "RM",
    label: "Refused Med (RM)",
  },
  {
    value: "HO",
    label: "On Hold per Provider’s Orders (HO)",
  },
  {
    value: "UN",
    label: "Unavailable (documentation required) (UN)",
  },
];
const Mars = () => {
  const pageUrl = useLocation().pathname;
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const [patientId, setPatientId] = useState("");
  const [patientData, setPatinentData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalShowRefill, setModalShowRefill] = useState(false);
  const [timeStatusId, setTimeStatusId] = useState("");
  const [dateToUpdate, setDateToUpdate] = useState("");
  const [marsId, setMarsId] = useState("");
  const [prevData, setPrevData] = useState({});
  const [patientDetail, setPatientDetail] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [uniqueColors, setUniqueColors] = useState({});
  const [marsDateList, setMarsDateList] = useState({});
  const [isMarsLoading, setIsMarsLoading] = useState(false);
  const { id: pramId } = useParams();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [dateslist, setDatesList] = useState([]);
  const [residentName, setResidentName] = useState("");
  const [updatedYearMars, setUpdatedYearMars] = useState("");
  const [updatedMonthMars, setUpdatedMonthMars] = useState("");
  const [data, setData] = useState({});
  const [isExist, setIsExist] = useState(false);
  const [employeeDataOptions, setEmployeeOptions] = useState([]);
  const [initialsSignature, setInitialsSignature] = useState({});
  useEffect(() => {
    if (pageUrl === "/mars-resident") {
      setPatientId(profile._id);
    } else if (pramId) setPatientId(pramId);
  }, [pageUrl, pramId, profile._id]);
  useEffect(() => {
    medicationService.mars.getActiveEmployees({
      setResponse: (response) => {
        if (response.data) {
          const employeeData = response.data
            ?.filter((item) => item.userType === ROLES.EMPLOYEE)
            ?.map((item) => {
              const name = item.firstName
                .charAt(0)
                .toUpperCase()
                .concat(item.lastName.charAt(0).toUpperCase());
              return {
                value: name,
                label: name,
                id: item._id,
                tooltip: `${item.firstName} ${item.lastName}`,
              };
            });
          setEmployeeOptions(employeeData);
        }
      },
    });
  }, []);
  useEffect(() => {
    const colorsMap = {};
    patientData?.data?.medications?.forEach((medication, medicationIndex) => {
      medication?.medicationStatus?.forEach((day, dayIndex) => {
        day?.timeStatus?.forEach((timeObj, timeIndex) => {
          const { color, time } = timeObj;

          // Create a unique identifier for each time
          const uniqueTime = `${time}-${medicationIndex}-${dayIndex}`;
          if (!colorsMap[color]) {
            colorsMap[color] = [];
          }
          colorsMap[color].push(uniqueTime); // Store unique time in the map
        });
      });
    });
    setUniqueColors(colorsMap);
    setMonth(
      updatedMonthMars ||
        (patientData?.data && Number(patientData?.data?.month)),
    );
    setYear(
      updatedYearMars || (patientData?.data && Number(patientData?.data?.year)),
    );
    setDatesList(patientData?.data?.dates);
    if (pageUrl === "/mars-resident") {
      setResidentName(patientData?.data?.residentName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientData, pageUrl]);
  useEffect(() => {
    if (pageUrl !== "/mars-resident") {
      const nextmonthExist = shouldShowCarryForwardButton(
        dateslist,
        patientData?.data?.month,
        patientData?.data?.year,
      );
      setIsExist(nextmonthExist);
    }
  }, [dateslist, pageUrl, patientData?.data?.month, patientData?.data?.year]);
  const getAllDataPatient = useCallback(() => {
    if (updatedYearMars && updatedMonthMars) {
      clickHandler(updatedYearMars, updatedMonthMars);
    } else
      medicationService.mars.getByPatient(patientId, {
        setResponse: setPatinentData,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, updatedMonthMars, updatedYearMars]);
  useEffect(() => {
    if (pageUrl === "/mars-resident") {
      if (updatedYearMars && updatedMonthMars) {
        clickHandler(updatedYearMars, updatedMonthMars);
      } else
        medicationService.mars.getPatientMars({
          setResponse: setPatinentData,
        });
    } else if (patientId) {
      getAllDataPatient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, getAllDataPatient, pageUrl]);
  useEffect(() => {
    if (patientData?.data?.dates) setMarsDateList(patientData?.data?.dates);
  }, [patientData?.data?.dates, patientDetail]);
  function getLuminance(hexColor) {
    const rgb = parseInt(hexColor?.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    // Convert to relative luminance
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance;
  }
  function isColorDark(hexColor) {
    const luminance = getLuminance(hexColor);
    return luminance < 128; // Threshold for determining light or dark
  }
  const statusReturner = ({
    time,
    data,
    mainId,
    color,
    status,
    isRowDisabled,
    overrideInitials,
  }) => {
    if (data) {
      const newCode = data?.timeStatus?.find(
        (item) => item?.time?.toLowerCase() === time?.toLowerCase(),
      );
      const dark = isColorDark(color);
      return (
        <td
          onClick={() => {
            if (
              ((profile?.userType === ROLES.ADMIN ||
                (profile?.accountType === ACCOUNT_TYPES.REGULAR &&
                  profile?.userType === ROLES.EMPLOYEE &&
                  profile?.userPermissions?.edit
                    ?.split(":")
                    .includes("mars")) ||
                (profile?.accountType === ACCOUNT_TYPES.ADMINISTRATOR &&
                  profile?.userType === ROLES.EMPLOYEE)) &&
                !newCode?.status &&
                !newCode?.initials) ||
              ((profile?.userType === ROLES.ADMIN ||
                (profile?.accountType === ACCOUNT_TYPES.ADMINISTRATOR &&
                  profile?.userType === ROLES.EMPLOYEE)) &&
                newCode?.initials)
            ) {
              setDateToUpdate(data?._id);
              setTimeStatusId(newCode?._id);
              setMarsId(mainId);
              setPrevData(newCode);
              setModalShow(true);
              setInitialsSignature(
                newCode?.adminSignature || newCode?.employeeSignature
                  ? {
                      adminSignature: newCode?.adminSignature || "",
                      employeeSignature: newCode?.employeeSignature || "",
                    }
                  : {},
              );
            }
          }}
          style={{
            backgroundColor: color,
            border: "1px solid #fff",
            padding: "1px",
            pointerEvents: overrideInitials === "-" && "all",
          }}
        >
          <div className={`normal-div text-${dark ? "white" : "black"}`}>
            {newCode?.status && (
              <span className="fw-bold"> {newCode?.status}</span>
            )}
            {
              <span className="initials-text">
                {newCode?.initials ? newCode?.initials : overrideInitials || ""}
              </span>
            }
          </div>
        </td>
      );
    }
  };

  // update status
  function UpdateStatusModal(props) {
    const [timeStatusToUpdate, setTimeStatusToUpdate] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [initials, setInitials] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [employeeSignature, setEmployeeSignature] = useState([]);
    const [adminSignature, setAdminSignature] = useState({});
    const [signaturePayload, setSignaturePayload] = useState({});
    const [isDeleted, setIsDeleted] = useState(false);
    useEffect(() => {
      if (props.signature) {
        setEmployeeSignature(props.signature?.employeeSignature || []);
        setAdminSignature(props.signature?.adminSignature || {});
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    async function updateSignature() {
      const employeeName = profile && fetchPaitentName(profile);
      const employeePosition = profile?.position;
      const employeeSign = `${employeeName} ${profile.userType === ROLES.ADMIN ? "Admin" : employeePosition}`;
      let payload;
      if (profile.userType === ROLES.ADMIN) {
        const updatedAdminSignature = {
          ...adminSignature,
          signature: employeeSign,
          dateSigned: new Date(),
          signerId: profile._id,
        };
        setAdminSignature(updatedAdminSignature);
        payload = {
          employeeSignature,
          adminSignature: updatedAdminSignature,
          marsId: patientData?.data?._id,
        };
      } else {
        const updatedSignature = employeeSignature.some(
          (item) => item.signerId === profile._id,
        )
          ? employeeSignature.map((item) =>
              item.signerId === profile._id
                ? {
                    ...item,
                    dateSigned: new Date(),
                    signature: employeeSign,
                    signerId: profile._id,
                  }
                : item,
            )
          : [
              ...employeeSignature,
              {
                signerId: profile._id,
                dateSigned: new Date(),
                signature: employeeSign,
              },
            ];
        setEmployeeSignature(updatedSignature);
        payload = {
          employeeSignature: updatedSignature,
          adminSignature,
          marsId: patientData?.data?._id,
        };
      }
      setSignaturePayload(payload);
    }
    const payload = {
      employeeId,
      dateToUpdate,
      timeStatusId,
      timeStatusToUpdate,
      initials,
      signaturePayload: {
        employeeSignature,
        adminSignature,
      },
    };
    const additionalFunctions = [props.onHide, getAllDataPatient];
    const submitHandler = (e) => {
      e.preventDefault();
      medicationService.mars.updateStatus(marsId, payload, {
        setLoading: setSubmitLoading,
        successMsg: "Status Update",
        additionalFunctions,
      });
    };
    useEffect(() => {
      if (props.show) {
        setInitials(prevData?.initials);
        setTimeStatusToUpdate(prevData?.status);
        const selectedOption = employeeDataOptions.find(
          (opt) => opt.value === prevData?.initials,
        );
        if (selectedOption) {
          setEmployeeId(selectedOption.id);
        }
      }
    }, [props]);
    const deleteHandler = async (
      medicationId,
      medicationStatusId,
      timeStatusId,
    ) => {
      if (medicationId && medicationStatusId && timeStatusId) {
        await residentService.deleteInitials(
          medicationId,
          medicationStatusId,
          timeStatusId,
        );
        getAllDataPatient();
      }
      setIsDeleted(false);
      setModalShow(false);
    };
    return (
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h6 className="fw-bold mb-0">{`${isDeleted ? "Delete Initials" : "Update"}`}</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isDeleted ? (
            <Form className="w-100">
              <Row>
                <Col xs={12} md={12} xl={12}>
                  <Form.Group className="mb-3">
                    <h5 className="text-danger text-center">
                      This action will permanently delete the initials. Are you
                      sure you want to proceed ?
                    </h5>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="justify-content-center mt-3 pt-3 border-top">
                <Col xs={12} sm={12} md={12} xl={12} className="text-center">
                  <button
                    className="btn btn-danger mx-1"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteHandler(marsId, dateToUpdate, timeStatusId);
                    }}
                  >
                    {submitLoading ? <ClipLoader color="#fff" /> : "Delete"}
                  </button>
                  <button
                    className="btn theme-button-outline mx-1"
                    onClick={() => setIsDeleted(false)}
                  >
                    Cancel
                  </button>
                </Col>
              </Row>
            </Form>
          ) : (
            <Form className="w-100 text-start" onSubmit={submitHandler}>
              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Initials :</Form.Label>
                    <BorderlessSelect
                      required={true}
                      options={employeeDataOptions}
                      setState={setInitials}
                      value={initials}
                      isOtherState={true}
                      setOtherState={setEmployeeId}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Status :</Form.Label>
                    <BorderlessSelect
                      options={options}
                      setState={setTimeStatusToUpdate}
                      value={timeStatusToUpdate}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="!my-8">
                <Col xs={12} lg={6}>
                  {(profile.userType === ROLES.ADMIN ||
                    (profile.userType === ROLES.EMPLOYEE &&
                      profile.accountType === ACCOUNT_TYPES.ADMINISTRATOR) ||
                    (profile.userType === ROLES.EMPLOYEE &&
                      profile.accountType === ACCOUNT_TYPES.REGULAR &&
                      profile?.userPermissions?.edit
                        ?.split(":")
                        .includes("mars"))) && (
                    <Button
                      type="button"
                      className="theme-button"
                      onClick={updateSignature}
                      disabled={
                        profile.userType === ROLES.ADMIN
                          ? adminSignature.signature?.length > 0
                          : employeeSignature.some(
                              (item) =>
                                item.signerId === profile._id &&
                                item.signature?.length > 0,
                            )
                      }
                    >
                      SAVED AND SIGNED
                    </Button>
                  )}
                </Col>
                <Col xs={12} lg={6} className="text-right">
                  {signatureFormat({
                    sign: adminSignature.signature,
                    date: adminSignature.dateSigned,
                    hoursFormat,
                  })}
                  {employeeSignature.map(
                    (signer) =>
                      signer.signature && (
                        <div key={signer.signerId}>
                          {signatureFormat({
                            sign: signer.signature,
                            date: signer.dateSigned,
                            hoursFormat,
                          })}
                        </div>
                      ),
                  )}
                </Col>
              </Row>
              <Row className="justify-content-center mt-3 pt-3 border-top">
                <Col
                  xs={12}
                  sm={12}
                  md={
                    (profile.userType === ROLES.ADMIN ||
                      (profile.userType === ROLES.EMPLOYEE &&
                        profile.accountType === ACCOUNT_TYPES.ADMINISTRATOR)) &&
                    (prevData?.initials || prevData?.status)
                      ? 12
                      : 12
                  }
                  xl={
                    (profile.userType === ROLES.ADMIN ||
                      (profile.userType === ROLES.EMPLOYEE &&
                        profile.accountType === ACCOUNT_TYPES.ADMINISTRATOR)) &&
                    (prevData?.initials || prevData?.status)
                      ? 12
                      : 12
                  }
                  className="text-center"
                >
                  <button
                    className="btn theme-button mx-1"
                    type="submit"
                    disabled={
                      profile.userType === ROLES.ADMIN
                        ? !adminSignature?.signature ||
                          adminSignature?.signature.length === 0
                        : !employeeSignature.some(
                            (item) =>
                              item.signerId === profile._id &&
                              item.signature &&
                              item.signature.length > 0,
                          )
                    }
                  >
                    {submitLoading ? <ClipLoader color="#fff" /> : "Submit"}
                  </button>
                  {(profile.userType === ROLES.ADMIN ||
                    (profile.userType === ROLES.EMPLOYEE &&
                      profile.accountType === ACCOUNT_TYPES.ADMINISTRATOR)) &&
                    (prevData?.initials || prevData?.status) && (
                      <button
                        className="btn btn-danger mx-1"
                        onClick={() => setIsDeleted(true)}
                      >
                        Delete
                      </button>
                    )}
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    );
  }
  function UpdateRefillModal(props) {
    const [submitLoading, setSubmitLoading] = useState(false);
    const [refillCount, setRefillCount] = useState("");
    const additionalFunctions = [props.onHide, getAllDataPatient];
    const submitHandler = (e) => {
      e.preventDefault();
      medicationService.mars.updateRefillCount(
        marsId,
        { refillCount: +refillCount },
        {
          setLoading: setSubmitLoading,
          successMsg: "Status Update",
          additionalFunctions,
        },
      );
    };
    useEffect(() => {
      if (props.show) {
        setRefillCount(prevData?.refillCount);
      }
    }, [props]);
    return (
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update Refill Count
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="w-100 text-start" onSubmit={submitHandler}>
            <Row>
              <Col xs={12} md={12} xl={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Refill Count :</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setRefillCount(value);
                      }
                    }}
                    value={refillCount}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <button className="employee_create_btn" type="submit">
              {submitLoading ? <ClipLoader color="#fff" /> : "Submit"}
            </button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
  const getColorByTime = (time, identifier) => {
    for (const [color, times] of Object.entries(uniqueColors)) {
      if (
        times.some((entry) => {
          // Split the entry string into time and identifier parts
          const [entryTime, ...entryIdentifierParts] = entry.split("-");
          const entryIdentifier = entryIdentifierParts.join("-");
          // Compare both time and identifier
          return entryTime === time && entryIdentifier === identifier;
        })
      ) {
        return color;
      }
    }

    // Return a default value if no match is found
    return null; // Or any default color
  };
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        patientData?.data?.patientId,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      patientData?.data?.patientId,
    ),
    pageStyle: `
     td ,th {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    @page {
      size: A4 landscape !important;  
      size: landscape !important;
    }    
    .card {
      page-break-inside: avoid;
    }
    .view-details-grid{
      page-break-inside: avoid;
    }
    .list-group{
      page-break-inside: avoid;
    }
`,
  });
  const handlePrint2 = () => {
    downloadReport(handlePrint);
  };
  const print = usePrint(printRef, handlePrint);
  const clickHandler = async (updatedYear, updatedMonth) => {
    const data = await getMarsDataByMonthAndYear(
      setPatinentData,
      patientId,
      {
        month: updatedMonth,
        year: updatedYear,
      },
      setIsMarsLoading,
    );
    if (data == "404" || data === "error") {
      setPatinentData(() => {
        return {
          ...patientData,
          data: {
            ...patientData?.data,
            medications: [],
            month: updatedMonth,
            year: updatedYear,
            dates: data?.data?.dates,
          },
        };
      });
      showNotification({
        message: "No Data Found",
        type: "info",
      });
    }
    setIsOpen(false);
  };
  const monthInEng = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const MonthHandler = (newMonth) => {
    let updatedYear = year;
    let updatedMonth = newMonth;
    if (newMonth > 12) {
      updatedYear = year + 1;
      updatedMonth = 1;
    } else if (newMonth < 1) {
      updatedYear = year - 1;
      updatedMonth = 12;
    }
    setYear(Number(updatedYear));
    setMonth(Number(updatedMonth));
    setUpdatedMonthMars(Number(updatedMonth));
    setUpdatedYearMars(Number(updatedYear));
    clickHandler(updatedYear, updatedMonth);
  };
  function shouldShowCarryForwardButton(dates, currentMonth, currentYear) {
    // Convert currentMonth to a number for calculations
    const month = parseInt(currentMonth, 10);
    const year = parseInt(currentYear, 10);

    // Calculate next month and year
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    // Check if the next month's medication exists in the dates array
    const nextMonthExists = dates?.some(
      (date) =>
        parseInt(date?.month, 10) === nextMonth &&
        parseInt(date?.year, 10) === nextYear,
    );

    // Return true if the button should be enabled (no entry for next month)

    return nextMonthExists;
  }
  const handleCarryForward = (marsId) => {
    medicationService.mars.forwardMedication(marsId, {
      setResponse: setData,
      showAlert: true,
    });
  };

  const renderAllergiesTable = (arr) => {
    let yes = null;
    let comment = "";
    if (arr && Array.isArray(arr) && arr.length > 0) {
      const allergy = arr[0];
      if (allergy) {
        yes = allergy.yes;
        comment = allergy.comments || "";
      }
    }

    return (
      <Col md={12} className="mb-3">
        <Table responsive="lg" bordered className="mb-0">
          <thead>
            <tr>
              <th>Condition</th>
              <th className="text-center">Yes</th>
              <th className="text-center">No</th>
              <th className="w-50">Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Allergies</td>
              <td className="text-center">
                <Form.Check
                  type="checkbox"
                  checked={yes === true}
                  readOnly
                  disabled
                />
              </td>
              <td className="text-center">
                <Form.Check
                  type="checkbox"
                  checked={yes === false}
                  readOnly
                  disabled
                />
              </td>
              <td>{comment}</td>
            </tr>
          </tbody>
        </Table>
      </Col>
    );
  };
  return (
    <div tabIndex={0} className="outline-none" ref={printRef}>
      <NavWrapper isArrow={true} title={"Medication Administration Record"} />
      <UpdateStatusModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        signature={initialsSignature}
      />
      <UpdateRefillModal
        show={modalShowRefill}
        onHide={() => setModalShowRefill(false)}
      />

      <Container>
        <div ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">
            Medication Administration Record
          </h1>
          <div className="view-details">
            <Row>
              <Col
                xs={12}
                sm={4}
                md={6}
                lg={4}
                xl={4}
                className={`${!patientData?.data?.residentName && "hidePrint"}`}
              >
                {pramId || pageUrl === "/mars-resident" ? (
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Resident Name: </p>
                    <h5 className="view-value mb-0">
                      {residentName
                        ? residentName
                        : patientData?.data?.residentName}
                    </h5>
                  </div>
                ) : (
                  <div className="view-details-grid d-block my-1 my-md-2 p-3">
                    <PatientComponent
                      MainPatientId={setPatientId}
                      setWholeData={setPatientDetail}
                      mars={true}
                    />
                  </div>
                )}
              </Col>
              <Col
                xs={12}
                sm={4}
                md={6}
                lg={4}
                xl={4}
                className={`${!patientData?.data?.patientId?.ahcccsId && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">AHCCCS ID : </p>
                  <h5 className="view-value mb-0">
                    {patientData?.data?.patientId?.ahcccsId}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={4}
                md={6}
                lg={4}
                xl={4}
                className={`${!patientData?.data?.patientId?.dateOfBirth && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">DOB : </p>
                  <h5 className="view-value mb-0">
                    {patientData?.data?.patientId?.dateOfBirth &&
                      formatDateToMMDDYYYY(
                        patientData?.data?.patientId?.dateOfBirth,
                      )}{" "}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={8}
                xl={8}
                className={`${!patientData?.data?.patientId?.diagnosis && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Diagnosis (specify if new or continuing) :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {patientData?.data?.patientId?.diagnosis}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={4}
                md={6}
                lg={4}
                xl={4}
                className={`${!patientData?.data?.patientId?.admitDate && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Admit Date : </p>
                  <h5 className="view-value mb-0">
                    {patientData?.data?.patientId?.admitDate &&
                      formatDateToMMDDYYYY(
                        patientData?.data?.patientId?.admitDate,
                      )}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={4}
                md={6}
                lg={4}
                xl={4}
                className={`${!patientDetail?.facilityAddress && !patientData?.data?.patientId?.facilityAddress && !patientData?.data?.location && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Facility Address : </p>
                  <h5 className="view-value mb-0">
                    {patientDetail?.facilityAddress ||
                      patientData?.data?.patientId?.facilityAddress ||
                      patientData?.data?.location}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={4}
                md={6}
                lg={4}
                xl={4}
                className={`${!patientData?.data?.patientId?.psychiatricProvider && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Psychiatric Provider Name :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {patientData?.data?.patientId?.psychiatricProvider}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={4}
                md={6}
                lg={4}
                xl={4}
                className={`${!patientData?.data?.patientId?.psychiatricProviderContact && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Psychiatric Provider Contact :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {patientData?.data?.patientId?.psychiatricProviderContact}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={4}
                md={6}
                lg={4}
                xl={4}
                className={`${!patientData?.data?.patientId?.psychiatricProviderAddress && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Psychiatric Provider Address :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {patientData?.data?.patientId?.psychiatricProviderAddress}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={4}
                md={6}
                lg={4}
                xl={4}
                className={`${!patientData?.data?.patientId?.primaryCareProvider && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Primary Care Provider Name :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {patientData?.data?.patientId?.primaryCareProvider ||
                      patientData?.data?.patientId?.primaryCareProvider}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={4}
                md={6}
                lg={4}
                xl={4}
                className={`${!patientData?.data?.patientId?.primaryCareProviderContact && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Primary Care Provider Contact :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {patientData?.data?.patientId?.primaryCareProviderContact}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={4}
                md={6}
                lg={4}
                xl={4}
                className={`${!patientData?.data?.patientId?.primaryCareProviderAddress && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Primary Care Provider Address :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {patientData?.data?.patientId?.primaryCareProviderAddress}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={4}
                md={6}
                lg={4}
                xl={4}
                className={`${!patientData?.data?.diet && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Diet : </p>
                  <h5 className="view-value mb-0">
                    {patientData?.data?.Diet || patientData?.data?.diet}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={4}
                md={6}
                lg={4}
                xl={4}
                className={`${!patientData?.data?.fluidRestriction && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Fluid restriction : </p>
                  <h5 className="view-value mb-0">
                    {patientData?.data?.fluidRestrictions ||
                      patientData?.data?.fluidRestriction}
                  </h5>
                </div>
              </Col>

              {renderAllergiesTable(patientData?.data?.patientId?.allergies)}
            </Row>
            <Row className="pdfTitle hidden">
              <Col>
                {" "}
                <p>
                  {monthInEng[month - 1]} {year}
                </p>
              </Col>
            </Row>
            <Row className="hidePrint mt-2">
              <Col xs={12}>
                <div className="monthOnLast fw-bold flex items-center justify-center">
                  {!isMarsLoading && (
                    <i
                      className="fa-solid fa-caret-left cursor-pointer text-[.8rem]"
                      onClick={() => MonthHandler(month - 1)}
                    ></i>
                  )}
                  <p className="m-0 text-[.8rem]">
                    {monthInEng[month - 1]} {year}
                  </p>
                  {!isMarsLoading && (
                    <i
                      className="fa-solid fa-caret-right cursor-pointer text-[.8rem]"
                      onClick={() => MonthHandler(month + 1)}
                    ></i>
                  )}

                  {!isMarsLoading && patientData?.data?._id && (
                    <div className="ml-5 flex items-center justify-center">
                      {!isExist &&
                        (profile.userType === ROLES.ADMIN ||
                          (profile.userType === ROLES.EMPLOYEE &&
                            profile.accountType ===
                              ACCOUNT_TYPES.ADMINISTRATOR)) && (
                          <button
                            className="employee_create_btn_refill print-btn"
                            onClick={() => {
                              handleCarryForward(patientData?.data?._id);
                            }}
                          >
                            Carry Forward
                          </button>
                        )}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                {patientData?.data?.medications?.length > 0 ? (
                  patientData?.data?.medications?.filter(
                    (i) =>
                      i?.status === "Continue" || i?.status === "DisContinue",
                  )?.length > 0 ? (
                    patientData?.data?.medications
                      ?.filter(
                        (i) =>
                          i?.status === "Continue" ||
                          i?.status === "DisContinue",
                      )
                      ?.map(
                        (i, indexMed) =>
                          (i?.status === "Continue" ||
                            i?.status === "DisContinue") && (
                            <div className="instructions-table" key={indexMed}>
                              <div className="instructions my-3">
                                <Row>
                                  <Col xs={12} md={12} lg={12}>
                                    <div className="name d-flex justify-content-center align-items-center gap-2">
                                      <Form.Label>
                                        {" "}
                                        <span className="fw-bold">
                                          Medication Name :
                                        </span>{" "}
                                        {i.name}{" "}
                                      </Form.Label>
                                      {i?.instruction?.map((ins, index) => (
                                        <Form.Label key={`instruction${index}`}>
                                          <span className="fw-bold">
                                            Instruction :
                                          </span>{" "}
                                          {ins?.select === true &&
                                            ins?.instruction}{" "}
                                        </Form.Label>
                                      ))}
                                      {i.otherInstruction && (
                                        <Form.Label>
                                          <span className="fw-bold">
                                            Other Instruction :
                                          </span>{" "}
                                          {i.otherInstruction}
                                        </Form.Label>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col xs={4} md={6} lg={3}>
                                    <div className="d-flex align-items-center gap-2">
                                      <button
                                        className="employee_create_btn_refill print-btn"
                                        onClick={() => {
                                          setModalShowRefill(true);
                                          setMarsId(i?._id);
                                        }}
                                        disabled={
                                          profile.userType === ROLES.PATIENT ||
                                          (profile?.accountType ===
                                            ACCOUNT_TYPES.RESTRICTED &&
                                            profile?.userType ===
                                              ROLES.EMPLOYEE)
                                        }
                                      >
                                        Refill Count
                                      </button>
                                      <Form.Label className="fw-bold mb-0">
                                        {i?.refillCount}
                                      </Form.Label>
                                    </div>
                                  </Col>

                                  <Col xs={6} md={6} lg={6}>
                                    <div className="d-flex align-items-center gap-2">
                                      {i.expirationDate && (
                                        <Form.Label>
                                          <span className="fw-bold">
                                            {" "}
                                            Expiration Date :{" "}
                                          </span>{" "}
                                          {formatDateToMMDDYYYY(
                                            i.expirationDate,
                                          )}
                                        </Form.Label>
                                      )}
                                      {i.provider && (
                                        <Form.Label>
                                          <span className="fw-bold">
                                            Provider Name :
                                          </span>{" "}
                                          {i.provider}
                                        </Form.Label>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                              <Table
                                bordered
                                responsive
                                className={
                                  i?.status === "DisContinue"
                                    ? "disabled-table-mars"
                                    : ""
                                }
                              >
                                <thead>
                                  <tr>
                                    <th>Time</th>
                                    {i.medicationStatus?.map((date, index) => (
                                      <th key={index}>{date?.date}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {i.timeStatus?.map((time, rowIndex) => {
                                    const isRowDisabled =
                                      i.medicationStatus?.some((date) =>
                                        date?.timeStatus?.some(
                                          (status) =>
                                            status?.time === time &&
                                            status?.disabled,
                                        ),
                                      );
                                    const filledIndices = i.medicationStatus
                                      ?.map((date, index) => {
                                        const ts = date?.timeStatus?.find(
                                          (item) =>
                                            item?.time?.toLowerCase() ===
                                            time?.toLowerCase(),
                                        );
                                        return ts?.initials || ts?.status
                                          ? index
                                          : null;
                                      })
                                      .filter((v) => v !== null);
                                    const firstFilled = filledIndices[0];
                                    const lastFilled =
                                      filledIndices[filledIndices.length - 1];
                                    return (
                                      <tr
                                        key={rowIndex}
                                        className={`border border-white border-solid ${isRowDisabled ? "disabled-table-mars" : ""}`}
                                      >
                                        <td>
                                          {convertTimeFormat(time, hoursFormat)}
                                        </td>
                                        {i.medicationStatus?.map(
                                          (date, dateIndex) => {
                                            const ts = date?.timeStatus?.find(
                                              (item) =>
                                                item?.time?.toLowerCase() ===
                                                time?.toLowerCase(),
                                            );
                                            let overrideInitials = "";
                                            if (
                                              (ts?.disabled &&
                                                !ts?.initials &&
                                                !ts?.status) ||
                                              i?.status === "DisContinue"
                                            ) {
                                              if (filledIndices.length === 0) {
                                                overrideInitials = "D";
                                              } else if (
                                                dateIndex < firstFilled
                                              ) {
                                                overrideInitials = "-";
                                              } else if (
                                                filledIndices.includes(
                                                  dateIndex,
                                                )
                                              ) {
                                                overrideInitials = "";
                                              } else if (
                                                dateIndex > lastFilled
                                              ) {
                                                overrideInitials = "D";
                                              } else {
                                                overrideInitials = "-";
                                              }
                                            }
                                            const uniqueIdentifier = `${indexMed}-${dateIndex}`;
                                            const newdate = date?.date;
                                            return statusReturner({
                                              date: newdate,
                                              time,
                                              data: date,
                                              mainId: i._id,
                                              color: getColorByTime(
                                                time,
                                                uniqueIdentifier,
                                              ),
                                              status: i?.status,
                                              isRowDisabled: isRowDisabled,
                                              overrideInitials,
                                            });
                                          },
                                        )}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </Table>
                            </div>
                          ),
                      )
                  ) : (
                    <Form.Group>
                      <Form.Label className="fw-bold">
                        Medication Administration Record is discontinued for
                        this month. Please visit the previous month for details.
                      </Form.Label>
                    </Form.Group>
                  )
                ) : (
                  <Form.Group>
                    <Form.Label className="fw-bold">
                      No Medication Administration Record data found in this
                      month
                    </Form.Label>
                  </Form.Group>
                )}
              </Col>
            </Row>

            <div className="mt-3">
              <div className="view-details-grid d-block my-1 my-md-2 p-3">
                <div className="view-details-grid-inline">
                  <p className="view-label mb-1">H : </p>
                  <h5 className="view-value mb-0">Hospital</h5>
                </div>
              </div>
              <div className="view-details-grid d-block my-1 my-md-2 p-3">
                <div className="view-details-grid-inline">
                  <p className="view-label mb-1">HP : </p>
                  <h5 className="view-value mb-0">Home Pass</h5>
                </div>
              </div>
              <div className="view-details-grid d-block my-1 my-md-2 p-3">
                <div className="view-details-grid-inline">
                  <p className="view-label mb-1">RM : </p>
                  <h5 className="view-value mb-0">Refused Med</h5>
                </div>
              </div>
              <div className="view-details-grid d-block my-1 my-md-2 p-3">
                <div className="view-details-grid-inline">
                  <p className="view-label mb-1">HO : </p>
                  <h5 className="view-value mb-0">
                    On Hold per Provider’s Orders
                  </h5>
                </div>
              </div>
              <div className="view-details-grid d-block my-1 my-md-2 p-3">
                <div className="view-details-grid-inline">
                  <p className="view-label mb-1">UN : </p>
                  <h5 className="view-value mb-0">
                    Unavailable (documentation required)
                  </h5>
                </div>
              </div>
              <div className="view-details-grid d-block my-1 my-md-2 p-3">
                <div className="view-details-grid-inline">
                  <p className="view-label mb-1">D : </p>
                  <h5 className="view-value mb-0">
                    This medication is Discontinued
                  </h5>
                </div>
              </div>
            </div>

            {patientData?.data?.employeeInitials?.length > 0 && (
              <Card.Body className="flex items-center justify-center p-3 bg-white">
                <div className="w-full bg-white  overflow-hidden">
                  <table className="w-full border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                          Staff Name and Signature
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                          Initials
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {patientData?.data?.employeeInitials?.map(
                        (staff, index) => (
                          <tr
                            key={staff.id}
                            className="transition-colors duration-200"
                          >
                            <td className="px-6 py-3 text-sm text-gray-800">
                              {" "}
                              {staff?.signature?.signature
                                ? ` Digitally Signed by ${staff?.signature?.signature} ${getFormattedDateTime(staff?.signature?.dateSigned, hoursFormat)}`
                                : `-`}
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-800">
                              {staff.position ?? "-"}
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-800">
                              {staff.firstName
                                .charAt(0)
                                .toUpperCase()
                                .concat(staff.lastName.charAt(0).toUpperCase())}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            )}
          </div>
        </div>
        <Row>
          <Col xs={12}>
            <button
              className="employee_create_btn hidePrint mt-3 mt-md-4"
              type="button"
              onClick={print}
            >
              PRINT REPORT
            </button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default HOC({
  Wcomponenet: Mars,
});
