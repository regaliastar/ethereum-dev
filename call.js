const execSync = require('child_process').execSync
const exec = require('child_process').exec

const begin = new Date()
/*
let output
output = execSync('python ml.py')
console.log(output.toString())
output = execSync('python ml.py')
console.log(output.toString())
output = execSync('python ml.py')
console.log(output.toString())
output = execSync('python ml.py')
console.log(output.toString())
output = execSync('python ml.py')
console.log(output.toString())
output = execSync('python ml.py')
console.log(output.toString())
output = execSync('python ml.py')
console.log(output.toString())
output = execSync('python ml.py')
console.log(output.toString())
output = execSync('python ml.py')
console.log(output.toString())
output = execSync('python ml.py')
console.log(output.toString())
*/
exec('python ml.py', function (err, stdout, stderr) {
    if(err){
        console.log(err)
    }
    console.log(stdout)
})
exec('python ml.py', function (err, stdout, stderr) {
    if(err){
        console.log(err)
    }
    console.log(stdout)
})
exec('python ml.py', function (err, stdout, stderr) {
    if(err){
        console.log(err)
    }
    console.log(stdout)
})
exec('python ml.py', function (err, stdout, stderr) {
    if(err){
        console.log(err)
    }
    console.log(stdout)
})
exec('python ml.py', function (err, stdout, stderr) {
    if(err){
        console.log(err)
    }
    console.log(stdout)
})
exec('python ml.py', function (err, stdout, stderr) {
    if(err){
        console.log(err)
    }
    console.log(stdout)
})
exec('python ml.py', function (err, stdout, stderr) {
    if(err){
        console.log(err)
    }
    console.log(stdout)
})
exec('python ml.py', function (err, stdout, stderr) {
    if(err){
        console.log(err)
    }
    console.log(stdout)
})
exec('python ml.py', function (err, stdout, stderr) {
    if(err){
        console.log(err)
    }
    console.log(stdout)
})
exec('python ml.py', function (err, stdout, stderr) {
    if(err){
        console.log(err)
    }
    console.log(stdout)
})

const end = new Date()
const last_time = end - begin
console.log("花费时间", last_time, 'ms')
console.log('over')