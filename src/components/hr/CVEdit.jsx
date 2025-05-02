import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebars from './sidebars';

const CVEdit = () => {
  const { id } = useParams();
  const [cv, setCv] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    position_for: "",
    age: "",
    reference: "",
    email: "",
    phone: "",
    cv_file: null,
  });

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const response = await axios.get(`https://tad-group.onrender.com/api/hrms/api/CVAdd/${id}/`);
        setCv(response.data);
        setFormData({
          name: response.data.name,
          position_for: response.data.position_for || "",
          age: response.data.age || "",
          reference: response.data.reference || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          cv_file: null,
        });
      } catch (error) {
        console.error("Error fetching CV:", error);
      }
    };

    fetchCV();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      cv_file: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("position_for", formData.position_for);
    formDataToSubmit.append("age", formData.age);
    formDataToSubmit.append("reference", formData.reference);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("phone", formData.phone);

    if (formData.cv_file) {
      formDataToSubmit.append("cv_file", formData.cv_file);
    }

    try {
      await axios.put(`https://tad-group.onrender.com/api/hrms/api/CVAdd/${id}/`, formDataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("CV updated successfully!");
      navigate("/cv-list");
    } catch (error) {
      console.error("Error updating CV:", error);
      alert("Failed to update CV");
    }
  };

  if (!cv) return <div>Loading...</div>;

  const containerStyle = {
    display: "flex",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f4f6f9",
    minHeight: "100vh",
  };

  const formContainerStyle = {
    flex: 1,
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    margin: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
    alignSelf: "start",
    transition: "background-color 0.3s",
  };

  const submitButtonHoverStyle = {
    backgroundColor: "#2b6cb0",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-start",
    marginTop: "20px",
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex' }}>
        <Sidebars />
        <div style={{ flex: 1, overflow: 'auto' }}>
          {/* Your page content here */}
        </div>
      </div>
      <div style={formContainerStyle}>
        <h2>Edit CV - {cv.name}</h2>
        <form onSubmit={handleSubmit}>
          <div style={formGridStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Position for</label>
              <input type="text" name="position_for" value={formData.position_for} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Date of Birth</label>
              <input type="date" name="age" value={formData.age} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Reference</label>
              <input type="text" name="reference" value={formData.reference} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>CV File (Leave empty to keep existing)</label>
              <input type="file" name="cv_file" onChange={handleFileChange} style={inputStyle} />
            </div>
          </div>
        </form>
        <div style={buttonContainerStyle}>
          <button type="submit" onClick={handleSubmit} style={submitButtonStyle} onMouseEnter={(e) => (e.target.style.backgroundColor = submitButtonHoverStyle.backgroundColor)} onMouseLeave={(e) => (e.target.style.backgroundColor = submitButtonStyle.backgroundColor)}>Save</button>
          <button type="button" onClick={() => navigate(-1)} style={{ ...submitButtonStyle, backgroundColor: '#ccc', marginLeft: '10px' }} onMouseEnter={(e) => (e.target.style.backgroundColor = '#bbb')} onMouseLeave={(e) => (e.target.style.backgroundColor = '#ccc')}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CVEdit;