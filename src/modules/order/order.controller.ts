import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  Put,
  HttpCode,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Order } from './entities/order.entity';
import { ParsePositiveIntPipe } from '@/common/pipe/parse-positive-int.pipe';
import { Role } from '@/common/enum/role.enum';
import { ProcessOrderDto } from './dto/process-order.dto';
import { CommentOrderDto } from './dto/comment-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { AssignOrderDto } from './dto/assign-order.dto';
import { FinishOrderDto } from './dto/finish-order.dto';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiPaginatedResponse,
  ApiResponse,
  ApiUnauthorizedResponse,
  Auth,
} from '@/common/decorators';

@ApiBearerAuth()
@ApiUnauthorizedResponse()
@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({
    summary: '创建一个报修订单(仅用户)',
    operationId: 'createOrder',
  })
  @ApiResponse(Order, HttpStatus.CREATED)
  @ApiForbiddenResponse()
  @Auth(Role.User)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @ApiPaginatedResponse(Order)
  @ApiOperation({ summary: '分页查询报修订单', operationId: 'getAllOrder' })
  @Auth()
  @Get()
  findAll(@Query() queryOrderDto: QueryOrderDto) {
    return this.orderService.findAll(queryOrderDto);
  }

  @ApiOperation({ summary: '根据id查询订单', operationId: 'getOrderById' })
  @ApiNotFoundResponse()
  @ApiResponse(Order)
  @Get(':orderId')
  @Auth()
  findOne(@Param('orderId', ParsePositiveIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  // @ApiOperation({ summary: '更新订单信息(管理员)' })
  // @ApiForbiddenResponse()
  // @ApiNotFoundResponse()
  // @ApiResponse(Order)
  // @Put(':orderId')
  // @Patch(':orderId')
  // update(
  //   @Param('orderId', ParsePositiveIntPipe)
  //   id: number,
  //   @Body()
  //   updateOrderDto: UpdateOrderDto,
  // ) {
  //   return this.orderService.update(id, updateOrderDto);
  // }

  @ApiOperation({ summary: '审核订单(管理员)', operationId: 'processOrder' })
  @ApiResponse(Order)
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @Patch('process/:orderId')
  @Put('process/:orderId')
  @Auth(Role.Admin)
  process(
    @Param('orderId', ParsePositiveIntPipe)
    id: number,
    @Body()
    processOrderDto: ProcessOrderDto,
  ) {
    return this.orderService.process(id, processOrderDto);
  }

  @ApiOperation({ summary: '评论订单(用户)', operationId: 'commentOrder' })
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiResponse(Order)
  @Auth(Role.User)
  // @Patch('comment/:orderId')
  // @Put('comment/:orderId')
  @HttpCode(HttpStatus.OK)
  @Post('comment/:orderId')
  comment(
    @Param('orderId', ParsePositiveIntPipe) id: number,
    @Body()
    commentOrderDto: CommentOrderDto,
  ) {
    return this.orderService.comment(id, commentOrderDto);
  }

  @ApiOperation({ summary: '分配订单(管理员)', operationId: 'assignOrder' })
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiResponse(Order)
  @Auth(Role.Admin)
  @Patch('assign/:orderId')
  @Put('assign/:orderId')
  assign(
    @Param('orderId', ParsePositiveIntPipe) id: number,
    @Body() assignOrderDto: AssignOrderDto,
  ) {
    return this.orderService.assign(id, assignOrderDto);
  }

  @ApiOperation({ summary: '完成订单(维修工)', operationId: 'finishOrder' })
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiResponse(Order)
  @Auth(Role.Repairman)
  // @Patch('finish/:orderId')
  @Put('finish/:orderId')
  finish(
    @Param('orderId', ParsePositiveIntPipe) id: number,
    @Body() finishOrderDto: FinishOrderDto,
  ) {
    return this.orderService.finish(id, finishOrderDto);
  }

  @ApiOperation({ summary: '删除订单(用户)', operationId: 'deleteOrder' })
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiResponse(Order)
  @Auth(Role.User)
  @Delete(':orderId')
  remove(
    @Param('orderId', ParsePositiveIntPipe)
    id: number,
  ) {
    return this.orderService.remove(id);
  }
}
