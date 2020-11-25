import React from 'react';
import PropTypes from 'prop-types';


class QAItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      question: this.props.question,
      answer: this.props.answer,
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
    if (!this.state.editable) {
      return (
        <div className="qa-item">
          <h5>{this.state.question}</h5>
          <p>{this.state.answer}</p>
          <button onClick={() => this.setState({editable: true})}>Edit</button>
        </div>
      );
    } else {
      return (
        <div className="qa-item">
          <input value={this.state.question} name='question' onChange={this.handleInputChange}></input>
          <input value={this.state.answer} name='answer' onChange={this.handleInputChange}></input>
          <button onClick={() => {
            this.props.updateProps(this.state.question, this.state.answer);
            this.setState({editable: false});
          }}>Done</button>
        </div>
      );
    }
  }
}

QAItem.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string,
  updateProps: PropTypes.func.isRequired
};


class AnnotatorQA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      qalist: [{
        'question': 'Q1?',
        'answer': 'A1!'
      }, {
        'question': 'Q2?',
        'answer': 'A2!'
      }],
      newQuestion: ''
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

  updateProps(i, question, answer) {
    let newlist = this.state.qalist.slice();
    newlist[i] = {
      'question': question,
      'answer': answer
    };
    this.setState({
      qalist: newlist
    });
  }

  render() {
    let qaItemList = [];
    for (let i = 0; i < this.state.qalist.length; i++) {
      qaItemList.push(
        <QAItem key={i}
          question={this.state.qalist[i]['question']} answer={this.state.qalist[i]['answer']}
          updateProps={(q, a) => this.updateProps(i, q, a)}></QAItem>
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
  paperID: PropTypes.number
};

export default AnnotatorQA;
