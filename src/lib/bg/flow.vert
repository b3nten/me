attribute vec2 uv;
attribute vec2 position;

varying vec2 v_uv;

void main() {
    v_uv = uv;
    gl_Position = vec4(position, 0, 1);
}