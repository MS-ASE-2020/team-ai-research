import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';

console.log(window.api)
console.log(window.ipcRenderer)

let db = window.api.database.connect();
console.log(db);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
