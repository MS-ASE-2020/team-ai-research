import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';

// db init
const db = window.api.database.connect();
console.log(db);
window.db = db;  // let db in global for now.

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
