/** @format */
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { TrainingConstant, SecondItem } from "@/features/shared/constants";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";

import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";

const Training = () => {
  const profileData = useSelector(userProfile);
  const profile =
    typeof profileData?.userPermissions?.view === "string"
      ? profileData.userPermissions.view.split(":")
      : [];
  const userType = profileData?.userType;
  const accountType = profileData?.accountType;

  const isAdmin = userType === ROLES.ADMIN;
  const isAdministrator = accountType === ACCOUNT_TYPES.ADMINISTRATOR;
  const isReadOnlyEmployee =
    accountType === ACCOUNT_TYPES.RESTRICTED && userType === ROLES.EMPLOYEE;
  const isRegularEmployee =
    accountType === ACCOUNT_TYPES.REGULAR && userType === ROLES.EMPLOYEE;
  const isAdministratorEmployee =
    isAdministrator && userType === ROLES.EMPLOYEE;
  return (
    <>
      <NavWrapper title={"Training"} isArrow={true} />
      <Container>
        <Row>
          {TrainingConstant?.map((i, index) => {
            const isAllowed =
              (profile?.includes(i?.permissionKey) &&
                (isRegularEmployee || isReadOnlyEmployee)) ||
              isAdmin ||
              isAdministratorEmployee;
            return (
              <Col xs={12} sm={6} lg={3} key={index}>
                <Link
                  to={i?.link}
                  className={`chart_images text-decoration-none ${
                    isAllowed ? "" : "disabled-link"
                  } `}
                >
                  <img src={i.src} alt="" />
                  <p> {i.title} </p>
                </Link>
              </Col>
            );
          })}
          {SecondItem?.map((i, index) => {
            const isAllowed =
              (profile?.includes(i?.permissionKey) &&
                (isRegularEmployee || isReadOnlyEmployee)) ||
              isAdmin ||
              isAdministratorEmployee;
            return (
              <Col xs={12} sm={6} lg={3} key={`second${index}`}>
                <div className="cont">
                  <Link
                    to={i.link}
                    className={`text-decoration-none ${
                      isAllowed ? "" : "disabled-link"
                    }`}
                  >
                    <div className="chart_images">
                      <img src={i.img} alt="" />
                      <p> {i.title} </p>
                    </div>
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

export default HOC({ Wcomponenet: Training });
