FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# COPY package.json /home/node
# RUN npm install

# Bundle app source
# COPY . /home/node

# Prepare for mounting the project's code as a volume
VOLUME /usr/src/app

EXPOSE 8080
#CMD [ "npm", "install" ]


#COPY ./bin/entrypoint.sh /usr/local/bin
#RUN chmod a+x /usr/local/bin/entrypoint.sh

#ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

ENTRYPOINT ["top", "-b"]
CMD ["-c"]


# https://medium.com/@andyccs/webpack-and-docker-for-development-and-deployment-ae0e73243db4

