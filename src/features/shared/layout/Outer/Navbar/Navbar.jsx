/* eslint-disable no-unused-vars */
/** @format */

import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { OuterSidebar } from "@/features/shared/ui/Mod/Modal";
import { NotificationToast } from "@/features/shared/ui/Canvas/Canvases";
import { defaultProfileIcon } from "@/assets";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUnreadMessageCount,
  updateUnreadNotificationCount,
  userProfile,
} from "@/store/authSlice";
import { selectCurrentOrgId } from "@/store/organizationSlice";
import {
  authService,
  employeeService,
  getObjectUrlFromDownloadUrl,
  LogOutHandler,
  setActiveOrganization,
} from "@/features/shared/services/index";
import { applyActiveOrganization } from "@/utils/applyActiveOrganization";
import { showNotification } from "@/utils";
import { getAllNotifications } from "@/features/shared/services/index";
import Dropdown from "react-bootstrap/Dropdown";
import {
  MdNotificationsNone,
  MdManageAccounts,
  MdChatBubbleOutline,
  MdLogout,
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
} from "react-icons/md";
import { getSocket } from "@/socket";
import { ROLES } from "@/features/shared/constants/index";
import { logger } from "@/utils";
const socket = getSocket();
const MOBILE_BREAKPOINT_PX = 1179;

const Navbar = ({ routesMob }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [showA, setShowA] = useState(false);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState({});
  const [show, setShow] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const toggleShowA = () => setShowA(!showA);
  const [notifications, setNotifications] = useState({});
  const [logoutResonse, setLogoutResonse] = useState({});
  const [mainNotifications, setMainNotifications] = useState({});
  const ProfileDetails = useSelector(userProfile);
  const [showOrganizations, setShowOrganizations] = useState(false);
  const { unreadMessages, unreadNotifications } =
    useSelector((state) => state.auth) || {};
  const selectedOrgId = useSelector(selectCurrentOrgId);
  const [switchingOrg, setSwitchingOrg] = useState(false);
  const logOut = async () => {
    await authService.logout({
      setResponse: setLogoutResonse,
    });
    dispatch(LogOutHandler(navigate));
  };
  const getAllNotificationsHandler = useCallback(() => {
    getAllNotifications()
      .then((res) => {
        const today = new Date().setHours(0, 0, 0, 0); // Setting today's date without time
        const todayAndFutureNotifications = res.data.data?.filter((i) => {
          const notificationDate = new Date(`${i?.date} ${i?.time}`).setHours(
            0,
            0,
            0,
            0,
          );
          return notificationDate >= today; // Include today and future dates
        });
        setNotifications(todayAndFutureNotifications?.slice(0, 2));
        const newData = todayAndFutureNotifications?.filter(
          (i) => i?.title && i.title.trim() !== "",
        );
        const newDate2 = newData?.map((i) => i?.title);
        if (newDate2 && newDate2?.length > 0) {
          const lastData = newDate2[newDate2.length - 1];
          setMainNotifications(lastData);
        }
      })
      .catch((err) => logger.debug(err));
  }, []);
  const notify = () => {
    setShowA(!showA);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT_PX) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    socket.on("new-notification", (notification) => {
      dispatch(
        updateUnreadNotificationCount({
          count: 1,
          read: false,
        }),
      );
    });
    socket.on("new-message", (message) => {
      dispatch(
        updateUnreadMessageCount({
          count: 1,
          read: false,
        }),
      );
    });
    return () => {
      socket.off("new-notification");
      socket.off("new-message");
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchHandler = useCallback(() => {
    employeeService.searchPatients(query, {
      setResponse: setUsers,
    });
  }, [query]);
  useEffect(() => {
    if (query) {
      fetchHandler();
      setShow(true);
    }
  }, [query, fetchHandler]);
  useEffect(() => {
    ProfileDetails?.userType === ROLES.ADMIN
      ? getAllNotificationsHandler()
      : employeeService.getNotifications({
          isAdmin: false,
          setResponse: setNotifications,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (searchActive) {
      setShow(true);
    }
  }, [searchActive]);
  const searchContainerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShow(false);
        setSearchActive(false);
      }
    };
    document.documentElement.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.documentElement.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);
  const organizationsHandler = async (orgId) => {
    if (selectedOrgId === orgId || switchingOrg) return;
    setSwitchingOrg(true);
    try {
      const result = await setActiveOrganization(orgId);
      if (!result.success) {
        showNotification({
          message: result.message || "Could not switch organization",
          type: "danger",
        });
        return;
      }
      applyActiveOrganization(
        dispatch,
        ProfileDetails,
        result.activeOrganizationId,
      );
      navigate("/home");
    } catch (error) {
      logger.error("Switch organization failed", error);
      showNotification({
        message: "Could not switch organization",
        type: "danger",
      });
    } finally {
      setSwitchingOrg(false);
    }
  };
  return (
    <>
      <OuterSidebar
        show={open}
        handleClose={() => setOpen(false)}
        routesMob={routesMob}
      />
      <NotificationToast
        setShow={setShowA}
        show={showA}
        notifications={notifications}
        setNotifications={setNotifications}
        handleClose={toggleShowA}
      />

      {show && <div id="nav-cover"></div>}

      <div className={"Main_Nav"} role="banner">
        <div className="top-nav-bar d-flex align-items-center justify-content-between">
          <div className="nav-left-bar d-flex align-items-center gap-2">
            <button
              className="side-toggle-btn me-2 cursor-pointer bg-transparent border-0 p-0"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation menu"
            >
              <i className="fa-solid fa-bars text-[18px]"></i>
            </button>
            <Link
              to="/Home"
              className="no-underline"
              aria-label="Oasis Notes Home"
            >
              {ProfileDetails?.adminId?.logo || ProfileDetails?.logo ? (
                <img
                  className="max-w-auto w-auto max-h-[54px]"
                  src={getObjectUrlFromDownloadUrl(
                    ProfileDetails?.adminId?.logo || ProfileDetails?.logo,
                  )}
                  alt="Company Logo"
                />
              ) : (
                <img
                  className="max-w-auto w-auto max-h-[54px]"
                  src="/logo.png"
                  alt="Oasis Notes Logo"
                />
              )}
            </Link>
          </div>
          <div className="nav-right-bar d-flex align-items-center gap-2">
            <div className="navbar-icons">
              {ProfileDetails?.adminId?.permissionChat === true &&
                (ProfileDetails.userType === ROLES.EMPLOYEE ||
                  ProfileDetails.userType === ROLES.PATIENT ||
                  ProfileDetails.userType === ROLES.GUARDIAN) && (
                  <Link
                    to={
                      ProfileDetails.userType === ROLES.EMPLOYEE
                        ? "/chat"
                        : "/chatPatient"
                    }
                    className="navbar-links-icons"
                    aria-label="Messages"
                  >
                    {!!unreadMessages && (
                      <span className="notify-indicator"></span>
                    )}
                    <MdChatBubbleOutline className="nav-menu-icon" />
                  </Link>
                )}

              <button
                type="button"
                className="navbar-links-icons bg-transparent border-0 p-0"
                onClick={notify}
                aria-label="Notifications"
              >
                {!!unreadNotifications && (
                  <span className="notify-indicator"></span>
                )}
                <MdNotificationsNone className="nav-menu-icon" />
              </button>
            </div>
            <Dropdown className="user-profile-dropdown">
              <Dropdown.Toggle
                className="profile-dropdown-btn"
                id="dropdown-user"
                aria-label="User profile menu"
              >
                <div className="nav-user d-flex align-items-center">
                  <div className="nav-user-image flex-shrink-0 me-sm-2">
                    {ProfileDetails?.profilePic ? (
                      // eslint-disable-next-line jsx-a11y/img-redundant-alt
                      <img
                        src={getObjectUrlFromDownloadUrl(
                          ProfileDetails?.profilePic,
                        )}
                        alt="User Profile Picture"
                        className="profile_img"
                      />
                    ) : (
                      <img
                        src={defaultProfileIcon}
                        alt="Default User Avatar"
                        className="profile_img"
                      />
                    )}
                  </div>
                  <div className="nav-user-name d-none d-lg-inline-block">
                    {ProfileDetails?.firstName ?? ""}{" "}
                    {ProfileDetails?.middleName ?? ""}{" "}
                    {ProfileDetails?.lastName ?? ""}{" "}
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="profile-dropdown-menu">
                <Dropdown.Item href="#">
                  <div className="nav-user d-flex align-items-center">
                    <div className="nav-user-image flex-shrink-0 me-2">
                      {ProfileDetails?.profilePic ? (
                        <img
                          src={getObjectUrlFromDownloadUrl(
                            ProfileDetails?.profilePic,
                          )}
                          alt=""
                          className="profile_img"
                        />
                      ) : (
                        <img
                          src={defaultProfileIcon}
                          alt=""
                          className="profile_img"
                        />
                      )}
                    </div>
                    <div className="username-info">
                      <div className="nav-user-name">
                        {ProfileDetails?.firstName ?? ""}
                        {ProfileDetails?.middleName ?? ""}
                        {ProfileDetails?.lastName ?? ""}
                      </div>
                      <div className="nav-user-email">
                        {ProfileDetails?.email ?? ""}
                      </div>
                    </div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#" onClick={() => navigate("/profile")}>
                  <div className="d-flex align-items-center">
                    <MdManageAccounts className="me-2 fs-md" />
                    <span className="d-inline-block">Edit Profile Details</span>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />

                {ProfileDetails?.organizations?.length > 1 && (
                  <div>
                    <Dropdown.Item
                      variant=""
                      className="text-start"
                      style={{
                        width: "100%",
                        border: "none",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowOrganizations(!showOrganizations);
                      }}
                    >
                      <div className="d-flex align-items-center">
                        {showOrganizations ? (
                          <MdOutlineArrowDropUp className="me-2 fs-md" />
                        ) : (
                          <MdOutlineArrowDropDown className="me-2 fs-md" />
                        )}
                        <span className="d-inline-block">
                          Switch Organization
                        </span>
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                  </div>
                )}

                {showOrganizations && (
                  <div className="org-list-scroll">
                    {Array.isArray(ProfileDetails?.organizations) &&
                      ProfileDetails?.organizations?.map((org, index) => {
                        return (
                          <div key={index}>
                            <Dropdown.Item
                              onClick={() => organizationsHandler(org._id)}
                            >
                              <span className="d-flex align-items-center">
                                {`${index + 1}. ${org.companyName}`}
                                {selectedOrgId === org._id && (
                                  <span className="organization-indicator" />
                                )}
                              </span>
                            </Dropdown.Item>
                            <Dropdown.Divider />
                          </div>
                        );
                      })}
                  </div>
                )}
                <Dropdown.Item href="#" onClick={() => logOut()}>
                  <div className="d-flex align-items-center">
                    <MdLogout className="me-2 fs-md" />
                    <span className="d-inline-block">Logout</span>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
};
export default Navbar;
