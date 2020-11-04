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
    title: "Read",
    icon: "folder-open",
    component: Reader,
  },
  {
    id: "bookmarks",
    title: "Bookmarks",
    icon: "briefcase",
    component: Bookmarks,
  },
  {
    id: "sharing",
    title: "Share",
    icon: "chart-network",
    component: Sharing,
  },
];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      versions: window.version_info,
      openFile: null,
    };
  }

  onOpenFile(file) {
    this.setState({
      openFile: file,
    });
    this.switchToTab(1);
  }

  onSwitchTab(tab) {
    this.setState({
      activeTab: tab
    });
  }

  render() {
    const ActiveComponent = CONTENT_TABS[this.state.activeTab].component;
    const data = {
      openFile: this.state.openFile,
    };
    const actions = {
      openFile: f => this.onOpenFile(f),
    };
    return (
      <div id="App" className="App">
        <NavBar items={CONTENT_TABS} active={this.state.activeTab} onClick={(tab) => this.onSwitchTab(tab)}/>
        <div id="main" className="main">
          <ActiveComponent versions={this.state.versions} data={data} actions={actions} />
      </div>
    );
  }
}
