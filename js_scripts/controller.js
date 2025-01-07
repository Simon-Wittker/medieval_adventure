import * as THREE from 'three';

export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.current_hp = 0;
        this.out_of_stamnia = false;
        this.index_of_chest = 0;
        this.game_end = false;
        this.game_termiated = false;
        this.rotation_time = 0;
        this.living_npc_list = [];
        this.founded_chests = [];
        this.realy_give_up = false;

        this.clock = new THREE.Clock();
        this.clock.start();
        this.used_time = 0;

        this.splash_screen_handler();
        this.init_player_hud();
        this.bind_event_listeners();
        this.animate();
    }
    /*
    splash_screen_handler(){
        // progress bar and splash screen handler
        let width = 0;
        document.getElementById('splash_screen_process_bar_div').style.display = "block";
        document.getElementById('splash_screen_process_bar').style.width = "1px";
        let interval = setInterval(function () {
            width += 2.5; // Increase the width of the progress bar
            document.getElementById('splash_screen_process_bar').style.width = width + '%';
            if (width >= 100) {
                clearInterval(interval);
                // Hide the progress bar and show the button after a delay
                setTimeout(function () {
                    document.getElementById('splash_screen_button').style.display = 'block';
                    document.getElementById('splash_screen_process_bar_div').style.display = "none";
                    //document.getElementById('splash_screen_process_bar').style.width = "0px";
                    }, 1000); // Adjust the delay time as needed
                }
            }, 100); // Adjust the interval time as needed
        // splash screen button handler
        document.getElementById('splash_screen_button').onclick = function (e) {
            document.getElementById('splash_screen_div').style.display = 'none';
            document.getElementById('help_div').style.display = 'block';
            document.getElementById('scene_div').style.display = 'block';
        };
    }
        */
    splash_screen_handler() {
        // Referenzen für die beteiligten Elemente
        const progressBarDiv = document.getElementById('splash_screen_process_bar_div');
        const progressBar = document.getElementById('splash_screen_process_bar');
        const splashScreenButton = document.getElementById('splash_screen_button');
        const splashScreenDiv = document.getElementById('splash_screen_div');
        const helpDiv = document.getElementById('help_div');
        const sceneDiv = document.getElementById('scene_div');
    
        // Initialisierung
        progressBarDiv.style.display = "block";
        progressBar.style.width = "0px";
        splashScreenButton.style.display = "none";
    
        // Lokale Variable für die Breite des Fortschrittsbalkens
        let width = 0;
    
        // Fortschrittsbalken-Animation
        const interval = setInterval(() => {
            width += 2.5; // Schrittweite des Fortschritts
            progressBar.style.width = `${width}%`;
    
            if (width >= 100) {
                clearInterval(interval); // Intervall beenden, wenn der Balken voll ist
                setTimeout(() => {
                    splashScreenButton.style.display = 'block'; // Button anzeigen
                    progressBarDiv.style.display = "none"; // Fortschrittsbalken ausblenden
                }, 1000); // Zeitverzögerung, bevor der Button erscheint
            }
        }, 100); // Intervallzeit (100 ms)
    
        // Event-Handler für den Button
        splashScreenButton.onclick = () => {
            splashScreenDiv.style.display = 'none'; // Splash-Screen ausblenden
            helpDiv.style.display = 'block'; // Hilfeseite anzeigen
            sceneDiv.style.display = 'block'; // Spielszene anzeigen
        };
    }
    

    init_player_hud(){
        // init dmg value
        document.getElementById("bonus_4_value").innerHTML = this.model.player_dmg;
        setTimeout(function () {
            document.getElementById("info_text").innerHTML = "";
        },2000);
    }
    // keyboard-bind-event-listener
    bind_event_listeners() {
        window.addEventListener("keydown", this.on_key_down.bind(this));
        window.addEventListener("keyup", this.on_key_up.bind(this));
    }

    on_key_down(event) {
        if (!this.model.open_chest && !this.game_end && this.model.round_counter_for_npc >= 2) {
            switch (event.key) {
                case "w":
                    this.model.moving_forward = true;
                    this.update_player_animation();
                    break;
                case "Shift":
                    this.model.running = true;
                    this.model.attacking = false;
                    this.model.blocking = false;
                    this.update_player_animation();
                    this.model.move_speed *= 2;
                    break;
                case "s":
                    this.model.moving_backward = true;
                    this.update_player_animation();
                    break;
                case "a":
                    this.model.rotating_left = true;
                    this.update_player_animation();
                    break;
                case "d":
                    this.model.rotating_right = true;
                    this.update_player_animation();
                    break;
                case "j":
                    this.model.attacking = true;
                    this.model.move_speed *= 0.33;
                    this.update_player_animation();
                    this.model.player_stamina -= 1;
                    // waiting for the animation for dmg-control
                    const waiting_Animation = new Promise((resolve, reject) => {
                        setTimeout(function () { resolve(); }, 800);
                    });
                    Promise.all([waiting_Animation]).then(() => { this.attacking_handler(); });
                    break;
                case "k":
                    this.model.blocking = true;
                    this.model.move_speed *= 0.33;
                    this.update_player_animation();
                    break;
                case "e":
                    this.model.open_chest = this.chest_open_handler();
                    this.update_player_animation();
                    break;
                case "r":
                    console.log(this.model.player_model.position);
                    document.getElementById("info_text").innerHTML = "Zurücksetzung der Position für 1/4 der Lebenspunkte";
                    this.model.player_healthpoints = Math.ceil(this.model.player_healthpoints - (this.model.player_healthpoints / 4));
                    this.model.player_model.position.set(24, 0, 132);
                    this.model.move_speed = 15;
                    setTimeout(function () {
                        document.getElementById("info_text").innerHTML = "";
                    },2000);
                    break;
            }
        }
    }

    on_key_up(event) {
        if (!this.model.open_chest && !this.game_end && this.model.round_counter_for_npc >= 2 ) {
            switch (event.key) {
                case "w":
                    this.model.moving_forward = false;
                    this.update_player_animation();
                    break;
                case "Shift":
                    this.model.running = false;
                    if (!this.out_of_stamnia){
                        this.model.move_speed /= 2;
                    } else {
                        this.out_of_stamnia = false;
                    }
                    this.update_player_animation();
                    break;
                case "s":
                    this.model.moving_backward = false;
                    this.update_player_animation();
                    break;
                case "a":
                    this.model.rotating_left = false;
                    this.update_player_animation();
                    break;
                case "d":
                    this.model.rotating_right = false;
                    this.update_player_animation();
                    break;
                case "j":
                    this.model.attacking = false;
                    this.model.move_speed /= 0.33;
                    this.update_player_animation();
                    break;
                case "k":
                    this.model.blocking = false;
                    this.model.move_speed /= 0.33;
                    this.update_player_animation();
                    break;
            }
        }
    }

    update_player_animation(){
        const { idle, walk, run, attack, block, chest_opening, impact, death, victory } = this.model.actions;
        if (!this.game_end){
            if (!this.model.moving_forward && !this.model.moving_backward && !this.model.attacking && !this.model.blocking && !this.model.open_chest && !this.model.rotating_left && !this.model.rotating_right && !this.model.getting_impact){
                // idle
                idle.play();
                walk.stop();
                run.stop();
                attack.stop();
                block.stop();
                impact.stop()
                chest_opening.stop();
            } else if ((this.model.moving_forward || this.model.rotating_left || this.model.rotating_right)  && !this.model.running && !this.model.attacking && !this.model.blocking && !this.model.open_chest) {
                // moving forward or rotation
                idle.stop();
                walk.play();
                run.stop();
                attack.stop();
                block.stop();
                impact.stop()
                chest_opening.stop();
            } else if ((this.model.moving_forward || this.model.rotating_left || this.model.rotating_right)  && this.model.running && !this.model.attacking && !this.model.blocking && !this.model.open_chest) {
                // running forward or/and rotation
                idle.stop();
                walk.stop();
                run.play();
                attack.stop();
                block.stop();
                impact.stop()
                chest_opening.stop();
                if (this.model.player_stamina >= 2){
                    this.model.player_stamina -= 2;
                } else {
                    this.model.move_speed /= 2;
                    this.out_of_stamnia = true;
                    this.model.running = false;
                    this.update_player_animation();
                }
            }  else if ((this.model.moving_backward || this.model.rotating_left || this.model.rotating_right)  && !this.model.attacking && !this.model.blocking && !this.model.open_chest) {
                // moving backward or/and rotation
                idle.stop();
                walk.play();
                run.stop();
                attack.stop();
                block.stop();
                impact.stop()
                chest_opening.stop();
            } else if (this.model.attacking && !this.model.blocking && !this.model.open_chest) {
                // attacke
                idle.stop();
                walk.stop();
                run.stop();
                attack.play();
                block.stop();
                impact.stop()
                chest_opening.stop();
            } else if (this.model.blocking && !this.model.attacking && !this.model.open_chest) {
                // block
                idle.stop();
                walk.stop();
                run.stop();
                attack.stop();
                block.play();
                impact.stop()
                chest_opening.stop();
            } else if (this.model.open_chest){
                // chest opening
                idle.stop();
                walk.stop();
                run.stop();
                attack.stop();
                block.stop();
                impact.stop()
                chest_opening.play();
                // play chest animation
                const { open } = this.model.chest_actions_list[this.index_of_chest];
                open.play()
                // waiting for the end of the chest animation
                const load_animation = new Promise((resolve, reject) => {
                    setTimeout(function () {
                        chest_opening.stop();
                        idle.play();
                        resolve();
                    }, 2000);
                });
                Promise.all([load_animation]).then(() => {
                    // make sure the chest is only opened once
                    if (this.index_of_chest > -1){
                        console.log("this.index_of_chest in animation = " + this.index_of_chest);
                        // show the chest bonus
                        let text_1 = this.model.chest_bonus_texts[this.index_of_chest][0];
                        let text_2 = this.model.chest_bonus_texts[this.index_of_chest][1];
                        this.update_boni(text_1, text_2);
                        // add the score_points
                        this.model.player_score += this.model.chest_list[this.index_of_chest].points;
                        // delete the chest
                        this.model.chest_list[this.index_of_chest] = null;
                        this.model.chest_mixer_list[this.index_of_chest] = null;
                        this.index_of_chest = -1;
                        this.model.open_chest = false;
                    }
                });
            } else if (this.model.getting_impact) {
                // impact
                idle.stop();
                walk.stop();
                run.stop();
                attack.stop();
                block.stop();
                impact.play()
                chest_opening.stop();
            }
            // if the game is over
        } else { // if the player is death
            if(this.model.player_is_death){
                // player is death
                idle.stop();
                walk.stop();
                run.stop();
                attack.stop();
                block.stop();
                impact.stop()
                chest_opening.stop();
                death.play();
            } else {
                // player is victory
                idle.stop();
                walk.stop();
                run.stop();
                attack.stop();
                block.stop();
                impact.stop()
                chest_opening.stop();
                victory.play();
            }
        }
    }

    // GameLoop-Function ***********************************************************************************************
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        // set delta
        const delta = this.clock.getDelta();
        // stop animate if game end
        if(this.model.player_is_death && this.rotation_time >= 0.75){
            this.clock.stop();
            cancelAnimationFrame(this.animate.bind(this));
            this.game_finished();
            return;
        } else if (!this.model.player_is_death && this.rotation_time > 6){
            this.clock.stop();
            cancelAnimationFrame(this.animate.bind(this));
            this.game_finished();
        }

        this.model.game_end = this.game_end;

        // config for player
        if (this.model.player_model) {
                // update the model's position
                this.update_player_position(delta);
                // update animation
                if (this.model.mixer) { this.model.mixer.update(delta); }
                // update camera
                const player_position = new THREE.Vector3();
                player_position.copy(this.model.player_model.position);
                let camera_offset = new THREE.Vector3(0, 12, -12);
                let camera_y = 6;
                if (!this.game_end) {
                    this.view.camera.position.copy(new THREE.Vector3().addVectors(player_position, camera_offset.applyQuaternion(this.model.player_model.quaternion)));
                } else {
                    this.used_time = this.clock.elapsedTime;
                    let rotation_center = new THREE.Vector3();
                    rotation_center.copy(this.model.player_model.position);
                    let rotation_radius = 14;
                    let rotationSpeed = 0.2;
                    let newY = this.view.camera.position.y;

                    if (this.model.player_is_death){
                        if (this.view.camera.position.y >= 2){
                            camera_y -= 0.75;
                            newY -= 0.3;
                        }
                    } else {
                        rotationSpeed = 0.8;
                    }

                    this.rotation_time += Math.round(rotationSpeed * delta * 1000) / 1000;
                    let newX = rotation_center.x + rotation_radius * Math.cos(this.rotation_time);
                    let newZ = rotation_center.z + rotation_radius * Math.sin(this.rotation_time);
                    this.view.camera.position.set(newX, newY, newZ);
                }
                    this.view.camera.lookAt(player_position.add(new THREE.Vector3(0, camera_y, 0)));
        }
        // npc-animation updates
        if (this.model.npc_models && this.model.round_counter_for_npc >= 2) {
            for (let i = 0; i < this.model.npc_models.length; i++) {
                if (this.model.npc_models[i] !== null && this.model.player_model) {
                    // update npc position
                    this.model.update_npc_position(i, delta);
                    // update npc mixer
                    if (this.model.npc_mixer_list[i] !== null) { this.model.npc_mixer_list[i].update(delta); }
                    // update npc health bar
                    this.model.npc_health_bar_update(i);
                }
            }
        }
        // update player animation and player hud
        if (this.model.round_counter_for_npc >= 2 && !this.game_end){
            // start background musik
            //this.start_play_background_audio();
            // update player animation
            this.update_player_animation();
            // update player health bar
            this.update_health_bar();
            // update player stamina
            this.update_stamina_bar();
            // update info board
            this.update_info_board()
        }
        // chest-animation updates
        if (this.model.chest_list){
            for (let i = 0; i < this.model.chest_list.length; i++){
                if (this.model.chest_list[i] !== null){ this.model.chest_mixer_list[i].update(delta); }
            }
        }
        this.model.counter_for_npc++;
        if (this.model.counter_for_npc === 100){
            this.model.round_counter_for_npc++;
            this.model.counter_for_npc = 1;
        }
        if (this.model.round_counter_for_npc === 100){
            this.model.round_counter_for_npc = 1;
        }
        this.view.render(this.model);
    }

    update_player_position(delta){
        // player rotating left
        if (this.model.rotating_left) {
            this.model.player_model.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.model.rotation_speed * delta));
        }
        // player rotating right
        if (this.model.rotating_right) {
            this.model.player_model.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -this.model.rotation_speed * delta));
        }
        // init the old position
        let old_position = new THREE.Vector3();
        old_position.copy(this.model.player_model.position);
        // player moving forward
        if (this.model.moving_forward) {
            const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(this.model.player_model.quaternion);
            let new_forward_position = old_position.add(direction.multiplyScalar(this.model.move_speed * delta));

            // create a new character box on the future position (forward)
            this.model.character_box = new THREE.Box3(
                new THREE.Vector3(new_forward_position.x - 1, new_forward_position.y, new_forward_position.z - 1),
                new THREE.Vector3(new_forward_position.x + 1, new_forward_position.y + 2, new_forward_position.z + 1)
            );

            if (this.model.collision_check(this.model.character_box, 1)) {
                this.model.player_model.position.add(direction.multiplyScalar(this.model.move_speed * delta));
            }
        }
        // player moving backward
        if (this.model.moving_backward) {
            const backward_direction = new THREE.Vector3(0, 0, 1).applyQuaternion(this.model.player_model.quaternion);
            let new_backward_position = old_position.add(backward_direction.multiplyScalar(this.model.move_speed * delta * -1));
            // create a new character box on the future position (backward)
            let backward_box = new THREE.Box3(
                new THREE.Vector3(new_backward_position.x - 1, new_backward_position.y, new_backward_position.z - 1),
                new THREE.Vector3(new_backward_position.x + 1, new_backward_position.y + 2, new_backward_position.z + 1)
            );
            if (this.model.collision_check(backward_box, 1)) {
                this.model.player_model.position.add(backward_direction.multiplyScalar(this.model.move_speed * delta));
            }
        }
    }
    // player attack handler
    attacking_handler() {
        const range_box = new THREE.Box3(
            new THREE.Vector3(this.model.player_model.position.x - 2, this.model.player_model.position.y, this.model.player_model.position.z - 2),
            new THREE.Vector3(this.model.player_model.position.x + 2, this.model.player_model.position.y + 2, this.model.player_model.position.z + 2));

        for (let i = 0; i < this.model.object_boxes_npc.length; i++) {
            // check collision
            if (range_box.intersectsBox(this.model.object_boxes_npc[i])) {
                this.model.npc_models[i].healthpoints -= this.model.player_dmg;
            }
        }
    }
    // player chest opening
    chest_open_handler() {
        const collision_box = new THREE.Box3(
            new THREE.Vector3(this.model.player_model.position.x - 1.5, this.model.player_model.position.y, this.model.player_model.position.z - 1.5),
            new THREE.Vector3(this.model.player_model.position.x + 1.5, this.model.player_model.position.y + 2, this.model.player_model.position.z + 1.5));

        for (let i = 0; i < this.model.chest_list.length; i++) {
            if (this.model.chest_list[i] !== null) {
                const chest_box = new THREE.Box3(
                    new THREE.Vector3(this.model.chest_list[i].position.x - 3.5, this.model.chest_list[i].position.y, this.model.chest_list[i].position.z - 3.5),
                    new THREE.Vector3(this.model.chest_list[i].position.x + 3.5, this.model.chest_list[i].position.y + 2, this.model.chest_list[i].position.z + 3.5));
                if (collision_box.intersectsBox(chest_box)) {
                    // there is a chest near the player
                    this.index_of_chest = i;
                    return true;
                }
            }
        }
    }

    update_health_bar(){
        // if the player is death
        if (this.model.player_healthpoints <= 0){
            this.model.player_is_death = true;
            this.game_end = true;
            this.update_player_animation();
        }
        // play impact-animation if true
        this.model.getting_impact = this.current_hp > this.model.player_healthpoints;

        if(!this.model.getting_impact && this.model.player_healthpoints <= (this.model.player_max_healthpoints - 0.1) && !this.model.player_is_death){
            this.model.player_healthpoints += 0.1;
        }

        let percentage = (this.model.player_healthpoints / this.model.player_max_healthpoints) * 100;
        document.getElementById("health_bar").style.width = percentage + '%';

        let health_text = (Math.ceil(this.model.player_healthpoints)).toString();
        document.getElementById("health_text").innerHTML = "Lebenspunkte (Lp) = " + health_text + " / " + this.model.player_max_healthpoints;

        this.current_hp = this.model.player_healthpoints;
    }

    update_stamina_bar(){
        if (!this.model.running && this.model.player_stamina <= (this.model.player_max_stamina - 0.5) && !this.out_of_stamnia){
            this.model.player_stamina += 0.5;
        }
        let percentage_s = (this.model.player_stamina / this.model.player_max_stamina) * 100;
        document.getElementById("stamina_bar").style.width = percentage_s + '%';

        let stamina_text = (Math.ceil(this.model.player_stamina)).toString();
        document.getElementById("stamina_text").innerHTML = "Ausdauerpunkte (Ap) = " + stamina_text + " / " + this.model.player_max_stamina;
    }

    update_info_board(){
        // init variables
        this.living_npc_list[0] = 0; // spider
        this.living_npc_list[1] = 0; // wasp
        this.living_npc_list[2] = 0; // rat
        this.living_npc_list[3] = 0; // skeleton
        this.living_npc_list[4] = 0; // frog
        // test all npc for living
        for (let i = 0; i < this.model.npc_models.length; i++){
            if (this.model.npc_models[i].name === 'spider' && this.model.npc_models[i].healthpoints > 0){ this.living_npc_list[0] += 1; }
            if (this.model.npc_models[i].name === 'wasp' && this.model.npc_models[i].healthpoints > 0){ this.living_npc_list[1] += 1; }
            if (this.model.npc_models[i].name === 'rat' && this.model.npc_models[i].healthpoints > 0){ this.living_npc_list[2] += 1;}
            if (this.model.npc_models[i].name === 'skeleton' && this.model.npc_models[i].healthpoints > 0){ this.living_npc_list[3] += 1; }
            if (this.model.npc_models[i].name === 'frog' && this.model.npc_models[i].healthpoints > 0){ this.living_npc_list[4] += 1; }
        }
        document.getElementById("target_text_1").innerHTML = "Spinnen  = " + this.living_npc_list[0];
        document.getElementById("target_text_2").innerHTML = "Wespe    = " + this.living_npc_list[1];
        document.getElementById("target_text_3").innerHTML = "Ratten   = " + this.living_npc_list[2];
        document.getElementById("target_text_4").innerHTML = "Skelette = " + this.living_npc_list[3];
        document.getElementById("target_text_5").innerHTML = "Frösche  = " + this.living_npc_list[4];
        // if all npc are death...
        if (this.living_npc_list[0] === 0 && this.living_npc_list[1] === 0 && this.living_npc_list[2] === 0 && this.living_npc_list[3] === 0 && this.living_npc_list[4] === 0){
            // finish the game
            this.game_end = true;
            this.update_player_animation();
        }
        let found_chest = 0;
        for (let i = 0; i < this.model.chest_list.length ; i++){
            if (this.model.chest_list[i] === null){
                found_chest += 1;
            }
        }
        this.founded_chests = found_chest;
        document.getElementById("score_text").innerHTML = "Erreichte Punkte = " + this.model.player_score;
        document.getElementById("chest_text").innerHTML = "Gefundene Truhen = " + found_chest;
    }
    update_boni(text_1, text_2){
        document.getElementById("info_text").innerHTML = this.active_bonus(text_1) + " und " + this.active_bonus(text_2);
        setTimeout(function () {
            document.getElementById("info_text").innerHTML = "";
        },2000);
    }

    active_bonus(bonus) {
        // extract the boni-value and boni-typ
        let split_words = bonus.split(" ")
        let value = split_words[0];
        let number_value = parseInt(value)
        let boni_typ = split_words[split_words.length - 1];

        // activate the bonus
        switch (boni_typ) {
            case "Heilung":
                if (this.model.player_healthpoints + number_value <= this.model.player_max_healthpoints) {
                    this.model.player_healthpoints += number_value;
                } else {
                    this.model.player_healthpoints = this.model.player_max_healthpoints;
                }
                if (document.getElementById("bonus_3_value").innerHTML !== ""){
                    let old_value = document.getElementById("bonus_3_value").innerHTML;
                    let new_value = parseInt(old_value) + number_value;
                    document.getElementById("bonus_3_value").innerHTML = (new_value).toString();
                } else {
                    document.getElementById("bonus_3_value").innerHTML = value;
                }
                break;
            case "Lp":
                this.model.player_max_healthpoints += number_value;
                if (document.getElementById("bonus_1_value").innerHTML !== ""){
                    let old_value = document.getElementById("bonus_1_value").innerHTML;
                    let new_value = parseInt(old_value) + number_value;
                    document.getElementById("bonus_1_value").innerHTML = (new_value).toString();
                } else {
                    document.getElementById("bonus_1_value").innerHTML = value;
                }
                break;
            case "Ap":
                this.model.player_max_stamina += number_value;
                if (document.getElementById("bonus_2_value").innerHTML !== ""){
                    let old_value = document.getElementById("bonus_2_value").innerHTML;
                    let new_value = parseInt(old_value) + number_value;
                    document.getElementById("bonus_2_value").innerHTML = (new_value).toString();
                } else {
                    document.getElementById("bonus_2_value").innerHTML = value;
                }
                break;
            case "dmg":
                this.model.player_dmg += number_value;
                if (document.getElementById("bonus_4_value").innerHTML !== ""){
                    let old_value = document.getElementById("bonus_4_value").innerHTML;
                    let new_value = parseInt(old_value) + number_value;
                    document.getElementById("bonus_4_value").innerHTML = (new_value).toString();
                } else {
                    document.getElementById("bonus_4_value").innerHTML = value;
                }
                break;
            case "Punkte":
                this.model.player_score += number_value;
                if (document.getElementById("bonus_5_value").innerHTML !== ""){
                    let old_value = document.getElementById("bonus_5_value").innerHTML;
                    let new_value = parseInt(old_value) + number_value;
                    document.getElementById("bonus_5_value").innerHTML = (new_value).toString();
                } else {
                    document.getElementById("bonus_5_value").innerHTML = value;
                }
                break;
        }
        return "+ " + value + " " + boni_typ;
    }

    give_up_button_handler(){
        if (!this.realy_give_up){
            document.getElementById("info_text").innerHTML = "Um die Aufgabe des Spiels zu bestätigen, noch mal auf \"Aufgeben\" klicken";
            setTimeout(function () {
                this.realy_give_up = false;
            }, 5000);
            this.realy_give_up = true;
        } else {
            this.model.player_healthpoints = 0;
            setTimeout(function () {
                document.getElementById("info_text").innerHTML = "";
                document.getElementById("give_up_button").hidden = true;
            }, 500);
        }
    }

    start_play_background_audio(){
        let background_audio = document.getElementById("background_music");
        background_audio.play;
        setTimeout(function () {
            background_audio.stop; // stoppt nicht, auc nicht mit pause.
            console.log("Musik aus");
        },2000);
    }

    game_finished() {
        // if it is loaded one time --> it shouldn't load a second time
        if (!this.game_termiated) {
            if (document.getElementById("scene_div").contains(this.view.renderer.domElement)) {
                // close the scene and the player-hub
                document.getElementById("scene_div").removeChild(this.view.renderer.domElement);//
            }
            if (document.getElementById("help_div").contains(document.getElementById("health_bar_div"))) {
                document.getElementById("help_div").removeChild(document.getElementById("health_bar_div"));
            }
            if (document.getElementById("help_div").contains(document.getElementById("stamina_bar_div"))) {
                document.getElementById("help_div").removeChild(document.getElementById("stamina_bar_div"));
            }
            if (document.getElementById("help_div").contains(document.getElementById("score_div"))) {
                document.getElementById("help_div").removeChild(document.getElementById("score_div"));
            }
            if (document.getElementById("help_div").contains(document.getElementById("target_div"))) {
                document.getElementById("help_div").removeChild(document.getElementById("target_div"));
            }
            document.getElementById("help_div").appendChild(document.getElementById("back_button"));
            document.getElementById("back_button").hidden = false;

            document.getElementById("give_up_button").hidden = true;

            let showed_end_text = "";
            let max_monsters = this.model.monster_number;
            let killed_monster;
            let killed_spiders;
            let killed_wasps;
            let killed_rats;
            let killed_skeletons;
            let killed_frogs;
            let max_spiders = (max_monsters / 4);
            let max_wasps = (max_monsters / 4);
            let max_rats = (max_monsters / 4);
            let max_skeletons = (max_monsters / 4);
            let max_frogs = (max_monsters / 2);

            // if the player is death
            if (this.model.player_is_death) {
                document.getElementById("mode_tile").innerHTML = "VERLOREN";
                showed_end_text = "Sie haben es nicht geschafft. Versuche es nochmal!"
                killed_spiders = (max_monsters / 4) - this.living_npc_list[0];
                killed_wasps = (max_monsters / 4) - this.living_npc_list[1];
                killed_rats = (max_monsters / 4) - this.living_npc_list[2];
                killed_skeletons = (max_monsters / 4) - this.living_npc_list[3];
                killed_frogs = (max_monsters / 2) - this.living_npc_list[4];
                killed_monster = killed_spiders + killed_wasps + killed_rats + killed_skeletons + killed_frogs;

            } else { // the player has won
                document.getElementById("mode_tile").innerHTML = "GEWONNEN";
                showed_end_text = "Sie haben es geschafft! Alle Monster sind besiegt. Gratuliere"
                killed_spiders = (max_monsters / 4);
                killed_wasps = (max_monsters / 4);
                killed_rats = (max_monsters / 4);
                killed_skeletons = (max_monsters / 4);
                killed_frogs = (max_monsters / 2);
                killed_monster = killed_spiders + killed_wasps + killed_rats + killed_skeletons + killed_frogs;
            }
            max_monsters = (this.model.monster_number / 4) * 6;
            // set new text of the divs
            document.getElementById("end_div").hidden = false;
            document.getElementById("showed_end_text").innerHTML = showed_end_text;
            document.getElementById("killed_monsters").innerHTML = killed_monster;
            document.getElementById("max_monsters").innerHTML = max_monsters;
            document.getElementById("founded_chests").innerHTML = this.founded_chests;
            document.getElementById("damage_suffered").innerHTML = this.model.player_damage_suffer;

            let used_time = this.used_time
            const minutes = Math.floor(used_time / 60);
            const seconds = Math.floor(used_time % 60);
            document.getElementById("used_time").innerHTML = (minutes).toString() + " Minuten und " + (seconds).toString() + " Sekunden";
            document.getElementById("killed_spiders").innerHTML = (killed_spiders).toString();
            document.getElementById("max_spiders").innerHTML = (max_spiders).toString();
            document.getElementById("killed_wasps").innerHTML = (killed_wasps).toString();
            document.getElementById("max_wasps").innerHTML = (max_wasps).toString();
            document.getElementById("killed_rats").innerHTML = (killed_rats).toString();
            document.getElementById("max_rats").innerHTML = (max_rats).toString();
            document.getElementById("killed_skeletons").innerHTML = (killed_skeletons).toString();
            document.getElementById("max_skeletons").innerHTML = (max_skeletons).toString();
            document.getElementById("killed_frogs").innerHTML = (killed_frogs).toString();
            document.getElementById("max_frogs").innerHTML = (max_frogs).toString();
            this.game_termiated = true;
        }
    }
}
