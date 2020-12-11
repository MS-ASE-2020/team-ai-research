import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';

// db init
const db = window.api.database.connect(window.api.userDataDir);
window.api.filesystem.init(window.api.userDataDir);
window.db = db;  // let db in global for now.

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
