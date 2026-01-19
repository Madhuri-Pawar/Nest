
import { Controller, Get, Query, Post, Body, Put, Param, Delete, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { CreateCatDto } from './create.cat.dto';
import type { Response } from 'express';
import { CatService } from 'src/providers/cat.service';
import { Cat } from 'src/providers/cat.interface';
import { Roles } from 'src/authorization/roles.decorator';
import { Role } from 'src/authorization/role.enum';

@Controller('cats')
export class CatsController {
    constructor(private readonly catService:CatService){}

    @Post()
    // @Roles(Role.Admin)
    async create(@Body() createCatDto: CreateCatDto) {
        this.catService.create(createCatDto);
        return 'cat created successfully';
    }

    @Get()
  async findAll(): Promise<Cat[]> {
    return this.catService.findAll();
  }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return `This action returns a #${id} cat`;
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCatDto: CreateCatDto) {
        return `This action updates a #${id} cat`;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return `This action removes a #${id} cat`;
    }

    // @Post()
    // create11(@Res() res: Response) {
    //     res.status(HttpStatus.CREATED).send();
    // }

    // @Get()
    // findAll1212(@Res() res: Response) {
    //     res.status(HttpStatus.OK).json([]);
    // }
}
