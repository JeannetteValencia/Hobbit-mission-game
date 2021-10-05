class Challenge {
  constructor (){
    this.currentTime= 0;
    this.hobbit = null;
    this.orcsArr = [];
    this.weaponArr = [];
    this.points = 10;
  }

  startMission(){
    this.hobbit = new Hobbit();
    this.hobbit.create();
    this.hobbit.draw();
    this.addEventListeners();
    this.updateObstacle();
    this.updateWeapon();

    setInterval(()=> {
      this.currentTime++;

      this.updateObstacle();

      this.updateWeapon();

      //scores record
      if (this.points > 0){
        document.getElementById("points").innerHTML = `Score: ${this.points} points`;
      } else {
        //alert ("Game Over")
      }
    },300)
  }

  //to read which arrow is pressed
  addEventListeners(){
    document.addEventListener("keydown",(event) =>{ //use arrow function so "this" refers to this class, not the document
      //read keycode left or right, the property Key can be useful
      if(event.key === "ArrowLeft") {
        this.hobbit.moveLeft(); //I am calling the instance that
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
      } else {
        alert ("Please press an arrow key");
      }
    })
  }

  updateObstacle(){
    //Orcs apppearance
    if (this.currentTime % 8 === 0){
      const newOrc = new Orc ();
      newOrc.create();
      this.orcsArr.push(newOrc);
    }

    this.orcsArr.forEach( (orc,index) => {
      orc.moveDown();
      orc.draw();

      //Fatal colission detention orc-hobbit
      if (orc.y <= 90){
        if (this.hobbit.x < orc.x + orc.width && this.hobbit.x + this.hobbit.width > orc.x && orc.y < this.hobbit.y + this.hobbit.height && orc.y + orc.height > this.hobbit.y){
          console.log ("Run Hobbit!")
          this.points = this.points - 2;
          orc.remove();
          this.orcsArr.splice(index,1);
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

    //Great collision detention hobbit-weapon
    this.weaponArr.forEach((weapon, index)=>{
      if (this.hobbit.x< weapon.x + weapon.width && this.hobbit.x + this.hobbit.width > weapon.x && weapon.y < this.hobbit.y + this.hobbit.height && weapon.y + weapon.height >this.hobbit.y){
        console.log("Great you've got 10 points!")
        this.points = this.points + 10;
        weapon.remove();
        this.weaponArr.splice(index,1);
      }
    })
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
    this.x = 40;
    this.y = 50;
    this.className = "hobbit";
    this.speed = 3;
  }

  moveUp(){
    if (this.y>0){
      this.y-= this.speed
    }
  }

  moveDown(){
    if (this.y + this.height <100) {
      this.y += this.speed;
    }
  }

  moveLeft(){
    if (this.x>0){
      this.x-= this.speed
    }
  }
  moveRight(){
    if (this.x + this.width <100) {
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