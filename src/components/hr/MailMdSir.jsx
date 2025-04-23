import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MailMdSir = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setInterviewDetails(location.state);
    } else {
      navigate("/interviews");
    }
  }, [location.state, navigate]);

  const handleSendMail = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://192.168.0.163:8000/api/hrms/api/mdsir/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          interview_details: interviewDetails,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Email sent successfully and saved!");
        navigate(`/interviews?interview_id=${interviewDetails.id}`, { replace: true });
      } else {
        alert(`Error sending email: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      alert("Error sending email");
    } finally {
      setLoading(false);
    }
  };

  const getCSRFToken = () => {
    const name = "csrftoken";
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Send Interview Details</h2>

        <div style={styles.detailsContainer}>
          <h3>Interview Details</h3>
          <p><strong>Name:</strong> {interviewDetails.name}</p>
          <p><strong>Position:</strong> {interviewDetails.position_for}</p>
          <p><strong>Age:</strong> {interviewDetails.age}</p>
          <p><strong>Reference:</strong> {interviewDetails.reference}</p>
          <p><strong>Email:</strong> {interviewDetails.email}</p>
          <p><strong>Phone:</strong> {interviewDetails.phone}</p>
          <p><strong>Interview Date:</strong> {new Date(interviewDetails.interview_date).toLocaleString()}</p>
          <p><strong>Place:</strong> {interviewDetails.place}</p>
          <p><strong>Interview Mark:</strong> {interviewDetails.interview_mark}</p>
          <p><strong>Interview Result:</strong> {interviewDetails.interview_result}</p>
          <p><strong>Education:</strong> {interviewDetails.education}</p>
          <p><strong>Job Knowledge:</strong> {interviewDetails.job_knowledge}</p>
          <p><strong>Work Experience:</strong> {interviewDetails.work_experience}</p>
          <p><strong>Communication:</strong> {interviewDetails.communication}</p>
          <p><strong>Personality:</strong> {interviewDetails.personality}</p>
          <p><strong>Potential:</strong> {interviewDetails.potential}</p>
          <p><strong>General Knowledge:</strong> {interviewDetails.general_knowledge}</p>
          <p><strong>Assertiveness:</strong> {interviewDetails.assertiveness}</p>
          <p><strong>Current Remuneration:</strong> {interviewDetails.current_remuneration}</p>
          <p><strong>Expected Package:</strong> {interviewDetails.expected_package}</p>
          <p><strong>Notice Period Required:</strong> {interviewDetails.notice_period_required}</p>
          <p><strong>Recommendation:</strong> {interviewDetails.recommendation}</p>
          <p><strong>Immediate Recruitment:</strong> {interviewDetails.immediate_recruitment ? "Yes" : "No"}</p>
          <p><strong>On Hold:</strong> {interviewDetails.on_hold ? "Yes" : "No"}</p>
          <p><strong>No Good:</strong> {interviewDetails.no_good ? "Yes" : "No"}</p>
          <p><strong>Interview Questions:</strong> {interviewDetails.interview_questions || "No questions recorded"}</p>
          <p><strong>MD Sir Notes:</strong> {interviewDetails.interview_notes || "No notes available"}</p>
        </div>

        <div style={styles.inputContainer}>
          <label htmlFor="email" style={styles.label}>Recipient's Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="Enter recipient's email"
          />
        </div>

        <button
          onClick={handleSendMail}
          style={{
            ...styles.button,
            backgroundColor: loading ? "#ccc" : styles.button.backgroundColor, // Grey when loading
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onMouseOver={(e) => {
            if (!loading) e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
          }}
          onMouseOut={(e) => {
            if (!loading) e.target.style.backgroundColor = styles.button.backgroundColor;
          }}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Email"}
        </button>
      </div>
    </div>
  );
};

export default MailMdSir;

// Styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#F3F3F3",
    padding: "20px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: "600px",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#444",
    marginBottom: "15px",
    textAlign: "center",
  },
  detailsContainer: {
    backgroundColor: "#F9F9F9",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "15px",
    border: "1px solid #E0E0E0",
  },
  inputContainer: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#555",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #D1D1D1",
    borderRadius: "5px",
    fontSize: "14px",
    outline: "none",
    transition: "border 0.3s",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#0078D4",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  buttonHover: {
    backgroundColor: "#005A9E",
  },
};
