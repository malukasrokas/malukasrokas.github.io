// Sprites
var northPoleLight = new THREE.TextureLoader().load('static/light_sprite.png');
var green_vertex = new THREE.TextureLoader().load('static/green_vertex.png');
var blue_vertex = new THREE.TextureLoader().load('static/blue_vertex.png');
var yellow_vertex = new THREE.TextureLoader().load('static/yellow_vertex.png');

var rotationDegree = 0;
scene = null;
var camera, renderer, controls;
var planeGeometry, planeMaterial, plane;
var sphereGeometry, sphereMaterial, sphere;

var cubeVertexes = [];

// lineSegments = [];

function initializeScene() {
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.set( 0, -2, 3 );
    camera.lookAt( new THREE.Vector3( 0, 0, 2 ) );

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    renderer.setClearColor( 0x98a8e4 );

    // Controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );

    // Plane
    planeGeometry = new THREE.PlaneGeometry( 10, 10, 32, 32 );
    planeMaterial = new THREE.MeshBasicMaterial( {
        color: 0xffffff,
        side: THREE.DoubleSide
    } );
    plane = new THREE.Mesh( planeGeometry, planeMaterial );
    scene.add( plane );

    // Axis helper
    // var axisHelper = new THREE.AxisHelper( 5 );
    // scene.add( axisHelper )

    // Sphere
    sphereGeometry = new THREE.SphereGeometry( 1, 48, 48 );
    sphereMaterial = new THREE.MeshBasicMaterial( {
        color: 0xdeb6c0,
        transparent: true,
        opacity: 0.2,
        wireframe: params.sphereWireframe,
    } );
    sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    sphere.position.set( 0, 0, 1 );
    scene.add( sphere );
}

// Displays north pole at the top of the sphere
function addNorthPole() {

    var northPoleGeometry, northPoleMaterial, northPole;

    northPoleGeometry = new THREE.Geometry();
    northPoleGeometry.vertices.push( new THREE.Vector3( 0, 0, 2.05 ) );

    northPoleMaterial = new THREE.PointsMaterial( {
        size: 0.4,
        map: northPoleLight,
        alphaTest: 0.5,
        transparent: true
    } );

    northPole = new THREE.Points( northPoleGeometry, northPoleMaterial );

    scene.add( northPole );
}

// Maps polytopes into a sphere
function sphericalizeVertices( vertices ) {

    var x2, y2, z2;

    vertices.forEach (function(vertex) {
        x2 = vertex.x * vertex.x;
        y2 = vertex.y * vertex.y;
        z2 = vertex.z * vertex.z;

        vertex.x = vertex.x * Math.sqrt(1 - (y2 * 0.5) - (z2 * 0.5) + ((y2 * z2) / 3));
        vertex.y = vertex.y * Math.sqrt(1 - (z2 * 0.5) - (x2 * 0.5) + ((z2 * x2) / 3));
        vertex.z = vertex.z * Math.sqrt(1 - (x2 * 0.5) - (y2 * 0.5) + ((x2 * y2) / 3));
    });

    return vertices;
}

// Applies rotation to given vertexes
function applyRotationToVertices( vertices ) {

    var quaternionX, quaternionY, quaternionZ;
    var angle = rotationDegree * THREE.Math.DEG2RAD;

    if (params.rotateX) {
        quaternionX = new THREE.Quaternion();
        quaternionX.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), angle);
    }

    if (params.rotateY) {
        quaternionY = new THREE.Quaternion();
        quaternionY.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), angle);
    }

    if (params.rotateZ) {
        quaternionZ = new THREE.Quaternion();
        quaternionZ.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), angle);
    }

    vertices.forEach( function( vertex ) {
        params.rotateX && vertex.applyQuaternion( quaternionX );
        params.rotateY && vertex.applyQuaternion( quaternionY );
        params.rotateZ && vertex.applyQuaternion( quaternionZ );
        vertex.add( new THREE.Vector3( 0, 0, 1 ) );
    } );

    return vertices;
}

// Creates a line split into fragments
function fragmentLineByLength( v1, v2, length ) {
    var dir = v2.clone().sub( v1 ).normalize().multiplyScalar(0.2);
    console.log(v1.clone().add(dir))
    return v1.clone().add(dir);
}

// Returns a Vector3 which is in between two vectors by percentage
function getPointInLineByPerc( v1, v2, percentage ) {

    var dir, len;

    dir = v2.clone().sub( v1 );
    len = dir.length();

    dir = dir.normalize().multiplyScalar(len*percentage/100);

    return v1.clone().add(dir);
}

// if applySP is true, apply stereographic projection to the line
function createLine( vertexPair, id, applySP ) {

    var v1 = vertexPair[0];
    var v2 = vertexPair[1];

    // Remove line rendered in previous frame
    var lineName = applySP ? 'plane-line' : '3D-line';
    lineName += id;
    scene.remove( scene.getObjectByName( lineName ) );

    var lineMaterial, lineGeometry, line;
    var new_point;

    var lineSegments = [];
    for (var i=0; i<11; i++) {
        new_point = getPointInLineByPerc( v1, v2, i*10 );
        lineSegments.push( new_point );
    }

    lineMaterial = new THREE.LineBasicMaterial({
        color: applySP ? 0x0000ff : 0x0000000,
        linewidth: applySP ? 2 : 5,
    });
    lineGeometry = new THREE.Geometry();

    // Apply transformations to the vectors
    lineGeometry.vertices = sphericalizeVertices(lineSegments);
    lineGeometry.vertices = applyRotationToVertices(lineSegments);
    if ( applySP ) {
        lineGeometry.vertices = applyStereographicProjection(lineSegments);
    }

    line = new THREE.Line(lineGeometry, lineMaterial);
    line.name = lineName;

    scene.add(line);
}


function sphericalizeObject( polytope ) {

    var polytopeVertexes = polytope.vertexes();

    function emphasizeVertexes() {

        var shapeVertexesGeomtetry, shapeVertexesMaterial, shapeVertexes;

        scene.remove( scene.getObjectByName( 'shape-vertexes' ) );

        shapeVertexesGeometry = new THREE.Geometry();
        shapeVertexesGeometry.vertices = polytopeVertexes;

        sphericalizeVertices( shapeVertexesGeometry.vertices );
        applyRotationToVertices( shapeVertexesGeometry.vertices );


        shapeVertexesMaterial = new THREE.PointsMaterial( {
            size: 0.25,
            map: green_vertex,
            alphaTest: 0.1,
            transparent: true
        } );

        shapeVertexes = new THREE.Points( shapeVertexesGeometry, shapeVertexesMaterial );
        shapeVertexes.name = 'shape-vertexes';
        scene.add( shapeVertexes );
    }

    function drawLines() {

        var vertexPairs = [];
        // TOP 4
        vertexPairs.push( [polytopeVertexes[0], polytopeVertexes[1]] );
        vertexPairs.push( [polytopeVertexes[1], polytopeVertexes[2]] );
        vertexPairs.push( [polytopeVertexes[2], polytopeVertexes[3]] );
        vertexPairs.push( [polytopeVertexes[0], polytopeVertexes[3]] );

        // VERTICAL 4
        vertexPairs.push( [polytopeVertexes[0], polytopeVertexes[4]] );
        vertexPairs.push( [polytopeVertexes[1], polytopeVertexes[5]] );
        vertexPairs.push( [polytopeVertexes[2], polytopeVertexes[6]] );
        vertexPairs.push( [polytopeVertexes[3], polytopeVertexes[7]] );

        // BOTTOM 4
        vertexPairs.push( [polytopeVertexes[4], polytopeVertexes[5]] );
        vertexPairs.push( [polytopeVertexes[5], polytopeVertexes[6]] );
        vertexPairs.push( [polytopeVertexes[6], polytopeVertexes[7]] );
        vertexPairs.push( [polytopeVertexes[4], polytopeVertexes[7]] );


        // vertexPairs.push( [polytopeVertexes[3], polytopeVertexes[4]] );

        for (var i=0; i<vertexPairs.length; i++) {
            createLine( vertexPairs[i], i, false )
        }
    }

    drawLines();
    emphasizeVertexes();
}

// Map given vectors from 3D object onto plane
function applyStereographicProjection( vectors ) {

    var projected_vector;
    var projected_vectors = [];

    vectors.forEach( function( vector ) {
        projected_vector = new THREE.Vector3();
        projected_vector.x = ( vector.x / ( 2 - vector.z ) ) * 2;
        projected_vector.y = ( vector.y / ( 2 - vector.z ) ) * 2;
        projected_vector.z = 0.05;
        projected_vectors.push( projected_vector );
    } );

    return projected_vectors;
}

// Create shape on plane
function addPlaneShape( polytope ) {

    var polytopeVertexes = polytope.vertexes();

    function addVertexes() {
        var shapeMaterial, shapeGeometry, shape;

        scene.remove( scene.getObjectByName( 'plane-vertexes' ) );

        shapeGeometry = new THREE.Geometry();
        polytopeVertexes = sphericalizeVertices( polytopeVertexes );
        polytopeVertexes = applyRotationToVertices( polytopeVertexes );
        polytopeVertexes = applyStereographicProjection( polytopeVertexes );
        // shapeGeometry.vertices = applyStereographicProjection( polytopeVertexes );
        shapeGeometry.vertices = polytopeVertexes;

        planeMaterial = new THREE.PointsMaterial( {
            size: 0.15,
            map: blue_vertex,
            alphaTest: 0.1,
            transparent: true,
            sizeAttenuation: true,
        } );

        shape = new THREE.Points( shapeGeometry, planeMaterial );
        shape.name = 'plane-vertexes';

        scene.add( shape );

    }

    function drawLines() {

        var vertexPairs = [];
        // TOP 4
        vertexPairs.push( [polytopeVertexes[0], polytopeVertexes[1]] );
        vertexPairs.push( [polytopeVertexes[1], polytopeVertexes[2]] );
        vertexPairs.push( [polytopeVertexes[2], polytopeVertexes[3]] );
        vertexPairs.push( [polytopeVertexes[0], polytopeVertexes[3]] );

        // VERTICAL 4
        vertexPairs.push( [polytopeVertexes[0], polytopeVertexes[4]] );
        vertexPairs.push( [polytopeVertexes[1], polytopeVertexes[5]] );
        vertexPairs.push( [polytopeVertexes[2], polytopeVertexes[6]] );
        vertexPairs.push( [polytopeVertexes[3], polytopeVertexes[7]] );

        // BOTTOM 4
        vertexPairs.push( [polytopeVertexes[4], polytopeVertexes[5]] );
        vertexPairs.push( [polytopeVertexes[5], polytopeVertexes[6]] );
        vertexPairs.push( [polytopeVertexes[6], polytopeVertexes[7]] );
        vertexPairs.push( [polytopeVertexes[4], polytopeVertexes[7]] );

        for (var i=0; i<vertexPairs.length; i++) {
            createLine( vertexPairs[i], i, true );
        }
    }

    drawLines();
    addVertexes();
}

function rotateObject( polytope ) {
    if (rotationDegree > 360) rotationDegree = 0;

    if (params.rotate || params.rotateX) {
        polytope.rotation.x = (rotationDegree * THREE.Math.DEG2RAD);
    }

    if (params.rotate && params.rotateY) {
        polytope.rotation.y = (rotationDegree * THREE.Math.DEG2RAD);
    }

    if (params.rotate && params.rotateZ) {
        polytope.rotation.z = (rotationDegree * THREE.Math.DEG2RAD);
    }

    if (polytope != sphere) {
        sphericalizeObject( polytope );
        addPlaneShape( polytope );
    }

    polytope.position.z = 1;
}
