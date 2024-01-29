$(document).ready(function() {
    setTimeout(function() {
        $('.loading').hide();
    }, 200);
});

$('.multiple-items').slick({
    infinite: false,
    slidesToShow: 2.12,
    slidesToScroll: 1,
    prevArrow:"<button type='button' class='slick-prev pull-left'>" +
        "<svg class='rotate' xmlns=\"http://www.w3.org/2000/svg\" width=\"34\" height=\"34\" viewBox=\"0 0 34 34\" fill=\"none\">\n" +
        "<g clip-path=\"url(#clip0_114_1406)\">\n" +
        "<path d=\"M7.80761 17.6777H26.1924M26.1924 17.6777L17.3677 26.5024M26.1924 17.6777L17.3677 8.85305\" stroke=\"#FF451D\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n" +
        "</g>\n" +
        "<defs>\n" +
        "<clipPath id=\"clip0_114_1406\">\n" +
        "<rect width=\"24\" height=\"24\" fill=\"white\" transform=\"translate(17) rotate(45)\"/>\n" +
        "</clipPath>\n" +
        "</defs>\n" +
        "</svg></button>",
    nextArrow:"<button type='button' class='slick-next pull-right'><svg class='slick-next' xmlns=\"http://www.w3.org/2000/svg\" width=\"34\" height=\"34\" viewBox=\"0 0 34 34\" fill=\"none\">\n" +
        "<g clip-path=\"url(#clip0_114_1406)\">\n" +
        "<path d=\"M7.80761 17.6777H26.1924M26.1924 17.6777L17.3677 26.5024M26.1924 17.6777L17.3677 8.85305\" stroke=\"#FF451D\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n" +
        "</g>\n" +
        "<defs>\n" +
        "<clipPath id=\"clip0_114_1406\">\n" +
        "<rect width=\"24\" height=\"24\" fill=\"white\" transform=\"translate(17) rotate(45)\"/>\n" +
        "</clipPath>\n" +
        "</defs>\n" +
        "</svg> </button>",
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
    ]
});
$('.burger').click(function () {
    $(this).hide();
    $('.close-menu').show()
    $('.menu').fadeIn()
    $('.overlay').fadeIn()
})
$('.close-menu').click(function () {
    $(this).hide();
    $('.burger').show()
    $('.menu').fadeOut()
    $('.overlay').fadeOut()
})
$('.overlay').click(function () {
    $(this).fadeIn();
    $('.burger').show()
    $('.menu').fadeOut()
    $('.overlay').fadeOut()
    $('.close-menu').hide()
})

AOS.init();
$(document).ready(function() {
    $("#submitButton").click(function(e) {
        e.preventDefault()
        $(".error-message").text("");
        if ($("#name").val() === "") {
            $("#nameError").text("Name is required");
        }
        if ($("#email").val() === "") {
            $("#emailError").text("Email is required");
        }
        if ($("#message").val() === "") {
            $("#messageError").text("Message is required");
        }
        if ($(".error-message").text() === "") {
            $("#myForm").submit();
        }
    });
});
/*********
 * made by Matthias Hurrle (@atzedent)
 */
/** @type {HTMLCanvasElement} */
const canvas = window.canvas;
const gl = canvas.getContext("webgl2");
const dpr = Math.max(1, window.devicePixelRatio);
/** @type {Map<string,PointerEvent>} */
const touches = new Map();

const vertexSource = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

in vec2 position;

void main(void) {
    gl_Position = vec4(position, 0., 1.);
}
`;
const fragmentSource = `#version 300 es
/*********
* made by Matthias Hurrle (@atzedent)
*/

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;
uniform int pointerCount;
uniform vec2 touch;

#define T time
#define S smoothstep
#define mouse (touch/resolution)
#define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))

float tick(float t, float e) {
	return floor(t)+pow(S(.0, 1., fract(t)), e);
}

float rnd(vec2 p) {
	return fract(
		sin(
			dot(
				p,
        vec2(12.9898, 78.233)
      )
    )*43758.5453123
  );
}

float noise(vec2 p) {
	vec2 f=fract(p), i=floor(p);
	float
	a=rnd(i),
	b=rnd(i+vec2(1,0)),
	c=rnd(i+vec2(0,1)),
	d=rnd(i+vec2(1,1));

	vec2 u = f*f*(3.-2.*f);

	return mix(a,b,u.x)+
		(c-a)*u.y*(1.-u.x)+
		(d-b)*u.y*u.x;
}

vec3 pattern(vec2 uv) {
	float t = T*.1;
	vec3 col = vec3(0);
	vec2 p = vec2(0);
	p.x = noise(uv+vec2(0,1));
	p.y = noise(uv+vec2(1,0));

	p = 8.*(
		vec2(
			sin(t),
			-cos(t)
		)*.15-p
	);

	float s = .35;
	
	for(float i=.0;i<6.;i++) {
		p.x += s*sin(2.*t-i*1.5*p.y)+t;
		p.y += s*cos(2.*t+i*1.5*p.x)-t;
	}

	col+= sin(t+p.x+p.y);
	col = pow(S(vec3(0),vec3(1),col), vec3(.4));
	col = mix(vec3(.7,.6,.4)*col, col, col);
	
	return col;
}

float box(vec3 p, vec3 s, float r) {
	p = abs(p) -s;
	
	return length(max(p, .0))+
		min(.0, max(max(p.x, p.y), p.z))-r;
}

float map(vec3 p) {
	float d = 5e5,
	bx = box(p, vec3(9,1.5,.0625), .125);
	
	d = min(d, bx);
	
	return d;
}

vec3 norm(vec3 p) {
	vec2 e = vec2(1e-3, 0);
	float d = map(p);
	vec3 n = d-vec3(
		map(p-e.xyy),
		map(p-e.yxy),
		map(p-e.yyx)
	);
	
	return normalize(n);
}

void cam(inout vec3 p) {
	if (pointerCount > 0) {
		p.yz*=rot(-mouse.y*acos(-1.)-acos(.0));
		p.xz*=rot(mouse.x*acos(-1.)*2.);
	} else {
		p.xz*=rot(.5*sin(T*.25));
	}
}

void main() {
	vec2 uv = (
		gl_FragCoord.xy-.5*resolution
	) / min(resolution.x, resolution.y);
    float zoom = pointerCount > 0 ? .0 : exp(-cos(T*.5))*.5;
	vec3 col = vec3(0),
	ro = vec3(0,0,zoom-4.),
	rd = normalize(vec3(uv, .7+zoom*.25));
	
	cam(ro);
	cam(rd);
	
	vec3 p = ro,
	lp = -vec3(1,2,3);
	
	const float steps = 200., maxd = 40.;
	float dd = .0, at = .0, e = 1., side = 1.;
	
	for (float i = .0; i<steps; i++) {
		float d = map(p)*side;
		
		if (d < 1e-3) {
			vec3 n = norm(p)*side,
			l = normalize(abs(lp)-p),
			r = reflect(rd, n);
			
			if (dot(l, n) < .0) l = -l;
			
			vec3 h = normalize(l - r);
			
			float diff = max(.0, dot(l, n)),
			fres = 1.-clamp(dot(-rd, n), .0, 1.);
			
			col += e*diff*fres*(
				5.*pow(dot(h,n), 4.)+
				.5*pow(fres, 16.)
			);
			
			col += .5*pattern(p.xy);
			
			side = -side;
			
			vec3 rdo = refract(rd, n, 1.+side*.45);
			
			if (dot(rdo, rdo) == .0) {
				rdo = r;
			}
			
			rd = rdo;
			e *= .95;
			d = 9e-1;
		}
		
		if (dd > maxd) {
			dd = maxd;
			break;
		}
		
		p += rd*d;
		dd+= d;
		at+= 1.*(1./dd);
	}
	col += at*2e-2;

    fragColor = vec4(col,1);
}
`;
let time;
let buffer;
let program;
let touch;
let resolution;
let pointerCount;
let vertices = [];
let touching = false;

function resize() {
    const { innerWidth: width, innerHeight: height } = window;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    gl.viewport(0, 0, width * dpr, height * dpr);
}

function compile(shader, source) {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
    }
}

function setup() {
    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);

    program = gl.createProgram();

    compile(vs, vertexSource);
    compile(fs, fragmentSource);

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
    }

    vertices = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0];

    buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "position");

    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    time = gl.getUniformLocation(program, "time");
    touch = gl.getUniformLocation(program, "touch");
    pointerCount = gl.getUniformLocation(program, "pointerCount");
    resolution = gl.getUniformLocation(program, "resolution");
}

function draw(now) {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.uniform1f(time, now * 0.001);
    gl.uniform2f(touch, ...getTouches());
    gl.uniform1i(pointerCount, touches.size);
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length * 0.5);
}

function getTouches() {
    if (!touches.size) {
        return [0, 0];
    }

    for (let [id, t] of touches) {
        const result = [dpr * t.clientX, dpr * (innerHeight - t.clientY)];

        return result;
    }
}

function loop(now) {
    draw(now);
    requestAnimationFrame(loop);
}

function init() {
    setup();
    resize();
    loop(0);
}

document.body.onload = init;
window.onresize = resize;
canvas.onpointerdown = (e) => {
    touching = true;
    touches.set(e.pointerId, e);
};
canvas.onpointermove = (e) => {
    if (!touching) return;
    touches.set(e.pointerId, e);
};
canvas.onpointerup = (e) => {
    touching = false;
    touches.clear();
};
canvas.onpointerout = (e) => {
    touching = false;
    touches.clear();
};



;(function() {
    const link = document.querySelectorAll('.hover-this')
    const cursor = document.querySelector('.cursor')

    // * shake

    const animateit = function(e) {
        const span = this.querySelector('span')
        const { offsetX: x, offsetY: y } = e,
            { offsetWidth: width, offsetHeight: height } = this,
            move = 25,
            xMove = x / width * (move * 2) - move,
            yMove = y / height * (move * 2) - move

        span.style.transform = `translate(${xMove}px, ${yMove}px)`

        if (e.type === 'mouseleave') span.style.transform = ''
    }

    // * Cursor move

    const editCursor = (e) => {
        const { clientX: x, clientY: y } = e
        cursor.style.left = x + 'px'
        cursor.style.top = y + 'px'
    }

    link.forEach((b) => b.addEventListener('mousemove', animateit))
    link.forEach((b) => b.addEventListener('mouseleave', animateit))
    window.addEventListener('mousemove', editCursor)
})()

// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// ScrollTrigger.normalizeScroll(true)

// // create the smooth scroller FIRST!
// let smoother = ScrollSmoother.create({
//     smooth: 2,
//     effects: true,
// });







gsap.registerPlugin(ScrollTrigger);
const cont = document.querySelector("#container");
gsap.set(".green", { opacity: 1, scaleX: 0, scaleY: 0.005 });
let intro = gsap.timeline();
intro
  .to(".green", {
    scaleX: 1,
    ease: "expo.out",
    transformOrigin: "center center"
  })
  .to(".green", {
    scaleY: 1,
    duration: 0.8,
    ease: "expo.out",
    transformOrigin: "center center"
  })
  .set("#smooth-content", { autoAlpha: 1 })
  .to(".green", {
    scaleY: 0,
    ease: "sine.out",
    transformOrigin: "top center"
  })








