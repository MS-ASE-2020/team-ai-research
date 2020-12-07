/* eslint-disable react/prop-types */
import React from 'react';

export default class AnnotatorTranslate extends React.Component {
  getURL() {
    let url = this.props.TranslationMode === "bing" ?
      "https://www.bing.com/translator?ref=TThis&&text=" + this.props.Text + "&from=&to=zh-Hans" :
      "https://translate.google.com/?sl=en&tl=zh-CN&text=" + this.props.Text + "&op=translate";
    return url;
  }

  render() {
    return (
      <div className="Translate">
        <input
          type="radio"
          name="Translator"
          value="Microsoft Bing"
          onChange={() => this.props.SwitchTranslationMode("bing")}
          checked={this.props.TranslationMode === "bing"}/> Microsoft Bing
        <input
          type="radio"
          name="Translator"
          value="Google"
          onChange={() => this.props.SwitchTranslationMode("google")}
          checked={this.props.TranslationMode === "google"}/> Google
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

