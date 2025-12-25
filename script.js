const canvas = document.getElementById('sunset');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ==== Load Funny Image ====
const funnyImg = new Image();
funnyImg.src = './images/img.jpg'; // replace with your own
let showImage = false;
let imgOpacity = 0;

// ==== Sun ====
let sunX = canvas.width / 2;
let sunY = canvas.height * 0.2;
let sunRadius = 80;
let sunSpeed = 0.05; // slower for smooth

// ==== Waves Offset ====
let waveOffset = 0;

// ==== Fish ====
class Fish {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height * 0.5 + Math.random() * canvas.height * 0.45;
        this.size = 5 + Math.random() * 5;
        this.speed = 0.5 + Math.random() * 1.5;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.angle = Math.random() * Math.PI * 2;
    }
    draw() {
        const waveHeight = 5;
        const waveLength = 150;
        const yWave = Math.sin((this.x + waveOffset)/waveLength*2*Math.PI + this.angle) * waveHeight;
        ctx.fillStyle = 'rgba(255,165,0,0.9)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + yWave, this.size, this.size * 0.5, 0, 0, Math.PI*2);
        ctx.fill();
        this.x += this.speed * this.direction;
        this.angle += 0.01;
        if(this.x > canvas.width + 20) this.x = -20;
        if(this.x < -20) this.x = canvas.width + 20;
    }
}
const fishes = [];
for(let i=0;i<15;i++) fishes.push(new Fish());

// ==== Clouds ====
class Cloud {
    constructor(x,y,scale) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.speed = 0.1 + Math.random() * 0.3;
        this.puffs = [];
        const puffCount = 12 + Math.floor(Math.random()*5);
        for(let i=0;i<puffCount;i++){
            this.puffs.push({
                offsetX: (Math.random()-0.5)*220*scale,
                offsetY: (Math.random()-0.5)*90*scale,
                radius: 40*scale + Math.random()*40*scale
            });
        }
    }
    draw() {
        this.puffs.forEach(p=>{
            const gradient = ctx.createRadialGradient(this.x+p.offsetX, this.y+p.offsetY, p.radius*0.1, this.x+p.offsetX, this.y+p.offsetY, p.radius);
            gradient.addColorStop(0, 'rgba(255,230,200,0.9)');
            gradient.addColorStop(1, 'rgba(255,230,200,0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x+p.offsetX, this.y+p.offsetY, p.radius, 0, Math.PI*2);
            ctx.fill();
        });
        this.x += this.speed;
        if(this.x - 250*this.scale > canvas.width) this.x = -250*this.scale;
    }
}
const clouds = [
    new Cloud(canvas.width*0.2, canvas.height*0.15, 1.2),
    new Cloud(canvas.width*0.6, canvas.height*0.25, 1),
    new Cloud(canvas.width*0.8, canvas.height*0.18, 0.9)
];

// ==== Birds ====
const birds = [
    { x: canvas.width*0.1, y: canvas.height*0.3, speed: 1.2 },
    { x: canvas.width*0.4, y: canvas.height*0.2, speed: 1 }
];

// ==== Draw Sky ====
function drawSky(){
    const gradient = ctx.createLinearGradient(0,0,0,canvas.height);
    const t = sunY / (canvas.height*0.8);
    gradient.addColorStop(0, `rgba(${80},${50*(1-t)+100*t},${40*(1-t)},1)`);
    gradient.addColorStop(0.5, `rgba(${220*(1-t)},${100*(1-t)},${140*t},1)` );
    gradient.addColorStop(1,'#010914');
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

// ==== Draw Sun ====
function drawSun(){
    const coreRadius = sunRadius*1.8;
    const gradient = ctx.createRadialGradient(sunX,sunY,10,sunX,sunY,coreRadius);
    gradient.addColorStop(0,'rgba(255,240,100,1)');
    gradient.addColorStop(0.5,'rgba(255,200,0,0.8)');
    gradient.addColorStop(1,'rgba(255,180,0,0)');
    ctx.beginPath();
    ctx.arc(sunX,sunY,coreRadius,0,Math.PI*2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Shining rays dynamic
    const time = Date.now()/1000;
    for(let i=0;i<12;i++){
        ctx.save();
        ctx.translate(sunX,sunY);
        ctx.rotate(i*Math.PI/6 + Math.sin(time+i)*0.05);
        const rayGradient = ctx.createLinearGradient(0,0,0,250);
        rayGradient.addColorStop(0,'rgba(255,240,150,0.6)');
        rayGradient.addColorStop(1,'rgba(255,240,150,0)');
        ctx.strokeStyle = rayGradient;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(0,250);
        ctx.stroke();
        ctx.restore();
    }
}

// ==== Mountains ====
function drawMountains(){
    const baseY = canvas.height*0.5;
    ctx.fillStyle = '#0B2B40';
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.lineTo(canvas.width*0.2, baseY-110);
    ctx.lineTo(canvas.width*0.4, baseY-90);
    ctx.lineTo(canvas.width*0.6, baseY-130);
    ctx.lineTo(canvas.width*0.8, baseY-100);
    ctx.lineTo(canvas.width, baseY-120);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
}

// ==== Ocean ====
function drawOcean(){
    const waterTop = canvas.height*0.5;
    const waveHeight = 5;
    const waveLength = 250;

    // Base ocean
    const waterGradient = ctx.createLinearGradient(0,waterTop,0,canvas.height);
    waterGradient.addColorStop(0,'#1B4F72');
    waterGradient.addColorStop(1,'#0B2B40');
    ctx.fillStyle = waterGradient;
    ctx.fillRect(0, waterTop, canvas.width, canvas.height - waterTop);

    // Glassy reflection
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.filter = 'blur(12px)';
    const reflectionGradient = ctx.createLinearGradient(sunX, waterTop, sunX, canvas.height);
    reflectionGradient.addColorStop(0,'rgba(255,240,100,0.5)');
    reflectionGradient.addColorStop(1,'rgba(255,240,100,0)');
    ctx.fillStyle = reflectionGradient;

    ctx.beginPath();
    for(let x = sunX - sunRadius*2; x <= sunX + sunRadius*2; x++){
        const ripple = Math.sin((x+waveOffset*0.7)/waveLength*2*Math.PI) * waveHeight;
        ctx.lineTo(x, waterTop + ripple);
    }
    ctx.lineTo(sunX + sunRadius*2, canvas.height);
    ctx.lineTo(sunX - sunRadius*2, canvas.height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    waveOffset += 1.5;
}

// ==== Birds ====
function drawBirds(){
    birds.forEach(b=>{
        ctx.beginPath();
        ctx.moveTo(b.x,b.y);
        ctx.lineTo(b.x-10,b.y+5);
        ctx.lineTo(b.x-20,b.y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        b.x += b.speed;
        if(b.x > canvas.width+20) b.x = -20;
    });
}

// ==== Show funny image every 8 seconds with fade ====
setInterval(() => {
    showImage = true;
    imgOpacity = 0;
    let fadeInterval = setInterval(()=>{
        imgOpacity += 0.02;
        if(imgOpacity >= 1) clearInterval(fadeInterval);
    },16);
    setTimeout(()=>{
        let fadeOut = setInterval(()=>{
            imgOpacity -= 0.02;
            if(imgOpacity <= 0){
                imgOpacity = 0;
                clearInterval(fadeOut);
                showImage = false;
            }
        },16);
    },2000);
},8000);

// ==== Animate ====
function animate(){
    drawSky();
    drawSun();
    clouds.forEach(c=>c.draw());
    drawMountains();
    drawOcean();
    fishes.forEach(f=>f.draw());
    drawBirds();

    if(sunY < canvas.height*0.8) sunY += sunSpeed;

    // Draw funny image on top with smooth fade
    if(showImage && imgOpacity>0){
        ctx.save();
        ctx.globalAlpha = imgOpacity;
        ctx.translate(canvas.width/2, canvas.height/2);
        const imgSize = 200;
        ctx.drawImage(funnyImg, -imgSize/2, -imgSize/2, imgSize, imgSize);
        ctx.restore();
    }

    requestAnimationFrame(animate);
}

animate();