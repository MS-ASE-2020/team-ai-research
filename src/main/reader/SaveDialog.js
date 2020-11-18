import React, { Component } from "react";
import PropTypes from "prop-types";

export default class SaveDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      title: "",
      keywords: "",
      year: "",
      conference: "",
      library: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    let value = target.value;
    const name = target.name;

    if (name === "year") {
      value = parseInt(value);
    }

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div className="save-wrapper">
        <div className="save-dialog">
          <h2 className="save-lead">Name<input name="name" value={this.state.name} onChange={this.handleInputChange}></input></h2>
          <h2 className="save-lead">Title<input name="title" value={this.state.title} onChange={this.handleInputChange}></input></h2>
          <h2 className="save-lead">Keywords<input name="keywords" value={this.state.keywords} onChange={this.handleInputChange}></input></h2>
          <h2 className="save-lead">Year<input name="year" type="number" value={this.state.year} onChange={this.handleInputChange}></input></h2>
          <h2 className="save-lead">Conference<input name="conference" value={this.state.conference} onChange={this.handleInputChange}></input></h2>
          <h2 className="save-lead">Library<input name="library" value={this.state.library} onChange={this.handleInputChange}></input></h2>
          <button onClick={() => this.props.save(
            this.props.info.ID, this.state.name, this.state.title, this.state.keywords, this.state.year, this.state.conference, this.state.library, this.props.info.annotations)}>Save</button>
          <button onClick={() => this.props.close()}>Cancel</button>
        </div>
      </div>
    );
  }
}


SaveDialog.propTypes = {
  save: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  info: PropTypes.object
};
