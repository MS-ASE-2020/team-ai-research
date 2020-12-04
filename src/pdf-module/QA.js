import React from 'react';
import PropTypes from 'prop-types';


class QAItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      question: this.props.question,
      answer: this.props.answer,
      refs: this.props.refs || [],
      editable: false
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
      refs.push((<div key={i}>
        <button
          onClick={(event) => {
            this.props.handleRefClick(event.target.name);
          }}
          name={this.state.refs[i]}>
          {this.state.refs[i]}
        </button>
        {this.state.editable && <button onClick={() => {
          let newRefs = this.state.refs.slice();
          newRefs.splice(i, 1);
          this.setState({ refs: newRefs });
        }}>Remove this</button>}</div>)
      );
    }
    if (!this.state.editable) {
      return (
        <div className="qa-item">
          <h5>{this.state.question}</h5>
          <p>{this.state.answer}</p>
          {refs}
          <button onClick={() => this.setState({ editable: true })}>Edit</button>
        </div>
      );
    } else {
      return (
        <div className="qa-item">
          <input value={this.state.question} name='question' onChange={this.handleInputChange}></input>
          <input value={this.state.answer} name='answer' onChange={this.handleInputChange}></input>
          {refs}
          <button onClick={() => {
            if (this.props.currentAnnotation != null) {
              let newRefs = this.state.refs.slice();
              if (!newRefs.includes(this.props.currentAnnotation)) {
                newRefs.push(this.props.currentAnnotation);
                this.setState({ refs: newRefs });
              }
            }
          }}>Add ref</button>
          <button onClick={() => {
            this.props.updateProps(this.state.question, this.state.answer, this.state.refs);
            this.setState({ editable: false });
          }}>Done</button>
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
  handleRefClick: PropTypes.func.isRequired
};


class AnnotatorQA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      qalist: [],
      newQuestion: '',
      currentAnnotation: null,
      loaded: false
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
    let annotationId = target.getAttribute('data-pdf-annotate-id');

    this.setState({
      currentAnnotation: annotationId
    });
  }

  handleAnnotationBlur() {
    this.setState({
      currentAnnotation: null
    });
  }

  load() {
    if (this.props.UI != null && this.state.loaded === false) {
      // executed one-time
      this.props.UI.addEventListener('annotation:click', this.handleAnnotationClick);
      this.props.UI.addEventListener('annotation:blur', this.handleAnnotationBlur);
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
      this.props.UI.removeEventListener('annotation:click', this.handleAnnotationClick);
      this.props.UI.removeEventListener('annotation:blur', this.handleAnnotationBlur);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // TODO: https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops
    if (nextProps.QA !== this.props.QA) {
      this.setState({ qalist: nextProps.QA });
    }
  }

  updateProps(i, question, answer, refs) {
    let newlist = this.state.qalist.slice();
    newlist[i] = {
      'question': question,
      'answer': answer,
      'refs': refs
    };
    this.setState({
      qalist: newlist
    }, () => {
      this.props.updateQA(this.state.qalist);
    });
  }

  render() {
    let qaItemList = [];
    for (let i = 0; i < this.state.qalist.length; i++) {
      qaItemList.push(
        <QAItem key={i}
          question={this.state.qalist[i]['question']} answer={this.state.qalist[i]['answer']}
          refs={this.state.qalist[i]['refs']}
          currentAnnotation={this.state.currentAnnotation}
          updateProps={(q, a, r) => this.updateProps(i, q, a, r)}
          handleRefClick={(name) => {
            if (this.props.UI) {
              let element = document.querySelector(`[data-pdf-annotate-uuid="${name}"]`);
              console.log(element);
              if (element) {
                this.props.UI.destroyEditOverlay();
                element.scrollIntoView();
                this.props.UI.createEditOverlay(element);
              }
            }
          }}></QAItem>
      );
    }
    return (
      <div id="qa-wrapper">
        <h4>Q &amp; A</h4>
        <div className="qa-list">
          <div className="qa-list-container">
            {qaItemList.length === 0 && <div className="qa-list-item">No QAs</div>}
            {qaItemList.length !== 0 && qaItemList}
          </div>
          <div className="qa-ask">
            <input type="text" placeholder="Add a Question" value={this.state.newQuestion} onChange={this.handleInputChange} name='newQuestion' />
            <button onClick={() => {
              let newlist = this.state.qalist.slice();
              newlist.push({
                'question': this.state.newQuestion,
                'answer': ''
              });
              this.setState({ qalist: newlist, newQuestion: '' });
            }}>Add</button>
          </div>
        </div>
      </div>
    );
  }
}

AnnotatorQA.propTypes = {
  paperID: PropTypes.number,
  UI: PropTypes.object,
  QA: PropTypes.array.isRequired,
  updateQA: PropTypes.func.isRequired
};

export default AnnotatorQA;
