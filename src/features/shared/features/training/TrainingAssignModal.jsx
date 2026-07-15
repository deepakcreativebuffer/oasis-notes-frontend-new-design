import React, { useEffect, useState } from "react";
import { Button, Form, Modal, ModalBody } from "react-bootstrap";
import MultiEmployee from "../../ui/Search/MultiEmployee";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { adminPortalService, removeApi } from "../../services/index";
import { ADMIN_APIS } from "../../services/index";
const TrainingAssignModal = (props) => {
  const [assigners, setAssigners] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [allowEmployee, setAllowEmployee] = useState([]);
  const fetchHandler = () => {
    adminPortalService.getUsersByPermission(props?.formkey, {
      setResponse: setEmployeeList,
    });
  };
  useEffect(() => {
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (employeeList) {
      const filterEmployee = employeeList.data?.filter(
        (emp) => emp?.isPermitted === true,
      );
      const assigned = filterEmployee?.map((emp) => {
        return {
          value: emp?._id,
          label: `${emp?.firstName} ${emp?.lastName}`,
          isPermitted: emp?.isPermitted,
        };
      });
      setAllowEmployee(filterEmployee);
      setAssigners(assigned);
    }
  }, [employeeList]);
  const handleAssign = (e) => {
    e.preventDefault();
    const assignerIds = assigners.map((item) => {
      return {
        _id: item?.value,
        isPermitted: true,
      };
    });
    adminPortalService.addCreatePermission(
      {
        employeesId: assignerIds,
        permission: props?.formkey,
      },
      {
        additionalFunctions: [props.onHide, fetchHandler],
      },
    );
  };
  const handleRemoveEmployee = (user) => {
    removeApi({
      url: ADMIN_APIS.ADMIN_REMOVE_CREATE_PERMISSION(user?._id, props?.formkey),
      additionalFunctions: [props.onHide, fetchHandler],
    });
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <>
        <Modal.Header closeButton>
          <h5 className="fw-bold mb-0">Assign Employee</h5>
        </Modal.Header>
        <Form onSubmit={handleAssign} className="margin-bottom-2">
          <ModalBody>
            <Form.Group className="mb-3">
              <Form.Label className="w-full font-bold">
                Select Employee
              </Form.Label>

              <MultiEmployee setValue={setAssigners} value={assigners} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="w-full font-bold">
                Assigned Employee
              </Form.Label>
              <div>
                {Array.isArray(allowEmployee) && allowEmployee?.length > 0 ? (
                  allowEmployee?.map((user, index) => (
                    <>
                      <div
                        key={`${index}-${user?._id}`}
                        className="flex justify-between gap-4 mb-[0.7rem]"
                      >
                        <Form.Control
                          className="margin-bottom-2"
                          key={index}
                          type="text"
                          value={
                            employeeList?.data?.find(
                              (emp) => emp._id === user?._id,
                            )
                              ? `${employeeList?.data?.find((emp) => emp._id === user?._id).firstName} ${employeeList?.data.find((emp) => emp._id === user?._id).lastName}`
                              : ""
                          }
                          disabled
                          readOnly
                        />
                        <span onClick={() => handleRemoveEmployee(user)}>
                          <RiDeleteBin5Fill className="cursor-pointer text-[red] mt-2" />
                        </span>
                      </div>
                    </>
                  ))
                ) : (
                  <p>No assigned employees</p>
                )}
              </div>
            </Form.Group>
          </ModalBody>
          <Modal.Footer className="justify-content-center">
            <Button className="theme-button" type="submit">
              APPLY
            </Button>
            <Button className="theme-button-ouyline" onClick={props.onHide}>
              CANCEL
            </Button>
          </Modal.Footer>
        </Form>
      </>
    </Modal>
  );
};
export default TrainingAssignModal;
