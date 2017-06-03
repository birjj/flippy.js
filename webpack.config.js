const path = require("path");

module.exports = {
    devtool: "hidden-source-map",
    entry: "./src/flippy.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "flippy.bundle.js",
        library: "flip",
        libraryTarget: "umd",
        sourceMapFilename: "maps/[file].map"
    },
    module: {
        rules: [
            { test: /.js$/,
              use: {
                  loader: "babel-loader",
                  options: { presets: ["env"] }
              }
            }
        ]
    }
};