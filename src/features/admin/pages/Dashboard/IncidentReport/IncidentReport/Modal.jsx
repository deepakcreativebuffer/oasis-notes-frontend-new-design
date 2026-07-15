/** @format */
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

// Signature Modal
export const SignatureModal = (props) => {
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
            Date : {stringDate?.split("T")?.[0]} Time : {time}{" "}
          </h6>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Enter your Lorem Ipsum"
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
};

export const UploadModal = (props) => {
  const submitHandler = (e) => {
    e.preventDefault();
    props.onHide();
    props?.handler();
  };
  return (
    <>
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="upload_box_modal">
          <form onSubmit={submitHandler}>
            <label>Resident Full Name</label>
            <select required onChange={(e) => props?.setValue(e.target.value)}>
              <option value="">Select </option>
              {props?.options?.map((i, index) => (
                <option key={index} value={i._id}>
                  {" "}
                  {i.fullName}{" "}
                </option>
              ))}
              <option></option>
            </select>
            <button type="submit">UPLOAD MEDICATION</button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
