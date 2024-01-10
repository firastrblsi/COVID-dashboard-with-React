import React, { useState, useEffect } from "react";
import "./App.css";
import Select from "react-select";
import "./Card";
import Card from "./Card";

function App() {
  const [activeLocation, setActiveLocation] = useState("AB");
  const [lastUpdate, setLastUpdate] = useState("");

  const locationList = [
    { value: "AB", label: "Alberta" },
    { value: "BC", label: "British Columbia" },
    { value: "MB", label: "Manitoba" },
    { value: "NB", label: "New Brunswick" },
    { value: "NL", label: "Newfoundland and Labrador" },
    { value: "NT", label: "Northwest Territories" },
    { value: "NS", label: "Nova Scotia" },
    { value: "NU", label: "Nunavut" },
    { value: "ON", label: "Ontario" },
    { value: "PE", label: "Prince Edward Island" },
    { value: "QC", label: "Quebec" },
    { value: "SK", label: "Saskatchewan" },
    { value: "YT", label: "Yukon" },
  ];

  const baseUrl = "https://api.opencovid.ca";
  const getVersion = async () => {
    const res = await fetch(`${baseUrl}/version`);
    const data = await res.json();
    setLastUpdate(data.timeseries);
  };

  useEffect(() => {
    getSummaryData();
    getVersion();
  }, [activeLocation]);

  const [summaryData, setSummaryData] = useState({});

  const getSummaryData = async (location) => {
    if (activeLocation === "canada") {
      return;
    }
    let res = await fetch(`${baseUrl}/summary?loc=${activeLocation}`);
    let resData = await res.json();
    let summaryData = resData.data[0];
    let formattedData = {};

    Object.keys(summaryData).map(
      (key) => (formattedData[key] = summaryData[key].toLocaleString())
    );
    console.log(formattedData);
    setSummaryData(formattedData);
  };

  return (
    <>
      <div className="App">
        <h1>COVID 19 Dashboard </h1>
        <div className="dashboard-container">
          <div className="dashboard-menu">
            <Select
              options={locationList}
              className="dashboard-select"
              onChange={(selectedOption) =>
                setActiveLocation(selectedOption.value)
              }
              defaultValue={locationList.filter(
                (options) => options.value === activeLocation
              )}
            />
            <p className="update-date">Last update : {lastUpdate}</p>
          </div>
          <div className="dashboard-summary">
            <Card title="Total Cases" value={summaryData.cases} />
            <Card title="Total Tests" values={summaryData.tests_completed} />
            <Card title="Total Deaths" value={summaryData.deaths} />
            <Card
              title="Total Vaccinated"
              values={summaryData.vaccine_administration_total_doses}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
