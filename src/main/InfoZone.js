import React, { Component } from "react";
import PropTypes from "prop-types";
import NewBookmark from "./Information/NewBookmark";
import FolderInformation from "./Information/FolderInformation";
import PaperInformation from "./Information/PaperInformation";

export default class InfoZone extends Component {
  render() {
    if (this.props.newBookmark === true) {
      return (
        <NewBookmark
          folderID={this.props.folderID}
          clearInfoZone={this.props.clearInfoZone}
        />
      );
    } else if (this.props.chooseFolder !== 0) {
      return (
        <FolderInformation
          chooseFolder={this.props.chooseFolder}
          updateLatest={this.props.updateLatest}
          forward={this.props.forward}
          setChooseFolder={this.props.setChooseFolder}
          clearInfoZone={this.props.clearInfoZone}
          openFolderCallback={this.props.selectFolderCallback}
        />
      );
    } else if (this.props.choosePaper !== 0) {
      return (
        <PaperInformation
          openFile={this.props.actions.openFile}
          choosePaper={this.props.choosePaper}
          setChoosePaper={this.props.setChoosePaper}
          clearInfoZone={this.props.clearInfoZone}
        />
      );
    } else if (this.props.search === true) {
      return <div className="Search">Placeholder for search area.</div>;
    } else {
      return null;
    }
  }
}

InfoZone.propTypes = {
  newBookmark: PropTypes.bool.isRequired,
  folderID: PropTypes.number,
  chooseFolder: PropTypes.number.isRequired,
  choosePaper: PropTypes.number.isRequired,
  search: PropTypes.bool.isRequired,
  clearInfoZone: PropTypes.func.isRequired,
  updateLatest: PropTypes.func.isRequired,
  forward: PropTypes.func.isRequired,
  setChooseFolder: PropTypes.func.isRequired,
  setChoosePaper: PropTypes.func.isRequired,
  actions: PropTypes.object,
  selectFolderCallback: PropTypes.func
};
