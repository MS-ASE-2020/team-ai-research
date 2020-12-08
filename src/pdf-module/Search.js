import React from 'react';
import PropTypes from 'prop-types';
import AnnotatorSideWebView from './SideWebView';

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
        url = "https://scholar.google.com/scholar?hl=zh-CN&as_sdt=0%2C5&q=" + this.props.Text;
        break;
      default:
        break;
    }
    return url;
  }

  render() {
    return (
      <AnnotatorSideWebView 
        SwitchMode={this.props.SwitchSearchMode}
        mode={this.props.SearchMode}
        getURL={this.getURL.bind(this)}
        choices={[
          {name: 'Bing Web', ref: 'bing'},
          {name: 'Google Search', ref: 'google'},
          {name: 'Wikipedia', ref: 'wikipedia'},
          {name: 'Google Scholar', ref: 'scholar'}
        ]}></AnnotatorSideWebView>
    );
  }
}

AnnotatorSearch.propTypes = {
  SearchMode: PropTypes.string,
  SwitchSearchMode: PropTypes.func,
  Text: PropTypes.string
};
