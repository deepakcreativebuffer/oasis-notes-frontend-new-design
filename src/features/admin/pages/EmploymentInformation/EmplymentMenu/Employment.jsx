/* eslint-disable no-unused-vars */
/** @format */

import { useState, useEffect } from "react";
import "./Employment.css";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { EmploymentCards } from "@/features/shared/constants";
import { VectorImg } from "@/assets/index";
import ComponentLoader from "@/features/shared/ui/Loader/ComponentLoader";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { DocumentUploaderEmployee } from "@/features/shared/ui/Mod/Modal";
import NavWrapper from "@/utils/NavWrapper";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";

import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";

const Employment = () => {
  const profileUser = useSelector(userProfile);
  const userType = useSelector(userProfile)?.userType;
  const accountType = useSelector(userProfile)?.accountType;

  const isAdmin = userType === ROLES.ADMIN;
  const isAdministrator = accountType === ACCOUNT_TYPES.ADMINISTRATOR;
  const isReadOnlyEmployee =
    accountType === ACCOUNT_TYPES.RESTRICTED && userType === ROLES.EMPLOYEE;
  const isRegularEmployee =
    accountType === ACCOUNT_TYPES.REGULAR && userType === ROLES.EMPLOYEE;
  const isAdministratorEmployee =
    isAdministrator && userType === ROLES.EMPLOYEE;
  const profile = profileUser?.userPermissions?.view?.split(":") || [];
  const [open, setOpen] = useState(false);

  let filteredCards = EmploymentCards;

  if (isAdmin === false)
    filteredCards = EmploymentCards.filter(
      (card) =>
        !["Time Of Request", "Refrence Check", "Employee Performance"].includes(
          card.title,
        ),
    );
  const Component = () => {
    return (
      <>
        <NavWrapper isArrow={true} title={"Employment Information"} />
        <DocumentUploaderEmployee show={open} onHide={() => setOpen(false)} />
        <Container>
          <Row className="mt-3">
            {filteredCards?.map((i, index) => {
              const isAllowed =
                (profile?.includes(i?.permissionKey) &&
                  (isRegularEmployee || isReadOnlyEmployee)) ||
                isAdmin ||
                isAdministratorEmployee;
              return (
                <Col xs={12} sm={6} md={6} xl={3} key={index}>
                  <div
                    className={`cont dashboard_cont ${
                      isAllowed ? "" : "disabled-link"
                    }`}
                    key={`img${index}`}
                  >
                    <Link to={isAdmin ? i.adminLink : i.link}>
                      <div className="chart_images dashboard">
                        <img src={i.src} alt="" />
                        <p> {i.title} </p>
                      </div>
                    </Link>
                  </div>
                </Col>
              );
            })}
            {!isAdmin && (
              <Col xs={12} sm={6} md={6} xl={3}>
                <div className="cont dashboard_cont">
                  <Link to="/all-forms">
                    <div className="chart_images dashboard">
                      <img src={VectorImg} alt="" />
                      <p>All Employee Forms</p>
                    </div>
                  </Link>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </>
    );
  };

  return <Component />;
};

export default HOC({ Wcomponenet: Employment });
