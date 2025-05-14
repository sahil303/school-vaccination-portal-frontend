import React, {useEffect, useState, useRef } from 'react';
import { API_ENDPOINTS } from '../apiConfig';
import axios from 'axios';
import '../styles/reports.css';
import Sidebar from '../components/Sidebar';
import { utils, writeFile } from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


function Reports() {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({ vaccine_name: '', student_class: '', page: 1 });
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchReports = async () => {
    const response = await axios.get(API_ENDPOINTS.GENERATE_VACCINATION_REPORT, {
      params: { ...filters, limit }
    });
    setReports(response.data.data);
    setTotal(response.data.total);
  };

  useEffect(() => { fetchReports(); }, [filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const nextPage = () => {
    if (filters.page * limit < total)
      setFilters({ ...filters, page: filters.page + 1 });
  };

  const prevPage = () => {
    if (filters.page > 1)
      setFilters({ ...filters, page: filters.page - 1 });
  };

  const downloadExcel = async () => {
    try {
          const res = await axios.get(API_ENDPOINTS.GENERATE_VACCINATION_REPORT, {
      params: { ...filters, page: 1, limit: 1000 }
    });

    const data = res.data.data.map(r => ({
      'Student ID': r.student_id,
      Name: r.name,
      Class: r.student_class,
      Vaccinated: r.vaccinated ? 'Yes' : 'No',
      'Vaccine Name': r.vaccine_name,
      'Vaccination Date': new Date(r.vaccination_date).toLocaleDateString()
    }));
      
        const sheet = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, sheet, 'Report');
    writeFile(wb, 'Vaccination_Report.xlsx');

    } catch (error) {
         alert('Excel export failed.');
    alert(error);
    console.error(error); 
    }
  }

const downloadPDF = async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.GENERATE_VACCINATION_REPORT, {
      params: { ...filters, page: 1, limit: 1000 }
    });

    const data = res.data.data;

    const doc = new jsPDF();
    doc.text('Vaccinated Students Report', 14, 16);

    const tableData = data.map((r) => [
      r.student_id,
      r.name,
      r.student_class,
      r.vaccine_name,
      new Date(r.vaccination_date).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [['Student ID', 'Name', 'Class', 'Vaccine', 'Date']],
      body: tableData,
      startY: 20,
    });

    doc.save('Vaccination_Report.pdf');
  } catch (err) {
    alert('PDF export failed.');
    alert(err);
    console.error(err);
  }
}



    return (
    <div className="reports" role="main" aria-label="Reports">
      <Sidebar/>
      <main className="content" aria-label="Reports content">
        <header className="header">
          <h1 className="header-title">School Vaccination Reports</h1>
        </header>
        <section>
              <div className="reports-container">
              <div className="filters">
              <input name="vaccine_name" placeholder="Vaccine Name" value={filters.vaccine_name} onChange={handleChange} />
              <input name="student_class" placeholder="Class" value={filters.student_class} onChange={handleChange} />
            </div>

            <div className="export-buttons">
              <button className="btn export" onClick={downloadExcel}>Download Excel</button>
              <button className="btn export" onClick={downloadPDF}>Download PDF</button>
            </div>


      <table className="reports-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Class</th><th>Vaccine</th><th>Date</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 ? (
            <tr><td colSpan="5">No data</td></tr>
          ) : (
            reports.map(r => (
              <tr key={r.student_id}>
                <td>{r.student_id}</td>
                <td>{r.name}</td>
                <td>{r.student_class}</td>
                <td>{r.vaccine_name}</td>
                <td>{new Date(r.vaccination_date).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={prevPage} disabled={filters.page === 1}>Previous</button>
        <span>Page {filters.page}</span>
        <button onClick={nextPage} disabled={filters.page * limit >= total}>Next</button>
      </div>
    </div>
        </section>
      </main>
    </div>
  );

}
  export default Reports;
  