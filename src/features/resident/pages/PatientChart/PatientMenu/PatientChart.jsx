/** @format */

import { Link } from "react-router-dom";
import {
  patient_chart,
  IntakeArr,
  IntakeArrAdmin,
} from "@/features/shared/constants";
import { Container, Row, Col } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { dischargeImg, NotesImg, VectorImg } from "@/assets";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";

const SecondItem = [
  {
    link: "/mental-status",
    img: VectorImg,
    title: "Mental Status",
    permissionKey: "ms",
  },
  {
    link: "/refusal",
    img: dischargeImg,
    title: "Refusal Of Medical Treatment Form",
    permissionKey: "rmt",
  },
  {
    link: "/tracking-log",
    img: NotesImg,
    title: "Appointment Tracking Log",
    permissionKey: "va",
  },
];
const PatientChart = () => {
  const profileData = useSelector(userProfile);
  const profile =
    typeof profileData?.userPermissions?.view === "string"
      ? profileData.userPermissions.view.split(":")
      : [];
  const userType = profileData?.userType;
  const accountType = profileData?.accountType;

  const isAdmin = userType === ROLES.ADMIN;
  const isAdministrator = accountType === ACCOUNT_TYPES.ADMINISTRATOR;
  const isRegularEmployee =
    accountType === ACCOUNT_TYPES.REGULAR && userType === ROLES.EMPLOYEE;
  const isReadOnlyEmployee =
    accountType === ACCOUNT_TYPES.RESTRICTED && userType === ROLES.EMPLOYEE;
  const isAdministratorEmployee =
    isAdministrator && userType === ROLES.EMPLOYEE;

  return (
    <>
      <NavWrapper title={"Resident Chart"} type={"patient"} isArrow={true} />
      <Container>
        <Row>
          {patient_chart?.map((i, index) => {
            const isAllowed =
              (profile?.includes(i?.permissionKey) &&
                (isRegularEmployee || isReadOnlyEmployee)) ||
              isAdmin ||
              isAdministratorEmployee;
            return (
              <Col key={index} xs={12} md={6} lg={3}>
                <div className="dashboard_cont">
                  <Link
                    to={i?.link}
                    key={index}
                    className={`chart_images cursor-pointer ${
                      isAllowed ? "" : "disabled-link"
                    } `}
                  >
                    <img src={i.src} alt="" />
                    <p>{i.title}</p>
                  </Link>
                </div>
              </Col>
            );
          })}

          {IntakeArr?.map((i, index) => {
            const isAllowed =
              (profile?.includes(i?.permissionKey) &&
                (isRegularEmployee || isReadOnlyEmployee)) ||
              isAdmin ||
              isAdministratorEmployee;
            return (
              <Col xs={12} md={6} lg={3} key={index}>
                <div className="dashboard_cont">
                  <Link
                    className={`chart_images cursor-pointer ${
                      isAllowed ? " " : "disabled-link"
                    }`}
                    to={i.link}
                  >
                    <img className="p-[10px]" src={i.img} alt="" />
                    <p>{i.title}</p>
                  </Link>
                </div>
              </Col>
            );
          })}
          {isAdmin &&
            IntakeArrAdmin?.map((i, index) => {
              const isAllowed =
                (profile?.includes(i?.permissionKey) &&
                  (isRegularEmployee || isReadOnlyEmployee)) ||
                isAdmin ||
                isAdministratorEmployee;
              return (
                <Col xs={12} md={6} lg={3} key={index}>
                  <div className="dashboard_cont">
                    <Link
                      className={`chart_images cursor-pointer ${
                        isAllowed ? "" : "disabled-link"
                      } `}
                      to={i.link}
                    >
                      <img src={i.img} alt="" />
                      <p>{i.title}</p>
                    </Link>
                  </div>
                </Col>
              );
            })}
          {!isAdmin &&
            SecondItem?.map((i, index) => {
              const isAllowed =
                (profile?.includes(i?.permissionKey) &&
                  (isRegularEmployee || isReadOnlyEmployee)) ||
                isAdmin ||
                isAdministratorEmployee;
              return (
                <Col xs={12} sm={6} lg={3} key={index}>
                  <div className="dashboard_cont" key={`second${index}`}>
                    <Link
                      to={i.link}
                      className={`chart_images cursor-pointer ${
                        isAllowed ? "" : "disabled-link"
                      } `}
                    >
                      <img src={i.img} className="px-[36px] py-0" alt="" />
                      <p> {i.title} </p>
                    </Link>
                  </div>
                </Col>
              );
            })}
        </Row>
      </Container>
    </>
  );
};

export default PatientChart;
