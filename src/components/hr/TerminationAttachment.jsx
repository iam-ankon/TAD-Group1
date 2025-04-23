import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TerminationAttachment = () => {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    fetchAttachments();
  }, []);

  const fetchAttachments = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/hrms/api/termination_attachment/?employee_id=${id}`
      );
      setAttachments(response.data);
    } catch (error) {
      console.error("Error fetching termination attachments:", error);
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).map((file) => ({
      file,
      description: "",
    }));
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleTextChange = (index, event) => {
    const updatedFiles = [...files];
    updatedFiles[index].description = event.target.value;
    setFiles(updatedFiles);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((fileObj) => {
      formData.append("file", fileObj.file);
      formData.append("description", fileObj.description);
    });
    formData.append("employee", id);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/hrms/api/termination_attachment/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      fetchAttachments();
      alert("Termination files uploaded successfully!");
      setFiles([]);
      document.getElementById("fileInput").value = "";
    } catch (error) {
      console.error("Error uploading termination files:", error);
    }
  };

  const handleDelete = async (attachmentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://tad-group.onrender.com/api/hrms/api/termination_attachment/${attachmentId}/`
      );
      setAttachments(attachments.filter((attachment) => attachment.id !== attachmentId));
      alert("Termination file deleted successfully!");
    } catch (error) {
      console.error("Error deleting termination file:", error);
    }
  };

  const handleEditDescription = (attachmentId, newDescription) => {
    axios
      .patch(
        `https://tad-group.onrender.com/api/hrms/api/termination_attachment/${attachmentId}/`,
        { description: newDescription }
      )
      .then(() => {
        fetchAttachments();
        alert("Description updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating description:", error);
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Termination Attachments</h2>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        id="fileInput"
        style={styles.fileInput}
      />
      {files.map((fileObj, index) => (
        <div key={index} style={styles.fileContainer}>
          <span style={styles.fileName}>{fileObj.file.name}</span>
          <input
            type="text"
            placeholder="Enter file description"
            value={fileObj.description}
            onChange={(event) => handleTextChange(index, event)}
            style={styles.descriptionInput}
          />
        </div>
      ))}
      <button onClick={handleUpload} style={styles.uploadButton}>
        Upload
      </button>

      <h3 style={styles.uploadedFilesHeading}>Uploaded Termination Files</h3>
      <ul style={styles.fileList}>
        {attachments.map((attachment) => (
          <li key={attachment.id} style={styles.listItem}>
            <a
              href={
                attachment.file.startsWith("http")
                  ? attachment.file
                  : `https://tad-group.onrender.com${attachment.file}`
              }
              target="_blank"
              rel="noopener noreferrer"
              style={styles.fileLink}
            >
              {attachment.file.split("/").pop()}
            </a>
            <span style={styles.uploadDate}>
              ({new Date(attachment.uploaded_at).toLocaleString()})
            </span>
            <span style={styles.descriptionText}>
              Description:{" "}
              <span style={styles.italicText}>
                {attachment.description || "No description"}
              </span>
            </span>
            <button
              onClick={() =>
                handleEditDescription(
                  attachment.id,
                  prompt("Enter new description:", attachment.description || "")
                )
              }
              style={styles.editButton}
            >
              ✏️
            </button>
            <button
              onClick={() => handleDelete(attachment.id)}
              style={styles.deleteButton}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f4f7fc",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  fileInput: {
    fontSize: "14px",
    marginRight: "10px",
    padding: "10px",
    backgroundColor: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  fileContainer: {
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
  },
  fileName: {
    marginRight: "10px",
  },
  descriptionInput: {
    padding: "8px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    width: "250px",
    marginRight: "10px",
  },
  uploadButton: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  uploadedFilesHeading: {
    marginTop: "20px",
    fontSize: "20px",
    fontWeight: "600",
    color: "#2c3e50",
  },
  fileList: {
    listStyleType: "none",
    padding: "0",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #e0e0e0",
  },
  fileLink: {
    fontSize: "14px",
    color: "#3498db",
    marginRight: "15px",
    textDecoration: "none",
  },
  uploadDate: {
    fontSize: "12px",
    color: "#7f8c8d",
    marginRight: "15px",
  },
  descriptionText: {
    fontSize: "12px",
  },
  italicText: {
    fontStyle: "italic",
  },
  editButton: {
    marginLeft: "10px",
    padding: "6px 12px",
    fontSize: "12px",
    backgroundColor: "#f39c12",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    marginLeft: "10px",
    padding: "6px 12px",
    fontSize: "12px",
    backgroundColor: "#e74c3c",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default TerminationAttachment;
