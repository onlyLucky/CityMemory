export interface SwaggerInfo {
  title: string;
  version: string;
  description?: string;
  contact?: {
    name?: string;
    email?: string;
    url?: string;
  };
  license?: {
    name: string;
    url?: string;
  };
}

export interface SwaggerServer {
  url: string;
  description?: string;
  variables?: Record<string, {
    default: string;
    description?: string;
    enum?: string[];
  }>;
}

export interface SwaggerSecurityScheme {
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  description?: string;
  name?: string;
  in?: 'query' | 'header' | 'cookie';
  scheme?: string;
  bearerFormat?: string;
  flows?: {
    implicit?: {
      authorizationUrl: string;
      refreshUrl?: string;
      scopes: Record<string, string>;
    };
    password?: {
      tokenUrl: string;
      refreshUrl?: string;
      scopes: Record<string, string>;
    };
    clientCredentials?: {
      tokenUrl: string;
      refreshUrl?: string;
      scopes: Record<string, string>;
    };
    authorizationCode?: {
      authorizationUrl: string;
      tokenUrl: string;
      refreshUrl?: string;
      scopes: Record<string, string>;
    };
  };
  openIdConnectUrl?: string;
}

export interface SwaggerSchema {
  type: string;
  properties?: Record<string, unknown>;
  required?: string[];
  items?: SwaggerSchema;
  enum?: (string | number)[];
  example?: unknown;
  description?: string;
  format?: string;
  nullable?: boolean;
  $ref?: string;
  allOf?: SwaggerSchema[];
  oneOf?: SwaggerSchema[];
  anyOf?: SwaggerSchema[];
}

export interface SwaggerComponents {
  schemas?: Record<string, SwaggerSchema>;
  securitySchemes?: Record<string, SwaggerSecurityScheme>;
  responses?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
  examples?: Record<string, unknown>;
  requestBodies?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  links?: Record<string, unknown>;
  callbacks?: Record<string, unknown>;
}

export interface SwaggerTag {
  name: string;
  description?: string;
  externalDocs?: {
    description?: string;
    url: string;
  };
}

export interface SwaggerResponse {
  description: string;
  content?: Record<string, {
    schema?: SwaggerSchema;
    example?: unknown;
    examples?: Record<string, unknown>;
  }>;
  headers?: Record<string, unknown>;
}

export interface SwaggerParameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: SwaggerSchema;
  example?: unknown;
  examples?: Record<string, unknown>;
}

export interface SwaggerRequestBody {
  description?: string;
  required?: boolean;
  content: Record<string, {
    schema?: SwaggerSchema;
    example?: unknown;
    examples?: Record<string, unknown>;
  }>;
}

export interface SwaggerOperation {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: {
    description?: string;
    url: string;
  };
  operationId?: string;
  parameters?: SwaggerParameter[];
  requestBody?: SwaggerRequestBody;
  responses?: Record<string, SwaggerResponse>;
  callbacks?: Record<string, unknown>;
  deprecated?: boolean;
  security?: Record<string, string[]>[];
  servers?: SwaggerServer[];
}

export interface SwaggerPath {
  get?: SwaggerOperation;
  put?: SwaggerOperation;
  post?: SwaggerOperation;
  delete?: SwaggerOperation;
  options?: SwaggerOperation;
  head?: SwaggerOperation;
  patch?: SwaggerOperation;
  trace?: SwaggerOperation;
  parameters?: SwaggerParameter[];
}

export interface SwaggerDocument {
  openapi: string;
  info: SwaggerInfo;
  servers?: SwaggerServer[];
  paths: Record<string, SwaggerPath>;
  components?: SwaggerComponents;
  security?: Record<string, string[]>[];
  tags?: SwaggerTag[];
  externalDocs?: {
    description?: string;
    url: string;
  };
}

export interface SwaggerOptions {
  definition: {
    openapi: string;
    info: SwaggerInfo;
    servers?: SwaggerServer[];
    components?: SwaggerComponents;
    security?: Record<string, string[]>[];
    tags?: SwaggerTag[];
  };
  apis: string[];
}
