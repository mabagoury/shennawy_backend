import { Connection, Schema } from 'mongoose';

type SchemaModule = Record<string, { default: unknown }>;

type SchemasRegistry = {
  [key: string]: SchemaModule | SchemasRegistry;
};

type ModelNamesRegistry = {
  [key: string]: string | ModelNamesRegistry;
};

export default function compileModels(
  connection: Connection,
  schemasRegistry: SchemasRegistry,
  modelNamesRegistry: ModelNamesRegistry,
  prefix = ''
): void {
  for (const [key, value] of Object.entries(schemasRegistry)) {
    // This full key is used to report accurate errors
    const fullKey = prefix ? `${prefix}.${key}` : key;

    // This ensures we only try to compile models using
    // schema objects, if the schema registry contains
    // other objects or functions, they are safely skipped
    if (Object.getPrototypeOf(value) === null && value.default && value.default instanceof Schema) { // this is an ES module with a Mongoose schema as the default export
      // This helps to fail fast if the model name is not registered
      // It should ideally happen at early stages of testing
      // If it would fail, it should always fail at the very first call
      const modelName = (modelNamesRegistry as Record<string, string>)[key];
      const schema = value.default;

      if (!modelName) {
        throw new Error(
          `Failed to compile models: model ${fullKey} is not registered in the model names registry`
        );
      }

      connection.model(modelName, schema);
    } else if (typeof value === 'object' && value !== null) {
      compileModels(
        connection,
        value as SchemasRegistry,
        modelNamesRegistry[key] as ModelNamesRegistry,
        fullKey
      );
    }
  }
}
