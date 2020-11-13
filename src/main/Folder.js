import React, { Component } from "react";

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
        createtime: 0,
        fatherID: this.props.folderID
      });
      alert("Success!");
      this.setState({
        name: "",
        description: ""
      });
      this.props.stopCreate();
    } catch (error) {
      console.error(error);
      alert("ID already EXISTS!");
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

class InformationEdit extends Component {
  render() {
    if (this.props.modify === false) {
      return (
        <div className="InformationEditFalse">
          <input type="button" value="Edit" onClick={this.props.setModify} />
          <input type="button" value="Delete" />
        </div>
      );
    } else {
      return (
        <div className="InformationEditTrue">
          <input type="button" value="Save" onClick={this.props.setModify} />
          <input type="button" value="Cancel" />
        </div>
      );
    }
  }
}

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

  setModify() {
    document.getElementById("FolderName").disabled = !document.getElementById("FolderName").disabled;
    document.getElementById("FolderDescription").disabled = !document.getElementById("FolderDescription").disabled;
    this.setState({
      modify: !this.state.modify
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.folderID !== this.props.folderID) {
      this.setState({ folder: this.getFolder(nextProps.folderID) });
    }
  }

  handleChanges(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let copy = {...this.state.folder};
    copy[[name]] = value;

    this.setState({
      folder: copy
    });
  }

  render() {
    return (
      <div className="FolderInformation">
        <h2>Folder Information</h2>
        <form>
          <div className="FolderName">
            <label>
              Name: <input id="FolderName" type="text" value={this.state.folder.name} name="name" onChange={this.handleChanges.bind(this)} disabled />
            </label>
          </div>
          <div className="FolderDescription">
            <label>
            Description: <input id="FolderDescription" type="text" name="description" value={this.state.folder.description} onChange={this.handleChanges.bind(this)} disabled />
            </label>
          </div>
          <div className="FolderCreateTime">
            Create time: {this.state.folder.createtime}
          </div>
          <div className="FolderFatherID">
            Father ID: {this.state.folder.fatherID}
          </div>
          <InformationEdit modify={this.state.modify} setModify={this.setModify.bind(this)} />
        </form>
      </div>
    );
  }
}

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
          <FolderInformation folderID={this.props.folderID} />
          <br />
        </div>
      </div>
    );
  }
}
