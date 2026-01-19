import { Injectable } from "@nestjs/common";
import { Cat } from "./cat.interface";

@Injectable()
export class CatService {
    private readonly cats: Cat[] = [];

    async create(cat: Cat) {
        this.cats.push(cat);
    }

    async findAll(){
        return this.cats;
    }
}