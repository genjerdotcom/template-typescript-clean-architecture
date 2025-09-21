import { errorInterceptor } from '@app/presentation/grpc/interceptors/error.interceptor';
import { grpcRequestInterceptor } from '@app/presentation/grpc/interceptors/request.interceptor';
import { grpcValidateRequest } from '@app/presentation/grpc/interceptors/validator.interceptor'
import { composeInterceptors } from '@app/presentation/grpc/interceptors/compose.interceptor';

export {
    errorInterceptor,
    grpcRequestInterceptor,
    grpcValidateRequest,
    composeInterceptors
}