# This is a simple Dockerfile to use while developing
# It's not suitable for production
#
# It allows you to run both flask and celery if you enabled it
# for flask: docker run --env-file=.flaskenv image flask run
# for celery: docker run --env-file=.flaskenv image celery worker -A myapi.celery_app:app
#
# note that celery will require a running broker and result backend
FROM node:16.20.0

#port exposed 
EXPOSE 8080

# working directory for front end code
RUN mkdir /app
WORKDIR /app

# adding node_modules to path
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.* /app
#RUN npm install
#RUN npm install -g @angular/cli

# add app
COPY . /app

# start app
CMD ng serve --host 0.0.0.0 --port 8080