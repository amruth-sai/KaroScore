
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AnalysisPage = () => {
  const [studentId, setStudentId] = useState("");
  const [testId, setTestId] = useState("");
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchAnalysis = async () => {
    if (!studentId || !testId) {
      setError("Please provide both Student ID and Test ID.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/query/student?student_id=${studentId}&test_id=${testId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setAnalysisData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAnalysis();
  };

  return (
    <div className="container">
      <h1>Student Test Analysis</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Student ID:
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </label>
        <label>
          Test ID:
          <input
            type="text"
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
            required
          />
        </label>
        <button type="submit">Fetch Analysis</button>
      </form>
      {loading && <p>Loading analysis...</p>}
      {error && <p className="error">Error: {error}</p>}
      {analysisData && analysisData.length > 0 && (
        <table className="analysis-table">
          <thead>
            <tr>
              <th>Question Tag</th>
              <th>Total Questions</th>
              <th>Correct Answers</th>
              <th>Incorrect Answers</th>
              <th>Percentage Correct</th>
            </tr>
          </thead>
          <tbody>
            {analysisData.map((row, index) => (
              <tr key={index}>
                <td>{row.QuestionTag}</td>
                <td>{row.TotalQuestions}</td>
                <td>{row.CorrectAnswers}</td>
                <td>{row.IncorrectAnswers}</td>
                <td>{row.PercentageCorrect}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {analysisData && analysisData.length === 0 && (
        <p>No analysis data found for the provided Student ID and Test ID.</p>
      )}
      <style jsx>{`
        .container {
          padding: 20px;
        }
        .form {
          margin-bottom: 20px;
        }
        .form label {
          display: block;
          margin-bottom: 10px;
        }
        .form input {
          margin-left: 10px;
          padding: 5px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .form button {
          margin-top: 10px;
          padding: 5px 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .form button:hover {
          background-color: #0056b3;
        }
        .analysis-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .analysis-table th,
        .analysis-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .analysis-table th {
          background-color: #f2f2f2;
        }
        .error {
          color: red;
        }
      `}</style>
    </div>
  );
};

export default AnalysisPage;
