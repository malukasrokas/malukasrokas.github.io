initializeScene();

addNorthPole();

if ( !params.rotate ) {
    sphericalizeObject( cube );
    addPlaneShape( cube );
    cube.position.z = 1;
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
