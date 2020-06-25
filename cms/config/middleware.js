module.exports = {
    timeout: 100,
    load: {
        before: ['responseTime', 'logger', 'cors', 'responses', 'gzip'],
        order: [
            'Define the middlewares\' load order by putting their name in this array is the right order',
        ],
        after: ['parser', 'router'],
    },
    settings: {
        public: {
            path: './public',
            maxAge: 60000,
        },
        // logger: {
        //     // dev + prod
        //     level: debug + info,
        //     requests: true + false
        // }
        
        // dev
        // cors: {
        //     enabled: true,
        //     origin: ['http://localhost:3000', 'http://localhost:1337']
        // },
    },
}