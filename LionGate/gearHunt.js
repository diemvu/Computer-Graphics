//  build the object, including geometry (triangle vertices)
//  and possibly colors and normals for each vertex
function huntGear(numTeeth, numSpokes) {
    const vertices = [];
    const colors = [];
    const normals = [];


////////////////////////////
// Making gear triangles

   var n = numTeeth;
   var spokes = numSpokes;
   var rad = 1.0;
   var outRad = rad * 1.2;
   var angInc = 2*3.14159/n;
   var ang = 0;
   var z = 0.1;

   // An n-sized array corresponding to spoke positions
   var spokePosition = getSpokePositions(numTeeth, numSpokes);

   // The factor used to shrink the roofs of the teeth
   var shrink = 2;

   // Opposite direction of outRad
   var backRad = rad * 0.8;

   var i;       //  coin face, front
   for (i = 0; i < n; i++) {
         if (spokePosition[i]) {
         vertices.push(0,0,z,
                       rad*Math.cos(ang) / 2,rad*Math.sin(ang) / 2,z,
                       rad*Math.cos(ang+angInc) / 2,rad*Math.sin(ang+angInc) / 2,z)
         } else {
         vertices.push(0,0,z,
                       rad*Math.cos(ang),rad*Math.sin(ang),z,
                       rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),z)
         }

         colors.push(0.72,0.45,0.2, 0.72,0.45,0.2, 0.72,0.45,0.2);
         normals.push(0,0,1, 0,0,1, 0,0,1);
         ang += angInc;

   }

   // Coin face, back
   ang = 0;
   for (i = 0; i < n; i++) {
         //var mat = new Learn_webgl_matrix();
         //var rotateMat =  mat.create();
         //mat.rotate(rotateMat, 180, 0,1,0);

         //var vec4 = new Learn_webgl_point4();
         //var v1 = vec4.create(0,0,z);

         if (spokePosition[i]) {
         vertices.push(0,0,-z,
                       rad*Math.cos(ang) / 2,rad*Math.sin(ang) / 2,-z,
                       rad*Math.cos(ang+angInc) / 2,rad*Math.sin(ang+angInc) / 2,-z);
         } else {
         vertices.push(0,0,-z,
                       rad*Math.cos(ang),rad*Math.sin(ang),-z,
                       rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),-z);
         }

         //var newV1 = vec4.create();
         //mat.multiplyP4(newV1,rotateMat,v1);

         //var newV2 = vec4.create();
         //mat.multiplyP4(newV2,rotateMat,v2);

         //var newV3 = vec4.create();
         //mat.multiplyP4(newV3,rotateMat,v3);


         //vertices.push(  newV1[0], newV1[1], newV1[2],
         //                newV2[0], newV2[1], newV2[2],
         //                newV3[0], newV3[1], newV3[2]
         //              )

         colors.push( 0.72,0.45,0.2,  0.72,0.45,0.2,  0.72,0.45,0.2);
         //colors.push( 1,0,0,  0,1,0,  0,0,1);
         /// AND WE COULD HAVE ROTATED THE NORMALS
         normals.push(0,0,-1, 0,0,-1, 0,0,-1);
         ang += angInc;
   }

   var r;
   for (r = 0; r < 2; r++) {
        ang = 0;
        var drawTooth = false;

        for ( i = 0; i < n; i++) {       // face of the teeth

	         drawTooth = !drawTooth;
	         if (drawTooth) {

                 vertices.push(rad*Math.cos(ang), rad*Math.sin(ang), z,
                               rad*Math.cos(ang+angInc), rad*Math.sin(ang+angInc), z,
                               outRad*Math.cos(ang+angInc), outRad*Math.sin(ang+angInc), z / shrink)

                 colors.push( 0.72,0.45,0.2,  0.72,0.45,0.2,  0.72,0.45,0.2);

                 if (z > 0)
                      normals.push(0,0,1, 0,0,1, 0,0,1  );
                 else
                      normals.push(0,0,-1, 0,0,-1, 0,0,-1  );

                 vertices.push(rad*Math.cos(ang), rad*Math.sin(ang), z,
                               outRad*Math.cos(ang+angInc), outRad*Math.sin(ang+angInc), z / shrink,
                               outRad*Math.cos(ang), outRad*Math.sin(ang), z / shrink);


                 colors.push( 0.72,0.45,0.2,  0.72,0.45,0.2,  0.72,0.45,0.2);

                 if (z > 0)
                      normals.push(0,0,1, 0,0,1, 0,0,1  );
                 else
                      normals.push(0,0,-1, 0,0,-1, 0,0,-1  );

		     }
	         ang += angInc;
        }
        z = -z;
   }

 //  z = -z;  BUG 1

   var r;
   for (r = 0; r < 2; r++) {
        ang = 0;

        // Face of the edge
        for ( i = 0; i < n; i++) {
	         if (spokePosition[i]) {

                 vertices.push(rad*Math.cos(ang), rad*Math.sin(ang), z,
                               rad*Math.cos(ang+angInc), rad*Math.sin(ang+angInc), z,
                               backRad*Math.cos(ang+angInc), backRad*Math.sin(ang+angInc), z)

                 colors.push( 0.72,0.45,0.2,  0.72,0.45,0.2,  0.72,0.45,0.2);

                 if (z > 0)
                      normals.push(0,0,1, 0,0,1, 0,0,1  );
                 else
                      normals.push(0,0,-1, 0,0,-1, 0,0,-1  );

                 vertices.push(rad*Math.cos(ang), rad*Math.sin(ang), z,
                               backRad*Math.cos(ang+angInc), backRad*Math.sin(ang+angInc), z,
                               backRad*Math.cos(ang), backRad*Math.sin(ang), z);


                 colors.push( 0.72,0.45,0.2,  0.72,0.45,0.2,  0.72,0.45,0.2);

                 if (z > 0)
                      normals.push(0,0,1, 0,0,1, 0,0,1  );
                 else
                      normals.push(0,0,-1, 0,0,-1, 0,0,-1  );

		     }
	         ang += angInc;
        }
        z = -z;
   }

   // Underside of the edge
   ang = 0;
   for (i = 0; i < n; i++) {
	    var norm = [rad*Math.cos(ang+angInc/2),rad*Math.sin(ang+angInc/2),0];
        if (spokePosition[i]) {
        vertices.push(
               backRad*Math.cos(ang),backRad*Math.sin(ang),-z,
               backRad*Math.cos(ang+angInc),backRad*Math.sin(ang+angInc),-z,
               backRad*Math.cos(ang+angInc),backRad*Math.sin(ang+angInc),z)

        colors.push(0.72,0.45,0.2, 0.72,0.45,0.2, 0.72,0.45,0.2)
        normals.push(-norm[0],-norm[1],norm[2], -norm[0],-norm[1],norm[2], -norm[0],-norm[1],norm[2])

        vertices.push(
               backRad*Math.cos(ang),backRad*Math.sin(ang),-z,
               backRad*Math.cos(ang+angInc),backRad*Math.sin(ang+angInc),z,
               backRad*Math.cos(ang),backRad*Math.sin(ang),z)

        colors.push( 0.72,0.45,0.2, 0.72,0.45,0.2, 0.72,0.45,0.2)
        normals.push(-norm[0],-norm[1],norm[2], -norm[0],-norm[1],norm[2], -norm[0],-norm[1],norm[2])

        vertices.push(
               rad*Math.cos(ang) / shrink,rad*Math.sin(ang) / shrink,-z,
               rad*Math.cos(ang+angInc) / shrink,rad*Math.sin(ang+angInc) / shrink,-z,
               rad*Math.cos(ang+angInc) / shrink,rad*Math.sin(ang+angInc) / shrink,z)

        colors.push(0.72,0.45,0.2, 0.72,0.45,0.2, 0.72,0.45,0.2)
        normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])

        vertices.push(
               rad*Math.cos(ang) / shrink,rad*Math.sin(ang) / shrink,-z,
               rad*Math.cos(ang+angInc) / shrink,rad*Math.sin(ang+angInc) / shrink,z,
               rad*Math.cos(ang) / shrink,rad*Math.sin(ang) / shrink,z)

        colors.push( 0.72,0.45,0.2, 0.72,0.45,0.2, 0.72,0.45,0.2)
        normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])
        }
	    ang += angInc;
   }


   ang = 0;                          // coin edge
   var drawTooth = true;
   for (i = 0; i < n; i++) {
        drawTooth = !drawTooth;
	    var norm = [rad*Math.cos(ang+angInc/2),rad*Math.sin(ang+angInc/2),0];
        if (drawTooth) {
        vertices.push(
               rad*Math.cos(ang),rad*Math.sin(ang),-z,
               rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),-z,
               rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),z)

        colors.push( 0.72,0.45,0.2, 0.72,0.45,0.2, 0.72,0.45,0.2)
        normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])

        vertices.push(
               rad*Math.cos(ang),rad*Math.sin(ang),-z,
               rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),z,
               rad*Math.cos(ang),rad*Math.sin(ang),z)

        colors.push( 0.72,0.45,0.2, 0.72,0.45,0.2, 0.72,0.45,0.2)
        normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])
        }

	    ang += angInc;
   }


 ang = 0;
   drawTooth = false;     // tooth roof
   for (i = 0; i < n; i++) {
	    drawTooth = !drawTooth;
	    if (drawTooth) {

        var norm = [outRad*Math.cos(ang+angInc/2),outRad*Math.sin(ang+angInc/2),0];
        vertices.push(
              outRad*Math.cos(ang),outRad*Math.sin(ang),-z / shrink,
              outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),-z / shrink,
              outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),z / shrink)

        colors.push( 0.72,0.45,0.2, 0.72,0.45,0.2, 0.72,0.45,0.2)
        normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])

        vertices.push(
              outRad*Math.cos(ang),outRad*Math.sin(ang),-z / shrink,
              outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),z / shrink,
              outRad*Math.cos(ang),outRad*Math.sin(ang),z / shrink)

        colors.push( 0.72,0.45,0.2, 0.72,0.45,0.2, 0.72,0.45,0.2)
        normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])

		}
	    ang += angInc;
   }


   // Spoke walls
   for ( i = 0; i < n; i++) {
           if (isSpokeWall(spokePosition, i)) {
           var norm = calcNormal(rad*Math.cos(ang) / 2, rad*Math.sin(ang) / 2,-z,
		                 backRad*Math.cos(ang),backRad*Math.sin(ang),-z,
		                 backRad*Math.cos(ang),backRad*Math.sin(ang),z);

           vertices.push(
               rad*Math.cos(ang) / 2,rad*Math.sin(ang) / 2,-z,
               backRad*Math.cos(ang),backRad*Math.sin(ang),-z,
               backRad*Math.cos(ang),backRad*Math.sin(ang),z)
           colors.push( 0.72,0.45,0.2, 0.72,0.45,0.2, 0.72,0.45,0.2)


           vertices.push(
               rad*Math.cos(ang) / 2,rad*Math.sin(ang) / 2,-z,
               backRad*Math.cos(ang),backRad*Math.sin(ang),z,
               rad*Math.cos(ang) / 2,rad*Math.sin(ang) / 2,z)
           colors.push( 0.72,0.45,0.2, 0.72,0.45,0.2, 0.72,0.45,0.2)

           if (spokePosition[i]) {
           normals.push(-norm[0],-norm[1],-norm[2], -norm[0],-norm[1],-norm[2], -norm[0],-norm[1],-norm[2])
           normals.push(-norm[0],-norm[1],-norm[2], -norm[0],-norm[1],-norm[2], -norm[0],-norm[1],-norm[2])
           } else {
           normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])
           normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])
           }

/*
           var norm = calcNormal( rad*Math.cos(ang+angInc), rad*Math.sin(ang+angInc),-z,
                                   outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),-z / shrink,
			                        outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),z / shrink
				                    );

           vertices.push(
               rad*Math.cos(ang+angInc),   rad*Math.sin(ang+angInc),-z,
               outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),-z / shrink,
               outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),z / shrink)
           colors.push( 0.72,0.45,0.2, 0.72,0.45,0.2, 0.72,0.45,0.2)
           normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])


           vertices.push(
               rad*Math.cos(ang+angInc),   rad*Math.sin(ang+angInc),-z,
               outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),z / shrink,
               rad*Math.cos(ang+angInc),   rad*Math.sin(ang+angInc),z)
           colors.push( 0.72,0.45,0.2, 0.72,0.45,0.2, 0.72,0.45,0.2)
           normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])
*/
		}
	    ang += angInc;
   }

   ang = 0;

   drawTooth = false;
   for ( i = 0; i < n; i++) {   // tooth walls
	    drawTooth = !drawTooth;
	    if (drawTooth) {


           // BUG 3   norm vs. normal
		   var norm = calcNormal( rad*Math.cos(ang), rad*Math.sin(ang),-z,
		                          outRad*Math.cos(ang),outRad*Math.sin(ang),-z / shrink,
		                            outRad*Math.cos(ang),outRad*Math.sin(ang),z / shrink

				                    );

           vertices.push(
               rad*Math.cos(ang),   rad*Math.sin(ang),-z,
               outRad*Math.cos(ang),outRad*Math.sin(ang),-z / shrink,
               outRad*Math.cos(ang),outRad*Math.sin(ang),z / shrink)
           colors.push( 0.72,0.45,0.2, 0.72,0.45,0.2, 0.72,0.45,0.2)
           normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])


           vertices.push(
               rad*Math.cos(ang),   rad*Math.sin(ang),-z,
               outRad*Math.cos(ang),outRad*Math.sin(ang),z/ shrink,
               rad*Math.cos(ang),   rad*Math.sin(ang),z)
           colors.push( 0.72,0.45,0.2, 0.72,0.45,0.2, 0.72,0.45,0.2)
           normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])



           var norm = calcNormal( rad*Math.cos(ang+angInc), rad*Math.sin(ang+angInc),-z,
                                   outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),-z / shrink,
			                        outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),z / shrink
				                    );

           vertices.push(
               rad*Math.cos(ang+angInc),   rad*Math.sin(ang+angInc),-z,
               outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),-z / shrink,
               outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),z / shrink)
           colors.push( 0.72,0.45,0.2, 0.72,0.45,0.2, 0.72,0.45,0.2)
           normals.push(-norm[0],-norm[1],-norm[2], -norm[0],-norm[1],-norm[2], -norm[0],-norm[1],-norm[2])


           vertices.push(
               rad*Math.cos(ang+angInc),   rad*Math.sin(ang+angInc),-z,
               outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),z / shrink,
               rad*Math.cos(ang+angInc),   rad*Math.sin(ang+angInc),z)
           colors.push( 0.72,0.45,0.2, 0.72,0.45,0.2, 0.72,0.45,0.2)
           normals.push(-norm[0],-norm[1],-norm[2], -norm[0],-norm[1],-norm[2], -norm[0],-norm[1],-norm[2])


		}
	    ang += angInc;
   }










    return [vertices,colors,normals]
}





// Returns an array with a true or false value (indicating whether or not a position is
// a spoke hole) for each section of the gear
function getSpokePositions(numTeeth, numSpokes) {
    var  spokePositions = [];
    var interval = Math.floor(numTeeth / numSpokes);
    var spokeWidth = interval - 3;
    var counter = spokeWidth;
    var i;
    for (i = 0; i < numTeeth; i++) {
        if (counter > 0) {
            spokePositions.push(true);
            counter--;
        } else if (counter > -3) {
            spokePositions.push(false);
            counter--;
        } else {
            counter = spokeWidth;
            i--;
        }
    }
    return spokePositions;
}

/*
// Checks whether or not the given position is a spoke hole position
function isSpoke(i) {
    return (i >= 5 && i <= 14) || (i >= 20 && i <= 27) || (i >= 32 && i <= 39);
}
*/

// Checks whether or not the given position is a spoke wall
function isSpokeWall(spokePosition, i) {
    if (i == 0) {
        return (!spokePosition[spokePosition.length - 1] && spokePosition[i]);
    } else {
        return (!spokePosition[i - 1] && spokePosition[i]) || (spokePosition[i - 1] && !spokePosition[i]);
    }
}

function calcNormal(x1, y1,  z1,
                    x2,  y2,  z2,
                    x3,  y3,  z3) {

    var ux = x2-x1, uy = y2-y1, uz = z2-z1;
    var vx = x3-x1, vy = y3-y1, vz = z3-z1;

    return [ uy * vz - uz * vy,
             uz * vx - ux * vz,
             ux * vy - uy * vx];
}
