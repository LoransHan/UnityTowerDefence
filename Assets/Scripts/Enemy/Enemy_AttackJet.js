#pragma strict
class Enemy_AttackJet extends Enemy_Base
{
var heightRange :Vector2 =Vector2(10.0,18.0);

function Start () 
{
	//choose a random height
	transform.position.y = Random.Range(heightRange.x, heightRange.y);
}

function Update () 
{
	transform.Translate(Vector3.forward * (forwardSpeed * Time.deltaTime));
}
function TakeDamage (damageAmount : float)
{
	
	if (health > 0)
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
	
}
}