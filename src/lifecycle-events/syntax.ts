import { BeforeApplicationShutdown, Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";

@Injectable()
export class DbService
  implements OnModuleInit, OnApplicationBootstrap, BeforeApplicationShutdown
{
  constructor() {
    console.log('constructor');
  }

  async onModuleInit() {
    console.log('onModuleInit: connect to DB pool');
  }

  async onApplicationBootstrap() {
    console.log('onApplicationBootstrap: app fully started');
  }

  async beforeApplicationShutdown() {
    console.log('beforeApplicationShutdown: close DB pool');
  }
}


// output

// Output on startup:
// constructor
// onModuleInit: connect to DB pool
// onApplicationBootstrap: app fully started


// On shutdown:

// beforeApplicationShutdown: close DB pool