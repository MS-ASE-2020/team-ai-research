import React from "react";
import PropTypes from "prop-types";

class QAItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      question: this.props.question,
      answer: this.props.answer,
      refs: this.props.refs || [],
      editable: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    let value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  render() {
    let refs = [];
    for (let i = 0; i < this.state.refs.length; i++) {
      let refText = "Ref " + (i + 1);
      refs.push(
        <div className="tag-container" key={i}>
          <span className="tag-text">{refText}</span>
          <input
            type="button"
            className="tag-input"
            onClick={(event) => {
              this.props.handleRefClick(event.target.name);
            }}
            name={this.state.refs[i]}
            value={refText}
          />
          {this.state.editable && (
            <span className="tag-remove"
              onClick={() => {
                let newRefs = this.state.refs.slice();
                newRefs.splice(i, 1);
                this.setState({ refs: newRefs });
              }}
            />
          )}
        </div>
      );
    }
    if (this.state.refs.length === 0) {
      refs = "No references";
    }
      if (!this.state.editable) {
        return (
          <div className="qa-item">
            <div className="qa-question">
              <span className="noselect">Q:</span>
              {this.state.question}
            </div>
            <div className="qa-answer">
              <span className="noselect">A:</span>
              {this.state.answer}
            </div>
            <div className="qa-refs">
              <span className="noselect">Refs:</span>
              {refs}
            </div>
            <div className="qa-actions">
              <button
                className="btn btn-edit"
                onClick={() => this.setState({ editable: true })}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => this.props.updateProps(null, null, null, true)}
              >
                Delete
              </button>
            </div>
          </div>
        );
      } else {
        return (
          <div className="qa-item">
            <div className="qa-question">
              <span className="noselect">Q:</span>
              <input
                value={this.state.question}
                name="question"
                onChange={this.handleInputChange}
              />
            </div>
            <div className="qa-answer">
              <span className="noselect">A:</span>
              <textarea
                value={this.state.answer}
                name="answer"
                onChange={this.handleInputChange}
              />
            </div>
            <div className="qa-refs">
              <span className="noselect">Refs:</span>
              {refs}
            </div>
            <div className="qa-actions">
              <button
                className="btn btn-edit"
                onClick={() => {
                  if (this.props.currentAnnotation != null) {
                    let newRefs = this.state.refs.slice();
                    if (!newRefs.includes(this.props.currentAnnotation)) {
                      newRefs.push(this.props.currentAnnotation);
                      this.setState({ refs: newRefs });
                    } else {
                      alert("This ref has been added in this question.");
                    }
                  }
                }}
              >
                Add ref
              </button>
              <button
                className="btn btn-success"
                onClick={() => {
                  this.props.updateProps(
                    this.state.question,
                    this.state.answer,
                    this.state.refs
                  );
                  this.setState({ editable: false });
                }}
              >
                Done
              </button>
            </div>
          </div>
        );
      }
  }
}

QAItem.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string,
  refs: PropTypes.array,
  currentAnnotation: PropTypes.string,
  updateProps: PropTypes.func.isRequired,
  handleRefClick: PropTypes.func.isRequired,
};

class AnnotatorQA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      qalist: [],
      newQuestion: "",
      currentAnnotation: null,
      loaded: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAnnotationClick = this.handleAnnotationClick.bind(this);
    this.handleAnnotationBlur = this.handleAnnotationBlur.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    let value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleAnnotationClick(target) {
    // let documentId = target.parentNode.getAttribute('data-pdf-annotate-document');
    let annotationId = target.getAttribute("data-pdf-annotate-id");

    this.setState({
      currentAnnotation: annotationId,
    });
  }

  handleAnnotationBlur() {
    this.setState({
      currentAnnotation: null,
    });
  }

  load() {
    if (this.props.UI != null && this.state.loaded === false) {
      // executed one-time
      this.props.UI.addEventListener(
        "annotation:click",
        this.handleAnnotationClick
      );
      this.props.UI.addEventListener(
        "annotation:blur",
        this.handleAnnotationBlur
      );
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
    if (this.props.UI != null) {
      this.props.UI.removeEventListener(
        "annotation:click",
        this.handleAnnotationClick
      );
      this.props.UI.removeEventListener(
        "annotation:blur",
        this.handleAnnotationBlur
      );
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // TODO: https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops
    if (nextProps.QA !== this.props.QA) {
      this.setState({ qalist: nextProps.QA });
    }
  }

  updateProps(i, question, answer, refs, remove = false) {
    let newlist = this.state.qalist.slice();
    if (!remove) {
      newlist[i] = {
        question: question,
        answer: answer,
        refs: refs,
      };
    } else {
      newlist.splice(i, 1);
    }
    this.setState(
      {
        qalist: newlist,
      },
      () => {
        this.props.updateQA(this.state.qalist);
      }
    );
  }

  render() {
    let qaItemList = [];
    for (let i = 0; i < this.state.qalist.length; i++) {
      qaItemList.push(
        <QAItem
          key={i}
          question={this.state.qalist[i]["question"]}
          answer={this.state.qalist[i]["answer"]}
          refs={this.state.qalist[i]["refs"]}
          currentAnnotation={this.state.currentAnnotation}
          updateProps={(q, a, r, remove = false) =>
            this.updateProps(i, q, a, r, remove)
          }
          handleRefClick={(name) => {
            if (this.props.UI) {
              let element = document.querySelector(
                `[data-pdf-annotate-uuid="${name}"]`
              );
              console.log(element);
              if (element) {
                this.props.UI.destroyEditOverlay();
                element.scrollIntoView();
                this.props.UI.createEditOverlay(element);
              }
            }
          }}
        ></QAItem>
      );
    }
    return (
      <div id="qa-wrapper">
        <div className="qa-list">
          {qaItemList.length > 0 ? (
            qaItemList
          ) : (
            <div className="qa-list-empty">No QAs</div>
          )}
        </div>
        <div className="qa-ask">
          <input
            type="text"
            placeholder="Add a Question"
            value={this.state.newQuestion}
            onChange={this.handleInputChange}
            name="newQuestion"
          />
          <input
            type="button"
            value="Add"
            onClick={() => {
              let newlist = this.state.qalist.slice();
              newlist.push({
                question: this.state.newQuestion,
                answer: "",
              });
              this.setState({ qalist: newlist, newQuestion: "" });
            }}
          />
        </div>
      </div>
    );
  }
}

AnnotatorQA.propTypes = {
  paperID: PropTypes.number,
  UI: PropTypes.object,
  QA: PropTypes.array.isRequired,
  updateQA: PropTypes.func.isRequired,
};

export default AnnotatorQA;
