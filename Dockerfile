FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Prepare for mounting the project's code as a volume
VOLUME /usr/src/app

# Expose webpack server on 8080
EXPOSE 8080

ENTRYPOINT ["top", "-b"]
CMD ["-c"]
