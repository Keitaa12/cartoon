import { PartialType } from "@nestjs/swagger";
import { CreateRegistrationRequestDto } from "./create-registration-request.dto";

export class UpdateRegistrationRequestDto extends PartialType(
  CreateRegistrationRequestDto,
) {}
