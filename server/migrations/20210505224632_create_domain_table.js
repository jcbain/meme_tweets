
exports.up = function(knex, Promise) {
    return knex.schema.createTable('domain', (t) => {
                t.integer('id').primary();
                t.text('name');
                t.text('description');
            })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('domain');
};
