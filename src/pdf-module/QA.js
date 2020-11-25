import React from 'react';
import PropTypes from 'prop-types';


class QAItem extends React.Component {
  render() {
    return (
      <div className="qa-item">
        <h5>Question</h5>
        <p>Answer</p>
        <button>Edit</button>
      </div>
    );
  }
}


class AnnotatorQA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    let qaItemList = [];
    for (let i = 0; i < 5; i++) {
      qaItemList.push(
        <QAItem key={i}></QAItem>
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
            <input type="text" placeholder="Add a Question" />
            <button>Add</button>
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
