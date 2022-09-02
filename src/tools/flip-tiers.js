const fs = require("fs")
const ui = require("/json/ui-en.json")

for(const elm of ui.axes) {
    elm.tiers.reverse()
}

fs.writeFileSync("./ui-out.json",JSON.stringify(ui,null,4))