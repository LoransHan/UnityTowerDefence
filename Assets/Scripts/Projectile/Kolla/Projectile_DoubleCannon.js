#pragma strict

class Projectile_DoubleCannon extends Projectile_Base
{

function Update () 
{
	transform.Translate(Vector3.forward * Time.deltaTime * mySpeed);
	myDist += Time.deltaTime * mySpeed;
	if (myDist >= myRange)
	{
		Destroy(gameObject);
	}
}

}