
let institute = require("./院系信息.json");
let info = require("./招生数据.json");
let xlsx = require("node-xlsx");
let fs = require("fs");



function cover(New, Old) {
    let header = New[0].data[0];
    let Result = [{ data: [] }];
    if (Old == "NULL") {
        New[0].data.forEach(element => {
            if (element[header.indexOf('nf')] == 2019||element[header.indexOf('nf')] == 'nf'){
                Result[0].data.push(element);
            }});
        return Result;
    }
    New[0].data.forEach(element => {
        if (element[header.indexOf('nf')] == 2019||element[header.indexOf('nf')] == 'nf'){
            let stard;
            Old[0].data.forEach(temp => {
                if (temp[Old[0].data[0].indexOf('ksh')] == element[header.indexOf('ksh')])
                    stard = temp;
            });
            if (stard == undefined) { Result[0].data.push(element); }
            else {
                Result[0].data.push(stard);
            }
        }
    });
    return Result;
}
function toData(New) {
    let data = {};
    let i=0;
    let header = New[0].data[0];
    New[0].data.forEach((element, i) => {
        if (i > 0) {
            if (data[element[header.indexOf('ssmc')]]);
            else
                data[element[header.indexOf('ssmc')]] = {};
            if (data[element[header.indexOf('ssmc')]][element[header.indexOf('zymc')]]);
            else {
                data[element[header.indexOf('ssmc')]][element[header.indexOf('zymc')]] = {};
                data[element[header.indexOf('ssmc')]][element[header.indexOf('zymc')]]["男"] = [];
                data[element[header.indexOf('ssmc')]][element[header.indexOf('zymc')]]["女"] = [];
            }
            if (element[header.indexOf('yxmc')])
                {institute[element[header.indexOf('zymc')]][element[header.indexOf('yxmc')]].push(element);}
            else
                {data[element[header.indexOf('ssmc')]][element[header.indexOf('zymc')]][element[header.indexOf('xbmc')]].push(element);
                }
        }
    });

    return data;  //+=10
}


function dealWithAll(data) {
    let ii=0;
    Object.keys(data).forEach((area) => {//+=5
        Object.keys(data[area]).forEach((inst) => {
            Object.keys(data[area][inst]).forEach((sex) => {
                let rest = {};
                let total = 0;
                Object.keys(info[inst]).forEach((xymc, i) => {
                    rest[xymc] = (info[inst][xymc] - institute[inst][xymc].length>0?info[inst][xymc] - institute[inst][xymc].length:0.01);
                    total = total + rest[xymc];
                })
                let allPersonNum = data[area][inst][sex].length;
                let index = 0;
                let Num={};
                let temp = Object.keys(info[inst])
                let orgin=data[area][inst][sex]
                orgin = Random(orgin);
                temp = Random(temp);

                temp.forEach((v, i) => {
                    if (i == temp.length - 1) {
                        for (let y = index; y < allPersonNum; y++)
                            {institute[inst][v].push(orgin[y]);
                                console.log(ii++);
                            }
                    }
                    else {
                        let Num = Math.round(rest[v] / total * allPersonNum);
                        {
                            for (let y = index; y < index + Num; y++)
                                {institute[inst][v].push(orgin[y]);
                                    console.log(ii++);
                                }
                        }
                        index = index + Num;
                    }
                })
            })
        });

    });
}

function Random(arr) {
    let length = arr.length,
        randomIndex,
        temp;
    while (length) {
        randomIndex = Math.floor(Math.random() * (--length));
        temp = arr[randomIndex];
        arr[randomIndex] = arr[length];
        arr[length] = temp
    }
    return arr;
}

function outPut(New, toWhere) {
    let output = [];
    let header = New[0].data[0];
    output.push({
        name: "sheet1",
        data: []
    });
    output[0].data.push(header);
    Object.keys(institute).forEach((inst) => {
        Object.keys(institute[inst]).forEach((xymc) => {
            institute[inst][xymc].forEach((person) => {
                person[header.indexOf("yxmc")] = xymc;

                output[0].data.push(person);
            })
        })
    })
    let result = xlsx.build(output);
    fs.writeFile(toWhere, result, function (err) {
        if (err)
            throw err;
        console.log("finished");
    });
}
function processStudent(newFile, oldFile, toWhere) {

    let New = xlsx.parse(newFile);
    let Old;
    if (oldFile != "NULL")
        Old = xlsx.parse(oldFile);
    else {
        Old = oldFile;
    }
    let data = toData(cover(New, Old));
    dealWithAll(data);
    outPut(New, toWhere);

}


// Main("C:\\Users\\87102\\Desktop\\招办系统\\招办系统\\假数据.xlsx", "C:\\Users\\87102\\Desktop\\招办系统\\招办系统\\oldtest.xlsx", "C:\\Users\\87102\\Desktop\\招办系统\\招办系统\\test2.xlsx");
module.exports={processStudent};
