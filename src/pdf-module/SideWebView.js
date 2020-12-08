import React from 'react';
import PropTypes from 'prop-types';


export default class AnnotatorSideWebView extends React.Component {
  render() {
    let choices = [];
    for (let i = 0; i < this.props.choices.length; i++) {
      choices.push((
        <div key={i}>
          <input
            type="radio"
            name={this.props.choices[i].ref}
            value={this.props.choices[i].name}
            onChange={() => this.props.switchMode(this.props.choices[i].ref)}
            checked={this.props.modeRef === this.props.choices[i].ref} />
          <label htmlFor={this.props.choices[i].ref}>{this.props.choices[i].name}</label>
        </div>
      ));
    }
    return (
      <div className="WebviewContainer">
        <form>
          {choices}
        </form>
        <webview
          style={{ display: "inline-flex", width: "100%", height: "575px" }}
          src={this.props.getURL()}
          useragent="Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1"
        >
        </webview>
      </div>
    );
  }
}

AnnotatorSideWebView.propTypes = {
  switchMode: PropTypes.func,
  modeRef: PropTypes.string,
  getURL: PropTypes.func.isRequired,
  choices: PropTypes.array.isRequired
};
