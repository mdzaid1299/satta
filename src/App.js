import React, { useEffect, useState } from "react";
import "./App.css";
import playbazaar from "./playbazaar.png";
import axios from "axios"; // Import axios
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear(); // e.g., 2024
  const [months] = useState([
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]);
  // State to store selected month and year
  const [selectedMonth, setSelectedMonth] = useState(currentMonth + 1); // +1 to match the dropdown value (1-12)
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [tableData, setTableData] = useState([]);
  const [allData, setAllData] = useState([]); // Store all months' data

  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  useEffect(() => {
    axios
      .get("https://playbazar-online.onrender.com")
      .then((response) => {
        const data = response.data.results || []; // Safeguard against undefined
        setAllData(data); // Store all results data
        updateTableData(currentMonth + 1, currentYear, data); // +1 for month 1-12
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const updateTableData = (month, year, data) => {
    if (!data || data.length === 0) {
      setTableData([{ game: "New Game", values: Array(31).fill("") }]);
      return;
    }

    const filteredData = data.filter((item) => {
      return item.year === year && item.month === month;
    });

    if (filteredData.length === 0) {
      setTableData([{ game: "New Game", values: Array(31).fill("") }]);
    } else {
      setTableData(filteredData);
    }
  };

  const handleInputChange = (gameIndex, dayIndex, value) => {
    const updatedData = [...tableData];
    updatedData[gameIndex].values[dayIndex] = value;
    setTableData(updatedData);
  };

  const handleGameNameChange = (gameIndex, value) => {
    const updatedData = [...tableData];
    updatedData[gameIndex].game = value;
    setTableData(updatedData);
  };

  const addNewGame = () => {
    const newGame = {
      game: "New Game",
      values: Array(31).fill(""),
    };
    setTableData([...tableData, newGame]);
  };

  const handleSave = () => {
    const updatedData = [...allData]; // Start with existing allData

    // Loop through the current table data to update allData
    tableData.forEach((game) => {
      const existingIndex = updatedData.findIndex(
        (item) =>
          item.month === selectedMonth &&
          item.year === selectedYear &&
          item.game === game.game
      );

      // If exists, update it; if not, add it
      if (existingIndex > -1) {
        updatedData[existingIndex].values = game.values;
      } else {
        updatedData.push({
          game: game.game,
          values: game.values,
          month: selectedMonth,
          year: selectedYear,
        });
      }
    });

    setAllData(updatedData); // Update allData

    axios
      .post("https://playbazar-online.onrender.com", { results: updatedData })
      .then((response) => {
        alert("Data Saved Successfully!");
        console.log("Data saved successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        alert("Failed to save data.");
      });
  }; // <-- This closing bracket was missing

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDateTime = now
        .toISOString()
        .replace("T", " ")
        .split(".")[0];
      setCurrentDateTime(formattedDateTime);
    };

    const intervalId = setInterval(updateDateTime, 1000);
    updateDateTime();
    return () => clearInterval(intervalId);
  }, []);

  const printChart = () => {
    const printContents = document.getElementById("printableArea").innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Reload to restore the original content
  };

  // Update table data when month or year is changed
  useEffect(() => {
    updateTableData(selectedMonth, selectedYear, allData);
  }, [selectedMonth, selectedYear, allData]);

  return (
    <div className="App">
      {/* Your JSX content here */}
    </div>
  );
}

export default App;
