import { useState, useEffect } from "react";
import { FileText, FileSearch, CheckCircle } from "lucide-react";

const StatusMessage = ({ currentStep, totalSteps, documentName }) => {
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    const progress = (currentStep / totalSteps) * 100;

    if (progress < 33) {
      setMessage("Analyzing document structure...");
      setIcon(<FileText size={18} color="#3B82F6" />);
    } else if (progress < 66) {
      setMessage("Extracting clinical information...");
      setIcon(<FileSearch size={18} color="#3B82F6" />);
    } else if (progress < 100) {
      setMessage(`Finalizing ${documentName}...`);
      setIcon(<FileText size={18} color="#3B82F6" />);
    } else {
      setMessage("Processing complete!");
      setIcon(<CheckCircle size={18} color="#10B981" />);
    }
  }, [currentStep, documentName, totalSteps]);

  return (
    <div className="d-flex align-items-center gap-2 mt-3 bg-blue-500/5 p-3 rounded-md">
      {icon}
      <small className="text-muted fw-medium">{message}</small>
    </div>
  );
};

export default StatusMessage;
