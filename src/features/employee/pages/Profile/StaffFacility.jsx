/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, Form, Modal, ModalBody } from "react-bootstrap";
import { facilityService, removeApi } from "@/features/shared/services";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { setFacilities } from "@/store/facilitySlice";
import { ADMIN_APIS } from "@/features/shared/services";
import { showNotification } from "@/utils";
const StaffFacility = (props) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [facilityList, setFacilityList] = useState([]);
  const fetchHandler = () => {
    facilityService.list({
      setResponse: (response) => {
        setFacilityList(response);
        if (response?.data) {
          dispatch(setFacilities(response.data));
        }
      },
    });
  };
  useEffect(() => {
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.show]);
  const resetFields = () => {
    setName("");
    setLocation("");
    setIsActive(true);
  };
  const submitHandler = () => {
    if (!name.trim() || !location.trim()) {
      showNotification({
        message: "All fields are required.",
        type: "danger",
      });
      return;
    }
    try {
      facilityService.create({ name, location, isActive }, { setLoading });
      resetFields();
      props.onHide();
    } catch (error) {
      const msg = error?.response?.data?.message || "An error occurred";
      showNotification({
        message: msg,
        type: "danger",
      });
      props.onHide();
    }
  };
  const handleRemoveEmployee = (id) => {
    removeApi({
      url: ADMIN_APIS.ADMIN_DELETE_FACILITY(id),
      successMsg: "Facility removed successfully",
      additionalFunctions: [props.onHide],
    });
  };
  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => {
          resetFields();
          props.onHide();
        }}
      >
        <Modal.Header closeButton>
          <h5 className="fw-bold mb-0">Facility</h5>
        </Modal.Header>
        <ModalBody>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Facility Name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Location</Form.Label>
            <Form.Control
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter Location Address"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="isActiveSwitch"
              label="Active Status"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="w-full font-bold">Facility List</Form.Label>
            <div>
              {Array.isArray(facilityList?.data) &&
              facilityList?.data?.length > 0 ? (
                facilityList?.data?.map((faci, index) => (
                  <div
                    key={faci._id}
                    className="flex justify-between gap-4 mb-[0.7rem]"
                  >
                    <Form.Control
                      className="margin-bottom-2"
                      key={index}
                      type="text"
                      value={`${faci?.name}, ${faci?.location}`}
                      disabled
                      readOnly
                    />
                    <span onClick={() => handleRemoveEmployee(faci?._id)}>
                      <RiDeleteBin5Fill className="mt-2 cursor-pointer text-red-500" />
                    </span>
                  </div>
                ))
              ) : (
                <p>No Facility Found</p>
              )}
            </div>
          </Form.Group>
        </ModalBody>
        <Modal.Footer className="justify-content-center">
          <Button className="theme-button" onClick={submitHandler}>
            SAVE
          </Button>
          <Button
            className="theme-button-outline"
            onClick={() => {
              resetFields();
              props.onHide();
            }}
          >
            CANCEL
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default StaffFacility;
