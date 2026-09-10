import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service.js';
import { CategoryResponseDto } from './dto/category-response.dto.js';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOkResponse({ type: CategoryResponseDto, isArray: true })
  findAll() {
    return this.categoriesService.findAll();
  }
}
