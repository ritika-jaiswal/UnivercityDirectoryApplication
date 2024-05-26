import React, { useState, useEffect } from 'react';
import '../App.css';

const UniversityTable = ({ universities }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [universitiesPerPage] = useState(10);
  const [maxPageNumbersToShow] = useState(10);

  const indexOfLastUniversity = currentPage * universitiesPerPage;
  const indexOfFirstUniversity = indexOfLastUniversity - universitiesPerPage;
  const currentUniversities = universities.slice(indexOfFirstUniversity, indexOfLastUniversity);

  const totalPages = Math.ceil(universities.length / universitiesPerPage);
  const pageNumbers = [...Array(totalPages).keys()].map(i => i + 1);

  const getVisiblePageNumbers = () => {
    const half = Math.floor(maxPageNumbersToShow / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxPageNumbersToShow - 1);

    if (end - start < maxPageNumbersToShow - 1) {
      start = Math.max(1, end - maxPageNumbersToShow + 1);
    }

    return pageNumbers.slice(start - 1, end);
  };

  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Call useEffect unconditionally at the top level
  useEffect(() => {
    setCurrentPage(1);
  }, [universities]);

  return (
    <div className="university-table-container">
      <table className="university-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>University Name</th>
            <th>Country</th>
            <th>Website</th>
          </tr>
        </thead>
        <tbody>
          {currentUniversities.map((university, index) => (
            <tr key={index}>
              <td>{indexOfFirstUniversity + index + 1}</td>
              <td>{university.name}</td>
              <td>{university.country}</td>
              <td><a href={university.web_pages[0]} target="_blank" rel="noopener noreferrer">{university.web_pages[0]}</a></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button 
          onClick={() => paginate(Math.max(1, currentPage - 1))} 
          className="page-button"
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {getVisiblePageNumbers().map(number => (
          <button 
            key={number} 
            onClick={() => paginate(number)} 
            className={`page-button ${number === currentPage ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
        <button 
          onClick={() => paginate(Math.min(totalPages, currentPage + 1))} 
          className="page-button"
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default UniversityTable;
