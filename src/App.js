import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      versions: window.api.getVersions()
    }
  }

  render() {
    return (
      <div id="App" className="App">
        <h1>Hello World!</h1>
        We are using node {this.state.versions.node},<br />
        Chrome {this.state.versions.chrome},<br />
        and Electron {this.state.versions.electron}.
      </div>
    );
  }
}

export default App;
