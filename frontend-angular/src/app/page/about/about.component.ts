import { Component , OnInit } from "@angular/core";
import { APIData , User } from '../../@core/service/models/api.data.structure';
import { APIService  } from "../../@core/service/api.service";
import { Router, NavigationEnd } from '@angular/router';
declare var jquery:any;
import * as $ from 'jquery';

@Component({
  selector: 'app-about',
  templateUrl: './template/about.component.html',
  styleUrls: ['./template/about.component.scss']
})
export class AboutComponent implements OnInit {
  
  constructor(){
   
    }
 
   
 ngOnInit() {
  //
  setTimeout((router: Router) => {
    router.navigate(['/home']);
}, 5000);
  $("body").css("overflow", "hidden");
  //
  
  //
  (function(){
    //$("body").css("overflow", "hidden");
    // cross browser requestAnimationFrame loop to handle the animation looping
    var rAF = (function(){
      return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
       
        function( callback ){
          window.setTimeout(callback, 1000 / 60);
        };
    })();
  
    // average particles per 4 grid blocks
    var winWidth, winHeight,
      gridCols, gridRows,
      particles, tracer,
      countStep = 5,
      canvas, ctx,
      targetFPS = 60,
      avgFPS = 60,
      timer = (new Date()).getTime(),
      lastMouseMove = (new Date()).getTime(),
      frameBuffer = [60,60,60,60,60,60,60,60,60,60],
      FPS = 0,
      tick = 1,
      fillStyles = [],
      friction = 0.97,
      initialized = false, initializing = true;
  
    // ------------------------ //
    // #### Particle Class #### //
    // ------------------------ //
    function Particle(){
      // reference to the current particle
      var _p = this;
  
      // set this particle's initial location to a random
      // place on the screen within the bounds of the window.
      _p.x = tracer.x;
      _p.y = tracer.y;
  
      // the radius of this particle
      _p.tracer = {
        x: tracer.x,
        y: tracer.y
      };
  
      // start this particle with velocity
      _p.velx = Math.random() * 4 - 2;
      _p.vely = Math.random() * 4 - 2;
    }
    // Setup a common draw function that will be called
    // by all members of the Particle class
    Particle.prototype.draw = function(){
      var size = Math.ceil((100 - this.fillStyle) / 50) + 1;
      ctx.fillRect(this.x, this.y, size, size);
    };
    Particle.prototype.update = function(tick){
      var _p = this,
        _vel,
        _t = _p.tracer,
        diffX, diffY,
        iAmLeader = _p === particles[0] && timer - lastMouseMove > 5000,
        jump = 5;
  
      if (iAmLeader) {
        tracer.x = _p.x;
        tracer.y = _p.y;
      }
  
      diffX = _t.x - _p.x;
      diffY = _t.y - _p.y;
  
      if ((Math.abs(_p.velx) < 1 || Math.abs(_p.vely) < 1) && (Math.abs(diffX) < 1 || Math.abs(diffY) < 1 || iAmLeader)) {
        if (!iAmLeader) {
          // the farther the particle has to travel, the more variation we introduce
          // into it's random jump prior to tracking the tracer.
          jump *= (Math.abs(tracer.x - _p.x) + Math.abs(tracer.y - _p.y)) / (winWidth + winHeight);
          jump += 2;
  
          _p.velx = Math.random() * jump - (jump/2);
          _p.vely = Math.random() * jump - (jump/2);
  
          _p.tracer = {
            x: tracer.x,
            y: tracer.y
          };
        } else {
          if (Math.abs(_p.velx) < 1) {
            _p.tracer.x = Math.random() * winWidth;
          }
          if (Math.abs(_p.vely) < 1) {
            _p.tracer.y = Math.random() * winHeight;
          }
        }
      }
  
      _p.velx += diffX / 1000;
      _p.vely += diffY / 1000;
  
      // friction
      _p.velx *= friction;
      _p.vely *= friction;
  
      // We don't want to let the particles leave the
      // area, so just change their position when they
      // touch the walls of the window
      if(_p.x >= winWidth && _p.velx > 0 || _p.x < 0 && _p.velx < 0){ _p.velx *= -1; }
      if(_p.y >= winHeight && _p.vely > 0 || _p.y < 0 && _p.vely < 0){ _p.vely *= -1; }
  
      // tick adjust
      _p.x += _p.velx * tick;
      _p.y += _p.vely * tick;
  
      _vel = Math.abs(_p.velx) + Math.abs(_p.vely);
      _p.fillStyle = Math.min(Math.round((_vel/20) * 99), 99);
    };
  
    function setTracer(e) {
      e = e || window.event;
      tracer.x = e.pageX;
      tracer.y = e.pageY;
  
      lastMouseMove = (new Date()).getTime();
    }
  
    // ------------------------------ //
    // #### Draw the canvas data #### //
    // ------------------------------ //
    function drawScene(){
      var i, len, f, _p;
  
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, winWidth, winHeight);
      _p = particles[i-1];
      for (len = fillStyles.length, f = 0; f < len; f++) {
        // draw each particle
        i = particles.length;
        ctx.fillStyle = fillStyles[f];
  
        for(; i-- ;){
          _p = particles[i];
          if (_p.fillStyle !== f) { continue; }
          _p.draw();
        }
      }
  
      // draw the FPS clock
      ctx.lineWidth=1;
      ctx.fillStyle="#CCCCCC";
      ctx.font="16px sans-serif";
      //ctx.fillText("FPS: " + Math.round(avgFPS), 20, 30);
      //ctx.fillText("Particles: " + particles.length, 20, 50);
  
      // update the scene
      update();
  
      // schedule the next update
      rAF(drawScene);
    }
  
    // ------------------------------------------------ //
    // #### Update the scene, animate all elements #### //
    // ------------------------------------------------ //
    function update(){
  
      // 1000ms is 1s, divided by the number of ms it took
      // us since last update gives us how many times we
      // could have performed this frame within 1 second (FPS)
      var _timer = (new Date()).getTime();
      var _lastFPS = FPS;
      var i;
  
      FPS = 1000 / (_timer - timer);
      frameBuffer.shift();
      frameBuffer.push(FPS);
      // average the new FPS value with the last one to ease the change rate
      avgFPS = frameBuffer.reduce(function (prev, cur) { return prev + cur; }, 0) / frameBuffer.length;
      timer = _timer;
  
      // tick is how far from the ideal speed we are
      // if we are rendering slower, this number will be higher.
      // we'll use this to adjust the amount of movement we perform
      // on each particle per frame.
      tick = targetFPS / FPS;
  
  
      i = countStep;
      if (avgFPS > 55) {
        for (; i-- ;) { particles.push(new Particle()); }
      } else if (avgFPS < 50) {
        for (; i-- ;) { particles.pop(); }
      }
  
      // look at each particle and evaluate how it should move
      // next based on it's current valocity and attraction to
      // any other particles that are close enough.
      for(i = particles.length; i-- ;){
        particles[i].update(tick);
      }
    }
  
    // -------------------------------------------- //
    // #### Initialize and setup the animation #### //
    // -------------------------------------------- //
    function init(){
      var i;
  
      initializing = true;
      // Get a reference to our canvas
      canvas = document.getElementById("canvas") || document.createElement("canvas");
      canvas.id = 'canvas';
      document.body.appendChild(canvas);
      sizeCanvas();
      ctx = canvas.getContext("2d");
  
      // setup init values
      particles = [];
  
      tracer = {
        x: winWidth/2,
        y: winHeight/2
      };
  
      for (i = 100; i--;) {
        fillStyles[i] = 'hsla(' +
          (230 * (i/99) + 190) + ', ' +
          '100%, 60%, ' +
          ((i + 1) / 80 + 0.2) +
        ')';
      }
  
      // create all of our particles and push them into our main array to hold.
      i = countStep;
      for(; i-- ;){
        particles[i] = new Particle();
      }
  
      if(!initialized){
        drawScene();
        bindEvents();
        initialized = true;
      }
      initializing = false;
    }
  
  
    function sizeCanvas(){
      winHeight = window.innerHeight;
      winWidth = window.innerWidth;
  
      canvas.width = winWidth;
      canvas.height = winHeight;
      canvas.style.width = winWidth + 'px';
      canvas.style.height = winHeight + 'px';
    }
  
  
    // -------------------------------------------------- //
    // #### Set up the event bindings for user input #### //
    // -------------------------------------------------- //
    function bindEvents(){
  
      // resize canvas when window resizes
      window.addEventListener('resize', init, false);
      window.addEventListener('mousemove', setTracer, false);
    }
  
    // Initialize the animation
    init();
    //$("body").css("overflow", "hidden");
  })();

  //$("body").css("overflow", "hidden");
  //
 }
 
}


