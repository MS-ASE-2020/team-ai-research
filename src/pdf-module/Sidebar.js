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
          <button>Translate</button> {/* placeholder */}
        </div>
        <div style={{ display: this.state.tab === 0 ? null : 'none' }}>
          <AnnotatorComment UI={this.props.UI} PDFJSAnnotate={this.props.PDFJSAnnotate}></AnnotatorComment>
        </div>
        <div style={{ display: this.state.tab === 1 ? null : 'none' }}>
          <AnnotatorQA UI={this.props.UI} QA={this.props.QA} updateQA={this.props.updateQA}></AnnotatorQA>
        </div>
      </div>
    );
  }
}

AnnotatorSidebar.propTypes = {
  UI: PropTypes.object,
  PDFJSAnnotate: PropTypes.object,
  RENDER_OPTIONS: PropTypes.object,
  QA: PropTypes.array,
  updateQA: PropTypes.func.isRequired
};

export default AnnotatorSidebar;
