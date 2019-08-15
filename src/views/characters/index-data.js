import React from 'react';
import { v4 } from 'uuid';
import axios from 'axios';
import { TablePagination } from '@material-ui/core';
import { API, getIdUrl } from '../../helpers';

export const renderCharacter = character => {
  const { films = [], name = '', eye_color = '', gender = '' } = character;

  const renderFilms = films.map(name => <div key={ v4() }>{ name }</div>);

  return (
    <div className="card" key={ v4() }>
      <h2>{ name }</h2>
      <h3>{ eye_color }</h3>
      <p>{ gender }</p>
      { renderFilms }
    </div>
  )
}

export const getCharacter = character => {
  let gendersData = [];
  let eyeColorsData = [];
  let filmNamesData = [];
  const response = axios.get(`${ API }/people/${ character }`).then(people => { 
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
}

export const pagination = ({ count = 0, page = 0, size, callback = () => {} } = {}) =>
  <div className="pagination">
    <TablePagination
      component="div"
      count={ count }
      rowsPerPage={ size }
      page={ page }
      backIconButtonProps={{
        'aria-label': 'Previous Page',
      }}
      nextIconButtonProps={{
        'aria-label': 'Next Page',
      }}
      onChangePage={ (e, num) => callback(num) }
      rowsPerPageOptions={ [] }
      labelDisplayedRows={
        ({ from, to, count }) => `${ from }-${ to } de ${ count }`
      }
    />
  </div>;