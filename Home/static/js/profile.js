const image_clear_id = document.getElementById("image-clear_id")
const labelIdImage = document.getElementById("label_id_image");
const userImg = document.getElementsByClassName("user_img")[0];
const fullImage = document.getElementById("fullImage")
const fullImageContainer = document.getElementsByClassName("fullImageContainer")[0]
const deletePopup = document.getElementsByClassName("deletePopup")[0]

function changeIdImage(e){
    image_clear_id.checked = e.value === "";
     if (e.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (event) {
            userImg.src = event.target.result;
        };
        reader.readAsDataURL(e.files[0]);
     }
}

let pressTimer;

function showFullImage() {
    fullImage.src = userImg.src
    fullImageContainer.style.display = "block"
}

function closeFullImage(){
    fullImageContainer.style.display = "none"
}

function startPressTimer() {
    pressTimer = setTimeout(function() {
        showFullImage();
    }, 1000);
}

function stopPressTimer() {
    clearTimeout(pressTimer);
}

labelIdImage.addEventListener("mousedown", startPressTimer);
labelIdImage.addEventListener("mouseup", stopPressTimer);
labelIdImage.addEventListener("mouseleave", stopPressTimer);

labelIdImage.addEventListener("touchstart", startPressTimer);
labelIdImage.addEventListener("touchend", stopPressTimer);
labelIdImage.addEventListener("touchcancel", stopPressTimer);

labelIdImage.addEventListener("contextmenu", startPressTimer);

function showDeleteStoryPopup(id) {
    deletePopup.style.display = "block"
    deletePopup.id = id
}

function cancelDeleteStory(){
    deletePopup.style.display = "none"
}

function deleteStory(e){
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value
    let formData = new FormData()
    formData.append("id", deletePopup.id)

    fetch("/deleteStory", {
        method: "POST",
        headers: {
            "X-CSRFToken": csrfToken,
            "X-HTTP-Method-Override": "DELETE",
        },
        body: formData,
    })
    .then(response => response.json())
    .then(result => {
        if(result.status==="OK"){
            document.getElementById("story_"+deletePopup.id).remove()
        }
    })
    .catch(error => {
        console.error("Error:", error)
    })
    cancelDeleteStory()
}