import * as THREE from 'three';
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

export class View {
    constructor(scene, camera, renderer, model) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.model = model;

        this.view_init(scene);
    }

    view_init(scene) {
        if(this.scene) {
            // init area
            const village_ground_url = new URL('../3D-models/area_elements/play_ground_7.glb', import.meta.url);
            this.load_gltf_assets(village_ground_url, 0, 0, 0, 1, 0, scene);

            // collision_box for:
            // map border
            this.create_object_boxes(new THREE.Vector3(-150,0, 150), new THREE.Vector3(150, 0 , 150));
            this.create_object_boxes(new THREE.Vector3(150, 0, -150), new THREE.Vector3(150, 0 ,150));
            this.create_object_boxes(new THREE.Vector3(-150, 0, -150), new THREE.Vector3(150, 0 ,-150));
            this.create_object_boxes(new THREE.Vector3(-150, 0, -150), new THREE.Vector3(-150, 0, 150));
            // castle wall's
            this.create_object_boxes(new THREE.Vector3(43, 0, 66),new THREE.Vector3(43, 0, 150));
            this.create_object_boxes(new THREE.Vector3(43, 0, 66),new THREE.Vector3(88, 0, 66));
            this.create_object_boxes(new THREE.Vector3(106, 0, 66),new THREE.Vector3(150, 0 , 66));
            this.create_object_boxes(new THREE.Vector3(47, 0, 70),new THREE.Vector3(47, 0, 150));
            this.create_object_boxes(new THREE.Vector3(43, 0, 70),new THREE.Vector3(88, 0, 70));
            this.create_object_boxes(new THREE.Vector3(106, 0, 70),new THREE.Vector3(150, 0 , 70));
            this.create_object_boxes(new THREE.Vector3(47, 0, 147),new THREE.Vector3(147, 0, 147));
            this.create_object_boxes(new THREE.Vector3(147, 0, 70),new THREE.Vector3(147, 0 , 147));
            this.create_object_boxes(new THREE.Vector3(82, 0, 88.5),new THREE.Vector3(92, 0, 88.5));
            this.create_object_boxes(new THREE.Vector3(98, 0, 88.5),new THREE.Vector3(116, 0, 88.5));
            this.create_object_boxes(new THREE.Vector3(126, 0 , 72),new THREE.Vector3(126, 0 ,99));
            this.create_object_boxes(new THREE.Vector3(127, 0, 112),new THREE.Vector3(150, 0 ,112));
            this.create_object_boxes(new THREE.Vector3(107, 0, 118),new THREE.Vector3(118, 0, 118));
            this.create_object_boxes(new THREE.Vector3(82.5, 0, 118),new THREE.Vector3(99, 0, 118));
            this.create_object_boxes(new THREE.Vector3(74, 0, 115),new THREE.Vector3(74, 0, 131));
            this.create_object_boxes(new THREE.Vector3(74, 0, 137.5),new THREE.Vector3(74, 0, 147));
            this.create_object_boxes(new THREE.Vector3(50, 0, 127),new THREE.Vector3(60.6, 0, 127));
            this.create_object_boxes(new THREE.Vector3(119.5, 0, 129),new THREE.Vector3(119.5, 0, 147));
            this.create_object_boxes(new THREE.Vector3(58.5, 0, 70),new THREE.Vector3(58.5, 0, 100));
            this.create_object_boxes(new THREE.Vector3(58.5, 0, 100),new THREE.Vector3(85.5, 0, 100));
            // Village walls
            this.create_object_boxes(new THREE.Vector3(-41, 0, 20),new THREE.Vector3(-41, 9, 149));
            this.create_object_boxes(new THREE.Vector3(-93, 0, 20),new THREE.Vector3(-41, 0, 20));
            this.create_object_boxes(new THREE.Vector3(-149, 0, 20),new THREE.Vector3(-111, 0, 20));
            this.create_object_boxes(new THREE.Vector3(-149, 0, 20),new THREE.Vector3(-149, 0, 149));
            this.create_object_boxes(new THREE.Vector3(-149, 0, 149),new THREE.Vector3(-41, 9, 149));
            // Village Houses
            this.create_specific_object_boxes(new THREE.Vector3(-72.6, 0, 51), new THREE.Vector3(-61.3, 10, 51), 6);
            this.create_specific_object_boxes(new THREE.Vector3(-63.5, 0, 57), new THREE.Vector3(-63.5, 0, 57), 6);
            this.create_specific_object_boxes(new THREE.Vector3(-72.5, 0, 95), new THREE.Vector3(-72.5, 10, 95), 6);
            this.create_specific_object_boxes(new THREE.Vector3(-60, 0, 93), new THREE.Vector3(-60, 10, 93), 6);
            this.create_specific_object_boxes(new THREE.Vector3(-64, 0, 102), new THREE.Vector3(-64, 0, 102), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-58, 0, 100.5), new THREE.Vector3(-58, 0, 100.5), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-73, 0, 129), new THREE.Vector3(-73, 10, 129), 6);
            this.create_specific_object_boxes(new THREE.Vector3(-61, 0, 131), new THREE.Vector3(-61, 10, 131), 6);
            this.create_specific_object_boxes(new THREE.Vector3(-67, 0, 138), new THREE.Vector3(-67, 0, 138), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-62, 0, 139), new THREE.Vector3(-62, 0, 139), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-118, 0, 127), new THREE.Vector3(-118, 10, 127), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-120, 0, 122), new THREE.Vector3(-120, 10, 122), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-133.5, 0, 134.5), new THREE.Vector3(-133.5, 10, 134.5), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-136, 0, 129), new THREE.Vector3(-136, 10, 129), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-130.5, 0, 119.2), new THREE.Vector3(-130.5, 0, 119.2), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-136.5, 0, 121.7), new THREE.Vector3(-136.5, 0, 121.7), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-125, 0, 91.5), new THREE.Vector3(-125, 10, 91.5), 6);
            this.create_specific_object_boxes(new THREE.Vector3(-136, 0, 91.5), new THREE.Vector3(-136, 10, 91.5), 6);
            this.create_specific_object_boxes(new THREE.Vector3(-133.5, 0, 85.5), new THREE.Vector3(-133.5, 10, 85.5), 6);
            this.create_specific_object_boxes(new THREE.Vector3(-125, 0, 52), new THREE.Vector3(-125, 10, 52), 6);
            this.create_specific_object_boxes(new THREE.Vector3(-136, 0, 52), new THREE.Vector3(-136, 10, 52), 6);
            this.create_specific_object_boxes(new THREE.Vector3(-133.5, 0, 46), new THREE.Vector3(-133.5, 10, 46), 6);
            // Village Trees
            this.create_specific_object_boxes(new THREE.Vector3(-22.5, 0, 113.75),new THREE.Vector3(-22.5, 0, 113.75), 0.5);
            this.create_specific_object_boxes(new THREE.Vector3(1, 0, 143),new THREE.Vector3(1, 0, 143), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(-3.5, 0, 122.9),new THREE.Vector3(-3.5, 0, 122.9), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(-5, 0, 101.5),new THREE.Vector3(-4.3, 0, 106.5), 0.6);
            this.create_specific_object_boxes(new THREE.Vector3(-6.5, 0, 83.5),new THREE.Vector3(-2.5, 0, 83.5), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(-14, 0, 71.5),new THREE.Vector3(-14, 0, 71.5), 0.6);
            this.create_specific_object_boxes(new THREE.Vector3(-27, 0, 92),new THREE.Vector3(-27, 0, 92), 0.6);
            this.create_specific_object_boxes(new THREE.Vector3(-37.5, 0, 83.3),new THREE.Vector3(-37.5, 0, 83.3), 0.6);
            this.create_specific_object_boxes(new THREE.Vector3(-38.5, 0, 69.3),new THREE.Vector3(-38.5, 0, 69.3), 0.6);
            this.create_specific_object_boxes(new THREE.Vector3(-27.75, 0, 57.3),new THREE.Vector3(-27.75, 0, 57.3), 0.6);
            this.create_specific_object_boxes(new THREE.Vector3(-6.3, 0, 33.6),new THREE.Vector3(-6.3, 0, 33.6), 0.6);
            this.create_specific_object_boxes(new THREE.Vector3(-36, 0, 18.4),new THREE.Vector3(-36, 0, 18.4), 0.6);
            this.create_specific_object_boxes(new THREE.Vector3(-51, 0, 17.3),new THREE.Vector3(-51, 0, 17.3), 0.6);
            this.create_specific_object_boxes(new THREE.Vector3(-71, 0, 16),new THREE.Vector3(-71, 0, 16), 1.6);
            this.create_specific_object_boxes(new THREE.Vector3(-137.5, 0, 5.2),new THREE.Vector3(-137.5, 0, 5.2), 1.5);
            this.create_specific_object_boxes(new THREE.Vector3(-124, 0, 26.5),new THREE.Vector3(-124, 0, 26.5), 1.3);
            this.create_specific_object_boxes(new THREE.Vector3(-133.7, 0, 27.2),new THREE.Vector3(-133.7, 0, 27.2), 1.5);
            this.create_specific_object_boxes(new THREE.Vector3(-143, 0, 27.7),new THREE.Vector3(-143, 0, 27.7), 1.5);
            this.create_specific_object_boxes(new THREE.Vector3(-76, 0, 111.5),new THREE.Vector3(-76, 0, 111.5), 1.6);
            this.create_specific_object_boxes(new THREE.Vector3(-47.7, 0, 112.3),new THREE.Vector3(-47.7, 0, 112.3), 2.2);
            this.create_specific_object_boxes(new THREE.Vector3(-69, 0, 74),new THREE.Vector3(-69, 0, 74), 0.6);
            this.create_specific_object_boxes(new THREE.Vector3(-70.5, 0, 86.25),new THREE.Vector3(-70.5, 0, 86.25), 0.9);
            this.create_specific_object_boxes(new THREE.Vector3(-140, 0, 68),new THREE.Vector3(-140, 0, 68), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(-123.6, 0, 80.5),new THREE.Vector3(-123.6, 0, 80.5), 0.9);
            this.create_specific_object_boxes(new THREE.Vector3(-55, 0, 137.3),new THREE.Vector3(-50, 0, 137.3), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(-44, 0, 146.6),new THREE.Vector3(-44, 0, 146.6), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(-86.3, 0, 146.6),new THREE.Vector3(-86.3, 0, 146.6), 0.7);
            // Village Rocks
            this.create_object_boxes(new THREE.Vector3(-15.0, 0, 139), new THREE.Vector3(-15.0, 0, 147));
            this.create_object_boxes(new THREE.Vector3(-20.0, 0, 134), new THREE.Vector3(-18.0, 0, 139));
            this.create_object_boxes(new THREE.Vector3(-21, 0, 128), new THREE.Vector3(-21, 0, 133));
            this.create_object_boxes(new THREE.Vector3(-19, 0, 125), new THREE.Vector3(-19, 0, 128));
            this.create_object_boxes(new THREE.Vector3(-20, 0, 134.5), new THREE.Vector3(-18, 0, 130));
            this.create_object_boxes(new THREE.Vector3(-25.5, 0, 119), new THREE.Vector3(-18, 0, 127));
            this.create_object_boxes(new THREE.Vector3(-25.5, 0, 106), new THREE.Vector3(-25, 0, 119));
            this.create_object_boxes(new THREE.Vector3(-40, 0, 106), new THREE.Vector3(-27, 0, 106));
            this.create_specific_object_boxes(new THREE.Vector3(-76.9, 0, 137.5), new THREE.Vector3(-70, 10, 137.5), 3.5);
            this.create_specific_object_boxes(new THREE.Vector3(-97, 0, 140), new THREE.Vector3(-97, 10, 145), 5.5);
            this.create_specific_object_boxes(new THREE.Vector3(-105, 0, 133.6), new THREE.Vector3(-105, 10, 133.6), 2.5);
            this.create_specific_object_boxes(new THREE.Vector3(-110.3, 0, 138), new THREE.Vector3(-110.3, 10, 138), 5);
            this.create_specific_object_boxes(new THREE.Vector3(-120, 0, 136.6), new THREE.Vector3(-120, 0, 136.6), 5);
            this.create_specific_object_boxes(new THREE.Vector3(-100, 0, 99), new THREE.Vector3(-100, 0, 99), 8.6);
            this.create_specific_object_boxes(new THREE.Vector3(-114.7, 0, 15), new THREE.Vector3(-114.7, 10, 15), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-114.7, 0, 10), new THREE.Vector3(-114.7, 10, 10), 1);
            this.create_specific_object_boxes(new THREE.Vector3(-142, 0, 14), new THREE.Vector3(-142, 10, 14), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-144, 0, 4), new THREE.Vector3(-144, 10, 4), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-136, 0, -1), new THREE.Vector3(-136, 10, -1), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-120, 0, -2), new THREE.Vector3(-120, 10, -2), 4);

            // Mounten Rock
            this.create_specific_object_boxes(new THREE.Vector3(-103.5, 0, -10), new THREE.Vector3(-102, 10, -10), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-105.5, 0, -14), new THREE.Vector3(-101.5, 10, -14), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-109, 0, -20), new THREE.Vector3(-109, 0, -20), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-106, 0, -25), new THREE.Vector3(-105, 0, -25), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-145, 0, -24), new THREE.Vector3(-143, 0, -2), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-137, 0, -30), new THREE.Vector3(-137, 0, -30), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-132, 0, -33), new THREE.Vector3(-132, 0, -33), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-128, 0, -32), new THREE.Vector3(-122, 0, -32), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-118, 0, -39), new THREE.Vector3(-118, 0, -32.5), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-138, 0, -25.8), new THREE.Vector3(-138, 0, -25.8), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-83, 0, -33), new THREE.Vector3(-82.5, 10, -28), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-76, 0, -34), new THREE.Vector3(-76, 10, -28), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-72, 0, -32), new THREE.Vector3(-49, 20, -28), 5);
            this.create_specific_object_boxes(new THREE.Vector3(-57, 0, -38), new THREE.Vector3(-54, 0, -38), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-43, 0, -36.3), new THREE.Vector3(-41, 10, -33.8), 5);
            this.create_specific_object_boxes(new THREE.Vector3(-34.5, 0, -36), new THREE.Vector3(-33.5, 0, -32), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-31.5, 0, -48), new THREE.Vector3(-31, 10, -43), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-26.75, 0, -47), new THREE.Vector3(-26.75, 0, -43), 1.5);
            this.create_specific_object_boxes(new THREE.Vector3(-99, 0, -24), new THREE.Vector3(-95.2, 0, -24), 5);
            this.create_specific_object_boxes(new THREE.Vector3(-98.5, 0, -29), new THREE.Vector3(-96, 0, -29), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-91, 0, -25), new THREE.Vector3(-91, 0, -23), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-114, 0, -42), new THREE.Vector3(-110, 0, -42), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-105.8, 0, -42.8), new THREE.Vector3(-105.8, 0, -42.8), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-102, 0, -53), new THREE.Vector3(-102, 0, -47.5), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-97, 0, -53), new THREE.Vector3(-97, 0, -49), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-43, 0, -51), new THREE.Vector3(-43, 0, -51), 5);
            this.create_specific_object_boxes(new THREE.Vector3(-80, 0, -63), new THREE.Vector3(-60, 0, -55), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-57, 0, -52.5), new THREE.Vector3(-52, 0, -52.5), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-42, 0, -43.1), new THREE.Vector3(-42, 0, -43.1), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-101.7, 0, -62), new THREE.Vector3(-101.7, 10, -62), 5.5);
            this.create_specific_object_boxes(new THREE.Vector3(-100, 0, -69), new THREE.Vector3(-105, 10, -69), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-101, 0, -69), new THREE.Vector3(-101, 10, -69), 1);
            this.create_specific_object_boxes(new THREE.Vector3(-122, 0, -73), new THREE.Vector3(-115, 10, -73), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-115, 0, -70), new THREE.Vector3(-105, 10, -70), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-127, 0, -79), new THREE.Vector3(-119.7, 10, -79), 1);
            this.create_specific_object_boxes(new THREE.Vector3(-133, 0, -82), new THREE.Vector3(-133, 10, -82), 5);
            this.create_specific_object_boxes(new THREE.Vector3(-136, 0, -90), new THREE.Vector3(-136, 10, -90), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-135.5, 0, -104.5), new THREE.Vector3(-135.5, 10, -104.5), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-140, 0, -149), new THREE.Vector3(-140, 10, -117), 5);
            this.create_specific_object_boxes(new THREE.Vector3(-135, 0, -139), new THREE.Vector3(-135, 0, -139), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-128, 0, -140), new THREE.Vector3(-126, 0, -140), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-122.5, 0, -142), new THREE.Vector3(-100, 0, -142), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-98.5, 0, -138.5), new THREE.Vector3(-96, 0, -138.5), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-105, 0, -116), new THREE.Vector3(-95.5, 0, -116), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-105, 0, -121), new THREE.Vector3(-97, 0, -121), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-103, 0, -112), new THREE.Vector3(-100, 0, -112), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-90, 0, -140), new THREE.Vector3(-50, 0, -140), 5);
            this.create_specific_object_boxes(new THREE.Vector3(-45, 0, -140), new THREE.Vector3(-45, 0, -120), 5);
            this.create_specific_object_boxes(new THREE.Vector3(-43.5, 0, -113), new THREE.Vector3(-39, 0, -113), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-47.7, 0, -114), new THREE.Vector3(-47.7, 0, -114), 1);
            this.create_specific_object_boxes(new THREE.Vector3(-34, 0, -115), new THREE.Vector3(-27, 0, -115), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-25, 0, -113), new THREE.Vector3(-11, 0, -113), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-22, 0, -110), new THREE.Vector3(-14, 0, -110), 1);
            this.create_specific_object_boxes(new THREE.Vector3(-37, 0, -98), new THREE.Vector3(-36.5, 0, -98), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-41.7, 0, -98), new THREE.Vector3(-41.7, 0, -98), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-33.5, 0, -95.5), new THREE.Vector3(-33.5, 0, -90), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-33, 0, -99), new THREE.Vector3(-33, 0, -99), 1);
            this.create_specific_object_boxes(new THREE.Vector3(-6, 0, -120), new THREE.Vector3(-4, 0, -115), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-56, 0, -92.5), new THREE.Vector3(-50, 0, -92.5), 5);
            this.create_specific_object_boxes(new THREE.Vector3(-75, 0, -83), new THREE.Vector3(-74, 0, -83), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-76.5, 0, -76.5), new THREE.Vector3(-76.5, 0, -76.5), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-73, 0, -70), new THREE.Vector3(-73, 0, -70), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-77, 0, -73), new THREE.Vector3(-77, 0, -73), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-77, 0, -81), new THREE.Vector3(-77, 0, -81), 1.5);
            this.create_specific_object_boxes(new THREE.Vector3(-75.5, 0, -88), new THREE.Vector3(-75, 0, -86), 1);
            this.create_specific_object_boxes(new THREE.Vector3(-70, 0, -84), new THREE.Vector3(-70, 0, -84), 1);
            this.create_specific_object_boxes(new THREE.Vector3(-70, 0, -80), new THREE.Vector3(-68, 0, -80), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-73, 0, -86.5), new THREE.Vector3(-73, 0, -86.5), 1);
            this.create_specific_object_boxes(new THREE.Vector3(-66, 0, -75.7), new THREE.Vector3(-56, 0, -75.7), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-58.6, 0, -86), new THREE.Vector3(-58.6, 0, -80), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-58.5, 0, -88), new THREE.Vector3(-58.5, 0, -86), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-61.7, 0, -93.7), new THREE.Vector3(-61.7, 0, -93.7), 1);
            this.create_specific_object_boxes(new THREE.Vector3(-16, 0, -94), new THREE.Vector3(-8.5, 0, -94), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-14.5, 0, -88), new THREE.Vector3(-9, 0, -88), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-14, 0, -96), new THREE.Vector3(-10, 0, -87), 2);
            this.create_specific_object_boxes(new THREE.Vector3(-30, 0, -85), new THREE.Vector3(-30, 0, -85), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-24, 0, -69), new THREE.Vector3(-24, 0, -57), 5);
            this.create_specific_object_boxes(new THREE.Vector3(-20, 0, -55), new THREE.Vector3(-20, 0, -53), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-24, 0, -50), new THREE.Vector3(-24, 0, -50), 3);
            this.create_specific_object_boxes(new THREE.Vector3(27, 0, -145), new THREE.Vector3(27, 0, -145), 4);
            this.create_specific_object_boxes(new THREE.Vector3(20, 0, -143), new THREE.Vector3(20, 0, -143), 4);
            this.create_specific_object_boxes(new THREE.Vector3(12, 0, -141), new THREE.Vector3(12, 0, -139), 4);
            this.create_specific_object_boxes(new THREE.Vector3(7, 0, -132), new THREE.Vector3(13, 0, -129), 3);
            this.create_specific_object_boxes(new THREE.Vector3(1, 0, -125.5), new THREE.Vector3(1, 0, -125.5), 4);
            this.create_specific_object_boxes(new THREE.Vector3(-1, 0, -117.5), new THREE.Vector3(-1, 0, -116.5), 2);

            // Mounten Trees
            this.create_specific_object_boxes(new THREE.Vector3(-95.3, 0, -17),new THREE.Vector3(-95.3, 0, -17), 0.6);
            this.create_specific_object_boxes(new THREE.Vector3(-77.6, 0, -21.7),new THREE.Vector3(-77.6, 0, -21.7), 0.5);
            this.create_specific_object_boxes(new THREE.Vector3(-57, 0, -21),new THREE.Vector3(-57, 0, -21), 0.5);
            this.create_specific_object_boxes(new THREE.Vector3(-37.9, 0, -22.3),new THREE.Vector3(-37.9, 0, -22.3), 0.6);
            this.create_specific_object_boxes(new THREE.Vector3(-67, 0, -38),new THREE.Vector3(-67, 0, -38), 0.5);
            this.create_specific_object_boxes(new THREE.Vector3(-27.7, 0, -88),new THREE.Vector3(-27.7, 0, -88), 0.6);
            this.create_specific_object_boxes(new THREE.Vector3(-19.2, 0, -82),new THREE.Vector3(-19.2, 0, -82), 0.6);
            this.create_specific_object_boxes(new THREE.Vector3(-11.1, 0, -43.25),new THREE.Vector3(-11.1, 0, -43.25), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(13, 0, -116.5),new THREE.Vector3(13, 0, -116.5), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(31, 0, -120.5),new THREE.Vector3(31, 0, -120.5), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(30, 0, -137.5),new THREE.Vector3(30, 0, -137.5), 0.6);
            this.create_specific_object_boxes(new THREE.Vector3(38, 0, -145.5),new THREE.Vector3(38, 0, -145.5), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(20.6, 0, -136),new THREE.Vector3(20.6, 0, -136), 0.7);

            // Forest Trees
            this.create_specific_object_boxes(new THREE.Vector3(13, 0, -99),new THREE.Vector3(13, 0, -99), 0.6);
            this.create_specific_object_boxes(new THREE.Vector3(4.7, 0, -60.5),new THREE.Vector3(4.7, 0, -60.5), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(0, 0, 0),new THREE.Vector3(0, 0, 0), 3);
            this.create_specific_object_boxes(new THREE.Vector3(13, 0, -74),new THREE.Vector3(17, 0, -74), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(21.75, 0, -40.6),new THREE.Vector3(21.75, 0, -40.6), 0.8);
            this.create_specific_object_boxes(new THREE.Vector3(34, 0, -97.5),new THREE.Vector3(34, 0, -97.5), 0.6);
            this.create_specific_object_boxes(new THREE.Vector3(51.3, 0, -103.7),new THREE.Vector3(51.3, 0, -103.7), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(57, 0, -132),new THREE.Vector3(57, 0, -132), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(73, 0, -140),new THREE.Vector3(76, 0, -140), 0.75);
            this.create_specific_object_boxes(new THREE.Vector3(75, 0, -111),new THREE.Vector3(78, 0, -111), 0.75);
            this.create_specific_object_boxes(new THREE.Vector3(99.5, 0, -144),new THREE.Vector3(99.5, 0, -144), 1.5);
            this.create_specific_object_boxes(new THREE.Vector3(99, 0, -127),new THREE.Vector3(99, 0, -127), 0.8);
            this.create_specific_object_boxes(new THREE.Vector3(116, 0, -133),new THREE.Vector3(116, 0, -133), 0.8);
            this.create_specific_object_boxes(new THREE.Vector3(119, 0, -111),new THREE.Vector3(119, 0, -111), 0.8);
            this.create_specific_object_boxes(new THREE.Vector3(135.4, 0, -138.9),new THREE.Vector3(135.4, 0, -138.9), 2);
            this.create_specific_object_boxes(new THREE.Vector3(42.8, 0, -57.7),new THREE.Vector3(48.0, 0, -57.7), 0.8);
            this.create_specific_object_boxes(new THREE.Vector3(63.2, 0, -74),new THREE.Vector3(63.2, 0, -69.5), 0.8);
            this.create_specific_object_boxes(new THREE.Vector3(85, 0, -77),new THREE.Vector3(85, 0, -77), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(102, 0, -94),new THREE.Vector3(106, 0, -94), 0.8);
            this.create_specific_object_boxes(new THREE.Vector3(135.3, 0, -98.4),new THREE.Vector3(135.3, 0, -98.4), 0.8);
            this.create_specific_object_boxes(new THREE.Vector3(121, 0, -72),new THREE.Vector3(121, 0, -72), 3);
            this.create_specific_object_boxes(new THREE.Vector3(133.9, 0, -62.5),new THREE.Vector3(133.9, 0, -62.5), 1.2);
            this.create_specific_object_boxes(new THREE.Vector3(140.3, 0, -44),new THREE.Vector3(140.3, 0, -44), 3);
            this.create_specific_object_boxes(new THREE.Vector3(119, 0, -63),new THREE.Vector3(119, 0, -63), 1.7);
            this.create_specific_object_boxes(new THREE.Vector3(132, 0, -48.4),new THREE.Vector3(132, 0, -48.4), 1.7);
            this.create_specific_object_boxes(new THREE.Vector3(131, 0, -60.8),new THREE.Vector3(131, 0, -60.8), 1.1);
            this.create_specific_object_boxes(new THREE.Vector3(104.8, 0, -56.4),new THREE.Vector3(104.8, 0, -56.4), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(78.5, 0, -58.4),new THREE.Vector3(78.5, 0, -58.4), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(44.5, 0, -40.5),new THREE.Vector3(44.5, 0, -40.5), 0.7);
            this.create_specific_object_boxes(new THREE.Vector3(30.6, 0, -8.5),new THREE.Vector3(30.6, 0, -8.5), 1.3);
            this.create_specific_object_boxes(new THREE.Vector3(28, 0, 9.8),new THREE.Vector3(28, 0, 9.8), 1.3);
            this.create_specific_object_boxes(new THREE.Vector3(95, 0, -44.5),new THREE.Vector3(95, 0, -41.2), 0.8);
            this.create_specific_object_boxes(new THREE.Vector3(62, 0, -47.2),new THREE.Vector3(62, 0, -43), 0.8);
            this.create_specific_object_boxes(new THREE.Vector3(28.6, 0, -28),new THREE.Vector3(28.6, 0, -23.6), 0.8);
            this.create_specific_object_boxes(new THREE.Vector3(80.5, 0, -31.5),new THREE.Vector3(80.5, 0, -31.5), 0.8);
            this.create_specific_object_boxes(new THREE.Vector3(51, 0, -14),new THREE.Vector3(51, 0, -14), 1.3);
            this.create_specific_object_boxes(new THREE.Vector3(136, 0, -11.5),new THREE.Vector3(136, 0, -11.5), 0.8);
            this.create_specific_object_boxes(new THREE.Vector3(141, 0, 25),new THREE.Vector3(141, 0, 30), 0.8);

            // Forest Rock
            this.create_specific_object_boxes(new THREE.Vector3(75.5, 0, -47.5), new THREE.Vector3(81, 0, -47), 5);

            // Chests forest
            this.create_specific_object_boxes(new THREE.Vector3(141.5, 0, -140), new THREE.Vector3(141.5, 1.5, -140), 3);
            this.create_specific_object_boxes(new THREE.Vector3(134.8, 0, -56), new THREE.Vector3(134.8, 1.5, -56), 3);
            this.create_specific_object_boxes(new THREE.Vector3(128, 0, -68), new THREE.Vector3(128, 1.5, -68), 3);

            // Chests mounten
            this.create_specific_object_boxes(new THREE.Vector3(-57.3, 0, -45), new THREE.Vector3(-57.3, 1.5, -45), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-63, 0, -82), new THREE.Vector3(-63, 1.5, -82), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-130.5, 0, -131.5), new THREE.Vector3(-130.5, 1.5, -131.5), 3);

            // Chests village
            this.create_specific_object_boxes(new THREE.Vector3(-133.3, 0, 144), new THREE.Vector3(-133.3, 1.5, 144), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-64, 0, 114), new THREE.Vector3(-64, 1.5, 114), 3);
            this.create_specific_object_boxes(new THREE.Vector3(-54.8, 0, 140), new THREE.Vector3(-54.8, 1.5, 140), 3);

            // Chests castle
            this.create_specific_object_boxes(new THREE.Vector3(51.5, 0, 78), new THREE.Vector3(51.5, 1.5, 78), 3);
            this.create_specific_object_boxes(new THREE.Vector3(138, 0, 80), new THREE.Vector3(138, 1.5, 80), 3);
            this.create_specific_object_boxes(new THREE.Vector3(95, 0, 137), new THREE.Vector3(95, 1.5, 137), 3);
        }
    }

    create_object_boxes(start_position, end_position){
        const object_Box = new THREE.Box3(
            new THREE.Vector3(start_position.x - 1.25, start_position.y, start_position.z - 1.25), // Mindestpunkt
            new THREE.Vector3(end_position.x + 1.25, end_position.y + 10, end_position.z + 1.25) // Maximalpunkt
        );
        this.model.object_boxes_wall.push(object_Box);
        //let boxHelper = new THREE.Box3Helper(object_Box, 0xffff00);
        //this.scene.add(boxHelper);
    }

    create_specific_object_boxes(min_position, max_position, site_size){
        const object_Box = new THREE.Box3(
            new THREE.Vector3(min_position.x - site_size, min_position.y, min_position.z - site_size), // Mindestpunkt
            new THREE.Vector3(max_position.x + site_size, max_position.y + 10, max_position.z + site_size) // Maximalpunkt
        );
        this.model.object_boxes.push(object_Box);
        //let boxHelper = new THREE.Box3Helper(object_Box, 0xfff000);
        //this.scene.add(boxHelper);
    }

    render(model){
        this.renderer.render(this.scene, this.camera);

        if (model.player_model) {
            model.player_model.position.copy(model.player_model.position);
            model.player_model.quaternion.copy(model.player_model.quaternion);
        }

        model.npc_models.forEach((npc_model) => {
            npc_model.position.copy(npc_model.position);
            npc_model.quaternion.copy(npc_model.quaternion);
        });
    }

    load_gltf_assets(url, x, y, z, scalar, rotation_scale, scene){
        const assetLoader = new GLTFLoader();
        assetLoader.load(url.href, function(gltf){
            const model = gltf.scene;
            model.position.set(x, y, z);
            model.scale.setScalar(scalar);
            model.rotation.y = rotation_scale;
            model.receiveShadow = true;
            scene.add(model);
        }, undefined, function(error){
            console.log(error);
        });
    }
}
