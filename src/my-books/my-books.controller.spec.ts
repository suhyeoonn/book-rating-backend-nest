import { Test, TestingModule } from '@nestjs/testing';
import { MyBooksController } from './my-books.controller';
import { UserBooksService } from './my-books.service';

describe('UserBooksController', () => {
  let controller: MyBooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyBooksController],
      providers: [UserBooksService],
    }).compile();

    controller = module.get<MyBooksController>(MyBooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
