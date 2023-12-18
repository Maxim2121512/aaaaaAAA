import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { BrokerPurchasesService } from "./brokerPurchases.service";
import { BrokerPurchases, Purchases } from "./brokerPurchases.interface";



@Controller('api/broker-purchases')
export class BrokerPurchasesController {
    constructor(private readonly brokerPurchasesService: BrokerPurchasesService) {}

    @Get('/get/all')
    getAllPurchases() {

        return this.brokerPurchasesService.getAllPurchases();
    }

    @Get('/get/:userId')
    getBrokerPurchases(@Param('userId') userId: string): BrokerPurchases | undefined {
        return this.brokerPurchasesService.getAllPurchasesById(userId);
    }

    @Get('get/:userId/:label')
    getStockPurchasesById(@Param('userId') userId: string, @Param('label') label: string): Purchases | undefined {
        return this.brokerPurchasesService.getStockPurchasesById(userId, label);
    }

    @Put('put/:userId')
    updatePurchases(@Param('userId') userId: string, @Body() updatedPurchases: BrokerPurchases) {
        this.brokerPurchasesService.updatePurchases(userId, updatedPurchases);
    }

}