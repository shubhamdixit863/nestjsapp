import { Injectable } from "@nestjs/common";
import { ServiceBusClient, ServiceBusSender } from "@azure/service-bus";
import { configData } from "src/config";
import { SentryService } from "../sentry/sentry.service";

@Injectable()
export class AzureServiceBus {

    private readonly connectionString: string = configData.serviceBusString;
    private readonly topicName: string = "user";
    private sbClient: ServiceBusClient;
    private sender: ServiceBusSender;
    private readonly sentryService: SentryService


    constructor() {
        this.sbClient = new ServiceBusClient(this.connectionString);
        this.sender = this.sbClient.createSender(this.topicName);
    }

    async sendMessageBatch(messages: any[]): Promise<void> {
        try {
            let batch = await this.sender.createMessageBatch();

            for (let i = 0; i < messages.length; i++) {
                const messageBody = JSON.stringify(messages[i]);
                if (!batch.tryAddMessage({body: messageBody})) {
                    await this.sender.sendMessages(batch);
                    batch = await this.sender.createMessageBatch();
    
                    if (!batch.tryAddMessage(messages[i])) {
                        this.sentryService.logError("error senidng to the azure service bus,Message too big to fit in a batch");

                        throw new Error("Message too big to fit in a batch");
    
                    }
                }
            }
    
            await this.sender.sendMessages(batch);
            await this.sender.close();
            
        } catch (error) {
            this.sentryService.logError("error senidng to the azure service"+error);
        }
       
    }

    async execute(messages: any[]): Promise<void> {
        try {
            await this.sendMessageBatch(messages);
        } finally {
            await this.sbClient.close();
        }
    }
}
