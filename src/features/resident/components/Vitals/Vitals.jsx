import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Vitals.css";
import { Offcanvas } from "react-bootstrap";
import { vitalsService } from "@/features/shared/services";
import { resolveVitalAssetPath } from "@/assets";
const Vitals = () => {
  const drColterRef = useRef(null);
  const [showC, setShowC] = useState(false);
  const [patientData, setPatientData] = useState({});
  const handleClose = () => setShowC(false);
  const sidebarData = [
    {
      icon: <img src="/Dashboard2/1.png" alt="fdn" />,
      name: "Employment Application ",
      newIcon: <img src="/Dashboard/New folder/home.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/2.png" alt="fdn" />,
      name: "Group Notes",
      newIcon: <img src="/Dashboard2/training.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/training.png" alt="fdn" />,
      name: "Training",
      newIcon: <img src="/Dashboard/New folder/group.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/patitent-assigned.png" alt="fdn" />,
      name: "Assigned Patient",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/time-off.png" alt="fdn" />,
      name: "Time Off Request",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/1.png" alt="fdn" />,
      name: "Time Sheet/Staff Schedule",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/performance.png" alt="fdn" />,
      name: "Employee Performance",
      newIcon: <img src="/public/Dashboard2/performance.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/user.png" alt="fdrn" />,
      name: "Employee Tracking/ Upload",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/chart.png" alt="fdn" />,
      name: "Patient Chart",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/vitals.png" alt="fdn" />,
      name: "Patient Vitals",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/user.png" alt="fdn" />,
      name: "Resident Tracking",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/medication.png" alt="fdn" />,
      name: "Medications",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/setting.png" alt="fdn" />,
      name: "Settings",
      newIcon: <img src=" /Dashboard/New folder/user.png" alt="fdn" />,
    },
    {
      icon: <img src="/Dashboard2/setting.png" alt="fdn" />,
      name: "Settings",
      newIcon: (
        <img
          src={resolveVitalAssetPath("/Dashboard2/Vitals/hieght.png")}
          alt="fdn"
        />
      ),
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
  const getPatitentData = (id) => {
    vitalsService.getByPatientId(id, {
      setResponse: (resData) => {
        setPatientData(resData?.data?.[0] || {});
      },
    });
  };
  useEffect(() => {
    getPatitentData();
  }, []);
  return (
    <>
      {" "}
      <Offcanvas className="w-[70%]" show={showC} onHide={handleClose}>
        <Offcanvas.Header closeButton></Offcanvas.Header>
        <Offcanvas.Body>
          <div className="flex flex-col gap-[10px] p-[10px] pt-[40px]">
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
          <p className="text-[1.3rem] font-semibold flex-1 text-black">
            {" "}
            VITALS
          </p>
        </div>
      </div>
      <div className="main-div-employment vital-grid w-[90%] mx-auto text-center">
        <div className="shadow-[0_5px_15px_rgba(0,0,0,0.35)] px-4 py-2 rounded-[10px]">
          <img
            className="w-auto h-auto max-w-[90px] max-h-[70px] mx-auto"
            src={resolveVitalAssetPath("/Dashboard2/Vitals/thermameter.png")}
            alt="Employment"
          />
          <p className="font-bold text-[0.9rem] leading-[0.8rem] mt-4 text-black">
            Body Temp.
          </p>
          <p className="text-[#1A9FB2] text-base font-bold">
            {patientData?.bodyTemperature}22°C
          </p>
        </div>
        <div className="shadow-[0_5px_15px_rgba(0,0,0,0.35)] px-4 py-2 rounded-[10px]">
          <img
            className="w-auto h-auto max-w-[90px] max-h-[70px] mx-auto"
            src={resolveVitalAssetPath("/Dashboard2/Vitals/heart.png")}
            alt="Employment"
          />
          <p className="font-bold text-[0.9rem] leading-[0.8rem] mt-4 text-black">
            Pulse Rate
          </p>
          <p className="text-[#1A9FB2] text-base font-bold">
            {patientData?.pulseRate}46
          </p>
        </div>
        <div className="shadow-[0_5px_15px_rgba(0,0,0,0.35)] px-4 py-2 rounded-[10px]">
          <img
            className="w-auto h-auto max-w-[90px] max-h-[70px] mx-auto"
            src={resolveVitalAssetPath("/Dashboard2/Vitals/lungs.png")}
            alt="Employment"
          />
          <p className="font-bold text-[0.9rem] leading-[0.8rem] mt-4 text-black">
            Respiration Rate
          </p>
          <p className="text-[#1A9FB2] text-base font-bold">
            {patientData?.respirationRate}
          </p>
        </div>
        <div className="shadow-[0_5px_15px_rgba(0,0,0,0.35)] px-4 py-2 rounded-[10px]">
          <img
            className="w-auto h-auto max-w-[90px] max-h-[70px] mx-auto"
            src={resolveVitalAssetPath("/Dashboard2/Vitals/hand.png")}
            alt="Employment"
          />
          <p className="font-bold text-[0.9rem] leading-[0.8rem] mt-4 text-black">
            Blood Pressure Systolic/Diastolic
          </p>
          <p className="text-[#1A9FB2] text-base font-bold">
            {patientData?.bloodPressure}
          </p>
        </div>
        <div className="shadow-[0_5px_15px_rgba(0,0,0,0.35)] px-4 py-2 rounded-[10px]">
          <img
            className="w-auto h-auto max-w-[90px] max-h-[70px] mx-auto"
            src={resolveVitalAssetPath("/Dashboard2/Vitals/o2.png")}
            alt="Employment"
          />
          <p className="font-bold text-[0.9rem] leading-[0.8rem] mt-4 text-black">
            Blood Oxygen
          </p>
          <p className="text-[#1A9FB2] text-base font-bold">
            {patientData?.bloodOxygen}
          </p>
        </div>
        <div className="shadow-[0_5px_15px_rgba(0,0,0,0.35)] px-4 py-2 rounded-[10px]">
          <img
            className="w-auto h-auto max-w-[90px] max-h-[70px] mx-auto"
            src={resolveVitalAssetPath("/Dashboard2/Vitals/clock.png")}
            alt="Employment"
          />
          <p className="font-bold text-[0.9rem] leading-[0.8rem] mt-4 text-black">
            Weight
          </p>
          <p className="text-[#1A9FB2] text-base font-bold">
            {patientData?.weight}
          </p>
        </div>
        <div className="shadow-[0_5px_15px_rgba(0,0,0,0.35)] px-4 py-2 rounded-[10px]">
          <img
            className="w-auto h-auto max-w-[90px] max-h-[70px] mx-auto"
            src={resolveVitalAssetPath("/Dashboard2/Vitals/last.png")}
            alt="Employment"
          />
          <p className="font-bold text-[0.9rem] leading-[0.8rem] mt-4 text-black">
            Blood Glucose Level
          </p>
          <p className="text-[#1A9FB2] text-base font-bold">
            {patientData?.bloodGlucoseLevel}
          </p>
        </div>
        <div className="shadow-[0_5px_15px_rgba(0,0,0,0.35)] p-2 px-4 rounded-[10px]">
          <img
            className="w-auto h-auto max-w-[90px] max-h-[70px] mx-auto"
            src={resolveVitalAssetPath("/Dashboard2/Vitals/hieght.png")}
            alt="Employment"
          />
          <p className="font-bold text-[0.9rem] leading-[0.8rem] mt-4 text-black">
            Height
          </p>
          <p className="text-[#1A9FB2] text-base font-bold">
            {patientData?.bloodGlucoseLevel}
          </p>
        </div>
      </div>
    </>
  );
};
export default Vitals;
