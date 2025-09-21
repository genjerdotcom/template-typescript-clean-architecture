import { messages } from '@app/shared/constants/messages/validation';
import { langContext, translateMessage } from '@app/shared/utils';
import { IsNotEmpty, Matches } from 'class-validator';

export default class DeleteUserDto {
    @IsNotEmpty({
        message: () => translateMessage(messages(langContext.getLang()), 'isNotEmpty', {})
    })
    @Matches(/^[0-9a-fA-F]{24}$/, {
        message: () => translateMessage(messages(langContext.getLang()), 'invalidMongoId', {}),
    })
    id!: string;
}
