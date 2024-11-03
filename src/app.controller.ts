import { Controller, Get, Render, Post, Body, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { LrequestDto } from './lrequest.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  @Get('leave-request')
  @Render('leave-request')
  getLeaveRequest() {
     return { errors: [], leaveData: { name: "", sDate: "", eDate: "", paidLeave: false, employeeId: "", reason: ""}};
   }

   @Post('leave-request')
   postLeaveRequest(@Body() leaveRequestDto: LrequestDto, @Res() response: Response) {
    const errors = [];

     const name = leaveRequestDto.name;
     const sDate = Date.parse(leaveRequestDto.sDate)
     const eDate = Date.parse(leaveRequestDto.eDate);
     const paidLeave = leaveRequestDto.paidLeave
     const employeeId = leaveRequestDto.employeeId
     const reason = leaveRequestDto.reason

    if (isNaN(sDate) || sDate < Date.now()) {
      errors.push({ message: "A kezdő dátum nem lehet a mai napnál régebbi!" });
    }

    if (isNaN(eDate) || eDate <= sDate) {
      errors.push({ message: "A vég dátumnak a kezdő dátumnál későbbinek kell lennie!" });
    }

    const employeeIdPattern = /^[A-Z]{3}-[1-9]{3}$/;
    if (!employeeIdPattern.test(employeeId)) {
      errors.push({ message: "Az alkalmazott azonosító formátuma hibás! Helyes formátum: BBB-SSS" });
    }

    if (!reason || reason.length < 30) {
      errors.push({ message: "Az indoklásnak minimum 30 karakter hosszúnak kell lennie!" });
    }

    if (errors.length > 0) {
      response.render('leave-request', { errors, leaveData: leaveRequestDto });
    } else {
      response.redirect('/success');
    }
  }

  @Get('success')
  @Render('success')
  getSuccess() {
    return;
  }
}