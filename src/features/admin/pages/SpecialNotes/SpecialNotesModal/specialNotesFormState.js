const MONTH_KEYS = [
  "jan",
  "feb",
  "mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export const MONTHS3 = MONTH_KEYS;

export const MONTH2 = MONTH_KEYS;

export const createEmptyMonthState = () => ({
  jan: "None",
  feb: "None",
  mar: "None",
  Apr: "None",
  May: "None",
  Jun: "None",
  Jul: "None",
  Aug: "None",
  Sept: "None",
  Oct: "None",
  Nov: "None",
  Dec: "None",
});

export const createMonthStateFromVanItem = (item) => ({
  jan: item?.jan || "None",
  feb: item?.feb || "None",
  mar: item?.mar || "None",
  Apr: item?.Apr || "None",
  May: item?.May || "None",
  Jun: item?.Jun || "None",
  Jul: item?.Jul || "None",
  Aug: item?.Aug || "None",
  Sept: item?.Sept || "None",
  Oct: item?.Oct || "None",
  Nov: item?.Nov || "None",
  Dec: item?.Dec || "None",
});

export const INITIAL_STAFF = {
  staffName: "",
  initials: "",
};

export const FIRST_AID_ITEM_KEYS = [
  "AdhesiveStripBandages",
  "AdhesiveTap",
  "CPRMouthGuardShield",
  "DisposableLatexGloves",
  "NonStickSterilePads",
  "RollerGauze",
  "Scissors",
  "SterileGuazeSquares",
  "TriangularBandages",
  "Tweezers",
];

export const createInitialFormState = (vanEmergency, editStatus) => ({
  facilityId: vanEmergency?.facilityId?._id || vanEmergency?.facilityId || "",
  date: vanEmergency?.date || "",
  month: "",
  year: "",
  location: vanEmergency?.location || "",
  janDate: vanEmergency?.janDate || "",
  febDate: vanEmergency?.febDate || "",
  marDate: vanEmergency?.marDate || "",
  AprDate: vanEmergency?.AprDate || "",
  MayDate: vanEmergency?.MayDate || "",
  JunDate: vanEmergency?.JunDate || "",
  JulDate: vanEmergency?.JulDate || "",
  AugDate: vanEmergency?.AugDate || "",
  SeptDate: vanEmergency?.SeptDate || "",
  OctDate: vanEmergency?.OctDate || "",
  NovDate: vanEmergency?.NovDate || "",
  DecDate: vanEmergency?.DecDate || "",
  AdhesiveStripBandages: {
    item: editStatus ? vanEmergency?.AdhesiveStripBandages?.item : 0,
    ...createMonthStateFromVanItem(vanEmergency?.AdhesiveStripBandages),
  },
  AdhesiveTap: {
    item: editStatus ? vanEmergency?.AdhesiveTap?.item : 0,
    ...createMonthStateFromVanItem(vanEmergency?.AdhesiveTap),
  },
  CPRMouthGuardShield: {
    item: editStatus ? vanEmergency?.CPRMouthGuardShield?.item : 0,
    ...createMonthStateFromVanItem(vanEmergency?.CPRMouthGuardShield),
  },
  DisposableLatexGloves: {
    item: editStatus ? vanEmergency?.DisposableLatexGloves?.item : 0,
    ...createMonthStateFromVanItem(vanEmergency?.DisposableLatexGloves),
  },
  NonStickSterilePads: {
    item: editStatus ? vanEmergency?.NonStickSterilePads?.item : 0,
    ...createMonthStateFromVanItem(vanEmergency?.NonStickSterilePads),
  },
  RollerGauze: {
    item: editStatus ? vanEmergency?.RollerGauze?.item : 0,
    ...createMonthStateFromVanItem(vanEmergency?.RollerGauze),
  },
  Scissors: {
    item: editStatus ? vanEmergency?.Scissors?.item : 0,
    ...createMonthStateFromVanItem(vanEmergency?.Scissors),
  },
  SterileGuazeSquares: {
    item: editStatus ? vanEmergency?.SterileGuazeSquares?.item : 0,
    ...createMonthStateFromVanItem(vanEmergency?.SterileGuazeSquares),
  },
  TriangularBandages: {
    item: editStatus ? vanEmergency?.TriangularBandages?.item : 0,
    ...createMonthStateFromVanItem(vanEmergency?.TriangularBandages),
  },
  Tweezers: {
    item: editStatus ? vanEmergency?.Tweezers?.item : 0,
    ...createMonthStateFromVanItem(vanEmergency?.Tweezers),
  },
  staff: vanEmergency?.staff || [INITIAL_STAFF],
  firstAidChecklistData: vanEmergency?.firstAidChecklistData || [],
});

export const createInitialItemCounts = (vanEmergency) => ({
  count1: vanEmergency?.AdhesiveStripBandages?.item || 0,
  count2: vanEmergency?.AdhesiveTap?.item || 0,
  count3: vanEmergency?.CPRMouthGuardShield?.item || 0,
  count4: vanEmergency?.DisposableLatexGloves?.item || 0,
  count5: vanEmergency?.NonStickSterilePads?.item || 0,
  count6: vanEmergency?.RollerGauze?.item || 0,
  count7: vanEmergency?.Scissors?.item || 0,
  count8: vanEmergency?.SterileGuazeSquares?.item || 0,
  count9: vanEmergency?.TriangularBandages?.item || 0,
  count10: vanEmergency?.Tweezers?.item || 0,
});

export const INITIAL_SIGNATURE_STATE = {
  employeeSignature: "",
  employeeSignatureDate: "",
  employeeSignatureTime: "",
  adminSignature: "",
  adminDateSigned: "",
  adminSignedTime: "",
};

export const INITIAL_UI_STATE = {
  modalShow2: false,
  modalStartDate: "",
  modalEndDate: "",
  open: false,
  openAdmin: false,
  openSigner: false,
};

export const createFieldUpdater = (setter) => (field, value) =>
  setter((prev) => ({ ...prev, [field]: value }));

export const LANDSCAPE_PRINT_PAGE_STYLE = `
      @page {
        size: landscape !important;
        margin: 12mm 9mm!important;
      } 
      th {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }   
      .card {
        page-break-inside: avoid;
      }
      .view-details-grid {
        page-break-inside: avoid;
      }
    `;
