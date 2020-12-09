import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: false,
      content: false,
      keywords: false,
      year: false,
      conference: false 
    };
  }

  handleChange(event) {
    const name = event.target.name;
    this.setState({
      [[name]]: !this.state[[name]]
    });
  }

  render() {
    return (
      <div>
        <input type="text" /> &nbsp;
        Search By:
        <input type="checkbox" name="title" onChange={this.handleChange.bind(this)}/>Name
        <input type="checkbox" name="content" onChange={this.handleChange.bind(this)}/>Title
        <input type="checkbox" name="keywords" onChange={this.handleChange.bind(this)}/>Keywords
        <input type="checkbox" name="year" onChange={this.handleChange.bind(this)}/>Year
        <input type="checkbox" name="conference" onChange={this.handleChange.bind(this)}/>Conference
        &nbsp;
        <button>Order</button> &nbsp;
        <button onClick={() => alert(JSON.stringify(this.state))}>Search</button>
      </div>
    );
  }
}

