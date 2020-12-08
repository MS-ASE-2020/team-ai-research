import React from 'react';
import PropTypes from 'prop-types';
import AnnotatorComment from './Comment';
import AnnotatorQA from './QA';
import AnnotatorTranslate from './Translate';
import AnnotatorSearch from './Search';

class AnnotatorSidebar extends React.Component {
  render() {
    const displaySidebar = this.props.RENDER_OPTIONS.pdfDocument;
    return (
      <div id="sidebar-wrapper" style={{ display: displaySidebar ? null : 'none' }}
        className="no-annotation" ref={this.props.inputRef}>
        {/* Class "no-annotation" is a special class in modified pdf-annotate.js.
            When clicked on them, pdf-annotate.js won't blur/click annotations on pdf documents. */}
        <div className="sidebar-tab">
          <button onClick={() => this.props.switchTab(0)}>Comments</button>
          <button onClick={() => this.props.switchTab(1)}>Q &amp; A</button>
          <button onClick={() => this.props.switchTab(2)}>Translate</button>
          <button onClick={() => this.props.switchTab(3)}>Search</button>
        </div>
        <div style={{ display: this.props.tab === 0 ? null : 'none' }}>
          <AnnotatorComment UI={this.props.UI} PDFJSAnnotate={this.props.PDFJSAnnotate}></AnnotatorComment>
        </div>
        <div style={{ display: this.props.tab === 1 ? null : 'none' }}>
          <AnnotatorQA UI={this.props.UI} QA={this.props.QA} updateQA={this.props.updateQA}></AnnotatorQA>
        </div>
        <div style={{ display: this.props.tab === 2 ? null : 'none' }}>
          <AnnotatorTranslate 
            UI={this.props.UI} 
            text={this.props.text}
            translationMode={this.props.translationMode}
            switchTranslationMode={this.props.switchTranslationMode}>
          </AnnotatorTranslate>
        </div>
        <div style={{ display: this.props.tab === 3 ? null : 'none' }}>
          <AnnotatorSearch
            UI={this.props.UI} 
            text={this.props.text}
            searchMode={this.props.searchMode}
            switchSearchMode={this.props.switchSearchMode}>
          </AnnotatorSearch>
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
  updateQA: PropTypes.func.isRequired,
  switchTab: PropTypes.func,
  tab: PropTypes.number.isRequired,
  text: PropTypes.string,
  translationMode: PropTypes.string,
  switchTranslationMode: PropTypes.func,
  searchMode: PropTypes.string,
  switchSearchMode: PropTypes.func,
  inputRef: PropTypes.func
};

export default AnnotatorSidebar;
