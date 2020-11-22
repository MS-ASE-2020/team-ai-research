import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SaveDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      title: "",
      keywords: "",
      year: "",
      conference: "",
      library: "",
      keywordslist: [],
      librarylist: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeywords = this.handleKeywords.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    let value = target.value;
    const name = target.name;

    if (name === "year") {
      value = parseInt(value);
    }

    this.setState({
      [name]: value,
    });
  }

  handleKeywords(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const index = event.target.getAttribute("data-index");

    let copy = this.state.keywordslist.slice();
    copy[[index]] = value;

    this.setState({
      keywordslist: copy,
    });
  }

  removeKeyword(k) {
    let newKeywords = this.state.keywordslist.slice();
    newKeywords.splice(k, 1);
    this.setState({
      keywordslist: newKeywords
    });
  }

  addKeywords() {
    let newKeywords = this.state.keywordslist.slice();
    newKeywords.splice(newKeywords.length, 0, "New Keyword");
    this.setState({
      keywordslist: newKeywords
    });
  }

  handleLibrary(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const index = event.target.getAttribute("data-index");

    let copy = this.state.librarylist.slice();
    copy[[index]] = value;

    this.setState({
      librarylist: copy,
    });
  }

  removeLibrary(k) {
    let newLibrary = this.state.librarylist.slice();
    newLibrary.splice(k, 1);
    this.setState({
      librarylist: newLibrary
    });
  }

  render() {
    let keywordItem = [];
    for (let k = 0; k < this.state.keywordslist.length; k++) {
      keywordItem.push(
        <input
          id="PaperKeywords"
          type="text"
          data-index={k}
          value={this.state.keywordslist[k]}
          onChange={this.handleKeywords} />
      );
      keywordItem.push((
        <input
          id="PaperKeywordsRemove"
          type="button"
          value="×"
          onClick={() => this.removeKeyword(k)} />
      ));
    }
    keywordItem.push((
      <input
        id="PaperKeywordsAdd"
        type="button"
        value="+"
        onClick={() => this.addKeywords()} />
    ));
    let libraryItem = [];
    libraryItem.push((
      <input
        id="PaperLibrary"
        type="button"
        value="/All Articles/" />
    ));
    for (let k = 0; k < this.state.librarylist.length; k++) {
      libraryItem.push(
        <input
          id="PaperLibrary"
          type="button"
          data-index={k}
          value={this.state.librarylist[k]}
          onChange={this.handleLibrary} />
      );
      libraryItem.push((
        <input
          id="PaperKeywordsRemove"
          type="button"
          value="×"
          onClick={() => this.removeLibrary(k)} />
      ));
    }
    libraryItem.push(
      <input
        id="PaperLibrary"
        type="button"
        value="+" />
    );
    return (
      <div className="save-wrapper">
        <div className="save-dialog">
          <div className="row">
            <div className="save-label">Name</div>
            <input
              className="save-input"
              name="name"
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="row">
            <div className="save-label">Title</div>
            <input
              className="save-input"
              name="title"
              value={this.state.title}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="row">
            <div className="save-label">Keywords</div>
            {keywordItem}
          </div>
          <div className="row">
            <div className="save-label">Year</div>
            <input
              className="save-input"
              name="year"
              type="number"
              value={this.state.year}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="row">
            <div className="save-label">Conference</div>
            <input
              className="save-input"
              name="conference"
              value={this.state.conference}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="row">
            <div className="save-label">Library</div>
            {libraryItem}
          </div>
          <div className="row actions mx-auto">
            <button
              className="btn"
              onClick={() => {
                this.setState({
                  keywords: this.state.keywordslist.join(",")
                });
                this.props.save(
                  this.props.info.ID,
                  this.state.name,
                  this.state.title,
                  this.state.keywords,
                  this.state.year,
                  this.state.conference,
                  this.state.library,
                  this.props.info.annotations
                );
              }
              }
            >
              Save
            </button>
            <button className="btn" onClick={() => this.props.close()}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

SaveDialog.propTypes = {
  save: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  info: PropTypes.object,
};
