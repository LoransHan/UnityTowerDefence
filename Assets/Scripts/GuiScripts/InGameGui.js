
 
//NGUI Items


 
//Placement plane items.
//var placementPlanesRoot : Transform;
var hoverMat : Material;
var placementLayerMask : LayerMask;
private var originalMat : Material;
private var lastHitObj : GameObject;

 
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
}
function Update ()
{
        //If the build panel is open.
        //if(buildPanelOpen)
       // {
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
               
                if(Input.GetMouseButtonDown(0) && lastHitObj) //Left Mouse was clicked and we have a tile selected.
                {
                        if(lastHitObj.tag == "PlacementPlane_Open") //If the selected tile is open.
                        {
                                var newStructure : GameObject = Instantiate(allStructures[structureIndex], lastHitObj.transform.position, Quaternion.identity); //Drop the chosen structure directly at the tile's location, with rotation of 0.
                                newStructure.transform.localEulerAngles.y = (Random.Range(0,360)); //Set the new structure to have a random rotation.
                               
                                lastHitObj.tag = "PlacementPlane_Taken"; //Set the tile's tag to be taken.
                        }
                }
        //}
}
       
 
//--Cutsom Functions--//
 
//One update!
//This function will eventually contain all generic update events.
//This makes sure we don't have the same small parts being called over and over in a different way.

function UpdateGUI()
{
       // for(var theBtnGraphic : UISlicedSprite in buildBtnGraphics) //Go through all the build panel buttons and set them to "off".
        //{
          //      theBtnGraphic.color = offColor;
        //}
       // buildBtnGraphics[structureIndex].color = onColor; //Set the selected build button to "on".
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
   // UpdateGUI();

}




