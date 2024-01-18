let form = document.getElementsByClassName('form')[0]
let popupSelectImage = document.getElementById("popupSelectImage")
let selectedImg = document.getElementById("selectedImg")

let addImage = false
let addBackground = false
let background
let image
let placeholderP = "Story"

function handleInput(p) {
    if (p.innerText.trim() === "") {
       p.innerText = placeholderP
       p.style.color = "#aaa"
       p.value = "placeholder"
    } else {
       p.style.color = "#000"
       p.value = ""
    }
}

function showPopupSelectImage(){
    popupSelectImage.style.display = "flex"
}

function hiddenPopupSelectImage(){
    addImage = false
    addBackground = false
    popupSelectImage.style.display = "none"
}

function AddImage(){
    addImage = true
    showPopupSelectImage()
}

function BackgroundImage(){
    addBackground = true
    showPopupSelectImage()
}

function imageSelected(e){
    if (e.files.length > 0) {
        const reader = new FileReader()
        reader.onload = function (event) {
            selectedImg.src = event.target.result
        }
        reader.readAsDataURL(e.files[0])
    }else{
        selectedImg.src = null
    }
}

function applySelectedImage(){
    if (addImage){
        image = selectedImg.src
        AddAndChangeImage()
    }
    if (addBackground){
        background = selectedImg.src
        document.body.style.backgroundImage = "url('" + background + "')"
    }
    hiddenPopupSelectImage()
}

function AddAndChangeImage(){
    let img = document.createElement("img")
    img.src = image
    img.className = "imagesStory"
    img.style.position = "relative"
    img.style.zIndex = "2"
    let changeImg = ChangeImage(img)
    form.append(changeImg[0])
    let p = document.createElement("p")
    p.innerText = placeholderP
    p.style.color = "#aaa"
    p.contentEditable = "true"
    p.oninput = ()=>handleInput(p)
    form.append(p)
    changeImg[1]()
}

function ChangeImage(img){
    img = img.cloneNode(true)
    let div = document.createElement("div")
    let topLeftPoint = document.createElement("div")
    let topRightPoint = document.createElement("div")
    let bottomLeftPoint = document.createElement("div")
    let bottomRightPoint = document.createElement("div")
    let inputWidth = document.createElement("input")
    let spanError = document.createElement("span")
    let floatLeft = document.createElement("img")
    let floatRight = document.createElement("img")
    let notFloat = document.createElement("img")
    let inputUnderText = document.createElement("input")
    let labelUnderText = document.createElement("label")
    let divUnderText = document.createElement("div")
    let applyBtn = document.createElement("button")
    let deleteBtn = document.createElement("button")

    let divUnder = document.createElement("div")
    let divContainer = document.createElement("div")

    let imgOrContainer = img

    div.className = "changeImageDiv"

    topLeftPoint.className = "point"
    topLeftPoint.style.top = "-0.6em"
    topLeftPoint.style.left = "-0.6em"

    topRightPoint.className = "point"
    topRightPoint.style.top = "-0.6em"
    topRightPoint.style.right = "-0.6em"

    bottomLeftPoint.className = "point"
    bottomLeftPoint.style.bottom = "-0.6em"
    bottomLeftPoint.style.left = "-0.6em"

    bottomRightPoint.className = "point"
    bottomRightPoint.style.bottom = "-0.6em"
    bottomRightPoint.style.right = "-0.6em"

    spanError.className = "spanError"

    inputWidth.className = "inputWidth"
    inputWidth.type = "text"

    floatLeft.className = "floatLeft"
    floatLeft.src = floatArrowUrl

    floatRight.className = "floatRight"
    floatRight.src = floatArrowUrl

    notFloat.className = "notFloat"
    notFloat.src = floatArrowUrl

    divUnderText.className = "divUnderText"
    inputUnderText.type = "checkbox"
    inputUnderText.checked = img.style.zIndex === "0"
    inputUnderText.id = "inputUnderText"

    labelUnderText.htmlFor = "inputUnderText"
    labelUnderText.innerText = "Under Text"

    applyBtn.className = "applyBtn"
    applyBtn.textContent = "Apply"
    applyBtn.type = "button"

    deleteBtn.className = "deleteBtn"
    deleteBtn.textContent = "Delete"
    deleteBtn.type = "button"

    divUnder.className = "containerImgUnder"
    divContainer.className = "containerImg"
    divUnder.style.position = "relative"

    function rightPointMoveListener(eMove){
        let clientX
        if (eMove.clientX){
            clientX = eMove.clientX
        }else{
            clientX = eMove.touches[0].clientX
        }

        let newWidth = clientX - img.getBoundingClientRect().left
        img.style.width = Math.abs(newWidth)/div.clientWidth*100 + '%'
        updateChangeUi()
    }

    function leftPointMoveListener(eMove){
        let clientX
        if (eMove.clientX){
            clientX = eMove.clientX
        }else{
            clientX = eMove.touches[0].clientX
        }

        let newWidth = clientX - img.getBoundingClientRect().right
        img.style.width = Math.abs(newWidth)/div.clientWidth*100 + '%'
        updateChangeUi()
    }

    function mouseUpListener(){
        document.removeEventListener("mousemove", rightPointMoveListener)
        document.removeEventListener("mousemove", leftPointMoveListener)
        document.removeEventListener("mouseup", mouseUpListener)
        document.removeEventListener("touchmove", rightPointMoveListener)
        document.removeEventListener("touchmove", leftPointMoveListener)
        document.removeEventListener("touchend", mouseUpListener)
    }

    topRightPoint.addEventListener("mousedown", function () {
        document.addEventListener("mousemove", rightPointMoveListener)
        document.addEventListener("mouseup", mouseUpListener)
    })

    topRightPoint.addEventListener("touchstart", function () {
        document.addEventListener("touchmove", rightPointMoveListener)
        document.addEventListener("touchend", mouseUpListener)
    })

    topLeftPoint.addEventListener("mousedown", function () {
        document.addEventListener("mousemove", leftPointMoveListener)
        document.addEventListener("mouseup", mouseUpListener)
    })

    topLeftPoint.addEventListener("touchstart", function () {
        document.addEventListener("touchmove", leftPointMoveListener)
        document.addEventListener("touchend", mouseUpListener)
    })

    bottomRightPoint.addEventListener("mousedown", function () {
        document.addEventListener("mousemove", rightPointMoveListener)
        document.addEventListener("mouseup", mouseUpListener)
    })

    bottomRightPoint.addEventListener("touchstart", function () {
        document.addEventListener("touchmove", rightPointMoveListener)
        document.addEventListener("touchend", mouseUpListener)
    })

    bottomLeftPoint.addEventListener("mousedown", function () {
        document.addEventListener("mousemove", leftPointMoveListener)
        document.addEventListener("mouseup", mouseUpListener)
    })

    bottomLeftPoint.addEventListener("touchstart", function () {
        document.addEventListener("touchmove", leftPointMoveListener)
        document.addEventListener("touchend", mouseUpListener)
    })

    inputWidth.onchange = ()=>{
        if (inputWidth.value.charAt(inputWidth.value.length-1) !== "%"){
            spanError.textContent = "Error need enter in percent"
            return
        }
        img.style.width = inputWidth.value
        updateChangeUi()
    }

    floatLeft.onclick = () => {
        img.style.float = "left"
        updateChangeUi()
    }

    floatRight.onclick = () => {
        img.style.float = "right"
        updateChangeUi()
    }

    notFloat.onclick = () => {
        img.style.float = "none"
        updateChangeUi()
    }

    inputUnderText.onchange = ()=>{
        updateChangeUi()
    }

    applyBtn.onclick = ()=>{
        function imageClick() {
            let changeImg = ChangeImage(img)
            imgOrContainer.replaceWith(changeImg[0])
            imgOrContainer.removeEventListener("click", imageClick)
            changeImg[1]()
        }
        imgOrContainer.addEventListener("click",imageClick)
        divUnder.style.position = "absolute"
        div.replaceWith(imgOrContainer)
    }

    deleteBtn.onclick = ()=>{
        div.previousElementSibling.innerText += div.nextElementSibling.innerText
        div.nextElementSibling.remove()
        div.remove()
    }

    function updateChangeUi(){
        topRightPoint.style.left = (img.getBoundingClientRect().right - 32) / div.clientWidth * 100 + "%"
        topLeftPoint.style.left = (img.getBoundingClientRect().left - topLeftPoint.clientWidth*4) / div.clientWidth * 100 + "%"
        bottomRightPoint.style.left = (img.getBoundingClientRect().right - 32) / div.clientWidth * 100 + "%"
        bottomLeftPoint.style.left = (img.getBoundingClientRect().left - topLeftPoint.clientWidth*4) / div.clientWidth * 100 + "%"
        spanError.textContent=""
        inputWidth.style.left = (img.getBoundingClientRect().left + (img.width/2) - 32) / div.clientWidth * 100 + "%"

        if (img.style.width){
            inputWidth.value = img.style.width
        }else{
            inputWidth.value = "100%"
        }

        if (img.style.float.toLowerCase() === "none" || img.style.float === ""){
            if (inputUnderText.checked){
                img.style.zIndex = "0"
                divUnder.append(img)
                imgOrContainer = divUnder
            }else{
                img.style.zIndex = "2"
                divContainer.append(img)
                imgOrContainer = divContainer
            }
        }else{
            if (inputUnderText.checked){
                img.style.zIndex = "0"
                divUnder.append(img)
                imgOrContainer = divUnder
            }else{
                img.style.zIndex = "2"
                imgOrContainer = img
            }
        }
        div.append(imgOrContainer)
    }

    divUnderText.append(labelUnderText)
    divUnderText.append(inputUnderText)

    div.append(spanError)
    div.append(inputWidth)
    div.append(floatLeft)
    div.append(floatRight)
    div.append(notFloat)
    div.append(divUnderText)
    div.append(topRightPoint)
    div.append(topLeftPoint)
    div.append(bottomRightPoint)
    div.append(bottomLeftPoint)
    div.append(applyBtn)
    div.append(deleteBtn)
    div.append(imgOrContainer)

    updateChangeUi()

    return [div, updateChangeUi]
}

let endStory = 0

for (let i = 0; i < imagesData.length; i++) {
    let p = document.createElement("p")
    let containerImg = document.createElement("div")
    let containerImgUnder = document.createElement("div")

    p.style.color = "#000"
    p.contentEditable = "true"
    p.oninput = ()=>handleInput(p)

    p.innerText = story.slice(endStory, parseInt(imagesData[i]["afterChar"]))
    handleInput(p)
    containerImg.className = "containerImg"
    containerImgUnder.className = "containerImgUnder"

    endStory = parseInt(imagesData[i]["afterChar"])

    form.append(p)

    let img = document.createElement("img")
    img.src = imagesData[i]["url"]
    img.style.width = imagesData[i]["width"]
    img.className = "imagesStory"
    img.id = imagesData[i]["storyImageId"]

    let imgOrContainer = img
    function imageClick() {
        let changeImg = ChangeImage(img)
        imgOrContainer.replaceWith(changeImg[0])
        imgOrContainer.removeEventListener("click", imageClick)
        changeImg[1]()
    }
    img.addEventListener("click",imageClick)

    if (imagesData[i]["side"].toLowerCase()==="none" || imagesData[i]["side"]===""){
        containerImg.append(img)
        imgOrContainer = containerImg
    }else {
        img.style.float = imagesData[i]["side"]
        imgOrContainer = img
    }

    if (imagesData[i]["underText"]==="True") {
        img.style.zIndex = "0"
        containerImgUnder.append(img)
        imgOrContainer = containerImgUnder
    } else {
        img.style.position = "relative"
        img.style.zIndex = "2"
    }
    form.append(imgOrContainer)
}

let endP = document.createElement("p")
endP.style.color = "#aaa"
endP.contentEditable = "true"
endP.oninput = ()=>handleInput(endP)
endP.innerText = story.slice(endStory)
handleInput(endP)
form.append(endP)

let input_name = document.getElementById("input_name")

async function Save() {
    let images = form.getElementsByClassName("imagesStory")
    let ps = form.getElementsByTagName("p")
    let imagesData = []

    let story = ""
    let formData = new FormData()

    for (let i = 0; i < images.length; i++) {
        if (ps[i].value !== "placeholder") {
            story += ps[i].innerText
        }

        imagesData.push({
            "storyImageId": images[i].id,
            "afterChar": story.length,
            "width": images[i].style.width ? images[i].style.width : "100%",
            "underText": images[i].style.zIndex === "0",
            "side": images[i].style.float,
        })

        if (!images[i].id) {
            let response = await fetch(images[i].src)
            let blob = await response.blob()
            let file = new File([blob], 'storyImage.png', {type: 'image/png'})
            formData.append('images', file)
        }
    }

    if (ps[ps.length - 1].value !== "placeholder") {
        story += ps[ps.length - 1].innerText
    }

    let data = {
        "storyId": storyId,
        "imagesData": imagesData,
        "name": input_name.value.trim(),
        "story": story,
    }

    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value

    formData.append("data", JSON.stringify(data))

    let backgroundImageUrl = document.body.style.backgroundImage;

    if (backgroundImageUrl) {
        backgroundImageUrl = backgroundImageUrl.slice(5)
        backgroundImageUrl = backgroundImageUrl.slice(0, backgroundImageUrl.length - 2)
        let response = await fetch(backgroundImageUrl)
        let blob = await response.blob()
        let file = new File([blob], 'backgroundStory.png', {type: 'image/png'})
        formData.append('backgroundStory', file)
    }

    fetch("/saveStory", {
        method: "POST",
        headers: {
            "X-CSRFToken": csrfToken,
        },
        body: formData,
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)
    })
    .catch(error => {
        console.error("Error:", error)
    })
}
