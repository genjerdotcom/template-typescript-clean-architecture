"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const errors_1 = require("../../../shared/errors");
const mongoose_1 = require("mongoose");
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async aggregatePaginated(data) {
        try {
            const { page = 1, size = 10, sortBy = 'created_at', descending = true, ...filters } = data;
            const currentPage = Number(page) || 1;
            const limit = Number(size) || 10;
            const match = {};
            Object.entries(filters).forEach(([key, value]) => {
                if (typeof value === 'string' && value.trim() !== '') {
                    match[key] = { $regex: value, $options: 'i' };
                }
            });
            const sort = {
                [sortBy]: descending === 'true' ? -1 : 1,
            };
            const pipeline = [
                { $match: match },
                {
                    $facet: {
                        results: [
                            { $sort: sort },
                            { $skip: (currentPage - 1) * limit },
                            { $limit: limit },
                        ],
                        count: [{ $count: 'total' }],
                    },
                },
                {
                    $project: {
                        results: 1,
                        count: { $ifNull: [{ $arrayElemAt: ['$count.total', 0] }, 0] },
                    },
                },
            ];
            const result = await this.model.aggregate(pipeline).collation({ locale: 'en' });
            return result[0];
        }
        catch (error) {
            throw new errors_1.InternalError.FindResourceError(`get aggregate paginate ${this.model.modelName}`, data, error);
        }
    }
    async find(filter = {}, options, projection, sort, limit, skip, session) {
        let query = this.model.find(filter, projection, { ...options, sort, session });
        if (typeof limit === 'number')
            query = query.limit(limit);
        if (typeof skip === 'number')
            query = query.skip(skip);
        return query.exec();
    }
    async findOne(filter, projection, session) {
        try {
            const query = this.model.findOne(filter, projection);
            if (session) {
                query.session(session);
            }
            return await query.exec();
        }
        catch (error) {
            throw new errors_1.InternalError.FindResourceError(`find user ${this.model.modelName}`, filter, error);
        }
    }
    async create(data, session) {
        try {
            const instance = new this.model(data);
            return await instance.save({ session });
        }
        catch (error) {
            throw new errors_1.InternalError.CreateResourceError(`create ${this.model.modelName}`, data, error);
        }
    }
    async upsert(filter, update, options, session) {
        try {
            return this.model
                .findOneAndUpdate(filter, update, {
                ...options,
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
                session,
            })
                .exec();
        }
        catch (error) {
            throw new errors_1.InternalError.CreateResourceError(`create ${this.model.modelName}`, filter, error);
        }
    }
    async findOneAndUpdate(filter, data, options, session) {
        try {
            const updateOptions = { new: true, ...options };
            if (session)
                updateOptions.session = session;
            return this.model.findOneAndUpdate(filter, data, updateOptions).exec();
        }
        catch (error) {
            throw new errors_1.InternalError.UpdateResourceError(`update ${this.model.modelName}`, data, error);
        }
    }
    async findOneAndDelete(filter, options) {
        try {
            return this.model.findOneAndDelete(filter, options).exec();
        }
        catch (error) {
            throw new errors_1.InternalError.DeleteResourceError(`delete ${this.model.modelName}`, filter, error);
        }
    }
    async findById(id, session) {
        try {
            return await this.model.findById(new mongoose_1.Types.ObjectId(id)).session(session ?? null).exec();
        }
        catch (error) {
            throw new errors_1.InternalError.FindResourceError(`find ${this.model.modelName}`, { _id: new mongoose_1.Types.ObjectId(id) }, error);
        }
    }
    async findByIdAndUpdate(id, data, options) {
        try {
            return this.model
                .findByIdAndUpdate(id, data, { new: true, ...options })
                .exec();
        }
        catch (error) {
            throw new errors_1.InternalError.UpdateResourceError(`update ${this.model.modelName}`, data, error);
        }
    }
    async findByIdAndDelete(id, options) {
        try {
            return this.model.findByIdAndDelete(new mongoose_1.Types.ObjectId(id), { ...options }).exec();
        }
        catch (error) {
            throw new errors_1.InternalError.DeleteResourceError(`delete ${this.model.modelName}`, { _id: new mongoose_1.Types.ObjectId(id) }, error);
        }
    }
    async count(filter = {}) {
        try {
            return this.model.countDocuments(filter).exec();
        }
        catch (error) {
            throw new errors_1.InternalError.FindResourceError(`count ${this.model.modelName}`, filter, error);
        }
    }
    async distinct(key, filter = {}) {
        try {
            return this.model.distinct(String(key), filter).exec();
        }
        catch (error) {
            throw new errors_1.InternalError.FindResourceError(`distinct ${this.model.modelName}`, filter, error);
        }
    }
    async updateMany(filter, update, options) {
        try {
            return this.model.updateMany(filter, update, options).exec();
        }
        catch (error) {
            throw new errors_1.InternalError.UpdateResourceError(`update ${this.model.modelName}`, update, error);
        }
    }
    async updateOne(filter, data, options, session) {
        try {
            return this.model.updateOne(filter, data, { ...options, session }).exec();
        }
        catch (error) {
            throw new errors_1.InternalError.UpdateResourceError(`update ${this.model.modelName}`, data, error);
        }
    }
    async deleteMany(filter, options) {
        try {
            return this.model.deleteMany(filter, options).exec();
        }
        catch (error) {
            throw new errors_1.InternalError.DeleteResourceError(`delete many ${this.model.modelName}`, filter, error);
        }
    }
    async deleteOne(filter, options) {
        try {
            return this.model.deleteOne(filter, options).exec();
        }
        catch (error) {
            throw new errors_1.InternalError.DeleteResourceError(`delete one ${this.model.modelName}`, filter, error);
        }
    }
    async findByIds(ids) {
        try {
            const objectIds = ids.map((id) => new mongoose_1.Types.ObjectId(id));
            return this.model.find({ _id: { $in: objectIds } }).exec();
        }
        catch (error) {
            throw new errors_1.InternalError.FindResourceError(`find ${this.model.modelName}`, { _id: { $in: ids } }, error);
        }
    }
    async findOneOrCreate(filter, data, options) {
        try {
            return this.model
                .findOneAndUpdate(filter, data, { new: true, upsert: true, ...options })
                .exec();
        }
        catch (error) {
            throw new errors_1.InternalError.FindResourceError(`find or create ${this.model.modelName}`, filter, error);
        }
    }
    async findDistinct(field, filter) {
        try {
            return this.model.distinct(String(field), filter).exec();
        }
        catch (error) {
            throw new errors_1.InternalError.FindResourceError(`distinct ${this.model.modelName}`, filter, error);
        }
    }
    async findAndUpdate(filter, data, options, multi = false, session) {
        try {
            const updateMethod = multi ? 'updateMany' : 'updateOne';
            const query = this.model[updateMethod](filter, data, { ...options, session });
            return await query.exec();
        }
        catch (error) {
            throw new errors_1.InternalError.UpdateResourceError(`update ${this.model.modelName}`, data, error);
        }
    }
    async findAndUpdateMany(filter, data, options) {
        try {
            return this.model.updateMany(filter, data, options ?? {}).exec();
        }
        catch (error) {
            throw new errors_1.InternalError.UpdateResourceError(`update ${this.model.modelName}`, data, error);
        }
    }
    async findAndUpdateOne(filter, data, options) {
        try {
            return this.model.updateOne(filter, data, options).exec();
        }
        catch (error) {
            throw new errors_1.InternalError.UpdateResourceError(`update ${this.model.modelName}`, data, error);
        }
    }
    async findOneAndReplace(filter, replacement, options) {
        try {
            return this.model.findOneAndReplace(filter, replacement, options ?? {}).exec();
        }
        catch (error) {
            throw new errors_1.InternalError.FindResourceError(`find and replace ${this.model.modelName}`, filter, error);
        }
    }
    async aggregate(pipeline) {
        try {
            return this.model.aggregate(pipeline).exec();
        }
        catch (error) {
            throw new errors_1.InternalError.FindResourceError(`aggregate ${this.model.modelName}`, pipeline, error);
        }
    }
    async insertMany(data, options) {
        try {
            return await this.model.insertMany(data, options ?? {});
        }
        catch (error) {
            throw new errors_1.InternalError.CreateResourceError(`insert many ${this.model.modelName}`, data, error);
        }
    }
    async bulkWrite(operations, options) {
        try {
            return await this.model.bulkWrite(operations, options);
        }
        catch (error) {
            throw new errors_1.InternalError.CreateResourceError(`bulk write ${this.model.modelName}`, operations, error);
        }
    }
}
exports.BaseRepository = BaseRepository;
