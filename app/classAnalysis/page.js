"use client";

import React, { useEffect, useState } from "react";

const ClassAnalysis = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassAnalysis = async () => {
      try {
        const response = await fetch("/api/query/classAnalysis");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassAnalysis();
  }, []);

  if (loading) return <p>Loading class analysis...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      <h1>Class Analysis</h1>
      <table className="analysis-table">
        <thead>
          <tr>
            <th>Class</th>
            <th>Subject</th>
            <th>Question Tag</th>
            <th>Total Questions</th>
            <th>Correct Answers</th>
            <th>Incorrect Answers</th>
            <th>Percentage Correct</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.class}</td>
              <td>{row.QuesSubject}</td>
              <td>{row.QuestionTag}</td>
              <td>{row.TotalQuestions}</td>
              <td>{row.CorrectAnswers}</td>
              <td>{row.IncorrectAnswers}</td>
              <td>{row.PercentageCorrect}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .container {
          padding: 20px;
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
        }
        .analysis-table th {
          background-color: #f2f2f2;
          text-align: left;
        }
      `}</style>
    </div>
  );
};

export default ClassAnalysis;
