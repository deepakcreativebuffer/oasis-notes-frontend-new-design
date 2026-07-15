/* eslint-disable no-unused-vars */
/** @format */
import React from "react";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { usePrint } from "@shared/hooks";

export const useViewResidentIntakesPrint = ({
  getApiData,
  patientDetail,
  setPrintAllMode,
}) => {
  const printRef = React.useRef(null);
  //section 1
  const componentRef1 = React.useRef();
  const handlePrint1 = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef1.current.cloneNode(true),
        getApiData?.data?.patientId || getApiData?.patientId,
        patientDetail,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      getApiData?.data?.patientId || getApiData?.patientId,
      patientDetail,
    ),
    pageStyle: `
      @page {
        size: portrait !important;
        margin:12mm 9mm !important;
      } 
      .card {
        page-break-inside: avoid;
      }
      .view-details-grid {
        page-break-inside: avoid;
      }
      th,td {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .hide-print-btn{
        display:none;
      }
      `,
  });
  //section 2
  const componentRef2 = React.useRef();
  const handlePrint2 = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef2.current.cloneNode(true),
        getApiData?.data?.patientId || getApiData?.patientId,
        patientDetail,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      getApiData?.data?.patientId || getApiData?.patientId,
    ),
    pageStyle: `
      @page {
        size: portrait !important;
        margin:12mm 9mm !important;
      } 
      th,td {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .hide-print-btn{
        display:none;
      }
      `,
  });
  //section 3
  const componentRefNew3 = React.useRef();
  const handlePrintNew3 = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRefNew3.current.cloneNode(true),
        getApiData?.data?.patientId || getApiData?.patientId,
        patientDetail,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      getApiData?.data?.patientId || getApiData?.patientId,
    ),
    pageStyle: `
     @page {
        size: portrait !important;
        margin:12mm 9mm !important;
      } 
     .hide-print-btn{
        display:none;
        }  
        .view-details-grid 
        {
          page-break-inside: avoid;
        }
      
      `,
  });
  //section 8new
  const componentRefNew8 = React.useRef();
  const handlePrintNew8 = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRefNew8.current.cloneNode(true),
        getApiData?.data?.patientId || getApiData?.patientId,
        patientDetail,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      getApiData?.data?.patientId || getApiData?.patientId,
    ),
    pageStyle: `
     @page {
        size: portrait !important;
        margin:12mm 9mm !important;
      } 
     .hide-print-btn{
        display:none;
        }  
        .view-details-grid 
        {
          page-break-inside: avoid;
        }
      
      `,
  });

  // section 4
  const componentRef3 = React.useRef();
  const handlePrint3 = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef3.current.cloneNode(true),
        getApiData?.data?.patientId || getApiData?.patientId,
        patientDetail,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      getApiData?.data?.patientId || getApiData?.patientId,
    ),
    pageStyle: `
       @page {
        size: portrait !important;
        margin:12mm 9mm !important;
      } 
      .card {
        page-break-inside: avoid;
      }
      .view-details-grid {
        page-break-inside: avoid;
      }
      th,td {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .hide-print-btn{
        display:none;
      }
      `,
  });
  //section 5
  const componentRef4 = React.useRef();
  const handlePrint4 = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef4.current.cloneNode(true),
        getApiData?.data?.patientId || getApiData?.patientId,
        patientDetail,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      getApiData?.data?.patientId || getApiData?.patientId,
    ),
    pageStyle: `
       @page {
        size: portrait !important;
        margin:12mm 9mm !important;
      } 
      .card {
        page-break-inside: avoid;
      }
      .view-details-grid {
        page-break-inside: avoid;
      }
      th,td {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .hide-print-btn{
        display:none;
      }
      `,
  });
  //section 6
  const componentRef5 = React.useRef();
  const handlePrint5 = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef5.current.cloneNode(true),
        getApiData?.data?.patientId || getApiData?.patientId,
        patientDetail,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      getApiData?.data?.patientId || getApiData?.patientId,
    ),
    pageStyle: `
       @page {
        size: portrait !important;
        margin:12mm 9mm !important;
      } 
      .card {
        page-break-inside: avoid;
      }
      .view-details-grid {
        page-break-inside: avoid;
      }
      th,td {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .hide-print-btn{
        display:none;
      }
      `,
  });
  //section 7
  const componentRef6 = React.useRef();
  const handlePrint6 = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef6.current.cloneNode(true),
        getApiData?.data?.patientId || getApiData?.patientId,
        patientDetail,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      getApiData?.data?.patientId || getApiData?.patientId,
    ),
    pageStyle: `
       @page {
        size: portrait !important;
        margin:12mm 9mm !important;
      } 
      .card {
        page-break-inside: avoid;
      }
      .view-details-grid {
        page-break-inside: avoid;
      }
      th,td {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .hide-print-btn{
        display:none;
      }
      `,
  });
  //section 8
  const componentRef7 = React.useRef();
  const handlePrint7 = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef7.current.cloneNode(true),
        getApiData?.data?.patientId || getApiData?.patientId,
        patientDetail,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      getApiData?.data?.patientId || getApiData?.patientId,
    ),
    pageStyle: `
       @page {
        size: portrait !important;
        margin:12mm 9mm !important;
      } 
      .card {
        page-break-inside: avoid;
      }
      .view-details-grid {
        page-break-inside: avoid;
      }
      th,td {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .hide-print-btn{
        display:none;
      }
      `,
  });
  //section 9
  const componentRef8 = React.useRef();
  const handlePrint8 = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef8.current.cloneNode(true),
        getApiData?.data?.patientId || getApiData?.patientId,
        patientDetail,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      getApiData?.data?.patientId || getApiData?.patientId,
    ),
    pageStyle: `
       @page {
        size: portrait !important;
        margin:12mm 9mm !important;
      }  
      .card {
        page-break-inside: avoid;
      }
      .view-details-grid {
        page-break-inside: avoid;
      }
      th,td {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .hide-print-btn{
        display:none;
      }
      `,
  });
  //section 10
  const componentRef9 = React.useRef();
  const handlePrint9 = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef9.current.cloneNode(true),
        getApiData?.data?.patientId || getApiData?.patientId,
        patientDetail,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      getApiData?.data?.patientId || getApiData?.patientId,
    ),
    pageStyle: `
       @page {
        size: portrait !important;
        margin:12mm 9mm !important;
      } 
      .card {
        page-break-inside: avoid;
      }
      .view-details-grid {
        page-break-inside: avoid;
      }
      th,td {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .hide-print-btn{
        display:none;
      }
      `,
  });

  // Prints ALL 10 pages as a single PDF with page breaks between them.
  // Uses componentRef9 (the outer Form wrapper) and relies on printAllMode
  // so every {page === N && ...} block renders into the DOM.
  const handlePrintAll = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef9.current.cloneNode(true),
        getApiData?.data?.patientId || getApiData?.patientId,
        patientDetail,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      getApiData?.data?.patientId || getApiData?.patientId,
    ),
    pageStyle: `
      @page {
        size: portrait !important;
        margin: 12mm 9mm !important;
      }
      .view-details-grid { page-break-inside: avoid; }
      /* Allow long cards (e.g., R9-10-711 Resident Rights) to split across
         pages instead of being pushed whole to the next sheet. */
      .residentintakes-print .card { page-break-inside: auto; break-inside: auto; }
      /* Each per-page inner wrapper starts on its own printed sheet.
         Descendant selector (not >) because the <Form> sits between
         the outer componentRef9 wrapper and the inner componentRef1-9 divs. */
      .residentintakes-print .residentintakes-print {
        page-break-before: always;
        break-before: page;
      }
      /* Don't prepend a blank page before the very first inner section */
      .residentintakes-print .residentintakes-print:first-of-type {
        page-break-before: auto;
        break-before: auto;
      }
      .hide-print-btn { display: none; }
      th,td {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    `,
    onAfterPrint: () => setPrintAllMode(false),
  });

  // Wrapper: flip printAllMode on → wait for the conditional pages to
  // render → fire print. onAfterPrint (above) flips it back off.
  const triggerPrintAll = () => {
    setPrintAllMode(true);
    setTimeout(() => handlePrintAll(), 200);
  };

  const print = usePrint(printRef, triggerPrintAll);

  //handle print data
  const handlePrintUpdate1 = () => {
    let inputs;
    const hidePrint = document.getElementsByClassName("hidePrint");
    const formheading1 = document.getElementsByClassName("formheading1-hide");
    // Iterate through each element with the specified className
    const formsheading2 = document.getElementsByClassName("formsheading2");
    const signatureRightAndSide =
      document.getElementsByClassName("file-upload-box");
    const increaseWidth = document.getElementsByClassName(
      "increase-print-width",
    );

    // hide bottom
    const form_field_gender =
      document.getElementsByClassName("form-field-child");
    const form_field_single_update = document.getElementsByClassName(
      "form-field-single-update",
    );
    for (let i = 0; i < hidePrint.length; i++) {
      hidePrint[i].style.display = "none";
    }
    for (let i = 0; i < signatureRightAndSide.length; i++) {
      signatureRightAndSide[i].style.justifyContent = "right";
    }
    for (let i = 0; i < formheading1.length; i++) {
      formheading1[i].style.display = "block";
      formheading1[i].style.marginTop = "1rem";
    }
    for (let i = 0; i < increaseWidth.length; i++) {
      increaseWidth[i].style.width = "100%";
      increaseWidth[i].style.margin = "auto";
    }
    for (let i = 0; i < formsheading2.length; i++) {
      formsheading2[i].style.backgroundColor = "white";
    }

    // hode bottom
    for (let i = 0; i < form_field_gender.length; i++) {
      inputs = form_field_gender[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    for (let i = 0; i < form_field_single_update.length; i++) {
      inputs = form_field_single_update[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    handlePrint1();
    setTimeout(() => {
      for (let i = 0; i < hidePrint.length; i++) {
        hidePrint[i].style.display = "block";
      }
      for (let i = 0; i < signatureRightAndSide.length; i++) {
        signatureRightAndSide[i].style.justifyContent = "space-between";
      }
      for (let i = 0; i < formheading1.length; i++) {
        formheading1[i].style.display = "none";
      }
      for (let i = 0; i < formsheading2.length; i++) {
        formsheading2[i].style.backgroundColor = "#1a9fb2";
      }
      for (let i = 0; i < increaseWidth.length; i++) {
        increaseWidth[i].style.width = "100%";
      }

      // hide bottom
      for (let i = 0; i < form_field_gender.length; i++) {
        inputs = form_field_gender[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
      for (let i = 0; i < form_field_single_update.length; i++) {
        inputs = form_field_single_update[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
    }, 500);
  };
  const handlePrintUpdate2 = () => {
    const hidePrint = document.getElementsByClassName("hidePrint");
    const addButton = document.getElementsByClassName("addButton");
    const signatureRightAndSide =
      document.getElementsByClassName("file-upload-box");
    const increaseWidth = document.getElementsByClassName(
      "increase-print-width",
    );

    // hide bottom
    const form_field_gender =
      document.getElementsByClassName("form-field-child");
    const form_field_single_update = document.getElementsByClassName(
      "form-field-single-update",
    );

    // Iterate through each element with the specified className
    for (let i = 0; i < hidePrint.length; i++) {
      hidePrint[i].style.display = "none";
    }
    for (let i = 0; i < addButton.length; i++) {
      addButton[i].style.display = "none";
    }
    for (let i = 0; i < signatureRightAndSide.length; i++) {
      signatureRightAndSide[i].style.justifyContent = "right";
    }
    for (let i = 0; i < increaseWidth.length; i++) {
      increaseWidth[i].style.width = "100%";
      increaseWidth[i].style.margin = "auto";
    }

    // hode bottom
    for (let i = 0; i < form_field_gender.length; i++) {
      let inputs = form_field_gender[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    for (let i = 0; i < form_field_single_update.length; i++) {
      let inputs = form_field_single_update[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    handlePrint2();
    // Use setTimeout to show the elements after a delay (adjust the timeout as needed)
    setTimeout(() => {
      for (let i = 0; i < hidePrint.length; i++) {
        hidePrint[i].style.display = "block";
      }
      for (let i = 0; i < addButton.length; i++) {
        addButton[i].style.display = "block";
        addButton[i].style.justifyContent = "center";
      }
      for (let i = 0; i < signatureRightAndSide.length; i++) {
        signatureRightAndSide[i].style.justifyContent = "space-between";
      }
      for (let i = 0; i < increaseWidth.length; i++) {
        increaseWidth[i].style.width = "100%";
      }

      // hide bottom
      for (let i = 0; i < form_field_gender.length; i++) {
        let inputs = form_field_gender[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
      for (let i = 0; i < form_field_single_update.length; i++) {
        let inputs = form_field_single_update[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
    }, 1000);
  };
  const handlePrintUpdateNew3 = () => {
    const hidePrint = document.getElementsByClassName("hidePrint");
    const addButton = document.getElementsByClassName("addButton");
    const signatureRightAndSide =
      document.getElementsByClassName("file-upload-box");
    const increaseWidth = document.getElementsByClassName(
      "increase-print-width",
    );

    // hide bottom
    const form_field_gender =
      document.getElementsByClassName("form-field-child");
    const form_field_single_update = document.getElementsByClassName(
      "form-field-single-update",
    );

    // Iterate through each element with the specified className
    for (let i = 0; i < hidePrint.length; i++) {
      hidePrint[i].style.display = "none";
    }
    for (let i = 0; i < addButton.length; i++) {
      addButton[i].style.display = "none";
    }
    for (let i = 0; i < signatureRightAndSide.length; i++) {
      signatureRightAndSide[i].style.justifyContent = "right";
    }
    for (let i = 0; i < increaseWidth.length; i++) {
      increaseWidth[i].style.width = "100%";
      increaseWidth[i].style.margin = "auto";
    }

    // hode bottom
    for (let i = 0; i < form_field_gender.length; i++) {
      let inputs = form_field_gender[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    for (let i = 0; i < form_field_single_update.length; i++) {
      let inputs = form_field_single_update[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    handlePrintNew3();
    // Use setTimeout to show the elements after a delay (adjust the timeout as needed)
    setTimeout(() => {
      for (let i = 0; i < hidePrint.length; i++) {
        hidePrint[i].style.display = "block";
      }
      for (let i = 0; i < addButton.length; i++) {
        addButton[i].style.display = "block";
        addButton[i].style.justifyContent = "center";
      }
      for (let i = 0; i < signatureRightAndSide.length; i++) {
        signatureRightAndSide[i].style.justifyContent = "space-between";
      }
      for (let i = 0; i < increaseWidth.length; i++) {
        increaseWidth[i].style.width = "100%";
      }

      // hide bottom
      for (let i = 0; i < form_field_gender.length; i++) {
        let inputs = form_field_gender[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
      for (let i = 0; i < form_field_single_update.length; i++) {
        let inputs = form_field_single_update[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
    }, 1000);
  };
  const handlePrintUpdateNew8 = () => {
    const hidePrint = document.getElementsByClassName("hidePrint");
    const addButton = document.getElementsByClassName("addButton");
    const signatureRightAndSide =
      document.getElementsByClassName("file-upload-box");
    const increaseWidth = document.getElementsByClassName(
      "increase-print-width",
    );

    // hide bottom
    const form_field_gender =
      document.getElementsByClassName("form-field-child");
    const form_field_single_update = document.getElementsByClassName(
      "form-field-single-update",
    );

    // Iterate through each element with the specified className
    for (let i = 0; i < hidePrint.length; i++) {
      hidePrint[i].style.display = "none";
    }
    for (let i = 0; i < addButton.length; i++) {
      addButton[i].style.display = "none";
    }
    for (let i = 0; i < signatureRightAndSide.length; i++) {
      signatureRightAndSide[i].style.justifyContent = "right";
    }
    for (let i = 0; i < increaseWidth.length; i++) {
      increaseWidth[i].style.width = "100%";
      increaseWidth[i].style.margin = "auto";
    }

    // hode bottom
    for (let i = 0; i < form_field_gender.length; i++) {
      let inputs = form_field_gender[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    for (let i = 0; i < form_field_single_update.length; i++) {
      let inputs = form_field_single_update[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    handlePrintNew8();
    // Use setTimeout to show the elements after a delay (adjust the timeout as needed)
    setTimeout(() => {
      for (let i = 0; i < hidePrint.length; i++) {
        hidePrint[i].style.display = "block";
      }
      for (let i = 0; i < addButton.length; i++) {
        addButton[i].style.display = "block";
        addButton[i].style.justifyContent = "center";
      }
      for (let i = 0; i < signatureRightAndSide.length; i++) {
        signatureRightAndSide[i].style.justifyContent = "space-between";
      }
      for (let i = 0; i < increaseWidth.length; i++) {
        increaseWidth[i].style.width = "100%";
      }

      // hide bottom
      for (let i = 0; i < form_field_gender.length; i++) {
        let inputs = form_field_gender[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
      for (let i = 0; i < form_field_single_update.length; i++) {
        let inputs = form_field_single_update[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
    }, 1000);
  };
  const handlePrintUpdate3 = () => {
    const elements = document.getElementsByClassName("hidePrint");
    const signatureRightAndSide =
      document.getElementsByClassName("file-upload-box");
    const increaseWidth = document.getElementsByClassName(
      "increase-print-width",
    );

    // hide bottom
    const form_field_gender =
      document.getElementsByClassName("form-field-child");
    const form_field_single_update = document.getElementsByClassName(
      "form-field-single-update",
    );

    // Iterate through each element with the specified className
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
    for (let i = 0; i < signatureRightAndSide.length; i++) {
      signatureRightAndSide[i].style.justifyContent = "right";
    }
    for (let i = 0; i < increaseWidth.length; i++) {
      increaseWidth[i].style.width = "100%";
      increaseWidth[i].style.margin = "auto";
    }

    // hode bottom
    for (let i = 0; i < form_field_gender.length; i++) {
      let inputs = form_field_gender[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    for (let i = 0; i < form_field_single_update.length; i++) {
      let inputs = form_field_single_update[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    handlePrint3();
    // Use setTimeout to show the elements after a delay (adjust the timeout as needed)
    setTimeout(() => {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "block";
      }
      for (let i = 0; i < signatureRightAndSide.length; i++) {
        signatureRightAndSide[i].style.justifyContent = "space-between";
      }
      for (let i = 0; i < increaseWidth.length; i++) {
        increaseWidth[i].style.width = "100%";
      }

      // hide bottom
      for (let i = 0; i < form_field_gender.length; i++) {
        let inputs = form_field_gender[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
      for (let i = 0; i < form_field_single_update.length; i++) {
        let inputs = form_field_single_update[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
    }, 1000);
  };
  const handlePrintUpdate4 = () => {
    const elements = document.getElementsByClassName("hidePrint");
    const signatureRightAndSide =
      document.getElementsByClassName("file-upload-box");
    const increaseWidth = document.getElementsByClassName(
      "increase-print-width",
    );

    // hide bottom
    const form_field_gender =
      document.getElementsByClassName("form-field-child");
    const form_field_single_update = document.getElementsByClassName(
      "form-field-single-update",
    );

    // Iterate through each element with the specified className
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
    for (let i = 0; i < signatureRightAndSide.length; i++) {
      signatureRightAndSide[i].style.justifyContent = "right";
    }
    for (let i = 0; i < increaseWidth.length; i++) {
      increaseWidth[i].style.width = "100%";
      increaseWidth[i].style.margin = "auto";
    }

    // hode bottom
    for (let i = 0; i < form_field_gender.length; i++) {
      let inputs = form_field_gender[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    for (let i = 0; i < form_field_single_update.length; i++) {
      let inputs = form_field_single_update[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    handlePrint4();
    // Use setTimeout to show the elements after a delay (adjust the timeout as needed)
    setTimeout(() => {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "block";
      }
      for (let i = 0; i < signatureRightAndSide.length; i++) {
        signatureRightAndSide[i].style.justifyContent = "space-between";
      }
      for (let i = 0; i < increaseWidth.length; i++) {
        increaseWidth[i].style.width = "100%";
      }

      // hide bottom
      for (let i = 0; i < form_field_gender.length; i++) {
        let inputs = form_field_gender[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
      for (let i = 0; i < form_field_single_update.length; i++) {
        let inputs = form_field_single_update[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
    }, 1000);
  };
  const handlePrintUpdate5 = () => {
    const elements = document.getElementsByClassName("hidePrint");
    const signatureRightAndSide =
      document.getElementsByClassName("file-upload-box");
    const increaseWidth = document.getElementsByClassName(
      "increase-print-width",
    );

    // hide bottom
    const form_field_gender =
      document.getElementsByClassName("form-field-child");
    const form_field_single_update = document.getElementsByClassName(
      "form-field-single-update",
    );

    // Iterate through each element with the specified className
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
    for (let i = 0; i < signatureRightAndSide.length; i++) {
      signatureRightAndSide[i].style.justifyContent = "right";
    }
    for (let i = 0; i < increaseWidth.length; i++) {
      increaseWidth[i].style.width = "100%";
      increaseWidth[i].style.margin = "auto";
    }

    // hode bottom
    for (let i = 0; i < form_field_gender.length; i++) {
      let inputs = form_field_gender[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    for (let i = 0; i < form_field_single_update.length; i++) {
      let inputs = form_field_single_update[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    handlePrint5();
    // Use setTimeout to show the elements after a delay (adjust the timeout as needed)
    setTimeout(() => {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "block";
      }
      for (let i = 0; i < signatureRightAndSide.length; i++) {
        signatureRightAndSide[i].style.justifyContent = "space-between";
      }
      for (let i = 0; i < increaseWidth.length; i++) {
        increaseWidth[i].style.width = "100%";
      }

      // hide bottom
      for (let i = 0; i < form_field_gender.length; i++) {
        let inputs = form_field_gender[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
      for (let i = 0; i < form_field_single_update.length; i++) {
        let inputs = form_field_single_update[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
    }, 1000);
  };
  const handlePrintUpdate6 = () => {
    const elements = document.getElementsByClassName("hidePrint");
    const signatureRightAndSide =
      document.getElementsByClassName("file-upload-box");
    const increaseWidth = document.getElementsByClassName(
      "increase-print-width",
    );

    // hide bottom
    const form_field_gender =
      document.getElementsByClassName("form-field-child");
    const form_field_single_update = document.getElementsByClassName(
      "form-field-single-update",
    );

    // Iterate through each element with the specified className
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
    for (let i = 0; i < signatureRightAndSide.length; i++) {
      signatureRightAndSide[i].style.justifyContent = "right";
    }
    for (let i = 0; i < increaseWidth.length; i++) {
      increaseWidth[i].style.width = "100%";
      increaseWidth[i].style.margin = "auto";
    }

    // hode bottom
    for (let i = 0; i < form_field_gender.length; i++) {
      let inputs = form_field_gender[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    for (let i = 0; i < form_field_single_update.length; i++) {
      let inputs = form_field_single_update[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    handlePrint6();
    // Use setTimeout to show the elements after a delay (adjust the timeout as needed)
    setTimeout(() => {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "block";
      }
      for (let i = 0; i < signatureRightAndSide.length; i++) {
        signatureRightAndSide[i].style.justifyContent = "space-between";
      }
      for (let i = 0; i < increaseWidth.length; i++) {
        increaseWidth[i].style.width = "100%";
      }

      // hide bottom
      for (let i = 0; i < form_field_gender.length; i++) {
        let inputs = form_field_gender[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
      for (let i = 0; i < form_field_single_update.length; i++) {
        let inputs = form_field_single_update[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
    }, 1000);
  };
  const handlePrintUpdate7 = () => {
    const elements = document.getElementsByClassName("hidePrint");
    const signatureRightAndSide =
      document.getElementsByClassName("file-upload-box");
    const increaseWidth = document.getElementsByClassName(
      "increase-print-width",
    );

    // hide bottom
    const form_field_gender =
      document.getElementsByClassName("form-field-child");
    const form_field_single_update = document.getElementsByClassName(
      "form-field-single-update",
    );
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
    for (let i = 0; i < increaseWidth.length; i++) {
      increaseWidth[i].style.width = "100%";
      increaseWidth[i].style.margin = "auto";
    }
    for (let i = 0; i < signatureRightAndSide.length; i++) {
      signatureRightAndSide[i].style.justifyContent = "right";
    }

    // hode bottom
    for (let i = 0; i < form_field_gender.length; i++) {
      let inputs = form_field_gender[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    for (let i = 0; i < form_field_single_update.length; i++) {
      let inputs = form_field_single_update[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    handlePrint7();
    // Use setTimeout to show the elements after a delay (adjust the timeout as needed)
    setTimeout(() => {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "block";
      }
      for (let i = 0; i < signatureRightAndSide.length; i++) {
        signatureRightAndSide[i].style.justifyContent = "space-between";
      }
      for (let i = 0; i < increaseWidth.length; i++) {
        increaseWidth[i].style.width = "100%";
      }

      // hide bottom
      for (let i = 0; i < form_field_gender.length; i++) {
        let inputs = form_field_gender[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
      for (let i = 0; i < form_field_single_update.length; i++) {
        let inputs = form_field_single_update[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
    }, 1000);
  };
  const handlePrintUpdate8 = () => {
    const elements = document.getElementsByClassName("hidePrint");
    const signatureRightAndSide =
      document.getElementsByClassName("file-upload-box");
    const submitButton = document.getElementsByClassName("form-actions");
    const increaseWidth = document.getElementsByClassName(
      "increase-print-width",
    );

    // hide bottom
    const form_field_gender =
      document.getElementsByClassName("form-field-child");
    const form_field_single_update = document.getElementsByClassName(
      "form-field-single-update",
    );
    // Iterate through each element with the specified className
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
    for (let i = 0; i < signatureRightAndSide.length; i++) {
      signatureRightAndSide[i].style.justifyContent = "right";
    }
    for (let i = 0; i < submitButton.length; i++) {
      submitButton[i].style.display = "flex";
      submitButton[i].style.justifyContent = "center";
      submitButton[i].style.alignItems = "center";
    }
    for (let i = 0; i < increaseWidth.length; i++) {
      increaseWidth[i].style.width = "100%";
      increaseWidth[i].style.margin = "auto";
    }

    // hode bottom
    for (let i = 0; i < form_field_gender.length; i++) {
      let inputs = form_field_gender[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    for (let i = 0; i < form_field_single_update.length; i++) {
      let inputs = form_field_single_update[i].getElementsByTagName("input");
      for (let j = 0; j < inputs.length; j++) {
        inputs[j].style.borderBottom = "none";
      }
    }
    handlePrint8();
    // Use setTimeout to show the elements after a delay (adjust the timeout as needed)
    setTimeout(() => {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = "block";
      }
      for (let i = 0; i < signatureRightAndSide.length; i++) {
        signatureRightAndSide[i].style.justifyContent = "space-between";
      }
      for (let i = 0; i < submitButton.length; i++) {
        submitButton[i].style.display = "block";
        submitButton[i].style.justifyContent = "center";
        submitButton[i].style.alignItems = "center";
      }
      for (let i = 0; i < increaseWidth.length; i++) {
        increaseWidth[i].style.width = "100%";
      }

      // hide bottom
      for (let i = 0; i < form_field_gender.length; i++) {
        let inputs = form_field_gender[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
      for (let i = 0; i < form_field_single_update.length; i++) {
        let inputs = form_field_single_update[i].getElementsByTagName("input");
        for (let j = 0; j < inputs.length; j++) {
          inputs[j].style.borderBottom = "1px solid black";
        }
      }
    }, 1000);
  };
  const handlePrintUpdate9 = () => {
    handlePrint9();
  };

  //page state
  return {
    componentRef1,
    componentRef2,
    componentRef3,
    componentRef4,
    componentRef5,
    componentRef6,
    componentRef7,
    componentRef8,
    componentRef9,
    handlePrintUpdate1,
    handlePrintUpdate2,
    handlePrintUpdate3,
    handlePrintUpdate4,
    handlePrintUpdate5,
    handlePrintUpdate6,
    handlePrintUpdate7,
    handlePrintUpdate8,
    handlePrintUpdate9,
    componentRefNew3,
    componentRefNew8,
    handlePrintNew3,
    handlePrintNew8,
    printRef,
    print,
    handlePrintAll,
    triggerPrintAll,
  };
};
