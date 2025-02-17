import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'This is the API documentation for our project.',
    },
  },
  apis: [
    './src/domains/post/controller/*.ts',
    './src/domains/user/controller/*.ts',
    './src/domains/auth/controller/*.ts',
    './src/domains/health/controller/*.ts,',
    './src/domains/follower/controller/*.ts',
    './src/domains/reaction/controller/*.ts',
    './src/domains/comment/controller/*.ts',
    './src/domains/message/controller/*.ts',
  ],
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
