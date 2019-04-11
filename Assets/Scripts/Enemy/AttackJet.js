#pragma strict

var myCashValue : int = 20;

var heightRange : Vector2 = Vector2(10.0, 18.0);
var speedRange : Vector2 = Vector2(7.0, 10.0);
var forwardSpeed : float = 10.0;
var health : float = 100;
var smokeTrail : ParticleEmitter;
var explosionEffect : GameObject;

private var maxHealth : float = 100;

//LevelMaster
var levelMaster : LevelMaster;

function Start ()
{
	//Connect to LevelMaster
	levelMaster = GameObject.FindWithTag("LevelMaster").GetComponent(LevelMaster);
	
	
	maxHealth = health;
	forwardSpeed = Random.Range(speedRange.x, speedRange.y);
	transform.position.y = Random.Range(heightRange.x, heightRange.y);
	
	//multiply the speed and health based on difficulty
	forwardSpeed*= levelMaster.difficultyMultiplier;
	health*= levelMaster.difficultyMultiplier;
	maxHealth*= levelMaster.difficultyMultiplier;
}
function Update () 
{
	transform.Translate(Vector3.forward * (forwardSpeed * Time.deltaTime));
}

function TakeDamage (damageAmount : float)
{
	health -= damageAmount;
	
	if (health <= 0)
	{
		Explode();
		return;
	}
	else if (health/maxHealth <= .75)//livet mindre än halva
	{
		smokeTrail.emit = true;
	}
}

function Explode ()
{
	levelMaster.enemyCount--;
	levelMaster.cashCount+=myCashValue;
	levelMaster.scoreCount+= (maxHealth + forwardSpeed * levelMaster.difficultyMultiplier); //får mer poäng när det blir svårare
	levelMaster.UpdateGUI();
	
	Instantiate(explosionEffect, transform.position, Quaternion.identity);
	Destroy(gameObject);
}








