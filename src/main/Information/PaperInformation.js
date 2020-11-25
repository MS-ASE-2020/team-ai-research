import React, { Component } from "react";
import PropTypes from "prop-types";

/**
 * 
 * @param {String} keywords 
 * @returns {Array<String>}
 */
function getKeywordArray(keywords) {
  let keywordArray = keywords.split(";");
  keywordArray.pop();
  return keywordArray;
}

/**
 * 
 * @param {Array<String>} keywords
 * @returns {String}
 */
function getKeywordString(keywords) {
  let keywordArray = keywords;
  keywords.push("");
  return keywords.join(";");
}

export default class PaperInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modify: false,
      paper: this.getPaper(props.choosePaper),
      //keywords: this.getPaper(props.choosePaper).keywords === "" ? 
      //  [] : this.getPaper(props.choosePaper).keywords.split(",")
    };
    this.handleChanges = this.handleChanges.bind(this);
    this.handleKeywords = this.handleKeywords.bind(this);
  }

  getPaper(paperID) {
    return window.api.database.getPaperProperty(window.db, paperID);
  }

  operation(act) {
    switch (act) {
    case 'open':
      alert("Placeholder!");
      break;
    case 'edit': 
      this.setState({
        modify: true
      });
      break;
    case 'cancel': 
      this.setState({
        modify: false,
        paper: this.getPaper(this.props.choosePaper),
        //keywords: this.getPaper(this.props.choosePaper).keywords.split(",")
      });
      break;
    case 'save':
      try {
        window.api.database.savePaper(window.db, {
          ID: this.props.choosePaper,
          name: this.state.paper.name,
          title: this.state.paper.title,
          keywords: this.state.paper.keywords,
          year: this.state.paper.year,
          conference: this.state.paper.conference,
          QandA: this.state.paper.QandA,
          annotations: this.state.paper.annotations
        });
        alert("Successfully edit the information of paper!");
        this.props.setChoosePaper(this.props.choosePaper);
        this.setState({
          modify: !this.state.modify,
          paper: this.getPaper(this.props.choosePaper)
        });
      } catch (error) {
        console.error(error);
        alert("Fail to edit!");
      }
      break;
    case 'delete':
      if (window.confirm("Are you surely want to delete this paper?")) {
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
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let copy = { ...this.state.paper };
    copy[[name]] = value;
    
    this.setState({
      paper: copy,
    });
  }

  handleKeywords(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const index = event.target.getAttribute("data-index");

    let copy = getKeywordArray(this.state.paper.keywords);
    copy[[index]] = value;
    
    let paperCopy = {...this.state.paper};
    paperCopy.keywords = getKeywordString(copy);
    this.setState({
      paper: paperCopy
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // TODO: https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops
    this.setState({ 
      paper: this.getPaper(nextProps.choosePaper),
      modify: false 
    });
  }

  removeKeyword(k) {
    let newKeywords = getKeywordArray(this.state.paper.keywords);
    newKeywords.splice(k, 1);
    let paperCopy = {...this.state.paper};
    paperCopy.keywords = getKeywordString(newKeywords);
    this.setState({
      paper: paperCopy
    });
  }

  addKeywords() {
    let newKeywords = getKeywordArray(this.state.paper.keywords);
    newKeywords.splice(newKeywords.length, 0, "");
    let paperCopy = {...this.state.paper};
    paperCopy.keywords = getKeywordString(newKeywords);
    this.setState({
      paper: paperCopy
    });
  }

  render() {
    let keywordItem = [];
    let keywords = getKeywordArray(this.state.paper.keywords);
    for (let k = 0; k < keywords.length; k++) {
      keywordItem.push(( this.state.modify ? 
        <input
          id="PaperKeywords" 
          type="text" 
          data-index={k}
          value={keywords[k]} 
          onChange={this.handleKeywords} 
          placeholder="New Keyword" 
          required="required" /> :         
        keywords[k] + (k === keywords.length-1 ? ". " : "; ")
      ));
      if (this.state.modify) {
        keywordItem.push((
          <input 
            id="PaperKeywordsRemove" 
            type="button" 
            value="×" 
            onClick={() => this.removeKeyword(k)}/>
        ));
      }
    }
    if (this.state.modify) {
      keywordItem.push((
        <input 
          id="PaperKeywordsAdd" 
          type="button" 
          value="+" 
          onClick={() => this.addKeywords()}/>
      ));
    }
    return (
      <div className="PaperInformation">
        <h3>Paper Information</h3>
        <form>
          <div className="PaperName">
            <label>Name: </label>
              {this.state.modify ?  
                <input 
                  id="PaperName" 
                  type="text" 
                  value={this.state.paper.name} 
                  name="name" 
                  onChange={this.handleChanges} /> : this.state.paper.name}
          </div>
          <div className="PaperTitle">
            <label>Title: </label>
              {this.state.modify ? 
                <input 
                  id="PaperTitle" 
                  type="text" 
                  name="title" 
                  value={this.state.paper.title} 
                  onChange={this.handleChanges} /> : this.state.paper.title}
          </div>
          <div className="PaperKeywords">
            <label>Keywords: </label>
              {keywordItem}
          </div>
          <div className="PaperYear">
            <label>Year: </label>
              {this.state.modify ? 
                <input 
                  id="PaperYear" 
                  type="text" 
                  name="year" 
                  value={this.state.paper.year} 
                  onChange={this.handleChanges} 
                  disabled={!this.state.modify} /> : this.state.paper.year}
          </div>
          <div className="PaperConference">
            <label>Conference: </label>
              {this.state.modify ? 
                <input 
                  id="PaperConference" 
                  type="text" 
                  name="conference" 
                  value={this.state.paper.conference} 
                  onChange={this.handleChanges} 
                  disabled={!this.state.modify} /> : this.state.paper.conference}
          </div>
          <div className="PaperLastEdit">
            <label>Last Edit: </label>
              {this.state.paper.lastedit} 
          </div>
          <div className="Operations">
            {!this.state.modify ? 
              <div className="InformationEditFalse">
                <input type="button" value="Open" onClick={() => this.operation("open")} />
                <input type="button" value="Edit" onClick={() => this.operation("edit")} />
                <input type="button" value="Delete" onClick={() => this.operation("delete")} />
              </div> :
              <div className="InformationEditTrue">
                <input type="button" value="Open" disabled />
                <input type="button" value="Save" onClick={() => this.operation("save")} />
                <input type="button" value="Cancel" onClick={() => this.operation("cancel")} />
              </div>
            }
          </div>
        </form>
      </div>
    );
  }
}

PaperInformation.propTypes = {
  choosePaper: PropTypes.number.isRequired,
  setChoosePaper: PropTypes.func.isRequired,
  cleanInfoZone: PropTypes.func.isRequired,
};

