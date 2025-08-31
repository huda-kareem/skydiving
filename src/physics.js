/*class physics{
 mass = 10;
 planVelociy;
 hieght = 1000;
 g = 9.81;
 parachuteOpen = false;
 windVelocity;
 p0 = 101325;
 t0 = 287.05;
 mol = 0.02896;
 R = 8.314;
 L = 0.0065;
 cd = 0.8;
 goodWidth = 0.23;
 goodHieght = 0.23;
 radius = 1.2;
 startTime = Date.now(); //تذكري عند الربط أن تضعيه في زر بدء التجربة
 tempreture = function () {
  return this.t0 + 0.0065 * this.hieght;
};
 windForce=function(){
    return 0.5 * this.cd * this.A() * this.airIntensity() * Math.pow(this.windVelocity, 2);
}
 teta=function(){
  return Math.atan(this.planVelociy/this.windVelocity);
}
 pressure = function () {
  return this.p0 * Math.pow(1 - (this.L * this.hieght) / this.t0, (this.g * this.mol) / (this.R * this.L));
};
 airIntensity = function () {
  return (this.pressure() * this.mol) / (this.R * this.tempreture);
};
 wight = function () {
  return this.mass * this.g;
};
 acceleration = function (time) {
  return (this.wight()-this.airDrag())/this.mass;
};
 A = function () {
  if (this.parachuteOpen) {
    return 3.14 * Math.pow(this.radius, 2);
  } else return this.goodHieght * this.goodWidth;
};
 velocity = function (time) {
  if(this.acceleration() == 0){
    return Math.sqrt((this.mass * this.g) / (0.5 * this.cd * this.A() * this.airIntensity()));
  }
  else{
   let velocityX = this.planVelociy * Math.cos(this.teta);
   let velocityOnY = this.planVelociy * Math.sin(this.teta) + this.acceleration() * time;
  return Math.sqrt(Math.pow(velocityOnY, 2) + Math.pow(velocityX, 2));}
  };
 airDrag = function () {
  return 0.5 * this.cd * this.A() * this.airIntensity() * Math.pow(this.velocity(time), 2);
};
 positionOnY = function (time) {
  return hieght + planVelociy * time + 0.5 * acceleration * Math.pow(time, 2);
};

 update(){
  const now = Date.now();
  const dtime = (now - this.startTime) / 1000;
  this.startTime = now;
  this.hieght = this.positionOnY(dtime);
  this.planVelociy = this.velocity(dtime);

}
}
export default physics;*/








class Physics {
  mass = 10;             
  g = 100;             
  cd = 0.8; // معامل السحب
  A_closed = 0.23 * 0.23;  
  A_open = Math.PI * Math.pow(1.2, 2); 
  parachuteOpen = false;


  x = 0;
  y = 2000;  
  z = 0;
  vx = 0;
  vy = 0;
  vz = 0;

  // سرعة الرياح (يمكنك تعديلها ديناميكياً)
  windVx = 0; 
  windVy = 0; // عادة 0 (لا يوجد رياح عمودية)
  windVz = 0;

  startTime = Date.now();

  p0 = 101325;    
  t0 = 288.15;    
  mol = 0.02896;  
  R = 8.314;      
  L = 0.0065;     

  pressure(h) {
    return this.p0 * Math.pow(1 - (this.L * h) / this.t0, (this.g * this.mol) / (this.R * this.L));
  }

  temperature(h) {
    return this.t0 - this.L * h;
  }

  airDensity(h) {
    return (this.pressure(h) * this.mol) / (this.R * this.temperature(h));
  }

  area() {
    return this.parachuteOpen ? this.A_open : this.A_closed;
  }

  update() {
    const now = Date.now();
    const dt = (now - this.startTime) / 1000; 
    this.startTime = now;

    const rho = this.airDensity(this.y);

    const wight = this.mass * this.g; 
    const relVy = this.vy - this.windVy;
    const Fd_y = 0.5 * this.cd * this.area() * rho * relVy * relVy * Math.sign(relVy);
    const Fnet_y = wight - Fd_y;
    const ay = Fnet_y / this.mass;

    this.vy += ay * dt;
    this.y -= this.vy * dt;

    const relVx = this.vx - this.windVx;
    const Fd_x = 0.5 * this.cd * this.area() * rho * relVx * relVx * Math.sign(relVx);
    const ax = -Fd_x / this.mass;

    this.vx += ax * dt;
    this.x += this.vx * dt;

    const relVz = this.vz - this.windVz;
    const Fd_z = 0.5 * this.cd * this.area() * rho * relVz * relVz * Math.sign(relVz);
    const az = -Fd_z / this.mass;

    this.vz += az * dt;
    this.z += this.vz * dt;

    if (this.y < 0) {
      this.y = 0;
      this.vy = 0;
    }
  }
}

export default Physics;