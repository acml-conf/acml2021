# ACML 2021 Website
[![License](https://img.shields.io/badge/license-MIT-green)](https://opensource.org/licenses/MIT)

This is the code of the official website for the 13th Asian Conference on Machine Learning.

## Development

### Requirements

* Ruby >= 2.7
* Jekyll >= 4.2

### Using Ruby

This requires the installation of Ruby and various dependencies. We recommend the use of [rbenv](https://github.com/rbenv/rbenv) for ease of development. You may also follow the [Jekyll installation instruction](https://jekyllrb.com/docs/installation/).

1. Install Bundler: ``gem install bundler``.
2. Clone this repository and open the cloned folder.
3. Install the required gems: ``bundle install``.
4. Start the Jekyll server (with live reload): ``bundle exec jekyll serve --livereload``
5. The website should be available at <http://localhost:4000/2021/>

### Using Docker

Please follow the [Docker installation instruction](https://docs.docker.com/engine/install/) to install Docker on your machine. You may also use [Podman](https://podman.io/getting-started/installation) as an alternative to Docker. Once Docker is installed, you can clone this repository and open the cloned folder.

#### Run
To simply run the website, you can execute the following command:
```
docker run --rm --volume=$(pwd):/srv/jekyll -p 4000:4000 -it jekyll/jekyll jekyll serve --livereload
```
This will build the website and run a web server at <http://localhost:4000/2021/>.

#### Build and Run

If you don't want to keep rebuilding the website, you can build the website first, then simply run the website whenever you need.
```
docker build -t acml2021/website .
```
Where acml2021/website is the docker tag for our image. After it's completed, you can use this newly created image to run the website locally at <http://localhost:4000/2021/> using the command:
```
docker run --rm -p 4000:4000 -v $(pwd):/srv/jekyll acml2021/website
```

## Deployment

Jekyll builds the website at ``_site``. Thus, we just need to push the content to the server and we are done.

### Deployment Script

On Linux and macOS, deployment of the website can also be done automatically using ``deploy.sh`` script.

#### Setup

1. Install ``lftp``: 
	* Linux: ``sudo apt install lftp``  
	* macOS: ``brew install lftp``
2. Set the FTP details and target deployment in ``.ftp_config``. An example of the configuration is given in  ``example.ftp_config``.
3. Multiple configuration of deployments are supported by writing different ``.ftp_config-<SERVER>``. For example, you can write your staging server deployment configuration in ``.ftp_config-staging``.

#### Deploy

Execute: ``./deploy.sh``. This will build the website and synchronize the latest changes made by Jekyll to the server. Following the example of staging configuration, you can execute ``./deploy.sh staging`` to deploy to the staging server.