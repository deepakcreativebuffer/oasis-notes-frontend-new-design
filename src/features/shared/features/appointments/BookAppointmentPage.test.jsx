/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent, waitFor } from "@/test-utils";
import { Routes, Route } from "react-router-dom";

import BookAppointmentEmployeePage, {
  BookAppointmentResidentPage,
} from "./BookAppointmentPage";
import { patientService, residentService } from "../../services/index";

// ─── Mock layout HOCs: they pull in Navbar/Sidebar (heavy, redux + routing).
// Render the wrapped component directly so we test only the form. ──────────
vi.mock("../../layout/Outer/HOC", () => ({
  default:
    ({ Wcomponenet }) =>
    () => <Wcomponenet />,
}));
vi.mock("../../layout/Inner/HOC", () => ({
  default:
    ({ Wcomponenet }) =>
    () => <Wcomponenet />,
}));

// NavWrapper renders InnerSidebars + icons; stub it to just show the title.
vi.mock("@/utils/NavWrapper", () => ({
  default: ({ title }) => <div data-testid="nav-title">{title}</div>,
}));

// react-datepicker needs no real calendar here; expose a probe input so we can
// drive onChange (the appointment date) directly.
vi.mock("react-datepicker", () => ({
  default: ({ onChange, placeholderText }) => (
    <input
      aria-label="appointment-date"
      placeholder={placeholderText}
      onChange={(e) =>
        onChange(e.target.value ? new Date(e.target.value) : null)
      }
    />
  ),
}));

// ClipLoader -> simple sentinel so the loading branch is assertable.
vi.mock("react-spinners", () => ({
  ClipLoader: () => <span data-testid="clip-loader">loading...</span>,
}));

// Domain services — NEVER hit real HTTP. ───────────────────────────────────
vi.mock("../../services/index", () => ({
  patientService: {
    getById: vi.fn(),
    createAppointment: vi.fn(),
  },
  residentService: {
    bookAppointment: vi.fn(),
  },
}));

const employeeProfile = (overrides = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile: {
      _id: "emp-test-001",
      firstName: "Test",
      lastName: "Employee",
      userType: "Employee",
      mobileNumber: "5550000",
      hoursFormat: "12",
      ...overrides,
    },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

const residentProfile = (overrides = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile: {
      _id: "res-test-001",
      firstName: "Test",
      lastName: "Patient",
      userType: "Patient",
      mobileNumber: "5551111",
      hoursFormat: "12",
      ...overrides,
    },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

// renderWithProviders mounts only a bare MemoryRouter, so useParams() returns
// {} unless we wrap the page in a matching <Route path>. Mount the employee
// page under a :id route so the route patientId is available.
const renderEmployee = (state, id = "res-test-001") =>
  renderWithProviders(
    <Routes>
      <Route
        path="/book-appointment/:id"
        element={<BookAppointmentEmployeePage />}
      />
    </Routes>,
    { preloadedState: state, route: `/book-appointment/${id}` },
  );

const renderResident = (state) =>
  renderWithProviders(<BookAppointmentResidentPage />, {
    preloadedState: state,
    route: "/appointments",
  });

// Form.Label is not wired via htmlFor, so getByLabelText fails for the
// textareas/inputs. Find them by their distinguishing attributes instead.
const reasonField = () => document.querySelector('textarea[maxlength="500"]');
const addressField = () => document.querySelector('textarea[maxlength="100"]');

describe("BookAppointmentPage", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("employee portal", () => {
    it("should render the employee booking form titled 'Book Appointment'", () => {
      patientService.getById.mockImplementation(() => {});
      renderEmployee(employeeProfile());

      // WHY: staff-facing flow must announce it is the booking screen.
      expect(screen.getByTestId("nav-title")).toHaveTextContent(
        "Book Appointment",
      );
      expect(
        screen.getByRole("button", { name: /submit/i }),
      ).toBeInTheDocument();
    });

    it("should prefill name/contact from the patient fetched by route id", async () => {
      // Component calls patientService.getById(id, { setResponse }) and uses the
      // resolved patient to fill the form.
      patientService.getById.mockImplementation((id, { setResponse }) => {
        setResponse({
          data: {
            firstName: "Test",
            lastName: "Patient",
            mobileNumber: "5552222",
          },
        });
      });

      renderEmployee(employeeProfile());

      await waitFor(() =>
        expect(patientService.getById).toHaveBeenCalledWith(
          "res-test-001",
          expect.objectContaining({ setResponse: expect.any(Function) }),
        ),
      );
      // WHY: booking on behalf of a patient must carry that patient's identity.
      expect(screen.getByDisplayValue("Test Patient")).toBeInTheDocument();
      expect(screen.getByDisplayValue("5552222")).toBeInTheDocument();
    });

    it("should reject non-numeric input in the employee contact number field", () => {
      patientService.getById.mockImplementation(() => {});
      renderEmployee(employeeProfile());

      // Name is first input; Contact Number is the second non-datepicker input.
      const inputs = Array.from(document.querySelectorAll("input")).filter(
        (el) => el.getAttribute("aria-label") !== "appointment-date",
      );
      const contact = inputs[1];
      fireEvent.change(contact, { target: { value: "abc" } });
      // WHY: phone numbers are digits-only; letters must be silently dropped.
      expect(contact.value).not.toContain("abc");
    });

    it("should submit the appointment payload via patientService.createAppointment", async () => {
      patientService.getById.mockImplementation((id, { setResponse }) => {
        setResponse({
          data: { firstName: "Test", lastName: "Patient", mobileNumber: "555" },
        });
      });
      patientService.createAppointment.mockResolvedValue({ error: false });

      renderEmployee(employeeProfile());

      fireEvent.change(addressField(), { target: { value: "123 Test St" } });
      fireEvent.change(reasonField(), {
        target: { value: "Annual checkup" },
      });
      // Submit via the form element so jsdom HTML5 constraint validation does
      // not silently swallow the submit (button click would).
      fireEvent.submit(reasonField().closest("form"));

      await waitFor(() =>
        expect(patientService.createAppointment).toHaveBeenCalledTimes(1),
      );
      // WHY: the patientId from the route must travel with the booking so the
      // appointment is attached to the right patient record.
      const [payload] = patientService.createAppointment.mock.calls[0];
      expect(payload).toMatchObject({
        patientId: "res-test-001",
        reasonForVisit: "Annual checkup",
      });
    });

    it("should disable submit for a RESTRICTED employee account", () => {
      patientService.getById.mockImplementation(() => {});
      renderEmployee(
        employeeProfile({ accountType: "restricted", userType: "Employee" }),
      );

      // WHY: restricted staff may view but must not create appointments.
      expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
    });
  });

  describe("resident portal", () => {
    it("should render the resident form titled 'Appointment Tracking Log' and prefill identity", () => {
      renderResident(residentProfile());

      expect(screen.getByTestId("nav-title")).toHaveTextContent(
        "Appointment Tracking Log",
      );
      // WHY: a resident books for themselves, so their own name/phone prefill.
      expect(screen.getByDisplayValue("Test Patient")).toBeInTheDocument();
      expect(screen.getByDisplayValue("5551111")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /submit details/i }),
      ).toBeInTheDocument();
    });

    it("should not call the booking service when required fields are missing", () => {
      renderResident(
        residentProfile({ firstName: "", lastName: "", mobileNumber: "" }),
      );

      fireEvent.click(screen.getByRole("button", { name: /submit details/i }));

      // WHY: the resident form validates locally; an empty form must not reach
      // the backend.
      expect(residentService.bookAppointment).not.toHaveBeenCalled();
    });

    it("should book the appointment when all required fields are filled", async () => {
      residentService.bookAppointment.mockResolvedValue({ error: false });

      renderResident(residentProfile());

      fireEvent.change(screen.getByLabelText("appointment-date"), {
        target: { value: "2026-07-01" },
      });
      fireEvent.change(reasonField(), { target: { value: "Follow up" } });
      fireEvent.change(addressField(), { target: { value: "123 Test St" } });

      fireEvent.click(screen.getByRole("button", { name: /submit details/i }));

      await waitFor(() =>
        expect(residentService.bookAppointment).toHaveBeenCalledTimes(1),
      );
      const [payload] = residentService.bookAppointment.mock.calls[0];
      // WHY: resident bookings have no patientId (the resident IS the patient).
      expect(payload).toMatchObject({
        name: "Test Patient",
        reasonForVisit: "Follow up",
        address: "123 Test St",
      });
      expect(payload).not.toHaveProperty("patientId");
    });
  });
});
