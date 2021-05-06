const data = require('../data/cities.json')

const cleanData = (data) => {
  const cleanedData = data.map((d, i) => {
    // const row = {id: i, city_name: city, lat: latitude, lng: longitude} = d;
    let row = {}
    row.id = i;
    row.city_name = d.city;
    row.lat = d.latitude;
    row.lng = d.longitude;
    return row;
  })
  return cleanedData;
}

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('cities').del()
    .then(function () {
      const cleanedCities = cleanData(data)
      return knex('cities').insert(cleanedCities);
    });
};



// console.log(cleanData(data))