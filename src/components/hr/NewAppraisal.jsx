import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const NewAppraisal = () => {
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    designation: "",
    joining_date: "",
    department: "",
    last_increment_date: "",
    last_promotion_date: "",
    last_education: "",
    job_knowledge: "",
    job_description: "",
    performance_in_meetings: "",
    performance_description: "",
    communication_skills: "",
    communication_description: "",
    reliability: "",
    reliability_description: "",
    initiative: "",
    initiative_description: "",
    stress_management: "",
    stress_management_description: "",
    co_operation: "",
    co_operation_description: "",
    leadership: "",
    leadership_description: "",
    discipline: "",
    discipline_description: "",
    ethical_considerations: "",
    ethical_considerations_description: "",
    promotion: false,
    increment: false,
    performance_reward: false,
    performance: "",
    expected_performance: "",
    present_salary: "",
    proposed_salary: "",
    present_designation: "",
    proposed_designation: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://192.168.0.163:8000/api/hrms/api/performanse_appraisals/",
        formData
      );
      alert("Appraisal Added Successfully!");
    } catch (error) {
      console.error("Error adding appraisal:", error);
    }
  };

  const containerStyle = {
    display: "flex",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f4f6f9",
    minHeight: "100vh",
  };

  const sidebarStyle = {
    width: "230px",
    backgroundColor: "#f3f6fb",
    height: "100vh",
    padding: "20px 15px",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.05)",
  };

  const sidebarHeaderStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#0078D4",
  };

  const sidebarLinkStyle = {
    display: "block",
    padding: "10px",
    margin: "5px 0",
    textDecoration: "none",
    color: "#333",
    borderRadius: "6px",
    transition: "0.3s",
  };

  const mainContentStyle = {
    flex: 1,
    padding: "30px",
    maxWidth: "900px",
    margin: "auto",
  };

  const formContainerStyle = {
    backgroundColor: "#f4f5f7",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  };

  const titleStyle = {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: "20px",
  };

  const formGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
  };

  const formGroupStyle = {
    display: "flex",
    flexDirection: "column",
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "5px",
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  };

  const textareaStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    height: "100px",
    resize: "vertical",
    gridColumn: "span 2",
  };

  const buttonStyle = {
    gridColumn: "span 2",
    padding: "12px",
    borderRadius: "6px",
    backgroundColor: "#0078d4",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    textAlign: "center",
    border: "none",
    width: "20%",
  };

  const buttonHoverStyle = {
    backgroundColor: "#005a9e",
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <div style={sidebarHeaderStyle}>HR Work</div>
        <Link to="/cv-list" style={sidebarLinkStyle}>
          All CV
        </Link>
        <Link to="/interviews" style={sidebarLinkStyle}>
          Interviews
        </Link>
        <Link to="/employees" style={sidebarLinkStyle}>
          Employee
        </Link>
        <Link to="/attendance" style={sidebarLinkStyle}>
          Attendance
        </Link>
        <Link to="/employee_leave" style={sidebarLinkStyle}>
          Employee Leave
        </Link>
        <Link to="/performanse_appraisal" style={sidebarLinkStyle}>
          Performance Appraisal
        </Link>
        <Link to="/finance-provision" style={sidebarLinkStyle}>
          Finance Provision
        </Link>
        <Link to="/employee-termination" style={sidebarLinkStyle}>
          Employee Termination
        </Link>
        <Link to="/letter-send" style={sidebarLinkStyle}>
          Send Letter
        </Link>
        <Link to="/email-logs" style={sidebarLinkStyle}>
          Email Logs
        </Link>
        <Link to="/tad-groups" style={sidebarLinkStyle}>
          TAD Groups
        </Link>
      </div>
      <div style={mainContentStyle}>
        <div style={formContainerStyle}>
          <h2 style={titleStyle}>Add New Performance Appraisal</h2>
          <form onSubmit={handleSubmit} style={formGridStyle}>
            {Object.keys(formData).map((key) => (
              <div style={formGroupStyle} key={key}>
                <label style={labelStyle}>
                  {key.replace(/_/g, " ").toUpperCase()}
                </label>
                {key.includes("description") ? (
                  <textarea
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    style={textareaStyle}
                  />
                ) : key.includes("date") ? (
                  <input
                    type="date"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                ) : key.includes("performance_in_meetings") ||
                  key.includes("score") ||
                  key.includes("knowledge") ||
                  key.includes("communication_skills") ? (
                  <input
                    type="number"
                    min="1"
                    max="5"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                ) : key === "promotion" ||
                  key === "increment" ||
                  key === "performance_reward" ? (
                  <input
                    type="checkbox"
                    name={key}
                    checked={formData[key]}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.checked })
                    }
                  />
                ) : (
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              style={buttonStyle}
              onMouseEnter={(e) =>
              (e.target.style.backgroundColor =
                buttonHoverStyle.backgroundColor)
              }
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#0078d4")}
            >
              Add Appraisal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewAppraisal;