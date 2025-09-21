import { InternalError } from '@app/shared/errors';
import { PaginatedResult, PaginationOptions } from '@app/shared/types';
import {
    Document,
    FilterQuery,
    Model,
    PipelineStage,
    QueryOptions,
    UpdateQuery,
    UpdateWriteOpResult,
    DeleteResult,
    UpdateResult,
    InsertManyOptions,
    MongooseBulkWriteOptions,
    Types,
    ClientSession,
    mongo
} from 'mongoose';

type SafeQueryOptions<T> = Omit<QueryOptions<T>, 'session'> & {
    session?: ClientSession;
};

type AnyBulkWriteOperation<T> = Parameters<Model<T>['bulkWrite']>[0][number];
type BulkWriteResult = mongo.BulkWriteResult;

export abstract class BaseRepository<T extends Document> {
    constructor(protected readonly model: Model<T>) {}

    async aggregatePaginated(
        data: PaginationOptions & Partial<Record<keyof T, unknown>>
    ): Promise<PaginatedResult<T>> {
        try {
            const {
                page = 1,
                size = 10,
                sortBy = 'created_at',
                descending = true,
                ...filters
            } = data;

            const currentPage = Number(page) || 1;
            const limit = Number(size) || 10;

            const match: Record<string, unknown> = {};

            Object.entries(filters).forEach(([key, value]) => {
                if (typeof value === 'string' && value.trim() !== '') {
                    match[key] = { $regex: value, $options: 'i' };
                }
            });

            const sort: Record<string, 1 | -1> = {
                [sortBy]: descending === 'true' ? -1 : 1,
            };

            const pipeline: PipelineStage[] = [
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
            return result[0] as PaginatedResult<T>;
        } catch (error) {
            throw new InternalError.FindResourceError(`get aggregate paginate ${this.model.modelName}`, data, error as Error);
        }
    }
    
    async find(
        filter: FilterQuery<T> = {},
        options?: QueryOptions,
        projection?: Record<string, unknown>,
        sort?: { [key: string]: 1 | -1 },
        limit?: number,
        skip?: number,
        session?: ClientSession,
    ): Promise<T[] | null> {
        let query = this.model.find(filter, projection, { ...options, sort, session });

        if (typeof limit === 'number') query = query.limit(limit);
        if (typeof skip === 'number') query = query.skip(skip);

        return query.exec();
    }

    async findOne(
        filter: FilterQuery<T>,
        projection?: Record<string, unknown>,
        session?: ClientSession,
    ): Promise<T | null> {
        try {
            const query = this.model.findOne(filter, projection);
            if (session) {
                query.session(session);
            }
            return await query.exec();
        } catch (error) {
            throw new InternalError.FindResourceError(`find user ${this.model.modelName}`, filter, error as Error);
        }
    }

    async create(data: Partial<T>, session?: ClientSession): Promise<T> {
        try {
            const instance = new this.model(data);
            return await instance.save({ session });
        } catch (error) {
            throw new InternalError.CreateResourceError(`create ${this.model.modelName}`, data, error as Error);
        }
    }

    async upsert(
        filter: FilterQuery<T>,
        update: UpdateQuery<T>,
        options?: QueryOptions,
        session?: ClientSession,
    ): Promise<T | null> {
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
        } catch (error) {
            throw new InternalError.CreateResourceError(`create ${this.model.modelName}`, filter, error as Error);
        }
    }

    async findOneAndUpdate(
        filter: FilterQuery<T>,
        data: UpdateQuery<unknown>,
        options?: QueryOptions,
        session?: ClientSession,
    ): Promise<T | null> {
        try {
            const updateOptions: QueryOptions = { new: true, ...options };
            if (session) updateOptions.session = session;
            return this.model.findOneAndUpdate(filter, data, updateOptions).exec();
        } catch (error) {
            throw new InternalError.UpdateResourceError(`update ${this.model.modelName}`, data, error as Error);
        }
    }

    async findOneAndDelete(
        filter: FilterQuery<T>,
        options?: QueryOptions,
    ): Promise<T | null> {
        try {
            return this.model.findOneAndDelete(filter, options).exec();
        } catch (error) {
            throw new InternalError.DeleteResourceError(`delete ${this.model.modelName}`, filter, error as Error);
        }
    }

    async findById(id: string, session?: ClientSession): Promise<T | null> {
        try {
            return await this.model.findById(new Types.ObjectId(id)).session(session ?? null).exec();
        } catch (error) {
            throw new InternalError.FindResourceError(`find ${this.model.modelName}`, { _id: new Types.ObjectId(id) }, error as Error);
        }
    }

    async findByIdAndUpdate(
        id: Types.ObjectId,
        data: UpdateQuery<unknown>,
        options?: QueryOptions,
    ): Promise<T | null> {
        try {
            return this.model
            .findByIdAndUpdate(id, data, { new: true, ...options })
            .exec();
        } catch (error) {
            throw new InternalError.UpdateResourceError(`update ${this.model.modelName}`, data, error as Error);
        }
    }

    async findByIdAndDelete(
        id: string,
        options?: QueryOptions,
    ): Promise<T | null> {
        try {
            return this.model.findByIdAndDelete(new Types.ObjectId(id), {...options}).exec();
        } catch (error) {
            throw new InternalError.DeleteResourceError(`delete ${this.model.modelName}`, { _id: new Types.ObjectId(id) }, error as Error);
        }
    }

    async count(filter: FilterQuery<T> = {}): Promise<number> {
        try {
            return this.model.countDocuments(filter).exec();
        } catch (error) {
            throw new InternalError.FindResourceError(`count ${this.model.modelName}`, filter, error as Error);
        }
    }

    async distinct<K extends keyof T>(
        key: K,
        filter: FilterQuery<T> = {},
    ): Promise<T[K][]> {
        try {
            return this.model.distinct(String(key), filter).exec() as Promise<T[K][]>; 
        } catch (error) {
            throw new InternalError.FindResourceError(`distinct ${this.model.modelName}`, filter, error as Error);
        }
    }

    async updateMany(
        filter: FilterQuery<T>,
        update: UpdateQuery<T>,
        options?: SafeQueryOptions<T>
    ): Promise<UpdateWriteOpResult> {
        try {
            return this.model.updateMany(filter, update, options).exec();
        } catch (error) {
            throw new InternalError.UpdateResourceError(`update ${this.model.modelName}`, update, error as Error);
        }
    }

    async updateOne(
        filter: FilterQuery<T>,
        data: UpdateQuery<unknown>,
        options?: SafeQueryOptions<T>,
        session?: ClientSession,
    ): Promise<UpdateWriteOpResult> {
        try {
            return this.model.updateOne(filter, data, { ...options, session }).exec();
        } catch (error) {
            throw new InternalError.UpdateResourceError(`update ${this.model.modelName}`, data, error as Error);
        }
    }

    async deleteMany(filter: FilterQuery<T>, options?: SafeQueryOptions<T>): Promise<DeleteResult> {
        try {
            return this.model.deleteMany(filter, options).exec();
        } catch (error) {
            throw new InternalError.DeleteResourceError(`delete many ${this.model.modelName}`, filter, error as Error);
        }
    }

    async deleteOne(filter: FilterQuery<T>, options?: SafeQueryOptions<T>): Promise<DeleteResult> {
        try {
            return this.model.deleteOne(filter, options).exec();
        } catch (error) {
            throw new InternalError.DeleteResourceError(`delete one ${this.model.modelName}`, filter, error as Error);
        }
    }

    async findByIds(ids: string[]): Promise<T[]> {
        try {
            const objectIds = ids.map((id) => new Types.ObjectId(id));
            return this.model.find({ _id: { $in: objectIds } }).exec();
        } catch (error) {
            throw new InternalError.FindResourceError(`find ${this.model.modelName}`, { _id: { $in: ids } }, error as Error);
        }
    }

    async findOneOrCreate(
        filter: FilterQuery<T>,
        data: Record<string, T>,
        options?: QueryOptions,
    ): Promise<T | null> {
        try {
            return this.model
            .findOneAndUpdate(filter, data, { new: true, upsert: true, ...options })
            .exec();
        } catch (error) {
            throw new InternalError.FindResourceError(`find or create ${this.model.modelName}`, filter, error as Error);
        }
    }

    async findDistinct<K extends keyof T>(
        field: K,
        filter: FilterQuery<T>
    ): Promise<T[K][]> {
        try {
            return this.model.distinct(String(field), filter).exec() as Promise<T[K][]>; 
        } catch (error) {
            throw new InternalError.FindResourceError(`distinct ${this.model.modelName}`, filter, error as Error);
        }
    }

    async findAndUpdate(
        filter: FilterQuery<T>,
        data: UpdateQuery<unknown>,
        options?: SafeQueryOptions<T>,
        multi = false,
        session?: ClientSession
    ): Promise<UpdateResult | UpdateWriteOpResult> {
        try {
            const updateMethod = multi ? 'updateMany' : 'updateOne';
            const query = this.model[updateMethod](filter, data, { ...options, session });
            return await query.exec();
        } catch (error) {
            throw new InternalError.UpdateResourceError(`update ${this.model.modelName}`, data, error as Error);
        }
    }
    
    async findAndUpdateMany(
        filter: FilterQuery<T>,
        data: UpdateQuery<T>,
        options?: SafeQueryOptions<T>
    ): Promise<UpdateResult> {
        try {
            return this.model.updateMany(filter, data, options ?? {}).exec();
        } catch (error) {
            throw new InternalError.UpdateResourceError(`update ${this.model.modelName}`, data, error as Error);
        }
    }

    async findAndUpdateOne(
        filter: FilterQuery<T>,
        data: UpdateQuery<unknown>,
        options?: SafeQueryOptions<T>,
    ): Promise<UpdateResult> {
        try {
            return this.model.updateOne(filter, data, options).exec();
        } catch (error) {
            throw new InternalError.UpdateResourceError(`update ${this.model.modelName}`, data, error as Error);
        }
    }

    async findOneAndReplace(
        filter: FilterQuery<T>,
        replacement: T,
        options?: SafeQueryOptions<T>,
    ): Promise<T | null> {
        try {
            return this.model.findOneAndReplace(filter, replacement, options ?? {}).exec();
        } catch (error) {
            throw new InternalError.FindResourceError(`find and replace ${this.model.modelName}`, filter, error as Error);
        }
    }

    async aggregate<TResult = unknown>(pipeline: PipelineStage[]): Promise<TResult[]> {
        try {
            return this.model.aggregate<TResult>(pipeline).exec();
        } catch (error) {
            throw new InternalError.FindResourceError(`aggregate ${this.model.modelName}`, pipeline, error as Error);
        }
    }

    async insertMany(data: T[], options?: InsertManyOptions): Promise<T[]> {
        try {
            return await this.model.insertMany(data, options ?? {});
        } catch (error) {
            throw new InternalError.CreateResourceError(`insert many ${this.model.modelName}`, data, error as Error);
        }
    }

    async bulkWrite(operations: AnyBulkWriteOperation<T>[], options?: MongooseBulkWriteOptions): Promise<BulkWriteResult> {
        try {
            return await this.model.bulkWrite(operations, options);
        } catch (error) {
            throw new InternalError.CreateResourceError(`bulk write ${this.model.modelName}`, operations, error as Error);
        }
    }
}
