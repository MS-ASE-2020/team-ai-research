import React from 'react';
import PropTypes from 'prop-types';


class AnnotatorQA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div id="qa-wrapper">
        <h4>Q &amp; A</h4>
        <div className="qa-list">
          <div className="qa-list-container">
            <div className="qa-list-item">No QAs</div>
          </div>
          <button>Add a Q &amp; A</button>
        </div>
      </div>
    );
  }
}

AnnotatorQA.propTypes = {
  paperID: PropTypes.number
};

export default AnnotatorQA;
