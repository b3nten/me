precision highp float;

varying vec2 v_uv;
uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D t_flow;

float tanh(float x) {
    float e_pos = exp(x);
    float e_neg = exp(-x);
    return (e_pos - e_neg) / (e_pos + e_neg);
}
vec2 tanh(vec2 v) {
    return vec2(tanh(v.x), tanh(v.y));
}
vec3 tanh(vec3 v) {
    return vec3(tanh(v.x), tanh(v.y), tanh(v.z));
}

void main()
{
    float t = u_time;
    vec2 res = u_resolution.xy;
    vec3 flow = texture2D(t_flow, v_uv).rgb;

    vec2 fragCoord = gl_FragCoord.xy;
    fragCoord = 0.2 * (fragCoord + fragCoord - res ) / res.y;
    fragCoord += 0.5 * flow.xy;

    vec4 z = gl_FragColor = vec4(-1.5,-1,-.5,0);
    vec2 w = fragCoord;
    float a = .5;

    for (float i = 0.0; i < 19.0; i++)
    {
        gl_FragColor += (1.0 + cos(z+t)) / length((1.0 + i * dot(res,res)) * sin(1.5 * fragCoord / (.5-dot(fragCoord,fragCoord)) - 9.0 * fragCoord.yx + t));
        res = cos(++t - 7.*fragCoord*pow(a += .03, i)) - 5.*fragCoord;
        fragCoord *= mat2(cos(i + .02*t - vec4(0,11,33,0)));
        fragCoord += min(
            tanh(40.0 * dot(fragCoord, fragCoord) * cos(1e2 * fragCoord.yx + t)) / 2e2
                + .2 * a * fragCoord
                + cos(4.0 / exp(dot(gl_FragColor, gl_FragColor)/ 482.) + t) / 482.,
            0.1);
    }

    gl_FragColor = pow(1.0 - sqrt(exp(-gl_FragColor * gl_FragColor * gl_FragColor/ 2e2)), 0.3 * z/z) - dot(w -= fragCoord, w) / 250.0;
}