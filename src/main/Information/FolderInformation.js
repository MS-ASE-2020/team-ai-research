import React, { Component } from "react";
import PropTypes from "prop-types";

export default class FolderInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modify: false,
      folder: this.getFolderProperty(props.chooseFolder),
    };
  }

  getFolderProperty(folderID) {
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
          folder: this.getFolderProperty(this.props.chooseFolder),
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
          this.props.clearInfoZone();
        }
        break;
      default:
        console.error("Hit default case");
        return;
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // TODO: https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops
    this.setState({
      folder: this.getFolderProperty(nextProps.chooseFolder),
      modify: false,
    });
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
      <div className="InfoZone">
        <h2>Folder Information</h2>
        <table className="InfoTable">
          <tbody>
            <tr>
              <th scope="row">Name</th>
              <td>
                {this.state.modify ? (
                  <input
                    type="text"
                    value={this.state.folder.name}
                    name="name"
                    onChange={this.handleChanges.bind(this)}
                  />
                ) : (
                  this.state.folder.name
                )}
              </td>
            </tr>
            <tr>
              <th scope="row">Description</th>
              <td>
                {this.state.modify ? (
                  <textarea
                    type="text"
                    name="description"
                    value={this.state.folder.description}
                    onChange={this.handleChanges.bind(this)}
                  />
                ) : (
                  <span className="textarea">
                    {this.state.folder.description}
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <th scope="row">Created</th>
              <td>{this.state.folder.createtime}</td>
            </tr>
          </tbody>
        </table>
        <div className="Operations">
          {/* eslint-disable indent */}
          {!this.state.modify
            ? [
                <input
                  className="btn btn-edit"
                  type="button"
                  value="Edit"
                  onClick={() => this.operation("edit")}
                  key={0}
                />,
                this.props.openFolderCallback ? null : (
                  <input
                    className="btn btn-danger"
                    type="button"
                    value="Delete"
                    onClick={() => this.operation("delete")}
                    key={1}
                  />
                ),
              ]
            : [
                <input
                  className="btn btn-success"
                  type="button"
                  value="Save"
                  onClick={() => this.operation("save")}
                  key={0}
                />,
                <input
                  className="btn btn-edit"
                  type="button"
                  value="Cancel"
                  onClick={() => this.operation("cancel")}
                  key={1}
                />,
              ]}
          {/* eslint-enable indent */}
        </div>
      </div>
    );
  }
}

FolderInformation.propTypes = {
  chooseFolder: PropTypes.number.isRequired,
  setChooseFolder: PropTypes.func.isRequired,
  clearInfoZone: PropTypes.func.isRequired,
  openFolderCallback: PropTypes.func,
};
