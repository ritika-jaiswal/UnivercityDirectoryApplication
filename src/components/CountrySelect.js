import React from 'react';
import '../App.css'; // Import the CSS file

const CountrySelect = ({ countries, selectedCountry, handleCountryChange }) => {
  // Check if countries array is not defined or empty before mapping
  if (!countries || countries.length === 0) {
    return <div className="loading">Loading...</div>; // Render loading indicator
  }

  return (
    <div className="country-select-container">
      <label className="country-select-label" htmlFor="countrySelect">Select Country:</label>
      <select id="countrySelect" className="country-select" value={selectedCountry} onChange={handleCountryChange}>
        {countries.map(country => (
          <option key={country.countryId} value={country.countryName}>
            {country.countryName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelect;
