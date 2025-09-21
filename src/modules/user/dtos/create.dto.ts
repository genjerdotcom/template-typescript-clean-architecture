import { IsEmail, IsNotEmpty, Length, MinLength } from 'class-validator';
import { translateMessage } from '@app/shared/utils/translate.util';
import { messages } from '@app/shared/constants/messages/validation';
import { langContext } from '@app/shared/utils';

export default class CreateUserDto {
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

    @IsEmail({}, { 
        message: () => translateMessage(messages(langContext.getLang()), 'isEmail', {})
    })
    email!: string;

    @IsNotEmpty({ 
        message: () => translateMessage(messages(langContext.getLang()), 'isNotEmpty', {})
    })
    @Length(6, 100, { 
        message: () => translateMessage(messages(langContext.getLang()), 'length', { min: 6, max: 100 })
    })
    password!: string;
}
