'use strict';

angular.module('personalSiteApp.top', ['ngRoute'])
.controller('TopController', [function() {

    /* ---------------------------------------------- /*
     * Background image
    /* ---------------------------------------------- */
    /*$('#top').backstretch([
        'images/bg3.jpg',
        'images/bg2.jpg',
        'images/bg1.jpg'
        ], {
            duration: 3000,
            fade: 750
        }
    );*/

    $('a[href*=\\#]').bind("click", function(e){
        var elem = $(this),
            hash = elem.prop('hash'),
            anchor = $(hash + "-anchor");
        if (!anchor.length) {
            anchor = $(hash);
        }
        $('html, body').stop().animate({
            scrollTop: anchor.offset().top
        }, 1000);
        e.preventDefault();
        return false;
    });

    /* ---------------------------------------------- /*
     * Rotate
    /* ---------------------------------------------- */

    $(".rotate").textrotator({
        animation: "dissolve",
        separator: "|",
        speed: 3000
    });

    /* ---------------------------------------------- /*
     * Background webGL
    /* ---------------------------------------------- */
    var group,
        particles,
        containerWrapper,
        controls,
        particlesData = [],
        camera,
        scene,
        renderer,
        positions,
        colors,
        pointCloud,
        particlePositions,
        linesMesh,
        maxParticleCount = 1000,
        particleCount = 500,
        r = 800,
        rHalf = r / 2,
        effectController = {
            showDots: true,
            showLines: true,
            minDistance: 100,
            limitConnections: false,
            maxConnections: 20,
            particleCount: 500,
            zoomScale: 5
        };

    function initGUI() {
        var gui = new dat.GUI();
        effectController.zoomIn = function() {
            controls.dollyOut((100.0 - effectController.zoomScale) / 100.0);
            controls.update();
            controls.dispatchEvent({ type: 'start' });
            controls.dispatchEvent({ type: 'end' });
        };

        effectController.zoomOut = function() {
            controls.dollyIn((100.0 - effectController.zoomScale) / 100.0);
            controls.update();
            controls.dispatchEvent({ type: 'start' });
            controls.dispatchEvent({ type: 'end' });
        };

        gui.add(effectController, "showDots").onChange(function(value) {pointCloud.visible = value;});
        gui.add(effectController, "showLines").onChange(function(value) {linesMesh.visible = value;});
        gui.add(effectController, "minDistance", 10, 300);
        gui.add(effectController, "limitConnections");
        gui.add(effectController, "maxConnections", 0, 30, 1);
        gui.add(effectController, "particleCount", 0, maxParticleCount, 1).onChange(function(value) {
            particleCount = parseInt(value);
            particles.drawcalls[0].count = particleCount;
        });
        gui.add(effectController, "zoomScale", 1, 100);
        gui.add(effectController, "zoomIn");
        gui.add(effectController, "zoomOut");

        gui.close();
    }


    function init() {
        var container,
            helper,
            segments,
            pMaterial,
            geometry,
            material,
            containerWidth,
            containerHeight;

        container = document.getElementById('three-container');
        containerWrapper = $(container);
        containerWidth = parseInt(containerWrapper.css('width'));
        containerHeight = parseInt(containerWrapper.css('height'));

        camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 1, 4000);
        camera.position.z = 1250;

        controls = new THREE.OrbitControls(camera, container);
        controls.mouseWheelZoom = false;

        scene = new THREE.Scene();

        group = new THREE.Group();
        scene.add(group);

        helper = new THREE.BoxHelper(new THREE.Mesh(new THREE.BoxGeometry( r, r, r )));
        helper.material.color.setHex(0x080808);
        helper.material.blending = THREE.AdditiveBlending;
        helper.material.transparent = true;
        group.add(helper);

        segments = maxParticleCount * maxParticleCount;

        positions = new Float32Array(segments * 3);
        colors = new Float32Array(segments * 3);

        pMaterial = new THREE.PointCloudMaterial({
            color: 0xFFFFFF,
            size: 3,
            blending: THREE.AdditiveBlending,
            transparent: true,
            sizeAttenuation: false
        });

        particles = new THREE.BufferGeometry();
        particlePositions = new Float32Array(maxParticleCount * 3);

        for (var i = 0; i < maxParticleCount; i++) {
            var x = Math.random() * r - r / 2,
                y = Math.random() * r - r / 2,
                z = Math.random() * r - r / 2;

            particlePositions[i * 3]     = x;
            particlePositions[i * 3 + 1] = y;
            particlePositions[i * 3 + 2] = z;

            // add it to the geometry
            particlesData.push( {
                velocity: new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2,  -1 + Math.random() * 2),
                numConnections: 0
            });
        }

        particles.drawcalls.push({
            start: 0,
            count: particleCount,
            index: 0
        });

        particles.addAttribute('position', new THREE.DynamicBufferAttribute(particlePositions, 3));

        // create the particle system
        pointCloud = new THREE.PointCloud(particles, pMaterial);
        group.add(pointCloud);

        geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.DynamicBufferAttribute(positions, 3));
        geometry.addAttribute('color', new THREE.DynamicBufferAttribute(colors, 3));
        geometry.computeBoundingSphere();
        geometry.drawcalls.push({
            start: 0,
            count: 0,
            index: 0
        });

        material = new THREE.LineBasicMaterial({
            vertexColors: THREE.VertexColors,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        linesMesh = new THREE.Line(geometry, material, THREE.LinePieces);
        group.add(linesMesh);

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);

        renderer.setSize(containerWidth, containerHeight);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        container.appendChild(renderer.domElement);

        //stats = new Stats();
        //stats.domElement.style.position = 'absolute';
        //stats.domElement.style.top = '0px';
        //container.appendChild(stats.domElement);

        initGUI();
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        var width = parseInt(containerWrapper.css('width')),
            height = parseInt(containerWrapper.css('height'));
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }

    function animate() {

        var vertexpos = 0,
            colorpos = 0,
            numConnected = 0;

        for (var n = 0; n < particleCount; n++) {
            particlesData[n].numConnections = 0;
        }

        for (var i = 0; i < particleCount; i++) {
            // get the particle
            var particleData = particlesData[i];

            particlePositions[i * 3]     += particleData.velocity.x;
            particlePositions[i * 3 + 1] += particleData.velocity.y;
            particlePositions[i * 3 + 2] += particleData.velocity.z;

            if (particlePositions[i * 3 + 1] < -rHalf || particlePositions[i * 3 + 1] > rHalf) {
                particleData.velocity.y = -particleData.velocity.y;
            }

            if (particlePositions[i * 3] < -rHalf || particlePositions[i * 3] > rHalf) {
                particleData.velocity.x = -particleData.velocity.x;
            }

            if (particlePositions[i * 3 + 2] < -rHalf || particlePositions[i * 3 + 2] > rHalf) {
                particleData.velocity.z = -particleData.velocity.z;
            }

            if (effectController.limitConnections && particleData.numConnections >= effectController.maxConnections) {
                continue;
            }

            // Check collision
            for (var j = i + 1; j < particleCount; j++) {
                var particleDataB = particlesData[j],
                    dx,
                    dy,
                    dz,
                    dist,
                    alpha;

                if (effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections) {
                    continue;
                }

                dx = particlePositions[i * 3] - particlePositions[j * 3];
                dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
                dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
                dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < effectController.minDistance) {

                    particleData.numConnections++;
                    particleDataB.numConnections++;

                    alpha = 1.0 - dist / effectController.minDistance;

                    positions[vertexpos++] = particlePositions[i * 3];
                    positions[vertexpos++] = particlePositions[i * 3 + 1];
                    positions[vertexpos++] = particlePositions[i * 3 + 2];

                    positions[vertexpos++] = particlePositions[j * 3];
                    positions[vertexpos++] = particlePositions[j * 3 + 1];
                    positions[vertexpos++] = particlePositions[j * 3 + 2];

                    colors[colorpos++] = alpha;
                    colors[colorpos++] = alpha;
                    colors[colorpos++] = alpha;

                    colors[colorpos++] = alpha;
                    colors[colorpos++] = alpha;
                    colors[colorpos++] = alpha;

                    numConnected++;
                }
            }
        }


        linesMesh.geometry.drawcalls[ 0 ].count = numConnected * 2;
        linesMesh.geometry.attributes.position.needsUpdate = true;
        linesMesh.geometry.attributes.color.needsUpdate = true;

        pointCloud.geometry.attributes.position.needsUpdate = true;

        requestAnimationFrame(animate);

        //stats.update();
        render();
    }

    function render() {
        var time = Date.now() * 0.001;
        group.rotation.y = time * 0.1;

        renderer.render(scene, camera);
    }

    init();
    animate();
}]);
