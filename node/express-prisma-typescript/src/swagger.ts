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
  apis: ['./src/router/*.ts'], 
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Exporta como exportaciones nombradas
export { swaggerDocs, swaggerOptions};


