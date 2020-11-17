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
      alert("An error occurred when creating bookmark: ", error);
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
/*/
NewBookmark.propTypes = {
  folderID: PropTypes.number.isRequired,
  stopCreate: PropTypes.func.isRequired,
  newBookmark: PropTypes.bool.isRequired
};
/*/
class FolderInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modify: false,
      folder: this.getFolder(props.folderID)
    };
  }

  getFolder(folderID) {
    return window.api.database.getFolderProperty(window.db, folderID);
  }

  operation(act) {
    if (this.props.folderID === 1) {
      return;
      // not to change root folder.
    }
    switch (act) {
      case 'open':
        this.props.forward(this.state.folder.name, this.props.folderID);
        break;
      case 'edit': 
        this.setState({
          modify: true
        });
        break;
      case 'cancel': 
        this.setState({
          modify: false,
          folder: this.getFolder(this.props.folderID) 
        });
        break;
      case 'save':
        window.api.database.saveFolder(window.db, {
          ID: this.props.folderID,
          name: this.state.folder.name,
          description: this.state.folder.description,
          fatherID: this.state.folder.fatherID
        });
        this.props.updateLatest(this.state.folder.name);
        alert("Successfully edit the bookmark!");
        this.props.setChooseFolder(this.props.folderID);
        this.setState({
          modify: !this.state.modify
        });
        break;
      case 'delete':
        window.api.database.deleteFolder(window.db, this.props.folderID);
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
    if (nextProps.folderID !== this.props.folderID) {
      this.setState({ folder: this.getFolder(nextProps.folderID) });
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

FolderInformation.propTypes = {
  folderID: PropTypes.number.isRequired,
  updateLatest: PropTypes.func.isRequired
};

class PaperInformation extends Component {
  render() {
    return (
      <h3>Hello world!</h3>
    );
  }
}

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
          <FolderInformation folderID={this.props.chooseFolder} updateLatest={this.props.updateLatest} forward={this.props.forward}
          setChooseFolder={this.props.setChooseFolder} cleanInfoZone={this.props.cleanInfoZone}/>
        </div>
      )
    } else if (this.props.choosePaper !== 0){
      return (
        <div className="InfoZone">
          <PaperInformation paperID={this.props.choosePaper} setChoosePaper={this.props.setChoosePaper} cleanInfoZone={this.props.cleanInfoZone}/>
        </div>
      )
    } else {
      return null;
    }
  }
}

/*/
Folder.propTypes = {
  folderID: PropTypes.number.isRequired,
  forward: PropTypes.func.isRequired,
  updateLatest: PropTypes.func.isRequired,
};
/*/
