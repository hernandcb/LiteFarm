
exports.up = function(knex) {
  return knex.schema.alterTable('crop', (t) => {
    t.string('crop_variety');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('crop', (t) => {
    t.dropColumn('crop_variety');
  });
};
