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

  createNewBookmark() {
    try {
      window.api.database.saveFolder(window.db, {
        ID: null,
        name: this.state.name,
        description: this.state.description,
        fatherID: this.props.folderID
      });
      this.setState({
        name: "",
        description: ""
      });
      this.props.stopCreate();
    } catch (error) {
      console.error(error);
      alert("An error occurred when creating bookmark: ", error);
    }
  }

  render() {
    if (this.props.newBookmark === true) {
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
            <input type="button" value="Cancel" onClick={this.props.stopCreate} />
          </form>
        </div>
      );
    }
    else return null;
  }
}

NewBookmark.propTypes = {
  folderID: PropTypes.number.isRequired,
  stopCreate: PropTypes.func.isRequired,
  newBookmark: PropTypes.bool.isRequired
};

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
    case 'edit': 
      break;
    case 'cancel': 
      break;
    case 'save':
      window.api.database.saveFolder(window.db, {
        ID: this.props.folderID,
        name: this.state.folder.name,
        description: this.state.folder.description,
        fatherID: this.state.folder.fatherID
      });
      this.props.updateLatest(this.state.folder.name);
      break;
    case 'delete':
      // TODO: Delete operation
      break;
    default: 
      console.error("Hit default case");
      return;
    }
    this.setState({
      modify: !this.state.modify
    });
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
    console.log("Current father ID:", this.state.folder.fatherID);
    return (
      <div className="FolderInformation">
        <h2>Folder Information</h2>
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
          {/* <div className="FolderFatherID">
            Father ID: {this.state.folder.fatherID}
          </div> */}
          <div>
            { this.props.folderID !== 1 && (!this.state.modify ? 
              <div className="InformationEditFalse">
                <input type="button" value="Edit" onClick={() => this.operation("edit")} />
                <input type="button" value="Delete" onClick={() => this.operation("delete")} />
              </div> :
              <div className="InformationEditTrue">
                <input type="button" value="Save" onClick={() => this.operation("save")} />
                <input type="button" value="Cancel" onClick={() => this.operation("cancel")} />
              </div>)
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

export default class Folder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newBookmark: false
    };
  }

  createBookmark() {
    this.setState({
      newBookmark: true
    });
  }

  stopCreateBookmark() {
    this.setState({
      newBookmark: false
    });
  }

  render() {
    let listItem = [];
    let dirlist = window.api.database.listFolder(window.db, this.props.folderID);
    for (let k = 0; k < dirlist.length; k++) {
      listItem.push((
        <div className="Subfolder" key={k}>
          <input type="button" value={dirlist[k].name} onClick={() => {
            this.props.forward(dirlist[k].name + "/", dirlist[k].ID);
            this.stopCreateBookmark();
          }} />
        </div>
      ));
    }
    return (
      <div className="Folder">
        <div className="SubfolderList">
          <h3>Sub Folder List: </h3>
          {listItem}
        </div>
        <div className="NewBookmark">
          <br />
          <input type="button" value="New bookmarks" onClick={this.createBookmark.bind(this)} />
          <NewBookmark folderID={this.props.folderID}
            newBookmark={this.state.newBookmark} stopCreate={this.stopCreateBookmark.bind(this)} />
          <br />
        </div>
        <div className="FolderInformation">
          <br />
          <FolderInformation folderID={this.props.folderID} updateLatest={this.props.updateLatest} />
          <br />
        </div>
      </div>
    );
  }
}


Folder.propTypes = {
  folderID: PropTypes.number.isRequired,
  forward: PropTypes.func.isRequired,
  updateLatest: PropTypes.func.isRequired,
};
