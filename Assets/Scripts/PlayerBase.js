#pragma strict

var levelMaster : LevelMaster;

function Start ()
{
	//Connect to LevelMaster
	levelMaster = GameObject.FindWithTag("LevelMaster").GetComponent(LevelMaster);
}

function OnTriggerEnter (other : Collider) 
{
	if (other.gameObject.tag == "GroundEnemy1" || other.gameObject.tag == "AirEnemy")
	{
		Destroy(other.gameObject);
		levelMaster.enemyCount--;
		levelMaster.healthCount--;
		levelMaster.UpdateGUI();
		
	}
	
}