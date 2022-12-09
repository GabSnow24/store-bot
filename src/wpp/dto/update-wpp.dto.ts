import { PartialType } from '@nestjs/swagger';
import { CreateWppDto } from './create-wpp.dto';

export class UpdateWppDto extends PartialType(CreateWppDto) {}
