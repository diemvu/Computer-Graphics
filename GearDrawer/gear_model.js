//  build the object, including geometry (triangle vertices)
//  and possibly colors and normals for each vertex
function creatediemVuGear(numTeeth, numSpokes) {
    const vertices = [];
    const colors = [];
    const normals = [];


////////////////////////////
// Making gear triangles

   var n = numTeeth *2;
   var rad = 1.0;
   var innerRad = 0.85;
   var smallRad= 0.4;
   var outRad = rad * 1.2;
   var angInc = 2*3.14159/n;
   var ang = 0;
   var z = 0.1;
   var red = 0.8314;
   var green = 0.6863;
   var blue = 0.2157;
   var zTeeth = 0.05;
   var strokeWidth = 0.15 * 4/numSpokes;
   var height = 0.3;

   var i;       //  coin face, front


/*
   ang = 0;   // coin face, back
   for (i = 0; i < n; i++) {

         vertices.push(0,0,-z,
                       rad*Math.cos(ang),rad*Math.sin(ang),-z,
                       rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),-z)

         colors.push( 0.5,0.5,0.5,  0.5,0.5,0.5,  0.5,0.5,0.5);
         normals.push(0,0,-1, 0,0,-1, 0,0,-1  );
         ang += angInc;
   }

*/
for (i = 0; i < n; i++) {

      vertices.push(0,0,z,
                    smallRad*Math.cos(ang),smallRad*Math.sin(ang),z,
                    smallRad*Math.cos(ang+angInc),smallRad*Math.sin(ang+angInc),z)

      colors.push( 0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157);
      //colors.push( 1,0,0,  0,1,0,  0,0,1);
      normals.push(0,0,1, 0,0,1, 0,0,1  );
      ang += angInc;
}

ang = 0;
for (i = 0; i < n; i++) {


      var mat = new Learn_webgl_matrix();
      var rotateMat =  mat.create();
      mat.rotate(rotateMat, 180, 0,1,0);

      var vec4 = new Learn_webgl_point4();
      var v1 = vec4.create(0,0,z);
      var v2 = vec4.create(smallRad*Math.cos(ang),smallRad*Math.sin(ang),z);
      var v3 = vec4.create(smallRad*Math.cos(ang+angInc),smallRad*Math.sin(ang+angInc),z);

      var newV1 = vec4.create();
      mat.multiplyP4(newV1,rotateMat,v1);

      var newV2 = vec4.create();
      mat.multiplyP4(newV2,rotateMat,v2);

      var newV3 = vec4.create();
      mat.multiplyP4(newV3,rotateMat,v3);


      vertices.push(  newV1[0], newV1[1], newV1[2],
                      newV2[0], newV2[1], newV2[2],
                      newV3[0], newV3[1], newV3[2]
                    )

      colors.push(  0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157);
      //colors.push( 1,0,0,  0,1,0,  0,0,1);
      /// AND WE COULD HAVE ROTATED THE NORMALS
      normals.push(0,0,-1, 0,0,-1, 0,0,-1  );
      ang += angInc;
}


   var r;
   for (r = 0; r < 2; r++) {
        ang = 0;
        var drawTooth = false;

        for ( i = 0; i < n; i++) {       // face of the teeth
	         drawTooth = !drawTooth;
           var norm;
	         if (drawTooth) {

                 vertices.push(rad*Math.cos(ang), rad*Math.sin(ang), z,
                               rad*Math.cos(ang+angInc), rad*Math.sin(ang+angInc), z,
                               outRad*Math.cos(ang+angInc), outRad*Math.sin(ang+angInc), zTeeth);
                 colors.push(0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157)
                if (z> 0){
                  norm = calcNormal(outRad*Math.cos(ang+angInc), outRad*Math.sin(ang+angInc), zTeeth,
                                     rad*Math.cos(ang+angInc), rad*Math.sin(ang+angInc), z,
                                     rad*Math.cos(ang), rad*Math.sin(ang), z  );
                } else{
                  norm = calcNormal(rad*Math.cos(ang), rad*Math.sin(ang), z,
                                             rad*Math.cos(ang+angInc), rad*Math.sin(ang+angInc), z,
                                             outRad*Math.cos(ang+angInc), outRad*Math.sin(ang+angInc), zTeeth);
                }

                normals.push(norm[0],norm[1],norm[2],norm[0],norm[1],norm[2],norm[0],norm[1],norm[2] );

                 vertices.push(rad*Math.cos(ang), rad*Math.sin(ang), z,
                               outRad*Math.cos(ang+angInc), outRad*Math.sin(ang+angInc), zTeeth,
                               outRad*Math.cos(ang), outRad*Math.sin(ang), zTeeth);


                 colors.push(0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157)
                 //
                 // if (z> 0){
                 //   normals.push(0,0,1,0,0,1,0,0,1);
                 // } else{
                 //   normals.push(0,0,-1,0,0,-1,0,0,-1);
                 // }
                 normals.push(norm[0],norm[1],norm[2],norm[0],norm[1],norm[2],norm[0],norm[1],norm[2] );


		     }
	         ang += angInc;
        }
        z = -z;
        zTeeth = -zTeeth;
   }


 //  z = -z;  BUG 1




   ang = 0;                          // ring outer edge
   var drawTooth = true;
   for (i = 0; i < n; i++) {
        drawTooth = !drawTooth;
	    var norm = [rad*Math.cos(ang+angInc/2),rad*Math.sin(ang+angInc/2),0];
        if (drawTooth) {

        vertices.push(
               rad*Math.cos(ang),rad*Math.sin(ang),-z,
               rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),-z,
               rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),z)

        colors.push(0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157)
        normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])

        vertices.push(
               rad*Math.cos(ang),rad*Math.sin(ang),-z,
               rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),z,
               rad*Math.cos(ang),rad*Math.sin(ang),z)

        colors.push(0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157)
        normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])
        }

	    ang += angInc;
   }

   ang = 0;                          //small  coin edge
   var drawTooth = true;
   for (i = 0; i < n; i++) {
        // drawTooth = !drawTooth;
	    var norm = [smallRad*Math.cos(ang+angInc/2),smallRad*Math.sin(ang+angInc/2),0];
        if (drawTooth) {

        vertices.push(
               smallRad*Math.cos(ang),smallRad*Math.sin(ang),-z,
               smallRad*Math.cos(ang+angInc),smallRad*Math.sin(ang+angInc),-z,
               smallRad*Math.cos(ang+angInc),smallRad*Math.sin(ang+angInc),z)

        colors.push(0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157)
        normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])

        vertices.push(
               smallRad*Math.cos(ang),smallRad*Math.sin(ang),-z,
               smallRad*Math.cos(ang+angInc),smallRad*Math.sin(ang+angInc),z,
               smallRad*Math.cos(ang),smallRad*Math.sin(ang),z)

        colors.push(0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157)
        normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])
        }

	    ang += angInc;
   }



   ang = 0;                          //ring inner edge
   var drawTooth = true;
   for (i = 0; i < n; i++) {
        // drawTooth = !drawTooth;
	    var norm = [innerRad*Math.cos(ang+angInc/2),innerRad*Math.sin(ang+angInc/2),0];
        if (drawTooth) {

        vertices.push(
               innerRad*Math.cos(ang),innerRad*Math.sin(ang),-z,
               innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),-z,
               innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),z)

        colors.push(0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157)
        normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])

        vertices.push(
               innerRad*Math.cos(ang),innerRad*Math.sin(ang),-z,
               innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),z,
               innerRad*Math.cos(ang),innerRad*Math.sin(ang),z)

        colors.push(0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157)
        normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])
        }

	    ang += angInc;
   }


   ang = 0;                          //ring face
   var drawTooth = true;
   for (i = 0; i < n; i++) {
        // drawTooth = !drawTooth;


        vertices.push(innerRad*Math.cos(ang),innerRad*Math.sin(ang),z,
                      rad*Math.cos(ang),rad*Math.sin(ang),z,
                      innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),z);

        colors.push( 0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157);
        //colors.push( 1,0,0,  0,1,0,  0,0,1);
        normals.push(0,0,1, 0,0,1, 0,0,1  );

        vertices.push(rad*Math.cos(ang + angInc),rad*Math.sin(ang + angInc),z,
                      rad*Math.cos(ang),rad*Math.sin(ang),z,
                      innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),z);

        colors.push( 0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157);
        //colors.push( 1,0,0,  0,1,0,  0,0,1);
        normals.push(0,0,1, 0,0,1, 0,0,1  );
        ang += angInc;
   }
   ang =0;
   for (i = 0; i < n; i++) {


         var mat = new Learn_webgl_matrix();
         var rotateMat =  mat.create();
         mat.rotate(rotateMat, 180, 0,1,0);

         var vec4 = new Learn_webgl_point4();
         var v1 = vec4.create(innerRad*Math.cos(ang),innerRad*Math.sin(ang),z);
         var v2 = vec4.create(rad*Math.cos(ang),rad*Math.sin(ang),z);
         var v3 = vec4.create(innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),z);



         var newV1 = vec4.create();
         mat.multiplyP4(newV1,rotateMat,v1);

         var newV2 = vec4.create();
         mat.multiplyP4(newV2,rotateMat,v2);

         var newV3 = vec4.create();
         mat.multiplyP4(newV3,rotateMat,v3);


         vertices.push(  newV1[0], newV1[1], newV1[2],
                         newV2[0], newV2[1], newV2[2],
                         newV3[0], newV3[1], newV3[2]
                       )

         colors.push(  0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157);
         //colors.push( 1,0,0,  0,1,0,  0,0,1);
         /// AND WE COULD HAVE ROTATED THE NORMALS
         normals.push(0,0,-1, 0,0,-1, 0,0,-1  );
         ang += angInc;
   }









   ang =0;
   for (i = 0; i < n; i++) {


         var mat = new Learn_webgl_matrix();
         var rotateMat =  mat.create();
         mat.rotate(rotateMat, 180, 0,1,0);

         var vec4 = new Learn_webgl_point4();
         var v1 = vec4.create(rad*Math.cos(ang + angInc),rad*Math.sin(ang + angInc),z);
         var v2 = vec4.create(rad*Math.cos(ang),rad*Math.sin(ang),z);
         var v3 = vec4.create(innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),z);



         var newV1 = vec4.create();
         mat.multiplyP4(newV1,rotateMat,v1);

         var newV2 = vec4.create();
         mat.multiplyP4(newV2,rotateMat,v2);

         var newV3 = vec4.create();
         mat.multiplyP4(newV3,rotateMat,v3);


         vertices.push(  newV1[0], newV1[1], newV1[2],
                         newV2[0], newV2[1], newV2[2],
                         newV3[0], newV3[1], newV3[2]
                       )

         colors.push(  0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157);
         //colors.push( 1,0,0,  0,1,0,  0,0,1);
         /// AND WE COULD HAVE ROTATED THE NORMALS
         normals.push(0,0,-1, 0,0,-1, 0,0,-1  );
         ang += angInc;
   }


  // done with ring











 ang = 0;
   drawTooth = false;     // tooth roof
   for (i = 0; i < n; i++) {
	    drawTooth = !drawTooth;
	    if (drawTooth) {

        var norm = [outRad*Math.cos(ang+angInc/2),outRad*Math.sin(ang+angInc/2),0];
        vertices.push(
              outRad*Math.cos(ang),outRad*Math.sin(ang),-zTeeth,
              outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),-zTeeth,
              outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),zTeeth)

        colors.push(0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157)
        normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])

        vertices.push(
              outRad*Math.cos(ang),outRad*Math.sin(ang),-zTeeth,
              outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),zTeeth,
              outRad*Math.cos(ang),outRad*Math.sin(ang),zTeeth)

        colors.push(0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157)
        normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])

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
		                          outRad*Math.cos(ang),outRad*Math.sin(ang),-zTeeth,
		                            outRad*Math.cos(ang),outRad*Math.sin(ang),zTeeth

				                    );

           vertices.push(
               rad*Math.cos(ang),   rad*Math.sin(ang),-z,
               outRad*Math.cos(ang),outRad*Math.sin(ang),-zTeeth,
               outRad*Math.cos(ang),outRad*Math.sin(ang),zTeeth)
           colors.push(0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157)
           normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])


           vertices.push(
               rad*Math.cos(ang),   rad*Math.sin(ang),-z,
               outRad*Math.cos(ang),outRad*Math.sin(ang),zTeeth,
               rad*Math.cos(ang),   rad*Math.sin(ang),z)
           colors.push(0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157)
           normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])



           var norm = calcNormal( rad*Math.cos(ang+angInc), rad*Math.sin(ang+angInc),-z,
                                   outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),zTeeth,
			                        outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),-zTeeth
				                    );

           vertices.push(
               rad*Math.cos(ang+angInc),   rad*Math.sin(ang+angInc),-z,
               outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),-zTeeth,
               outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),zTeeth)
           colors.push(0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157)
           normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])


           vertices.push(
               rad*Math.cos(ang+angInc),   rad*Math.sin(ang+angInc),-z,
               outRad*Math.cos(ang+angInc),outRad*Math.sin(ang+angInc),zTeeth,
               rad*Math.cos(ang+angInc),   rad*Math.sin(ang+angInc),z)
           colors.push(0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157)
           normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])


		}
	    ang += angInc;
   }

   // STROKES
//face

for ( i = 0; i<numSpokes; i++){
   var mat = new Learn_webgl_matrix();
   var rotateMat =  mat.create();
   mat.rotate(rotateMat, 360/numSpokes*i, 0,0,1);

   var vec4 = new Learn_webgl_point4();
   var v1 = vec4.create(-strokeWidth,   innerRad,z);
   var v2 = vec4.create(-strokeWidth,height,z);
   var v3 = vec4.create(strokeWidth,   height,z);

   var v4 = vec4.create(-strokeWidth,   innerRad,-z);
   var v5 = vec4.create(-strokeWidth,height,-z);
   var v6 = vec4.create(strokeWidth,   height,-z);

   var newV1 = vec4.create();
   mat.multiplyP4(newV1,rotateMat,v1);

   var newV2 = vec4.create();
   mat.multiplyP4(newV2,rotateMat,v2);

   var newV3 = vec4.create();
   mat.multiplyP4(newV3,rotateMat,v3);

   var newV4 = vec4.create();
   mat.multiplyP4(newV4,rotateMat,v4);

   var newV5 = vec4.create();
   mat.multiplyP4(newV5,rotateMat,v5);

   var newV6 = vec4.create();
   mat.multiplyP4(newV6,rotateMat,v6);


   vertices.push(  newV1[0], newV1[1], newV1[2],
                   newV2[0], newV2[1], newV2[2],
                   newV3[0], newV3[1], newV3[2]
                 )

   colors.push(  0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157);
   //colors.push( 1,0,0,  0,1,0,  0,0,1);
   /// AND WE COULD HAVE ROTATED THE NORMALS
   normals.push(0,0,1, 0,0,1, 0,0,1  );

   vertices.push(  newV4[0], newV4[1], newV4[2],
                   newV5[0], newV5[1], newV5[2],
                   newV6[0], newV6[1], newV6[2]
                 )

   colors.push(  0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157);
   //colors.push( 1,0,0,  0,1,0,  0,0,1);
   /// AND WE COULD HAVE ROTATED THE NORMALS
   normals.push(0,0,-1, 0,0,-1, 0,0,-1  );




 }
 /// face

 for ( i = 0; i<numSpokes; i++){
    var mat = new Learn_webgl_matrix();
    var rotateMat =  mat.create();
    mat.rotate(rotateMat, 360/numSpokes*i, 0,0,1);

    var vec4 = new Learn_webgl_point4();
    var v1 = vec4.create(strokeWidth,   innerRad,z);
    var v2 = vec4.create(-strokeWidth,innerRad,z);
    var v3 = vec4.create(strokeWidth,   height,z);

    var v4 = vec4.create(strokeWidth,   innerRad,-z);
    var v5 = vec4.create(-strokeWidth,innerRad,-z);
    var v6 = vec4.create(strokeWidth,   height,-z);

    var newV1 = vec4.create();
    mat.multiplyP4(newV1,rotateMat,v1);

    var newV2 = vec4.create();
    mat.multiplyP4(newV2,rotateMat,v2);

    var newV3 = vec4.create();
    mat.multiplyP4(newV3,rotateMat,v3);

    var newV4 = vec4.create();
    mat.multiplyP4(newV4,rotateMat,v4);

    var newV5 = vec4.create();
    mat.multiplyP4(newV5,rotateMat,v5);

    var newV6 = vec4.create();
    mat.multiplyP4(newV6,rotateMat,v6);


    vertices.push(  newV1[0], newV1[1], newV1[2],
                    newV2[0], newV2[1], newV2[2],
                    newV3[0], newV3[1], newV3[2]
                  )

    colors.push(  0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157);
    //colors.push( 1,0,0,  0,1,0,  0,0,1);
    /// AND WE COULD HAVE ROTATED THE NORMALS
    normals.push(0,0,1, 0,0,1, 0,0,1  );

    vertices.push(  newV4[0], newV4[1], newV4[2],
                    newV5[0], newV5[1], newV5[2],
                    newV6[0], newV6[1], newV6[2]
                  )

    colors.push(  0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157);
    //colors.push( 1,0,0,  0,1,0,  0,0,1);
    /// AND WE COULD HAVE ROTATED THE NORMALS
    normals.push(0,0,-1, 0,0,-1, 0,0,-1  );
  }
/// walls
for ( i = 0; i<numSpokes; i++){
   var mat = new Learn_webgl_matrix();
   var rotateMat =  mat.create();
   mat.rotate(rotateMat, 360/numSpokes*i, 0,0,1);

   var vec4 = new Learn_webgl_point4();
   var v1 = vec4.create(strokeWidth,   innerRad,z);
   var v2 = vec4.create(strokeWidth,innerRad,-z);
   var v3 = vec4.create(strokeWidth,   height,z);

   var v4 = vec4.create(strokeWidth,   innerRad,-z);
   var v5 = vec4.create(strokeWidth,height,z);
   var v6 = vec4.create(strokeWidth,   height,-z);

   var newV1 = vec4.create();
   mat.multiplyP4(newV1,rotateMat,v1);

   var newV2 = vec4.create();
   mat.multiplyP4(newV2,rotateMat,v2);

   var newV3 = vec4.create();
   mat.multiplyP4(newV3,rotateMat,v3);

   var newV4 = vec4.create();
   mat.multiplyP4(newV4,rotateMat,v4);

   var newV5 = vec4.create();
   mat.multiplyP4(newV5,rotateMat,v5);

   var newV6 = vec4.create();
   mat.multiplyP4(newV6,rotateMat,v6);


   vertices.push(  newV1[0], newV1[1], newV1[2],
                   newV2[0], newV2[1], newV2[2],
                   newV3[0], newV3[1], newV3[2]
                 )

   colors.push(  0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157);
   //colors.push( 1,0,0,  0,1,0,  0,0,1);
   /// AND WE COULD HAVE ROTATED THE NORMALS
   normals.push(1,0,0, 1,0,0, 1,0,0  );

   vertices.push(  newV4[0], newV4[1], newV4[2],
                   newV5[0], newV5[1], newV5[2],
                   newV6[0], newV6[1], newV6[2]
                 )

   colors.push(  0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157);
   //colors.push( 1,0,0,  0,1,0,  0,0,1);
   /// AND WE COULD HAVE ROTATED THE NORMALS
   normals.push(1,0,0, 1,0,0, 1,0,0  );
 }
 //walls


 for ( i = 0; i<numSpokes; i++){
    var mat = new Learn_webgl_matrix();
    var rotateMat =  mat.create();
    mat.rotate(rotateMat, 360/numSpokes*i, 0,0,1);

    var vec4 = new Learn_webgl_point4();
    var v1 = vec4.create(-strokeWidth,   innerRad,z);
    var v2 = vec4.create(-strokeWidth,innerRad,-z);
    var v3 = vec4.create(-strokeWidth,   height,z);

    var v4 = vec4.create(-strokeWidth,   innerRad,-z);
    var v5 = vec4.create(-strokeWidth,height,z);
    var v6 = vec4.create(-strokeWidth,   height,-z);

    var newV1 = vec4.create();
    mat.multiplyP4(newV1,rotateMat,v1);

    var newV2 = vec4.create();
    mat.multiplyP4(newV2,rotateMat,v2);

    var newV3 = vec4.create();
    mat.multiplyP4(newV3,rotateMat,v3);

    var newV4 = vec4.create();
    mat.multiplyP4(newV4,rotateMat,v4);

    var newV5 = vec4.create();
    mat.multiplyP4(newV5,rotateMat,v5);

    var newV6 = vec4.create();
    mat.multiplyP4(newV6,rotateMat,v6);


    vertices.push(  newV1[0], newV1[1], newV1[2],
                    newV2[0], newV2[1], newV2[2],
                    newV3[0], newV3[1], newV3[2]
                  )

    colors.push(  0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157);
    //colors.push( 1,0,0,  0,1,0,  0,0,1);
    /// AND WE COULD HAVE ROTATED THE NORMALS
    normals.push(-1,0,0, -1,0,0,- 1,0,0  );

    vertices.push(  newV4[0], newV4[1], newV4[2],
                    newV5[0], newV5[1], newV5[2],
                    newV6[0], newV6[1], newV6[2]
                  )

    colors.push(  0.8314,0.6863,0.2157,   0.8314,0.6863,0.2157,  0.8314,0.6863,0.2157);
    //colors.push( 1,0,0,  0,1,0,  0,0,1);
    /// AND WE COULD HAVE ROTATED THE NORMALS
    normals.push(-1,0,0, -1,0,0,- 1,0,0  );
  }
















    return [vertices,colors,normals]
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
