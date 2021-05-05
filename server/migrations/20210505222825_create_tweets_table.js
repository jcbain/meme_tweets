
exports.up = function(knex, Promise) {
    return knex.schema.createTable('tweets', (t) => {
        t.text('id').primary();
        t.text('tweet_text');
        t.text('author_id');
        t.timestamp('created_at');
        t.string('lang', 10);
        t.boolean('possibly_sensitive');
        t.integer('city_id').references('id').inTable('cities'); ;
    }) 
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('tweets');
};
