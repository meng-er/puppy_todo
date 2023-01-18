drop database if exists node_project;
create database node_project;
use node_project;
create table users (name varchar(32),password varchar(32));
insert into users values ('admin','123');