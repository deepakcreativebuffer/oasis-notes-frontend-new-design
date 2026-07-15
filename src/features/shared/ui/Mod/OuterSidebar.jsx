/** @format */
import { useEffect, useState, memo, useCallback } from "react";
import { Offcanvas } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MdOutlineLibraryBooks,
  MdChatBubbleOutline,
  MdLogin,
} from "react-icons/md";
import {
  authService,
  getObjectUrlFromDownloadUrl,
  LogOutHandler,
} from "../../services";
import { AdminSidebar } from "../../constants";
import { userProfile } from "@/store/authSlice";
import CreateChat from "@/features/employee/pages/Chat/CreateChat";

export const OuterSidebar = memo(({ show, handleClose, routesMob }) => {
  const location = useLocation();
  const ProfileDetails = useSelector(userProfile);
  const navigate = useNavigate();
  const [navItem, setNavItem] = useState([]);
  const [isChat, setIsChat] = useState(false);
  const dispatch = useDispatch();
  const logOut = useCallback(async () => {
    await authService.logout({
      setResponse: () => {},
    });
    dispatch(LogOutHandler(navigate));
  }, [dispatch, navigate]);
  const newAdminSidebar = [...AdminSidebar];
  if (ProfileDetails?.tier === "Growth") {
    newAdminSidebar?.splice(6, 0, {
      icon: MdOutlineLibraryBooks,
      link: "/dashboard/notes",
      name: "Notes Library",
    });
  }
  useEffect(() => {
    if (routesMob) {
      setNavItem(routesMob);
    }
  }, [routesMob]);
  return (
    <>
      <CreateChat show={isChat} handleClose={() => setIsChat(false)} />

      <Offcanvas
        show={show}
        onHide={handleClose}
        className="Outer_sider_canvas_container"
        aria-label="Navigation sidebar"
      >
        <Offcanvas.Body className="Outer_sidebar_Body">
          <div className="close_btn">
            <button
              type="button"
              className="bg-transparent border-0 p-0"
              onClick={() => handleClose()}
              aria-label="Close sidebar"
            >
              <i className="fa-solid fa-circle-xmark"></i>
            </button>
          </div>
          <div className="Logo_img">
            {ProfileDetails?.adminId?.logo || ProfileDetails?.logo ? (
              <img
                className="max-w-[155px] max-h-[55px] block"
                src={getObjectUrlFromDownloadUrl(
                  ProfileDetails?.adminId?.logo || ProfileDetails?.logo,
                )}
                alt="Admin Logo"
              />
            ) : (
              <img
                className="max-w-[155px] max-h-[55px] block"
                src="/logo.png"
                alt="Default Logo"
              />
            )}
          </div>

          <div className="outer-siderbar-nav" role="navigation">
            <ul className="Nav">
              {navItem?.map((nav, index) => (
                <li
                  key={`nav${index}`}
                  className={location.pathname === nav.link ? "active" : ""}
                >
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      navigate(nav.link);
                    }}
                    className="w-100 text-start bg-transparent border-0 p-0 text-white d-flex align-items-center gap-2"
                    aria-label={`Go to ${nav.name}`}
                  >
                    {typeof nav.icon === "string" ? (
                      <img
                        src={getObjectUrlFromDownloadUrl(nav.img)}
                        alt=""
                        aria-hidden="true"
                      />
                    ) : (
                      <span aria-hidden="true">
                        <nav.icon />
                      </span>
                    )}
                    <span>{nav.name}</span>
                  </button>
                </li>
              ))}

              {ProfileDetails?.adminId?.permissionChat === true && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      setIsChat(true);
                    }}
                    className="w-100 text-start bg-transparent border-0 p-0 text-white d-flex align-items-center gap-2"
                    aria-label="Open Chat"
                  >
                    <span aria-hidden="true">
                      <MdChatBubbleOutline />
                    </span>
                    <span>Chat</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    logOut();
                  }}
                  className="w-100 text-start bg-transparent border-0 p-0 text-white d-flex align-items-center gap-2"
                  aria-label="Log out"
                >
                  <span aria-hidden="true">
                    <MdLogin />
                  </span>
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
          <h5 className="app-verion-text mb-0">App version 1.0</h5>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
});
