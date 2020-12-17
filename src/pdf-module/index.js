import React from "react";
import PropTypes from "prop-types";

import PDFJSAnnotate from "pdf-annotate.js";
import "./wrapper.css";
import AnnotatorToolBar from "./Toolbar";
import AnnotatorSidebar from "./Sidebar";
import PDFExtractor from "./PDFextract";

import * as pdfjsLib from "pdfjs-dist";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";
import "pdfjs-dist/web/pdf_viewer.css";
import workerURL from "../pdf.worker.min.data";

import useContextMenu from "contextmenu";
import "contextmenu/ContextMenu.css";

import { pdfTextAdjust } from "../main/utils";

function getSelection() {
  /*
  let text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  }
  return text;
  */
  let selectList = window.getSelection().getRangeAt(0).cloneContents()
    .childNodes;
  selectList = Array.from(selectList).map((x) => x.textContent);
  return pdfTextAdjust(selectList);
}

function PaperZone(props) {
  const [contextMenu, useCM] = useContextMenu({ submenuSymbol: "O" });
  const menuConfig = {
    // 'Alert Selected Text': () => alert(getSelection()),
    Copy: () => navigator.clipboard.writeText(getSelection()),
    Translate: {
      "Microsoft Bing": () => {
        props.switchTab(2);
        props.switchTranslationMode("bing");
        props.switchText(getSelection());
      },
      Google: () => {
        props.switchTab(2);
        props.switchTranslationMode("google");
        props.switchText(getSelection());
      },
    },
    Search: {
      "Bing Web": () => {
        props.switchTab(3);
        props.switchSearchMode("bing");
        props.switchText(getSelection());
      },
      "Google Web": () => {
        props.switchTab(3);
        props.switchSearchMode("google");
        props.switchText(getSelection());
      },
      "Google Scholar": () => {
        props.switchTab(3);
        props.switchSearchMode("scholar");
        props.switchText(getSelection());
      },
      Wikipedia: () => {
        props.switchTab(3);
        props.switchSearchMode("wikipedia");
        props.switchText(getSelection());
      },
    },
  };
  return (
    <div id="paper-zone" onContextMenu={useCM(menuConfig)}>
      {props.Zone}
      {props.fileNull ? null : contextMenu}
    </div>
  );
}

PaperZone.propTypes = {
  switchTab: PropTypes.func,
  switchSearchMode: PropTypes.func,
  switchTranslationMode: PropTypes.func,
  switchText: PropTypes.func,
  Zone: PropTypes.object,
  fileNull: PropTypes.bool,
};

class Annotator extends React.Component {
  constructor(props) {
    super(props);
    this.UI = null;
    this.RENDER_OPTIONS = {};
    this.NUM_PAGES = 0;
    this.PAGE_HEIGHT = 0;
    this.renderedPages = [];
    this.file = null;
    this.paperID = null;
    this.qa = [];
    this.state = {
      tab: 0,
      text: "",
      translationMode: "bing",
      searchMode: "bing",
    };
    this.content = null;
  }

  load(props) {
    const { UI } = PDFJSAnnotate;
    const documentId = props.docid;
    this.paperID = this.props.paperID;
    if (this.paperID) {
      let annotation = window.api.database.getAnnotation(
        window.db,
        this.paperID
      );
      this.qa =
        JSON.parse(window.api.database.getQandA(window.db, this.paperID)) || [];
      localStorage.setItem(`${documentId}/annotations`, annotation);
    }
    PDFJSAnnotate.setStoreAdapter(new PDFJSAnnotate.LocalStoreAdapter());
    let RENDER_OPTIONS = {
      documentId,
      pdfDocument: null,
      scale:
        parseFloat(localStorage.getItem(`${documentId}/scale`), 10) || 1.33,
      rotate: parseInt(localStorage.getItem(`${documentId}/rotate`), 10) || 0,
    };
    this.UI = UI;
    this.RENDER_OPTIONS = RENDER_OPTIONS;
    this.rendered = true;
    this.file = this.props.file;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerURL;
    this.enableUI();
    this.PDFRender();
  }

  componentDidMount() {
    this.load(this.props);
  }

  componentWillUnmount() {
    // for (let i = 0; i < this.renderedPages.length; i++) {
    // }
  }

  visiblePageNum = () => {
    return Math.round(this.wrapper.scrollTop / this.PAGE_HEIGHT) + 1;
  };

  contentWrapperScroll(e) {
    let visiblePageNum = Math.round(e.target.scrollTop / this.PAGE_HEIGHT) + 1;
    let visiblePage = document.querySelector(
      `.page[data-page-number="${visiblePageNum}"][data-loaded="false"]`
    );
    let okToRender;
    if (this.renderedPages.indexOf(visiblePageNum) === -1) {
      okToRender = true;
      this.renderedPages.push(visiblePageNum);
    } else {
      okToRender = false;
    }

    if (visiblePage && okToRender) {
      setTimeout(() => this.UI.renderPage(visiblePageNum, this.RENDER_OPTIONS));
    }
  }

  PDFRender = () => {
    if (this.rendered === false) {
      return;
    }
    try {
      this.rendered = false;
      this.renderedPages = [];
      const loadingTask = pdfjsLib.getDocument({
        url: this.props.file,
        cMapUrl: "shared/cmaps/",
        cMapPacked: true,
      });
      let promise = Promise.resolve();
      if (!this.props.file.startsWith("paper://")) {
        console.log("Downloading to tmp");
        promise = promise.then(() =>
          window.api.filesystem.save(this.props.file, "tmp")
        ); // TODO: Fix current model that sucks with file downloading.
      }

      promise.then(() => {
        loadingTask.promise.then((pdf) => {
          this.RENDER_OPTIONS.pdfDocument = pdf;
          let viewer = this.viewer;
          if (viewer) {
            viewer.innerHTML = "";
            for (let i = 0; i < pdf.numPages; i++) {
              let page = this.UI.createPage(i + 1);
              viewer.appendChild(page);
            }

            this.NUM_PAGES = pdf.numPages;
            window.pdfjsViewer = pdfjsViewer;
            this.UI.renderPage(1, this.RENDER_OPTIONS).then(
              // eslint-disable-next-line no-unused-vars
              ([pdfPage, annotations]) => {
                let viewport = pdfPage.getViewport({
                  scale: this.RENDER_OPTIONS.scale,
                  rotation: this.RENDER_OPTIONS.rotate,
                });
                this.PAGE_HEIGHT = viewport.height;
                this.rendered = true;
                this.setState({});
              }
            );

            if (this.content === null) {
              let extractor = new PDFExtractor(pdf, pdf.numPages);
              extractor.extractText().then(() => {
                this.content = extractor.pageContents.join(" ");
              });
            }
          }
        });
      });
    } catch {
      this.rendered = true;
    }
  };

  disableUI() {
    this.UI.disableUI();
    this.UI.disableEdit();
    this.UI.disableEraser();
    this.UI.disablePen();
    this.UI.disableText();
    this.UI.disablePoint();
    this.UI.disableRect();
  }

  enableUI() {
    // TODO: set correct active to toolbar button
    this.UI.enableUI();
    this.UI.enableEdit();
  }

  save() {
    if (this.props.file === null) {
      return;
    }
    const newfile = !this.props.file.startsWith("paper://");
    // if we are going to pop a dialog, disableUI() shall be called.
    let postCloseDialog = null;
    if (newfile) {
      if (this.content === null) {
        alert("Indexing. Please wait for more time and then save.");
        return;
      }
      postCloseDialog = this.enableUI.bind(this);
      this.disableUI();
    }

    PDFJSAnnotate.getStoreAdapter()
      .getAllAnnotations(this.RENDER_OPTIONS.documentId)
      .then((annotations) => {
        this.props.openSaveDialog(
          {
            annotations: annotations,
            ID: this.paperID,
            QandA: this.qa,
            content: this.content,
          },
          postCloseDialog,
          !newfile
        );
      });
  }

  enableSidebar() {
    this.sidebar.style.display = null;
    this.wrapper.classList.remove("fullwidth");
  }

  switchSidebar() {
    if (this.sidebar.style.display === "none") {
      this.enableSidebar();
    } else {
      this.sidebar.style.display = "none";
      this.wrapper.classList.add("fullwidth");
    }
  }

  switchTab(newTab) {
    this.enableSidebar();
    if (newTab !== this.state.tab) {
      this.setState({
        text: "",
      });
    }
    this.setState({
      tab: newTab,
    });
  }

  switchTranslationMode(mode) {
    this.setState({
      translationMode: mode,
    });
  }

  switchText(newText) {
    this.setState({
      text: newText,
    });
  }

  switchSearchMode(mode) {
    this.setState({
      searchMode: mode,
    });
  }

  render() {
    let Zone = (
      <div
        id="content-wrapper"
        onScroll={this.contentWrapperScroll.bind(this)}
        ref={(el) => (this.wrapper = el)}
      >
        <div
          id="viewer"
          className="pdfViewer"
          ref={(el) => (this.viewer = el)}
        ></div>
      </div>
    );
    return (
      <div id="pdfwrapper" ref={(el) => (this.el = el)}>
        <AnnotatorToolBar
          UI={this.UI}
          RENDER_OPTIONS={this.RENDER_OPTIONS}
          NUM_PAGES={this.NUM_PAGES}
          PDFJSAnnotate={PDFJSAnnotate}
          visiblePageNum={this.visiblePageNum}
          render={this.PDFRender}
          filename={this.file}
          saveFunc={this.save.bind(this)}
          switchSidebar={this.switchSidebar.bind(this)}
        ></AnnotatorToolBar>
        <PaperZone
          Zone={Zone}
          fileNull={this.file === null}
          switchTab={this.switchTab.bind(this)}
          switchText={this.switchText.bind(this)}
          switchTranslationMode={this.switchTranslationMode.bind(this)}
          switchSearchMode={this.switchSearchMode.bind(this)}
        />
        <AnnotatorSidebar
          UI={this.UI}
          RENDER_OPTIONS={this.RENDER_OPTIONS}
          PDFJSAnnotate={PDFJSAnnotate}
          tab={this.state.tab}
          switchTab={this.switchTab.bind(this)}
          translationMode={this.state.translationMode}
          switchTranslationMode={this.switchTranslationMode.bind(this)}
          searchMode={this.state.searchMode}
          switchSearchMode={this.switchSearchMode.bind(this)}
          text={this.state.text}
          QA={this.qa}
          updateQA={(qa) => {
            this.qa = qa;
          }}
          inputRef={(el) => (this.sidebar = el)}
        ></AnnotatorSidebar>
      </div>
    );
  }
}

Annotator.propTypes = {
  paperID: PropTypes.number,
  file: PropTypes.string,
  openSaveDialog: PropTypes.func.isRequired,
};

export default Annotator;
