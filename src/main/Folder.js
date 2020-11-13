import React, { Component } from "react";

// this.props.folderID/forward(newPath,newFolderID)/subfolder

class NewBookmark extends Component {
    createNewBookmark() {
      let folder = {
        ID: 5,
        name: document.getElementById("newBookmarkName").value,
        description: document.getElementById("newBookmarkDescription").value,
        fatherID: this.props.folderID
      }
      alert(JSON.stringify(folder))   
      try {
          window.db.prepare(`INSERT INTO folder VALUES (${folder.ID}, ${folder.name}, ${folder.description}, datetime('now','localtime'), ${folder.fatherID});`).run();
          alert("Success!")
          document.getElementById("newBookmarkName").value = "";
          document.getElementById("newBookmarkDescription").value = "";
          this.props.stopCreate()
      } catch (error) {
          alert("ID already EXISTS!")
      }
    }
  
    render() {
      if (this.props.newBookmark === true) {
        return (
          <div className="newBookmark">
            <h3>Create New Bookmark</h3>
            <div className="newBookmarkName">
              Name: <input id="newBookmarkName" type="text" />
            </div>
            <div className="newBookmarkDescription">
              Description: <input id="newBookmarkDescription" type="text" />
            </div>
            <input type="button" value="Create" onClick={this.createNewBookmark.bind(this)}/>
            <input type="button" value="Cancel" onClick={this.props.stopCreate}/>
          </div>
        )
      }
      else return null;
    }
}

class InformationEdit extends Component {
    render() {
      if (this.props.modify === false) {
        return (
          <div className="InformationEditFalse">
            <input type="button" value="Edit" onClick={this.props.setModify}/>
            <input type="button" value="Delete" />
          </div>
        );
      } else {
        return (
          <div className="InformationEditTrue">
            <input type="button" value="Save" onClick={this.props.setModify}/>
            <input type="button" value="Cancel" />
          </div>
        );
      }
    }
}
  
class FolderInformation extends Component {
    constructor(props) {
      super(props)
      this.state = {
        modify: false
      }
    }
  
    setModify() {
      document.getElementById("FolderName").disabled = !document.getElementById("FolderName").disabled
      document.getElementById("FolderDescription").disabled = !document.getElementById("FolderDescription").disabled
      this.setState({
        modify: !this.state.modify
      })
    }
  
    render() {
      const folder = window.api.database.getFolderProperty(window.db, this.props.folderID)
      return (
        <div className="FolderInformation">
          <h2>Folder Information</h2>
          <div className="FolderName">
            Name: <input id="FolderName" type="text" value={folder.name} disabled/>
          </div>
          <div className="FolderDescription">
            Description: <input id="FolderDescription" type="text" value={folder.description} disabled/>
          </div>
          <div className="FolderCreateTime">
            Create time: {folder.createtime}
          </div>
          <div className="FolderFatherID">
            Father ID: {folder.fatherID}
          </div>
          <InformationEdit modify={this.state.modify} setModify={this.setModify.bind(this)}/>
        </div>
      );
    }
}
  
export default class Folder extends Component {
    constructor(props) {
      super(props)
      this.state = {
        newBookmark: false
      }
    }
    
    createBookmark(){
      this.setState({
        newBookmark: true
      })
    }
  
    stopCreateBookmark() {
      this.setState({
        newBookmark: false
      })
    }

    render() {
      let listItem = []
      let dirlist = window.api.database.listFolder(window.db, this.props.folderID)
      for (let k = 0; k < dirlist.length; k++) {
        listItem.push((
          <div className="Subfolder">
            <input type="button" value={dirlist[k].name} onClick={() => {
              this.props.forward(dirlist[k].name + "/", dirlist[k].ID);
              this.stopCreateBookmark();
            }}/>
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
            <br/>
            <input type="button" value="New bookmarks" onClick={this.createBookmark.bind(this)}/>
            <NewBookmark folderID={this.props.folderID} 
              newBookmark={this.state.newBookmark} stopCreate={this.stopCreateBookmark.bind(this)}/>
            <br/>
          </div>
          <div className="FolderInformation">
            <br/>
              <FolderInformation folderID={this.props.folderID}/>
            <br/>
          </div>
        </div>
      );
    }
}
  