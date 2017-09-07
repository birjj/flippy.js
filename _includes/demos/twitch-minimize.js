// the placeholder makes sure other content on the 
// page isn't moved up when we minimize the video
let $video = document.getElementById("twitch-minimize-video");
let $placeholder = document.getElementById("twitch-minimize-video-placeholder");
$video.addEventListener("loadeddata", ()=>{
    $placeholder.style.width = $video.clientWidth+"px";
    $placeholder.style.height = $video.clientHeight+"px";
});

// toggle minimized when the video is clicked
$video.addEventListener("click", ()=>{
    flip(
        $video,
        ()=>{
            $video.classList.toggle("minimized");
        }
    );
});