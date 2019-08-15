import React, { Component } from 'react';
import axios from 'axios';
import { v4 } from 'uuid';
import { API, getIdUrl } from '../../helpers';

const renderFilm = film => {
  const { title, director, order } = film;

  return (
    <div key={ v4() }>
      <h2>{ title }</h2>
      <h3>{ order }</h3>
      <p>{ director }</p>
      <a href={ `/characters/${ order }` }>characters</a>
    </div>
  )
}

class Home extends Component {
  constructor() {
    super();
    this.state = {
      films: [],
    };
  }

  renderAllFilms = films => this.setState({ films: films.map(film => renderFilm(film)) });

  getAllFilms = () => {
    axios
    .get(`${ API }/films`)
    .then(res => {
      const { data = {} } = res;
      const { results = [] } = data;
      const normalizeResults = results.map(film => ({ ...film, order: getIdUrl(film.url) }));
      const sortResults = normalizeResults.sort((a, b) => a.order - b.order);
      this.renderAllFilms(sortResults);
    })
    .catch(e => new Error(e));
  }

  componentDidMount() {
    this.getAllFilms();
  }

  render() {
    const { films } = this.state;

    return (
      <div>
        <div>{ films }</div>
      </div>
    );
  }
}

export default Home;