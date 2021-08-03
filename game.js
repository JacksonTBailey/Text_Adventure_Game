const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')
const healthElement = document.getElementById('hp')
const goldElement = document.getElementById('gp')
const arrowElement = document.getElementById('arrows')

//Game level information

//state will keep track of whatever item the character has on them
let state = {
  gp: null,
  hp: null,
  arrows: null,
  skeletonHorde: null,
  golemHP: null,
  mageHP: null,
  damageTaken: null,
  deadMonsters: null,
  warlockApprentices: null,
  fagrimHP:null,
  wave1:null,
  wave2:null,
};

function startGame(){
  //Start with some beginner state
  state = {};
  state.gp = 0;
  state.hp = 20;
  state.arrows = 0;

//These states are hidden
  state.warlockApprentices = 3;
  state.skeletonHorde = 15;
  state.golemHP = 50;
  state.mageHP = 30;
  state.fagrimHP = 200;
  state.wave1 = 25;
  state.wave2 = 100;
  state.damageTaken = 0;
  state.deadMonsters = 0;

  writeHealthToScreen();
  writeGoldPointsToScreen();
  writeArrowsToScreen();

  //Show level 1!
  showGameLevel(1);
}

function clearScreenOptions() {
  while(optionButtonsElement.firstChild){
	optionButtonsElement.removeChild(optionButtonsElement.firstChild);
  }
};

function createOption(option) {
  const button = document.createElement('button');
  button.innerText = option.getText();
  button.classList.add('btn');
  button.addEventListener('click',() => selectOption(option));
  return button;
}

function writeTextToScreen(text) {
  textElement.innerText = text;
};

function writeHealthToScreen() {
  healthElement.innerText = "HP: " + state.hp;
};

function writeGoldPointsToScreen() {
  goldElement.innerText = "GP: " + state.gp;
};

function writeArrowsToScreen() {
  arrowElement.innerText = "Arrows: " + state.arrows;
}

function writeOptionsToScreen(options) {
  //Remove previous options
  clearScreenOptions();

  //Create and add each option to the screen
  options.forEach(option =>{
	if (isOptionAvailable(option)){
  	const button = createOption(option);
  	optionButtonsElement.appendChild(button)
	}
  });
};

function showGameLevel(gameLevelIndex) {
  //Get the first screen information!
  const gameLevel = gameLevels.find(gameLevel => gameLevel.id ===gameLevelIndex);

  //Write text to screen
  writeTextToScreen(gameLevel.getText());

  //Write options to screen
  writeOptionsToScreen(gameLevel.options);
};

function isOptionAvailable(option){
  return option.requiredState == null || option.requiredState(state);
}

function isGameOver(gameLevelId) {
   return gameLevelId <= 0;
}

function selectOption(option){

  //Need to find out how much damage we're taking before we have a health event
  if(option.heroDamageRandomizerEvent){
    option.heroDamageRandomizerEvent();
  }

  //Need to find out how much damage we're taking before we have a health event
  if(option.monsterDeathRandomizerEvent){
    option.monsterDeathRandomizerEvent();
  }

  //Determine how many monsters we killed
  if(option.killMonsterEvent){
    option.killMonsterEvent();
  }

  //Health should be done before checking if we lost....
  if(option.healthEvent){
	option.healthEvent();
	writeHealthToScreen();
  }

  //Determine next game level
  const nextGameLevelId = option.nextGameLevel();

  //Check if we hit gameover
  if (isGameOver(nextGameLevelId)){
	return startGame();
  }

  //If there is a merchant event, perform it!
  if (option.moneyEvent) {
	option.moneyEvent();
	writeGoldPointsToScreen();
  }

  //If there is an arrow event, perform it!
  if(option.arrowEvent){
	option.arrowEvent();
	writeArrowsToScreen();
  }

  //Update state
  state = Object.assign(state,option.setState);

  //Move on to next level
  showGameLevel(nextGameLevelId);
}

function gainMoney(coinAmount){
  return function(){state.gp+=coinAmount};
}

function loseMoney(coinAmount){
  return function(){state.gp-=coinAmount};
}

function gainHealth(healthAmount){
  return state.hp+=healthAmount;
}

function loseHealth(healthAmount){
  if (state.hp>healthAmount){
    return state.hp-=healthAmount;
  }else{
    return state.hp-=state.hp
  }
}

function gainArrow(arrowAmount){
  return function(){state.arrows+=arrowAmount};
}

function loseArrow(arrowAmount){
  return function(){state.arrows-=arrowAmount};
}

function killSkeleton(monstersKilled){
  if (state.skeletonHorde>monstersKilled){
  	return state.skeletonHorde-=monstersKilled
	}else{
  	return state.skeletonHorde-=state.skeletonHorde
	}
}

function killGolem(monstersKilled){
  if (state.golemHP>monstersKilled){
  	return state.golemHP-=monstersKilled
	}else{
  	return state.golemHP-=state.golemHP
	}
}

function killMage(monstersKilled){
  if (state.mageHP>monstersKilled){
  	return state.mageHP-=monstersKilled
	}else{
  	return state.mageHP-=state.mageHP
	}
}

function killWarlockApprentices(monstersKilled){
  if (state.warlockApprentices>monstersKilled){
  	return state.warlockApprentices-=monstersKilled
	}else{
  	return state.warlockApprentices-=state.warlockApprentices
	}
}

function killFagrim(monstersKilled){
  if (state.fagrimHP>monstersKilled){
  	return state.fagrimHP-=monstersKilled
	}else{
  	return state.fagrimHP-=state.fagrimHP
	}
}
function killWave1(monstersKilled){
  if (state.wave1>monstersKilled){
  	return state.wave1-=monstersKilled
	}else{
  	return state.wave1-=state.wave1
	}
}
function killWave2(monstersKilled){
  if (state.wave2>monstersKilled){
  	return state.wave2-=monstersKilled
	}else{
  	return state.wave2-=state.wave2
	}
}

function heroDamageRandomizer(minDamage, maxDamage){
  return function(){state.damageTaken = Math.floor((Math.random() * (maxDamage - minDamage) + minDamage));
  }
}

function monsterDeathRandomizer(minDamage, maxDamage){
  return function(){state.deadMonsters = Math.floor((Math.random() * (maxDamage - minDamage) + minDamage));
      return state.deadMonsters;
  }
}

function getNextGameLevel(dontDie, die){
  return function() {
  	if (state.hp>0){
  	return dontDie()
	} else{
  	return die
	}
  }
}

function getDamageTaken() {
  return state.damageTaken;
}

function getDeadMonsters() {
  return state.deadMonsters;
}

function getSkeletonHorde() {
  return state.skeletonHorde;
};

function getGolemHP(){
  return state.golemHP;
}

function getMageHP(){
  return state.mageHP;
}

function getFagrimHP(){
  return state.fagrimHP;
}

function getWarlockApprentices(){
  return state.warlockApprentices;
}

function getWave1(){
  return state.wave1;
}

function getWave2(){
  return state.wave2;
}

// NOTE: to end game make the option after killing the person text:"restart", nextGameLevel: getNextGameLevel(()=>-1,-1)
const gameLevels = [
  {
	id: 1,
	getText() {return "You awaken from your slumber to find you are locked in a dungeon. The last thing you remember was bending down to pick up the spoils from a goblin you had just killed.\
	You look around the room and find yourself being guarded by 2 goblins. Lucky for you, both seem to be fast asleep."},
	options: [
  	{getText() {return "Try to sneak past the goblins and into the corridor"}, nextGameLevel: getNextGameLevel(()=>2.1)},
  	{getText() {return "Steal one of the goblins' dagger"}, setState:{goblinDagger:true}, nextGameLevel: getNextGameLevel(()=>2.2)},
	]
  },
  {
	id:2.1,
	getText() {return "You successfully sneak into the corridor without awakening the goblins. You notice a door not far away with a sign on it. \
	As you get closer, you make out that it says, \"Hmpthgar Sleep Room - You No Welcome Here!\"."},
	options: [
  	{getText() {return "No stupid goblin will keep me out."}, moneyEvent:gainMoney(5), setState:{goblinSword:true}, nextGameLevel: getNextGameLevel(()=>3.11)},
  	{getText() {return "Better leave his room alone and try to find my way out."}, nextGameLevel: getNextGameLevel(()=>3.12)},
	]
  },
  {
	id:2.2,
	getText(){return "You manage to steal one of the goblins' knives, but as you're leaving, the goblins wake up! The goblin you stole from begins screeching while the other lunges at you."},
	options:[
  	{getText(){return "Plunge your dagger into the oncoming attacker."}, nextGameLevel: getNextGameLevel(()=>3.22)},
  	{getText(){return "Dodge the goblin and kill the screecher."}, requiredState:(currentState)=>currentState.goblinDagger, setState:{goblinDagger:false}, nextGameLevel: getNextGameLevel(()=>3.21)},
	]
  },
  {
	id:3.11,
	getText(){return "You open the door and wander inside Hmpthgar's room. It looks like you're in luck. No one seems to be home! You begin searching Hmpthgar's room for anything valuable \
	and discover a sword! Now you can defend yourself."},
	options:[
  	{getText(){return "Stay and take a nap in Hmthgar's room."}, nextGameLevel: getNextGameLevel(()=>4.11)},
  	{getText(){return "Leave Hmthgar's room and travel down the hallway."}, nextGameLevel: getNextGameLevel(()=>3.12)},
      	]
  },
  {
	id:3.12,
	getText(){return "You continue down the hallway until you reach a dimly lit room. As you enter the dark room, you're attacked by 3 goblins!"},
	options:[
  	{getText(){return "Punch them"}, nextGameLevel: getNextGameLevel(()=>4.14)},
  	{getText(){return "Slash them with your sword"}, requiredState:(currentState) => currentState.goblinSword, healthEvent(){return loseHealth(5)}, nextGameLevel: getNextGameLevel(()=>4.12)},
  	{getText(){return "Stab them"}, requiredState:(currentState) => currentState.goblinDagger, nextGameLevel: getNextGameLevel(()=>4.13)},
	]
  },
  {id:3.21,
  getText(){return "You barely manage to dodge the oncoming attack. As you do, you throw your dagger straight into the screecher's head, killing him instantly. It doesn't appear as though any other \
  goblins were alerted to your presence."},
  options:[
	{getText(){return "Retrieve the dagger"},nextGameLevel: getNextGameLevel(()=>4.15)},
	{getText(){return "Attack the remaining goblin"}, setState:{goblinDagger:true}, nextGameLevel: getNextGameLevel(()=>4.16)},
	{getText(){return "Flee"}, nextGameLevel: getNextGameLevel(()=>4.17)}
  ]
},
{
  id:3.22,
  getText(){return "You manage to kill the oncoming attacker, but the screecher seems to have alerted a horde of goblins. They rush in the room and attack you all at once. \
  You have no chance of survival and succumb to the onslaught of goblin swords slashing you. Perhaps you will make better choices in another life."},
  options:[
	{getText() {return "Restart"}, nextGameLevel: getNextGameLevel(()=>-1,-1)},
]
},
{
  id:4.11,
  getText() {return "While you are napping, Hmpthgar returns to his room and sees you sleeping in his bed. Enraged, Hmpthgar takes a club and beats you to a pulp. \
  Perhaps you will make better choices in another life."},
  options:[
	{getText() {return "Restart"}, nextGameLevel: getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id:4.12,
  getText() {return "You slash at the three goblins, taking two of them down immediately. The third lunges at you and manages to slice your leg with his dagger. \
  Enraged, you bury your sword in his chest and finish him off. You look down at your leg, blood oozing from it. You'll need to take care of that soon \
  before you succumb to blood loss."},
  options:[
	{getText(){return "Loot the bodies"}, moneyEvent:gainMoney(15), setState:{helmet: true, lantern: true}, nextGameLevel: getNextGameLevel(()=>5.10)},
	{getText(){return "Search the room"}, setState:{healthPotion:true}, nextGameLevel: getNextGameLevel(()=>5.11)},
  ]
},
{
  id:4.13,
  getText() {return "You stab one of the goblins in the head, killing it instantly. The other two goblins flank you from both sides and slash you with their swords. \n\n\
  You feel a sharp pain and look down to see your insides have, well... become outsides. Your vision begins to blur and your feel yourself falling. \
  As you begin to fade from existance, you hear one of the goblins mock you, \"Perhaps you will make better choices in another life, swine!\""},
  options:[
	{getText() {return "Restart"}, nextGameLevel: getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id:4.14,
  getText() {return "You punch one of them in the face, only enraging them more. It seems to have done literally no damage. In fact, it actually straightened out his \
  crooked nose. \n\n\
  The goblins gang up on you, slashing you to bits with their swords. You have no chance of survival. Perhaps you will make better choices in another life."},
  options:[
	{getText() {return "Restart"},nextGameLevel: getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 4.15,
  getText() {return "You attempt to retrieve the dagger from the deceased goblin's head; but before you can, the second goblin jumps on you and plunges his knife into your \
  neck. Everything begins to fade to black... \n\n\
  Perhaps you will make better choices in another life."},
  options:[
	{getText(){return "Restart"}, nextGameLevel: getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 4.16,
  getText() {return "As the other goblin is looking at his fallen brother, you punch him in his face, catching him off guard. He drops his dagger as he falls to the floor. \
  You jump on top of him and begin choking him, eventually leaving him lifeless. You pick up the dagger he dropped, knowing you'll need it for later."},
  options:[
	{getText() {return "Loot the bodies"}, moneyEvent:gainMoney(10), nextGameLevel: getNextGameLevel(()=>5.12)},
	{getText() {return "Search the room"}, setState:{shield:true}, nextGameLevel: getNextGameLevel(()=>5.13)},
  ]
},
{
  id:4.17,
  getText() {return "You try to flee, but the other goblin overpowers you and stabs you in the back. You tumble to the floor, blood gushing everywhere. Perhaps you will make better choices \
  in another life."},
  options:[
	{getText(){return "Restart"}, nextGameLevel: getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id:5.10,
  getText() {return "You loot the bodies and salvage a helmet and a dimly lit lantern. You put on the helmet and use the lantern to search for an exit. You find a hidden passageway \
  behind one of the bookshelves in the room. You also spot a door in the corner of the room."},
  options:[
	{getText(){return "Go through the door in the corner of the room"}, nextGameLevel: getNextGameLevel(()=>6.10)},
	{getText(){return "Go through the hidden passageway."}, nextGameLevel: getNextGameLevel(()=>6.11)},
	{getText() {return "Search the room"}, setState:{healthPotion:true},nextGameLevel: getNextGameLevel(()=>5.11)}
  ]
},
{
  id:5.11,
  getText() {return "You search the dark room and find a potion of healing."},
  options:[
	{getText(){return "Use the potion now: +20 HP"}, setState:{healthPotion:false, emptyBottle:true}, healthEvent(){return gainHealth(20)}, nextGameLevel: getNextGameLevel(()=>6.12)},
	{getText(){return "Save the potion for later"}, nextGameLevel: getNextGameLevel(()=>6.13)}
  ]
},
{
  id:5.12,
  getText(){return "You loot the bodies and find some GP. You try to pull the dagger out of the goblin's head, but realize it's damaged and not worth salvaging."},
  options:[
	{getText(){return "Search the room"}, setState:{shield:true}, nextGameLevel: getNextGameLevel(()=>5.13)},
	{getText(){return "Head into the corridor to find your way out"}, nextGameLevel: getNextGameLevel(()=>6.14)},
  ]
},
{
  id: 5.13,
  getText() {return "You search the room and find a shield hidden inside of a barrel. That'll come in handy!"},
  options: [
	{getText() {return "Head into the corridor to find your way out"}, nextGameLevel: getNextGameLevel(()=>6.14)},
  ]
},
{
  id: 6.10,
  getText() {return "You open the door and see that you've finally found the exit! You run as fast as you can until you reach a road, the first sign of civilization you've seen in a while.\
  You continue walking for a couple of hours until you reach a fork in the road."},
  options:[
	{getText(){return "Go left"}, nextGameLevel: getNextGameLevel(()=>7.10)},
	{getText(){return "Go right"}, nextGameLevel: getNextGameLevel(()=>7.11)},
  ]
},
{
  id:6.11,
  getText() {return "You go through the hidden passageway and find yourself in the Gobin King's Throne Rooom. The Goblin King shouts \
  at his four guards, \"Kill the human!\" With swords and mallets drawn, the guards jump at you."},
  options:[
	{getText(){return "Block the first wave of attacks and slash at the two goblins on your right"}, requiredState:(currentState)=>currentState.shield, nextGameLevel:getNextGameLevel(()=>7.12)},
	{getText(){return "slash at the goblins"},healthEvent(){return loseHealth(10)}, nextGameLevel: getNextGameLevel(()=>7.13, 7.131)},
  ]
},
{
  id:6.12,
  getText() {return "You use the potion and immediately your wound heals. In fact, you feel in better shape than you have in a while!"},
  options:[
	{getText(){return "Go through the hidden passageway"}, requiredState:(currentState)=>currentState.lantern,nextGameLevel: getNextGameLevel(()=>6.11)},
	{getText(){return "Go through the door in the corner of the room"}, nextGameLevel: getNextGameLevel(()=>6.10)},
	{getText(){return "loot the bodies"}, requiredState:(currentState)=>currentState.helmet===undefined, setState:{helmet:true, lantern:true},nextGameLevel: getNextGameLevel(()=>6.15)},
  ]
},
{
  id:6.13,
  getText(){return "You decide to save the potion for later."},
  options:[
	{getText(){return "loot the bodies"}, moneyEvent:gainMoney(15), requiredState:(currentState)=>currentState.helmet===undefined, setState:{helmet:true, lantern:true},nextGameLevel: getNextGameLevel(()=>6.15)},
	{getText(){return "Go through the hidden passageway"}, requiredState:(currentState)=>currentState.lantern,nextGameLevel: getNextGameLevel(()=>6.11)},
	{getText(){return "Go through the door in the corner of the room"}, nextGameLevel: getNextGameLevel(()=>6.10)}
  ]
},
{
  id:6.14,
  getText(){return "As you walk down the corridor, you notice a door not far away with a sign on it. \
  As you get closer, you make out that it says, \"Hmpthgar Sleep Room - You No Welcome Here!\"."},
  options: [
	{getText() {return "No stupid goblin will keep me out."}, setState:{goblinSword:true}, nextGameLevel: getNextGameLevel(()=>3.11)},
	{getText() {return "Better leave his room alone and try to find my way out."}, nextGameLevel: getNextGameLevel(()=>3.12)},
  ]
},
{
  id: 6.15,
  getText() {return "You loot the bodies of the three goblins and salvage a helmet and a lantern. Those will both come in handy!"},
  options:[
	{getText(){return "Go through the hidden passageway"}, requiredState:(currentState)=>currentState.lantern,nextGameLevel: getNextGameLevel(()=>6.11)},
	{getText(){return "Go through the door in the corner of the room"}, nextGameLevel: getNextGameLevel(()=>6.10)},
	{getText(){return "Use the potion now"}, requiredState:(currentState)=>currentState.healthPotion,setState:{healthPotion:false, emptyBottle:true}, healthEvent(){return gainHealth(20)}, nextGameLevel: getNextGameLevel(()=>6.12)},
  ]
},
{
  id: 7.10,
  getText(){return "You decide to take the path on the left and end up traveling for almost a day's time before you meet a wandering trader. \n\n Trader: \"Would you like \
  to buy any of my wares or sell yours?\""},
  options:[
	{getText() {return "Sell"}, nextGameLevel: getNextGameLevel(()=>7.101)},
	{getText() {return "Buy"}, nextGameLevel: getNextGameLevel(()=>7.102)},
	{getText() {return "Leave wandering trader alone"}, nextGameLevel: getNextGameLevel(()=>7.14)}
  ]
},
{
id: 7.101,
getText(){return "What would you like to sell?"},
options:[
  {getText() {return "Goblin Dagger: +2 GP"}, requiredState:(currentState)=>currentState.goblinDagger, setState:{goblinDagger:false}, moneyEvent:gainMoney(2), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Goblin Sword: +7 GP"}, requiredState:(currentState)=>currentState.goblinSword, setState:{goblinSword:false}, moneyEvent:gainMoney(7), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Long Sword: +15 GP"}, requiredState:(currentState)=>currentState.longSword, setState:{longSword:false}, moneyEvent:gainMoney(15), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Dual Swords: +40 GP"}, requiredState:(currentState)=>currentState.dualSword, setState:{dualSword:false}, moneyEvent:gainMoney(40), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Bow +5 GP"}, requiredState:(currentState)=>currentState.bow, setState:{bow:false}, moneyEvent:gainMoney(5), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Arrows(5): 1 GP"}, requiredState:(currentState)=>state.arrows>=5, arrowEvent:loseArrow(5), moneyEvent:gainMoney(1), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Shield: +3 GP"}, requiredState:(currentState)=>currentState.shield, setState:{shield:false}, moneyEvent:gainMoney(3), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Helmet: +3 GP"}, requiredState:(currentState)=>currentState.helmet, setState:{helmet:false}, moneyEvent:gainMoney(3), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Chest Plate: +10 GP"}, requiredState:(currentState)=>currentState.chestPlate, setState:{chestPlate:false}, moneyEvent:gainMoney(10), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Potion of Healing: +20 GP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, moneyEvent:gainMoney(20), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Super Health Potion +25 GP"}, requiredState:(currentState)=>currentState.superHealthPotion, setState:{superHealthPotion:false}, moneyEvent:gainMoney(25), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Empty Bottle: +1 GP"}, requiredState:(currentState)=>currentState.emptyBottle, setState:{emptyBottle:false}, moneyEvent:gainMoney(1), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "lantern: +5 GP"}, requiredState:(currentState)=>currentState.lantern, setState:{lantern:false}, moneyEvent:gainMoney(5), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Flint: +3 GP"}, requiredState:(currentState)=>currentState.flint, setState:{flint:false}, moneyEvent:gainMoney(3), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Mushrooms: +2 GP"}, requiredState:(currentState)=>currentState.mushrooms, setState:{mushrooms:false}, moneyEvent:gainMoney(2), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Berries: +2 GP"}, requiredState:(currentState)=>currentState.berries, setState:{berries:false}, moneyEvent:gainMoney(2), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Fox Hide: +5 GP"}, requiredState:(currentState)=>currentState.foxHide, setState:{foxHide:false}, moneyEvent:gainMoney(5), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Wolf Hide: +8 GP"}, requiredState:(currentState)=>currentState.wolfHide, setState:{wolfHide:false}, moneyEvent:gainMoney(8), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Fox Meat: +4 GP"}, requiredState:(currentState)=>currentState.meat, setState:{meat:false}, moneyEvent:gainMoney(4), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Wolf Meat: +6 GP"}, requiredState:(currentState)=>currentState.wolfMeat, setState:{wolfMeat:false}, moneyEvent:gainMoney(6), nextGameLevel: getNextGameLevel(()=>7.103)},
  {getText() {return "Go back"}, nextGameLevel: getNextGameLevel(()=>7.10)},
]
},
{
  id: 7.102,
  getText() {return "What would you like to buy?"},
  options:[
	{getText() {return "Long Sword: -20 GP"}, requiredState:(currentState)=>state.gp>=20 && state.longSword===undefined,
	moneyEvent:loseMoney(20), setState:{longSword:true},nextGameLevel: getNextGameLevel(()=>7.104)},
	{getText() {return "Chest Plate: -15 GP"}, requiredState:(currentState)=>state.gp>=15 && currentState.chestPlate===undefined,
	moneyEvent:loseMoney(15), setState:{chestPlate:true}, nextGameLevel: getNextGameLevel(()=>7.104)},
	{getText() {return "Go back"}, nextGameLevel: getNextGameLevel(()=>7.10)},
  ]
},
{
  id: 7.103,
  getText() {return "Merchant: \"Here's the GP I owe you.\" \n\n You now have " + state.gp + " GP."},
  options:[
	{getText() {return "Sell"}, nextGameLevel: getNextGameLevel(()=>7.101)},
	{getText() {return "Buy"}, nextGameLevel: getNextGameLevel(()=>7.102)},
	{getText() {return "Leave wandering trader alone"}, nextGameLevel: getNextGameLevel(()=>7.14)}
  ]
},
{
  id:7.104,
  getText() {return "Merchant: \"Thanks for your purchase.\" \n\n You now have " + state.gp + " GP."},
  options:[
	{getText() {return "Sell"}, nextGameLevel: getNextGameLevel(()=>7.101)},
	{getText() {return "Buy"}, nextGameLevel: getNextGameLevel(()=>7.102)},
	{getText() {return "Leave wandering trader alone"}, nextGameLevel: getNextGameLevel(()=>7.14)},
  ]
},
{
  id:7.11,
  getText(){return "You take the path on the right. After a few hours of traveling, you find yourself at the edge of a deep forest. It's almost pitch black, so there's no way\
  you would be able to travel through it without a light source. Not to mention, it looks extremely dangerous!"},
  options:[
	{getText() {return "Use lantern and travel through the forest"}, requiredState:(currentState)=>currentState.lantern, nextGameLevel: getNextGameLevel(()=>8.10)},
	{getText(){return "Go back to the crossroad"}, nextGameLevel: getNextGameLevel(()=>8.11)},
	{getText(){return "Try to find your way through the forest"}, requiredState:(currentState)=>currentState.lantern===undefined, healthEvent(){return loseHealth(10)}, nextGameLevel: getNextGameLevel(()=>8.12,8.121)},
  ]
},
{
  id: 7.12,
  getText(){return "Your slash manages to take down both goblins! The two on your left strike back at you. The other two goblins' blades bounces off your shield, leaving them open. \
  You stab one of the remaining goblins and pierce his arm. That should slow him down!"},
  options:[
	{getText(){return "Maintain a defensive position"}, requiredState:(currentState)=>currentState.emptyBottle, nextGameLevel: getNextGameLevel(()=>8.14)},
	{getText(){return "Attack the injured goblin"}, healthEvent(){return loseHealth(10)}, nextGameLevel: getNextGameLevel(()=>8.15,8.151)},
	{getText(){return "Attack the healthy goblin"}, nextGameLevel: getNextGameLevel(()=>8.16)},
	{getText(){return "Maintain a defensive position and use your potion to heal: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion,
	setState:{healthPotion:false, emptyBottle:true}, healthEvent(){return gainHealth(20)}, nextGameLevel: getNextGameLevel(()=>8.13)},
  ]
},
{
  id: 7.13,
  getText(){return "You slash at the goblins and manage to take down two of them, but one of the goblins manages to land a crushing blow with his mallet. You get sent flying backwards \
  due to the sheer force of the blow."},
  options:[
	{getText(){return "Drink health potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false, emptyBottle:true},
	healthEvent(){return gainHealth(20)}, nextGameLevel: getNextGameLevel(()=>7.132)},
	{getText(){return "Attack the goblin with the mallet"}, healthEvent(){return loseHealth(30)}, nextGameLevel: getNextGameLevel(()=>8.17, 8.17)},
	{getText(){return "Attack the goblin with the sword"}, nextGameLevel: getNextGameLevel(()=>8.18)},
  ]
},
{
  id: 7.131,
  getText(){return "You slash at the goblins, but there are too many of them. They overpower you and begin stabbing your chest. You hear the Goblin King shout out \
  \n\n \"Perhaps you will make better choices in another life, foul human.\""},
  options:[
	{getText(){return "Restart"}, nextGameLevel: getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 7.132,
  getText(){return "You drink your potion and feel much better! The goblins begin to charge at you. \n\n What do you do?"},
  options:[
	{getText(){return "Attack the goblin with the mallet"}, healthEvent(){return loseHealth(30)}, nextGameLevel: getNextGameLevel(()=>8.17, 8.17)},
	{getText(){return "Attack the goblin with the sword"}, nextGameLevel: getNextGameLevel(()=>8.18)},
  ]
},
{
  id: 7.14,
  getText(){return "Trader: \"If you keep going down this path, you'll reach the city of Yolrein soon.\"\n\n \
  You leave the wandering trader alone and continue down the path. After a day, you arrive at Yolrein. Upon first glance, the city looks a bit rundown; its \
  walls have chunks broken off, the gate is worn, and its citizens look impoverished. As you begin to look for lodging, you a beggar approaches you. \
  \n\n Beggar: \"Good sir, could you please spare some coin?\""},
  options:[
	{getText(){return "Give 2 GP to beggar"}, requiredState:(currentState)=>state.gp>=2, moneyEvent:loseMoney(2), nextGameLevel: getNextGameLevel(()=>8.19)},
	{getText(){return "Trade 5 GP for information about the city"}, requiredState:(currentState)=>state.gp>=5, moneyEvent:loseMoney(5), nextGameLevel: getNextGameLevel(()=>8.20)},
	{getText(){return "Shoo, filthy beggar!"}, nextGameLevel: getNextGameLevel(()=>8.21)}
  ]
},
{
  id:8.10,
  getText(){return "You take out your lantern, slowly making your way through the dark forest. As you travel further into the forest, a fog begins to surround you \
  and you begin to move more slowly as to not trip on any of the many tree roots that jut out from the earth. You occassionally hear rustling from behind you, \
  as though you're being followed. You unsheath your sword just in case someone is foolish enough to attack you, but luckily, you seem to be alright for now. \
  \n\n After a couple hours of hiking through the rough terrain, you make your way to a small clearing in the forest."},
  options:[
	{getText(){return "Make camp, start a fire, and search for supplies"}, setState:{mushrooms:true, berries:true, meat:true, foxHide:true}, nextGameLevel: getNextGameLevel(()=>9.10)},
	{getText(){return "Continue hiking"}, nextGameLevel: getNextGameLevel(()=>9.11)},
  ]
},
{
  id: 8.11,
  getText(){return "You take the long hike back to the crossroad. After arriving at the crossroad, you take a day's journey down the other path until you stumble upon a wandering trader. \
  \n\n Trader: \"Would you like to take a look at my wares?\""},
  options:[
	{getText() {return "Buy"}, nextGameLevel: getNextGameLevel(()=>7.102)},
	{getText() {return "Sell"}, nextGameLevel: getNextGameLevel(()=>7.101)},
	{getText() {return "Leave wandering trader alone"}, nextGameLevel: getNextGameLevel(()=>7.14)}
  ]
},
{
  id: 8.12,
  getText(){return "You slowly make your way through the dark forest, occassionally tripping over tree roots. Every so often you hear rustling behind you, but can't see what might be making the noise. \
  You draw your sword just in case. \n\nSuddenly, you're attacked from behind by a wolf! He bites your side, causing serious damage! You swing your sword, cutting the evil beast. \
  He tries to jump at you once more, but you impale him with your sword. After making sure the wolf is dead you collect the wolf meat and wolf hide.\n\n  After a bit more traveling through the dense forest, \
  you come upon a small clearing in the forest"}, setState:{wolfMeat:true, wolfHide:true},
  options:[
	{getText(){return "Make camp and start a campfire"}, setState:{mushrooms:true, berries:true, meat:true, foxHide:true, flint:true},nextGameLevel: getNextGameLevel(()=>9.12)},
	{getText(){return "Continue hiking"}, nextGameLevel: getNextGameLevel(()=>9.11)},
  ]
},
{
  id: 8.13,
  getText(){return "You drink the potion: immediately your wounds heal and you feel much better. \n\n You go on the defensive and wait for the next attack. The healthy goblin charges at you, but you block his attack \
  with your shield, then counter with a thrust of your sword. The goblin sprawls over, blood gushing from his impaled stomach. The injured goblin tries to run away, but you throw your knife and it finds its \
  mark. \n\n Goblin King: \"You won't leave here alive. I'll tear you limb from limb and feed you to my wolves\""},
  options:[
	{getText(){return "Charge at the Goblin King"}, healthEvent(){return loseHealth(25)}, nextGameLevel: getNextGameLevel(()=>9.13,9.131)},
	{getText(){return "Stay on the defensive and wait for his move"}, requiredState:(currentState)=>currentState.shield, healthEvent(){return loseHealth(5)}, nextGameLevel: getNextGameLevel(()=>9.14, 9.141)},
	{getText(){return "Taunt the Goblin King"}, nextGameLevel:getNextGameLevel(()=>9.15)},
  ]
},
{
  id: 8.14,
  getText(){return "You go on the defensive and wait for the next attack. The healthy goblin charges at you, but you block his attack \
  with your shield, then counter with a thrust of your sword. The goblin sprawls over, blood gushing from his impaled stomach. The injured goblin tries to run away, but you throw your knife and it finds its \
  mark. \n\n Goblin King: \"You won't leave here alive. I'll tear you limb from limb and feed you to my wolves\""},
  options:[
	{getText(){return "Charge at the Goblin King"}, healthEvent(){return loseHealth(25)}, nextGameLevel: getNextGameLevel(()=>9.13,9.131)},
	{getText(){return "Stay on the defensive and wait for his move"}, requiredState:(currentState)=>currentState.shield, healthEvent(){return loseHealth(5)}, nextGameLevel: getNextGameLevel(()=>9.14, 9.141)},
	{getText(){return "Taunt the Goblin King"}, nextGameLevel:getNextGameLevel(()=>9.15)},
  ]
},
{
  id: 8.15,
  getText(){return "You charge at the injured goblin and successfully cut off his head; however, the healthy goblin flings his sword at you and it leaves a huge gash in your right arm."},
  options:[
	{getText(){return "Use your potion to heal: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion,
	setState:{healthPotion:false, emptyBottle:true}, healthEvent(){return gainHealth(20)},nextGameLevel: getNextGameLevel(()=>9.16)},
	{getText(){return "Muster all of your strength and attack the healthy goblin"}, nextGameLevel:getNextGameLevel(()=>9.17)},
	{getText(){return "Go on the defensive"}, nextGameLevel:getNextGameLevel(()=>9.18)},
  ]
},
{
  id: 8.16,
  getText(){return "You charge at the healthy goblin and stab it through the heart! The injured goblin tries to flee, but you throw your knife and it goes straight through the goblin's throat. \
  \n\n Goblin King: \"You think you're better than me? I'll kill you, you human prick!\""},
  options:[
	{getText(){return "Go on the defensive and use your potion to heal: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion,
	setState:{healthPotion:false, emptyBottle:true}, healthEvent(){return gainHealth(15)}, nextGameLevel: getNextGameLevel(()=>9.14)},
	{getText(){return "Go on the defense"}, requiredState:(currentState)=>currentState.emptyBottle && currentState.shield, healthEvent(){return loseHealth(5)}, nextGameLevel: getNextGameLevel(()=>9.14)},
	{getText(){return "Charge at the Goblin King"}, healthEvent(){return loseHealth(25)}, nextGameLevel:getNextGameLevel(()=>9.13,9.131)},
	{getText(){return "Taunt the Goblin King"}, nextGameLevel:getNextGameLevel(()=>9.15)},
  ]
},
{
  id: 8.17,
  getText(){return "You attack the goblin with the mallet, but he blocks the attack! You swing again and both weapons clash together, neither one budging. Going unnoticed, you're attacked from \
  behind by the second goblin. He chops your right leg off and you tumble to the ground. \n\n Goblin: \"Perhaps you will make better choices in another life, meatbag!\" \n\n The goblin \
  lifts the mallet above his head and forcefully slams it down. Everything turns black..."},
  options:[
	{getText(){return "Restart"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 8.18,
  getText(){return "You attack the goblin with the sword, but he blocks the attack! You swing again and both weapons clash together, neither one budging. The goblin with the mallet comes up \
  from behind and prepares to swing at you. Luckily, you notice and dodge as he swings his weapon horizontally at you. The mallet hits the second goblin in full force, killing him instantly! \
  As the goblin is trying to recover, you jump on top of him and stab him through the throat with your dagger. He crumples to the ground, lifeless. \n\n \
  Goblin King: \"How dare you! I'll kill you for your insolence!\""},
  options:[
	{getText(){return "Go on the defensive and use your potion to heal: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion,
	setState:{healthPotion:false, emptyBottle:true}, healthEvent(){return gainHealth(15)}, nextGameLevel: getNextGameLevel(()=>9.14)},
	{getText(){return "Go on the defense"}, requiredState:(currentState)=>currentState.emptyBottle && currentState.shield, healthEvent(){return loseHealth(5)}, nextGameLevel: getNextGameLevel(()=>9.14)},
	{getText(){return "Charge at the Goblin King"}, healthEvent(){return loseHealth(25)}, nextGameLevel:getNextGameLevel(()=>9.13,9.131)},
	{getText(){return "Taunt the Goblin King"}, nextGameLevel:getNextGameLevel(()=>9.15)},
  ]
},
{
  id: 8.19,
  getText(){return "Beggar: \n\"Thank ye kindly! Not many folk tryin to help out someone like me! Hey, you seems new to town, so lemme give you some advice. \
  You best go unnoticed by the King of this here land. He be havin his soldiers steal all our belongins, and if we resist... well, I'm \
  sure you's can guess what they'd do."},
  options:[
	{getText(){return "\"Wait, no one tries to stop them?\""}, nextGameLevel:getNextGameLevel(()=>9.20)},
	{getText(){return "\"Thanks for the advice. Now, do you have any idea where an adventurer can find work here?\" \n(Bribe: -5 GP)"}, requiredState:(currentState)=>state.gp>=5,moneyEvent:loseMoney(5), nextGameLevel:getNextGameLevel(()=>9.21)},
	{getText(){return "\"Oh, okay... So... Where can I find lodging?\" \n(Bribe: -5 GP)"}, requiredState:(currentState)=>state.gp>=5, moneyEvent:loseMoney(5), nextGameLevel:getNextGameLevel(()=>9.22)},
	{getText(){return "\"Hmmm. How strange. How can I get an audience with the king?\" \n(Bribe: -5 GP)"}, requiredState:(currentState)=>state.gp>=5, moneyEvent:loseMoney(5), nextGameLevel:getNextGameLevel(()=>9.23)},
  ]
},
{
  id: 8.20,
  getText(){return "Beggar: \"You want to know about the town? Sure! First thing's first, you best go unnoticed by the King of this here land. \
  He be havin his soldiers steal all our belongins, and if we resist... well, I'm sure you's can guess what they'd do.\""},
  options:[
	{getText(){return "\"Wait, no one tries to stop them?\""}, nextGameLevel:getNextGameLevel(()=>9.201)},
	{getText(){return "\"Thanks for the advice. Now, do you have any idea where an adventurer can find work here?\""}, nextGameLevel:getNextGameLevel(()=>9.21)},
	{getText(){return "\"Oh, okay... So... Where can I find lodging?\""}, nextGameLevel:getNextGameLevel(()=>9.22)},
	{getText(){return "\"Hmmm. How strange. How can I get an audience with the king?\""}, nextGameLevel:getNextGameLevel(()=>9.23)},
  ]
},
{
  id: 8.21,
  getText(){return "The beggar spits at you as he walks away empty handed. \n\n You continue walking down the streets, trying to find some lodging. After a bit \
  of searching, you stumble upon an inn. \n\n You: \"Bernice's Comfortable Inn? Huh, this could be promising.\" \n\n You go inside and look around.\
  Past the service counter, you see a fully stocked bar and fire hearth. In the corner is a group of adventurers swapping tales of their conquests while drinking pints of honeysuckle mead. You \
  overhear them mention something about an Adventurer's guild in town. You'll have to look into that later, you think to yourself. You turn and see a middle-aged woman walking \
  behind the service counter. \n\n Woman: \"Hi, I'm the innkeeper, Bernice. Can I get you some lodging? Only 2 GP for a room or 8 GP for a room with an all-you-can-drink bar pass. \
  If you don't have enough money, there's a merchant down the street that you can sell some stuff to, or the Adventurer's Guild you can make some coin from. \""},
  options:[
	{getText(){return "\"No thanks.\" Leave the inn"}, nextGameLevel:getNextGameLevel(()=>9.24)},
	{getText(){return "\"I'll take the room.\" (-2 GP)"}, requiredState:(currentState)=>state.gp>=2 && currentState.roomKey===undefined, moneyEvent:loseMoney(2), setState:{roomKey:true}, nextGameLevel:getNextGameLevel(()=>9.25)},
	{getText(){return "\"I'll take the room and bar pass.\" (-8 GP)"}, requiredState:(currentState)=>state.gp>=8 && currentState.roomKey===undefined, moneyEvent:loseMoney(8), setState:{roomKey:true, barPass:true}, nextGameLevel:getNextGameLevel(()=>9.26)},
  {getText(){return "\"I'll take the bar pass\" (-5 GP)"}, requiredState:(currentState)=>state.gp>=5 && currentState.barPass===undefined, moneyEvent:loseMoney(5), setState:{roomKey:true, barPass:true}, nextGameLevel:getNextGameLevel(()=>9.261)},
  {getText(){return "\"What can you tell me about the town?\""},requiredState:(currentState)=>currentState.resistanceRumor===undefined, nextGameLevel:getNextGameLevel(()=>9.27)},
  ]
},
{
  id:8.211,
  getText(){return "You continue walking down the streets, trying to find some lodging. After a bit \
  of searching, you stumble upon an inn. \n\n You: \"Bernice's Comfortable Inn? Huh, this could be promising.\" \n\n You go inside and look around.\
  Past the service counter, you see a fully stocked bar and fire hearth. In the corner is a group of adventurers swapping tales of their conquests while drinking pints of honeysuckle mead. You \
  overhear them mention something about an Adventurer's guild in town. You'll have to look into that later, you think to yourself. You turn and see a middle-aged woman walking \
  behind the service counter. \n\n Woman: \"Hi, I'm the innkeeper, Bernice. Can I get you some lodging? Only 2 GP for a room or 8 GP for a room with an all-you-can-drink bar pass. \
  If you don't have enough money, there's a merchant down the street that you can sell some stuff to, or the Adventurer's Guild you can make some coin from. \""},
  options:[
	{getText(){return "\"No thanks.\" Leave the inn"}, nextGameLevel:getNextGameLevel(()=>9.24)},
	{getText(){return "\"I'll take the room.\" (-2 GP)"}, requiredState:(currentState)=>state.gp>=2 && currentState.roomKey===undefined, moneyEvent:loseMoney(2), setState:{roomKey:true}, nextGameLevel:getNextGameLevel(()=>9.25)},
	{getText(){return "\"I'll take the room and bar pass.\" (-8 GP)"}, requiredState:(currentState)=>state.gp>=8 && currentState.roomKey===undefined, moneyEvent:loseMoney(8), setState:{roomKey:true, barPass:true}, nextGameLevel:getNextGameLevel(()=>9.26)},
  {getText(){return "\"I'll take the bar pass.\" (-5 GP)"}, requiredState:(currentState)=>state.gp>=5 && currentState.barPass===undefined, moneyEvent:loseMoney(5), setState:{barPass:true}, nextGameLevel:getNextGameLevel(()=>9.261)},
  {getText(){return "\"What can you tell me about the town?\""}, requiredState:(currentState)=>currentState.resistanceRumor===undefined, nextGameLevel:getNextGameLevel(()=>9.27)},
  ]
},
{
  id:9.10,
  getText(){return "You spend an hour or so building a nice campsite and place to sleep, along with using the flame from your lantern to be the start of a warm campfire. \
  After starting the fire, you decide it would be best to hunt for wild game and forage. So you travel a little ways into the forest, occassionally marking a tree with your knife \
  in order to find your way back. You end up finding a decent amount of mushrooms and berries during your foraging excursion, so you decide to use some of it for a trap. \n\n You \
  find some thick vines in the forest and use that to create a bowline knot, which is ideal for trapping small game. Once the knot is created and in place, you lay some of the \
  berries and mushrooms in the center of your trap. After a couple hours of waiting and staying perfectly still, you see a fox creeping up to the trap and start to grab some of the berries... \
  \n\nYou take the remaining berries, mushrooms, and the fox carcass back to camp. Once you get back to camp, you begin to clean the fox and then store the foxhide away to either sell or use later."},
  options:[
	{getText(){return "cook the fox meat and mushrooms, then enjoy the tasty meal"}, healthEvent(){return gainHealth(15)}, setState:{mushrooms:false, meat:false}, nextGameLevel:getNextGameLevel(()=>10.10)},
	{getText(){return "Eat the fox meat"}, healthEvent(){return loseHealth(3)}, setState:{meat:false}, nextGameLevel:getNextGameLevel(()=>10.11,10.111)},
	{getText(){return "Eat the berries"}, healthEvent(){return gainHealth(5)}, setState:{berries:false}, nextGameLevel:getNextGameLevel(()=>10.10)},
	{getText(){return "Go to bed"}, healthEvent(){return gainHealth(10)}, nextGameLevel:getNextGameLevel(()=>10.13)},
  ]
},
{
  id: 9.11,
  getText(){return "You decide not to make camp and continue on through the dark forest. After a few more hours of hiking, you become fatigued and decide to rest. You find a comfy looking log and rest your \
  head on it. \n\n *GRRRRRRR* \n\n You jolt up, awakened by the snarling only to be face-to-face with the largest wolf you've ever seen. You try to draw your sword, but you're too late. The wolf lunges \
  toward your neck, ripping you to shreds. Perhaps you will make better choices in your next life."},
  options:[
	{getText(){return "Reset"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 9.12,
  getText(){return "You spend an hour or so building a nice campsite and place to sleep, You decide it would be best to hunt for wild game and forage. So you travel a little ways into the forest, \
  occassionally marking a tree with your knife in order to find your way back. You end up finding a decent amount of mushrooms and berries during your foraging excursion, \
  so you decide to use some of it for a trap. While finding a good spot to make a trap, you find some flint on the ground. This will be helpful for starting a fire! \
  \n\n You find some thick vines in the forest and use that to create a bowline knot, which is ideal for trapping small game. Once the knot is created and in place, you lay some of the \
  berries and mushrooms in the center of your trap. After a couple hours of waiting and staying perfectly still, you see a fox creeping up to the trap and start to grab some of the berries... \
  \n\nYou take the remaining berries, mushrooms, and the fox carcass back to camp. Once you get back to camp, you begin to clean the fox and then store the foxhide away to either sell or use later."},
  options:[
	{getText(){return "Eat the fox meat and wolf meat"}, healthEvent(){return loseHealth(3)}, setState:{meat:false, wolfMeat:false}, nextGameLevel:getNextGameLevel(()=>10.11, 10.111)},
	{getText(){return "Eat the berries"}, healthEvent(){return gainHealth(5)}, setState:{berries:false}, nextGameLevel:getNextGameLevel(()=>10.10)},
	{getText(){return "Go to bed"}, healthEvent(){return gainHealth(10)}, nextGameLevel:getNextGameLevel(()=>10.13)},
	{getText(){return "Start a campfire"}, requiredState:(currentState)=>currentState.flint, setState:{flint:false}, nextGameLevel:getNextGameLevel(()=>10.14)},
  ]
},
{
  id: 9.13,
  getText(){return "You charge at the Goblin King, sword poised to slash his throat. Before you can react, the Goblin King draws two swords, using one to block the oncoming attack and the other to thrust through \
  you stomach. He withdraws his sword from your stomach and front-kicks you to the ground. Somehow you're still alive..."},
  options:[
	{getText(){return "Go on the defensive and use your potion to heal: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion,
	setState:{healthPotion:false, emptyBottle:true}, healthEvent(){return gainHealth(20)},nextGameLevel: getNextGameLevel(()=>10.15)},
	{getText(){return "Taunt the Goblin King"}, nextGameLevel:getNextGameLevel(()=>9.15)},
	{getText(){return "Draw your dagger and throw it at the Goblin King"}, healthEvent(){return loseHealth(50)}, nextGameLevel:getNextGameLevel(()=>10.17)},
  ]
},
{
  id: 9.131,
  getText(){return "You charge at the Goblin King, sword poised to slash his throat. Before you can react, the Goblin King draws two swords, using one to block the oncoming attack and the other to thrust through \
  you stomach. He withdraws his sword from your stomach and front-kicks you to the ground. \n\n Goblin King: \"Perhaps, you will make better choices in another life, feeble human!\" \n\nYour vision \
  begins to blur and the room slowly fades to black..."},
  options:[
	{getText(){return "Restart"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 9.14,
  getText(){return "The Goblin King draws two swords and charges at you. You lift up your shield and manage to block the brunt of the attack, although the tip of one of his blades manages to cut your left shoulder. \
  You use your shield and push him back, causing him to stumble. You launch a counter-attack and cut one of his hands off! \n\n Goblin King: \"AAAAARGH! I'll kill you for that, you \
  filthy insect!\" \n\n The Goblin King lifts his sword above his head and swings the blade vertically at you..."},
  options:[
	{getText(){return "duck below the sword and stab him through the heart"}, nextGameLevel:getNextGameLevel(()=>10.18)},
	{getText(){return "block the attack with your shield and stab him through the heart"}, requiredState:(currentState)=>currentState.shield, setState:{shield:false}, nextGameLevel:getNextGameLevel(()=>10.19)},
  ]
},
{
  id: 9.141,
  getText(){return "The Goblin King draws two swords and charges at you. You lift up your shield and manage to block one of the swords, but the other cuts part of your leg. You fall to the floor writhing in pain. \
  \n\n Goblin King: \"You were a worthy opponent. In fact, you had might have actually beaten me if you had made better choices. Oh well, perhaps you will make better choices in another life.\""},
  options:[
	{getText(){return "Restart"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 9.15,
  getText(){return "You: \"Your mother was a hampster and your father smelt of elderberries!\" \n\n Goblin King: \"How dare you talk about my mother that way! She was the best Goblin Queen who ever \
  existed! How dare you insinuate she was a rodent!\" \n\n In a fury, the Goblin King launches himself at you! He grabs ahold of your neck and begins choking the life out of you. Luckily, you've \
  planned for this and take the dagger that was hidden behind your back and shove it into his skull. The lifeless Goblin King drops to the floor. \n\n You look around the room \
  and notice behind the Goblin King's throne, there are some chests."},
  options:[
	{getText(){return "Continue"}, nextGameLevel:getNextGameLevel(()=>10.20)},
  ]
},
{
  id: 9.16,
  getText(){return "All of your injuries were healed immediately after drinking the potion. You don't have much time to breathe though as the healthy goblin starts running to pick up his sword."},
  options:[
	{getText(){return "Slash the injured goblin"}, nextGameLevel:getNextGameLevel(()=>10.21)},
	{getText(){return "Throw your dagger at the goblin"}, nextGameLevel:getNextGameLevel(()=>10.22)},
  ]
},
{
  id: 9.17,
  getText(){return "Using all of the effort you can muster, you swing your sword at the goblin. Unfortunately, he was much quicker and dodged the attack, leaving your side vulnerable. \
  He jumps towards you and rips the sword out of your hand. You feel a sharp pain in your chest. Looking down, you see that the goblin had run you through with your own sword. \
  \n\n Goblin: \"Ha! I finally got the best of you, scum. Perhaps you will make better choices in another life.\""},
  options:[
	{getText(){return "Restart"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id:9.18,
  getText(){return "You rush over to where his sword is and hold your position. Enraged, the goblin starts charging toward you and begins using his claws to slash at you. You dodge a few of his slash attacks, but \
  he manages to pick up his sword. He unleashes a fury of attacks at you until one of them lands, cutting through your head. \n\n Goblin: \"Perhaps you will make better choices in another life.\""},
  options:[
	{getText(){return "Restart"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 9.20,
  getText(){return "Beggar: \"Not really much ya can do to 'em. Usually anyone who done tried resistin 'em got hung. Although, I've heard folks talkin lately 'bout \
  some sorta resistance formin. Don't know where you can find 'em though. Got any more questions for me?\""},
  options:[
	{getText(){return "\"Do you have any idea where an adventurer can find work here?\" \n(Bribe: -5 GP)"}, requiredState:(currentState)=>state.gp>=5,moneyEvent:loseMoney(5), nextGameLevel:getNextGameLevel(()=>9.21)},
	{getText(){return "\"Where can I find lodging?\" \n(Bribe: -5 GP)"}, requiredState:(currentState)=>state.gp>=5, moneyEvent:loseMoney(5), nextGameLevel:getNextGameLevel(()=>9.22)},
	{getText(){return "\"How can I get an audience with the king?\" \n(Bribe: -5 GP)"}, requiredState:(currentState)=>state.gp>=5, moneyEvent:loseMoney(5), nextGameLevel:getNextGameLevel(()=>9.23)},
	{getText(){return "Leave beggar alone"}, nextGameLevel:getNextGameLevel(()=>9.28)},
  ]
},
{
  id: 9.201,
  getText(){return "Beggar: \"Not really much ya can do to 'em. Usually anyone who done tried resistin 'em got hung. Although, I've heard folks talkin lately 'bout \
  some sorta resistance formin. Don't know where you can find 'em though. Got any more questions for me?\""},
  options:[
	{getText(){return "\"Do you have any idea where an adventurer can find work here?\""},nextGameLevel:getNextGameLevel(()=>9.21)},
	{getText(){return "\"Where can I find lodging?\""}, nextGameLevel:getNextGameLevel(()=>9.22)},
	{getText(){return "\"How can I get an audience with the king?\""},nextGameLevel:getNextGameLevel(()=>9.23)},
	{getText(){return "Leave beggar alone"}, nextGameLevel:getNextGameLevel(()=>9.28)},
  ]
},
{
  id: 9.21,
  getText(){return "Beggar: \"Sure! You can find you some work down at the adventurin guild. You can find'em a few blocks away, right behind Bernice's place. Anythin else you wanna know?\""},
  options:[
	{getText(){return "\"Wait, no one tries to stop the soldiers from stealing?\""}, nextGameLevel:getNextGameLevel(()=>9.201)},
	{getText(){return "\"Where can I find lodging?\""}, nextGameLevel:getNextGameLevel(()=>9.22)},
	{getText(){return "\"How can I get an audience with the king?\""},nextGameLevel:getNextGameLevel(()=>9.23)},
	{getText(){return "Leave beggar alone"}, nextGameLevel:getNextGameLevel(()=>9.28)},
  ]
},
{
  id: 9.22,
  getText(){return "Beggar: \"Oh yeah, an adventurer like you be needin a place to rest, huh? Well, 'aint no better place than Bernice's. Just \
  go straight down this here road for a few blocks and you'll see her place on the right.\""},
  options:[
	{getText(){return "\"Wait, no one tries to stop the soldiers from stealing?\""}, nextGameLevel:getNextGameLevel(()=>9.201)},
	{getText(){return "\"Do you have any idea where an adventurer can find work here?\""},nextGameLevel:getNextGameLevel(()=>9.21)},
	{getText(){return "\"How can I get an audience with the king?\""},nextGameLevel:getNextGameLevel(()=>9.23)},
	{getText(){return "Leave beggar alone"}, nextGameLevel:getNextGameLevel(()=>9.28)},
  ]
},
{
  id: 9.23,
  getText(){return "Beggar: \"Don't know why you'd wanna do that. Just told you he was a big, theivin bully! Besides, if I knew how to getta audience \
  with his royal jerkness, I wouldn't be beggin you for coin, now would I?\""},
  options:[
	{getText(){return "\"Wait, no one tries to stop the soldiers from stealing?\""}, nextGameLevel:getNextGameLevel(()=>9.201)},
	{getText(){return "\"Do you have any idea where an adventurer can find work here?\""},nextGameLevel:getNextGameLevel(()=>9.21)},
	{getText(){return "\"Where can I find lodging?\""}, nextGameLevel:getNextGameLevel(()=>9.22)},
	{getText(){return "Leave beggar alone"}, nextGameLevel:getNextGameLevel(()=>9.28)},
  ]
},
{
  id: 9.24,
  getText(){return "You leave the inn. \n\n Where do you want to go?"},
  options:[
	{getText(){return "Go to the town merchant"}, nextGameLevel:getNextGameLevel(()=>10.23)},
	{getText(){return "Go to the Adventurer's Guild"}, nextGameLevel:getNextGameLevel(()=>10.24)},
	{getText(){return "Go to the Royal Library"}, requiredState:(currentState)=>currentState.libraryPass, nextGameLevel:getNextGameLevel(()=>11.15)},
	{getText(){return "Leave the city to kill the Skeletons"}, requiredState:(currentState)=>currentState.skeletonQuest && currentState.mageStaff===undefined, nextGameLevel:getNextGameLevel(()=>12.15)},
	{getText(){return "Leave the city to kill the Stone Golem"}, requiredState:(currentState)=>currentState.golemQuest && currentState.obsidianEye===undefined, nextGameLevel:getNextGameLevel(()=>12.16)},
  ]
},
{
  id: 9.25,
  getText(){return "Bernice hands over the room key and you give her 2 GP. What do you want to do now?"},
  options:[
	{getText(){return "Get a good night's sleep: +10 HP"}, healthEvent(){return gainHealth(10)}, setState:{roomKey:false}, nextGameLevel:getNextGameLevel(()=>10.25)},
	{getText(){return "Go to the Adventurer's Guild"}, nextGameLevel:getNextGameLevel(()=>10.24)},
	{getText(){return "Go to the town merchant"}, nextGameLevel:getNextGameLevel(()=>10.23)},
  ]
},
{
  id: 9.26,
  getText(){return "Bernice hands over the room key and the bar pass, then you give her 8 GP. What do you want to do now?"},
  options:[
	{getText(){return "Get a good night's sleep: +10 HP"}, healthEvent(){return gainHealth(10)}, setState:{roomKey:false}, nextGameLevel:getNextGameLevel(()=>10.25)},
	{getText(){return "Go to the bar and have a drink: +3 HP"}, healthEvent(){return gainHealth(3)}, setState:{barPass:false}, nextGameLevel:getNextGameLevel(()=>10.26)},
	{getText(){return "Go to the Adventurer's Guild"}, nextGameLevel:getNextGameLevel(()=>10.24)},
	{getText(){return "Go to the town merchant"}, nextGameLevel:getNextGameLevel(()=>10.23)},
	{getText(){return "Go to the Royal Library"}, requiredState:(currentState)=>currentState.libraryPass, nextGameLevel:getNextGameLevel(()=>11.15)},
	{getText(){return "Leave the city to kill the Skeletons"}, requiredState:(currentState)=>currentState.skeletonQuest && currentState.mageStaff===undefined, nextGameLevel:getNextGameLevel(()=>12.15)},
	{getText(){return "Leave the city to kill the Stone Golem"}, requiredState:(currentState)=>currentState.golemQuest && currentState.obsidianEye===undefined, nextGameLevel:getNextGameLevel(()=>12.16)},
  ]
},
{
  id: 9.261,
  getText(){return "Bernice hands over the bar pass, then you give her 8 GP. What do you want to do now?"},
  options:[
	{getText(){return "Get a good night's sleep: +10 HP"}, requiredState:(currentState)=>currentState.roomKey===undefined,healthEvent(){return gainHealth(10)}, setState:{roomKey:false}, nextGameLevel:getNextGameLevel(()=>10.25)},
	{getText(){return "Go to the bar and have a drink: +3 HP"}, requiredState:(currentState)=>currentState.barPass===undefined, healthEvent(){return gainHealth(3)}, setState:{barPass:false}, nextGameLevel:getNextGameLevel(()=>10.26)},
	{getText(){return "Go to the Adventurer's Guild"}, nextGameLevel:getNextGameLevel(()=>10.24)},
	{getText(){return "Go to the town merchant"}, nextGameLevel:getNextGameLevel(()=>10.23)},
	{getText(){return "Go to the Royal Library"}, requiredState:(currentState)=>currentState.libraryPass, nextGameLevel:getNextGameLevel(()=>11.15)},
	{getText(){return "Leave the city to kill the Skeletons"}, requiredState:(currentState)=>currentState.skeletonQuest && currentState.mageStaff===undefined, nextGameLevel:getNextGameLevel(()=>12.15)},
	{getText(){return "Leave the city to kill the Stone Golem"}, requiredState:(currentState)=>currentState.golemQuest && currentState.obsidianEye===undefined, nextGameLevel:getNextGameLevel(()=>12.16)},
  ]
},
{
  id: 9.27,
  getText(){return "Bernice: \"Just... Watch out for the soldiers. If they spot you alone, they might try to rob you. The King and his soldiers are nothing more than \
  a bunch of thugs, but we put up with it because they'd hang us if we ever tried to rebel. The townspeople have tried getting the Adventurer's Guild \
  involved, but it doesn't seem like they're really compelled to do much. Although, I have heard rumors of \
  some of them forming a resistance. \n\n Now, are you looking to get a room?"}, setState:{resistanceRumor:true},
  options:[
	{getText(){return "\"No thanks.\" Leave the inn"}, nextGameLevel:getNextGameLevel(()=>9.24)},
	{getText(){return "\"I'll take the room.\" (-2 GP)"}, requiredState:(currentState)=>state.gp>=2 && currentState.roomKey===undefined, moneyEvent:loseMoney(2), setState:{roomKey:true}, nextGameLevel:getNextGameLevel(()=>9.25)},
	{getText(){return "\"I'll take the room and bar pass.\" (-8 GP)"}, requiredState:(currentState)=>state.gp>=8 && currentState.roomKey===undefined, moneyEvent:loseMoney(8), setState:{roomKey:true, barPass:true}, nextGameLevel:getNextGameLevel(()=>9.26)},
  {getText(){return "\"I'll take the bar pass.\" (-5 GP)"}, requiredState:(currentState)=>state.gp>=5 && currentState.barPass===undefined, moneyEvent:loseMoney(8), setState:{barPass:true}, nextGameLevel:getNextGameLevel(()=>9.261)},
  ]
},
{
  id: 9.28,
  getText(){return "Where do you want to go?"},
  options:[
	{getText(){return "Bernice's Comfortable Inn"}, nextGameLevel:getNextGameLevel(()=>8.211)},
	{getText(){return "The town's local merchant"}, nextGameLevel:getNextGameLevel(()=>10.23)},
	{getText(){return "The Adventurer's Guild"}, nextGameLevel:getNextGameLevel(()=>10.24)},
	{getText(){return "The Royal Library"}, requiredState:(currentState)=>currentState.libraryPass, nextGameLevel:getNextGameLevel(()=>11.15)},
	{getText(){return "Leave the city to kill the Skeletons"}, requiredState:(currentState)=>currentState.skeletonQuest, nextGameLevel:getNextGameLevel(()=>12.15)},
	{getText(){return "Leave the city to kill the Stone Golem"}, requiredState:(currentState)=>currentState.golemQuest, nextGameLevel:getNextGameLevel(()=>12.16)},,
  ]
},
{
  id: 10.10,
  getText(){return "That meal was absolutely delicious! You feel a lot stronger now. What do you want to do next?"},
  options:[
	{getText(){return "Eat the berries"}, requiredState:(currentState)=>currentState.berries, healthEvent(){return gainHealth(5)}, setState:{berries:false}, nextGameLevel:getNextGameLevel(()=>10.10)},
	{getText(){return "cook the fox meat and mushrooms, then enjoy the tasty meal"}, requiredState:(currentState)=>currentState.meat && currentState.flint===undefined,
	healthEvent(){return gainHealth(15)},setState:{mushrooms:false, meat:false}, nextGameLevel:getNextGameLevel(()=>10.10)},
	{getText(){return "Eat the fox meat"}, healthEvent(){return loseHealth(3)},requiredState:(currentState)=>currentState.meat, setState:{meat:false}, nextGameLevel:getNextGameLevel(()=>10.11, 10.111)},
	{getText(){return "Start a campfire"}, requiredState:(currentState)=>currentState.flint, setState:{flint:false}, nextGameLevel:getNextGameLevel(()=>10.14)},
	{getText(){return "Go to bed"}, healthEvent(){return gainHealth(10)}, nextGameLevel:getNextGameLevel(()=>10.13)},
  ]
},
{
  id: 10.11,
  getText(){return "Eating the raw meat was a terrible idea! You've been throwing up for the past hour and you feel a lot weaker. What do you do next?"},
  options:[
	{getText(){return "Eat the berries"}, requiredState:(currentState)=>currentState.berries, healthEvent(){return gainHealth(5)}, setState:{berries:false}, nextGameLevel:getNextGameLevel(()=>10.10)},
	{getText(){return "Eat the mushrooms"}, requiredState:(currentState)=>currentState.mushrooms, healthEvent(){return gainHealth(3)},
	setState:{mushrooms:false,}, nextGameLevel:getNextGameLevel(()=>10.10)},
	{getText(){return "Start a campfire"}, requiredState:(currentState)=>currentState.flint, setState:{flint:false}, nextGameLevel:getNextGameLevel(()=>10.14)},
	{getText(){return "Go to bed"}, healthEvent(){return gainHealth(10)}, nextGameLevel:getNextGameLevel(()=>10.13)},
  ]
},
{
  id: 10.111,
  getText(){return "Eating the raw meat was a terrible idea! You've been throwing up for the past hour and now you've come down with some kind of illness. You begin writhing \
  in pain. Everything slowly fades to black... \n\n Perhaps you will make better choices in your next life."},
  options:[
	{getText(){return "Reset"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 10.13,
  getText(){return "You go to sleep in the bed of leaves that you made earlier in the day and fall fast asleep. You wake up feeling extremely well rested and decide to continue hiking through the forest. \
  After traveling for a couple of hours, you finally make it out of the forest! You pick up your pace, eager to get to whatever lies ahead. While traveling on the road, you meet a wandering merchant. \n\n \
  Merchant: \"Hello! Would you like to take a look at my wares or sell me some of yours?\""},
  options:[
	{getText(){return "Buy"}, nextGameLevel:getNextGameLevel(()=>11.12)},
	{getText(){return "Sell"}, nextGameLevel:getNextGameLevel(()=>11.11)},
	{getText(){return "Leave merchant alone"}, nextGameLevel:getNextGameLevel(()=>11.13)},
  ]
},
{
  id: 10.14,
  getText(){return "You use the flint you acquired to start a campfire. What do you want to do now?"},
  options:[
	{getText(){return "Eat the berries"}, requiredState:(currentState)=>currentState.berries, healthEvent(){return gainHealth(5)}, setState:{berries:false}, nextGameLevel:getNextGameLevel(()=>10.10)},
	{getText(){return "cook the fox meat, wolf meat, and mushrooms, then enjoy the tasty meal"}, requiredState:(currentState)=>currentState.meat && currentState.flint===undefined && currentState.wolfMeat,
	healthEvent(){return gainHealth(20)},setState:{mushrooms:false, meat:false, wolfMeat:false}, nextGameLevel:getNextGameLevel(()=>10.10)},
	{getText(){return "Eat the fox and wolf meat"}, healthEvent(){return loseHealth(6)},requiredState:(currentState)=>currentState.meat && currentState.wolfMeat, setState:{meat:false, wolfMeat:false}, nextGameLevel:getNextGameLevel(()=>10.11,10.111)},
	{getText(){return "Go to bed"}, healthEvent(){return gainHealth(10)}, nextGameLevel:getNextGameLevel(()=>10.13)},
  ]
},
{
  id: 10.15,
  getText(){return "The Goblin King draws two swords and charges at you. You lift up your sword and manage to block the brunt of the attack, although the tip of one of his blades manages to cut your left shoulder. \
  You put all of your weight into a front kick, causing him to stumble. You launch a counter-attack and cut one of his hands off! \n\n Goblin King: \"AAAAARGH! I'll kill you for that, you \
  filthy insect!\" \n\n The Goblin King lifts his sword above his head and swings the blade vertically at you..."},
  options:[
	{getText(){return "duck below the sword and stab him through the heart"}, nextGameLevel:getNextGameLevel(()=>10.18)},
	{getText(){return "block the attack with your shield and stab him through the heart"}, requiredState:(currentState)=>currentState.shield, setState:{shield:false}, nextGameLevel:getNextGameLevel(()=>10.19)},
  ]
},
{
  id: 10.17,
  getText(){return "The Goblin King draws two swords and charges at you. You take your dagger out, aim carefully, and throw it with all your might! "},
  options:[
	{getText(){return "duck below the sword and stab him through the heart"}, nextGameLevel:getNextGameLevel(()=>10.18)},
	{getText(){return "block the attack with your shield and stab him through the heart"}, requiredState:(currentState)=>currentState.shield, setState:{shield:false}, nextGameLevel:getNextGameLevel(()=>10.19)},
  ]
},
{
  id:10.20,
  getText(){return "Now that you've defeated the Goblin King, what do you want to do?"},
  options:[
	{getText(){return "Cut off the Goblin King's head and bring it with you"}, requiredState:(currentState)=>currentState.goblinKingHead===undefined, setState:{goblinKingHead:true}, nextGameLevel:getNextGameLevel(()=>11.101)},
	{getText(){return "Loot all of the corpses"}, requiredState:(currentState)=>currentState.dualSword===undefined, setState:{dualSword:true, chestPlate:true}, moneyEvent:gainMoney(50), nextGameLevel:getNextGameLevel(()=>11.102)},
	{getText(){return "Raid the goblins' chests"}, requiredState:(currentState)=>currentState.sapphire===undefined, setState:{sapphire:true, diamond:true, emerald:true, ruby:true},
	moneyEvent:gainMoney(30), nextGameLevel:getNextGameLevel(()=>11.103)},
	{getText(){return "Go back through the hidden passageway and out the door in the corner of the previous room"}, nextGameLevel:getNextGameLevel(()=>6.10)},
  ]
},
{
  id:10.21,
  getText(){return "You slash the charging goblin as he jumps toward you, claws ready to rip you to shreds. The blade cuts right through his neck, killing him instantly. \n\n Goblin King: \"I'll\
  kill you for that! How dare you kill Gunter like that! He deserved better, but you don't! I'll rip you're head off! \""},
  options:[
	{getText(){return "Go on the defensive and use your potion to heal: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion,
	setState:{healthPotion:false, emptyBottle:true}, healthEvent(){return gainHealth(15)}, nextGameLevel: getNextGameLevel(()=>9.14)},
	{getText(){return "Go on the defense"}, requiredState:(currentState)=>currentState.emptyBottle && currentState.shield, healthEvent(){return loseHealth(5)}, nextGameLevel: getNextGameLevel(()=>9.14)},
	{getText(){return "Charge at the Goblin King"}, healthEvent(){return loseHealth(25)}, nextGameLevel:getNextGameLevel(()=>9.13,9.131)},
	{getText(){return "Taunt the Goblin King"}, nextGameLevel:getNextGameLevel(()=>9.15)},
  ]
},
{
  id:10.22,
  getText(){return "You throw your dagger at the charging goblin as he jumps toward you, claws ready to rip you to shreds. Unfortunately, your blade barely misses its target, but the \
  goblin's claws don't. He stabs your throat with his razor-sharp claws, killing you instantly. \n\n Perhaps you will make better choices in your next life."},
  options:[
	{getText(){return "Return"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id:10.23,
  getText(){return "You make your way to the merchant's shop. \n\n Merchant: \"Hi, what can I help you with today?\""},
  options:[
	{getText() {return "Buy"}, nextGameLevel: getNextGameLevel(()=>10.232)},
	{getText() {return "Sell"}, nextGameLevel: getNextGameLevel(()=>10.231)},
	{getText() {return "Leave merchant alone"}, nextGameLevel: getNextGameLevel(()=>10.233)}
  ]
},
{
  id:10.231,
  getText(){return "Merchant: \"Sure, what do you want to sell to me?\""},
  options:[
	{getText() {return "Goblin Dagger: +2 GP"}, requiredState:(currentState)=>currentState.goblinDagger, setState:{goblinDagger:false}, moneyEvent:gainMoney(2), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Goblin Sword: +7 GP"}, requiredState:(currentState)=>currentState.goblinSword, setState:{goblinSword:false}, moneyEvent:gainMoney(7), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Long Sword: +15 GP"}, requiredState:(currentState)=>currentState.longSword, setState:{longSword:false}, moneyEvent:gainMoney(15), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Dual Swords: +40 GP"}, requiredState:(currentState)=>currentState.dualSword, setState:{dualSword:false}, moneyEvent:gainMoney(40), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Bow +5 GP"}, requiredState:(currentState)=>currentState.bow, setState:{bow:false}, moneyEvent:gainMoney(5), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Arrows(5): 1 GP"}, requiredState:(currentState)=>state.arrows>=5, arrowEvent:loseArrow(5), moneyEvent:gainMoney(1), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Shield: +3 GP"}, requiredState:(currentState)=>currentState.shield, setState:{shield:false}, moneyEvent:gainMoney(3), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Helmet: +3 GP"}, requiredState:(currentState)=>currentState.helmet, setState:{helmet:false}, moneyEvent:gainMoney(3), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Chest Plate: +10 GP"}, requiredState:(currentState)=>currentState.chestPlate, setState:{chestPlate:false}, moneyEvent:gainMoney(10), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Potion of Healing: +20 GP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, moneyEvent:gainMoney(20), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Super Health Potion +25 GP"}, requiredState:(currentState)=>currentState.superHealthPotion, setState:{superHealthPotion:false}, moneyEvent:gainMoney(25), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Empty Bottle: +1 GP"}, requiredState:(currentState)=>currentState.emptyBottle, setState:{emptyBottle:false}, moneyEvent:gainMoney(1), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "lantern: +5 GP"}, requiredState:(currentState)=>currentState.lantern, setState:{lantern:false}, moneyEvent:gainMoney(5), nextGameLevel: getNextGameLevel(()=>10.234)},
  {getText() {return "Pickaxe: +10 GP"}, requiredState:(currentState)=>currentState.pickaxe, setState:{pickaxe:false}, moneyEvent:gainMoney(10), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Flint: +3 GP"}, requiredState:(currentState)=>currentState.flint, setState:{flint:false}, moneyEvent:gainMoney(3), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Mushrooms: +2 GP"}, requiredState:(currentState)=>currentState.mushrooms, setState:{mushrooms:false}, moneyEvent:gainMoney(2), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Berries: +2 GP"}, requiredState:(currentState)=>currentState.berries, setState:{berries:false}, moneyEvent:gainMoney(2), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Fox Hide: +5 GP"}, requiredState:(currentState)=>currentState.foxHide, setState:{foxHide:false}, moneyEvent:gainMoney(5), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Wolf Hide: +8 GP"}, requiredState:(currentState)=>currentState.wolfHide, setState:{wolfHide:false}, moneyEvent:gainMoney(8), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Fox Meat: +4 GP"}, requiredState:(currentState)=>currentState.meat, setState:{meat:false}, moneyEvent:gainMoney(4), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Wolf Meat: +6 GP"}, requiredState:(currentState)=>currentState.wolfMeat, setState:{wolfMeat:false}, moneyEvent:gainMoney(6), nextGameLevel: getNextGameLevel(()=>10.234)},
	{getText() {return "Go back"}, nextGameLevel: getNextGameLevel(()=>7.10)},
  ]
},
{
  id:10.232,
  getText(){return "Merchant: \"Sure, have a look at my wares\""},
  options:[
	{getText() {return "Super Health Potion: -35 GP"}, requiredState:(currentState)=>state.gp>=35 && currentState.superHealthPotion===undefined,
	moneyEvent:loseMoney(35), setState:{superHealthPotion:true},nextGameLevel: getNextGameLevel(()=>10.235)},
	{getText() {return "Bow: -7 GP"}, requiredState:(currentState)=>state.gp>=7 && currentState.bow===undefined,
	moneyEvent:loseMoney(7), setState:{bow:true}, nextGameLevel: getNextGameLevel(()=>10.235)},
	{getText() {return "arrows(5): -3 GP"}, requiredState:(currentState)=>state.gp>=3 && state.arrows<15,
	moneyEvent:loseMoney(3), arrowEvent:gainArrow(5), nextGameLevel: getNextGameLevel(()=>10.235)},
  {getText() {return "Pickaxe: +15 GP"}, requiredState:(currentState)=>currentState.pickaxeRumor && state.gp>=15 && currentState.pickaxe===undefined, setState:{pickaxe:true}, moneyEvent:loseMoney(15), nextGameLevel: getNextGameLevel(()=>10.235)},
	{getText() {return "Go back"}, nextGameLevel: getNextGameLevel(()=>10.235)},
  ]
},
{
  id:10.233,
  getText(){return "You decide to leave the merchant alone for now. Where do you want to go?"},
  options:[
	{getText() {return "Back to the merchant"}, nextGameLevel: getNextGameLevel(()=>10.23)},
	{getText() {return "Bernice's Comfortable Inn"}, nextGameLevel: getNextGameLevel(()=>8.211)},
	{getText() {return "Adventurer's Guild"}, nextGameLevel: getNextGameLevel(()=>10.24)},
	{getText(){return "Go to the Royal Library"}, requiredState:(currentState)=>currentState.libraryPass, nextGameLevel:getNextGameLevel(()=>11.15)},
	{getText(){return "Leave the city to kill the Skeletons"}, requiredState:(currentState)=>currentState.skeletonQuest, nextGameLevel:getNextGameLevel(()=>12.15)},
	{getText(){return "Leave the city to kill the Stone Golem"}, requiredState:(currentState)=>currentState.golemQuest, nextGameLevel:getNextGameLevel(()=>12.16)},
  ]
},
{
  id: 10.234,
  getText() {return "Merchant:\"Here's the GP I owe you.\" \n\n You now have " + state.gp + " GP. What else can I help you with?\""},
  options:[
	{getText() {return "Buy"}, nextGameLevel: getNextGameLevel(()=>10.232)},
	{getText() {return "Sell"}, nextGameLevel: getNextGameLevel(()=>10.231)},
	{getText() {return "Leave merchant alone"}, nextGameLevel: getNextGameLevel(()=>10.233)}
  ]
},
{
  id: 10.235,
  getText() {return "Merchant:\"Thanks for your purchase.\" \n\n You now have " + state.gp + " GP.What else can I help you with?\""},
  options:[
	{getText() {return "Buy"}, nextGameLevel: getNextGameLevel(()=>10.232)},
	{getText() {return "Sell"}, nextGameLevel: getNextGameLevel(()=>10.231)},
	{getText() {return "Leave merchant alone"}, nextGameLevel: getNextGameLevel(()=>10.233)},
  ]
},
{
  id:10.24,
  getText(){return "You make your way to the Adventurer's Guild. It's a one-story cobblestone building with a hanging sign labeled \"Adventurer's Guild\" on it.\
   From the outside though, it looks like a run down tavern, as moss has started growing on the outer walls of the building. \n\n You head inside to look around and see \
   the building is divided into three rooms. The room on the right has what appears to be a receptionist's counter with a quest board hanging on the wall behind it. \n\n The middle room \
   that you are standing in is decorated with the heads of various dangerous and rare monsters, no doubt trophies of the most skilled adventurers. Within the middle room \
   are three large, circular tables; you surmise that this must be the meeting room for different adventuring parties. \n\n The room to the left contains a cozy dining room \
   with a small bar and kitchen in the far right corner. Your mouth begins to salivate as you smell the aroma of freshly grilled steak, seared to perfection. Within the dining room \
   there seems to be an out of place door in the far left corner. There's something unusual about it, but you can't quite place your finger on it. \n\n What would you like \
   to do?"},
  options:[
	{getText() {return "Speak to the receptionist"}, requiredState:(currentState)=>currentState.receptionistItem===undefined, nextGameLevel: getNextGameLevel(()=>10.241)},
	{getText() {return "Speak to the receptionist"}, requiredState:(currentState)=>currentState.receptionistItem && currentState.questComplete===undefined, nextGameLevel: getNextGameLevel(()=>10.241001)},
  {getText() {return "Speak to the receptionist"}, requiredState:(currentState)=>currentState.questComplete, nextGameLevel: getNextGameLevel(()=>10.241002)},
	{getText() {return "Eat in the dining room"}, nextGameLevel: getNextGameLevel(()=>10.242)},
	{getText() {return "Check out the unusual door in the dining room"}, nextGameLevel: getNextGameLevel(()=>10.243)},
	{getText() {return "Leave the Adventurer's Guild"}, nextGameLevel: getNextGameLevel(()=>10.244)}
  ]
},
{
  id:10.2401,
  getText(){return "What would you like to do?"},
  options:[
	{getText() {return "Speak to the receptionist"}, requiredState:(currentState)=>currentState.receptionistItem===undefined, nextGameLevel: getNextGameLevel(()=>10.241)},
	{getText() {return "Speak to the receptionist"}, requiredState:(currentState)=>currentState.receptionistItem && currentState.questComplete ===undefined, nextGameLevel: getNextGameLevel(()=>10.241001)},
  {getText() {return "Speak to the receptionist"}, requiredState:(currentState)=>currentState.receptionistItem && currentState.questComplete, nextGameLevel: getNextGameLevel(()=>10.241002)},
	{getText() {return "Eat in the dining room"}, nextGameLevel: getNextGameLevel(()=>10.242)},
	{getText() {return "Check out the unusual door in the dining room"}, nextGameLevel: getNextGameLevel(()=>10.243)},
	{getText() {return "Leave the Adventurer's Guild"}, nextGameLevel: getNextGameLevel(()=>10.244)}
  ]
},
{
  id:10.241,
  getText(){return "Receptionist: \"Well hi there! Are you looking for a quest?\""},
  options:[
	{getText() {return "Yes"}, nextGameLevel: getNextGameLevel(()=>10.2411)},
	{getText() {return "Actually, I have some questions"}, nextGameLevel: getNextGameLevel(()=>10.2412)},
	{getText() {return "Leave receptionist table"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.241001,
  getText(){return "Receptionist: \"Well hi there! Have you completed your quest yet?\""},
  options:[
	{getText() {return "Yes"}, requiredState:(currentState)=> currentState.mageStaff, setState:{questComplete:true}, moneyEvent:gainMoney(100), nextGameLevel: getNextGameLevel(()=>10.24101)},
	{getText() {return "Yes"}, requiredState:(currentState)=> currentState.obsidianEye, setState:{questComplete:true}, moneyEvent:gainMoney(350), nextGameLevel: getNextGameLevel(()=>10.24102)},
	{getText() {return "No"},requiredState:(currentState)=> currentState.obsidianEye===undefined && currentState.mageStaff===undefined, nextGameLevel: getNextGameLevel(()=>10.24103)},
	{getText() {return "Actually, I have some questions"}, nextGameLevel: getNextGameLevel(()=>10.2412)},
	{getText() {return "Leave receptionist table"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.241002,
  getText(){return "Receptionist: \"Sorry, I don't have any more quests for you. Can I help you with anything else?\""},
  options:[
	{getText() {return "Actually, I have some questions"}, nextGameLevel: getNextGameLevel(()=>10.2412)},
	{getText() {return "Leave receptionist table"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.2411,
  getText(){return "Receptionist: \n\"Great! So we have a couple available right now, but you can only choose one so that other adventurers have a chance too. \n\nThe first one is to exterminate the horde of Skeletons that have been roaming around the village at night. Individually, \
  Skeletons are pretty easy to kill, because they're pretty slow and all you have to do is break their skull to kill one. The problem is, as a horde, they tend to become difficult just due to the sheer \
  number of them. Also, this horde seems to have more of a hive mind or something that is controlling them, because they tend to all direct their attention to the same thing. That quest pays 100 GP. \
  \n\n The second quest is to slay a Stone Golem that lives on Mt. Vernik, about half a day's travel north of Yolrein. It's been attacking all travelers who take that path to go between our city \
  and the Komori Kingdom. This creature is a lot more difficult to kill as typical weapons such as swords and bows have no effect on it. I haven't had any adventurers who \
  have killed one before, so we haven't been able to gather intel on how to take one down. The only place I can think of to look for that type of data would be Yolrein's Royal Library, but there's \
  no guarantee it'll have any information on Stone Golems. Due to the difficulty and uncertainty of this quest, we're offering 350 GP.\""},
  options:[
	{getText() {return "I'll take the Skeleton quest"},  requiredState:(currentState)=>currentState.receptionistItem===undefined && currentState.libraryPass===undefined,
 	setState:{libraryPass:true, receptionistItem:true, skeletonQuest:true}, nextGameLevel: getNextGameLevel(()=>10.24111)},
	{getText() {return "I'll take the Stone Golem quest"}, requiredState:(currentState)=>currentState.libraryPass===undefined && currentState.receptionistItem===undefined,
	setState:{libraryPass:true, receptionistItem:true, golemQuest:true}, nextGameLevel: getNextGameLevel(()=>10.24111)},
	{getText() {return "Go back"}, nextGameLevel: getNextGameLevel(()=>10.241001)},
  ]
},
{
  id:10.24111,
  getText(){return "Receptionist: \"Okay perfect! Here's a library pass so that you can gain access to some of the more ancient texts available at the Royal Library. \
  Come back here when you're all done so I can give you your reward!\""},
  options:[
	{getText() {return "Leave receptionist table"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.24101,
  getText(){return "Receptionist: \"Great job on killing all of those Skeletons! Some of the townspeople who were watching the battle from afar told me that \
  there was a mage controlling them! That's crazy that you somehow killed it! As an added bonus for killing the mage, the Adventurer's Guild will be \
  giving you a bonus! We're going to provide you with a Frost Blade, a weapon forged at the peak of Mt. Vernik. When unsheathed, this sword has \
  slows down all individuals, except for the user, within a 50 yard radius. It's an extremely useful and dangerous weapon, so take care of it.\""}, setState:{frostBlade:true},
  options:[
	{getText() {return "Leave receptionist table"}, setState:{completedQuest:true}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.24102,
  getText(){return "Receptionist: \"Great job on killing that Stone Golem! I can't believe we never thought about using an iron pickaxe to destroy it. \
  Now the townspeople can rest easy and know that they won't be crushed by boulders when traveling to and from the Komori Kingdom. As promised, here's your reward \
  for a job well done.\""},
  options:[
	{getText() {return "Leave receptionist table"}, setState:{completedQuest:true}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.24103,
  getText(){return "Receptionist: \"We don't just give away quest rewards like they're some kind of participation trophy, you know? \
  Please return back to me when you've completed your quest.\""},
  options:[
	{getText() {return "Leave receptionist table"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.2412,
  getText(){return "Receptionist: \"Sure, What questions can I answer for you?\""},
  options:[
	{getText() {return "What's behind that door in the corner of the dining room?"}, nextGameLevel: getNextGameLevel(()=>10.24121)},
	{getText() {return "Tell me more about Yolrein"}, requiredState:(currentState)=>currentState.resistanceRumor===undefined, nextGameLevel: getNextGameLevel(()=>10.24122)},
	{getText() {return "How do I get an audience with the King?"}, nextGameLevel: getNextGameLevel(()=>10.24123)},
	{getText() {return "*Whispering* I'd like to help with the resistance"}, requiredState:(currentState)=>((currentState.resistanceRumor && currentState.obsidianEye) ||
	(currentState.resistanceRumor && currentState.mageStaff)), setState:{resistancePassword:true}, nextGameLevel: getNextGameLevel(()=>10.24124)},
	{getText() {return "*Whispering* I'd like to help with the resistance"}, requiredState:(currentState)=>((currentState.resistanceRumor && currentState.obsidianEye===undefined) ||
	(currentState.resistanceRumor && currentState.mageStaff === undefined)), nextGameLevel: getNextGameLevel(()=>10.24125)},
	{getText() {return "Leave receptionist table"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.24121,
  getText(){return "Receptionist: \"That's none of your concern.\""},
  options:[
	{getText() {return "Can I ask you some other questions?"}, nextGameLevel: getNextGameLevel(()=>10.2412)},
	{getText() {return "Leave receptionist table"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.24122,
  getText(){return "Receptionist: \"We are a fairly small city with only a few shops. It used to be a bustling city, full of places \
  to explore and shop; but, ever since the new King came into power about two years ago after his father died, the city has really taken a turn \
  for the worse.\""},
  options:[
	{getText() {return "What caused the city to take a turn for the worse?"}, nextGameLevel: getNextGameLevel(()=>10.241221)},
	{getText() {return "Can I ask you some other questions?"}, nextGameLevel: getNextGameLevel(()=>10.2412)},
	{getText() {return "Leave receptionist table"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.241221,
  getText(){return "Receptionist: \"Well... The King began taxing us more and more. When someone couldn't pay their taxes, he'd take away \
  everything they owned and forced them out of the city. On top of that, his soldiers are now no better than common criminals. They \
  take what they want from people, and if anyone speaks against them, the soldiers hang them. \""},
  options:[
	{getText() {return "That's terrible! Isn't there something that can be done about him?"}, nextGameLevel: getNextGameLevel(()=>10.2412211)},
	{getText() {return "Can I ask you some other questions?"}, nextGameLevel: getNextGameLevel(()=>10.2412)},
	{getText() {return "Leave receptionist table"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.2412211,
  getText(){return "Receptionist: *Whispering \"Well, there is a resistance forming to overthrow the King...\""},
  options:[
	{getText() {return "Can I ask you some other questions?"}, setState:{resistanceRumor:true}, nextGameLevel: getNextGameLevel(()=>10.2412)},
	{getText() {return "Leave receptionist table"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.24123,
  getText(){return "Receptionist: \"I suppose if you're looking to meet the King, you should probably try to prove yourself as a fierce \
  warrior first, then go speak to some of the palace guards to request an audience.\""},
  options:[
	{getText() {return "How can I show that I'm a fierce warrior?"}, nextGameLevel: getNextGameLevel(()=>10.241231)},
	{getText() {return "Can I ask you some other questions?"}, nextGameLevel: getNextGameLevel(()=>10.2412)},
	{getText() {return "Leave receptionist table"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.241231,
  getText(){return "Receptionist: \"Well, you could try completing one of the quests we have available here \
  and bringing back a trophy to give to the King.\""},
  options:[
	{getText() {return "Can I ask you some other questions?"}, nextGameLevel: getNextGameLevel(()=>10.2412)},
	{getText() {return "Leave receptionist table"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.24124,
  getText(){return "Receptionist: \"Really? Well, you've proven yourself since you completed one of our more difficult quests, plus \
  we could use all the help we can get. Alright, go to that door in the corner of the dining room \
  and give them the password, 'Dum Spiro, Spero'. They'll direct you from there.\""},
  options:[
	{getText() {return "Can I ask you some other questions?"}, nextGameLevel: getNextGameLevel(()=>10.2412)},
	{getText() {return "Leave receptionist table"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.24125,
  getText(){return "Receptionist: \"From what I've heard, they're looking for more powerful adventurers. Why don't you try completing the quest I gave you first?\""},
  options:[
	{getText() {return "Can I ask you some other questions?"}, nextGameLevel: getNextGameLevel(()=>10.2412)},
	{getText() {return "Leave receptionist table"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.242,
  getText(){return "You go to the dining room to get some food. \n\n Waitress: \"What can I get for you? We have Mutton, Beef Pie, Chicken Pasty, and Apple Tart.\""},
  options:[
	{getText() {return "Mutton: +10 HP, -20 GP"}, requiredState:(currentState)=>state.gp>=20, moneyEvent:loseMoney(20), healthEvent(){return gainHealth(10)}, nextGameLevel: getNextGameLevel(()=>10.2421)},
	{getText() {return "Beef Pie: +7 HP, -14 GP"}, requiredState:(currentState)=>state.gp>=14, moneyEvent:loseMoney(14), healthEvent(){return gainHealth(7)}, nextGameLevel: getNextGameLevel(()=>10.2421)},
	{getText() {return "Chicken Pasty: +14 HP, -25 GP"}, requiredState:(currentState)=>state.gp>=25, moneyEvent:loseMoney(25), healthEvent(){return gainHealth(14)}, nextGameLevel: getNextGameLevel(()=>10.2421)},
  {getText() {return "Apple Tart: +2 HP, -3 GP"}, requiredState:(currentState)=>state.gp>=3, moneyEvent:loseMoney(3), healthEvent(){return gainHealth(2)}, nextGameLevel: getNextGameLevel(()=>10.2421)},
  {getText() {return "Leave dining room"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.2421,
  getText(){return "You feel a lot stronger now! \n\n Waitress: \"Anything else I can get you?\""},
  options:[
	{getText() {return "Mutton: +10 HP, -20 GP"}, requiredState:(currentState)=>state.gp>=20, moneyEvent:loseMoney(20), healthEvent(){return gainHealth(10)}, nextGameLevel: getNextGameLevel(()=>10.2421)},
	{getText() {return "Beef Pie: +7 HP, -14 GP"}, requiredState:(currentState)=>state.gp>=14, moneyEvent:loseMoney(14), healthEvent(){return gainHealth(7)}, nextGameLevel: getNextGameLevel(()=>10.2421)},
	{getText() {return "Chicken Pasty: +14 HP, -25 GP"}, requiredState:(currentState)=>state.gp>=25, moneyEvent:loseMoney(25), healthEvent(){return gainHealth(14)}, nextGameLevel: getNextGameLevel(()=>10.2421)},
  {getText() {return "Apple Tart: +2 HP, -3 GP"}, requiredState:(currentState)=>state.gp>=3, moneyEvent:loseMoney(3), healthEvent(){return gainHealth(2)}, nextGameLevel: getNextGameLevel(()=>10.2421)},
  {getText() {return "Leave dining room"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.243,
  getText(){return "You walk over to the unusual door in the dining room and try to open it, but it's locked. You knock on the door and an eye slot at the top opens up, two \
  eyes glaring at you. \n\n Hidden Figure: \"Password?\""},
  options:[
	{getText() {return "Dum Spiro, Spero"}, requiredState:(currentState)=>currentState.resistancePassword, nextGameLevel: getNextGameLevel(()=>11.14)},
	{getText() {return "Um, Open Sesame?"}, requiredState:(currentState)=>currentState.resistancePassword===undefined, nextGameLevel: getNextGameLevel(()=>10.2431)},
  {getText() {return "Leave"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.2431,
  getText(){return "Hidden Figure: \"Go away.\""},
  options:[
  {getText() {return "Leave"}, nextGameLevel: getNextGameLevel(()=>10.2401)},
  ]
},
{
  id:10.244,
  getText(){return "You leave the Adventurer's Guild. Where do you want to go?"},
  options:[
	{getText(){return "Bernice's Comfortable Inn"}, nextGameLevel:getNextGameLevel(()=>8.211)},
	{getText(){return "The town's local merchant"}, nextGameLevel:getNextGameLevel(()=>10.23)},
	{getText(){return "The Adventurer's Guild"}, nextGameLevel:getNextGameLevel(()=>10.24)},
	{getText(){return "The Royal Library"}, requiredState:(currentState)=>currentState.libraryPass, nextGameLevel:getNextGameLevel(()=>11.15)},
	{getText(){return "Leave the city to kill the Skeletons"}, requiredState:(currentState)=>currentState.skeletonQuest, nextGameLevel:getNextGameLevel(()=>12.15)},
	{getText(){return "Leave the city to kill the Stone Golem"}, requiredState:(currentState)=>currentState.golemQuest, nextGameLevel:getNextGameLevel(()=>12.16)},
  ]
},
{
  id: 10.25,
  getText(){return "You feel so much better after a night's sleep. What do you want to do now?"},
  options:[
	{getText(){return "Go to the bar and have a drink: +3 HP"}, requiredState:(currentState)=>currentState.barPass, healthEvent(){return gainHealth(3)}, setState:{barPass:false}, nextGameLevel:getNextGameLevel(()=>10.26)},
	{getText(){return "Go to the Adventurer's Guild"}, nextGameLevel:getNextGameLevel(()=>10.24)},
	{getText(){return "Go to the town merchant"}, nextGameLevel:getNextGameLevel(()=>10.23)},
	{getText(){return "The Royal Library"}, requiredState:(currentState)=>currentState.libraryPass, nextGameLevel:getNextGameLevel(()=>11.15)},
  ]
},
{
  id: 10.26,
  getText(){return "You go to the bar and have a drink. While you're drinking, you overhear some adventurers talking... \n\n Callum: \"I still can't believe \
  I got away, Aldus! Gerald and I were coming back from our hunting trip a couple of nights ago and were about two miles outside of town \
  when Skeletons started popping up from the ground trying to surround us. I managed to use my hammer to knock a few of them away and bash in some of their skulls \
  but Gerald didn't get as lucky.\" \n\n Aldus: \"Yeah, I heard from someone in the guild that he didn't make it. What happened to him, Callum? I thought he was one of \
  the more skilled warriors.\" \n\n Callum: \"Well, he had about ten Skeletons surrounding him. He was managing to push them back a bit from what I could see. \
  I turned my back to him for a few minutes to destroy the last Skeleton attacking me. After I crushed its head, I turned to go help him with his Skeletons when \
  I saw Gerald's whole body being engulfed in flames! As soon as I saw that I ran back to town where it was safe.\" \n\n Aldus: \"You know, it's possible that it was \
  some sort of mage or lich that killed Gerald...\" \n\n Their conversation moves on to other topics, none of which are of any interest to you. You finish your drink and \
  head out of the bar. \n\n What do you want to do?"},
  options:[
	{getText(){return "Go to the town merchant"}, nextGameLevel:getNextGameLevel(()=>10.23)},
	{getText(){return "The Adventurer's Guild"}, nextGameLevel:getNextGameLevel(()=>10.24)},
	{getText(){return "The Royal Library"}, requiredState:(currentState)=>currentState.libraryPass, nextGameLevel:getNextGameLevel(()=>11.15)},
  ]
},
{
  id: 11.101,
  getText(){return "You cut off the Goblin King's head! This would look great as a mounted on the wall, wouldn't it? Really seals the adventurer vibe you're going for! \n\n \
  What do you want to do now?"},
  options:[
	{getText(){return "Cut off the Goblin King's head and bring it with you"}, requiredState:(currentState)=>currentState.goblinKingHead===undefined, setState:{goblinKingHead:true}, nextGameLevel:getNextGameLevel(()=>11.101)},
	{getText(){return "Loot all of the corpses"}, requiredState:(currentState)=>currentState.dualSword===undefined, setState:{dualSword:true, chestPlate:true}, moneyEvent:gainMoney(50), nextGameLevel:getNextGameLevel(()=>11.102)},
	{getText(){return "Raid the goblins' chests"}, requiredState:(currentState)=>currentState.sapphire===undefined, setState:{sapphire:true, diamond:true, emerald:true, ruby:true},
	moneyEvent:gainMoney(30), nextGameLevel:getNextGameLevel(()=>11.103)},
	{getText(){return "Go back through the hidden passageway and out the door in the corner of the previous room"}, nextGameLevel:getNextGameLevel(()=>6.10)},
  ]
},
{
  id: 11.102,
  getText(){return "You loot all the corpses of those filthy goblinsies and actually get a pretty good haul of useable stuff. You end up salvaging the Goblin King's dual swords. \
  Besides that, you secured 50 GP and a chestplate, although it's a little snug around the midriff (nothing a bit of cardio can't fix). \n\n What do you want to do now?"},
  options:[
	{getText(){return "Cut off the Goblin King's head and bring it with you"}, requiredState:(currentState)=>currentState.goblinKingHead===undefined, setState:{goblinKingHead:true}, nextGameLevel:getNextGameLevel(()=>11.101)},
	{getText(){return "Loot all of the corpses"}, requiredState:(currentState)=>currentState.dualSword===undefined, setState:{dualSword:true, chestPlate:true}, moneyEvent:gainMoney(50), nextGameLevel:getNextGameLevel(()=>11.102)},
	{getText(){return "Raid the goblins' chests"}, requiredState:(currentState)=>currentState.sapphire===undefined, setState:{sapphire:true, diamond:true, emerald:true, ruby:true},
	moneyEvent:gainMoney(30), nextGameLevel:getNextGameLevel(()=>11.103)},
	{getText(){return "Go back through the hidden passageway and out the door in the corner of the previous room"}, nextGameLevel:getNextGameLevel(()=>6.10)},
  ]
},
{
  id: 11.103,
  getText(){return "You go behind the Goblin King's throne and open the chests. In them, you find a bunch of rubish. Mostly different types of leather armor and copper weapons, \
  but nothing worth keeping. You get to the bottom of the chest and find that you actually hit the jackpot! You found 30 GP and four cut gems: a sapphire, a diamond, an emerald, \
  and a ruby! Those seem to be the only things of value in the chests though. \n\n What do you want to do now?"},
  options:[
	{getText(){return "Cut off the Goblin King's head and bring it with you"}, requiredState:(currentState)=>currentState.goblinKingHead===undefined, setState:{goblinKingHead:true}, nextGameLevel:getNextGameLevel(()=>11.101)},
	{getText(){return "Loot all of the corpses"}, requiredState:(currentState)=>currentState.dualSword===undefined, setState:{dualSword:true, chestPlate:true}, moneyEvent:gainMoney(50), nextGameLevel:getNextGameLevel(()=>11.102)},
	{getText(){return "Raid the goblins' chests"}, requiredState:(currentState)=>currentState.sapphire===undefined, setState:{sapphire:true, diamond:true, emerald:true, ruby:true},
	moneyEvent:gainMoney(30), nextGameLevel:getNextGameLevel(()=>11.103)},
	{getText(){return "Go back through the hidden passageway and out the door in the corner of the previous room"}, nextGameLevel:getNextGameLevel(()=>6.10)},
  ]
},
{
  id:11.11,
  getText(){return "Merchant: \"Sure, what do you want to sell to me?\""},
  options:[
	{getText() {return "Goblin Dagger: +2 GP"}, requiredState:(currentState)=>currentState.goblinDagger, setState:{goblinDagger:false}, moneyEvent:gainMoney(2), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Goblin Sword: +7 GP"}, requiredState:(currentState)=>currentState.goblinSword, setState:{goblinSword:false}, moneyEvent:gainMoney(7), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Long Sword: +15 GP"}, requiredState:(currentState)=>currentState.longSword, setState:{longSword:false}, moneyEvent:gainMoney(15), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Dual Swords: +40 GP"}, requiredState:(currentState)=>currentState.dualSword, setState:{dualSword:false}, moneyEvent:gainMoney(40), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Bow +5 GP"}, requiredState:(currentState)=>currentState.bow, setState:{bow:false}, moneyEvent:gainMoney(5), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Arrows(5): 1 GP"}, requiredState:(currentState)=>state.arrows>=5, arrowEvent:loseArrow(5), moneyEvent:gainMoney(1), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Shield: +3 GP"}, requiredState:(currentState)=>currentState.shield, setState:{shield:false}, moneyEvent:gainMoney(3), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Helmet: +3 GP"}, requiredState:(currentState)=>currentState.helmet, setState:{helmet:false}, moneyEvent:gainMoney(3), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Chest Plate: +10 GP"}, requiredState:(currentState)=>currentState.chestPlate, setState:{chestPlate:false}, moneyEvent:gainMoney(10), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Potion of Healing: +20 GP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, moneyEvent:gainMoney(20), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Empty Bottle: +1 GP"}, requiredState:(currentState)=>currentState.emptyBottle, setState:{emptyBottle:false}, moneyEvent:gainMoney(1), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Super Health Potion +25 GP"}, requiredState:(currentState)=>currentState.superHealthPotion, setState:{superHealthPotion:false}, moneyEvent:gainMoney(25), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "lantern: +5 GP"}, requiredState:(currentState)=>currentState.lantern, setState:{lantern:false}, moneyEvent:gainMoney(5), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Flint: +3 GP"}, requiredState:(currentState)=>currentState.flint, setState:{flint:false}, moneyEvent:gainMoney(3), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Mushrooms: +2 GP"}, requiredState:(currentState)=>currentState.mushrooms, setState:{mushrooms:false}, moneyEvent:gainMoney(2), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Berries: +2 GP"}, requiredState:(currentState)=>currentState.berries, setState:{berries:false}, moneyEvent:gainMoney(2), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Fox Hide: +5 GP"}, requiredState:(currentState)=>currentState.foxHide, setState:{foxHide:false}, moneyEvent:gainMoney(5), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Wolf Hide: +8 GP"}, requiredState:(currentState)=>currentState.wolfHide, setState:{wolfHide:false}, moneyEvent:gainMoney(8), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Fox Meat: +4 GP"}, requiredState:(currentState)=>currentState.meat, setState:{meat:false}, moneyEvent:gainMoney(4), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Wolf Meat: +6 GP"}, requiredState:(currentState)=>currentState.wolfMeat, setState:{wolfMeat:false}, moneyEvent:gainMoney(6), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "Go back"}, nextGameLevel: getNextGameLevel(()=>11.1101)},
  ]
},
{
  id:11.1101,
  getText(){return "Merchant: \"What can I do for you?\""},
  options:[
	{getText() {return "Buy"}, nextGameLevel: getNextGameLevel(()=>11.12)},
	{getText() {return "Sell"}, nextGameLevel: getNextGameLevel(()=>11.11)},
	{getText() {return "Leave merchant alone"}, nextGameLevel: getNextGameLevel(()=>11.13)}
  ]
},
{
  id:11.12,
  getText(){return "Merchant: \"Sure, have a look at my wares\""},
  options:[
    {getText() {return "Super Health Potion -40 GP"}, requiredState:(currentState)=>currentState.superHealthPotion, setState:{superHealthPotion:true}, moneyEvent:loseMoney(40), nextGameLevel: getNextGameLevel(()=>11.111)},
	{getText() {return "shield: -10 GP"}, requiredState:(currentState)=>state.gp>=10 && currentState.shield===undefined,
	moneyEvent:loseMoney(10), setState:{shield:true},nextGameLevel: getNextGameLevel(()=>11.112)},
	{getText() {return "Bow: -7 GP"}, requiredState:(currentState)=>state.gp>=7 && currentState.bow===undefined,
	moneyEvent:loseMoney(7), setState:{bow:true}, nextGameLevel: getNextGameLevel(()=>11.112)},
	{getText() {return "arrows(5): -3 GP"}, requiredState:(currentState)=>state.gp>=3 && state.arrows<15,
	moneyEvent:loseMoney(3), arrowEvent:gainArrow(5), nextGameLevel: getNextGameLevel(()=>11.112)},
	{getText() {return "Go back"}, nextGameLevel: getNextGameLevel(()=>11.1101)},
  ]
},
{
  id: 11.111,
  getText() {return "Merchant:\"Here's the GP I owe you.\" \n\n You now have " + state.gp + " GP. What else can I help you with?\""},
  options:[
	{getText() {return "Buy"}, nextGameLevel: getNextGameLevel(()=>11.12)},
	{getText() {return "Sell"}, nextGameLevel: getNextGameLevel(()=>11.11)},
	{getText() {return "Leave merchant alone"}, nextGameLevel: getNextGameLevel(()=>11.13)}
  ]
},
{
  id: 11.112,
  getText() {return "Merchant:\"Thanks for your purchase.\" \n\n You now have " + state.gp + " GP.What else can I help you with?\""},
  options:[
	{getText() {return "Buy"}, nextGameLevel: getNextGameLevel(()=>11.12)},
	{getText() {return "Sell"}, nextGameLevel: getNextGameLevel(()=>11.11)},
	{getText() {return "Leave merchant alone"}, nextGameLevel: getNextGameLevel(()=>11.13)},
  ]
},
{
  id:11.13,
  getText(){return "You decide to leave the merchant alone for now. As you're about to leave, the merchant speaks up. \n\n Merchant: \"Be careful continuing on this path. Up ahead you'll find \
  the castle of Fagrim, the Warlock. He's extremely powerful and very deadly to cross. I've met many adventurers along my path who were headed \
  to that castle in search of treasure, wisdom, or power; yet, none of them made it out alive. Due to my line of work, I've actually met Fagrim before. He was \
  extremely short tempered, but luckily was soothed by my flattery and eagerness to see a display of some of his more infamous spells. \
  I won't go into the gory details, but trust me when I say that he is not to be trifled with... My advice, if you're set on going, is to stay on Fagrim's good side and \
  to not upset him.\""},
  options:[
	{getText() {return "Continue on the path to the Warlock's castle"}, nextGameLevel: getNextGameLevel(()=>12.10)},
	{getText() {return "Go back through the dark forest to the crossroads, then take the opposite path."}, nextGameLevel: getNextGameLevel(()=>8.11)},
  ]
},
{
  id:11.14,
  getText(){return "Hidden Figure: \"You may enter.\" \n\n The door opens and... it's a small storage closet filled with bags of flour and crates of cooking supplies. \
   Great. Just great. This is... definitely not what you thought the resistance would look like. You then look at the person who opened the door. It's a man, about mid-thirties, with a \
   muscular build. There's no way he's NOT an adventurer, you think to yourself. "},
  options:[
	{getText() {return "Continue"}, nextGameLevel: getNextGameLevel(()=>11.141)},
  ]
},
{
  id:11.141,
  getText(){return "Man: \"Follow me.\" \n\n He moves aside a box in the corner of the storage closet to unveil an opening in the floor with a wooden ladder. The man climbs \
  down the ladder first, with you following closely behind. "},
  options:[
	{getText() {return "Continue"}, nextGameLevel: getNextGameLevel(()=>11.142)},
  ]
},
{
  id:11.142,
  getText(){return "You reach the bottom of the ladder and see that you're in a cobblestone hallway, dimly lit by torches sparsely mounted on the wall throughout the hallway. \
  You both start walking down the hallway in silence until you reach a metal door at the end. \n\n Man: \"Go in.\"\n\n You open the door and go inside. \n\n Now THIS is a resistance! \
  The cobblestone room is massive and is filled with all sorts of adventurers: humans, elves, lizardfolk, and even a couple of tipsy looking dwarves. There's at least a hundred or so \
  adventurers in the room; a majority of them were sitting at some of the many tables, while others were either drinking at the underground bar, buying wares from the merchant, \
  or starting to gather by one of the larger tables. \n\n What do you want to do? "},
  options:[
	{getText() {return "Check out the merchant's wares"}, nextGameLevel: getNextGameLevel(()=>12.11)},
	{getText() {return "Go to the bar"}, nextGameLevel: getNextGameLevel(()=>12.12)},
	{getText() {return "Speak to some of the adventurers"}, nextGameLevel: getNextGameLevel(()=>12.13)},
	{getText() {return "See why people are gathering by the larger table"}, nextGameLevel: getNextGameLevel(()=>12.14)},
  ]
},
{
  id:11.15,
  getText(){return "You arrive at the Royal Library. The exterior looks like a miniature chapel with stained glass windows and a small, golden dome for a roof. \
  You show the guard at the door your library pass and he grants you entrance. Walking inside, you look in amazement at the vast collection of books to be found. \
  Fifteen foot tall bookshelves filled with books cover every corner the building, except for the center of the room, which contains a 'U' shaped desk with a \
  sharply dressed woman inside of it. That must be the Head Librarian! You walk over to her desk. \n\n Head Librarian: \"Oh, good afternoon. Is there something \
  I can help you with?"},
  options:[
	{getText() {return "Book on Skeletons"}, requiredState:(currentState)=>currentState.skeletonQuest, nextGameLevel: getNextGameLevel(()=>11.151)},
	{getText() {return "Book on Stone Golems"}, requiredState:(currentState)=>currentState.golemQuest, nextGameLevel: getNextGameLevel(()=>11.152)},
  ]
},
{
  id:11.151,
  getText(){return "You begin reading How to Summon Skeletons for Dummies... \n\n Skeletons are a form of Undead consisting of the reanimated bones of the dead. They're often found protecting dungeons, \
  forts, and ruins. Many varieties of animated Skeletons exist, some stronger than others. Skeletons have a certain resistance to edged weapons and frost spells. \n\n Skeletons \
  often are reanimated by Necromancers, a type of mage who specializes in raising the dead. The reanimated Skeletons do not retain their memories from their past life; thus, causing \
  them to become more malleable, easier to control, and are able to follow simple orders."},
  options:[
	{getText() {return "Continue"}, nextGameLevel: getNextGameLevel(()=>11.1511)},
  ]
},
{
  id:11.1511,
  getText(){return "Necromancers seeking to reanimate Skeletons can start the process by pulling bones \
  from a fresh corpse or even a live subject, although the latter is more difficult since it requires more powerful spells to cast. The older the bones, the more frail the Skeleton;\
  however, older bones do oftentimes hold greater power than fresh bones. It is this author's humble opinion that when reanimating multiple Skeletons is to get a variety of old and new bones\
  that way you'll have some more powerful ones, but they can be defended by the sturdier Skeletons if needed. You can tell which ones are older by the blackening of their bones. The blacker the bone, \
  the older and more powerful the Skeleton. \n\n Due to this being a guide for beginners, I'm not going to cover the more advanced spell for reanimating Skeletons from a live subject.\
  Instead, I'll focus on the spell for bones from a fresh corpse or older bones since they are one and the same."},
  options:[
	{getText() {return "Continue"}, nextGameLevel: getNextGameLevel(()=>11.1512)},
  ]
},
{
  id:11.1512,
  getText(){return "First, light a fire and place the bones near (NOT IN) the fire. Second, take a piece of charcoal from the fire and write the inscription \"Surrecturus Sit\" on each of the bones.\
  Third, you'll take a knife, draw your own blood (Whoever's blood is used gets to control the Skeletons), and let it drop on each bone. Fourth and final step, \
  throw the bones into the fire. Once you complete all of these steps exactly as written, Skeletons will begin to emerge from the ground, three Skeletons per bone used in the spell."}, setState:{skeletonKnowledge:true},
  options:[
	{getText() {return "Give book back to Head Librarian"}, setState:{libraryPass:false}, nextGameLevel: getNextGameLevel(()=>11.16)},
  ]
},
{
  id:11.152,
  getText(){return "Originally created and brought to life by mages, Stone Golems are giant magically animated killing engines with a limited, but extremely capable, form of intelligence.\
  They are perfectly obedient to their creator and follow all rules they're given, even long after their creator's death. Stone Golems remain idle until something approaches and, while idle, they take \
  on the appearance of a pile of boulders."},
  options:[
	{getText() {return "Continue"}, nextGameLevel: getNextGameLevel(()=>11.1521)},
  ]
},
{
  id:11.1521,
  getText(){return "Stone Golems also have a significant amount of health and have high defense against most weapons. On top of that, they are extremely fast and can maneuver \
  around a battlefield with ease. To this day, there are no certain methods to injure a Stone Golem, only rumors and pure speculation. Some rumors say that parrying their \
  attacks with a shield and then using a mace will do damage to them, while others claim that the only way to damage a Stone Golem is by attacking it with a pickaxe. "}, setState:{golemKnowledge:true},
  options:[
	{getText() {return "Give book back to Head Librarian"}, setState:{libraryPass:false, pickaxeRumor:true}, nextGameLevel: getNextGameLevel(()=>11.16)},
  ]
},
{
  id:11.16,
  getText(){return "Head Librarian: \"I hope that book was extremely useful and the knowledge you gained will come in handy for you.\"\n\n You leave the \
  library. Where do you want to go? "},
  options:[
	{getText(){return "Bernice's Comfortable Inn"}, nextGameLevel:getNextGameLevel(()=>8.211)},
	{getText(){return "The town's local merchant"}, nextGameLevel:getNextGameLevel(()=>10.23)},
	{getText(){return "The Adventurer's Guild"}, nextGameLevel:getNextGameLevel(()=>10.24)},
	{getText(){return "The Royal Library"}, requiredState:(currentState)=>currentState.libraryPass, nextGameLevel:getNextGameLevel(()=>11.15)},
	{getText(){return "Leave the city to kill the Skeletons"}, requiredState:(currentState)=>currentState.skeletonQuest, nextGameLevel:getNextGameLevel(()=>12.15)},
	{getText(){return "Leave the city to kill the Stone Golem"}, requiredState:(currentState)=>currentState.golemQuest, nextGameLevel:getNextGameLevel(()=>12.16)},
  ]
},
{
  id:12.10,
  getText(){return "You continue on your path to the Warlock's castle. While you are traveling, you're suddenly ambushed by three cloaked figures armed with \
  mage staffs. \
  \n\n What do you do?"},
  options:[
	{getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWarlockApprentices()>1) {return 13.10;} else {return 13.1011}}, 13.101)},

	{getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWarlockApprentices()>1) {return 13.10;} else {return 13.1011}}, 13.101)},

  {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,1), killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWarlockApprentices()>1) {return 13.10;} else {return 13.1011}}, 13.101)},

  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(1, 8), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWarlockApprentices()>0) {return 13.10;} else {return 13.1011}})},

  {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWarlockApprentices()>0) {return 13.10;} else {return 13.1011}})},

  {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWarlockApprentices()>0) {return 13.10;} else {return 13.1011}})},
  ]
},
{
  id:12.11,
  getText(){return "Merchant: \"What can I help you with?\""},
  options:[
	{getText(){return "Buy"}, nextGameLevel:getNextGameLevel(()=>12.111)},
	{getText(){return "Sell"}, nextGameLevel:getNextGameLevel(()=>12.112)},
	{getText(){return "Leave merchant's shop"}, nextGameLevel:getNextGameLevel(()=>12.113)},
  ]
},
{
  id:12.112,
  getText(){return "Merchant: \"Sure, what do you want to sell to me?\""},
  options:[
	{getText() {return "Goblin Dagger: +2 GP"}, requiredState:(currentState)=>currentState.goblinDagger, setState:{goblinDagger:false}, moneyEvent:gainMoney(2), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Goblin Sword: +7 GP"}, requiredState:(currentState)=>currentState.goblinSword, setState:{goblinSword:false}, moneyEvent:gainMoney(7), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Long Sword: +15 GP"}, requiredState:(currentState)=>currentState.longSword, setState:{longSword:false}, moneyEvent:gainMoney(15), nextGameLevel: getNextGameLevel(()=>12.1121)},
  {getText() {return "Sword of the Flame: +65 GP"}, requiredState:(currentState)=>currentState.flameSword, setState:{flameSword:false}, moneyEvent:gainMoney(65), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Dual Swords: +40 GP"}, requiredState:(currentState)=>currentState.dualSword, setState:{dualSword:false}, moneyEvent:gainMoney(40), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Bow +5 GP"}, requiredState:(currentState)=>currentState.bow, setState:{bow:false}, moneyEvent:gainMoney(5), nextGameLevel: getNextGameLevel(()=>12.1121)},
  {getText() {return "Longbow +15 GP"}, requiredState:(currentState)=>currentState.longBow, setState:{longBow:false}, moneyEvent:gainMoney(15), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Arrows(5): 1 GP"}, requiredState:(currentState)=>state.arrows>=5, arrowEvent:loseArrow(5), moneyEvent:gainMoney(1), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Shield: +3 GP"}, requiredState:(currentState)=>currentState.shield, setState:{shield:false}, moneyEvent:gainMoney(3), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Helmet: +3 GP"}, requiredState:(currentState)=>currentState.helmet, setState:{helmet:false}, moneyEvent:gainMoney(3), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Chest Plate: +10 GP"}, requiredState:(currentState)=>currentState.chestPlate, setState:{chestPlate:false}, moneyEvent:gainMoney(10), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Potion of Healing: +20 GP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, moneyEvent:gainMoney(20), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Empty Bottle: +1 GP"}, requiredState:(currentState)=>currentState.emptyBottle, setState:{emptyBottle:false}, moneyEvent:gainMoney(1), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Super Health Potion +25 GP"}, requiredState:(currentState)=>currentState.superHealthPotion, setState:{superHealthPotion:false}, moneyEvent:gainMoney(25), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "lantern: +5 GP"}, requiredState:(currentState)=>currentState.lantern, setState:{lantern:false}, moneyEvent:gainMoney(5), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Flint: +3 GP"}, requiredState:(currentState)=>currentState.flint, setState:{flint:false}, moneyEvent:gainMoney(3), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Mushrooms: +2 GP"}, requiredState:(currentState)=>currentState.mushrooms, setState:{mushrooms:false}, moneyEvent:gainMoney(2), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Berries: +2 GP"}, requiredState:(currentState)=>currentState.berries, setState:{berries:false}, moneyEvent:gainMoney(2), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Fox Hide: +5 GP"}, requiredState:(currentState)=>currentState.foxHide, setState:{foxHide:false}, moneyEvent:gainMoney(5), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Wolf Hide: +8 GP"}, requiredState:(currentState)=>currentState.wolfHide, setState:{wolfHide:false}, moneyEvent:gainMoney(8), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Fox Meat: +4 GP"}, requiredState:(currentState)=>currentState.meat, setState:{meat:false}, moneyEvent:gainMoney(4), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Wolf Meat: +6 GP"}, requiredState:(currentState)=>currentState.wolfMeat, setState:{wolfMeat:false}, moneyEvent:gainMoney(6), nextGameLevel: getNextGameLevel(()=>12.1121)},
	{getText() {return "Go back"}, nextGameLevel: getNextGameLevel(()=>11.1101)},
  ]
},
{
  id:12.111,
  getText(){return "Merchant: \"Sure, have a look at my wares\""},
  options:[
	{getText() {return "Sword of the Flame: -95 GP"}, requiredState:(currentState)=>state.gp>=95 && currentState.flameSword===undefined,
	moneyEvent:loseMoney(95), setState:{flameSword:true},nextGameLevel: getNextGameLevel(()=>12.1111)},
	{getText() {return "Longbow: -25 GP"}, requiredState:(currentState)=>state.gp>=25 && currentState.longBow===undefined,
	moneyEvent:loseMoney(25), setState:{longBow:true}, nextGameLevel: getNextGameLevel(()=>12.1111)},
	{getText() {return "Go back"}, nextGameLevel: getNextGameLevel(()=>12.11)},
  ]
},
{
  id: 12.1121,
  getText() {return "Merchant:\"Here's the GP I owe you.\" \n\n You now have " + state.gp + " GP. What else can I help you with?\""},
  options:[
	{getText() {return "Buy"}, nextGameLevel: getNextGameLevel(()=>12.112)},
	{getText() {return "Sell"}, nextGameLevel: getNextGameLevel(()=>12.111)},
	{getText() {return "Leave merchant alone"}, nextGameLevel: getNextGameLevel(()=>12.113)}
  ]
},
{
  id: 12.1111,
  getText() {return "Merchant:\"Thanks for your purchase.\" \n\n You now have " + state.gp + " GP.What else can I help you with?\""},
  options:[
	{getText() {return "Buy"}, nextGameLevel: getNextGameLevel(()=>12.112)},
	{getText() {return "Sell"}, nextGameLevel: getNextGameLevel(()=>12.111)},
	{getText() {return "Leave merchant alone"}, nextGameLevel: getNextGameLevel(()=>12.113)},
  ]
},
{
  id: 12.113,
  getText() {return "What do you want to do?"},
  options:[
  	{getText() {return "Check out the merchant's wares"}, nextGameLevel: getNextGameLevel(()=>12.11)},
  	{getText() {return "Go to the bar"}, nextGameLevel: getNextGameLevel(()=>12.12)},
  	{getText() {return "Speak to some of the adventurers"}, nextGameLevel: getNextGameLevel(()=>12.13)},
  	{getText() {return "See why people are gathering by the larger table"}, nextGameLevel: getNextGameLevel(()=>12.14)},
    {getText() {return "Leave the underground resistance headquarters"}, nextGameLevel: getNextGameLevel(()=>13.18)},
  ]
},
{
  id: 12.12,
  getText() {return "Bartender: \"What can I get you?\""},
  options:[
	{getText() {return "Mead: +5 HP, -5 GP"}, healthEvent(){return gainHealth(5)}, moneyEvent:loseMoney(5), nextGameLevel: getNextGameLevel(()=>12.12)},
  	{getText() {return "Triple Meat Deluxe Pie: +25 HP, -10 GP"}, requiredState:(currentState)=>currentState.emptyPiePlate, healthEvent(){return gainHealth(25)},
  	moneyEvent:loseMoney(10), setState:{emptyPiePlate:true}, nextGameLevel: getNextGameLevel(()=>12.12)},
  	{getText() {return "Strawberry Tart: +15 HP, -3 GP"}, requiredState:(currentState)=>currentState.emptyTartPlate, healthEvent(){return gainHealth(15)},
  	moneyEvent:loseMoney(3), setState:{emptyTartPlate:true}, nextGameLevel: getNextGameLevel(()=>12.12)},
  	{getText() {return "Leave the bar"}, nextGameLevel: getNextGameLevel(()=>12.113)},
  ]
},
{
  id: 12.13,
  getText() {return "Which adventurers do you want to speak with?"},
  options:[
  	{getText() {return "The drunken dwarf duo"}, nextGameLevel: getNextGameLevel(()=>13.14)},
  	{getText() {return "The table of elves and lizardfolk"}, nextGameLevel: getNextGameLevel(()=>13.15)},
    {getText() {return "The cloaked man in the corner"}, requiredState:(currentState)=>currentState.foilKingPlan===undefined && currentState.foilResistancePlan===undefined, nextGameLevel: getNextGameLevel(()=>13.16)},
    {getText() {return "The cloaked man in the corner"}, requiredState:(currentState)=>currentState.foilResistancePlan2, nextGameLevel: getNextGameLevel(()=>13.1601)},
  	{getText() {return "Stop speaking to people"}, nextGameLevel: getNextGameLevel(()=>12.113)},
  ]
},
{
  id: 12.14,
  getText() {return "You go over to the large table. A middle-aged man with silver hair and scar across his eye gets on top of the table and begins speaking. \
  \n\n Man: \"Friends, thank you for gathering here in show of your support. For those of you who I haven't met, I'm Ukaji Baomori, the leader of this resistance. \
   We're all here for one reason... To take down this evil ruler once and for all! \
   In three days, we are planning on storming the palace. The majority of our forces will be attacking the palace head on as a diversion. \
   While the palace guards are occupied with pushing our frontal assult back, we'll be sending an elite squad made up of our strongest adventurers \
   through the sewers. According to our sources, one of the routes in the sewers will lead to the courtyard in the back of the palace. \n\n From there \
   the squad will sneak through the back of the palace and into the throne room where you will capture the King. He will most certainly be guarded, but \
   our frontal assult should keep a bulk of the palace guards busy, so the elite squad shouldn't encounter as heavy of a resistance. \n\n Now, I want everyone \
   to prepare themselves for the battle and come back when you're ready to go into battle. We'll go over each individual's role at that time.\""},
  options:[
  	{getText() {return "Ready to battle"}, nextGameLevel: getNextGameLevel(()=>13.17)},
    {getText() {return "I think there's something you need to hear first"}, requiredState:(currentState)=>currentState.foilKingPlan, setState:{foilKingPlan:false, nyxPrison:true}, nextGameLevel: getNextGameLevel(()=>13.171)},
  	{getText() {return "There's some things I still need to do"}, nextGameLevel: getNextGameLevel(()=>12.113)},
  ]
},
{
  id: 12.15,
  getText() {return "You head outside the gates of Yolrein and go into the field where you wait until dusk. Once the sun sets, Skeletons begin popping out of the \
  ground and collectively move towards you, ready to attack. You count " + getSkeletonHorde() + " in total..."},
  options:[
	{getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 7), killMonsterEvent(){return killSkeleton(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.151;} else {return 12.152}}, 12.1501)},
	{getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 3), killMonsterEvent(){return killSkeleton(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1511;} else {return 12.152}}, 12.1501)},
	{getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3), monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 3), killMonsterEvent(){return killSkeleton(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1512;} else {return 12.152}}, 12.1501)},
  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(1, 8), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}})},
	{getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}})},
	{getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}})},
  {getText(){return "Retreat back to town"}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(()=>12.166)}

  ]
},
{
  id: 12.151,
  getText() {return "The Flurry Rush attack was pretty effective! There are " + getSkeletonHorde() + " Skeletons left...\n\n What do you want to do?"},
  options:[
	{getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 7), killMonsterEvent(){return killSkeleton(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.151;} else {return 12.152}}, 12.1501)},
	{getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 3), killMonsterEvent(){return killSkeleton(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1511;} else {return 12.152}}, 12.1501)},
	{getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3), monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 3), killMonsterEvent(){return killSkeleton(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1512;} else {return 12.152}}, 12.1501)},
	{getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}})},
	{getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}})},
  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(1, 8), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}}, 12.1501)},
  {getText(){return "Retreat back to town"}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(()=>12.166, 12.1501)}
  ]
},
{
  id: 12.1511,
  getText() {return "You used Lunging Strike on the Skeletons! There are " + getSkeletonHorde() + " Skeletons left...\n\n What do you want to do?"},
  options:[
	{getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 7), killMonsterEvent(){return killSkeleton(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.151;} else {return 12.152}}, 12.1501)},
	{getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 3), killMonsterEvent(){return killSkeleton(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1511;} else {return 12.152}}, 12.1501)},
	{getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3), monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 3), killMonsterEvent(){return killSkeleton(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1512;} else {return 12.152}}, 12.1501)},
	{getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}})},
	{getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}})},
  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(1, 8), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}}, 12.1501)},
  {getText(){return "Retreat back to town"}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(()=>12.166, 12.1501)}
  ]
},
{
  id: 12.1512,
  getText() {return "You used Multishot on the Skeletons! There are " + getSkeletonHorde() + " Skeletons left...\n\n What do you want to do?"},
  options:[
	{getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 7), killMonsterEvent(){return killSkeleton(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.151;} else {return 12.152}}, 12.1501)},
	{getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 3), killMonsterEvent(){return killSkeleton(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1511;} else {return 12.152}}, 12.1501)},
	{getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3), monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 3), killMonsterEvent(){return killSkeleton(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1512;} else {return 12.152}}, 12.1501)},
	{getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}})},
	{getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}})},
  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(1, 8), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}}, 12.1501)},
  {getText(){return "Retreat back to town"}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(()=>12.166, 12.1501)}
  ]
},
{
  id: 12.1513,
  getText() {return "You drank your potion, gaining some much needed health. While you did that, some Skeletons shot at you with their bows and dealt some damage.\
   There are still " + getSkeletonHorde() + " Skeletons left...\n\n What do you want to do?"},
  options:[
	{getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 7), killMonsterEvent(){return killSkeleton(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.151;} else {return 12.152}}, 12.1501)},
	{getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 3), killMonsterEvent(){return killSkeleton(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1511;} else {return 12.152}}, 12.1501)},
	{getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3), monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 3), killMonsterEvent(){return killSkeleton(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1512;} else {return 12.152}}, 12.1501)},
	{getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}})},
	{getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}})},
  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(1, 8), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}}, 12.1501)},
  {getText(){return "Retreat back to town"}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(()=>12.166, 12.1501)}
  ]
},
{
  id: 12.1501,
  getText() {return "There are too many Skeletons! They pile on top of you, all stabbing you with their blades. As your vision begins to fade to black, \
  you hear a human's voice shout, \"Hey, poor excuse of an adventurer! Looks like you couldn't even defeat a small army of Skeletons! \
  Perhaps you will make better choices in your next life.\""},
  options:[
	{getText() {return "Restart"}, nextGameLevel: getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 12.152,
  getText() {return "You managed to kill all of the Skeletons! You are about to start collecting all of the Skeletons' dropped loot when out of the corner \
  of your eye, you see a huge fireball flying straight towards you! You dodge roll to the side, the fireball barely missing you. Looking in the \
  direction the fireball came from, you see a mage appear from behind a tree. \n\n Mage: \"You may have defeated my Skeletons, but don't think that \
  I'll go down quite that easy! \" \n\n He starts preparing his next attack. What do you want to do? \n\n Mage HP: "+ getMageHP()},
  options:[
  	{getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 9), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1521;} else {return 12.153}}, 12.1502)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 4), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1522;} else {return 12.153}}, 12.1502)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3), monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 5), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1523;} else {return 12.153}}, 12.1502)},

    {getText(){return "Snipe (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(3, 12), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1524;} else {return 12.153}}, 12.1502)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1525;} else {return 12.153}})},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1525;} else {return 12.153}})},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(1, 8), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}}, 12.1502)},

    {getText(){return "Retreat back to town"}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(()=>12.166, 12.1501)}
    ]
},
{
  id: 12.1521,
  getText() {return "You rush at the Mage, swinging your dual swords at him! You manage to slice him, but he blasts you with a Firebolt. \n\n Mage HP: "+ getMageHP()},
  options:[
  	{getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 9), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1521;} else {return 12.153}}, 12.1502)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 4), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1522;} else {return 12.153}}, 12.1502)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3), monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 5), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1523;} else {return 12.153}}, 12.1502)},

    {getText(){return "Snipe (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(3, 12), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1524;} else {return 12.153}}, 12.1502)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1525;} else {return 12.153}})},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1525;} else {return 12.153}})},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(1, 8), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}}, 12.1502)},

    {getText(){return "Retreat back to town"}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(()=>12.166, 12.1501)}
    ]
},
{
  id: 12.1522,
  getText() {return "You lunge at the Mage, successfully stabbing him! He manages to hit you back with a Freeze Bomb. \n\n Mage HP: "+ getMageHP()},
  options:[
  	{getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 9), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1521;} else {return 12.153}}, 12.1502)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 4), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1522;} else {return 12.153}}, 12.1502)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3), monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 5), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1523;} else {return 12.153}}, 12.1502)},

    {getText(){return "Snipe (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(3, 12), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1524;} else {return 12.153}}, 12.1502)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1525;} else {return 12.153}})},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1525;} else {return 12.153}})},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(1, 8), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}}, 12.1502)},

    {getText(){return "Retreat back to town"}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(()=>12.166, 12.1501)}
    ]
},
{
  id: 12.1523,
  getText() {return "You take out your bow and shoot three arrows at the Mage and manage to hit him! Enraged, the Mage blasts you with a Cosmic blast. You manage to dodge most of it, but still take some damage. \n\n Mage HP: "+ getMageHP()},
  options:[
  	{getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 9), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1521;} else {return 12.153}}, 12.1502)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 4), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1522;} else {return 12.153}}, 12.1502)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3), monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 5), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1523;} else {return 12.153}}, 12.1502)},

    {getText(){return "Snipe (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(3, 12), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1524;} else {return 12.153}}, 12.1502)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1525;} else {return 12.153}})},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1525;} else {return 12.153}})},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(1, 8), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}}, 12.1501)},

    {getText(){return "Retreat back to town"}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(()=>12.166, 12.1501)}
    ]
},
{
  id: 12.1524,
  getText() {return "You take out your bow, aim carefully, and release the arrow. The arrow hits the Mage! It was extremely effective! Enraged, the Mage blasts you with a Ice Bolt. \n\n Mage HP: "+ getMageHP()},
  options:[
  	{getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 9), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1521;} else {return 12.153}}, 12.1502)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 4), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1522;} else {return 12.153}}, 12.1502)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3), monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 5), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1523;} else {return 12.153}}, 12.1502)},

    {getText(){return "Snipe (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(3, 12), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1524;} else {return 12.153}}, 12.1502)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1525;} else {return 12.153}})},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1525;} else {return 12.153}})},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(1, 8), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}}, 12.1501)},

    {getText(){return "Retreat back to town"}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(()=>12.166, 12.1501)}

    ]
},
{
  id: 12.1525,
  getText() {return "You heal yourself, but the Mage hits you with Seeping Darkness \n\n Mage HP: "+ getMageHP()},
  options:[
  	{getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 9), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1521;} else {return 12.153}}, 12.1502)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 4), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1522;} else {return 12.153}}, 12.1502)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3), monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 5), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1523;} else {return 12.153}}, 12.1502)},

    {getText(){return "Snipe (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(3, 12), killMonsterEvent(){return killMage(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1524;} else {return 12.153}}, 12.1502)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1525;} else {return 12.153}})},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getMageHP()>0) {return 12.1525;} else {return 12.153}})},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2), killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(1, 8), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}}, 12.1501)},

    {getText(){return "Retreat back to town"}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(()=>12.166, 12.1501)}
    ]
},
{
  id: 12.153,
  getText() {return "The Mage falls to the ground, dead as a doornail! What do you want to do?"},
  options:[
	{getText(){return "Search the Mage's corpse"}, requiredState:(currentState)=>currentState.mageStaff===undefined, setState:{mageStaff:true}, moneyEvent:gainMoney(50), nextGameLevel:getNextGameLevel(()=>12.154)},
  {getText(){return "Loot the Skeletons' bodies"}, requiredState:(currentState)=>currentState.skeletonShield===undefined, setState:{skeletonShield:true}, nextGameLevel:getNextGameLevel(()=>12.155)},
  {getText(){return "Go back to Yolrein"}, nextGameLevel:getNextGameLevel(()=>12.165)},
  ]
},
{
  id: 12.1502,
  getText() {return "The Mage deals the finishing blow and you fly backwards. As your vision begins to blur, you hear the Mage yell, \"This is what happens when you cross a powerful Necromancer like myself. Perhaps you'll \
  make better choices in your next life.\""},
  options:[
	{getText(){return "Restart"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 12.154,
  getText() {return "You loot the Mage's body and find 50 GP and a Mage Staff. The staff will be perfect to show the receptionst that you completed the mission. \n\n What do you want to do?"},
  options:[
  {getText(){return "Loot the Skeletons' bodies"}, requiredState:(currentState)=>currentState.skeletonShield===undefined, setState:{skeletonShield:true}, nextGameLevel:getNextGameLevel(()=>12.155)},
  {getText(){return "Go back to Yolrein"}, nextGameLevel:getNextGameLevel(()=>12.165)},
  ]
},
{
  id: 12.155,
  getText() {return "You loot the Skeletons and only find a Skeleton Shield that's worth keeping. \n\n What do you want to do?"},
  options:[
    {getText(){return "Search the Mage's corpse"}, requiredState:(currentState)=>currentState.mageStaff===undefined, setState:{mageStaff:true}, moneyEvent:gainMoney(50), nextGameLevel:getNextGameLevel(()=>12.154)},
  {getText(){return "Go back to Yolrein"}, nextGameLevel:getNextGameLevel(()=>12.165)},
  ]
},
{
  id: 12.16,
  getText() {return "You head outside the gates of Yolrein and take the long treck to Mt. Vernik. After traveling for hours, you finally arrive at the base of the mountain. \
  As you're climbing the mountain, you feel the earth begin to shake beneath your feet. Looking up, you see boulders quickly tumbling towards you! \
  Jumping out of the way, you barely manage to dodge the boulders! This MUST be the Golem's doing... \n\n You continue carefully climbing the mountain, until you finally reach the \
  summit. It doesn't take long until you're attacked by the Golem who begins hurling boulders at you! \n\n Golem HP: " +getGolemHP() +"\n\n What do you want to do?"},
  options:[
	{getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 6), killMonsterEvent(){return killGolem(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(3,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getGolemHP()>0) {return 12.161;} else {return 12.162}}, 12.1601)},

	{getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 4), killMonsterEvent(){return killGolem(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(3,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getGolemHP()>0) {return 12.161;} else {return 12.162}}, 12.1601)},

	{getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3), monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 3), killMonsterEvent(){return killGolem(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getGolemHP()>0) {return 12.161;} else {return 12.162}}, 12.1601)},

  {getText(){return "Meteor Smash (pickaxe)"}, requiredState:(currentState)=>currentState.pickaxe, monsterDeathRandomizerEvent:monsterDeathRandomizer(4, 12), killMonsterEvent(){return killGolem(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(3,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getGolemHP()>0) {return 12.161;} else {return 12.162}}, 12.1601)},

  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2), killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(1, 8), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}}, 12.1601)},

	{getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7),
  healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(()=>12.161)},

	{getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, heroDamageRandomizerEvent:heroDamageRandomizer(1,7),
  healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(()=>12.161)},

  {getText(){return "Retreat back to town"}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(()=>12.166, 12.1601)}
  ]
},
{
  id: 12.161,
  getText() {return "The Golem is at " + getGolemHP() + " HP. \n\n What do you want to do?"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 6), killMonsterEvent(){return killGolem(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getGolemHP()>0) {return 12.161;} else {return 12.162}}, 12.1601)},

  	{getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 4), killMonsterEvent(){return killGolem(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getGolemHP()>0) {return 12.161;} else {return 12.162}}, 12.1601)},

  	{getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3), monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 3), killMonsterEvent(){return killGolem(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getGolemHP()>0) {return 12.161;} else {return 12.162}}, 12.1601)},

    {getText(){return "Meteor Smash (pickaxe)"}, requiredState:(currentState)=>currentState.pickaxe, monsterDeathRandomizerEvent:monsterDeathRandomizer(4, 12), killMonsterEvent(){return killGolem(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getGolemHP()>0) {return 12.161;} else {return 12.162}}, 12.1601)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2), killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(1, 8), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getSkeletonHorde()>0) {return 12.1513;} else {return 12.152}}, 12.1601)},

  	{getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7),
    healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(()=>12.161)},

  	{getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, heroDamageRandomizerEvent:heroDamageRandomizer(1,7),
    healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(()=>12.161)},

    {getText(){return "Retreat back to town"}, heroDamageRandomizerEvent:heroDamageRandomizer(1,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(()=>12.166, 12.1601)}
  ]
},
{
  id: 12.1601,
  getText() {return "The Golem hits you with a lethal blow causing you to fly backwards, hitting your head on a boulder. Even though the Golem can't speak, you can just tell through \
  its unwavering gaze that its saying, \"Perhaps you will make better choices in your next life, pitiful meatsack.\""},
  options:[
	{getText(){return "Restart"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 12.162,
  getText() {return "You land a crushing blow on the Golem's head. Suddenly, its body begins to fall apart. Where the Golem once stood, now is just a pile of rocks."},
  options:[
	{getText(){return "Search the rubble"}, requiredState:(currentState)=>currentState.obsidianEye===undefined, setState:{obsidianEye:true}, nextGameLevel:getNextGameLevel(()=>12.163)},
  {getText(){return "Search the Golem's cave"}, requiredState:(currentState)=>currentState.bowOfLight===undefined, setState:{bowOfLight:true}, nextGameLevel:getNextGameLevel(()=>12.164)},
  {getText(){return "Go back to Yolrein"}, nextGameLevel:getNextGameLevel(()=>12.165)},
  ]
},
{
  id: 12.163,
  getText() {return "You search the rubble and find the Golem's Obsidian Eye. You take it as proof of the Golem's defeat. What do you want to do now?"},
  options:[
	{getText(){return "Search the rubble"}, requiredState:(currentState)=>currentState.obsidianEye===undefined, setState:{obsidianEye:true}, nextGameLevel:getNextGameLevel(()=>12.163)},
  {getText(){return "Search the Golem's cave"}, requiredState:(currentState)=>currentState.bowOfLight===undefined, setState:{bowOfLight:true}, nextGameLevel:getNextGameLevel(()=>12.164)},
  {getText(){return "Go back to Yolrein"}, nextGameLevel:getNextGameLevel(()=>12.165)},
  ]
},
{
  id: 12.164,
  getText() {return "You search the Golem's cave and find a large chest. Opening it, you find a golden bow and a journal. After taking the bow, you begin to read the journal. \
  \n\n \"I've finally done it! After decades of trial and error, I've finally developed a bow that shoots pure light and doesn't even need any arrows! After much testing, I've \
  come to the realization that this bow is much more deadly than any normal bow. Unlike regular arrows, the beams of light this bow shoots go straight through any armor with ease. \
  \n\n I've set up a meeting and am going to be showing my research to the Counsel of Mages. They're going to be so pleased with my invention that I'm sure this time they'll finally \
  grant me the title of Warlock, the fourth highest rank of Mage! After all of these years of being just a lowly Conjurer Mage, I'll finally have earned the next rank. One step closer \
  to my goal of being Arch-Mage! \n\n While I go to my meeting and present my research documents, I thought it would be best to put Gog, the Stone Golem that I created, in charge of defending \
  my mountain so that no one takes this bow before I have a chance to replicate it.\" \n\n Now that you have the bow, what do you want to do?"},
  options:[
	{getText(){return "Search the rubble"}, requiredState:(currentState)=>currentState.obsidianEye===undefined, setState:{obsidianEye:true}, nextGameLevel:getNextGameLevel(()=>12.163)},
  {getText(){return "Search the Golem's cave"}, requiredState:(currentState)=>currentState.bowOfLight===undefined, setState:{bowOfLight:true}, nextGameLevel:getNextGameLevel(()=>12.164)},
  {getText(){return "Go back to Yolrein"}, nextGameLevel:getNextGameLevel(()=>12.165)},
  ]
},
{
  id: 12.165,
  getText() {return "You head back to Yolrein. Where do you want to go?"},
  options:[
    {getText(){return "Bernice's Comfortable Inn"}, nextGameLevel:getNextGameLevel(()=>8.211)},
  	{getText(){return "The town's local merchant"}, nextGameLevel:getNextGameLevel(()=>10.23)},
  	{getText(){return "The Adventurer's Guild"}, nextGameLevel:getNextGameLevel(()=>10.24)},
    {getText(){return "The Royal Palace"}, requiredState:(currentState)=>currentState.foilResistancePlan ===undefined && currentState.foilKingPlan===undefined && currentState.obsidianEye || currentState.mageStaff , nextGameLevel:getNextGameLevel(()=>13.19)},
  ]
},
{
  id: 12.166,
  getText() {return "You take some blows as you retreat back to Yolrein. Finally you arrive back, somehow still in one piece. Where do you want to go?"},
  options:[
    {getText(){return "Bernice's Comfortable Inn"}, nextGameLevel:getNextGameLevel(()=>8.211)},
  	{getText(){return "The town's local merchant"}, nextGameLevel:getNextGameLevel(()=>10.23)},
  	{getText(){return "The Adventurer's Guild"}, nextGameLevel:getNextGameLevel(()=>10.24)},
    {getText(){return "The Royal Palace"}, requiredState:(currentState)=>currentState.foilResistancePlan ===undefined && currentState.foilKingPlan===undefined && currentState.obsidianEye || currentState.mageStaff , nextGameLevel:getNextGameLevel(()=>13.19)},
  ]
},
{
  id:13.10,
  getText(){return "You attack the cloaked figures! There are "+ getWarlockApprentices() + " left. \n\n What do you do?"},
  options:[
	{getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWarlockApprentices()>1) {return 13.10;} else {return 13.1011}}, 13.101)},

	{getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWarlockApprentices()>1) {return 13.10;} else {return 13.1011}}, 13.101)},

  {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWarlockApprentices()>1) {return 13.10;} else {return 13.1011}}, 13.101)},

  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(1, 8), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWarlockApprentices()>1) {return 13.10;} else {return 13.1011}})},

  {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWarlockApprentices()>1) {return 13.10;} else {return 13.1011}})},

  {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWarlockApprentices()>1) {return 13.10;} else {return 13.1011}})},
  ]
},
{
  id: 13.101,
  getText() {return "The cloaked figures all combine their magic to cast Explosion! The blast kills you instantly... \n\n As your spirit is floating up to the heavens, you hear a voice \
  saying, \"No, adventurer. Your time has not yet come. You must go back to the beginning of your journey where you will try again and again and again, until you get it right. Perhaps you will make \
  better choices in your next life.\""},
  options:[
	{getText(){return "Restart"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 13.1011,
  getText() {return "You slay the second cloaked figure, only one remains.  \n\n Cloaked Figure: \"Please spare me! I'm really sorry we attacked you! Our master, Fagrim, ordered\
  us, his apprentices, to attack anyone who dares come near his castle. If you spare me, I can take you to him and if he deems you worthy, then he can teach you magic.\""},
  options:[
	{getText(){return "Spare the Warlock's apprentice"}, nextGameLevel:getNextGameLevel(()=>14.10)},
  {getText(){return "Kill the Warlock's apprentice"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,2), killMonsterEvent(){return killWarlockApprentices(getDeadMonsters())},nextGameLevel:getNextGameLevel(()=>14.11)},
  ]
},
{
  id: 13.14,
  getText() {return "Drunken Dwarf Hyegar: \"Whattcan I do's forya?\""},
  options:[
  	{getText() {return "What's everyone doing here?"}, nextGameLevel: getNextGameLevel(()=>13.141)},
  	{getText() {return "Who are you?"}, nextGameLevel: getNextGameLevel(()=>13.142)},
    {getText() {return "Never mind"}, nextGameLevel: getNextGameLevel(()=>12.13)},
  ]
},
{
  id: 13.141,
  getText() {return "Drunken Dwarf Hyegar: \"Cantcha *urp* tell? We's gonna kill tha'king.\" \n\n Drunken Dwarf Bayook: \"Not'for I finish my *urp* drink!\""},
  options:[
  	{getText() {return "Who are you?"}, nextGameLevel: getNextGameLevel(()=>13.142)},
    {getText() {return "Never mind"}, nextGameLevel: getNextGameLevel(()=>12.13)},
  ]
},
{
  id: 13.142,
  getText() {return "Drunken Dwarf Hyegar: \"I'm Hyegar and dis is muh buddy Bayook!\" \n\n Drunken Dwarf Bayook: \"We's da bestest blacksmifs *urp* in town. \
  We made da resistance all of'da armor an swords.\""},
  options:[
    {getText() {return "What's everyone doing here?"}, nextGameLevel: getNextGameLevel(()=>13.141)},
    {getText() {return "Never mind"}, nextGameLevel: getNextGameLevel(()=>12.13)},
  ]
},
{
  id: 13.15,
  getText() {return "Lizard Warrior Drataz: \"Whatssss on your mind, adventurer?\""},
  options:[
  	{getText() {return "What's everyone doing here?"}, nextGameLevel: getNextGameLevel(()=>13.151)},
  	{getText() {return "Who are you?"}, nextGameLevel: getNextGameLevel(()=>13.152)},
    {getText() {return "Never mind"}, nextGameLevel: getNextGameLevel(()=>12.13)},
  ]
},
{
  id: 13.151,
  getText() {return "Lizard Warrior Drataz: \"Are you sssssssso blind that you can't ssssee?\" \n\n Elf Warrior Faesolor: \"The king of this land has shown \
  no care for his citizens. He takes what he wants and leaves the rest of his country starving. Those who resist, like us, are hung. His soldiers almost got \
  me, but I was able to fend them off and escape. Instead, they burned my house down... They WILL pay.\""},
  options:[
  	{getText() {return "Who are you?"}, nextGameLevel: getNextGameLevel(()=>13.152)},
    {getText() {return "Never mind"}, nextGameLevel: getNextGameLevel(()=>12.13)},
  ]
},
{
  id: 13.152,
  getText() {return "Lizard Warrior Drataz: \"I am Drataz, and theseee are my brothersss, Usk, Vutha, and Litrix. We are natives of the Natziri Kingdom, but moved \
  to Yolrein yearsss ago, during the reign of King Alkarn the Wise, the father of our current...tyrant.\" \n\n Elf Warrior Faesolor: \"I am Faesolor, a simple \
  adventurer. I moved to Yolrein about fifty years ago, which I know sounds long for humans, but is a drop in the ocean for elves. Anyways, I remember a time \
  when Yolrein was a great and abundant city, its citizens were some of the most well off in the world. The ruler was kind and fair, making sure that \
  even the lowest of citizens were taken care of. Now... Well, not so much... These elves next to me are some of the members from our old clan, hundreds of years ago. Here we\
   have Ilthuryn and Tarron, both excellent archers. In the corner is Radelia, one of our finest healers.\""},
  options:[
  	{getText() {return "What's everyone doing here?"}, nextGameLevel: getNextGameLevel(()=>13.151)},
    {getText() {return "Never mind"}, nextGameLevel: getNextGameLevel(()=>12.13)},
  ]
},
{
  id: 13.16,
  getText() {return "Cloaked Man: \"The sun burns today.\""},
  options:[
  	{getText() {return "What do you mean?"}, nextGameLevel: getNextGameLevel(()=>13.161)},
    {getText() {return "Only those who seek to oppose it."}, requiredState:(currentState)=>currentState.codePhrase, nextGameLevel: getNextGameLevel(()=>13.162)},
    {getText() {return "Never mind"}, nextGameLevel: getNextGameLevel(()=>12.13)},
  ]
},
{
  id: 13.1601,
  getText() {return "Cloaked Man: \"Good, you've returned. What message did you bring from the King?\""},
  options:[
  	{getText() {return "Greek Fire"}, nextGameLevel: getNextGameLevel(()=>13.1602)},
  ]
},
{
  id: 13.1602,
  getText() {return "Cloaked Man: \"That's all I needed to hear. Go back to the King and tell him it's as good as done.\""},
  options:[
  	{getText() {return "Greek Fire"}, setState:{foilResistancePlan3:true,},nextGameLevel: getNextGameLevel(()=>13.1602)},
  ]
},
{
  id: 13.161,
  getText() {return "Cloaked Man: \"Go away\""},
  options:[
    {getText() {return "Sorry..."}, nextGameLevel: getNextGameLevel(()=>12.13)},
  ]
},
{
  id: 13.162,
  getText() {return "Cloaked Man: \"So you're the contact. Well, here's what I've found out. The man behind the upcoming attack, Ukaji Baomori, is planning \
  on taking control of the palace and overthrowing the King by sending a squadron through the sewers to attack the palace from the rear. I need you warn the King of this invasion.\
  I haven't been able to leave due to the possibility of having my cover blown.\""},
  options:[
  	{getText() {return "What will you do?"}, nextGameLevel: getNextGameLevel(()=>13.1621)},
    {getText() {return "Leave it to me."}, setState:{foilResistancePlan:true}, nextGameLevel: getNextGameLevel(()=>12.13)},
    {getText() {return "(Lie) Leave it to me."}, setState:{foilKingPlan:true}, nextGameLevel: getNextGameLevel(()=>12.13)},
  ]
},
{
  id: 13.1621,
  getText() {return "Cloaked Man: \"I'm already part of the elite squadron, so I'll find ways to take as many down from the inside as possible.\""},
  options:[
    {getText() {return "Leave it to me."}, rsetState:{foilResistancePlan:true}, nextGameLevel: getNextGameLevel(()=>12.13)},
    {getText() {return "(Lie) Leave it to me."}, setState:{foilKingPlan:true}, nextGameLevel: getNextGameLevel(()=>12.13)},
  ]
},
{
  id: 13.17,
  getText() {return "Ukaji: \"I know we haven't met, but I spoke with our receptionist and she was certain you could be trusted and were \
  an extremely skilled fighter. Due to your fighting experience, I'm going to put you with our elite squadron that I'll be leading. For the next couple \
  of days, you'll spend time with the rest of my squad preparing for the fight ahead. Make sure to get some rest as well, you'll need it. Also, here's a health potion for \
  you in case you need it during our mission.\""}, setState:{extremeHealthPotion:true},
  options:[
    {getText() {return "I think there's something you need to hear first"}, requiredState:(currentState)=>currentState.foilKingPlan, nextGameLevel: getNextGameLevel(()=>13.171)},
  	{getText() {return "Rest: +20 HP"}, healthEvent(){return gainHealth(20)}, nextGameLevel: getNextGameLevel(()=>14.12)},
  ]
},
{
  id: 13.171,
  getText() {return "You: \"Do you see that man over there in the corner with his hood on?\" \n\n Ukaji: \"You mean Nyx? Sure, what about him?\"\
  \n\n You: \"I've been doing some undercover investigating by pretending to be loyal to the King. During my time undercover, I discovered Nyx is a spy for the King and \
  plans on destroying your elite squad from the inside. I assume he'll try to take you all out one by one. The King doesn't know of your plans yet, so we need to \
  act swiftly to ensure that Nyx doesn't get that information to the Royal Palace.\" \n\n Ukaji: \"If this is true, then you've just saved the resistance. I'll \
  have my guards arrest Nyx and put him in a holding cell until the invasion is over.\ Now, go get some rest. We need you in the best shape possible before our \
  invasion.\""},
  options:[
  	{getText() {return "Rest: +20 HP"}, setState:{nyxPrison:true},healthEvent(){return gainHealth(20)}, nextGameLevel: getNextGameLevel(()=>14.12)},
  ]
},
{
  id: 13.18,
  getText() {return "You leave the underground resistance headquarters. Where do you want to go?"},
  options:[
    {getText(){return "Bernice's Comfortable Inn"}, nextGameLevel:getNextGameLevel(()=>8.211)},
    {getText(){return "The town's local merchant"}, nextGameLevel:getNextGameLevel(()=>10.23)},
    {getText(){return "The Adventurer's Guild"}, nextGameLevel:getNextGameLevel(()=>10.24)},
    {getText(){return "The Royal Palace"}, requiredState:(currentState)=>currentState.foilResistancePlan===undefined && currentState.obsidianEye || currentState.mageStaff && currentState.foilResistancePlan===undefined, nextGameLevel:getNextGameLevel(()=>13.19)},
    {getText(){return "The Royal Palace"}, requiredState:(currentState)=>currentState.foilResistancePlan, nextGameLevel:getNextGameLevel(()=>13.21)},


  ]
},
{
  id: 13.19,
  getText() {return "You head to the Royal Palace. Upon arrival, you're stopped at the gates by a guard. \n\n Guard: \"\Where do you think you're going?\" \n\n You: \" I'm \
  an adventuerer here to offer my services to the King.\" \n\n Guard: \"Oh, really? You look like a weakling to me.\""},
  options:[
    {getText(){return "Show the guard the Obsidian Eye"}, requiredState:(currentState)=>currentState.obsidianEye, nextGameLevel:getNextGameLevel(()=>13.191)},
    {getText(){return "Show the guard the Mage's Staff"}, requiredState:(currentState)=>currentState.mageStaff, nextGameLevel:getNextGameLevel(()=>13.192)},
  ]
},
{
  id: 13.191,
  getText() {return "You: \"You think I'm weak? I single-handedly defeated the Stone Golem that lived on Mt. Vernik. I'd LOVE to see you do something like that, oh powerful \
  guardsman. You want proof, look at the Golem's Obsidian Eye I took after I slew him.\" \n\n Guard: \"Wait, you're the adventurer who killed the Golem? I'm so sorry! I didn't \
  know that was you! Please, go on ahead! The King will want to see you. I'll send a messanger ahead to ensure you're seen.\""},
  options:[
    {getText(){return "Head inside the Royal Palace to see the King"}, nextGameLevel:getNextGameLevel(()=>13.1911)},
  ]
},
{
  id: 13.1911,
  getText() {return "As you reach the main hallway in the Royal Palace, you marvel at the palace's beauty. It's pillars are made of pure marble, the walls are decorated with \
  paintings created by some of the world's finest painters, and ceiling is adorned with the most glamorous chandelier made completely of gold. It must have cost a fortune \
  to build this place... \n\n You finally reach the King's Throne Room. \n\n King: \"My guard sent word that you were coming. What took so long?! Nevermind. Look, I \
  have need of a powerful adventurer like you. Think you can help?\""},
  options:[
    {getText(){return "Well that depends, what do you need?"}, nextGameLevel:getNextGameLevel(()=>13.19111)},
    {getText(){return "Of course, your Majesty! I can definitely help."}, setState:{codePhrase:true}, nextGameLevel:getNextGameLevel(()=>13.19112)},
    {getText(){return "(Lie) Of course, your Majesty! I can definitely help."}, setState:{codePhrase:true}, nextGameLevel:getNextGameLevel(()=>13.19112)},
  ]
},
{
  id: 13.19111,
  getText() {return "King: \"That depends?! How dare you not immediately agree! I AM YOUR KING! YOU WILL DO WHAT I ASK! Now then... Where was I? Oh, right. There is a group \
  of pitiful rebels trying to overthrow me. I sent an informant to find their hideout, but he hasn't returned yet. Your role will be to find him, get the information he's acquired,\
   and bring it back to me. In order to get the information, the spy will say,\"The sun burns today\" and you must respond with, \"Only those who seek to oppose it\". \n\n NOW GO!\""},
  options:[
    {getText(){return "Yes your Kingliness! I'll report back with my findings."}, setState:{codePhrase:true}, nextGameLevel:getNextGameLevel(()=>13.20)},
    {getText(){return "(Lie) Aye aye, Kingy! I'll get you what you need."}, setState:{codePhrase:true}, nextGameLevel:getNextGameLevel(()=>13.20)},
  ]
},
{
  id: 13.19112,
  getText() {return "King: \"I'm glad that I have such a loyal subject who will obey me without question. Now then... Where was I? Oh, right. There is a group \
  of pitiful rebels trying to overthrow me. I sent an informant to find their hideout, but he hasn't returned yet. Your role will be to find him, get the information he's acquired,\
   and bring it back to me. In order to get the information, the spy will say,\"The sun burns today\" and you must respond with, \"Only those who seek to oppose it\". \n\n Now, \
   what say you. Will you help me?\""},
  options:[
    {getText(){return "Yes your Kingliness! I'll report back with my findings."}, nextGameLevel:getNextGameLevel(()=>13.20)},
    {getText(){return "(Lie) Aye aye, Kingy! I'll get you what you need."}, nextGameLevel:getNextGameLevel(()=>13.20)},
  ]
},
{
  id: 13.192,
  getText() {return "You: \"You think I'm weak? I single-handedly defeated the Skeleton Horde terrorizing AND the Mage controlling them. I'd LOVE to see you do something like that, oh powerful \
  guardsman. You want proof, look at the Mage's Staff I took after I defeated him.\" \n\n Guard: \"Wait, you're the adventurer who killed all of those Skeletons?! I'm so sorry! I didn't \
  know that was you! Please, go on ahead! The King will want to see you. I'll send a messanger ahead to ensure you're seen.\""},
  options:[
    {getText(){return "Head inside the Royal Palace to see the King"}, nextGameLevel:getNextGameLevel(()=>13.1911)},
  ]
},
{
  id: 13.20,
  getText() {return "You leave the Royal Palace. Where do you want to go?"},
  options:[
    {getText(){return "Bernice's Comfortable Inn"}, nextGameLevel:getNextGameLevel(()=>8.211)},
    {getText(){return "The town's local merchant"}, nextGameLevel:getNextGameLevel(()=>10.23)},
    {getText(){return "The Adventurer's Guild"}, nextGameLevel:getNextGameLevel(()=>10.24)},
  ]
},
{
id: 13.21,
getText() {return "You head to the Royal Palace. Upon arrival, you're stopped at the gates by a guard. \n\n Guard: \"\Where do you think... OH! It's you, adventurer! The King has been expecting you. Go right on in.\" \n\n You: \" \
Thanks!\""},
options:[
  {getText(){return "Head inside the Royal Palace to see the King"},  requiredState:(currentState)=>currentState.foilResistancePlan && currentState.foilResistancePlan3===undefined, nextGameLevel:getNextGameLevel(()=>13.211)},
  {getText(){return "Head inside the Royal Palace to see the King"},  requiredState:(currentState)=>currentState.foilResistancePlan3, nextGameLevel:getNextGameLevel(()=>13.22)},
  {getText(){return "Leave"}, nextGameLevel:getNextGameLevel(()=>13.20)},
  ]
},
{
  id: 13.211,
  getText() {return "King: \"Yes, finally! It took you long enough. Do you KNOW how long I have been just WAITING for you? I expected you to bring back the information AGESSSS ago! Now, what information do you have for me? And \
  hurry up with it! I don't have all day, you know!\""},
  options:[
    {getText(){return "Report findings of the hooded man"}, setState:{codePhrase:false, foilResistancePlan2:true,}, nextGameLevel:getNextGameLevel(()=>13.212)},
    {getText(){return "Lie"},  setState:{codePhrase:false, foilResistancePlan:false ,foilKingPlan:true}, nextGameLevel:getNextGameLevel(()=>13.213)},
  ]
},
{
  id: 13.212,
  getText() {return "You: \"I spoke with your spy and the resistance plans on attacking in three days. They plan on sending a large frontal assult through the gates, but that's just a decoy. They're going to send a small \
  squadron of soldiers through the underground sewers leading right underneath the Royal Palace's courtyard. From there, they plan on infiltrating the castle by storming its back gates and taking you by surprise \
  while your Palace Guards are occupied with the frontal assult.\" \n\n King: \"Well well, you were useful after all. Hmm, as a reward for your loyalty, I'll give you the HONOR of leading some of my men to take out the \
  rebel's squadron. Once you finish with them, take command of the frontal assult. I don't want a single rebel to escape. SLAY THEM ALL! \n\n Before you leave, I want you to take Nyx, the spy you met, a message. \
  Tell him, \"Greek Fire\". He'll know what that means. Then report back here and you'll prepare for the invasion. Now go!\""},
  options:[
    {getText(){return "Yes, your majesty"}, setState:{codePhrase:false, foilResistancePlan2:true},nextGameLevel:getNextGameLevel(()=>13.20)},
  ]
},
{
  id: 13.213,
  getText() {return "You: \"I spoke with your spy and the resistance doesn't plan on attacking you anytime soon. They just don't have the resources or people right now. The spy wanted to stay there longer so he could learn \
  more, but he DEFINITELY thinks you're safe for now! \" \n\n King: \"Well well, you were useful after all. Thanks for the information. Now, leave my presence at once! I'm busy with Kingly duties!\""},
  options:[
    {getText(){return "Yes, your majesty"}, nextGameLevel:getNextGameLevel(()=>13.20)},
  ]
},
{
  id: 13.22,
  getText() {return "King: \"Good! You're back. Did you speak with Nyx?\""},
  options:[
    {getText(){return "Yes, he said it would be done"}, nextGameLevel:getNextGameLevel(()=>13.221)},
  ]
},
{
  id: 13.221,
  getText() {return "King: \"Excellent. Now, get some rest. You have a long battle coming up.\""},
  options:[
    {getText(){return "Rest: +20 HP"}, healthEvent(){return gainHealth(20)}, nextGameLevel:getNextGameLevel(()=>15.14)},
  ]
},
{
  id: 14.10,
  getText() {return "You: \"Fine, I'll spare you, but you must introduce me to the Warlock. I'm eager to make his aquaintance.\" \n\n Warlock's Apprentice: \"Thank you! By the way, \
  you can call me Leo! Anyways, I'll bring you to him right away. Come on, let's go!\""},
  options:[
    {getText(){return "Loot your attackers' corpses"}, setState:{extremeHealthPotion:true}, nextGameLevel:getNextGameLevel(()=>14.111)},
    {getText(){return "Follow Leo to the castle"}, nextGameLevel:getNextGameLevel(()=>15.10)},
  ]
},
{
  id: 14.11,
  getText() {return "You: \"No... Today you die for crossing me.\" \n\n You strike down the Warlock's Apprentice. What do you want to do?"},
  options:[
    {getText(){return "Loot your attackers' corpses"}, setState:{extremeHealthPotion:true}, nextGameLevel:getNextGameLevel(()=>14.111)},
    {getText(){return "Go to the Warlock's castle"}, nextGameLevel:getNextGameLevel(()=>15.11)},
  ]
},
{
  id: 14.111,
  getText() {return "You find an Extreme Health Potion. This will drastically increase your health."},
  options:[
    {getText(){return "Use health potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, setState:{extremeHealthPotion:false}, healthEvent(){return gainHealth(60)}, nextGameLevel:getNextGameLevel(()=>14.1111)},
    {getText(){return "Save it for later"}, requiredState:(currentState)=>currentState.extremeHealthPotion, nextGameLevel:getNextGameLevel(()=>14.1112)},
  ]
},
{
  id: 14.1111,
  getText() {return "You use an Extreme Health Potion. This will drastically increase your health."},
  options:[
    {getText(){return "Continue on to the Warlock's Castle"}, nextGameLevel:getNextGameLevel(function(){if(getWarlockApprentices()>0) {return 15.10;} else {return 15.11}})},
  ]
},
{
  id: 14.1112,
  getText() {return "You save the potion for later."},
  options:[
    {getText(){return "Continue on to the Warlock's Castle"}, nextGameLevel:getNextGameLevel(function(){if(getWarlockApprentices()>0) {return 15.10;} else {return 15.11}})},
  ]
},
{
  id: 14.12,
  getText() {return "You rest and spend the next couple of days preparing for the battle ahead with your fellow adventurers. Finally, the day is at hand. "},
  options:[
    {getText(){return "Continue"}, requiredState:(currentState)=>currentState.nyxPrison, nextGameLevel:getNextGameLevel(()=>15.12)},
    {getText(){return "Continue"}, requiredState:(currentState)=>currentState.nyxPrison===undefined, nextGameLevel:getNextGameLevel(()=>15.13)},
  ]
},
{
  id: 15.10,
  getText() {return "You follow Leo to the Warlock's castle and head inside. Inside, you find Fagrim the Warlock waiting for you. \n\n Leo: \"My master, \
  we ambushed the adventurer as you requested, but he was too strong. He easily overcame Will and Malak. He only spared me because I promised to bring him \
  before you in hopes that you would teach him magic.\" \n\n Fagrim: \"Is this true, adventurer? Did you slay my pupils?\""},
  options:[
    {getText(){return "Yes, and I'd do it again if they dare cross me."}, nextGameLevel:getNextGameLevel(()=>15.101)},
    {getText(){return "I was attacked out of nowhere. I had no choice. I didn't mean to!"}, nextGameLevel:getNextGameLevel(()=>15.102)},
  ]
},
{
  id: 15.101,
  getText() {return "Fagrim: \"Good. You shouldn't be sorry either. I test all of my apprentices with some type of deadly task, this was theirs. Only Leo \
  survived, and that was by sheer cowardice.\" \n\n Leo: \"But, master! I didn't — \" \n\n Fagrim: \"Shut your mouth. You failed me for the last time.\" \n\n Fagrim \
  blasts Leo with Flame Wave, burning him to a crisp. \n\n Fagrim: \"Now, where were we? Oh yes, so my apprentices all failed their task. It was their last one until \
  they could be considered a Journeyman, the lowest rank of Mage. But you! You defeated all of my apprentices so easily! I'm not normally this eager to take on more \
  apprentices, but I would make an exception for you. What do you say, will you join me?\""},
  options:[
    {getText(){return "I would be honored to be your apprentice"}, nextGameLevel:getNextGameLevel(()=>15.1011)},
    {getText(){return "You just killed your apprentice. Why would I want to be your new one?"}, nextGameLevel:getNextGameLevel(()=>15.1012)},
  ]
},
{
  id: 15.1011,
  getText() {return "Fagrim takes you on to be his apprentice, and you begin to learn how to use magic. You train for years and finally reach the level of Warlock! Now, \
  the true adventure begins... \n\n To Be Continued."},
  options:[
    {getText(){return "New Game"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 15.1012,
  getText() {return "Fagrim: \"So be it.\" \n\n Fagrim: "+ getFagrimHP()+" HP"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(2,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,11), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10211;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,6), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(5,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10212;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,5), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(7,15), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10213;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,23), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10214;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Snipe (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(8,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,10), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10215;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killFagrim(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10216;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},
    ]
},
{
  id: 15.102,
  getText() {return "Fagrim: \"You weakling! You're just as weak-minded as my apprentices. That's why they died... And why you too shall die.\" \n\n Suddenly, Fagrim \
  zaps Leo with a Lightning Bolt, killing him instantly. \n\n Fagrim: \"Your turn.\" \n\n Fagrim: "+ getFagrimHP()+" HP"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(2,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,11), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10211;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,6), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(5,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10212;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,5), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(7,15), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10213;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,23), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10214;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Snipe (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(8,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,10), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10215;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killFagrim(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10216;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},
    ]
},
{
  id: 15.10211,
  getText() {return "You used Flurry Rush on Fagrim. \n\n Fagrim: "+ getFagrimHP()+" HP"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(2,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,11), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10211;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,6), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(5,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10212;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,5), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(7,15), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10213;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,23), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10214;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Snipe (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(8,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,10), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10215;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killFagrim(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10216;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},
    ]
},
{
  id: 15.10212,
  getText() {return "You used Lunging Strike on Fagrim. \n\n Fagrim: "+ getFagrimHP()+" HP"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(2,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,11), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10211;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,6), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(5,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10212;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,5), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(7,15), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10213;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,23), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10214;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Snipe (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(8,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,10), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10215;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killFagrim(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10216;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},
    ]
},
{
  id: 15.10213,
  getText() {return "You stabbed at Fagrim with your dagger. \n\n Fagrim: "+ getFagrimHP()+" HP"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(2,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,11), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10211;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,6), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(5,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10212;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,5), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(7,15), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10213;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,23), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10214;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Snipe (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(8,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,10), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10215;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killFagrim(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10216;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},
    ]
},
{
  id: 15.10214,
  getText() {return "You used Multishot on Fagrim with your bow. \n\n Fagrim: "+ getFagrimHP()+" HP"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(2,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,11), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10211;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,6), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(5,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10212;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,5), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(7,15), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10213;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,23), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10214;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Snipe (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(8,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,10), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10215;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killFagrim(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10216;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},
    ]
},
{
  id: 15.10215,
  getText() {return "You sniped Fagrim with your bow. \n\n Fagrim: "+ getFagrimHP()+" HP"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(2,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,11), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10211;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,6), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(5,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10212;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,5), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(7,15), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10213;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,23), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10214;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Snipe (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(8,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,10), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10215;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killFagrim(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10216;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},
    ]
},
{
  id: 15.10216,
  getText() {return "You punched Fagrim. How pitiful... \n\n Fagrim: "+ getFagrimHP()+" HP"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(2,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,11), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10211;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,6), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(5,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10212;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,5), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(7,15), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10213;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,23), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10214;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Snipe (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(8,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,10), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10215;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killFagrim(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10216;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},
    ]
},
{
  id: 15.10217,
  getText() {return "You healed yourself! \n\n Fagrim: "+ getFagrimHP()+" HP"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(2,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,11), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10211;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,6), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(5,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10212;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,5), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(7,15), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10213;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,23), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10214;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Snipe (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(8,12), killMonsterEvent(){return killFagrim(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(3,10), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10215;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(1, 2),  killMonsterEvent(){return killFagrim(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10216;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getFagrimHP()>0) {return 15.10217;} else {return 15.1022}}, 15.1023)},
    ]
},
{
  id: 15.1022,
  getText() {return "Fagrim: \"Agh! How, adventurer? How could you defeat me?! I'm the most powerful Warlock that ever lived...\"\n\n Fagrim looks like he is trying to say something else \
  but he coughs up some blood and slumps over. The Warlock, Fagrim, is dead."},
  options:[
    {getText(){return "Continue"}, nextGameLevel:getNextGameLevel(()=>15.10221)},
    ]
},
{
  id: 15.1023,
  getText() {return "Fagrim: \"Foolish adventurer, I'm the most powerful Warlock that ever lived! You thought you even had a CHANCE at beating me?! Perhaps you will make \
  better choices in your next life.\""},
  options:[
    {getText(){return "Restart"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
    ]
},
{
  id: 15.10221,
  getText() {return "Narrator: \"I...I'm speechless... I thought I made the game hard enough that you would just give up before beating it... Well, congratulations, Player! \
  You beat my game. I guess I'll have come out with another one that will crush your spirit! MWAHAHAHA! \n\n Just kidding... If you haven't beaten the other ending, I suggest trying it.\
  Unless... YOU'RE CHICKEN! BAKAWK! \n\n The End.\""},
  options:[
    {getText(){return "New Game"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
    ]
},
{
  id: 15.11,
  getText() {return "You make your way to the Warlock's castle. Once there, you head inside and immediately come face-to-face with Fagrim. \n\n Fagrim: \"So, you're the one \
  who killed all of my apprentices. Impressive. You must be skilled if you took on all three of them and lived. How would you like to become my newest apprentice? I think I \
  could really make something out of someone already as powerful as you.\""},
  options:[
    {getText(){return "What's the catch..."}, nextGameLevel:getNextGameLevel(()=>15.111)},
    {getText(){return "Actually, I'm just here to kill you"}, nextGameLevel:getNextGameLevel(()=>15.1012)},
    ]
},
{
  id: 15.111,
  getText() {return "Fagrim: \"I'm getting old and I need someone to pass my knowledge on to. I've been looking for a worthy apprentice, but everyone I've trained has been \
  either physically weak or weak-minded. You appear to be neither, so I think you might have a chance of surviving my training. What say you?\""},
  options:[
    {getText(){return "You know what? Sure, I'll do it."}, nextGameLevel:getNextGameLevel(()=>15.1011)},
    {getText(){return "Actually, I'm just here to kill you"}, nextGameLevel:getNextGameLevel(()=>15.111)},
    ]
},
{
  id: 15.12,
  getText() {return "You and the rest of the elite squadron crawl through the slimy sewers for what seems like hours. You finally arrive to the point on the map where \
  the Royal Palace's courtyard is supposed to be. You lookup and see the manhole cover and motion to the other adventurers to give you a boost. You lift off the manhole cover, \
  carefully look around to make sure no one is watching, and pull yourself up into the courtyard. You reach out your arm and begin pulling some of the others up before you hear \
  a horn blow and shouting rapidly getting closer to you. As you pull up your last member of your squadron, you're attacked by a wave of Palace Guards. At least you'll \
  have an easier time fending them off since you have backup. \n\n Palace Guards: " +getWave1()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.121;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.122;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.123;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.124;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.125;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.126;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.127;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.128;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.129;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},
    ]
},
{
  id: 15.121,
  getText() {return "You use Flurry Rush against the Palace Guards! \n\n Palace Guards: " +getWave1()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.121;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.122;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.123;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.124;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.125;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.126;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.127;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.128;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.129;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},
    ]
},
{
  id: 15.122,
  getText() {return "You use Lunging Strike against the Palace Guards! \n\n Palace Guards: " +getWave1()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.121;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.122;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.123;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.124;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.125;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.126;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.127;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.128;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.129;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},
    ]
},
{
  id: 15.123,
  getText() {return "You use Hell's Fury against the Palace Guards! \n\n Palace Guards: " +getWave1()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.121;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.122;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.123;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.124;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.125;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.126;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.127;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.128;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.129;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},
    ]
},
{
  id: 15.124,
  getText() {return "You use Frozen Slash against the Palace Guards! \n\n Palace Guards: " +getWave1()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.121;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.122;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.123;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.124;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.125;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.126;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.127;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.128;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.129;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},
    ]
},
{
  id: 15.125,
  getText() {return "You stabbed the Palace Guards! \n\n Palace Guards: " +getWave1()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.121;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.122;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.123;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.124;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.125;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.126;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.127;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.128;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.129;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},
    ]
},
{
  id: 15.126,
  getText() {return "You use Multishot against the Palace Guards! \n\n Palace Guards: " +getWave1()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.121;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.122;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.123;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.124;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.125;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.126;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.127;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.128;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.129;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},
    ]
},
{
  id: 15.127,
  getText() {return "You use Snipe against the Palace Guards! \n\n Palace Guards: " +getWave1()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.121;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.122;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.123;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.124;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.125;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.126;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.127;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.128;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.129;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},
    ]
},
{
  id: 15.128,
  getText() {return "You use Wrath of Heaven against the Palace Guards! \n\n Palace Guards: " +getWave1()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.121;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.122;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.123;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.124;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.125;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.126;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.127;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.128;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.129;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},
    ]
},
{
  id: 15.129,
  getText() {return "You punched the Palace Guards... How lame. \n\n Palace Guards: " +getWave1()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.121;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.122;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.123;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.124;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.125;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.126;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.127;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.128;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.129;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},
    ]
},
{
  id: 15.1211,
  getText() {return "You used a potion to recover some health! \n\n Palace Guards: " +getWave1()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.121;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.122;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.123;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.124;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.125;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.126;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.127;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.128;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.129;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1211;} else {return 15.1212}}, 15.1213)},
    ]
},
{
  id: 15.1213,
  getText() {return "You're impaled by some of the Royal Guards who then cut off your head. As your spirit begins to rise, you hear a voice from above say, \"Now isn't \
  the time, Adventurer. I'm pretty busy with a lot of paperwork and can't handle another spirit in the afterlife right now. Tell you what, I'll rewind time and send you \
  back to a period of time in your past. Perhaps you'll make better choices in your next life, right? Go, now! I'm very busy!\""},
  options:[
    {getText(){return "Restart"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 15.1212,
  getText() {return "You and your squad defeat the Palace Guards without too much trouble, although the commotion caused by the battle most likely alerted the rest of the guards inside. \
  Your squad begins rushing the castle and breaches the back gates. The run inside and into the Royal Palace's Throne Room; but, waiting for you, are two platoons of Palace Guards, numbering about 100 men in total. \n\n Ukaji: \"Men, it's now \
  or never! Charge!!!\" \n\n Palace Guards: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12121;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12122;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12123;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12124;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12125;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12126;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12127;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12128;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12129;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},
    ]
},
{
  id: 15.12121,
  getText() {return "You use Flurry Rush against the Palace Guards! \n\n Palace Guards: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12121;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12122;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12123;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12124;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12125;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12126;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12127;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12128;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12129;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},
    ]
},
{
  id: 15.12122,
  getText() {return "You use Lunging Strike against the Palace Guards! \n\n Palace Guards: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12121;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12122;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12123;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12124;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12125;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12126;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12127;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12128;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12129;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},
    ]
},
{
  id: 15.12123,
  getText() {return "You use Hell's Fury against the Palace Guards! \n\n Palace Guards: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12121;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12122;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12123;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12124;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12125;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12126;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12127;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12128;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12129;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},
    ]
},
{
  id: 15.12124,
  getText() {return "You use Frozen Slash against the Palace Guards! \n\n Palace Guards: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12121;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12122;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12123;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12124;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12125;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12126;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12127;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12128;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12129;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},
    ]
},
{
  id: 15.12125,
  getText() {return "You stabbed the Palace Guards! \n\n Palace Guards: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12121;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12122;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12123;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12124;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12125;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12126;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12127;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12128;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12129;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},
    ]
},
{
  id: 15.12126,
  getText() {return "You use Multishot against the Palace Guards! \n\n Palace Guards: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12121;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12122;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12123;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12124;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12125;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12126;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12127;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12128;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12129;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},
    ]
},
{
  id: 15.12127,
  getText() {return "You used Snipe against the Palace Guards! \n\n Palace Guards: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12121;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12122;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12123;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12124;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12125;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12126;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12127;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12128;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12129;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},
    ]
},
{
  id: 15.12128,
  getText() {return "You use Wrath of Heaven against the Palace Guards! \n\n Palace Guards: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12121;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12122;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12123;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12124;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12125;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12126;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12127;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12128;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12129;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},
    ]
},
{
  id: 15.12129,
  getText() {return "You punched the Palace Guards... Seriously? How lame. \n\n Palace Guards: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12121;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12122;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12123;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12124;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12125;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12126;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12127;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12128;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12129;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},
    ]
},
{
  id: 15.121211,
  getText() {return "You use a potion to heal yourself \n\n Palace Guards: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12121;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12122;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12123;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12124;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12125;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12126;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12127;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12128;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.12129;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.121211;} else {return 15.1214}}, 15.1215)},
    ]
},
{
  id: 15.1214,
  getText() {return "Ukaji: \"Great job, men! Now grab the King! It's about time we deal with him.\" \n\n Two of the adventurers in your squadron rush towards the King who was \
  already trying to sneak out of the room unnoticed. They grab his arms and start dragging him to the center of the Throne Room where Ukaji is waiting for him. \n\n Ukaji: \"My King, \
  your reign has come to an end. You have held your citizens hostage for far too long; for this, you shall pay the ultimate price.\" \n\n Ukaji takes his gleaming sword and raises it above \
  his head before swiftly bringing it down and cleanly slicing through the King's neck. Shouts of victory errupt from the squadron, alerting the Royal Guards and the resistance fighters outside \
  the main gates. Everyone stops fighting to look towards the shouting and they all see the King's decapitated torse fall to the floor. Upon seeing this, the remaining Royal Guards lay down \
  their arms and surrender to the resistance."},
  options:[
    {getText(){return "Continue"}, nextGameLevel:getNextGameLevel(()=>16.10)},
  ]
},
{
  id: 15.1215,
  getText() {return "You're stabbed by some of the Royal Guards who then proceed to kick you to the floor. As everything begins to go dark, you hear the King shout, \
  \"Take that you stupid insurgent! Perhaps you'll make better choices in your next life and decide to not oppose me!\""},
  options:[
    {getText(){return "Restart"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 15.13,
  getText() {return "Ukaji, Nyx, you, and the rest of your squadron head into the sewers to invade the Royal Palace. After traveling for thirty minutes, Nyx suddenly \
  rushes ahead of the group and pulls out a large glass bottle with some kind of liquid in it! \n\n Nyx: \"I won't let you get to the King! You're all traitors!\" \n\n He throws the bottle\
  into the sewer water and suddenly the whole sewer is set ablaze! He must have used Greek Fire! Your squadron desperately tries to escape, but the fire spreads too quickly. \
  Soon, everyone is consumed by flames. \n\n Nyx: \"That'll teach you to betray the king! Perhaps you all will make better choices in your next lives!\""},
  options:[
    {getText(){return "Restart"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
{
id: 15.14,
getText() {return "The day of the attack comes and you feel extremely prepared for what's to come. You and a small group of Palace Guards gather in the Royal Palace's courtyard, making sure to stay hidden. \
Suddenly, you hear screams coming from underneath the courtyard grounds! The manhole cover leading to the sewers opens and Nyx jumps out, completely ablaze, and begins rolling on the ground. \n\n Nyx: \
\"Agh! The greek fire was a terrible idea! AGHHH, HELP ME!!!\" \n\n Some of the Palace Guards tried to put it out with water, but nothing helped. Before you knew it, Nyx was dead. While you and the Palace Guards were \
occupied with Nyx, the Rebels climbed up the manhole cover, somehow unscathed by the greek fire. They begin to charge at you! \n\n Rebels: " +getWave1()+" remaining"},
options:[
  {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.141;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.142;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.143;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.144;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.145;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.146;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.147;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.148;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.149;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},
  ]
},
{
id: 15.141,
getText() {return "You use Flurry Rush against the Rebels! \n\n Rebels: " +getWave1()+" remaining"},
options:[
  {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.141;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.142;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.143;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.144;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.145;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.146;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.147;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.148;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.149;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},
  ]
},
{
id: 15.142,
getText() {return "You use Lunging Strike against the Rebels! \n\n Rebels: " +getWave1()+" remaining"},
options:[
  {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.141;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.142;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.143;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.144;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.145;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.146;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.147;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.148;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.149;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},
  ]
},
{
id: 15.143,
getText() {return "You use Hell's Fury against the Rebels! \n\n Rebels: " +getWave1()+" remaining"},
options:[
  {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.141;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.142;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.143;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.144;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.145;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.146;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.147;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.148;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.149;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},
  ]
},
{
id: 15.144,
getText() {return "You use Frozen Slash against the Rebels! \n\n Rebels: " +getWave1()+" remaining"},
options:[
  {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.141;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.142;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.143;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.144;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.145;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.146;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.147;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.148;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.149;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},
  ]
},
{
id: 15.145,
getText() {return "You stabbed the Rebels! \n\n Rebels: " +getWave1()+" remaining"},
options:[
  {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.141;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.142;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.143;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.144;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.145;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.146;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.147;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.148;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.149;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},
  ]
},
{
id: 15.146,
getText() {return "You use Multishot against the Rebels! \n\n Rebels: " +getWave1()+" remaining"},
options:[
  {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.141;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.142;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.143;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.144;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.145;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.146;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.147;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.148;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.149;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},
  ]
},
{
id: 15.147,
getText() {return "You use Snipe against the Rebels! \n\n Rebels: " +getWave1()+" remaining"},
options:[
  {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.141;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.142;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.143;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.144;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.145;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.146;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.147;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.148;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.149;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},
  ]
},
{
id: 15.148,
getText() {return "You use Wrath of Heaven against the Rebels! \n\n Rebels: " +getWave1()+" remaining"},
options:[
  {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.141;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.142;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.143;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.144;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.145;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.146;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.147;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.148;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.149;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},
  ]
},
{
id: 15.149,
getText() {return "You punched the Rebels... How lame. \n\n Rebels: " +getWave1()+" remaining"},
options:[
  {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.141;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.142;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.143;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.144;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.145;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.146;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.147;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.148;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.149;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},
  ]
},
{
id: 15.1411,
getText() {return "You used a potion to recover some health! \n\n Rebels: " +getWave1()+" remaining"},
options:[
  {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(2,7), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.141;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.142;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.143;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,6), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.144;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(4,12), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.145;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.146;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.147;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,7), killMonsterEvent(){return killWave1(getDeadMonsters())},
  heroDamageRandomizerEvent:heroDamageRandomizer(0,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.148;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave1(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.149;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},

  {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave1()>0) {return 15.1411;} else {return 15.1412}}, 15.1413)},
  ]
},
{
  id: 15.1412,
  getText() {return "You finally manage to crush the resistance that were coming through the sewers. As you and your Royal Guards start running to the main gates of the Royal Palace, one of the injured guards you pass hands\
  you a Super Health Potion. \n\n Injured Guard: \"Good luck out there. It's pretty brutal.\"\""},
  options:[
    {getText(){return "Drink health potion"}, healthEvent(){return gainHealth(40)},nextGameLevel:getNextGameLevel(()=>15.14121)},
    {getText(){return "Save it and head into battle"}, nextGameLevel:getNextGameLevel(()=>15.14122)},

  ]
},
{
  id: 15.14122,
  getText() {return "You and your Palace Guards rush into battle. It looks like the Palace Guards on duty here were pretty outnumbered as there were still about 100 Rebels left, but only about 50 Palace Guards. \
  \"Well,\" You think to yourself. \"That's about to change!\" \n\n Rebels: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141221;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141222;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141223;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141224;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141225;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141226;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141227;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141228;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141229;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},
    ]
},
{
  id: 15.141221,
  getText() {return "You use Flurry Rush against the Rebels! \n\n Rebels: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141221;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141222;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141223;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141224;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141225;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141226;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141227;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141228;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141229;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},
    ]
},
{
  id: 15.141222,
  getText() {return "You use Lunging Strike against the Rebels! \n\n Rebels: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141221;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141222;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141223;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141224;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141225;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141226;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141227;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141228;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141229;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},
    ]
},
{
  id: 15.141223,
  getText() {return "You use Hell's Fury against the Rebels! \n\n Rebels: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141221;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141222;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141223;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141224;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141225;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141226;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141227;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141228;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141229;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},
    ]
},
{
  id: 15.141224,
  getText() {return "You use Frozen Slash against the Rebels! \n\n Rebels: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141221;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141222;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141223;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141224;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141225;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141226;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141227;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141228;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141229;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},
    ]
},
{
  id: 15.141225,
  getText() {return "You stabbed the Rebels! \n\n Rebels: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141221;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141222;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141223;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141224;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141225;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141226;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141227;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141228;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141229;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},
    ]
},
{
  id: 15.141226,
  getText() {return "You use Multishot against the Rebels! \n\n Rebels: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141221;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141222;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141223;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141224;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141225;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141226;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141227;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141228;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141229;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},
    ]
},
{
  id: 15.141227,
  getText() {return "You used Snipe against the Rebels! \n\n Rebels: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141221;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141222;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141223;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141224;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141225;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141226;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141227;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141228;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141229;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},
    ]
},
{
  id: 15.141228,
  getText() {return "You use Wrath of Heaven against the Rebels! \n\n Rebels: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141221;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141222;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141223;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141224;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141225;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141226;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141227;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141228;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141229;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},
    ]
},
{
  id: 15.141229,
  getText() {return "You punched the Rebels... Seriously? How lame. \n\n Rebels: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141221;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141222;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141223;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141224;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141225;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141226;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141227;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141228;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141229;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},
    ]
},
{
  id: 15.1412211,
  getText() {return "You use a potion to heal yourself \n\n Rebels: " +getWave2()+" remaining"},
  options:[
    {getText(){return "Flurry Rush attack: (dual swords)"}, requiredState:(currentState)=>currentState.dualSword, monsterDeathRandomizerEvent:monsterDeathRandomizer(1,8), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,5), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141221;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Lunging Strike (sword)"}, requiredState:(currentState)=>currentState.goblinSword || currentState.longSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,5), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,6), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141222;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Hell's Fury (Sword of the Flame)"}, requiredState:(currentState)=>currentState.flameSword,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,10), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141223;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Frozen Slash (Frost Blade)"}, requiredState:(currentState)=>currentState.frostBlade,  monsterDeathRandomizerEvent:monsterDeathRandomizer(1,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,3), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141224;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Stab (dagger)"}, requiredState:(currentState)=>currentState.goblinDagger,  monsterDeathRandomizerEvent:monsterDeathRandomizer(0,3), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(4,9), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141225;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Multishot (bow)"}, requiredState:(currentState)=>currentState.bow && state.arrows>=3, arrowEvent:loseArrow(3),  monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 4), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141226;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Snipe (longbow)"}, requiredState:(currentState)=>currentState.longBow && state.arrows>=1, arrowEvent:loseArrow(1), monsterDeathRandomizerEvent:monsterDeathRandomizer(0,2), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(1,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141227;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Wrath of Heaven (Bow of Light)"}, requiredState:(currentState)=>currentState.bowOfLight, monsterDeathRandomizerEvent:monsterDeathRandomizer(0,9), killMonsterEvent(){return killWave2(getDeadMonsters())},
    heroDamageRandomizerEvent:heroDamageRandomizer(0,4), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141228;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Punch"}, monsterDeathRandomizerEvent:monsterDeathRandomizer(0, 2),  killMonsterEvent(){return killWave2(getDeadMonsters())}, randomizerEvent:heroDamageRandomizer(10, 25), healthEvent(){return loseHealth(getDamageTaken())}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.141229;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Health Potion: +20 HP"}, requiredState:(currentState)=>currentState.healthPotion, setState:{healthPotion:false}, heroDamageRandomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(20 - (getDamageTaken()))}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Super Health Potion: +40 HP"}, requiredState:(currentState)=>currentState.superHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(40 - (getDamageTaken()))},setState:{superHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},

    {getText(){return "Use Extreme Health Potion: +60 HP"}, requiredState:(currentState)=>currentState.extremeHealthPotion, randomizerEvent:heroDamageRandomizer(1,2), healthEvent(){return gainHealth(60 - (getDamageTaken()))},setState:{extremeHealthPotion:false}, nextGameLevel:getNextGameLevel(function(){if(getWave2()>0) {return 15.1412211;} else {return 15.14123}}, 15.1413)},
    ]
},
{
  id: 15.14123,
  getText() {return "Even with being completely outnumbered, you and your Palace Guards somehow defeated the Rebels and killed every last one of them. All of the guards errupt into cheers and victory chants! You head \
  back into the Royal Palace where the King awaits you. \n\n King: \"Are you FINALLY done out there?! Ugh, I don't understand why it took so long. They were just a bunch of pitiful adventurers. Well, anyways, good job for \
  saving the Royal Palace and all that, I guess. Since you're the one who seemed to take the most charge, I'm going to make you my new General and Second-In-Command. Congratulations. Now get out of my Throne Room. You're getting \
  blood everywhere and it's ruining the vibe.\""},
  options:[
    {getText(){return "Continue"}, nextGameLevel:getNextGameLevel(()=>16.11)},
  ]
},
{
  id: 15.1413,
  getText() {return "You're impaled by some of the Rebels who then stab you one last time through the heart. As your spirit begins to rise, you hear a voice from above say, \"Ugh, really? \
  You had to die right now? I'm in the middle of a poker game! Just, ugh. I'll reset the timeline for you. Just go away so I can get back to my game. Perhaps you'll make better choices \
  in your next life. That way you stop interrupting me.\""},
  options:[
    {getText(){return "Restart"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 16.10,
  getText() {return "A few days have passed since the King was slain by Ukaji, when a summons across the kingdom is sent out for all citizens to gather in the Royal Palace's courtyard. \
  You head to the courtyard and wait for a couple of hours while the kingdom gathers together. You see Ukaji emerge onto the terrace that overlooks the courtyard. \n\n Ukaji: \"Citizens of Yolrein, \
  thank you for coming! I'm here to bring you the joyous news that we successfully have overthrown the King and are working to restore order to Yolrein. No longer will our people... MY. PEOPLE. Be terrorized \
  by thugs robbing us! No longer will we starve because we can't even afford bread! No longer will we live in fear!  \n\n I, your NEW KING of Yolrein, will put my citizens first! You, are who I am here \
  to protect and serve. I will not let even the poorest beggar go hungry under my rule! We shall once again make Yolrein a prosperous land! I look forward to serving each and every one of you!\" \n\n \
  A thunderous applause and roaring cheers explode from the crowd! A new future for Yolrein has begun."},
  options:[
    {getText(){return "Continue"}, nextGameLevel:getNextGameLevel(()=>16.101)},
  ]
},
{
  id: 16.101,
  getText() {return "Narrator: \"Great job finishing the game, adventurer! You saved the kingdom and ushered in an era of peace and prosperity! Now that you've beaten the game this way, try restarting \
  and beating the game through one of its other endings. Don't worry, I'll be creating more content soon to add on!\""},
  options:[
    {getText(){return "Restart"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
{
  id: 16.11,
  getText() {return "Narrator: \"Welp, you beat the game! Although, you did kind of kill off the only hope that the kingdom, so that probably wasn't the best choice on your part. I guess you must \
  LOVE playing the bad guy, huh? Either way, good job on winning! Try restarting and playing through to beat one of the other endings. Don't worry, I'll be creating more content soon to add on!\""},
  options:[
    {getText(){return "Restart"}, nextGameLevel:getNextGameLevel(()=>-1,-1)},
  ]
},
]
//Play the game
startGame();
