//#pragma strict
import Pathfinding;


var enemyGround1 : Transform;
var enemyBody : Transform;
var enemyCompass : Transform;
var turnSpeed : float = 10.0;

var targetPosition :Vector3; //the destination position
var seeker : Seeker; //the seeker component on this object, this aids in building my path
var speed : float = 100;
var controller :CharacterController; // the character controller component on this object
var path :Path; // this will hold the path to follow
var nextWaypointDistance : float = 3.0; // minimum distance required to move toward next waypoint
private var currentWaypoint : int = 0;


function Start () 
{
	targetPosition = GameObject.FindWithTag("GroundTarget").transform.position;
	GetNewPath();
}
//when called will generate a new path from this object to the "targetPosition"
function GetNewPath ()
{
	//Debug.Log("getting new path");
	seeker.StartPath(transform.position, targetPosition, OnPathComplete); // tell the seeker component to determine the path
	
}
//this function will be called when the seeker has finished determine the path
function OnPathComplete (newPath : Path) // the newly determined path is sent over as "newPath" type of Path
{
	if (!newPath.error)//if the newPath does not have any errors
	{
		path = newPath; //set the path to this new one
		currentWaypoint = 0;//now that we have a new path. make sure to start at the first waypoint
		
	}
}
//is called by Unity every physics "frame" (ie, many times per second much like "function Update ()")
function FixedUpdate () 
{
	if (path == null)//no path
	{
		return;//don do anything
	}
	//if (currentWaypoint >= path.vectorPath.Length)//reached and of path
	//----------------------------------Denna förstör
	//if(currentWaypoint >=path.vectorPath.Lengt)
	//{
	
		//return; //do... something? we,ll do nothing for now
	//}
	//-------------------------------------
	//find direction to next waypoint
	var dir :Vector3 = (path.vectorPath[currentWaypoint]-transform.position).normalized;
	//find an amount based speed direction and delta time to move
	dir *=speed * Time.fixedDeltaTime;
	
	//Move
	controller.SimpleMove (dir);
	
	//rotate to face next waypoint
	//transform.rotation = Quaternion.Lerp(transform.rotation, Quaternion.LookRotation(path.vectorPath[currentWaypoint]),1);
	//enemyCompass.LookAt(path.vectorPath[currentWaypoint]);
	//enemyBody.rotation = Quaternion.Lerp(enemyBody.rotation, enemyCompass.rotation,Time.deltaTime*turnSpeed);
	//transform.LookAt(path.vectorPath[currentWaypoint]);
	
	//check if we are close enough to the next waypoint
	if (Vector3.Distance(transform.position,path.vectorPath[currentWaypoint]) < nextWaypointDistance)
	{
		currentWaypoint++;//if we, are proceed to folow the next waypoint  
	}
}

