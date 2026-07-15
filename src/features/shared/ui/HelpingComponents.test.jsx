/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, render, screen } from "@/test-utils";

import {
  InDraft,
  DropList,
  TableLayout,
  DashComponent,
  emptyChecker,
} from "./HelpingComponents";
import { ROLES, ACCOUNT_TYPES } from "../constants";

// Seed helper for the auth slice — DropList reads userProfile to gate
// edit/delete affordances on clinical documents.
const authState = (userProfile = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile,
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

describe("HelpingComponents", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("emptyChecker", () => {
    it("should treat null, undefined and empty string as empty", () => {
      // WHY: EHR table cells render a dash placeholder for missing data so a
      // blank field is never confused with a meaningful value.
      expect(emptyChecker(null)).toBe(true);
      expect(emptyChecker(undefined)).toBe(true);
      expect(emptyChecker("")).toBe(true);
    });

    it("should treat populated values as non-empty", () => {
      expect(emptyChecker("MRN-TEST-001")).toBe(false);
      expect(emptyChecker(0)).toBe(false);
      expect(emptyChecker(false)).toBe(false);
    });
  });

  describe("DashComponent", () => {
    it("should render an em-dash placeholder", () => {
      render(<DashComponent />);
      // WHY: the em-dash is the canonical "no data" marker in clinical tables.
      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("InDraft", () => {
    it("should render a link pointing to the draft document", () => {
      renderWithProviders(<InDraft link="/notes/res-test-001/draft" />);
      const link = screen.getByRole("link");
      // WHY: the in-draft icon must navigate clinicians to the unfinished note.
      expect(link).toHaveAttribute("href", "/notes/res-test-001/draft");
    });
  });

  describe("TableLayout", () => {
    it("should render a loader while data is loading", () => {
      const { container } = renderWithProviders(
        <TableLayout thead={["Name"]} tbody={[]} loading={true} />,
      );
      // WHY: a loading list must not show the "no results" empty state, which
      // would falsely imply the resident has no records.
      expect(screen.queryByText(/no results found/i)).not.toBeInTheDocument();
      expect(container.querySelector("table")).not.toBeInTheDocument();
    });

    it("should render the no-results message when there are no rows", () => {
      renderWithProviders(
        <TableLayout thead={["Name"]} tbody={[]} loading={false} />,
      );
      // WHY: an empty result set surfaces an explicit empty state rather than a
      // blank table.
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });

    it("should render headers and row cells when rows are present", () => {
      renderWithProviders(
        <TableLayout
          thead={["Patient", "MRN"]}
          tbody={[["Test Patient", "MRN-TEST-001"]]}
          loading={false}
        />,
      );
      expect(
        screen.getByRole("columnheader", { name: /Patient/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("cell", { name: "Test Patient" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("cell", { name: "MRN-TEST-001" }),
      ).toBeInTheDocument();
    });

    it("should render a dash for empty cells", () => {
      renderWithProviders(
        <TableLayout
          thead={["Patient", "MRN"]}
          tbody={[["Test Patient", ""]]}
          loading={false}
        />,
      );
      // WHY: missing cell data is replaced with a dash so clinicians can tell a
      // field is intentionally blank versus a render bug.
      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("DropList", () => {
    it("should render the view action by default", () => {
      renderWithProviders(<DropList viewLink="/notes/res-test-001/view" />, {
        preloadedState: authState({ _id: "emp-test-001" }),
      });
      // WHY: every document row exposes a view link unless explicitly hidden.
      const links = screen.getAllByRole("link");
      expect(
        links.some(
          (l) => l.getAttribute("href") === "/notes/res-test-001/view",
        ),
      ).toBe(true);
    });

    it("should hide the view action when showView is false", () => {
      renderWithProviders(
        <DropList showView={false} viewLink="/notes/res-test-001/view" />,
        { preloadedState: authState({ _id: "emp-test-001" }) },
      );
      const links = screen.queryAllByRole("link");
      // WHY: hiding the view action removes the view link entirely.
      expect(
        links.some(
          (l) => l.getAttribute("href") === "/notes/res-test-001/view",
        ),
      ).toBe(false);
    });

    it("should render the download action when showDownload is set", () => {
      renderWithProviders(
        <DropList
          showView={false}
          showDownload
          download="/notes/res-test-001/pdf"
        />,
        { preloadedState: authState({ _id: "emp-test-001" }) },
      );
      const links = screen.getAllByRole("link");
      // WHY: the download affordance must link to the document PDF export.
      expect(
        links.some((l) => l.getAttribute("href") === "/notes/res-test-001/pdf"),
      ).toBe(true);
    });

    it("should show the edit action for an admin user", () => {
      renderWithProviders(
        <DropList showView={false} editLink="/notes/res-test-001/edit" />,
        {
          preloadedState: authState({
            _id: "emp-test-001",
            userType: ROLES.ADMIN,
          }),
        },
      );
      const links = screen.getAllByRole("link");
      // WHY: admins can always edit clinical documents regardless of signature
      // state.
      expect(
        links.some(
          (l) => l.getAttribute("href") === "/notes/res-test-001/edit",
        ),
      ).toBe(true);
    });

    it("should not show edit for a regular employee without edit permission", () => {
      renderWithProviders(
        <DropList showView={false} editLink="/notes/res-test-001/edit" />,
        {
          preloadedState: authState({
            _id: "emp-test-001",
            userType: ROLES.EMPLOYEE,
            accountType: ACCOUNT_TYPES.REGULAR,
            permissionEditDocuments: false,
          }),
        },
      );
      const links = screen.queryAllByRole("link");
      // WHY: a regular employee lacking edit permission must not get an edit
      // affordance on documents.
      expect(
        links.some(
          (l) => l.getAttribute("href") === "/notes/res-test-001/edit",
        ),
      ).toBe(false);
    });

    it("should force edit visible when canEdit prop is true", () => {
      renderWithProviders(
        <DropList
          showView={false}
          canEdit
          editLink="/notes/res-test-001/edit"
        />,
        {
          preloadedState: authState({
            _id: "emp-test-001",
            userType: ROLES.EMPLOYEE,
            accountType: ACCOUNT_TYPES.REGULAR,
          }),
        },
      );
      const links = screen.getAllByRole("link");
      // WHY: the canEdit override lets a parent grant edit explicitly.
      expect(
        links.some(
          (l) => l.getAttribute("href") === "/notes/res-test-001/edit",
        ),
      ).toBe(true);
    });

    it("should hide edit when isSignAvailable is false even for admins", () => {
      renderWithProviders(
        <DropList
          showView={false}
          isSignAvailable={false}
          editLink="/notes/res-test-001/edit"
        />,
        {
          preloadedState: authState({
            _id: "emp-test-001",
            userType: ROLES.ADMIN,
          }),
        },
      );
      const links = screen.queryAllByRole("link");
      // WHY: a fully-signed document can no longer be edited, so the edit action
      // is suppressed.
      expect(
        links.some(
          (l) => l.getAttribute("href") === "/notes/res-test-001/edit",
        ),
      ).toBe(false);
    });

    it("should call deleteLink when the delete icon is clicked for an admin", async () => {
      const user = userEvent.setup();
      const deleteLink = vi.fn();
      const { container } = renderWithProviders(
        <DropList showView={false} deleteLink={deleteLink} />,
        {
          preloadedState: authState({
            _id: "emp-test-001",
            userType: ROLES.ADMIN,
          }),
        },
      );
      const delBtn = container.querySelector(".del-btn");
      expect(delBtn).not.toBeNull();
      await user.click(delBtn.querySelector("svg"));
      // WHY: clicking delete triggers the parent's removal handler for the
      // clinical record.
      expect(deleteLink).toHaveBeenCalled();
    });

    it("should not render delete when isOnlyAdmin is false", () => {
      const { container } = renderWithProviders(
        <DropList showView={false} isOnlyAdmin={false} deleteLink={vi.fn()} />,
        {
          preloadedState: authState({
            _id: "emp-test-001",
            userType: ROLES.ADMIN,
          }),
        },
      );
      // WHY: certain document contexts forbid deletion entirely.
      expect(container.querySelector(".del-btn")).toBeNull();
    });

    it("should call cloneFile when the clone icon is clicked", async () => {
      const user = userEvent.setup();
      const cloneFile = vi.fn();
      const { container } = renderWithProviders(
        <DropList showView={false} showClone cloneFile={cloneFile} />,
        { preloadedState: authState({ _id: "emp-test-001" }) },
      );
      const cloneBtn = container.querySelector(".edit-btn svg");
      expect(cloneBtn).not.toBeNull();
      await user.click(cloneBtn);
      // WHY: cloning duplicates an existing document as a starting template.
      expect(cloneFile).toHaveBeenCalled();
    });
  });
});
