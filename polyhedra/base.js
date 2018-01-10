initializeScene();

// addNorthPole();

if ( !params.rotate ) {
    // cube.addToScene();
    // scene.add( sphere );
    // scene.add( plane );
    // scene.add( sphere );
    current_polytope = hypercube;
    buildPolyheroid( current_polytope );
}



// Rendering
var animate = function () {
    requestAnimationFrame( animate );

    params.rotate && rotationDegree++;
    params.rotate && rotateObject( cube );
    params.rotate && params.sphereWireframe && rotateObject( sphere );

    renderer.render( scene, camera );
};

animate();
