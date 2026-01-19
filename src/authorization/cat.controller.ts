import { Body, Post } from "@nestjs/common";
import { Role } from "./role.enum";
import { Roles } from "./roles.decorator";

export class CatController{
@Post()
@Roles(Role.Admin)
create(@Body() createCatDto: any) {
//   this.catsService.create(createCatDto);
}
}

