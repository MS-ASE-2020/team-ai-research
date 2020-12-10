import React from 'react';
import PropTypes from 'prop-types';
import AnnotatorSideWebView from './SideWebView';

export default class AnnotatorSearch extends React.Component {
  getURL() {
    let url;
    switch (this.props.searchMode) {
      case "bing" :
        url = "https://www.bing.com/search?q=" + this.props.text;
        break;
      case "google" :
        url = "https://www.google.com/search?q=" + this.props.text;
        break;
      case "wikipedia":
        url = "https://en.wikipedia.org/wiki/" + this.props.text;
        break;
      case "scholar":
        url = "https://scholar.google.com/scholar?hl=zh-CN&as_sdt=0%2C5&q=" + this.props.text;
        break;
      default:
        break;
    }
    return url;
  }

  render() {
    return (
      <AnnotatorSideWebView
        switchMode={this.props.switchSearchMode}
        modeRef={this.props.searchMode}
        getURL={this.getURL.bind(this)}
        choices={[
          {name: 'Bing', ref: 'bing'},
          {name: 'Google', ref: 'google'},
          {name: 'Wikipedia', ref: 'wikipedia'},
          {name: 'Scholar', ref: 'scholar'}
        ]}></AnnotatorSideWebView>
    );
  }
}

AnnotatorSearch.propTypes = {
  searchMode: PropTypes.string,
  switchSearchMode: PropTypes.func,
  text: PropTypes.string
};
