export const API = 'https://swapi.co/api';

export const getIdUrl = url => {
  const urlData = url.trim();
  const sizeUrl = urlData.length;
  const id = urlData.substring(sizeUrl - 2, sizeUrl - 1);

  return id;
}