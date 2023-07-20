import React, { useEffect, useState } from "react";
import exportFromJSON from "export-from-json";
import "./Dashboard.css";
import "jspdf-autotable";
import Axios from "axios";

const Dashboard = () => {
  const [userData, setUserData] = useState([]);
  const [csvData, setCsvData] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jobData, setJobData] = useState([]);

  useEffect(() => {
    fetchData();
    fetchDataFromAPI();

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 5 * 1000); // 10-second interval

    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const jsonData = await response.json();
      setUserData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataFromAPI = () => {
    // Replace this URL with the actual API endpoint
    const apiUrl = "http://172.190.91.62:5000/api/jsonfile";

    Axios.get(apiUrl)
      .then((response) => {
        // Assuming the API response data is an array of objects
        const data = response.data;

        // Sort the data by date in descending order (latest date first)
        data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setJobData(data);
        const csvData = JSON.stringify(data, null, 2);
        setCsvData(csvData);
      })
      .catch((error) => {
        console.error("Error fetching API data:", error);
      });
  };

  const downloadCSV = () => {
    // Create an array with the job data
    const data = jobData;
    console.log(data[0]);
    const fileName = "data.csv";
    const exportType = exportFromJSON.types.csv;

    exportFromJSON({ data, fileName, exportType });
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {userData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>File Name</th>
              <th>Company URL</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {jobData.map((job, index) => (
              <tr key={index}>
                <td>{job.timestamp}</td>
                <td>{job.filename}</td>
                <td>{job.website}</td>
                <td>
                  {/* Use a button to trigger the CSV download */}
                  <a href={`https://practiceaccount9090.blob.core.windows.net/scraping-container/${job.filename}`} className="btn">
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading Job Data...</p>
      )}
    </div>
  );
};

export default Dashboard;
