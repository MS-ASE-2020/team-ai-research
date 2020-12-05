/* eslint-disable react/prop-types */
import React from 'react';

export default class AnnotatorTranslate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.TranslationMode === "bing" ? 
        "https://www.bing.com/translator" :
        "https://translate.google.com/?sl=en&tl=zh-CN&text=" + props.Text +"&op=translate"
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // TODO: https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops
    this.setState({
      url: nextProps.TranslationMode === "bing" ? 
        "https://www.bing.com/translator" :
        "https://translate.google.com/?sl=en&tl=zh-CN&text=" + nextProps.Text +"&op=translate"
    });
  }

  getMode(mode="bing") {
    this.props.SwitchTranslationMode(mode);
    this.setState({
      url: mode === "bing" ? 
        "https://www.bing.com/translator" :
        "https://translate.google.com/?sl=en&tl=zh-CN&text=" + this.props.Text +"&op=translate"
    });
  }

  render() {
    return (
      <div className="Translate">
        <input
          type="radio"
          name="Translator"
          value="Microsoft Bing"
          onChange={this.getMode.bind(this, "bing")} /> Microsoft Bing
        <input
          type="radio"
          name="Translator"
          value="Google"
          onChange={this.getMode.bind(this, "google")}
          defaultChecked/> Google
        <webview
          style={{ display: "inline-flex", width: "245px", height: "575px" }}
          src={this.state.url}
          useragent="Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/81.0.4044.124 Mobile/15E148 Safari/604.1"
        >
        </webview>
      </div>
    );
  }
}

