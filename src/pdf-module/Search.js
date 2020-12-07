/* eslint-disable react/prop-types */
import React from 'react';

export default class AnnotatorSearch extends React.Component {
  getURL() {
    let url;
    switch (this.props.SearchMode) {
      case "bing" :
        url = "https://www.bing.com/search?q=" + this.props.Text;
        break;
      case "google" :
        url = "https://www.google.com/search?q=" + this.props.Text;
        break;
      case "wikipedia":
        url = "https://en.wikipedia.org/wiki/" + this.props.Text;
        break;
      case "scholar":
        url = "https://scholar.google.com/scholar?hl=zh-TW&as_sdt=0%2C5&q=" + this.props.Text;
        break;
      default:
        break;
    }
    return url;
  }

  render() {
    return (
      <div className="Translate">
        <input
          type="radio"
          name="Search"
          value="Bing Web"
          onChange={() => this.props.SwitchSearchMode("bing")}
          checked={this.props.SearchMode === "bing"}/> Bing Web
        <input
          type="radio"
          name="Search"
          value="Google Web"
          onChange={() => this.props.SwitchSearchMode("google")}
          checked={this.props.SearchMode === "google"}/> Google Web
        <input
          type="radio"
          name="Search"
          value="Google Scholar"
          onChange={() => this.props.SwitchSearchMode("scholar")}
          checked={this.props.SearchMode === "scholar"}/> Google Scholar
        <input
          type="radio"
          name="Search"
          value="Wikipedia"
          onChange={() => this.props.SwitchSearchMode("wikipedia")}
          checked={this.props.SearchMode === "wikipedia"}/> Wikipedia  
        <webview
          style={{ display: "inline-flex", width: "245px", height: "575px" }}
          src={this.getURL()}
          useragent="Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/81.0.4044.124 Mobile/15E148 Safari/604.1"
        >
        </webview>
      </div>
    );
  }
}

