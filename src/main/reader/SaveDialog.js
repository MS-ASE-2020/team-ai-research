import React, { Component } from "react";
import PropTypes from "prop-types";

import SelectFolderDialog from "./SelectFolderDialog";

export default class SaveDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      title: "",
      keywordList: [], // Array of String
      year: "",
      conference: "",
      libraries: [], // Array of {ID: Number, path: String}, but path is FULL PATH
      libraryDialog: false, // whether the dialog is shown
    };
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

  handleKeywordChange(event) {
    const target = event.target;
    const value = target.value;
    const index = target.parentNode.getAttribute("data-index");

    let copy = this.state.keywordList.slice();
    copy[index] = value;

    this.setState({
      keywordList: copy,
    });
  }

  removeKeyword(k) {
    let newKeywords = this.state.keywordList.slice();
    newKeywords.splice(k, 1);
    this.setState({
      keywordList: newKeywords,
    });
  }

  addKeyword() {
    let newKeywords = this.state.keywordList.slice();
    newKeywords.splice(newKeywords.length, 0, "");
    this.setState({
      keywordList: newKeywords,
    });
  }

  removeLibrary(k) {
    let newLibrary = this.state.libraries.slice();
    newLibrary.splice(k, 1);
    this.setState({
      libraries: newLibrary,
    });
  }

  showAddLibraryDialog() {
    this.setState({
      libraryDialog: true,
    });
  }

  /*
   * Calls with id === null if dialog closed without opening anything
   */
  addLibrary(id, path) {
    if (!id || !path || this.state.libraries.find(x => x.ID === id)) {
      this.setState({
        libraryDialog: false,
      });
      return;
    }
    let newLibrary = this.state.libraries.slice();
    newLibrary.push({ ID: id, path: path });
    this.setState({
      libraries: newLibrary,
      libraryDialog: false,
    });
  }

  render() {
    // (almost) CSS-only auto-width input box
    // Source: https://stackoverflow.com/a/41389961/5958455
    let keywordItem = this.state.keywordList.map((keyword, index) => (
      <span className="tag-container" key={index} data-index={index}>
        <span className="tag-text">{keyword ? keyword : " "}</span>
        <input
          id={"keyword-" + index}
          className="tag-input"
          type="text"
          name="keywords"
          value={keyword}
          onChange={this.handleKeywordChange.bind(this)}
          placeholder="..."
          required
        />
        <span
          id={"keyword-remove-" + index}
          className="tag-remove"
          onClick={() => this.removeKeyword(index)}
        />
      </span>
    ));
    keywordItem.push(
      <span className="tag-container" key="keyword-add">
        <span
          id="keyword-add"
          className="tag-add"
          onClick={() => this.addKeyword()}
        />
      </span>
    );

    let libraryList = this.state.libraries.map((x) => x.path);
    let libraryItem = libraryList.map((library, index) => (
      <span className="tag-container" key={index}>
        <span className="tag-text">{library ? library : " "}</span>
        <input
          id={"library-" + index}
          className="tag-input no-disable"
          type="text"
          name="library"
          value={library}
          disabled
        />
        <span
          id={"library-remove-" + index}
          className="tag-remove"
          onClick={() => this.removeLibrary(index)}
        />
      </span>
    ));
    const libraryAllText = "/All papers/";
    libraryItem.unshift(
      <span className="tag-container fixed" key="all-papers">
        <span className="tag-text">{libraryAllText}</span>
        <input
          id="library-all"
          className="tag-input no-disable"
          type="text"
          name="library"
          value={libraryAllText}
          disabled
        />
      </span>
    );
    libraryItem.push(
      <span className="tag-container" key="library-add">
        <span
          id="library-add"
          className="tag-add"
          onClick={() => this.showAddLibraryDialog()}
        />
      </span>
    );

    return (
      <div className="save-wrapper">
        <div
          className={
            "save-dialog" + (this.state.libraryDialog ? " d-none" : "")
          }
        >
          <div className="row">
            <div className="save-label">Name</div>
            <input
              className="save-input"
              name="name"
              value={this.state.name}
              onChange={this.handleInputChange.bind(this)}
            />
          </div>
          <div className="row">
            <div className="save-label">Title</div>
            <input
              className="save-input"
              name="title"
              value={this.state.title}
              onChange={this.handleInputChange.bind(this)}
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
              onChange={this.handleInputChange.bind(this)}
            />
          </div>
          <div className="row">
            <div className="save-label">Conference</div>
            <input
              className="save-input"
              name="conference"
              value={this.state.conference}
              onChange={this.handleInputChange.bind(this)}
            />
          </div>
          <div className="row">
            <div className="save-label">Library</div>
            {libraryItem}
          </div>
          <div className="row actions mx-auto">
            <button
              className="btn"
              onClick={() =>
                this.props.save(
                  this.props.info.ID,
                  this.state.name,
                  this.state.title,
                  window.api.database.stringifyArray(this.state.keywordList),
                  this.state.year,
                  this.state.conference,
                  this.props.info.QandA,
                  this.props.info.annotations,
                  this.props.info.content,
                  this.state.libraries.map((x) => x.ID)
                )
              }
            >
              Save
            </button>
            <button className="btn" onClick={() => this.props.close()}>
              Cancel
            </button>
          </div>
        </div>

        <SelectFolderDialog
          extraClasses={this.state.libraryDialog ? "" : " d-none"}
          selectFolderCallback={this.addLibrary.bind(this)}
        />
      </div>
    );
  }
}

SaveDialog.propTypes = {
  save: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  info: PropTypes.object,
};
