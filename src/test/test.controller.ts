import { Body, Controller, Get, HostParam, HttpCode, Param, Post, Query, Req } from "@nestjs/common";
import { Observable, of } from "rxjs";
import { CreateCatDto } from "./test.dto";

@Controller('test')
export class TestController {

    @Get()
    findAll1(@Req() request: Request): string {
        return "This is a test controller";
    }

    @Post()
    @HttpCode(201)
    create(): string {
        return 'This action adds a new cat';
    }

    // Routes with static paths won’t work when you need to accept dynamic data as part of the reques
    @Get(':id') // http://localhost:3000/api/test/23213
    findOne(@Param() params: any): string {
        console.log(params.id);
        return `This action returns a #${params.id} cat`;
    }

    // As shown in the code, you can access the id parameter by referencing params.id.

    @Get(':id')
    findAllll(@Param('id') id: string): string {
        return `This action returns a #${id} cat`;
    }

    // Asynchronicity#
    // We love modern JavaScript, especially its emphasis on asynchronous data handling. That’s why Nest fully supports async functions.
    // Every async function must return a Promise, which allows you to return a deferred value that Nest can resolve automatically. 
    // Here's an example:

    @Get()
    async findAll11(): Promise<any[]> {
        return [];
    }

    // But Nest takes it a step further by allowing route handlers to return RxJS observable streams as well.

    @Get()
    findAll(): Observable<any[]> {
        return of([]);
    }

    // Request Body Parsing#
    // To handle POST requests that include a body payload, you can use the @Body() decorator to extract the body content and bind it to a method parameter.
    @Post()
    async create1(@Body() createCatDto: CreateCatDto) {
        return 'This action adds a new cat';
    }

    //Query parameters
    // Consider a route where we want to filter a list of cats based on query parameters like age and breed
    // GET /cats?age=2&breed=Persian
    @Get()
    async findAll111111(@Query('age') age: number, @Query('breed') breed: string) {
        return `This action returns all cats filtered by age: ${age} and breed: ${breed}`;
    }



}


// Sub-domain routing#
// The @Controller decorator can take a host option to require that the HTTP host of the incoming requests matches some specific value.

@Controller({ host: 'admin.example.com' })
export class AdminController {
    @Get()
    index(): string {
        return 'Admin page';
    }
}


// Host parameters declared in this way can be accessed using the @HostParam() decorator, which should be added to the method signature.

@Controller({ host: ':account.example.com' })
export class AccountController {
    @Get()
    getInfo(@HostParam('account') account: string) {
        return account;
    }
}








