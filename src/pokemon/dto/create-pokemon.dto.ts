import {IsString, IsInt, MinLength, IsPositive, Min, IsArray} from 'class-validator';

export class CreatePokemonDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  nmbr: number;

  @IsString()
  @MinLength(1)
  name: string;

  @IsArray()
  moves: string[];

  @IsArray()
  types: string[];
}
