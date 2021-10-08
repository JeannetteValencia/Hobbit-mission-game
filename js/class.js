class Mission {
  constructor (){
    this.currentTime= 0;
    this.hobbit = null;
    this.bullet = null;
    this.orcsArr = [];
    this.weaponArr = [];
    this.bulletArr=[];
    this.runes = 10;
    this.initialMinutes = 1;
    this.time = this.initialMinutes * 60;
    this.countdownElm = document.getElementById("countdown");
  }

  //Load the game and its basic components
  startMission(){
    this.hobbit = new Hobbit();
    this.hobbit.create();
    this.hobbit.draw();
    this.addEventListeners();
    this.updateOrcs();
    this.updateWeapon();
    this.shooting();
    this.countdown();
    
    setInterval(()=> {
      this.currentTime++;

      this.updateOrcs();

      this.updateWeapon();

      //runes record
      if (this.runes >=1){
        document.getElementById("runes").innerHTML = `Total runes: ${this.runes}`;
      } else {
        document.getElementById("runes").innerHTML = "Total runes: 0";
        this.restartBtn();
      }
    },300)
  }

  //Activate actions with pressed keys
  addEventListeners(){
    document.addEventListener("keydown",(event) =>{
      if(event.key === "ArrowLeft") {
        this.hobbit.moveLeft();
        this.hobbit.draw();
      } else if (event.key === "ArrowRight") {
         this.hobbit.moveRight();
         this.hobbit.draw();
      } else if (event.key === "ArrowUp"){
         this.hobbit.moveUp();
         this.hobbit.draw();
      } else if (event.key === "ArrowDown"){
         this.hobbit.moveDown();
         this.hobbit.draw();
      } /*else {
        alert ("Please press an arrow key");
      }*/
    })
    document.addEventListener('keyup', event => {
      if (event.code === 'Space') {
        console.log('Space pressed');
        const bullet = new Bullet(this.hobbit.x, this.hobbit.y);
        bullet.create();
        this.bulletArr.push(bullet);

        this.shooting();
      }
    })
  }

  updateOrcs(){
    //Orcs apppearance
    if (this.currentTime % 5 === 0){
      const newOrc = new Orc ();
      newOrc.create();
      this.orcsArr.push(newOrc);
    }

    this.orcsArr.forEach( (orc,index) => {
      orc.moveDown();
      orc.draw();

      //orc-hobbit colission detection
      if (orc.y <= 86){
        if (this.hobbit.x < orc.x + orc.width && this.hobbit.x + this.hobbit.width > orc.x && orc.y < this.hobbit.y + this.hobbit.height && orc.y + orc.height > this.hobbit.y){
          console.log ("Run Hobbit!")
          if (this.runes>=2){
            this.runes = this.runes - 2;
            orc.remove();
            this.orcsArr.splice(index,1);
          }
        }
      } else {
          orc.remove();
          this.orcsArr.shift();
      }
    });

  }

  updateWeapon(){
    //The Fellowship of the Ring Weapon Creation
    if (this.currentTime % 10 === 0) {
      const newWeapon = new Weapon ();
      if (this.weaponArr.length === 0){
        newWeapon.create();
        newWeapon.draw();
        this.weaponArr.push(newWeapon);
      }
    }

    //Hobbit-weapon collision detection
    this.weaponArr.forEach((weapon, index)=>{
      if (this.hobbit.x< weapon.x + weapon.width && this.hobbit.x + this.hobbit.width > weapon.x && weapon.y < this.hobbit.y + this.hobbit.height && weapon.y + weapon.height >this.hobbit.y){
        console.log("Great you've got 10 runes!")
        this.runes = this.runes + 10;
        weapon.remove();
        this.weaponArr.splice(index,1);
      }
    })
  }

  shooting (){
    setInterval(() => {
      //Bullet-orc collision detection
      this.bulletArr.forEach((bullet, bIndex)=>{
        bullet.bulletUp();
        bullet.draw();

        this.orcsArr.forEach((orc, oIndex)=>{
          if (bullet.x < orc.x + orc.width && bullet.x + bullet.width > orc.x && orc.y < bullet.y + bullet.height && orc.y + orc.height > bullet.y){
            console.log ("You now have 5 runes")
            this.runes = this.runes + 5;
            orc.remove();
            this.orcsArr.splice(oIndex, 1);
            bullet.remove();
            this.bulletArr.splice(bIndex,1);
          }
        })
        if (bullet.y <5 || bullet.y === 0) {
          bullet.remove();
          this.bulletArr.shift();
        }
      })
    }, 250);
  }

  countdown(){
    //Countdown the duration of Bilbo's mission
    let minutes = 0;
    let seconds = 0;
    let timer = setInterval(()=>{
        minutes = Math.floor(this.time/60);
        seconds = this.time % 60;
        seconds = seconds < 10 ? '0' + seconds:seconds;
        //this.time--;
        if (seconds>=0){
          this.time--;
          console.log(this.time)
          this.countdownElm.innerHTML = (`Timer: ${minutes} : ${seconds}`);
        } else {
          this.time = 1;
          this.restartBtn();
      }
    },1000)
  }

  restartBtn(){
    if (confirm(`You got ${this.runes} runes!
    Quite ready for another adventure?`)) {
      window.location.reload();
    } else {
      alert ("“So Comes Snow After Fire, And Even Dragons Have Their Ending.”")
  }
  }
}

class Components {
  constructor (){
    this.boardElm= document.getElementById("board");
  }

  create(){
    this.domElm = document.createElement("div");
    this.domElm.className = this.className;
    this.boardElm.appendChild(this.domElm);
  }

  draw(){
    this.domElm.style.width = this.width + "%";
    this.domElm.style.height = this.height + "%";
    this.domElm.style.left = this.x + "%";
    this.domElm.style.top = this.y + "%";
  }

  remove (){
    this.boardElm.removeChild(this.domElm);
  }
}

class Hobbit extends Components {
  constructor (){
    super ();
    this.width= 5;
    this.height= 10;
    this.x = 45;
    this.y = 45;
    this.className = "hobbit";
    this.speed = 3;
  }

  moveUp(){
    if (this.y>0){
      this.y-= this.speed
    }
  }

  moveDown(){
    if (this.y + this.height <99) {
      this.y += this.speed;
    }
  }

  moveLeft(){
    if (this.x>1){
      this.x-= this.speed
    }
  }
  moveRight(){
    if (this.x + this.width <=97) {
      this.x += this.speed;
    }
  }
}

class Orc extends Components{
 constructor (){
    super();
    this.width = 10;
    this.height = 15;
    this.x = Math.floor(Math.random()*(100-this.width+1));
    this.y = 0;
    this.className = "orc";
  }

  moveDown(){
    this.y = this.y +5;
  }
}

class Weapon extends Components{
  constructor(){
    super();
    this.width= 10;
    this.height= 20;
    this.x= Math.floor(Math.random()*(100-this.width+1));
    this.y= Math.floor(Math.random()*(100-this.height+1));
    this.className = "weapon";
  }
}

class Bullet extends Components {
  constructor(x, y){
    super();
    this.width= 5;
    this.height= 6;
    this.x= x;
    this.y= y;
    this.className = "bullet";
  }

  bulletUp(){
    if (this.y > 0){
      this.y-= 5;
    }
  }
}
