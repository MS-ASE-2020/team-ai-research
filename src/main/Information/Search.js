import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Search extends Component {
  render() {
    return (
      <div>
        <input type="text" /> &nbsp;
        <select>
          <option value="1">Name</option>
          <option value="2">Title</option>
          <option value="3">Keywords</option>
        </select> &nbsp;
        <button>Order</button> &nbsp;
        <button>Search</button>
      </div>
    );
  }
}

