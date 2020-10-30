import React from 'react';
import PDFJSAnnotate from 'pdf-annotate.js';
import "./wrapper.css";
import AnnotatorToolBar from './Toolbar';
import AnnotatorComment from './Comment';
import * as pdfjsLib from 'pdfjs-dist';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import 'pdfjs-dist/web/pdf_viewer.css';
import workerURL from "../pdf.worker.min.data";


class Annotator extends React.Component {
    constructor(props) {
        super(props);
        this.UI = null;
        this.RENDER_OPTIONS = {};
        this.NUM_PAGES = 0;
        this.PAGE_HEIGHT = 0;
        this.renderedPages = [];

        this.state = {};
    }

    load(props) {
        // global.pdfjsViewer = pdfjsViewer;
        const { UI } = PDFJSAnnotate;
        PDFJSAnnotate.setStoreAdapter(new PDFJSAnnotate.LocalStoreAdapter());
        // const documentId = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
        const documentId = 'file:///Users/tao/Documents/Linux-101-Ch05-modified.pdf';
        let RENDER_OPTIONS = {
            documentId,
            pdfDocument: null,
            scale: parseFloat(localStorage.getItem(`${documentId}/scale`), 10) || 1.33,
            rotate: parseInt(localStorage.getItem(`${documentId}/rotate`), 10) || 0
        };
        this.UI = UI;
        this.RENDER_OPTIONS = RENDER_OPTIONS;
        this.render_done = true;
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerURL;
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
    }

    contentWrapperScroll(e) {
        let visiblePageNum = Math.round(e.target.scrollTop / this.PAGE_HEIGHT) + 1;
        let visiblePage = document.querySelector(`.page[data-page-number="${visiblePageNum}"][data-loaded="false"]`);
        let okToRender;
        if (this.renderedPages.indexOf(visiblePageNum) === -1) {
            okToRender = true;
            this.renderedPages.push(visiblePageNum);
        }
        else {
            okToRender = false;
        }

        if (visiblePage && okToRender) {
            setTimeout(() => {
                this.UI.renderPage(visiblePageNum, this.RENDER_OPTIONS);
            });
        }
    }

    PDFRender = () => {
        if (this.render_done === false) {
            return;
        }
        try {
            this.render_done = false;
            const loadingTask = pdfjsLib.getDocument({
                url: this.RENDER_OPTIONS.documentId,
                cMapUrl: 'shared/cmaps/',
                cMapPacked: true
            });
    
            loadingTask.promise.then((pdf) => {
                this.RENDER_OPTIONS.pdfDocument = pdf;
                let viewer = document.getElementById('viewer');
                viewer.innerHTML = '';
                for (let i = 0; i < pdf.numPages; i++) {
                    let page = this.UI.createPage(i + 1);
                    viewer.appendChild(page);
                }
    
                this.NUM_PAGES = pdf.numPages;
                window.pdfjsViewer = pdfjsViewer;
                this.UI.renderPage(1, this.RENDER_OPTIONS).then(([pdfPage, annotations]) => {
                    let viewport = pdfPage.getViewport({ scale: this.RENDER_OPTIONS.scale, rotation: this.RENDER_OPTIONS.rotate });
                    this.PAGE_HEIGHT = viewport.height;
                    this.render_done = true;
                    this.setState({});
                });
            })
        } catch {
            this.render_done = true;
        }
    }

    render() {
        return (
            <div id="pdfwrapper" ref={el => this.el = el}>
                <AnnotatorToolBar
                    UI={this.UI}
                    RENDER_OPTIONS={this.RENDER_OPTIONS}
                    NUM_PAGES={this.NUM_PAGES}
                    PDFJSAnnotate={PDFJSAnnotate}
                    visiblePageNum={this.visiblePageNum}
                    render={this.PDFRender}></AnnotatorToolBar>
                <div id="content-wrapper" 
                    onScroll={this.contentWrapperScroll.bind(this)} 
                    ref={el => this.wrapper = el}>
                    <div id="viewer" className="pdfViewer"></div>
                </div>
                <AnnotatorComment 
                    UI={this.UI} 
                    RENDER_OPTIONS={this.RENDER_OPTIONS}
                    PDFJSAnnotate={PDFJSAnnotate}></AnnotatorComment>
            </div>
        );
    }
}

export default Annotator;