
exports.up = function(knex, Promise) {
    return knex.schema.raw('CREATE EXTENSION IF NOT EXISTS CITEXT')
        .createTable('hashtags', (t) => {
                t.increments();
                t.specificType('hashtag', 'CITEXT').unique();  
            })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('hashtags');
};
