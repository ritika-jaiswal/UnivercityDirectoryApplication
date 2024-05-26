import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js'; // Import html2pdf library
import ChartContainer from './components/ChartContainer';
import CountrySelect from './components/CountrySelect';
import UniversityTable from './components/UniversityTable';
import { jsPDF } from 'jspdf';
import './App.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const App = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [universities, setUniversities] = useState([]);
  const [statesData, setStatesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:4000/countries')
      .then(response => {
        if (Array.isArray(response.data)) {
          setCountries(response.data);
        } else if (response.data && response.data.countries) {
          setCountries(response.data.countries);
        } else {
          console.error("Invalid data format for countries:", response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the countries!", error);
        setLoading(false); 
      });
  
    fetchUniversities('India');
  }, []);

  const fetchUniversities = (country) => {
    axios.get(`http://universities.hipolabs.com/search?country=${country}`)
      .then(response => {
        setUniversities(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the universities!", error);
      });
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    fetchUniversities(country);
  };

  const downloadPDF = () => {
    // Create a new jsPDF instance
    const pdf = new jsPDF();
  
    // Get the app-content element
    const element = document.getElementById('app-content');
  
    // Use html2canvas to capture the content of the element
    html2canvas(element).then(canvas => {
      // Convert canvas to base64 image data
      const imgData = canvas.toDataURL('image/png');
  
      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
  
      // Save the PDF
      pdf.save('university_directory.pdf');
    });
  };

  useEffect(() => {
    if (countries.length > 0) {
      const selected = countries.find(c => c.countryName === selectedCountry);
      const states = selected ? selected.states : [];
      setStatesData(states);
    }
  }, [selectedCountry, countries]);
  
  useEffect(() => {
    if (universities && universities.length > 0 && countries.length > 0) {
      const selected = countries.find(c => c.countryName === selectedCountry);
      const states = selected ? selected.states : [];
      setStatesData(states);
    }
  }, [universities, countries, selectedCountry]);
  
  const barChartData = {
    labels: statesData?.map(state => state.stateName) || [],
    datasets: [
      {
        label: 'Number of Universities',
        data: statesData?.map(state => universities.filter(uni => uni.name.includes(state.stateName)).length) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }
    ]
  };

  const pieChartData = {
    labels: statesData?.map(state => state.stateName) || [],
    datasets: [
      {
        label: 'Percentage Share',
        data: statesData?.map(state => universities.filter(uni => uni.name.includes(state.stateName)).length) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ]
      }
    ]
  };

  return (
    <div id="app-content" className="App"> {/* Add an id to the container */}
      <h1>University Directory</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <CountrySelect 
            countries={countries}
            selectedCountry={selectedCountry}
            handleCountryChange={handleCountryChange}
          />
          <UniversityTable universities={universities} />
          <ChartContainer 
            barChartData={barChartData} 
            pieChartData={pieChartData} 
          />
          <button onClick={downloadPDF}>Download Charts as PDF</button>
        </>
      )}
    </div>
  );
};

export default App;
