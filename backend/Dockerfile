FROM python:3.8

RUN apt-get update
RUN apt-get upgrade -y

WORKDIR /opt
ADD .  /opt
RUN pip3 install -r "requirements.txt"