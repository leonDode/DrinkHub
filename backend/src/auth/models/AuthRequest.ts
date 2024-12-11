import { Request } from "express";
import { Usuario } from "src/drinks/entities/usuario.entity";

export interface AuthRequest extends  Request{
    user: Usuario

}