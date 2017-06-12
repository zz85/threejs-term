# Terminal Renderer for Three.js

This is an example of how you can run three.js in your terminal.
Sysadmins can now run three.js in remote ssh sessions!

### Using demo

![threejs-term](https://cloud.githubusercontent.com/assets/314997/19897356/b3dd03dc-a092-11e6-9394-9600a5522852.gif)

#### Keys

`m` - Toggle Ascii Mode (plain -> color blocks -> color + ascii -> ascii colors)

`b` - Toggle Braille Mode

`w` - Toggle Wireframe Mode

`o` / `p` - Decrease / Increase Canvas Render Resolution

`e` - Switch bettwen various geometry objects

`q`, `Ctrl-C`, `Esc` - Quits app.

`Ctrl-F12` - Developer's console

`a` - Camera Rotate Mode

`s` - Camera Scale Mode

`d` - Camera Position Mode

### Install and Running

If you prefer to run it by git cloning environment, look at the development section.

```
$ npm install -g threejs-term # install and link binary
$ threejs-term # runs the demo
```

### Troubleshooting
If npm install fails to compile Canvas bindings to Cairo, make sure your system have the [necessary libraries](https://github.com/Automattic/node-canvas).
For mac homebrew users, you can simply run `brew install cairo`.

### Features
- Shows off using three.js in node based environments.
- Terminal / ASCII based rendering
- Screen resize detection aka "Responsive Design"!
- Support mouse events
- Emulate keypress
- Toggle different ASCII rendering modes

### Internals
This is built with some awesome libraries.
- [three.js](https://github.com/mrdoob/three.js/) - Duh!
- [blessed](https://github.com/chjj/blessed) - Loads of terminal goodness!
- [node-canvas](https://github.com/Automattic/node-canvas) - Canvas emulation on node.js

### Development

Play with the [source](https://github.com/zz85/threejs-term/blob/master/play.js)

Install dependencies
```
$ git clone https://github.com/zz85/threejs-term.git
$ npm i # Replace npm with yarn if you like
$ npm start # or node play.js
```

It's tricky to debug blessed apps (since console.log's gonna messup the terminal),
so I'll pipe console.error messages to a log file and tail it elsewhere.
log() helper function can also be used.

```
$ npm run dev # or node play.js 2>> logs.txt
$ tail -f logs.txt
```

### Made by
Yet another random idea by the [Graphics Noob](https://twitter.com/BlurSpline)
