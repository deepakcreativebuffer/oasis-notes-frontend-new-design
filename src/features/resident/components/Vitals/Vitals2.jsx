/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HOC2 from "../../layout/HOC2";
import "./Vitals.css";
import { IoIosMenu } from "react-icons/io";
import { Button, Form, Offcanvas } from "react-bootstrap";
import { vitalsService } from "@/features/shared/services";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { ROLES } from "@/features/shared/constants";
const Vitals2 = () => {
  const navigate = useNavigate();
  const drColterRef = useRef(null);
  const [showC, setShowC] = useState(false);
  const [patients, setPatients] = useState([]);
  const [patientData, setPatientData] = useState({});
  const profileUser = useSelector(userProfile);
  const handleClose = () => setShowC(false);
  const [healthData, setHealthData] = useState({
    patientId: "",
    date: "",
    bodyTemperature: "",
    pulseRate: "",
    respirationRate: "",
    bloodPressure: "",
    bloodOxygen: "",
    weight: "",
    bloodGlucoseLevel: "",
    height: "",
  });
  const handleHealthDataChange = (name, value) => {
    setHealthData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const sidebarData = [
    {
      icon: <img src="/Dashboard2/1.png" alt="fdn" />,
      link: "/employee/Dashboard",
      name: "Employment Application ",
      newIcon: <img src="/Dashboard/New folder/home.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/2.png" alt="fdn" />,
      link: "/employee/group-notes",
      name: "Group Notes",
      newIcon: <img src="/Dashboard2/training.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/training.png" alt="fdn" />,
      link: "/employee/training",
      name: "Training",
      newIcon: <img src="/Dashboard/New folder/group.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/patitent-assigned.png" alt="fdn" />,
      link: "/assigned-patient/",
      name: "Assigned Patient",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/time-off.png" alt="fdn" />,
      link: "/employee/time-of-request",
      name: "Time Off Request",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/1.png" alt="fdn" />,
      link: "/employee/time-sheet",
      name: "Time Sheet/Staff Schedule",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/performance.png" alt="fdn" />,
      link: "/employee/employee-performance",
      name: "Employee Performance",
      newIcon: <img src="/public/Dashboard2/performance.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/user.png" alt="fdrn" />,
      link: "/employee/employee-tracking",
      name: "Employee Tracking/ Upload",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/chart.png" alt="fdn" />,
      link: "/employee/patient-chart ",
      name: "Patient Chart",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/vitals.png" alt="fdn" />,
      link: "/employee/vitals",
      name: "Patient Vitals",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/user.png" alt="fdn" />,
      link: "/employee/patient-tracking",
      name: "Resident Tracking",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/medication.png" alt="fdn" />,
      link: "/employee/medications",
      name: "Medications",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/setting.png" alt="fdn" />,
      link: "/employee/settings",
      name: "Settings",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
  ];
  useEffect(() => {
    const handleClick = () => {
      setShowC(true);
    };
    const handleResize = () => {
      if (window.innerWidth < 768 && drColterRef.current) {
        drColterRef.current.addEventListener("click", handleClick);
      } else if (drColterRef.current) {
        drColterRef.current.removeEventListener("click", handleClick);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (drColterRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        drColterRef.current.removeEventListener("click", handleClick);
      }
    };
  }, []);
  const getAllpatients = () => {
    vitalsService.listPatients({
      setResponse: (resData) => {
        setPatients(resData?.data || []);
      },
    });
  };
  useEffect(() => {
    getAllpatients();
  }, []);
  const submitHandler = (e) => {
    e.preventDefault();
    vitalsService.create(healthData, {
      isAdmin: profileUser?.userType === ROLES.ADMIN,
      additionalFunctions: [() => navigate("/employee/vitals")],
    });
  };
  return (
    <>
      {" "}
      <Offcanvas className="w-[70%]" show={showC} onHide={handleClose}>
        <Offcanvas.Header closeButton></Offcanvas.Header>
        <Offcanvas.Body>
          <div className="p-[10px] pt-[40px] flex flex-col gap-[10px]">
            {sidebarData.map((item, i) => (
              <Link
                key={i}
                to={item.link}
                className={`no-underline text-black flex items-center w-auto p-2 ${window.innerWidth < 768 ? "max-w-[350px]" : "max-w-auto"}`}
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      <div className="nav-wrap-personal">
        <div className="nav-div-personal w-full mb-4 flex">
          <p className="text-[0.9rem] font-bold flex-1">
            {" "}
            <p ref={drColterRef} id="drColter" className="menu-sidebar">
              <IoIosMenu />
            </p>
            VITALS
          </p>
          <p>
            <Button
              onClick={() => navigate("/employee/vitals/")}
              className="text-[0.9rem] font-bold mr-4"
              variant="primary"
            >
              VITALS
            </Button>
          </p>
        </div>
      </div>
      <div className="w-full text-left">
        <Form className="w-[90%] text-left" onSubmit={submitHandler}>
          <Form.Group className="mb-3">
            <Form.Label className="font-bold text-[0.9rem]">
              Select Patient
            </Form.Label>
            <Form.Select
              name="patient"
              className="w-full mx-auto"
              onChange={(e) =>
                handleHealthDataChange("patientId", e.target.value)
              }
            >
              <option>Select Patient</option>
              {patients?.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.fullName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3 w-full">
            <Form.Label className="font-bold text-[0.9rem]">Date</Form.Label>
            <Form.Control
              onChange={(e) => handleHealthDataChange("date", e.target.value)}
              type="date"
            />
          </Form.Group>
          <Form.Group className="mb-3 w-full">
            <Form.Label className="font-bold text-[0.9rem]">
              Body Temperature
            </Form.Label>
            <Form.Control
              onChange={(e) =>
                handleHealthDataChange("temperature", e.target.value)
              }
              type="text"
            />
          </Form.Group>
          <Form.Group className="mb-3 w-full">
            <Form.Label className="font-bold text-[0.9rem]">
              Pulse Rate
            </Form.Label>
            <Form.Control
              onChange={(e) =>
                handleHealthDataChange("pulseRate", e.target.value)
              }
              type="text"
            />
          </Form.Group>
          <Form.Group className="mb-3 w-full">
            <Form.Label className="font-bold text-[0.9rem]">
              Respirational Rate
            </Form.Label>
            <Form.Control
              onChange={(e) =>
                handleHealthDataChange("respirationRate", e.target.value)
              }
              type="text"
            />
          </Form.Group>
          <Form.Group className="mb-3 w-full">
            <Form.Label className="font-bold text-[0.9rem]">
              Blood Pressure Systolic/Diastolic
            </Form.Label>
            <Form.Control
              onChange={(e) =>
                handleHealthDataChange("bloodPressure", e.target.value)
              }
              type="text"
            />
          </Form.Group>
          <Form.Group className="mb-3 w-full">
            <Form.Label className="font-bold text-[0.9rem]">
              Blood Oxygen
            </Form.Label>
            <Form.Control
              onChange={(e) =>
                handleHealthDataChange("bloodOxygen", e.target.value)
              }
              type="text"
            />
          </Form.Group>
          <Form.Group className="mb-3 w-full">
            <Form.Label className="font-bold text-[0.9rem]">Weight</Form.Label>
            <Form.Control
              onChange={(e) => handleHealthDataChange("weight", e.target.value)}
              type="text"
            />
          </Form.Group>
          <Form.Group className="mb-3 w-full">
            <Form.Label className="font-bold text-[0.9rem]">
              Blood Glucose Level
            </Form.Label>
            <Form.Control
              onChange={(e) =>
                handleHealthDataChange("bloodGlucoseLevel", e.target.value)
              }
              type="text"
            />
          </Form.Group>
          <Form.Group className="mb-3 w-full">
            <Form.Label className="font-bold text-[0.9rem]">Height</Form.Label>
            <Form.Control
              onChange={(e) => handleHealthDataChange("height", e.target.value)}
              type="text"
            />
          </Form.Group>
          <div className="flex justify-center mt-4">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};
export default HOC2(Vitals2);
