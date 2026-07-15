/** @format */

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import HOC from "@/features/shared/layout/Outer/HOC";
import { Container, Row, Col, Card } from "react-bootstrap";
import { userProfile } from "@/store/authSlice";
import { fetchPaitentName } from "@/utils/utils";
import { dashboardService } from "@/features/shared/services";
import {
  dischargeImg,
  ProgressNoteImg,
  notesImg,
  VectorImg,
  progressImg,
  ScheduleImg,
  stuffingNoteImg,
  ActivityOfDailyLivigImg,
} from "@/assets/index";
import ComponentLoader from "@/features/shared/ui/Loader/ComponentLoader";
import {
  MdOutlineReviews,
  MdOutlineCalendarMonth,
  MdInsertChartOutlined,
  MdAccessTime,
  MdNorthEast,
  MdCircleNotifications,
} from "react-icons/md";

import { selectCurrentOrgId } from "@/store/organizationSlice";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
import { getSuperadminNotifications } from "@/features/shared/services";

const Dashboard = () => {
  const profile = useSelector(userProfile);
  const orgId = useSelector(selectCurrentOrgId);
  const [setLoading] = useState(false);
  const [data, setData] = useState({});
  const [mainNotifications, setMainNotifications] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (orgId) {
      dashboardService.getEmployeeDashboard({
        setResponse: setData,
        setLoading,
      });
    }
  }, [orgId]);

  const getAllNotifications = () => {
    if (profile?.userType !== ROLES.ADMIN) return;
    getSuperadminNotifications()
      .then((res) => {
        const dataList = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.docs)
            ? res.data.docs
            : [];
        if (dataList.length === 0) return;

        const today = new Date().setHours(0, 0, 0, 0); // Today's date at midnight

        const todayAndFutureNotifications = dataList.filter((i) => {
          const notificationDate =
            new Date(i.time).setHours(0, 0, 0, 0) ||
            new Date(`${i?.date} ${i?.time}`).setHours(0, 0, 0, 0);
          return notificationDate >= today; // Include today and future notifications
        });

        const titles = todayAndFutureNotifications
          .map((i) => i.title?.trim())
          .filter(Boolean);
        if (titles.length > 0) {
          setMainNotifications(titles[titles.length - 1]); // Set last non-empty title
        }
      })
      .catch((err) => console.debug(err));
  };

  useEffect(() => {
    getAllNotifications();
  }, []);

  const dataOptions = [
    {
      img: ProgressNoteImg,
      link: "/employee/patient-chart/progress",
      title: "Shift Progress Note",
      permissionKey: "pn",
    },
    {
      img: dischargeImg,
      link: "/discharge-summary",
      title: "Discharge",
      permissionKey: "discharge",
    },
    {
      img: stuffingNoteImg,
      link: "/staff-note",
      title: "ART Meeting",
      permissionKey: "sn",
    },
    {
      img: ScheduleImg,
      link: "/activity-schedule",
      title: "Activity Schedule",
      permissionKey: "aschedule",
    },
    {
      img: progressImg,
      link: "/list-clinical-oversight",
      title: "Clinical Oversight",
      permissionKey: "co",
    },
    {
      img: notesImg,
      link: "/receipts",
      title: "Receipts",
      permissionKey: "uf",
    },
    {
      img: VectorImg,
      link: "/special-notes",
      title: "Special Note",
      permissionKey: "spn",
    },
    {
      img: ActivityOfDailyLivigImg,
      link: "/appendix-list",
      title: "TB Risk Assessments",
      permissionKey: "app",
    },
    {
      img: ActivityOfDailyLivigImg,
      link: "/assign-users-list",
      title: "Active Residents",
      permissionKey: "app",
    },
  ];
  const Component = () => {
    const profileData = useSelector(userProfile);
    const profileDetails =
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
    const stats = data?.data || data;
    return (
      <Container fluid className="dashboard-page">
        <Row>
          <Col xs={12} md={12} xl={12} className="mb-3 mb-lg-4">
            <Card
              // no-body
              className="HomePageDashboard overflow-hidden border-0"
            >
              <Row className="align-items-center">
                <Col xs={12} md={4} lg={4} xl={4}>
                  <div className="position-relative z-1 text-center text-lg-start card-body">
                    <h4 className="text-white fw-semibold my-md-3 mb-3 fs-4">
                      Welcome Back{" "}
                      <span className="fw-normal ">
                        {profile && fetchPaitentName(profile)}!
                      </span>
                    </h4>
                    <h6 className="opacity-75 fw-normal text-white mb-0 fs-6">
                      How can we help you today?
                    </h6>
                  </div>
                </Col>
                <Col xs={12} md={4} lg={4} xl={4}>
                  <div className="position-relative z-1 card-body">
                    <h4 className="text-white fw-semibold text-center my-md-3 mb-3 fs-4">
                      <span>
                        Empowering Seamless Therapy Documentation and Management
                      </span>
                    </h4>
                    {mainNotifications && (
                      <div className="text-center">
                        <span className="badge badge-custom-dark d-inline-flex gap-2 fs-6 text-wrap-auto whitespace-break-spaces">
                          <MdCircleNotifications className="shrink-0" />
                          <span className="fw-normal text-wrap-auto whitespace-break-spaces">
                            {mainNotifications}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </Col>
                <Col
                  xs={12}
                  md={4}
                  lg={4}
                  xl={4}
                  className="align-self-end text-center text-md-right"
                >
                  <div className="position-relative z-1">
                    <img
                      src="/doctor-appoint.svg"
                      className="img-fluid d-none d-md-inline-block float-md-end max-h-[200px]"
                      alt="welcome-patient"
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <div className="dashboard-stats">
          <Row>
            <Col xs={12} md={12} xl={7}>
              <div className="header-card-title mb-3">
                <h5 className="mb-0 page-name fw-bold">Quick Stats</h5>
              </div>
              <Row>
                <Col xs={12} md={6} xl={6}>
                  <Card
                    body
                    className="mb-3 mb-lg-4 border-0 relative shadow-sm cursor-pointer"
                    onClick={() => {
                      navigate("/tracking-log");
                    }}
                  >
                    <div className="stats-card d-flex align-items-center py-md-3 px-md-2">
                      <div className="stats-icon blue-soft me-3 flex-shirnk-0">
                        <MdOutlineCalendarMonth />
                      </div>
                      <div className="stats-info">
                        <p className="stats-counter mb-0">
                          {stats?.appointmentCount || 0}
                        </p>
                        <h3 className="stats-title mb-0">
                          Today's Appointments
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} md={6} xl={6}>
                  <Card
                    body
                    className="mb-3 mb-lg-4 border-0 relative shadow-sm cursor-pointer"
                    onClick={() => {
                      navigate("/patient-list");
                    }}
                  >
                    <div className="stats-card d-flex align-items-center py-md-3 px-md-2">
                      <div className="stats-icon purple-soft me-3 flex-shirnk-0">
                        <MdInsertChartOutlined />
                      </div>
                      <div className="stats-info">
                        <p className="stats-counter mb-0">
                          {stats?.employeeCount || 0}
                        </p>
                        <h3 className="stats-title mb-0">Total Residents</h3>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} md={6} xl={6}>
                  <Card
                    body
                    className="mb-3 mb-lg-4 border-0 relative shadow-sm cursor-pointer"
                    onClick={() => {
                      navigate("/schedule");
                    }}
                  >
                    <div className="stats-card d-flex align-items-center py-md-3 px-md-2">
                      <div className="stats-icon green-soft me-3 flex-shirnk-0">
                        <MdAccessTime />
                      </div>
                      <div className="stats-info">
                        <p className="stats-counter mb-0">{stats?.days || 0}</p>
                        <h3 className="stats-title mb-0">Total Shifts</h3>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} md={6} xl={6}>
                  <Card
                    body
                    className="mb-3 mb-lg-4 border-0 relative shadow-sm cursor-pointer"
                    onClick={() => {
                      navigate("/employee-performance");
                    }}
                  >
                    <div className="stats-card d-flex align-items-center py-md-3 px-md-2">
                      <div className="stats-icon yellow-soft me-3 flex-shirnk-0">
                        <MdOutlineReviews />
                      </div>
                      <div className="stats-info">
                        <p className="stats-counter mb-0">
                          {stats?.latestPerformanceReview || 0}
                        </p>
                        <h3 className="stats-title mb-0">Performance Review</h3>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={12} xl={5}>
              <div className="header-card-title mb-3">
                <h5 className="mb-0 page-name fw-bold">Quick Links</h5>
              </div>
              <Card body className="mb-3 border-0 relative shadow-sm">
                <div
                  className="ps-lg-2 pe-lg-3 force-overflow scrollbar"
                  id="scroll-vertically"
                >
                  {dataOptions?.map((i, index) => {
                    const isAllowed =
                      (profileDetails?.includes(i?.permissionKey) &&
                        (isRegularEmployee || isReadOnlyEmployee)) ||
                      isAdmin ||
                      isAdministratorEmployee;
                    return (
                      <div
                        className={`${isAllowed ? "" : "disabled-link"}`}
                        key={`img${index}`}
                      >
                        <Link className="quick-links-btn p-3 my-2" to={i.link}>
                          <div className="d-flex align-items-center justify-content-between">
                            <h6 className="mb-0 quick-links-name">{i.title}</h6>
                            <MdNorthEast className="arrow-icon" />
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    );
  };
  return <ComponentLoader Wcomponenet={Component} />;
};
export default HOC({
  Wcomponenet: Dashboard,
});
