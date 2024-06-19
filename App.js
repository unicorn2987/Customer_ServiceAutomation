import React, { useState, useEffect } from 'react';
import './App.css';
import Dropdown from './DropDown';
import ClearButton from './ClearButton';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

const App = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [options, setOptions] = useState([]);
  const [response, setResponse] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('http://localhost:5000/chatbot/inputs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        const responseData = data.response;

        const optionsFromAPI = Object.keys(responseData).map((label) => ({
          label: label,
          options: responseData[label].map((option) => ({
            value: option,
            label: option,
          })),
        }));

        setOptions(optionsFromAPI);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleSelect = async (option) => {
    setSelectedOption(option);
    setLoading(true); // Start loading
    try {
      const response = await fetch('http://localhost:5000/chatbot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: option }),
      });
      const data = await response.json();
      const botResponse = data.response;
      const sentiment = data.sentiment;

      setResponse(`Response: ${botResponse}`);
      setSentiment(`Sentiment: ${sentiment}`);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false); // Stop loading
  };

  const handleClear = () => {
    setSelectedOption('');
    setResponse('');
    setSentiment('');
  };

  return (
    <>
   <h1 className="app-header">Customer responses for Fitbit watch</h1>
    <div className="app-container">
      <div className="dropdown-container">
        <Dropdown options={options} selectedOption={selectedOption} onSelect={handleSelect} />
        <p>Selected Option: {selectedOption}</p>
      </div>
      <div className="response-container">
        {loading ? (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
        ) : (
          <>
            <p>{response}</p>
            <p>{sentiment}</p>
            <ClearButton onClick={handleClear} />
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default App;