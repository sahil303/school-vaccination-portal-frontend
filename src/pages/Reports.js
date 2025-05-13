import React, {useEffect, useState, useRef } from 'react';
import { API_ENDPOINTS } from '../apiConfig';
import axios from 'axios';
import '../styles/reports.css';
import Sidebar from '../components/Sidebar';
import { CSVLink } from 'react-csv';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';


function Reports() {
    const [reports, setReports] = useState([]);
  const [vaccineFilter, setVaccineFilter] = useState('');

  useEffect(() => {
    // Fetch report data from API
    fetch('/api/vaccination-reports')
      .then(response => response.json())
      .then(data => setReports(data));
  }, []);

  const filteredReports = reports.filter(report =>
    vaccineFilter ? report.vaccineName === vaccineFilter : true
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Name', 'Vaccine Name', 'Date', 'Status']],
      body: filteredReports.map(report => [
        report.studentName,
        report.vaccineName,
        report.vaccinationDate,
        report.vaccinationStatus,
      ]),
    });
    doc.save('vaccination-report.pdf');
  }

    return (
    <div className="reports" role="main" aria-label="Reports">
      <Sidebar/>
      <main className="content" aria-label="Reports content">
        <header className="header">
          <h1 className="header-title">School Vaccination Reports</h1>
        </header>
        <section>
           <div>
      <select value={vaccineFilter} onChange={e => setVaccineFilter(e.target.value)}>
        <option value="">All Vaccines</option>
        <option value="Covishield">Covishield</option>
        <option value="Covaxin">Covaxin</option>
        {/* Add more options as needed */}
      </select>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Vaccine Name</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map(report => (
            <tr key={report.id}>
              <td>{report.studentName}</td>
              <td>{report.vaccineName}</td>
              <td>{report.vaccinationDate}</td>
              <td>{report.vaccinationStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <CSVLink data={filteredReports} filename="vaccination-report.csv">
        Download CSV
      </CSVLink>
      <button onClick={handleDownloadPDF}>Download PDF</button>
    </div>
        </section>
        <section>
        </section>
      </main>
    </div>
  );
  }
  export default Reports;
  