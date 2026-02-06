const Category = require('../models/Category');


async function create(data) {
  return Category.create(data);
}

async function findById(id) {
  return Category.findByPk(id);
}

async function search({ limit = 12, page = 1, fields, use_in_menu }) {
  const where = {};

  if (use_in_menu !== undefined) {
    where.use_in_menu = String(use_in_menu) === 'true' || use_in_menu === true;
  }

  const isAll = String(limit) === '-1';
  const numericLimit = Number(limit);
  const numericPage = Number(page);

  const options = { where };

  if (fields) options.attributes = String(fields).split(',');

  if (!isAll) {
    options.limit = numericLimit;
    options.offset = (numericPage - 1) * numericLimit;
  }

  const { rows, count } = await Category.findAndCountAll(options);

  return {
    data: rows,
    total: count,
    limit: isAll ? -1 : numericLimit,
    page: numericPage,
  };
}

module.exports = {
  create,
  findById,
  search,
};
