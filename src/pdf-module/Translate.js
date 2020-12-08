import React from 'react';
import PropTypes from 'prop-types';
import AnnotatorSideWebView from './SideWebView';

export default class AnnotatorTranslate extends React.Component {
  getURL() {
    let url = this.props.TranslationMode === "bing" ?
      "https://www.bing.com/translator?ref=TThis&&text=" + this.props.Text + "&from=&to=zh-Hans" :
      "https://translate.google.com/?sl=en&tl=zh-CN&text=" + this.props.Text + "&op=translate";
    return url;
  }

  render() {
    return (
      <AnnotatorSideWebView 
        SwitchMode={this.props.SwitchTranslationMode}
        mode={this.props.TranslationMode}
        getURL={this.getURL.bind(this)}
        choices={[
          {name: 'Bing Translate', ref: 'bing'},
          {name: 'Google Translate', ref: 'google'},
        ]}></AnnotatorSideWebView>
    );
  }
}

AnnotatorTranslate.propTypes = {
  TranslationMode: PropTypes.string,
  SwitchTranslationMode: PropTypes.func,
  Text: PropTypes.string
};
