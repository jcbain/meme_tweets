
exports.up = function(knex, Promise) {
    return knex.schema.createTable('tweet_metrics', (t) => {
                t.text('tweet_id');
                t.timestamp('collected_at');
                t.integer('retweet_count');
                t.integer('reply_count');
                t.integer('like_count');
                t.integer('quote_count');
                t.primary(['tweet_id', 'collected_at'])
                t.foreign('tweet_id').references('id').inTable('tweets');    
            })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('tweet_metrics');
};
