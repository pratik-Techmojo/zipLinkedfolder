const AdmZip = require("adm-zip");
const fs = require("fs").promises;

const ZIPLOCATION = "../test.zip";

async function checkFileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function createZipArchive() {
  try {
    const zip = new AdmZip();
    const outputFile = ZIPLOCATION;
    zip.addLocalFolder("../CSV_Storage");
    zip.writeZip(outputFile);
    console.log(`Created ${outputFile} successfully`);
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
}

async function readZipArchive(filepath) {
    try {
        const zip = new AdmZip(filepath);

        for (const zipEntry of zip.getEntries()) {
            console.log(zipEntry.toString());
        }
    } catch (e) {
        console.log(`Something went wrong. ${e}`);
    }
}

async function updateZipArchive(filePath,zipPath=ZIPLOCATION) {

    try {

        const zipExists = await checkFileExists(zipPath);

        if(!zipExists) {
            await createZipArchive();
        }

        const zip = new AdmZip(zipPath);
        console.log(filePath);
        let content = Buffer.alloc(1);
        if(filePath[filePath.length-1]!=='/') content = await fs.readFile(filePath);
        const newFilePathInsideZip = filePath.slice(15);
        console.log(newFilePathInsideZip);
        zip.addFile(newFilePathInsideZip, content);
        zip.writeZip(zipPath);
        console.log(`Updated ${zipPath} successfully`);
    } catch (e) {
        console.log(`Something went wrong. ${e}`);
    }
}

async function deleteEntry(filePath, zipPath = ZIPLOCATION) {
    try {

        const zipExists = await checkFileExists(zipPath);

        if(!zipExists) {
            throw new Error("zip doesn't exists")
        }

        const zip = new AdmZip(zipPath);

        const filePathInsideZip = filePath.slice(15);

        zip.deleteFile(filePathInsideZip);

        console.log(`deleted ${filePathInsideZip} from ${zipPath}`);
    } catch (error) {
        console.log(`Something went wrong while deleting the file: ${error}`)
    }
}

module.exports = {
    createZipArchive,
    readZipArchive,
    updateZipArchive,
    deleteEntry
}