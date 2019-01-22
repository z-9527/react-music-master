const path = require('path')

module.exports = {
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
}

//webpack配置别名后让webpack提供代码提示功能