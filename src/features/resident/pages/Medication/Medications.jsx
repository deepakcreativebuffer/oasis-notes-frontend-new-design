/** @format */

import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import {
  marsImg,
  medicationCount,
  medicationRecon,
  informedConsentForm,
  MEDICATIONLOG,
} from "@/assets/index";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";

import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";

const Items = [
  {
    src: informedConsentForm,
    link: "/employee-medication",
    title: "Resident Medication",
    permissionKey: "em",
  },
  {
    src: marsImg,
    link: "/mars",
    title: "Medication Administration Record",
    permissionKey: "mars",
  },
  {
    src: medicationRecon,
    link: "/reconciliation",
    title: "Medication reconciliation",
    permissionKey: "mr",
  },
  {
    src: medicationCount,
    link: "/employee/medications/medication-count",
    title: "Medication Count",
    permissionKey: "mc",
  },
  {
    src: informedConsentForm,
    link: "/employee/medications/informed-consent",
    title: "Informed Consent for Medications",
    permissionKey: "icm",
  },
  {
    src: MEDICATIONLOG,
    link: "/employee/medications/prn-form",
    title: "PRN",
    permissionKey: "prn",
  },
];

const Medications = () => {
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
      <NavWrapper title={"Medications"} isArrow={true} />
      <Container>
        <div className="patient_chart_container medications_container">
          {Items?.map((i, index) => {
            const isAllowed =
              (profile?.includes(i?.permissionKey) &&
                (isRegularEmployee || isReadOnlyEmployee)) ||
              isAdmin ||
              isAdministratorEmployee;
            return (
              <div className="dashboard_cont" key={index}>
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
            );
          })}
        </div>
      </Container>
    </>
  );
};

export default HOC({ Wcomponenet: Medications });
