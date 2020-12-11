import React, { Component } from "react";
import PropTypes from "prop-types";

import PDFReader from "./reader/PDFReader";
import SaveDialog from "./reader/SaveDialog";

export default class Reader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFile: undefined,
      showSaveDialog: false,
      showSelectFolderDialog: false,
      paperSaveInfo: null,
      postCloseDialog: null,
    };
  }

  getPaperID(url) {
    const protocol = "paper://";
    if (url && url.startsWith(protocol)) {
      return parseInt(url.slice(protocol.length));
    }
  }

  switchSaveDialog(info = null, postCloseDialog = null, quickSave = false) {
    if (quickSave && this.state.showSaveDialog) {
      console.warn("quickSave is true when showing save dialog.");
    }
    if (!quickSave) {
      if (this.state.showSaveDialog) {
        // going to close dialog
        this.state.postCloseDialog && this.state.postCloseDialog();
      }
      this.setState({
        showSaveDialog: !this.state.showSaveDialog,
      });
    } else {
      let properties = window.api.database.getPaperProperty(window.db, info.ID);
      properties.annotations = JSON.stringify(info.annotations);
      properties.QandA = JSON.stringify(info.QandA);
      console.log(properties);
      window.api.database.savePaper(window.db, properties);
    }
    if (info) {
      console.log(info);
      this.setState({
        paperSaveInfo: info,
        postCloseDialog: postCloseDialog,
      });
    }
  }

  save(
    ID,
    name,
    title,
    keywords,
    year,
    conference,
    QandA,
    annotations,
    content,
    folders
  ) {
    let newID = null;
    let callback = null;
    if (!ID) {
      callback = (paperID) => {
        window.api.filesystem.moveTmp(paperID);
        window.api.database.saveFolderOfPaper(window.db, paperID, folders);
      };
    }

    newID = window.api.database.savePaper(
      window.db,
      {
        ID: ID,
        name: name,
        title: title,
        keywords: keywords,
        year: year,
        conference: conference,
        QandA: JSON.stringify(QandA),
        annotations: JSON.stringify(annotations),
        content: content
      },
      callback
    );

    if (ID) {
      newID = null; // we don't need this value.
    }

    this.switchSaveDialog();
    console.log(newID);
    if (newID) {
      this.props.actions.openFile("paper://" + newID);
    }
  }

  render() {
    const file = this.props.data.openFile;
    let saveDialogElement = null,
      selectFolderDialogElement = null;
    if (this.state.showSaveDialog) {
      saveDialogElement = (
        <SaveDialog
          save={this.save.bind(this)}
          close={this.switchSaveDialog.bind(this)}
          info={this.state.paperSaveInfo}
        />
      );
    }
    if (this.state.showSelectFolderDialog) {
      selectFolderDialogElement = (
        <div>Placeholder</div>
      );
    }
    return (
      <div id="Reader" className="Reader">
        <PDFReader
          key={file}
          file={file}
          paperID={this.getPaperID(file)}
          openSaveDialog={this.switchSaveDialog.bind(this)}
        />
        {saveDialogElement}
        {selectFolderDialogElement}
      </div>
    );
  }
}

Reader.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};
