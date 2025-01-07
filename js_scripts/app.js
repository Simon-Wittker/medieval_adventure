import {Model} from './model.js'
import {View} from './view.js'
import {Controller} from './controller.js'
import * as THREE from 'three';
import {OrbitControls} from '/node_modules/three/examples/jsm/controls/OrbitControls.js';

const image_url = '../../images/castel_on_a_hill.png';
const splash_screen_url_1 = '../../images/image_1.png';
const splash_screen_url_2 = '../../images/image_2.png';
const splash_screen_url_3 = '../../images/image_3.png';
const splash_screen_url_4 = '../../images/image_4.png';
const splash_screen_image_list = [splash_screen_url_1, splash_screen_url_2, splash_screen_url_3, splash_screen_url_4]

// global Variables
let onHomeScreen = true;
let onModeDescriptionScreen = false;
let mode_description_error = false;

// define body-style
document.getElementsByTagName('body')[0].style.backgroundColor = "rgba(0, 0, 0, 0.8)";
document.getElementsByTagName('body')[0].style.color = "rgba(255, 255, 255, 1)";
document.getElementsByTagName('body')[0].style.fontFamily = "cursive";
document.getElementsByTagName('body')[0].style.textAlign = "center";


// create the Home-Side
// define the prime-div
let prime_div = document.createElement('div');
prime_div.style.height = "850px";
prime_div.style.width = "900px";
prime_div.style.position = "fixed";
prime_div.style.left = ((window.innerWidth - 900) / 2).toString() + "px";
prime_div.style.border = "5px ridge rgba(211, 120, 50, 0.8)";
prime_div.style.backgroundImage = "url(" + image_url + ")";
prime_div.style.backgroundSize = "900px"
prime_div.style.backgroundColor = "rgba(240, 150, 100, 0.3)";

// define the secondary-div
let secondary_div = document.createElement('div');
secondary_div.style.height = "850px";
secondary_div.style.width = "900px";
secondary_div.style.position = "fixed";
secondary_div.style.display = "grid";
secondary_div.style.textAlign = "center";

// set Title
let site_title = document.createElement("h1");
site_title.innerHTML = "Willkommen zu Medieval Adventures";
site_title.style.font = "30px cursive";
site_title.style.gridColumnStart = "-1";
site_title.style.gridColumnEnd = "1";

let mode_tile = document.createElement("h1");
mode_tile.hidden = true;
mode_tile.id = "mode_tile";

// define the buttons on the Home-Site
let start_button = document.createElement("button");
start_button.innerHTML = "Starte in ein neues Abenteuer";
start_button.className = "buttons";
start_button.onclick = function (e) {
    if(onHomeScreen) {
        // changes from Home- to Mode-selection-side
        exit_button.innerHTML = "Zurück";
        // set global variables
        onHomeScreen = false;
        onModeDescriptionScreen = true;

        // load all elements for
        mode_description_div.hidden = false;
        mode_description_diff_div.hidden = false;
        for (let i = 0; i < description_buttons.length; i++){ description_buttons[i].hidden = false; }
        // changes from Mode-selection-side to Mode-description-side
        secondary_div.style.gridTemplateColumns = "auto ";
        start_button.innerHTML = "Abenteuer Starten";
        start_button.style.gridColumn = "1";

        mode_description_div.innerHTML =
            "<h3>Befreie das ausgewählte Gebiet von Monstern und erhalte eine angemessene Belohnung!</h3>" +
            "<h3>Gesichtete Monster: <label id='monster_number'>?</label> </h3> <br>" +
            "<label> Tipp 1: Das Töten der Frösche stellt ein Teil deines Lebens wieder her.</label> <br>" +
            "<label> Tipp 2: Auf der Karte sind mehrere Truhen versteckt. Finde sie und erhalte grossartige Belohnungen.</label> <br>" +
            "<label> Viel Erfolg bei deinem Abenteuer! </label>";
        // set global variables
        onModeDescriptionScreen = true;

    } else // Start a new Adventures in Mode-detail-side
    if (onModeDescriptionScreen){
        if((document.getElementById("monster_number").innerHTML === "?")||(document.getElementById("monster_number").style.color === "red")){
            mode_description_error = true;
            document.getElementById("monster_number").innerHTML = "Bitte einen Schwierigkeitsgrad auswählen!";
            document.getElementById("monster_number").style.color = "red";
        } else {
            mode_description_error = false;
        }
        if(!mode_description_error){
            start_game();
        }
    }
};

let exit_button = document.createElement("button");
exit_button.innerHTML = "Exit";
exit_button.className = "buttons";
exit_button.style.margin = "25px";
exit_button.onclick = function (e) {
    if (onHomeScreen){
        // open to the exit-Window --> to close the Game
        window.close();
    } else // Back-Button-Handler from Mode-selection-side
    if (onModeDescriptionScreen){
        // hide all Mode-description-element
        mode_description_div.hidden = true;
        mode_description_diff_div.hidden = true;
        for (let i = 0; i < description_buttons.length; i++){ description_buttons[i].hidden = true; }
        mode_description_div.innerHTML = "";
        // changes from Mode-description-side to Mode-selection-side
        start_button.innerHTML = "Starte in ein neues Abenteuer";
        exit_button.innerHTML = "Exit";
        // set global variables
        onModeDescriptionScreen = false;
        onHomeScreen = true;
    }
};

// Elements for Mode-description-site
// Description-Divs
let mode_description_div = document.createElement('div');
mode_description_div.className = "Description_div";
mode_description_div.style.font = "20px cursive ";
mode_description_div.style.height = "360px";
mode_description_div.style.margin = "0 100px 20px 100px";

let mode_description_diff_div = document.createElement('div');
mode_description_diff_div.className = "Description_div";
mode_description_diff_div.style.height = "80px";
mode_description_diff_div.style.margin = "0 100px 100px 100px";
mode_description_diff_div.innerHTML = "Welche Schwierigkeit: ";

let mode_description_difficult_1 = document.createElement("button");
mode_description_difficult_1.className = "buttons description_button";
mode_description_difficult_1.innerHTML = "Angsthase";
mode_description_difficult_1.onclick = function () {
    document.getElementById("monster_number").innerHTML = "6";
    if(mode_description_error){ document.getElementById("monster_number").style.color = "white";}
}
let mode_description_difficult_2 = document.createElement("button");
mode_description_difficult_2.className = "buttons description_button";
mode_description_difficult_2.innerHTML = "Könner";
mode_description_difficult_2.onclick = function () {
    document.getElementById("monster_number").innerHTML = "12";
    if (mode_description_error){ document.getElementById("monster_number").style.color = "white";}
}
let mode_description_difficult_3 = document.createElement("button");
mode_description_difficult_3.className = "buttons description_button";
mode_description_difficult_3.innerHTML = "Furchtloser";
mode_description_difficult_3.onclick = function () {
    document.getElementById("monster_number").innerHTML = "18";
    if (mode_description_error){ document.getElementById("monster_number").style.color = "white";}
}

// add all to the prime_div
secondary_div.appendChild(site_title);
secondary_div.appendChild(start_button);
secondary_div.appendChild(exit_button);
secondary_div.appendChild(mode_description_div);
mode_description_diff_div.appendChild(mode_description_difficult_1);
mode_description_diff_div.appendChild(mode_description_difficult_2);
mode_description_diff_div.appendChild(mode_description_difficult_3);
secondary_div.appendChild(mode_description_diff_div);
prime_div.appendChild(secondary_div)
document.body.appendChild(prime_div);

// set Button-Style
let buttons = document.getElementsByClassName("buttons");
for (let i = 0; i < buttons.length; i++){
    buttons[i].style.height = "96px";
    buttons[i].style.width = "340px";
    buttons[i].style.font = "22px cursive";
    buttons[i].style.border = "5px ridge rgba(211, 120, 50, 0.8)";
    buttons[i].style.margin = "0 280px 20px 280px";
    buttons[i].style.color = "rgba(255, 255, 255, 1)";
    buttons[i].style.backgroundColor = "rgba(30, 30, 30, 0.2)";
    buttons[i].style.textShadow = "1px 1px 2px black, 0 0 25px orange";
    // hover effekt
    buttons[i].addEventListener('mouseover', ()=>{
        buttons[i].style.boxShadow = "5px 5px 30px 30px rgba(225, 225, 225, 0.7)";
    });
    buttons[i].addEventListener('mouseout', ()=>{
        buttons[i].style.boxShadow = null;
    });
}

let description_buttons = document.getElementsByClassName("description_button");
for (let i = 0; i < description_buttons.length; i++){
    description_buttons[i].style.height = "40px";
    description_buttons[i].style.width = "120px";
    description_buttons[i].style.font = "18px cursive";
    description_buttons[i].style.margin = "20px 18px 4px 18px";
    description_buttons[i].hidden = true;
}

let description_divs = document.getElementsByClassName("Description_div");
for (let i = 0; i < description_divs.length; i++){
    description_divs[i].style.width = "700px";
    description_divs[i].style.font = "18px cursive";
    description_divs[i].style.border = "5px ridge rgba(211, 120, 50, 0.8)";
    description_divs[i].style.color = "rgba(255, 255, 255, 1)";
    description_divs[i].style.backgroundColor = "rgba(30, 30, 30, 0.4)";
    description_divs[i].hidden = true;
}

function start_game() {
    // get relevant Variables
    let monster_number = document.getElementById("monster_number").innerHTML;
    // hidde all elements from this Script
    prime_div.hidden = true;
    secondary_div.hidden = true;
    site_title.hidden = true;
    start_button.hidden = true;
    exit_button.hidden = true;
    mode_description_div.hidden = true;
    mode_description_diff_div.hidden = true;

    // config the body
    document.getElementsByTagName('body')[0].style.backgroundColor = "rgba(0, 100, 150, 0.8)";

    // config the title
    mode_tile.hidden = false;
    mode_tile.innerHTML = "Abenteuer: Säubere die Karte.";
    mode_tile.style.font = "22px";
    document.body.appendChild(mode_tile)

    start_Game((monster_number / 6) * 4);
}


// Start-Game-Funktion
function start_Game(monster_number) {

    // create a splash-screen
    let splash_screen_div  = document.createElement("div");
    splash_screen_div.style.height = (window.innerHeight - 120).toString() + "px";
    if (window.innerWidth < 1250){
        splash_screen_div.style.width = (window.innerWidth - 40).toString() + "px";
    } else {
        splash_screen_div.style.width = "1250px";
        splash_screen_div.style.left = ((window.innerWidth - 1250) / 2).toString() + "px";
    }
    splash_screen_div.style.position = "fixed";
    splash_screen_div.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    splash_screen_div.style.display = "block";
    splash_screen_div.style.zIndex = "9998";
    splash_screen_div.id = "splash_screen_div";
    splash_screen_div.style.border = "5px ridge rgba(211, 120, 50, 0.8)";
    document.body.appendChild(splash_screen_div);

    let splash_screen_image_div  = document.createElement("div");
    splash_screen_image_div.style.height = (window.innerHeight - 220).toString() + "px";
    splash_screen_image_div.style.width = splash_screen_div.style.width;
    splash_screen_image_div.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
    splash_screen_image_div.style.display = "flex";
    splash_screen_image_div.style.justifyContent = "spaceBetween";
    splash_screen_div.appendChild(splash_screen_image_div);

    let splash_screen_image_left_div  = document.createElement("div");
    splash_screen_image_div.appendChild(splash_screen_image_left_div);

    let splash_screen_img =  document.createElement("img");
    splash_screen_img.src = "images/image_0.png";
    splash_screen_img.style.height = (window.innerHeight - 250).toString() + "px";
    splash_screen_img.style.width = "450px";
    splash_screen_img.style.margin = "15px";
    splash_screen_image_left_div.appendChild(splash_screen_img);

    let random_image_npr = Math.floor(Math.random() * 4);
    let splash_screen_image_right_div =  document.createElement("div");
    splash_screen_image_right_div.style.backgroundImage = "url(" + splash_screen_image_list[random_image_npr] + ")";
    splash_screen_image_right_div.style.backgroundSize = "100%";
    splash_screen_image_right_div.style.backgroundRepeat = "round";
    splash_screen_image_right_div.style.opacity = "0.9";
    if (window.innerWidth < 1250){
        splash_screen_image_right_div.style.width = (window.innerWidth - 550).toString() + "px";
    } else {
        splash_screen_image_right_div.style.width = "740fpx";
    }
    splash_screen_image_right_div.style.margin ="15px";
    splash_screen_image_div.appendChild(splash_screen_image_right_div);

    let splash_screen_img_keyboard =  document.createElement("img");
    splash_screen_img_keyboard.src = "images/Tastatur_1.png";
    if (window.innerWidth < 1250){
        splash_screen_img_keyboard.style.width = (window.innerWidth - 570).toString() + "px";
    } else {
        splash_screen_img_keyboard.style.width = "720px";
    }
    splash_screen_img_keyboard.style.marginTop = (window.innerHeight / 2 - 250).toString() + "px";;
    splash_screen_img_keyboard.style.opacity = "1";
    splash_screen_image_right_div.appendChild(splash_screen_img_keyboard);

    let splash_screen_button_div  = document.createElement("div");
    splash_screen_button_div.style.height = "15%";
    splash_screen_button_div.style.width = "100%";
    splash_screen_button_div.style.display = "flex";
    splash_screen_button_div.style.alignItems = "center";
    splash_screen_button_div.style.justifyContent = "center";
    splash_screen_div.appendChild(splash_screen_button_div);

    let splash_screen_process_bar_div  = document.createElement("div");
    splash_screen_process_bar_div.style.border = "5px ridge rgba(0, 0, 0, 0.8)";
    splash_screen_process_bar_div.style.width = "60%"
    splash_screen_process_bar_div.id = "splash_screen_process_bar_div";
    splash_screen_process_bar_div.style.display = "flex";
    splash_screen_process_bar_div.style.alignItems = "center";
    splash_screen_process_bar_div.style.justifyContent = "center";
    splash_screen_button_div.appendChild(splash_screen_process_bar_div);

    let splash_screen_process_bar =  document.createElement("div");
    splash_screen_process_bar.id = "splash_screen_process_bar";
    splash_screen_process_bar.style.height = "20px";
    //splash_screen_process_bar.style.width = "0";
    splash_screen_process_bar.style.top = "50px";
    splash_screen_process_bar.style.border = "2px ridge rgba(0, 255, 50, 0.8)";
    splash_screen_process_bar.style.display = "block";
    splash_screen_process_bar.style.backgroundColor = "#4caf50";
    splash_screen_process_bar_div.appendChild(splash_screen_process_bar);

    let splash_screen_button =  document.createElement("button");
    splash_screen_button.innerHTML = "Abenteuer betreten"
    splash_screen_button.id = "splash_screen_button";
    splash_screen_button.style.margin = "25px";
    splash_screen_button.style.width = "200px";
    splash_screen_button.style.font = "22px cursive";
    splash_screen_button.style.border = "5px ridge rgba(211, 120, 50, 0.8)";
    splash_screen_button.style.margin = "0 280px 20px 280px";
    splash_screen_button.style.color = "rgba(255, 255, 255, 1)";
    splash_screen_button.style.backgroundColor = "rgba(30, 30, 30, 0.2)";
    splash_screen_button.style.textShadow = "1px 1px 2px black, 0 0 25px orange";

    splash_screen_button.style.display = "none";
    splash_screen_button.style.cursor = "pointer";
    // hover effekt
    splash_screen_button.addEventListener('mouseover', ()=>{
        splash_screen_button.style.boxShadow = "5px 5px 30px 30px rgba(225, 225, 225, 0.7)";
    });
    splash_screen_button.addEventListener('mouseout', ()=>{
        splash_screen_button.style.boxShadow = null;
    });
    splash_screen_button_div.appendChild(splash_screen_button);


    const HEIGHT =  window.innerHeight - 360;
    const WIDTH =  window.innerWidth - 40;

    // help-div for e.g. Character-information (life, endurance, mana)
    let help_div = document.createElement("div");
    help_div.style.height = (window.innerHeight - HEIGHT - 120).toString() + "px";
    help_div.style.width = (window.innerWidth - 20).toString() + "px";
    help_div.style.border = "10px ridge rgba(200, 150, 0, 0.8)";
    help_div.style.top = (HEIGHT + 100).toString() + "px";
    help_div.style.left = "1px";
    help_div.id = "help_div";
    help_div.style.display = "none";
    help_div.style.position = "fixed";
    document.body.appendChild(help_div);

    // basic the scene-div
    let scene_div = document.createElement('div');
    scene_div.style.height = HEIGHT.toString() + "px";
    scene_div.style.width = WIDTH.toString() + "px";
    scene_div.style.position = "fixed";
    scene_div.style.top = "80px";
    scene_div.style.left = "10px";
    scene_div.style.border = "10px ridge rgba(210, 120, 50, 0.8)";
    scene_div.id = "scene_div";
    scene_div.style.display = "none";
    document.body.appendChild(scene_div);

    // div for the health bar over
    let health_bar_div = document.createElement('div');
    health_bar_div.style.height =  (window.innerHeight - HEIGHT - 120).toString() + "px";
    health_bar_div.style.width = ((window.innerWidth - 20)/3).toString() + "px";
    health_bar_div.style.position = "fixed";
    health_bar_div.style.top = ((HEIGHT + 180)).toString() + "px";
    health_bar_div.style.left = ((window.innerWidth - 20)/6).toString() + "px";
    health_bar_div.style.overflow = 'hidden';
    health_bar_div.id = "health_bar_div";
    help_div.appendChild(health_bar_div);

    // help div for health bar border
    let health_bar_help_div = document.createElement('div');
    health_bar_help_div.style.height = '25%';
    health_bar_help_div.style.border = "3px ridge rgba(10, 255, 10, 0.3)";
    health_bar_div.appendChild(health_bar_help_div);

    // div for the health bar
    let health_bar = document.createElement('div');
    health_bar.style.height = '100%';
    health_bar.style.backgroundColor = 'rgba(10, 255, 10, 0.7)';
    health_bar.style.transition = 'width 0.3s ease-in-out';
    health_bar.id = "health_bar";
    health_bar_help_div.appendChild(health_bar);

    let health_text = document.createElement('h3');
    health_text.id = "health_text";
    health_text.style.font = "24px cursive";
    health_bar_div.appendChild(health_text);

    // div for the stamina bar div
    let stamina_bar_div = document.createElement('div');
    stamina_bar_div.style.height =  (window.innerHeight - HEIGHT - 120).toString() + "px";
    stamina_bar_div.style.width = ((window.innerWidth - 20)/4).toString() + "px";
    stamina_bar_div.style.position = "fixed";
    stamina_bar_div.style.top = (HEIGHT + 180).toString() + "px";
    stamina_bar_div.style.right = ((window.innerWidth - 20)/4).toString() + "px";
    stamina_bar_div.id = "stamina_bar_div";
    help_div.appendChild(stamina_bar_div);

    // help div for health bar border
    let stamina_bar_help_div = document.createElement('div');
    stamina_bar_help_div.style.height = '25%';
    stamina_bar_help_div.style.border = "3px ridge rgba(255, 240, 10, 0.3)";
    stamina_bar_div.appendChild(stamina_bar_help_div);

    // div for the health bar div
    let stamina_bar = document.createElement('div');
    stamina_bar.style.height = '100%';
    stamina_bar.style.backgroundColor = 'rgba(255, 240, 10, 0.8)';
    stamina_bar.style.transition = 'width';
    stamina_bar.id = "stamina_bar";
    stamina_bar_help_div.appendChild(stamina_bar);

    let stamina_text = document.createElement('h3');
    stamina_text.id = "stamina_text";
    stamina_text.style.font = "24px cursive";
    stamina_bar_div.appendChild(stamina_text);

    let score_div = document.createElement('div');
    score_div.style.height =  (window.innerHeight - HEIGHT - 130).toString() + "px";
    score_div.style.width = ((window.innerWidth - 20)/4).toString() + "px";
    score_div.style.position = "fixed";
    score_div.style.display = "grid";
    score_div.style.right = "0px";
    score_div.id = "score_div";
    help_div.appendChild(score_div);

    let score_text = document.createElement('h3');
    score_text.id = "score_text";
    score_text.style.margin = "0px";
    score_text.style.gridRow = "1";
    score_text.style.height = "30px";
    score_div.appendChild(score_text);

    let chest_text = document.createElement('h3');
    chest_text.id = "chest_text";
    chest_text.style.margin = "0px";
    chest_text.style.height = "30px";
    chest_text.style.gridRow = "2";
    score_div.appendChild(chest_text);

    let bonus_text_0 = document.createElement('h3');
    bonus_text_0.innerHTML = "Erhaltene Boni:";
    bonus_text_0.style.margin = "0px";
    bonus_text_0.style.height = "30px";
    bonus_text_0.style.gridRow = "3";
    score_div.appendChild(bonus_text_0);

    let bonus_text_ul = document.createElement('ul');
    bonus_text_ul.style.display ="grid";
    bonus_text_ul.style.margin = "0px";
    bonus_text_ul.style.height =  (window.innerHeight - HEIGHT - 230).toString() + "px";
    bonus_text_ul.style.gridRow = "4";
    bonus_text_ul.style.gridTemplateColumns = "46% 46%";
    bonus_text_ul.style.gridTemplateRows = "30% 30% 30%";
    bonus_text_ul.style.font = "20px cursive";
    score_div.appendChild(bonus_text_ul);

    let bonus_1_div  = document.createElement('div');
    bonus_1_div.style.display = "grid";
    bonus_1_div.style.gridTemplateColumns = "2";
    bonus_1_div.style.gridRow = "1";
    bonus_1_div.style.gridColumn = "1";
    let bonus_1_text= document.createElement('p');
    bonus_1_text.id = "bonus_1_text";
    bonus_1_text.innerText = " Lp + ";
    bonus_1_text.style.textAlign = "left";
    let bonus_1_value  = document.createElement('p');
    bonus_1_value.id = "bonus_1_value";
    bonus_1_value.style.gridColumn = "2";
    bonus_1_value.innerHTML = "";
    bonus_text_ul.appendChild(bonus_1_div);
    bonus_1_div.appendChild(bonus_1_text);
    bonus_1_div.appendChild(bonus_1_value);

    let bonus_2_div  = document.createElement('div');
    bonus_2_div.style.display = "grid";
    bonus_2_div.style.gridTemplateColumns = "2";
    bonus_2_div.style.gridRow = "1";
    bonus_2_div.style.gridColumn = "2";
    let bonus_2_text= document.createElement('p');
    bonus_2_text.id = "bonus_2_text";
    bonus_2_text.innerText = " Ap + ";
    let bonus_2_value  = document.createElement('p');
    bonus_2_value.id = "bonus_2_value";
    bonus_2_value.style.gridColumn = "2";
    bonus_2_value.innerHTML = "";
    bonus_text_ul.appendChild(bonus_2_div);
    bonus_2_div.appendChild(bonus_2_text);
    bonus_2_div.appendChild(bonus_2_value);

    let bonus_3_div  = document.createElement('div');
    bonus_3_div.style.display = "grid";
    bonus_3_div.style.gridColumn = "1";
    bonus_3_div.style.gridRow = "2";
    bonus_3_div.style.gridTemplateColumns = "2";
    let bonus_3_text= document.createElement('p');
    bonus_3_text.id = "bonus_3_text";
    bonus_3_text.innerText = "Heilung + "
    bonus_3_text.style.textAlign = "left";
    let bonus_3_value  = document.createElement('p');
    bonus_3_value.id = "bonus_3_value";
    bonus_3_value.style.gridColumn = "2";
    bonus_3_value.innerHTML = "";
    bonus_text_ul.appendChild(bonus_3_div);
    bonus_3_div.appendChild(bonus_3_text);
    bonus_3_div.appendChild(bonus_3_value);

    let bonus_4_div  = document.createElement('div');
    bonus_4_div.style.display = "grid";
    bonus_4_div.style.gridTemplateColumns = "2";
    bonus_4_div.style.gridRow = "2";
    bonus_4_div.style.gridColumn = "2";
    let bonus_4_text= document.createElement('p');
    bonus_4_text.id = "bonus_4_text";
    bonus_4_text.innerText = "Dmg "
    let bonus_4_value  = document.createElement('p');
    bonus_4_value.id = "bonus_4_value";
    bonus_4_value.style.gridColumn = "2";
    bonus_4_value.innerHTML = "";
    bonus_text_ul.appendChild(bonus_4_div);
    bonus_4_div.appendChild(bonus_4_text);
    bonus_4_div.appendChild(bonus_4_value);

    let bonus_5_div  = document.createElement('div');
    bonus_5_div.style.display = "grid";
    bonus_5_div.style.gridRow = "3"
    bonus_5_div.style.gridColumnStart = "1";
    bonus_5_div.style.gridColumnEnd = "3";
    bonus_5_div.style.gridTemplateColumns = "2";
    let bonus_5_text= document.createElement('p');
    bonus_5_text.id = "bonus_5_text";
    bonus_5_text.style.textAlign = "left";
    bonus_5_text.innerText = "Punkte + "
    let bonus_5_value  = document.createElement('p');
    bonus_5_value.id = "bonus_5_value";
    bonus_5_value.style.gridColumn = "2";
    bonus_5_value.innerHTML = "";
    bonus_text_ul.appendChild(bonus_5_div);
    bonus_5_div.appendChild(bonus_5_text);
    bonus_5_div.appendChild(bonus_5_value);

    // init target_bord
    let target_div = document.createElement('div');
    target_div.style.height =  (window.innerHeight - HEIGHT - 120).toString() + "px";
    target_div.style.width = ((window.innerWidth - 20)/6).toString() + "px";
    target_div.style.position = "fixed";
    target_div.style.display = "grid";
    target_div.style.top = (HEIGHT + 120).toString() + "px";
    target_div.style.left = "0px";
    target_div.id = "target_div";
    help_div.appendChild(target_div);

    let target_text_0 = document.createElement('h3');
    target_text_0.innerHTML = "Übrige Gegner:";
    target_text_0.style.gridRow = "1";
    target_text_0.style.margin = "0";
    target_div.appendChild(target_text_0);

    let target_text_ul = document.createElement('ul');
    target_text_ul.style.gridRow = "2";
    target_text_ul.style.font = "20px cursive";
    target_text_ul.style.margin = "0";
    target_div.appendChild(target_text_ul);
    let target_text_1 = document.createElement('li');
    target_text_1.id = "target_text_1";
    target_text_ul.appendChild(target_text_1);
    let target_text_2 = document.createElement('li');
    target_text_2.id = "target_text_2";
    target_text_ul.appendChild(target_text_2);
    let target_text_3 = document.createElement('li');
    target_text_3.id = "target_text_3";
    target_text_ul.appendChild(target_text_3);
    let target_text_4 = document.createElement('li');
    target_text_4.id = "target_text_4";
    target_text_ul.appendChild(target_text_4);
    let target_text_5 = document.createElement('li');
    target_text_5.id = "target_text_5";
    target_text_ul.appendChild(target_text_5);


    let info_text_div = document.createElement('div');
    info_text_div.style.display = "flex";

    let info_text = document.createElement('h3');
    info_text.style.marginTop = "10px";
    info_text.id = "info_text";
    info_text.style.font = "20px cursive";
    info_text.style.width = ((window.innerWidth - 20)/2 + 50).toString() + "px";
    info_text.innerHTML = "Hier werden die Infotexte stehen";

    let give_up_button = document.createElement("button");
    give_up_button.id = "give_up_button";
    give_up_button.innerHTML = "Aufgeben";
    give_up_button.style.font = "20px cursive";
    give_up_button.style.width = "100px";
    give_up_button.style.marginLeft = (((window.innerWidth - 20)/6) - 15).toString() + "px";
    give_up_button.style.marginTop = "10px"
    give_up_button.style.border = "5px ridge rgba(211, 120, 50, 0.8)";
    give_up_button.style.color = "rgba(255, 255, 255, 1)";
    give_up_button.style.backgroundColor = "rgba(30, 30, 30, 0.2)";
    // hover effekt
    give_up_button.addEventListener('mouseover', ()=>{
        give_up_button.style.boxShadow = "5px 5px 20px 20px rgba(225, 225, 225, 0.7)";
    });
    give_up_button.addEventListener('mouseout', ()=>{
        give_up_button.style.boxShadow = null;
    });
    help_div.appendChild(info_text_div);
    info_text_div.appendChild(give_up_button);
    info_text_div.appendChild(info_text)

    let random_image_npr_2 = Math.floor(Math.random() * 4);
    // End-div

    let end_div =  document.createElement('div');
    end_div.style.backgroundImage = "url(" + splash_screen_image_list[random_image_npr_2] + ")";
    end_div.style.backgroundSize = "100%";
    end_div.style.backgroundRepeat = "round";
    end_div.style.width = "100%";
    end_div.style.height = "100%"
    //end_div.style.opacity = "0.4";

    end_div.id = "end_div";
    end_div.style.color = "rgba(0, 0, 0, 1)";
    end_div.style.font = "25px cursive";
    end_div.style.border = "0.5px ridge rgba(211, 120, 50, 0.8)";
    end_div.hidden = true;
    end_div.innerHTML =
        "<h3 id='showed_end_text'></h3>" +
        "<h3>Getötete Monster: <label id='killed_monsters'>?</label><label> / </label><label id='max_monsters'>?</label></h3>" +
        "<label>Gefundene Truhen: </label><label id='founded_chests'>?</label><label> / </label><label>12</label><br>" +
        "<label>Erlittener Schaden: </label><label id='damage_suffered'>?</label> <br>" +
        "<label>Genötigte Zeit: </label><label id='used_time'>?</label> <br> <br>" +

        "<div style='display: flex; justify-content: space-between;'>" +
        "<ul style='flex: 1; list-style: none; padding: 0; margin: 0;'>" +
            "<li>" +
                "<label>Getötete Spinnen: </label><label id='killed_spiders'></label>" +
                "<label> / </label><label id='max_spiders'></label>" +
            "</li>" +
            "<li>" +
                "<label>Getötete Wespen: </label><label id='killed_wasps'></label>" +
                "<label> / </label><label id='max_wasps'></label>" +
            "</li>" +
            "<li>" +
                "<label>Getötete Ratten: </label><label id='killed_rats'></label>" +
                "<label> / </label><label id='max_rats'></label>" +
            "</li>" +
        "</ul>" +
        "<ul style='flex: 1; list-style: none; padding: 0; margin: 0;'>" +
            "<li>" +
                "<label>Getötete Skelette: </label><label id='killed_skeletons'></label>" +
                "<label> / </label><label id='max_skeletons'></label>" +
            "</li>" +
            "<li>" +
                "<label>Getötete Frösche: </label><label id='killed_frogs'></label>" +
                "<label> / </label><label id='max_frogs'></label>" +
            "</li>" +
        "</ul>" +
    "</div>";

    let back_button = document.createElement("button");
    back_button.innerHTML = "Zurück zum Hauptmenü";
    back_button.id = "back_button";
    back_button.hidden = true;
    back_button.style.margin = "25px";
    back_button.style.font = "22px cursive";
    back_button.style.border = "5px ridge rgba(211, 120, 50, 0.8)";
    back_button.style.margin = "0 280px 20px 280px";
    back_button.style.color = "rgba(255, 255, 255, 1)";
    back_button.style.backgroundColor = "rgba(30, 30, 30, 0.2)";
    back_button.style.textShadow = "1px 1px 2px black, 0 0 25px orange";
    // hover effekt
    back_button.addEventListener('mouseover', ()=>{
        back_button.style.boxShadow = "5px 5px 30px 30px rgba(225, 225, 225, 0.7)";
    });
    back_button.addEventListener('mouseout', ()=>{
        back_button.style.boxShadow = null;
    });
    back_button.onclick = function (e) {
        back_to_home_screen();
    };
    help_div.appendChild(back_button);
    scene_div.appendChild(end_div);


    // the tree.js-Elements
    // initialize the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.domElement.id = "renderer";
    scene_div.appendChild(renderer.domElement);

    // initialize the scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x89b2eb, 0.002);
    // set scene-background
    scene.background = new THREE.TextureLoader().load("../game_new/images/sky_1.png");
    //scene.background.encoding = THREE.sRGBEncoding;

    // initialize the camera
    const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1.0, 1000);

    // initialize the lights
    const light_1 = new THREE.DirectionalLight(0xFFFFFF, 2.5);
    light_1.position.set(0, 100, 0);
    light_1.target.position.set(0, 0, 0);
    light_1.castShadow = true;
    light_1.shadow.bias = -0.001;
    light_1.shadow.mapSize.width = 150;
    light_1.shadow.mapSize.height = 150;
    scene.add(light_1);

    const light_2 = new THREE.DirectionalLight(0xFFFFFF, 2.5);
    light_2.position.set(150, 100, 150);
    light_2.target.position.set(100, 0, 100);
    light_2.castShadow = true;
    light_2.shadow.bias = -0.001;
    light_2.shadow.mapSize.width = 150;
    light_2.shadow.mapSize.height = 150;
    scene.add(light_2);

    const light_3 = new THREE.DirectionalLight(0xFFFFFF, 2);
    light_3.position.set(-150, 100, 150);
    light_3.target.position.set(-100, 0, 100);
    light_3.castShadow = true;
    light_3.shadow.bias = -0.001;
    light_3.shadow.mapSize.width = 150;
    light_3.shadow.mapSize.height = 150;
    scene.add(light_3);

    const light_4 = new THREE.DirectionalLight(0xFFFFFF, 2.5);
    light_4.position.set(150, 100, -150);
    light_4.target.position.set(100, 0, -100);
    light_4.castShadow = true;
    light_4.shadow.bias = -0.001;
    light_4.shadow.mapSize.width = 150;
    light_4.shadow.mapSize.height = 150;
    scene.add(light_4);

    const light_5 = new THREE.DirectionalLight(0xFFFFFF, 2);
    light_5.position.set(-150, 100, -150);
    light_5.target.position.set(-100, 0, -100);
    light_5.castShadow = true;
    light_5.shadow.bias = -0.001;
    light_5.shadow.mapSize.width = 150;
    light_5.shadow.mapSize.height = 150;
    scene.add(light_5);

    // initialize the model, view and controller
    /*
    Model (Modell): Das Modell repräsentiert die Daten und die Geschäftslogik der Anwendung.
    View (Ansicht): Die Ansicht ist verantwortlich für die Darstellung der Daten und Benutzerschnittstelle.
    Controller (Steuerung): Der Controller nimmt Benutzereingaben entgegen, verarbeitet sie und aktualisiert das Modell und die Ansicht entsprechend.
    */
    const model = new Model(scene, monster_number);
    const view = new View(scene, camera, renderer, model);
    view.render(model); // Erste Anzeige aktualisieren
    const controller = new Controller(model, view);

    console.dir(model)
    console.dir(view)
    console.dir(controller)

    // click-handler for give_up_button
    give_up_button.onclick = function () {
        controller.give_up_button_handler();
    }
}


export function back_to_home_screen(){
    // if the ok button was licked ...
    // ... load all Element from this script
    prime_div.hidden = false;
    secondary_div.hidden = false;
    site_title.hidden = false;
    start_button.hidden = false;
    exit_button.hidden = false;
    onHomeScreen = true;
    onModeDescriptionScreen = false;
    mode_description_error = false;
    document.getElementsByTagName('body')[0].style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    // hide all Mode-Element
    mode_tile.hidden = true;

    // remove all divs from game
    document.body.removeChild(document.getElementById("scene_div"));
    document.body.removeChild(document.getElementById("help_div"));

}
