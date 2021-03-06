import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, withRouter } from 'react-router-dom'
import './index.css';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import AddAuthorForm from './AddAuthorForm'
import AuthorQuiz from './AuthorQuiz';
import * as serviceWorker from './serviceWorker';
import {shuffle, sample} from 'underscore';

const authors = [
    {
      name: 'Mark Twain',
      imageUrl: 'images/authors/marktwain.jpg',
      imageSource: 'Wikimedia Commons',
      books: ['The Adventures of Huckleberry Finn']
    },
    {
      name: 'Joseph Conrad',
      imageUrl: 'images/authors/josephconrad.png',
      imageSource: 'Wikimedia Commons',
      books: ['Heart of Darkness']
    },
    {
      name: 'J.K. Rowling',
      imageUrl: 'images/authors/jkrowling.jpg',
      imageSource: 'Wikimedia Commons',
      imageAttribution: 'Daniel Ogren',
      books: ['Harry Potter and the Sorcerers Stone']
    },
    {
      name: 'Stephen King',
      imageUrl: 'images/authors/stephenking.jpg',
      imageSource: 'Wikimedia Commons',
      imageAttribution: 'Pinguino',
      books: ['The Shining', 'IT']
    },
    {
      name: 'Charles Dickens',
      imageUrl: 'images/authors/charlesdickens.jpg',
      imageSource: 'Wikimedia Commons',
      books: ['David Copperfield', 'A Tale of Two Cities']
    },
    {
      name: 'William Shakespeare',
      imageUrl: 'images/authors/williamshakespeare.jpg',
      imageSource: 'Wikimedia Commons',
      books: ['Hamlet', 'Macbeth', 'Romeo and Juliet']
    }
  ];

function getTurnData(authors) {
    const allBooks = authors.reduce(function(p,c) {
        return p.concat(c.books);
    }, []);

    const fourRandomBooks = shuffle(allBooks).slice(0,4);
    const answer = sample(fourRandomBooks);

    return {
      books: fourRandomBooks,
      author: authors.find((author) => 
          author.books.some((title) => 
            (title === answer)))
    }
}

// function resetState() {
//     return {
//       turnData: getTurnData(authors),
//       highlight: ''      
//     }
// }

function reducer(
  state = { authors, turnData: getTurnData(authors), highlight: ''}, 
  action){
    switch (action.type) {
      case 'ANSWER_SELECTED':
        const isCorrect = state.turnData.author.books.some((book) => book === action.answer);
        return Object.assign(
          {}, 
          state, { 
            highlight: isCorrect ? 'correct' : 'wrong'
          });
      case 'CONTINUE':
        return Object.assign(
          {}, 
          state, { 
            highlight: '',
            turnData: getTurnData(state.authors)
          });
      default: return state;
    }
}

let store = Redux.createStore(reducer);
//let state = resetState();

// function onAnswerSelected(answer) {
//   const isCorrect = state.turnData.author.books.some((book) => book === answer);
//   state.highlight = isCorrect ? 'correct' : 'wrong';
//   render();
// }

function App() {
    return <ReactRedux.Provider store={store}>
      <AuthorQuiz />
      </ReactRedux.Provider>;
}

const AuthorWrapper = withRouter(({history}) => 
   <AddAuthorForm onAddAuthor={(author) => {
      authors.push(author); 
      history.push('/');
  }} />
);

ReactDOM.render(
  <BrowserRouter>
    <React.Fragment>
      <Route exact path="/" component={App} />
      <Route path="/add" component={AuthorWrapper} />
    </React.Fragment>
  </BrowserRouter>
, document.getElementById('root'));

//render();


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
