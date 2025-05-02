import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const InviteMail = () => {
  const [description, setDescription] = useState("");
  const [interviewDetails, setInterviewDetails] = useState({});
  const [loading, setLoading] = useState(false);
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
      const response = await fetch("https://tadbackend-5456.onrender.com/api/hrms/api/invitemail/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        credentials: "include",
        body: JSON.stringify({
          description,
          interview_details: interviewDetails,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Message sent successfully and saved!");
        navigate(`/interviews?interview_id=${interviewDetails.id}`, { replace: true });
      } else {
        alert(`Error sending message: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      alert("Error sending message");
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
        <h2 style={styles.heading}>Send Invitation</h2>

        <div style={styles.detailsContainer}>
          <h3>Interview Details</h3>
          <p><strong>Name:</strong> {interviewDetails.name}</p>
          <p><strong>Reference:</strong> {interviewDetails.reference}</p>
          <p><strong>Email:</strong> {interviewDetails.email}</p>
          <p><strong>Phone:</strong> {interviewDetails.phone}</p>
          <p><strong>Interview Date:</strong> {new Date(interviewDetails.interview_date).toLocaleString()}</p>
        </div>

        <div style={styles.inputContainer}>
          <label htmlFor="description" style={styles.label}>Message</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            placeholder="Enter your invitation message here..."
          />
        </div>

        <button
          onClick={handleSendMail}
          style={{
            ...styles.button,
            backgroundColor: loading ? "#ccc" : styles.button.backgroundColor,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
    </div>
  );
};

export default InviteMail;


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
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #D1D1D1",
    borderRadius: "5px",
    fontSize: "14px",
    outline: "none",
    minHeight: "100px",
    resize: "vertical",
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
