import React, { useEffect } from "react";
import List from "@material-ui/core/List";
import { ListItem, Button, Grid, Box, TextField, Input, Select, MenuItem, NativeSelect, InputLabel } from "@material-ui/core";

import { DataSource } from "../../CreateInfoProvider";
import { useStyles } from "./style";
import { StepFrame } from "../../CreateInfoProvider/StepFrame";
import { hintContents } from "../../util/hintContents";
import Konva from 'konva';
import { Stage, Layer, Circle, Group, Text, Image, Rect, Line, Star } from 'react-konva';
import { TransformerComponent } from './TransformerComponent/index'

interface SceneEditorProps {
  continueHandler: () => void;
  backHandler: () => void;
  infoProvider: Array<DataSource>;
}

export const SceneEditor: React.FC<SceneEditorProps> = (props) => {
  //TODO: only for debugging purposes, remove in production
  const testDataList = ["data1", "data2", "data3", "data4"]

  const classes = useStyles();
  // contains the names of the steps to be displayed in the stepper
  const [sceneName, setSceneName] = React.useState("emptyScene")
  const [dataList, setDataList] = React.useState<Array<string>>([]);
  const [backGroundNext, setBackGroundNext] = React.useState("IMAGE");
  const [backGroundType, setBackGroundType] = React.useState("COLOR");
  const [backGroundColor, setBackGroundColor] = React.useState("#FFFFFF");
  const [backgroundImage, setBackgroundImage] = React.useState<HTMLImageElement>(new window.Image());
  const [items, setItems] = React.useState<Array<myCircle | myRectangle | myLine | myStar | myText | myImage>>([]);
  const [itemSelected, setItemSelected] = React.useState(false);
  const [itemCounter, setItemCounter] = React.useState(0);
  const [imageSource, setImageSource] = React.useState<HTMLImageElement>(new window.Image());
  const [recentlyRemovedItems, setRecentlyRemovedItems] = React.useState<Array<myCircle | myRectangle | myLine | myStar | myText | myImage>>([]);
  const [selectedItemName, setSelectedItemName] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("Circle");
  const [selectedObject, setSelectedObject] = React.useState<myCircle | myRectangle | myLine | myStar | myText | myImage>({} as myCircle);
  const [stepSize, setStepSize] = React.useState(5);
  const [textEditContent, setTextEditContent] = React.useState("");
  const [textEditVisibility, setTextEditVisibility] = React.useState(false);
  const [textEditX, setTextEditX] = React.useState(0);
  const [textEditY, setTextEditY] = React.useState(0);
  const [textEditWidth, setTextEditWidth] = React.useState(0);
  const [textEditFontSize, setTextEditFontSize] = React.useState(20);
  const [textEditFontFamily, setTextEditFontFamily] = React.useState("");
  const [textEditFontColor, setTextEditFontColor] = React.useState("#000000");

  type myCircle = {
    x: number;
    y: number;
    radius: number;
    id: string;
    color: string;
    scaleX: number;
    scaleY: number;
    rotation: number;
  };

  type myRectangle = {
    x: number;
    y: number;
    width: number;
    height: number;
    id: string;
    color: string;
    scaleX: number;
    scaleY: number;
    rotation: number;
  };

  type myLine = {
    x: number;
    y: number;
    id: string;
    color: string;
    strokeWidth: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
  };

  type myStar = {
    x: number;
    y: number;
    numPoints: number;
    id: string;
    color: string;
    scaleX: number;
    scaleY: number;
    rotation: number;
  };

  type myText = {
    x: number;
    y: number;
    id: string;
    textContent: string;
    width: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    fontFamily: string;
    fontSize: number;
    color: string;
    height: number;
    padding: number;
    currentlyRendered: boolean;
  };

  type myImage = {
    x: number;
    y: number;
    id: string;
    scaleX: number;
    scaleY: number;
    rotation: number;
    image: HTMLImageElement;
    width: number;
    height: number;
    color: string;
  };

  /**
   * gets called when an element drag is started.
   * @param e drag event
   */
  const handleDragStart = (e: any) => {
    console.log('Started Dragging!');
    // TODO: remove change of HTML Elements
    document.getElementById("main")!.style.cursor = "grabbing";
  };

  /**
   * gets called multiple times during the drag of an item
   * @param e drag event
   */
  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (e.target.getStage() !== null) {
      const selectedNode = e.target.getStage()!.findOne("." + selectedItemName);
      const absPos = selectedNode.getAbsolutePosition();
      // TODO: remove change of HTML Elements
      (document.getElementById("coordinatesX") as HTMLInputElement)!.valueAsNumber = (absPos.x);
      (document.getElementById("coordinatesY") as HTMLInputElement)!.valueAsNumber = (absPos.y);
    }
  }

  /**
   * gets called when a drag event comes to an end
   * @param e drag event
   * @returns nothing, return is used as a break condition in case the user drags an item outside of the canvas.
   */
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
    console.log('Stopped Dragging!')
    document.getElementById("main")!.style.cursor = "grab";
    const localItems = items.slice();
    const index = localItems.indexOf(selectedObject);
    if (e.target.getStage() !== null) {
      const selectedNode = e.target.getStage()!.findOne("." + selectedItemName);

      const absPos = selectedNode.getAbsolutePosition();
      console.log("I REACHED A VALID SPOT")

      //TODO Else if to identify type


      const objectCopy = {
        ...selectedObject,
        x: parseInt(absPos.x.toFixed(0)),
        y: parseInt(absPos.y.toFixed(0)),
      };
      localItems[index] = objectCopy;

      setTimeout(() => {
        setItems(localItems);
        setSelectedObject(objectCopy);
      }, 200);




      //TODO remove
      (document.getElementById("coordinatesX") as HTMLInputElement)!.valueAsNumber = absPos.x;
      (document.getElementById("coordinatesY") as HTMLInputElement)!.valueAsNumber = absPos.y;
      return;
    }
  };

  /**
   * This function gets called everytime the user clicks on the canvas.
   * @param e click event
   * @returns is again used as a break from the function
   */

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
    const name = e.target.name();
    console.log(name);
    if (e.target === e.target.getStage() || name === "background") {
      console.log("Clicked Stage / Background")
      setSelectedItemName("");
      setTextEditVisibility(false);
      setItemSelected(false);

      //TODO remove
      document.getElementById("del")!.innerText = "DELETE LAST ELEMENT";
      return;
    }

    const clickedOnTransformer =
      e.target.getParent().className === "Transformer";
    if (clickedOnTransformer) {
      console.log("You clicked the stransformer...");
      return;
    }

    if (name !== undefined && name !== '') {
      console.log("entered if")
      setSelectedItemName(name);
      setItemSelected(true);

      document.getElementById("del")!.innerText = "DELETE";
      const id = name;
      const foundItem = items.find((i: any) => i.id === id);
      setSelectedObject(foundItem!);
      console.log(selectedObject);
      const index = items.indexOf(foundItem!);
      // TODO: remove change of HTML Elements
      if (!items[index].id.startsWith('image')) {
        (document.getElementById("itemColor")! as HTMLInputElement).value = items[index].color!;
      }
      (document.getElementById("coordinatesX") as HTMLInputElement)!.valueAsNumber = items[index].x;
      (document.getElementById("coordinatesY") as HTMLInputElement)!.valueAsNumber = items[index].y;
    }
  };

  useEffect(() => {
    console.log(selectedItemName);
  }, [selectedItemName]);

  /**
   * This function gets called whenever the user clicks on the canvas to add an item.
   * @param e onClick Event
   * @returns nothing
   */

  const handleCanvasClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
    const local = getRelativePointerPosition(e);
    if (local === undefined) {
      return;
    }
    const localX: number = local.x;
    const localY: number = local.y;

    if (selectedType === "") {
      return;
    } else if (selectedType === "Circle") {
      const nextColor = Konva.Util.getRandomColor();
      const item: myCircle = {
        x: parseInt(localX.toFixed(0)),
        y: parseInt(localY.toFixed(0)),
        radius: 50,
        id: 'circle-' + itemCounter.toString(),
        color: nextColor,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      }
      items.push(item);
      (document.getElementById("itemColor")! as HTMLInputElement).value = nextColor;

      setSelectedType("");
      setItemCounter(itemCounter + 1);
      return;

    } else if (selectedType === "Rectangle") {
      const nextColor = Konva.Util.getRandomColor();
      items.push({
        x: parseInt(localX.toFixed(0)),
        y: parseInt(localY.toFixed(0)),
        width: 100,
        height: 100,
        id: 'rect-' + itemCounter.toString(),
        color: nextColor,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      } as myRectangle);
      (document.getElementById("itemColor")! as HTMLInputElement).value = nextColor;
      setSelectedType("");
      setItemCounter(itemCounter + 1);

      return;
    } else if (selectedType === "Line") {
      items.push({
        x: parseInt(localX.toFixed(0)),
        y: parseInt(localY.toFixed(0)),
        id: 'line-' + itemCounter.toString(),
        color: "black",
        strokeWidth: 10,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      } as myLine);

      setSelectedType("");
      setItemCounter(itemCounter + 1);

      return;
    } else if (selectedType === "Star") {
      const nextColor = Konva.Util.getRandomColor();
      items.push({
        x: parseInt(localX.toFixed(0)),
        y: parseInt(localY.toFixed(0)),
        numPoints: 5,
        id: 'star-' + itemCounter.toString(),
        color: nextColor,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      } as myStar);

      (document.getElementById("itemColor")! as HTMLInputElement).value = nextColor;
      setSelectedType("");
      setItemCounter(itemCounter + 1);

      return;
    } else if (selectedType === "text") {
      items.push({
        x: parseInt(localX.toFixed(0)),
        y: parseInt(localY.toFixed(0)),
        id: 'text-' + itemCounter.toString(),
        textContent: (document.getElementById("text")! as HTMLInputElement).value,
        width: (document.getElementById("textWidth")! as HTMLInputElement).valueAsNumber,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        fontFamily: (document.getElementById("fontType")! as HTMLInputElement).value,
        fontSize: (document.getElementById("fontSize")! as HTMLInputElement).valueAsNumber,
        color: (document.getElementById("fontColor")! as HTMLInputElement).value,
        height: 20,
        padding: 2,
        currentlyRendered: true,
      } as myText);

      setSelectedType("");
      setItemCounter(itemCounter + 1);
      console.log(items[items.length - 1].x, items[items.length - 1].y)

      return;
    } else if (selectedType === "image") {
      items.push({
        id: 'image-' + itemCounter.toString(),
        x: parseInt(localX.toFixed(0)),
        y: parseInt(localY.toFixed(0)),
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        image: imageSource,
        width: imageSource.width,
        height: imageSource.height,
      } as myImage)

      setSelectedType("");
      setItemCounter(itemCounter + 1);

      return;
    }
  }

  /**
   * This function is called whenever the user changes the x coordinate of an item. The coordinate will be updated in the item.
   */
  const handleCoordinatesXChange = () => {
    console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
    const x = (document.getElementById("coordinatesX") as HTMLInputElement)!.valueAsNumber;

    const localItems = items.slice();
    const index = items.indexOf(selectedObject);
    const objectCopy = {
      ...selectedObject,
      x: x,
    };
    localItems[index] = objectCopy;
    setSelectedObject(objectCopy);
    setItems(localItems);
  }

  /**
   * This function is called whenever the user changes the y coordinate of an item. The coordinate will be updated in the item.
   */
  const handleCoordinatesYChange = () => {
    console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
    const y = (document.getElementById("coordinatesY") as HTMLInputElement)!.valueAsNumber;
    const localItems = items.slice();
    const index = items.indexOf(selectedObject);
    const objectCopy = {
      ...selectedObject,
      y: y,
    };
    localItems[index] = objectCopy;
    setSelectedObject(objectCopy);
    setItems(localItems);
    console.log(selectedObject);
  }

  /**
   * This function is called whenever the user edits the text of an existing text-field.
   * @param e onChange Event
   */
  const handleTextEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
    setTextEditContent(e.target.value);
  };

  /**
   * This function is called whenever a user double clicks on an existing text.
   * @param e onDoubleClick Event
   */
  const handleTextDblClick = (e: any) => {
    console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
    const localItems = items.slice();
    const index = items.indexOf(selectedObject);
    let backup: any = items[index];
    //TODO Type Assuring


    const objectCopy = {
      ...selectedObject,
      currentlyRendered: false,
      textContent: "",
    } as myText;
    localItems[index] = objectCopy;
    setSelectedItemName("");
    setSelectedObject(objectCopy);
    setItems(localItems);
    setTextEditContent(backup.textContent);
    setTextEditVisibility(true);
    setTextEditX(objectCopy.x);
    setTextEditY(objectCopy.y);
    setTextEditWidth(objectCopy.width);
    setTextEditFontSize(objectCopy.fontSize);
    setTextEditFontFamily(objectCopy.fontFamily);
    setTextEditFontColor(objectCopy.color);

  };

  /**
   * This function gets called whenever the user presses a key while editing a text.
   * @param e onKeyDown Event
   */
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
    console.log(e.key);
    if (e.key) {
      console.log(textEditContent, selectedObject);
    }
    if (e.key === 'Enter') {
      const localItems = items.slice();
      const index = items.indexOf(selectedObject);
      const content = textEditContent;
      const objectCopy = {
        ...selectedObject,
        textContent: content,
        currentlyRendered: true,
      };
      localItems[index] = objectCopy;
      setSelectedObject(objectCopy);
      console.log(localItems[index])
      setItems(localItems);
      setTextEditVisibility(false);
    }
  };

  /**
   * This function is called whenever the user presses the "Clear Canvas" button
   */
  const clearCanvas = () => {
    console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
    (document.getElementById("main") as HTMLDivElement).style.cursor = "crosshair";
    (document.getElementById("coordinatesX") as HTMLInputElement)!.valueAsNumber = 0;
    (document.getElementById("coordinatesY") as HTMLInputElement)!.valueAsNumber = 0;
    (document.getElementById("itemColor")! as HTMLInputElement).value = "#FFFFFF";
    (document.getElementById("backgroundColor")! as HTMLInputElement).value = "#FFFFFF";
    (document.getElementById("fontColor")! as HTMLInputElement).value = "#000000";
    setItems([]);
    setSelectedItemName("");
    setSelectedType("");
    setTextEditContent("");
    setItemCounter(0);
    setBackGroundColor("#FFFFFF");
    setRecentlyRemovedItems(items);
    console.clear();
  }

  /**
   * This function is called, when the user changes the size of amount he wants to move an item on the x or y axis per step.
   */
  const handleStepSizeChange = () => {
    console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
    setStepSize(parseInt((document.getElementById("stepSizeOptions")! as HTMLSelectElement).value));
  }

  /**
   * This function is called to get the relative pointer position of the cursor on the canvas
   * @param e onClick Event
   * @returns the position of the pointer
   */
  const getRelativePointerPosition = (e: any) => {
    console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
    const stage = e.target.getStage();
    var pos;
    pos = stage.getPointerPosition();
    return (pos);
  }

  /**
   * Function to select the type of element, that will get added next
   * @param type the type of element you want to add
   */
  const selectType = () => {
    console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
    document.getElementById("main")!.style.cursor = "crosshair";
    const type = (document.getElementById("itemType")! as HTMLSelectElement).value;
    console.log(type)
    setSelectedType(type);
  }

  /**
   * This function is called when the user wants to add new text on the canvas
   * @param text text that will be added to the canvas next
   */
  const selectText = (text: string) => {
    console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
    document.getElementById("main")!.style.cursor = "crosshair";
    setSelectedType("text");
    setTextEditContent(text);
  }

  /**
   * This function is called when the user wants to delete and element (either the last element or the currently selected one)
   */
  const deleteItem = () => {
    console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
    const lastElem = [...recentlyRemovedItems];
    if (itemSelected === false) {
      if (items.length > 0) {
        const poppedItem = items.pop();
        if (poppedItem !== undefined) {
          lastElem.push(poppedItem);
        }
      }
      setRecentlyRemovedItems(lastElem);
      document.getElementById("del")!.innerText = "DELETE LAST ELEMENT";
    } else {
      const index = items.indexOf(selectedObject);
      console.log("itemsPre: ", items)
      if (items.length > 0 && selectedObject !== undefined) {
        lastElem.push(items[index]);
        items.splice(index, 1);
      }
      setRecentlyRemovedItems(lastElem);
      setItemSelected(false);
      document.getElementById("del")!.innerText = "DELETE LAST ELEMENT";
    }
  }

  /**
   * this function is called, when the user deletes an item and wants to undo that action
   */
  const undo = () => {
    console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
    const lastElem = [...recentlyRemovedItems];
    console.log(lastElem)
    if (recentlyRemovedItems.length > 0) {
      const poppedItem = lastElem.pop();
      if (poppedItem !== undefined) {
        items.push(poppedItem);
      }
    }
    setRecentlyRemovedItems(lastElem);
  }

  /**
   * This function is called when the user wants to duplicate a selected element.
   * It is important to note that the element will be a new element with the properties copied over from the old element once
   */
  const dupe = () => {
    console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
    if (itemSelected === true) {
      const id = selectedItemName;
      const parts = selectedItemName.split('-');
      console.log(parts[0])
      const localItems = items.slice();
      console.log('ID: ', id, 'item: ', selectedObject);
      localItems.push({
        ...selectedObject,
        id: parts[0] + '-' + Math.random() * Math.random(),
      });
      setItems(localItems);
    }
  }

  /**
   * This function is called when the users stops transforming an element
   * @param e Transform Event
   */
  const onTransformEnd = (e: any) => {
    var selectedNode = e.target.getStage().findOne("." + selectedItemName);
    var absPos = selectedNode.getAbsolutePosition();
    var absTrans = selectedNode.getAbsoluteScale();
    var absRot = selectedNode.getAbsoluteRotation();

    const id = e.target.name();
    console.log(id)
    const localItems = items.slice();
    const index = items.indexOf(selectedObject);
    localItems[index] = {
      ...selectedObject,
      x: absPos.x,
      y: absPos.y,
      scaleX: absTrans.x,
      scaleY: absTrans.y,
      rotation: absRot,
    };
    setItems(localItems)

    console.log('Rotation:', absRot, 'ScaleX:', absTrans.x, 'ScaleY:', absTrans.y)
    console.log('Transformation completed!');
  }

  /**
   * This function is called whenever the user makes changes to the attributes of a text element
   */
  const changeFontAttr = () => {
    console.log("ItemName: ", selectedItemName, "\nObject: ", selectedObject);
    if (itemSelected && selectedItemName.startsWith('text')) {
      const fontFamily = (document.getElementById("fontType")! as HTMLInputElement).value;
      const fontSize = (document.getElementById("fontSize")! as HTMLInputElement).valueAsNumber;
      const fontColor = (document.getElementById("fontColor")! as HTMLInputElement).value;
      const textWidth = (document.getElementById("textWidth")! as HTMLInputElement).valueAsNumber;
      const localItems = items.slice();
      const index = items.indexOf(selectedObject);
      const objectCopy = {
        ...selectedObject,
        color: fontColor,
        fontFamily: fontFamily,
        fontSize: fontSize,
        width: textWidth,
      };
      localItems[index] = objectCopy;

      setTimeout(() => {
        setItems(localItems);
        setSelectedObject(objectCopy);
      }, 200);
    }
  }

  const selectFile = () => {
    setSelectedType("Image");
  }

  /**
   * Function to change the color of an element selected by a user
   */
  const switchItemColor = () => {
    const itemColor = (document.getElementById("itemColor") as HTMLInputElement).value;
    console.log(selectedObject)
    console.log("started color change")
    if (itemSelected === true) {
      const localItems = items.slice();
      const index = localItems.indexOf(selectedObject)
      const objectCopy = {
        ...selectedObject,
        color: itemColor,
      };
      localItems[index] = objectCopy;
      setSelectedObject(objectCopy);
      setItems(localItems);

    }
  }

  /**
   * Function to change the background color incase it is not an image
   */
  const switchBGColor = () => {
    let backgroundColor = (document.getElementById("backgroundColor") as HTMLInputElement).value;
    setBackGroundColor(backgroundColor);
  }

  /**
   * Function to switch between an image and a backgroundcolor
   */
  const switchBackground = () => {
    if (backGroundType === "COLOR") {
      setBackGroundNext("COLOR");
      setBackGroundType("IMAGE");
      (document.getElementById("backgroundColor")! as HTMLInputElement).value = "#FFFFFF";
    } else if (backGroundType === "IMAGE") {
      setBackGroundNext("IMAGE");
      setBackGroundType("COLOR");
      (document.getElementById("backgroundColor")! as HTMLInputElement).value = backGroundColor;
    }
  }

  /**
   * Function to change the mouse cursor if the user hovers over a selected element
   */
  const mouseOver = () => {
    if (itemSelected) {
      document.getElementById("main")!.style.cursor = "grab";
    }
  }

  /**
   * Function to change cursor back to default when the user doesn't hover an element anymore
   */
  const mouseLeave = () => {
    document.getElementById("main")!.style.cursor = "crosshair";
  }

  /**
   * Function to stop the user from using the coloring options on elements that do not use the coloring options
   * @ true or false depending on the selected item
   */
  const disableColor = (): boolean => {
    if (itemSelected === true) {
      if (selectedItemName.startsWith("text") || selectedItemName.startsWith("image")) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }

  //TODO: load dataList from the infoProvider props

  /**
   * Method to handle the selection of data from the list of available api data.
   * @param item The item selected by the user
   */
  const handleItemSelect = (item: string) => {
    //TODO: add the selected item to the canvas
    console.log("user selected item " + item)
  }

  /**
   * Method that renders the list items to be displayed in the list of all available data.
   * @param item The item to be displayed
   */
  const renderListItem = (item: string) => {
    return (
      <ListItem key={item}>
        <Button onClick={() => handleItemSelect(item)}>
          {item}
        </Button>
      </ListItem>
    )
  }

  return (
    <StepFrame
      heading={"Szenen-Editor"}
      hintContent={hintContents.typeSelection}
      large={"xl"}
    >
      <Grid container>
        <Grid item container justify={"center"} xs={12}>
          <Grid container xs={7}>
            <Grid item container xs={12} justify={"space-evenly"}>
              <Grid item>
                <TextField className={classes.title} margin={"normal"} variant={"outlined"} color={"primary"} label={"Szenen-Titel"}
                  value={sceneName}
                  onChange={event => (setSceneName(event.target.value.replace(' ', '_')))}>
                </TextField>
              </Grid>
              <Grid item>
                <Button size={"large"} variant={"contained"} className={classes.topButtons}>
                  Zurück
                </Button>
              </Grid>
              <Grid item>
                <Button size={"large"} variant={"contained"} className={classes.topButtons}>
                  Speichern
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.editorMain} id="main">
                <Stage
                  width={960}
                  height={540}
                  className={classes.editorCanvas}
                  onMouseDown={handleStageMouseDown}
                >
                  <Layer>
                    {backGroundType === "COLOR" &&
                      <Rect
                        name="background"
                        fill={backGroundColor}
                        width={960}
                        height={540}
                        onClick={(e: any) => handleCanvasClick(e)}
                        onMouseDown={handleStageMouseDown}
                      />
                    }
                    {backGroundType === "IMAGE" &&
                      <Image
                        name="background"
                        width={960}
                        height={540}
                        onClick={(e: any) => handleCanvasClick(e)}
                        image={backgroundImage}
                        onMouseDown={handleStageMouseDown}
                      />
                    }
                    <Group>
                      {items.map((item: any) => (
                        (item.id.startsWith('circle') &&
                          <Circle
                            key={item.id}
                            name={item.id}
                            draggable
                            x={item.x}
                            y={item.y}
                            fill={item.color}
                            radius={item.radius}
                            onDragStart={handleDragStart}
                            onDragMove={handleDragMove}
                            onDragEnd={handleDragEnd}
                            onTransformEnd={onTransformEnd}
                            scaleX={item.scaleX}
                            scaleY={item.scaleY}
                            rotation={item.rotation}
                            onMouseOver={mouseOver}
                            onMouseLeave={mouseLeave}
                            dragBoundFunc={function (pos: Konva.Vector2d) {
                              if (pos.x > 960 - item.radius) {
                                pos.x = 960 - item.radius
                              }
                              if (pos.x < 0 + item.radius) {
                                pos.x = 0 + item.radius
                              }
                              if (pos.y > 540 - item.radius) {
                                pos.y = 540 - item.radius
                              }
                              if (pos.y < item.radius) {
                                pos.y = item.radius
                              }
                              return pos;
                            }}
                          />) || (
                          item.id.startsWith('rect') &&
                          <Rect
                            key={item.id}
                            name={item.id}
                            draggable
                            x={item.x}
                            y={item.y}
                            fill={item.color}
                            width={item.width}
                            height={item.height}
                            onDragStart={handleDragStart}
                            onDragMove={handleDragMove}
                            onDragEnd={handleDragEnd}
                            onTransformEnd={onTransformEnd}
                            scaleX={item.scaleX}
                            scaleY={item.scaleY}
                            rotation={item.rotation}
                            onMouseOver={mouseOver}
                            onMouseLeave={mouseLeave}
                            dragBoundFunc={function (pos: Konva.Vector2d) {
                              if (pos.x > 960 - item.width) {
                                pos.x = 960 - item.width
                              }
                              if (pos.x < 0) {
                                pos.x = 0
                              }
                              if (pos.y > 540 - item.height) {
                                pos.y = 540 - item.height
                              }
                              if (pos.y < 0) {
                                pos.y = 0
                              }
                              return pos;
                            }}
                          />) || (
                          item.id.startsWith('line') &&
                          <Line
                            key={item.id}
                            name={item.id}
                            draggable
                            x={item.x}
                            y={item.y}
                            points={
                              [0, 0, 100, 0, 100, 100]
                            }
                            stroke={"black"}
                            closed
                            onDragStart={handleDragStart}
                            onDragMove={handleDragMove}
                            onDragEnd={handleDragEnd}
                            onTransformEnd={onTransformEnd}
                            scaleX={item.scaleX}
                            scaleY={item.scaleY}
                            rotation={item.rotation}
                            onMouseOver={mouseOver}
                            onMouseLeave={mouseLeave}
                            dragBoundFunc={function (pos: Konva.Vector2d) {
                              if (pos.x > 860) {
                                pos.x = 860
                              }
                              if (pos.x < 0) {
                                pos.x = 0
                              }
                              if (pos.y > 440) {
                                pos.y = 440
                              }
                              if (pos.y < 0) {
                                pos.y = 0
                              }
                              return pos;
                            }}
                          />) || (
                          item.id.startsWith('star') &&
                          <Star
                            numPoints={5}
                            innerRadius={50}
                            outerRadius={100}
                            key={item.id}
                            name={item.id}
                            draggable
                            x={item.x}
                            y={item.y}
                            fill={item.color}
                            radius={item.radius}
                            onDragStart={handleDragStart}
                            onDragMove={handleDragMove}
                            onDragEnd={handleDragEnd}
                            onTransformEnd={onTransformEnd}
                            scaleX={item.scaleX}
                            scaleY={item.scaleY}
                            rotation={item.rotation}
                            onMouseOver={mouseOver}
                            onMouseLeave={mouseLeave}
                            dragBoundFunc={function (pos: Konva.Vector2d) {
                              if (pos.x > 860) {
                                pos.x = 860
                              }
                              if (pos.x < 100) {
                                pos.x = 100
                              }
                              if (pos.y > 440) {
                                pos.y = 440
                              }
                              if (pos.y < 100) {
                                pos.y = 100
                              }
                              return pos;
                            }}
                          />) || (
                          item.id.startsWith('text') &&
                          <Text
                            id={item.id}
                            name={item.id}
                            text={item.textContent}
                            x={item.x}
                            y={item.y}
                            width={item.width}
                            draggable
                            onDragStart={handleDragStart}
                            onDragMove={handleDragMove}
                            onDragEnd={handleDragEnd}
                            onTransformEnd={onTransformEnd}
                            onDblClick={(e: any) => handleTextDblClick(e)}
                            fontSize={item.fontSize}
                            fontFamily={item.fontFamily}
                            scaleX={item.scaleX}
                            scaleY={item.scaleY}
                            rotation={item.rotation}
                            fill={item.color}
                            onMouseOver={mouseOver}
                            onMouseLeave={mouseLeave}
                            padding={item.padding}
                            style={{
                              display: "block"
                            }}
                            dragBoundFunc={function (pos: Konva.Vector2d) {
                              if (pos.x > 960 - item.width) {
                                pos.x = 960 - item.width
                              }
                              if (pos.x < 0) {
                                pos.x = 0
                              }
                              if (pos.y > 540 - this.height()) {
                                pos.y = 540 - this.height()
                              }
                              if (pos.y < 0) {
                                pos.y = 0
                              }
                              return pos;
                            }}
                          />) || (
                          item.id.startsWith('image') &&
                          <Image
                            key={item.id}
                            id={item.id}
                            name={item.id}
                            x={item.x}
                            y={item.y}
                            width={item.width}
                            height={item.height}
                            image={item.image}
                            draggable
                            onDragStart={handleDragStart}
                            onDragMove={handleDragMove}
                            onDragEnd={handleDragEnd}
                            onTransformEnd={onTransformEnd}
                            scaleX={item.scaleX}
                            scaleY={item.scaleY}
                            rotation={item.rotation}
                            onMouseOver={mouseOver}
                            onMouseLeave={mouseLeave}
                            dragBoundFunc={function (pos: Konva.Vector2d) {
                              if (pos.x > 960 - item.width) {
                                pos.x = 960 - item.width
                              }
                              if (pos.x < 0) {
                                pos.x = 0
                              }
                              if (pos.y > 540 - item.height) {
                                pos.y = 540 - item.height
                              }
                              if (pos.y < 0) {
                                pos.y = 0
                              }
                              return pos;
                            }}
                          />)

                      ))}
                      <TransformerComponent
                        selectedShapeName={selectedItemName}
                      />
                    </Group>
                  </Layer>
                </Stage>
              </div>
              <textarea value={textEditContent} className={classes.editorText}
                style={{
                  display: textEditVisibility ? "block" : "none",
                  top: textEditY + 300 + "px",
                  left: textEditX + 110 + "px",
                  width: textEditWidth + "px",
                  fontSize: textEditFontSize + "px",
                  fontFamily: textEditFontFamily,
                  color: textEditFontColor,
                }} onChange={e => handleTextEdit(e)} onKeyDown={e => handleTextareaKeyDown(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.lowerButtons}>
                <Grid container xs={12}>
                  <Grid item xs={3}>
                    <Button className={classes.button} onClick={clearCanvas}> CLEAR </Button><br/><br/>
                    <label> SHAPE: </label>
                    <NativeSelect id="itemType" onChange={selectType} className={classes.selection}>
                      <option>Circle</option>
                      <option>Rectangle</option>
                      <option>Line</option>
                      <option>Star</option>
                    </NativeSelect><br/><br/>
                    <label > FONT SIZE: </label>
                    <TextField
                      className={classes.buttonNumber}
                      id="fontSize"
                      type="number"
                      InputProps={{
                        inputProps: {
                          min: 1, max: 144, step: 1, defaultValue: 20,
                        }
                      }}
                      onChange={changeFontAttr}
                    ></TextField>
                  </Grid>
                  <Grid item xs={3}>
                    <Button className={classes.button} id="del" onClick={deleteItem}> DELETE LAST ELEMENT </Button><br/><br/>
                    <label> CHOOSE COLOR </label>
                    <input className={classes.buttonColor} id="itemColor" type={"color"} onChange={switchItemColor} disabled={disableColor()} defaultValue="#FFFFFF" /><br/><br/>
                    <label > FONT: </label>
                    <NativeSelect id="fontType" onChange={changeFontAttr} className={classes.selection}>
                      <option style={{ "fontFamily": "arial" }}>Arial</option >
                      <option style={{ "fontFamily": "verdana" }}>veranda</option >
                      <option style={{ "fontFamily": "Tahoma" }}>Tahoma</option >
                      <option style={{ "fontFamily": "Georgia" }}>Georgia</option >
                      <option style={{ "fontFamily": "Times New Roman" }}>Times New Roman</option >
                    </NativeSelect><br />
                  </Grid>
                  <Grid item xs={3}>
                    <Button className={classes.button} id="undo" onClick={undo}> UNDO </Button><br/><br/>
                    <label id="positionX"> X: </label>
                    <TextField
                      className={classes.buttonNumber}
                      id="coordinatesX"
                      type="number"
                      InputProps={{
                        inputProps: {
                          min: 0, max: 960, step: stepSize.toString(), defaultValue: 0,
                        }
                      }}
                      onChange={handleCoordinatesXChange}
                      disabled={!itemSelected}
                    ></TextField>
                    <label id="positionY"> Y: </label>
                    <TextField
                      className={classes.buttonNumber}
                      id="coordinatesY"
                      type="number"
                      InputProps={{
                        inputProps: {
                          min: 0, max: 540, step: stepSize.toString(), defaultValue: 0,
                        }
                      }}
                      onChange={handleCoordinatesYChange}
                      disabled={!itemSelected}
                    ></TextField><br/><br/>
                    <label > FONT COLOR: </label>
                    <input className={classes.buttonColor} id="fontColor" type="color" onChange={changeFontAttr} disabled={!disableColor()} defaultValue="#000000" /><br />
                  </Grid>
                  <Grid item xs={3}>
                    <Button className={classes.button} onClick={dupe}> DUPLICATE </Button><br/><br/>
                    <label > STEP SIZE: </label>
                    <NativeSelect id="stepSizeOptions" onChange={handleStepSizeChange} defaultValue="5" className={classes.selection}>
                      <option > 1 </option>
                      <option > 5 </option>
                      <option > 10 </option>
                      <option > 20 </option>
                      <option > 25 </option>
                      <option > 50 </option>
                      <option > 75 </option>
                      <option > 100 </option>
                      <option > 250 </option>
                    </NativeSelect><br/><br/>
                    <label> TEXTFIELD WIDTH: </label>
                    <TextField
                      className={classes.buttonNumber}
                      id="textWidth"
                      type="number"
                      InputProps={{
                        inputProps: {
                          min: 200, max: 540, step: 1, defaultValue: 200,
                        }
                      }}
                      onChange={changeFontAttr}

                    ></TextField><br />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={5}>

            <div className={classes.rightButtons}>
              <Button className={classes.button} onClick={() => selectText((document.getElementById("text")! as HTMLInputElement).value)}> TEXT </Button>
              <TextField className={classes.buttonText} id="text" defaultValue="TEST" variant={"outlined"}></TextField> <br/>
              <Button className={classes.button} onClick={switchBackground}> SWITCH TO {backGroundNext} </Button><br/>
              <label> CHOOSE BACKGROUND COLOR </label>
              <input className={classes.buttonColor} id="backgroundColor" type="color" onChange={switchBGColor} disabled={backGroundType !== "COLOR"} defaultValue="#FFFFFF" /><br />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Box borderColor="primary.main" border={4} borderRadius={5} className={classes.choiceListFrame}>
              <List disablePadding={true}>
                {dataList.map((item) => renderListItem(item))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={() => setDataList(testDataList)}>
              Testdaten
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </StepFrame>
  );
}


/*<input
                className={classes.buttonNumber}
                id="coordinatesY"
                type="number"
                step={stepSize}
                min="0"
                max={window.innerHeight / 2}
                defaultValue="0"
                onChange={handleCoordinatesYChange}
                disabled={!itemSelected}
              ></input><br />*/