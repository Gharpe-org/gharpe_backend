import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('shops')
  getAllShops() {
    return this.adminService.getAllShops();
  }

  @Get('orders')
  getAllOrders() {
    return this.adminService.getAllOrders();
  }

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }
}

