import React, { Component } from 'react';
import axios from 'axios';
import { API, getIdUrl } from '../../helpers';
import { pagination, renderCharacter } from './index-data';

const PAGE_SIZE = 10;
class Characters extends Component {
  constructor() {
    super();
    this.state = {
      charactersIds: [],
      characters: [],
      count: 0,
      page: 0,
      loading: false,
    };
  }

  getCharactersByPage = page => {
    const { charactersIds, count } = this.state;
    const init = page * PAGE_SIZE;
    const end = init + 10;
    const realEnd = end > count ? count : end;
    const charactersPage = charactersIds.slice(init, realEnd);
    let gendersData = [];
    let eyeColorsData = [];
    let filmNamesData = [];

    const promises = charactersPage.map(id => {
      const response = axios.get(`${ API }/people/${ id }`).then(people => { 
        const { data = {} } = people;
        const { name = '', eye_color = '', gender = '', films = [] } = data;
        gendersData.push(gender);
        eyeColorsData.push(eye_color);

        const filmsData = films.map(film => {
          return axios.get(`${ API }/films/${ getIdUrl(film) }`).then(film => {
            const { data = {} } = film;
            const { title } = data;
            filmNamesData.push(title);

            return title;
          });
        })

        return Promise.all(filmsData).then(films => ({ films, name, eye_color, gender }));
      }).catch(() => {});
  
      return response;
    });



    Promise.all(promises).then(characters => {
      const genders = [...new Set(gendersData)];
      const eyeColors = [...new Set(eyeColorsData)];
      const filmNames = [...new Set(filmNamesData)];

      return this.setState({
        page,
        genders,
        eyeColors,
        filmNames,
        characters: characters.map(character => renderCharacter(character))
      })
    });
  }

  getCharactersIds = () => {
    const { match = {} } = this.props;
    const { params = {} } = match;
    const { id = 1 } = params;

    axios
    .get(`${ API }/films/${ id }`)
    .then(res => {
      const { data = {} } = res;
      const { characters = [] } = data;
      const charactersIds = characters.map(character => getIdUrl(character));
      this.setState({ charactersIds, count: charactersIds.length })
    })
    .then(() => this.getCharactersByPage(0))
    .catch(e => new Error(e));
  }

  componentDidMount() {
    this.getCharactersIds();
  }

  render() {
    const { characters, page, count, loading } = this.state;
    const renderPagination = !loading
      ? pagination({
          count,
          page,
          size: PAGE_SIZE,
          callback: num => this.getCharactersByPage(num)
        })
      : undefined;

    return (
      <div>
        { renderPagination }
        { characters }
      </div>
    );
  }
}

export default Characters;