import { IsNotEmpty, Length, MinLength } from 'class-validator';
import { translateMessage } from '@app/shared/utils/translate.util';
import { messages } from '@app/shared/constants/messages/validation';
import { langContext } from '@app/shared/utils';

export default class CreateProductDto {
    @IsNotEmpty({
        message: () => translateMessage(messages(langContext.getLang()), 'isNotEmpty', {})
    })
    @MinLength(10, {
        message: () => translateMessage(messages(langContext.getLang()), 'minLength', { min: 10 }),
    })    
    @Length(3, 20, { 
        message: () => translateMessage(messages(langContext.getLang()), 'length', { min: 3, max: 20 }),
    })
    code!: string;

    @IsNotEmpty({
        message: () => translateMessage(messages(langContext.getLang()), 'isNotEmpty', {})
    })
    @MinLength(10, {
        message: () => translateMessage(messages(langContext.getLang()), 'minLength', { min: 10 }),
    })
    name!: string;

    @IsNotEmpty({ 
        message: () => translateMessage(messages(langContext.getLang()), 'isNotEmpty', {})
    })
    price!: number;
}
