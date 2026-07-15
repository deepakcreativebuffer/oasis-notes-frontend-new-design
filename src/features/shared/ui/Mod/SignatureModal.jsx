/** @format */
import { useEffect, useState, memo } from "react";
import { Modal } from "react-bootstrap";
import { formatDateToMMDDYYYY } from "@/utils/utils";

export const SignatureModal = memo((props) => {
  const today = new Date();
  const stringDate = today.toISOString();
  const [time, setTime] = useState("");
  const [name, setName] = useState(props?.value);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const today = new Date();
      const hours = today.getHours();
      const min = today.getMinutes();
      const seconds = today.getSeconds();
      setTime(`${hours}:${min}:${seconds}`);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  function valueSetter() {
    props?.setValue(name);
    props?.setTime(time);
    props?.setDate(stringDate?.split("T")?.[0]);
    props.onHide();
  }
  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="sing_modla"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="singature_modal">
          <h6> Digitally Signed by {props?.value} </h6>
          <h6>
            {" "}
            Date : {stringDate && formatDateToMMDDYYYY(stringDate)} Time :{" "}
            {time}{" "}
          </h6>
          <input
            autoFocus
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Enter your Lorem Ipsum"
            aria-label="Signature Name"
          />
        </Modal.Body>
        <Modal.Footer>
          <button type="button" onClick={valueSetter}>
            Submit
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
});
