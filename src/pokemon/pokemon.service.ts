import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {PokeResponse, PokeResponseOne} from "../seed/interfaces/poke-response.interface";
import {AxiosAdapter} from "../common/adapters/axios.adapter";

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  private defaultOffset: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,

    private readonly http: AxiosAdapter,
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit');
    this.defaultOffset = configService.get<number>('defaultOffset');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    createPokemonDto.moves = createPokemonDto.moves;
    createPokemonDto.types = createPokemonDto.types;
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = this.defaultOffset } =
      paginationDto;
    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ nmbr: 1 })
      .select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    // nmbr
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ nmbr: term });
    }
    // mongo id
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findOne({ id: term });
    }
    // name
    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase().trim(),
      });

    if (!pokemon)
      throw new NotFoundException(`Pokemon with that criteria not found!`);

    if(!pokemon.types.length){
      const extraData = await this.http.get<PokeResponseOne>(
          'https://pokeapi.co/api/v2/pokemon/'+pokemon.name,
      );

      pokemon.moves=extraData?.moves.slice(0,4) || []
      pokemon.types=extraData?.types || []

      await pokemon.updateOne(pokemon, { new: true });
    }


    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });

      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (!deletedCount)
      throw new BadRequestException(`Pokemon with id "${id}" not found!`);
  }

  async removeName(name: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ name: name });
    if (!deletedCount)
      throw new BadRequestException(`Pokemon with name "${name}" not found!`);
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    } else {
      console.error(error);
      throw new InternalServerErrorException(
        `Can´t create Pokemon - Check server logs`,
      );
    }
  }
}
