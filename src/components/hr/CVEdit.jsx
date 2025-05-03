import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebars from './sidebars';

const CVEdit = () => {
  const { id } = useParams();
  const [cv, setCv] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    position_for: "",
    age: "",
    reference: "",
    email: "",
    phone: "",
    cv_file: null,
    existing_cv: null,
  });

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const response = await axios.get(`https://tadbackend-5456.onrender.com/api/hrms/api/CVAdd/${id}/`);
        setCv(response.data);
        setFormData({
          name: response.data.name,
          position_for: response.data.position_for || "",
          age: response.data.age || "",
          reference: response.data.reference || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          cv_file: null,
          existing_cv: response.data.cv_file,
        });
      } catch (error) {
        console.error("Error fetching CV:", error);
      }
    };

    fetchCV();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, cv_file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("position_for", formData.position_for);
    formDataToSubmit.append("age", formData.age);
    formDataToSubmit.append("reference", formData.reference);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("phone", formData.phone);

    if (formData.cv_file instanceof File) {
      formDataToSubmit.append("cv_file", formData.cv_file);
    }

    try {
      await axios.put(
        `https://tadbackend-5456.onrender.com/api/hrms/api/CVAdd/${id}/`,
        formDataToSubmit,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("CV updated successfully!");
      navigate("/cv-list");
    } catch (error) {
      console.error("Error updating CV:", error);
      alert(`Failed to update CV: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cv) return <div>Loading...</div>;

  // --- Styling ---
  const containerStyle = {
    display: "flex",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f4f6f9",
    minHeight: "100vh",
  };

  const sidebarContainerStyle = {
    width: "250px",
    backgroundColor: "#fff",
  };

  const contentContainerStyle = {
    flex: 1,
    padding: "30px",
  };

  const formContainerStyle = {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  };

  const formGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  };

  const formGroupStyle = {
    display: "flex",
    flexDirection: "column",
  };

  const labelStyle = {
    fontWeight: "bold",
    marginBottom: "6px",
    fontSize: "14px",
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  };

  const submitButtonStyle = {
    marginTop: "30px",
    padding: "12px 20px",
    fontSize: "1rem",
    backgroundColor: "#3182ce",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const cancelButtonStyle = {
    ...submitButtonStyle,
    backgroundColor: "#ccc",
    marginLeft: "10px",
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarContainerStyle}>
        <Sidebars />
      </div>

      <div style={contentContainerStyle}>
        <div style={formContainerStyle}>
          <h2>Edit CV - {cv.name}</h2>
          <form onSubmit={handleSubmit}>
            <div style={formGridStyle}>
              {["name", "position_for", "age", "reference", "email", "phone"].map((field) => (
                <div key={field} style={formGroupStyle}>
                  <label style={labelStyle}>{field.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}</label>
                  <input
                    type={field === "age" ? "number" : field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required={["name", "position_for", "age", "email", "phone"].includes(field)}
                    style={inputStyle}
                  />
                </div>
              ))}

              <div style={formGroupStyle}>
                <label style={labelStyle}>CV File</label>
                {formData.existing_cv && (
                  <p style={{ marginBottom: '5px', fontSize: '14px' }}>
                    Current file: {formData.existing_cv.split('/').pop()}
                  </p>
                )}
                <input
                  type="file"
                  name="cv_file"
                  onChange={handleFileChange}
                  style={inputStyle}
                  accept=".pdf,.doc,.docx"
                />
                <small style={{ color: '#666', marginTop: '5px' }}>
                  Leave empty to keep the existing file
                </small>
              </div>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                type="submit"
                style={submitButtonStyle}
                disabled={isSubmitting}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#2b6cb0")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#3182ce")}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                style={cancelButtonStyle}
                onClick={() => navigate(-1)}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#bbb")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#ccc")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CVEdit;
