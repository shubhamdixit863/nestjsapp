export class AzureApiResponse {
    version: string;
    action: string;
    customToken: string;
    extension_extensions_app_id_CustomAttribute: string;
  
    constructor(version: string, action: string, customToken: string, extensionAttr: string) {
        this.version = version;
        this.action = action;
        this.customToken = customToken;
        this.extension_extensions_app_id_CustomAttribute = extensionAttr;
      }
  }
  