// fireworks
let auto = false
const m = {x:0, y:0},
      stage = document.querySelector('.stage'),
      toggle = document.querySelector('.toggle')

window.onpointerdown = window.onpointermove = (e)=>{
  m.x = e.clientX
  m.y = e.clientY
}

stage.onpointerup = (e)=>{
  gsap.killTweensOf(autoPlay)
  gsap.killTweensOf(fire)
  auto = true
  toggleAuto()
  fire(m)
}

function fire(m){
  
  const firework = document.createElementNS('http://www.w3.org/2000/svg', 'g'),
        trail = document.createElementNS('http://www.w3.org/2000/svg', 'g'),
        ring = document.createElementNS('http://www.w3.org/2000/svg', 'g'),
        hsl = 'hsl('+gsap.utils.random(0,360,1)+',100%,50%)'
  
  stage.appendChild(firework)
  firework.appendChild(trail)
  firework.appendChild(ring)
  
  for (let i=1; i<5; i++){
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    gsap.set(t, {x:m.x, y:innerHeight, opacity:0.25, attr:{'stroke-width':i, d:'M0,0 0,'+innerHeight}})
    gsap.to(t, {y:m.y, ease:'expo'})// for some reason this can't be combined with the above set() in a fromTo() without generating errors ¯\_(ツ)_/¯
    trail.appendChild(t)    
  }
  
  for (let i=0; i<gsap.utils.random(5,8,1); i++){
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    gsap.set(c, {x:m.x, y:m.y, attr:{class:'core', r:()=>(i+1)*25, fill:'none', stroke:hsl, 'stroke-width':gsap.utils.random(1.5,3.4), 'stroke-dasharray':'1 '+gsap.utils.random(15,30,1)}})
    ring.appendChild(c)
  }
    
  gsap.timeline({onComplete:()=>stage.removeChild(firework)})
    .to(trail.children, {duration:0.2, attr:{d:'M0,0 0,0'}, stagger:-0.08, ease:'expo.inOut'}, 0)
    .to(trail.children, {duration:0.4, scale:()=>gsap.utils.random(40,80,1), attr:{stroke:hsl}, stagger:-0.15, ease:'expo'}, 0.4)
    .to(trail.children, {duration:0.3, opacity:0, ease:'power2.inOut', stagger:-0.1}, 0.5)
    .from(ring.children, {duration:1, scale:0, stagger:0.05, ease:'expo'}, 0.4)
    .to(ring.children, {opacity:0, stagger:0.1, ease:'sine.inOut'}, 0.7)
    .to(ring.children, {duration:1, y:'+=30', ease:'power2.in'}, 0.7)
}

toggle.onpointerup = toggleAuto

function toggleAuto(){
  auto = !auto
  gsap.timeline({defaults:{duration:0.3, ease:'power2.inOut'}})
    .to('.knob', {x:()=>(auto)?18:0}, 0)
    .to('.txt1', {opacity:(i)=>(auto)?0.3:1}, 0)
    .to('.txt2', {opacity:(i)=>(auto)?1:0.3}, 0)
  if (auto) autoPlay()
  else {
    gsap.killTweensOf(autoPlay)
    gsap.killTweensOf(fire)
  }
}

function autoPlay(){
  for (let i=0; i<gsap.utils.random(3,9,1); i++){
    gsap.delayedCall(i/2, fire, [{x:gsap.utils.random(99, innerWidth-99, 1), y:gsap.utils.random(99, innerHeight-99, 1)}])
  }  
  (auto) ? gsap.delayedCall(3.5,autoPlay) : gsap.killTweensOf(autoPlay)
}

toggleAuto()

// fireworks ends 

//Stars

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function setCoordinate(c, maxWidth) {
  if (c >= maxWidth) return c % maxWidth;
  else if (c <= 0) return maxWidth + c;
  else return c;
}
const canvas = document.getElementById("starfield");
const context = canvas.getContext("2d");
const colorrange = [0, 60, 240];
class Star {
  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.radius = Math.random() * 1.2;
    this.hue = colorrange[getRandom(0, colorrange.length - 1)];
    this.sat = getRandom(50, 100);
    this.depth = getRandom(1, 3);
  }
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 369);
    context.fillStyle = "hsl(" + this.hue + ", " + this.sat + "%, 88%)";
    context.fill();
  }
  animate() {
    switch (this.depth) {
      case 1:
        this.x = setCoordinate(this.x - 0.3, window.outerWidth);
        this.y = setCoordinate(this.y + 0.1, window.outerHeight);
        break;
      case 2:
        this.x = setCoordinate(this.x + 0.03, window.outerWidth);
        this.y = setCoordinate(this.y + 0.5, window.outerHeight);
        break;
      case 3:
        this.x = setCoordinate(this.x - 0.04, window.outerWidth);
        this.y = setCoordinate(this.y + 0.7, window.outerHeight);
        break;
    }
  }
  parallax(_w, _h, _mouseX, _mouseY) {
    switch (this.depth) {
      case 1:
        this.x = setCoordinate(
          this.x - (_mouseX - _w) * 0.01,
          window.outerWidth
        );
        this.y = setCoordinate(
          this.y - (_mouseY - _h) * 0.01,
          window.outerHeight
        );
        break;
      case 2:
        this.x = setCoordinate(
          this.x - (_mouseX - _w) * 0.02,
          window.outerWidth
        );
        this.y = setCoordinate(
          this.y - (_mouseY - _h) * 0.02,
          window.outerHeight
        );
        break;
      case 3:
        this.x = setCoordinate(
          this.x - (_mouseX - _w) * 0.05,
          window.outerWidth
        );
        this.y = setCoordinate(
          this.y - (_mouseY - _h) * 0.05,
          window.outerHeight
        );
        break;
    }
  }
}
class Stars {
  constructor() {
    this.generate();
  }
  animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.starArray.forEach((star) => {
      star.animate();
      star.draw();
    });
  }
  parallax(e) {
    let _w = window.innerWidth / 2;
    let _h = window.innerHeight / 2;
    let _mouseX = e.clientX;
    let _mouseY = e.clientY;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < this.size; ++i) {
      this.starArray[i].parallax(_w, _h, _mouseX, _mouseY);
      this.starArray[i].draw();
    }
  }
  scroll(scrl) {
    this.lastScroll = scrl - this.lastScroll;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < this.size; ++i) {
      let _w = window.innerWidth / 2;
      let _h = window.innerHeight / 2;
      this.starArray[i].parallax(_w, _h, this.lastScroll, _h);
      this.starArray[i].draw();
    }
  }
  onResize() {
    this.generate();
  }
  generate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.size = Math.round((window.outerWidth * window.outerHeight) / 1000);
    this.starArray = new Array(this.size);
    this.lastScroll = 0;
    for (let i = 0; i < this.size; i++) {
      this.starArray[i] = new Star();
      this.starArray[i].draw();
    }
  }
}
function main() {
  let stars = new Stars();
  //const anim = setInterval(() => { stars.animate(); }, 20);
  /*if (typeof animated !== "undefined") {
    const anim = setInterval(() => {
      stars.animate();
    }, 20);
  } else {
    document.addEventListener("mousemove", (e) => {
      stars.parallax(e);
    });
    let content = document.getElementById("content");
    content.addEventListener("scroll", (e) => {
      stars.scroll(content.scrollLeft);
    });
  }*/
  window.addEventListener("mousemove", (e) => {
    stars.parallax(e);
    });
}
main();

// timer 
