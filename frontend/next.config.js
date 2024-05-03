/** @type {import('next').NextConfig} */

const nextConfig = {
    async rewrites() {
        const BASE_API_URL = "https://apigenerator-backend.atulmorchhlay.com"
        return [
            {
                source: "/api/authentication/verify",
                destination: `${BASE_API_URL}/api/authentication/verify`,
            },
            {
                source: "/api/authentication/login",
                destination: `${BASE_API_URL}/api/authentication/login`,
            },
            {
                source: "/api/authentication/signup",
                destination: `${BASE_API_URL}/api/authentication/signup`,
            },
            {
                source: "/api/api-generator/:id*",
                destination: `${BASE_API_URL}/api/api-generator/:id*`,
            },
            {
                source: "/api/account-details/:id*",
                destination: `${BASE_API_URL}/api/account-details/:id*`,
            },
            {
                source: "/api/project/:id*",
                destination: `${process.env.BASE_API_URL}/api/project/:id*`,
            },
            {
                source: "/api/payment/:id*",
                destination: `${process.env.BASE_API_URL}/api/payment/:id*`,
            }
        ];
    },
    env: {
        API_URL: process.env.API_URL,
        BASE_API_URL: process.env.BASE_API_URL
    }
}

module.exports = nextConfig
