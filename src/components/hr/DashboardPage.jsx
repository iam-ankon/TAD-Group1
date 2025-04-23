// import React from "react";

// const DashboardPage = () => {
//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Main Content Area */}
//       <div className="main-content">
//         {/* Dashboard Title */}
//         <h2 className="dashboard-title">Dashboard</h2>
//       </div>

//       {/* Styles */}
//       <style jsx>{`
//         .main-content {
//           flex: 1;
//           padding: 30px;
//         }

//         .dashboard-title {
//           font-size: 2rem;
//           font-weight: bold;
//           text-align: center;
//           margin-top: 50px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DashboardPage;


// import React, { useEffect, useState } from "react";
// import { ResizableBox } from "react-resizable";
// import "react-resizable/css/styles.css";
// import { CChart } from "@coreui/react-chartjs";

// const DashboardPage = () => {
//   const width = window.innerWidth / 3;
//   const height = window.innerHeight / 2.1;
//   const [sizes, setSizes] = useState([
//     { width: width, height: height },
//     { width: width, height: height },
//     { width: width, height: height },
//   ]);

//   const handleResize = (index, newWidth, newHeight) => {
//     const totalWidth = sizes.reduce((sum, size) => sum + size.width, 0);
//     const totalHeight = sizes.reduce((sum, size) => sum + size.height, 0);

//     const remainingWidth = totalWidth - newWidth;
//     const remainingHeight = totalHeight - newHeight;

//     const otherIndexes = sizes.map((_, i) => i).filter((i) => i !== index);
//     const newSizes = [...sizes];

//     const otherSizeSumWidth = otherIndexes.reduce(
//       (sum, i) => sum + sizes[i].width,
//       0
//     );
//     const otherSizeSumHeight = otherIndexes.reduce(
//       (sum, i) => sum + sizes[i].height,
//       0
//     );

//     otherIndexes.forEach((i) => {
//       newSizes[i] = {
//         width: Math.max(
//           200,
//           (remainingWidth * sizes[i].width) / otherSizeSumWidth
//         ),
//         height: Math.max(
//           200,
//           (remainingHeight * sizes[i].height) / otherSizeSumHeight
//         ),
//       };
//     });

//     newSizes[index] = { width: newWidth, height: newHeight };
//     setSizes(newSizes);
//   };

//   const [chartData, setChartData] = useState(null);
//   const [chartData2, setChartData2] = useState(null);
//   const [chartData3, setChartData3] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           "http://127.0.0.1:8000/api/hrms/api/"
//         );
//         const data = await response.json();

//         const labels = data.map((item) => item.buyer_name);
//         const values = data.map((item) => parseFloat(item.total_value));
//         const values2 = data.map((item) => parseFloat(item.shipped_qty));
//         const labels2 = data.map((item) => item.supplier_name);
//         const values3 = data.map((item) => parseFloat(item.qty));
//         const labels3 = data.map((item) => item.supplier_name);

//         const backgroundColors = labels.map(
//           () =>
//             `#${Math.floor(Math.random() * 16777215)
//               .toString(16)
//               .padStart(6, "0")}`
//         );

//         setChartData({
//           labels: labels,
//           datasets: [
//             {
//               data: values,
//               backgroundColor: backgroundColors,
//             },
//           ],
//         });
//         setChartData2({
//           labels: labels2,
//           datasets: [
//             {
//               data: values2,
//               backgroundColor: backgroundColors,
//             },
//           ],
//         });
//         setChartData3({
//           labels: labels3,
//           datasets: [
//             {
//               data: values3,
//               backgroundColor: backgroundColors,
//             },
//           ],
//         });
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const chartTitles = ["Buyer","Trend","Supplier",];

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "flex-start",
//         alignItems: "stretch",
//         height: "100vh",
//         overflow: "auto",
//         padding: "10px",
//       }}
//     >
//       <h2 style={{ textAlign: "center" }}>Dashboard</h2>
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "row",
//           justifyContent: "space-between",
//           alignItems: "stretch",
//           height: "50vh",
//           overflow: "hidden",
//           padding: "5px",
//         }}
//       >
//         {sizes.map((size, index) => (
//           <ResizableBox
//             key={index}
//             width={size.width}
//             height={size.height}
//             axis="both"
//             resizeHandles={["se"]}
//             minConstraints={[200, 200]}
//             maxConstraints={[1000, 1000]}
//             onResizeStop={(e, { size: { width, height } }) =>
//               handleResize(index, width, height)
//             }
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "flex-start",
//               background: "#f9f9f9",
//               border: "1px solid #ccc",
//               padding: "10px",
//               boxSizing: "border-box",
//             }}
//           >
//             <h3>{chartTitles[index]}</h3>
//             {chartData ? (
//               <CChart
//                 type={index === 0 ? "doughnut" : index === 1 ? "line" : "bar"}
//                 data={
//                   index === 0
//                     ? chartData
//                     : index === 1
//                     ? chartData2
//                     : chartData3
//                 }
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                 }}
//                 style={{ width: "100%", height: "100%" }}
//               />
//             ) : (
//               <p>Loading chart...</p>
//             )}
//           </ResizableBox>
//         ))}
//       </div>
//       <div style={{ overflowX: "auto", width: "100%" }}>
//         <table
//           className="table"
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//           }}
//         >
//           <thead>
//             <tr>
//               {[
//                 "Department",
//                 "Total Quantity",
//                 "Value",
//                 "Shipped Quantity",
//                 "Shipped Value",
//                 "Balance Quantity",
//                 "Shipped %",
//               ].map((header, index) => (
//                 <th
//                   key={index}
//                   style={{
//                     padding: "1vw 2vw",
//                     textAlign: "left",
//                     border: "1px solid #ccc",
//                   }}
//                 >
//                   {header}
//                 </th>
//               ))}
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {Array.from({ length: 5 }).map((_, rowIndex) => (
//               <tr key={rowIndex}>
//                 <td
//                   style={{
//                     padding: "1vw 2vw",
//                     border: "1px solid #ccc",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "1rem",
//                     }}
//                   >
//                     <div>
//                       <div className="font-bold">Hgsxx</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td style={{ padding: "1vw 2vw", border: "1px solid #ccc" }}>
//                   34834984334834
//                 </td>
//                 <td style={{ padding: "1vw 2vw", border: "1px solid #ccc" }}>
//                   12340233444
//                 </td>
//                 <td style={{ padding: "1vw 2vw", border: "1px solid #ccc" }}>
//                   23444
//                 </td>
//                 <td style={{ padding: "1vw 2vw", border: "1px solid #ccc" }}>
//                   34566
//                 </td>
//                 <td style={{ padding: "1vw 2vw", border: "1px solid #ccc" }}>
//                   3545
//                 </td>
//                 <td style={{ padding: "1vw 2vw", border: "1px solid #ccc" }}>
//                   0%
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

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
