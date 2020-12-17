import React from "react";
import PropTypes from "prop-types";

export default class AnnotatorSideWebView extends React.Component {
  render() {
    let choices = [];
    for (let i = 0; i < this.props.choices.length; i++) {
      /*choices.push((
        <div key={i}>
          <input
            type="radio"
            name={this.props.choices[i].ref}
            value={this.props.choices[i].name}
            onChange={() => this.props.switchMode(this.props.choices[i].ref)}
            checked={this.props.modeRef === this.props.choices[i].ref} />
          <label htmlFor={this.props.choices[i].ref}>{this.props.choices[i].name}</label>
        </div>
      ));*/
      choices.push(
        <div
          key={"tabItem-" + i}
          className={"tab-item" + (this.props.modeRef === this.props.choices[i].ref ? " active" : "")}
          onClick={() => this.props.switchMode(this.props.choices[i].ref)}
        >
          {this.props.choices[i].name}
        </div>
      );
    }
    return (
      <div
        className={
          "webview-container" +
          (this.props.className ? " " + this.props.className : "")
        }
      >
        <div className="function-tabs">{choices}</div>
        <webview
          style={{ display: "inline-flex", width: "100%"}}
          src={this.props.getURL()}
          useragent="Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1"
          ref={el => this.webview = el}
        ></webview>
        <div className="webview-control">
          <button onClick={() => this.webview.goBack()}>Back</button>
          <button onClick={() => this.webview.goForward()}>Forward</button>
          <button onClick={() => this.webview.reload()}>Reload</button>
          <button onClick={() => {
            const url = this.webview.getURL();
            if (url.toLowerCase().endsWith(".pdf") || window.confirm("Current page does not look like a PDF page. Still open?")) {
              window.api.openFile(url);
            }
          }}>Try opening current PDF</button>
        </div>
      </div>
    );
  }
}

AnnotatorSideWebView.propTypes = {
  switchMode: PropTypes.func,
  modeRef: PropTypes.string,
  getURL: PropTypes.func.isRequired,
  choices: PropTypes.array.isRequired,
  className: PropTypes.string
};
