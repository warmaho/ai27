import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Pokemon extends Document {
  @Prop({
    unique: true,
    index: true,
  })
  nmbr: number;

  @Prop({
    unique: true,
    index: true,
  })
  name: string;

  @Prop()
  moves: any[];

  @Prop()
  types: any[];
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
