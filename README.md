# personal-site

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.1.

## Build & development

###Prerequisites

Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) to pull down this code and have the ability to send changes back up to this repo.

Install [Node.Js](https://nodejs.org/en/). Node.Js provides us with 'npm' which will manage and install dependencies our site needs. e.g. npm will install all third party code so we don't need to reinvent the wheel.

Install [Ruby](https://www.ruby-lang.org/en/). Ruby will let us install 'gems'. the gem we need is [compass](http://compass-style.org/) to compile our sass into useable css.

All of the below commands are used in the terminal or command line, these should work if node and ruby are in your command line path.

Install [compass](http://compass-style.org/) (via ruby) with this command, compass builds our css out of the sass files:
```
gem install compass
```

Run the below command to install [grunt](http://gruntjs.com/), grunt is used to take our code and build it. I tend to install grunt globally with the -g flag since a lot of projects will use grunt. 
```
npm install -g grunt
```

Run the below command to install [bower](https://bower.io/), this doesn't need to be done globally but since most projects will use bower I tend to install it globally.
```
npm install -g bower
```

###Build and Run the site

Run these two commands to install all needed dependencies
```
npm install

bower install
```

Run the below command to build our code into a workable website
```
grunt
```

Then to see your website on a local environment run
'''
grunt serve
'''

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.
