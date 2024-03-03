const http = require('http');
const fs=require('fs');
const PATH=require('path');
const url=require('url');

const app=http.createServer((req,res)=>{

    ////////////////////////////

    res.setHeader('Access-Control-Allow-Origin', '*'); // 允许所有来源访问，也可以指定特定来源
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // 允许的 HTTP 方法
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // 允许的请求头

    ///////////////////////////

    if (req.url==='/upload'&& req.method.toUpperCase()==='POST'){
        var raw=[]

        req.on('data',(piece)=>{
           raw.push(piece)
        })

        req.on('end',()=>{
            var data=Buffer.concat(raw)
            data=String(data)
            data=JSON.parse(data)

            console.log(`./resource/${data.username}/${data.privatePath}${data.name}`)
            fs.writeFile(`./resource/${data.username}/${data.privatePath}${data.name}`,data.context,(err)=>{
                if (err){
                    console.log(err)
                    res.end('error')
                }else{
                    console.log('写入成功')
                    res.end('success')
                }
            })
        })

    }



    if (url.parse(req.url,true).pathname==='/download' && req.method.toUpperCase()==='GET'){

        //download?path=...

        var path=url.parse(req.url,true).query.path.toString()
        //console.log(PATH.basename(path))
        fs.access(path, fs.constants.F_OK,(err)=>{
            if (err){
                res.writeHead(404)
                res.end('no such file')
            }else{      //success
                res.writeHead(200, {
                    'Content-Type': 'application/octet-stream', // 设置文件下载类型
                    'Content-Disposition': `attachment; filename="${encodeURI(PATH.basename(path))}"`// 设置文件名
                });
                const fileStream = fs.createReadStream(path);
                // 将文件流导向响应
                fileStream.pipe(res);
            }
        })
    }



    if(url.parse(req.url,true).pathname==='/register'){

        //register?username=...&password=...

        var UserName=url.parse(req.url,true).query.username
        var Password=url.parse(req.url,true).query.password

        fs.readFile(`./resource/${UserName}/_INFO/password.json`,(err,data)=>{
            if (err){
                fs.mkdir(`./resource/${UserName}/_INFO`,
                    {recursive:true},
                    (err)=>{
                        if (err) throw err;
                        else {
                            var ResInfo=JSON.stringify({username:UserName,password:Password})
                            fs.writeFile(`./resource/${UserName}/_INFO/password.json`,Password,(err)=>{
                                if (err) console.log(err)
                                else {
                                    res.writeHead(200, {'Content-Type': 'text/plain'})
                                    //res.end('success')
                                }
                            })
                            res.writeHead(200, {'Content-Type': 'text/plain'})
                            res.end(ResInfo)
                        }
                })

            }else{
                res.end('account exist')
            }
        })

    }



    if (url.parse(req.url,true).pathname==='/signin'){

        //signin.js?username=...&password=...

        var UserName=url.parse(req.url,true).query.username
        var Password=url.parse(req.url,true).query.password

        fs.readFile(`./resource/${UserName}/_INFO/password.json`,(err,data)=>{
            if (err){
                res.end('account not exist')
            }else{
                if (data.toString()===Password){
                    res.end('success')
                }else{
                    res.end('password error')
                }
            }
        })
    }

    if (url.parse(req.url,true).pathname==='/getdir'){

        //getdir?path=...&

        var path=url.parse(req.url,true).query.path

        fs.readdir(path,(err,data)=>{
            if (err){
                //console.log(err)
                res.end('error')
            }else{
                var resList= []
                data.forEach(item=>{

                    if (item!=='_INFO'){
                        var itemPath=PATH.join(path,item)

                        var stat=fs.statSync(itemPath)

                            if (stat.isDirectory()){
                                resList.push({
                                    name:item,
                                    type:'dir',
                                    size:stat.size
                                })
                            }else {
                                resList.push({
                                    name:item,
                                    type:'file',
                                    size:stat.size
                                })
                            }

                    }

                })
                res.end(JSON.stringify(resList))
                console.log(path)
            }
        })
    }


///////////////////////
    if (req.url==='/'){
        fs.readFile('index.html',(err,data)=>{
            if (err){
                console.log(err)
                res.end('读取失败')
            }else{
                res.end(data)

            }
        })

    }else{
        if( req.url.indexOf('.js')!==-1 || req.url.indexOf('.css')!==-1)
        fs.readFile(`.${encodeURI(req.url)}`,(err,data)=>{
            if (err){
                console.log(err)
                //res.end('读取失败')
            }else{
                res.end(data)

            }
        })
    }



})



const port=5657;

app.listen(port)