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
      paperSaveInfo: null
    };
  }

  getPaperID(url) {
    const protocol = "paper://";
    if (url && url.startsWith(protocol)) {
      return parseInt(url.slice(protocol.length));
    }
  }

  switchSaveDialog(info = null) {
    this.setState({
      isShowSaveDialog: !this.state.isShowSaveDialog
    });
    if (info) {
      console.log(info);
      this.setState = {
        paperSaveInfo: info
      };
    }
  }

  save(ID, name, title, keywords, year, conference, QandA, annotations) {
    let newID = null;
    let callback = null;
    if (ID) {
      callback = (paperID) => {
        window.api.filesystem.save(this.file, paperID);
        newID = paperID;
      };
    }
    
    window.api.database.savePaper(window.db, {
      ID: ID,
      name: name,
      title: title,
      keywords: keywords,
      year: year,
      conference: conference,
      QandA: QandA,
      annotations: JSON.stringify(annotations)
    }, callback);

    this.switchSaveDialog();
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
  data: PropTypes.object.isRequired
};
