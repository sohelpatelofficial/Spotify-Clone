// fake url
// history.pushState({ foo: 'fake' }, 'Fake Url', 'hy, this is a fake url.html');
// Global Variables

// Global Variable currentSong
let songsData;
let folder = "mood-songs";
let currentSong = new Audio();
let currentBtn;
let tracksList;
let playButton;
let trackName;
let randomSong;
let prevButton = document.getElementById("prevBtn");
let nextButton = document.getElementById("nextBtn");
let pauseButton = document.getElementById("pauseBtn");
let prevTrackIndex;
let nextTrackIndex;
let prevTrack;
let nextTrack;
let Track_Name = document.getElementById("tracKName");
let trackDuration = document.getElementById("trackDuration");
let seekBar = document.getElementsByClassName("seek-bar")[0];
let percent;
let cardContainer = document.getElementsByClassName("cardContainer")[0];
let cardContainer2 = document.getElementsByClassName("cardContainer")[1];
let circle = document.getElementsByClassName("circle")[0];
let i;
let thPaths;

(async function () {

    async function fetchSongs(folder) {
        // Fetching songs from server
        let response = await fetch(`/songs/${folder}/`);
        response = await response.text()
        // console.log(response);
        let songsPath = [];
        let songsName = [];
        let html = document.createElement("html");
        let splitPath = [];
        html.innerHTML = response;

        let anchors = html.getElementsByTagName("a");
        Array.from(anchors).forEach(anchor => {
            if (anchor.href.includes(".mp3")) {
                splitPath = anchor.href.split(`/songs/${folder}/`); // The split path separate the previous and next string before and after the matched argument(string) in two array value the first index value is previous string and the second index value is next string. 
                songsPath.push(anchor.href);
                // The below line will fetch Name of the song from path instead of full path
                songsName.push(decodeURIComponent(splitPath[1].replaceAll('.mp3', '')))
            }
        });

        songsData = [songsName, songsPath, anchors];

        let Playlist = document.body.querySelector(".Playlist");
        Playlist.innerHTML = "";
        let songs = songsData[0];
        songs.forEach(song => {
            Playlist.innerHTML += `
            <li>
                <img src="svgs/music-note.svg" alt="music note logo">
                    <div class="song-info">
                        <p>${song}</p>
                        <p>N/A</p>
                    </div>
                    <img src="svgs/play.svg" alt="play button logo" class="trackPlayButton">
            </li>
            `;
        });
    };

    async function main(folder) {
        await fetchSongs(folder);

        // sta = Songs Thumbnail Array
        // let sta = await fetch(`/songs/${folder}/thumbnail/imgPath.json`);
        // sta = await sta.json()
        // thPaths = [];
        // for (const thPath in sta) {
        //     if (Object.hasOwnProperty.call(sta, thPath)) {
        //         thPaths.push(sta[thPath]);
        //         // tracksList[i].firstElementChild.src = `/songs/${folder}/thumbnail/${element}`;
        //     }
        // }

        tracksList = document.querySelectorAll(".Playlist li");
        i = 0;
        // Creating tracks Playlist
        tracksList.forEach(track => {
            // attaching event listener for track play button
            // below line is for track thumbnail
            // track.firstElementChild.src = `/songs/${folder}/thumbnail/${thPaths[i]}`;
            playButton = track.lastElementChild;
            playButton.addEventListener('click', async (e) => {
                trackName = track.getElementsByClassName("song-info")[0].firstElementChild.innerHTML;
                playMusic(trackName);
            });
            i++;
        });


        // let playButtons = document.querySelectorAll(".Playlist li img:last-child");
        // playButtons.forEach(button => {
        //     button.addEventListener("click", e => {
        //         if (button.previousElementSibling.firstElementChild.innerHTML == Track_Name.innerHTML) {
        //             currentBtn = button;
        //             console.log(currentBtn);
        //         }
        //     })
        // })

        // Playing default song on website load or reload

        randomSong = Math.floor(Math.random() * tracksList.length - 1)
        randomSong = songsData[1][randomSong];
        randomSong = decodeURIComponent(randomSong);
        playMusic(randomSong, true);

    }

    await main(folder);

    // function for playing tracks
    function playMusic(track, pause = false, playNext = false) {
        if (!pause) {
            currentSong.src = `/songs/${folder}/` + track + ".mp3/";
            currentSong.play();
            pauseButton.src = "svgs/musicplayer/pause.svg"
            Track_Name.innerHTML = trackName;
        }
        else {
            currentSong.src = track;
            Track_Name.innerHTML = track.split(`/songs/${folder}/`)[1].replace(".mp3", "");

            if (playNext == true) {
                currentSong.play()
            };
        };
    };

    currentSong.addEventListener("timeupdate", e => {
        trackDuration.innerHTML = `${(secondsToMinutes(currentSong.currentTime)).slice(0, 5)} / ${(secondsToMinutes(currentSong.duration)).slice(0, 5)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // chat gpt code for sec to min conversion

    function secondsToMinutes(seconds) {
        if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
            return '00:00';
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        // Add leading zeros to the minutes and seconds
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    // Example usage:
    //   const inputSeconds = 72; // Replace with your desired number of seconds
    //   const formattedTime = secondsToMinutes(inputSeconds);
    //   console.log(formattedTime); // Output: "01 : 12"


    // Music Controls

    // Adding Event Listener to pause Button

    pauseButton.onclick = () => {
        if (currentSong.paused) {
            currentSong.play();
            pauseButton.src = "svgs/musicplayer/pause.svg";
        }
        else {
            currentSong.pause();
            pauseButton.src = "svgs/musicplayer/play.svg";
        }
    }
    // Adding listener for previous and next song functionality.

    prevButton.onclick = () => {
        prevTrackIndex = parseInt(songsData[1].indexOf(`${currentSong.src}`) - 1);
        if (prevTrackIndex >= 0) {
            prevTrack = songsData[1][prevTrackIndex];
            // currentSong.src = prevTrack;
            // currentSong.play();
            // prevTrack = decodeURIComponent((prevTrack.split("/songs/")[1]).replaceAll('.mp3', ''));
            prevTrack = decodeURIComponent(prevTrack);
            pauseButton.src = "svgs/musicplayer/pause.svg"
            playMusic(prevTrack, true, true)
            circle.style.left = "-3px";
        }

        else {
            console.log("No Previous Track Available");
        }
    }

    nextButton.onclick = () => {
        nextTrackIndex = parseInt(songsData[1].indexOf(`${currentSong.src}`) + 1);
        if (nextTrackIndex < (songsData[1].length)) {
            nextTrack = songsData[1][nextTrackIndex];
            nextTrack = decodeURIComponent(nextTrack);
            playMusic(nextTrack, true, true)
            pauseButton.src = "svgs/musicplayer/pause.svg"
            circle.style.left = "-3px";
        }

        else {
            console.log("No Next Track Available");
        }
    }

    // Adding event listener to seek bar for track forward and backward listening

    // console.log(seekBar.getBoundingClientRect());
    seekBar.addEventListener("click", e => {
        // console.log(e.target.getBoundingClientRect(), e.offsetX);
        percent = Math.floor((e.offsetX / e.target.getBoundingClientRect().width) * 100);
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * (percent / 100));
        // console.log(currentSong.duration, percent, percent/100);
        // console.log(currentSong.duration * (percent / 100));
    });

    // Adding event listener to volume button
    let volumeBtn = document.getElementById("volumeBtn")
    volumeBtn.addEventListener("change", e => {
        currentSong.volume = e.target.value / 100;
    });

    let volumeImg = document.querySelector(".volume img:first-child");
    volumeImg.onclick = (e) => {
        // console.log(e.target.src == "/svgs/volume.svg");
        if (e.target.src == "/svgs/volume.svg") {
            e.target.src = "svgs/mute.svg";
            currentSong.muted = true;
            volumeBtn.value = 0;
        }
        else {
            currentSong.muted = false;
            e.target.src = "svgs/volume.svg";
            volumeBtn.value = 20;
            currentSong.volume = 0.2;
        }
    }

    // Responsive Js
    let sideBar = document.getElementsByClassName("left")[0];
    let menuBtn = document.getElementById("menuBtn");
    let closeMenuBtn = document.getElementById("closeMenuBtn");
    let f;

    // Event Listener for menu button
    menuBtn.onclick = () => {
        sideBar.style.left = "0px";
        closeMenuBtn.style = `  left : 89%;
                            top : 12px; `;
        menuBtn.classList.add("display-none");
        closeMenuBtn.classList.add("inline-block");
    };

    // Event Listener for close button
    closeMenuBtn.onclick = async () => {
        f = async () => {
            return new Promise((resolve, reject) => {
                sideBar.style.left = "-100%";
                closeMenuBtn.className = "";
                setTimeout(() => {
                    resolve(1);
                }, 300);
            });
        };
        await f();
        menuBtn.classList.toggle("display-none");
    };

    async function createPlaylistCard() {
        let response = await fetch("/songs/playlistContainer1.json");
        response = await response.json();
        i = 0;
        for (const card in response) {
            if (Object.hasOwnProperty.call(response, card)) {
                const element = response[card];
                cardContainer.innerHTML += `
                <div class="card" data-folder="${element.folder}">
                    <figure>
                        <img src="${element.path}" alt="th${i}" width="175px">
                        <button class="playButton"><img src="svgs/playbutton.svg" alt="playButton Logo"
                                width="50px"></button>
                        <figcaption>
                            <h3>${element.title}</h3>
                            <p>${element.description}</p>
                        </figcaption>
                    </figure>
                </div>`;
                i++;

            }
        }

        let response2 = await fetch("/songs/playlistContainer2.json");
        response2 = await response2.json();
        for (const card in response2) {
            if (Object.hasOwnProperty.call(response, card)) {
                const element = response2[card];
                cardContainer2.innerHTML += `
                <div class="card" data-folder="${element.folder}">
                    <figure>
                        <img src="${element.path}" alt="th${i}" width="175px">
                        <button class="playButton"><img src="svgs/playbutton.svg" alt="playButton Logo"
                                width="50px"></button>
                        <figcaption>
                            <h3>${element.title}</h3>
                            <p>${element.description}</p>
                        </figcaption>
                    </figure>
                </div>`;
                i++;
            }
        }

    }

    await createPlaylistCard();

    // Dyanmic Albums
    // Adding listener to albums card;
    let playlistCards = Array.from(document.getElementsByClassName('card'));
    // console.log(Array.isArray(playlistCards));
    playlistCards.forEach(card => {
        card.addEventListener("click", async e => {
            pauseButton.src = "svgs/musicplayer/play.svg";
            circle.style.left = "-3px";
            folder = e.currentTarget.dataset.folder;
            main(folder);
        })
    })

})();