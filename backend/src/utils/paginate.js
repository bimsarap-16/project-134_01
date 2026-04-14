/**
 * Build a paginated response
 * @param {Model} model - Mongoose model
 * @param {Object} filter - Query filter
 * @param {Object} query - req.query (page, limit)
 * @param {Function} populate - optional populate chain function
 */
const paginate = async (model, filter = {}, query = {}, populate = null) => {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let dbQuery = model.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });

    if (populate) {
        dbQuery = populate(dbQuery);
    }

    const [data, total] = await Promise.all([dbQuery, model.countDocuments(filter)]);

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

module.exports = paginate;
