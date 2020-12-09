import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: false,
      title: false,
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
        <input type="text" style={{width: 500}}/> &nbsp;
        <button>Order</button> &nbsp;
        <button onClick={() => alert(JSON.stringify(this.state))}>Search</button>
        <div>
          Search By: &nbsp;
          <input type="checkbox" name="name" onChange={this.handleChange.bind(this)}/>Name &nbsp;
          <input type="checkbox" name="title" onChange={this.handleChange.bind(this)}/>Title &nbsp;
          <input type="checkbox" name="keywords" onChange={this.handleChange.bind(this)}/>Keywords &nbsp;
          <input type="checkbox" name="year" onChange={this.handleChange.bind(this)}/>Year &nbsp;
          <input type="checkbox" name="conference" onChange={this.handleChange.bind(this)}/>Conference &nbsp;
        </div>
        &nbsp; 
      </div>
    );
  }
}

