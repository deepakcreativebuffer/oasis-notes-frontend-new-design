/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegCircle } from "react-icons/fa";
import { Container, Row, Col } from "react-bootstrap";
import { InnerSidebars } from "@/features/shared/ui/Mod/Modal";

const NavWrapper = ({ url, title, filled, empty, isArrow }) => {
  const { state, updater } = isArrow;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const filledArr = Array.from({ length: filled });
  const emptyArr = Array.from({ length: empty });
  const handleNavigate = () => {
    if (state?.page === 1) navigate(-1);
    else {
      updater((c) => {
        return { ...c, page: state?.page - 1 };
      });
    }
  };

  return (
    <>
      <InnerSidebars show={open} handleClose={() => setOpen(false)} />

      <Container>
        {isArrow ? (
          <>
            <div className="page-title-bar mb-3 hide-page-title">
              <Row className="align-items-center">
                <Col xs={2} xl="3">
                  <div className="d-flex align-items-center">
                    {state && updater ? (
                      <img
                        onClick={() => handleNavigate()}
                        src="/back_button2.png"
                        alt=""
                        className="arrow cursor-pointer me-1 me-md-3"
                      />
                    ) : (
                      <img
                        onClick={() => navigate(-1)}
                        src="/back_button2.png"
                        alt=""
                        className="arrow cursor-pointer me-1 me-md-3"
                      />
                    )}
                    <p className="m-0 fw-bold d-none d-lg-inline-block">Back</p>
                  </div>
                </Col>
                <Col xs={8} xl="6">
                  <p className="heading text-truncate-hd mb-sm-0">
                    {title}
                    <br />
                    {url !== "/view-employement-application" && (
                      <span className="filled d-flex gap-1 align-items-center justify-content-center">
                        {filledArr?.map((i) => (
                          <span
                            className="d-inline-flex text-[8px]"
                            key={`filled${i}`}
                          >
                            🔵 {i}
                          </span>
                        ))}
                        {emptyArr?.map((i) => (
                          <span
                            className="d-inline-flex text-[8px]"
                            key={`emptyArr${i}`}
                          >
                            {" "}
                            <FaRegCircle />{" "}
                          </span>
                        ))}
                      </span>
                    )}
                  </p>
                </Col>

                <Col xs={2} xl="3">
                  <div className="inner-menu-toggle text-end">
                    <i
                      className="fa-solid fa-bars"
                      onClick={() => setOpen(!open)}
                    ></i>
                  </div>
                </Col>
              </Row>
            </div>
          </>
        ) : (
          <>
            <div className="header">
              <p className="heading">
                {title}
                <br />
                <span className="filled d-flex gap-1 align-items-center justify-content-center">
                  {filledArr?.map((i) => (
                    <span
                      className="d-inline-flex text-[8px]"
                      key={`filled${i}`}
                    >
                      🔵
                    </span>
                  ))}
                  {emptyArr?.map((i) => (
                    <span
                      className="d-inline-flex text-[8px]"
                      key={`emptyArr${i}`}
                    >
                      {" "}
                      <FaRegCircle />{" "}
                    </span>
                  ))}
                </span>
              </p>
              <i
                className="fa-solid fa-bars"
                onClick={() => setOpen(!open)}
              ></i>
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default NavWrapper;
