import React, { Component } from "react";
import PropTypes from "prop-types";

// this.props.folderID/forward(newPath,newFolderID)/subfolder

export default class NewBookmark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
    };
  }

  handleChanges(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [[name]]: value,
    });
  }

  stopCreateNewBookmark() {
    this.setState({
      name: "",
      description: "",
    });
    this.props.clearInfoZone();
  }

  createNewBookmark() {
    try {
      if (this.state.name === "") {
        alert("Please enter folder name!");
      } else {
        window.api.database.saveFolder(window.db, {
          ID: null,
          name: this.state.name,
          description: this.state.description,
          fatherID: this.props.folderID,
        });
        alert(`Successfully created ${this.state.name}!`);
        this.stopCreateNewBookmark();
      }
    } catch (error) {
      console.error(error);
      alert("Fail to create!");
    }
  }

  render() {
    return (
      <div className="InfoZone">
        <h2>Create New Bookmark</h2>
        <table className="InfoTable">
          <tbody>
            <tr>
              <th scope="row">Name</th>
              <td>
                <input
                  id="newBookmarkName"
                  type="text"
                  value={this.state.name}
                  name="name"
                  onChange={this.handleChanges.bind(this)}
                />
              </td>
            </tr>
            <tr>
              <th scope="row">Description</th>
              <td>
                <input
                  id="newBookmarkDescription"
                  type="text"
                  value={this.state.description}
                  name="description"
                  onChange={this.handleChanges.bind(this)}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="Operations">
          <input
            type="button"
            value="Create"
            onClick={this.createNewBookmark.bind(this)}
          />
          <input
            type="button"
            value="Cancel"
            onClick={this.stopCreateNewBookmark.bind(this)}
          />
        </div>
      </div>
    );
  }
}

NewBookmark.propTypes = {
  folderID: PropTypes.number.isRequired,
  clearInfoZone: PropTypes.func.isRequired,
};
