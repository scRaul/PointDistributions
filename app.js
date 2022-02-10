 window.addEventListener('DOMContentLoaded',initializeAndStartRendering() , false);
 
    var gl;

    // the shader that will be used by each piece of geometry (they could each use their own shader but in this case it will be the same)
    var shaderProgram;
    var canvas;
    
    var loadedAssets =[
        shaderVS = null,
        shaderFS = null
    ];

    // ------------------------------------------------------------------------
    function initializeAndStartRendering() {
        initGL();
        //asynchoronus function
        loadAssets(function() {
            createShaders();
            updateAndRender();
        });
    }
    function loadAssets(onLoadedCB) {
        var filePromises = [
            fetch('shader-vs.glsl').then((response) => { return response.text(); }),
            fetch('shader.fs.glsl').then((response) => { return response.text(); })
        ];
        Promise.all(filePromises).then(function(values) {
            loadedAssets.shaderVS = values[0];
            loadedAssets.shaderFS = values[1];
        }).catch(function(error) {
            console.error(error.message);
        }).finally(function() {
            onLoadedCB();
        });
    
    }

    // -----------------------------------------------------------------------
    function initGL() {
        
        canvas = document.getElementById("webgl-canvas");
        document.getElementById('inp').value = 1;
        document.getElementsByName('Shape')[0].checked = "checked";
        document.getElementsByName('type')[0].checked = "checked";
        
        try {
            gl = canvas.getContext("webgl");

            // Note: gl does not naturally have canvasWidth or canvasHeight
            // We are attaching them to the object for convenience

            gl.canvasWidth = canvas.width;
            gl.canvasHeight = canvas.height;

        } catch (e) {}

        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }
    function initVertexBuffers(n){
        var e = document.getElementsByName('Shape');
        var vertices;
        if(e[0].checked)
            vertices = new Float32Array(makeTriangle(n));
        else if(e[1].checked)
            vertices = new Float32Array(makeGrid(n));
        else if( e[2].checked)
            vertices = new Float32Array(makeRings(n));
        else if(e[3].checked)
            vertices = new Float32Array(sunflower(n));
        else if(e[4].checked)
            vertices = new Float32Array(turnFraction(n));
        else if(e[5].checked)
            vertices = new Float32Array(makeLine(n));
        else if(e[6].checked)
            vertices = new Float32Array(makeExp(n));  
        else if(e[7].checked)
            vertices = new Float32Array(makeCos(n));
        else if(e[8].checked)
            vertices = new Float32Array(flower(n));
        else if(e[9].checked)
            vertices = new Float32Array(projectile(n));
        

        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);

        gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,2,gl.FLOAT,false,0,0);
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        //return n*n;
        return vertices.length/2;
    }

    // -------------------------------------------------------------------------
    function createShaders() {
       
        var vertexShader = createCompiledShader(gl,loadedAssets.shaderVS, gl.VERTEX_SHADER);

        var fragmentShader = createCompiledShader(gl, loadedAssets.shaderFS, gl.FRAGMENT_SHADER);

     
        // Create an empty gl "program" which will be composed of compiled shaders
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);

        // Tell gl it's ready to go, link it
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        

        shaderProgram.attributes = {
            vertexPositionAttribute: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        };

    }

    // -----------------------------------------------------------------------
     
    function createCompiledShader(gl, shaderText, shaderType) {
         var shader = gl.createShader(shaderType);
    
         gl.shaderSource(shader,shaderText);
         gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            console.log(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    function updateAndRender() {
     // requestAnimationFrame(updateAndRender);

        gl.viewport(0, 0,canvas.width ,canvas.height );
        // this is a new frame so let's clear out whatever happened last frame
        var n = (document.getElementById('inp').value);
        if(n == null) n = 1;


        n = initVertexBuffers(n);
        gl.clearColor(0.0, 0.0,0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(shaderProgram);

        var e = document.getElementsByName('type');
        if(e[0].checked)
            gl.drawArrays(gl.POINTS,0,n);
        else if(e[1].checked)
            gl.drawArrays(gl.LINE_STRIP,0,n);
        
        //gl.drawArrays(gl.LINES,n,4);

        

    }

    // -------------------------------------------------------------------------

