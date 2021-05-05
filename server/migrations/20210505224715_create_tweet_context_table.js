
exports.up = function(knex, Promise) {
    return knex.schema.createTable('tweet_context', (t) => {
                t.text('tweet_id');
                t.integer('domain_id');
                t.text('entity_id');
                t.primary(['tweet_id', 'domain_id', 'entity_id'])
                t.foreign('tweet_id').references('id').inTable('tweets'); 
                t.foreign('domain_id').references('id').inTable('domain');
                t.foreign('entity_id').references('id').inTable('entity');   
            })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('tweet_context');
};
