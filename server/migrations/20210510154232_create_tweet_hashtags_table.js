
exports.up = function(knex, Promise) {
    return knex.schema.createTable('tweet_hashtags', (t) => {
                t.text('tweet_id');
                t.integer('hashtag_id');
                t.primary(['tweet_id', 'hashtag_id'])
                t.foreign('tweet_id').references('id').inTable('tweets'); 
                t.foreign('hashtag_id').references('id').inTable('hashtags');
            })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('tweet_hashtags');
};
