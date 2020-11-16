import React from 'react';
import PropTypes from 'prop-types';
import AnnotatorComment from './Comment';


class AnnotatorSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0
    };
  }

  render() {
    return (
      <div>
        <div className="sidebar-tab">
          <button onClick={() => this.setState({tab: 0})}>Comments</button>
          <button onClick={() => this.setState({tab: 1})}>Q &amp; A</button>
        </div>
        <AnnotatorComment UI={this.props.UI} PDFAnnotate={this.props.PDFJSAnnotate}></AnnotatorComment>
      </div>
    );
  }
}

AnnotatorSidebar.propTypes = {
  UI: PropTypes.object,
  PDFJSAnnotate: PropTypes.object
};

export default AnnotatorSidebar;
