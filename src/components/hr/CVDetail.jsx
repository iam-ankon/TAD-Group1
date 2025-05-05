// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { QRCodeCanvas } from "qrcode.react";
// import Sidebars from './sidebars';

// const CVDetail = () => {
//     const { id } = useParams();
//     const [cvDetails, setCvDetails] = useState(null);
//     const qrCodeRef = useRef(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchCVDetails = async () => {
//             try {
//                 const response = await axios.get(`https://tadbackend-5456.onrender.com/api/hrms/api/CVAdd/${id}/`);
//                 setCvDetails(response.data);
//             } catch (error) {
//                 console.error("Error fetching CV details:", error);
//             }
//         };

//         fetchCVDetails();
//     }, [id]);

//     const generateQRCode = async () => {
//         if (!qrCodeRef.current || !cvDetails) return;
    
//         const qrCanvas = qrCodeRef.current;
//         const qrCodeImage = qrCanvas.toDataURL("image/png");
    
//         try {
//             const response = await axios.post(
//                 `https://tadbackend-5456.onrender.com/api/hrms/api/CVAdd/${id}/update-cv-with-qr/`,
//                 { qr_code: qrCodeImage },
//                 { 
//                     responseType: "blob",
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );
    
//             // Create blob URL
//             const pdfBlob = new Blob([response.data], { type: "application/pdf" });
//             const pdfUrl = URL.createObjectURL(pdfBlob);
    
//             // Open in new tab and handle printing
//             const newWindow = window.open(pdfUrl, '_blank');
            
//             if (!newWindow) {
//                 alert('Please allow popups for this site to view the PDF');
//                 return;
//             }
    
//             // Add event listener for when the window loads
//             newWindow.onload = function() {
//                 try {
//                     this.print();
//                 } catch (e) {
//                     console.error("Print error:", e);
//                 }
//             };
    
//         } catch (error) {
//             console.error("Error updating CV with QR code:", error);
            
//             // Handle error response
//             if (error.response?.data instanceof Blob) {
//                 try {
//                     const errorText = await error.response.data.text();
//                     const errorData = JSON.parse(errorText);
//                     alert(`Error: ${errorData.error || 'Server error'}`);
//                 } catch (e) {
//                     alert("An error occurred while processing your request");
//                 }
//             } else {
//                 alert("An error occurred while processing your request");
//             }
//         }
//     };
//     const handleSelectForInterview = () => {
//         if (cvDetails) {
//             navigate("/interviews", {
//                 state: { ...cvDetails },
//             });
//         } else {
//             console.error("No CV details available to send.");
//         }
//     };

//     const styles = {
//         container: {
//             display: "flex",
//             fontFamily: "Segoe UI, sans-serif",
//             backgroundColor: "#f4f6f9",
//             minHeight: "100vh",
//         },
     
//         contentContainer: {
//             flex: 1,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//         },
//         card: {
//             width: "100%",
//             maxWidth: "600px",
//             backgroundColor: "white",
//             padding: "30px",
//             borderRadius: "12px",
//             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//             textAlign: "center",
//         },
//         header: {
//             fontSize: "28px",
//             color: "#0078D4",
//             marginBottom: "25px",
//             fontWeight: "bold",
//         },
//         details: {
//             fontSize: "16px",
//             marginBottom: "15px",
//             textAlign: "left",
//         },
//         detailItem: {
//             marginBottom: "8px",
//         },
//         link: {
//             color: "#0078D4",
//             textDecoration: "none",
//             fontWeight: "bold",
//         },
//         qrContainer: {
//             display: "flex",
//             justifyContent: "center",
//             marginTop: "30px",
//         },
//         buttonContainer: {
//             marginTop: "30px",
//             display: "flex",
//             justifyContent: "center",
//             gap: "20px",
//         },
//         button: {
//             padding: "12px 25px",
//             backgroundColor: "#0078D4",
//             color: "white",
//             border: "none",
//             borderRadius: "8px",
//             cursor: "pointer",
//             fontSize: "16px",
//             fontWeight: "600",
//             transition: "background-color 0.3s ease, transform 0.2s ease",
//             boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
//         },
//         buttonHover: {
//             backgroundColor: "#005ea6",
//             transform: "scale(1.05)",
//         },
//     };

//     return (
//         <div style={styles.container}>
//             <div style={{ display: 'flex' }}>
//                 <Sidebars />
//                 <div style={{ flex: 1, overflow: 'auto' }}>
//                     {/* Your page content here */}
//                 </div>
//             </div>
//             <div style={styles.contentContainer}>
//                 {cvDetails ? (
//                     <div style={styles.card}>
//                         <h2 style={styles.header}>CV Details</h2>
//                         <div style={styles.details}>
//                             <p style={styles.detailItem}><strong>Name:</strong> {cvDetails.name}</p>
//                             <p style={styles.detailItem}><strong>Position:</strong> {cvDetails.position_for}</p>
//                             <p style={styles.detailItem}><strong>Date of Birth:</strong> {cvDetails.age}</p>
//                             <p style={styles.detailItem}><strong>Email:</strong> {cvDetails.email}</p>
//                             <p style={styles.detailItem}><strong>Phone:</strong> {cvDetails.phone}</p>
//                             <p style={styles.detailItem}><strong>Reference:</strong> {cvDetails.reference}</p>
//                             <p style={styles.detailItem}>
//                                 <a href={cvDetails.cv_file} target="_blank" rel="noopener noreferrer" style={styles.link}>
//                                     View CV
//                                 </a>
//                             </p>
//                         </div>

//                         <div style={styles.qrContainer}>
//                             <QRCodeCanvas
//                                 ref={qrCodeRef}
//                                 value={`https://tad-group.vercel.app/interviews/${id}`}
//                                 size={200}
//                             />
//                         </div>

//                         <div style={styles.buttonContainer}>
//                             <button
//                                 style={styles.button}
//                                 onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
//                                 onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
//                                 onClick={generateQRCode}
//                             >
//                                 Attach to CV
//                             </button>

//                             <button
//                                 style={styles.button}
//                                 onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
//                                 onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
//                                 onClick={handleSelectForInterview}
//                             >
//                                 Selected for Interview
//                             </button>
//                         </div>
//                     </div>
//                 ) : (
//                     <p>Loading CV details...</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CVDetail;

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import Sidebars from './sidebars';

const CVDetail = () => {
    const { id } = useParams();
    const [cvDetails, setCvDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const qrCodeRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCVDetails = async () => {
            try {
                const response = await axios.get(`https://tadbackend-5456.onrender.com/api/hrms/api/CVAdd/${id}/`);
                setCvDetails(response.data);
            } catch (error) {
                console.error("Error fetching CV details:", error);
            }
        };

        fetchCVDetails();
    }, [id]);

    // Create QR code data with CV details and link
    const getQRCodeData = () => {
        if (!cvDetails) return "";
        
        // Create an object with the CV details and the interview link
        const qrData = {
            id: cvDetails.id,
            name: cvDetails.name,
            position: cvDetails.position_for,
            email: cvDetails.email,
            phone: cvDetails.phone,
            reference: cvDetails.reference,
            interviewLink: `https://tad-group.vercel.app/interviews/${id}`
        };
        
        // Convert to JSON string
        return JSON.stringify(qrData);
    };

    const generateQRCode = async () => {
        if (!qrCodeRef.current || !cvDetails) {
            alert("QR code or CV details not available");
            return;
        }
    
        try {
            setIsLoading(true);
            
            // 1. Get QR code as base64
            const qrCanvas = qrCodeRef.current;
            const qrCodeImage = qrCanvas.toDataURL("image/png");
            
            // 2. Create FormData
            const formData = new FormData();
            formData.append('qr_code', qrCodeImage);
            
            // 3. Make API request
            const response = await axios.post(
                `https://tadbackend-5456.onrender.com/api/hrms/api/CVAdd/${id}/update-cv-with-qr/`,
                formData,
                {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 30000
                }
            );
    
            // 4. Verify response type
            if (!response.headers['content-type'].includes('pdf')) {
                const errorText = await response.data.text();
                throw new Error(errorText || "Server returned non-PDF response");
            }
    
            // 5. Handle successful response
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            // 6. Open PDF in new window
            const newWindow = window.open(url, '_blank');
            if (newWindow) {
                newWindow.onload = () => {
                    try {
                        newWindow.print();
                    } catch (e) {
                        console.error("Print error:", e);
                        alert('Failed to auto-print. Please print manually.');
                    }
                };
            } else {
                alert('Please allow popups for this site to view the PDF');
            }
            
        } catch (error) {
            console.error("Error updating CV with QR code:", error);
            let errorMessage = "An error occurred while processing your request";
            
            if (error.response) {
                try {
                    const errorText = await error.response.data.text();
                    try {
                        const errorData = JSON.parse(errorText);
                        errorMessage = errorData.error || errorData.details || errorText;
                    } catch {
                        errorMessage = errorText;
                    }
                } catch (e) {
                    errorMessage = `Server error (${error.response.status})`;
                }
            } else if (error.code === 'ERR_NETWORK') {
                errorMessage = "Network error. Please check your connection.";
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = "Request timed out. Please try again.";
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectForInterview = () => {
        if (cvDetails) {
            navigate("/interviews", {
                state: { ...cvDetails },
            });
        } else {
            console.error("No CV details available to send.");
        }
    };

    const styles = {
        container: {
            display: "flex",
            fontFamily: "Segoe UI, sans-serif",
            backgroundColor: "#f4f6f9",
            minHeight: "100vh",
        },
        contentContainer: {
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        card: {
            width: "100%",
            maxWidth: "600px",
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
        },
        header: {
            fontSize: "28px",
            color: "#0078D4",
            marginBottom: "25px",
            fontWeight: "bold",
        },
        details: {
            fontSize: "16px",
            marginBottom: "15px",
            textAlign: "left",
        },
        detailItem: {
            marginBottom: "8px",
        },
        link: {
            color: "#0078D4",
            textDecoration: "none",
            fontWeight: "bold",
        },
        qrContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "30px",
        },
        qrDescription: {
            fontSize: "14px",
            color: "#666",
            marginTop: "10px",
            maxWidth: "300px",
            textAlign: "center",
        },
        buttonContainer: {
            marginTop: "30px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
        },
        button: {
            padding: "12px 25px",
            backgroundColor: "#0078D4",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        },
        buttonHover: {
            backgroundColor: "#005ea6",
            transform: "scale(1.05)",
        },
        buttonDisabled: {
            backgroundColor: "#cccccc",
            cursor: "not-allowed",
        }
    };

    return (
        <div style={styles.container}>
            <div style={{ display: 'flex' }}>
                <Sidebars />
                <div style={{ flex: 1, overflow: 'auto' }}>
                    {/* Your page content here */}
                </div>
            </div>
            <div style={styles.contentContainer}>
                {cvDetails ? (
                    <div style={styles.card}>
                        <h2 style={styles.header}>CV Details</h2>
                        <div style={styles.details}>
                            <p style={styles.detailItem}><strong>Name:</strong> {cvDetails.name}</p>
                            <p style={styles.detailItem}><strong>Position:</strong> {cvDetails.position_for}</p>
                            <p style={styles.detailItem}><strong>Date of Birth:</strong> {cvDetails.age}</p>
                            <p style={styles.detailItem}><strong>Email:</strong> {cvDetails.email}</p>
                            <p style={styles.detailItem}><strong>Phone:</strong> {cvDetails.phone}</p>
                            <p style={styles.detailItem}><strong>Reference:</strong> {cvDetails.reference}</p>
                            <p style={styles.detailItem}>
                                <a href={cvDetails.cv_file} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                    View CV
                                </a>
                            </p>
                        </div>

                        <div style={styles.qrContainer}>
                            <QRCodeCanvas
                                ref={qrCodeRef}
                                value={getQRCodeData()}
                                size={200}
                                level={"H"}
                                includeMargin={true}
                            />
                            <p style={styles.qrDescription}>
                                This QR code contains candidate details and a direct link to the interview page
                            </p>
                        </div>

                        <div style={styles.buttonContainer}>
                            <button
                                style={{
                                    ...styles.button,
                                    ...(isLoading ? styles.buttonDisabled : {}),
                                }}
                                onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                                onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = styles.button.backgroundColor)}
                                onClick={generateQRCode}
                                disabled={isLoading}
                            >
                                {isLoading ? "Processing..." : "Attach to CV"}
                            </button>

                            <button
                                style={{
                                    ...styles.button,
                                    ...(isLoading ? styles.buttonDisabled : {}),
                                }}
                                onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                                onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = styles.button.backgroundColor)}
                                onClick={handleSelectForInterview}
                                disabled={isLoading}
                            >
                                Selected for Interview
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>Loading CV details...</p>
                )}
            </div>
        </div>
    );
};

export default CVDetail;