import React, { useEffect, useState } from "react";
import "./App.css";
import playbazaar from "./playbazaar.png";

import axios from "axios"; // Import axios

import { auth, signInWithEmailAndPassword, signOut } from './firebase';

import Modal from 'react-modal'; // Import react-modal

Modal.setAppElement('#root'); // Set the root element for accessibility

function App() {

  const [currentDateTime, setCurrentDateTime] = useState("");
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear(); // e.g., 2024

  const [months] = useState([
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]);
  // State to store selected month and year
  const [selectedMonth, setSelectedMonth] = useState(currentMonth + 1); // +1 to match the dropdown value (1-12)
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [tableData, setTableData] = useState([]);
  const [allData, setAllData] = useState([]); // Store all months' data

  const [user, setUser] = useState(null); // Firebase user
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [email, setEmail] = useState(""); // To capture email input
  const [password, setPassword] = useState(""); // To capture password input
  const [error, setError] = useState(""); // For error handling

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    // Fetch initial data from the server
    axios.get("https://satta-backend-fa5w.onrender.com/results").then((response) => {
      setAllData(response.data.results); // Store all results data
      updateTableData(currentMonth, currentYear, response.data.results);
    });
  }, []);

  // Function to update tableData based on selected month and year
  const updateTableData = (month, year, data) => {
    const filteredData = data.filter(item => {
      return item.year === year && item.month === month; // Assuming data has month/year
    });

    // If no data for selected month/year, provide a default row
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
    tableData.forEach(game => {
      // Find index of existing data for the same month/year
      const existingIndex = updatedData.findIndex(item =>
        item.month === selectedMonth && item.year === selectedYear && item.game === game.game
      );

      // If exists, update it; if not, add it
      if (existingIndex > -1) {
        updatedData[existingIndex].values = game.values; // Update existing
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
    axios.post("https://satta-backend-fa5w.onrender.com/results", { results: updatedData })
      .then((response) => {
        alert("Data Saved Successfully!");
        console.log("Data saved successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        alert("Failed to save data.");
      });
  };

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

  // Handle login with email and password
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsModalOpen(false); // Close modal after successful login
      setError(""); // Clear any error messages
    } catch (error) {
      setError(error.message); // Show error message if login fails
      console.error("Login error", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
  };
  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

// Function to close the modal
const closeModal = () => {
  setIsModalOpen(false);
  setError(""); // Clear any error when closing the modal
};


  return (
    <div className="App">
      <div className="blue-border-container">
        <div>
          {/* seo meta*/}
          <title>
            {" "}
            ► Play Bazaar : Play Bazzar | Play Bajar | Play Bazar | Play Bazaar
            Chart 2023-24| satta king
          </title>
          {/*  <centre><p>India<abbr title="Play Bazaar">'s</abbr> No.1 Satta Result Site</p> </centre> */}
          <meta
            name="Description"
            content="play bazaar, play bazar, प्ले बाजार, play bajar, play bazzar, satta king chart, satta king, satta king result, dl bazaar, satta king delhi, play bazaar chart, all play bazaar, delhi bazar satta, Play Bazaar xyz"
          />
          <meta
            name="Keywords"
            content="play bazaar, play bazar, प्ले बाजार, play bajar, play bazzar, satta king chart, satta king, satta king result, dl bazaar, satta king delhi, play bazaar chart, all play bazaar, delhi bazar satta, Play Bazaar xyz"
          />

          <meta name="robots" content="no index, no follow" />


          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
          />



          <div className="panel panel-signin" style={{ width: "98%" }}>
            <div className="panel-body" style={{ padding: "25px" }}>
              <div className="logo text-center">
                <img
                  src={playbazaar}
                  alt="Play Bazaar"
                  width="30%"
                  height
                />
              </div>
              <div className="container">
                <div className="container-fluid">
                  <div className="col-md-2  col-xs-2   grad1"></div>
                </div>
                <br />
              </div>
              <h4 className="text-center mb5">Monthly Result Chart</h4>
              <h4 className="text-center mb5" id="liveDatetime">
                {currentDateTime}
              </h4>
              <h4 className="text-center mb5" id="liveDatetime" />
              <div className="mb30" />
              <div className="row" style={{ "margin-bottom": "0px" }}>
                <form action="index.php" id="showResult" method="post">
                  <div className="col-sm-1">
                    {/*Change Code */}

                    <select
                      name="dd_month"
                      id="dd_month"
                      className="form-control"
                      style={{ width: "150px" }}
                      value={selectedMonth} // Set the current month
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    >
                      {months.map((month, index) => (
                        <option key={index} value={index + 1}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-sm-2">
                    <div className="input-group mb15">
                      <select
                        name="dd_year"
                        id="dd_year"
                        className="form-control"
                        value={selectedYear} // Set the current year
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                      >
                        {/* You can adjust the range of years as needed */}
                        {[2020, 2021, 2022, 2023, 2024,2025,2026,2027].map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  <div className="col-sm-1">
                    <div className="input-group mb15">
                      <button
                        type="button"
                        className="btn btn-success"
                        //onClick={() => window.location.reload()}

                        onClick={() => updateTableData(selectedMonth, selectedYear, allData)}
                      >
                        Show Results
                      </button>
                    </div>
                    {/* input-group */}
                  </div>
                </form>
                <div className="col-sm-6">
                  <div className="input-group mb15">
                    <button type="button" onClick={printChart} className="btn btn-warning" style={{ marginRight: "10px", background: "#f0b848" }}>
                      Print Chart
                    </button>
                    

                    {!user ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginLeft: "10px" }}
                        onClick={openModal}
                      >
                        Login
                      </button>
                    ) : (
                      <>

                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={addNewGame}
                          style={{ background: "#bb4329", border: "red" }}
                        >
                          Add New Game
                        </button>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={handleSave}
                          style={{ marginLeft: "10px" }}
                        >
                          Save Data
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          // onClick={handleLogout} // Call handleLogout to log out the user
                          onClick={handleLogout}
                          style={{ marginLeft: "10px" }}
                        >
                          Logout
                        </button>
                      </>
                    )}


                  </div>
                </div>




              </div>


              <br />
              <div className="row"> </div>
              <div id="printableArea" style={{ overflow: "auto" }}>
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>Game</th>
                      {[...Array(31)].map((_, i) => (
                        <th key={i}>{i + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((game, gameIndex) => (
                      <tr key={gameIndex}>
                        <td>
                          {user ? (
                            <input
                              type="text"
                              value={game.game}
                              onChange={(e) => handleGameNameChange(gameIndex, e.target.value)}
                              style={{ width: "100%" }}
                            />
                          ) : (
                            <span>{game.game}</span>
                          )}
                        </td>
                        {game.values.map((value, dayIndex) => (
                          <td key={dayIndex}>
                            {user ? (
                              <input
                                type="text"
                                value={value || ""}
                                onChange={(e) => handleInputChange(gameIndex, dayIndex, e.target.value)}
                                style={{ width: "100%" }}
                              />
                            ) : (
                              <span>{value}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>

            </div>
            <div>
              <p>...Paid Advertisment...</p>
              <div
                style={{
                  "background-color": "#18C2E5",
                  color: "#000",
                  "font-weight": "bold",
                  "font-style": "bold",
                  "font-size": "meduim",
                  "-webkit-text-decoration": "none",
                  "text-decoration": "none",
                  "border-width": "3px",
                  "border-color": "#000",
                  "border-style": "outset",
                  margin: "3px",
                  padding: "10px",
                  "border-radius": "10px",
                  "-webkit-text-align": "center",
                  "text-align": "center",
                }}
              >
                <style
                  dangerouslySetInnerHTML={{
                    __html:
                      "\n\t\t\t\t\t\t\t\tp2 {\n\t\t\t\t\t\t\t\t\ttext-shadow: 1px 1px 3px black;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t",
                  }}
                />
                <p2 style={{ "font-size": "33px", color: "#FFF701" }}>
                  GOLDY BHAI KTM : ONLINE KHAYIWAAL
                </p2>
                <hr />
                <p style={{ "font-size": "22px", color: "#0D092A" }}>
                  घर पर रह कर ऑनलाइन गेम खेलिए भरोसा आपका जिम्मेदारी हमारी
                  ! <br />
                  नोट - आप यह क्रॉसिंग भी प्ले कर सकते है, रेट 10 का 970
                </p>
                <hr />
                <p style={{ "font-size": "18px", color: "#071BC2" }}>
                  JD-DURGA 2:00PM Last
                  <br /> दिल्ली बज़ार 3:00PM Last
                  <br /> श्री गणेश 4:25PM Last
                  <br />
                  फरीदाबाद 05:55PM Last
                  <br /> गाज़ियाबाद 8:40PM Last
                  <br />
                  गली 11:30PM Last
                  <br /> दिसावर 4:30AM Last
                  <br />
                </p>
                <hr />
                <p style={{ "font-size": "22px", color: "#000" }}>
                  10 मिनट में पेमेंट की गारंटी CALL &amp; WHATSAPP - ☎️
                  8586025782
                </p>
                <a href="tel:>+918570844867">
                  <button
                    style={{
                      height: "40px",
                      width: "260px",
                      "background-color": "red",
                      color: "#FFF",
                      border: "solid 1px white",
                      "border-radius": "20px",
                    }}
                  >
                    <font size="4px">
                      <b>CALL NOW</b>
                    </font>
                  </button>
                </a>
                <a href="https://api.whatsapp.com/send?phone=+918570844867&text=Cobra%20Bhai%20Apna%20Time%20Table%20aur%20Rate%20Card%20Bhejiye%20Payment%20Kaise%20Karna%20Hai.">
                  <button
                    style={{
                      height: "40px",
                      width: "260px",
                      "background-color": "green",
                      color: "#FFF",
                      border: "solid 1px white",
                      "border-radius": "20px",
                    }}
                  >
                    <font size="4px">
                      <b>WHATSAPP CHAT</b>
                    </font>
                  </button>
                </a>
              </div>



              <div
                className="panel-footer"
                style={{
                  "-webkit-text-align": "center",
                  "text-align": "center",
                }}
              >
                <style
                  dangerouslySetInnerHTML={{
                    __html: "\n\t\tfont-size: 14px\n\t",
                  }}
                />
                <small>
                  <p />
                  Disclaimer:- PLAYBAZAAR.ONLINE : We Follow All Countries
                  Rules The Site is Only For Entertainment Purposes.{" "}
                  <br /> The Site Does Not Promote any Betting Activity.
                  People From Countries Where Gambling is Banned Should
                  Block Our Site immediately.
                  <br /> If you are Not Agreed/satisfied With Our Terms
                  &amp; Conditions Please Quit Right Now. PLAYBAZAAR.ONLINE
                  All Rights Reserved Thank you.*{" "}
                </small>{" "}
                <p />
              </div>
            </div>
          </div>

        </div>
      </div>
       {/* Modal for Login */}
       <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Login Modal"
        className="login-modal"
        overlayClassName="login-modal-overlay"
      >
        <h2>Login</h2>
        <p>Please log in with your email and password.</p>
        
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message if there's one */}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Capture email input
          className="form-control"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Capture password input
          className="form-control"
          style={{ marginTop: "10px" }}
        />
        
        <button onClick={handleLogin} className="btn btn-primary" style={{ marginTop: "10px" }}>
          Login with Email
        </button>
        <button onClick={closeModal} className="btn btn-secondary" style={{ marginTop: "10px" }}>
          Cancel
        </button>
      </Modal>
    </div>
  );
}

export default App;