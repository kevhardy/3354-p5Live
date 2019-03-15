# P5Live Functional Requirements

## Client

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
Editor - Run/Stop code execution.

**Description**
Allows the user to submit the code they have written in the text editor to the server to be executed.
While their code executes, the user is given the option to terminate their program at any time.

**Inputs**
User source code.

**Source**
View - Editor text box.

**Outputs**
JSON stream of source code.

**Destination**
Controller - AJAX POST request handler for code submission and stop requests.

**Action**
Format the value of the Editor text box as a JSON stream and submit the stream to the Controller so that it will be sent to the server.
If the user wishes to terminate the program, send a stop request to the server to terminate the running Python session.

**Requirements**
The text value must not be empty when submitting code to the server.

**Pre-Condition**
None.

**Post-Condition**
The state of the program on the server side is updated to either be running if this is a code submission, or not running if this is a stop request.

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
Canvas - Render graphics.

**Description**
Update WebGL session with buffer data calculated on the server.

**Inputs**
Vertex buffer;
Index buffer.

**Source**
Controller - AJAX GET request handler for execution output.

**Outputs**
Frame request signal;
Current mouse event data;
Current key event data.

**Destination**
Controller - AJAX GET request handler for frame request.

**Action**
Using the received buffers, update the WebGL session on the client's browser to display the graphics represented.
Once completed, signal the Controller to make a request to the server for the next frame and send the server information regarding the current state of the user's interaction with the Canvas object via the current mouse coordinates, and any keys being pressed.

**Requirements**
The code must be currently running and the user's code must have been sent to the server to be compiled.

**Pre-Condition**
The page must have been loaded and a connection properly made to the server.
The Controller must have sent the user's code to the server.

**Post-Condition**
None.

**Side Effects**
None.

## Server

--------------------

**Function**
Compile and run the user's Python script.

**Description**
Compile the user's Python source code for subsequent execution.

**Inputs**
Editor text box value.

**Source**
Controller - AJAX POST request handler for code submission.

**Outputs**
New Python session.
Output and error streams of the Python interpreter.

**Destination**
Server control loop;
Client console.

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
Frame request signal;
Mouse coordinates;
Key press events.

**Source**
Controller - AJAX POST request handler for frame request.

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
