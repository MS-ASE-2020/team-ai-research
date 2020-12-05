import React from 'react';
import PropTypes from 'prop-types';
import AnnotatorComment from './Comment';
import AnnotatorQA from './QA';
import AnnotatorTranslate from './Translate';


export default class AnnotatorSidebar extends React.Component {

  render() {
    const displaySidebar = this.props.RENDER_OPTIONS.pdfDocument;

    return (
      <div id="sidebar-wrapper" style={{ display: displaySidebar ? null : 'none' }}
        className="no-annotation">
        {/* Class "no-annotation" is a special class in modified pdf-annotate.js.
            When clicked on them, pdf-annotate.js won't blur/click annotations on pdf documents. */}
        <div className="sidebar-tab">
          <button onClick={() => this.props.switchTab(0)}>Comments</button>
          <button onClick={() => this.props.switchTab(1)}>Q &amp; A</button>
          <button onClick={() => this.props.switchTab(2)}>Translate</button>
        </div>
        <div style={{ display: this.props.TAB === 0 ? null : 'none' }}>
          <AnnotatorComment UI={this.props.UI} PDFJSAnnotate={this.props.PDFJSAnnotate}></AnnotatorComment>
        </div>
        <div style={{ display: this.props.TAB === 1 ? null : 'none' }}>
          <AnnotatorQA UI={this.props.UI} QA={this.props.QA} updateQA={this.props.updateQA}></AnnotatorQA>
        </div>
        <div style={{ display: this.props.TAB === 2 ? null : 'none' }}>
          <AnnotatorTranslate UI={this.props.UI} text={this.props.text}/>
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

