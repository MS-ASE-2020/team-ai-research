import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: "name"
    };
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({
      sortKey: value
    });
  }

  render() {
    return (
      <div>
        <input type="text" /> &nbsp;
        Search By:
        <input type="checkbox" value="title" />title
        <input type="checkbox" value="content" />content
        <input type="checkbox" value="keywords" />keywords
        
        <button>Order</button> &nbsp;
        <button onClick={() => alert(this.state.sortKey)}>Search</button>
      </div>
    );
  }
}

