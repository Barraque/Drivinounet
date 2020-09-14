# Drivinounet

A tiny personnal drive in nodeJS with a little GUI.

## Installation

```shell
git clone https://github.com/Barraque/Drivinounet.git
npm install
```
Then you need to change some variable:

**yourdomain.com** by your actual domain in **frontCode.js**.

the different secret key in **.env**.

Also you need to copy the front code javascript and the basic html page in your web repository:

```shell
# cp front/* /var/www/html/ 
```
Now you can use the different "GUI" on your browser.
## Usage

```shell
node drivinounet.js
```
Then to get the token you need to get the good number thanks to the TOTP script.
```shell
python2 controller/scriptpy/totppassword.py SECRETKEYBASED32
> 92352
````

*SECRETKEYBASED32* the same as in the **.env** .

## Example of integration

For example, you can use docker to get charge of the API. Here a dockerfile that can work:

```dockerfile
# On se base sur cette image afin d'avoir non seulement nodejs qui tourne
# ainsi que python installé 
FROM nikolaik/python-nodejs:latest

# Installation de git
RUN apt update && \
    apt install git

RUN git clone https://github.com/Barraque/Drivinounet.git
RUN cd Drivinounet

# Installe toutes les dépendances
RUN npm install

# Pour un environnement de production:
# RUN npm ci --only=production

# On créer le dossier file de destination 
# afin de stocker tous les fichiers du drive
RUN mkdir -p file

# On copie les fichier nécessaires à l'execution
COPY . .

# on expose à l'exterieur le port 8081
EXPOSE 8081

# On met en place les variables d'environnement

ENV SECRETKEYTOKEN="secrettoken"
ENV SECRETKEYTOTP="SECRETKEYBASED32"
ENV PORT=8081

# On lance l'application via nodejs
CMD ["node", "Drivinounet/drivinounet.js"]
```
You create the docker image :
```bash
docker build -t Barraque/Drivinounet .
```
Then you can run the container:
```bash
docker run -p 8080:8081 -d Barraque/Drivinounet
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[UNLICENSE](https://choosealicense.com/licenses/unlicense/)
