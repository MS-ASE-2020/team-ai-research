import React, { Component } from "react";
import PropTypes from 'prop-types';

export default class Folder extends Component {
  render() {
    let folderItem = [];
    const folderList = window.api.database.listFolder(window.db, this.props.folderID);
    for (let k = 0; k < folderList.length; k++) {
      folderItem.push((
        <div className="Subfolder" key={k}>
          <input type="button" value={folderList[k].name} onClick={() => this.props.setChooseFolder(folderList[k].ID)} />
        </div>
      ));
    }
    let paperItem = [];
    const paperList = window.api.database.listPaper(window.db, this.props.folderID);
    for (let k = 0; k < paperList.length; k++) {
      paperItem.push((
        <div className="Paper" key={k}>
          <input type="button" value={paperList[k].name} onClick={() => this.props.setChoosePaper(paperList[k].ID)} />
        </div>
      ));
    }
    return (
      <div className="Folder">
        <div className="SubfolderList">
          <h3>Sub Folder List: </h3>
          {folderItem}
        </div>
        <div className="PaperList">
          <h3>Paper List: </h3>
          {paperItem}
        </div>
        <div className="CreateNewBookmark">
          <h3>Create New Bookmark: </h3>
          <input type="button" value="New Bookmark" onClick={this.props.setNewBookmark}/>
        </div>
      </div>
    );
  }
}

Folder.propTypes = {
  folderID: PropTypes.number.isRequired,
};
