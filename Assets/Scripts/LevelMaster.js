//#pragma strict
var AstarController : AstarPath;
//Globala Variabler
static var playerDamage = 0;

//States
var waveActive : boolean = false;
var spawnEnemies : boolean = false;
var upgradePanelOpen : boolean = false; // vet ej om behövs

//Player Variables
var healthCount : int = 10;
var scoreCount : int = 0;
var cashCount : int = 500;


//Define Wave Specific Variables
var waveLevel : int = 0;
var difficultyMultiplier : float = 1.0;
var waveLength : float = 30.0;
var intermissionTime : float = 5.0;
private var waveEndTime : float = 0;

//Enemy Variables
var enemyPrefabs : GameObject[];
var flyerSpawns : Transform;
var GroundSpawns1 : Transform;//ny
private var flyerSpawnPoints : Transform[];
private var ground1SpawnPoints : Transform[];//ny
var respawnMinBase : float = 3.0;
var respawnMaxBase : float = 10.0;
private var respawnMin : float = 3.0;
private var respawnMax : float = 10.0;
var respawnInterval : float = 2.5;
var enemyCount : int = 0;
private var lastSpawnTime : float = 0;

//Turrets 
var turretCosts : int[];
var costTexts : UILabel[];

//------NGUI Items

//Gui Variables
var waveText : UILabel;
var healthText : UILabel;
var scoreText : UILabel;
var cashText : UILabel;
var upgradeText : UILabel;
var upgradeBtn : GameObject;

//Placement plane items.
//var placementPlanesRoot : Transform;
var hoverMat : Material;
var placementLayerMask : LayerMask;
private var originalMat : Material;
private var lastHitObj : GameObject;

//upgrade vars
private var focusedPlane : PlacementPlane;
private var structureToUpgrade : Turret_Base;
private var upgradeStructure : GameObject;
private var upgradeCost : int;

//NGUI Items 
var upgradePanelTweener : TweenPosition; // vet ej om behövs
 
//Build selection items.
//var onColor : Color;
//var offColor : Color;
var allStructures: GameObject[];
var buildBtnGraphics : UISlicedSprite[];
private var structureIndex : int = 0;

function Start ()
{
	 //Reset the structure index and refresh the GUI.
        structureIndex = 0;
        UpdateGUI();
	
	flyerSpawnPoints = new Transform[flyerSpawns.childCount];
	var i : int = 0;
	for (var theSpawnPoint : Transform in flyerSpawns)
	{
		flyerSpawnPoints[i] = theSpawnPoint;
		i++;
	}
	//-------------
	ground1SpawnPoints = new Transform[GroundSpawns1.childCount];
	var g : int = 0;
	for (var theGroundSpawnPoint : Transform in GroundSpawns1)
	{
		ground1SpawnPoints[g] = theGroundSpawnPoint;
		g++;
	}
	//-------------

		SetNextWave();	//setup the next wave variables, (tex, difficulty, respawn time, speed etc)
		StartNewWave();	
		
}



function Update () 
{
	//Create a ray and shoot it forward from the mouse position.
                var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
                var hit : RaycastHit;
                if(Physics.Raycast(ray, hit, 1000, placementLayerMask))
                {
                        if(lastHitObj) //If we have previously hit an object...
                        {
                                lastHitObj.renderer.material = originalMat; //Visually deselect that object.
                        }
                       
                        lastHitObj = hit.collider.gameObject; //Replace the "selected plane" with this new object.
                        originalMat = lastHitObj.renderer.material; //Store the new plane's starting material.
                        lastHitObj.renderer.material = hoverMat; //Set the plane's material to the highlighted one.
                }
                else //If the raycast didn't hit anything, (if the mouse was outside the tiles).
                {
                        if(lastHitObj) //If we had previously hit something.
                        {
                                lastHitObj.renderer.material = originalMat; //Visually deselect that object.
                                lastHitObj = null; //Nullify the plane selection, so we don't drop turrets with no valid location selected.
                        }
                }
               
//Drop turrets on click.
               
               // if(Input.GetMouseButtonDown(0) && lastHitObj && turretCosts[structureIndex]<=cashCount) //Left Mouse was clicked and we have a tile selected.
                if(Input.GetMouseButtonDown(0) && lastHitObj && !upgradePanelOpen) //Left Mouse was clicked and we have a tile selected.
                {
                	focusedPlane = lastHitObj.GetComponent(PlacementPlane); //cache the script for this plane
                	if(focusedPlane.isOpen && turretCosts[structureIndex]<=cashCount) //If the selected tile is open.
                        {
                                var newStructure : GameObject = Instantiate(allStructures[structureIndex], lastHitObj.transform.position, Quaternion.identity); //Drop the chosen structure directly at the tile's location, with rotation of 0.
                                newStructure.transform.localEulerAngles.y = (Random.Range(0,360)); //Set the new structure to have a random rotation.
                               
                                focusedPlane.myStructure = newStructure;
                                focusedPlane.isOpen = false;
                                
                                cashCount-= turretCosts[structureIndex];
                                UpdateGUI();
                                
                                //-----------NYTT
                                //Uppdate the scan
                                AstarController.Scan();
                                
              					for(var theEnemy : GameObject in GameObject.FindGameObjectWithTag("GroundEnemy1"))
              					{
              						theEnemy.GetComponent(Enemy_Ground1).GetNewPath();
              					}
                                //------------------
                                
                               
                        }
                        else if (focusedPlane.myStructure !=null)
                        {
                        	ShowUpgradeGUI();
                        }
                
                	//----------------------Gamla--------------
                       // if(lastHitObj.tag == "PlacementPlane_Open") //If the selected tile is open.
                        //{
                          //      var newStructure : GameObject = Instantiate(allStructures[structureIndex], lastHitObj.transform.position, Quaternion.identity); //Drop the chosen structure directly at the tile's location, with rotation of 0.
                            //    newStructure.transform.localEulerAngles.y = (Random.Range(0,360)); //Set the new structure to have a random rotation.
                               
                              //  lastHitObj.tag = "PlacementPlane_Taken"; //Set the tile's tag to be taken.
                                
                               // cashCount-= turretCosts[structureIndex];
                                //UpdateGUI();
                        //}
                        //-----------------Slut på Gamla-------------
                }
	
	if (waveActive)
	{
		if (Time.time >= waveEndTime)
		{
			//Debug.Log("wave over");
			spawnEnemies = false; // stop spawning enemies
			
			if (enemyCount == 0)
			{
				FinishWave();	// end this wave
			}
		}
		if (spawnEnemies)
		{
			if (Time.time > (lastSpawnTime + respawnInterval)) // wave is still going spawn enemies
			{
				SpawnNewEnemy();
			}
		}
	}
	NextLevelGame(); //nyttttttttttttttttttttttttttttt
	GameOver ();
	
}
//upgrade Structure
function ShowUpgradeGUI ()
{
	//get the planes structure and that structures upgrade options
	structureToUpgrade = focusedPlane.myStructure.GetComponent(Turret_Base);
	upgradeStructure = structureToUpgrade.myUpgrade;
	
	//if the structure can be added. show menu
	if (upgradeStructure != null)
	{
		upgradePanelOpen = true;	//first off. set the state
		
		upgradeCost = structureToUpgrade.myUpgradeCost; //get the upgrade cost
		var upgradeName = structureToUpgrade.myUpgradeName; //get the upgrade name
		
		upgradeText.text = "Upgrade to "+ upgradeName+"for $"+ upgradeCost+"?"; //set the text
		CostCheckButton(upgradeBtn, upgradeCost); //set the confirm btn to active or not. based on cost
		upgradePanelTweener.Play(true); //fly in the panel
	}
}

//function SpawnFlyer ()
//{
	//nextFlyerSpawnTime+= flyerInterval;
	//var i : int = Random.Range(0, flyerSpawnPoints.length);
	//var newFlyer : GameObject = Instantiate(flyerPrefab, flyerSpawnPoints[i].position,flyerSpawnPoints[i].rotation);
//}
function SetNextWave ()
{
	waveLevel++; // up the wave level;
	difficultyMultiplier = ((Mathf.Pow(waveLevel,2))*.005)+1; // up the difficulty exponentialy
	respawnMin = respawnMinBase * (1/difficultyMultiplier); // apply dif mult to respawn times (tex more units)
	respawnMax = respawnMaxBase * (1/difficultyMultiplier);
	
}

function StartNewWave ()
{
	UpdateGUI(); // set gui
	
	SpawnNewEnemy(); //spawn the first enemy
	
	waveEndTime = Time.time + waveLength; // set the wave end time
	
	//activate the wave
	waveActive = true;
	spawnEnemies = true;
}

function FinishWave ()
{
	waveActive = false;
	
	yield WaitForSeconds(intermissionTime); // Wait for it.....
	
	//on to the next
	SetNextWave();
	StartNewWave();
}
//-----------NYTT
function NextLevelGame()
{
	if (waveLevel == 14)
	{
	waveActive = false;
	spawnEnemies = false;
	Application.LoadLevel ("TowerD_Level2");
	}
}

function GameOver ()
{
	if (healthCount == 0)
	{
	waveActive = false;
	spawnEnemies = false;
	Application.LoadLevel ("TowerD1");
	}
}


//--------------

function SpawnNewEnemy ()
{
	//get random index to choose enemy prefab with
	var enemyChoice = Random.Range(0, enemyPrefabs.Length);
	
	//since air and ground units probaly shouldent spawn in the same locations we have to seperate this part and spawn based on tag 
	var spawnChoice : int;
	if (enemyPrefabs[enemyChoice].tag == "AirEnemy")
	{
	//get a random index too choose spawn location with
	spawnChoice = Random.Range(0, flyerSpawnPoints.Length);
	//spawn the flyer at the chosen location and rotation
	Instantiate(enemyPrefabs[enemyChoice], flyerSpawnPoints[spawnChoice].position, flyerSpawnPoints[spawnChoice].rotation);
	}
	else if (enemyPrefabs[enemyChoice].tag == "GroundEnemy1")
	{
		spawnChoice = Random.Range(0, ground1SpawnPoints.Length);
		Instantiate(enemyPrefabs[enemyChoice], ground1SpawnPoints[spawnChoice].position, ground1SpawnPoints[spawnChoice].rotation);
	}
	enemyCount++; // let the game know we just added on enemy for keeping track of wave and completion
	
	lastSpawnTime = Time.time; // set the current time as the last spawn time
	
	respawnInterval = Random.Range(respawnMin, respawnMax);//re-randomize the respawn interval
	
}

//--Cutsom Functions--//
 
//One update!
//This function will eventually contain all generic update events.
//This makes sure we don't have the same small parts being called over and over in a different way.

function UpdateGUI()
{
       // for(var theBtnGraphic : UISlicedSprite in buildBtnGraphics) //Go through all the build panel buttons and set them to "off".
        //{
             //   theBtnGraphic.color = offColor;
        //}
        //buildBtnGraphics[structureIndex].color = onColor; //Set the selected build button to "on".
       
        waveText.text = "Wave: "+ waveLevel;
		scoreText.text = "Score: "+ scoreCount;
		healthText.text = "Shields: "+ healthCount;
		cashText.text = "Cash: "+ cashCount;
		
		CheckTurretCosts();
}

function SetBuildChoice(btnObj : GameObject)

{

    var btnName : String = btnObj.name;

    if(btnName == "Btn_Cannon")

    {

        structureIndex = 0;

    }

else if(btnName == "Btn_Missile")

	{

      structureIndex = 1;

  	}

 else if(btnName == "Btn_Mine")

    {

      structureIndex = 2;

    }
    UpdateGUI();

}
//Kollar så att man kan köpa
function CheckTurretCosts ()
{
	for (var i : int = 0; i<allStructures.length; i++)
	{
		if (turretCosts[i] > cashCount) // is the cost of this buttons turret too much?
		{
			costTexts[i].color = Color.red; //Set cost text to red color
			buildBtnGraphics[i].color = Color(.5,.5,.5,.5);//set btn graphic to half-alfa grey
			buildBtnGraphics[i].transform.parent.gameObject.collider.enabled = false;//disable this btn			
		}
		else // vi har råd att köpa
		{
			costTexts[i].color = Color.green; //ändra texten till grön
			
			if (structureIndex == i)//is this btn currently selected for placement
			{
				//buildBtnGraphics[i].color = onColor;//set the color to on
			}
			
				
		else
			{
			//buildBtnGraphics[i].color = offColor;//set the color to off
				
			buildBtnGraphics[i].transform.parent.gameObject.collider.enabled = true; //enable the button				
			}
			
		}
	}
}
//Generic function to quickly check if we can afford an item and apply colors and settings to the items button
function CostCheckButton (theBtn : GameObject, itemCost : int)
{
	if (cashCount < itemCost)//we cant afford this item
	{
		theBtn.transform.Find("Label").gameObject.GetComponent(UILabel).color = Color.red;
		theBtn.transform.Find("Background").gameObject.GetComponent(UISlicedSprite).color = Color(.5,.5,.5,.5);//set btn graphic to half-alfa grey
		theBtn.collider.enabled = false;//disable btn collider
	}
	else	//we can afford this item
	{
		theBtn.transform.Find("Label").gameObject.GetComponent(UILabel).color = Color.green;
		//theBtn.transform.Find("Background").gameObject.GetComponent(UISlicedSprite).color = onColor;
		theBtn.collider.enabled = true;//enable btn collider
	}
}

function ConfirmUpgrade ()
{
	var spawnPos = structureToUpgrade.transform.position; //get tower pos
	var spawnRot = structureToUpgrade.transform.rotation; // get tower rotation
	Destroy(structureToUpgrade.gameObject);//destroy old tower
	var newStructure : GameObject = Instantiate(upgradeStructure, spawnPos, spawnRot);//spawn in new "upgrade" tower
	focusedPlane.myStructure = newStructure;
	
	cashCount-= upgradeCost;//subtract upgrade cost
	UpdateGUI();
	upgradePanelTweener.Play(false);//hide the upgrade panel
	upgradePanelOpen = false;//update the state
}

function CancelUpgrade ()
{
	 upgradePanelTweener.Play(false);//hide the upgrade panel
	 upgradePanelOpen = false;//update the state
}