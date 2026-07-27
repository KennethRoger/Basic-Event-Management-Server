const User = require('../models/user.model');

const create = (username) => User.create({ username });
const findById = (userId) => User.findById(userId).lean();
const findManyByIds = (userIds) => User.find({ _id: { $in: userIds } }).lean();
const findByUsername = (username) => User.findOne({ username }).lean();
const searchByUsername = (query, limit = 5) => 
    User.find({ username: { $regex: query, $options: 'i' }}).limit(limit).lean();

module.exports = { 
    create,
    findById,
    findManyByIds,
    findByUsername,
    searchByUsername
};