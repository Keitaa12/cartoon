import { ApiProperty } from "@nestjs/swagger";

export class ChainResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
