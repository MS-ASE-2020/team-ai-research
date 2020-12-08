import React from 'react';
import PropTypes from 'prop-types';
import AnnotatorSideWebView from './SideWebView';

export default class AnnotatorTranslate extends React.Component {
  getURL() {
    let url = this.props.translationMode === "bing" ?
      "https://www.bing.com/translator?ref=TThis&&text=" + this.props.text + "&from=&to=zh-Hans" :
      "https://translate.google.com/?sl=en&tl=zh-CN&text=" + this.props.text + "&op=translate";
    return url;
  }

  render() {
    return (
      <AnnotatorSideWebView 
        switchMode={this.props.switchTranslationMode}
        modeRef={this.props.translationMode}
        getURL={this.getURL.bind(this)}
        choices={[
          {name: 'Bing Translate', ref: 'bing'},
          {name: 'Google Translate', ref: 'google'},
        ]}></AnnotatorSideWebView>
    );
  }
}

AnnotatorTranslate.propTypes = {
  translationMode: PropTypes.string,
  switchTranslationMode: PropTypes.func,
  text: PropTypes.string
};
