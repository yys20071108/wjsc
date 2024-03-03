let routeHead = '';

function createToolColumnItem(props) {
    const btn = document.createElement('button')
    btn.classList.add('tool-column-item')
    btn.innerHTML = props.text

    //
    return btn
}

function createFileListAreaRow(props) {
    const frame = document.createElement('FileListAreaRowFrame')
    if (props.type === 'dir') {
        frame.innerHTML = `./${props.name}`
    } else {
        frame.innerHTML = props.name
    }

    frame.addEventListener('mouseover',()=>{
        document.getElementById('preview').innerHTML=''
        document.getElementById('preview').appendChild(createFilePreviewCard(props))
    })

    //
    return frame
}

function createFilePreviewCard(props) {
    const frame = document.createElement('div')
    {
        frame.style.width = '94%'
        frame.style.height = 'fit-content'
        frame.style.margin='10px 3%'
        frame.style.background = 'transparent'
    }
    const info = document.createElement('div')
    {
        info.style.width = '100%'
        info.style.height = 'fit-content'
        info.style.display = 'flex'
        info.style.margin = '5px auto'
    }

    const icon = document.createElement('div')
    {
        icon.style.width = '60px'
        icon.style.height = '60px'
        icon.style.display = 'inline-block'
        icon.style.fontSize='40px'

        if (props.type==='dir'){
            icon.innerHTML=`<i class="bi bi-folder2"></i>`
        }else{
            icon.innerHTML=`<i class="bi bi-file-earmark"></i>`
        }
    }

    const detail = document.createElement('div')
    {
        detail.style.flexGrow = '1'
        detail.style.height = 'fit-content'

        detail.innerHTML += `<div style="font-size: 30px;word-break: break-word;">${props.name}</div>`
        detail.innerHTML += `<div style="
                                        font-size: 15px;
                                        word-break: break-word;
                                        color: rgb(147,147,147)">大小:${props.size}</div>`
    }

    {
        info.appendChild(icon);info.appendChild(detail)
        frame.appendChild(info)
    }

    const control = document.createElement('div')
    {
        info.style.width = '100%'
        info.style.height = 'fit-content'
        info.style.display = 'flex'
        info.style.margin = '5px auto'
    }

    const downloadBtn=document.createElement('button')
    {
        downloadBtn.classList.add('file-preview-btn')
        downloadBtn.innerHTML=`<i class="bi bi-cloud-download"></i> 下载`
    }
    {
    control.appendChild(downloadBtn);
    frame.appendChild(control)
    }

    //

    return frame;

}

//<Component
//Script>

function checkLocalUserInfo() {
    var username = window.localStorage.getItem('username');
    var password = window.localStorage.getItem('password')
    routeHead = `resource/${username}/`
    if (username !== null && password !== null) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `http://127.0.0.1:5657/signin?username=${username}&password=${password}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseText)
                if (xhr.responseText === 'success') {
                    document.getElementById('user-id').innerHTML = `用户:${username}`

                } else {
                    openSigninWindow()
                }

            }
        }
        xhr.send()
    } else {
        openSigninWindow()
    }
}


function setToolColumnItem() {
    document.getElementById('tool-column').innerHTML = ''

    var root = {}
    root.newFile = createToolColumnItem({text: '上传文件'})
    root.newFile.addEventListener('click', () => {
        openUploadWindow()
    })

    root.newDir = createToolColumnItem({text: '新建文件夹'})
    root.selectMultiple = createToolColumnItem({text: '选择文件'})
    //console.log(root)
    Object.keys(root).forEach((item) => {

        document.getElementById('tool-column').appendChild(root[item])
    })

}


var dirCentered = []

function setListAreaItem() {
    document.getElementById('list-area').innerHTML = ''
    const xhr = new XMLHttpRequest();
    var route = routeHead
    if (dirCentered.length !== 0) {
        dirCentered.forEach(item => {
            route += `${item}/`
        })
    }
    xhr.open('GET', `http://127.0.0.1:5657/getdir?path=${route}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //console.log(xhr.responseText)
            JSON.parse(xhr.responseText).forEach(item => {
                var row = createFileListAreaRow(item)
                document.getElementById('list-area').appendChild(row)
            })

        }
    }
    xhr.send()

}

