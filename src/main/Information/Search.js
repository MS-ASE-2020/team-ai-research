import React, { Component } from "react";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      name: false,
      title: false,
      keywords: false,
      year: false,
      conference: false,
      recursive: false,
      searchItem: []
    };
  }

  handleTextChange(event) {
    const value = event.target.value;
    this.setState({
      text: value
    });
  }

  handleChange(event) {
    const name = event.target.name;
    this.setState({
      [[name]]: !this.state[[name]]
    });
  }

  handleSearch() {
    let searchItem = window.api.database.searchPaperInFolder(window.db, this.props.folderID, {
      pName: this.state.name,
      pTitle: this.state.title,
      pKeywords: this.state.keywords,
      pYear: this.state.year,
      pConference: this.state.conference
    }, this.state.text, this.state.recursive);
    alert(JSON.stringify(searchItem));
  }

  render() {
    return (
      <div>
        <input 
          type="text" 
          style={{width: 500}}
          onChange={this.handleTextChange.bind(this)}
        /> &nbsp;
        <button onClick={() => alert("Placeholder!")}>Order</button> &nbsp;
        <button onClick={this.handleSearch.bind(this)}>Search</button>
        <div>
          Search By: &nbsp;
          <input type="checkbox" name="name" onChange={this.handleChange.bind(this)}/>Name &nbsp;
          <input type="checkbox" name="title" onChange={this.handleChange.bind(this)}/>Title &nbsp;
          <input type="checkbox" name="keywords" onChange={this.handleChange.bind(this)}/>Keywords &nbsp;
          <input type="checkbox" name="year" onChange={this.handleChange.bind(this)}/>Year &nbsp;
          <input type="checkbox" name="conference" onChange={this.handleChange.bind(this)}/>Conference &nbsp;
          Recursive: &nbsp;
          <input type="checkbox" name="recursive" onChange={this.handleChange.bind(this)}/> &nbsp;
        </div>
        &nbsp; 
      </div>
    );
  }
}

