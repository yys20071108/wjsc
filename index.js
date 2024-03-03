window.onload=function (){
    checkLocalUserInfo()
    setToolColumnItem()
    setListAreaItem()
}



/*document.getElementById('open-file').addEventListener('click',()=>{
    let file = document.getElementById('file')
    file.click()
})

document.getElementById('file').addEventListener('change',()=>{
    var FileInfo=new Object()

    let file = document.getElementById('file').files[0]
    //console.log(file)

    var reader=new FileReader()
    reader.readAsText(file)
    reader.onload=function(e){
        FileInfo.context=e.target.result
        FileInfo.name=file.name

        document.getElementById('submit').addEventListener('click',()=>{
            uploadFile(FileInfo)

        })
    }
})*/

function uploadFile(FileInfo){
    const xhr = new XMLHttpRequest();
    xhr.open('POST',`http://127.0.0.1:5657/upload`,true);
    xhr.setRequestHeader('Content-Type','application/json;charset=utf-8')
    xhr.onreadystatechange=()=>{
        if(xhr.readyState===4&&xhr.status===200){
            console.log(xhr.responseText)

        }
    }
    document.getElementById('submit').removeEventListener('click',()=>{})
    xhr.send(JSON.stringify(FileInfo))
}


function register(username,password){
    const xhr = new XMLHttpRequest();
    xhr.open('GET',`http://127.0.0.1:5657/register?username=${username}&password=${password}`,true);
    xhr.setRequestHeader('Content-Type','application/json;charset=utf-8')
    xhr.onreadystatechange=()=>{
        if(xhr.readyState===4&&xhr.status===200){
            console.log(xhr.responseText)
        }
    }
    document.getElementById('submit').removeEventListener('click',()=>{})
    xhr.send()
}

function signin(username,password){
    const xhr = new XMLHttpRequest();
    xhr.open('GET',`http://127.0.0.1:5657/signin?username=${username}&password=${password}`,true);
    xhr.setRequestHeader('Content-Type','application/json;charset=utf-8')
    xhr.onreadystatechange=()=>{
        if(xhr.readyState===4&&xhr.status===200){
            console.log(xhr.responseText)
        }
    }
    xhr.send()
}

function download(path){
    const xhr = new XMLHttpRequest();
    xhr.open('GET',`http://127.0.0.1:5657/download?path=${path}`,true);
    xhr.setRequestHeader('Content-Type','application/json;charset=utf-8')
    xhr.onreadystatechange=()=>{
        if(xhr.readyState===4&&xhr.status===200){
            console.log(xhr.responseText)
        }
    }
    document.getElementById('submit').removeEventListener('click',()=>{})
    xhr.send()
}

function getdir(path){
    const xhr = new XMLHttpRequest();
    xhr.open('GET',`http://127.0.0.1:5657/getdir?path=${path}`,true);
    xhr.setRequestHeader('Content-Type','application/json;charset=utf-8')
    xhr.onreadystatechange=()=>{
        if(xhr.readyState===4&&xhr.status===200){
            console.log(xhr.responseText)
        }
    }
    document.getElementById('submit').removeEventListener('click',()=>{})
    xhr.send()
}

function createPage(props){
    //props={
    //  show:...
    //  title:...
    //  disableClose:...
    // }

    const win=document.createElement('win')
    const head=document.createElement('winHead')
    const body=document.createElement('winBody')
    const back=document.createElement('winBack')
    const closeIcon=document.createElement('winCloseIcon')
    const title=document.createElement('winTitle')

    if (props.disableClose!==true){
        head.appendChild(closeIcon)
    }

    head.appendChild(title)

    win.appendChild(head)
    win.appendChild(body)

    back.appendChild(win)

    closeIcon.innerHTML='<i class="bi bi-x-lg"></i> '
    closeIcon.addEventListener('click',()=>{
        win.style.animation=`closeWinAnimation 0.5s ease-in-out`
        back.style.animation='closeBackAnimation 0.5s'
        setTimeout(function(){
            back.remove()},490)

    })

    title.innerHTML=props.title

    back.winBody=body
    back.winHead=head
    back.winTitle=title

    try {
        if (props.show===false){
            back.show=function (){
                document.appendChild(back)
                back.show=null
            }
        }
        else {
            document.body.appendChild(back)
        }
    }
    catch (error) {
        console.log(error)
    }

    try {
        back.close=function () {
            win.style.animation=`closeWinAnimation 0.5s ease-in-out`
            back.style.animation='closeBackAnimation 0.5s'
            setTimeout(function(){back.remove()},490)

        }
    }
    catch (error){
        console.log(error)
    }

    //
    return back


}