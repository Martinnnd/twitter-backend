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
  apis: ['./src/domains/post/controller/*.ts', './src/domains/user/controller/*.ts'], 
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);



