import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Folder extends Component {
  render() {
    let folderItem = [];
    if (this.props.folderID !== null) {
      const folderList = window.api.database.listFolder(
        window.db,
        this.props.folderID
      );
      for (let k = 0; k < folderList.length; k++) {
        folderItem.push(
          <div
            className="item"
            key={k}
            onClick={() =>
              folderList[k].ID === this.props.chooseFolder
                ? this.props.forward(folderList[k].name, folderList[k].ID)
                : this.props.setChooseFolder(folderList[k].ID)
            }
          >
            {folderList[k].name}
          </div>
        );
      }
    }
    let paperItem = [];
    const paperList = window.api.database.listPaper(
      window.db,
      this.props.folderID
    );
    for (let k = 0; k < paperList.length; k++) {
      paperItem.push(
        <div
          className="item"
          key={k}
          onClick={() => this.props.setChoosePaper(paperList[k].ID)}
        >
          {paperList[k].name}
        </div>
      );
    }
    return (
      <div className="Folder">
        {this.props.folderID === 1 ? (
          <div
            className="AllPapers"
            onClick={() => this.props.forward("All papers", null)}
          >
            All papers
          </div>
        ) : null}
        {this.props.folderID !== null ? (
          <div className="item-list subfolders">{folderItem}</div>
        ) : null}
        <div className="item-list papers">{paperItem}</div>
        {this.props.folderID !== null ? (
          <div
            className="CreateNewBookmark"
            onClick={this.props.setNewBookmark}
          >
            <i className="fas fa-folder-plus" />
            <span>Create new folder</span>
          </div>
        ) : null}
      </div>
    );
  }
}

Folder.propTypes = {
  folderID: PropTypes.number,
  forward: PropTypes.func.isRequired,
  setNewBookmark: PropTypes.func.isRequired,
  setChooseFolder: PropTypes.func.isRequired,
  setChoosePaper: PropTypes.func.isRequired,
  chooseFolder: PropTypes.number.isRequired,
};
