attribute vec3 aVertexPosition;

void main(){
        gl_Position = vec4(aVertexPosition,1.0);
        gl_PointSize = 2.0;
}
