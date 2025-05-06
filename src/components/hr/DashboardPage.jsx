// DashboardPage.jsx

import React, { useState } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { CChart } from "@coreui/react-chartjs";

const DashboardPage = ({ isSidebarOpen }) => {
  const width = window.innerWidth / 3;
  const height = window.innerHeight / 2.1;
  const [sizes, setSizes] = useState([
    { width: width, height: height },
    { width: width, height: height },
    { width: width, height: height },
  ]);

  const handleResize = (index, newWidth, newHeight) => {
    const newSizes = [...sizes];
    newSizes[index] = { width: newWidth, height: newHeight };
    setSizes(newSizes);
  };

  const chartTitles = ["Buyer", "Trend", "Supplier"];

  const staticChartData = [
    {
      labels: ["Buyer A", "Buyer B", "Buyer C"],
      datasets: [{ data: [300, 500, 700], backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"] }],
    },
    {
      labels: ["Jan", "Feb", "Mar", "Apr"],
      datasets: [{ data: [65, 59, 80, 81], label: "Sales", borderColor: "#36A2EB", fill: false }],
    },
    {
      labels: ["Supplier X", "Supplier Y", "Supplier Z"],
      datasets: [{ data: [200, 450, 600], backgroundColor: ["#4BC0C0", "#FF9F40", "#9966FF"] }],
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: "10px",
        marginLeft: isSidebarOpen ? "250px" : "0", // Adjust content position based on sidebar state
        transition: "margin-left 0.3s", // Smooth transition for content shift
      }}
    >
      <h2 style={{ textAlign: "center" }}>Dashboard</h2>
      <div style={{ display: "flex", justifyContent: "space-between", height: "50vh", padding: "5px" }}>
        {sizes.map((size, index) => (
          <ResizableBox
            key={index}
            width={size.width}
            height={size.height}
            axis="both"
            resizeHandles={["se"]}
            minConstraints={[200, 200]}
            maxConstraints={[1000, 1000]}
            onResizeStop={(e, { size: { width, height } }) => handleResize(index, width, height)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#f9f9f9",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <h3>{chartTitles[index]}</h3>
            <CChart
              type={index === 0 ? "doughnut" : index === 1 ? "line" : "bar"}
              data={staticChartData[index]}
              options={{ responsive: true, maintainAspectRatio: false }}
              style={{ width: "100%", height: "100%" }}
            />
          </ResizableBox>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
