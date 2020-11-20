import React, { Component } from "react";
import PropTypes from 'prop-types';


// this.props.folderID/forward(newPath,newFolderID)/subfolder

class NewBookmark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: ""
    };
  }

  handleChanges(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [[name]]: value
    });
  }

  stopCreateNewBookmark() {
    this.setState({
      name: "",
      description: ""
    });
    this.props.cleanInfoZone();
  }

  createNewBookmark() {
    try {
      window.api.database.saveFolder(window.db, {
        ID: null,
        name: this.state.name,
        description: this.state.description,
        fatherID: this.props.folderID
      });
      alert("Successfully create the new bookmark!");
      this.stopCreateNewBookmark();
    } catch (error) {
      console.error(error);
      alert("Fail to create!");
    }
  }

  render() {
    return (
      <div className="newBookmark">
        <h3>Create New Bookmark</h3>
        <form>
          <div className="newBookmarkName">
            <label>
              Name: <input id="newBookmarkName" type="text" value={this.state.name} name="name" onChange={this.handleChanges.bind(this)} />
            </label>
          </div>
          <div className="newBookmarkDescription">
            <label>
              Description: <input id="newBookmarkDescription" type="text" value={this.state.description} name="description" onChange={this.handleChanges.bind(this)} />
            </label>
          </div>
          <input type="button" value="Create" onClick={this.createNewBookmark.bind(this)} />
          <input type="button" value="Cancel" onClick={this.stopCreateNewBookmark.bind(this)} />
        </form>
      </div>
    );
  }
}

NewBookmark.propTypes = {
  folderID: PropTypes.number.isRequired,
  cleanInfoZone: PropTypes.func.isRequired,
};

class FolderInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modify: false,
      folder: this.getFolder(props.chooseFolder)
    };
  }

  getFolder(folderID) {
    return window.api.database.getFolderProperty(window.db, folderID);
  }

  operation(act) {
    switch (act) {
    case 'edit': 
      this.setState({
        modify: true
      });
      break;
    case 'cancel': 
      this.setState({
        modify: false,
        folder: this.getFolder(this.props.chooseFolder)
      });
      break;
    case 'save':
      try {
        window.api.database.saveFolder(window.db, {
          ID: this.props.chooseFolder,
          name: this.state.folder.name,
          description: this.state.folder.description,
          fatherID: this.state.folder.fatherID
        });
        alert("Successfully edit the information of bookmark!");
        this.props.setChooseFolder(this.props.chooseFolder);
        this.setState({
          modify: !this.state.modify
        });
      } catch (error) {
        console.error(error);
        alert("Fail to edit!");
      }
      break;
    case 'delete':
      window.api.database.deleteFolder(window.db, this.props.chooseFolder);
      alert("Successfully delete the bookmark!");
      this.props.cleanInfoZone();
      break;
    default: 
      console.error("Hit default case");
      return;
    }  
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // TODO: https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops
    if (nextProps.chooseFolder !== this.props.chooseFolder) {
      this.setState({ folder: this.getFolder(nextProps.chooseFolder) });
    }
  }

  handleChanges(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let copy = { ...this.state.folder };
    copy[[name]] = value;

    this.setState({
      folder: copy
    });
  }

  render() {
    return (
      <div className="FolderInformation">
        <h3>Folder Information</h3>
        <form>
          <div className="FolderName">
            <label>
              Name: <input id="FolderName" type="text" value={this.state.folder.name} name="name" 
                onChange={this.handleChanges.bind(this)} disabled={!this.state.modify} />
            </label>
          </div>
          <div className="FolderDescription">
            <label>
              Description: <input id="FolderDescription" type="text" name="description" value={this.state.folder.description} 
                onChange={this.handleChanges.bind(this)} disabled={!this.state.modify} />
            </label>
          </div>
          <div className="FolderCreateTime">
            Create time: {this.state.folder.createtime}
          </div>
          <div className="Operations">
            {!this.state.modify ? 
              <div className="InformationEditFalse">
                <input type="button" value="Edit" onClick={() => this.operation("edit")} />
                <input type="button" value="Delete" onClick={() => this.operation("delete")} />
              </div> :
              <div className="InformationEditTrue">
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

FolderInformation.propTypes = {
  chooseFolder: PropTypes.number.isRequired,
  setChooseFolder: PropTypes.func.isRequired,
  cleanInfoZone: PropTypes.func.isRequired
};

class PaperInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modify: false,
      paper: this.getPaper(props.choosePaper)
    };
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
        paper: this.getPaper(this.props.choosePaper)
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
      window.api.database.deletePaper(window.db, this.props.choosePaper);
      alert("Successfully delete the paper!");
      this.props.cleanInfoZone();
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
      paper: copy
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // TODO: https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops
    if (nextProps.choosePaper !== this.props.choosePaper) {
      this.setState({ paper: this.getPaper(nextProps.choosePaper) });
    }
  }

  render() {
    return (
      <div className="PaperInformation">
        <h3>Paper Information</h3>
        <form>
          <div className="PaperName">
            <label>
              Name: <input id="PaperName" type="text" value={this.state.paper.name} name="name" 
                onChange={this.handleChanges.bind(this)} disabled={!this.state.modify} />
            </label>
          </div>
          <div className="PaperTitle">
            <label>
              Title: <input id="PaperTitle" type="text" name="title" value={this.state.paper.title} 
                onChange={this.handleChanges.bind(this)} disabled={!this.state.modify} />
            </label>
          </div>
          <div className="PaperKeywords">
            <label>
              Keywords: <input id="PaperKeywords" type="text" name="keywords" value={this.state.paper.keywords} 
                onChange={this.handleChanges.bind(this)} disabled={!this.state.modify} />
            </label>
          </div>
          <div className="PaperYear">
            <label>
              Year: <input id="PaperYear" type="text" name="year" value={this.state.paper.year} 
                onChange={this.handleChanges.bind(this)} disabled={!this.state.modify} />
            </label>
          </div>
          <div className="PaperConference">
            <label>
              Conference: <input id="PaperConference" type="text" name="conference" value={this.state.paper.conference} 
                onChange={this.handleChanges.bind(this)} disabled={!this.state.modify} />
            </label>
          </div>
          <div className="PaperLastEdit">
            <label>
              Last Edit: {this.state.paper.lastedit} 
            </label>
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
  cleanInfoZone: PropTypes.func.isRequired
};

export default class InfoZone extends Component {
  render() {
    if (this.props.newBookmark === true) {
      return (
        <div className="InfoZone">
          <NewBookmark folderID={this.props.folderID} cleanInfoZone={this.props.cleanInfoZone} />
        </div>
      );
    } else if (this.props.chooseFolder !== 0) {
      return (
        <div className="InfoZone">
          <FolderInformation chooseFolder={this.props.chooseFolder} updateLatest={this.props.updateLatest} forward={this.props.forward}
            setChooseFolder={this.props.setChooseFolder} cleanInfoZone={this.props.cleanInfoZone}/>
        </div>
      );
    } else if (this.props.choosePaper !== 0){
      return (
        <div className="InfoZone">
          <PaperInformation choosePaper={this.props.choosePaper} setChoosePaper={this.props.setChoosePaper} cleanInfoZone={this.props.cleanInfoZone}/>
        </div>
      );
    } else if (this.props.search === true) {
      return (
        <div className="Search">
          Placeholder for search area.
        </div>
      );
    } else {
      return null;
    }
  }
}


InfoZone.propTypes = {
  newBookmark: PropTypes.bool.isRequired,
  folderID: PropTypes.number,
  chooseFolder: PropTypes.number.isRequired,
  choosePaper: PropTypes.number.isRequired,
  search: PropTypes.bool.isRequired,
  cleanInfoZone: PropTypes.func.isRequired,
  updateLatest: PropTypes.func.isRequired,
  forward: PropTypes.func.isRequired,
  setChooseFolder: PropTypes.func.isRequired,
  setChoosePaper: PropTypes.func.isRequired
};

