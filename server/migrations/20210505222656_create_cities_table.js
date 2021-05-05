exports.up = function(knex, Promise) {
    return knex.schema.createTable('cities', (t) => {
        t.increments('id').primary();
        t.text('city_name');
        t.double('lat');
        t.double('lng');
    }) 
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('cities');
};
