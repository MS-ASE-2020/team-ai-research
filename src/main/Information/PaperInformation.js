import React, { Component } from "react";
import PropTypes from "prop-types";

export default class PaperInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modify: false,
      paper: this.getPaper(props.choosePaper),
      keywords: this.getPaper(props.choosePaper).keywords.split(","),
    };
    this.handleChanges = this.handleChanges.bind(this);
  }

  getPaper(paperID) {
    return window.api.database.getPaperProperty(window.db, paperID);
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
          paper: this.getPaper(this.props.choosePaper),
          keywords: this.getPaper(this.props.choosePaper).keywords.split(","),
        });
        break;
      case "save":
        try {
          window.api.database.savePaper(window.db, {
            ID: this.props.choosePaper,
            name: this.state.paper.name,
            title: this.state.paper.title,
            keywords: this.state.keywords.join(","),
            year: this.state.paper.year,
            conference: this.state.paper.conference,
            QandA: this.state.paper.QandA,
            annotations: this.state.paper.annotations,
          });
          alert("Successfully edit the information of paper!");
          this.props.setChoosePaper(this.props.choosePaper);
          this.setState({
            modify: !this.state.modify,
            paper: this.getPaper(this.props.choosePaper),
          });
        } catch (error) {
          console.error(error);
          alert("Fail to edit!");
        }
        break;
      case "delete":
        if (window.confirm("Are you surely want to delete this bookmark?")) {
          window.api.database.deletePaper(window.db, this.props.choosePaper);
          alert("Successfully delete the paper!");
          this.props.cleanInfoZone();
        }
        break;
      default:
        console.error("Hit default case");
        return;
    }
  }

  handleChanges(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    let copy = { ...this.state.paper };
    copy[[name]] = value;

    this.setState({
      paper: copy,
    });
  }

  handleKeywords(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const index = target.getAttribute("data-index");

    let copy = this.state.keywords.slice();
    copy[[index]] = value;

    this.setState({
      keywords: copy,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // TODO: https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops
    if (nextProps.choosePaper !== this.props.choosePaper) {
      this.setState({ paper: this.getPaper(nextProps.choosePaper) });
    }
  }

  removeKeyword(k) {
    let newKeywords = this.state.keywords.slice();
    newKeywords.splice(k, 1);
    this.setState({
      keywords: newKeywords,
    });
  }

  addKeywords() {
    let newKeywords = this.state.keywords.slice();
    newKeywords.splice(newKeywords.length, 0, "New Keywords");
    this.setState({
      keywords: newKeywords,
    });
  }

  render() {
    let keywordItem = [];
    for (let k = 0; k < this.state.keywords.length; k++) {
      keywordItem.push(
        this.state.modify ? (
          <input
            id="PaperKeywords"
            type="text"
            name="keywords"
            key={k}
            data-index={k}
            value={this.state.keywords[k]}
            onChange={this.handleKeywords.bind(this)}
          />
        ) : (
          this.state.keywords[k] +
            (k === this.state.keywords.length - 1 ? "" : ", ")
        )
      );
      if (this.state.modify) {
        keywordItem.push(
          <input
            id="PaperKeywordsRemove"
            type="button"
            value="×"
            onClick={() => this.removeKeyword(k)}
          />
        );
      }
    }
    if (this.state.modify) {
      keywordItem.push(
        <input
          id="PaperKeywordsAdd"
          type="button"
          value="+"
          onClick={() => this.addKeywords()}
        />
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
                    onChange={this.handleChanges}
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
                    onChange={this.handleChanges}
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
                    onChange={this.handleChanges}
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
                    onChange={this.handleChanges}
                    disabled={!this.state.modify}
                  />
                ) : (
                  this.state.paper.conference
                )}
              </td>
            </tr>
            <tr>
              <th scope="row">Last Edited</th>
              <td>{this.state.paper.lastedit}</td>
            </tr>
          </tbody>
        </table>
        <div className="Operations">
          <div className="InformationEdit">
            <input
              type="button"
              value="Open"
              onClick={() => this.operation("open")}
              disabled={this.state.modify}
            />
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
        </div>
      </div>
    );
  }
}

PaperInformation.propTypes = {
  choosePaper: PropTypes.number.isRequired,
  setChoosePaper: PropTypes.func.isRequired,
  cleanInfoZone: PropTypes.func.isRequired,
};
