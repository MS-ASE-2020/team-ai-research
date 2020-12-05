import React from 'react';

export default class AnnotatorTranslate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: ""
    };
  }
  render() {
    alert(this.props.text);
    return (
      <div className="Translate">
        <input
          type="radio"
          name="Translator"
          value="Microsoft Bing"
          onChange={() => this.setState({
            url: "https://www.bing.com/translator"
          })} /> Microsoft Bing
        <input
          type="radio"
          name="Translator"
          value="Google"
          onChange={() => this.setState({
            url: "http://translate.google.cn/"
          })} /> Google
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

