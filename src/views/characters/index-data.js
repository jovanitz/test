import React from 'react';
import { v4 } from 'uuid';
import { TablePagination } from '@material-ui/core';

export const renderCharacter = character => {
  const { films = [], name = '', eye_color = '', gender = '' } = character;

  const renderFilms = films.map(name => <div key={ v4() }>{ name }</div>);

  return (
    <div key={ v4() }>
      <h2>{ name }</h2>
      <h3>{ eye_color }</h3>
      <p>{ gender }</p>
      { renderFilms }
    </div>
  )
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