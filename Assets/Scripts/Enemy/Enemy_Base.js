#pragma strict

//Base class all enemies
var levelMaster : LevelMaster;
var smokeTrail : ParticleEmitter;
var explosionEffect : GameObject;
var myCashValue : int = 20;
var speedRange : Vector2 = Vector2(7.0, 10.0);
var forwardSpeed : float = 10.0;
var health : float = 100;
var maxHealth : float = 100;



function Awake ()
{
	//Connect to LevelMaster
	levelMaster = GameObject.FindWithTag("LevelMaster").GetComponent(LevelMaster);
	
	//set health and speed 
	maxHealth = health;
	forwardSpeed = Random.Range(speedRange.x, speedRange.y);
	
	
	//multiply the speed and health based on difficulty
	forwardSpeed*= levelMaster.difficultyMultiplier;
	health*= levelMaster.difficultyMultiplier;
	maxHealth*= levelMaster.difficultyMultiplier;
}


//function TakeDamage (damageAmount : float)
//{
	
	//if (health > 0)
	//{
		//health -= damageAmount;
		//if (health <= 0)
		//{
			//Explode();
			//return;
		//}
		//else if (health/maxHealth <= .75)//livet mindre än halva
		//{
			//smokeTrail.emit = true;
		//}
	//}
	
//}

function Explode ()
{
	//tell the levelmaster an enemy was destroyed
	levelMaster.enemyCount--;
	levelMaster.cashCount+=myCashValue;
	levelMaster.scoreCount+= (maxHealth + forwardSpeed * levelMaster.difficultyMultiplier); //får mer poäng när det blir svårare
	levelMaster.UpdateGUI();
	
	Instantiate(explosionEffect, transform.position, Quaternion.identity);
	Destroy(gameObject);
}


