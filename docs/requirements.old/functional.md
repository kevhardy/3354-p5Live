# P5Live Functional Requirements

## Model

--------------------

**Function**
Compile Python script.

**Description**
Compile the user's Python source code for subsequent execution.

**Inputs**
Editor text box value.

**Source**
Controller - AJAX POST request handler for code submission.

**Outputs**
New Python session.

**Destination**
Model control loop.

**Action**
Receive the code from the Controller associated with the text box value of the Editor segment.
From there, compile the code and update the output streams should a syntax error be encountered.
If there are no errors, then initialize a new Python session to allow execution to begin when a frame request is received; afterward, mark the program as running by setting a flag.

**Requirements**
The network must be established between the client and the server.

**Pre-Condition**
If Google webapp is used, connection/authentication needs to have been established before this function can execute.

**Post-Condition**
If no errors had occurred, a session is created and frame execution is now allowed.
A flag is also set to broadcast that the program is now in the running state.

**Side Effects**
None.

--------------------

**Function**
Calculate frame.

**Description**
Use p5 to calculate the next set of Vertex and Index buffers for the client to render.

**Inputs**
Frame request signal.

**Source**
Controller - AJAX GET request handler for frame request.

**Outputs**
The calculated Vertex and Index buffers from p5.
The I/O output streams of the Python interpreter.

**Destination**
Controller - AJAX GET request handler for execution output.

**Action**
Continue (or start) code execution using a wrapper for the p5 module that outputs the Vertex and Index buffers resulting from the triangulations calculated by p5.
Should any errors occur during execution, or if the code does any I/O, then the output and error streams are updated and passed to the Controller.

**Requirements**
The network must be established between the client and the server.

**Pre-Condition**
If Google webapp is used, connection/authentication needs to have been established before this function can execute.

**Post-Condition**
None.

**Side Effects**
Once a frame is calculated and sent to client, hang until another frame request is received.

--------------------

**Function**
Exit program execution.

**Description**
Stop the currently running Python session.

**Inputs**
Exit signal.

**Source**
Controller - AJAX POST request handler for stop request.

**Outputs**
None.

**Destination**
None.

**Action**
Force the current Python session to exit successfully.
Afterward, set a flag to set the program as stopped.

**Requirements**
A session must have been created and in the running state.

**Pre-Condition**
None.

**Post-Condition**
The session is closed on the server and the user's code is exited.
A flag is set to broadcast that the program is no longer running.

**Side Effects**
None.

## View

--------------------

**Function**
Editor - Update text box.

**Description**
Allow user interaction with the text editor segment.

**Inputs**
Key value;
Current focused object.

**Source**
Controller - Key press event handler;
Controller - Mouse event handler.

**Outputs**
None.

**Destination**
None.

**Action**
Updates the text value within the Editor text box to reflect the input provided by the user.

**Requirements**
The key value must be a valid ASCII character.
The Editor segment must be the currently focused object.

**Pre-Condition**
The page must be loaded.

**Post-Condition**
None.

**Side Effects**
None.

--------------------

**Function**
Canvas - Render graphics.

**Description**
Update WebGL session with buffer data calculated on the server.

**Inputs**
Vertex buffer;
Index buffer.

**Source**
Controller - AJAX GET request handler for execution output.

**Outputs**
Frame request signal.

**Destination**
Controller - AJAX GET request handler for frame request.

**Action**
Using the received buffers, update the WebGL session on the client's browser to display the graphics represented.
Once completed, signal the Controller to make a request to the server for the next frame.

**Requirements**
The code must be currently running and the user's code must have been sent to the server to be compiled.

**Pre-Condition**
The page must have been loaded and a connection properly made to the server.
The Controller must have sent the user's code to the server.

**Post-Condition**
None.

**Side Effects**
None.

--------------------

**Function**
Console - Update I/O.

**Description**
Update the text content of the console based on the running Python session on the server.

**Inputs**
Output text streams.

**Source**
Controller - AJAX GET request handler for I/O streams.

**Outputs**
None.

**Destination**
None.

**Action**
Receive the text values of any new lines written to the output streams.
If there are any new lines, print them into the Console's text box.

**Requirements**
The page must have been loaded and a connection properly made to the server.
The Controller must have sent the user's code to the server.

**Pre-Condition**
None.

**Post-Condition**
None.

**Side Effects**
None.

--------------------

**Function**
Panel - Submit code to server.

**Description**
Copy the text box value of the Editor segment and send the text to the server to be compiled.

**Inputs**
User source code.

**Source**
View - Editor text box.

**Outputs**
JSON stream of source code.

**Destination**
Controller - AJAX POST request handler for code submission.

**Action**
Format the value of the Editor text box as a JSON stream and submit the stream to the Controller so that it will be sent to the server.
Once this is completed,

**Requirements**
The text value must not be empty.
The program must not already be running.

**Pre-Condition**
None.

**Post-Condition**
None.

**Side Effects**
None.

--------------------

**Function**
Panel - Submit a stop request.

**Description**
Allow the user to stop their running program.

**Inputs**
None.

**Source**
None.

**Outputs**
Stop request signal.

**Destination**
Controller - AJAX POST request handler for stop request.

**Action**
Send a request to the Controller to notify the server to stop a currently executing Python session.

**Requirements**
The user program must currently be running.

**Pre-Condition**
None.

**Post-Condition**
None.

**Side Effects**
None.

## Controller

--------------------

**Function**
Key press event handler.

**Description**
Detect input provided by the user's keyboard and provide signals to appropriate modules.

**Inputs**
Key press event.

**Source**
Client web browser.

**Outputs**
Key press signal;
Key value.

**Destination**
View control loop.

**Action**
When the user interacts with their browser by pressing a key, store the value of the key in the View module's main loop and is given a signal that a key press had occurred.

**Requirements**
User keyboard input.

**Pre-Condition**
None.

**Post-Condition**
The value stored in the control loop is updated with the new key value.

**Side Effects**
This function changes the effect of the Editor's update text box method.

--------------------

**Function**
Mouse event handler.

**Description** Detect input provided by the user's mouse and record the updated mouse data.

**Inputs**
Mouse coordinates;
Mouse click signal.

**Source**
Client web browser.

**Outputs**
Focused object identifier;
Mouse click signal;
Mouse coordinates.

**Destination**
View control loop.

**Action**
When the user interacts with their browser by moving or clicking their mouse, the coordinates of the mouse cursor is stored in the View module's main control loop.
If a mouse click occurred, then if the location of the mouse is over a segment of the page that is not currently focused, then the value of the currently focused object is updated to the segment containing the cursor's coordinates.

**Requirements**
User interaction with the mouse.

**Pre-Condition**
None.

**Post-Condition**
The currently focused object is updated.
The stored value of the mouse's coordinates is updated.

**Side Effects**
This function changes the effect of the Editor's update text box method.
