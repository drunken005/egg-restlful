require('egg').startCluster({
    baseDir: __dirname,
    port: process.env.PORT || 4000, // default to 4000
});