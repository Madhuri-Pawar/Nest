import { Controller, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Feature } from "./feature-flag.decorator";

@ApiTags('Payments Controller')
@Controller('payments')
@UsePipes(new ValidationPipe({ transform: true }))
export class PaymentsController {
    constructor() { }

    // @ApiQuery({ type: BorrowerLoanQueryDTO })
    // @UseGuards(BPSBorrowersLoanGuard)
    // @Get(BPSRoutes.LAST)
    // @Feature("obligated-debt") //-> key match to config & check features array includes by guard
    // async getLastPayment(@Query() dto: BorrowerLoanQueryDTO): Promise<BPSPaymentDTO> {
    //     return await this.paymentsService.getLastPayment(dto);
    // }
}