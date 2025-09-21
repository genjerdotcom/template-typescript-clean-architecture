import { IsEmail, IsNotEmpty, Length, MinLength, IsOptional, Matches } from 'class-validator';
import { translateMessage } from '@app/shared/utils/translate.util';
import { messages } from '@app/shared/constants/messages/validation';
import { langContext } from '@app/shared/utils';

export default class UpdateUserDto {
    @IsNotEmpty({
        message: () => translateMessage(messages(langContext.getLang()), 'isNotEmpty', {})
    })
    @Matches(/^[0-9a-fA-F]{24}$/, {
        message: () => translateMessage(messages(langContext.getLang()), 'invalidMongoId', {}),
    })
    id!: string;

    @IsOptional()
    @IsNotEmpty({
        message: () => translateMessage(messages(langContext.getLang()), 'isNotEmpty', {})
    })
    @MinLength(10, {
        message: () => translateMessage(messages(langContext.getLang()), 'minLength', { min: 10 }),
    })    
    @Length(3, 20, { 
        message: () => translateMessage(messages(langContext.getLang()), 'length', { min: 3, max: 20 }),
    })
    username!: string;

    @IsOptional()
    @IsEmail({}, { 
        message: () => translateMessage(messages(langContext.getLang()), 'isEmail', {})
    })
    email!: string;

    @IsOptional()
    @IsNotEmpty({ 
        message: () => translateMessage(messages(langContext.getLang()), 'isNotEmpty', {})
    })
    @Length(6, 100, { 
        message: () => translateMessage(messages(langContext.getLang()), 'length', { min: 6, max: 100 })
    })
    password!: string;
}
