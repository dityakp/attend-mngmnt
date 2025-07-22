const mysql = require('mysql2');

// Configure connection parameters
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root', // Your MySQL username
  password: 'Aditya@310504',
  database: 'attend-mngmt'
});

// Connect to MySQL
connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

// Example query
connection.query('SELECT NOW() AS currentTime', function (error, results, fields) {
  if (error) throw error;
  console.log('Current time from database:', results[0].currentTime);
});

// Close the connection when done
connection.end();
