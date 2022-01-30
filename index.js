const fs = require("fs"),
    path = require("path"),
    axios = require("axios");
const { setTimeout } = require("timers/promises");

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function translate(str) {
    return new Promise(resolve => {
        axios.get("https://translate.googleapis.com/translate_a/single?client=gtx&sl=de&tl=pl&dt=t&q=" + encodeURI(str)).then(r => {
            resolve({original: str, translated: r.data[0][0][0]});
        })
    })
        
}

function replaceit(orgarr, tinfo, newstr) {
    for (let z = 0; z < orgarr.length; z++) {
        if (orgarr[z].includes(tinfo.original)) {
            newstr = newstr.replace(tinfo.original, tinfo.translated);
            
            try {
                fs.writeFileSync("testxd.txt", newstr);
            } catch(e) {
                throw e;
            }
            break;
        }
    }
}

async function readFile(fileName) {
    const _CURRENT_PATH = path.join(__dirname, fileName);
    const trw = [];

    try {
        if (fs.existsSync(_CURRENT_PATH)) {
            const file = fs.readFileSync(_CURRENT_PATH),
                filestr = file.toString().split("''");

            for (let index = 0; index < filestr.length; index++) {
                // replace newline
                let str = filestr[index].replace(/(?:\r\n|\r|\n)/g, "");
                str = str.split('";');

                for (let x = 0; x < str.length; x++) {
                    x = x + 1;
                    let r = str[x];

                    if (r) {
                        r = r.replace('"', "");

                        if (r !== "") {
                            sleep(12000); //jebac google request timeout
                            const t = await translate(r);

                            if (t) {
                                console.log(t);

                                let strc = file.toString(),
                                    strf = strc.split(/[\r\n]+/g);

                                let stry = (fs.readFileSync("testxd.txt")).toString();

                                replaceit(strf, t, stry);

                                // console.log(strc);

                            }
                            // console.log(t);
                            // console.log(x, r, "przetlumaczone");
                        }
                        else {
                            console.log("spacja albo newline")
                        } 
                    }
                }
            }
        } else
            console.log("plik nie istnieje wypierdalaj")
    } catch(e) {
        throw e;
    }
}

readFile("gowno.txt")

// translate("ich bin");