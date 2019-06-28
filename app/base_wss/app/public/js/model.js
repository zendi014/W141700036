var orbitControls;
			var container, camera, scene, renderer, loader;
			var gltf, background, envMap, mixer, gui, extensionControls;

			var clock = new THREE.Clock();








			var scenes = {
				'Test1': {
					name: 'Test2',
					url: '/models/model.gltf',
					author: 'MozillaVR',
					authorURL: 'https://vr.mozilla.org/',
					// cameraPos: new THREE.Vector3( 0.5, 2, 2 ),
					center: new THREE.Vector3( 0, 1.2, 0 ),
					objectRotatiscaleon: new THREE.Euler( 0, 0, 0 ),
					addLights: true,
					addGround: true,
					shadows: true,
					extensions: [ 'glTF-MaterialsUnlit' ]
				}
			};





			var state = {
				scene: Object.keys( scenes )[ 0 ],
				extension: scenes[ Object.keys( scenes )[ 0 ] ].extensions[ 0 ],
				playAnimation: false
			};





			function onload() {

				container = document.getElementById( 'container' );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setClearColor( 0x000000 );
				renderer.setPixelRatio( window.devicePixelRatio );
				// renderer.setSize( window.innerWidth, window.innerHeight );


				renderer.gammaOutput = true;
				// renderer.physicallyCorrectLights = true;
				renderer.shadowMap.enabled = true;


				container.appendChild( renderer.domElement );

				window.addEventListener( 'resize', onWindowResize, false );


				// load_pallate();

				initScene( scenes[ state.scene ] );
				animate();

			}




			function load_pallate(){
				/*
				var urls = [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ];


				var loader = new THREE.CubeTextureLoader().setPath( 'assets/textures/park/' );
				background = loader.load( urls, function ( texture ) {

					var pmremGenerator = new THREE.PMREMGenerator( texture );
					pmremGenerator.update( renderer );

					var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker( pmremGenerator.cubeLods );
					pmremCubeUVPacker.update( renderer );

					envMap = pmremCubeUVPacker.CubeUVRenderTarget.texture;

					pmremGenerator.dispose();
					pmremCubeUVPacker.dispose();
					// buildGUI();

				} );
				*/

			}







			function initScene( sceneInfo ) {

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xffffff );
				scene.fog = new THREE.Fog( 0xffffff, 1000, 4000 );






				camera = new THREE.PerspectiveCamera( 60, container.offsetWidth / container.offsetHeight, 1, 8000 );
				camera.aspect = this.width / this.height;
				camera.updateProjectionMatrix();
				camera.position.set( 350, 180, 450 );
				scene.add( camera );






				var spot1;

				if ( sceneInfo.addLights ) {

					var light = [3];
					scene.add( new THREE.AmbientLight( 0x151515 ) );
					light[0] = new THREE.DirectionalLight( 0xdfebff, 1 ); //color , intensity
					light[0].position.set( 50, 300, 100 );//intencity, v pos, sh pos
					// light.position.set( 50, 200, 100 );
					light[0].castShadow = true;
					light[0].shadow.mapSize.width = 1024;
					light[0].shadow.mapSize.height = 512;//1024 512

					light[0].shadow.camera.near = 100;
					light[0].shadow.camera.far = 1200;
					light[0].shadow.camera.left = -1000;
					light[0].shadow.camera.right = 1000;
					light[0].shadow.camera.top = 350;
					light[0].shadow.camera.bottom = -350;

					scene.add( light[0] );


					light[ 1 ] = new THREE.DirectionalLight( 0xdfebff, 0.7 , 200 );
					light[ 1 ].position.set( -200, 300, 200 );
					scene.add( light[1] );


					light[ 2 ] = new THREE.DirectionalLight( 0xdfebff, 0.4 , 500 );
					light[ 2 ].position.set( 0, 400, -300 );
					scene.add( light[2] );

				}






















				if ( sceneInfo.shadows ) {

					renderer.shadowMap.enabled = true;
					renderer.shadowMap.type = THREE.PCFSoftShadowMap;

				}







				// TODO: Reuse existing OrbitControls, GLTFLoaders, and so on
				orbitControls = new THREE.OrbitControls( camera, renderer.domElement );

				if ( sceneInfo.addGround ) {


					var gt = new THREE.TextureLoader().load( "/images/grasslight-big.jpg" );
					var gg = new THREE.PlaneBufferGeometry( 16000, 16000 );
					var gm = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt } );

					var ground = new THREE.Mesh( gg, gm );
					ground.rotation.x = - Math.PI / 2;
					ground.material.map.repeat.set( 64, 64 );
					ground.material.map.wrapS = THREE.RepeatWrapping;
					ground.material.map.wrapT = THREE.RepeatWrapping;
					// note that because the ground does not cast a shadow, .castShadow is left false
					ground.receiveShadow = true;
					scene.add( ground );




					/*

						var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xFFFFFF } );
						var ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 512, 512 ), groundMaterial );
						ground.receiveShadow = !! sceneInfo.shadows;

						if ( sceneInfo.groundPos ) {

							ground.position.copy( sceneInfo.groundPos );

						} else {

							ground.position.z = - 70;

						}

						ground.rotation.x = - Math.PI / 2;

						scene.add( ground );
					*/
				}







				loader = new THREE.GLTFLoader();

				THREE.DRACOLoader.setDecoderPath( '/js/libs/draco/gltf/' );
				loader.setDRACOLoader( new THREE.DRACOLoader() );

				var url = sceneInfo.url.replace( /%s/g, state.extension );

				if ( state.extension === 'glTF-Binary' ) {

					url = url.replace( '.gltf', '.glb' );

				}





				var loadStartTime = performance.now();

				loader.load( url, function ( data ) {

					gltf = data;

					var object = gltf.scene;


					gltf.scene.scale.set(25,25,25);



          const cm  = new ControlModel(gltf);
          cm.init()
					// buildGUI(gltf);





					// console.info( 'Load time: ' + ( performance.now() - loadStartTime ).toFixed( 2 ) + ' ms.' );

					if ( sceneInfo.cameraPos ) {

						camera = gltf.camera;

						camera.position.copy( sceneInfo.cameraPos );

					}

					if ( sceneInfo.center ) {

						orbitControls.target.copy( sceneInfo.center );

					}

					if ( sceneInfo.objectPosition ) {

						object.position.copy( sceneInfo.objectPosition );

						if ( spot1 ) {

							spot1.target.position.copy( sceneInfo.objectPosition );

						}

					}

					if ( sceneInfo.objectRotation ) {

						object.rotation.copy( sceneInfo.objectRotation );

					}

					if ( sceneInfo.objectScale ) {

						object.scale.copy( sceneInfo.objectScale );

					}

					if ( sceneInfo.addEnvMap ) {

						object.traverse( function ( node ) {

							if ( node.material && ( node.material.isMeshStandardMaterial ||
								 ( node.material.isShaderMaterial && node.material.envMap !== undefined ) ) ) {

								node.material.envMap = envMap;
								node.material.envMapIntensity = 1.5; // boombox seems too dark otherwise

							}

						} );

						scene.background = background;

					}

					object.traverse( function ( node ) {

						if ( node.isMesh || node.isLight ) node.castShadow = true;

					} );

					var animations = gltf.animations;

					if ( animations && animations.length ) {

						mixer = new THREE.AnimationMixer( object );

						for ( var i = 0; i < animations.length; i ++ ) {

							var animation = animations[ i ];

							// There's .3333 seconds junk at the tail of the Monster animation that
							// keeps it from looping cleanly. Clip it at 3 seconds
							if ( sceneInfo.animationTime ) {

								animation.duration = sceneInfo.animationTime;

							}

							var action = mixer.clipAction( animation );

							if ( state.playAnimation ) action.play();

						}

					}

					scene.add( object );
					onWindowResize();

				}, undefined, function ( error ) {

					console.error( error );

				} );

			}













			function onWindowResize() {

				camera.aspect = container.offsetWidth / container.offsetHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}









			function animate() {

				requestAnimationFrame( animate );

				if ( mixer ) mixer.update( clock.getDelta() );

				orbitControls.update();

				render();

			}













			function render() {

				renderer.render( scene, camera );

			}














			function updateGUI() {
				if ( extensionControls ) extensionControls.remove();

				var sceneInfo = scenes[ state.scene ];

				if ( sceneInfo.extensions.indexOf( state.extension ) === - 1 ) {
					state.extension = sceneInfo.extensions[ 0 ];
				}

				extensionControls = gui.add( state, 'extension', sceneInfo.extensions );
				extensionControls.onChange( reload );
			}






			function toggleAnimations() {

				for ( var i = 0; i < gltf.animations.length; i ++ ) {

					var clip = gltf.animations[ i ];
					var action = mixer.existingAction( clip );

					state.playAnimation ? action.play() : action.stop();

				}

			}






			function reload() {

				if ( loader && mixer ) mixer.stopAllAction();

				updateGUI();
				initScene( scenes[ state.scene ] );

			}




      onload();





















			function init_angle(gltf){
				gltf.scene.traverse(function(child){
					if (child instanceof THREE.SkinnedMesh){
						console.log(child);
						child.skeleton.bones[0].rotation.y = 20;
						child.skeleton.bones[1].rotation.z = -30;
					}
				});
			}
