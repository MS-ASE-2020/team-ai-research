import React, { Component } from "react";
// import "./App.css";

export default class NavBar extends Component {
  render() {
    const nav_items = this.props.items.map((item, index) => (
      <div className="nav-item" key={item.id} onClick={() => this.props.onClick(index)}>
        <div className="nav-item__icon">
          <i className={"fas fa-" + item.icon} />
        </div>
        <div className="nav-item__title">{item.title}</div>
      </div>
    ));

    return (
      <div id="NavBar" className="navbar">
        {nav_items}
      </div>
    );
  }
}
