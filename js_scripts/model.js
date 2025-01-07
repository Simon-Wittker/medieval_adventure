import * as THREE from 'three';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';

export class Model {
    constructor(scene, monster_number) {
        // monster-counter
        this.monster_number = monster_number;
        // player attributes
        this.move_speed = 15;
        this.rotation_speed = 1.5;
        this.rotating_left = false;
        this.rotating_right = false;
        this.moving_forward = false;
        this.moving_backward = false;
        this.running = false;

        this.mixer = null;
        this.actions = {};

        this.attacking = false;
        this.blocking = false;
        this.open_chest = false;
        this.getting_impact = false;
        this.player_is_death = false;

        this.player_model = null;
        this.character_box = null;
        // low-level of difficulty
        if (this.monster_number === 4){
            this.player_healthpoints = 200;
            this.player_max_healthpoints = 200;
            this.player_stamina = 100;
            this.player_max_stamina = 100;
            this.player_dmg = 25;
            this.npc_difficulty_faktor = 2;

            // middle-level of difficulty
        } else if(this.monster_number === 8){
            this.player_healthpoints = 175;
            this.player_max_healthpoints = 175;
            this.player_stamina = 87;
            this.player_max_stamina = 87;
            this.player_dmg = 25;
            this.npc_difficulty_faktor = 3;

            // high-level of difficulty
        } else {
            this.player_healthpoints = 150;
            this.player_max_healthpoints = 150;
            this.player_stamina = 75;
            this.player_max_stamina = 75;
            this.player_dmg = 25;
            this.npc_difficulty_faktor = 4;
        }
        this.player_score = 0;
        this.player_damage_suffer = 0;
        // collisions_boxes
        this.object_boxes = [];
        this.object_boxes_wall = [];
        this.object_boxes_npc = [];
        // Chest
        this.chest_list = [];
        this.chest_mixer_list = [];
        this.chest_actions_list = [];
        this.chest_bonus_texts = [];
        // npc
        this.npc_move_speed = 10;
        this.npc_rotation_speed = 1.8;
        this.npc_models = [];
        this.npc_mixer_list = [];
        this.npc_actions_list = [];
        this.npc_healthbar_list = [];
        this.counter_for_npc = 0;
        this.round_counter_for_npc = 1;

        this.game_end = false;

        this.scene = scene;

        this.model_init();
    }

    model_init() {
        const loader = new FBXLoader();
        // load player-model
        this.player_load(loader);
        // load npcs
        //this.ncp_load(loader, number_of_npc);
        this.ncp_load(loader, this.monster_number);
        // load chests
        this.init_chests(loader, new THREE.Vector3(95, 1.5, 137), Math.PI);
        this.init_chests(loader, new THREE.Vector3(51.5, 1.5, 78), 0);
        this.init_chests(loader, new THREE.Vector3(138, 1.5, 80), 0);
        this.init_chests(loader, new THREE.Vector3(-133.3, 1.5, 144), 6 * Math.PI / 5);
        this.init_chests(loader, new THREE.Vector3(-54.8, 1.5, 140), 0);
        this.init_chests(loader, new THREE.Vector3(-64, 1.5, 114), - Math.PI / 2);
        this.init_chests(loader, new THREE.Vector3(-57.3, 1.5, -45), - Math.PI / 2);
        this.init_chests(loader, new THREE.Vector3(-63, 1.5, -82), 6 * Math.PI / 5);
        this.init_chests(loader, new THREE.Vector3(-130.5, 1.5, -131.5),  Math.PI / 5);
        this.init_chests(loader, new THREE.Vector3(141.5, 1.5, -140),  0);
        this.init_chests(loader, new THREE.Vector3(128, 1.5, -68),  - Math.PI / 5);
        this.init_chests(loader, new THREE.Vector3(134.8, 1.5, -56),  -Math.PI / 2);

        this.init_chest_rewards(12);

        this.set_background_musik();
    }

    player_load(fbx_loader){
        // Promise for loading the player model
        const loadPlayerModel = new Promise((resolve, reject) => {
            fbx_loader.load('3D-models/Paladin.fbx', (model) => {
                this.player_model = model;
                this.player_model.scale.setScalar(0.05);
                this.player_model.position.set(24, 0, 132);
                //this.player_model.position.set(24, 0, 12);
                this.player_model.rotation.y = Math.PI ;
                this.player_model.castShadow = true;
                this.scene.add(this.player_model);
                resolve();
            });
        });

        // Merge all promises and then initialize the AnimationMixer
        Promise.all([loadPlayerModel]).then(() => {
            // AnimationMixer für den Spieler initialisieren
            this.mixer = new THREE.AnimationMixer(this.player_model);

            fbx_loader.load('animations_paladin/Idle.fbx', (idleAnimation) => {
                this.actions.idle = this.mixer.clipAction(idleAnimation.animations[0]);
                this.actions.idle.play();
            });
            fbx_loader.load('animations_paladin/Walking.fbx', (walkAnimation) => {
                this.actions.walk = this.mixer.clipAction(walkAnimation.animations[0]);
            });
            fbx_loader.load('animations_paladin/Running.fbx', (runAnimation) => {
                this.actions.run = this.mixer.clipAction(runAnimation.animations[0]);
            });
            fbx_loader.load('animations_paladin/Attack.fbx', (attackAnimation) => {
                this.actions.attack = this.mixer.clipAction(attackAnimation.animations[0]);
            });
            fbx_loader.load('animations_paladin/Block.fbx', (blockAnimation) => {
                this.actions.block = this.mixer.clipAction(blockAnimation.animations[0]);
            });
            fbx_loader.load('animations_paladin/Opening_Chest_1.fbx', (openChestAnimation) => {
                this.actions.chest_opening = this.mixer.clipAction(openChestAnimation.animations[0]);
            });
            fbx_loader.load('animations_paladin/Opening_Gate.fbx', (openGateAnimation) => {
                this.actions.open_gate = this.mixer.clipAction(openGateAnimation.animations[0]);
            });
            fbx_loader.load('animations_paladin/Death.fbx', (deathAnimation) => {
                this.actions.death = this.mixer.clipAction(deathAnimation.animations[0]);
            });
            fbx_loader.load('animations_paladin/Impact.fbx', (impactAnimation) => {
                this.actions.impact = this.mixer.clipAction(impactAnimation.animations[0]);
            });
            fbx_loader.load('animations_paladin/Victory.fbx', (victoryAnimation) => {
                this.actions.victory = this.mixer.clipAction(victoryAnimation.animations[0]);
            });
        });
    }

    ncp_load(npc_loader, number_of_npc){

        // NPC-Spiders
        let spider_position_list = [new THREE.Vector3(-85, 0, -102),
            new THREE.Vector3(-93, 0, -78.5),
            new THREE.Vector3(-65, 0, -109),
            new THREE.Vector3(-88, 0, -104)];
        for (let i = 0; i < (number_of_npc/4); i++) {
            npc_loader.load('3D-models/npcs/Spider.fbx', (spider_npc) => {
                const spider_model = spider_npc;
                spider_model.scale.setScalar(0.0175);
                let position_number = Math.floor(Math.random() * 4);
                let spider_position = spider_position_list[position_number];
                spider_model.position.set(spider_position.x, spider_position.y, spider_position.z);
                spider_model.castShadow = true;
                // object properties
                spider_model.name = "spider";
                spider_model.staus = "randomly";
                spider_model.counter = 0;
                spider_model.healthpoints = this.npc_difficulty_faktor * 40;    // 80, 120, 160
                spider_model.dmg = this.npc_difficulty_faktor * 5.0;            // 10, 15, 20
                spider_model.points = this.npc_difficulty_faktor * 100;         // 200, 300, 400
                // to avoid an obstacle
                spider_model.vectors = [new THREE.Vector3(), new THREE.Vector3(),  new THREE.Vector3(),
                    new THREE.Vector3(), new THREE.Vector3(),  new THREE.Vector3(),  new THREE.Vector3()];

                // animation mixer und clips
                let npc_mixer = new THREE.AnimationMixer(spider_npc);
                const clips = spider_npc.animations;
                const spider_actions = {};
                spider_actions.attack = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "SpiderArmature|Spider_Attack"));
                spider_actions.idle = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "SpiderArmature|Spider_Idle"));
                spider_actions.death = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "SpiderArmature|Spider_Death"));
                spider_actions.walk = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "SpiderArmature|Spider_Walk"));
                spider_actions.jump = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "SpiderArmature|Spider_Jump"));

                this.npc_mixer_list.push(npc_mixer);
                this.npc_actions_list.push(spider_actions);
                this.npc_models.push(spider_model);

                // create the collision-Box for the npcs
                const box = new THREE.Box3(
                    new THREE.Vector3(spider_model.position.x - 1, spider_model.position.y, spider_model.position.z - 1),
                    new THREE.Vector3(spider_model.position.x + 1, spider_model.position.y + 2, spider_model.position.z + 1));

                this.object_boxes_npc.push(box);

                // init health bar
                let spider_health_bar = (this.init_npc_health_bar(spider_model.healthpoints, -88, 9,-104));
                this.npc_healthbar_list.push(spider_health_bar);

                this.scene.add(spider_health_bar);
                this.scene.add(spider_model);
            });
        }

        // NPC-Wasps
        let wasp_position_list = [new THREE.Vector3(117.6, 0, -100),
            new THREE.Vector3(97, 0, -73),
            new THREE.Vector3(122, 0, -52.5),
            new THREE.Vector3(118, 0, -50)]
        for (let i = 0; i < (number_of_npc/4); i++) {
            npc_loader.load('3D-models/npcs/Wasp.fbx', (wasp_npc) => {
                const wasp_model = wasp_npc;
                wasp_model.scale.setScalar(0.015);
                let position_number = Math.floor(Math.random() * 4);
                let wasp_position = wasp_position_list[position_number];
                wasp_model.position.set(wasp_position.x, wasp_position.y, wasp_position.z);
                wasp_model.castShadow = true;
                // object properties
                wasp_model.name = "wasp";
                wasp_model.staus = "randomly";
                wasp_model.counter = 0;
                wasp_model.healthpoints = this.npc_difficulty_faktor * 35;  // 70, 105, 140
                wasp_model.dmg = this.npc_difficulty_faktor * 6.0;          // 12, 18, 24
                wasp_model.points = this.npc_difficulty_faktor * 125;       // 250, 375, 500
                // to avoid an obstacle
                wasp_model.vectors = [new THREE.Vector3(), new THREE.Vector3(),  new THREE.Vector3(),
                    new THREE.Vector3(), new THREE.Vector3(),  new THREE.Vector3(),  new THREE.Vector3()];

                // animation mixer und clips
                let npc_mixer = new THREE.AnimationMixer(wasp_npc);
                const clips = wasp_npc.animations;
                const wasp_actions = {};
                wasp_actions.attack = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "WaspArmature|Wasp_Attack"));
                wasp_actions.death = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "WaspArmature|Wasp_Death"));
                wasp_actions.walk = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "WaspArmature|Wasp_Flying"));
                wasp_actions.idle = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "WaspArmature|Wasp_Flying"));

                this.npc_mixer_list.push(npc_mixer);
                this.npc_actions_list.push(wasp_actions);
                this.npc_models.push(wasp_model);

                // create the collision-Box for the npcs
                const box = new THREE.Box3(
                    new THREE.Vector3(wasp_model.position.x - 0.4, wasp_model.position.y, wasp_model.position.z - 0.4),
                    new THREE.Vector3(wasp_model.position.x + 0.4, wasp_model.position.y + 2, wasp_model.position.z + 0.4));
                this.object_boxes_npc.push(box);

                // init health bar
                let wasp_health_bar = this.init_npc_health_bar(wasp_model.healthpoints, 122, 9,-52.5);
                this.npc_healthbar_list.push(wasp_health_bar);

                this.scene.add(wasp_health_bar);
                this.scene.add(wasp_model);
            });
        }

        // NPC-Rats
        let rat_position_list = [new THREE.Vector3(-130, 0, 107.5),
            new THREE.Vector3(-102.6, 0, 37),
            new THREE.Vector3(-101.5, 0, 67),
            new THREE.Vector3(-101, 0, 116)];
        for (let i = 0; i < (number_of_npc/4); i++) {
            npc_loader.load('3D-models/npcs/Rat.fbx', (rat_npc) => {
                const rat_model = rat_npc;
                rat_model.scale.setScalar(0.015);
                let position_number = Math.floor(Math.random() * 4);
                let rat_position = rat_position_list[position_number];
                rat_model.position.set(rat_position.x, rat_position.y, rat_position.z);
                rat_model.castShadow = true;
                // object properties
                rat_model.name = "rat";
                rat_model.staus = "randomly";
                rat_model.counter = 0;
                rat_model.healthpoints = this.npc_difficulty_faktor * 45;       // 90, 135, 180
                rat_model.dmg = this.npc_difficulty_faktor * 4.0;               // 8, 12, 16
                rat_model.points = this.npc_difficulty_faktor * 90;             // 180, 270, 360
                // to avoid an obstacle
                rat_model.vectors = [new THREE.Vector3(), new THREE.Vector3(),  new THREE.Vector3(),
                    new THREE.Vector3(), new THREE.Vector3(),  new THREE.Vector3(),  new THREE.Vector3()];

                // animation mixer und clips
                let npc_mixer = new THREE.AnimationMixer(rat_npc);
                const clips = rat_npc.animations;
                const rat_actions = {};
                rat_actions.attack = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "RatArmature|Rat_Attack"));
                rat_actions.death = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "RatArmature|Rat_Death"));
                rat_actions.walk = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "RatArmature|Rat_Walk"));
                rat_actions.idle = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "RatArmature|Rat_Idle"));
                rat_actions.jump = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "RatArmature|Rat_Jump"));

                this.npc_mixer_list.push(npc_mixer);
                this.npc_actions_list.push(rat_actions);
                this.npc_models.push(rat_model);

                // create the collision-Box for the npcs
                const box = new THREE.Box3(
                    new THREE.Vector3(rat_model.position.x - 0.6, rat_model.position.y, rat_model.position.z - 0.6),
                    new THREE.Vector3(rat_model.position.x + 0.6, rat_model.position.y + 2, rat_model.position.z + 0.6));
                this.object_boxes_npc.push(box);

                // init health bar
                let rat_health_bar = this.init_npc_health_bar(rat_model.healthpoints, -101, 9, 116);
                this.npc_healthbar_list.push(rat_health_bar);

                this.scene.add(rat_health_bar);
                this.scene.add(rat_model);
            });
        }

        // NPC-Skeleton
        let skeleton_position_list = [new THREE.Vector3(71.5, 0, 82.5),
            new THREE.Vector3(103.5, 0, 100.5),
            new THREE.Vector3(130, 0, 128.4),
            new THREE.Vector3(94.5, 0, 128.5),
            new THREE.Vector3(115.7, 0, 119)]
        for (let i = 0; i < (number_of_npc/4); i++) { // (number_of_npc/4)
            npc_loader.load('3D-models/npcs/Skeleton.fbx', (skeleton_npc) => {
                const skeleton_model = skeleton_npc;
                skeleton_model.scale.setScalar(0.015);
                let position_number = Math.floor(Math.random() * 5);
                let skeleton_position = skeleton_position_list[position_number];
                skeleton_model.position.set(skeleton_position.x, skeleton_position.y, skeleton_position.z);
                skeleton_model.castShadow = true;
                // object properties
                skeleton_model.name = "skeleton";
                skeleton_model.staus = "randomly";
                skeleton_model.counter = 0;
                skeleton_model.healthpoints = this.npc_difficulty_faktor * 50;  // 100, 150, 200
                skeleton_model.dmg = this.npc_difficulty_faktor * 4.5;          // 9, 13.5, 18
                skeleton_model.points = this.npc_difficulty_faktor * 125;       // 250, 375, 500
                // to avoid an obstacle
                skeleton_model.vectors = [new THREE.Vector3(), new THREE.Vector3(),  new THREE.Vector3(),
                    new THREE.Vector3(), new THREE.Vector3(),  new THREE.Vector3(),  new THREE.Vector3()];

                // animation mixer und clips
                let npc_mixer = new THREE.AnimationMixer(skeleton_npc);
                const clips = skeleton_npc.animations;
                const skeleton_actions = {};
                skeleton_actions.attack = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "SkeletonArmature|Skeleton_Attack"));
                skeleton_actions.death = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "SkeletonArmature|Skeleton_Death"));
                skeleton_actions.walk = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "SkeletonArmature|Skeleton_Running"));
                skeleton_actions.idle = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "SkeletonArmature|Skeleton_Idle"));

                this.npc_mixer_list.push(npc_mixer);
                this.npc_actions_list.push(skeleton_actions);
                this.npc_models.push(skeleton_model);

                // create the collision-Box for the npcs
                const box = new THREE.Box3(
                    new THREE.Vector3(skeleton_model.position.x - 0.4, skeleton_model.position.y, skeleton_model.position.z - 0.4),
                    new THREE.Vector3(skeleton_model.position.x + 0.4, skeleton_model.position.y + 2, skeleton_model.position.z + 0.4));
                this.object_boxes_npc.push(box);

                // init health bar
                let skeleton_health_bar = this.init_npc_health_bar(skeleton_model.healthpoints, 94.5, 9,128.5);
                this.npc_healthbar_list.push(skeleton_health_bar);

                this.scene.add(skeleton_health_bar);
                this.scene.add(skeleton_model);
            });
        }
        // NPC-Frog
        let frog_position_list = [new THREE.Vector3(0, 0, -15),
            new THREE.Vector3(29, 0, -57.5),
            new THREE.Vector3(52, 0, -81.5),
            new THREE.Vector3(82.5, 0, -95)]
        for (let i = 0; i < number_of_npc / 2 ; i++) {
            npc_loader.load('3D-models/npcs/Frog.fbx', (frog_npc) => {
                const frog_model = frog_npc;
                frog_model.scale.setScalar(0.015);
                let position_number = Math.floor(Math.random() * 4);
                let frog_position = frog_position_list[position_number];
                frog_model.position.set(frog_position.x, frog_position.y, frog_position.z);
                frog_model.castShadow = true;
                // object properties
                frog_model.name = "frog";
                frog_model.staus = "randomly";
                frog_model.counter = 0;
                frog_model.healthpoints = this.npc_difficulty_faktor * 25;      // 50, 75, 100
                frog_model.dmg = this.npc_difficulty_faktor * 2.5;              // 5, 7.5, 10
                frog_model.points = this.npc_difficulty_faktor * 30;            // 60, 90, 120
                // to avoid an obstacle
                frog_model.vectors = [new THREE.Vector3(), new THREE.Vector3(),  new THREE.Vector3(),
                    new THREE.Vector3(), new THREE.Vector3(),  new THREE.Vector3(),  new THREE.Vector3()];

                // animation mixer und clips
                let npc_mixer = new THREE.AnimationMixer(frog_npc);
                const clips = frog_npc.animations;
                const frog_actions = {};
                frog_actions.attack = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "FrogArmature|Frog_Attack"));
                frog_actions.death = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "FrogArmature|Frog_Death"));
                frog_actions.walk = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "FrogArmature|Frog_Jump"));
                frog_actions.idle = npc_mixer.clipAction(THREE.AnimationClip.findByName(clips, "FrogArmature|Frog_Idle"));

                this.npc_mixer_list.push(npc_mixer);
                this.npc_actions_list.push(frog_actions);
                this.npc_models.push(frog_model);

                // create the collision-Box for the npcs
                const box = new THREE.Box3(
                    new THREE.Vector3(frog_model.position.x - 0.3, frog_model.position.y, frog_model.position.z - 0.3),
                    new THREE.Vector3(frog_model.position.x + 0.3, frog_model.position.y + 2, frog_model.position.z + 0.3));
                this.object_boxes_npc.push(box);

                // init health bar
                let frog_health_bar = this.init_npc_health_bar(frog_model.healthpoints, 0, 9, -15);
                this.npc_healthbar_list.push(frog_health_bar);

                this.scene.add(frog_health_bar);
                this.scene.add(frog_model);
            });
        }
    }

    init_chests(chest_loader, position, rotation){
        // Promise for loading the player model
        chest_loader.load('3D-models/area_elements/chest_1.fbx', (c_model) => {
            let chest_model = c_model;
            chest_model.scale.setScalar(0.015);
            chest_model.position.copy(position);
            chest_model.rotation.y = rotation;
            chest_model.points = 50;

            let chest_mixer = new THREE.AnimationMixer(chest_model);
            const clips = c_model.animations;
            const chest_actions = {};
            chest_actions.open = chest_mixer.clipAction(THREE.AnimationClip.findByName(clips, "Armature|Armature|Take 001|BaseLayer"));

            this.chest_mixer_list.push(chest_mixer);
            this.chest_actions_list.push(chest_actions);
            this.chest_list.push(chest_model);
            this.scene.add(chest_model);
        });
    }

    init_chest_rewards(number_of_chests){
        let heal_bonus = (this.npc_difficulty_faktor * 20).toString() + " Lp Heilung";
        let health_bonus = (this.npc_difficulty_faktor * 10).toString() + " Max Lp";
        let stamina_bonus = "15 Max Ap";
        let dmg_bonus =(this.npc_difficulty_faktor * 5).toString() + " dmg";
        let score_bonus = (this.npc_difficulty_faktor * 250).toString() + " Punkte"
        let bonus_list = [];
        bonus_list.push(heal_bonus);
        bonus_list.push(health_bonus);
        bonus_list.push(stamina_bonus);
        bonus_list.push(dmg_bonus);
        bonus_list.push(score_bonus);

        for (let i = 0; i <= number_of_chests; i++){
            let bonus_list_copy = bonus_list.slice();
            let random_bonus_text = [];
            for (let j = 0; j < 2; j++) {
                let randomIndex = Math.floor(Math.random() * bonus_list_copy.length);
                random_bonus_text.push(bonus_list_copy.splice(randomIndex, 1)[0]);
            }
            this.chest_bonus_texts.push(random_bonus_text);
        }
    }

    init_npc_health_bar(max_health_point, x, y, z){
        let planeGeometry = new THREE.PlaneGeometry(max_health_point / 10, 1);
        let planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
        let verticalBar = new THREE.Mesh(planeGeometry, planeMaterial);
        verticalBar.position.set(x, y, z);
        return verticalBar;
    }

    set_background_musik(){
        let audio = document.createElement('embed');
        audio.id = "background_music";
        audio.src = 'sound/background_sound.mp3';
        audio.loop = false;
        audio.hidden = true;
        audio.autostart = false;
        audio.volume = 0.0;
        //document.getElementById("scene_div").appendChild(audio);
    }

    update_npc_position(index, delta) {

        // init variablen
        let animation_clip;
        let npc_faktor;
        let border;
        let death_time;
        let speed_factor = 1;
        const direction_factor = Math.floor(Math.random() * 100) + 1 > 50 ? 1 : -1;
        let position_blockt = false;
        let attack_player = false;
        let direction_faktor = 1;
        if (this.npc_models[index].status === undefined) {
            this.npc_models[index].status = "randomly";
        }
        let npc_status = this.npc_models[index].status;
        let counter = 0;

        if (this.npc_models[index].name === 'spider') {
            npc_faktor = 5;
            speed_factor = 0.8;
            border = 3.5;
            death_time = 0.98;
        } else if (this.npc_models[index].name === 'wasp') {
            npc_faktor = 6;
            speed_factor = 1.2;
            border = 1.8;
            death_time = 0.7;
        } else if (this.npc_models[index].name === 'rat') {
            npc_faktor = 5;
            speed_factor = 0.7;
            border = 2.7;
            death_time = 1.0;
        } else if (this.npc_models[index].name === 'skeleton') {
            npc_faktor = 4;
            speed_factor = 1.0;
            border = 1.7;
            death_time = 0.32;
        } else if (this.npc_models[index].name === 'frog') {
            npc_faktor = 3;
            speed_factor = 0.7;
            border = 1.5;
            death_time = 0.75;
            if (this.npc_models[index].healthpoints < 50) {
                direction_faktor = 1;
            } else {
                direction_faktor = -1;
            }
        }
        // positions for calculating
        let old_npc_position = new THREE.Vector3();
        old_npc_position.copy(this.npc_models[index].position);
        let player_position = new THREE.Vector3();
        player_position.copy(this.player_model.position);
        // Collision_box
        let npc_box = new THREE.Box3(
            new THREE.Vector3(old_npc_position.x - border, old_npc_position.y, old_npc_position.z - border),
            new THREE.Vector3(old_npc_position.x + border, old_npc_position.y + border * 3, old_npc_position.z + border));

        if (this.game_end) {
            animation_clip = 'walk';
            if(this.player_is_death){
                const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(this.npc_models[index].quaternion);
                this.npc_models[index].position.add(direction.multiplyScalar(this.npc_move_speed * delta * speed_factor));
            } else {
                const direction = new THREE.Vector3(0, -10, 1).applyQuaternion(this.npc_models[index].quaternion);
                this.npc_models[index].position.add(direction.multiplyScalar(this.npc_move_speed * delta * speed_factor));
            }
        } else {
            // check, if the npc is dying
            if (npc_status === "death") { // if the npc is in death-state
                return;
            } else if (this.npc_models[index].healthpoints <= 0) {
                animation_clip = "death";
                if (npc_faktor === 3){
                    if (this.player_healthpoints + (this.npc_difficulty_faktor * 25) <= this.player_max_healthpoints){
                        this.player_healthpoints += this.npc_difficulty_faktor * 25;
                    } else {
                        this.player_healthpoints = this.player_max_healthpoints;
                    }
                }
            } else if (npc_status === "idle") { // if the npc is in idle-state
                if (this.npc_models[index].counter !== 0) {
                    animation_clip = 'idle';
                    this.npc_models[index].counter--;
                } else {
                    this.npc_models[index].status = "randomly";
                }
            } else if (npc_status === "blocked") {

                if (this.npc_models[index].counter === 0) {
                    this.way_finder(old_npc_position, border, delta, speed_factor, index, direction_factor);
                    //this.findPath(old_npc_position, player_position, border); //A*Algorithmus-Variante
                } else if (this.npc_models[index].counter > 0) {

                    this.npc_models[index].position.copy(this.npc_models[index].vectors[counter]);
                    counter++;
                    this.npc_models[index].counter--;
                    if (this.npc_models[index].counter === 0) {
                        this.npc_models[index].counter = 0;
                        this.npc_models[index].status = "randomly"
                    }
                }
            } else if (npc_status === "randomly") {

                // distance calculation between player and npc
                let distance = Math.sqrt(((old_npc_position.x - player_position.x) ** 2) + ((old_npc_position.z - player_position.z) ** 2));
                // if the npc is nearer as (200 / npc_faktor) --> npc alignment to the players position
                if (distance < (200 / npc_faktor)) {
                    const direction = new THREE.Vector3();
                    direction.subVectors(player_position, old_npc_position).normalize();
                    const quaternion = new THREE.Quaternion();
                    quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, direction_faktor), direction);
                    this.npc_models[index].quaternion.copy(quaternion);

                    //  if the npc is nearer as 20 --> some npc moves faster and jump if it's possible
                    if (distance < 25 && distance > 3) {
                        if (npc_faktor === 5) {
                            speed_factor *= 2;
                            animation_clip = 'jump';
                        }
                    }
                    const player_box = new THREE.Box3(
                        new THREE.Vector3(player_position.x - 1, player_position.y, player_position.z - 1),
                        new THREE.Vector3(player_position.x + 1, player_position.y + 2, player_position.z + 1));

                    // if the npc is nearer as 3 --> npc attack the player
                    if (distance <= 3) {
                        if (npc_box.intersectsBox(player_box) && !this.game_end) {
                            animation_clip = 'attack';
                            speed_factor /= 5;
                            attack_player = true;
                        } else {
                            animation_clip = 'walk';
                        }
                    }
                }

                const rand_init = Math.floor(Math.random() * 2000) + 1;
                if (!attack_player && npc_status !== "idle") {
                    if (rand_init >= 980 && rand_init <= 1000) {
                        this.npc_models[index].status = "idle";
                        this.npc_models[index].counter = 20;
                    }
                }

                // if the player is further away as (200 / npc_faktor) --> npc moves randomly
                if (this.counter_for_npc % 5 !== 0 && !attack_player) {
                    const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(this.npc_models[index].quaternion);
                    let new_npc_position = old_npc_position.add(direction.multiplyScalar(this.npc_move_speed * delta * speed_factor * 2));
                    // create a new box on the future position for collision_check
                    const box = new THREE.Box3(
                        new THREE.Vector3(new_npc_position.x - border, new_npc_position.y, new_npc_position.z - border),
                        new THREE.Vector3(new_npc_position.x + border, new_npc_position.y + 2, new_npc_position.z + border)
                    );
                    if (this.collision_check(box)) {
                        if (speed_factor <= 1) {
                            animation_clip = 'walk';
                        }
                        this.npc_models[index].position.add(direction.multiplyScalar(this.npc_move_speed * delta * speed_factor));

                    } else {
                        this.npc_models[index].status = "blocked";
                    }
                }
                // all 3 deltas or if the way is blocked --> npc turns randomly left or right
                if (position_blockt || this.counter_for_npc % 5 === 0 && !attack_player) {
                    this.npc_models[index].quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.npc_rotation_speed * delta * direction_factor));
                }
            }

            this.object_boxes_npc[index] = npc_box;
            //let boxHelper = new THREE.Box3Helper(box, 0xff0000);
            //this.view.scene.add(boxHelper);
        }
        // update the animation
        this.update_npc_animation(index, animation_clip, npc_faktor, death_time, delta);
    }

    update_npc_animation(index, animation_clip, npc_faktor, death_time, delta) {
        let waiting_Animation;
        let death_waiting_time = death_time * 900;
        if (npc_faktor === 3 ||npc_faktor === 4 || npc_faktor === 6 ){
            const {idle, walk, attack, death} = this.npc_actions_list[index];
            switch (animation_clip){
                case 'idle':
                    idle.play();
                    walk.stop();
                    attack.stop();
                    death.stop();
                    break;
                case 'walk':
                    idle.stop();
                    walk.play();
                    attack.stop();
                    death.stop();
                    break;
                case 'jump':
                    idle.stop();
                    walk.stop();
                    attack.stop();
                    death.stop();
                    break;
                case 'attack':
                    idle.stop();
                    walk.stop();
                    attack.play();
                    death.stop();
                    this.npc_attacking_handler(index, delta);
                    break;
                case 'death':
                    idle.stop();
                    walk.stop();
                    attack.stop();
                    death.play();
                    // waiting for ending animation
                    waiting_Animation = new Promise((resolve, reject) => {
                        setTimeout(function () { resolve(); }, death_waiting_time );
                    });
                    this.npc_die(waiting_Animation, index);
                    break;
            }
        } else if (npc_faktor === 5){
            const {idle, walk, jump, attack, death} = this.npc_actions_list[index];
            switch (animation_clip){
                case 'idle':
                    idle.play();
                    walk.stop();
                    jump.stop();
                    attack.stop();
                    death.stop();
                    break;
                case 'walk':
                    idle.stop();
                    walk.play();
                    jump.stop();
                    attack.stop();
                    death.stop();
                    break;
                case 'jump':
                    idle.stop();
                    walk.stop();
                    jump.play();
                    attack.stop();
                    death.stop();
                    break;
                case 'attack':
                    idle.stop();
                    walk.stop();
                    jump.stop();
                    attack.play();
                    death.stop();
                    this.npc_attacking_handler(index, delta);
                    break;
                case 'death':
                    idle.stop();
                    walk.stop();
                    jump.stop();
                    attack.stop();
                    death.play();
                    // waiting for ending animation
                    waiting_Animation = new Promise((resolve, reject) => {
                        setTimeout(function () { resolve(); }, death_waiting_time);
                    });
                    this.npc_die(waiting_Animation, index);
                    break;
            }
        }
    }

    npc_die(waiting_Animation, index) {
        Promise.all([waiting_Animation]).then(() => {
            this.npc_mixer_list[index] = null;
            this.npc_models[index].status = "death;"
            this.object_boxes_npc[index] = new THREE.Box3(
                new THREE.Vector3(this.npc_models[index].position.x, this.npc_models[index].position.y - 10, this.npc_models[index].position.z),
                new THREE.Vector3(this.npc_models[index].position.x, this.npc_models[index].position.y -5, this.npc_models[index].position.z));
            this.player_score += this.npc_models[index].points;
            this.npc_models[index].points = 0;
        });
    }
    // npc attack handler
    npc_attacking_handler(index, delta) {
        let faktor = 1;
        // check collision
        if (this.blocking) { faktor = 0.1; }
        this.player_healthpoints -= Math.ceil(this.npc_models[index].dmg * faktor * delta);
        this.player_damage_suffer += Math.ceil(this.npc_models[index].dmg * faktor * delta);
    }

    way_finder(npc_position, border, delta, speed_factor, index, direction_factor){
        // startposition --> npc_position
        let current_position = new THREE.Vector3();
        current_position.copy(this.npc_models[index].position);
        let target_position = new THREE.Vector3();
        target_position = this.player_model.position.clone();
        let step_list = [];
        // if the npc flees from player
        if (direction_factor === -1){
            target_position = target_position.clone().sub(target_position).multiplyScalar(-1).add(target_position);
        }
        let target_distance = this.calculate_distance(current_position, target_position);
        for (let i = 0; i < 7; i++){
            if (target_distance > 1) {
                let free_direction = this.find_free_direction(current_position, border, delta, speed_factor, target_distance, target_position, direction_factor);
                if (free_direction) {
                    current_position.add(free_direction);
                    step_list.push(current_position.clone());
                } else {
                    console.log("free_direction was't free");
                }
            } else {
                break;
            }
        }
        for (let i = 0; i < 7; i++){
            if (step_list[i] !== undefined){
                this.npc_models[index].vectors[i] = step_list[i];
                this.npc_models[index].counter++;
            }
        }
    }

    find_free_direction(current_position, border, delta, speed_factor, target_distance, target_position, direction_factor){
        let steps = 10;
        let step_angle = (2 * Math.PI) / 10;
        let dir_list = [];
        let dist_list = [];
        let smallest_distance_index = 0;

        for (let i = 0; i < steps; i++) {
            let angle = i * step_angle;
            let direction = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
            let test_position = current_position.clone().add(direction);

            let test_box = new THREE.Box3(
                new THREE.Vector3(test_position.x - border, test_position.y, test_position.z - border),
                new THREE.Vector3(test_position.x + border, test_position.y + 2, test_position.z + border));
            let no_collision = this.collision_check(test_box)
            if (no_collision){
                dir_list.push(direction);
            }
        }

        for (let i = 0; i < dir_list.length; i++) {
            let direction = dir_list[i];
            let new_target_distance = this.calculate_distance(current_position.clone().add(direction), target_position);
            dist_list.push(new_target_distance);
        }

        for (let i = 1; i < dist_list.length; i++) {
            if (direction_factor === -1){
                if (dist_list[i] > dist_list[smallest_distance_index]) {
                    smallest_distance_index = i;
                }
            } else {
                if (dist_list[i] < dist_list[smallest_distance_index]) {
                    smallest_distance_index = i;
                }
            }
        }
        if (dir_list[0] === undefined){
            return null;
        }  else {
            return dir_list[smallest_distance_index].multiplyScalar(this.npc_move_speed * delta * speed_factor * 1.5);
        }
    }

    calculate_distance(position1, position2) {
        let dx = position1.x - position2.x;
        let dy = position1.y - position2.y;
        let dz = position1.z - position2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    npc_health_bar_update(index){
        // get the height of the bar
        let y = this.npc_healthbar_list[index].position.y;
        // get the new width of the bar
        let new_width = Math.round(this.npc_models[index].healthpoints / 10);
        // if the npc is death
        if (this.npc_models[index].healthpoints <= 0) { new_width = 0; }
        // set new health bar
        this.npc_healthbar_list[index].geometry = new THREE.PlaneGeometry( new_width, 1);
        // update the position of the health bar
        this.npc_healthbar_list[index].position.set(this.npc_models[index].position.x, y, this.npc_models[index].position.z);
        // update the direction of the health bar
        let camera_offset_look = new THREE.Vector3(0, 12, -12);
        let look_at_position = new THREE.Vector3();
        const player_position = new THREE.Vector3();
        player_position.copy(this.player_model.position);
        look_at_position.copy(new THREE.Vector3().addVectors(player_position, camera_offset_look.applyQuaternion(this.player_model.quaternion)));
        this.npc_healthbar_list[index].lookAt(look_at_position);
    }

    collision_check(box, mode=0){
        // check the walls
        for (let i = 0; i < this.object_boxes_wall.length; i++) {
            // check collision
            if (box.intersectsBox(this.object_boxes_wall[i])) {
                return false;
            }
        }
        // check the chests
        for (let i = 0; i < this.object_boxes.length; i++) {
            // check collision
            if (box.intersectsBox(this.object_boxes[i])) {
                return false;
            }
        }
        if (mode === 1){
            // check npcs
            for (let i = 0; i < this.object_boxes_npc.length; i++) {
                // check collision
                if (box.intersectsBox(this.object_boxes_npc[i])) {
                    return false;
                }
            }
        }
        return true;
    }

    // A*Algorithmus-Variante
    findPath(start, goal, border) {
        const openSet = [{ position: start, parent: null, g: 0, h: this.calculateHeuristic(start, goal) }];
        const closedSet = [];

        while (openSet.length > 0) {
            openSet.sort((a, b) => (a.g + a.h) - (b.g + b.h));

            const current = openSet.shift();

            if (current.position.x === goal.x && current.position.z === goal.z) {
                return this.buildPath(current);
            }

            closedSet.push(current);

            const neighbors = this.generateNeighbors(current.position);

            for (const neighbor of neighbors) {
                const neighborNode = {
                    position: neighbor,
                    parent: current,
                    g: current.g + 1,
                    h: this.calculateHeuristic(neighbor, goal),
                };
                const nodeBox = new THREE.Box3().setFromCenterAndSize(
                    new THREE.Vector3(neighborNode.position.x, 0, neighborNode.position.z),
                    new THREE.Vector3(border, border, border) );
                if (this.collision_check(nodeBox) || closedSet.some((node) => node.position.x === neighbor.x && node.position.z === neighbor.z)) {
                    continue;
                }

                const existingNode = openSet.find((node) => node.position.x === neighbor.x && node.position.z === neighbor.z);
                if (!existingNode || neighborNode.g < existingNode.g) {
                    openSet.push(neighborNode);
                }
            }
        }

        return null;
    }

    generateNeighbors(position) {
        return [
            { x: position.x, z: position.z - 1 },
            { x: position.x, z: position.z + 1 },
            { x: position.x - 1, z: position.z },
            { x: position.x + 1, z: position.z },
        ];
    }
    calculateHeuristic(position, goal) {
        const dx = position.x - goal.x;
        const dz = position.z - goal.z;
        return Math.sqrt(dx * dx + dz * dz);
    }

    buildPath(node) {
        const path = [node.position];
        let currentParent = node.parent;
        while (currentParent) {
            path.unshift(currentParent.position);
            currentParent = currentParent.parent;
        }
        console.dir(path);
        return path;
    }

}

