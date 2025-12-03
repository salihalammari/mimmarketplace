import { Controller, Get, Post, Body, Param, Patch, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(createApplicationDto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.applicationsService.findAll(status);
  }

  @Get('stats')
  getStats() {
    return this.applicationsService.getStats();
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: string) {
    return this.applicationsService.findByStatus(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string },
  ) {
    return this.applicationsService.updateStatus(id, body.status, body.notes);
  }

  @Post('test-notification')
  @HttpCode(HttpStatus.OK)
  async testNotification(@Body() body: { email: string; type?: string }) {
    return this.applicationsService.testNotification(body.email, body.type);
  }

  @Get('notification-status/:id')
  async getNotificationStatus(@Param('id') id: string) {
    return this.applicationsService.getNotificationStatus(id);
  }
}

