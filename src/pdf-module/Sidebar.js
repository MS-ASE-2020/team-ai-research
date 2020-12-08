import React from "react";
import PropTypes from "prop-types";
import AnnotatorComment from "./Comment";
import AnnotatorQA from "./QA";
import AnnotatorTranslate from "./Translate";
import AnnotatorSearch from "./Search";

class AnnotatorSidebar extends React.Component {
  render() {
    const displaySidebar = this.props.RENDER_OPTIONS.pdfDocument;
    const tabItems = ["Comments", "Q & A", "Translate", "Search"].map(
      (text, index) => {
        return (
          <div
            key={"tabItem-" + index}
            className={"tab-item" + (this.props.tab === index ? " active" : "")}
            onClick={() => this.props.switchTab(index)}
          >
            {text}
          </div>
        );
      }
    );
    return (
      <div
        id="sidebar-wrapper"
        className={"no-annotation" + (displaySidebar ? null : " d-none")}
        ref={this.props.inputRef}
      >
        {/* Class "no-annotation" is a special class in modified pdf-annotate.js.
            When clicked on them, pdf-annotate.js won't blur/click annotations on pdf documents. */}
        <div className="sidebar-tab">{tabItems}</div>
        <div className="sidebar-content">
          <div
            className={"content-item" + (this.props.tab === 0 ? "" : " d-none")}
          >
            <AnnotatorComment
              UI={this.props.UI}
              PDFJSAnnotate={this.props.PDFJSAnnotate}
            ></AnnotatorComment>
          </div>
          <div
            className={"content-item" + (this.props.tab === 1 ? "" : " d-none")}
          >
            <AnnotatorQA
              UI={this.props.UI}
              QA={this.props.QA}
              updateQA={this.props.updateQA}
            ></AnnotatorQA>
          </div>
          <div
            className={"content-item" + (this.props.tab === 2 ? "" : " d-none")}
          >
            <AnnotatorTranslate
              UI={this.props.UI}
              text={this.props.text}
              translationMode={this.props.translationMode}
              switchTranslationMode={this.props.switchTranslationMode}
            ></AnnotatorTranslate>
          </div>
          <div
            className={"content-item" + (this.props.tab === 3 ? "" : " d-none")}
          >
            <AnnotatorSearch
              UI={this.props.UI}
              text={this.props.text}
              searchMode={this.props.searchMode}
              switchSearchMode={this.props.switchSearchMode}
            ></AnnotatorSearch>
          </div>
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
  updateQA: PropTypes.func.isRequired,
  switchTab: PropTypes.func,
  tab: PropTypes.number.isRequired,
  text: PropTypes.string,
  translationMode: PropTypes.string,
  switchTranslationMode: PropTypes.func,
  searchMode: PropTypes.string,
  switchSearchMode: PropTypes.func,
  inputRef: PropTypes.func,
};

export default AnnotatorSidebar;