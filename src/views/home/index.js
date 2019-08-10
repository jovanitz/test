import React, { Component } from 'react';
import axios from 'axios';
import { v4 } from 'uuid';
import { API } from '../../helpers';

const renderFilm = film => {
  const { title, episode_id, director } = film;

  return (
    <div key={ v4() }>
      <h2>{ title }</h2>
      <h3>{ episode_id }</h3>
      <p>{ director }</p>
      <a href={ `/characters/${ episode_id }` }>characters</a>
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
      const sortResults = results.sort((a, b) => a.episode_id - b.episode_id);
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