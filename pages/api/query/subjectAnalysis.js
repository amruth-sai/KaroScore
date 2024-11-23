import pool from '../../../utils/db';



export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
     
        const Analysis = `
 SELECT
    TL.QuesSubject,
    TL.QuestionTag,
    COUNT(R.questionresult) AS TotalQuestions,
    SUM(CASE WHEN R.questionresult = TRUE THEN 1 ELSE 0 END) AS CorrectAnswers,
    SUM(CASE WHEN R.questionresult = FALSE THEN 1 ELSE 0 END) AS IncorrectAnswers,
    ROUND(SUM(CASE WHEN R.questionresult = TRUE THEN 1 ELSE 0 END) * 100.0 / COUNT(R.questionresult), 2) AS PercentageCorrect
FROM
    Result R
JOIN
    TestLines TL ON R.test_id = TL.Testid AND R.questionno = TL.Quesno
JOIN
    Student S ON R.student_id = S.student_id
WHERE
    R.student_id = ?
    AND R.test_id = ?
GROUP BY
    TL.QuesSubject,
    TL.QuestionTag;
`;

      // Query the database for all students
      const [rows] = await pool.query(Analysis, [req.query.student_id, req.query.test_id]);
      // Check if there are students in the database
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No students found' });
      }

      // Return the list of students
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
