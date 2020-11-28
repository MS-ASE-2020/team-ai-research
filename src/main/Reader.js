import React, { Component } from "react";
import PropTypes from 'prop-types';

import PDFReader from "./reader/PDFReader";
import SaveDialog from "./reader/SaveDialog";

export default class Reader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFile: undefined,
      isShowSaveDialog: false,
      paperSaveInfo: null,
      postCloseDialog: null
    };
  }

  getPaperID(url) {
    const protocol = "paper://";
    if (url && url.startsWith(protocol)) {
      return parseInt(url.slice(protocol.length));
    }
  }

  switchSaveDialog(info = null, postCloseDialog = null, quickSave = false) {
    if (quickSave && this.state.isShowSaveDialog) {
      console.warn("quickSave is true when showing save dialog.");
    }
    if (!quickSave) {
      if (this.state.isShowSaveDialog) {
        // going to close dialog
        this.state.postCloseDialog && this.state.postCloseDialog();
      }
      this.setState({
        isShowSaveDialog: !this.state.isShowSaveDialog
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
        postCloseDialog: postCloseDialog
      });
    }
  }

  save(ID, name, title, keywords, year, conference, QandA, annotations, folders=null) {
    let newID = null;
    let callback = null;
    if (!ID) {
      callback = (paperID) => {
        window.api.filesystem.save(this.props.data.openFile, paperID);
        window.api.database.saveFolderOfPaper(window.db, paperID, folders);
      };
    }
    
    newID = window.api.database.savePaper(window.db, {
      ID: ID,
      name: name,
      title: title,
      keywords: keywords,
      year: year,
      conference: conference,
      QandA: JSON.stringify(QandA),
      annotations: JSON.stringify(annotations)
    }, callback);

    if (ID) {
      newID = null;  // we don't need this value.
    }

    this.switchSaveDialog();
    console.log(newID);
    if (newID) {
      this.props.actions.openFile("paper://" + newID);
    }
  }

  render() {
    const file = this.props.data.openFile;
    let saveDialogElement = null;
    if (this.state.isShowSaveDialog) {
      saveDialogElement = (
        <SaveDialog save={this.save.bind(this)} close={this.switchSaveDialog.bind(this)} info={this.state.paperSaveInfo} />
      );
    }
    return (
      <div id="Reader" className="Reader">
        <PDFReader key={file} file={file} paperID={this.getPaperID(file)}
          openSaveDialog={this.switchSaveDialog.bind(this)}></PDFReader>
        {saveDialogElement}
      </div>
    );
  }
}

Reader.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};
