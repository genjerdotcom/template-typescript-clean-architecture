import path from 'path';
import { ServiceDefinition, loadPackageDefinition } from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { InternalError } from '@app/shared/errors';

type GrpcServiceClientConstructor = {
    service: ServiceDefinition;
};

export function loadProto(serviceName: string, moduleName: string): ServiceDefinition {
    const protoPath = path.resolve(
        __dirname,
        `../../../modules/${moduleName.toLowerCase()}/protos/${moduleName.toLowerCase()}.proto`
    );

    const packageDefinition = protoLoader.loadSync(protoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });

    const loaded = loadPackageDefinition(packageDefinition);
    const packageName = moduleName.toLowerCase();

    const module = (loaded as Record<string, unknown>)[packageName];
    if (!module || typeof module !== 'object') {
        throw new InternalError.UnknownError('Invalid or missing gRPC module for package', { packageName });
    }

    const ServiceClient = (module as Record<string, unknown>)[serviceName];
    if (
        !ServiceClient ||
        typeof ServiceClient !== 'function' ||
        !('service' in ServiceClient)
    ) {
        throw new InternalError.UnknownError('Service definition not found for module', { moduleName });
    }

    return (ServiceClient as GrpcServiceClientConstructor).service;
}
