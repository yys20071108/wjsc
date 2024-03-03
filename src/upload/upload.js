function openUploadWindow() {

    const win = createPage({
        show: true,
        title: '上传文件',
        disableClose: false,
    })

    const fileInput = document.createElement('input')
    {
        fileInput.type = 'file';
        fileInput.multiple = true
        fileInput.style.display = 'none'

        fileInput.addEventListener('change', () => {
            const files = fileInput.files
            Object.keys(files).forEach((item) => {
                const exhibitItem=createOpenedFileExhibitItem({
                    fileObj: files[item],
                    defaultState: '未上传'
                })

                exhibitItem.deleteIcon.addEventListener('click', () => {

                    if (preparedFileArea.children.length===0){
                        SubmitBtn.style.display='none'
                    }
                })

                preparedFileArea.appendChild(exhibitItem)

            });

            if (preparedFileArea.children.length!==0){
                SubmitBtn.style.display='block'
            }else {
                SubmitBtn.style.display='none'
            }

        })

    }

    win.winBody.appendChild(fileInput)

    const openLocalFile = document.createElement('button')
    {
        openLocalFile.innerHTML = '<i class="bi bi-folder2-open"></i> 选择文件'
        openLocalFile.classList.add('file-preview-btn')

        openLocalFile.addEventListener('click', () => {
            fileInput.click()
        })
    }

    win.winBody.appendChild(openLocalFile)

    const preparedFileArea = document.createElement('preparedFileArea')

    win.winBody.appendChild(preparedFileArea)

    const SubmitBtn=document.createElement('button')
    {
        SubmitBtn.innerHTML = ' 上传 '
        SubmitBtn.classList.add('file-preview-btn')
        SubmitBtn.style.display='none'
        win.winBody.appendChild(SubmitBtn)

        SubmitBtn.addEventListener('click', () => {

            SubmitBtn.style.display='none'

            Object.keys(preparedFileArea.children).forEach((item)=>{
                //console.log(preparedFileArea.children[item].fileObj)

                preparedFileArea.children[item].deleteIcon.remove()

                var reader=new FileReader()
                reader.readAsText(preparedFileArea.children[item].fileObj)

                reader.onload=function(e){

                    var sendText={
                        username:window.localStorage.getItem('username'),
                        privatePath:``,
                        name:preparedFileArea.children[item].fileObj.name,
                        context:e.target.result

                    }
                    //console.log(sendText)
                    {
                        preparedFileArea.children[item].state.innerHTML='正在上传'
                        preparedFileArea.children[item].state.style.color='blue'
                    }

                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', `http://127.0.0.1:5657/upload`, true);
                    //xhr.setRequestHeader('Content-Type', 'application/text;charset=utf-8')
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            console.log(xhr.responseText)
                            if (xhr.responseText==='success'){
                                preparedFileArea.children[item].state.innerHTML='上传成功'
                                preparedFileArea.children[item].state.style.color='green'
                            }else {
                                preparedFileArea.children[item].state.innerHTML='上传失败'
                                preparedFileArea.children[item].state.style.color='red'
                            }

                        }
                    }
                    xhr.send(JSON.stringify(sendText))


                }

            })

        })

    }




}

function createOpenedFileExhibitItem(props){
    /*props{
        fileObj=...[Object]
        defaultState=...[String]
    }*/

    /*可访问

    frame.state
    frame.fileObj   可通过frame.fileObj来获取元素对应的 文件对象
    frame.deleteIcon

    */

    const frame=document.createElement('div');
    frame.classList.add('OpenedFileExhibitItem')
    frame.fileObj=props.fileObj

    const infoArea=document.createElement('div');
    {infoArea.style.flexGrow='1';
    infoArea.style.height='fit-content';
    infoArea.style.display='inline-block';}

    const name=document.createElement('div');
    {
        name.style.fontSize='25px'
        name.style.wordBreak='break-word';

        name.innerHTML=props.fileObj.name
        
    }

    const state=document.createElement('div');
    {
        state.style.fontSize='18px'
        state.style.color='gray'
        state.style.wordBreak='break-word';

        state.innerHTML=props.defaultState
        frame.state=state   //引出state元素
    }

    const deleteIcon=document.createElement('div')
    {
        deleteIcon.style.width='fit-content'
        deleteIcon.style.height='fit-content'
        deleteIcon.style.display='inline-block'
        deleteIcon.style.fontSize='30px'
        deleteIcon.style.color='red'

        deleteIcon.innerHTML='<i class="bi bi-x-lg"></i>'

        deleteIcon.addEventListener('click',()=>{
            frame.style.animation='fadeToRight 0.5s';
            setTimeout(function (){frame.remove()},490)
        })

        frame.deleteIcon=deleteIcon
    }
    infoArea.appendChild(name);infoArea.appendChild(state);
    frame.appendChild(infoArea);frame.appendChild(deleteIcon)
    //
    return frame
}