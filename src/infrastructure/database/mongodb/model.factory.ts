import mongoose, {
    Schema,
    SchemaDefinition,
    SchemaOptions,
    Model,
    Document
} from 'mongoose';

export type Models<T> = Model<Document & T>;

export type Documents = Document;
export function CreateModel<T>(
    name: string,
    definition: SchemaDefinition,
    options: SchemaOptions,
    indexes?: {
        fields: Record<string, 1 | -1>;
        options?: mongoose.IndexOptions;
    }[]
    ): Model<T> {
    const schema = new Schema(definition, {
        ...options,
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

    // Soft delete
    schema.add({
        deleted_at: { type: Date, default: null },
    });

    if (indexes) {
        indexes.forEach(({ fields, options }) => {
            schema.index(fields, options);
        });
    }

    return mongoose.model<T>(name, schema);
}
