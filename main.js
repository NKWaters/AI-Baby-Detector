function setup() {
    canvas = createCanvas(380, 380);
    canvas.center();
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById('status').innerHTML = "Status: Detecting Objects";
    video = createCapture(VIDEO);
    video.hide();
    video.size(380, 380);
}

status = "";
objects = [];
confidence = 0;
song = "";

function preload() {
    song = loadSound('alert-sound.wav');
}

function draw() {
    image(video, 0, 0, 380, 380);
    
    if (status != "") {
        r = random(255);
        g = random(255);
        b = random(255);
        objectDetector.detect(video, gotResult);

        for (i = 0; 1 < objects.length; i++) {
            document.getElementById("status").innerHTML = "Status: Objects Detected";
            document.getElementById("number_of_objects").innerHTML = "Number of Objects - " + objects.length;
            fill(r,g,b);
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke(r,g,b);
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
            if (objects[i].label == "person") {
                document.getElementById("number_of_objects").innerHTML = "Baby Found";
                console.log("Stop");
                song.stop();
            } else {
                document.getElementById("number_of_objects").innerHTML = "Baby Not Found";
                console.log("Play");
                song.play();
            }
        }
        if (objects.length == 0) {
            document.getElementById("number_of_objects").innerHTML = "Baby Not Found";
                console.log("Play");
                song.play();
        }
    }
}

function modelLoaded() {
    console.log("Model Loaded!");
    status = true;
    objectDetector.detect(video, gotResult);
}

function gotResult(error, results) {
    if (error) {
       console.log(error);
    }
    else {
        console.log(results);
        objects = results;
    }
}