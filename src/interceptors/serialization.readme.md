# Serialization
- Serialization is a process that happens before objects are returned in a network response.
- This is an appropriate place to provide rules for transforming and sanitizing the data to be returned to the client
- The ClassSerializerInterceptor interceptor uses the powerful class-transformer package to provide a declarative and extensible way of transforming objects

Works
- The basic operation it performs is to take the value returned by a method handler(controller/service) and apply the instanceToPlain() function from class-transformer.

- The serialization does not apply to StreamableFile responses.

# Exclude properties
-Exclude password


import { Exclude } from 'class-transformer';

export class UserEntity {
  id: number;
  firstName: string;
  lastName: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) { // partial is ts type where not need of all fields to match
    Object.assign(this, partial);
  }
}

- controller

@UseInterceptors(ClassSerializerInterceptor)
@Get()
findOne(): UserEntity {
  return new UserEntity({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    password: 'password',
  });
}

- client receives
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe"
}



