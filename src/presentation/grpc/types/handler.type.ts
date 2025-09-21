import { UntypedServiceImplementation, ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';

export type GrpcHandler<TReq, TRes> = (
    call: ServerUnaryCall<TReq, TRes>,
    callback: sendUnaryData<TRes>
) => Promise<void>;

export interface GrpcHandlerGroup {
    moduleName: string;
    serviceName: string;
    handlers:  UntypedServiceImplementation;
}