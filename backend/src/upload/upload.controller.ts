import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileDTO } from './create_file.dto';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/drinks')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: CreateFileDTO) {
    const result = await this.uploadService.upload(file);
    return result;
  }
}
