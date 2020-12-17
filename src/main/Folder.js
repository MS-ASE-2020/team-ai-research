import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Folder extends Component {
  render() {
    // Sorting helper, ref: https://stackoverflow.com/a/38641281/5958455
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: "base",
    });

    let folderItem = [];
    if (this.props.folderID !== null) {
      const folderList = window.api.database.listFolder(
        window.db,
        this.props.folderID
      );
      folderList.sort((a, b) => collator.compare(a.name, b.name));
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
    paperList.sort((a, b) => collator.compare(a.name, b.name));
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
        {this.props.folderID ? (
          <div className="heading">
            <i className="fas fa-fw fa-folder-open" /> Folders
          </div>
        ) : null}

        {this.props.folderID === 1 && !this.props.selectFolderCallback ? (
          <div
            className="all-papers"
            onClick={() => this.props.forward("All papers", null)}
          >
            <i className="fas fa-fw fa-book" /> All papers
          </div>
        ) : null}
        {this.props.folderID !== null ? (
          <div className="item-list subfolders">{folderItem}</div>
        ) : null}
        {/* eslint-disable indent */}
        {this.props.folderOnly
          ? null
          : [
              <div key="papers-heading" className="heading">
                <i className="fas fa-fw fa-file" /> Papers
              </div>,
              <div key="papers-item" className="item-list papers">
                {paperItem}
              </div>,
            ]}
        {/* eslint-enable indent */}
        {this.props.folderID !== null ? (
          <div className="buttons-bar">
            <div className="item-button" onClick={this.props.setNewBookmark}>
              <i className="fas fa-folder-plus" />
              <span>Create new folder</span>
            </div>
          </div>
        ) : null}
        {this.props.selectFolderCallback ? (
          <div className="buttons-bar">
            <div
              className="item-button"
              onClick={() =>
                this.props.selectFolderCallback(
                  this.props.folderID,
                  window.api.database.getFolderPath(
                    window.db,
                    this.props.folderID
                  )
                )
              }
            >
              <i className="fas fa-folder-open" />
              <span>Open</span>
            </div>
            <div
              className="item-button"
              onClick={() => this.props.selectFolderCallback(null, null)}
            >
              <i className="fas fa-times-circle" />
              <span>Cancel</span>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

Folder.propTypes = {
  folderID: PropTypes.number,
  folderOnly: PropTypes.bool,
  forward: PropTypes.func.isRequired,
  setNewBookmark: PropTypes.func.isRequired,
  setChooseFolder: PropTypes.func.isRequired,
  setChoosePaper: PropTypes.func.isRequired,
  chooseFolder: PropTypes.number.isRequired,
  selectFolderCallback: PropTypes.func,
};
