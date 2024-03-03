function openSigninWindow(){
    const win=createPage({
        show:true,
        title:`登录`,
        disableClose:''
    })
    win.winBody.style.display="flex"

    //const flexFrame=document.createElement('flexFrame')
    const partLeft=document.createElement('SigninPart')
    partLeft.style.width='60%'


    const partRight=document.createElement('SigninPart')
    partRight.style.flexGrow='1'

    const usernameInput=createInputItem({
        title:'用户名',
        placeholder:'请输入用户名',
        defaultValue:''
    })
    const passwordInput=createInputItem({
        title:'密码',
        placeholder:'请输入密码',
        defaultValue:''
    })

    passwordInput.input.type='password'

    const submitBtn=createSubmitBtn({
        defaultState:'normal',
        text:'提交',
        waitingText:'正在验证...'
    })
    //

    const logoText=document.createElement('div')
    {
    logoText.style.fontSize='50px'
    logoText.style.color='blue'
    logoText.style.wordBreak='break-words'
    logoText.style.textAlign='center'
    logoText.style.fontFamily='San'
    logoText.innerHTML='Simple Cloud'
    logoText.style.margin='10px auto'}
    //Script...

    submitBtn.addEventListener('click',function (){
        var username=usernameInput.input.value
        var password=passwordInput.input.value
        console.log(username)
        if (username!=='' && password!==''){
            const xhr = new XMLHttpRequest();
            xhr.open('GET',`http://127.0.0.1:5657/signin?username=${username}&password=${password}`,true);
            xhr.setRequestHeader('Content-Type','application/json;charset=utf-8')
            xhr.onreadystatechange=()=>{
                if(xhr.readyState===4&&xhr.status===200){
                    console.log(xhr.responseText)
                    if (xhr.responseText==='success'){
                        window.localStorage.setItem('username',username)
                        window.localStorage.setItem('password',password)
                        document.getElementById('user-id').innerHTML=`用户:${username}`
                        win.close();
                        setTimeout(()=>{location.reload()},400)
                    }else {
                        alert(xhr.responseText)
                    }


                }
            }
            xhr.send()
        }
    })

    //
    partLeft.appendChild(usernameInput)
    partLeft.appendChild(passwordInput)
    partLeft.appendChild(submitBtn)
    //
    partRight.appendChild(logoText)
    //

    win.winBody.appendChild(partLeft)
    win.winBody.appendChild(partRight)
}



function createInputItem(props){
    const frame=document.createElement('InputItemFrame')
    const title=document.createElement('InputItemTitle')
    const input=document.createElement('input')
    input.classList.add('inputItemInput')

    frame.appendChild(title)
    frame.appendChild(input)

    title.innerHTML=props.title
    input.value=props.defaultValue
    input.setAttribute('placeholder',props.placeholder)

    try {
        frame.input=input
    }catch (error){
        console.log(error)
    }


    return frame
}



function createSubmitBtn(props){
    var btn=document.createElement('button')
    btn.classList.add('SubmitBtn')

    btn.innerHTML=props.text

    if (props.defaultState==='waiting'){
        btn.style.background='rgb(100, 100, 100)';
        btn.innerHTML=props.waitingText
    }

    btn.waiting=function (){
        btn.style.background='rgb(100, 100, 100)';
        btn.innerHTML=props.waitingText
    }
    btn.normal=function (){
        btn.style.background='rgb(60, 120, 255)';
        btn.innerHTML=props.text;
    }

    ///
    return btn
}