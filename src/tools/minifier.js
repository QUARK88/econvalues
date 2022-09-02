const terser = require("terser")
const fs = require("fs");

//Json minifier
(() => {
    const src_dir_name = "./src/json/"
    const dist_dir_name = "./dist/json/"
    //Blacklist
    const blacklist = ["ui-de"]

    const src_dir = fs.readdirSync(src_dir_name)
    for (const file of src_dir) {
        const split = file.split(".")
        if (split[1] == "json" && !(blacklist.includes(split[0]))) {
            const obj = JSON.parse(
                fs.readFileSync(
                    src_dir_name + file,
                    { encoding: "utf8" }
                ))
            fs.writeFileSync(
                dist_dir_name + file,
                JSON.stringify(obj),
                { encoding: "utf8" }
            )
        }
    }
})();

//js minifier
(async () => {
    const dir_name = "./dist/"
    const dir = fs.readdirSync(dir_name)
    for (const file of dir) {
        const split = file.split(".")
        if (split[1] == "js" && split[2] == undefined) {
            const raw = fs.readFileSync(
                dir_name + file,
                { encoding: "utf8" }
            )
            const map = fs.readFileSync(
                dir_name + file + ".map",
                { encoding: "utf8" }
            )
            const params = {
                compress: {
                    ecma: 2022
                },
                sourceMap: {
                    content: map,
                    url: split[0] + ".js.map"
                },
                module: true,
                toplevel: true
            }
            const min = await terser.minify(raw, params)

            fs.writeFileSync(
                dir_name + file,
                min.code,
                { encoding: "utf8" }
            )
            fs.writeFileSync(
                dir_name + file + ".map",
                min.map,
                { encoding: "utf8" }
            )
        }
    }
})()
