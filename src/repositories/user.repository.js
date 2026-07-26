const User = require('../models/user.model');

const create = (username) => User.create({ username });
const searchByUsername = (query, limit = 5) => 
    User.find({ username: { $regex: query, $options: 'i' }}).limit(limit).lean();

module.exports = { create, searchByUsername };