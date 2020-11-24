import React from 'react';
import PropTypes from 'prop-types';
import AnnotatorComment from './Comment';
import AnnotatorQA from './QA';


class AnnotatorSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0
    };
  }

  render() {
    const displaySidebar = this.props.RENDER_OPTIONS.pdfDocument;

    return (
      <div id="sidebar-wrapper" style={{ display: displaySidebar ? null : 'none' }}>
        <div className="sidebar-tab">
          <button onClick={() => this.setState({ tab: 0 })}>Comments</button>
          <button onClick={() => this.setState({ tab: 1 })}>Q &amp; A</button>
        </div>
        <div>
          {this.state.tab === 0 && <AnnotatorComment UI={this.props.UI} PDFJSAnnotate={this.props.PDFJSAnnotate}></AnnotatorComment>}
          {this.state.tab === 1 && <AnnotatorQA></AnnotatorQA>}
        </div>
      </div>
    );
  }
}

AnnotatorSidebar.propTypes = {
  UI: PropTypes.object,
  PDFJSAnnotate: PropTypes.object,
  RENDER_OPTIONS: PropTypes.object
};

export default AnnotatorSidebar;
