
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}


// Date validation

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: any) {
    const date = new Date(value);

    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return date;
  }
}

// usage 
// @Post()
// create(@Body('calculationDate', ParseDatePipe) date: Date) {
//   // already Date type
// }



// Amount Validation Pipe

@Injectable()
export class AmountPipe implements PipeTransform {
  transform(value: any) {
    const num = Number(value);

    if (isNaN(num) || num < 0) {
      throw new BadRequestException('Invalid amount');
    }

    return num;
  }
}




