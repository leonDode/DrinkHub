import { PartialType } from "@nestjs/mapped-types";
import { CreateUsuarioDTO } from "./create_usuario.dto";


export class UpdateUsuarioDTO extends PartialType(CreateUsuarioDTO) {}