import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SaveDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      title: "",
      keywordList: [], // Array of String
      year: "",
      conference: "",
      libraries: [], // Array of {ID: Number, name: String}
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
      keywordList: newKeywords
    });
  }

  addKeyword() {
    let newKeywords = this.state.keywordList.slice();
    newKeywords.splice(newKeywords.length, 0, "");
    this.setState({
      keywordList: newKeywords
    });
  }

  removeLibrary(k) {
    let newLibrary = this.state.libraries.slice();
    newLibrary.splice(k, 1);
    this.setState({
      libraries: newLibrary
    });
  }

  addLibrary() {

  }

  render() {
    let keywordItem = this.state.keywordList.map((keyword, index) =>
      <span key={index} data-index={index}>
        <input
          id="PaperKeywords"
          type="text"
          name="keywords"
          value={keyword}
          onChange={this.handleKeywordChange.bind(this)} 
          placeholder="New Keyword" 
          required />
        <input
          id="PaperKeywordsRemove"
          type="button"
          value="×"
          onClick={() => this.removeKeyword(index)} />
      </span>
    );
    keywordItem.push(
      <span key="+">
        <input
          id="PaperKeywordAdd"
          type="button"
          value="+"
          onClick={() => this.addKeyword()}
        />
      </span>
    );

    let libraryList = this.state.libraries.map(x => x.name);
    let libraryItem = libraryList.map((library, index) =>
      <span key={index}>
        <input
          id="PaperLibrary"
          type="text"
          name="library"
          value={library}
          disabled
        />
        <input
          id="PaperLibraryRemove"
          type="button"
          value="×"
          onClick={() => this.removeLibrary(index)}
        />
      </span>
    );
    libraryItem.unshift(
      <span key="/All papers/">
        <input
          id="PaperLibrary"
          type="text"
          name="library"
          value="/All papers/"
          disabled
        />
      </span>
    );
    libraryItem.push(
      <span key="+">
        <input
          id="PaperLibrary"
          type="button"
          value="+"
          onClick={() => this.addLibrary()}
        />
      </span>
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
                  this.state.libraries.map(x => x.ID)
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
      </div>
    );
  }
}

SaveDialog.propTypes = {
  save: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  info: PropTypes.object,
};
