import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common'
import { WppService } from './wpp.service'

@Controller('wpp')
export class WppController {
    constructor(private readonly wppService: WppService) { }

    @Post()
    create() {
        return this.wppService.connAndCreate()
    }
}
