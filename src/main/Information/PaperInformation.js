import React, { Component } from "react";
import PropTypes from "prop-types";

import SelectFolderDialog from "../reader/SelectFolderDialog";

export default class PaperInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modify: false,
      paper: this.getPaperProperty(props.choosePaper),
      libraries: this.getLibraryOfPaper(props.choosePaper), // array of {ID: Number, name: String}
      libraryDialog: false,
    };
  }

  getPaperProperty(paperID) {
    return window.api.database.getPaperProperty(window.db, paperID);
  }
  getLibraryOfPaper(paperID) {
    return window.api.database.listFolderOfPaper(window.db, paperID);
  }

  operation(act) {
    switch (act) {
      case "open":
        alert("Placeholder!");
        break;
      case "edit":
        this.setState({
          modify: true,
        });
        break;
      case "cancel":
        this.setState({
          modify: false,
          paper: this.getPaperProperty(this.props.choosePaper),
          libraries: this.getLibraryOfPaper(this.props.choosePaper),
        });
        break;
      case "save":
        try {
          window.api.database.savePaper(window.db, {
            ID: this.props.choosePaper,
            name: this.state.paper.name,
            title: this.state.paper.title,
            keywords: this.state.paper.keywords,
            year: this.state.paper.year,
            conference: this.state.paper.conference,
            QandA: this.state.paper.QandA,
            annotations: this.state.paper.annotations,
            content: this.state.paper.content
          });
          window.api.database.saveFolderOfPaper(
            window.db,
            this.props.choosePaper,
            this.state.libraries.map((x) => x.ID)
          );
          alert("Successfully edit the information of paper!");
          this.props.setChoosePaper(this.props.choosePaper);
          this.setState({
            modify: false,
            paper: this.getPaperProperty(this.props.choosePaper),
          });
        } catch (error) {
          console.error(error);
          alert("Fail to edit!");
        }
        break;
      case "delete":
        if (window.confirm("Are you sure you want to delete this paper?")) {
          window.api.database.deletePaper(window.db, this.props.choosePaper);
          alert("Successfully deleted the paper!");
          this.props.clearInfoZone();
        }
        break;
      default:
        console.error("Hit default case");
        return;
    }
  }

  handleChanges(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    let copy = { ...this.state.paper };
    copy[[name]] = value;

    this.setState({
      paper: copy,
    });
  }

  handleKeywordChange(event) {
    const target = event.target;
    const value = target.value;
    const index = target.parentNode.getAttribute("data-index");

    let copy = window.api.database.parseString(this.state.paper.keywords);
    copy[[index]] = value;

    let paperCopy = { ...this.state.paper };
    paperCopy.keywords = window.api.database.stringifyArray(copy);
    this.setState({
      paper: paperCopy,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // TODO: https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops
    this.setState({
      paper: this.getPaperProperty(nextProps.choosePaper),
      modify: false,
      libraries: window.api.database.listFolderOfPaper(
        window.db,
        nextProps.choosePaper
      ),
    });
  }

  removeKeyword(k) {
    let newKeywords = window.api.database.parseString(
      this.state.paper.keywords
    );
    newKeywords.splice(k, 1);
    let paperCopy = { ...this.state.paper };
    paperCopy.keywords = window.api.database.stringifyArray(newKeywords);
    this.setState({
      paper: paperCopy,
    });
  }

  addKeyword() {
    let newKeywords = window.api.database.parseString(
      this.state.paper.keywords
    );
    newKeywords.splice(newKeywords.length, 0, "");
    let paperCopy = { ...this.state.paper };
    paperCopy.keywords = window.api.database.stringifyArray(newKeywords);
    this.setState({
      paper: paperCopy,
    });
  }

  removeLibrary(k) {
    let newLibrary = this.state.libraries.slice();
    newLibrary.splice(k, 1);
    this.setState({
      libraries: newLibrary,
    });
  }

  showSelectFolderDialog() {
    this.setState({
      libraryDialog: true,
    });
  }

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
    let keywordList = window.api.database.parseString(
      this.state.paper.keywords
    );
    let keywordItem = keywordList.map((keyword, index) =>
      this.state.modify ? (
        <span className="input-wrapper" key={index} data-index={index}>
          <span
            id="PaperKeyword"
            name="keyword"
            onChange={this.handleKeywordChange.bind(this)}
            placeholder="New Keyword"
            contentEditable
            required
          >
            {keyword}
          </span>
          <span
            className="btn-remove"
            onClick={() => this.removeKeyword(index)}
          />
        </span>
      ) : (
        <span key={index} data-index={index}>
          <input
            id="PaperKeyword"
            type="text"
            name="keyword"
            value={keyword}
            disabled
          />
        </span>
      )
    );
    if (this.state.modify) {
      keywordItem.push(
        <span className="input-wrapper" key="+">
          <input
            id="PaperKeywordAdd"
            type="button"
            value="+"
            onClick={() => this.showSelectFolderDialog()}
          />
        </span>
      );
    }

    let libraryList = this.state.libraries.map((x) =>
      window.api.database.getFolderPath(window.db, x.ID)
    );
    let libraryItem = libraryList.map((library, index) => (
      <span className="input-wrapper" key={index}>
        <input
          id="PaperLibrary"
          type="text"
          name="library"
          value={library}
          disabled
        />
        {this.state.modify ? (
          <span
            className="btn-remove"
            onClick={() => this.removeLibrary(index)}
          />
        ) : null}
      </span>
    ));
    libraryItem.unshift(
      <span className="input-wrapper" key="/All papers/">
        <input
          id="PaperLibrary"
          type="text"
          name="library"
          value="/All papers/"
          disabled
        />
      </span>
    );
    if (this.state.modify) {
      libraryItem.push(
        <span className="input-wrapper" key="+">
          <input
            id="PaperLibrary"
            type="button"
            value="+"
            onClick={() => this.showSelectFolderDialog()}
          />
        </span>
      );
    }

    return (
      <div className="InfoZone">
        <h2>Paper Information</h2>
        <table className="InfoTable">
          <tbody>
            <tr>
              <th scope="row">Name</th>
              <td>
                {this.state.modify ? (
                  <input
                    id="PaperName"
                    type="text"
                    value={this.state.paper.name}
                    name="name"
                    onChange={this.handleChanges.bind(this)}
                  />
                ) : (
                  this.state.paper.name
                )}
              </td>
            </tr>
            <tr>
              <th scope="row">Title</th>
              <td>
                {this.state.modify ? (
                  <input
                    id="PaperTitle"
                    type="text"
                    name="title"
                    value={this.state.paper.title}
                    onChange={this.handleChanges.bind(this)}
                  />
                ) : (
                  this.state.paper.title
                )}
              </td>
            </tr>
            <tr>
              <th scope="row">Keywords</th>
              <td>{keywordItem}</td>
            </tr>
            <tr>
              <th scope="row">Year</th>
              <td>
                {this.state.modify ? (
                  <input
                    id="PaperYear"
                    type="text"
                    name="year"
                    value={this.state.paper.year}
                    onChange={this.handleChanges.bind(this)}
                    disabled={!this.state.modify}
                  />
                ) : (
                  this.state.paper.year
                )}
              </td>
            </tr>
            <tr>
              <th scope="row">Conference</th>
              <td>
                {this.state.modify ? (
                  <input
                    id="PaperConference"
                    type="text"
                    name="conference"
                    value={this.state.paper.conference}
                    onChange={this.handleChanges.bind(this)}
                    disabled={!this.state.modify}
                  />
                ) : (
                  this.state.paper.conference
                )}
              </td>
            </tr>
            <tr>
              <th scope="row">Libraries</th>
              <td>{libraryItem}</td>
            </tr>
            <tr>
              <th scope="row">Last Edited</th>
              <td>{this.state.paper.lastedit}</td>
            </tr>
          </tbody>
        </table>
        <div className="Operations">
          {!this.state.modify ? (
            <div className="InformationEditFalse">
              <input
                type="button"
                value="Open"
                onClick={() => this.operation("open")}
              />
              <input
                type="button"
                value="Edit"
                onClick={() => this.operation("edit")}
              />
              <input
                type="button"
                value="Delete"
                onClick={() => this.operation("delete")}
              />
            </div>
          ) : (
            <div className="InformationEditTrue">
              <input
                type="button"
                value="Save"
                onClick={() => this.operation("save")}
              />
              <input
                type="button"
                value="Cancel"
                onClick={() => this.operation("cancel")}
              />
            </div>
          )}
        </div>

        <div
          className={
            "select-folder-outer-wrap absolute" + this.state.libraryDialog
              ? ""
              : " d-none"
          }
        >
          <SelectFolderDialog
            extraClasses={this.state.libraryDialog ? "" : " d-none"}
            selectFolderCallback={this.addLibrary.bind(this)}
          />
        </div>
      </div>
    );
  }
}

PaperInformation.propTypes = {
  choosePaper: PropTypes.number.isRequired,
  setChoosePaper: PropTypes.func.isRequired,
  clearInfoZone: PropTypes.func.isRequired,
};
