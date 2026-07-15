/** @format */
import { useEffect, useState, memo, useCallback } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  authService,
  getObjectUrlFromDownloadUrl,
  LogOutHandler,
} from "../../services";
import {
  AdminSidebar,
  Innernav,
  ResidentSidebar,
  employeeSidebarNav,
  ROLES,
} from "../../constants";
import { userProfile } from "@/store/authSlice";

export const InnerSidebars = memo(({ show, handleClose, type }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const ProfileDetails = useSelector(userProfile);
  const dispatch = useDispatch();
  const logOut = useCallback(() => {
    authService.logout({
      setResponse: () => {},
    });
    dispatch(LogOutHandler(navigate));
  }, [dispatch, navigate]);
  const [currentNavList, setCurrentNavList] = useState([]);
  useEffect(() => {
    if (ProfileDetails?.userType === ROLES.ADMIN) {
      setCurrentNavList(AdminSidebar);
    } else if (ProfileDetails?.userType === ROLES.EMPLOYEE) {
      if (location?.pathname === "/employment")
        setCurrentNavList(employeeSidebarNav);
      else setCurrentNavList(Innernav);
    } else if (ProfileDetails?.userType === ROLES.PATIENT) {
      setCurrentNavList(ResidentSidebar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ProfileDetails?.userType]);
  return (
    <>
      <Offcanvas
        show={show}
        onHide={handleClose}
        className="Outer_sider_canvas_container"
        aria-label="Inner sidebar menu"
      >
        <Offcanvas.Body className="Outer_sidebar_Body">
          <div className="close_btn">
            <button
              type="button"
              className="bg-transparent border-0 p-0"
              onClick={() => handleClose()}
              aria-label="Close menu"
            >
              <i className="fa-solid fa-circle-xmark"></i>
            </button>
          </div>
          <figure className="flex flex-col items-start">
            <span className="leading-[0.1rem]">
              {ProfileDetails?.adminId?.logo ? (
                <img
                  className="max-w-[155px] max-h-[55px] block m-auto"
                  src={getObjectUrlFromDownloadUrl(
                    ProfileDetails?.adminId?.logo,
                  )}
                  alt="Admin Logo"
                />
              ) : (
                <img
                  className="max-w-[155px] max-h-[55px] block m-auto"
                  src="/logo.png"
                  alt="Default Logo"
                />
              )}
              <div className="text-sm mt-3 leading-[.6rem]">
                <span>
                  <Button
                    type="button"
                    className="bg-[#1A9FB2] border-2 border-white px-[1.3rem] text-white"
                    onClick={() => logOut()}
                    aria-label="Sign out"
                  >
                    Sign Out
                  </Button>
                </span>
                <br />
              </div>
            </span>
          </figure>
          <nav className="py-6" role="navigation">
            {currentNavList.map((nav) => (
              <Link
                to={nav.link}
                key={nav.name}
                onClick={() => {
                  handleClose();
                  navigate(nav.link);
                }}
                className={`${location.pathname === nav.link && "active"} no-underline`}
                aria-label={`Navigate to ${nav.name}`}
              >
                <div className="flex items-center gap-[0.8rem] mb-[1.3rem]">
                  <span
                    className="text-[.5rem] max-w-[30px]"
                    aria-hidden="true"
                  >
                    {typeof nav.icon === "string" ? (
                      <img src={nav.icon} alt="" />
                    ) : (
                      <nav.icon />
                    )}
                  </span>
                  <span className="text-white border-b-0 whitespace-normal text-[0.9rem] no-underline">
                    {nav.name}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
          <h5 className="app-verion-text mb-0">App version 1.0</h5>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
});
