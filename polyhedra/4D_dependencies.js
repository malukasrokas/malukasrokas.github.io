// Maps 4D coordinates from 3-sphere to 3D cordinates
function applyStereographicProjection4D( vectors ) {

    var projected_vector;
    var projected_vectors = [];

    vectors.forEach( function( vector ) {
        projected_vector = new THREE.Vector3();
        projected_vector.x = ( vector.x / ( 1 - vector.w ) );
        projected_vector.y = ( vector.y / ( 1 - vector.w ) );
        projected_vector.z = ( vector.z / ( 1 - vector.w ) );
        projected_vectors.push( projected_vector );
    } );

    return projected_vectors;
}

function createTubeEdge( vertice_pair, type ) {

    var v1 = vertice_pair[0];
    var v2 = vertice_pair[1];

    var dotMaterial, dotGeometry, dot;
    // var new_dot;
    var dotList = [];

    var segments = 100;
    if ( type == 'dec' || type == 'red' ) {
        segments = 50;
    }

    for (var i=0; i<=segments; i++) {
        dotList.push(getPointInLineByPerc( v1, v2, 100/segments*i ));
    }

    params.sphericalize && sphericalizeVertices(dotList);

    var sphereMaterial, sphere, sphereGeometry;
    var sphereMaterial = new THREE.MeshBasicMaterial( {color: 0x0a0314} );
    switch ( type ) {
        case 'dec':
            break;
        case 'red':
            sphereGeometry = new THREE.SphereGeometry( 0.05, 10, 10 );
            break;
        default:
            sphereGeometry = new THREE.SphereGeometry( 0.1, 10, 10 );
    }

    dotList.forEach( function(v, i) {
        if ( type == 'dec') {
            sphereGeometry = new THREE.SphereGeometry( 0.1 - 0.0012*i, 10, 10 );
            sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
        } else {
            sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
        }
        scene.add(sphere);
        v.multiplyScalar(2);
        sphere.position.set(v.x, v.y, v.z);
    });
}

// Builds given regular 4-polytope
function buildPolyheroid( polytope, rounded ) {

    var vertices = polytope.projected_vertexes;
    var polyope_rounded = true;
    if (rounded == false) {
        polytope_rounded = false;
    }

    function generateVertices() {

        // PRINTS 3D TEXT
        var loader = new THREE.FontLoader();
        // loader.load( 'Arial_Regular.json', function ( font ) {
        //     var geometry = new THREE.TextGeometry( i, {
        //         font: font,
        //         size: 0.25,
        //         height: 0.125,
        //     } );
        //     var textMaterial = new THREE.MeshPhongMaterial(
        //         { color: 0xff0000, specular: 0xffffff }
        //     );
        //
        //     var mesh = new THREE.Mesh( geometry, textMaterial );
        //
        //     scene.add( mesh );
        //     mesh.position.set(v.x, v.y, v.z+1);
        // } );


        params.sphericalize && sphericalizeVertices( vertices );

        var verticeGeometry, verticeMaterial, vertice;
        var scapegoat;
        vertices.forEach( function(v, i) {
            v.multiplyScalar(2);
            if (polytope.last_cell_vertice_indexes.includes(i)) {
                verticeGeometry = new THREE.SphereGeometry( 0.11, 12, 12 );
            } else {
                verticeGeometry = new THREE.SphereGeometry( 0.2, 12, 12 );
            }
            verticeMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );
            vertice = new THREE.Mesh( verticeGeometry, verticeMaterial );
            scene.add(vertice);
            vertice.position.set(v.x, v.y, v.z);

        });
    }

    // First cube
    createTubeEdge( [vertices[0], vertices[3]] );
    createTubeEdge( [vertices[0], vertices[4]] );
    createTubeEdge( [vertices[3], vertices[2]] );
    createTubeEdge( [vertices[3], vertices[7]] );
    createTubeEdge( [vertices[6], vertices[2]] );
    createTubeEdge( [vertices[6], vertices[5]] );
    createTubeEdge( [vertices[6], vertices[7]] );
    createTubeEdge( [vertices[4], vertices[5]] );
    createTubeEdge( [vertices[4], vertices[7]] );
    createTubeEdge( [vertices[1], vertices[0]] );
    createTubeEdge( [vertices[1], vertices[2]] );
    createTubeEdge( [vertices[1], vertices[5]] );

    // Towards side
    createTubeEdge( [vertices[5], vertices[13]], 'dec' );
    createTubeEdge( [vertices[1], vertices[9]], 'dec' );
    createTubeEdge( [vertices[2], vertices[10]], 'dec' );
    createTubeEdge( [vertices[3], vertices[11]], 'dec' );
    createTubeEdge( [vertices[6], vertices[14]], 'dec' );
    createTubeEdge( [vertices[4], vertices[12]], 'dec' );
    createTubeEdge( [vertices[7], vertices[15]], 'dec' );
    createTubeEdge( [vertices[0], vertices[8]], 'dec' );
    createTubeEdge( [vertices[13], vertices[14]], 'dec' );

    // Last cube
    createTubeEdge( [vertices[8], vertices[12]], 'red' );
    createTubeEdge( [vertices[15], vertices[11]], 'red' );
    createTubeEdge( [vertices[10], vertices[14]], 'red' );
    createTubeEdge( [vertices[13], vertices[12]], 'red' );
    createTubeEdge( [vertices[10], vertices[11]], 'red' );
    createTubeEdge( [vertices[15], vertices[14]], 'red' );
    createTubeEdge( [vertices[15], vertices[12]], 'red' );
    createTubeEdge( [vertices[9], vertices[13]], 'red' );
    createTubeEdge( [vertices[9], vertices[8]], 'red' );
    createTubeEdge( [vertices[8], vertices[11]], 'red' );
    createTubeEdge( [vertices[10], vertices[9]], 'red' );


    generateVertices();

}
