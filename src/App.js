import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.scss";
import NavBar from "./main/NavBar";
import FileManager from "./main/File";
import Reader from "./main/Reader";
import Bookmarks from "./main/Bookmarks";
import Sharing from "./main/Sharing";

const CONTENT_TABS = [
  {
    id: "file",
    title: "File",
    icon: "list",
    component: FileManager,
  },
  {
    id: "reader",
    title: "Reader",
    icon: "book-reader",
    component: Reader,
  },
  {
    id: "bookmarks",
    title: "Library",
    icon: "briefcase",
    component: Bookmarks,
  },
  {
    id: "sharing",
    title: "Share",
    icon: "chart-network",
    component: Sharing,
  },
  {
    id: "debug",
    title: "Debug",
    icon: "bug",
    component: Sharing,
  },
];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      versions: window.api.version_info,
      openFile: null,
    };
  }

  handleOpenFile(file) {
    this.setState({
      openFile: file,
    });
    this.handleSwitchTab(1);
  }

  handleSwitchTab(tab) {
    this.setState({
      activeTab: tab,
    });
  }

  render() {
    // const ActiveComponent = CONTENT_TABS[this.state.activeTab].component;
    const data = {
      openFile: this.state.openFile,
    };
    const actions = {
      openFile: this.handleOpenFile.bind(this),
    };
    let components = [];
    for (let i = 0; i < CONTENT_TABS.length; i++) {
      const TheComponent = CONTENT_TABS[i].component;

      components.push(
        <div key={i} className={i === this.state.activeTab ? "absolute" : "d-none"}>
          <TheComponent versions={this.state.versions} data={data} actions={actions} />
        </div>
      );
    }
    return (
      <div id="App" className="App">
        <NavBar items={CONTENT_TABS} active={this.state.activeTab} onClick={(tab) => this.handleSwitchTab(tab)} />
        <div id="main" className="main">
          {components}
        </div>
      </div>
    );
  }
}
