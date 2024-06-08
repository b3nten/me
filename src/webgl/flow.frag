precision highp float;

uniform sampler2D tMap;

uniform float uFalloff;
uniform float uAlpha;
uniform float uDissipation;

uniform float uAspect;
uniform vec2 uMouse;
uniform vec2 uVelocity;

varying vec2 v_uv;

void main() {
    vec4 color = texture2D(tMap, v_uv) * uDissipation;

    vec2 cursor = v_uv - uMouse;
    cursor.x *= uAspect;

    vec3 stamp = vec3(uVelocity * vec2(1, -1), 1.0 - pow(1.0 - min(1.0, length(uVelocity)), 3.0));
    float falloff = smoothstep(uFalloff, 0.0, length(cursor)) * uAlpha;

    color.rgb = mix(color.rgb, stamp, vec3(falloff));

    gl_FragColor = color;
}