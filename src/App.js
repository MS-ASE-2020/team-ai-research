import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div id="App" class="App">
        <h1>Hello World!</h1>
        We are using node <script>document.write(process.versions.node)</script>,<br />
        Chrome <script>document.write(process.versions.chrome)</script>,<br />
        and Electron <script> document.write(process.versions.electron)</script>.
      </div>
    );
  }
}

export default App;
