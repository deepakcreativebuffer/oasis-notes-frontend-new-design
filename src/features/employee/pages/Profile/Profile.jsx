/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect, useState, useRef } from "react";
import HOC from "@/features/shared/layout/Outer/HOC";
import {
  getObjectUrlFromDownloadUrl,
  profileService,
  UpdateProfile,
  UpdateProfileLogo,
} from "@/features/shared/services";
import { useFileUpload } from "@shared/hooks";
import { Container, Row, Col, Form, Card, Button } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { defaultProfileIcon, defaultLogo } from "@/assets/index";
import UpdatePassword from "./UpdatePassword";
import StaffFacility from "./StaffFacility";
import ChangePlan from "./ChangePlan";
import CanclePlan from "./CanclePlan";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import {
  MdApartment,
  MdOutlinePermIdentity,
  MdCardMembership,
  MdAccessTime,
} from "react-icons/md";
import { LiaWalletSolid } from "react-icons/lia";
import { ROLES } from "@/features/shared/constants";
import { showNotification } from "@/utils";
const InputGroup = ({
  label,
  setValue,
  value,
  placeholder,
  type = "text",
  pattern,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="Input_Group mb-3">
      <Form.Label className="fw-bold">
        {label}
        {required && <span className="text-red-500"> * </span>}
      </Form.Label>
      <Form.Control
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        pattern={type === "tel" ? pattern : undefined}
      ></Form.Control>
    </div>
  );
};
const Profile = () => {
  const ProfileDetails = useSelector(userProfile);
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middle, setMiddle] = useState("");
  const [logoImage, setLogoImage] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyNameTitle, setCompanyNameTitle] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [format, setFormat] = useState(false);
  const [showFacility, setShowFacility] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [showCanclePlan, setShowCanclePlan] = useState(false);
  const [planData, setPlanData] = useState({});
  const [isLoadingSubcription, setIsLoadingSubcription] = useState(false);
  const [allergies, setAllergies] = useState("");
  const dispatch = useDispatch();
  const profileUpload = useFileUpload({
    maxSizeMB: 2,
  });
  const logoUpload = useFileUpload({
    maxSizeMB: 2,
  });
  const fetchHandler = () => {
    profileService.getSubscriptionDetails({
      setResponse: setPlanData,
      setIsLoadingSubcription,
    });
  };
  useEffect(() => {
    fetchHandler();
  }, [showCanclePlan, showPlan]);
  useEffect(() => {
    if (ProfileDetails) {
      setEmail(ProfileDetails?.email);
      setMobileNumber(ProfileDetails?.mobileNumber || "");
      setAddress(ProfileDetails?.address);
      setFirstName(ProfileDetails?.firstName);
      setLastName(ProfileDetails?.lastName);
      setMiddle(ProfileDetails?.middle || "");
      setGender(ProfileDetails?.gender);
      setCompanyName(
        ProfileDetails?.userType === ROLES.ADMIN
          ? ProfileDetails?.companyName
          : ProfileDetails?.adminId?.companyName,
      );
      setCompanyNameTitle(
        ProfileDetails?.userType === ROLES.ADMIN
          ? ProfileDetails?.companyName
          : ProfileDetails?.adminId?.companyName,
      );
      setLogoImage(ProfileDetails?.adminId?.logo);
      setFormat(ProfileDetails?.hoursFormat);
    }
    if (ProfileDetails?.userType === ROLES.PATIENT) {
      profileService.getPatientAllergies({
        setResponse: (res) => setAllergies(res.patientDetail?.allergies),
      });
    }
  }, [ProfileDetails]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let updateUrl;
    if (ProfileDetails?.userType === ROLES.ADMIN) {
      updateUrl = `admin/updateProfile`;
    } else if (ProfileDetails?.userType === ROLES.EMPLOYEE) {
      updateUrl = `employee/updateProfile`;
    } else if (ProfileDetails.userType === ROLES.PATIENT) {
      updateUrl = `Patient/updateProfile`;
    }
    const fd = new FormData();
    if (profileUpload.file) fd.append("image", profileUpload.file);
    fd.append("firstName", firstName);
    fd.append("lastName", lastName);
    fd.append("middle", middle || "");
    fd.append("gender", gender);
    if (mobileNumber) fd.append("mobileNumber", mobileNumber);
    fd.append("email", email);
    fd.append("address", address || "");
    fd.append("companyName", companyName);
    if (ProfileDetails?.userType === ROLES.ADMIN) {
      fd.append("hoursFormat", format);
    }
    dispatch(
      UpdateProfile({
        payload: fd,
        setLoading,
        url: updateUrl,
        isAdmin: ProfileDetails?.userType === ROLES.ADMIN,
      }),
    );
  };
  const paymentHistoryHandler = () => {
    profileService.openStripeInvoice({
      setResponse: (response) => {
        if (response?.url) {
          window.open(response.url, "_blank");
        }
      },
      setIsLoadingSubcription,
    });
  };
  const paymentMethodHandler = () => {
    profileService.openStripePaymentMethod({
      setResponse: (response) => {
        if (response?.url) {
          window.open(response.url, "_blank");
        }
      },
      setIsLoadingSubcription,
    });
  };
  const handleuploadLogo = async (file) => {
    const imgfd = new FormData();
    function appendIfPresent(formValue, value, canEmpty = false) {
      if (canEmpty || value) {
        imgfd.append(formValue, value);
      }
    }
    appendIfPresent("logo", file);
    dispatch(
      UpdateProfileLogo({
        payload: imgfd,
        setLoading,
        isAdmin: ProfileDetails?.userType === ROLES.ADMIN,
      }),
    );
  };
  const handleuploadProfile = async (file) => {
    let updateUrl;
    if (ProfileDetails?.userType === ROLES.ADMIN) {
      updateUrl = `admin/updateProfile`;
    } else if (ProfileDetails?.userType === ROLES.EMPLOYEE) {
      updateUrl = `employee/updateProfile`;
    } else if (ProfileDetails.userType === ROLES.PATIENT) {
      updateUrl = `Patient/updateProfile`;
    }
    const fd = new FormData();
    fd.append("image", file);
    fd.append("firstName", firstName);
    fd.append("lastName", lastName);
    fd.append("middle", middle || "");
    fd.append("gender", gender);
    if (mobileNumber) fd.append("mobileNumber", mobileNumber);
    fd.append("email", email);
    fd.append("address", address || "");
    fd.append("companyName", companyName);
    if (ProfileDetails?.userType === ROLES.ADMIN) {
      fd.append("hoursFormat", format);
    }
    dispatch(
      UpdateProfile({
        payload: fd,
        setLoading,
        url: updateUrl,
        isAdmin: ProfileDetails?.userType === ROLES.ADMIN,
      }),
    );
  };

  const selectImage = (e) => {
    const file = e.target.files[0];
    const success = profileUpload.handleFileChange(file);
    if (success && file) {
      handleuploadProfile(file);
    }
  };
  const selectImageLogo = (e) => {
    const success = logoUpload.handleFileChange(e.target.files[0]);
    if (success) {
      handleuploadLogo(e.target.files[0]);
    }
  };
  const ChooseFile = () => {
    const target = fileInputRef.current;
    target.click();
  };
  const ChooseFileLogo = () => {
    const target = logoInputRef.current;
    target.click();
  };
  return (
    <>
      <UpdatePassword show={modalShow} onHide={() => setModalShow(false)} />
      <StaffFacility
        show={showFacility}
        onHide={() => setShowFacility(false)}
      />
      <ChangePlan
        show={showPlan}
        onHide={() => setShowPlan(false)}
        plan={planData?.data?.tier}
      />
      <CanclePlan
        show={showCanclePlan}
        onHide={() => setShowCanclePlan(false)}
        planCheck={
          planData?.data && planData?.data?.subscription?.cancel_at_period_end
        }
      />

      <Container>
        <div className="page-name-bar mb-2">
          <Row className="align-items-center">
            <Col xs={8} sm={7} md={8} xl={8}>
              <p className="page-name fw-bold mb-0">Company & User Profile</p>
            </Col>
            <Col xs={4} sm={5} md={4} xl={4}>
              {ProfileDetails?.userType === ROLES.ADMIN && (
                <div className="d-flex justify-content-end">
                  <button
                    onClick={() => setShowFacility(true)}
                    className="blue-theme-btn"
                  >
                    {" "}
                    Add Facility{" "}
                  </button>
                </div>
              )}
            </Col>
          </Row>
        </div>
        <div className="main-page-content">
          <Row>
            <Col xs={12} lg={4} xl={3}>
              <div className="profile-section">
                <div className="main">
                  <div className="contain">
                    <Card body className="mb-3 border-0 relative shadow-sm">
                      <div className="header-card-title mb-3">
                        <div className="d-flex align-items-center">
                          <MdApartment className="me-2 icon-color" />
                          <h6 className="mb-0">Company Info</h6>
                        </div>
                      </div>
                      <div className="border px-2 py-2 rounded-2">
                        <img
                          src={
                            logoUpload.preview
                              ? logoUpload.preview
                              : ProfileDetails?.adminId?.logo ||
                                  ProfileDetails?.logo
                                ? getObjectUrlFromDownloadUrl(
                                    ProfileDetails?.adminId?.logo ||
                                      ProfileDetails?.logo,
                                  )
                                : defaultLogo
                          }
                          alt=""
                          className="w-auto object-contain rounded-none bg-white max-h-[62px]"
                        />
                      </div>
                      <h6 className="mt-3 mb-0 text-center fw-bold">
                        {companyNameTitle}
                      </h6>
                      <div className="upload-profile">
                        {ProfileDetails?.userType === ROLES.ADMIN && (
                          <button
                            onClick={() => ChooseFileLogo()}
                            className="blue-theme-btn mb-2"
                          >
                            {" "}
                            Change Logo{" "}
                          </button>
                        )}
                        {ProfileDetails?.userType === ROLES.ADMIN && (
                          <div className="Input_Group">
                            <input
                              type={"file"}
                              className="d-none"
                              ref={logoInputRef}
                              accept=".jpg,.png"
                              onChange={(e) => selectImageLogo(e)}
                            />
                          </div>
                        )}
                      </div>
                      <div className="d-flex justify-content-center">
                        <button
                          onClick={() => setModalShow(true)}
                          className="blue-theme-btn"
                        >
                          {ProfileDetails?.userType === ROLES.ADMIN
                            ? "Change Admin Password"
                            : "Change Password"}
                        </button>
                      </div>
                    </Card>
                    <Card
                      body
                      className="mb-3 border-0 shadow-sm user-profile-card"
                    >
                      <div className="header-card-title mb-3">
                        <div className="d-flex align-items-center">
                          <MdOutlinePermIdentity className="me-2 icon-color" />
                          <h6 className="mb-0">User Profile</h6>
                        </div>
                      </div>
                      <img
                        src={
                          profileUpload.preview
                            ? profileUpload.preview
                            : ProfileDetails?.profilePic
                              ? getObjectUrlFromDownloadUrl(
                                  ProfileDetails?.profilePic,
                                )
                              : defaultProfileIcon
                        }
                        alt=""
                        className="cursor-pointer user-profile-image"
                      />
                      <h6 className="mt-3 mb-0 text-center fw-bold">
                        {" "}
                        {ProfileDetails?.firstName ?? ""}{" "}
                        {ProfileDetails?.middleName ?? ""}{" "}
                        {ProfileDetails?.lastName ?? ""}{" "}
                      </h6>
                      <div className="upload-profile">
                        <button
                          onClick={() => ChooseFile()}
                          className="blue-theme-btn"
                        >
                          {" "}
                          Change Profile{" "}
                        </button>
                        <div className="Input_Group">
                          <input
                            type={"file"}
                            className="d-none"
                            ref={fileInputRef}
                            onChange={(e) => selectImage(e)}
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={12} lg={8} xl={9}>
              <Card body className="mb-3 border-0 shadow-sm">
                <div className="header-card-title mb-3">
                  <div className="d-flex align-items-center">
                    <MdOutlinePermIdentity className="me-2 icon-color" />
                    <h6 className="mb-0">User Info</h6>
                  </div>
                </div>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col xs={12} lg={4}>
                      <InputGroup
                        label={"First Name"}
                        setValue={setFirstName}
                        value={firstName}
                        type="text"
                        placeholder="First Name"
                        required={true}
                      />
                    </Col>
                    <Col xs={12} lg={4}>
                      <InputGroup
                        label={"Middle Name"}
                        setValue={setMiddle}
                        value={middle}
                        type="text"
                        placeholder="Middle Name"
                      />
                    </Col>
                    <Col xs={12} lg={4}>
                      <InputGroup
                        label={"Last Name"}
                        setValue={setLastName}
                        value={lastName}
                        type="text"
                        placeholder="Last Name"
                        required={true}
                      />
                    </Col>
                    <Col xs={12} lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Gender</Form.Label>
                        <Form.Select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Transgender">Transgender</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={12} lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Time Format</Form.Label>
                        <Form.Select
                          disabled={ProfileDetails?.userType !== ROLES.ADMIN}
                          value={format}
                          onChange={(e) => setFormat(e.target.value)}
                        >
                          <option value="">Select Format</option>
                          <option value="24">24 hrs</option>
                          <option value="12">12 hrs</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    {ProfileDetails?.userType === ROLES.PATIENT && (
                      <Col xs={12} lg={6}>
                        <InputGroup
                          label="Allergies and reactions"
                          value={allergies}
                          type="text"
                          disabled={true}
                        />
                      </Col>
                    )}
                    <Col xs={12} lg={6}>
                      <InputGroup
                        label={"Mobile Number"}
                        setValue={setMobileNumber}
                        value={mobileNumber}
                        type="tel"
                        placeholder="Mobile Number"
                      />
                    </Col>
                    <Col xs={12} lg={6}>
                      <InputGroup
                        label={"Email Address"}
                        setValue={setEmail}
                        value={email}
                        type="email"
                        placeholder="email@gmail.com"
                        required={ProfileDetails?.userType !== ROLES.PATIENT}
                      />
                    </Col>
                    <Col xs={12} lg={12}>
                      <InputGroup
                        label={"Address"}
                        setValue={setAddress}
                        value={address}
                        type="textarea"
                      />
                    </Col>
                    <Col xs={12} lg={12}>
                      {ProfileDetails?.userType === ROLES.ADMIN && (
                        <InputGroup
                          label={"Company Name"}
                          setValue={setCompanyName}
                          value={companyName}
                          type="text"
                        />
                      )}
                    </Col>
                  </Row>
                  <div className="card-footer-bottom footer-margin mt-3">
                    <Row className="text-center">
                      <Col xs={12} lg={12}>
                        <Button type="submit" className="theme-button mt-3">
                          {" "}
                          {loading ? <ClipLoader color="#fff" /> : "Update"}
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
        {ProfileDetails?.userType === ROLES.ADMIN && (
          <Card className="border-0 shadow-sm" body>
            <div className="header-card-title mb-3">
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <div className="d-flex align-items-center me-2">
                    <MdCardMembership className="me-2 icon-color" />
                    <h6 className="mb-0">Subscription</h6>
                  </div>
                  <div
                    className="d-flex align-items-center mx-4 cursor-pointer payment-hover"
                    onClick={paymentHistoryHandler}
                  >
                    <MdAccessTime className="me-2 icon-color" />
                    <h6 className="mb-0">Payment History</h6>
                  </div>
                  <div
                    className="d-flex align-items-center mx-4 cursor-pointer payment-hover"
                    onClick={paymentMethodHandler}
                  >
                    <LiaWalletSolid className="me-2 icon-color" />
                    <h6 className="mb-0">Payment Method</h6>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    onClick={() => setShowCanclePlan(true)}
                    className="blue-theme-btn-outline"
                  >
                    {planData?.data?.subscription?.cancel_at_period_end
                      ? `Resume Plan`
                      : `Cancel Plan`}
                  </button>
                  <button
                    onClick={() => setShowPlan(true)}
                    className={`blue-theme-btn opacity-[${planData?.data?.subscription?.cancel_at_period_end ? 50 : 100}]`}
                    disabled={
                      planData?.data?.subscription?.cancel_at_period_end
                    }
                  >
                    Change Plan
                  </button>
                </div>
              </div>
            </div>
            <Row className="mt-3">
              <Col xs={12} lg={6}>
                <Row>
                  <Col xs={12} sm={12} lg={8}>
                    <div className="subcription-name">
                      <Form.Label className="fw-bold subcription-label">
                        Subscription Name :
                      </Form.Label>
                      <Form.Text className="mx-2 subcription-value">
                        {planData?.data?.tier}
                      </Form.Text>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} lg={4}>
                    <div className="subcription-status">
                      <Form.Label className="fw-bold subcription-status-label">
                        Status :
                      </Form.Label>
                      <Form.Text className="mx-2 subcription-status-value">
                        {planData?.data?.subscription?.status
                          .charAt(0)
                          .toUpperCase() +
                          planData?.data?.subscription?.status.slice(1) ||
                          "Loading..."}
                      </Form.Text>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={12}>
                    <div className="subcription-desc">
                      <Form.Text className="w-100">
                        Designed for growing businesses, this plan offers
                        enhanced features and increased capacity to scale your
                        operations. With flexibility at its core, you can
                        upgrade or downgrade at any time to match your evolving
                        requirements.
                      </Form.Text>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xs={12} lg={6}>
                {planData?.data?.subscription?.status === "trialing" ? (
                  <Row>
                    <Col>
                      {" "}
                      <div className="subcription-date">
                        <Form.Label className="subcription-date-label">
                          {planData?.data?.subscription?.trial_end &&
                            `Trial Expire Date`}{" "}
                        </Form.Label>
                        <Form.Text className="mx-2 subcription-date-value">
                          {" "}
                          {planData?.data?.subscription?.trial_end
                            ? formatDateToMMDDYYYY(
                                new Date(
                                  planData?.data?.subscription?.trial_end *
                                    1000,
                                ),
                              )
                            : "Loading..."}
                        </Form.Text>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col xs={12} sm={12} lg={12}>
                      <div className="subcription-date">
                        <Form.Label className="subcription-date-label">
                          Start Date
                        </Form.Label>
                        <Form.Text className="mx-2 subcription-date-value">
                          {" "}
                          {planData?.data?.subscription?.current_period_start
                            ? formatDateToMMDDYYYY(
                                new Date(
                                  planData?.data?.subscription
                                    ?.current_period_start * 1000,
                                ),
                              )
                            : "Loading..."}
                        </Form.Text>
                      </div>
                      <div className="subcription-date">
                        <Form.Label className="subcription-date-label">
                          {planData?.data?.subscription?.cancel_at_period_end
                            ? `Plan Expire Date`
                            : `Next Invoice Date`}{" "}
                        </Form.Label>
                        <Form.Text className="mx-2 subcription-date-value">
                          {" "}
                          {planData?.data?.subscription?.next_invoice_date
                            ? formatDateToMMDDYYYY(
                                new Date(
                                  planData?.data?.subscription
                                    ?.next_invoice_date * 1000,
                                ),
                              )
                            : "Loading..."}
                        </Form.Text>
                      </div>
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          </Card>
        )}
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: Profile,
});
