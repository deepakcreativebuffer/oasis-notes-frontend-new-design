/** @format */

import React from "react";
import { NotesOptions } from "@/features/shared/constants";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";

const GroupNotes = () => {
  return (
    <>
      <NavWrapper title={"Group Notes"} type="patient" isArrow={true} />

      <Container>
        <div className="patient_chart_container">
          {NotesOptions?.map((i, index) => (
            <Link to={i?.link} key={index}>
              <img src={i.src} alt="" />
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
};

export default HOC({ Wcomponenet: GroupNotes });
