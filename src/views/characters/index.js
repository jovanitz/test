import React, { Component } from 'react';
import axios from 'axios';
import Loading from 'react-loading-components';
import { API, getIdUrl } from '../../helpers';
import { pagination, renderCharacter, getCharacter } from './index-data';

const PAGE_SIZE = 10;
class Characters extends Component {
  constructor() {
    super();
    this.state = {
      characters: [],
      currentCharacters: [],
      count: 0,
      page: 0,
      loading: false,
    };
  }

  getCharactersByPage = page => {
    const { characters, count } = this.state;
    const init = page * PAGE_SIZE;
    const end = init + 10;
    const realEnd = end > count ? count : end;
    const charactersPage = characters.slice(init, realEnd);
    const currentCharacters = charactersPage.map(character => renderCharacter(character));
    this.setState({ currentCharacters, page });
  }

  getCharacters = () => {
    this.setState({ loading: true });
    const { match = {} } = this.props;
    const { params = {} } = match;
    const { id = 1 } = params;
    
    axios
    .get(`${ API }/films/${ id }`)
    .then(res => {
      const { data = {} } = res;
      const { characters = [] } = data;
      const charactersData = characters.map(character => getCharacter(getIdUrl(character)));
      Promise.all(charactersData)
      .then(characters => this.setState({
        characters,
        count: characters.length,
        loading: false,
      }))
      .then(() => this.getCharactersByPage(0));
    }).catch(e => this.setState({ loading: false }));
  }

  componentDidMount() {
    this.getCharacters();
  }

  render() {
    const { currentCharacters, page, count, loading } = this.state;
    const renderPagination = !loading
      ? pagination({
          count,
          page,
          size: PAGE_SIZE,
          callback: num => this.getCharactersByPage(num)
        })
      : undefined;
    
    const renderContent = !loading
      ? currentCharacters
      : <div className='loading'>
          <Loading type='puff' width={ 60 } fill='#529404' />
        </div>;

    return (
      <div className="container">
        { renderPagination }
        { renderContent }
      </div>
    );
  }
}

export default Characters;