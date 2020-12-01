import React from 'react';
import PropTypes from 'prop-types';

import initColorPicker from './initColorPicker';
import './toolbar.css';

class AnnotatorToolBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  load() {
    if (this.props.UI != null && this.props.RENDER_OPTIONS != null && this.state.loaded === false) {
      textAnnotationInit(this.props.UI, this.props.RENDER_OPTIONS);
      penAnnotationInit(this.props.UI, this.props.RENDER_OPTIONS);
      buttonsAnnotationInit(this.props.UI, this.props.RENDER_OPTIONS);
      scaleAnnotationInit(this.props.UI, this.props.RENDER_OPTIONS, this.props.render);
      this.setState({ loaded: true });
    }
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate() {
    this.load();
  }

  componentWillUnmount() {

  }

  render() {
    const displayToolbar = this.state.loaded && this.props.RENDER_OPTIONS.pdfDocument;

    return (
      <div className="toolbar no-annotation" style={{ display: displayToolbar ? null : 'none' }}>
        <button className="cursor" type="button" title="Cursor" data-tooltype="cursor">➚</button>
        <button className="select-text" type="button" title="Select Text" data-tooltype="select">I</button>
        <button className="eraser" type="button" title="Eraser" data-tooltype="eraser">⌫</button>

        <div className="spacer"></div>

        <button className="rectangle" type="button" title="Rectangle" data-tooltype="area">&nbsp;</button>
        <button className="highlight" type="button" title="Highlight" data-tooltype="highlight">&nbsp;</button>
        <button className="strikeout" type="button" title="Strikeout" data-tooltype="strikeout">&nbsp;</button>

        <div className="spacer"></div>

        <button className="text" type="button" title="Text Tool" data-tooltype="text"></button>
        <select className="text-size"></select>
        <div className="text-color"></div>

        <div className="spacer"></div>

        <button className="pen" type="button" title="Pen Tool" data-tooltype="draw">✎</button>
        <select className="pen-size"></select>
        <div className="pen-color"></div>

        <div className="spacer"></div>

        <button className="comment" type="button" title="Comment" data-tooltype="point">🗨</button>

        <div className="spacer"></div>

        <select className="scale">
          <option value=".5">50%</option>
          <option value="1">100%</option>
          <option value="1.33">133%</option>
          <option value="1.5">150%</option>
          <option value="2">200%</option>
        </select>

        {/* <a className="rotate-ccw" title="Rotate Counter Clockwise">⟲</a>
                <a className="rotate-cw" title="Rotate Clockwise">⟳</a> */}

        <button className="undo" title="Undo annotations" data-tooltype="undo" onClick={() => {
          this.props.PDFJSAnnotate.getStoreAdapter().undo(this.props.RENDER_OPTIONS.documentId).then(() => {
            for (let i = 1; i <= this.props.NUM_PAGES; i += 1) {
              this.props.UI.rerenderAnnotations(i, this.props.RENDER_OPTIONS);
            }
          });
                    
        }}>⟲</button>
        <button className="redo" title="Redo annotations" data-tooltype="redo" onClick={() => {
          this.props.PDFJSAnnotate.getStoreAdapter().redo(this.props.RENDER_OPTIONS.documentId).then(() => {
            for (let i = 1; i <= this.props.NUM_PAGES; i += 1) {
              this.props.UI.rerenderAnnotations(i, this.props.RENDER_OPTIONS);
            }
          });
                    
        }}>⟳</button>

        <div className="spacer"></div>

        <button className="clear" title="Clear" data-tooltype="clear" onClick={() => {
          if (window.confirm('Are you sure you want to clear annotations? This operation cannot be undone.')) {
            for (let i = 0; i < this.props.NUM_PAGES; i++) {
              document.querySelector(`div#pageContainer${i + 1} svg.annotationLayer`).innerHTML = '';
            }
            
            localStorage.removeItem(`${this.props.RENDER_OPTIONS.documentId}/annotations`);
          }
        }}>×</button>

        <div className="spacer"></div>

        <button className="save" title="Save" data-tooltype="save" onClick={() => this.props.saveFunc()}>
          <span role="img" aria-label="save">💾</span>
        </button>
      </div>
    );
  }
}

AnnotatorToolBar.propTypes = {
  UI: PropTypes.object,
  RENDER_OPTIONS: PropTypes.object,
  render: PropTypes.func,
  PDFJSAnnotate: PropTypes.object,
  NUM_PAGES: PropTypes.number,
  saveFunc: PropTypes.func
};

function textAnnotationInit(UI, RENDER_OPTIONS) {
  let textSize;
  let textColor;

  function initText() {
    let size = document.querySelector('.toolbar .text-size');
    [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96].forEach((s) => {
      size.appendChild(new Option(s, s));
    });

    setText(
      localStorage.getItem(`${RENDER_OPTIONS.documentId}/text/size`) || 10,
      localStorage.getItem(`${RENDER_OPTIONS.documentId}/text/color`) || '#000000'
    );

    initColorPicker(document.querySelector('.text-color'), textColor, function (value) {
      setText(textSize, value);
    });
  }

  function setText(size, color) {
    let modified = false;

    if (textSize !== size) {
      modified = true;
      textSize = size;
      localStorage.setItem(`${RENDER_OPTIONS.documentId}/text/size`, textSize);
      document.querySelector('.toolbar .text-size').value = textSize;
    }

    if (textColor !== color) {
      modified = true;
      textColor = color;
      localStorage.setItem(`${RENDER_OPTIONS.documentId}/text/color`, textColor);

      let selected = document.querySelector('.toolbar .text-color.color-selected');
      if (selected) {
        selected.classList.remove('color-selected');
        selected.removeAttribute('aria-selected');
      }

      selected = document.querySelector(`.toolbar .text-color[data-color="${color}"]`);
      if (selected) {
        selected.classList.add('color-selected');
        selected.setAttribute('aria-selected', true);
      }

    }

    if (modified) {
      UI.setText(textSize, textColor);
    }
  }

  function handleTextSizeChange(e) {
    setText(e.target.value, textColor);
  }

  document.querySelector('.toolbar .text-size').addEventListener('change', handleTextSizeChange);

  initText();
}

function penAnnotationInit(UI, RENDER_OPTIONS) {
  let penSize;
  let penColor;

  function initPen() {
    let size = document.querySelector('.toolbar .pen-size');
    for (let i = 0; i < 20; i++) {
      size.appendChild(new Option(i + 1, i + 1));
    }

    setPen(
      localStorage.getItem(`${RENDER_OPTIONS.documentId}/pen/size`) || 1,
      localStorage.getItem(`${RENDER_OPTIONS.documentId}/pen/color`) || '#000000'
    );

    initColorPicker(document.querySelector('.pen-color'), penColor, function (value) {
      setPen(penSize, value);
    });
  }

  function setPen(size, color) {
    let modified = false;

    if (penSize !== size) {
      modified = true;
      penSize = size;
      localStorage.setItem(`${RENDER_OPTIONS.documentId}/pen/size`, penSize);
      document.querySelector('.toolbar .pen-size').value = penSize;
    }

    if (penColor !== color) {
      modified = true;
      penColor = color;
      localStorage.setItem(`${RENDER_OPTIONS.documentId}/pen/color`, penColor);

      let selected = document.querySelector('.toolbar .pen-color.color-selected');
      if (selected) {
        selected.classList.remove('color-selected');
        selected.removeAttribute('aria-selected');
      }

      selected = document.querySelector(`.toolbar .pen-color[data-color="${color}"]`);
      if (selected) {
        selected.classList.add('color-selected');
        selected.setAttribute('aria-selected', true);
      }
    }

    if (modified) {
      UI.setPen(penSize, penColor);
    }
  }

  function handlePenSizeChange(e) {
    setPen(e.target.value, penColor);
  }

  document.querySelector('.toolbar .pen-size').addEventListener('change', handlePenSizeChange);

  initPen();
}

function buttonsAnnotationInit(UI, RENDER_OPTIONS) {
  let tooltype = localStorage.getItem(`${RENDER_OPTIONS.documentId}/tooltype`) || 'cursor';
  if (tooltype) {
    setActiveToolbarItem(tooltype, document.querySelector(`.toolbar button[data-tooltype=${tooltype}]`));
  }

  function setActiveToolbarItem(type, button) {
    if (type === 'clear' || type === 'undo' || type === 'redo') {
      return;
    }
    let active = document.querySelector('.toolbar button.active');
    if (active) {
      active.classList.remove('active');

      switch (tooltype) {
        case 'cursor':
          UI.disableEdit();
          break;
        case 'eraser':
          UI.disableEraser();
          break;
        case 'draw':
          UI.disablePen();
          break;
        case 'text':
          UI.disableText();
          break;
        case 'point':
          UI.disablePoint();
          break;
        case 'area':
        case 'highlight':
        case 'strikeout':
          UI.disableRect();
          break;
        case 'select':
          UI.enableUI();
          break;
        default:
          console.warn("Unexpected default case when disabling funcs in setActiveToolbarItem().");
      }
    }

    if (button) {
      button.classList.add('active');
    }
    if (tooltype !== type) {
      localStorage.setItem(`${RENDER_OPTIONS.documentId}/tooltype`, type);
    }
    tooltype = type;

    switch (type) {
      case 'cursor':
        UI.enableEdit();
        break;
      case 'eraser':
        UI.enableEraser();
        break;
      case 'draw':
        UI.enablePen();
        break;
      case 'text':
        UI.enableText();
        break;
      case 'point':
        UI.enablePoint();
        break;
      case 'area':
      case 'highlight':
      case 'strikeout':
        UI.enableRect(type);
        break;
      case 'select':
        UI.disableUI();
        break;
      default:
        console.warn("Unexpected default case when enabling funcs in setActiveToolbarItem().");
        console.log(type);
    }
  }

  function handleToolbarClick(e) {
    if (e.target.nodeName === 'BUTTON') {
      setActiveToolbarItem(e.target.getAttribute('data-tooltype'), e.target);
    }
  }

  document.querySelector('.toolbar').addEventListener('click', handleToolbarClick);
}

function scaleAnnotationInit(UI, RENDER_OPTIONS, render) {
  function setScale(scale
    //   , rotate
  ) {
    scale = parseFloat(scale, 10);
    // rotate = parseInt(rotate, 10);

    if (RENDER_OPTIONS.scale !== scale
    // || RENDER_OPTIONS.rotate !== rotate
    ) {
      RENDER_OPTIONS.scale = scale;
      // RENDER_OPTIONS.rotate = rotate;

      localStorage.setItem(`${RENDER_OPTIONS.documentId}/scale`, RENDER_OPTIONS.scale);
      // localStorage.setItem(`${RENDER_OPTIONS.documentId}/rotate`, RENDER_OPTIONS.rotate % 360);

      render();
    }
  }

  function handleScaleChange(e) {
    setScale(e.target.value, RENDER_OPTIONS.rotate);
  }

  // function handleRotateCWClick() {
  //     setScale(RENDER_OPTIONS.scale, RENDER_OPTIONS.rotate + 90);
  // }

  // function handleRotateCCWClick() {
  //     setScale(RENDER_OPTIONS.scale, RENDER_OPTIONS.rotate - 90);
  // }

  document.querySelector('.toolbar select.scale').value = RENDER_OPTIONS.scale;
  document.querySelector('.toolbar select.scale').addEventListener('change', handleScaleChange);
  // document.querySelector('.toolbar .rotate-ccw').addEventListener('click', handleRotateCCWClick);
  // document.querySelector('.toolbar .rotate-cw').addEventListener('click', handleRotateCWClick);
}

export default AnnotatorToolBar;
