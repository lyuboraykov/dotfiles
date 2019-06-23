# [Vagrant](https://www.vagrantup.com/) support for [Visual Studio Code](https://code.visualstudio.com/)

## Features
### Vagrant machine status

![vagrant status](https://github.com/bbenoist/vscode-vagrant/raw/master/images/status.jpg)

| Status        | Icon                            |
|---------------|---------------------------------|
| `not_created` | ![icon](https://github.com/bbenoist/vscode-vagrant/raw/master/images/not-created.jpg) |
| `running`     | ![icon](https://github.com/bbenoist/vscode-vagrant/raw/master/images/running.jpg)     |
| `saved`       | ![icon](https://github.com/bbenoist/vscode-vagrant/raw/master/images/saved.jpg)       |
| `poweroff`    | ![icon](https://github.com/bbenoist/vscode-vagrant/raw/master/images/poweroff.jpg)    |

### Vagrant machine management

![vagrant demo with a single machine](https://github.com/bbenoist/vscode-vagrant/raw/master/images/demo-single-machine.gif)

The following Vagrant commands are currently supported:

| Name      | Vagrant Command      | VS Code Command    |
|-----------|----------------------|--------------------|
| Up        | `vagrant up`         | Vagrant: Up        |
| Provision | `vagrant provision`  | Vagrant: Provision |
| Suspend   | `vagrant suspend`    | Vagrant: Suspend   |
| Halt      | `vagrant halt`       | Vagrant: Halt      |
| Reload    | `vagrant reload`     | Vagrant: Reload    |
| Destroy   | `vagrant destroy -f` | Vagrant: Destroy   |
| Status    | `vagrant status`     | Vagrant: Status    |

The extension automatically finds the `Vagrantfile` files within the workspace and will ask you on which machine to execute the desired command if they are multiple.

> **Tip** You can use the `Vagrant: Show Log` command to show the console output.

![vagrant up with multiple machines](https://github.com/bbenoist/vscode-vagrant/raw/master/images/demo-multi-machine.gif)

### Vagrantfile syntax coloring
![Syntax coloring](https://github.com/bbenoist/vscode-vagrant/raw/master/images/syntax-coloring.jpg)

## Installation
### Vagrant
No extra step is required. Simply make sure [Vagrant](https://www.vagrantup.com/) is still correctly installed and available in your `PATH` environment variable.

### Visual Studio Code
Hit `Ctrl+P` and enter the `ext install vagrant` command. **Warning:** be sure to select the extension authored from **bbenoist**.

### Installing the extension locally
Just clone the [GitHub repository](https://github.com/bbenoist/vscode-vagrant) under your local extensions folder:
* Windows: `%USERPROFILE%\.vscode\extensions`
* Mac / Linux: `$HOME/.vscode/extensions`

## Issues / Feature requests
You can submit your issues and feature requests on the GitHub [issues page](https://github.com/bbenoist/vscode-vagrant/issues).

## More information
* [vscode-vagrant on the Visual Studio Marketplace](https://marketplace.visualstudio.com/items/bbenoist.Vagrant)
* [vscode-vagrant GitHub repository](https://github.com/bbenoist/vscode-vagrant)
* [Visual Studio Code website](http://code.visualstudio.com/)
* [Vagrant website](https://www.vagrantup.com/)
