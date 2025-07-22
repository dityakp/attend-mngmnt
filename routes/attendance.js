const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// Mark attendance (employees only)
router.post('/mark', authenticateToken, async (req, res) => {
  if (req.user.role !== 'employee') return res.status(403).json({ message: 'Unauthorized' });

  const { status } = req.body; // 'present', 'absent', 'leave'
  const date = new Date().toISOString().slice(0, 10);
  try {
    await pool.query(
      `INSERT INTO attendance (user_id, date, status) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status)`,
      [req.user.id, date, status]
    );
    res.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// View own attendance (employees)
router.get('/my', authenticateToken, async (req, res) => {
  if (req.user.role !== 'employee') return res.status(403).json({ message: 'Unauthorized' });
  try {
    const [rows] = await pool.query('SELECT date, status FROM attendance WHERE user_id = ?', [req.user.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// View all attendance (managers)
router.get('/all', authenticateToken, async (req, res) => {
  if (req.user.role !== 'manager') return res.status(403).json({ message: 'Unauthorized' });
  try {
    const [rows] = await pool.query(
      `SELECT a.id, u.name, u.email, a.date, a.status
       FROM attendance a
       JOIN users u ON a.user_id = u.id
       ORDER BY a.date DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
