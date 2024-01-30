import { Inject, Injectable } from "@nestjs/common";
import { configData } from "src/config";
import { Response } from "src/domain/dtos/response.dto";
import { UserDto, UserEditDto } from "src/domain/dtos/user.dto";
import { RoleRepository } from "src/domain/ports/role.repository";
import { UserRepository } from "src/domain/ports/user.repository";
import { AzureServiceBus } from "src/infrastructure/azure/azure.service_bus";
import { FileUploadService } from "src/infrastructure/azure/file.upload.service";
import { SentryService } from "src/infrastructure/sentry/sentry.service";

@Injectable()
export default class UserService {
  constructor(
    @Inject('UserRepository') private userRepo: UserRepository,
    private readonly blobStorageService: FileUploadService,
    @Inject('RoleRepository') private roleRepo: RoleRepository,
    private readonly sentryService: SentryService,
    private readonly azureServiceBus:AzureServiceBus
  ) {}

  async create(userDto:UserDto): Promise<Response> {
    try {
      const userEntity = UserDto.toEntity(userDto);
      const roleDefualt = await this.roleRepo.getRoleByName(configData.USER_DEFAULT_ROLE);
      const user = await this.userRepo.createUser(userEntity, roleDefualt.id);
      // Calling Azure Service Bus and Sending Data 
      this.sentryService.logInfo("Message Sending to Azure Service Bus create");

      this.azureServiceBus.execute([user])
      this.sentryService.logInfo("Message Sent to Azure Service Bus create");

      return new Response("success", user, null);
    } catch (error) {
      this.sentryService.logError(error);
      return new Response("failed", null, error.message);
    }
  }

  async getUserByUniqueId(uniqueId:string): Promise<Response> {
    try {
      const user = await this.userRepo.getUserByUniqueId(uniqueId);
      this.sentryService.logInfo("Message Sending to Azure Service Bus getUserByUniqueId");

      this.azureServiceBus.execute([user])
      this.sentryService.logInfo("Message Sent to Azure Service Bus getUserByUniqueId");

      return new Response("success", user, null);
    } catch (error) {
      this.sentryService.logError(error);
      return new Response("failed", null, error.message);
    }
  }

  async updateUser(uniqueId:string, userDto:UserEditDto): Promise<Response> {
    try {
      const userEntity = UserEditDto.toEntity(userDto);
      const user = await this.userRepo.updateUserByUniqueId(uniqueId, userEntity);
      this.sentryService.logInfo("Message Sending to Azure Service Bus updateUser");

      this.azureServiceBus.execute([user])
      this.sentryService.logInfo("Message Sent to Azure Service Bus updateUser");

      return new Response("success", user, null);
    } catch (error) {
      this.sentryService.logError(error);
      return new Response("failed", null, error.message);
    }
  }

  async updateUserImage(uniqueId:string, file: Express.Multer.File): Promise<Response> {
    try {
      const data = await this.blobStorageService.uploadFileToBlobStorage(file);
      const avtarUrl = `${configData.serverUrl}/azure/read?filename=${data}`;
      const result = await this.userRepo.updateProfilePic(uniqueId, avtarUrl);
      this.sentryService.logInfo("Message Sending to Azure Service Bus updateUserImage");

      this.azureServiceBus.execute([result])
      this.sentryService.logInfo("Message Sent to Azure Service Bus updateUserImage");

      
      return new Response("success", result, null);
    } catch (error) {
      this.sentryService.logError(error);
      return new Response("failed", null, error.message);
    }
  }
}
