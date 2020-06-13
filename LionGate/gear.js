// Gears from Gordon MacCreary, Joey Hunt, Trent Julich,Gavin Montes, Alex Larsen



main();


function main() {

  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl', {antialias: true}  );

  // If we don't have a GL context, give up now
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }


  var angle_x = 0;
  var angle_y = 90;
  var t = 0;
  var speed = 0.1;
  var brightness = 0;
  // var angle_z = 0;


  // Vertex shader program, runs on GPU, once per vertex

  const vsSource = `
  // Fragment shader program
  precision mediump int;
  precision mediump float;

  // Scence transformations
  uniform mat4 u_PVM_transform; // Projection, view, model transform
  uniform mat4 u_VM_transform;  // View, model transform

  // Light model
  uniform vec3 u_Light_position;
  uniform vec3 u_Light_color;
  uniform float u_Shininess;
  uniform vec3 u_Ambient_color;
  uniform vec3 u_light_dir;

  //Original model data
  attribute vec3 a_vertex;
  attribute vec3 a_color;
  attribute vec3 a_vertex_normal;

  // Data coming from the vertex shader
  varying vec3 v_Vertex;
  varying vec4 v_Color;
  varying vec3 v_Normal;

  void main() {
      // Perform the model and view transformations on the vertex and pass this
      // location to the fragment shader.
      v_Vertex = vec3( u_VM_transform * vec4(a_vertex, 1.0) );

      // Perform the model and view transformations on the vertex's normal vector
      // and pass this normal vector to the fragment shader.
      v_Normal = vec3( u_VM_transform * vec4(a_vertex_normal, 0.0) );

      // Pass the vertex's color to the fragment shader.
      v_Color = vec4(a_color, 1.0);
      // Transform the location of the vertex for the rest of the graphics pipeline
      gl_Position = u_PVM_transform * vec4(a_vertex, 1.0);
  }
  `;

  // Fragment shader program, runs on GPU, once per potential pixel

  const fsSource = `
      // Fragment shader program
      precision mediump int;
      precision mediump float;

      // Light model
      uniform vec3 u_Light_position;
      uniform vec3 u_Light_color;
      uniform float u_Shininess;
      uniform vec3 u_Ambient_color;
      uniform vec3 u_light_dir;

      // Data coming from the vertex shader
      varying vec3 v_Vertex;
      varying vec4 v_Color;
      varying vec3 v_Normal;

      void main() {

        vec3 to_light;
        vec3 vertex_normal;
        vec3 reflection;
        vec3 to_camera;
        float cos_angle;
        vec3 diffuse_color;
        vec3 specular_color;
        vec3 ambient_color;
        vec3 color;

        // Calculate the ambient color as a percentage of the surface color
        ambient_color = u_Ambient_color * vec3(v_Color);

        // Calculate a vector from the fragment location to the light source
        to_light = u_Light_position - v_Vertex;
        to_light = normalize( to_light );

        // The vertex's normal vector is being interpolated across the primitive
        // which can make it un-normalized. So normalize the vertex's normal vector.
        vertex_normal = normalize( v_Normal );

        // Calculate the cosine of the angle between the vertex's normal vector
        // and the vector going to the light.
        // cos_angle = dot(vertex_normal, to_light);
        cos_angle = dot(vertex_normal, u_light_dir);
        cos_angle = clamp(cos_angle, 0.0, 1.0);

        // Scale the color of this fragment based on its angle to the light.
        diffuse_color = vec3(v_Color) * cos_angle;

        // Calculate the reflection vector
        reflection = 2.0 * dot(vertex_normal,to_light) * vertex_normal - to_light;

        // Calculate a vector from the fragment location to the camera.
        // The camera is at the origin, so negating the vertex location gives the vector
        to_camera = -1.0 * v_Vertex;

        // Calculate the cosine of the angle between the reflection vector
        // and the vector going to the camera.
        reflection = normalize( reflection );
        to_camera = normalize( to_camera );
        cos_angle = dot(reflection, to_camera);
        cos_angle = clamp(cos_angle, 0.0, 1.0);
        cos_angle = pow(cos_angle, u_Shininess);

        // The specular color is from the light source, not the object
        if (cos_angle > 0.0) {
          specular_color = u_Light_color * cos_angle;
          diffuse_color = diffuse_color * (1.0 - cos_angle);
        } else {
          specular_color = vec3(0.0, 0.0, 0.0);
        }

        color = ambient_color + diffuse_color + specular_color;

        gl_FragColor = vec4(color, v_Color.a);
      }
  `;

  // Initialize a shader program; this is where all
  // the lighting for the objects, if any, is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Tell WebGL to use our program when drawing
  gl.useProgram(shaderProgram);

  // Collect all the info needed to use the shader program.
  // Look up locations of attributes and uniforms used by
  // our shader program
  const programInfo = {
    program: shaderProgram,
    locations: {
      a_vertex: gl.getAttribLocation(shaderProgram, 'a_vertex'),
      a_color: gl.getAttribLocation(shaderProgram, 'a_color'),
      a_normal: gl.getAttribLocation(shaderProgram, 'a_vertex_normal'),
      u_PVM_transform:gl.getUniformLocation(shaderProgram, 'u_PVM_transform'),
      u_VM_transform:gl.getUniformLocation(shaderProgram, 'u_VM_transform'),
      u_light_dir: gl.getUniformLocation(shaderProgram, 'u_light_dir'),
      u_Shininess:gl.getUniformLocation(shaderProgram, 'u_Shininess'),
      u_Ambient_color:gl.getUniformLocation(shaderProgram, 'u_Ambient_color'),
      u_Light_position: gl.getUniformLocation(shaderProgram, 'u_Light_position'),
      u_Light_color: gl.getUniformLocation(shaderProgram, 'u_Light_color'),
    },
  };

//  add an event handler so we can interactively rotate the model
  document.addEventListener('keydown',

      function key_event(event) {

         if(event.keyCode == 70) {   //fast
             speed = speed + 0.05;
         } else if(event.keyCode == 83) {  //slow
             speed = speed - 0.05;
         }


         drawScene(gl, programInfo, buffersCollection, angle_x, angle_y,t,brightness);
         return false;
      })


  // build the object(s) we'll be drawing, put the data in buffers
  gearMontes = montesGear(30,30,0.85);
  gearAlex = alexGear(30, 10,1);
  gearTrent = trentGear(30,30,0.9);
  gearMontes2 = montesGear(30,30,0.85);
  gearGordon = gordonGear(30,30,1);
  gearHunt = huntGear(60,3);


  buffersCollection = {};
  buffersCollection.bufferMontes = initBuffers(gl,programInfo,gearMontes);
  buffersCollection.bufferAlex = initBuffers(gl,programInfo,gearAlex);
  buffersCollection.bufferBrittany = initBuffers(gl,programInfo,gearMontes2);
  buffersCollection.bufferGordon = initBuffers(gl,programInfo,gearGordon);
  buffersCollection.bufferTrent = initBuffers(gl,programInfo,gearTrent);
  buffersCollection.bufferHunt = initBuffers(gl,programInfo,gearHunt);



  //enableAttributes(gl,buffers,programInfo)

  // Draw the scene

  self.animate = function(){
    angle_x++;
    brightness= brightness +0.002;
    if (speed <=0){
      speed = 0.1;
    }
    t=t+speed;
    if (t> 120){
      t = 0;
      angle_y = 90;
      brightness = 0;
    }
    if (t< 0){
      t = 0;
    }

    drawScene(gl, programInfo, buffersCollection, angle_x, angle_y,t,brightness);
    requestAnimationFrame(self.animate);
  };
  animate();
  // drawScene(gl, programInfo, buffersCollection, angle_x, angle_y,t,brightness);
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple two-dimensional square.
//
function initBuffers(gl,programInfo, gearData) {


  vertices = gearData[0];
  colors = gearData[1];
  normals = gearData[2];

  // Create  buffers for the object's vertex positions
  const vertexBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Now pass the list of vertices to the GPU to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(vertices),
                gl.STATIC_DRAW);


  // do likewise for colors
  const colorBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(colors),
                gl.STATIC_DRAW);


const normalBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(normals),
                gl.STATIC_DRAW);

  return {
    // each vertex in buffer has 3 floats
    num_vertices: vertices.length / 3,
    vertex: vertexBuffer,
    color: colorBuffer,
    normal: normalBuffer
  };

}



function enableAttributes(gl,buffers,programInfo) {

    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

  // Tell WebGL how to pull vertex positions from the vertex
  // buffer. These positions will be fed into the shader program's
  // "a_vertex" attribute.

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
    gl.vertexAttribPointer(
        programInfo.locations.a_vertex,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.locations.a_vertex);


    // likewise connect the colors buffer to the "a_color" attribute
    // in the shader program
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.locations.a_color,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.locations.a_color);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
        programInfo.locations.a_normal,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.locations.a_normal);

}


//
// Draw the scene.
//
function drawScene(gl, programInfo, buffersCollection, angle_x, angle_y,t,brightness) {
  gl.clearColor(brightness, brightness, brightness, brightness);  // Clear to white, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  //make transform to implement interactive rotation

  var matrix = new Learn_webgl_matrix();

  var rotate_x_matrix = matrix.create();
  var rotate_y_matrix = matrix.create();
  var u_VM_transform = matrix.create();
  var u_PVM_transform  = matrix.create();
  var scale = matrix.create();
 matrix.scale(scale,1,1,1);

  matrix.rotate(rotate_x_matrix, angle_x, 1, 0, 0);
  matrix.rotate(rotate_y_matrix, angle_y, 0, 1, 0);

  var lookat = matrix.create();
  matrix.lookAt(lookat,0,0,5,0,0,0,0,1,0);
  var camera_location = [0,0,0];
  var constrol_points = [
                          [9,9,9],
    [5,7,5],
    [3,5,-3],
    [-5,5,-6]
                      ];

  var cp;

  function weight(t) {
    return [Math.pow(1-t,3), 3*Math.pow(1-t,2)*t, 3*(1-t)*Math.pow(t,2),Math.pow(t,3)];
  }

  weights = weight(t/100);
  for(cp = 0; cp < 4; cp++) {
    camera_location[0] += weights[cp] * constrol_points[cp][0];
    camera_location[1] += weights[cp] * constrol_points[cp][1];
    camera_location[2] += weights[cp] * constrol_points[cp][2];
  }

  matrix.lookAt(lookat,
                // 5 * Math.cos(t*Math.PI/1080),0,5* Math.sin(t*Math.PI/1080),
                camera_location[0], camera_location[1], camera_location[2],
                0,0,0,
                0,1,0
              );

  matrix.multiplySeries(u_VM_transform, lookat, rotate_x_matrix, rotate_y_matrix,scale);

  // Set the shader program's uniform
  gl.uniformMatrix4fv(programInfo.locations.u_VM_transform,
                      false, u_VM_transform);


  var proj = matrix.create();
  proj = matrix.createFrustum(-1,1,-1,1,3,1000);

  // Combine the two rotations into a single transformation
  matrix.multiplySeries(u_PVM_transform,
        proj, u_VM_transform);

  // Set the shader program's uniform
  gl.uniformMatrix4fv(programInfo.locations.u_PVM_transform,
                        false, u_PVM_transform);

  gl.uniform3f(programInfo.locations.u_light_dir, 1, 1, 1);

  var p4 = new Learn_webgl_point4();
  var light_position = p4.create(0,0,2,1);

  var light_in_camera_space = p4.create(0,0,0,0);
  matrix.multiplyP4(light_in_camera_space, lookat, light_position);

  gl.uniform3f(programInfo.locations.u_Light_position, light_in_camera_space[0],
                                                        light_in_camera_space[1],
                                                        light_in_camera_space[2]);

  gl.uniform3f(programInfo.locations.u_light_dir, 1.0, 1.0, 1.0);
  gl.uniform3f(programInfo.locations.u_Ambient_color, 0.2, 0.2, 0.2);
  gl.uniform3f(programInfo.locations.u_Light_color, 1.0, 1.0, 1.0);
  gl.uniform1f(programInfo.locations.u_Shininess, 60);

  var buffer1 = buffersCollection.bufferAlex;
  enableAttributes(gl,buffer1,programInfo);
  rotate_x_matrix = matrix.create();
  rotate_y_matrix = matrix.create();

  matrix.rotate(rotate_x_matrix, angle_x , 1, 0, 0);
  matrix.rotate(rotate_y_matrix, angle_y, 0, 1, 0);

  scale = matrix.create();
  matrix.scale(scale,0.7,0.7,0.7);
  var translate = matrix.create();
  matrix.translate(translate,0,2.55,0.55);
  matrix.multiplySeries(u_VM_transform, lookat, translate, rotate_x_matrix, rotate_y_matrix, scale);
  matrix.multiplySeries(u_PVM_transform, proj, u_VM_transform);
  gl.uniformMatrix4fv(programInfo.locations.u_VM_transform, false, u_VM_transform);
  gl.uniformMatrix4fv(programInfo.locations.u_PVM_transform, false, u_PVM_transform);
  { // now tell the shader (GPU program) to draw some triangles
    const offset = 0;
    gl.drawArrays(gl.TRIANGLES, offset, buffer1.num_vertices);
  }


  var buffer2 = buffersCollection.bufferMontes;
  enableAttributes(gl,buffer2,programInfo);
  rotate_x_matrix = matrix.create();
  rotate_y_matrix = matrix.create();

  matrix.rotate(rotate_x_matrix, angle_x, 1, 0, 0);
  matrix.rotate(rotate_y_matrix, angle_y, 0, 1, 0);
  scale = matrix.create();
  matrix.scale(scale,0.7,0.7,0.7);
  translate = matrix.create();
  matrix.translate(translate,0,1.15,1.85);
  rotate = matrix.create();
  matrix.rotate(rotate);


  matrix.multiplySeries(u_VM_transform, lookat, translate, rotate_x_matrix, rotate_y_matrix, scale);
  matrix.multiplySeries(u_PVM_transform, proj, u_VM_transform);
  gl.uniformMatrix4fv(programInfo.locations.u_VM_transform, false, u_VM_transform);
  gl.uniformMatrix4fv(programInfo.locations.u_PVM_transform, false, u_PVM_transform);
  { // now tell the shader (GPU program) to draw some triangles
    const offset = 0;
    gl.drawArrays(gl.TRIANGLES, offset, buffer2.num_vertices);
  }


  var buffer3 = buffersCollection.bufferGordon;
  enableAttributes(gl,buffer3,programInfo);
  rotate_x_matrix = matrix.create();
  rotate_y_matrix = matrix.create();

  scale = matrix.create();
  matrix.scale(scale,1,1,0.3);
  matrix.rotate(rotate_x_matrix, angle_x, 1, 0, 0);
  matrix.rotate(rotate_y_matrix, angle_y, 0, 1, 0);
  translate = matrix.create();
  matrix.translate(translate,0,1,0.4);
  matrix.multiplySeries(u_VM_transform, lookat, translate, rotate_x_matrix, rotate_y_matrix, scale);
  matrix.multiplySeries(u_PVM_transform, proj, u_VM_transform);
  gl.uniformMatrix4fv(programInfo.locations.u_VM_transform, false, u_VM_transform);
  gl.uniformMatrix4fv(programInfo.locations.u_PVM_transform, false, u_PVM_transform);
  { // now tell the shader (GPU program) to draw some triangles
    const offset = 0;
    gl.drawArrays(gl.TRIANGLES, offset, buffer3.num_vertices);
  }


  var buffer4 = buffersCollection.bufferBrittany;
  enableAttributes(gl,buffer4,programInfo);
  rotate_x_matrix = matrix.create();
  rotate_y_matrix = matrix.create();

  matrix.rotate(rotate_x_matrix, angle_x, 1, 0, 0);
  matrix.rotate(rotate_y_matrix, angle_y, 0, 1, 0);
  scale = matrix.create();
  matrix.scale(scale,0.7,0.7,0.7);
  translate = matrix.create();
  matrix.translate(translate,0,2.1,-0.62);
  matrix.multiplySeries(u_VM_transform, lookat, translate, rotate_x_matrix, rotate_y_matrix, scale);
  matrix.multiplySeries(u_PVM_transform, proj, u_VM_transform);
  gl.uniformMatrix4fv(programInfo.locations.u_VM_transform, false, u_VM_transform);
  gl.uniformMatrix4fv(programInfo.locations.u_PVM_transform, false, u_PVM_transform);
  { // now tell the shader (GPU program) to draw some triangles
    const offset = 0;
    gl.drawArrays(gl.TRIANGLES, offset, buffer4.num_vertices);
  }


  var buffer5 = buffersCollection.bufferTrent;
  enableAttributes(gl,buffer5,programInfo);
  rotate_x_matrix = matrix.create();
  rotate_y_matrix = matrix.create();

  matrix.rotate(rotate_x_matrix, angle_x, 1, 0, 0);
  matrix.rotate(rotate_y_matrix, angle_y, 0, 1, 0);
  scale = matrix.create();
  matrix.scale(scale,0.7,0.7,0.7);
  translate = matrix.create();
  matrix.translate(translate,0,-0.56,0.25);
  matrix.multiplySeries(u_VM_transform, lookat, translate, rotate_x_matrix, rotate_y_matrix, scale);
  matrix.multiplySeries(u_PVM_transform, proj, u_VM_transform);
  gl.uniformMatrix4fv(programInfo.locations.u_VM_transform, false, u_VM_transform);
  gl.uniformMatrix4fv(programInfo.locations.u_PVM_transform, false, u_PVM_transform);
  { // now tell the shader (GPU program) to draw some triangles
    const offset = 0;
    gl.drawArrays(gl.TRIANGLES, offset, buffer5.num_vertices);
  }


  var buffer6 = buffersCollection.bufferHunt;
  enableAttributes(gl,buffer6,programInfo);
  rotate_x_matrix = matrix.create();
  rotate_y_matrix = matrix.create();

  matrix.rotate(rotate_x_matrix, angle_x, 1, 0, 0);
  matrix.rotate(rotate_y_matrix, angle_y, 0, 1, 0);
  translate = matrix.create();
  matrix.translate(translate,0,0.01,-1.05);
  scale = matrix.create();
  matrix.scale(scale,0.7,0.7,0.7);
  matrix.multiplySeries(u_VM_transform, lookat, translate, rotate_x_matrix, rotate_y_matrix, scale);
  matrix.multiplySeries(u_PVM_transform, proj, u_VM_transform);
  gl.uniformMatrix4fv(programInfo.locations.u_VM_transform, false, u_VM_transform);
  gl.uniformMatrix4fv(programInfo.locations.u_PVM_transform, false, u_PVM_transform);
  { // now tell the shader (GPU program) to draw some triangles
    const offset = 0;
    gl.drawArrays(gl.TRIANGLES, offset, buffer6.num_vertices);
  }


}

//
// Initialize a shader program, so WebGL knows how to draw our data
// BOILERPLATE CODE, COPY AND PASTE
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.  BOILERPLATE CODE, COPY AND PASTE
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}



/*
//  build the object, including geometry (triangle vertices)
//  and possibly colors and normals for each vertex
function createGear() {
    const vertices = [];
    const colors = [];
    var i;
    var x = -0.5, y = 0, z = 0;
    var r = 0.1, g = 0.5, b = 0.9;


    for (i = 0; i < 10; i++) {

         vertices.push(x,y,z)
         vertices.push(x+0.2,y,z)
         vertices.push(x+0.1,y+0.3,z)

         colors.push(r,g,b);
         colors.push(r,g,b);
         colors.push(r,g,b);

         r += 0.2
         g += 0.2
         b += 0.2
         if (r > 1)
             r -= 1
         if (g > 1)
             g -= 1
         if (b > 1)
             b -= 1


         x += 0.1
         z += -0.05
    }
    return [vertices,colors]
}
*/
