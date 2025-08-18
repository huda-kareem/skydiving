class physics{
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
  return t0 + 0.0065 * hieght;
};
 windForce=function(){
    return 0.5 * cd * A * airIntensity * Math.pow(windVelocity, 2);
}
 teta=function(){
  return Math.atan(planVelociy/windVelocity);
}
 pressure = function () {
  return p0 * Math.pow(1 - (L * hieght) / t0, (g * mol) / (R * L));
};
 airIntensity = function () {
  return (pressure * mol) / (R * tempreture);
};
 wight = function () {
  return mass * g;
};
 acceleration = function (time) {
  return 2 * ((positionOnY - hieght) - planVelociy * time);
};
 A = function () {
  if (parachuteOpen) {
    return 3.14 * Math.pow(radius, 2);
  } else return goodHieght * goodWidth;
};
 velocity = function (time) {
  if(acceleration == 0){
    return Math.sqrt((mass * g) / (0.5 * cd * A * airIntensity));
  }
  else{
   velocityX = planVelociy * Math.cos(teta);
   velocityOnY = planVelociy * Math.sin(teta) + acceleration * time;
  return Math.sqrt(Math.pow(velocityOnY, 2) + Math.pow(velocityX, 2));}
};
 terminalVelocity = function () {
  return Math.sqrt((mass * g) / (0.5 * cd * A * airIntensity));
};
 airDrag = function () {
  return 0.5 * cd * A * airIntensity * Math.pow(velocity, 2);
};
 positionOnX = function (time) {
  return x0 + planVelociy * time + 0.5 * acceleration * Math.pow(time, 2);
};
 positionOnY = function (time) {
  return hieght + planVelociy * time + 0.5 * acceleration * Math.pow(time, 2);
};
 positionOnZ = function (time) {
  return z0 + planVelociy * time + 0.5 * acceleration * Math.pow(time, 2);
};
 update(){
  const now = Date.now();
  const time = (now - startTime) / 1000;
  tempreture();
  pressure();
  airIntensity();
  velocity(time);
  airDrag();
  terminalVelocity();
  acceleration(time);
  positionOnX(time);
  positionOnY(time);
  positionOnZ(time);
}
}
export default physics;
