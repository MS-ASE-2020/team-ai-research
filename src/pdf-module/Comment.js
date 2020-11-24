import React from 'react';
import PropTypes from 'prop-types';


class AnnotatorComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  load() {
    if (this.props.UI != null && this.props.PDFJSAnnotate != null && this.state.loaded === false) {
      commentInit(this.props.PDFJSAnnotate, this.props.UI);
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
      commentInit(this.props.PDFJSAnnotate, this.props.UI, true);
    }
  }

  render() {
    return (
      <div id="comment-wrapper">
        <h4>Comments</h4>
        <div className="comment-list">
          <div className="comment-list-container">
            <div className="comment-list-item">No comments</div>
          </div>
          <form className="comment-list-form" style={{ display: "none" }}>
            <input type="text" placeholder="Add a Comment" />
          </form>
        </div>
      </div>
    );
  }
}

AnnotatorComment.propTypes = {
  UI: PropTypes.object,
  PDFJSAnnotate: PropTypes.object
};

function htmlEscape(text) {
  return text
    .replace('&', '&amp;')
    .replace('>', '&gt;')
    .replace('<', '&lt;')
    .replace('"', '&quot;')
    .replace("'", '&#39;');
}

function commentInit(PDFJSAnnotate, UI, cleanup = false) {
  let commentList = document.querySelector('#comment-wrapper .comment-list-container');
  let commentForm = document.querySelector('#comment-wrapper .comment-list-form');
  let commentText = commentForm.querySelector('input[type="text"]');

  function supportsComments(target) {
    let type = target.getAttribute('data-pdf-annotate-type');
    return ['point', 'highlight', 'area'].indexOf(type) > -1;
  }

  function insertComment(comment) {
    let child = document.createElement('div');
    child.className = 'comment-list-item';
    child.innerHTML = htmlEscape(comment.content);

    commentList.appendChild(child);
  }

  function handleAnnotationClick(target) {
    if (supportsComments(target)) {
      let documentId = target.parentNode.getAttribute('data-pdf-annotate-document');
      let annotationId = target.getAttribute('data-pdf-annotate-id');

      PDFJSAnnotate.getStoreAdapter().getComments(documentId, annotationId).then((comments) => {
        commentList.innerHTML = '';
        commentForm.style.display = '';
        commentText.focus();

        commentForm.onsubmit = function () {
          PDFJSAnnotate.getStoreAdapter().addComment(documentId, annotationId, commentText.value.trim())
            .then(insertComment)
            .then(() => {
              commentText.value = '';
              commentText.focus();
            });

          return false;
        };

        comments.forEach(insertComment);
      });
    }
  }

  function handleAnnotationBlur(target) {
    if (supportsComments(target)) {
      commentList.innerHTML = '';
      commentForm.style.display = 'none';
      commentForm.onsubmit = null;

      insertComment({ content: 'No comments' });
    }
  }

  function removeListeners() {
    UI.removeEventListener('annotation:click', handleAnnotationClick);
    UI.removeEventListener('annotation:blur', handleAnnotationBlur);
  }

  if (!cleanup) {
    UI.addEventListener('annotation:click', handleAnnotationClick);
    UI.addEventListener('annotation:blur', handleAnnotationBlur);
  } else {
    removeListeners();
  }
}

export default AnnotatorComment;
