/** @format */

import React from "react";
import HOC from "@/features/shared/layout/Outer/HOC";
import { Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { IntakeArr } from "@/features/shared/constants";

const Intake = () => {
  const { id } = useParams();
  return (
    <Container className="full-width-container">
      <div className="patient_chart_container Intake-cont  mt-4">
        {IntakeArr?.map((i, index) => (
          <div className="cont dashboard_cont" key={`img${index}`}>
            <Link to={`${i.link}/${id}`}>
              <div className="chart_images dashboard">
                <img src={i.img} alt="" />
                <p> {i.title} </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default HOC({ Wcomponenet: Intake });
