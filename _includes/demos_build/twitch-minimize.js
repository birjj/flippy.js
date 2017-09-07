"use strict";

// the placeholder makes sure other content on the 
// page isn't moved up when we minimize the video
var $video = document.getElementById("twitch-minimize-video");
var $placeholder = document.getElementById("twitch-minimize-video-placeholder");
$video.addEventListener("loadeddata", function () {
    $placeholder.style.width = $video.clientWidth + "px";
    $placeholder.style.height = $video.clientHeight + "px";
});

// toggle minimized when the video is clicked
$video.addEventListener("click", function () {
    flip($video, function () {
        $video.classList.toggle("minimized");
    });
});