import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Infoware API Documentation",
            version: "1.0.0",
            description: "API documentation for the Infoware backend",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local Development Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }], 
    },
    apis: ["./src/routes/*.ts"], 
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);