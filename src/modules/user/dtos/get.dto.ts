import { IsOptional, IsString, IsNumber, IsBoolean, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export default class GetUserDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    size?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    sortBy?: string;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    descending?: string;
}
