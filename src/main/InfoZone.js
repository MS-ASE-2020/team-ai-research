import React, { Component } from "react";
import PropTypes from "prop-types";
import NewBookmark from "./Information/NewBookmark";
import FolderInformation from "./Information/FolderInformation";
import PaperInformation from "./Information/PaperInformation";

export default class InfoZone extends Component {
  render() {
    if (this.props.newBookmark === true) {
      return (
        <div className="InfoZone">
          <NewBookmark
            folderID={this.props.folderID}
            cleanInfoZone={this.props.cleanInfoZone}
          />
        </div>
      );
    } else if (this.props.chooseFolder !== 0) {
      return (
        <div className="InfoZone">
          <FolderInformation
            chooseFolder={this.props.chooseFolder}
            updateLatest={this.props.updateLatest}
            forward={this.props.forward}
            setChooseFolder={this.props.setChooseFolder}
            cleanInfoZone={this.props.cleanInfoZone}
          />
        </div>
      );
    } else if (this.props.choosePaper !== 0) {
      return (
        <div className="InfoZone">
          <PaperInformation
            choosePaper={this.props.choosePaper}
            setChoosePaper={this.props.setChoosePaper}
            cleanInfoZone={this.props.cleanInfoZone}
          />
        </div>
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
  cleanInfoZone: PropTypes.func.isRequired,
  updateLatest: PropTypes.func.isRequired,
  forward: PropTypes.func.isRequired,
  setChooseFolder: PropTypes.func.isRequired,
  setChoosePaper: PropTypes.func.isRequired,
};
