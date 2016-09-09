import React from 'react';

var QuestionItem = ({data}) => (
  <li>
    <ul>
      <li>ID: {data.id}</li>
      <li>snippet: {data.questionText ? data.questionText.substring(0, 20) + '...' : '[Not Available]'}</li>
    </ul>
  </li>
);

export default QuestionItem;