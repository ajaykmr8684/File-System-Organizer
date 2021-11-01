#!/usr/bin/env node
let inputArr = process.argv.slice(2);
let fs = require("fs");
let path = require("path")



// node main.js tree 'directoryPath'
// nide main.js organize 'directoryPath'
// node main.js help

let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', 'xz'],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xlx', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex', 'pptx'],
    app: ['exe', 'dmg', 'pkg', 'deb', 'apk'],
    images: ['PNG', 'png']
}

let command = inputArr[0];

switch(command){
    case 'tree' : 
        treeFun(inputArr[1]);
        break;
    case 'organize' :
        organizeFun(inputArr[1]);
        break;          
    case 'help' :
        helpFun();
        break;
    default:
        console.log("Input the valid command, Run 'help' for more info.")

}

function helpFun(){
    console.log(`
    Following are the valid commands:
    1. node main.js tree 'directoryPath'
    2. node main.js organize 'directoryPath'
    3. node main.js help
    `);
}

function organizeFun(dirPath){
    let destPath;
    if(dirPath == undefined){
       dirPath = process.cwd();
       
    } 
        let doPathExist = fs.existsSync(dirPath);
        if(doPathExist){
            //console.log("Thank you for entering valid path");
            destPath = path.join(dirPath, "Organized Files");
            if(!fs.existsSync(destPath)){
                fs.mkdirSync(destPath);
            }
            
        } else{
            console.log("Please enter the correct path");
        }

    

    organizeMyFiles(dirPath, destPath);

}

function organizeMyFiles(src, des){

    let childrenNames = fs.readdirSync(src);
    for(let i=0; i< childrenNames.length; i++){
        let childrenAddress = path.join(src, childrenNames[i]);
        let isAFile = fs.lstatSync(childrenAddress).isFile();
        if(isAFile){
            // console.log(childrenNames[i]);
            let category = getCategory(childrenNames[i]);
            //console.log(`${childrenNames[i]} belongs to type ${category}`);
            sendFiles(childrenAddress, des, category);
            

        }
    }

    console.log("Organized!");

}

function sendFiles(src, dest, category){
    
    let categoryPath = path.join(dest, category);
    if(!fs.existsSync(categoryPath)){
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(src);
    let destinationPath = path.join(categoryPath, fileName);
    fs.copyFileSync(src, destinationPath);
    

    //Uncomment this line if you also want to remove copied files from old folder.
    // fs.unlinkSync(src); 


}

function getCategory(param){
    let ext = path.extname(param)
    ext = ext.slice(1);
    for(let type in types){
        let typeArray = types[type];
        for(let i=0; i<typeArray.length; i++){
            if(ext == typeArray[i]){
                return type;
            } 
        }
        

    }
    return "Others";

}

function treeFun(dirPath){


    console.log("Making tree for you...")
        // let destPath;
        if (dirPath == undefined) {

            treeHelper(process.cwd(), "");
            return;
        } else {
            let doesExist = fs.existsSync(dirPath);
            if (doesExist) {
                treeHelper(dirPath, "");
            } else {
    
                console.log("Kindly enter the correct path");
                return;
            }
        }
}

function treeHelper(dirPath, indent) {
    // is file or folder
    let isFile = fs.lstatSync(dirPath).isFile();
    if (isFile == true) {
        let fileName = path.basename(dirPath);
        console.log(indent + "├──" + fileName);
    } else {
        let dirName = path.basename(dirPath)
        console.log(indent + "└──" + dirName);
        let childrens = fs.readdirSync(dirPath);
        for (let i = 0; i < childrens.length; i++) {
            let childPath = path.join(dirPath, childrens[i]);
            treeHelper(childPath, indent + "\t");
        }
    }
}
