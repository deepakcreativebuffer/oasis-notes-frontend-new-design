/** @format */
import React from "react";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";

export const useResidentIntakesPrint = ({ getApiData, patientDetail }) => {
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
     .hide-print-btn{
        display:none;
        }
        @page {
          margin: 12mm 9mm!important;
        }   
        .view-details-grid 
        {
          page-break-inside: avoid;
        }
        .card {
          page-break-inside: avoid;
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
     .hide-print-btn{
        display:none;
        }
         @page {
          margin: 12mm 9mm!important;
        }   
        .view-details-grid 
        {
          page-break-inside: avoid;
        }
        .card {
          page-break-inside: avoid;
        }
      `,
  });
  //section 3
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
     .hide-print-btn{
        display:none;
        }
         @page {
          margin: 12mm 9mm!important;
        }   
        .view-details-grid 
        {
          page-break-inside: avoid;
        }
        .card {
          page-break-inside: avoid;
        }
      `,
  });
  //section 4
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
     .hide-print-btn{
        display:none;
        }
         @page {
          margin: 12mm 9mm!important;
        }   
        .view-details-grid 
        {
          page-break-inside: avoid;
        }
        .card {
          page-break-inside: avoid;
        }
      `,
  });
  //section 5
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
     .hide-print-btn{
        display:none;
        }
         @page {
          margin: 12mm 9mm!important;
        }   
        .view-details-grid 
        {
          page-break-inside: avoid;
        }
        .card {
          page-break-inside: avoid;
        }
      `,
  });
  //section 6
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
     .hide-print-btn{
        display:none;
        }
         @page {
          margin: 12mm 9mm!important;
        }   
        .view-details-grid 
        {
          page-break-inside: avoid;
        }
        .card {
          page-break-inside: avoid;
        }
      `,
  });
  //section 7
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
     .hide-print-btn{
        display:none;
        }
         @page {
          margin: 12mm 9mm !important;
        }   
        .view-details-grid 
        {
          page-break-inside: avoid;
        }
        .card {
          page-break-inside: avoid;
        }
      `,
  });
  //section 8
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
     .hide-print-btn{
        display:none;
        }
         @page {
          margin: 12mm 9mm !important;
        }   
        .view-details-grid 
        {
          page-break-inside: avoid;
        }
        .card {
          page-break-inside: avoid;
        }
      `,
  });
  //section 9
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
     .hide-print-btn{
        display:none;
        }
         @page {
          margin: 12mm 9mm !important;
        }   
        .view-details-grid 
        {
          page-break-inside: avoid;
        }
        .card {
          page-break-inside: avoid;
        }
      `,
  });

  //handle print data
  const handlePrintUpdate1 = () => {
    const hidePrint = document.getElementsByClassName("hidePrint");
    const formheading1 = document.getElementsByClassName("formheading1-hide");
    // Iterate through each element with the specified class
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

    // Iterate through each element with the specified class
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

    // Iterate through each element with the specified class
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

    // Iterate through each element with the specified class
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

    // Iterate through each element with the specified class
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

    // Iterate through each element with the specified class
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
    // Iterate through each element with the specified class
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
  };
};
