const pug = require("pug")
const fs = require("fs")

const dirName = "./src/views/"
const viewsDir = fs.readdirSync(dirName)

const params = {
    version : process.env.npm_package_version,
    discord : false
}


for(const file of viewsDir) {
    const split = file.split(".")
    if(split[1] === "pug") {
        const html = pug.renderFile(dirName+file,params)
        fs.writeFileSync(`./${split[0]}.html`,html)
    }
}

