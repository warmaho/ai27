import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import {AuthGuard} from "../auth/auth.guard";
import {APP_GUARD} from "@nestjs/core";
import {CommonModule} from "../common/common.module";

@Module({
  controllers: [PokemonController],
  providers: [PokemonService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },],
  imports: [
    CommonModule,
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class PokemonModule {}
