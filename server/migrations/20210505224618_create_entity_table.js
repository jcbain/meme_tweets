
exports.up = function(knex, Promise) {
    return knex.schema.createTable('entity', (t) => {
                t.text('id').primary();
                t.text('name');
                t.text('description');
            })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('entity');
};
