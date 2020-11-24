import React, { Component } from "react";
import PropTypes from "prop-types";

export default class FolderInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modify: false,
      folder: this.getFolder(props.chooseFolder),
    };
    this.handleChanges = this.handleChanges.bind(this);
  }

  getFolder(folderID) {
    return window.api.database.getFolderProperty(window.db, folderID);
  }

  operation(act) {
    switch (act) {
    case "edit":
      this.setState({
        modify: true,
      });
      break;
    case "cancel":
      this.setState({
        modify: false,
        folder: this.getFolder(this.props.chooseFolder),
      });
      break;
    case "save":
      try {
        if (this.state.folder.name === "") {
          alert("Please input the name!");
        } else {
          window.api.database.saveFolder(window.db, {
            ID: this.props.chooseFolder,
            name: this.state.folder.name,
            description: this.state.folder.description,
            fatherID: this.state.folder.fatherID,
          });
          alert("Successfully edit the information of bookmark!");
          this.props.setChooseFolder(this.props.chooseFolder);
          this.setState({
            modify: !this.state.modify,
          });
        }
      } catch (error) {
        console.error(error);
        alert("Fail to edit!");
      }
      break;
    case "delete":
      if (window.confirm("Are you surely want to delete this bookmark?")) {
        window.api.database.deleteFolder(window.db, this.props.chooseFolder);
        alert("Successfully delete the bookmark!");
        this.props.cleanInfoZone();
      }
      break;
    default:
      console.error("Hit default case");
      return;
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // TODO: https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops
    if (nextProps.chooseFolder !== this.props.chooseFolder) {
      this.setState({ folder: this.getFolder(nextProps.chooseFolder) });
    }
  }

  handleChanges(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    let copy = { ...this.state.folder };
    copy[[name]] = value;

    this.setState({
      folder: copy,
    });
  }

  render() {
    return (
      <div className="FolderInformation">
        <h3>Folder Information</h3>
        <form>
          <div className="FolderName">
            <label htmlFor="FolderName">Name</label>
            <input
              id="FolderName"
              type="text"
              value={this.state.folder.name}
              name="name"
              onChange={this.handleChanges}
              disabled={!this.state.modify}
            />
          </div>
          <div className="FolderDescription">
            <label htmlFor="FolderDescription">Description</label>
            <input
              id="FolderDescription"
              type="text"
              name="description"
              value={this.state.folder.description}
              onChange={this.handleChanges}
              disabled={!this.state.modify}
            />
          </div>
          <div className="FolderCreateTime">
            Create time: {this.state.folder.createtime}
          </div>
          <div className="Operations">
            {!this.state.modify ? (
              <div className="InformationEditFalse">
                <input
                  type="button"
                  value="Edit"
                  onClick={() => this.operation("edit")}
                />
                <input
                  type="button"
                  value="Delete"
                  onClick={() => this.operation("delete")}
                />
              </div>
            ) : (
              <div className="InformationEditTrue">
                <input
                  type="button"
                  value="Save"
                  onClick={() => this.operation("save")}
                />
                <input
                  type="button"
                  value="Cancel"
                  onClick={() => this.operation("cancel")}
                />
              </div>
            )}
          </div>
        </form>
      </div>
    );
  }
}

FolderInformation.propTypes = {
  chooseFolder: PropTypes.number.isRequired,
  setChooseFolder: PropTypes.func.isRequired,
  cleanInfoZone: PropTypes.func.isRequired,
};

