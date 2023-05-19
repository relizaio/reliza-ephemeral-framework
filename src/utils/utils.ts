import fs from 'node:fs/promises'
import path from 'path'
import childProcess from 'child_process'

async function sleepForTime(timeMs: number) {
    return new Promise((resolve, reject) => {
        setTimeout((() => {
            resolve(true)
        }), timeMs)
    })
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

async function copyDir(src: string, dest: string) {
    await fs.mkdir(dest, { recursive: true })
    let entries = await fs.readdir(src, { withFileTypes: true })

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        entry.isDirectory() ?
            await copyDir(srcPath, destPath) :
            await fs.copyFile(srcPath, destPath);
    }
}

function shellExec(cmd: string, args: any[], timeout?: number): Promise<string> { // timeout = in ms
    return new Promise((resolve, reject) => {
        let options: any = {}
        if (timeout) options.timeout = timeout
        const child = childProcess.spawn(cmd, args, options)
        let resData = ""
        child.stdout.on('data', (data)=> {
            resData += data
        })
      
        child.stderr.on('data', (data) => {
            console.error(`shell command error: ${data}`)
        })
  
        child.on('close', (code) => {
            if (code !== 0) console.log(`shell process exited with code ${code}`)
            if (code === 0) {
                if (resData) {
                    resData = resData.replace(/\n$/, "")
                }
                resolve(resData)
            } else {
                console.error(resData)
                reject(resData)
            }
        })
    })
}

function parseTfOutput(tfOutput: string) {
    const tfOutArray = tfOutput.split('Outputs:')
    const tfOutMap: any = {}
    if (tfOutArray.length > 1) {
        const outputsStr = tfOutArray[tfOutArray.length - 1]
        const outStrings = outputsStr.split(/(?:\r\n|\r|\n)/g);
        outStrings.forEach(os => {
            if (os && os.length > 1) {
                const kvArr = os.split(' = "')
                if (kvArr.length > 1) {
                    tfOutMap[kvArr[0]] = kvArr[1].replace(/"$/, '')
                }
            }
        })
        console.log(outputsStr)
    } else {
        console.log('No outputs in tf parse')
    }
    return tfOutMap
}

export default {
    copyDir,
    parseTfOutput,
    shellExec,
    sleep: sleepForTime,
    uuidv4
}