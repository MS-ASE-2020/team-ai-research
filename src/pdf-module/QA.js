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
      </div>
    );
  }
}

AnnotatorQA.propTypes = {
  paperID: PropTypes.number
};

export default AnnotatorQA;
