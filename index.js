
const path = require('path');

module.exports = class VersionPlugin {
    constructor(options) {
        this.options = options;
        this.name = this.constructor.name;
    }
    apply(compiler) {
        const { context } = compiler;
        const packagePath = path.resolve(context, 'package.json');
        const pkg = require(packagePath);
        compiler.hooks.compilation.tap(this.name, (compilation) => {
            const HtmlWebpackPlugin = (compiler.options.plugins || []).find(
                (plugin) => plugin.constructor.name === "HtmlWebpackPlugin"
            );
            if (HtmlWebpackPlugin) {
                const hook = HtmlWebpackPlugin.constructor.getHooks(compilation).afterTemplateExecution;
                hook.tapAsync(
                    this.name,
                    (data, callback) => {
                        data.html = data.html.replace('</head>', `${this.getScript(pkg.version)}\n</head>`);
                            callback()
                    }
                );
            }
        });

    }
    getScript(version) {
        return `<script>console.log("%c${version} %c${new Date().toLocaleString()}","background-color:#34495e;color:#fff;padding:0 4px;border-top-left-radius:2px;border-bottom-left-radius:2px;","background-color:#41b883;color:#fff;padding:0 4px;border-top-right-radius:2px;border-bottom-right-radius:2px;");</script>`
    }
}
